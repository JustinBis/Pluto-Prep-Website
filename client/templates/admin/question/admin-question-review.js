
// When the quiz template is rendered, start the quiz timer on the server
Template.adminQuestionReview.rendered = function(){
	// if there is a valid quiz
	console.log(this)
	if(this.data && this.data._id)
	{
		console.log("Here!")
	}
}