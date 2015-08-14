

var path = require('path').join(__dirname, './app_templates/');

// better that concating every element with + or path.concat
function r(tmpl) {
	return path + tmpl;
}

var dir_structure = {
	directories: {
		'public': {
			files: [
				r('index.html.tmpl')
			]
		},
		dist: {
			files: [
				r('app.js')
			]
		},
		src: {
			files: [
				r('app.js.tmpl')
			]
		},
		bin: {},
		lib: {}
	},
	files: [
		r('package.json.tmpl'), r('LICENSE'), r('README.md'), r('.gitignore.tmpl'), r('.fluxel.json.tmpl'), r('gulpfile.js.tmpl')
	]
};


// An object that be quered to return parsed templates and directory structures
var AppTemplate = {
	/**
	 * Returns an object taht describes the directory structure
	 * for a flux application
	 */
	dir_structure: function () {
		return dir_structure;
	},
}

module.exports = AppTemplate;
