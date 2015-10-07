module.exports = function(message) {
	message = message || 'Value is required';

	return function(field) {
		if(field[0].type === 'radio' || field[0].type === 'checkbox') {
			var attrName = field[0].name;

			if($('[name="' + attrName + '"]').is(':checked') === false) {
				return message;
			}
		} else {
			if(field.val() === '') {
				return message;
			}
		}
	};
};