
var component_template = require('./ComponentTemplate');

var path = require('path').join(__dirname, './itworks_templates/');

// better that concating every element with + or path.concat
function r(tmpl) {
	return path + tmpl;
}

var ItWorksTemplate = {
	dir_structure: function () {
		return {
			directories: {
				views: {
					files: [r('ItWorksView.react.js.tmpl')]
				}
			},
			files: component_template.dir_structure().files
		};
	}
}

module.exports = ItWorksTemplate;
