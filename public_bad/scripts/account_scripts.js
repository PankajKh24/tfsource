$(document).ready(function(){

	/*- Email Unsubscribe -*/
	$('#email_unsubrcibe').change(function(){
		var customer_id = $('#eu_customer_id').val();
		if ( $(this).is(':checked') )
			var email_unsubrcibe = 1;
		else
			var email_unsubrcibe = 0;
			
		$.post(
			'/customer/mail-unsubscribe/',
			{customer_id:customer_id, email_unsubrcibe:email_unsubrcibe},
			function(){
				alert('Information saved.');
			}
		);			
	});

	/*- Newsletter Subscription -*/
	$('#newsletter #news_email').focus(function(){
		if(this.value=='Enter your e-mail'){this.value=''};
	});
	
	$('#newsletter #news_email').blur(function(){
		if(this.value==''){this.value='Enter your e-mail'};
	});
	
	$('#newsletter #news_go').click(function(event){
		event.preventDefault();
		$.post(
			"/customer/subscribe/", 
			{news_email: $('#news_email').val()},
			function(data){
				if(data=='false') {
					$('#newsletter').append('<div class="signup_messages warning"><p>Your email address is incorect!<br />Please type new again.</p></div>');
					$('#newsletter .warning').fadeIn(300);
						//.delay(2000)
						//.fadeOut(300)
						//.remove();
					window.setTimeout(function(){
						$('#newsletter .warning').fadeOut(300).delay(300).remove();
					}, 2000);
				} else {
					$('#newsletter').append('<div class="signup_messages notice"><p>You are sucesfully subscribed.<br />Thank you!</p></div>');
					$('#newsletter .notice').fadeIn('300');
						//.delay(2000)
						//.fadeOut(300)
						//.remove();
					window.setTimeout(function(){
						$('#newsletter .notice').fadeOut(300).delay(300).remove();
					}, 2000);
				};
			}
		);
		
	});
	
	/*- Open Hidden Forms -*/
	$('.open_hiden').click(function(event){
		event.preventDefault();
		var hidTarg = $(this).attr('href');
		$(hidTarg).parent().find('.hidden_content').hide();
		$(hidTarg).slideDown(100);
	});
	
	/*- Close Hidden Forms -*/
	$('.close_hiden').click(function(event){
		event.preventDefault();
		var hidTarg = $(this).attr('href');
		$(this).parents('form')[0].reset();
		$(hidTarg).slideUp(100);
	});
	
	/*- Toggle Hidden Forms -*/
	$('.toggle_hidden').click(function(event){
		event.preventDefault();
		var hidTarg = $(this).attr('href');
		$(hidTarg).parent().find('.hidden_content:visible:not('+hidTarg+')').hide();
		$(hidTarg).slideToggle(100);
	});
	
	
	/*- Change Country -*/
	$('#bill_country').change(function(){
		var country = $(this).val();
		
		if ( country == 'US' ) {
			$('.bill_state_text').attr('disabled','disabled');
			$('.bill_state_text').hide();
			$('.bill_state_select').removeAttr('disabled');
			$('.bill_state_select').show();
		}
		else {
			$('.bill_state_select').attr('disabled','disabled');
			$('.bill_state_select').hide();
			$('.bill_state_text').removeAttr('disabled');
			$('.bill_state_text').show();
		}		
	});
	
	/*--- Update CC payment ---*/
	$('#payment_button').click(function(){
		$('body').append('<div class="process"><div>Updating Credit Card Info in progress...</div></div>');
	});
	
	/*--- Stack Manager Tabs ---*/
	tabsControl('#items_list');
	
	
	
	
	/*=============== DATATABLES (order history) ================*/
	var oTableOrders;
	
	//- click on row
	$('#order_history tbody td').click( function () {
		var aPos = oTableOrders.fnGetPosition( this );
		var aData = oTableOrders.fnGetData( aPos[0] );
		window.location.href="/customer/vieworder/id/" + aData[0] + "/";
	});
	
	//- datatables initialization
	oTableOrders = $('#order_history').dataTable({
		"sPaginationType": "four_button",
		"bAutoWidth": false,
		"bStateSave": true,
		"iCookieDuration": 60*60*1, /*1 hours*/
		"aLengthMenu": [[10, 20, 50, 100, 200, -1], [10, 20, 50, 100, 200, "All"]],
		"iDisplayLength": 20,
		"sDom": 'tr<"table_options bottom"pl>',
		"aaSorting": [[ 0, "desc" ]]
	});
	
	
	/*=============== DATATABLES (points history) ================*/
	var oTablePoints;

	//- datatables initialization
	oTablePoints = $('#point_history').dataTable({
		"sPaginationType": "four_button",
		"bAutoWidth": false,
		"bStateSave": false,
		"iCookieDuration": 60*60*1, /*1 hours*/
		"aLengthMenu": [[10, 20, 50, 100, 200, -1], [10, 20, 50, 100, 200, "All"]],
		"iDisplayLength": 20,
		"sDom": 'tr<"table_options bottom"pl>',
		"aaSorting": [[ 0, "desc" ]],
		"aoColumns": [
			{"bVisible":false,"bVisible":false},
			{"bSortable":false},
			{"bSortable":false},
			null,
			null
		]
	});
	
	
	
	
	
	/*=============== FORM VALIDATIONS ================*/
	
	/*--- CHANGE EMAIL Form ---*/
	if( $('#email_form').length>0 ){
		$('#email_form').validate({
			errorLabelContainer: "#email_error",
			rules: {
				email_filed:{required:true, email:true}
			}
		});
	}
	
	/*--- CHANGE PASSWORD Form ---*/
	if( $('#password_form').length>0 ){
		$('#password_form').validate({
			errorLabelContainer: "#pass_error",
			rules:{
				new_pass:{required:true},
				confirm_pass:{
					required:true,
					equalTo:"#new_pass"
				}
			},
			messages: {
				new_pass: "Password is required",
				confirm_pass: {
					required: "You have to confirm changed password",
					equalTo: "Passwords must match"
				}
			}
		});
	}
	
	/*--- CHANGE BILLING Form --*/
	$('#billing_form').validate({
		errorLabelContainer: "#bill_error",
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
	
	/*--- CHANGE SHIPPING Form --*/
	$('#shipping_form').validate({
		errorLabelContainer: "#ship_error",
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
	
	/*--- CHANGE PAYMENT Form --*/
	$('#credit_form').validate({
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
	
	
	/*--- CHANGE STACK PAYMENT Form --*/
	$('#stack_credit_form').validate({
		errorLabelContainer: "#stack_card_error",
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

	/*--- Bill-Shipp Validate Rules ----*/
	var form1_validate = $("#form1").validate({
		errorLabelContainer: "#messageBoxBilling",
		wrapper: "",
		onkeyup: false, 
		rules: {
			bill_first_name:{required:true},
			bill_last_name:{required:true},
			bill_phone_number: {required:true},
			bill_address1:{required:true},
			bill_zip: {required:true},
			bill_city:{required:true},
			
			ship_first_name:{required:true},
			ship_last_name:{required:true},
			ship_address1:{required:true},
			ship_zip: {required:true},
			ship_city:{required:true},	
			
			cc_number:{required:true},
			card_cvn:{
				required:true,
				maxlength:4,
				digits: true
			},
			exp_year: {
				CCExp: { month:"#exp_month", year:"#exp_year"}
			}
		},
		messages: {
			bill_first_name: "Enter your firstname",
			bill_last_name: "Enter your lastname",
			bill_phone_number: "Provide phone number",
			bill_address1: "Enter Address",
			bill_zip: {	
				required: "Zip Code is Required",
				remote: "Invalid Zip Code"
			},
			bill_city: "Enter City",
			
			ship_first_name: "Enter your firstname",
			ship_last_name: "Enter your lastname",
			ship_address1: "Enter Address",
			ship_zip: {	
				required: "Zip Code is Required",
				remote: "Invalid Zip Code"
			},
			ship_city: "Enter City",
			
			cc_number:"Invalid Credit Card",
			card_cvn:{
				required: "Security # is Required",
				digits: "Only digits allowed",
				maxlength: jQuery.format("Enter only {0} characters")
			}
		}//,
		//submitHandler: function() { alert("Submitted!");return false; }
	});
	
	
	/*--- Credit Card Validate Rules ---*/
	var fccForm_validate = $("#ccForm").validate({
		errorLabelContainer: "#messageBoxCC",
		wrapper: "",
		onkeyup: false, 
		rules:{
			cc_number:{required:true},
			card_cvn:{
				required:true,
				maxlength:4,
				digits: true
			},
			exp_year: {
				CCExp: { month:"#exp_month",year:"#exp_year"}
			}
		},
		messages: {
			cc_number:"Invalid Credit Card",
			card_cvn:{
				required: "Security # is Required",
				digits: "Only digits allowed",
				maxlength: jQuery.format("Enter only {0} characters")
			}
		}//,
	   //submitHandler: function() { alert("Submitted!");return false; }
	});
		
		
	/*--- Edit Credit Card Edot Form --*/
	$('#edit_cc').click(function() {
		$.blockUI({ message: $('#ccForm') }); 
		//setTimeout($.unblockUI, 2000); 
	}); 
			
		$('#submit_cc').click(function() { 
			if(fccForm_validate.form()) {
				$.blockUI({ message: "<h1>Updating Credit Card Info in progress...</h1>" }); 
	 
				$.post(
					"/customer/updatepayment/",
					$("#ccForm,#form1").serialize(),
					function(data) {
						if(data){
							$.blockUI({ message: $('#ccForm') });
							$("#messageBoxCC").show();
							$("#messageBoxCC").html('<span for="exp_year" generated="true" class="error" style="display: block;padding:10px 10px 10px 10px;">' + data + '</span>');
							$("#cc_number").addClass("error");
						} else $.unblockUI();	
					}
				);
			}
		}); 
	 
		$('#cancel_cc').click(function() { 
			$.unblockUI(); 
			return false; 
		});
		
		
		/*--- Submit Order Click ---*/
		$("#submit_order").click(function(event){
			$("#messageBoxCreditCard").hide();
			if(form1_validate.form()) {	
				//$.blockUI();
				$.post(
					"/customer/charge/",
					$("#form1").serialize(),
					function(data){
						if(data){
							$("#messageBoxCreditCard").show();
							$("#messageBoxCreditCard").html('<span for="exp_year" generated="true" class="error" style="display: block;padding:10px 10px 10px 10px;">Your credit card has been declined.<br /> This could be for the following reasons: <br />1) Confirm the card # is correct, this is the most common error in miskeying your card #<br /> 2) Your billing address entered does not match the billing address on file with your bank<br /> 3) A reason other than the above. Please try another card, try entering and submitting the same card again, or contact your credit card company and inquire as to the reason the card was declined.</span>');
						} else $("#form1").submit();
					}
				);
			}
			return false;
		});

	
	
	
});



/*=============== TABS FNs ================*/
function tabsControl(tabObj){
	/*- Select First Tab or .current Tab -*/
	$(tabObj+' .tabs_holder').each(function(){
		if ( $(this).children('.current').length==0 ) {
			actTab = $(this).find('.tab:first-child');
			actTab.addClass('current');
		} else {
			actTab = $(this).children('.current');
		};
		showTab(actTab);
	});
	
	/*- Click on tabs -*/
	$(tabObj+' .tab').live('click',function(event){
		event.preventDefault();
		var actTab = $(this);
		$(actTab).parent().children('.current').removeClass('current');
		$(actTab).addClass('current');
		showTab(actTab);
	});
	
	/*- Show Current tab -*/
	function showTab(actTabObj){
		var tabPath = actTabObj.attr('href');
		$(actTabObj).parents('.tabs_control').find('.tab_cont:visible').hide();
		$(actTabObj).parents('.tabs_control').find(tabPath).show();
	};
	
};






/*======================================================================================================================*/
/*Add to order scripts (stack manager)*/



	
	
	
function set_shippment(checked_flag) {
	if(checked_flag) {
		document.getElementById('ship_first_name').value = document.getElementById('bill_first_name').value;
		document.getElementById('ship_last_name').value = document.getElementById('bill_last_name').value;
		document.getElementById('ship_address1').value = document.getElementById('bill_address1').value;
		document.getElementById('ship_address2').value = document.getElementById('bill_address2').value;
		document.getElementById('ship_country').value = document.getElementById('bill_country').value;
		document.getElementById('ship_city').value = document.getElementById('bill_city').value;
		document.getElementById('ship_state').value = document.getElementById('bill_state').value;
		document.getElementById('ship_zip').value = document.getElementById('bill_zip').value;
		document.getElementById('ship_phone').value = document.getElementById('bill_phone').value ;
	}
	
}

function shipment_calculator_change(){									   
	help_array = $("#shipment_calculator").val().split('#');
	//value_array = help_array[1].split(',');
	//cost = sum(value_array);
	cost = help_array[1];
	$("#total_div").html('<label>Total:</label>$' + (cost*1 + $("#item_cost").val()*1).toFixed(2));	
}