
var __fs = require('fs');
var __path = require('path');

var FluxelConstants = require('../utils').AppConstants;
var object_map = require('../utils').object_map;

var App = require('./AppTemplate.js');
var Component = require('./ComponentTemplate.js');

function helper(directory, name, cb) {
	object_map(directory, function (dir_name, instruction) {

		cb(null, {
			name: dir_name,
			contents: null,
			is_dir: true,
		});

		if (instruction.files !== undefined) {
			load_files(instruction.files, name, cb);
		}

		if (instruction.directories !== undefined) {
			helper(instruction.directories, name, cb);
		}
	});
}

function load_files(files, name, cb) {
	files.forEach(function (template_name) {

		if (template_name.indexOf('.tmpl') !== -1) {

			__fs.readFile(template_name, 'utf8', function (err, contents) {

				if (err) {
					return cb(err, null);
				}

				var param_name = (name[0].toLowerCase() + name.substring(1)).trim();
				contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
				contents = contents.replace(/<<NAME>>/g, name);

				var last_path_seporator = template_name.lastIndexOf('/');
				var path = template_name.substr(0, last_path_seporator);
				var file_name = template_name.substr(last_path_seporator + 1);

				if (file_name.indexOf('__') === 0) {
					file_name = file_name.replace('__', name);
				}

				file_name = file_name.replace('.tmpl', '');

				cb(null, {
					name: file_name,
					contents: contents,
					is_dir: false
				});
			});
		}
	});
}

function for_each_template(type, name, callback) {
	var dir_structure;

	switch (type) {
		case FluxelConstants.APP:
			dir_structure = App.dir_structure();
			break;

		case FluxelConstants.COMPONENT:
			dir_structure = Component.dir_structure();
			break;

		default:
			throw 'Template type: ' + type + ' is not valid';
	}

	helper(dir_structure.directories, name, callback);
	load_files(dir_structure.files, name, callback);
};




for_each_template(FluxelConstants.APP, 'Foo', function (err, fs_obj) {

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
