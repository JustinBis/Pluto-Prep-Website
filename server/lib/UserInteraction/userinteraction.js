// Global User Interaction helper for tracking user stats

UserInteraction = {
	questionAnswered: function(user_id, question_id, user_answer, correct) {
		var question = Questions.findOne({_id: question_id});
		var date = new Date();

		// TODO: add passage vs discrete field, and tag along passage ID
		// for each question
		QuestionTracker.insert({
			uid: user_id,
			qid: question_id,
			ans: user_answer,
			cor: correct,
			subj: question.subject,
			subc: question.subcategory,
			date: date
		});
	},

	// TODO: Keep track of total points and total % correct per quiz,
	// check isQuizFinished code to see if you can add this 
	quizTaken: function() {

	},

	// TODO: implement code to grab analytical data to be displayed to
	// dashboard

}
