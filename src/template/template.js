
var fs = require('fs');
var __path = require('path');

var KeyMirror = require('keymirror');

var TMPL_LOC = __path.join(__dirname);

// describes the default layout of the src folder
var src = {
	directories: KeyMirror({
		actions: null,
		constants: null,
		dispatcher: null,
		stores: null,
		views: null
	}),
	files: [
		{name: 'app.js', tmpl: TMPL_LOC + '/app.tmpl'}
	]
};

// add the dispatcher template to the dispater directory
src.directories.dispatcher = {
	directories: {},
	files: [
		{name: 'AppDispatcher.js', tmpl: TMPL_LOC + '/dispatcher.tmpl'}
	]
};

// add the action constants file to the constants directory
src.directories.constants = {
	directories: {},
	files: [
		{name: 'ActionConstants.js', tmpl: TMPL_LOC + '/action_constatnts.tmpl'}
	]
};

src.directories.views = {
	directories: {},
	files: [
		{name: 'ItWorks.react.js', tmpl: TMPL_LOC + '/itworks.tmpl'}
	]
};


// describes the entire application directory structure
var dir = {
	directories: {
		src: src,
		'public': {
			directories: {},
			files: [
				{name: 'index.html', tmpl: TMPL_LOC + '/index.html.tmpl'}
			]
		},
		dist: {
			directories: {},
			files: [
				{name: 'app.js'}
			]
		},
		bin: {directories: {}, files: []},
		lib: {directories: {}, files: []}
	},
	files: [
		{name: 'package.json', tmpl: TMPL_LOC + '/package.tmpl'},
		{name: 'LICENSE'},
		{name: 'README.md'},
		{name: '.gitignore', tmpl: TMPL_LOC + '/gitignore.tmpl'},
		{name: '.fluxel.json', tmpl: TMPL_LOC + '/fluxel.tmpl'},
		{name: 'gulpfile.js', tmpl: TMPL_LOC + '/gulpfile.js.tmpl'}
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
			this.action_template(object_name),
			this.constant_template(object_name),
			this.store_template(object_name),
			this.view_template(object_name)
		];
	},
	/**
	 *	@tmpl: the template to load
	 *	@object_name: The neme of the object, <<NAME>> in the tamples will be replace with this value
	 *	@cb: a function that will be called when the tamplate has been loaded, parms cb(err, contents)
	 *		where contents is the parsed template
	 */
	action_template: function (object_name) {
		return {name: 'src/actions/'+ object_name + 'Actions.js', tmpl: TMPL_LOC + '/action.tmpl'};
	},
	constant_template: function (object_name) {
		return {name: 'src/constants/' + object_name + 'Constants.js', tmpl: TMPL_LOC + '/constant.tmpl'};
	},
	store_template: function (object_name) {
		return {name: 'src/stores/'	+ object_name + 'Store.js', tmpl: TMPL_LOC + '/store.tmpl'};
	},
	view_template: function (object_name) {
		return {name: 'src/views/' + object_name + 'Components.react.js', tmpl: TMPL_LOC + '/view.react.tmpl'};
	},
	app_template: function (object_name) {

	},
	load_template: function (tmpl, object_name, cb) {

		console.log('object name:', object_name);

		if (typeof object_name === 'function') {
			cb = object_name;
			object_name = '  ';
		}

		var full_path = tmpl;
		//console.log('path:',full_path);

		fs.readFile(full_path, 'utf8', function (err, contents) {

			console.log('object name:', object_name);

			if (err) {
				return cb(err, null);
			}



			var param_name = (object_name[0].toLowerCase() + object_name.substring(1)).trim();
			contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
			contents = contents.replace(/<<NAME>>/g, object_name);

			cb(null, contents);
		});
	}
}

module.exports = Template;
