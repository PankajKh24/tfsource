$(document).ready(function(){
	
	// Dissable/Enable Thumbnails Arrow Navigator
	function reDisableThumbNav(){
		var prodCount = $('#voucher_input .thumbnails a:visible').length;
		var prodVisible = 6;
		var prodPrev = $('#voucher_input .thumb_nav .thumbPrev');
		var prodNext = $('#voucher_input .thumb_nav .thumbNext');
		var prodHold = $('#voucher_input .thumbnails');
		var prodWidth = $('#voucher_input .thumbnails a:visible').outerWidth(true);
		var sliderRows = 2;
		
		if ( prodCount<=prodVisible ) {
			$(prodPrev).addClass('dissabled');
			$(prodNext).addClass('dissabled');
		} else {
			if ( $(prodHold).position().left >= 0 ) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
			} else if ( $(prodHold).width()+$(prodHold).position().left <= (prodWidth*prodVisible)/sliderRows ) {
				$(prodNext).addClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			} else {
				$(prodNext).removeClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			};
		}
	};
	
	//adjust thumbnail slider css
	function reSlideThumbs(){
		var prodHold = $('#voucher_input .thumbnails');
		var prodItem = $('#voucher_input .thumbnails a:visible');
		var prodCount = $('#voucher_input .thumbnails a:visible').length;
		var prodVisible = 6;
		var sliderRows = 2;
		var prodWidth = prodItem.outerWidth(true);
		
		if( prodCount > (prodVisible/sliderRows) ) {
			if( prodCount>prodVisible ) var prodHoldWidth = prodWidth*Math.ceil(prodCount/sliderRows);
			else var prodHoldWidth = prodWidth*Math.ceil(prodVisible/sliderRows);
		} else 
			var prodHoldWidth = (prodWidth*prodCount);
		
		$('#voucher_input .thumbnails').width(prodHoldWidth);

		if ( prodCount<=prodVisible ) { $(prodHold).addClass('thumbsFull'); } else { $(prodHold).removeClass('thumbsFull'); };
		reDisableThumbNav();
	}
	
	
	function reClickThumb(){
		$('#voucher_input .thumbnails a.current').removeClass('current');
		
		var firstThumb = $('#voucher_input .thumbnails a:visible:first');
		if( firstThumb.attr('href') == $('#voucher_display img').attr('src') ) {
			firstThumb.addClass('current');
		} else {
			firstThumb.trigger('click');
		}
		
		var totalVisible =  $('#voucher_input .thumbnails a:visible').length;
		$('#voucher_input .thumbnails').attr('data-visible',totalVisible);
		
		reSlideThumbs();
	}
	
	function filterOccImages(){
		var occId = $('#gift_ocassion option:selected').attr('data-id');
		if( occId ){
			$('#voucher_input .thumbnails a').hide();
			$('#voucher_input .thumbnails a[data-occassion="'+occId+'"]').fadeIn(400,function(){
				reClickThumb();
			});

		} else {
			$('#voucher_input .thumbnails a').fadeIn(400,function(){
				reClickThumb();
			});
		}
	}
	
	
	
	/* - Voucher thumbnails - */
	if( $('#voucher_input .thumbnails a').length>0 ){
		thumbSlide3({
			items_hold:'#voucher_input .thumbnails',
			slide_items: 'a',
			numb_visible:6,
			rows:2
		});
		
		thumbGallery({
			thumbnail: '#voucher_input .thumbnails a',
			target: '#voucher_display .img_wrap'
		});
	};
	
	$('.vaucher_image').live('click',function(){
		var name = $(this).attr('data-name');
		$('#gift_image').val(name);
	});
	
	/* - Date Picker - */
	datepickerBuild(
		"#gift_date",
		0,
		"90d"
	);
	
	
	/* --- Customize Gift card --- */
	$('#gift_ocassion').change(function(){
		var gcOccasion = $('#gift_ocassion').val();
		if( $(this).val() != ''){
			$('#occ_design strong').text(gcOccasion);
			//$('.gc_message p span').text(gcOccasion);
		}
		
		filterOccImages();
	});
	
	$('#gift_amount').keyup(function(){
		var gcAmount = $(this).val();
		$('.price strong').text(gcAmount);
	});
	
	$('#recipient_name').keyup(function(){
		var recName = $(this).val();
		//if( $('#gift_ocassion').val() == '' ){
			$('.gc_message p span').text('');
		//}
		$('.gc_message p strong').text(recName);
	});
	
	$('#gift_message').keyup(function(){
		var gcMessage = $(this).val().replace(/\n/g, '<br/>');
		$('.gc_message div').html(gcMessage);
	});
	
	
	
	
	
	
	/* -- Credit Card Detect -- */
	ccDetect('#cc_number');
	
	
	/* - Validate Gift Card Form - */
	var customizeValid = $("#gc_customize_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			error.appendTo('#gift_errors');
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
			//'gift_ocassion': {required:true},
			'gift_amount': {
				required: true,
    			minStrict: 5
			},
			'recipient_name': {required:true},
			'recipient_email': {required:true, email:true},
			'name': {required:true},
			'gift_message': {required:true},
			'gift_date': {required:true}
		},
		messages:{
			//'gift_ocassion': "Select an ocassion",
			'gift_amount':{
				required: "Enter gift amount",
				minStrict: "Enter $5 minimum"
			},
			'recipient_name': "Enter recipient name",
			'recipient_email':{
				required:"Enter recipient email address",
				email:"Enter valid email address"
			},
			'name': "Enter your name",
			'gift_message': "Enter message",
			'gift_date': "Select delivery date"
		}
	});
	
	//Customize form submit
	$('#gift_voucher_submit').click(function(){

		if ( customizeValid.form() ) {
			$('body').append('<div class="process"><div>Please Wait...<span>Please wait for the next step, do not hit refresh or go back on your browser</span></div></div>');
		}
		
	});
	
	
	
	
	/*--- Checkout Boxes ----*/
	$('.checkout_box .ch_block_capt').click(function(){
		$(this).siblings('.ch_box_content').slideToggle(100);
		$(this).toggleClass('closed');
	});
	
	
	/* - Scroll Block - Summary Block - */
	if( $('#checkout_side').length>0 ){
		var scrl_oGal = '#checkout_side';
		var lock_oGal = '.gc_body';
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
	
	/* - Activate Paypal - */
	$('#paypal_radio').click(function(){
		$('#payment_submit').trigger('click');
	});
	
	/* - Validate Payment Form - */
	var paymentValid = $("#payment_form").validate({
		onkeyup:false,
		errorContainer:".error_holder",
		errorClass: "error",
		validClass: "valid",
		errorPlacement: function(error,element){
			if( $.inArray(element.attr('name'),billingFields)>=0 ) error.appendTo('#billing_error');
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
			//billing settings
			'bill_first_name': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_last_name': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_address1': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_country': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_zip': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_city': {required: function(){return !$('#paypal_radio').is(':checked');}},
			'bill_state_2': {required:{
				depends:function(element){ return ( $('#bill_country').val()=='US' && !$('#paypal_radio').is(':checked') ) }
			}},
			'bill_phone': {required: true},
			'bill_email': {required: function(){return !$('#paypal_radio').is(':checked');}, email:true},
			
			//payment settings
			'cc_number': { 
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) },
					creditcard: true
				},
			'exp_month': {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				},
			'exp_year': {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				},
			'card_cvn': {
					required: function(element){ return ( $('#validate_cc').val() == 1 && !$('#paypal_radio').is(':checked') ) }
				}
		},
		messages:{
			'bill_first_name': "Enter first name",
			'bill_last_name': "Enter last name",
			'bill_address1': "Enter address",
			'bill_country': "Select country",
			'bill_zip': "Enter ZIP code",
			'bill_city': "Enter city",
			'bill_state_2': {required:{
				depends:function(element){ return ( $('#bill_country').val()=='US' ); }
			}},
			'bill_phone': "Enter phone number",
			'bill_email':{
				required:"Enter email address",
				email:"Enter valid email address"
			},
			'cc_number': {required:'Credit card number is required', creditcard:'This is not valid credit card number'},
			'exp_month': "Enter expiration month",
			'exp_year': "Enter expiration year",
			'card_cvn': "Enter security code"
		}
	});
	

	/*--- States -----*/
	$('#bill_country').change(function(){
		if ( $(this).val() == 'US' ) {
			$('#bill_state').attr('disabled','disabled');
			$('#bill_state').hide();
			$('#bill_state_2').removeAttr('disabled');
			$('#bill_state_2').show();
		}
		else {
			$('#bill_state_2').attr('disabled','disabled');
			$('#bill_state_2').hide();
			$('#bill_state').removeAttr('disabled');
			$('#bill_state').show();
		}
	});
	
	$('#bill_country').trigger('change');
	
	$('#payment_submit').click(function(event){
		event.preventDefault();

		if ( paymentValid.form() ) {
			$('body').append('<div class="process"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');

			if( $('#paypal_radio').is(':checked') )
			{
				// Paypal checkout
				$('.process').remove();
				$('#payment_form').attr('action','/gift-card/paypal/');
				$('#paypal_submit_img').trigger('click');
			}
			else
			{
				// Authorize Validate
				$.post(
					'/gift-card/authorize-validate/',
					$('#payment_form').serialize(),
					function(data){
						if (data == '') {
							$('#payment_form').submit();
						} else {
							$('.process').remove();
							$('#payment_error').html(data);
							$('#payment_error').show();
						}
					}
				);
			}
		} 
		else 
		{
			alert('Errors found in checkout form. Please check all data again.');
		};
	});
	
	
	$('#gc_submit').click(function(){
		$('body').append('<div class="process"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');
	});
	
	
});

/* ================================================================================ */
var billingFields = ['bill_first_name','bill_last_name','bill_address1','bill_country','bill_zip','bill_city','bill_state','bill_phone','bill_email'];
var paymentFields = ['cc_number','exp_month','exp_year','card_cvn'];

$.validator.addMethod('minStrict', function (value, el, param) {
    return value >= param;
});

/* Date Picker Init */
function datepickerBuild(dateSelector, dateLimitMin, dateLimitMax){
	$(dateSelector).datepicker({
		maxDate: dateLimitMax,
		minDate: dateLimitMin,
        onSelect: function(selected) {
           $(dateSelector).datepicker("option","maxDate")
        },
		dateFormat:"yy-mm-dd"
	});
}


/*=============== THUMBNAIL Gallery ================*/
function thumbGallery(settings){
	var thumb = settings['thumbnail'];
	var screenTarg = settings['target'];
	
	//click on thumb
	$(thumb).click(function(event){
		event.preventDefault();
		
		if ( $(this).hasClass('movieThumb') ) {
			var videoWidth = $(this).attr('data-size').split('x')[0];
			var videoHeight = $(this).attr('data-size').split('x')[1];
			var videoUrl = $(this).attr('href');
			var videoTitle = $(this).attr('title');
			modalCreate(videoTitle,'video_modal');
			fillVideoModal(videoUrl,videoWidth,videoHeight);
			
		}else{
			if( !$(this).hasClass('current') ){
				$(this).siblings().removeClass('current');
				$(this).addClass('current');
				
				var targPath = $(this).attr('href');
				
				$(screenTarg).append('<div class="processing"><div>Loading...</div></div>');
				$(screenTarg+' img').load(function(){
					$(this).siblings('.processing').remove();
				}).attr('src',targPath);
			}
		}
		
	});
}


/*=============== THUMBNAIL SLIDER 3 ================*/
function thumbSlide3(settings){
	var prodVisible = settings['numb_visible'];
	var itemsHold = settings['items_hold'];
	var prodItem = $(itemsHold).find(settings['slide_items']);
	var prodCount = $(itemsHold).find(settings['slide_items']+':visible').length;
	var sliderRows = settings['rows'];
	
	
	
	// Build Additional Elements and adjust CSS
	$(itemsHold).wrap('<div class="thumbs_wrap"><div class="thumbs_hold"></div></div>');
	$(itemsHold).parents('.thumbs_wrap').append('<div class="thumb_nav"><a class="thumbPrev" href="#" rel="noindex,nofollow">Prev</a><a class="thumbNext" href="#" rel="noindex,nofollow">Next</a></div>');
	
	//define new objs
	var prodHold = $(itemsHold);
	var prodPrev = prodHold.parents('.thumbs_wrap').find('.thumbPrev');
	var prodNext = prodHold.parents('.thumbs_wrap').find('.thumbNext');
	
	//adjust thumbnail slider css
	if ( prodCount>0 ) {
		var prodWidth = prodItem.outerWidth(true);
		
		if( prodCount > (prodVisible/sliderRows) ) {
			if( prodCount>prodVisible ) var prodHoldWidth = prodWidth*Math.ceil(prodCount/sliderRows);
			else var prodHoldWidth = prodWidth*Math.ceil(prodVisible/sliderRows);
		} else 
			var prodHoldWidth = (prodWidth*prodCount);
		
		$(prodHold).width(prodHoldWidth);
		
		var itemHeight = $(prodItem).outerHeight(true);
		var holdHeight = itemHeight*sliderRows;
		$(prodItem).parents('.thumbs_hold').css('height', holdHeight);
		//alert(holdHeight);
		
		$(prodHold).addClass('thumbsActivated');
		if ( prodCount<=prodVisible ) { $(prodHold).addClass('thumbsFull'); } else { $(prodHold).removeClass('thumbsFull'); };
		dissableProdNav();
	} else {
		$(prodHold).parents('.thumbs_wrap').hide();
	};
	
	// Dissable/Enable Thumbnails Arrow Navigator
	function dissableProdNav(){
		if ( prodCount<=prodVisible ) {
			$(prodPrev).addClass('dissabled');
			$(prodNext).addClass('dissabled');
		} else {
			if ( $(prodHold).position().left >= 0 ) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
			} else if ( $(prodHold).width()+$(prodHold).position().left <= (prodWidth*prodVisible)/sliderRows ) {
				$(prodNext).addClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			} else {
				$(prodNext).removeClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			};
		}
	};
	
	// Thumbnails Slider Controls
	prodNext.click(function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"-="+(prodWidth*prodVisible)/sliderRows +'px'}, 300, function(){dissableProdNav()}  );
		};

	});
	prodPrev.click(function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"+="+(prodWidth*prodVisible)/sliderRows +'px'}, 300, function(){dissableProdNav()}  );
		};
	});
};
