var Marionette = require('marionette');
var _ = require('underscore');

module.exports = Marionette.Behavior.extend({
    initialize: function() {
        // Inject the necessary methods to perform validation in the view.
        this.view.triggerValidation = function(e) {
            this.validate(e, this._rules);

            if(this._handleErrors && this._scrollToFirstError) {
                this.scrollToFirstError();
            }
        }.bind(this);

        this.view.triggerRevalidation = this.revalidate.bind(this);
        this.view.triggerValidationByRules = this.validateByRules.bind(this);
    },

    onRender: function() {
        this._rules = this.options.rules;
        this._handleErrors = true;
        this._scrollToFirstError = true;

        if(this.options.handleErrors === false) {
            this._handleErrors = false;
        }

        if(this.options.scrollToFirstError === false) {
            this._scrollToFirstError = false;
        }

        // rules can be passed as a function.
        if(_.isFunction(this._rules)) {
            this._rules = this._rules.apply(this.view);
        }
    },

    /*
    *   Function to trigger the first validation.
    */
    validate: function(e, rules) {
        if(e) { e.preventDefault(); }

        this._errors = [];
        this.hideErrors();

        _(rules).each(function(fns, field) {
            this.prepareRuleFns(fns, this.view.$(field));
        }.bind(this));

        this.broadcastErrors();
        this.triggered = true;
    },

    /*
    *   Function to trigger the subsequent validations.
    */
    revalidate: function(e) {
        if(this.triggered) {
            this.validate(null, this._rules);
        }
    },

    /*
    *   Function to trigger validation to only some rules.
    */
    validateByRules: function(rules) {
        if(rules) {
            this.validate(null, rules);
        }
    },

    /*
    *   Prepare the functions. Verify and normalize the format of the rules passed.
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
    *   Execute the function associated with the rule.
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
    *   Send the errors collection to view on event onValidate.
    */
    broadcastErrors: function() {
        this.view.triggerMethod('validation', this._errors);
    },

    /*
    *   Show the error messages.
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
    *   Hide the error messages.
    */
    hideErrors: function() {
        if(this._handleErrors) {
            this.view.$('.form-group')
                .removeClass('has-error')
                .find('div.text-danger')
                .remove();
        }
    },

    /*
    *   Scroll to the first error
    */
    scrollToFirstError: function() {
        if($('.has-error').length > 0) {
            $('body').scrollTop($('.has-error:first').offset().top);
        }
    }
});
