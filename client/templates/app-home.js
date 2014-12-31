
if(Meteor.isClient)
{
	Template.appHome.events({
		// When the take a quiz now button is clicked, redirect
		"click #jumbotron-take-quiz-button": function () {
			Router.go('/newquiz');
		}
	});
}
