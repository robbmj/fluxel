

var CommandHandlers = require('./commands');
var AppConstants = require('./utils').AppConstants;

var arg_parser = require('./arg_parse');

function handleCommand(command) {
	switch (command.command) {
		case AppConstants.CREATE:
			CommandHandlers.Create(command);
			break;
		default:
			// no op
	}
}

module.exports = function () {
	var command	= arg_parser(process.argv);
	handleCommand(command);
};
