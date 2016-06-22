$(document).ready(function(){
	/*
	 NEW CHECKOUT SCRIPTS (2013)
	*/
	
	
	/* ====== LOGIN ======== */
	/* - Switch New/Returning Customer Radio - */
	$('#checkout_login_form2 input[type="radio"]').change(function(){
		var currentRadio = $('#checkout_login_form2 input[type="radio"]:checked');
		if( currentRadio.val()=='1' ){
			//new customer
			$('#checkout_login_form2 #password')
				.attr('disabled','disabled')
				.css({'background':'#ccc', 'box-shadow':'0 0 0 1000px #ccc inset','color':'#666'});
			$('#checkout_login_form2 label[for="password"]').css('color','#ccc');
		} else {
			//returning customer
			$('#checkout_login_form2 #password')
				.removeAttr('disabled')
				.removeAttr('style');
			$('#checkout_login_form2 label[for="password"]').removeAttr('style');
		}
	});
	
	$('#checkout_login_form2 #pp_payment').click(function(event){
		event.preventDefault();
		$('#checkout_login_form2 input[name="payment_type"]').val('Paypal');	
			
		$('#checkout_login_form2').submit();
	});
	
	$('#checkout_login_form2 #cc_payment').click(function(event){
		event.preventDefault();
		$('#checkout_login_form2 input[name="payment_type"]').val('Credit Card');	
			
		$('#checkout_login_form2').submit();
	});
	
	$('#checkout_login_form2 #st_payment').click(function(event){
		event.preventDefault();
		$('#checkout_login_form2 input[name="payment_type"]').val('Stack');	
			
		$('#checkout_login_form2').submit();
	});
	
	/*--- Reset Form ---*/
	$('#contact_cancel').click(function(){
		$('#ch_contact_form')[0].reset();
	});

	
	
	/* ================= DELIVERY (SHIPPING) ================= */
	/* - Calculate Shipping + Shipping Options load - */
	if ( $('#delivery_choices').length > 0 ) calculateShipping();

	/*$('#ship_city, #ship_state').change(function(){
		calculateShipping();
	});*/
	
	$('#ship_zip').blur(function(){
		calculateShipping();
	});
	
	
	/* - Shipment Type Change - */
	$('#shipment_type').change(function(){
		calculateShipping();
		var currShipType = $(this).val();
		
		$('#ship_type_info > div').hide();
		$('#ship_type_info div[data-type="'+currShipType+'"]').show();
	});
	
	
	
	/* - Change Country Elements - */
	if ( $('#ship_country').length > 0 ) changeCountryElements('delivery');
	
	$('#ship_country').change(function(){
		changeCountryElements('delivery');
		calculateShipping();
	});
	
	
	/* - Delivery Options Boxes - */
	$('.delivery_block input[type="radio"]').live('click',function(){
		var lastCheckBlock = $(this).parents('#delivery_choices').find('.delivery_block.current');
			lastCheckBlock.removeClass('current');
		
		if( $(this).is(':checked') ){
			$(this).parents('.delivery_block').addClass('current');
		};
	});
	
	/* - Validate Delivery Form - */
	$("#delivery_form").validate({
		onkeyup:false,
		errorContainer:".error_hold2",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			if( element.attr('data-validgroup')=='account_group' )         error.appendTo('#account_error');
			else if( element.attr('data-validgroup')=='delivery_group' )    error.appendTo('#delivery_error');	
			else element.after(error);
		},
		showErrors: function(errorMap, errorList) {
    		this.defaultShowErrors();
			$('.error_hold2').each(function(){
				var invalidPerGroup = $(this).find('label:visible').length;
				if(invalidPerGroup==0) $(this).hide();
				else $(this).show();
			});
		},
		rules: {
			//account info
			customer_password: {required:true, minlength:6},
			re_customer_password: {required:true, equalTo:"#delivery_form #customer_password"},
			customer_first_name: {required:true},
			customer_last_name:{required:true},
			//delivery info
			ship_first_name: {required:true},
			paypal_email: {required:true},
			ship_last_name: {required:true},
			ship_phone: {required:true},
			ship_address1:{required:true},
			ship_country:{required:true},
			ship_city:{required:true},
			ship_state: {required:function(){
				if( $('#ship_country').val()=='US' ) return true;
				else return false;
			}},
			ship_zip: {required:true},
			shipment_calculator: {required:true},

		},
		messages:{
			//account messages
			customer_password: {required:"Please Enter password", minlength:"Password should be min 6 characters long"},
			re_customer_password: {required:"Please confirm new password", equalTo:"New password doesn't match"},
			customer_first_name: "Please complete First Name",
			paypal_email: "Please complete Paypal Email",
			customer_last_name: "Please complete Last Name",
			//delivery messages
			ship_first_name: "Please complete First Name",
			ship_last_name: "Please complete Last Name",
			ship_phone: "Please enter a valid Phone Number",
			ship_address1 :"Please complete Address",
			ship_city: "Please complete City",
			ship_state :"Please select a State",
			ship_zip: "Please enter a valid ZIP code",
			shipment_calculator:"Please select one of the Delivery Options",
		}
	});
	
	
	
	
	
	
	/* ================= PAYMENT ================= */
	/* - Add To SAtack Radio Change - */
	$('.check_stack_radio input').change(function(){
		$('.check_stack_radio.current').removeClass('current');
		$('.check_stack_radio input:checked').parent().addClass('current');
	});
	
	/* - Copy Ship To Bill - */
	$('#ship_to_bill').click(function(event){
		event.preventDefault();
		$.post(
			'/checkout/copy-shipping/',
			function(data){
				$.each(data, function(key, val){
					if (key == 'bill_country')
						if (val == 'US') {
							$('select#bill_state').show().removeAttr('disabled');
							$('input[type=text]#bill_state').hide().attr('disabled','disabled');
						}
						else {
							$('select#bill_state').hide().attr('disabled','disabled');
							$('input[type=text]#bill_state').show().removeAttr('disabled');
						}
						
					$('#'+key).val(val);
				});
			},
			'json'
		);
	});
	
	/* - Change Country Elements - */
	if ( $('#bill_country').length > 0 )
		changeCountryElements('payment');
	
	$('#bill_country').change(function(){
		changeCountryElements('payment');
	});
	
	/* - Validate Payment Froms - */
	$("#payment_form").validate({
		onkeyup:false,
		errorContainer:".error_hold2",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			error.appendTo('#payment_errors');
		},
		showErrors: function(errorMap, errorList) {
    		this.defaultShowErrors();
			$('.error_hold2').each(function(){
				var invalidPerGroup = $(this).find('label:visible').length;
				if(invalidPerGroup==0) $(this).hide();
				else $(this).show();
			});
		},
		rules: {
			bill_first_name: {required:true},
			bill_last_name: {required:true},
			bill_phone:{required:true},
			bill_address1:{required:true},
			bill_country:{required:true},
			bill_city:{required:true},
			bill_state: {required:function(){
				if( $('#bill_country').val()=='US' ) return true;
				else return false;
			}},
			bill_zip: {required:true},
			
			cc_number:{required:true, creditcard:true},
			exp_month:{required:true},
			exp_year:{required:true},
			card_cvn:{required:true, number:true}
		},
		messages:{
			bill_first_name: "Please complete First Name",
			bill_last_name: "Please complete Last Name",
			bill_phone: "Please enter a valid Phone Number",
			billing_address1 :"Please complete Address",
			bill_country: "Please select a Country",
			bill_city: "Please complete City",
			bill_state :"Please select a State",
			bill_zip: "Please enter a valid ZIP code",
			
			cc_number:{
				required: "Please enter Credit Card Number",
				creditcard: "Please enter a valid Credit Card Number"
			},
			exp_month: "Please enter Card Expiration Month",
			exp_year: "Please enter Card Expiration Year",
			card_cvn:{
				required:"Please enter CVN Code",
				number:"CVN must be a number value"
			}
		}
	});
	
	
});



/* =========================================================================================================================================================== */



function calculateShipping(){
	$('#delivery_choices').html('<div class="ship_calculating">Calculating, please wait...</div>');
	$('#delivery_submit').attr('disabled','disabled');
	$.post(
		'/checkout/shipcalculator-new/',
		$('#delivery_form').serialize(),
		function(data){
			$('#delivery_choices').html(data);
			var col_count = $('#delivery_choices .delivery_block').length;
			$('#delivery_choices').removeClass().addClass('clearfix delivery_'+col_count);
			$('#delivery_choices .c_ship:checked').parents('.delivery_block').addClass('current');
			$('#delivery_submit').removeAttr('disabled');
		}
	);
}

function changeCountryElements(page){
	if(page=='delivery'){
		var selCountry = $('#ship_country option:selected').val();
		if (selCountry != 'US') {
			$('select#ship_state').hide().attr('disabled','disabled');
			$('input[type=text]#ship_state').show().removeAttr('disabled');
		}else{
			$('select#ship_state').show().removeAttr('disabled');
			$('input[type=text]#ship_state').hide().attr('disabled','disabled');
			
		}
	} else if(page=='payment'){
		var selCountry = $('#bill_country option:selected').val();
		if (selCountry != 'US') {
			$('select#bill_state').hide().attr('disabled','disabled');
			$('input[type=text]#bill_state').show().removeAttr('disabled');
		}else{
			$('select#bill_state').show().removeAttr('disabled');
			$('input[type=text]#bill_state').hide().attr('disabled','disabled');
			
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