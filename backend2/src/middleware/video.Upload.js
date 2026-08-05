import multer from 'multer'

import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage=  new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"courseModule",
        resource_type:"video",
        allow_formats:["mp4","mkv","avi","mov"]
    }
})

export const videoUpload = multer({
    storage:storage,
    limits:{fileSize:1024*1024*500}
})
