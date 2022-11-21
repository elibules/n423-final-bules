import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  //   GoogleAuthProvider,
  signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword
} from "firebase/auth";

export default class Auth {
	static auth;
	user;
  constructor(config) {
    this.auth = getAuth(config);
		if (localStorage.getItem('user')) {
			this.user = JSON.parse(localStorage.getItem('user'));
		}

		console.log(this.user)
  }

	async login(email, password) {
		await signInWithEmailAndPassword(this.auth, email, password).then((userCred) => {
			this.user = userCred.user;
			localStorage.setItem('user', JSON.stringify(this.user))
		}).catch((error) => {
			alert(error.message)
		})
	}

	async register(email, password) {
		await createUserWithEmailAndPassword(this.auth, email, password).then((userCred) => {
			this.user = userCred.user;
			localStorage.setItem('user', JSON.stringify(this.user))
		}).catch((error) => {
			alert(error.message)
		})
	}

	signOut() {
		localStorage.removeItem('user');
		location.reload();
	}
}
