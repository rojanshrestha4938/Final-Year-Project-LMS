import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

// ═══════════════════════════════════════════════════════════════════════════════
// COSINE SIMILARITY-BASED COURSE RECOMMENDATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
//
// How cosine similarity works in this system:
//
// 1. Each course is represented as a binary feature vector.
//    Features are extracted from: tags, category, difficulty, keywords,
//    and tokenized words from the title and description.
//
// 2. A global vocabulary is built from ALL courses, where each unique
//    feature term gets a dimension in the vector space.
//
// 3. For each course, a vector is created where:
//    - 1 = the course contains that feature
//    - 0 = the course does not contain that feature
//
// 4. Cosine similarity measures the angle between two course vectors:
//
//        cos(θ) = (A · B) / (||A|| × ||B||)
//
//    Where A · B is the dot product, and ||A||, ||B|| are vector magnitudes.
//    Result ranges from 0 (completely different) to 1 (identical features).
//
// 5. For a logged-in user, we compute similarity between their enrolled
//    courses and all other courses, then rank by highest similarity.
// ═══════════════════════════════════════════════════════════════════════════════


// ─── In-Memory Similarity Cache ─────────────────────────────────────────────
// Stores precomputed similarity matrix to avoid redundant calculations.
// Cache is invalidated after TTL or when courses are added/modified.
const similarityCache = {
    matrix: null,           // { courseIdA: { courseIdB: score, ... }, ... }
    courseIds: null,         // Array of course IDs used when cache was built
    timestamp: null,        // When the cache was last built
    TTL: 10 * 60 * 1000     // Cache lives for 10 minutes
};

/**
 * Checks if the similarity cache is still valid.
 */
function isCacheValid() {
    if (!similarityCache.matrix || !similarityCache.timestamp) return false;
    return (Date.now() - similarityCache.timestamp) < similarityCache.TTL;
}

/**
 * Invalidates the similarity cache.
 * Call this when a new course is created or updated.
 */
export function invalidateSimilarityCache() {
    similarityCache.matrix = null;
    similarityCache.courseIds = null;
    similarityCache.timestamp = null;
}


// ─── Text Processing Utilities ──────────────────────────────────────────────

// Common stop words to exclude from feature extraction
const STOP_WORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "because", "but", "and", "or", "if", "this", "that", "these", "those",
    "it", "its", "i", "me", "my", "we", "our", "you", "your", "he", "him",
    "his", "she", "her", "they", "them", "their", "what", "which", "who",
    "whom", "about", "up", "also", "course", "learn", "learning", "using",
    "use", "get", "make", "know", "understand"
]);

/**
 * Tokenizes and cleans a text string into meaningful feature terms.
 * @param {string} text - Raw text to process
 * @returns {string[]} Array of cleaned, lowercase tokens
 */
function tokenize(text) {
    if (!text || typeof text !== "string") return [];
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")   // Remove special characters
        .split(/\s+/)                     // Split on whitespace
        .filter(word => word.length > 2 && !STOP_WORDS.has(word)); // Filter noise
}


// ─── Feature Extraction ─────────────────────────────────────────────────────

/**
 * Extracts all feature terms from a single course.
 * Combines tags, category, difficulty, keywords, title words, and description words.
 *
 * @param {Object} course - Mongoose course document
 * @returns {Set<string>} Set of unique feature terms for this course
 */
function extractCourseFeatures(course) {
    const features = new Set();

    // Add tags (with "tag:" prefix for namespace separation)
    if (Array.isArray(course.tags)) {
        course.tags.forEach(tag => {
            if (tag) features.add(`tag:${tag.toLowerCase().trim()}`);
        });
    }

    // Add category
    if (course.category) {
        features.add(`cat:${course.category.toLowerCase().trim()}`);
        // Also add individual words from multi-word categories
        tokenize(course.category).forEach(word => features.add(`cat:${word}`));
    }

    // Add difficulty level
    if (course.difficulty) {
        features.add(`diff:${course.difficulty.toLowerCase().trim()}`);
    }

    // Add keywords
    if (Array.isArray(course.keywords)) {
        course.keywords.forEach(kw => {
            if (kw) features.add(`kw:${kw.toLowerCase().trim()}`);
        });
    }

    // Add tokenized title words (weighted: added twice to increase importance)
    tokenize(course.title).forEach(word => {
        features.add(`title:${word}`);
    });

    // Add tokenized description words
    tokenize(course.description).forEach(word => {
        features.add(`desc:${word}`);
    });

    return features;
}


// ─── Vectorization ──────────────────────────────────────────────────────────

/**
 * Builds a global vocabulary from all courses' features and creates
 * binary vectors for each course.
 *
 * @param {Object[]} courses - Array of course documents
 * @returns {{ vocabulary: string[], vectors: Map<string, number[]> }}
 */
function buildCourseVectors(courses) {
    // Step 1: Extract features for each course
    const courseFeaturesMap = new Map();
    const globalVocabulary = new Set();

    courses.forEach(course => {
        const features = extractCourseFeatures(course);
        courseFeaturesMap.set(course._id.toString(), features);
        features.forEach(f => globalVocabulary.add(f));
    });

    // Step 2: Convert global vocabulary to an ordered array (defines vector dimensions)
    const vocabArray = Array.from(globalVocabulary);

    // Step 3: Create binary vector for each course
    const vectors = new Map();

    courses.forEach(course => {
        const courseId = course._id.toString();
        const features = courseFeaturesMap.get(courseId);

        // Apply weighted encoding:
        // - title features get weight 2 (more important)
        // - tag/category/keyword features get weight 1.5
        // - difficulty/description features get weight 1
        const vector = vocabArray.map(term => {
            if (!features.has(term)) return 0;
            if (term.startsWith("title:")) return 2;
            if (term.startsWith("tag:") || term.startsWith("cat:") || term.startsWith("kw:")) return 1.5;
            return 1;
        });

        vectors.set(courseId, vector);
    });

    return { vocabulary: vocabArray, vectors };
}


// ─── Cosine Similarity Computation ──────────────────────────────────────────

/**
 * Computes cosine similarity between two vectors.
 *
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 *
 * @param {number[]} vecA - First feature vector
 * @param {number[]} vecB - Second feature vector
 * @returns {number} Similarity score between 0 and 1
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    // Prevent division by zero (e.g., course with no features)
    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Builds a full pairwise similarity matrix for all courses.
 *
 * @param {Map<string, number[]>} vectors - Course ID → feature vector
 * @returns {Object} Nested object: { courseIdA: { courseIdB: score } }
 */
function buildSimilarityMatrix(vectors) {
    const courseIds = Array.from(vectors.keys());
    const matrix = {};

    for (let i = 0; i < courseIds.length; i++) {
        matrix[courseIds[i]] = {};
        for (let j = 0; j < courseIds.length; j++) {
            if (i === j) {
                matrix[courseIds[i]][courseIds[j]] = 1; // Self-similarity
            } else if (j < i) {
                // Reuse already computed value (similarity is symmetric)
                matrix[courseIds[i]][courseIds[j]] = matrix[courseIds[j]][courseIds[i]];
            } else {
                matrix[courseIds[i]][courseIds[j]] = cosineSimilarity(
                    vectors.get(courseIds[i]),
                    vectors.get(courseIds[j])
                );
            }
        }
    }

    return matrix;
}


// ─── Recommendation Logic ───────────────────────────────────────────────────

/**
 * Gets or builds the similarity matrix, using cache when available.
 *
 * @param {Object[]} allCourses - All course documents from DB
 * @returns {Object} The similarity matrix
 */
function getOrBuildSimilarityMatrix(allCourses) {
    // Check if cache is valid
    if (isCacheValid()) {
        // Verify same number of courses (rough check for changes)
        if (similarityCache.courseIds.length === allCourses.length) {
            return similarityCache.matrix;
        }
    }

    // Build fresh vectors and similarity matrix
    const { vectors } = buildCourseVectors(allCourses);
    const matrix = buildSimilarityMatrix(vectors);

    // Update cache
    similarityCache.matrix = matrix;
    similarityCache.courseIds = allCourses.map(c => c._id.toString());
    similarityCache.timestamp = Date.now();

    return matrix;
}


// ─── API Controllers ────────────────────────────────────────────────────────

/**
 * GET /api/recommendation/recommendations
 *
 * Returns top 5 recommended courses for the logged-in user.
 * - Fetches user's enrolled courses
 * - Computes similarity between enrolled courses and all other courses
 * - Ranks and returns the most similar non-enrolled courses
 * - Falls back to popular/recent courses if user has no enrollments
 */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;

        // Fetch all courses from DB
        const allCourses = await Course.find().lean();

        if (!allCourses || allCourses.length === 0) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                strategy: "no_courses",
                message: "No courses available in the system"
            });
        }

        // Get user's purchased/enrolled courses
        const user = await User.findById(userId).lean();
        const enrolledCourseIds = new Set(
            (user?.purchasedCourse || []).map(id => id.toString())
        );

        // ─── Edge Case: New user with no enrollments ─────────────────────
        if (enrolledCourseIds.size === 0) {
            // Fallback: Recommend the most recent courses (trending)
            const fallbackCourses = allCourses
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, limit)
                .map(course => ({
                    ...course,
                    similarityScore: 0,
                    reason: "Trending — Popular with other learners"
                }));

            return res.status(200).json({
                success: true,
                recommendations: fallbackCourses,
                strategy: "fallback_trending",
                message: "Since you're new, here are our trending courses!"
            });
        }

        // ─── Build/Retrieve Similarity Matrix ────────────────────────────
        const similarityMatrix = getOrBuildSimilarityMatrix(allCourses);

        // ─── Score all non-enrolled courses ──────────────────────────────
        // For each candidate course, take the MAX similarity across all
        // enrolled courses (i.e., "most similar to any course you took")
        const candidateScores = [];

        allCourses.forEach(course => {
            const courseId = course._id.toString();

            // Skip courses already enrolled
            if (enrolledCourseIds.has(courseId)) return;

            let maxSimilarity = 0;
            let mostSimilarEnrolledId = null;

            enrolledCourseIds.forEach(enrolledId => {
                const score = similarityMatrix[enrolledId]?.[courseId] || 0;
                if (score > maxSimilarity) {
                    maxSimilarity = score;
                    mostSimilarEnrolledId = enrolledId;
                }
            });

            candidateScores.push({
                ...course,
                similarityScore: parseFloat(maxSimilarity.toFixed(4)),
                mostSimilarTo: mostSimilarEnrolledId
            });
        });

        // Sort by similarity (descending) and take top N
        candidateScores.sort((a, b) => b.similarityScore - a.similarityScore);
        let recommendations = candidateScores.slice(0, limit);

        // ─── If not enough similar courses, fill with trending ───────────
        if (recommendations.length < limit) {
            const recommendedIds = new Set(recommendations.map(r => r._id.toString()));
            const filler = allCourses
                .filter(c =>
                    !enrolledCourseIds.has(c._id.toString()) &&
                    !recommendedIds.has(c._id.toString())
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, limit - recommendations.length)
                .map(course => ({
                    ...course,
                    similarityScore: 0,
                    reason: "Trending — Popular with other learners"
                }));

            recommendations = [...recommendations, ...filler];
        }

        // Add human-readable reason for similarity-based recommendations
        recommendations = recommendations.map(rec => {
            if (!rec.reason && rec.mostSimilarTo) {
                const similarCourse = allCourses.find(
                    c => c._id.toString() === rec.mostSimilarTo
                );
                rec.reason = similarCourse
                    ? `Similar to "${similarCourse.title}"`
                    : "Based on your enrolled courses";
            }
            return rec;
        });

        return res.status(200).json({
            success: true,
            recommendations,
            strategy: "cosine_similarity",
            enrolledCount: enrolledCourseIds.size,
            message: "Courses recommended based on your learning history"
        });

    } catch (error) {
        console.error("Error in getRecommendations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate recommendations",
            error: error.message
        });
    }
};


/**
 * GET /api/recommendation/similar/:courseId
 *
 * Returns courses similar to a specific course.
 * Useful on the single course page to show "You might also like..."
 */
export const getSimilarCourses = async (req, res) => {
    try {
        const { courseId } = req.params;
        const limit = parseInt(req.query.limit) || 5;

        const allCourses = await Course.find().lean();
        const targetCourse = allCourses.find(c => c._id.toString() === courseId);

        if (!targetCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Get user's purchased/enrolled courses to exclude them
        let enrolledCourseIds = new Set();
        if (req.user) {
            const userId = req.user._id;
            const user = await User.findById(userId).lean();
            enrolledCourseIds = new Set(
                (user?.purchasedCourse || []).map(id => id.toString())
            );
        }

        // Build/retrieve similarity matrix
        const similarityMatrix = getOrBuildSimilarityMatrix(allCourses);

        // Get similarities for the target course
        const similarities = similarityMatrix[courseId] || {};

        // Rank and return top similar courses (excluding itself and already purchased courses)
        const similarCourses = allCourses
            .filter(c => c._id.toString() !== courseId && !enrolledCourseIds.has(c._id.toString()))
            .map(course => ({
                ...course,
                similarityScore: parseFloat(
                    (similarities[course._id.toString()] || 0).toFixed(4)
                )
            }))
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);

        return res.status(200).json({
            success: true,
            similarCourses,
            baseCourse: targetCourse.title
        });

    } catch (error) {
        console.error("Error in getSimilarCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to find similar courses",
            error: error.message
        });
    }
};
