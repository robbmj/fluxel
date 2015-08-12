
var fs = require('fs');
var __path = require('path');

var KeyMirror = require('keymirror');

var TMPL_LOC = './';

// describes the default layout of the src folder
var src = {
	directories: KeyMirror({
		actions: null,
		constants: null,
		dispather: null,
		stores: null,
		views: null
	}),
	files: [
		{name: 'app.js', tmpl: TMPL_LOC + '/app.tmpl'}
	]
};

// add the dispatcher template to the dispater directory
src.directories.dispather = {
	directories: {},
	files: [
		{name: 'AppDispatcher.js', tmpl: TMPL_LOC + '/dispatcher.tmpl'}
	]
};

// add the action constants file to the constants directory
src.directories.constants = {
	directories: {},
	files: [
		{name: 'ActionsConstants.js', tmpl: TMPL_LOC + '/action_constatnts.tmpl'}
	]
};

// describes the entire application directory structure
var dir = {
	directories: {
		src: src,
		'public': 'public'
	},
	files: [
		{name: 'package.json', tmpl: TMPL_LOC + '/package.tmpl'},
		{name: 'LICENSE'},
		{name: 'README.md'},
		{name: '.gitignore', tmpl: TMPL_LOC + '/gitignore.tmpl'},
		{name: '.fluxel.json', tmpl: TMPL_LOC + '/fluxel.tmpl'}
	]
};


// An object that be quered to return parsed templates and directory structures
var Template = {
	/**
	 * Returns an object taht describes the directory structure
	 * for a flux application
	 */
	dir_structure: function () {
		return dir;
	},
	/**
	 * Returns an array of objects descibing where templates should be written to
	 */
	object_templates: function (object_name) {
		return [
			{name: 'src/actions/'	+ object_name + 'Actions.js', 	tmpl: TMPL_LOC + '/action.tmpl'},
			{name: 'src/constants/' + object_name + 'Constants.js',	tmpl: TMPL_LOC + '/constant.tmpl'},
			{name: 'src/stores/'	+ object_name + 'Stores.js',	tmpl: TMPL_LOC + '/store.tmpl'},
			{name: 'src/views/'		+ object_name + 'Views.js',		tmpl: TMPL_LOC + '/view.tmpl'},
		];
	},
	/**
	 *	@tmpl: the template to load
	 *	@object_name: The neme of the object, <<NAME>> in the tamples will be replace with this value
	 *	@cb: a function that will be called when the tamplate has been loaded, parms cb(err, contents)
	 *		where contents is the parsed template
	 */
	load_template: function (tmpl, object_name, cb) {
		if (typeof object_name === 'function') {
			cb = object_name;
			object_name = '  ';
		}

		var full_path = __path.join(__dirname, '/' + tmpl);
		console.log(full_path);
		fs.readFile(full_path, 'utf8', function (err, contents) {
			if (err) {
				cb(err, null);
				return;
			}

			var param_name = (object_name[0].toLowerCase() + object_name.substring(1)).trim();
			contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
			contents = contents.replace(/<<NAME>>/g, object_name);

			cb(null, contents);
		});
	}
}

module.exports = Template;
