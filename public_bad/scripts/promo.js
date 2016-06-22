$(document).ready(function(){
	
	/* ======= Holiday Spree (Newsletter Sign up) ======= */
	$('#nl_form #nl_submit').click(function(event){
		event.preventDefault();
		var submitAct = $(this).parents('form').attr('action');
		var hasError = 0;
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var email = $('#nl_email').val(); 
		
		errorMessage = '';
		if( email == '' ){
			errorMessage += 'Please enter your email address.';
			hasError=1;
		};
		
		if( !emailReg.test(email) ){
			errorMessage += 'Email not valid.';
			hasError=1;
		};
		
		if ( hasError==0 ) {
			$('#nl_sign_up').append('<div class="processing"><span>Sending...</span></div>');
			$.post(
				submitAct,
				$('#nl_form').serialize(),
				function(data){
					if (data=='success')
						$('#nl_sign_up').html('<div class="send_thanks">Thank you for subscribing for our Newsletter!<a href="/">TFSource.com</a></div>');
					else
						alert('An error ocured. Please try again')
						
				}
			);
		} else {
			alert(errorMessage);
		}
	});
	
	
});
