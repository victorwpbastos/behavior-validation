module.exports = function(value, message) {
	message = message || 'Value must be less than ' + value;

	return function(field) {
		if(parseInt(field.val(), 10) >= value) {
			return message;
		}
	};
};