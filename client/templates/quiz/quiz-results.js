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
	}
});