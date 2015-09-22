# Behavior Validation

> It's a Marionette Behavior for form validation. Inspired in [Validator](https://gist.github.com/Mariede/3d71eecd37bd0c89cd77) by [Michel Ariede](https://github.com/Mariede).

## Install

1. Download the `validation` folder.
2. If you are using [Boiler](https://github.com/baltazzar/boiler), put the `validation` folder inside the `application/behaviors`. Create the `behaviors` folder if it not exists.

## How to use

Put this in your Marionette ItemView:

```js
behaviors: [{
	behaviorClass: require('behaviors/validation'), // if using webpack|browserify
	rules: {
		'[name="nome"]'  : ['required', 'Nome é obrigatório!'],
		'[name="idade"]' : [
			['required'],
			['equals', 4]
		]
	},
	trigger: 'submit form', // default event for initial validation
	triggerAgainEvent: 'change' // default event for subsequent validation
}]
```