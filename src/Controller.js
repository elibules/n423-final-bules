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

  #favActions() {
    $(".favorite").on("click", (e) => {
      let docId = e.currentTarget.getAttribute("data-docId");
      let setId = e.currentTarget.getAttribute("data-setId");

      if (e.currentTarget.classList.contains("heart_plus")) {
        e.currentTarget.classList.remove("heart_plus");
        this.Model.addFavorite(docId, setId);
        e.currentTarget.classList.add("heart_filled");
      } else {
        e.currentTarget.classList.remove("heart_filled");
        this.Model.removeFavorite(docId, setId);
        e.currentTarget.classList.add("heart_plus");
      }
    });
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
        if (!$("#lEmail").val() || !$("#lPassword").val()) {
          throw this.#alarm("All fields must be filled out");
        }
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
        if (
          !$("#rUsername").val() ||
          !$("#rEmail").val() ||
          !$("#rPassword").val()
        ) {
          throw this.#alarm("All fields must be filled out");
        }
        this.Auth.register(
          $("#rUsername").val(),
          $("#rEmail").val(),
          $("#rPassword").val()
        ).then(() => {
          this.Model.createFavorites().then(() => {
            location.reload();
          });
          // let hash = window.location.hash.replace("#", "");
          // if (hash) {
          //   this[hash]();
          // } else {
          //   this.mySets();
          // }
        });
      });

      $("#signInWithGoogle").on("click", () => {
        this.Auth.googleSignIn().then(() => {
          this.Model.getFavoriteSets().then((result) => {
            console.log(result);
            if (result === `No favorites`) {
              this.Model.createFavorites().then(() => {
                location.reload();
              });
            } else {
              location.reload();
            }
          });
        });
      });
    });
  }

  mySets() {
    this.#display("mySets").then(() => {
      this.Model.getUserSets(this.Auth.user.uid).then((result) => {
        $("#setList").html(result);
        if (result === "") {
          $("#setList").html(
            `<h3>You have no sets, click on 'Create New Set' to get started!</h3>`
          );
        }

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

        $(".setInList h3").on("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          window.location.hash = "#viewSet/" + id;
        });

        $(".favorite").on("click", (e) => {
          if (
            !confirm(
              "Are you sure you want to remove this set from your favorites?"
            )
          ) {
            return;
          }

          let docId = e.currentTarget.getAttribute("data-docId");
          let setId = e.currentTarget.getAttribute("data-setId");
          this.Model.removeFavorite(docId, setId).then((result) => {
            $(e.currentTarget).parent().remove();
          });
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
        if ($("#setUser").attr("data-uid")) {
          this.#favActions();

          $("#setUser").on("click", (e) => {
            let uid = e.currentTarget.getAttribute("data-uid");
            let uname = e.currentTarget.getAttribute("data-uname");

            window.location.href = "#user/" + uid + "?" + uname;
          });
        }
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
						<span onclick="removeCard(${cardCount})">&#10060;</span>
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

        $("#title").val(set.title);

        set.visibility === "true"
          ? $("#vis option[value='true']").attr("selected", true)
          : $("#vis option[value='false']").attr("selected", true);

        set.cards.forEach((card, idx) => {
          $("#edit-cards").append(`							
						<div class="build-card" id="${idx}card">
							<span onclick="removeCard(${idx})">&#10060;</span>
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
					<div class="build-card" id="${cardCount}card">
						<span onclick="removeCard(${cardCount})">&#10060;</span>
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
          document.getElementsByClassName("build-card")
        );

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
      $("#search").on("submit", (e) => {
        e.preventDefault();
        let terms = $("#searchBox").val();
        $("#searchBox").val("");
        $("#searchResults").html(``);

        this.Model.searchSets(terms).then((html) => {
          $("#searchResults").html(html);

          $(".setInList h3").on("click", (e) => {
            let id = e.currentTarget.getAttribute("data-id");
            window.location.hash = "#viewSet/" + id;
          });

          this.#favActions();
        });
      });
    });
  }

  profile() {
    this.#display("profile").then(() => {
      $("#profileUsername").html(
        "Your profile, <br>" + this.Auth.user.displayName
      );
      $("#profileEmail").append(this.Auth.user.email);
      $("#signOut").on("click", () => {
        this.Auth.signOut();
      });
    });
  }

  user(get) {
    let getVars = get.split("?");
    let uname = getVars[1].replace("%20", " ");
    let uid = getVars[0];

    this.#display("user").then(() => {
      $("#uname").html(uname + "'s Study Sets");

      this.Model.getUserSets(uid).then((html) => {
        $("#userSets").html(html);
        $(".setInList h3").on("click", (e) => {
          let id = e.currentTarget.getAttribute("data-id");
          window.location.hash = "#viewSet/" + id;
        });
        this.#favActions();
      });
    });
  }
}
