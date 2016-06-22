$(document).ready(function() {
	
	/* - Main Product Gallery - */
	if( $('#p_gallery .thumbnails').length>0 ){
		thumbVerticalSlide({
			items_hold:'#p_gallery .thumbnails',
			slide_items: 'a'
		});
		
		thumbGallery({
			thumbnail: '#p_gallery .thumbnails a',
			target: '#p_gallery .img_wrap'
		});
		
		
		/*- Zoom Gallery -*/
		$('.zoomLens').live('click',function(event){
			event.preventDefault();
			var videoThumbsLenght = $('#p_gallery .thumbnails .movieThumb').length;
			console.log(videoThumbsLenght);
			var currThumb = $('#p_gallery .thumbnails .current').index() - videoThumbsLenght;
			var productId = $('#product_id').val();
			var contUrl = '/products/product-gallery/product_id/'+productId+'/?curr='+currThumb;
			var contTitle = '';
			var contPos = '';
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
			
			var zoomConfig = {
				zoomWindowHeight:550,zoomWindowWidth:640,borderSize:1,responsive:true
			}; 
			$("#p_gallery .img_wrap").elevateZoom(zoomConfig);
			
			$('#p_gallery .thumbnails a').click(function(){
				var zoomPath = $(this).children('img').attr('data-zoom');
				var mainPath = $(this).children('img').attr('src');
				$('#p_gallery .img_wrap').attr('data-zoom-image');
				
				var ez =  $('#p_gallery .img_wrap').data('elevateZoom');	   
				ez.swaptheimage(mainPath, zoomPath);
			});
			
		
		}
		
		
	};
	
	/* -- sidebar placeholder -- */
	var prodNameHeight = $('#p_details h1').outerHeight(true);
	var prodSubheadingHeight = $('#p_details .subheading').outerHeight();
	$('#byBoxPlaceholder').height(prodNameHeight+prodSubheadingHeight);
	
	
	/* - Related sliders - */
	if( $('#related_products .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#related_products .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};

    /*- Add To Whishlist - */
    $('#submit_to_whishlist').click(function(event){
        event.preventDefault();
		var customer_id = $(this).attr('data-cust');

        if( $(this).hasClass('whish_error') ){
            alert( $(this).attr('title') );

        } else {
            $('#product_top').append('<div class="processing"><div>Processing...</div></div>');
            $.post(
                '/wishlist/check/',
                $('#price-form').serialize(),
                function(data){
					$('#product_top .processing').fadeOut(100, function () {
						$(this).remove();
					});
					
                    if(data != '') {
                
                        $('#product_top').append('<div id="whish_popup_response"><div><h4>'+data+'</h4><a id="close_wishlist" href="#">Back To Product</a></div></div>');
                        $('#product_top #whish_popup_response').show(200);
                    }
                    else {
                        
                        $('#product_top').append('<div id="whish_popup_response"><div><h4>Item Added To Wishlist!</h4><a href="/customer/my-wishlist/id/'+customer_id+'">View My Wishlist</a><a href="#" id="close_wishlist">Back To Product</a></div></div>');
                        $('#product_top #whish_popup_response').show(200);
                    }

                    

                }
            );
        }
    });
	
	$('#close_wishlist').live('click',function(event){
        event.preventDefault();
    });

    $('#whish_popup_response').live('click',function(){
        $(this).hide(200,function(){$(this).remove()});
    });
	
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
	
	
	/*================ ADD REVIEW ===============*/
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
	$("#add_to_stock").click(function(event) { 
		event.preventDefault();
		var stackDisclaimer = "";
		stackDisclaimer = "You are about to add this item to your stack! \n\n";
		stackDisclaimer += "You can manage your stack by logging in to my source and clicking on stack manager. At any time you can have orders ship out from your stack by selecting them in stack manager and generating an order.\n\n";
		stackDisclaimer += "Items in your stack will be charged when they are instock, instock items added to your stack will be charged when added.  Shipping costs will be calculated later and charged separately based on the items you ship out in an order generated from your stack.";
		$('body').append('<div class="processing"><div>Processing...</div></div>');
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
	

});



/* =================================== FUNCTIONS =====================================*/

/*================= FORMS VALIDATIONS =================*/
var items_in_cart = 0;

/*========== Base price (Add to Cart) Validation ==========*/
function check_option(){
	//options validation: nothing checked - depricatd
	/*
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
	*/
	
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
