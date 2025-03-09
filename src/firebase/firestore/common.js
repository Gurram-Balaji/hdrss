import { app } from "../config";

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";

const storage = getStorage(app);

export async function uploadFilesAndSaveURLs(files) {
  const uploadPromises = files.map((file) => {
    const storageRef = ref(storage, `servicegallery/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  });
  const downloadURLs = await Promise.all(uploadPromises);
  return downloadURLs;
}

export async function uploadIcons(file, id, type) {
  try {
    let storageRef;
    storageRef = ref(storage, `icons/${type}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("uploaded icon1");
    return url;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadDocIcons(file, id) {
  try {
    const storageRef = ref(storage, `docs/${id}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("uploaded icon2");
    return url;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadDocPhotos(file, id) {
  try {
    const storageRef = ref(storage, `docPhotos/${id}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("uploaded icon3");
    return url;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadBackground(type, file, id) {
  try {
    const storageRef = ref(storage, `background/${type}/${id}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log("uploaded background image");
    return url;
  } catch (e) {
    console.log(e);
  }
}
