Template.appNotifications.helpers({
	connected: function() {
		return Meteor.status().connected;
	}
})