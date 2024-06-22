import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "../config";
import { uploadFilesAndSaveURLs } from "./common";
const db = getFirestore(app);
const storage = getStorage(app);

export async function getNews() {
  try {
    const news = [];
    const result = await getDocs(collection(db, "news"));
    result.forEach((doc) => {
      news.push({ id: doc.id, ...doc.data() });
    });
    return news;
  } catch (e) {
    console.log(e);
  }
}

export async function addNews(data, photos = null) {
  try {
    if (photos != null) {
      const photourl = await uploadFilesAndSaveURLs(photos);
      data.photos = photourl;
    }
    await addDoc(collection(db, "news"), data);
    console.log("news added");
  } catch (e) {
    console.log(e);
  }
}

export async function editNews(data, photos = null, id) {
  try {
    await updateDoc(doc(db, "news", id), data);
    console.log("updated news");
  } catch (e) {
    console.log(e);
  }
}

export async function deleteNews(id) {
  try {
    await deleteDoc(doc(db, "news", id));
    console.log("deleted news");
  } catch (e) {
    console.log(e);
  }
}
