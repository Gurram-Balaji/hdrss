import { app } from "../config";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  collection,
  updateDoc,
  getDoc,
  arrayRemove,
  arrayUnion, 
} from "firebase/firestore";

import {
  ref,
  deleteObject,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";

const storage = getStorage(app);

const db = getFirestore(app);

export async function updateHDRSS(data, profile, background) {
  try {
    const profileref = ref(storage, "hdrss/profile");
    const backgroundref = ref(storage, "hdrss/background");
    await uploadBytes(profileref, profile);
    await uploadBytes(backgroundref, background);
    const profileurl = await getDownloadURL(profileref);
    const backgroundurl = await getDownloadURL(backgroundref);
    data.profile = profileurl;
    data.background = backgroundurl;
    await updateDoc(doc(db, "hdrss/details"), data);
  } catch (e) {
    console.log(e);
  }
}

export async function getHDRSS() {
  try {
    const snapshot = await getDoc(doc(db, "hdrss/details"));
    return snapshot.data();
  } catch (e) {
    console.log(e);
  }
}

export async function deleteGalleryPhotoHDRSS(photo) {
  try {
    const storageRef = ref(storage, photo);
    await updateDoc(doc(db, "hdrss/details"), {
      gallery: arrayRemove(photo),
    });
    await deleteObject(storageRef);
  } catch (e) {
    console.log(e);
  }
}

export async function addGalleryHDRSS(photos) {
  try {
    const urls = await uploadHDRSSImages(photos);
    urls.map(async (photo) => {
      await updateDoc(doc(db, "hdrss/details"), {
        gallery: arrayUnion(photo),
      });
    });
  } catch (e) {
    console.log(e);
  }
}

export async function uploadHDRSSImages(photos) {
  try {
    const uploadPromises = photos.map((file) => {
      const storageRef = ref(storage, `hdrssgallery/${file.name}`);
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
  } catch (e) {
    console.log(e);
  }
}
