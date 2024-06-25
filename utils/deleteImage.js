// utils/deleteImage.js
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase.config.js';


const deleteImage = async (imageUrl) => {
  const storageRef = ref(storage, imageUrl);
  await deleteObject(storageRef);
};

export default deleteImage;
