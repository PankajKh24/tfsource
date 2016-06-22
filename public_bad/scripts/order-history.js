$(document).ready(function() {
	
	/* =============== FILTERS ============== */
	/* Order Status Filter */
	$('.filterOrderStatus').click(function(event){
		event.preventDefault();
		
		$(this).siblings('.current').removeClass('current');
		$(this).addClass('current');
		
		ordersFilter(true);
	});
	
	/* Order Time Filter */
	$('.filterOrderTime').change(function(){
		ordersFilter(true);
	});
	
	
	/* Order Search */
	$('#searchOrderForm').submit(function(event){
		event.preventDefault();
		
		ordersFilter(true);
	});
	
	
	
	
	/* =============== PAGINATION ============== */
	/* Next */
	$('#orderPagination .nextBtn').live('click',function(event){
		event.preventDefault();
		
		if ( !$(this).hasClass('dissabled') ) {
			var page = $(this).parents('#orderPagination').attr('data-current')*1;
			var perpage = $(this).parents('#orderPagination').attr('data-perpage')*1;
			var filteredPrevPaged = $('.orderWrap .order:visible:first').prevAll().not('.filteredOut').length;
			
			$('#orderPagination .pagBtn.current').removeClass('current');
			$('#orderPagination .pagBtn[data-page="'+(page+1)+'"]').addClass('current');
			
			ordersPaginate( filteredPrevPaged + perpage );
			
			$(this).parents('#orderPagination').attr('data-current', (page+1));
			
			ordersPageBtns();
		};
	});
	
	/* Prev */
	$("#orderPagination .prevBtn").live('click',function(event) {
		event.preventDefault();
		
		if ( !$(this).hasClass('dissabled') ) {
			var page = $(this).parents('#orderPagination').attr('data-current')*1;
			var perpage = $(this).parents('#orderPagination').attr('data-perpage')*1;
			var filteredPrevPaged = $('.orderWrap .order:visible:first').prevAll().not('.filteredOut').length;
			
			$('#orderPagination .pagBtn.current').removeClass('current');
			$('#orderPagination .pagBtn[data-page="'+(page-1)+'"]').addClass('current');
			
			ordersPaginate( filteredPrevPaged - perpage );
			
			$(this).parents('#orderPagination').attr('data-current', (page-1));
			
			ordersPageBtns();
		};
	});
	
	/* Page */
	$('#orderPagination .pagBtn').live('click',function(event){
		event.preventDefault();
		
		if ( !$(this).hasClass('current') ) {
			var page = $(this).attr('data-page')*1;
			var perpage = $(this).parents('#orderPagination').attr('data-perpage')*1;
			var start = (page-1)*perpage;
			
			$(this).siblings().removeClass('current');
			$(this).addClass('current');
			
			ordersPaginate( start );
			$(this).parents('#orderPagination').attr('data-current', (page));
			
			ordersPageBtns();
		};
	});
	
	
	
	
	
	
	/* --- Click on Load More --- */
	$('.loadMoreProducts').click(function(event){
		event.preventDefault();
		
		$(this).siblings('.orderItem:hidden').slideDown(400);
		$(this).remove();
	});
	

	
});


function ordersFilter(doAnimation)
{
	if( !doAnimation ) var doAnimation = false;
	
	//- Get Filters
	var statusFilterVal = $('.filterOrderStatus.current').attr('data-filter-status');
	var shipFilterVal = $('.filterOrderStatus.current').attr('data-filter-ship');
	var timeFilterVal = $('.filterOrderTime').val()*1;
	var searchFilterVal = $('#searchOrderForm #orderField').val().toLowerCase();
	
	
	//- Show Hide Items
	$('.orderWrap .order').each(function() {
		var orderItem = $(this);
		
		var itemStatusVal = orderItem.attr('data-status');
		var itemShipVal = orderItem.attr('data-ship');
		var itemTimeVal = orderItem.attr('data-time')*1;
		
		var itemCartFound = false;
		if( searchFilterVal!=='' ){
			orderItem.find('.orderItem').each(function(){
				var cartItem = $(this);
				var cartItemName = cartItem.find('.oiDetails h4 a').text().toLowerCase();
				
				cartItem.hide();
				cartItem.siblings('.loadMoreProducts').hide();
				
				if( cartItemName.search(searchFilterVal) != -1) {
				   itemCartFound = true;
				   cartItem.show();
				}
			});
		} else {
			orderItem.find('.orderItem').each(function(index,element){
				var cartItem = $(this);
				
				if( index<2 ) cartItem.show();
				else cartItem.hide();
				cartItem.siblings('.loadMoreProducts').show();
			});
		}
		
		var hideItem = false;
		if( statusFilterVal && statusFilterVal!=itemStatusVal ) hideItem = true;
		if( shipFilterVal && shipFilterVal!=itemShipVal ) hideItem = true;
		if( timeFilterVal && timeFilterVal<itemTimeVal ) hideItem = true;
		if( searchFilterVal && !itemCartFound ) hideItem = true;

		if( hideItem ) {
			orderItem.addClass('filteredOut');
			if(doAnimation) orderItem.stop().slideUp(200);
			else orderItem.hide();
		
		} else {
			orderItem.removeClass('filteredOut');
			if(doAnimation) orderItem.stop().slideDown(200);
			else orderItem.show();
		}
	});
	
	//- Paginate + Info
	var totalFiltered = $('.orderWrap .order').not('.filteredOut').length;
	$('.filterCounter').text(totalFiltered+' order'+(totalFiltered>1 ? 's' : ''));
	
	$("#orderPagination").attr('data-total',totalFiltered);
	$("#orderPagination").attr('data-current','1');
	
	buildOrdersPaginate();
	ordersPaginate(0);
}

function ordersPaginate(start)
{
	var totalOrders = $("#orderPagination").attr('data-total')*1;
	var ordersPerPage = $("#orderPagination").attr('data-perpage')*1;
	if(!ordersPerPage || ordersPerPage<1) ordersPerPage = 1;
	
	if(start<0) start = 0;
	var end = start+ordersPerPage;

	//- Show/Hide Items
	$('.orderWrap .order:not(.filteredOut)')
		.hide() //hide all elements
		.slice(start,end).show(); //displays elements in page
	
	
	//- Adjust Paging Btns
	if ( end >= totalOrders ) { 
		$("#orderPagination .nextBtn").addClass('dissabled');
		$("#orderPagination .lastBtn").addClass('dissabled');
	} else { 
		$("#orderPagination .nextBtn").removeClass('dissabled');
		$("#orderPagination .lastBtn").removeClass('dissabled');
	}
	if ( start==0 ) { 
		$("#orderPagination .prevBtn").addClass('dissabled');
		$("#orderPagination .firstBtn").addClass('dissabled');
	} else { 
		$("#orderPagination .prevBtn").removeClass('dissabled');
		$("#orderPagination .firstBtn").removeClass('dissabled');
	};
};

function ordersPageBtns()
{
	var pageBtns = 5;
	var pageBtnMiddle = Math.ceil(pageBtns/2);
	
	var loopStart, loopEnd;
	
	var totalItems = $("#orderPagination").attr('data-total')*1;
	var perPage = $("#orderPagination").attr('data-perpage')*1;
	var currentPage = $("#orderPagination").attr('data-current')*1;
	var totalPages = Math.ceil(totalItems/perPage);
	
	if( currentPage<=pageBtnMiddle ) {
		loopStart = 1;
		loopEnd = pageBtns;
	} else {
		loopStart = currentPage - pageBtnMiddle + 1;
		if(loopStart<1) loopStart = 1;
						
		loopEnd = loopStart + pageBtns - 1;
	}
	
	if(loopEnd>totalPages) loopEnd = totalPages;
	
	console.log(loopStart);
	
	$("#orderPagination #orderPages .pagBtn").each(function(index, element) {
		if( (index+1)>=loopStart && (index+1)<=loopEnd ) $(this).show();
		else $(this).hide();
	});
}

function buildOrdersPaginate()
{
	var totalOrders = $("#orderPagination").attr('data-total')*1;
	var ordersPerPage = $("#orderPagination").attr('data-perpage')*1;
	$("#orderPagination #orderPages").html('');
	
	if( totalOrders>0 ){
		var totalPages = Math.ceil(totalOrders/ordersPerPage);
		for( var i=1; i<=totalPages; i++){
			var btnObj = '<a href="#" class="pagBtn '+(i==1 ? 'current' : '')+'" data-page="'+i+'" '+(i>5 ? 'style="display:none"' : '')+'>'+i+'</a>';
			$("#orderPagination #orderPages").append(btnObj);
		}
	}
}

