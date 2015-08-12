

function object_map(object, cb) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			cb(key, object[key]);
		}
	}
}

var AppConstants = {
	CREATE: 'create',
	APP: 'app',
	OBJECT: 'objects'
};


module.exports = {
	object_map: object_map,
	AppConstants: AppConstants
};
