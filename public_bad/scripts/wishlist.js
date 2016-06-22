$(document).ready(function(){
	
	/* Wishlist Search */
	$('#searchWishlistForm').submit(function(event){
		event.preventDefault();
		
		wishlistFilter(true);
	});
	
	/* Wishlist Purchase Filter */
	$('.filterWishPurchase').change(function(){
		wishlistFilter(true);
	});
	
	/* Wishlist Sorter */
	$('.sorterWishTime').change(function(){
		var sortVal = $(this).val();
		
		if (sortVal == 'newest')
			$($.makeArray($('#wishItemWrap .wishItem').sort(wishlistNumericSorter)).reverse()).appendTo($('#wishItemWrap').empty());
		else 
			$('#wishItemWrap .wishItem').sort(wishlistNumericSorter).appendTo($('#wishItemWrap').empty());
	});
	
	
	
	
	
	/* Remove Item */
	$('.wishlist_remove').click(function(event){
		event.preventDefault();
		var wish_id = $(this).attr('data-id');
		
		$('body').append('<div class="processing"><div>Processing...</div></div>');
		$.post(
			'/wishlist/remove/',
			{wish_id:wish_id},
			function(){
				window.location.reload();
			}
		);
	});
	
	/* Add Item To Cart */
	$('.add_to_cart').click(function(event){
		event.preventDefault();
		var wish_id = $(this).attr('data-id');
		
		$('body').append('<div class="processing"><div>Processing...</div></div>');
		$.post(
			'/wishlist/add-to-cart/',
			{wish_id:wish_id},
			function(data){
				if ( data == '' || data == null ) {
					$('.modal_overlay').remove();
					alert('Unfortunately we do not have that many pieces available for sale. Please revise your order quantity and try again, or email us regarding availability.');
					return false;
				}
				else {
					window.location = '/cart/view/';
				}
			}
		);
	});
	
	
	
});



/*======================================================================================================================*/
function wishlistNumericSorter(a,b)
{
	x = $(a).attr('data-id')*1;
	y = $(b).attr('data-id')*1;
	
	x = parseFloat( x );
	y = parseFloat( y );
	
	return x - y;
}

function wishlistFilter(doAnimation)
{
	if( !doAnimation ) var doAnimation = false;
	
	//- Get Filters
	var purchaseFilterVal = $('.filterWishPurchase').val();
	var searchFilterVal = $('#searchWishlistForm #wishlistField').val().toLowerCase();
	
	//- Show Hide Items
	$('#wishItemWrap .wishItem').each(function() {
		var wishItem = $(this);
		var itemPurchaseVal = wishItem.attr('data-purchased');
		var cartItemName = wishItem.find('.prod_name h3 a').text().toLowerCase();		

		var hideItem = false;
		if( purchaseFilterVal && purchaseFilterVal!=itemPurchaseVal ) hideItem = true;
		if( searchFilterVal && cartItemName.search(searchFilterVal)==-1 ) hideItem = true;

		if( hideItem ) {
			wishItem.addClass('filteredOut');
			if(doAnimation) wishItem.stop().slideUp(200);
			else wishItem.hide();
		
		} else {
			wishItem.removeClass('filteredOut');
			if(doAnimation) wishItem.stop().slideDown(200);
			else wishItem.show();
		}
	});
}