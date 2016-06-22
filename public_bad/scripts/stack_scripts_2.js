$(document).ready(function(){
	
	/* - New Validator Method - CC Expire - */
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
	
	
	/* - Same Billing And Shipping - */
	/*function set_shippment(checked_flag) {
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
	}*/
	
	$('#same_checkbox').click(function(){
		set_shippment(this.checked);
	});
		
	$('#micko_paypal').click(function(event){
		event.preventDefault();
		
		$('#stack_form').attr('action','/customer/paypal/');
		$('#paypal_submit_img').trigger('click');
	});	
	
	/* - Change Country - */
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
	$('#bill_country').trigger('change');
	
	$('#ship_country').change(function(){
		var country = $(this).val();
		
		if ( country == 'US' ) {
			$('.ship_state_text').attr('disabled','disabled');
			$('.ship_state_text').hide();
			$('.ship_state_select').removeAttr('disabled');
			$('.ship_state_select').show();
		}
		else {
			$('.ship_state_select').attr('disabled','disabled');
			$('.ship_state_select').hide();
			$('.ship_state_text').removeAttr('disabled');
			$('.ship_state_text').show();
		}		
	});
	$('#ship_country').trigger('change');
	
	
	/* - Cancel InStock / Preorder - */
	$('.cancel_stack_preorder, .cancel_stack_instock').click(function(event){
		event.preventDefault();
		var actObj = $(this);
		
		if ( confirm('Are you sure you want to cancel this item?') ){
			$.post(
				actObj.attr('href'),
				{id:actObj.attr('data-id'), customer_id:$('#customer_id').val()},
				function(){
					window.location.reload();
				}
			);
		}
	});
	
	
	/* - Calculate Shipment - */
	$('.calculate_shipment').live('click',function(event){
		event.preventDefault();
		var actObj = $(this);
		
		if( !isCheckedById("selector") ){ 
            alert ("Please select at least one available item"); 
            return false; 
        
		} else { 				
			$.post(
				actObj.attr('href'), 
				$("#stack_form").serialize(),
				function(data){
						var button = '<label class="inp_label w110">Shipping &amp; Handling:</label>';
  						$("#ship_cost_value").html(button + data.options);	
						help_array = $("#shipment_calculator").val().split('#');
						//value_array = help_array[1].split(',');
						//cost = sum(value_array);
						cost = help_array[1];
						
						var ship_state = $('#ship_state:not(:disabled)').val();							
						if ( ship_state == 'MN' ) var tax = $("#item_cost").val()*1 * 6.875/100;
						else var tax = 0;
						var credit = $('#customer_credit').val()*1;
								
						$('#tax_charge').val(tax.toFixed(2));
						$('#span_tax').text('$'+ tax.toFixed(2));
						
						var subtotal = cost*1 + $("#order_subtotal").val()*1 + tax;
						var total_due = subtotal - credit;
						
						if ( credit > 0 ) {
							if ( total_due < 0 ) {
								used_credit = subtotal;
								total_due = 0;
							} else {
								used_credit = credit;
							}
							$('#span_credit').text('$'+used_credit.toFixed(2));
						}
						
						if (total_due == 0) $('.paypal_holder').hide();
						else $('.paypal_holder').show();
						
						$("#submit_order, #submit_paypal").parent('.btn').show();
						$("#total_div").html('<label class="inp_label w110">Order Total:</label>' + '<span class="inp_label">$' + total_due.toFixed(2) +'</span>');
		
 				},
				"json"
			);
		}
	});
	
	
	/* - Check Items - */
	$(".checkbox").click(function(event){
		var actObj = $(this);
		var checkedStuff = $("input:checkbox:checked");
		
		//- calculate total cost
		$.post(
			actObj.attr('data-total-loc'), 
			checkedStuff.serialize(),
			function(data){
				$("#item_cost").val(data);
			}
		);
		
		//-- calculate subtotal
		$.post(
			actObj.attr('data-subtotal-loc'), 
			checkedStuff.serialize(),
			function(data){
				$("#span_item_cost").html('$' + (data*1).toFixed(2));
				$("#order_subtotal").val(data);
				
				if($("#shipment_calculator").val()){
					help_array = $("#shipment_calculator").val().split('#');
					cost = help_array[1];
					
					var ship_state = $('#ship_state:not(:disabled)').val();	
					if ( ship_state == 'MN' ) var tax = $("#item_cost").val()*1 * 6.875/100;
					else var tax = 0;
					var credit = $('#customer_credit').val()*1;
								
					$('#tax_charge').val(tax.toFixed(2));
					$('#span_tax').text('$'+ tax.toFixed(2));
					
					var subtotal = cost*1 + $("#order_subtotal").val()*1 + tax;
					var total_due = subtotal - credit;
					
					if ( credit > 0 ) {
						if ( total_due < 0 ) {
							used_credit = subtotal;
							total_due = 0;
						} else {
							used_credit = credit;
						}
						$('#span_credit').text('$'+used_credit.toFixed(2));
					}
					
					if (total_due == 0) $('.paypal_holder').hide();
					else $('.paypal_holder').show();
					
					$("#submit_order, #submit_paypal").parent('.btn').show();
					$("#total_div").html('<label class="inp_label w110">Order Total:</label>' + '<span class="inp_label">$' + total_due.toFixed(2) +'</span>');
		
				}
		});
		
	});
	
	



	/* - Ship Items (Continue) - */
	$("#stack_submit_items").click(function(event){
		event.preventDefault();
		var actObj = $(this);
		
		if (!isCheckedById("selector")) alert ("Please select at least one available item"); 
		else { 
			//- adjust btn
			if( actObj.attr('data-step')=='1' ) {
				actObj.val('Back to Items');
				actObj.attr('data-step','2');
			
			} else {
				actObj.val('Ship My Stack');
				actObj.attr('data-step','2');
			}
			
			//- calculate weight
			var checkedStuff = $("input:checkbox:checked"); 				
			$.post(
				actObj.attr('data-weight-loc'), 
				checkedStuff.serialize(),
				function(data){
					//- calculate shipping
					if( actObj.attr('data-step')=='2' ){
						$("#shipment_weigh").val(data);
						$.post(
							actObj.attr('data-ship-loc'), 
							$("#stack_form").serialize(),
							function(data){
								var button = '<label class="inp_label w110">Shipping &amp; Handling:</label>';
								$("#ship_cost_value").html(button + data.options);	
								help_array = $("#shipment_calculator").val().split('#');
								//value_array = help_array[1].split(',');
								//cost = sum(value_array);
								cost = help_array[1];
								
								var ship_state = $('#ship_state:not(:disabled)').val();	
								if ( ship_state == 'MN' ) var tax = $("#item_cost").val()*1 * 6.875/100;
								else var tax = 0;
								var credit = $('#customer_credit').val()*1;
								
								$('#tax_charge').val(tax.toFixed(2));
								$('#span_tax').text('$'+ tax.toFixed(2));
								
								var subtotal = cost*1 + $("#order_subtotal").val()*1 + tax;
								var total_due = subtotal - credit;
								
								if ( credit > 0 ) {
									if ( total_due < 0 ) {
										used_credit = subtotal;
										total_due = 0;
									} else {
										used_credit = credit;
									}
									$('#span_credit').text('$'+used_credit.toFixed(2));
								}
								
								if (total_due == 0) $('.paypal_holder').hide();
								else $('.paypal_holder').show();
								
								$("#submit_order, #submit_paypal").parent('.btn').show();
								$("#total_div").html('<label class="inp_label w110">Order Total:</label>' + '<span class="inp_label">$' + total_due.toFixed(2) +'</span>');
		
							},
							"json"
						);
					}		 
			});
			$("#bill-shipp").slideToggle(200);
			$("#items_list").slideToggle(200);
		}
	});
	
	
	
	
	/* - Bill-Shipp Validate Rules - */
	var form_stack_validate = $("#stack_form").validate({
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
			bill_state: {required:{
				depends:function(element){ return ( $('#bill_country').val()=='US' ); }
			}},
			
			ship_first_name:{required:true},
			ship_last_name:{required:true},
			ship_address1:{required:true},
			ship_zip: {required:true},
			ship_city:{required:true},	
			ship_state: {required:{
				depends:function(element){ return ( $('#ship_country').val()=='US' ); }
			}},
			
			payment_type: {required:true},
			paypal_email: {required:{
				depends:function(element){ return ( $('input[name="payment_type"]:checked').val() == 'Paypal' ); }
			}},
			
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
			bill_state: "Enter State",
			
			ship_first_name: "Enter your firstname",
			ship_last_name: "Enter your lastname",
			ship_address1: "Enter Address",
			ship_zip: {	
				required: "Zip Code is Required",
				remote: "Invalid Zip Code"
			},
			ship_city: "Enter City",
			ship_state: "Enter State",
			
			payment_type: "Enter Payment Type",
			paypal_email: "Enter PayPal email",
			
			cc_number:"Invalid Credit Card",
			card_cvn:{
				required: "Security # is Required",
				digits: "Only digits allowed",
				maxlength: jQuery.format("Enter only {0} characters")
			}
		}//,
		//submitHandler: function() { alert("Submitted!");return false; }
	});
	
		
		
		
	/* - Submit Order Click - */
	$("#submit_order").click(function(event){
		event.preventDefault();
		
		$("#messageBoxCreditCard").hide();
		var pay_type = $('input[name="payment_type"]:checked').val();
		var pay_check_loc = $('input[name="payment_type"]:checked').attr('data-paycheck');
		
		if ( typeof(pay_type) == 'undefined' ) {
			alert("Please choose Payment Type first");
			return false;
		}
		
		if( form_stack_validate.form() ) {
			$('body').append('<div class="process"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');
			if( pay_type == 'Credit Card' ) {
				$.post(
					pay_check_loc,
					$("#stack_form").serialize(),
					function(data){
						if(data){
							$('.process').remove();
							$("#messageBoxCreditCard").show();
							$("#messageBoxCreditCard").html('<span for="exp_year" generated="true" class="error" style="display: block;padding:10px 10px 10px 10px;">Your credit card has been declined.<br /> This could be for the following reasons: <br />1) Confirm the card # is correct, this is the most common error in miskeying your card #<br /> 2) Your billing address entered does not match the billing address on file with your bank<br /> 3) A reason other than the above. Please try another card, try entering and submitting the same card again, or contact your credit card company and inquire as to the reason the card was declined.</span>');
						
						} else $("#stack_form").submit();
					}
				);
			
			} else if( pay_type == 'Paypal' ) {
				$.post(
					pay_check_loc,
					$("#stack_form").serialize(),
					function(){
						$("#stack_form").submit();
					}
				);
			} else {
				$("#stack_form").submit();
			}
		}
		return false;
	});

});



/*======================================================================================================================*/


/* Check Selected Items */
function isCheckedById(id) 
{ 
	var checked = $("input[@id="+id+"]:checked").length; 
	if (checked == 0) { 
		return false; 
	
	} else { 
		return true; 
	} 
}


/* Copy Bill To Ship */
function set_shippment(checked_flag)
{
	if(checked_flag) {
		document.getElementById('ship_first_name').value = document.getElementById('bill_first_name').value;
		document.getElementById('ship_last_name').value = document.getElementById('bill_last_name').value;
		document.getElementById('ship_address1').value = document.getElementById('bill_address1').value;
		document.getElementById('ship_address2').value = document.getElementById('bill_address2').value;
		document.getElementById('ship_country').value = document.getElementById('bill_country').value;
		document.getElementById('ship_city').value = document.getElementById('bill_city').value;
		var country = document.getElementById('ship_country').value;
		if ( country == 'US' ) {
			$('.ship_state_text').attr('disabled','disabled');
			$('.ship_state_text').hide();
			$('.ship_state_select').removeAttr('disabled');
			$('.ship_state_select').show();
			$('.ship_state_select').val( $('.bill_state_select').val() );
		}
		else {
			$('.ship_state_select').attr('disabled','disabled');
			$('.ship_state_select').hide();
			$('.ship_state_text').removeAttr('disabled');
			$('.ship_state_text').show();
			$('.ship_state_text').val( $('.bill_state_text').val() );
		}
		//document.getElementById('ship_state').value = document.getElementById('bill_state').value;
		document.getElementById('ship_zip').value = document.getElementById('bill_zip').value;
		document.getElementById('ship_phone').value = document.getElementById('bill_phone').value ;
	}
}


/* Change Shipping Cost (Method) */
function shipment_calculator_change()
{									   
	help_array = $("#shipment_calculator").val().split('#');
	//value_array = help_array[1].split(',');
	//cost = sum(value_array);
	cost = help_array[1];
	
	var ship_state = $('#ship_state:not(:disabled)').val();	
	if ( ship_state == 'MN' ) var tax = $("#item_cost").val()*1 * 6.875/100;
	else var tax = 0;
	var credit = $('#customer_credit').val()*1;
								
	$('#tax_charge').val(tax.toFixed(2));
	$('#span_tax').text('$'+ tax.toFixed(2));
	
	var subtotal = cost*1 + $("#order_subtotal").val()*1 + tax;
	var total_due = subtotal - credit;
	
	if ( credit > 0 ) {
		if ( total_due < 0 ) {
			used_credit = subtotal;
			total_due = 0;
		} else {
			used_credit = credit;
		}
		$('#span_credit').text('$'+used_credit.toFixed(2));
	}
	
	if (total_due == 0) $('.paypal_holder').hide();
	else $('.paypal_holder').show();
	
	$("#submit_order, #submit_paypal").parent('.btn').show();
	$("#total_div").html('<label class="inp_label w110">Order Total:</label>' + '<span class="inp_label">$' + total_due.toFixed(2) +'</span>');
}