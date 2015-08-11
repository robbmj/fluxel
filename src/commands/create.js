
var fs = require('fs');
var __path = require('path');

var Template = require('../template');
var Constants = require('../constants');

function create_dir(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    console.log("Creating directory: " + path + "\n");
   // return;
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
	recursive_create(path, dir_structure.directories);
	create_files(path, dir_structure.files, app_name);
}

function object_map(object, cb) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			cb(key, object[key]);
		}
	}
}

function recursive_create(full_path, dirs) {
	object_map(dirs, function (dir_name, value) {

		// create the directory: the object's property value is the directory name
		create_dir(full_path + '/' + dir_name, err_cb(full_path + '/' + dir_name));
		
		// do we need to put stuff in the directory?
		if (typeof value === 'object') {
			// check to see if sub directories need to be made	
			if (typeof value.directories === 'object') {
				recursive_create(full_path + '/' + dir_name, value.directories);
			}

			// check to see if any files need to be made.
			if (Array.isArray(value.files)) {
				create_files(full_path + '/' + dir_name, value.files);
			}
		}
	});
}

function create_files(path, files, object_name) {
	
	files.forEach(function (file) {
		
		if (file.tmpl !== undefined) {
			// this is stupid
			object_name = object_name || '  ';
			var full_path = __path.join(__dirname, '../../' + file.tmpl);
			var param_name = (object_name[0].toLowerCase() + object_name.substring(1)).trim();

			fs.readFile(full_path, 'utf8', function (err, contents) {
				if (err) {
					throw err;
				}

				// TODO: move responsibility for this to the Template object
				contents = contents.replace(/<<NAMEPARAM>>/g, param_name);
				contents = contents.replace(/<<NAME>>/g, object_name);

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

function create_object(path, object_name) {
	console.log(path + '/.fluxel.json');
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

		object_templates.forEach(function (template) {
			Template.load_template(template.tmpl, object_name, function (err, contents) {

				if (err) {
					throw err;
				}

				create_file(path + '/' + template.name, contents);

				app_state.objects[object_name].push(template.name);
			});
		});

		// BUG: not writing components that were created as the above loop is async
		//create_file(path + '/.fluxel.json', JSON.stringify(app_state, null, 4));
		//console.log(JSON.stringify(app_state, null, 4));
	});
}

module.exports = function (cwd, action, value) {
	switch (action) {
		case Constants.APP:
			create_app(cwd, value);
			break;
		case Constants.OBJECT:
			create_object(cwd, value);
			break;
	}
};