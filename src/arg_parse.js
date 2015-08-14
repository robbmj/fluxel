
var nopt = require('nopt');
var KeyMirror = require('keymirror');

var AppConstants = require('./utils').AppConstants;

var object_map = require('./utils').object_map;

nopt.invalidHandler = function (key, val, types) {
	console.log('\n\n-----------------------logging errors-------------------------');
	console.log('key:', key);
	console.log('val:', val);
	console.log('types:', types);
	console.log('-----------------------logging errors-------------------------\n\n');
};

var validation = {
	create: {
		create: {
			required: true,
			is_valid: function (value) {
				return true;
			},
			'default': null
		},
		name: {
			required: true,
			is_valid: function (value) {
				return new RegExp('^[A-Z]([a-zA-z]+)$').test(value);
			},
			'default': null
		},
		filter: {
			required: false,
			is_valid: function (value) {
				return true;
			},
			'default': []
		},
		add: {
			required: false,
			is_valid: function (value) {
				return new RegExp('^[A-Z]([a-zA-z]+)$').test(value);
			},
			'default': 'Ignore'
		}
	},
	runserver: {
		runserver: {
			required: false,
			is_valid: function (value) {
				return value > 1024 && value < 65536;
			},
			'default': 8080
		}
	}
};

var known_ops = {
	create: ['app', 'component', 'addtocomponent'],
	name: [String],



	// BUG: there apears to be a bug here, if --runserver or -r are not supplied a value
	// nopt seems to assign runserver a value of 1
	runserver: [Number, null],

	filter: [String, Array],

	add: [String, null]
};

var short_hands = {
	c: '--create',
	n: '--name',
	r: '--runserver',
	f: '--filter'
};

function validate_command(parsed_args) {
	var n = 0, the_command;
	Object.keys(validation).forEach(function (command) {
		if (parsed_args[command] !== undefined) {
			n++;
			the_command = command
		}
	});
	if (n == 0) {
		throw 'No top level command specified';
	}
	else if (n > 1) {
		throw 'Commands are not compatable';
	}
	return the_command;
}

function validate_arguments(command, parsed_args) {
	var cmd_obj = {};
	object_map(validation[command], function (name, argument) {
		value = parsed_args[name];

		// workaround for the nopt bug described above
		if (command === 'runserver' && value === 1) value = 8080;

	//	console.log('value is ' + value);
		if (value == undefined && argument.required) {
			throw name + ' is required';
		}

		value = value || argument.default;

		if (!argument.is_valid(value)) {
			throw 'the value: ' + value + ' is invalid for the argument: ' + name;
		}

		cmd_obj[name] = value
	});

	return cmd_obj;
}

function parse(argv) {
	var command, cmd_obj, parsed = nopt(known_ops, short_hands, argv, 2);

	try {
		command = validate_command(parsed),
		cmd_obj = validate_arguments(command, parsed);
		cmd_obj.command = command;
		cmd_obj.path = process.cwd();
	}
	catch (err) {
		console.log('Error: ' + err);
		print_help()
		process.exit();
	}

//console.log(cmd_obj); process.exit();
	return cmd_obj;
}

function print_help() {
	console.log('This is the help')
}

//parse(process.argv);
module.exports = parse;
