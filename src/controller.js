import Model from "./model";

export default class Controller {
  constructor() {
    this.model = new Model();
  }

  display(page) {
    this.model.fetchContent(page).then((result) => {
      $("#app").html(result);
      this[page]();
    });
  }

  mySets() {
    console.log("mySets");
  }

  favorites() {
    console.log("favorites");
  }

  builder() {
    console.log("builder");
  }

  search() {
    console.log("search");
  }

  profile() {
    console.log("profile");
  }
}
