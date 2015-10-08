module.exports = function(value, message) {
	message = message || 'Value must be equals to ' + value;

	return function(field) {
		if(field[0].type === 'radio' || field[0].type === 'checkbox') {
			var attrName = field[0].name;

			if($('[name="' + attrName + '"]:checked').val() != value) {
				return message;
			}
		} else {
			if(field.val() != value) {
				return message;
			}
		}
	};
};