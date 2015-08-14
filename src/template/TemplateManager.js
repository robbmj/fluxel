
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
			load_files(instruction.files, name, dir_name, cb);
		}

		if (instruction.directories !== undefined) {
			helper(instruction.directories, name, cb);
		}
	});
}

function load_files(files, name, dir_name, cb) {
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
					name: dir_name + '/' + file_name,
					contents: contents,
					is_dir: false
				});
			});
		}
	});
}


function TemplateManager() {
	this.app_template = App;
	this.component_template = Component;

	this.App = FluxelConstants.App;
	this.COMPONENT = FluxelConstants.COMPONENT;

	this.ACTION = FluxelConstants.ACTION;
	this.CONSTANTS = FluxelConstants.CONSTANTS;
	this.STORE = FluxelConstants.STORE;
	this.VIEW = FluxelConstants.VIEW
}

TemplateManager.new = function () {
	return new TemplateManager();
}

TemplateManager.prototype.set_template = function (type, obj) {
	switch (type) {
		case FluxelConstants.COMPONENT:
			this.component_template = obj;
			break;
		default:
			throw 'Template type: ' + type + ' is not valid';
	}
};

TemplateManager.prototype.for_each_template = function (type, name, callback, filter) {
	var dir_structure;

	if (Array.isArray(filter) && filter.length == 0) {
		filter = null;
	}

	switch (type) {
		case this.APP:
			dir_structure = this.app_template.dir_structure(filter);
			break;

		case this.COMPONENT:
			dir_structure = this.component_template.dir_structure(filter);
			break;

		default:
			throw 'Template type: ' + type + ' is not valid';
	}

	helper(dir_structure.directories, name, callback);
	load_files(dir_structure.files, name, '.', callback);
};

module.exports = TemplateManager;


/*var tm = new TemplateManager();

tm.set_template(tm.COMPONENT, require('./ItWorksTemplate'));

tm.for_each_template(FluxelConstants.COMPONENT, 'ItWorks', function (err, fs_obj) {

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
});*/
