export default class Model {
  async fetchContent(file) {
    return await $.get("pages/" + file + ".html");
  }
}
