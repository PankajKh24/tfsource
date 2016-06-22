$(document).ready(function(){
		
	/*--- Checkout Boxes ----*/
	$('.checkout_box .ch_block_capt').click(function(){
		$(this).siblings('.ch_box_content').slideToggle(100);
		$(this).toggleClass('closed');
	});
	
	/* - Scroll Block - Summary Block - */
	if( $('#checkout_side').length>0 ){
		var scrl_oGal = '#checkout_side';
		var lock_oGal = '#checkout_page';
		var init_posGal = $(scrl_oGal).offset().top;
		var headerOffset = $('#header').outerHeight(true) + $('#multys').outerHeight(true) + $('#h-content').outerHeight(true);
		
		$(window).scroll(function(){
			var scrl_top = $(window).scrollTop();
			var lockH = $(lock_oGal).outerHeight(true);
			var floatH = $(scrl_oGal).outerHeight();
			var scrollMargin = scrl_top-init_posGal;
			
			if (scrl_top>init_posGal) {
				if( scrollMargin<=(lockH - floatH) ){
					$(scrl_oGal).stop().animate({"margin-top":scrollMargin+'px'},200);
				}
			} else {
				$(scrl_oGal).stop().animate({"margin-top": "0px"},200);
			}
		});
	}
	
	/* -- Credit Card Detect -- */
	ccDetect('#cc_number');
	
	/*--- Tax Function ----*/
	function checkTax() {
		var order_subtotal = $('#order_subtotal').val()*1;		
		var order_discount = $('#order_discount').val()*1;
		var ship_state = $('#ship_state_2').val();
		var ship_string = $('#shipment_calculator').val();
		var ship_array = [];
		if(ship_string)
			ship_array = ship_string.split('#');
		
		if (ship_array[1])
			var shipping = ship_array[1]*1;
		else
			var shipping = 0;
		
		if ( ship_state == 'MN' ){
			var tax = order_subtotal * 6.875/100;
			$('.tax_data').show();
		}else{ 
			var tax = 0;
			$('.tax_data').hide();
		}

		$('#tax_charge').val(tax);
		$('#span_tax').html(number_format(tax, 2, '.', ''));
		$('#span_grand').html('$'+number_format(order_subtotal+tax+shipping, 2, '.', ''));
	}
	
	checkTax();
	
	
	
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
		/*
		if ( $('#same_checkbox').is(':checked') )
		{
			copyToBill();
			$('#ship_state_2').trigger('change');
		}
		*/
	});

	if ( typeof($('#customer_id').val()) == 'unsefined' )
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

	$('#ship_state_2').change(function(){
		checkTax();
	});
	
	/*--- Copy Billing to Shipping (Same as...) ---*/
	$('#same_checkbox').change(function(){
		if ( $(this).is(':checked') ) {
			copyToBill();
			$('#bill_country').trigger('change');
			billFreeze();
		}
		else billRelease();
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
		return true;
		
		//$('#bill_email').attr('readonly','readonly');
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
		return true;
		
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
	var checkoutValid = $("#billing_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			if( $.inArray(element.attr('name'),billingFields)>=0 ) error.appendTo('#billing_error');
			else if( $.inArray(element.attr('name'),shippingFields)>=0 ) error.appendTo('#shipping_error');
			else error.appendTo('#payment_error');
			
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
			//billing info
			bill_first_name: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			bill_last_name: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			bill_address1: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			bill_city: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			bill_zip: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#bill_state_flag').val()=='bill_state_2' ) }},
			bill_country: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			/*bill_state: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#bill_state_flag').val()=='bill_state' ) }},*/
			bill_state_2: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#bill_state_flag').val()=='bill_state_2' ) }},
			bill_phone: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			bill_email: {
				required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }, 
				email:true,
				remote: {
					url: "/checkout/check-email/",
					type: "post",
					data: {email: function() {return $( "#bill_email" ).val();}}
				}
			},
			
			//shiping info
			ship_first_name: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			ship_last_name: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			ship_address1: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			ship_city: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			ship_zip: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#ship_state_flag').val()=='ship_state_2' ) }},
			ship_country: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
			/*ship_state: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#ship_state_flag').val()=='ship_state' ) }},*/
			ship_state_2: {required: function(element){ return ( !$('#paypal_radio').is(':checked') && $('#ship_state_flag').val()=='ship_state_2' ) }},
			ship_phone: {required: function(element){ return ( !$('#paypal_radio').is(':checked') ) }},
		
			//payment and shipping settings
			cc_number: { 
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) },
					creditcard: true
				},
			exp_month: {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				},
			exp_year: {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				},
			card_cvn: {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				}
		},
		messages: {
			//billing info
			bill_first_name: {required:'First name is required field.'},
			bill_last_name: {required:'Last name is required field.'},
			bill_address1: {required:'Address is required field.'},
			bill_city: {required:'City is required field.'},
			bill_zip: {required:'Zip is required field.'},
			bill_country: {required:'Country is required field.'},
			bill_state: {required:'State field is required'},
			bill_state_2: {required:'State field is required for United States'},
			bill_phone: {required:'Phone number is required field.'},
			bill_email: {
				required:'Email is required field', 
				email:'This is not valid email address',
				remote:'This email is already registered, please <a class="validate_link" href="/checkout/">log in</a>'
			},
			
			//shipping info
			ship_first_name: {required:'First name is required field.'},
			ship_last_name: {required:'Last name is required field.'},
			ship_address1: {required:'Address is required field.'},
			ship_city: {required:'City is required field.'},
			ship_zip: {required:'Zip is required field.'},
			ship_country: {required:'Country is required field.'},
			ship_state: {required:'State field is required'},
			ship_state_2: {required:'State field is required for United States'},
			ship_phone: {required:'Phone number is required field.'},
		
			//payment and shipping settings
			cc_number: {required:'Credit card number is required', creditcard:'This is not a valid credit card number, please check the number on your card and enter it again'},
			exp_month: {required:'Exp. month is required'},
			exp_year: {required:'Exp. year is required'},
			card_cvn: {required:'Card CVN is required'}
		}
		
		
	});
	
	$('#paypal_radio').click(function(){
		$('#checkout_submit').trigger('click');
	});
	
	$('#ship_country').change(function(){
		calculate_shippment();
	});
	
	$('.ship_type_radio').change(function(){
		if ( $(this).val() == 'add_to_stack' )
			$('#ship_div').hide();
		else
			$('#ship_div').show();
			
		shipCheck();
	});
	
	shipCheck()
	
	$('#checkout_submit').click(function(event){
		event.preventDefault();

		if ( $('#paypal_radio').is(':checked') ) {
			checkoutValid.form();
			$('#billing_form').attr('action','/checkout/paypal/');
			$('#paypal_submit_img').trigger('click');
			
		} else {
			if ( $('.ship_cost').length < 1 && !$('#add_to_stack').is(':checked') ) {
				alert('Please calculate shipping first.');
				return false;
			}

			if ( checkoutValid.form() ) {
				$('body').append('<div class="process"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');
				
				if( $('#paypal_radio').is(':checked') )
				{
					// Paypal checkout
					$('.process').remove();
					billRelease();
					shipRelease();
					//if ( $('#same_checkbox').is(':checked') ) copyToBill();
					$('#billing_form').attr('action','/checkout/paypal/');
					$('#paypal_submit_img').trigger('click');
				}
				else if( $('#add_to_stack').is(':checked') && $('#validate_cc').val()==0 )
				{
					// Existing Stack chekcout
					billRelease();
					shipRelease();
					//if ( $('#same_checkbox').is(':checked') ) copyToBill();
					$('#billing_form').submit();
				}
				else
				{
					// Authorize Validate
					$.post(
						'/checkout/authorize-validate/',
						$('#billing_form').serialize(),
						function(data){
							if (data == '') {
								billRelease();
								shipRelease();
								//if ( $('#same_checkbox').is(':checked') ) copyToBill();
								$('#billing_form').submit();
							} else {
								$('.process').remove();
								$('#payment_error').html(data);
								$('#payment_error').show();
							}
						}
					);
				}
			} else  {
				alert('Errors found in checkout form. Please check all data again.');
			}
		}
	});
});


function shipFreeze(){
	return true;
	
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
	return true;
	
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
		'/checkout/shipcalculator/',
		$('#billing_form').serialize(),
		function(data){
			if( freezeLock ) shipFreeze();
			$.each(data, function(key, val){
				if (key=='options') {
					$('#ship_method_opts').html(val);
				} else if(key=='cost') {
					if ( val ) {
						var grand_total_value = $('#order_subtotal').val()*1 + val*1 + $('#tax_charge').val()*1;
						$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
						if (val == 0) $('#span_ship').text( 'FREE' );
						else $('#span_ship').html( '$'+val.toFixed(2) );
					} else {
						var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
						$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
						$('.ship_data').hide();
					}
				};
			});
			shipCheck();
		},
		'json'
	);
}

function outputarray(element, index, array) {
	document.write("Element "+index+" contains the value "+element+"<br />");
}
sum = function(o){
	for(var s = 0, i = o.length; i; s += o[--i]*1);
	return s;
};
	
/*- Change Shipping Handle -*/
function set_grand_total(ship_cost)
{
	var help_array = ship_cost.split('#');
	var value_array = help_array[1].split(',');
	var cost = sum(value_array);
	var grand_total_value = $('#order_subtotal').val()*1 + cost*1 + $('#tax_charge').val()*1;
	
	// reduced shipping logic
	var reduced = false;
	if ( $('#ship_country').val() != 'US') {
		reduced = true;
		var order_subtotal = $('#order_subtotal').val()*1;
		if ( order_subtotal < 150 ) {
			var show_ship_cost = cost;
			var show_reduced_cost = 0;
		} else {
			var show_ship_cost = cost * 1.25;
			var show_reduced_cost = (cost * 1.25) - cost;
		}
	}
	
	$('#ship_reduced').text('');
	$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
	if (cost == 0) $('#span_ship').text( 'FREE' );
	else if (reduced && show_reduced_cost>0) {
		$('#span_ship').text( '$'+show_ship_cost.toFixed(2) );
		$('#ship_reduced').text( '-$'+show_reduced_cost.toFixed(2) );
	}
	else $('#span_ship').text( '$'+cost.toFixed(2) );
	$('.ship_data').show();
}

/*- If STack hide shipping sumarry -*/
function shipCheck(){
	$('.ship_data').hide();
	if ( $('#add_to_stack').is(':checked') ){
		var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
		$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
		
		var ship_cost = $('.ship_cost:checked').val();
		if( typeof(ship_cost) != 'undefined' ){
			var help_array = ship_cost.split('#');
			var value_array = help_array[1].split(',');
			var cost = sum(value_array);
			if (cost > 0) $('#span_ship').text( '$'+cost.toFixed(2) );
			else $('#span_ship').text( 'FREE' );
			$('#ship_desc').html( '<strong class="tRed">Adding to Stack</strong>' );
			$('#ship_reduced').text('');
			$('.ship_data').show();
		}
	} else {
		var ship_cost = $('.ship_cost:checked').val();
		var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
		if( typeof(ship_cost) != 'undefined' ){
			set_grand_total(ship_cost);
			if ( $('#ship_country').val() == 'US' ){
				$('#ship_desc').html( '<strong class="tRed">FREE Shipping<br /> on orders over $150.</strong>' );
			}
			else{
				if(grand_total_value >=150){
					$('#ship_desc').html( '<strong class="tBlue">Reduced Shipping<br /> on orders over $150:</strong>' );
					$('.ship_data').show();
				}
				else{
					$('#ship_desc').html( '<strong class="tBlue">Receive reduced shipping on international orders over $150!</strong>' );
					//$('dt.ship_data').show();
					//$('dd.ship_data').hide();
				}
			}
		}
	}
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

var billingFields = ['bill_first_name','bill_last_name','bill_address1','bill_country','bill_zip','bill_city','bill_state','bill_state_2','bill_phone','bill_email'];
var shippingFields = ['ship_first_name','ship_last_name','ship_address1','ship_country','ship_zip','ship_city','ship_state','ship_state_2','ship_phone'];
var paymentFields = ['cc_number','exp_month','exp_year','card_cvn'];