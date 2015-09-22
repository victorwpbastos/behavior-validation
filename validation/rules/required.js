module.exports = function(message) {
	message = message || 'Value is required';

	return function(field) {
		if(field.val() === '') {
			return message;
		}
	};
};