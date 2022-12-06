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
					let hash = window.location.hash.replace("#", "");
					if (hash) {
						this[hash]();
					} else {
						this.mySets();
					}
				});
			});

			$('#submitRegister').on('click', () => {
				this.Auth.register($("#rEmail").val(), $("#rPassword").val()).then(() => {
					let hash = window.location.hash.replace("#", "");
					if (hash) {
						this[hash]();
					} else {
						this.mySets();
					}
				})
			})
		});
	}

	mySets() {
		this.#display("mySets").then(() => {
			this.Model.getUserSets().then((result) => {
				console.log(result)
				$('#setList').html(result);
				$('.setInList').on('click', (e) => {
					let id = e.currentTarget.getAttribute('data-id');
					window.location.hash = "#viewSet/" + id;
				})
			})
		})
	}

	favorites() {
		this.#display("favorites").then(() => {
			this.Model.getFavoriteSets().then((result) => {
				console.log(result)
				$('#setList').html(result);
				$('.setInList').on('click', (e) => {
					let id = e.currentTarget.getAttribute('data-id');
					window.location.hash = "#viewSet/" + id;
				})
			})
		})
	}

	viewSet(id) {
		this.#display("viewSet").then(() => {
			if(id == null) {
				$("#viewSetPage").html(`<h1>No Set of Cards Selected</h1>`);
				return;
			}
			this.Model.viewSet(id).then((content) => {
				$("#viewSetPage").append(content);

			})
		})
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
