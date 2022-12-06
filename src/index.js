import Controller from "./Controller";
import firebaseConfig from "./firebase";

const controller = new Controller(firebaseConfig);

/**
 * If there's a hash in the URL, call the controller function that matches the hash. If there's no
 * hash, call the controller function that matches the default route
 */
function route() {
  let hash = window.location.hash.replace("#", "").split("/");
	controller.init().then(() => {
  if (hash[0] && hash[1]) {
    controller[hash[0]](hash[1]);
	} else if(hash[0]) {
		controller[hash[0]]();
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
