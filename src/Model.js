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
    return str.split(" ");
  }

  async fetchContent(file) {
    return await $.get("pages/" + file + ".html");
  }

  async getUserSets() {
    const user = JSON.parse(localStorage.getItem("user"));

    const q = await getDocs(
      query(collection(this.db, "sets"), where("UID", "==", user.uid))
    );

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
    });
    return html;
  }

  async createFavorites() {
    const user = JSON.parse(localStorage.getItem("user"));

    let fav = {
      UID: user.uid,
      sets: [],
    };

    return await addDoc(collection(this.db, "favorites"), fav);
  }

  async getFavoriteSets() {
    const user = JSON.parse(localStorage.getItem("user"));

    const q = await getDocs(
      query(collection(this.db, "favorites"), where("UID", "==", user.uid))
    );

    let html = `No favorites`;

    for (let result of q.docs) {
      let data = result.data();
      html = ``;
      // This is the favorites doc id
      let id = result.id;

      let sets = data.sets;
      for (let i = 0; i < sets.length; i++) {
        let query = await getDoc(doc(this.db, "sets", sets[i]));
        let set = query.data();

        html += `
					<div class="setInList">
						<h3 data-id="${sets[i]}">${set.title}</h3>
            <span data-docId="${id}" data-setId="${sets[i]}" class=" favorite heart_filled"></span>
					</div>
				`;
      }
    }

    return html;
  }

  async addFavorite(docId, setId) {
    const docRef = doc(this.db, "favorites", docId);

    const query = await getDoc(docRef);

    let data = query.data();

    data.sets.push(setId);

    return await setDoc(docRef, data);
  }

  async removeFavorite(docId, setId) {
    const user = JSON.parse(localStorage.getItem("user"));

    const docRef = doc(this.db, "favorites", docId);

    const query = await getDoc(docRef);

    let data = query.data();

    for (let i = 0; i < data.sets.length; i++) {
      if (data.sets[i] == setId) {
        data.sets.splice(i, 1);
        break;
      }
    }

    const fav = {
      UID: user.uid,
      sets: data.sets,
    };

    let r = await setDoc(docRef, fav);

    return r;
  }

  async viewSet(id) {
    let q = await getDoc(doc(this.db, "sets", id));
    let data = q.data();
    let html = ``;

    html += `<h3>${data.username}</h3>`;
    html += `<h2>${data.title}</h2>`;

    data.cards.forEach((card, idx) => {
      html += `
				<div class="card" id="card${idx}" data-show="front">
					<div id="${idx}front">${card.front}</div>
					<div id="${idx}back" style="display: none">${card.back}</div>
				</div>
			`;
    });

    return html;
  }

  async publishSet(title, cards, vis) {
    let user = JSON.parse(localStorage.getItem("user"));
    let set = {
      UID: user.uid,
      username: user.displayName,
      keywords: this.createKeywords(title),
      cards: cards,
      title: title,
      visibility: vis,
    };
    try {
      let result = await addDoc(collection(this.db, "sets"), set);
      return result;
    } catch (e) {
      return e;
    }
  }

  async updateSet(id, title, cards, vis) {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user.displayName);

    let docRef = doc(this.db, "sets", id);

    let set = {
      UID: user.uid,
      username: user.displayName,
      keywords: this.createKeywords(title),
      cards: cards,
      title: title,
      visibility: vis,
    };

    try {
      let result = await setDoc(docRef, set);
      return result;
    } catch (e) {
      return e;
    }
  }

  async deleteSet(id) {
    try {
      let result = await deleteDoc(doc(this.db, "sets", id));
      return result;
    } catch (e) {
      return e;
    }
  }

  async getSetData(id) {
    let q = await getDoc(doc(this.db, "sets", id));
    let data = q.data();
    return data;
  }

  async searchSets(terms) {
    let user = JSON.parse(localStorage.getItem("user"));

    let results = [];

    let termsArray = terms.split(" ");

    const doSearch = async (term) => {
      return await getDocs(
        query(
          collection(this.db, "sets"),
          where("keywords", "array-contains", term)
        )
      );
    };

    for (let i = 0; i < termsArray.length; i++) {
      let snap = await doSearch(termsArray[i]);
      snap.forEach((set) => {
        let data = set.data();
        if (data.UID == user.uid || data.visibility === "false") return;
        results.push({
          id: set.id,
          data: set.data(),
        });
      });
    }

    const unique = [];

    const fSets = results.filter((set) => {
      const duplicate = unique.includes(set.id);
      if (!duplicate) {
        unique.push(set.id);
        return true;
      }
      return false;
    });

    const q = await getDocs(
      query(collection(this.db, "favorites"), where("UID", "==", user.uid))
    );

    let favSets = [];
    let favId;
    q.forEach((result) => {
      let data = result.data();
      favId = result.id;
      favSets = data.sets;
    });

    let html = `<h2>Search results for '${terms}'</h2>`;

    fSets.forEach((set) => {
      let favorited = false;

      if (favSets.includes(set.id)) favorited = true;

      html += `
        <div class="setInList">
					<h3 data-id="${set.id}">${set.data.title}</h3>
      `;

      favorited
        ? (html += `<span class="favorite heart_filled" data-docId="${favId}" data-setId="${set.id}"></span>`)
        : (html += `<span class="favorite heart_plus" data-docId="${favId}" data-setId="${set.id}"></span>`);

      html += `</div>`;
    });

    if (html == `<h2>Search results for '${terms}'</h2>`) {
      html = `<h2>No Sets were found for '${terms}'</h2>`;
    }

    return html;
  }
}
