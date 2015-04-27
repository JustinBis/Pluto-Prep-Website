Template.quizResults.helpers({
	// Returns "correct" if the given letter was the answer for this question
	// returns "wrong" if this user answered with the given letter and was wrong
	// Used for classing the answer choices with correct and wrong markers
	isAnswer: function(letter) {
		// Is this the right answer?
		if(letter === this.answer)
		{
			return "correct";
		}
		
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
	// Returns true if this player won
	thisPlayerWon: function() {
		// If this player's score is higher than the opponents score, return true
		var numQuestions = this.questions.length;
		var p1_score = 0, p2_score = 0;
		for(var i = 0; i < numQuestions; i++)
		{
			var question = this.questions[i];
			if(question.answer == question.p1_answer)
			{
				p1_score += 1;
			}
			if(question.answer == question.p2_answer)
			{
				p2_score += 1;
			}
		}

		// Who are we?
		if(Meteor.userId() === this.p1_id)
		{
			// We're player 1
			return p1_score > p2_score;
		}
		else if(Meteor.userId() === this.p2_id)
		{
			// We're player 2
			return p1_score < p2_score;
		}
	},
	// Returns true if this quiz ended in a tie
	thisQuizWasATie: function() {
		// If both players' scores match, return true
		return false;
	},
	myScore: function() {
		var numQuestions = this.questions.length;
		var p1_score = 0, p2_score = 0;
		for(var i = 0; i < numQuestions; i++)
		{
			var question = this.questions[i];
			if(question.answer == question.p1_answer)
			{
				p1_score += 1;
			}
			if(question.answer == question.p2_answer)
			{
				p2_score += 1;
			}
		}

		// Who are we?
		if(Meteor.userId() === this.p1_id)
		{
			// We're player 1
			return p1_score;
		}
		else if(Meteor.userId() === this.p2_id)
		{
			// We're player 2
			return p2_score;
		}
	},
	opponentScore: function () {
		var numQuestions = this.questions.length;
		var p1_score = 0, p2_score = 0;
		for(var i = 0; i < numQuestions; i++)
		{
			var question = this.questions[i];
			if(question.answer == question.p1_answer)
			{
				p1_score += 1;
			}
			if(question.answer == question.p2_answer)
			{
				p2_score += 1;
			}
		}

		// Who are we?
		if(Meteor.userId() === this.p1_id)
		{
			// We're player 1, so return player 2
			return p2_score;
		}
		else if(Meteor.userId() === this.p2_id)
		{
			// We're player 2, so return player 1
			return p1_score;
		}
	},
	howYouDid: function () {
		// If this player's score is higher than the opponents score, return true
		var numQuestions = this.questions.length;
		var p1_score = 0, p2_score = 0;
		for(var i = 0; i < numQuestions; i++)
		{
			var question = this.questions[i];
			if(question.answer == question.p1_answer)
			{
				p1_score += 1;
			}
			if(question.answer == question.p2_answer)
			{
				p2_score += 1;
			}
		}

		// Who are we?
		var myScore;
		if(Meteor.userId() === this.p1_id)
		{
			// We're player 1
			myScore = p1_score;
		}
		else if(Meteor.userId() === this.p2_id)
		{
			// We're player 2
			myScore = p2_score;
		}

		if(myScore >= 4)
		{
			return "Nice!";
		}
		else
		{
			return ":(";
		}
	},
	myPoints: function() {
		var numQuestions = this.questions.length;
		var p1_points = 0, p2_points = 0;
		for(var i = 0; i < numQuestions; i++)
		{
			var question = this.questions[i];
			if(question['p1_points'])
			{
				p1_points += question['p1_points'];
			}
			if(question['p2_points'])
			{
				p2_points += question['p2_points'];
			}
		}

		// Who are we?
		if(Meteor.userId() === this.p1_id)
		{
			// We're player 1
			return p1_points;
		}
		else if(Meteor.userId() === this.p2_id)
		{
			// We're player 2
			return p2_points;
		}
	}
});

// Quiz template event listeners
Template.quizResults.events({
	// If there is an error loading the quiz and the user clicks the go back button
	"click #play-again-button": function(event) {
		Router.go('quiz-select-subject');
	}
});