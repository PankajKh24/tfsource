$(document).ready(function(){

	
	
	$('#cat_subscribed').change(function(){
		var customer_id = $('#customer_id').val();
		if ( $(this).is(':checked') ) var check = 1;
		else var check = 0;
		
		$.post(
			'/customer/category-unsubscribe/',
			{customer_id:customer_id, check:check}
		);			
	});

	$('.add_category').live('click',function(event){
		event.preventDefault();
		var customer_id = $('#customer_id').val();
		var category_id = $(this).attr('href');
				
		$.post(
			'/customer/category-sub-manage/',
			{customer_id:customer_id, category_id:category_id, check:1},
			function(){
				get3rdCol();
			}
		);
	});
	
	$('.cat_close').live('click',function(event){
		event.preventDefault();
		var customer_id = $('#customer_id').val();
		var category_id = $(this).attr('href');
		$(this).parent().remove();
		
		$.post(
			'/customer/category-sub-manage/',
			{customer_id:customer_id, category_id:category_id, check:0},
			function(){
				get3rdCol();
			}
		);
	});
	
	$('.category_check').click(function(event){
		event.preventDefault();
		$('.category_check.selected').removeClass('selected');
		$(this).addClass('selected');
		get2ndCol();
	});
	
	get2ndCol();
	get3rdCol();
});

function get2ndCol(){
	var id = $('.category_check.selected').attr('href');
	
	$.post(
		'/customer/subscribe2nd-col/',
		{id:id},
		function(data){
			$('#2nd_col').html(data);
		}
	);
}

function get3rdCol(){
	var id = $('#customer_id').val();
	
	$.post(
		'/customer/subscribe3rd-col/',
		{id:id},
		function(data){
			$('#3rd_col').html(data);
		}
	);
}
