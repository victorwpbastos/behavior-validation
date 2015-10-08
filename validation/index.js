var Marionette = require('marionette');
var _ = require('underscore');

module.exports = Marionette.Behavior.extend({
	initialize: function() {
		// Inject the necessary methods to perform validation in the view.
		this.view.triggerValidation = this.validate.bind(this);
		this.view.triggerRevalidation = this.revalidate.bind(this);
	},

	onRender: function() {
		this._rules = this.options.rules;
		this._handleErrors = true;

		if(this.options.handleErrors === false) {
			this._handleErrors = false;
		}

		// rules can be passed as a function.
		if(_.isFunction(this._rules)) {
			this._rules = this._rules.apply(this.view);
		}
	},

	/*
	*	Function to trigger the first validation.
	*/
	validate: function(e) {
		if(e) {	e.preventDefault(); }

		this._errors = [];
		this.hideErrors();

		_(this._rules).each(function(fns, field) {
			this.prepareRuleFns(fns, this.view.$(field));
		}.bind(this));

		this.broadcastErrors();
	},

	/*
	*	Function to trigger the subsequent validations.
	*/
	revalidate: function(e) {
		this.validate(null);
	},

	/*
	*	Prepare the functions. Verify and normalize the format of the rules passed.
	*/
	prepareRuleFns: function(fns, field) {
		if(!_.some(fns, _.isArray)) {
			fns = [fns];
		}

		_(fns).each(function(fn) {
			if(!_.isFunction(fn) && !_.isFunction(fn[0])) {
				fn = require('./rules/' + fn[0]).apply(fn, _.rest(fn) );
			}
			this.executeRuleFn(fn, field);
		}, this);
	},

	/*
	*	Execute the function associated with the rule.
	*/
	executeRuleFn: function(fn, field) {
		// only visible fields trigger validation.
		if(field.is(':visible') || field.attr('type') === 'hidden') {
			var errorMessage = fn.call(this, field);

			if(errorMessage) {
				field.addClass('validated-field');
				this.showError(field, errorMessage);
				this._errors.push({field: field, message: errorMessage});
			}
		}
	},

	/*
	*	Send the errors collection to view on event onValidate.
	*/
	broadcastErrors: function() {
		this.view.triggerMethod('validation', this._errors);
	},

	/*
	*	Show the error messages.
	*/
	showError: function(field, errorMessage) {
		if(this._handleErrors) {
			if(!field.parents('.form-group').hasClass('has-error')) {
				field
					.parents('.form-group')
					.addClass('has-error')
					.append('<div class="text-danger" style="white-space:nowrap;">' + errorMessage + '</div>');
			}
		}
	},

	/*
	*	Hide the error messages.
	*/
	hideErrors: function() {
		if(this._handleErrors) {
			this.view.$('.form-group')
				.removeClass('has-error')
				.find('div.text-danger')
				.remove();
		}
	}
});