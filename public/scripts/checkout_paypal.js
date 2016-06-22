$(document).ready(function(){
	
	/*--- Checkout Boxes ----*/
	$('.checkout_box .ch_block_capt').click(function(){
		$(this).siblings('.ch_box_content').slideToggle(100);
		$(this).toggleClass('closed');
	});
	
	$('#use_store_credit').change(function(){
		set_grand_total();
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
	
	/* gift message */
	$('#gift_flag').change(function(){
		if( $(this).is(':checked') ){
			$('#gift_message').slideDown(300);
		}else{
			$('#gift_message').slideUp(300);
		}
	});
	
	/*--- Validate Form Fields ---*/
	var checkoutValid = $("#paypal_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			error.appendTo('#shipping_error');
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
			//shiping info
			ship_first_name: {required:true},
			ship_last_name: {required:true},
			ship_address1: {required:true},
			ship_city: {required:true},
			ship_zip: {required:true},
			ship_country: {required:true},
			ship_state: {required:true},
			ship_phone: {required:true},
		},
		messages: {			
			//shipping info
			ship_first_name: {required:'First name is required field.'},
			ship_last_name: {required:'Last name is required field.'},
			ship_address1: {required:'Address is required field.'},
			ship_city: {required:'City is required field.'},
			ship_zip: {required:'Zip is required field.'},
			ship_country: {required:'Country is required field.'},
			ship_state: {required:'State field is required for United States'},
			ship_phone: {required:'Phone number is required field.'}
		}
		
		
	});

	calculate_shippment();
	
	$('#checkout_submit').click(function(event){
		event.preventDefault();

		if ( $('.ship_cost').length < 1 && $('.ship_cost_vintage').length < 1 ) {
			alert('Please calculate shipping first.');
			return false;
		}

		if ( checkoutValid.form() ) {
			$('body').append('<div class="processing ch_processing"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');					
			$('#paypal_form').submit();
		} else {
			alert('Errors found in checkout form. Please check all data again.');
		}
	});
});

/*--- Tax Function ----*/
function checkTax() {
	var order_subtotal = $('#order_subtotal').val()*1;		
	var order_discount = $('#order_discount').val()*1;
	var ship_state = $('#ship_state').val();
	
	if ( ship_state == 'NV' ){
		var tax = order_subtotal * 8.1/100;
		$('.tax_data').show();
	}else{ 
		var tax = 0;
		$('.tax_data').hide();
	}

	$('#tax_charge').val(tax);
	$('#span_tax').html(number_format(tax, 2, '.', ''));
	set_grand_total();
}

/*- Change Shipping Type -*/
function calculate_shippment(){
	if ( $('#same_checkbox').is(':checked') ) {
		var freezeLock = true;
		shipRelease();
	} else {
		var freezeLock = false;
	}
	
	$('#newly_received').hide();
	
	/* NORMAL */
	if ( $('#ship_method_opts').length > 0 || $('#add_to_stack').is(':checked') ) {
		$.post(
			'/checkout/shipcalculator/',
			$('#paypal_form').serialize(),
			function(data){
				if( freezeLock ) shipFreeze();
				$.each(data, function(key, val){
					if (key=='options') {
						$('#ship_method_opts').html(val);
						if ( val.indexOf("*") > 0 )
							$('#newly_received').show();
					} /*else if(key=='cost') {
						if ( val ) {
							set_grand_total();
							if (val == 0) $('#span_ship').text( 'FREE' );
							else $('#span_ship').html( '$'+val.toFixed(2) );
						} else {
							var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
							$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
							$('.ship_data').hide();
						}
					}*/
				});
				shipCheck();
			},
			'json'
		);
	}
	
	/* VINTAGE */
	if ( $('#ship_method_opts_vintage').length > 0 ) {
		$.post(
			'/checkout/shipcalculator/?vintage=1',
			$('#paypal_form').serialize(),
			function(data){
				if( freezeLock ) shipFreeze();
				$.each(data, function(key, val){
					if (key=='options') {
						$('#ship_method_opts_vintage').html(val);
					} /*else if(key=='cost') {
						if ( val ) {
							set_grand_total();
							$('#span_ship_vintage').html( '$'+val.toFixed(2) );
						} else {
							var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
							$('#span_grand').text( '$'+grand_total_value.toFixed(2) );
							$('.ship_data').hide();
						}
					}*/
				});
				shipCheck();
			},
			'json'
		);
	}
}

function outputarray(element, index, array) {
	document.write("Element "+index+" contains the value "+element+"<br />");
}
sum = function(o){
	for(var s = 0, i = o.length; i; s += o[--i]*1);
	return s;
};

/*- Change Shipping Handle -*/
function set_grand_total()
{
	var ship_cost = $('.ship_cost:checked').val();
	if( typeof(ship_cost) != 'undefined' ){
		var help_array = ship_cost.split('#');
		var value_array = help_array[1].split(',');
		var cost = sum(value_array);
	} else {
		cost = 0;
	}
	
	var ship_cost_vintage = $('.ship_cost_vintage:checked').val();
	if( typeof(ship_cost_vintage) != 'undefined' ){
		var help_array = ship_cost_vintage.split('#');
		var value_array = help_array[1].split(',');
		var cost_vintage = sum(value_array);
	} else {
		cost_vintage = 0;
	}
	

	var grand_total_value = $('#order_subtotal').val()*1 + cost*1 + cost_vintage*1 + $('#tax_charge').val()*1;
	if ( $('#use_store_credit').is(':checked') )
		var credit_total = $('#credit_total').val()*1;
	else
		var credit_total = 0;
	
	if ( grand_total_value < credit_total ) {
		used_credit = grand_total_value;
		grand_total_value = 0;
	} else {
		grand_total_value -= credit_total;
		used_credit = credit_total;
	}
	
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
	$('#span_ship_vintage').text( '$'+cost_vintage.toFixed(2) );
	
	$('.ship_data').show();
	$('.ship_vintage_data').show();
	$('#vintage_ship_hold').show();
	
	$('#span_credit').text( used_credit.toFixed(2) );
	if ( used_credit > 0 ) $('.store_credit').show();
	else $('.store_credit').hide();
	
}


/*- If STack hide shipping sumarry -*/
function shipCheck(){
	checkTax();
	$('.ship_data').hide();

	var ship_cost = $('.ship_cost:checked').val();
	var grand_total_value = $('#order_subtotal').val()*1 + $('#tax_charge').val()*1;
	if( typeof(ship_cost) != 'undefined' ){
		set_grand_total();
		if ( $('#ship_country').val() == 'US' ){
			$('#ship_desc').html( '<span class="small tRed"><strong>FREE Shipping on orders $150+</strong></span><a href="">Details</a>' );
		}
		else{
			if(grand_total_value >=150){
				$('#ship_desc').html( '<span class="small tBlue">Reduced Shipping on international orders $150+:</span>' );
				$('.ship_data').show();
			}
			else{
				$('#ship_desc').html( '<span class="small tBlue">Receive reduced shipping on international orders $150+</span>' );
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

var billingFields = ['bill_first_name','bill_last_name','bill_address1','bill_country','bill_zip','bill_city','bill_state','bill_phone'];
var shippingFields = ['ship_first_name','ship_last_name','ship_address1','ship_country','ship_zip','ship_city','ship_state','ship_phone'];
var paymentFields = ['cc_number','exp_month','exp_year','card_cvn'];