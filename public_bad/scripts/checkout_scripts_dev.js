$(document).ready(function(){
	

	/*--- Tax Function ----*/
	function checkTax() {
		var order_subtotal = $('#order_subtotal').val()*1;		
		var order_discount = $('#order_discount').val()*1;
		var ship_state = $('#ship_state_2').val();
		var ship_string = $('#shipment_calculator').val();
		var ship_array = ship_string.split('#');
		
		if (ship_array[1])
			var shipping = ship_array[1]*1;
		else
			var shipping = 0;
		
		if ( ship_state == 'MN' )
			var tax = order_subtotal * 6.875/100;
		else 
			var tax = 0;

		$('#tax_charge').val(tax);
		$('#span_tax').html(number_format(tax, 2, '.', ''));
		$('#span_grand').html('$'+number_format(order_subtotal+tax+shipping, 2, '.', ''));
	}
	
	checkTax();
	
	/*--- Stack Choose ---*/
	$('#stack_flag').change(function(){
		if ( $(this).val()==1 ) {
			/*
			$('input[name="payment_type"]')
				.attr('disabled','disabled')
				.attr('readonly','readonly');
			*/
			if($("#customer_profile_id").val() && $("#payment_profile_id").val())
				$('#non_stack_options').slideUp(100);
			else
			{
				$('#payment_type').val('Credit Card');
				$('#payment_type').trigger('change');
				$('.hide_for_stack').hide();
			}
		}
		else {
			/*
			$('input[name="payment_type"]')
				.removeAttr('disabled')
				.removeAttr('readonly');
			*/
			$('.hide_for_stack').show();
			$('#non_stack_options').slideDown(100);
		};
	});
	
	$('#stack_flag').trigger('change');
	
	/*---- Payment ---*/
	$('#payment_type').change(function(){
		if ( $(this).val() == 'Paypal' ) {
			$('#ccard_div').slideUp(100);
			if($('#pay_later').val() == 1)
				$('#paypal_div').slideDown(100);
			else
				$('#paypal_div').slideUp(100);
		}
		else {
			$('#paypal_div').slideUp(100);
			$('#ccard_div').slideDown(100);
		}
	});
	
	$('#pay_later').change(function(){
		if ( $("#payment_type").val() == 'Paypal' ) {
			if($(this).val() == 1)
				$('#paypal_div').slideDown(100);
			else
				$('#paypal_div').slideUp(100);
		}
	});
	
	
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
		//$('#ship_cost_value').html('<input id="shipment_calculator" type="hidden" value="empty" name="shipment_calculator" /><a onclick="calculate_shippment();return false;" href="#">calculate shipment cost</a>');
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
		//$('#ship_cost_value').html('<input id="shipment_calculator" type="hidden" value="empty" name="shipment_calculator" /><a onclick="calculate_shippment();return false;" href="#">calculate shipment cost</a>');
	});
	
	$('#ship_country').trigger('change');
	$('#ship_state_2').change(function(){
		checkTax();
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
	
	
	
	/*--- Copy Ship to Bill (pay method credit card) ---*/
	$('input[name="payment_type"]').change(function(){
		if ( $(this).val()=='Credit Card' ) {
			billRelease();
			$('#paypal_form_fields').slideUp(100);
			$('#credit_card_form').slideDown(100);
			unvalidPaypal();
		} else if ( $(this).val()=='Paypal' ) { 
			copyToBill();
			billFreeze();
			$('#credit_card_form').slideUp(100);
			$('#paypal_form_fields').slideDown(100);
			unvalidCard();
		} else { 
			copyToBill();
			billFreeze();
			$('#credit_card_form').slideUp(100);
			$('#paypal_form_fields').slideUp(100);
			unvalidCard();
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
	var checkoutValid = $('#billing_form').validate({
		onkeyup:false,
		
		//error holders
		errorPlacement: function(error,element){
			if ( element.attr('name')=='bill_email' || element.attr('name')=='bill_first_name' || element.attr('name')=='bill_last_name' || element.attr('name')=='bill_address1' || element.attr('name')=='bill_city' || element.attr('name')=='bill_zip' || element.attr('name')=='bill_country' || element.attr('name')=='bill_state_2' || element.attr('name')=='bill_phone' ) error.appendTo('#bill_error');
			
			else if( element.attr('name')=='ship_first_name' || element.attr('name')=='ship_last_name' || element.attr('name')=='ship_address1' || element.attr('name')=='ship_city' || element.attr('name')=='ship_zip' || element.attr('name')=='ship_country' || element.attr('name')=='ship_state_2' || element.attr('name')=='ship_phone' ) error.appendTo('#ship_error');
			
			else if( element.attr('name')=='payment_type' || element.attr('name')=='cc_number' || element.attr('name')=='exp_month' || element.attr('name')=='exp_year' || element.attr('name')=='card_cvn' || element.attr('name')=='paypal_email' ) error.appendTo('#payment_error');
			
			else if( element.attr('name')=='shipment_type' ) error.appendTo('#ship_opt_error');
			
			else element.next('br').after(error);
		},
		
		rules: {
			//billing info
			bill_email: {required:true, email:true},
			bill_first_name: {required:true},
			bill_last_name: {required:true},
			bill_address1: {required:true},
			bill_city: {required:true},
			bill_zip: {required:true},
			bill_country: {required:true},
			bill_state_2: {required:{
				depends:function(element){ return ( $('#bill_country').val()=='US' ); }
			}},
			bill_phone: {required:true},
			
			//shiping info
			ship_first_name: {required:true},
			ship_last_name: {required:true},
			ship_address1: {required:true},
			ship_city: {required:true},
			ship_zip: {required:true},
			ship_country: {required:true},
			ship_state_2: {required:{
				depends:function(element){ return ( $('#ship_country').val()=='US' ); }
			}},
			ship_phone: {required:true},
		
			//payment and shipping settings
			payment_type: {required:true},
			cc_number: { 
					required:{ 
						depends:function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					},
					creditcard: true
				},
			shipment_type: {
					required: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') ) }
					}
				},
			exp_month: {
					required: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					},
					number: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					}
				},
			exp_year: {
					required: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					},
					number: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					}
				},
			card_cvn: {
					required: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					},
					number: {
						depends: function(element){ return ( ($('#stack_flag').val()=='0' && $('#payment_type').val() == 'Credit Card') || ($('#stack_flag').val()=='1' && ($('#customer_profile_id').val()=='' || $('#payment_profile_id').val()=='')) ) }
					}
				},
			paypal_email: {
					required: {
						depends: function(element){ return ( $('#stack_flag').val()=='0' && $('#payment_type').val() == 'Paypal' && $('#pay_later').val() == '1') }
					},
					email: {
						depends: function(element){ return ( $('#stack_flag').val()=='0' && $('#payment_type').val() == 'Paypal' && $('#pay_later').val() == '1') }
					}
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
			bill_country: {required:'Country is required field.'},
			bill_state_2: {required:'State field is required for United States'},
			bill_phone: {required:'Phone number is required field.'},
			
			//billing info
			ship_first_name: {required:'First name is required field.'},
			ship_last_name: {required:'Last name is required field.'},
			ship_address1: {required:'Address is required field.'},
			ship_city: {required:'City is required field.'},
			ship_zip: {required:'Zip is required field.'},
			ship_country: {required:'Country is required field.'},
			ship_state_2: {required:'State field is required for United States'},
			ship_phone: {required:'Phone number is required field.'},
		
			//payment and shipping settings
			payment_type: {required:'Please choose payment type.'},
			shipment_type: {required:'Please choose shipment type.'},
			
			cc_number: {required:'Credit card number is required', creditcard:'This is not valid credit card number'},
			exp_month: {required:'Exp. month is required', number: 'Exp. month must be number'},
			exp_year: {required:'Exp. year is required', number:'Exp. year mustbe number'},
			card_cvn: {required:'Card CVN is required', number:'Card CVN must be number'},
			
			paypal_email: {required:'Email address is required', email:'Please enter a valid email address'}
		}
	});
	
	/*--- SubmitForm ---*/
	$('#checkout_submit').click(function(event){
		event.preventDefault();
		/*
		if ( typeof  $('#shipment_calculator').val() == 'undefined' ) {
			alert('There was an error while calculating shipment cost.\nPlease, refresh the page and try again.');
			return false;
		}
		*/
		if ( $('#shipment_calculator').val() == 'empty' && $('#stack_flag').val()==0 ) {
			alert('Please calculate shipping first.');
			return false;
		}

		if ( checkoutValid.form() ) {
			// Cart Compare
			$.post(
				'/checkout/cart-compare/',
				function(data){
					if ( data == 'yes') {
						// Authorize Validate
						if($('#payment_type').val()=='Paypal' && $('#stack_flag').val()==0)
						{
							billRelease();
							shipRelease();
							if ( $('#same_checkbox').is(':checked') ) 
								copyToShip();
							if($('#pay_later').val()==0)
								$('#billing_form').attr('action','/checkout/paypal/');
							$('#billing_form').submit();
						}
						else if($('#stack_flag').val()==1 && $('#customer_profile_id').val()!='' && $('#payment_profile_id').val()!='')
						{
							billRelease();
							shipRelease();
							if ( $('#same_checkbox').is(':checked') ) copyToShip();
							$('#billing_form').submit();
						}
						else
						{
							$.post(
								'/checkout/authorize-validate/',
								$('#billing_form').serialize(),
								function(data){
									if (data == '') {
										billRelease();
										shipRelease();
										if ( $('#same_checkbox').is(':checked') ) copyToShip();
										$('#billing_form').submit();
										//alert('Pass');
									} else {
										$('#authorize_error').html(data);
										$('#authorize_error').show();
									}
								}
							);
						}
					}
					else {
						alert('An error occured');
						window.location = '/cart/view/';
					}
				}
			);
		} 
		else 
		{
			alert('Errors found in checkout form. Please check all data again.');
		};
	});
	
	
});


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



/*- Change Shipping Type -*/
function calculate_shippment(){
	if ( $('#same_checkbox').is(':checked') ) {
		var freezeLock = true;
		shipRelease();
	} else {
		var freezeLock = false;
	}
	
	$.post(
		'/checkout-dev/shipcalculator/',
		$('#billing_form').serialize(),
		function(data){
			if( freezeLock ) shipFreeze();
			$.each(data, function(key, val){
				if (key=='options') {
					$('#ship_cost_value').html(val);
				} else if(key=='cost') {
					var grand_total_value = $('#order_subtotal').val()*1 + val*1 + $('#tax_charge').val()*1;
					$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
					if (val == 0)
						$('#span_ship').text( 'FREE' );
					else
						$('#span_ship').text( '$'+val.toFixed(2) );
				};
			});
			
		},
		'json'
	);
}




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