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

	// TODO: implement code to grab analytical data to be displayed to
	// dashboard

	// Total number of questions in our questions collection
	totalQuestions: function() {
		return Questions.find().count();
	},

	// Total number of questions completed for current user
	questionsCompTotal: function() {
		return QuestionTracker.find().count();
		// return QuestionTracker.find().count();
	},

	// Number of questions completed for current user by subject
	questionsCompSubject: function(subject) {
		return QuestionTracker.find({subj: subject}).count();
	},

	// Number of questions completed for current user by subcategory
	questionsCompSubcat: function(subcategory) {
		return QuestionTracker.find({subc: subcategory}).count();
	},

	// Total percent of questions answered correctly out of questions answered.
	percentCorrect: function(weeksAgo, subject, subcategory) {
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
		var quesAnswered = UserInteraction.questionsCompTotal();
		// Subject field filled
		if (subject !== "Subject") 
		{
			// Subcategory field also filled
			if (subcategory !== "Subcategory") 
			{
				var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
			}
			// Only subject field filled
			else {
				var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
			}
		}
		// Subject field empty, subcategory field filled
		else if (subcategory !== "Subcategory") 
		{
			var numCorrect = QuestionTracker.find({
					cor: true,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
		}
		// Both fields empty, query for date only
		else 
		{
			var numCorrect = QuestionTracker.find({
				cor: true,
				date: {"$gte" : today}}).count();
			var quesAnswered = UserInteraction.questionsCompTotal();
			return (numCorrect/quesAnswered) * 100;
		}
	},

	quizScoreTotal: function() {
		var quizzes = Quizzes.find().fetch();
		var total = 0;
		for (i = 0; i < quizzes.length; i++) {
			total += quizzes[i].total;
		}
		return total;
	},
}
