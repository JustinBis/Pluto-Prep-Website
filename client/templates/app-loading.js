/*
// Note: this doesn't work
Template.appLoading.rendered = function() {
	this.find('.app-loading')._uihooks = {
		insertElement: function(node, next) {
			console.log("YEAH");
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn(function () {
					//
				});
		},
		removeElement: function(node) {
			console.log("BYYYYYYE");
			$(node).fadeOut(function(){
				$(this).remove();
			})
		}
	};
};
*/