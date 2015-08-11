

// fluxel create app <name>
// fluxel create object <name>

var CommandHandlers = require('./commands');
var Constants = require('./constants');

// TODO: get some real argument parsing

var valid_args = {};
valid_args[Constants.CREATE] = {};
valid_args[Constants.CREATE][Constants.APP] = new RegExp('[a-z]+');
valid_args[Constants.CREATE][Constants.OBJECT] = new RegExp('[a-z]');


function print_help() {
	console.log('This is the help');
}

function arg_parser(args) {

	if (valid_args[args[0]] === undefined) {
		throw 'The command ' + args[0] + ' is not valid';
	}

	if (valid_args[args[0]][args[1]] === undefined) {
		throw 'The action ' + args[1] + ' is not valid for the command: ' + args[0];
	}

	if (!valid_args[args[0]][args[1]].test(args[2])) {
		throw 'The value ' + args[2] + ' is not valid value for the action: ' + args[1];
	}

	return {
		command: args[0],
		action: args[1],
		value: args[2]
	};
}

function handleCommand(cwd, command) {
	switch (command.command) {
		case Constants.CREATE:
			CommandHandlers.Create(cwd, command.action, command.value);
			break;
		default:
			// no op
	}
}

function main() {
	var command;
	try {
		command = arg_parser(process.argv.splice(2));
	}
	catch (error) {
		console.log(error);
		print_help();
		process.exit();
	}
	handleCommand(process.cwd(), command);
}

main();