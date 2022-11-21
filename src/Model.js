import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default class Model {
  static db;
  constructor(config) {
    this.db = getFirestore(config);
  }

  async fetchContent(file) {
    return await $.get("pages/" + file + ".html");
  }
}
