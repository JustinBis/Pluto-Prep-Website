"use strict";
Template.appHome.events({
	// When the sign up button is pressed, sign this user up
	"submit #create-user-form": function (event) {
		// Don't actually submit this form
		event.preventDefault();

		// Reduce the form data into an object
		var formdata = $(event.target).serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		// Make sure the passwords match
		if(formdata['home-form-password'] !== formdata['home-form-confirm-password'])
		{
			console.error("Error creating user: passwords must match");
			return false;
		}

		// Collect the options for Meteor's account system
		var options = {
			// Ignore the username, since Meteor requires it be unique
			//but we want users to be able to change it freely
			email: formdata['home-form-email'],
			password: formdata['home-form-password'],
			profile: {
				// This is the username we will display
				username: formdata['home-form-username']
			}
		};

		// Create the account!
		Accounts.createUser(options, function(err) {
			if(err)
			{
				console.error("Error creating user");
				// TODO: Present errors to the users
			}
			else
			{
				Router.go('quiz-select-subject');
			}
		});
	}
});
