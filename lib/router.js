//
// All routes and routing settings will go here
//

// Home route
Router.route('/', {
	// Route name for reference in templates and helpers
	name: 'app-home',
	// The name of the template to render
	template: 'appHome',
	// Action to take when this route is called
	action: function() {
		// Render the registered template
		this.render();
	}
});

/*
// For finding a new quiz partner
Router.route('/newquiz', function() {
	this.render('findQuizPartner');
});

// For taking a quiz
Router.route('/quiz/:_id', function() {
	this.render('takeQuiz', {
		// Pass along the quiz data
		// May not be needed, if the quizzes are published
		// and we have a Meteor method to select questions
		data: function() {
			// Some function to get the quiz data
			getQuizData();
		}
	});
});

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