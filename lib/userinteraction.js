// Global User Interaction helper for tracking user stats

UserInteraction = {
	// When a user answers a question, keep track of the necessary information.
	// TODO: keep track of how long the user took to answer this question
	questionAnswered: function(user_id, question_id, user_answer, correct) {
		var question = Questions.findOne({_id: question_id});
		var date = new Date();

		// TODO: add passage vs discrete field, and a flagged/starred field
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

	// Total number of questions in our questions collection
	totalQuestions: function() {
		return Questions.find().count();
	},

	// Total number of questions completed for a particular user
	questionsCompTotal: function(user_id) {
		return QuestionTracker.find({uid: user_id}).count();
	},

	// Number of questions completed for a particular user by subject
	questionsCompSubject: function(user_id, subject) {
		return QuestionTracker.find({uid: user_id, subj: subject}).count();
	},

	// Number of questions completed for a particular user by subcategory
	questionsCompSubcat: function(user_id, subcategory) {
		return QuestionTracker.find({uid: user_id, subc: subcategory}).count();
	},

	// Total percent of questions answered correctly out of questions answered.
	percentCorrectTotal: function(user_id, weeksAgo) {
		// No weeks specified, gather all data
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
		console.log("date = " + today);
		var numCorrect = QuestionTracker.find({
			uid: user_id,
			cor: true,
			date: {"$gte" : today}}).count();
		console.log("numCorrect = " + numCorrect);
		var quesAnswered = questionsCompTotal(user_id);
		return (numCorrect/quesAnswered) * 100;
	},

	// Total percent of questions answered correctly out of questions answered.
	percentCorrectSubject: function(user_id, subject) {
		var numCorrect = QuestionTracker.find({uid: user_id, cor: true, subj: subject});
		var quesAnswered = questionsCompTotal(user_id);
		return (numCorrect/quesAnswered) * 100;
	},

	// Total percent of questions answered correctly out of questions answered.
	percentCorrectSubcat: function(user_id, subcategory) {
		var numCorrect = QuestionTracker.find({uid: user_id, cor: true, subc: subject});
		var quesAnswered = questionsCompTotal(user_id);
		return (numCorrect/quesAnswered) * 100;
	},


}
