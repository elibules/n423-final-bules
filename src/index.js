import Controller from "./Controller";
import firebaseConfig from "./firebase";

const controller = new Controller(firebaseConfig);

/**
 * If there's a hash in the URL, call the controller function that matches the hash. If there's no
 * hash, call the controller function that matches the default route
 */
function route() {
  let hash = window.location.hash.replace("#", "");
	controller.init().then(() => {
  if (hash) {
    controller[hash]();
  } else {
    controller["mySets"]();
  }
	})
}

$(window).on("hashchange", () => {
  route();
});

$(document).ready(() => {
  route();
});
