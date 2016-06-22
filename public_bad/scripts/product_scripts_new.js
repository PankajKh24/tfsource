$(document).ready(function() {
	
	/* ================= LIGHTBOXES ================= */
	/* - Close Lightbox - Close btn - */
	$('.modal_close').live('click',function(event){
		event.preventDefault();
		$(this).parents('.modal').fadeOut(100,function(){
			$(this).remove();
			$('.modal_overlay').fadeOut(100,function(){ $(this).remove(); });
		})
	});
	
	/*- Close Lightbox - Overlay click -*/
	$('.modal_overlay').live('click',function(event){
		if(event.target == this) {
			$('.modal').fadeOut(100, function(){
				$(this).remove();
				$('.modal_overlay').fadeOut(100,function(){ $(this).remove(); });
			});
		} else {
			event.stopPropagation();
		};
	});
	
	$('.trigg_modal_close').live('click',function(event){
		event.preventDefault();
		$('.modal_close').trigger('click');
	});
	
	
	/*- Open video modal -*/
	$('.modal_video').live('click',function(event){
		event.preventDefault();
		var videoUrl = $(this).attr('href');
		var videoWidth = $(this).attr('rel').split('x')[0];
		var videoHeight = $(this).attr('rel').split('x')[1];
		var videoTitle = $(this).attr('title');
		modalCreate(videoTitle,'video_modal');
		fillVideoModal(videoUrl,videoWidth,videoHeight);
	});
	
	/*- Open Ajax cont. in Modal -*/
	$('.modal_act').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		
		modalCreate(contTitle,contId);
		fillAjaxModal(contUrl);
	});
	
	/*- Open Image cont. in Modal -*/
	$('.modal_img').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		
		modalCreate(contTitle,contId);
		fillImgModal(contUrl);
	});
	
	
	
	
	
	/*============== product tooltip ================*/
	$('.tooltip2').live({
        mouseenter : function (){
            var tipTarg = $(this).attr('data-target');
            $(tipTarg).clone().appendTo(this);
            $(this).children('.tip_content').fadeIn(100);
        },
        mouseleave : function (){
            $(this).children('.tip_content').fadeOut(200, function(){ $(this).remove(); });
        }
    });
	
	/* - Main Product Gallery - */
	if( $('#p_gallery .thumbnails').length>0 ){
		thumbVerticalSlide({
			items_hold:'#p_gallery .thumbnails',
			slide_items: 'a',
			numb_visible:6
		});
		
		thumbGallery({
			thumbnail: '#p_gallery .thumbnails a',
			target: '#p_gallery .img_wrap'
		});
		
		
		/*- Zoom Gallery -*/
		$('.zoomLens').live('click',function(event){
			event.preventDefault();
			var currThumb = $('#p_gallery .thumbnails .current').index();
			var productId = $('#product_id').val();
			var contUrl = '/products/product-gallery/product_id/'+productId+'/?curr='+currThumb;
			var contTitle = '';
			var contId = 'p_modal_gallery';
			
			modalCreate(contTitle,contId);
			fillAjaxModal(contUrl);
		});
		
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			$('#p_gallery .gall_note').text('Touch the image to zoom in');
		}
		
		
		$('.zoomLens').live({
			mouseenter: function() {
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				 	$('#p_gallery .gall_note').text('Touch the image to zoom in');
				}else{
					$('#p_gallery .gall_note').text('Click to open expanded view');
				}
			},
			mouseleave: function () {
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					$('#p_gallery .gall_note').text('Touch the image to zoom in');
				}else{
					$('#p_gallery .gall_note').text('Roll over image to zoom');
				}
			}
		});
				
		
		/*- Zoom Gallery (Magnify) -*/
		if( $('#p_gallery').length>0 ){
			$("#p_gallery .img_wrap").elevateZoom({
				zoomWindowHeight:435, 
				zoomWindowWidth:565,
				borderSize:1
			});
			
			$('#p_gallery .thumbnails a').click(function(){
				var zoomPath = $(this).children('img').attr('data-zoom');
				var mainPath = $(this).children('img').attr('src');
				$('#p_gallery .img_wrap').attr('data-zoom-image');
				
				var ez =  $('#p_gallery .img_wrap').data('elevateZoom');	   
				ez.swaptheimage(mainPath, zoomPath); 
			});
		
		}
		
		
	};
	
	
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
	
	
	/* - Related Products - */
	if( $('#p_related .rel_item').length>0 ){
		thumbSlide({
			items_hold:'#p_related .thumbnails',
			slide_items: '.rel_item',
			numb_visible:5,
			rows:1
		});
	};
	
	/*--- READ MORE Initialization ---*/
	readMoreT({
		selector: '#p_desc .text_desc',
		max_height:315
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
	
	
	
	/*================ NEW OPTIONS TWEAKS ===============*/
	$(".p_options input:checkbox").click(function(){
		
		var state = $(this).is(':checked');
		$(".p_options input:checkbox").removeAttr('checked');
		$(this).attr('checked', state );
		
		if( !$('.p_options input:checkbox').is(':checked') ){
			$('.default_option').attr('checked', 'checked');
			
		}

	});
	
	
	
	
	
});

/* ======================================================================== */
/*=============== LIGHTBOX FNs ================*/
/*- Build Modal Structure With Title -*/
function modalCreate(contTitle,contId){
	$('body').append('<div class="modal_overlay loading"></div><div id="'+contId+'" class="modal"><div class="modal_bar"><div class="capt_fix"></div><span class="modal_title">'+contTitle+' </span><a class="modal_close" href="#" title="Close this window" rel="noindex,nofollow"><span>X</span></a></div><div class="modal_hold"></div></div>');
};

/*- Load Image to Modal -*/
function fillImgModal(imgSrc){
	$('.modal_hold').append('<div class="gallery_loading"><span>Loading...</span></div>');
	
	var preloadImg = new Image();
	$(preloadImg).load(function(){
		$('.modal_hold').html(this);
		var refTarg = $('.modal_hold img');
		centerModal(refTarg);
	}).attr('src',imgSrc);
}

/*Load ajax content to modal */
function fillAjaxModal(ajModPath){
	$('.modal_hold').append('<div class="gallery_loading"><span>Loading...</span></div>');
	$('.modal_hold').load(ajModPath, function(){
		var refTarg = $('.modal_hold > div');
		centerModal(refTarg);
		
	});
};

/*Load video content to modal */
function fillVideoModal(videoPath,videoWidth,videoHeight){
	$('.modal_hold').append('<iframe width="'+videoWidth+'" height="'+videoHeight+'" src="'+videoPath+'" frameborder="0" allowfullscreen></iframe>');
	var refTarg = $('.modal_hold > iframe');
	centerModal(refTarg);
};


/*- Center modal depending on given element dimensions -*/
function centerModal(refTarg){
	var elWidth = $(refTarg).outerWidth(true);
	var elHeight = $(refTarg).outerHeight(true);
	var winOffs = $(window).scrollTop();
	var winHeight = $(window).height();
	
	elTop = (elHeight/2)+20;
	if ( elTop>(winHeight/2) ){ 
		elTop=winHeight/2
	};
	
	var fullTopOfs = winOffs+(winHeight/2)-elTop;
	$('.modal').hide();
	
	if($(refTarg).parents('.modal').hasClass('no_center')){
		$(refTarg).parents('.modal').css({
			'position':'fixed',
			'top': '-'+elHeight+'px',
			'left': 0+'px',
			'margin-left': 0+'px'
		});
		$('.modal').show();
		$('.modal').animate({
				'top':0
			}, 200);
	}else{
		$(refTarg).parents('.modal').css({
			'position':'absolute',
			'top': fullTopOfs+'px',
			'margin-left': '-'+(elWidth/2)+'px'
		});
		
		$('.modal').fadeIn(150);
	}

};



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


/*=============== THUMBNAIL SLIDER -(vertical) ================*/
function thumbVerticalSlide(settings){
	var prodVisible = settings['numb_visible'];
	var itemsHold = settings['items_hold'];
	var prodItem = $(itemsHold).find(settings['slide_items']);
	var prodCount = prodItem.length;
	
	
	// Build Additional Elements and adjust CSS
	$(itemsHold).wrap('<div class="thumbs_wrap"><div class="thumbs_hold"></div></div>');
	$(itemsHold).parents('.thumbs_wrap').append('<div class="thumb_nav"><a class="thumbPrev" href="#" rel="noindex,nofollow">Prev</a><a class="thumbNext" href="#" rel="noindex,nofollow">Next</a></div>');
	
	//define new objs
	var prodHold = $(itemsHold);
	var prodPrev = prodHold.parents('.thumbs_wrap').find('.thumbPrev');
	var prodNext = prodHold.parents('.thumbs_wrap').find('.thumbNext');
	
	//adjust thumbnail slider css
	if ( prodCount>0 ) {
		var prodHeight = prodItem.outerHeight(true);
		
		if( prodCount > prodVisible ) {
			if( prodCount>prodVisible ) var prodHoldHeight = prodHeight*prodCount;
			else var prodHoldHeight = prodHeight*prodVisible;
		} else 
			var prodHoldHeight = (prodHeight*prodCount);
		
		$(prodHold).height(prodHoldHeight);
		
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
			if ( $(prodHold).position().top >= 0 ) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
			} else if ( $(prodHold).width()+$(prodHold).position().top <= (prodHeight*prodVisible) ) {
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
			prodHold.animate(  {'top':"-="+(prodHeight*prodVisible) +'px'}, 300, function(){dissableProdNav()}  );
		};

	});
	prodPrev.click(function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'top':"+="+(prodHeight*prodVisible) +'px'}, 300, function(){dissableProdNav()}  );
		};
	});
};

/*================= SPINNER BUTTON CONTROL =================*/
function spinner(settings){
	//- Vars
	var spinObj = settings['selector'];
	var downLimit = settings['low_limit'];
	var upLimit = settings['high_limit'];
	
	if(!upLimit) upLimit=1000000;
	
};


/*========= READ MORE Link =========*/
function readMoreT(settings){
	//- Vars
	var hideObj = settings['selector'];
	var hideHeight = settings['max_height'];
	
	var objHeight = $(hideObj).outerHeight(true);
	if(objHeight > hideHeight){
		$(hideObj).addClass('limitedHeight');
		$(hideObj).append('<a class="read_more_link" href="#">Read More</a>');
	}else{
		$(hideObj).removeClass('limitedHeight');
		$(hideObj).remove('.read_more_link');
	}
	
	$('.read_more_link').click(function(event){
		event.preventDefault();
		$(this).parent().toggleClass('fullHeight');
		
		if($(this).parent().hasClass('fullHeight')){
			$(this).text('Read Less');
		}else{
			$(this).text('Read More');
		}
		
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
