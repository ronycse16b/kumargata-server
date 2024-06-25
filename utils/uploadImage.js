import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase.config.js';

const uploadImage = async (file) => {
  
  if (!file || !file.originalname) {
    throw new Error('Invalid file object or file name is missing.');
  }

  const name = new Date().getTime() + '_' + file.originalname;
  const storageRef = ref(storage, name);

  try {
    const snapshot = await uploadBytes(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

   

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default uploadImage;
