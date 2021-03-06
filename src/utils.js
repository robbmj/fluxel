

function object_map(object, cb) {
	//var new_obj = {}, key;
	for (key in object) {
		if (object.hasOwnProperty(key) && cb(key, object[key])) {
			new_obj[key] = object[key];
		}
	}
//	return new_obj;
}

var AppConstants = {

	CREATE: 'create',
	APP: 'app',
	COMPONENT: 'component',
	ADDTOCOMPONENT: 'addtocomponent',

	ACTION: 'actions',
	CONSTANTS: 'constants',
	STORE: 'store',
	VIEW: 'views'
};


module.exports = {
	object_map: object_map,
	AppConstants: AppConstants
};
