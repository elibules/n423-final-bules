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

			$("#login p").on('click', () => {
				$("#register").css("display", "block")
				$("#login").css("display", "none")
			});

			$("#register p").on('click', () => {
				$("#register").css("display", "none")
				$("#login").css("display", "block")
			});

			$('#submitLogin').on('click', () => {
				this.Auth.login($("#lEmail").val(), $("#lPassword").val()).then(() => {
					location.reload();
				});
			});

			$('#submitRegister').on('click', () => {
				this.Auth.register($("#rEmail").val(), $("#rPassword").val()).then(() => {
					location.reload();
				})
			})
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
