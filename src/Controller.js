import Model from "./Model";

export default class Controller {
  constructor() {
    this.model = new Model();
  }

  #display(page) {
    this.model.fetchContent(page).then((result) => {
      $("#app").html(result);
    });
  }

  mySets() {
    this.#display("mySets");
  }

  favorites() {
    this.#display("favorites");
  }

  builder() {
    this.#display("builder");
  }

  search() {
    this.#display("search");
  }

  profile() {
    this.#display("profile");
  }
}
