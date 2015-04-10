// How much time to give each quiz, in milliseconds
var QUIZ_TIME = 6 * 60 * 1000;

/*
 *
 * Common Quiz Helper Functions
 * 
 */

/**
 * Moves to the specified question or will move on 
 * to the results page if the number is higher than the
 * actual number of questions in the quiz
 */
var goToQuestion = function(number) {
	if(typeof(number) !== Number)
	{
		number = Number(number);
	}

	var quiz_id = Router.current().params._id;
	// Is this beyond the final question?
	if(number > Router.current().data().num_questions)
	{
		// TODO: Mark player 1 as done
		// Meteor.call('quizPlayerFinished')
		Router.go('quiz-results', {_id: quiz_id});
	}
	// If the number is negative, we have an error
	else if(number < 0)
	{
		console.error("Error: negative number given to function goToQuestion");
		return;
	}
	// Otherwise move on to the next question
	else
	{
		Router.go('take-quiz', {_id: quiz_id, question_number: number});
	}
}


/**
 * Moves on to the next question if there is one
 * or will move on to the results page if there are no more questions
 */
var goToNextQuestion = function() {
	var quiz_id = Router.current().params._id;
	// Go to the next question number
	var number = Router.current().params.question_number;
	// The params are strings, so convert to a number for adding
	// and add 1 to the number to refer to the next question
	number = Number(number) + 1;

	// Go to that question
	goToQuestion(number);
}

/**
 * Finds out which player we are in the quiz
 * returns "p1" or "p2" or null on failure
 */
var getPlayerNumber = function() {
	var data = Router.current().data();
	if(data && Meteor.userId() === data.p1_id)
	{
		return 'p1';
	}
	else if(data && Meteor.userId() === data.p2_id)
	{
		return 'p2';
	}
	else
	{
		console.error("Error: Failed to figure out which player we are in this quiz.");
		return null;
	}
}

/**
 * Finds out which player the opponent is in the quiz
 * returns "p1" or "p2" or null on failure
 */
var getOpponentNumber = function() {
	var data = Router.current().data();
	if(data && Meteor.userId() === data.p1_id)
	{
		// We are p1, so they are p2
		return 'p2';
	}
	else if(data && Meteor.userId() === data.p2_id)
	{
		// We are p2, so they are p1
		return 'p1';
	}
	else
	{
		console.error("Error: Failed to figure out which player the opponent is in this quiz.");
		return null;
	}
}

/**
 * Finds out if the passed player answered the passed question correctly
 * returns "correct" if they did, "wrong" if the were wrong, and null if they haven't answered yet
 * @params player A string representing the player number
 * @params question a reference to the question data object (must contain an answer and a player answer)
 */
var didPlayerAnswerCorrectly = function(player, question)
{
	var player_answer = player+'_answer';

	// Did the player not answer yet?
	if(!question[player_answer])
	{
		return null;
	}
	// Did this player answer this question correctly?
	else if(question.answer === question[player_answer])
	{
		return "correct";
	}
	// Otherwise, they were wrong
	else
	{
		return "wrong";
	}
}


// When the question template is created, create the reactive variables
Template.takeQuiz.created = function() {
	// Create the reactive state variables
	this.quizTimeRemaining = new ReactiveVar();
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

		var player = getPlayerNumber()+'_answer';
		return data.questions[questionNumber][player];
	},
	// Returns correct if this user answered the question correctly
	// returns "wrong" if this user answered the question incorrectly
	// returns nothing if this user hasn't yet answered the question
	wasQuestionAnsweredCorrectly: function() {
		return didPlayerAnswerCorrectly(getPlayerNumber(), this);
	},
	opponentQuestionAnsweredCorrectly: function() {
		return didPlayerAnswerCorrectly(getOpponentNumber(), this);
	}
});


// Helpers for the question templates
Template.questionTemplate.helpers({
	// Returns "correct" if the given letter was the answer
	// returns "wrong" if the user answerd that letter, but it was incorrect
	// otherwise returns nothing
	isAnswer: function(letter) {
		// Which player are we?
		var player_answer = getPlayerNumber()+'_answer';
		
		// Has this player answered yet?
		if(!this[player_answer])
		{
			// If they haven't anwered, don't give away the answer early
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
	// Returns correct if this user answered the question correctly
	// returns "wrong" if this user answered the question incorrectly
	// returns nothing if this user hasn't yet answered the question
	wasQuestionAnsweredCorrectly: function() {
		return didPlayerAnswerCorrectly(getPlayerNumber(), this);
	}
});

// Event handlers for the question templates
Template.questionTemplate.events({
	// Check answers on the server
	"click .question-answers > li": function (event) {
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
		});
	},
	// Go to the next question
	"click .next-question-button": function(event) {
		// What question number is this button on?
		var number = this.number;
		number = Number(number) + 1;
		goToQuestion(number);
	}
});