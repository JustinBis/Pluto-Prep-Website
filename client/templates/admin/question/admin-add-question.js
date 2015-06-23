// Function that creates an option for <select>.
var createOption = function (value, text) {
        var opt = document.createElement('option');
        opt.value = value;
        opt.text = text;
        return opt;
    };

Template.adminAddQuestion.events({
	// Handling when admin changes subject
	'change #subject' : function (e, tmpl){
		var subject = $('#subject :selected').val();
		console.log(subject);
		$('#subcategories').find('option').remove().end()
		$("#subcategories").append("<option value=\"1a\">1A: Proteins and Amino Acids: Structure and Function</option>");
		switch (subject) {
			case 'fc1':
				$("#subcategories").show();
				break;
			case 'fc2':
				$("#fc2subc").show();
				break;
			case 'fc3':
				$("#fc3subc").show();
				break;
			case 'fc4':
				$("#fc4subc").show();
				break;
			case 'fc5':
				$("#fc5subc").show();
				break;
			case 'fc6':
				$("#fc6subc").show();
				break;
			case 'fc7':
				$("#fc7subc").show();
				break;
			case 'fc8':
				$("#fc8subc").show();
				break;
			case 'fc9':
				$("#fc9subc").show();
				break;
			case 'fc10':
				$("#fc10subc").show();
				break;
			default:
                
            break;
		}
		
	},

});
