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
	// No longer used since we now use subscriptions instead of waitOn
	// loadingTemplate: 'appLoading',

	// Subscribe to the data we need to run the site
	subscriptions: function() {
		return [
			Meteor.subscribe('activeQuizzes'),
			// TODO: Make sure only admins can see questions and daily quizzes
			Meteor.subscribe('questions'),
			Meteor.subscribe('dailyQuizzes')
		];
	}
});

// Limit the access users have before logging in
Router.onBeforeAction(function(){
	if(!Meteor.userId())
	{
		// If they aren't logged in, render the home page
		// TODO: make a login page annoucing the need to log in
		// and use this.render('appHome') to render the home page. Since routes are reactive,
		// when the user logs in, the route will be invalidated and reevauluated so that
		// they are correctly routed after logging in
		this.redirect('app-home');
	}
	else
	{
		// Otherwise keep going with the route
		this.next();
	}
}, {except: ['app-loading', 'app-not-found', 'app-home']}
);

// Home Route
Router.route('/', {
	// Route name for reference in templates and helpers
	name: 'app-home',
	// The name of the template to render
	template: 'appHome',
	// Action to take when this route is called
	action: function() {
		// If the user is logged in, skip to the subject select
		if(Meteor.userId())
		{
			console.log("user logged in, should route to new quiz!")
			this.redirect('quiz-select-subject');
		}

		// Render the registered template
		this.render();
	}
});

Router.route('/dashboard', {
	name: 'app-dashboard',
	template:'appDashboard',
	action: function() {
		this.render();
	}
})


// For finding a new quiz partner
Router.route('/newquiz/:subject', {
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

Router.route('/newquiz', {
	// Route name for reference in templates and helpers
	name: 'quiz-select-subject',
	// The name of the template to render
	template: 'quizSelectSubject',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});


// Daily quiz creation page
Router.route('/dailyquiz/:subject', {
	// Route name for reference in templates and helpers
	name: 'create-daily-quiz',
	// The name of the template to render
	template: 'createDailyQuiz',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});


// Route for quiz results
Router.route('/quiz/:_id/results', {
	name: 'quiz-results',
	template: 'quizResults',
	// Give the quiz document as the data context
	data: function() {
		return Quizzes.findOne({_id: this.params._id});
	},
	action: function() {
		this.render();
	}
});

// For taking a quiz
Router.route('/quiz/:_id/:question_number', {
	name: 'take-quiz',
	template: 'takeQuiz',
	// Give the quiz document as the data context
	data: function() {
		return Quizzes.findOne({_id: this.params._id});
	},
	action: function() {
		this.render();
	}
});

// Redirect to a numbered quiz path
// Give question_number a default value of 1 if omitted in the path
Router.route('/quiz/:_id', function() {
	var quiz_id = this.params._id;
	this.redirect('take-quiz', {_id: quiz_id, question_number: 1});
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
 * Admin Routes
 * TODO: Make sure the user is an admin to see these pages
 * This could be enforeced with route controllers or an onBeforeAction
 */

Router.route('/admin/question/:_id/edit', {
	name: 'admin-question-edit',
	template: 'adminQuestionEdit',
	data: function() {
		// We don't want reactivity while editing this question
		return Questions.findOne({_id: this.params._id});
	},
	action: function() {
		this.render();
	}
});

// Old admin routes

// For seeing all questions and how they're formatted
Router.route('/admin/questions/:subject', {
	// Route name for reference in templates and helpers
	name: 'admin-question-review',
	// The name of the template to render
	template: 'adminQuestionReview',
	// Pass along all of the questions
	data: function() {
		return Questions.find({subject: this.params.subject});
	},
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});

// For editing questions
Router.route('/admin/questions/:subject/edit', {
	name: 'admin-subject-edit',
	template: 'adminSubjectEdit',
	data: function() {
		return Questions.find({subject: this.params.subject});
	},
	action: function() {
		this.render();
	}
});


// For adding and viewing daily quizzes
Router.route('/admin/dailyquiz', {
	name: 'admin-daily-quiz',
	template: 'adminDailyQuiz',
	data: function() {
		// Expose all daily quizzes to the admin page
		return DailyQuizzes.find();
	},
	action: function() {
		this.render();
	}
});

// For adding questions to collection
Router.route('/admin/addquestion', {
	name: 'admin-add-question',
	template: 'adminAddQuestion',
	action: function() {
		this.render();
	}
});

// FIN