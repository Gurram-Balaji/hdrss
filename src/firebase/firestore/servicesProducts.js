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
import { ref, deleteObject, getStorage, getMetadata } from "firebase/storage";
import {
  uploadIcons,
  uploadDocIcons,
  uploadFilesAndSaveURLs,
  uploadDocPhotos,
  uploadBackground,
} from "./common";

const db = getFirestore(app);
const storage = getStorage(app);

export async function addServiceAndProduct(
  beforeprevious = null,
  previous = null,
  id = null,
  data,
  file,
  type
) {
  let result = null;
  let e = null;
  console.log("inside firebase");
  try {
    let docUrl, docData;
    if (beforeprevious != null) {
      docUrl = `${type}/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    } else if (previous != null) {
      docUrl = `${type}/${previous}/${previous}col`;
    } else {
      docUrl = `${type}`;
    }
    const sno = Math.floor(Math.random() * 100);

    if (file != null) {
      const fileUrl = await uploadIcons(file, id, type);
      docData = { ...data, iconUrl: fileUrl, sno: sno };
    } else {
      docData = { ...data, iconUrl: "", sno: sno };
    }
    result = await addDoc(collection(db, docUrl), docData);
    console.log("added service");
  } catch (e) {
    console.log(e);
    return "failure";
  }
}

export async function addServicesAndProductsDoc(
  rootprevious,
  beforeprevious,
  previous,
  data,
  profilepic = null,
  background = null,
  photos = null,
  type,
  id
) {
  let result = null;
  let e = null;
  try {
    let docUrl;
    let pfpUrl;
    let galleryUrls;
    let backgroundUrl;
    console.log("inside");
    docUrl = `${type}/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    if (profilepic != null) {
      pfpUrl = await uploadIcons(profilepic, id);
      data.profile = pfpUrl;
    }
    if (photos != null) {
      galleryUrls = await uploadFilesAndSaveURLs(photos);
      data.photos = galleryUrls;
    }
    if (background != null) {
      backgroundUrl = await uploadBackground(type, background, id);
      data.background = backgroundUrl;
    }
    result = await addDoc(collection(db, docUrl), data);
    console.log("added service document");
    return result;
  } catch (e) {
    console.log(e);
    return "failed in adding service document";
  }
}

export async function deleteServicesAndProducts(
  rootprevious = null,
  beforeprevious = null,
  previous = null,
  id,
  iconUrl,
  type
) {
  let result = null;
  let e = null;

  try {
    let docUrl;
    if (rootprevious != null) {
      docUrl = `${type}/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    } else if (beforeprevious != null) {
      docUrl = `${type}/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    } else if (previous != null) {
      docUrl = `${type}/${previous}/${previous}col`;
    } else {
      docUrl = type;
    }
    if (iconUrl !== "") {
      const fileRef = ref(storage, iconUrl);
      deleteObject(fileRef)
        .then(() => {
          console.log("deleted successfully");
        })
        .catch((e) => {
          console.log(e);
        });
      await deleteDoc(doc(db, docUrl, id));
      return "success";
    } else {
      console.log(docUrl);
      await deleteDoc(doc(db, docUrl, id));
      return "success";
    }
  } catch (e) {
    console.log(e);
    return "failure";
  }
}

export async function deleteServicesAndProductsDoc(
  rootprevious = null,
  beforeprevious = null,
  previous = null,
  id,
  profilepic,
  photos,
  type
) {
  let result = null;
  let e = null;

  try {
    let docUrl;
    console.log(photos);
    docUrl = `${type}/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;

    if (photos != "") {
      photos.map((photo) => {
        const fileRef = ref(storage, photo);
        deleteObject(fileRef)
          .then(() => {
            console.log("photo deleted successfully");
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
    if (profilepic != "") {
      const fileRef = ref(storage, profilepic);
      deleteObject(fileRef)
        .then(() => {
          console.log("profile deleted successfully");
        })
        .catch((e) => {
          console.log(e);
        });
      await deleteDoc(doc(db, docUrl, id));

      return "success";
    } else {
      await deleteDoc(doc(db, docUrl, id));
      return "success";
    }
  } catch (e) {
    console.log(e);
    return "failure";
  }
}

export async function editServicesAndProducts(
  rootprevious = null,
  beforeprevious = null,
  previous = null,
  id,
  name,
  icon,
  iconUrl,
  type
) {
  let result = null;
  let e = null;
  try {
    let docUrl;
    let fileUrl;
    if (rootprevious != null) {
      docUrl = `${type}/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    } else if (beforeprevious != null) {
      docUrl = `${type}/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col`;
    } else if (previous != null) {
      docUrl = `${type}/${previous}/${previous}col`;
    } else {
      docUrl = type;
    }
    if (icon != null && name != null) {
      // const fileRef = ref(storage, iconUrl);
      // deleteObject(fileRef)
      //   .then(() => {
      //     console.log("deleted successfully");
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      fileUrl = await uploadIcons(icon, id);
      await updateDoc(doc(db, docUrl, id), {
        name: name,
        iconUrl: fileUrl,
      });
    } else if (icon != null) {
      if (iconUrl) {
        const fileRef = ref(storage, iconUrl);

        //   getMetadata(fileRef)
        //     .then(() => {
        //       // File exists, proceed to delete
        //       deleteObject(fileRef)
        //         .then(() => {
        //           console.log("deleted successfully");
        //         })
        //         .catch((e) => {
        //           console.log("Error deleting file:", e);
        //         });
        //     })
        //     .catch((e) => {
        //       if (e.code === "storage/object-not-found") {
        //         console.log("File does not exist");
        //       } else {
        //         console.log("Error checking file:", e);
        //       }
        //     });
      }

      fileUrl = await uploadIcons(icon, id);
      await updateDoc(doc(db, docUrl, id), {
        iconUrl: fileUrl,
      });
    } else {
      await updateDoc(doc(db, docUrl, id), {
        name: name,
      });
    }
  } catch (e) {
    console.log(e);
    return "failure";
  }
}

export async function editServiceAndProductDocs(
  rootprevious = null,
  beforeprevious = null,
  previous = null,
  id,
  data,
  newprofile,
  newbackground,
  newphotos,
  type
) {
  try {
    let fileUrl;

    // check for old profile
    if (newprofile != null) {
      const newprofileUrl = await uploadDocIcons(newprofile, id);
      data.profile = newprofileUrl;
    }

    //check for old photos
    if (newphotos != null) {
      const newphotosUrls = await Promise.all(
        newphotos.map(async (newphoto, index) => {
          const newphotosUrl = await uploadDocPhotos(newphoto, id + index);
          return newphotosUrl;
        })
      );
      
      data.photos = newphotosUrls;
    }

    if (newbackground != null) {
      const newbackgroundUrl = await uploadBackground(type, newbackground, id);
      data.background = newbackgroundUrl;
    }

    
    await updateDoc(
      doc(
        db,
        `${type}/${rootprevious}/${rootprevious}col/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col/${id}`
      ),
      Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    );
    console.log("doc updated");
  } catch (e) {
    console.log(e);
    return "failure";
  }
}

export const subscribeToServicesAndProducts = (
  callback,
  docid = null,
  beforedocid = null,
  type
) => {
  try {
    if (beforedocid != null) {
      const q = query(
        collection(
          db,
          type,
          beforedocid,
          `${beforedocid}col`,
          docid,
          `${docid}col`
        ),
        orderBy("sno")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      });
      return unsubscribe;
    } else if (docid != null) {
      const q = query(
        collection(db, type, docid, `${docid}col`),
        orderBy("sno")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      });
      return unsubscribe;
    } else {
      const q = query(
        collection(db, type),
        orderBy("sno"),
        where("__name__", "not-in", ["ads", "yt"])
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      });
      return unsubscribe;
    }
  } catch (e) {
    console.log(e);
  }
};

export const subscribeToServiceAndProductDocs = (
  callback,
  docid,
  beforedocid,
  rootdocid,
  type
) => {
  try {
    const colRef = collection(
      db,
      type,
      rootdocid,
      `${rootdocid}col`,
      beforedocid,
      `${beforedocid}col`,
      docid,
      `${docid}col`
    );

    // Apply the query to get only documents where 'disabled' is not true
    const q = query(colRef, where("disabled", "!=", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });

    return unsubscribe;
  } catch (e) {
    console.log(e);
  }
};

export const getServicesAndProductsList = async (
  rootbeforedocid = null,
  rootdocid = null,
  beforedocid = null,
  type
) => {
  try {
    let data = [];
    let snapshot;
    if (rootbeforedocid != null && rootdocid != null && beforedocid != null) {
      snapshot = await getDocs(
        collection(
          db,
          `${type}/${rootbeforedocid}/${rootbeforedocid}col/${rootdocid}/${rootdocid}col/${beforedocid}/${beforedocid}col`
        )
      );
    } else if (rootdocid != null && beforedocid != null) {
      snapshot = await getDocs(
        collection(
          db,
          `${type}/${rootdocid}/${rootdocid}col/${beforedocid}/${beforedocid}col`
        )
      );
    } else if (beforedocid != null) {
      snapshot = await getDocs(
        collection(db, `${type}/${beforedocid}/${beforedocid}col`)
      );
    } else {
      snapshot = await getDocs(collection(db, `${type}`));
    }
    snapshot.forEach((doc) => data.push(doc.id));
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getServiceAndProductDocs = async (
  rootbeforedocid = null,
  rootdocid = null,
  beforedocid = null,
  docid = null,
  type
) => {
  try {
    let q;
    let querySnapshot;
    let alldocs = [];
    if (docid != null) {
      q = doc(
        db,
        `${type}/${rootbeforedocid}/${rootbeforedocid}col/${rootdocid}/${rootdocid}col/${beforedocid}/${beforedocid}col`,
        docid
      );
    } else if (rootbeforedocid != null) {
      q = collection(
        db,
        `${type}/${rootbeforedocid}/${rootbeforedocid}col/${rootdocid}/${rootdocid}col/${beforedocid}/${beforedocid}col`
      );
    } else if (rootdocid != null && beforedocid != null) {
      q = collection(
        db,
        `${type}/${rootdocid}/${rootdocid}col/${beforedocid}/${beforedocid}col`
      );
    } else if (beforedocid != null) {
      q = collection(db, `${type}/${beforedocid}/${beforedocid}col/`);
    } else {
      q = collection(db, type);
    }
    if (docid == null) {
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        alldocs.push({ id: doc.id, data: doc.data() });
      });
      return alldocs;
    } else {
      querySnapshot = await getDoc(q);
      return querySnapshot.data();
    }
  } catch (e) {
    console.log(e);
  }
};

export async function getLocation() {
  try {
    let locations = [];
    const level1data = [];
    const level1 = await getDocs(collection(db, "services"));

    for (const doc of level1.docs) {
      const level2 = await getDocs(
        collection(db, `services/${doc.id}/${doc.id}col`)
      );
      for (const doc2 of level2.docs) {
        const level3 = await getDocs(
          collection(
            db,
            `services/${doc.id}/${doc.id}col/${doc2.id}/${doc2.id}col`
          )
        );
        for (const doc3 of level3.docs) {
          const level4 = await getDocs(
            collection(
              db,
              `services/${doc.id}/${doc.id}col/${doc2.id}/${doc2.id}col/${doc3.id}/${doc3.id}col`
            )
          );
          for (const doc4 of level4.docs) {
            locations.push(doc4.data().location);
          }
        }
      }
    }

    return locations;
  } catch (e) {
    console.error("Error fetching locations:", e);
    throw e; // Re-throw error for proper error handling in calling code
  }
}
export async function getDistrict() {
  try {
    let locations = [];
    const level1data = [];
    const level1 = await getDocs(collection(db, "services"));

    for (const doc of level1.docs) {
      const level2 = await getDocs(
        collection(db, `services/${doc.id}/${doc.id}col`)
      );
      for (const doc2 of level2.docs) {
        const level3 = await getDocs(
          collection(
            db,
            `services/${doc.id}/${doc.id}col/${doc2.id}/${doc2.id}col`
          )
        );
        for (const doc3 of level3.docs) {
          const level4 = await getDocs(
            collection(
              db,
              `services/${doc.id}/${doc.id}col/${doc2.id}/${doc2.id}col/${doc3.id}/${doc3.id}col`
            )
          );
          for (const doc4 of level4.docs) {
            locations.push(doc4.data().district);
          }
        }
      }
    }

    return locations;
  } catch (e) {
    console.error("Error fetching locations:", e);
    throw e; // Re-throw error for proper error handling in calling code
  }
}

export async function getName(
  beforeprevious = null,
  previous = null,
  id,
  type
) {
  try {
    let document;
    if (beforeprevious != null) {
      document = await getDoc(
        doc(
          db,
          `${type}/${beforeprevious}/${beforeprevious}col/${previous}/${previous}col/${id}`
        )
      );
    } else if (previous != null) {
      document = await getDoc(
        doc(db, `${type}/${previous}/${previous}col/${id}`)
      );
    } else {
      document = await getDoc(doc(db, `${type}/${id}`));
    }

    return document.data().name;
  } catch (e) {
    console.log(e);
  }
}

export async function getLevel1ServiceProducts(type) {
  try {
    const data = [];
    const snapshot = await getDocs(collection(db, type));
    snapshot.docs.map((doc) => {
      data.push({ id: doc.id, name: doc.data().name });
    });
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function getLevel2ServiceProducts(type, level1) {
  try {
    const data = [];
    const snapshot = await getDocs(
      collection(db, `${type}/${level1}/${level1}col`)
    );
    snapshot.docs.map((doc) => {
      data.push({ id: doc.id, name: doc.data().name });
    });
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function getLevel3ServiceProducts(type, level1, level2) {
  try {
    const data = [];
    const snapshot = await getDocs(
      collection(db, `${type}/${level1}/${level1}col/${level2}/${level2}col`)
    );
    snapshot.docs.map((doc) => {
      data.push({ id: doc.id, name: doc.data().name });
    });
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function getFinalLevel4ServiceProducts(type) {
  try {
    const allLevel4Docs = [];
    const level1Snapshot = await getDocs(collection(db, type));

    for (const level1Doc of level1Snapshot.docs) {
      const level2Snapshot = await getDocs(
        collection(db, `${type}/${level1Doc.id}/${level1Doc.id}col`)
      );

      for (const level2Doc of level2Snapshot.docs) {
        const level3Snapshot = await getDocs(
          collection(
            db,
            `${type}/${level1Doc.id}/${level1Doc.id}col/${level2Doc.id}/${level2Doc.id}col`
          )
        );

        for (const level3Doc of level3Snapshot.docs) {
          const level4Snapshot = await getDocs(
            collection(
              db,
              `${type}/${level1Doc.id}/${level1Doc.id}col/${level2Doc.id}/${level2Doc.id}col/${level3Doc.id}/${level3Doc.id}col`
            )
          );

          // Push only the final level 4 documents
          allLevel4Docs.push(
            ...level4Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      }
    }
    console.log(allLevel4Docs);
    return allLevel4Docs; // Returns only the final level 4 documents
  } catch (e) {
    console.error("Error fetching final level 4 service products:", e);
    throw e;
  }
}

export async function approveServiceProducts(id, type, level1, level2, level3) {
  try {
    // Construct the document URL based on the provided levels
    const docUrl = `${type}/${level1}/${level1}col/${level2}/${level2}col/${level3}/${level3}col/${id}`;

    // Update the 'disabled' property to true
    await updateDoc(doc(db, docUrl), {
      disabled: false,
    });

    console.log(`Document with ID ${id} approved successfully.`);
    return "success";
  } catch (e) {
    console.log(e);
    return "failure";
  }
}