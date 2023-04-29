/*cle eslint-disable no-unused-vars */

import { initializeApp} from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDX7xT2yej2KtXBaKHiupxjlu6iPwVjwN8",
  authDomain: "mombabyandhome-2c584.firebaseapp.com",
  projectId: "mombabyandhome-2c584",
  storageBucket: "mombabyandhome-2c584.appspot.com",
  messagingSenderId: "196732907450",
  appId: "1:196732907450:web:601a39296aeeb12121f783"
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});
 // funcion persistence de firebase
export const userPersist  =  (email,password)=>{
return  setPersistence(auth, browserLocalPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  }).then((userCredentials) =>{ 
   
    return userCredentials;
  }
   )
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

}
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  //Creating the data base
  //doc
  const userDocRef = doc(db, "user", userAuth.uid);
  // getDoc will try to get the data related to the doc
  const userSnapshot = await getDoc(userDocRef);
  // userSnapshot.exists() Does it exist?
  if (!userSnapshot.exists()) {
    //Does NOT exists
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      //Set it inside our data base
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  //Does exist

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  try {
   
    return await signInWithEmailAndPassword(auth, email, password);
   
  } catch (error) {
    switch (error.code) {
      case "auth/wrong-password":
        alert("Incorrect password for email");
        break;
      case "auth/user-not-found":
        alert("no user associated with this email");
        break;
      default:
        return error.code;
    }
  }
};

export const signOutUser = async () => await signOut(auth);

//trae Productos existentes
export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "Products"));
  let data = [];
  querySnapshot.forEach((doc) => {
    const id = doc.id;
    const datos = doc.data();
    data.push({
      id,
      ...datos,
    });
  });
  return data;
};

//Agrega nuevos productos
export const postProductsAdmin = async (data) => {
  const docRef = await addDoc(collection(db, "Products"), {
    name: data.name,
    description: data.description,
    stock: data.stock,
    price: data.price,
    categories: data.categories,
    imageUrl: data.image,
    reviews: data.reviews,
    rating: data.rating,
    sale: data.sale,
  });
};
//Trae un producto por id
export const getProductByid = async (id) => {
  const Product = [];
  const docRef = doc(db, "Products", id);
  const docSnap = await getDoc(docRef);
  Product.push({
    id,
    ...docSnap.data(),
  });
  return Product;
};
//Trae un producto por nombre
export const getProductByName = async (name) => {
  const Products = await getProducts();
  let findProduct = Products.filter((prod) => {
    return prod.name.toLowerCase().includes(name.toString().toLowerCase());
  });
  return findProduct;
};

//actualiza un documento existente encontrado por id, pasando por parametros los datos
export const updateProduct = async (data) => {
  const ProfuctsRef = doc(db, "Products", data.id);
  await updateDoc(ProfuctsRef, {
    name: data.name,
    description: data.description,
    stock: data.stock,
    price: data.price,
    categories: data.categories,
    imageUrl: data.image,
    reviews: data.reviews,
    rating: data.rating,
    sale: data.sale,
  });
};
//elimina un producto encontrado por id, pasando por parametros los datos
export const deleteProductsAdmin = async (id) => {
  await deleteDoc(doc(db, "Products", id));
};
//----------------------------------------------------------------------
//funcionalidades para traer usuarios
export const getUserAdmin = async () => {
  const querySnapshot = await getDocs(collection(db, "user"));
  let users = [];
  querySnapshot.forEach((doc) => {
    const id = doc.id;
    const datos = doc.data();
    users.push({
      id,
      ...datos,
    });
  });
  return users;
};
//Trae un usuario por nombre
export const getUserByName = async (name) => {
  const users = await getUserAdmin();
  let findUser = users.filter((user) => {
    return user.name.toLowerCase().includes(name.toString().toLowerCase());
  });
  return findUser;
};
//Trae un usuario por id
export const getUserByid = async (id) => {
  const docRef = doc(db, "user", id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};
//----------------------------------------------------------------------
//trae todos los pedidos a dashboard del admin
export const getOrdersAdmin = async () => {
  const querySnapshot = await getDocs(collection(db, "Orders"));
  let orders = [];
  querySnapshot.forEach((doc) => {
    const id = doc.id;
    const datos = doc.data();
    orders.push({
      id,
      ...datos,
    });
  });
  console.log(orders);
  return orders;
};

//---- trae pedidos por id
export const getOrderByid = async (id) => {
  const orders = [];
  const docRef = doc(db, "Orders", id);
  const docSnap = await getDoc(docRef);
  orders.push({
    id,
    ...docSnap.data(),
  });
  return orders;
};

// actualiza status de pedidos
export const updateOrder = async (data) => {
  const ProfuctsRef = doc(db, "Order", data.id);
  await updateDoc(ProfuctsRef, {
    orderId: data.id,
    status: data.status,
    products: data.products,
    total: data.total,
    orderDate: data.orederDate,
    orderShippedDate: data.orderShippedDate,
    userName: data.userName,
    userEmail: data.userEmail,
    userAddress: data.userAddress,
    orderTracking: data.orderTracking,
  });
};

/// //funcionalidades para traer categorias
export const getCategories = async () => {
  const categories = [];
  const querySnapshot = await getDocs(collection(db, "categories"));

  querySnapshot.forEach((cat) => {
    const id = cat.id;
    const data = cat.data();
    categories.push({
      id,
      ...data,
    });
  });
  return categories;
};
// agrega nueva categoria
export const postcategoriesAdmin = async (data) => {
  const docRef = await setDoc(doc(db, "categories", data.category), {
    subCategory: data.subCategory,
  });
};
