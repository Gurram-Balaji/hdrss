import { app } from "../config";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  getStorage,
  getMetadata,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getServiceAndProductDocs } from "./servicesProducts";

const db = getFirestore(app);
const storage = getStorage(app);

const uploadBook = async (book, rootprevious) => {
  try {
    const bookRef = ref(storage, `${rootprevious}/${book.name}`);
    await uploadBytes(bookRef, book);
    const url = await getDownloadURL(bookRef);
    console.log("uploaded book");
    return url;
  } catch (e) {
    console.log(e);
  }
};

const uploadPhoto = async (photo, name, rootprevious) => {
  try {
    const photoRef = ref(storage, `${rootprevious}/${name}`);
    await uploadBytes(photoRef, photo);
    const photoUrl = await getDownloadURL(photoRef);
    console.log("uploaded photo");
    return photoUrl;
  } catch (e) {
    console.log(e);
  }
};

const uploadBackgroundPhoto = async (photo, name, rootprevious) => {
  try {
    const photoRef = ref(storage, `${rootprevious}/background/${name}`);
    await uploadBytes(photoRef, photo);
    const photoUrl = await getDownloadURL(photoRef);
    console.log("uploaded photo");
    return photoUrl;
  } catch (e) {
    console.log(e);
  }
};

export const editBooks = async (
  rootprevious,
  beforeprevious,
  previous,
  id,
  book = null,
  photo = null,
  data
) => {
  try {
    let docUrl = `explore/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col/${id}`;
    const oldData = await getServiceAndProductDocs(
      rootprevious,
      beforeprevious,
      previous,
      id,
      "explore"
    );
    if (book != null) {
      if (oldData.link != null) {
        const oldBookRef = ref(storage, oldData.link);
        await getMetadata(oldBookRef)
          .then(() => {
            deleteObject(oldBookRef)
              .then(() => console.log("deleted old book"))
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      }
      const url = await uploadBook(book, rootprevious);
      data.link = url;
    }
    if (photo != null) {
      if (oldData.photo != null) {
        const oldPhotoRef = ref(storage, oldData.photo);
        await getMetadata(oldPhotoRef)
          .then(() => {
            deleteObject(oldPhotoRef)
              .then(() => console.log("deleted old pic"))
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      }
      const photoUrl = await uploadBookPhoto(photo, name, rootprevious);
      data.photo = photoUrl;
    }

    await updateDoc(doc(db, docUrl), data);
  } catch (e) {
    console.log(e);
  }
};

export const editAstrology = async (
  rootprevious,
  beforeprevious,
  previous,
  id,
  data
) => {
  try {
    let docUrl = `explore/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col/${id}`;
    const oldData = await getServiceAndProductDocs(
      rootprevious,
      beforeprevious,
      previous,
      id,
      "explore"
    );

    await updateDoc(doc(db, docUrl), data);
  } catch (e) {
    console.log(e);
  }
};

export const editOtherExplore = async (
  rootprevious,
  beforeprevious,
  previous,
  id,
  photo = null,
  data
) => {
  try {
    let docUrl = `explore/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col/${id}`;
    const oldData = await getServiceAndProductDocs(
      rootprevious,
      beforeprevious,
      previous,
      id,
      "explore"
    );
    if (photo != null) {
      if (oldData.photo != null) {
        const oldPhotoRef = ref(storage, oldData.photo);
        await getMetadata(oldPhotoRef)
          .then(() => {
            deleteObject(oldPhotoRef)
              .then(() => console.log("deleted old pic"))
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      }
      const photoUrl = await uploadBookPhoto(photo, name, rootprevious);
      data.photo = photoUrl;
    }
    console.log(data);
    await updateDoc(doc(db, docUrl), data);
  } catch (e) {
    console.log(e);
  }
};

export const addExplore = async (
  rootprevious,
  beforeprevious,
  previous,
  backgroundPhoto,
  photo,
  name,
  description,
  fullDescription,
  video
) => {
  try {
    const docUrl = `explore/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    if (photo) {
      photoUrl = await uploadPhoto(photo, name, rootprevious);
    }
    
    if (backgroundPhoto) {
      backgroundPhotoUrl = await uploadBackgroundPhoto(backgroundPhoto, name, rootprevious);
    }
    await addDoc(collection(db, docUrl), 
    Object.fromEntries(Object.entries({
      name: name,
      description: description,
      fullDescription: fullDescription,
      video: video,
      photo: photoUrl,
      backgroundPhoto: backgroundPhotoUrl,
    }).filter(([_, v]) => v !== undefined))
  
  );
  } catch (e) {
    console.log(e);
  }
};
