/*
 * These methods should be shared on the client and server so the client
 * can take advantage of Meteor's latency compensation
 * These methods should all be public logic since they are shared in source with the client
 */

Meteor.methods({
	// Update a specific quiz question
	updateQuestion: function(questionId, data){
		// Make sure this user is logged in and has permission to edit questions


		// Update the question
		Questions.update({_id: questionId}, {$set: 
			{
				question: data.question,
				a: data.a,
				b: data.b,
				c: data.c,
				d: data.d,
				short_explanation: data.short_explanation,
				long_explanation: data.long_explanation
			}
		});

		// This function returns nothing
		return null;
	}
})