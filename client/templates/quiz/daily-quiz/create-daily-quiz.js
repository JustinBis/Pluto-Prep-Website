
// When the template is first created (run once)
Template.createDailyQuiz.created = function() {
	// Create the reactive state variables
	this.progress = new ReactiveVar();
	this.quizId = new ReactiveVar();
}


Template.createDailyQuiz.rendered = function() {
	// Save the subject from the URL
	var subject = Router.current().params.subject;

	this.progress.set('Loading Quiz...');

	// Store the template context for use in the callback
	var self = this;
	// Call the server-side quiz creation function
	Meteor.call('createDailyQuiz', subject, function(err, result) {
		if(err)
		{
			Session.set('server-error', err.reason);
			console.error("Error calling createQuiz: " + err.reason);
			return;
		}

		// If the resultant quizId wasn't set correctly
		if(!result)
		{
			Session.set('server-error', "Failed to create a new quiz");
			console.error("createDailyQuiz: quizId not set, unable to route to quiz.");
			return;
		}

		// Otherwise, redirect to the quiz
		//Router.go('/quiz/' + result);
		// So we can edit the page, just store the quiz id and allow it
		// to be accessed by a button
		self.quizId.set(result);
	});
}

Template.createDailyQuiz.events({
	// When the take a quiz now button is clicked, redirect
	"click #take-quiz-button": function () {
		Router.go('take-quiz', {_id: Template.instance().quizId.get(), question_number: 1});
	}
});

Template.createDailyQuiz.helpers({
	quizId: function() {
		return Template.instance().quizId.get();
	},
	progress: function() {
		return Template.instance().progress.get();
	},
	error: function () {
		return Session.get('server-error');
	}
})