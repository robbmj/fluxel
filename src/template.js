
var KeyMirror = require('keymirror');
var fs = require('fs');
var __path = require('path');

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

src.directories.constants = {
	directories: {},
	files: [
		{name: 'ActionsConstants.js', tmpl: 'templates/action_constatnts.tmpl'}
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
		{name: '.gitignore', tmpl: 'templates/gitignore.tmpl'},
		{name: '.fluxel.json', tmpl: 'templates/fluxel.tmpl'}
	]
};

var Template = {
	dir_structure: function () {
		return dir;
	},
	object_templates: function (object_name) {
		return [
			{name: 'src/actions/'	+ object_name + 'Actions.js', 	tmpl: 'templates/action.tmpl'},
			{name: 'src/constants/' + object_name + 'Constants.js',	tmpl: 'templates/constant.tmpl'},
			{name: 'src/stores/'	+ object_name + 'Stores.js',	tmpl: 'templates/store.tmpl'},
			{name: 'src/views/'		+ object_name + 'Views.js',		tmpl: 'templates/view.tmpl'},
		];
	},
	load_template: function (tmpl, object_name, cb) {
		if (typeof object_name === 'function') {
			cb = object_name;
			object_name = '  ';
		}

		var full_path = __path.join(__dirname, '../' + tmpl);
		fs.readFile(full_path, 'utf8', function (err, contents) {
			if (err) {
				cb(err);
				return;
			}

			var param_name = (object_name[0].toLowerCase() + object_name.substring(1)).trim();
			contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
			contents = contents.replace(/<<NAME>>/g, object_name);

			cb(null, contents);
		});
	}
}


//console.log(JSON.stringify(dir, null, 4));
module.exports = Template;