import Model from "./Model";
import Auth from "./Auth";

export default class Controller {
  static config;

  constructor(firebaseConfig) {
    this.config = firebaseConfig;
    this.Model = new Model(this.config);
    this.Auth = new Auth(this.config);
  }

  async init() {
    await this.Auth.user;
  }

  #alarm(message) {
    alert(message);
  }

  async #display(page) {
    if (this.Auth.user == null && page != "login") {
      this.#login();
      return;
    }
    await this.Model.fetchContent(page).then((result) => {
      $("#app").html(`<section id="${page}Page">` + result + `</section>`);
    });
  }

  #login() {
    this.#display("login").then(() => {
      $("#login p").on("click", () => {
        $("#register").css("display", "block");
        $("#login").css("display", "none");
      });

      $("#register p").on("click", () => {
        $("#register").css("display", "none");
        $("#login").css("display", "block");
      });

      $("#submitLogin").on("click", () => {
        this.Auth.login($("#lEmail").val(), $("#lPassword").val()).then(() => {
          let hash = window.location.hash.replace("#", "");
          if (hash) {
            this[hash]();
          } else {
            this.mySets();
          }
        });
      });

      $("#submitRegister").on("click", () => {
        this.Auth.register($("#rEmail").val(), $("#rPassword").val()).then(
          () => {
            let hash = window.location.hash.replace("#", "");
            if (hash) {
              this[hash]();
            } else {
              this.mySets();
            }
          }
        );
      });
    });
  }

  mySets() {
    this.#display("mySets").then(() => {
      this.Model.getUserSets().then((result) => {
        console.log(result);
        $("#setList").html(result);

        $(".setInList h3").on("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          window.location.hash = "#viewSet/" + id;
        });

        $(".delete").on("click", (e) => {
          if (!confirm("Are you sure you want to delete this set?")) return;

          let id = e.currentTarget.getAttribute("data-id");
          this.Model.deleteSet(id).then((result) => {
            window.location.reload();
          });
        });
      });
    });
  }

  favorites() {
    this.#display("favorites").then(() => {
      this.Model.getFavoriteSets().then((result) => {
        $("#setList").html(result);
        $(".setInList").on("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          window.location.hash = "#viewSet/" + id;
        });
      });
    });
  }

  viewSet(id) {
    this.#display("viewSet").then(() => {
      if (id == null) {
        $("#viewSetPage").html(`<h1>No Set of Cards Selected</h1>`);
        return;
      }
      this.Model.viewSet(id).then((content) => {
        $("#viewSetPage").append(content);
        $(".card").on("click", (e) => {
          let card = e.currentTarget;
          let idx = card.id.match(/\d/g).join("");
          let shown = card.getAttribute("data-show");

          $("#" + idx + shown).hide();
          if (shown == "front") {
            $("#" + idx + "back").show();
            card.setAttribute("data-show", "back");
          } else {
            $("#" + idx + "front").show();
            card.setAttribute("data-show", "front");
          }
        });
      });
    });
  }

  builder() {
    this.#display("builder").then(() => {
      let cardCount = 0;

      $("#add-card").on("click", () => {
        cardCount++;

        $("#build-cards").append(`
					<div class="build-card" id="${cardCount}card">
						<hr>
						<span onclick="removeCard(${cardCount})">X</span>
						<label>Front</label>
						<input required id="${cardCount}front" class="front" type="text">
						<label>Back</label>
						<input required id="${cardCount}back" class="back" type="text">
					</div>
				`);
      });

      $("#submit-set").on("click", (e) => {
        let title = $("#title").val();
        let vis = $("#vis").val();

        if (!title) {
          throw this.#alarm("Title must be filled out!");
        }

        let cardElements = Array.from(
          document.getElementsByClassName("build-card")
        );
        console.log(cardElements);

        let cards = [];

        cardElements.forEach((card) => {
          let idx = card.id.match(/\d/g).join("");
          let front = $("#" + idx + "front").val();
          let back = $("#" + idx + "back").val();

          if (!front || !back) {
            throw this.#alarm("All cards must be completely filled out!");
          }

          cards.push({
            front: front,
            back: back,
          });
        });

        this.Model.publishSet(title, cards, vis).then((result) => {
          if (result) {
            window.location.href = "#mySets";
          }
        });
      });
    });
  }

  edit(id) {
    this.#display("edit").then(() => {
      let cardCount = 0;
      this.Model.getSetData(id).then((set) => {
        cardCount = set.cards.length;
        console.log(cardCount, set);

        $("#title").val(set.title);

        set.visibility === "true"
          ? $("#vis option[value='true']").attr("selected", true)
          : $("#vis option[value='false']").attr("selected", true);

        set.cards.forEach((card, idx) => {
          $("#edit-cards").append(`							
						<div class="edit-card" id="${idx}card">
							<hr>
							<span onclick="removeCard(${idx})">X</span>
							<label>Front</label>
							<input required id="${idx}front" class="front" type="text" value='${card.front}'>
							<label>Back</label>
							<input required id="${idx}back" class="back" type="text" value='${card.back}'>
						</div>
					`);
        });
      });

      $("#add-card").on("click", () => {
        $("#edit-cards").append(`
					<div class="edit-card" id="${cardCount}card">
						<hr>
						<span onclick="removeCard(${cardCount})">X</span>
						<label>Front</label>
						<input required id="${cardCount}front" class="front" type="text">
						<label>Back</label>
						<input required id="${cardCount}back" class="back" type="text">
					</div>
				`);
        cardCount++;
      });

      $("#submit-set").on("click", (e) => {
        let title = $("#title").val();
        let vis = $("#vis").val();

        if (!title) {
          throw this.#alarm("Title must be filled out!");
        }

        let cardElements = Array.from(
          document.getElementsByClassName("edit-card")
        );
        console.log(cardElements);

        let cards = [];

        cardElements.forEach((card) => {
          let idx = card.id.match(/\d/g).join("");
          let front = $("#" + idx + "front").val();
          let back = $("#" + idx + "back").val();

          if (!front || !back) {
            throw this.#alarm("All cards must be completely filled out!");
          }

          cards.push({
            front: front,
            back: back,
          });
        });

        this.Model.updateSet(id, title, cards, vis).then((result) => {
          window.location.href = `#viewSet/${id}`;
        });
      });
    });
  }

  search() {
    this.#display("search").then(() => {
      $("#searchBtn").on("click", () => {
        let terms = $("#searchBox").val();
        $("#searchBox").val("");
        $("#searchResults").html(``);

        this.Model.searchSets(terms).then((html) => {
          $("#searchResults").html(html);

          $(".setInList h3").on("click", (e) => {
            let id = e.currentTarget.getAttribute("data-id");
            window.location.hash = "#viewSet/" + id;
          });
        });
      });
    });
  }

  profile() {
    this.#display("profile");
  }
}
