$(document).ready(function(){
	$('.paging a.active').click(function(event){event.preventDefault();});
	
	
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
				if ( data == '' ) {
					$('.modal_overlay').remove();
					alert('Unfortunately we do not have that many pieces available for sale. Please revise your order quantity and try again, or email us regarding availability.');
					return false;
				}
				else {
					$('#cart-wrap').html(data);
					quickShopBox(id);
				}
			}
		);
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
	
	
});