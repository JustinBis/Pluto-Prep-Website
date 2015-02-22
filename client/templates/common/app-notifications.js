// Time in ms before showing connection errors
var CONNECTION_CHECK_TIMEOUT = 5000

Meteor.startup(function(){
	// Give the app 5 seconds before showing connection issues
	Meteor.setTimeout(function() {
		Session.set('checkConnected', true);
	}, CONNECTION_CHECK_TIMEOUT);
});


Template.appNotifications.helpers({
	connected: function() {
		if(Session.get('checkConnected'))
		{
			return Meteor.status().connected;
		}
		else
		{
			return true;
		}
	}
});