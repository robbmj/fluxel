
var __fs = require('fs');

var TMPL_LOC = './component_templates/';

var path = require('path').join(__dirname, TMPL_LOC);

var object_map = require('../utils').object_map;

var dir_structure = {
	directories: {
		actions: {
			files: ['Action.js.tmpl']
		},
		dispatcher: {
			files: ['Dispatcher.js.tmpl']
		},
		constants: {
			files: ['Constants.js.tmpl']
		},
		store: {
			files: ['Store.js.tmpl']
		},
		views: {
			files: ['View.react.js.tmpl']
		}
	},
	files: ['Component.react.js.tmpl']
};

function helper(directory, component_name, cb) {
	object_map(directory, function (dir_name, instruction) {

		cb(null, {
			name: dir_name,
			contents: null,
			is_dir: true,
		});

		if (instruction.files !== undefined) {
			load_files(instruction.files, component_name, cb);
		}

		if (instruction.directories !== undefined) {
			helper(instruction.directories, component_name, cb);
		}
	});
}

function load_files(files, component_name, cb) {
	files.forEach(function (template_name) {
		__fs.readFile(path + template_name, 'utf8', function (err, contents) {

			if (err) {
				return cb(err, null);
			}

			var param_name = (component_name[0].toLowerCase() + component_name.substring(1)).trim();
			contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
			contents = contents.replace(/<<NAME>>/g, component_name);

			cb(null, {
				name: component_name + template_name.replace('.tmpl', ''),
				contents: contents,
				is_dir: false
			});
		});
	});
}

var ComponentTemplate = {
	dir_structure: function (component_name, callback) {
		helper(dir_structure.directories, component_name, callback);
		load_files(dir_structure.files, component_name, callback);
	},
};


ComponentTemplate.dir_structure('Foo', function (err, fs_obj) {

	if (err) {
		console.log('Err:', err);
	}
	else {
		console.log('----------------------------------------------------');
		console.log(fs_obj.name);
		console.log(fs_obj.contents);
		console.log(fs_obj.is_dir);
		console.log('----------------------------------------------------');
	}
});

//module.exports = ComponentTemplate;
