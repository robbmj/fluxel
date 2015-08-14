
// standard lib
var fs = require('fs');
var __path = require('path');

// third party
var Promise = require('promise');

// objects
var Template = require('../templates/template');
var AppConstants = require('../utils').AppConstants;

// functions
var object_map = require('../utils').object_map;

function create_dir(path, mask, cb) {
	if (typeof mask == 'function') { // allow the `mask` parameter to be optional
		cb = mask;
		mask = 0777;
	}
	console.log("Creating directory: " + path + "\n");

	fs.mkdir(path, mask, function(err) {
		if (err) {
			if (err.code == 'EEXIST') {
				// ignore the error if the folder already exists
				cb();
			}
			else {
				// something else went wrong
				cb(err);
			}
		}
		else {
			// successfully created folder
			cb();
		}
	});
}

function err_cb(full_path) {
	return function (err) {
		if (err) {
			throw 'Could not create file/directory: ' + full_path + ' error code: ' + err.code;
		}
	};
}

function create_app(path, app_name) {
	var dir_structure = Template.dir_structure();
	path = path + '/' + app_name;
	create_dir(path, err_cb(path));
	recursive_create(path, dir_structure.directories, app_name);
	create_files(path, dir_structure.files, app_name, app_name);
}

function recursive_create(full_path, dirs, object_name) {
	object_map(dirs, function (dir_name, value) {

		// create the directory: the object's property value is the directory name
		create_dir(full_path + '/' + dir_name, err_cb(full_path + '/' + dir_name));

		// do we need to put stuff in the directory?
		if (typeof value === 'object') {
			// check to see if sub directories need to be made
			if (typeof value.directories === 'object') {
				recursive_create(full_path + '/' + dir_name, value.directories, object_name);
			}

			// check to see if any files need to be made.
			if (Array.isArray(value.files)) {
				create_files(full_path + '/' + dir_name, value.files, object_name);
			}
		}
	});
}

function create_files(path, files, object_name) {

	files.forEach(function (file) {

		if (file.tmpl !== undefined) {

			Template.load_template(file.tmpl, object_name, function (err, contents) {
				if (err) {
					throw err;
				}

				create_file(path + '/' + file.name, contents);
			});
		}
		else {
			create_file(path + '/' + file.name, '');
		}
	});
}

function create_file(full_path, contents) {
	console.log('Creating File: ' + full_path);
	fs.writeFile(full_path, contents, function (err) {
		if (err) {
			throw err;
		}
	});
}

function find_app_dir() {
	// todo, code for the case when fluxel is envoked from a sub directory
}

// TODO break this up to more easily support commands like "create store" Foo or "create view Bar"
function create_object(path, object_name) {

	fs.readFile(path + '/.fluxel.json', function (err, data) {
		if (err) {
			throw err;
		}

		var app_state = JSON.parse(data);
		if (app_state.objects[object_name] !== undefined) {
			throw "Can't create object " + object_name + " it already exists";
		}

		app_state.objects[object_name] = [];

		var object_templates = Template.object_templates(object_name);

		// create an array of promises
		var promises = object_templates.map(function (template) {
			return new Promise(function (resolve, reject) {
				// load the template and replace <<NAME>> with the object name
				Template.load_template(template.tmpl, object_name, function (err, contents) {
					if (err) {
						console.log('failed to create:', path);
						console.log('Contents:', template.tmpl);
						reject(false);
					}
					else {
						// create files and write the templates to the files
						create_file(path + '/' + template.name, contents);
						// update the app state json file
						app_state.objects[object_name].push(template.name);
						resolve(true);
					}
				});
			});
		});

		Promise.all(promises).then(function (res) {
			// if all files were create successfuly
			if (res.filter(function (e) { return !e; }).length === 0) {
				// update the app state file
				create_file(path + '/.fluxel.json', JSON.stringify(app_state, null, 4));
			}
		});
	});
}

module.exports = function (command) {
	switch (command.create) {
		case AppConstants.APP:
			create_app(command.path, command.name);
			break;
		case AppConstants.OBJECT:
			create_object(command.path, command.name);
			break;
	}
};
