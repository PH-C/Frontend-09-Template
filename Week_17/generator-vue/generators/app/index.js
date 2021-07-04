const _extend = require("lodash/extend");

var Generator = require("yeoman-generator");
_extend(Generator.prototype, require("yeoman-generator/lib/actions/install"));

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
 
  async initPackage() {
    let answers = await this.prompt([{
      type: "input",
      name: "name",
      message: "Your project name",
      default: this.appname // Default to current folder name
    },{
      type: "input",
      name: "description",
      message: "Your project description",
      default: this.appname // Default to current folder name
    }, {
      type: "input",
      name: "author",
      message: "Author name",
      default: this.appname // Default to current folder name
    }])

    const pkgJson = {
      "name": answers.name,
      "version": "1.0.0",
      "description": answers.description,
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": answers.author,
      "license": "ISC",
      devDependencies: {

      },
      dependiencied: {
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(["vue"], { 'save-dev': false});
    this.npmInstall(
      [
        "webpack",
        "vue-loader",
        "vue-style-loader",
        "css-loader",
        "vue-template-compiler",
        "copy-webpack-plugin"
      ], { 'save-dev': true });
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: "Vue" }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
  }
}