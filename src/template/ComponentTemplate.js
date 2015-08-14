
var object_map = require('../utils').object_map;

var path = require('path').join(__dirname, './component_templates/');

// better that concating every element with + or path.concat
function r(tmpl) {
	return path + tmpl;
}

var dir_structure = {
	directories: {
		actions: {
			files: [r('__Action.js.tmpl')]
		},
		dispatcher: {
			files: [r('__Dispatcher.js.tmpl')]
		},
		constants: {
			files: [r('__Constants.js.tmpl'), r('ActionConstants.js.tmpl')]
		},
		store: {
			files: [r('__Store.js.tmpl')]
		},
		views: {
			files: [r('__View.react.js.tmpl')]
		}
	},
	files: [r('__Component.react.js.tmpl')]
};

var ComponentTemplate = {
	dir_structure: function (filter) {
		if (!filter) {
			return dir_structure;
		}
		var subset = {directories: {}};

		if (filter.indexOf('files') !== -1) {
			subset.files = dir_structure.files;
		}

		object_map(dir_structure.directories, function (dir_name, instruction) {
			if (filter.indexOf(dir_name) > -1) {
				subset.directories[dir_name] = instruction;
			}
		});
		return subset;
	}
};

module.exports = ComponentTemplate;
