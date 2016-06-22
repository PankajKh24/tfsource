$(document).ready(function(){
	
	/*--- Validate Form ---*/
	$('#contact_form').validate({
		errorClass: "error",
		errorLabelContainer: "#contact_errors",
		rules: {
			name: {required: true},
			email: {required: true, email: true},
			enquiry_type: {required: true},
			comment: {required: true}	
		},
		messages: {
			name: "Name not specified",
			email: {
				required: "E-mail address not specified",
				email: "E-mail address is not valid"
			},
			enquiry_type: "Enquiry not specified",
			comment: "Comment not specified"
		}
	});
	
	/*--- Reset Form ---*/
	$('#contact_cancel').click(function(){
		$('#contact_form')[0].reset();
	});
	
});