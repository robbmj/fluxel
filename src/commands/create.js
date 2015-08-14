
// standard lib
var fs = require('fs');

// objects
var TemplateManager = require('../template/TemplateManager');
var FluxelConstants = require('../utils').AppConstants;

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

function tmpl_cb(_path) {
	return function (err, obj) {
		if (err) {
			throw err;
		}

		var fullpath = _path + '/' + obj.name;

		if (obj.is_dir) {
			create_dir(fullpath, err_cb(fullpath));
		}
		else {
			create_file(fullpath, obj.contents);
		}
	};
}

function create_app(path, app_name) {
	path = path + '/' + app_name;
	create_dir(path, err_cb(path));

	var tm = new TemplateManager();
	tm.for_each_template(tm.APP, app_name, tmpl_cb(path));

	path = path + '/src/ItWorks';
	create_dir(path, err_cb(path));
	tm.set_template(tm.COMPONENT, require('../template/ItWorksTemplate'));
	tm.for_each_template(tm.COMPONENT, 'ItWorks', tmpl_cb(path));
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

function create_objects_in_component(path, component_name, object_name, filter) {
	var tm = new TemplateManager();
	path = path + '/src/' + component_name;

	// TODO: check app state
	tm.for_each_template(tm.COMPONENT, object_name, tmpl_cb(path), filter);
}

function create_component(path, component_name, filter) {

	var tm = new TemplateManager();


	fs.readFile(path + '/.fluxel.json', function (err, data) {
		if (err) {
			throw err;
		}

		var app_state = JSON.parse(data);
		if (app_state.objects[component_name] !== undefined) {
			throw "Can't create object " + component_name + " it already exists";
		}

		app_state.objects[component_name] = [];

		path = path + '/src/' + component_name;
		create_dir(path, err_cb(path));

		tm.for_each_template(tm.COMPONENT, component_name, tmpl_cb(path), filter);
	});
}

module.exports = function (command) {
	switch (command.create) {
		case FluxelConstants.APP:
			create_app(command.path, command.name);
			break;
		case FluxelConstants.COMPONENT:
			create_component(command.path, command.name, command.filter);
			break;
		case FluxelConstants.ADDTOCOMPONENT:
			create_objects_in_component(command.path, command.name, command.add, command.filter);
			break;
	}
};
