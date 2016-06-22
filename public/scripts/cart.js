$(document).ready(function() {
	/* - QTY update - */
	$('.quantity_update').change(function(e){
        e.preventDefault();
        var cart_id = $('option:selected', this).attr('data-cart_id');
        var product_id = $('option:selected', this).attr('data-product_id');
        var qty = $(this).val();
		
		$('body').append('<div class="processing"><div>Processing...</div></div>');

        $.post(
            "/cart/update-qty/",
            {cart_id: cart_id, product_id: product_id, qty: qty},
            function(data)
            {
                window.location.reload();
            }
        )
	});
	
	/* - Cart slider - */
	if( $('#recommended_products .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#recommended_products .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	
});

/* =================================== FUNCTIONS =====================================*/