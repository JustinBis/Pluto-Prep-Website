//
// All collection definitions and defaults
// should be contained here
//

//////////////////////////////
// Currently Active Quizzes //
//////////////////////////////
/*
	Should contain the following fields:
	player1Id: the Meteor userId of player1
	player2Id: the Meteor userId of player2
	// TODO: track question progress
	// maybe with player1Questions: ['a', '', 'a', 'd', 'c', '']
	// with the index being question# and the letter being the given answer
	// and empty strings marking unanswered questions
*/
Quizzes = new Mongo.Collection('quizzes');


////////////////////
// Quiz questions //
////////////////////
Questions = new Mongo.Collection('questions');


///////////////////
// Daily Quizzes //
///////////////////
/*
	Stores the quizzes for each day
	These are then copied into the quizzes collection when a user takes a quiz
	These should only be published to admins
*/
DailyQuizzes = new Mongo.Collection('daily-quizzes');