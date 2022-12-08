import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  //   GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";

export default class Auth {
  static auth;
  user;
  constructor(config) {
    this.auth = getAuth(config);
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }

    console.log(this.user);
  }

  async login(email, password) {
    await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCred) => {
        this.user = userCred.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  async register(username, email, password) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCred) => {
        this.user = userCred.user;
        updateProfile(this.auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            localStorage.setItem("user", JSON.stringify(this.user));
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  async googleSignIn() {
    const gAuth = new GoogleAuthProvider();
    await signInWithPopup(this.auth, gAuth).then((result) => {
      this.user = result.user;
      localStorage.setItem("user", JSON.stringify(this.user));
    });
  }

  signOut() {
    localStorage.removeItem("user");
    location.reload();
  }
}
