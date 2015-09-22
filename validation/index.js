var Marionette = require('marionette');
var _ = require('underscore');

module.exports = Marionette.Behavior.extend({
	initialize: function() {
		this.events = {};
		this.trigger = this.options.trigger || 'submit form';
		this.triggerAgainEvent = this.options.triggerAgainEvent || 'change';
		this.triggered = false;

		this.prepareTriggerEvent(this.options.rules, this.trigger);
		this.prepareFieldChangeEvents(this.options.rules, this.triggerAgainEvent);
	},

	/*
	*	Prepare the rules to be triggered for the first time.
	*/
	prepareTriggerEvent: function(validationRules, trigger) {
		this.events[trigger] = function(e) {
			e.preventDefault();

			this.hideErrors();
			this.prepareRuleFns(validationRules);
			this.triggered = true;
		};
	},

	/*
	*	Prepare the rules to be triggered again when field changes.
	*/
	prepareFieldChangeEvents: function(validationRules, trigger) {
		_(validationRules).each(function(fns, field) {
			this.events[trigger + ' ' + field] = function(e) {
				e.preventDefault();

				if(this.triggered) {
					this.hideErrors(field);
					this.prepareRuleFns(validationRules);
				}
			};
		}, this);
	},

	/*
	*	Prepare the functions. Verify and normalize the format of the rules passed.
	*/
	prepareRuleFns: function(validationRules) {
		_(validationRules).each(function(fns, field) {
			if(!_.some(fns, _.isArray)) {
				fns = [fns];
			}

			_(fns).each(function(fn) {
				if(!_.isFunction(fn) && !_.isFunction(fn[0])) {
					fn = require('./rules/' + fn[0]).apply(fn, _.rest(fn) );
				}

				this.executeRuleFn(fn, field);
			}, this);
		}, this);
	},

	/*
	*	Execute the function associated with the rule.
	*/
	executeRuleFn: function(fn, fields) {
		fields = this.view.$(fields);

		fields.each(function(i, field) {
			var message = fn.call(this, $(field));

			if(message) {
				this.showError($(field), message);
			}
		}.bind(this));
	},

	/*
	*	Show the error messages.
	*/
	showError: function(field, message) {
		if(!field.parents('.form-group').hasClass('has-error')) {
			field
				.parents('.form-group')
				.addClass('has-error')
				.append('<div class="text-danger" style="white-space:nowrap;">' + message + '</div>');
		}
	},

	/*
	*	Hide the error messages.
	*/
	hideErrors: function(field) {
		if(field) {
			this.view.$(field)
				.parents('.form-group')
				.removeClass('has-error')
				.find('div.text-danger')
				.remove();
		} else {
			this.view.$('.form-group')
				.removeClass('has-error')
				.find('div.text-danger')
				.remove();
		}
	}
});