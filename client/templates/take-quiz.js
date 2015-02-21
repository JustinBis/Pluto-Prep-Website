// How much time to give each quiz, in milliseconds
var QUIZ_TIME = 6 * 60 * 1000;

// When the question template is created, create the reactive variables
// and helper functions
Template.takeQuiz.created = function() {
	// Create the reactive state variables
	this.quizTimeRemaining = new ReactiveVar();
	// Will be called when the quiz is finished
	this.quizFinished = function() {
		// TODO: route to the results page
		//Router.go()
	}
}

// When the quiz template is rendered, start the quiz timer on the server
Template.takeQuiz.rendered = function(){
	// if there is a valid quiz
	if(this.data && this.data._id)
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
				// Call the quizFinished function (registered in template creation)
				this_template.quizFinished();
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
	// Establish a reactive dependency on the question number in the URL
	// that allows us to animate the questions
	questionContainerScroll: function() {
		// The question number from the URL parameter
		var number = Iron.controller().getParams().question_number;

		// Return the scroll amount as a percentage
		var percent = (number - 1) * 100;
		return "right:" + String(percent) + "%;";
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
	// The seconds remaining in the quiz without the minutes component
	secondsRemaining: function() {
		var time = Template.instance().quizTimeRemaining.get();
		time = parseInt((time / 1000) % 60, 10);
		// If there is <10 seconds left, add a leading 0
		if(time < 10)
		{
			time = "0" + String(time);
		}
		return time;
	},
	// The number of minutes remaining in the quiz without the seconds component
	minutesRemaining: function() {
		var time = Template.instance().quizTimeRemaining.get();
		return parseInt((time / 1000 / 60), 10);
	},
	// Returns the current player's progress in the quiz for the given question
	// Will return "correct", "wrong", or null
	myProgress: function(questionNumber) {
		// Make sure we were given a question number
		if(!questionNumber)
		{
			return null;
		}

		// Lower the question number by one, since the questions are 0 indexed in the data
		questionNumber = questionNumber - 1;

		var data = Template.instance().data;
		if(data && Meteor.userId() === data.p1_id)
		{
			// May not be defined
			return data.questions[questionNumber]['p1_answer'];
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			// May not be defined
			return data.questions[questionNumber]['p2_answer'];
		}

		// Otherwise null
	},
	// Returns correct if this user answered the question correctly
	// returns "wrong" if this user answered the question incorrectly
	// returns nothing if this user hasn't yet answered the question
	wasQuestionAnsweredCorrectly: function() {
		// Which player are we?
		var player_answer = null;
		// Grab the data from the parent
		var data = Template.parentData(1);
		if(data && Meteor.userId() === data.p1_id)
		{
			player_answer = 'p1_answer';
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			player_answer = 'p2_answer';
		}

		// Did the player not answer yet?
		if(!this[player_answer])
		{
			return null;
		}
		// Did this player answer this question correctly?
		else if(this.answer === this[player_answer])
		{
			return "correct";
		}
		// Otherwise, they were wrong
		else
		{
			return "wrong";
		}
	},
	opponentQuestionAnsweredCorrectly: function() {
		// Which player are we?
		var player_answer = null;
		// Grab the data from the parent
		var data = Template.parentData(1);
		// Show the other player's progress
		if(data && Meteor.userId() === data.p1_id)
		{
			player_answer = 'p2_answer';
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			player_answer = 'p1_answer';
		}

		// Did the player not answer yet?
		if(!this[player_answer])
		{
			return null;
		}
		// Did this player answer this question correctly?
		else if(this.answer === this[player_answer])
		{
			return "correct";
		}
		// Otherwise, they were wrong
		else
		{
			return "wrong";
		}
	}
});


// When the question template is created, create the reactive variables
Template.questionTemplate.created = function() {
	// No variables needed yet
}

// Helpers for the question templates
Template.questionTemplate.helpers({
	result: function() {
		return Template.instance().data.result;
	},
	// Returns "correct" if the given letter was the answer
	// returns "wrong" if the user answerd that letter, but it was incorrect
	// otherwise returns nothing
	isAnswer: function(letter) {
		// Which player are we?
		var player_answer = null;
		// Grab the data from the parent
		var data = Template.parentData(1);
		if(data && Meteor.userId() === data.p1_id)
		{
			player_answer = 'p1_answer';
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			player_answer = 'p2_answer';
		}

		// Has this player answered yet?
		if(!this[player_answer])
		{
			// If they haven't anwered
			// don't give away the answer early
			return null;
		}

		// Is this the right answer?
		if(letter === this.answer)
		{
			return "correct";
		}

		// Did this player answer this question with the passed letter?
		if(letter === this[player_answer])
		{
			return "wrong";
		}
	},
	// Should we show the left nav button
	// Will return false for the first question
	showLeftNav: function(number) {
		if(number <= 1)
		{
			return false;
		}
		return true;
	},
	// Returns the current player's progress in the quiz for the given question
	// Will return "correct", "wrong", or null
	// Same as the takeQuiz myProgress helper, but with an updated data context
	myProgress: function(questionNumber) {
		// Make sure we were given a question number
		if(!questionNumber)
		{
			return null;
		}

		// Lower the question number by one, since the questions are 0 indexed in the data
		questionNumber = questionNumber - 1;

		// Grab the data from the parent takeQuiz template
		var data = Template.parentData(1);
		if(data && Meteor.userId() === data.p1_id)
		{
			// May not be defined
			return data.questions[questionNumber]['p1_answer'];
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			// May not be defined
			return data.questions[questionNumber]['p2_answer'];
		}

		// Otherwise null
	},
	wasQuestionAnsweredCorrectly: function() {
		// Which player are we?
		var player_answer = null;
		// Grab the data from the parent
		var data = Template.parentData(1);
		if(data && Meteor.userId() === data.p1_id)
		{
			player_answer = 'p1_answer';
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			player_answer = 'p2_answer';
		}

		// Did the player not answer yet?
		if(!this[player_answer])
		{
			return null;
		}
		// Did this player answer this question correctly?
		else if(this.answer === this[player_answer])
		{
			return "correct";
		}
		// Otherwise, they were wrong
		else
		{
			return "wrong";
		}
	}
});

// Event handlers for the question templates
Template.questionTemplate.events({
	// Check answers on the server
	"click .question-answers > li": function (event) {
		// Cache this template instance for use in the callback
		var this_template = Template.instance();

		// Make sure we haven't already submitted this answer
		// Which player are we?
		var player_num = null;
		// Grab the data from the parent
		var data = Template.parentData(1);
		// Show the other player's progress
		if(data && Meteor.userId() === data.p1_id)
		{
			player_answer = 'p2_answer';
		}
		else if(data && Meteor.userId() === data.p2_id)
		{
			player_answer = 'p1_answer';
		}
		if(this_template.data.player_num)
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
			// The result is also in the quiz data now, so we can ignore the return value here
		});
	},
	// Go to the next question
	"click .next-question-button": function(event) {
		var quiz_id = Iron.controller().getParams()._id;
		// Go to the next question number
		var number = this.number + 1;

		Router.go('take-quiz', {_id: quiz_id, question_number: number});
	},
	// Clicking the next question nav button
	"click .question-nav-next": function(event) {
		var quiz_id = Iron.controller().getParams()._id;

		// The current center question number
		var question_number = Iron.controller().getParams().question_number;
		// The question number of the clicked template
		var number = this.number;

		if(question_number == number)
		{
			// Go to the next question
			Router.go('take-quiz', {_id: quiz_id, question_number: number + 1});
		}
		// Otherwise pull this template into the view
		else
		{
			Router.go('take-quiz', {_id: quiz_id, question_number: number});
		}
	},
	// Clicking the prev question nav button
	"click .question-nav-prev": function(event) {
		var quiz_id = Iron.controller().getParams()._id;

		// The current center question number
		var question_number = Iron.controller().getParams().question_number;
		// The question number of the clicked template
		var number = this.number;

		if(question_number == number)
		{
			// Go to the next question
			Router.go('take-quiz', {_id: quiz_id, question_number: number - 1});
		}
		// Otherwise pull this template into the view
		else
		{
			Router.go('take-quiz', {_id: quiz_id, question_number: number});
		}
	}
});

Template.quizEndCard.events({
	// The previous question button
	"click .question-nav-prev": function(event) {
		var quiz_id = Iron.controller().getParams()._id;
		var question_number = Iron.controller().getParams().question_number;

		// Find the final question of the quiz
		var questions = Template.parentData(1).questions;
		// Get the question number of the last element
		var number = questions[questions.length - 1].number;

		// If we clicked the arrow while still looking at the last question
		// i.e. the quizEndCard is still off screen
		if(question_number == number)
		{
			// Go to the end card, which is the question number after the last question
			Router.go('take-quiz', {_id: quiz_id, question_number: number + 1});
		}
		else
		{
			// Go to that final question
			Router.go('take-quiz', {_id: quiz_id, question_number: number});
		}
	},
	// When the take a quiz now button is clicked, redirect
	"click #go-to-results-button": function () {
		var quiz_id = Iron.controller().getParams()._id;
		Router.go('quiz-results', {_id: quiz_id});
	}
});