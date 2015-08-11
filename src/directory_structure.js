
var KeyMirror = require('keymirror');

var src = {
	directories: KeyMirror({
		actions: null,
		constants: null,
		dispather: null,
		stores: null,
		views: null
	}),
	files: [
		{name: 'app.js', tmpl: 'templates/app.tmpl'}
	]
};


src.directories.dispather = {
	directories: {},
	files: [
		{name: 'AppDispatcher.js', tmpl: 'templates/dispatcher.tmpl'}
	]
};

var dir = {
	directories: {
		src: src,
		'public': 'public'
	},
	files: [
		{name: 'package.json', tmpl: 'templates/package.tmpl'},
		{name: 'LICENSE'},
		{name: 'README.md'},
		{name: '.gitignore', tmpl: 'templates/gitignore.tmpl'}
	]
};

console.log(JSON.stringify(dir, null, 4));
module.exports = dir;