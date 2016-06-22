$(document).ready(function() {

	/* -========== CATEGORY SLIDERS ==========- */
	/*--- Most Popular Slider ---*/
	if( $('#most_popular_slider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#most_popular_slider .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};

	/*--- Best Sellers Slider ---*/
	if( $('#best_sellers_figure .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#best_sellers_figure .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	/* - Paginator - disable click - */
	$('.paging a.active, .paging a.disabled').click(function(event){event.preventDefault();});
	
	
	
	
	/*=============== QUICK SHOP===============*/
	
	/*- Add to cart Click -*/
	$('.item_buy').click(function(event){
		event.preventDefault();
		var id = $(this).attr('href');
		$('body').append('<div class="modal_overlay"><div class="gallery_loading">Loading...</div></div>');
		
		$.post(
			'/products/quick-shop/',
			{product_id: id},
			function(data){
				if ( data == '' || data == null ) {
					$('.modal_overlay').remove();
					alert('Unfortunately we do not have that many pieces available for sale. Please revise your order quantity and try again, or email us regarding availability.');
					return false;
				}
				else {
					$('.cart_no').html(data.cart_no);
					$('.freeShippingInfo').html(data.free_ship);

					// ucitava lightbox
					quickShopBox(id);
				}
			},
			'json'
		);
		event.stopPropagation();
	});
	
	/*- Response box open -*/
	function quickShopBox(prod_id){
		$('.modal_overlay').load(
			'/lightbox/quick-shop-response/product_id/'+prod_id+'/',
			function(){
				$('.gallery_loading').remove();
				$('#quick_shop').show();
			}
		);
	};
	
	/*- Close response box -*/
	$('#quick_shop .hidden_close, #quick_shop .close_trigger').live('click',function(event){
		event.preventDefault();
		$('#quick_shop').hide(100, function(){
			$('.modal_overlay').fadeOut(100,function(){
				$('.modal_overlay').remove();
			});
		});
	});
	
	/*- Sliding content loader -*/
	
	$('.slCont').live('click', function(event){
		event.preventDefault();
		var targCont = $(this).attr('href');
		var targDispl = $(this).attr('rel');
		$(targDispl).load(
			targCont,
			function(){
				$('.gallery_loading').remove();
				$(targDispl).slideDown();
			}
		);
	});
	$('#quick_shop .slCont').live('click', function(event){
		event.preventDefault();
		$('#quick_shop_response').append('<div class="gallery_loading">Loading...</div>');
	});

	$('.modal_overlay').live('click',function(event){
		
		
		if( event.target==this ){
			event.preventDefault();
			$('#quick_shop').hide(100, function(){
				$('.modal_overlay').fadeOut(100,function(){
					$('.modal_overlay').remove();
				});
			});
		} else {
			event.stopPropagation();	
		}
		
	});

});