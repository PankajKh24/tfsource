$(document).ready(function(){
	
	/*=== Init Product Gallery ===*/
	productGallery('#p-gallery');
	
	
	/*================= PERSONAL ASSISTANT POPUP =================*/
	if( $('#out_of_stock_lightbox').length>0 ){
		
		var outstockId = $('#assistent_product_id').val();
		var outstockClosed = false;
		var outstockCookie = readCookie('outstock_box');
		
		if(outstockCookie) {
			var outstockClosedPopups = outstockCookie.split(',');
			$.each(outstockClosedPopups,function(index, value){
				if( value==outstockId ) outstockClosed = true;
			});
			
		} else {
			var outstockClosedPopups = '';
			outstockCookie = '';
		}
		
		function showPopup(popupId) {
			$(popupId).show(200);
		};

		function timedPopup(popupId, popupTimeout) {
			if( $(popupId).length>0 ){
				if( typeof(popupTimeout)==='undefined' ) popupTimeout=3000;
				var t = setTimeout(
					function(){ 
						showPopup(popupId);
					}, 
					popupTimeout
				);
			}
		};
		
		if( !outstockClosed ){
			// open popup
			timedPopup('#out_of_stock_lightbox', 3000);
			
			//cose popup
			$('#out_of_stock_lightbox .close_btn').click(function(event){
				event.preventDefault();
				$(this).parents('#out_of_stock_lightbox').hide(150);
				if( outstockCookie!='' ) outstockCookie += ','+outstockId;
				else outstockCookie = outstockId;
				createCookie('outstock_box',outstockCookie,7*24);
			});
		}
		
	}


	
	
	/*=============== Add To Stock Click =================*/
	$("#add_to_stock").click(function() { 
		var stackDisclaimer = "";
		stackDisclaimer = "You are about to add this item to your stack! \n\n";
		stackDisclaimer += "You can manage your stack by logging in to my source and clicking on stack manager. At any time you can have orders ship out from your stack by selecting them in stack manager and generating an order.\n\n";
		stackDisclaimer += "Items in your stack will be charged when they are instock, instock items added to your stack will be charged when added.  Shipping costs will be calculated later and charged separately based on the items you ship out in an order generated from your stack.";
		
		if( confirm(stackDisclaimer) ) {
			if(check_option()) {
				$.post(
					"/products/addtostock/",
					$("#price-form").serialize(),
					function(data) {
						if(data) alert(data);
						else {
							var stack_url = $('#base_url_stack').val();
							window.location = stack_url;
						}
				});
			}
		}
		return false;
	});
	
	/*============ Requst Wholesale =================*/
	$('#request_wholesale').click(function(event){
		event.preventDefault();
		var product_id = $(this).attr('href');
		
		$.post(
			"/products/request-wholesale/",
			{product_id: product_id},
			function(data) {
				if (data=='success')
					alert('Your request for wholesale on this item has been forwarded to the Wholesale Team!\n\nThey will look for any wholesale availability on this item and get back to you shortly with a response.');
				else
					alert('An error occured. Please try again.');
					
			}
		);
	});
	
	/*============ Requst Restock =================*/
	$('#request_restock').click(function(event){
		event.preventDefault();
		var product_id = $(this).attr('href');
		
		$.post(
			"/products/request-wholesale/",
			{product_id: product_id, restock: 1},
			function(data) {
				if (data=='success')
					alert('Your request for re-stock on this item has been forwarded to the Wholesale Team!\n\nThey will look for any re-stock availability on this item and get back to you shortly with a response.');
				else
					alert('An error occured. Please try again.');
			}
		);
	});
	
	/*================ ADD REVIEW ===============*/
	/*- Open Add Review Box -*/
	$('.hidden_open').live('click',function(event){
		event.preventDefault();
		var hidTarg = $(this).attr('href');
		$(hidTarg).show();
	});
	
	/*- Close add review box -*/
	$('.hidden_close').live('click',function(event){
		event.preventDefault();
		var hidTarg = $(this).attr('href');
		$(hidTarg).hide();
	});
	
	/*- Submit Review -*/
	$("#review_submit").click(function(){					   				   
		$(".error").hide();
		var hasError = false;
		
		var review_title = $("#review_title").val();
		if(review_title == '') {
			$("#review_title").after('<span class="error">You forgot to enter Title.</span>');
			hasError = true;
		};

		var review_comment = $("#review_comment").val();
		if(review_comment == '') {
			$("#review_comment").after('<span class="error">You forgot to enter Comment.</span>');
			hasError = true;
		};
		
		var under_18 = 0;

		for( i = 0; i < document.review_form.under_18.length; i++ ) {
			if( document.review_form.under_18[i].checked == true )
			under_18 = document.review_form.under_18[i].value;
		};

		if(under_18 == 0) {	
			alert('You must be at least 18 years old to write a review');
			hasError = true;
		};
		
		var review_rate = $("#review_rate").val();
		
		var review_full_name = $("#review_full_name").val();
		if(review_full_name == '') {
			$("#review_full_name").after('<span class="error">You forgot to enter Alias.</span>');
			hasError = true;
		};
		
		if(hasError == false) {
			var rev_cust_id = $('#review_customer_id').val();
			var rev_prod_id = $('#review_product_id').val();
			$.post(
				"/products/rating/",
				{review_title:review_title, review_comment:review_comment, review_rate:review_rate, product_id:rev_prod_id, customer_id:rev_cust_id, review_full_name:review_full_name},
   				function(data){
					if(data){
						$('#reviews_response').html(data);
						$("#review_form").slideUp(200, function(){
							$("#review_form").before('<div id="reviews_response">'+data+'</div>');
							var reviewOff = setTimeout(function(){
								$('#add_review').find('.hidden_close').trigger('click');
								$("#review_form").show();
								$('#add_review').children('#reviews_response').remove();
							},3000);
						});
					} else alert(data);
   				}
			);
		};
		return false;
	});
	
	
	/*================ UPDATE PRICES ===============*/
	/*----- Wholesale Product Page -----*/
	$('#qty_case, #qty_single').live('change', function(){
		
		if ( $('#ws_single_price').length > 0 ) {
			var singlePrice = $('#ws_p_options #ws_single_price').text();
			singlePrice = parseFloat(singlePrice.substring(1));
			var singleQty = parseFloat( $('#ws_p_options #qty_single').val() );
		} else {
			var singlePrice = 0;
			var singleQty = 0;
		};
		
		if ( $('#qty_case').length > 0 ) {
			var caseSize = $('#case_size').val();
			var casePrice = $('#ws_case_price').text();
				casePrice = parseFloat(casePrice.substring(1));
			var caseQty = parseFloat( $('#ws_p_options #qty_case').val() );
		} else {
			var caseSize = 0;
			var casePrice = 0;
			var caseQty = 0;
		}
		
		var totalPrice = number_format( (caseQty*casePrice + singleQty*singlePrice),2,'.','' );
		var totalQty = number_format( (caseQty*caseSize + singleQty),0 );
		
		$('#ws_total_price').text('$'+totalPrice);
		$('#ws_total_qty').text(totalQty);
	});
	
});



/*================= FORMS VALIDATIONS =================*/
var items_in_cart = 0;


/*========== Base price (Add to Cart) Validation ==========*/
function check_option(){
	//options validation: nothing checked
	if(document.getElementById('with_options').value==1) {
		test_val = false;
		if(document.submit_form.option_id.length) {
			for (i=0; i<document.submit_form.option_id.length; i++)
				test_val = test_val || document.submit_form.option_id[i].checked;
		} else test_val = test_val || document.submit_form.option_id.checked;

		if(test_val == false) {
			alert('Please check one product option before adding this item to your cart. \n\n*(Example:  C9 Box, Mint Box, Missing Missile, etc.)');
			return false;
		}	
	};
	
	
	var qtyVal = $('#qty').val();
	var qtyValCase = $('#qty_case').val();
	var qtyValSingle = $('#qty_single').val();
	
	if ( $('#qty_case').length > 0 || $('#qty_single').length > 0 ) {
		if ( qtyValCase > 0 ) qtyVal = qtyValCase;
		else if ( qtyValSingle > 0 ) qtyVal = qtyValSingle;
		else qtyVal = 0;
	}
	
	//qty validation: 0 items
	if( qtyVal==0 ) {
		alert('Please specify min 1 item.');
		document.getElementById('qty').focus();
		return false;
	};
	
	//qty validation: empty field
	if( isNaN(qtyVal) || qtyVal=='' ) {
		alert('Quantity is not a Number!');
		document.getElementById('qty').focus();
		return false;
	};
	
	//qty validation < 0 items
	if( qtyVal*1 < 0 ) {
		alert('You can\'t use negative value for product quantity.');
		document.getElementById('qty').focus();
		return false;
	};
	
	
	if( typeof qtyVal=='number' && /^-?\d+$/.test(qtyVal+'') ) {
		alert('Please use whole number for quantity');
		document.getElementById('qty').focus();
		return false;
	};
	
	
	//qty validation: qty > number in stock
	/*if((qtyVal*1 + items_in_cart*1) > (document.getElementById('current_stock').value*1)) {
		alert('Unfortunately we do not have that many pieces available for sale. Please revise your order quantity and try again, or email us regarding availability.');
		document.getElementById('qty').focus();
		return false;
	};*/
	
	//enough reward points for purchase
	if ( $('#option_id_points').is(':checked') ) {
		if ( $('#point_status').val() < $('#reward_price').val()*$('#qty').val() ) {
			alert('You do not have enogh remining reward points for this purchase. Please, decrease the quantity.');
			return false;
		}	
	}
	
	return true;
};


/*=========== QTY Discounts Validation ===========*/
function check_option_2() {
	if(document.getElementById('with_options').value==1) {
		test_val = false;
		
		if(document.submit_form.option_id.length) {
			for (i=0;i<document.submit_form.option_id.length;i++) {
				test_val = test_val || document.submit_form.option_id[i].checked;
				if(document.submit_form.option_id[i].checked) document.submit_two.option_id.value = document.submit_form.option_id[i].value;
			};
		} else {
			test_val = test_val || document.submit_form.option_id.checked;
			if(document.submit_form.option_id.checked) document.submit_two.option_id.value = document.submit_form.option_id.value;
		};

		if(test_val == false) {
			alert('Please check one product option before adding this item to your cart.\n\n*(Example: C9 Box, Mint Box, Missing Missile, etc.) ');
			return false;
		};	
	};
	
	if( (document.getElementById('current_stock').value*1 + items_in_cart*1) < 2 ){
		alert('Unfortunately we do not have that many pieces available for sale. Please revise your order quantity and try again, or email us regarding availability.');
		document.getElementById('qty').focus();
		return false;
	};
	
	return true;
};


/*=========== Case Discounts Validation ========*/
function check_option_case(case_value) {
	if( (document.getElementById('current_stock').value*1 + items_in_cart*1) < case_value ) {
		alert('We are sorry but there is no cases available anymore! Please conntact us!.....');
		document.getElementById('qty').focus();
		return false;
	};
	
	if(document.getElementById('with_options').value==1) {
		test_val = false;
		
		if(document.submit_form.option_id.length) {
			for (i=0;i<document.submit_form.option_id.length;i++) {
				test_val = test_val || document.submit_form.option_id[i].checked;
				if(document.submit_form.option_id[i].checked) document.submit_two.option_id.value = document.submit_form.option_id[i].value;
			};
		} else {
			test_val = test_val || document.submit_form.option_id.checked;
			if(document.submit_form.option_id.checked) document.submit_two.option_id.value = document.submit_form.option_id.value;
		};

		if(test_val == false) {
			alert('Please check one product option before adding this item to your cart.\n\n*(Example: C9 Box, Mint Box, Missing Missile, etc.) ');
			return false;
		};	
	};
	
	return true;
};


/*============ Cross Sale Validation ===========*/
function check_option_cross(form_elements) {
	if(document.getElementById('with_options').value==1) {
		test_val = false;
		if(document.submit_form.option_id.length) {
			for (i=0;i<document.submit_form.option_id.length;i++) {
				test_val = test_val || document.submit_form.option_id[i].checked;
				if(document.submit_form.option_id[i].checked) form_elements.option_id.value = document.submit_form.option_id[i].value;
			};
		} else {
			test_val = test_val || document.submit_form.option_id.checked;
			if(document.submit_form.option_id.checked) form_elements.option_id.value = document.submit_form.option_id.value;
		};
		
		if(test_val == false) {
			alert('Please check one product option before adding this item to your cart.\n\n*(Example: C9 Box, Mint Box, Missing Missile, etc.)');
			return false;
		};	
	};
	return true;
};


/*================= PRODUCT GALLERY =================*/
function productGallery(galObj){
	var thumbHold = $(galObj+' .thumbnails');
	var thumbCount = $(thumbHold).find('a').length;
	var thumbPrev = $(galObj+' .gallery_prev');
	var thumbNext = $(galObj+' .gallery_next');
	var mainImg = $(galObj+' .main_img_hold').children('img');
	var galModalElem = '<div class="modal_overlay"></div><div class="gallery_show"><div class="gallery_show_hold"></div>';
	galModalElem += '<a class="modal_prev" href="#" title="Previous Image">&lt;</a>';
	galModalElem += '<a class="modal_next" href="#" title="Next Image">&gt;</a>';
	galModalElem += '<a class="gallery_close" href="#" title="Close This Window">X</a>';
	galModalElem += '</div>';
	
	/*- Click on Thumb -*/
	$(thumbHold).find('a').live('click', function(event){
		event.preventDefault();
		if ( !$(this).hasClass('current') ){
			$(this).parent().find('.current').removeClass('current');
			$(this).addClass('current');
			var mainImgSrc = $(this).attr('href');
			
			$(mainImg).parent().append('<div class="gallery_loading">Loading...</div>');
			$(mainImg).load(function(){
				$(mainImg).parent().find('.gallery_zoom').attr('href',mainImgSrc);
				$(mainImg).parent().find('.gallery_loading').remove();
			}).attr({'src':mainImgSrc, 'longdesc':mainImgSrc});
		};
	});
	
	/*- Adjust Thumbnails Slider CSS -*/
	if ( thumbCount>0 ) {
		var thumbWidth = $(thumbHold).find('a').outerWidth(true);
		var thumbHoldWidth = thumbCount*thumbWidth;
		$(thumbHold).width(thumbHoldWidth);
		dissableNavThumb();
	};
	
	/*- Dissable Thumbnails Arrow Navigator -*/
	function dissableNavThumb(){
		if ( thumbCount<=6 ) {
			$(thumbPrev).addClass('dissabled');
			$(thumbNext).addClass('dissabled');
		} else {
			if ( $(thumbHold).position().left >= 0 ) {
				$(thumbPrev).addClass('dissabled');
				$(thumbNext).removeClass('dissabled');
			//} else if ( $(thumbHold).position().left+$(thumbHold).width() <= $(thumbHold).width() ) {
			} else if ( $(thumbHold).width()+$(thumbHold).position().left <= (thumbWidth*6) ) {
				$(thumbNext).addClass('dissabled');
				$(thumbPrev).removeClass('dissabled');
			} else {
				$(thumbNext, thumbPrev).removeClass('dissabled');
			};
		}
	};
	
	
	/*- Thumbnails Slider Controls -*/
	$(thumbNext).live('click',function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !$(thumbHold).is(':animated') ) {
			$(thumbHold).animate( {'left': "-="+(thumbWidth*6)+'px'},300,function(){dissableNavThumb()}  );
		};
	});

	$(thumbPrev).live('click',function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !$(thumbHold).is(':animated') ) {
			$(thumbHold).animate( {'left': "+="+(thumbWidth*6)+'px'},300, function(){dissableNavThumb()}  );
		};
	});
	
	
	/*--- GALLERY ZOOM BOX ---*/
	
	/*- Gallery Zoom Image -*/
	$(galObj+' .gallery_zoom').live('click', function(event){
		event.preventDefault();
		$('body').append(galModalElem);
		$('.gallery_show').show();
		var bigImgSrc = $(this).attr('href');
		galLoadBig(bigImgSrc);
	});
	
	/*- Show Big Image Click -*/
	function galLoadBig(bigImgSrc){
		$('.gallery_show_hold').append('<div class="gallery_loading">Loading...</div>');
		
		var preloadImg = new Image();
        $(preloadImg).load(function(){
			$('.gallery_show_hold .gallery_loading').remove();
			$('.gallery_show_hold').html(this);
			var posTarg = $('.gallery_show');
			posCenter(posTarg);
			disableNavBig();
		}).attr('src',bigImgSrc);
	};
	
	/*- Center Image on Screen -*/
	function posCenter(posTarg){
		var elWidth = $(posTarg).find('img').outerWidth(true);
		var elHeight = $(posTarg).find('img').outerHeight(true);
		var winOffs = $(window).scrollTop();
		var winHeight = $(window).height();
		
		if ( elHeight > (winHeight-80) ) {
			$(posTarg).css({'max-height': (winHeight-20)+'px'});
			$(posTarg).find('img').css({'max-height': (winHeight-80)+'px'});
		} else {
			$(posTarg).css({'max-height': 'auto'});
			$(posTarg).find('img').css({'max-height': 'auto'});
		};
		
		elTop = (elHeight/2)+40;
		if ( elTop > (winHeight/2)  )
			{ elTop=winHeight/2 };
		
		
		$(posTarg).css({
			'margin-left': '-'+(elWidth/2)+'px',
			'margin-top': '-'+elTop+'px'
		});
	};
	
	/*- Close Big image Box - Btn click -*/
	$('.gallery_close').live('click', function(event){
		event.preventDefault();
		$(this).parents('.gallery_show').hide(100,function(){
			$('.modal_overlay').fadeOut(220,function(){
				$('.gallery_show, .modal_overlay').remove();
			})
		});
	});
	
	/*- Close Big image Box - Overlay click -*/
	$('.modal_overlay').live('click',function(event){
		event.preventDefault();
		if(event.target == this) {
			$('.gallery_show').fadeOut(220, function(){$(this).remove()});
			$('.modal_overlay').delay(80).fadeOut(150, function(){$(this).remove()});
		} else {
			event.stopPropagation();
		};
	});
	
	
	/*- Image Navigation NEXT -*/
	$('.modal_next').live('click', function(event){
		event.preventDefault();
		var bigImgSrc_Current = $('.gallery_show_hold img').attr('src');
		var currImgObj = $(thumbHold).find('a[href="'+bigImgSrc_Current+'"]');
		var nextImgObj = $(currImgObj).next();
		
		if ( $(currImgObj).length==0 ){
			nextImgObj = $(thumbHold).find('a:first');
			if (thumbCount == 0) {$('.modal_next').hide();} else {$('.modal_next').show()};
			//$('.modal_next').show();
		} else {
			if ( $(currImgObj).is(':last-child') ) {
				$('.modal_next').hide();
			} else {
				$('.modal_next').show();
			};
		};
		
		var nextImgSrc = $(nextImgObj).attr('href');
		galLoadBig(nextImgSrc);
	});
	
	/*- Image Navigation PREV -*/
	$('.modal_prev').live('click', function(event){
		event.preventDefault();
		var bigImgSrc_Current = $('.gallery_show_hold img').attr('src');
		var currImgObj = $(thumbHold).find('a[href="'+bigImgSrc_Current+'"]');
		var prevImgObj = $(currImgObj).prev();
		
		if ( $(prevImgObj).length==0 ){
			//prevImgObj = $(thumbHold).find('a:last');
			$('.modal_prev').hide();
		} else {
			$('.modal_prev').show();
		};

		var prevImgSrc = $(prevImgObj).attr('href');
		galLoadBig(prevImgSrc);
	});
	
	
	function disableNavBig(){
		var bigImgSrc_Current = $('.gallery_show_hold img').attr('src');
		var currImgObj = $(thumbHold).find('a[href="'+bigImgSrc_Current+'"]');
		var nextImgObj = $(currImgObj).next();
		var prevImgObj = $(currImgObj).prev();
		
		if ( $(currImgObj).length==0 ){
			nextImgObj = $(thumbHold).find('a:first');
			if (thumbCount == 0) {$('.modal_next').hide();} else {$('.modal_next').show()};
		} else {
			if ( $(currImgObj).is(':last-child') ) {
				$('.modal_next').hide();
			} else {
				$('.modal_next').show();
			};
		};
		
		if ( $(prevImgObj).length==0 ){
			//prevImgObj = $(thumbHold).find('a:last');
			$('.modal_prev').hide();
		} else {
			$('.modal_prev').show();
		};
		
		return nextImgObj, prevImgObj;
	};
	
};


/*================= SPINNER BUTTON CONTROL =================*/
function spinner(settings){
	//- Vars
	var spinObj = settings['selector'];
	var downLimit = settings['low_limit'];
	var upLimit = settings['high_limit'];
	var downLimitMsg = settings['low_limit_message'];
	var upLimitMsg = settings['high_limit_message'];
	var advLimit = settings['advanced_limiter'];
	
	if(!downLimitMsg) downLimitMsg='';
	if(!upLimitMsg) upLimitMsg='';
	if(!upLimit) upLimit=1000000;
	
	//- Constructor
	$(spinObj).wrap('<div class="spinner"></div>');
	$(spinObj).parent().append('<div class="spin_ctrl"><div class="spinUp">Up</div><div class="spinDown">Down</div></div>');
	//$(spinObj).attr('readonly','readonly');
	
	//- Click Events
	$('.spinUp').click(function(){
		var currSpinObj = $(this).parents('.spinner').children('input');
		var currSpinVal = parseFloat( $(this).parents('.spinner').children('input').val() );
		
		if ( advLimit==true ) { 
			//wholesale product page
			newSpinVal = advSpinLimit(currSpinObj);
			if (newSpinVal>upLimit) {
				if (upLimitMsg!='') alert(upLimitMsg); 
				else return false;
			} else {
				var upSpinVal = currSpinVal+1;
				$(this).parents('.spinner').children('input').val(upSpinVal);
				$(this).parents('.spinner').children('input').trigger('change');
			};
		} else {
			//classic product page
			if (currSpinVal>=upLimit) {
				if (upLimitMsg!='') alert(upLimitMsg);
				else return false;
			} else {
				var upSpinVal = currSpinVal+1;
				$(this).parents('.spinner').children('input').val(upSpinVal);
				$(this).parents('.spinner').children('input').trigger('change');
			};
		};
		
		
	});
	
	$('.spinDown').click(function(){
		var currSpinVal = parseFloat( $(this).parents('.spinner').children('input').val() );
		if (currSpinVal<=downLimit) {
			if (downLimitMsg!='') { alert(downLimitMsg); } else {return false;};
		} else {
			var upSpinVal = currSpinVal-1;
			$(this).parents('.spinner').children('input').val(upSpinVal);
			$(this).parents('.spinner').children('input').trigger('change');
		};
	});	
	
};



/*- Number Format function -*/
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
