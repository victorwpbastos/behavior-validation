# Behavior Validation

> It's a Marionette Behavior for form validation. Inspired in [Validator](https://gist.github.com/Mariede/3d71eecd37bd0c89cd77) by [Michel Ariede](https://github.com/Mariede).

## Install

1. Download the `validation` folder;
2. If you are using [Boiler](https://github.com/baltazzar/boiler), put the `validation` folder inside the `application/behaviors` folder. Create the `behaviors` folder if it not exists.

## How to use

Put this in your Marionette ItemView:

```js
behaviors: [{
	behaviorClass: require('behaviors/validation'), // if using webpack|browserify
	rules: {
		'[name="name"]'  : ['required'],
		'[name="age"]' : [
			['required', 'Age is required.'],
			['greaterthan', 18, 'Age must be greater than 18.']
		]
	},
	trigger: 'submit form', // default event for initial validation
	triggerAgainEvent: 'change', // default event for subsequent validation
	handleErrors: true // default true. If false, no error messages would be shown
}]
```

## Rules

The rules must be defined in the folder `validation/rules` following the format below:

```js
// validation/rules/required.js
module.exports = function(message) { // parameters passed by the user
	message = message || 'Value is required';

	return function(field) {
		if(field.val() === '') {
			return message;
		}
	};
};
```

To use in the view:

```js
...
rules: {
	'[name="name"]' /* jquery selector of the field */  : [
		'required' /* name of the rule */, 
		'Field is required' /* parameter passed to rule */
	],
	'[name="age"]' : [ // multiple rules can be passed in array format
		['required', 'Age is required.'],
		['greaterthan', 18, 'Age must be greater than 18.']
	]
}
...
```

### Important
1. Rules must be passed in array format;
2. The first item of array is the name of the rule (filename);
3. The other items of the array are passed to the rule function respecting the order.

## onValidation

When a validation is triggered, the `onValidation` event is called. You can register the `onValidation` event in the view to receive an array containing all the validation errors.

```js
...
onValidation: function(errors) {
	// do something with the errors array
}
...
```
