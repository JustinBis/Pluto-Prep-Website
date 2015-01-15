// How much time to give each quiz, in milliseconds
var QUIZ_TIME = 1 * 60 * 1000;

// When the question template is created, create the reactive variables
Template.takeQuiz.created = function() {
	// Create the reactive state variables
	this.quizTimeRemaining = new ReactiveVar();
}

// When the quiz template is rendered, start the quiz timer on the server
Template.takeQuiz.rendered = function(){
	// if there is a valid quiz
	if(this.data._id)
	{
		// Cache this template instance for use in callbacks and anon functions
		var this_template = this;

		var quiz_id = this.data._id;

		var quiz_time = QUIZ_TIME;

		Meteor.call('startQuiz', quiz_id, quiz_time, function(err, result) {
			if(err)
			{
				Session.set('serverError', err.reason);
				console.error("Error calling startQuiz: " + err.reason);
				return;
			}

			console.log("Quiz started at time " + result.time_start);
			console.log(result);

			var localTime = (new Date()).getTime();
			console.log("Local time " + localTime);

			// TODO: Make sure to show the correct time remaining
			// so it's still right if a user refreshes the page
			
		});

		// Set up the quiz timer to end after the quiz time has elapsed
		this.quizTimeRemaining.set(quiz_time);

		// Set the quiz timer on an interval to count down every second
		var this_interval = Meteor.setInterval(function(){
			this_template.quizTimeRemaining.set(
				this_template.quizTimeRemaining.get() - 1000
			);

			// Clear the interval if we're at 0 milliseconds remaining or less
			if(this_template.quizTimeRemaining.get() <= 0)
			{
				Meteor.clearInterval(this_interval);
			}
		}, 1000);
	}
}

// Quiz template event listeners
Template.takeQuiz.events({
	// If there is an error loading the quiz and the user clicks the go back button
	"click #new-quiz-button": function(event) {
		console.log("Clicked");
		Router.go('find-quiz-partner');
	}
});

// Helpers for the quiz template
Template.takeQuiz.helpers({
	serverError: function() {
		return Session.get('serverError');
	},
	// Returns true if the quiz time is up
	timeUp: function() {
		var time = Template.instance().quizTimeRemaining.get();
		if(time > 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	},
	secondsRemaining: function() {
		var time = Template.instance().quizTimeRemaining.get();
		return parseInt((time / 1000) % 60, 10);
	},
	minutesRemaining: function() {
		var time = Template.instance().quizTimeRemaining.get();
		return parseInt((time / 1000 / 60), 10);
	}
})


// When the question template is created, create the reactive variables
Template.questionTemplate.created = function() {
	// Create the reactive state variables
	this.result = new ReactiveVar();
}

// Helpers for the question templates
Template.questionTemplate.helpers({
	result: function() {
		return Template.instance().result.get();
	}
});

// Event handlers for the question templates
Template.questionTemplate.events({
	// Check answers on the server
	"click .question-answers > li": function (event) {
		// Cache this template instance for use in the callback
		var this_template = Template.instance();

		// Make sure we haven't already submitted this answer
		if(this_template.result.get())
		{
			// Don't run this method on any template twice
			return;
		}

		// Grab the quiz id from the parent's data contect
		var quiz_id = Template.parentData(1)._id;
		// Find out which answer letter was clicked
		var letter = $(event.currentTarget).attr("data-answer")
		// Get the id of this question
		var question_id = this._id;
		
		// Ask the server if this is the right answer
		Meteor.call('checkQuizAnswer', quiz_id, question_id, letter, function(err, result) {
			if(err)
			{
				Session.set('serverError', err.reason);
				console.error("Error calling checkQuizAnswer: " + err.reason);
				return;
			}
			if(!result)
			{
				Session.set('serverError', "The server failed to check your quiz answer");
				console.error("Error calling checkQuizAnswer: result never sent.");
				return;
			}

			// If the answer was right
			if(result.correct === true)
			{
				// Set the template result to correct
				this_template.result.set("correct");

			}
			// Otherwise mark the answer as wrong 
			// and highlight the correct answer
			else
			{
				// Set the template result to wrong
				this_template.result.set("wrong");
				// Highlight the correct answer
				// Get the <li> target, Go to the parent <ul>, and then filter the children 
				$(event.currentTarget)
					.parent()
					.children('li[data-answer="'+ result.answer + '"]')
					.addClass('correct');
			}

			// Move on to the next question automatically
			// TODO
		});
	}
})