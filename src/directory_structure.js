
var KeyMirror = require('keymirror');

var dir = {
	directories: {
		src: src,
		'public', 'public'
	},
	files: [
		{name: 'package.json', tmpl: 'package.tmpl'},
		{name: 'LICENSE', tmpl: ''},
		{name: 'README.md', tmpl: ''},
		{name: '.gitignore', tmpl: 'gitignore.tmpl'},
	]
};

var src = {
	directories: KeyMirror({
		actions,
		constants,
		dispather,
		stores,
		views
	}),
	files: ['app.js']
};