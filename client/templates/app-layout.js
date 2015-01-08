Template.appLayout.rendered = function() {
	this.find('#content-container')._uihooks = {
		insertElement: function(node, next) {
			console.log("Hello!");
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn(2000, function () {
					//listFadeInHold.release();
				});
		},
		removeElement: function(node) {
			console.log("Bye!");
			$(node).fadeOut(2000, function() {
				$(this).remove();
			});
		}
	};
};