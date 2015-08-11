
var fs = require('fs');
var __path = require('path');

// fix this
var dir_structure = require('../directory_structure');
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
	
	object_name = object_name || '  ';

	var param_name = (object_name[0].toLowerCase() + object_name.substring(1)).trim();

	files.forEach(function (file) {
		
		if (file.tmpl !== undefined) {
			var full_path = __path.join(__dirname, '../../' + file.tmpl);
			fs.readFile(full_path, 'utf8', function (err, contents) {
				if (err) {
					throw err;
				}
				contents = contents.replace(/<<PARAMNAME>>/g, param_name);
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
	console.log('Creating File: ' + full_path + '\nContents:\n' + contents);
	fs.writeFile(full_path, contents, function (err) {
        if (err) {
        	throw err;
        }
    });
}

function create_object(object_name) {

}

module.exports = function (cwd, action, value) {
	switch (action) {
		case Constants.APP:
			create_app(cwd, value);
			break;
		case Constants.OBJECT:
			create_object();
			break;
	}
};