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

	createKeywords(str) {
		return str.split(' ');
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

			html += `
				<div class="setInList" data-id="${id}">
					<h3 data-id="${id}">${data.title}</h3>
					<span onclick="window.location.href='#edit/${id}'">&#9998;</span>
					<span class='delete' data-id="${id}">&#128465;</span>
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

	async viewSet(id) {
		let q = await getDoc(doc(this.db, "sets", id))
		let data = q.data();
		let html = ``;

		html += `<h2>${data.title}</h2>`

		data.cards.forEach((card, idx) => {
			html += `
				<div class="card" id="card${idx}" data-show="front">
					<div id="${idx}front">${card.front}</div>
					<div id="${idx}back" style="display: none">${card.back}</div>
				</div>
			`;
		})

		return html;
	}

	async publishSet(title, cards) {
		let user = JSON.parse(localStorage.getItem('user'));
		let set = {
			UID: user.uid,
			keywords: this.createKeywords(title), 
			cards: cards,
			title: title
		}
		try {
			let result = await addDoc(collection(this.db, "sets"), set)
			return result;
		} catch(e) {
			return e;
		}
	}

	async updateSet(id, title, cards) {
		let user = JSON.parse(localStorage.getItem('user'));
		
		let docRef = doc(this.db, "sets", id);

		let set = {
			UID: user.uid, 
			keywords: this.createKeywords(title), 
			cards: cards, 
			title: title
		}

		try {
			let result = await setDoc(docRef, set);
			return result;
		} catch(e) {
			return e;
		}
	}

	async deleteSet(id) {
		try {
			let result = await deleteDoc(doc(this.db, 'sets', id))
			return result;
		} catch (e) {
			return e;
		}
	}

	async getSetData(id) {
		let q = await getDoc(doc(this.db, "sets", id))
		let data = q.data();
		return data;
	}

	async searchSets(terms) {
		let user = JSON.parse(localStorage.getItem('user'));

		let results = [];

		// terms.forEach((term) => {
		// const r = await getDocs(query(
		// 	collection(this.db, "sets"),
		// 	where('keywords', 'array-contains', term)));

		// 	for(let i = 0; i < results.length; i++) {
		// 		// do stuff
		// 	}
		// })
		
		let html = `<h2>Search results for '${terms}'</h2>`;

		results.forEach((doc) => {
			let set = doc.data();
			let id = doc.id;
			if(set.UID != user.uid) {
				html += `	
				<div class="setInList" data-id="${id}">
					<h3 data-id="${id}">${set.title}</h3>
				</div>
				`;
			}
		})

		if(html == ``) {
			html = `<h2>No Sets were found for '${terms}'</h2>`
		}

		return html;
	}
}
