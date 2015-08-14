
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
			files: [r('__Constants.js.tmpl')]
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
	dir_structure: function (component_name, callback) {
		return dir_structure;
	},
};

module.exports = ComponentTemplate;
