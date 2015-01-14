//
// All routes and routing settings will go here
//

// Global defaults
Router.configure({
	// Default to using the standard application layout
	layoutTemplate: 'appLayout',

	// Our 404 page
	notFoundTemplate: 'appNotFound',

	// The loading page to show while we wait on the waitOn function below
	loadingTemplate: 'appLoading',

	// Wait on the subscriptions below before rendering the page
	waitOn: function() {
		return [
			Meteor.subscribe('activeQuiz')
		];
	}
});

// Limit the access users have before logging in
Router.onBeforeAction(function(){
	if(!Meteor.userId())
	{
		// If they aren't logged in, render the home page
		// TODO: make a login page annoucing the need to log in
		this.render('appHome');
	}
	else
	{
		// Otherwise keep going with the route
		this.next();
	}
}, {except: ['appLoading, appNotFound, appHome']}
);

// Home route
Router.route('/', {
	// Route name for reference in templates and helpers
	name: 'app-home',
	// The name of the template to render
	template: 'appHome',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render('appHome');
	}
});


// For finding a new quiz partner
Router.route('/newquiz', {
	// Route name for reference in templates and helpers
	name: 'find-quiz-partner',
	// The name of the template to render
	template: 'findQuizPartner',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});

// For taking a quiz
Router.route('/quiz/:_id', {
	name: 'take-quiz',
	template: 'takeQuiz',
	// Give the quiz document as the data context
	data: function() {
		return ActiveQuizzes.findOne({_id: this.params._id});
	},
	action: function() {
		this.render();
	}
});


// For testing the loading page
Router.route('/loading', {
	// Route name for reference in templates and helpers
	name: 'loading',
	// The name of the template to render
	template: 'appLoading',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});

/*
// For quiz results
Router.route('/quiz/:_id/results', function() {
	this.render('quizResults', {
	// Pass along the quiz results data
	// May not be needed if we use a Meteor method
	data: function() {
		// Some function to pass along the quiz results
		getQuizResults(this.params._id);
	}
	})
});

*/