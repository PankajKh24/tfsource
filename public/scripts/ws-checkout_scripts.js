$(document).ready(function(){
	/*--- Cart Tabs ---*/
	tabsControl('#items_list');
	
	/*--- Tax Function ----*/
	function checkTax() {
		var order_subtotal = parseFloat($('#order_subtotal').val());
		var ship_state = $('#ship_state_2').val();
		
		if ( ship_state == 'MN' ) {
			var tax = order_subtotal * 6.875/100;
			$('#tax_charge').val(tax);
			$('#span_tax').html(number_format(tax, 2, '.', ''));
			$('#span_grand').html(number_format(order_subtotal+tax, 2, '.', ''));
		}
		else {
			var tax = 0;
			$('#tax_charge').val(tax);
			$('#span_tax').html(number_format(tax, 2, '.', ''));
			$('#span_grand').html(number_format(order_subtotal+tax, 2, '.', ''));
		}
	}
	
	//checkTax();
	
	/*---- Summary additional rows ----*/
	/*-- Boxing --*/
	function boxingRow() {
		if ( $('#boxing_1').is(':checked') || $('#boxing_2').is(':checked') ) {
			// show row
			$('.box_row').show();
		} else {
			// hide row
			$('.box_row').hide();
		}
	}
	
	function percent3Row() {
		if ( $('input[name="payment_type"]').is(':checked') ) {
			if ( $('input[name="payment_type"]:checked').val() == 'Credit Card' || $('input[name="payment_type"]:checked').val() == 'Paypal' ) {
				// show row
				var p3amount = $('#order_subtotal').val()*1*0.03;
				var grand_total = $('#order_subtotal').val()*1 + p3amount;
				$('#3percent_span').html( number_format(p3amount,2) );
				$('.3percent_row').show();
				$('#span_grand').html( number_format(grand_total,2) );
			} else {
				// hide row
				var grand_total = $('#order_subtotal').val()*1;
				$('#span_grand').html( number_format(grand_total,2) );
				$('.3percent_row').hide();
			}
		} else {
			$('.3percent_row').hide();
		}
	}
	
	boxingRow();
	percent3Row();
	
	$('#boxing_1').change(function(){
		boxingRow();
	});
	
	$('#boxing_2').change(function(){
		boxingRow();
	});
	
	/*--- Stack Choose ---*/
	$('input[name="order_stack"]').change(function(){
		if ( $(this).val()==1 ) {
			$('input[name="payment_type"]')
				.attr('disabled','disabled')
				.attr('readonly','readonly');
			$('#non_stack_options').slideUp(100);
			$('#ws_shipping_fieldset').slideUp(100);
		}
		else {
			$('input[name="payment_type"]')
				.removeAttr('disabled')
				.removeAttr('readonly');
			$('#non_stack_options').slideDown(100);
			$('#ws_shipping_fieldset').slideDown(100);
		};
	});
	
	$('input[name="order_stack"]').trigger('change');
	
	/*--- States -----*/
	$('#bill_country').change(function(){
		if ( $(this).val() == 'US' ) {
			$('#bill_state_flag').val('bill_state_2');
			$('#bill_state').hide();
			$('#bill_state_2').show();
			$('#bill_state').val('');
		}
		else {
			$('#bill_state_flag').val('bill_state');
			$('#bill_state_2').hide();
			$('#bill_state').show();
		}
		if ( $('#same_checkbox').is(':checked') )
		{
			copyToShip();
			$('#ship_state_2').trigger('change');
		}
	});
	
	$('#bill_country').trigger('change');
	
	$('#ship_country').change(function(){
		if ( $(this).val() == 'US' ) {
			$('#ship_state_flag').val('ship_state_2');
			$('#ship_state').hide();
			$('#ship_state_2').show();
			$('#ship_state').val('');
		}
		else {
			$('#ship_state_flag').val('ship_state');
			$('#ship_state_2').hide();
			$('#ship_state').show();
		}
	});
	
	$('#ship_country').trigger('change');
	$('#ship_state_2').change(function(){
		//checkTax();
	});
	
	/*--- Copy Billing to Shipping (Same as...) ---*/
	$('#same_checkbox').change(function(){
		if ( $(this).is(':checked') ) {
			copyToShip();
			shipFreeze();
		}
		else shipRelease();
	});

	function copyToShip(){
		$('#ship_first_name').val( $('#bill_first_name').val() );
		$('#ship_last_name').val( $('#bill_last_name').val() );
		$('#ship_address1').val( $('#bill_address1').val() );
		$('#ship_address2').val( $('#bill_address2').val() );
		$('#ship_country').val( $('#bill_country').val() );
		$('#ship_country').trigger('change');
		$('#ship_city').val( $('#bill_city').val() );
		$('#ship_state').val( $('#bill_state').val() );
		$('#ship_state_2').val( $('#bill_state_2').val() );
		$('#ship_state_2').trigger('change');
		$('#ship_zip').val( $('#bill_zip').val() );
		$('#ship_phone').val( $('#bill_phone').val() );
	};
	
	function shipFreeze(){
		$('#ship_first_name').attr('readonly','readonly');
		$('#ship_last_name').attr('readonly','readonly');
		$('#ship_address1').attr('readonly','readonly');
		$('#ship_address2').attr('readonly','readonly');
		$('#ship_country').attr('disabled','disabled');
		$('#ship_city').attr('readonly','readonly');
		$('#ship_state').attr('readonly','readonly');
		$('#ship_state_2').attr('disabled','disabled');
		$('#ship_zip').attr('readonly','readonly');
		$('#ship_phone').attr('readonly','readonly');
	};
	
	function shipRelease(){
		$('#ship_first_name').removeAttr('readonly');
		$('#ship_last_name').removeAttr('readonly');
		$('#ship_address1').removeAttr('readonly');
		$('#ship_address2').removeAttr('readonly');
		$('#ship_country').removeAttr('disabled');
		$('#ship_city').removeAttr('readonly');
		$('#ship_state').removeAttr('readonly');
		$('#ship_state_2').removeAttr('disabled');
		$('#ship_zip').removeAttr('readonly');
		$('#ship_phone').removeAttr('readonly');
	};
	
	/*----- Shipping Accounts -----*/
	$('input[name="shipment_type"]').change(function() {
		if ( $('#shipment_type_1').is(':checked') ) {
			$('#account_name').addClass('hidden_content');
		} else {
			$('#account_name').removeClass('hidden_content');
		}
	});
	
	/*--- Copy Ship to Bill (pay method credit card) ---*/
	$('input[name="payment_type"]').change(function(){
		if ( $(this).val()=='Credit Card' ) {
			billRelease();
			$('#paypal_form_fields').slideUp(100);
			$('#credit_card_form').slideDown(100);
			unvalidPaypal();
			// show 3% row in Summary
			percent3Row();
		} else if ( $(this).val()=='Paypal' ) { 
			copyToBill();
			billFreeze();
			$('#credit_card_form').slideUp(100);
			$('#paypal_form_fields').slideDown(100);
			unvalidCard();
			// show 3% row in Summary
			percent3Row();
		} else { 
			copyToBill();
			billFreeze();
			$('#credit_card_form').slideUp(100);
			$('#paypal_form_fields').slideUp(100);
			unvalidCard();
			// hide 3% row in Summary
			percent3Row();
		};
	});
	
	function copyToBill(){
		$('#bill_first_name').val( $('#ship_first_name').val() );
		$('#bill_last_name').val( $('#ship_last_name').val() );
		$('#bill_address1').val( $('#ship_address1').val() );
		$('#bill_address2').val( $('#ship_address2').val() );
		$('#bill_country').val( $('#ship_country').val() );
		$('#bill_city').val( $('#ship_city').val() );
		$('#bill_state').val( $('#ship_state').val() );
		$('#bill_state_2').val( $('#ship_state_2').val() );
		$('#bill_zip').val( $('#ship_zip').val() );
		$('#bill_phone').val( $('#ship_phone').val() );
	};
	
	function billFreeze(){
		$('#bill_email').attr('readonly','readonly');
		$('#bill_first_name').attr('readonly','readonly');
		$('#bill_last_name').attr('readonly','readonly');
		$('#bill_address1').attr('readonly','readonly');
		$('#bill_address2').attr('readonly','readonly');
		$('#bill_country').attr('disabled','disabled');
		$('#bill_city').attr('readonly','readonly');
		$('#bill_state').attr('readonly','readonly');
		$('#bill_state_2').attr('disabled','disabled');
		$('#bill_zip').attr('readonly','readonly');
		$('#bill_phone').attr('readonly','readonly');
	};
	
	function billRelease(){
		$('#bill_email').removeAttr('readonly');
		$('#bill_first_name').removeAttr('readonly');
		$('#bill_last_name').removeAttr('readonly');
		$('#bill_address1').removeAttr('readonly');
		$('#bill_address2').removeAttr('readonly');
		$('#bill_country').removeAttr('disabled');
		$('#bill_city').removeAttr('readonly');
		$('#bill_state').removeAttr('readonly');
		$('#bill_state_2').removeAttr('disabled');
		$('#bill_zip').removeAttr('readonly');
		$('#bill_phone').removeAttr('readonly');
	};
	
	
	/*--- Validate Form Fields ---*/
	var checkoutValid = $('#ws_checkout_form').validate({
		onkeyup:false,
		
		//error holders
		errorPlacement: function(error,element){
			if ( element.attr('name')=='bill_email' || element.attr('name')=='bill_first_name' || element.attr('name')=='bill_last_name' || element.attr('name')=='bill_address1' || element.attr('name')=='bill_city' || element.attr('name')=='bill_zip' ) error.appendTo('#bill_error');
			else if( element.attr('name')=='ship_first_name' || element.attr('name')=='ship_last_name' || element.attr('name')=='ship_address1' || element.attr('name')=='ship_city' || element.attr('name')=='ship_zip' ) error.appendTo('#ship_error');
			else if( element.attr('name')=='payment_type' || element.attr('name')=='cc_number' || element.attr('name')=='exp_month' || element.attr('name')=='exp_year' || element.attr('name')=='card_cvn' || element.attr('name')=='paypal_email' ) error.appendTo('#payment_error');
			else if( element.attr('name')=='shipment_type' ) error.appendTo('#ship_opt_error');
			else element.next('br').after(error);
		},
		
		rules: {
			//billing info
			bill_email: {required: true, email: true},
			bill_first_name: {required: true},
			bill_last_name: {required: true},
			bill_address1: {required: true},
			bill_city: {required: true},
			bill_zip: {required: true},
			
			//shiping info
			ship_first_name: {required: true},
			ship_last_name: {required: true},
			ship_address1: {required: true},
			ship_city: {required: true},
			ship_zip: {required: true},
		
			//payment and shipping settings
			payment_type: {required:true},
			cc_number: { 
					required: 
					{ 
						depends: function(element){
							return ( $('input[name="payment_type"]:checked').val() == 'Credit Card' && $('input[name="order_stack"]:checked').val() == '0');
						}
					},
					creditcard: true
				},
			shipment_type: {
					required:
					{ 
						depends: function(element){
							return ( $('input[name="order_stack"]:checked').val() == '0');
						}
					},
				},
			exp_month: {
					required: {
						depends: function(element){
							return ( $('input[name="payment_type"]:checked').val() == 'Credit Card' && $('input[name="order_stack"]:checked').val() == '0' );
						}
					},
					number: true
				},
			exp_year: {
					required: {
						depends: function(element){
							return ( $('input[name="payment_type"]:checked').val() == 'Credit Card' && $('input[name="order_stack"]:checked').val() == '0' );
						}
					},
					number: true
				},
			card_cvn: {
					required: {
						depends: function(element){
							return ( $('input[name="payment_type"]:checked').val() == 'Credit Card' && $('input[name="order_stack"]:checked').val() == '0' );
						}
					},
					number:true
				},
			paypal_email: { 
					required: 
					{ 
						depends: function(element){
							return ( $('input[name="payment_type"]:checked').val() == 'Paypal' && $('input[name="order_stack"]:checked').val() == '0');
						}
					},
					email: true
				}
		},
		messages: {
			//billing info
			bill_email: {
				required:'Email address is required.',
				email:'Email address is wrong.'
			},
			bill_first_name: {required:'First name is required field.'},
			bill_last_name: {required:'Last name is required field.'},
			bill_address1: {required:'Address is required field.'},
			bill_city: {required:'City is required field.'},
			bill_zip: {required:'Zip is required field.'},
			
			//billing info
			ship_first_name: {required:'First name is required field.'},
			ship_last_name: {required:'Last name is required field.'},
			ship_address1: {required:'Address is required field.'},
			ship_city: {required:'City is required field.'},
			ship_zip: {required:'Zip is required field.'},
		
			//payment and shipping settings
			payment_type: {required:'Please choose payment type.'},
			shipment_type: {required:'Please choose shipment type.'},
			
			cc_number: {required:'Credit card number is required', creditcard:'This is not valid credit card number'},
			exp_month: {required:'Exp. month is required', number: 'Exp. month must be number'},
			exp_year: {required:'Exp. year is required', number:'Exp. year mustbe number'},
			card_cvn: {required:'Card CVN is required', number:'Card CVN must be number'},
			
			paypal_email: {required:'PayPal email is required', email:'PayPal email is not valid'}
			
		}
	});
	
	
	/*--- Adjust Payment type Validation ---*/
	function unvalidPaypal(){
		$('input[name="paypal_email"]').removeClass('error');
		$('#payment_error label[for="paypal_email"]').remove();
	};
	function unvalidCard(){
		$('input[name="cc_number"]').removeClass('error');
		$('input[name="exp_month"]').removeClass('error');
		$('input[name="exp_year"]').removeClass('error');
		$('input[name="card_cvn"]').removeClass('error');
		
		$('#payment_error label[for="cc_number"]').remove();
		$('#payment_error label[for="exp_month"]').remove();
		$('#payment_error label[for="exp_year"]').remove();
		$('#payment_error label[for="card_cvn"]').remove();
	};
	
	
	/*--- SubmitForm ---*/
	$('#ws_checkout_submit').click(function(event){
		event.preventDefault();
		if ( checkoutValid.form() ) {
			billRelease();
			shipRelease();
			if ( $('#same_checkbox').is(':checked') ) copyToShip();
			$('#ws_checkout_form').submit();
		} else {
			alert('Errors found in checkout form. Please check all data again.');
		};
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

// Number Format function
function number_format (number, decimals, dec_point, thousands_sep) {
    // *     example 1: number_format(1234.56);
    // *     returns 1: '1,235'
    // *     example 2: number_format(1234.56, 2, ',', ' ');
    // *     returns 2: '1 234,56'
    // *     example 3: number_format(1234.5678, 2, '.', '');
    // *     returns 3: '1234.57'
    // *     example 4: number_format(67, 2, ',', '.');
    // *     returns 4: '67,00'
    // *     example 5: number_format(1000);
    // *     returns 5: '1,000'
    // *     example 6: number_format(67.311, 2);
    // *     returns 6: '67.31'
    // *     example 7: number_format(1000.55, 1);
    // *     returns 7: '1,000.6'
    // *     example 8: number_format(67000, 5, ',', '.');
    // *     returns 8: '67.000,00000'
    // *     example 9: number_format(0.9, 0);
    // *     returns 9: '1'
    // *    example 10: number_format('1.20', 2);
    // *    returns 10: '1.20'
    // *    example 11: number_format('1.20', 4);
    // *    returns 11: '1.2000'
    // *    example 12: number_format('1.2000', 3);
    // *    returns 12: '1.200'
    // *    example 13: number_format('1 000,50', 2, '.', ' ');
    // *    returns 13: '100 050.00'
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}








/*================ OLD FUNCTIONS - not in use (?) ===================================*/

function outputarray(element, index, array) {
		document.write("Element "+index+" contains the value "+element+"<br />");
	}
	sum = function(o){
		for(var s = 0, i = o.length; i; s += o[--i]*1);
		return s;
	};
	function set_grand_total(ship_cost)
	{
		help_array = ship_cost.split('#');
		value_array = help_array[1].split(',');
		cost = sum(value_array);
		grand_total_value = document.getElementById('order_subtotal').value*1 + cost*1;
		document.getElementById('grand_total').innerHTML = '$ ' + grand_total_value.toFixed(2);
	}
	function calculate_shippment(form)
	{
		validator = new AjaxFormValidator(form, "/checkout/shipcalculator/");
		validator.validate();
		document.getElementById('ship_cost_value').innerHTML = validator.errors['options'];
		grand_total_value = document.getElementById('order_subtotal').value*1 + validator.errors['cost']*1;
		document.getElementById('grand_total').innerHTML = '$ ' + grand_total_value.toFixed(2);
	}
	
	function set_shippment(checked_flag)
	{
		if(checked_flag)
		{
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
	function paypalSubmit(form)
	{
		if(document.getElementById('shipment_calculator').value == 'empty')
		{
			alert('Please calculate shipment costs before submiting!');
			return false;
		}
		validator = new AjaxFormValidator(form, "/checkout/addpaypalvalidate/");
		validator.validate();
		errors = validator.errors;
		
		if(!errors)
		{
			// Redirect to show attributes page
			document.billing_form.action = "<?php echo $this->baseUrl ?>/checkout/paypal/";
			document.billing_form.submit();
                     return false;
			//window.location.href="<?php echo $this->baseUrl ?>/checkout/orderview/id/" + errors['id'] + "/";
		}
		
		// Clear error fields and set default styles
		document.getElementById('div_error').innerHTML = "";
		
		document.getElementById('bill_email').style.border = "1px solid #ADCE9B";
		if(document.getElementById('bill_email').value == '')
		{
			document.getElementById('bill_pass').style.border = "1px solid #ADCE9B";
			document.getElementById('bill_pass_confirm').style.border = "1px solid #ADCE9B";
		}
		document.getElementById('bill_first_name').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_last_name').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_address1').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_city').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_state').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_zip').style.border = "1px solid #ADCE9B";
		
		document.getElementById('ship_first_name').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_last_name').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_address1').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_city').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_state').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_zip').style.border = "1px solid #ADCE9B";
		
		error_message = '';
		
		for (form_field in errors)
		{
			// Error handler for bill_email
			if (form_field == 'bill_email')
			{
				document.getElementById('bill_email').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_email'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			// Error handler for bill_pass
			if (form_field == 'bill_pass')
			{
				document.getElementById('bill_pass').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_pass'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			
			// Error handler for bill_pass_confirm
			if (form_field == 'bill_pass_confirm')
			{
				document.getElementById('bill_pass_confirm').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_pass_confirm'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			// Error handler for bill_first_name
			if (form_field == 'bill_first_name')
			{
				document.getElementById('bill_first_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_first_name'] + '<\/li>';
				//document.getElementById('bill_first_name').focus();
			}
			
			// Error handler for bill_last_name
			if (form_field == 'bill_last_name')
			{
				document.getElementById('bill_last_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_last_name'] + '<\/li>';
				//document.getElementById('bill_last_name').focus();
			}
			
			// Error handler for bill_address1
			if (form_field == 'bill_address1')
			{
				document.getElementById('bill_address1').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_address1'] + '<\/li>';
				//document.getElementById('bill_address1').focus();
			}
			
			// Error handler for bill_city
			if (form_field == 'bill_city')
			{
				document.getElementById('bill_city').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_city'] + '<\/li>';
				//document.getElementById('bill_city').focus();
			}
			
			// Error handler for bill_state
			/*
			if (form_field == 'bill_state')
			{
				document.getElementById('bill_state').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_state'] + '<\/li>';
				//document.getElementById('bill_state').focus();
			}
			*/
			
			// Error handler for bill_zip
			if (form_field == 'bill_zip')
			{
				document.getElementById('bill_zip').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_zip'] + '<\/li>';
				//document.getElementById('bill_zip').focus();
			}
			
			// Error handler for ship_first_name
			if (form_field == 'ship_first_name')
			{
				document.getElementById('ship_first_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_first_name'] + '<\/li>';
				//document.getElementById('ship_first_name').focus();
			}
			
			// Error handler for ship_last_name
			if (form_field == 'ship_last_name')
			{
				document.getElementById('ship_last_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_last_name'] + '<\/li>';
				//document.getElementById('ship_last_name').focus();
			}
			
			// Error handler for ship_address1
			if (form_field == 'ship_address1')
			{
				document.getElementById('ship_address1').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_address1'] + '<\/li>';
				//document.getElementById('ship_address1').focus();
			}
			
			// Error handler for ship_city
			if (form_field == 'ship_city')
			{
				document.getElementById('ship_city').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_city'] + '<\/li>';
				//document.getElementById('ship_city').focus();
			}
			
			// Error handler for ship_state
			/*
			if (form_field == 'ship_state')
			{
				document.getElementById('ship_state').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_state'] + '<\/li>';
				//document.getElementById('ship_state').focus();
			}
			*/
			
			// Error handler for ship_zip
			if (form_field == 'ship_zip')
			{
				document.getElementById('ship_zip').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_zip'] + '<\/li>';
				//document.getElementById('ship_zip').focus();
			}
		}
		
		document.getElementById('div_error').style.border = "1px solid red";
		document.getElementById('div_error').innerHTML = 'List of errors that occurred during checkout process:<br /><ul>'+error_message+'<\/ul>';
		return false;
	}

	function submitAddForm(form)
	{
		if(document.getElementById('shipment_calculator').value == 'empty')
		{
			alert('Please calculate shipment costs before submiting!');
			return false;
		}
		validator = new AjaxFormValidator(form, "/checkout/addformvalidate/");
		validator.validate();
		errors = validator.errors;
		
		if(!errors)
		{
			// Redirect to show attributes page
			document.billing_form.action = "<?php echo $this->baseUrl ?>/checkout/orderview/";
			document.billing_form.submit();
                     return false;
			//window.location.href="<?php echo $this->baseUrl ?>/checkout/orderview/id/" + errors['id'] + "/";
		}
		
		// Clear error fields and set default styles
		document.getElementById('div_error').innerHTML = "";
		
		document.getElementById('bill_email').style.border = "1px solid #ADCE9B";
		if(document.getElementById('bill_email').value == '')
		{
			document.getElementById('bill_pass').style.border = "1px solid #ADCE9B";
			document.getElementById('bill_pass_confirm').style.border = "1px solid #ADCE9B";
		}
		document.getElementById('bill_first_name').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_last_name').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_address1').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_city').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_state').style.border = "1px solid #ADCE9B";
		document.getElementById('bill_zip').style.border = "1px solid #ADCE9B";
		
		document.getElementById('ship_first_name').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_last_name').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_address1').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_city').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_state').style.border = "1px solid #ADCE9B";
		document.getElementById('ship_zip').style.border = "1px solid #ADCE9B";
		
		document.getElementById('cc_number').style.border = "1px solid #ADCE9B";
		document.getElementById('exp_month').style.border = "1px solid #ADCE9B";
		document.getElementById('exp_year').style.border = "1px solid #ADCE9B";
		
		error_message = '';
		
		for (form_field in errors)
		{
			// Error handler for bill_email
			if (form_field == 'bill_email')
			{
				document.getElementById('bill_email').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_email'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			
			// Error handler for bill_pass
			if (form_field == 'bill_pass')
			{
				document.getElementById('bill_pass').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_pass'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			
			// Error handler for bill_pass_confirm
			if (form_field == 'bill_pass_confirm')
			{
				document.getElementById('bill_pass_confirm').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_pass_confirm'] + '<\/li>';
				//document.getElementById('bill_email').focus();
			}
			
			// Error handler for bill_first_name
			if (form_field == 'bill_first_name')
			{
				document.getElementById('bill_first_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_first_name'] + '<\/li>';
				//document.getElementById('bill_first_name').focus();
			}
			
			// Error handler for bill_last_name
			if (form_field == 'bill_last_name')
			{
				document.getElementById('bill_last_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_last_name'] + '<\/li>';
				//document.getElementById('bill_last_name').focus();
			}
			
			// Error handler for bill_address1
			if (form_field == 'bill_address1')
			{
				document.getElementById('bill_address1').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_address1'] + '<\/li>';
				//document.getElementById('bill_address1').focus();
			}
			
			// Error handler for bill_city
			if (form_field == 'bill_city')
			{
				document.getElementById('bill_city').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_city'] + '<\/li>';
				//document.getElementById('bill_city').focus();
			}
			
			// Error handler for bill_state
			/*
			if (form_field == 'bill_state')
			{
				document.getElementById('bill_state').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_state'] + '<\/li>';
				//document.getElementById('bill_state').focus();
			}
			*/
			
			// Error handler for bill_zip
			if (form_field == 'bill_zip')
			{
				document.getElementById('bill_zip').style.border = "1px dashed red";
				error_message += '<li>' + errors['bill_zip'] + '<\/li>';
				//document.getElementById('bill_zip').focus();
			}
			
			// Error handler for ship_first_name
			if (form_field == 'ship_first_name')
			{
				document.getElementById('ship_first_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_first_name'] + '<\/li>';
				//document.getElementById('ship_first_name').focus();
			}
			
			// Error handler for ship_last_name
			if (form_field == 'ship_last_name')
			{
				document.getElementById('ship_last_name').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_last_name'] + '<\/li>';
				//document.getElementById('ship_last_name').focus();
			}
			
			// Error handler for ship_address1
			if (form_field == 'ship_address1')
			{
				document.getElementById('ship_address1').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_address1'] + '<\/li>';
				//document.getElementById('ship_address1').focus();
			}
			
			// Error handler for ship_city
			if (form_field == 'ship_city')
			{
				document.getElementById('ship_city').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_city'] + '<\/li>';
				//document.getElementById('ship_city').focus();
			}
			
			// Error handler for ship_state
			/*
			if (form_field == 'ship_state')
			{
				document.getElementById('ship_state').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_state'] + '<\/li>';
				//document.getElementById('ship_state').focus();
			}
			*/
			
			// Error handler for ship_zip
			if (form_field == 'ship_zip')
			{
				document.getElementById('ship_zip').style.border = "1px dashed red";
				error_message += '<li>' + errors['ship_zip'] + '<\/li>';
				//document.getElementById('ship_zip').focus();
			}
			
			// Error handler for cc_number
			if (form_field == 'cc_number')
			{
				document.getElementById('cc_number').style.border = "1px dashed red";
				error_message += '<li>' + errors['cc_number'] + '<\/li>';
				//document.getElementById('cc_number').focus();
			}
			
			// Error handler for exp_month
			if (form_field == 'exp_month')
			{
				document.getElementById('exp_month').style.border = "1px dashed red";
				error_message += '<li>' + errors['exp_month'] + '<\/li>';
				//document.getElementById('exp_month').focus();
			}
			
			// Error handler for exp_year
			if (form_field == 'exp_year')
			{
				document.getElementById('exp_year').style.border = "1px dashed red";
				error_message += '<li>' + errors['exp_year'] + '<\/li>';
				//document.getElementById('exp_year').focus();
			}
		}
		
		document.getElementById('div_error').style.border = "1px solid red";
		document.getElementById('div_error').innerHTML = 'List of errors that occurred during checkout process:<br /><ul>'+error_message+'<\/ul>';
		return false;
	}