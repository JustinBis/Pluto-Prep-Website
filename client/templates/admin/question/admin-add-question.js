Template.adminAddQuestion.created = function() {
	// Create the reactive state variables for each question template
	this.question = new ReactiveVar();
}
/*
 * Grabs all of the question fields from a question template
 * and returns them as an object
 */
var getQuestion = function(questionId) {
	// Select all of the info we need from the page
	console.log("in get question");
	var data = {
		question: $('[name="data-question"]').val().trim(),
		a: $('[data-answer="a"]').val().trim(),
		b: $('[data-answer="b"]').val().trim(),
		c: $('[data-answer="c"]').val().trim(),
		d: $('[data-answer="d"]').val().trim(),
		answer: $('#answer :selected').val(), 
		short_explanation: $('[name="data-short-explanation"]').val().trim(),
		long_explanation: $('[name="data-long-explanation"]').val().trim(),
		subject: $('#subject :selected').val(),
		subcategory: $('#subcategories :selected').val(),
		topic: $('#topics :selected').text()
	};

	// Return the compiled data
	return data;
}

// Grabs question data for preview.
Template.adminAddQuestion.helpers({
	getData : function() {
		return Template.instance().question.get();
	},
})

Template.adminAddQuestion.events({
	// Save button
	'click .save-button': function () {
		// Get the question data
		var data = getQuestion();

		console.log(data);

		// Save the question
		Meteor.call('addQuestion', data, function(err, result) {
			if(err)
			{
				Session.set('server-error', err.reason);
				console.error("Error calling addQuestion: " + err.reason);

				// Alert the admin! So they don't save a poopy question.
				alert("ERROR! One of the fields is empty, or there is an invalid subject/subcategory/topic.");
			}
			else
			{
				alert("Question saved!");
			}
		});
	},
	
	// Preview button, set proper session values to be grabbed on html doc
	'click .preview-button': function() {
		var data = getQuestion();
		Template.instance().question.set(data);
	},

	// Handling when admin changes subject
	'change #subject' : function (e, tmpl){
		var subject = $('#subject :selected').val();
		// Clear subcategory and topic options
		$('#subcategories').find('option').remove().end();
		$('#topics').find('option').remove().end();
		switch (subject) {
			case 'fc1':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"1a\">1A: Proteins and Amino Acids: Structure and Function</option>");
				$("#subcategories").append("<option value=\"1b\">1B: Genetic Information: From Gene to Protein</option>");
				$("#subcategories").append("<option value=\"1c\">1C: Transmission of Heritable Information</option>");
				$("#subcategories").append("<option value=\"1d\">1D: Bioenergetics and Metabolism</option>");
				break;
			case 'fc2':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"2a\">2A: Cellular Structures and their Functions (Eukaryotic)</option>");
				$("#subcategories").append("<option value=\"2b\">2B: Prokaryotes and Viruses</option>");
				$("#subcategories").append("<option value=\"2c\">2C: Cell Division, Differentiation, and Specialization</option>");
				break;
			case 'fc3':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"3a\">3A: Nervous and Endocrine Systems</option>");
				$("#subcategories").append("<option value=\"3b\">3B: Other Main Organ Systems</option>");
				break;
			case 'fc4':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"4a\">4A: Mechanics</option>");
				$("#subcategories").append("<option value=\"4b\">4B: Fluids</option>");
				$("#subcategories").append("<option value=\"4c\">4C: Circuits and Electrochemistry</option>");
				$("#subcategories").append("<option value=\"4d\">4D: Light and Sound</option>");
				$("#subcategories").append("<option value=\"4e\">4E: Atomic Structure, Decay, and Behavior</option>");
				break;
			case 'fc5':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"5a\">5A: Acidity and Solubility in Aqueous Solutions</option>");
			    $("#subcategories").append("<option value=\"5b\">5B: Bonding and Intermolecular Forces</option>");
			    $("#subcategories").append("<option value=\"5c\">5C: Separations and Purifications</option>");
			    $("#subcategories").append("<option value=\"5d\">5D: Biological Molecules: Structure, Function, and Reactivity</option>");
			    $("#subcategories").append("<option value=\"5e\">5E: Thermodynamics and Kinetics</option>");
				break;
			case 'fc6':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"6a\">6A: Sensing the Environment</option>");
			    $("#subcategories").append("<option value=\"6b\">6B: Making Sense of the Environment</option>");
			    $("#subcategories").append("<option value=\"6c\">6C: Response to the Environment</option>");
				break;
			case 'fc7':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"7a\">7A: Individual Influences on Behavior</option>");
			    $("#subcategories").append("<option value=\"7b\">7B: Social Influences on Behavior</option>");
			    $("#subcategories").append("<option value=\"7c\">7C: Changes in Attitude and Behavior</option>");
				break;
			case 'fc8':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"8a\">8A: Self-Identity</option>");
				$("#subcategories").append("<option value=\"8b\">8B: Social Thinking</option>");
				$("#subcategories").append("<option value=\"8c\">8C: Social Interactions</option>");
				break;
			case 'fc9':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"9a\">9A: Social Structures</option>");
				$("#subcategories").append("<option value=\"9b\">9B: Demographics</option>");
				break;
			case 'fc10':
				$("#subcategories").append("<option value=\"\"></option>");
				$("#subcategories").append("<option value=\"10a\">10A: Social Inequality</option>");
				break;
			default:
            break;
		}
	},
	
	// Handling when admin changes subcategory
	'change #subcategories' : function(e) {
		var subcategory = $('#subcategories :selected').val();
		// Clear topic options
		$('#topics').find('option').remove().end();
		switch (subcategory) {
			// FC1
			case '1a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Amino Acids</option>");
				$("#topics").append("<option value=\"\">Protein Structure</option>");
				$("#topics").append("<option value=\"\">Non-Enzymatic Protein Function</option>");
				$("#topics").append("<option value=\"\">Enzyme Structure and Function</option>");
				$("#topics").append("<option value=\"\">Control of Enzyme Activity</option>");
				break;
			case '1b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Nucleic Acid Structure and Function</option>");
				$("#topics").append("<option value=\"\">DNA Replication</option>");
				$("#topics").append("<option value=\"\">DNA Repair</option>");
				$("#topics").append("<option value=\"\">Genetic Code</option>");
				$("#topics").append("<option value=\"\">Transcription</option>");
				$("#topics").append("<option value=\"\">Translation</option>");
				$("#topics").append("<option value=\"\">Eukaryotic Chromosomes</option>");
				$("#topics").append("<option value=\"\">Prokaryotic Gene Expression</option>");
				$("#topics").append("<option value=\"\">Eukaryotic Gene Expression</option>");
				$("#topics").append("<option value=\"\">Recombinant DNA and Biotechnology</option>");
				break;
			case '1c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Mendelian Genetics</option>");
				$("#topics").append("<option value=\"\">Meiosis and Genetic Variability</option>");
				$("#topics").append("<option value=\"\">Analytic Methods</option>");
				$("#topics").append("<option value=\"\">Evolution</option>");
				break;
			case '1d':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Principles of Bioenergetics</option>");
				$("#topics").append("<option value=\"\">Carbohydrates</option>");
				$("#topics").append("<option value=\"\">Glycolysis, Gluconeogenesis, and Pentose Phosphate Pathway</option>");
				$("#topics").append("<option value=\"\">Metabolic Regulation</option>");
				$("#topics").append("<option value=\"\">Citric Acid Cycle</option>");
				$("#topics").append("<option value=\"\">Fatty Acid and Protein Metabolism</option>");
				$("#topics").append("<option value=\"\">Oxidative Phosphorylation</option>");
				$("#topics").append("<option value=\"\">Hormonal Regulation of Metabolism</option>");
				break;

			// FC2
			case '2a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Plasma Membranes</option>");
				$("#topics").append("<option value=\"\">Defining Characteristics of Eukaryotic Cells</option>");
				$("#topics").append("<option value=\"\">Cytoskeleton</option>");
				$("#topics").append("<option value=\"\">Eukaryotic Cell Tissues</option>");
				break;
			case '2b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Cell Theory</option>");
				$("#topics").append("<option value=\"\">Prokaryotic Cell Structure and Classification</option>");
				$("#topics").append("<option value=\"\">Prokaryotic Cell Growth and Physiology</option>");
				$("#topics").append("<option value=\"\">Prokaryotic Cell Genetics</option>");
				$("#topics").append("<option value=\"\">Viral Structure</option>");
				$("#topics").append("<option value=\"\">Viral Life Cycle</option>");
				break;
			case '2c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Mitosis</option>");
				$("#topics").append("<option value=\"\">Biosignalling</option>");
				$("#topics").append("<option value=\"\">Reproductive System (Cellular)</option>");
				$("#topics").append("<option value=\"\">Embryogenesis</option>");
				$("#topics").append("<option value=\"\">Development</option>");
				break;

			// FC3
			case '3a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Nervous System: Structure and Function</option>");
				$("#topics").append("<option value=\"\">Nerve Cell</option>");
				$("#topics").append("<option value=\"\">Electrochemistry</option>");
				$("#topics").append("<option value=\"\">Neuro Biosignalling</option>");
				$("#topics").append("<option value=\"\">Lipids and Signalling</option>");
				$("#topics").append("<option value=\"\">Endocrine System: Hormones and their Sources</option>");
				$("#topics").append("<option value=\"\">Endocrine System: Hormonal Mechanisms</option>");
				break;
			case '3b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Repiratory System</option>");
				$("#topics").append("<option value=\"\">Circulatory System</option>");
				$("#topics").append("<option value=\"\">Lymphatic System</option>");
				$("#topics").append("<option value=\"\">Immune System</option>");
				$("#topics").append("<option value=\"\">Digestive System</option>");
				$("#topics").append("<option value=\"\">Excretory System</option>");
				$("#topics").append("<option value=\"\">Reproductive System</option>");
				$("#topics").append("<option value=\"\">Muscle System</option>");
				$("#topics").append("<option value=\"\">Muscle Cells</option>");
				$("#topics").append("<option value=\"\">Skeletal System</option>");
				$("#topics").append("<option value=\"\">Skin System</option>");
				break;

			// FC4
			case '4a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Translational Motion</option>");
				$("#topics").append("<option value=\"\">Force</option>");
				$("#topics").append("<option value=\"\">Equilibrium</option>");
				$("#topics").append("<option value=\"\">Work</option>");
				$("#topics").append("<option value=\"\">Energy of Simple Systems</option>");
				$("#topics").append("<option value=\"\">Periodic Motion</option>");
				break;
			case '4b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Fluid Properties</option>");
				$("#topics").append("<option value=\"\">Fluids in the Circulatory System</option>");
				$("#topics").append("<option value=\"\">Gases</option>");
				break;
			case '4c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Electrostatics</option>");
				$("#topics").append("<option value=\"\">Circuits</option>");
				$("#topics").append("<option value=\"\">Magnetism</option>");
				$("#topics").append("<option value=\"\">Electrochemistry</option>");
				$("#topics").append("<option value=\"\">Properties of Nerve Cells</option>");
				break;
			case '4d':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Sound</option>");
				$("#topics").append("<option value=\"\">Electromagnetic Radiation (Light)</option>");
				$("#topics").append("<option value=\"\">Spectroscopy and Structure</option>");
				$("#topics").append("<option value=\"\">Geometric Optics</option>");
				break;
			case '4e':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Atomic Nucleus and Decay</option>");
				$("#topics").append("<option value=\"\">Electronic Structure</option>");
				$("#topics").append("<option value=\"\">Groups of the Periodic Table</option>");
				$("#topics").append("<option value=\"\">Trends in the Periodic Table</option>");
				$("#topics").append("<option value=\"\">Stoichiometry</option>");
				break;

			// FC5
			case '5a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Acid/Base Equilibria</option>");
				$("#topics").append("<option value=\"\">Ions in Solution</option>");
				$("#topics").append("<option value=\"\">Solubility</option>");
				$("#topics").append("<option value=\"\">Titrations</option>");
				break;
			case '5b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Covalent Bonding</option>");
				$("#topics").append("<option value=\"\">Intermolecular Forces</option>");
				break;
			case '5c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Separations and Purifications</option>");
				break;
			case '5d':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Nucleotides and Nucleic Acids</option>");
				$("#topics").append("<option value=\"\">Amino Acids, Peptides, and Proteins</option>");
				$("#topics").append("<option value=\"\">3D Protein Structure</option>");
				$("#topics").append("<option value=\"\">Non-Enzymatic Protein Function</option>");
				$("#topics").append("<option value=\"\">Lipids</option>");
				$("#topics").append("<option value=\"\">Carbohydrates</option>");
				$("#topics").append("<option value=\"\">Aldehydes and Ketones</option>");
				$("#topics").append("<option value=\"\">Alcohols</option>");
				$("#topics").append("<option value=\"\">Carboxylic Acids</option>");
				$("#topics").append("<option value=\"\">Carboxylic Acid Derivatives</option>");
				$("#topics").append("<option value=\"\">Phenols</option>");
				$("#topics").append("<option value=\"\">Aromatic Compounds</option>");
				break;
			case '5e':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Enzymatic Catalysis</option>");
				$("#topics").append("<option value=\"\">Principles of Bioenergetics</option>");
				$("#topics").append("<option value=\"\">Thermochemistry and Thermodynamics</option>");
				$("#topics").append("<option value=\"\">Kinetics and Equilibrium</option>");
				break;

			// FC6
			case '6a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Sensory Processing</option>");
				$("#topics").append("<option value=\"\">Vision</option>");
				$("#topics").append("<option value=\"\">Hearing</option>");
				$("#topics").append("<option value=\"\">Other Senses</option>");
				$("#topics").append("<option value=\"\">Perception</option>");
				break;
			case '6b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Attention</option>");
				$("#topics").append("<option value=\"\">Cognition</option>");
				$("#topics").append("<option value=\"\">Consciousness</option>");
				$("#topics").append("<option value=\"\">Memory</option>");
				$("#topics").append("<option value=\"\">Language</option>");
				break;
			case '6c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Emotion</option>");
				$("#topics").append("<option value=\"\">Stress</option>");
				break;
			case '7a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Behavior: Biological Bases</option>");
				$("#topics").append("<option value=\"\">Personality</option>");
				$("#topics").append("<option value=\"\">Psychological Disorders</option>");
				$("#topics").append("<option value=\"\">Motivation</option>");
				$("#topics").append("<option value=\"\">Attitudes</option>");
				break;
			case '7b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Behavior is Affected by Others' Presence</option>");
				$("#topics").append("<option value=\"\">Group Decision Making</option>");
				$("#topics").append("<option value=\"\">Normative and Non-normative Behavior</option>");
				$("#topics").append("<option value=\"\">Socialization</option>");
				break;
			case '7c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Habituation/Dishabituation</option>");
				$("#topics").append("<option value=\"\">Associative Learning</option>");
				$("#topics").append("<option value=\"\">Observational Learning</option>");
				$("#topics").append("<option value=\"\">Theories of Attitude and Behavioral Change</option>");
				break;
			case '8a':
				$("#topics").append("<option value=\"\">Concept of Self, Indentity, and Social Identity</option>");
				$("#topics").append("<option value=\"\">Formation of Identity</option>");
				break;
			case '8b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Attribution of Behavior</option>");
				$("#topics").append("<option value=\"\">Prejudice and Bias</option>");
				$("#topics").append("<option value=\"\">Stereotypes</option>");
				break;
			case '8c':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Elements of Social Interactions</option>");
				$("#topics").append("<option value=\"\">Self Presentation and Interaction</option>");
				$("#topics").append("<option value=\"\">Social Behavior</option>");
				$("#topics").append("<option value=\"\">Discrimination</option>");
				break;

			case '9a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Theoretical Approaches</option>");
				$("#topics").append("<option value=\"\">Social Institutions</option>");
				$("#topics").append("<option value=\"\">Culture</option>");
				break;
			case '9b':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Demographic Structure of Society</option>");
				$("#topics").append("<option value=\"\">Demographic Shifts and Social Change</option>");
				break;

			case '10a':
				$("#topics").append("<option value=\"\"></option>");
				$("#topics").append("<option value=\"\">Spatial Inequality</option>");
				$("#topics").append("<option value=\"\">Social Class</option>");
				$("#topics").append("<option value=\"\">Health Disparities</option>");
				$("#topics").append("<option value=\"\">Healthcare Disparities</option>");
				break;				
		}
	}
});
