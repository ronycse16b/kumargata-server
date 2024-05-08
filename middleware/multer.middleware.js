import multer from "multer";

const storage = multer.memoryStorage()  // store image in memory
export const upload = multer({storage:storage})
  
