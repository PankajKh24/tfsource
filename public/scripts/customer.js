$(document).ready(function() {

	$('.sidebarBlockBody ul .sidebarLink').each(function() {
		$(this).parents('li').addClass('has_link');
	});
	
	/* ====== Show hidden content ======*/
	$('.showHidden').click(function(event){
		event.preventDefault();
		var targetId = $(this).attr('href');
		$(targetId).slideDown(400);
		$(targetId).siblings('.hiddenContent').slideUp(400);

		//console.log(targetId);
	});
	
	$('.cancelAccBlock').live('click',function(event){
		event.preventDefault();
		$(this).parents('.hiddenContent').slideUp(200);
	});
	
	
	/*=============== POINTS HISTORY ================*/
	if($('#point_history').length>0){
		var oTablePoints;
		oTablePoints = $('#point_history').dataTable({
			"sPaginationType": "four_button",
			"bAutoWidth": false,
			"bStateSave": false,
			"iCookieDuration": 60*60*1, /*1 hours*/
			"aLengthMenu": [[10, 20, 50, 100, 200, -1], [10, 20, 50, 100, 200, "All"]],
			"iDisplayLength": 20,
			"sDom": 'tr<"table_options bottom"pl>',
			"aaSorting": [[ 0, "desc" ]]
		});
	}
	
	
	
	/*=============== CREDITS HISTORY ================*/
	if($('#credits_history').length>0){
		var oTableCredits;
		oTableCredits = $('#credits_history').dataTable({
			"sPaginationType": "four_button",
			"bAutoWidth": false,
			"bStateSave": false,
			"iCookieDuration": 60*60*1, /*1 hours*/
			"aLengthMenu": [[10, 20, 50, 100, 200, -1], [10, 20, 50, 100, 200, "All"]],
			"iDisplayLength": 20,
			"sDom": 'tr<"table_options bottom"pl>',
			"aaSorting": [[ 0, "desc" ]]
		});
	}




	
	/* ============ Form Validations ============*/
	/* - Validate Login Form - */
	$("#login_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			error.appendTo('#login_errors');
		},
		showErrors: function(errorMap, errorList) {
    		this.defaultShowErrors();
			$('.error_holder').each(function(){
				var invalidPerGroup = $(this).find('label:visible').length;
				if(invalidPerGroup==0) $(this).hide();
				else $(this).show();
			});
		},
		rules: {
			password: {required:true},
			username: {required:true, email:true}
		},
		messages:{
			password: "Enter your password",
			username:{
				required:"Enter your email",
				email:"Enter valid email address for username"
			}
		}
	});
	
	/* - Validate Forgot Password Form - */
	$("#forgot_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			error.appendTo('#forgot_errors');
		},
		showErrors: function(errorMap, errorList) {
    		this.defaultShowErrors();
			$('.error_holder').each(function(){
				var invalidPerGroup = $(this).find('label:visible').length;
				if(invalidPerGroup==0) $(this).hide();
				else $(this).show();
			});
		},
		rules: {
			forgot_mail: {required:true, email:true}
		},
		messages:{
			forgot_mail:{
				required:"Enter your email",
				email:"Enter valid email address"
			}
		}
	});
	
	
	/*--- CHANGE EMAIL Form ---*/
	if( $('#email_form').length>0 ){
		var emailValidation = $('#email_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#email_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				email_filed:{
					required:true,
					email:true,
					remote:{
						url:"/customer/unique-email-address/id/"+$('#email_customer_id').val(),
						type:"post"
					}
				}
			},
			messages: {
				email_filed:{
					required: "Email is required",
					email: "Please enter a valid email address",
					remote: "Email already in use!"
				}
			}
		});
		
		$('#email_form').submit(function(){
			if(emailValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
		
	}
	
	/*--- CHANGE PASSWORD Form ---*/
	if( $('#password_form').length>0 ){
		var passwordValidate = $('#password_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#pass_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules:{
				new_pass:{required:true, minlength:6},
				confirm_pass:{
					required:true,
					equalTo:"#new_pass",
					minlength:6
				}
			},
			messages: {
				new_pass: {
					required: "Password is required",
					minlength: "Password should be at least 6 characters long"
				},
				confirm_pass: {
					required: "You have to confirm changed password",
					equalTo: "Passwords must match",
					minlength: "Password should be at least 6 characters long"
				}
			}
		});
		
		$('#password_form').submit(function(){
			if(passwordValidate.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	
	/*--- Create Account Form ---*/
	if( $('#create_account_form').length>0 ){
		$('#create_account_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#create_account_errors');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules:{
				customer_first_name:{required:true},
				customer_last_name:{required:true},
				customer_email:{required:true, email:true},
				customer_password:{
					required:true,
					minlength:6
				},
				retype_customer_password:{
					required:true,
					equalTo:"#customer_password",
					minlength:6
				}
			},
			messages: {
				customer_first_name:"First Name is required",
				customer_last_name:"First Last is required",
				customer_email: {
					required: "Email is required",
					email: "Enter valid email address"
				},
				customer_password: {
					required: "Password is required",
					minlength: "Password should be at least 6 characters long"
				},
				retype_customer_password: {
					required: "You have to confirm password",
					equalTo: "Passwords must match",
					minlength: "Password should be at least 6 characters long"
				}
			}
		});
	}
	
	
	/*--- CHANGE Phone Form ---*/
	if( $('#phone_form').length>0 ){
		var phoneValidation = $('#phone_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#phone_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				phone_filed:{required:true}
			},
			messages: {
				phone_filed:{
					required: "Phone number is required"
				}
			}
		});
		
		$('#phone_form').submit(function(){
			if(phoneValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	/*--- CHANGE PAYMENT Form --*/
	if($('#credit_form').length>0){
		var creditFormValidation = $('#credit_form').validate({
			errorLabelContainer: "#card_error",
			rules:{
				cc_number:{creditcard:true, required:true},
				exp_month:{number:true, range:[1,12], required:true},
				exp_year:{number:true, required:true},
				card_cvn:{required:true}
			},
			messages: {
				cc_number: {
					required:"Card number is required",
					creditcard:"Please enter valid credit card number"
				},
				exp_month: {
					required:"Expiration month is required",
					number:"Please enter valid month number (xx)",
					range:"Please enter valid month number (01-12)"
				},
				exp_year: {
					required:"Expiration year is required",
					number:"Please enter valid year number (xx)"
				},
				card_cvn: "Card CVN is required"
			}
		});
		
		$('#credit_form').submit(function(){
			if(creditFormValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	/*--- CHANGE BILLING Form --*/
	if($('#billing_form').length>0){
		var billingFormValidation = $('#billing_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#bill_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				bill_first_name:{required:true},
				bill_last_name:{required:true},
				bill_address1:{required:true},
				bill_city:{required:true},
				bill_zip:{required:true}
			},
			messages: {
				bill_first_name: "First Name is required",
				bill_last_name: "Last Name is required",
				bill_address1: "Address is required",
				bill_city: "City is required",
				bill_zip: "Zip code is required"
			}
		});
		
		$('#billing_form').submit(function(){
			if(billingFormValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	
	/*--- CHANGE SHIPPING Form --*/
	if($('#shipping_form').length>0){
		var shippingFormValidation = $('#shipping_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#ship_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				ship_first_name:{required:true},
				ship_last_name:{required:true},
				ship_address1:{required:true},
				ship_city:{required:true},
				ship_zip:{required:true}
			},
			messages: {
				ship_first_name: "First Name is required",
				ship_last_name: "Last Name is required",
				ship_address1: "Address is required",
				ship_city: "City is required",
				ship_zip: "Zip code is required"
			}
		});
		
		$('#shipping_form').submit(function(){
			if(shippingFormValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	
	/*--- CHANGE STACK PAYMENT Form --*/
	if($('#stack_credit_form').length>0){
		var stackCreditFormValidation = $('#stack_credit_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#stack_payment_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules:{
				stack_cc_number:{creditcard:true, required:true},
				stack_exp_month:{number:true, range:[1,12], required:true},
				stack_exp_year:{number:true, required:true},
				stack_card_cvn:{required:true}
			},
			messages: {
				stack_cc_number: {
					required:"Card number is required",
					creditcard:"Please enter valid credit card number"
				},
				stack_exp_month: {
					required:"Expiration month is required",
					number:"Please enter valid month number (xx)",
					range:"Please enter valid month number (01-12)"
				},
				stack_exp_year: {
					required:"Expiration year is required",
					number:"Please enter valid year number (xx)"
				},
				stack_card_cvn: "Card CVN is required"
			}
		});
		
		$('#stack_credit_form').submit(function(){
			if(stackCreditFormValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	/*--- CHANGE STACK PAYMENT Form ---*/
	if( $('#stack_paypal_form').length>0 ){
		var stackPaypalFormValidation = $('#stack_paypal_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#stack_paypal_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				stack_paypal_email:{required:true, email:true}
			}
		});
		
		$('#stack_paypal_form').submit(function(){
			if(stackPaypalFormValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	/*--- ADDRESS BOOK VALIDATION --*/
	
	
	if($('#new_address_form').length>0){
		var newAddressValidation = $('#new_address_form').validate({
			onkeyup:false,
			errorContainer:".error_holder",
			errorClass: "error",
			validClass: "valid",
			errorPlacement: function(error,element){
				error.appendTo('#new_address_error');
			},
			showErrors: function(errorMap, errorList) {
				this.defaultShowErrors();
				$('.error_holder').each(function(){
					var invalidPerGroup = $(this).find('label:visible').length;
					if(invalidPerGroup==0) $(this).hide();
					else $(this).show();
				});
			},
			rules: {
				new_adress_first_name:{required:true},
				new_adress_last_name:{required:true},
				new_adress_1:{required:true},
				new_adress_city:{required:true},
				new_adress_state:{required:true},
				new_adress_zip:{required:true},
				new_adress_country:{required:true},
				new_adress_phone:{required:true}
			},
			messages: {
				new_adress_first_name: "First Name is required",
				new_adress_last_name: "Last Name is required",
				new_adress_1: "Address is required",
				new_adress_city: "City is required",
				new_adress_state: "State is required",
				new_adress_zip:"Zip code is required",
				new_adress_country:"Country is required",
				new_adress_phone:"Phone is required"
			}
		});
		
		$('#new_address_form').submit(function(){
			if(newAddressValidation.form()){
				$(this).append('<div class="processing"><div>Processing...</div></div>');
			}
		});
	}
	
	$('.open_manager_edit').click(function(event){
		event.preventDefault();
		var manager_id = $(this).attr('data-id');
		var holder = $(this).attr('href');
		
		$('.edit_holder').append('<div class="processing"><div>Processing...</div></div>')
		$('.edit_holder').hide();
		$('.edit_holder').html();
		$(holder).show();
		$.post(
			'/customer/load-addressbook/',
			{manager_id:manager_id},
			function(data){
				$(holder).html(data);
			}
		);
	});
	
	
	/* - Satck Payment Option (Radio) - */
	$('input[name="payment_option"]').change(function(){
		var actObj = $(this);
		$.post(
			actObj.attr('data-loc'),
			{customer_id:actObj.attr('data-id'), paymnet_option:actObj.val()}
		);
	});
	
	
	/*=============== need recheck =======================*/
	
	/*--- Credit Crad Exp. Validate Method ---*/
	$.validator.addMethod(
		"CCExp",
		function(value, element, params) {
			var minMonth = new Date().getMonth() + 1;
			var minYear = new Date().getFullYear();
			var $month = $(params.month);
			var $year = $(params.year);
			
			var month = parseInt($month.val(), 10);
			var year = parseInt($year.val(), 10);

			if ((year > minYear) || ((year === minYear) && (month >= minMonth))) {
				return true;
			} else {
				return false;
			}
		},
		"Your Credit Card Expiration date is invalid."
	);
	
	
});