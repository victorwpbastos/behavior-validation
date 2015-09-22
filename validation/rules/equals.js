module.exports = function(value, message) {
	message = message || 'Value must be equals to ' + value;

	return function(field) {
		if(field.val() != value) {
			return message;
		}
	};
};