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

	async getUserSets() {
		const user = JSON.parse(localStorage.getItem('user'))

		const q = await getDocs(query(collection(this.db, "sets"),
		where("UID", "==", user.uid)));
		
		// return q;
		let html = ``;

		q.forEach((result) => {
			let id = result.id;
			let data = result.data();

			console.log(id, data.title)

			html += `
				<div class="setInList" data-id="${id}">
					<h3>${data.title}</h3>
				</div>
			`;
		})
		return html;
	}

	async getFavoriteSets() {
		const user = JSON.parse(localStorage.getItem('user'))

		const q = await getDocs(query(collection(this.db, "favorites"),
		where("UID", "==", user.uid)));
		
		// return q;
		let html = ``;

		q.forEach((result) => {
			let data = result.data();

			let sets = data.sets;

			sets.forEach((set) => {
				html += `
					<div class="setInList" data-id="${set.id}">
						<h3>${set.title}</h3>
					</div>
				`;
			})
		})

		return html;
	}
}
