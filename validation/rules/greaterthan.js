module.exports = function(value, message) {
	message = message || 'Value must be greater than ' + value;

	return function(field) {
		if(parseInt(field.val(), 10) <= value) {
			return message;
		}
	};
};