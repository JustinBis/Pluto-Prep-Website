//
// All collection definitions and defaults
// should be contained here
//


////////////////////////////////////////
// Users searching for a quiz partner //
////////////////////////////////////////
QuizSeekers = new Meteor.Collection('quizseekers');


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
ActiveQuizzes = new Meteor.Collection('activequizzes');


////////////////////
// Quiz questions //
////////////////////
Questions = new Meteor.Collection('questions');