$(document).ready(function() {
	
	/* - Slideshow - */
	if( $('#home_slideshow').length>0 ){
		$('#home_slideshow').flexslider({
			//slideshow:false,
			controlNav: true,
			directionNav: false
		});
	}
	
	/* - Homepage sliders - */
	if( $('#preorderSlider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#preorderSlider .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	if( $('#mostPopularSlider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#mostPopularSlider .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	
	/* -- Testimonials Read More -- */
	//var showChar = 200;
	var showWords = 50;
	$('.textAbstract').each(function(index){
		
		var content = $(this).html();
		var totalWords = content.split(' ').length;
		if(totalWords > showWords) {
			var visibleText = content.split(' ').slice(0,showWords).join(' ');
			var textToHide = " " + content.split(' ').slice(showWords,totalWords).join(' ');
	
			$(this).html(visibleText+'<span class="abstractElipsis">...</span><span id="textAbstract'+index+'" class="abstractHidden" style="display:none">'+textToHide+'</span>');
			$(this).next('.testimonialBottom').prepend('<a class="readMore" href="#textAbstract'+index+'" target="_blank">read more &gt;&gt;</a>');
		}
	});
	
	
	$('.readMore').click(function(event){
		event.preventDefault();
		var targSect = $(this).attr('href');
		
		if( $(targSect).is(':visible') ){
			$(targSect).stop().slideUp(300,function(){
				$(targSect).siblings('.abstractElipsis').show();
			});
			$(this).html('read more &gt;&gt;');
			
		} else {
			$(targSect).siblings('.abstractElipsis').hide();
			$(targSect).stop().slideDown(300,function(){
				$(targSect).css('display','inline');
			});
			$(this).html('show less &gt;&gt;');
		}
	});
	
	
	
	/* -- Ajax Loaded Content -- */
	loadInstockProducts();
	loadBestsellerProducts();
	loadSaleProducts();
	loadComunityBlocks();
	
	$(window).scroll(function(){
		loadInstockProducts();
		loadBestsellerProducts();
		loadSaleProducts();
		loadComunityBlocks();
	});
	
	
	
});

/* =================================== FUNCTIONS =====================================*/

function loadInstockProducts()
{
	var windowScroll = $(window).scrollTop();
	var windowHeight = $(window).height();
	
	var loaderObj3 = $('#instockSlider');
	var loaderOffset3 = loaderObj3.offset();
	if( (loaderOffset3.top - windowScroll - 80) < windowHeight && !loaderObj3.hasClass('disabled') ){
		loaderObj3.addClass('disabled');
		$('#instockSlider .thumbnails').append('<div class="processing"><div>Loading...</div></div>');
		$.post(
			'/index/instock-include/',
			function(data){
				$('#instockSlider .thumbnails').html(data);
				if( $('#instockSlider .thumbnails').length>0 ){
					thumbSlide({
						items_hold:'#instockSlider .thumbnails',
						slide_items: '.itemsWrap'
					});
				} else {
					$('#instockSlider').remove();
				}
			}
		);
	}
}

function loadBestsellerProducts()
{
	var windowScroll = $(window).scrollTop();
	var windowHeight = $(window).height();
	
	var loaderObj2 = $('#bestSellerSlider');
	var loaderOffset2 = loaderObj2.offset();
	if( (loaderOffset2.top - windowScroll - 80) < windowHeight && !loaderObj2.hasClass('disabled') ){
		loaderObj2.addClass('disabled');
		$('#bestSellerSlider .thumbnails').append('<div class="processing"><div>Loading...</div></div>');
		$.post(
			'/index/best-sellers-include/',
			function(data){
				$('#bestSellerSlider .thumbnails').html(data);
				if( $('#bestSellerSlider .thumbnails').length>0 ){
					thumbSlide({
						items_hold:'#bestSellerSlider .thumbnails',
						slide_items: '.itemsWrap'
					});
				} else {
					$('#bestSellerSlider').remove();
				}
			}
		);
	}
}

function loadSaleProducts()
{
	var windowScroll = $(window).scrollTop();
	var windowHeight = $(window).height();
	
	var loaderObj4 = $('#saleSlider');
	var loaderOffset4 = loaderObj4.offset();
	if( (loaderOffset4.top - windowScroll - 80) < windowHeight && !loaderObj4.hasClass('disabled') ){
		loaderObj4.addClass('disabled');
		$('#saleSlider .thumbnails').append('<div class="processing"><div>Loading...</div></div>');
		$.post(
			'/index/sale-include/',
			function(data){
				$('#saleSlider .thumbnails').html(data);
				if( $('#saleSlider .thumbnails').length>0 ){
					thumbSlide({
						items_hold:'#saleSlider .thumbnails',
						slide_items: '.itemsWrap'
					});
				} else {
					$('#saleSlider').remove();
				}
			}
		);
	}
}


function loadComunityBlocks()
{
	var windowScroll = $(window).scrollTop();
	var windowHeight = $(window).height();
	
	var loaderObj = $('#tfCommunity');
	var loaderOffset = loaderObj.offset();
	if( (loaderOffset.top - windowScroll - 80) < windowHeight && !loaderObj.hasClass('disabled') ){
		loaderObj.addClass('disabled');
		
		$('#fb-content').append('<div class="processing"><div>Loading...</div></div>');
		$.post(
			'/index/load-facebook/',
			function(data){
				$('#fb-content').html(data);
				FB.XFBML.parse($('#fb-content')[0]);
			}
		);
		
		$('#blog-content').append('<div class="processing"><div>Loading...</div></div>');
		$.post(
			'/index/load-blog/',
			function(data){
				$('#blog-content').html(data);
			}
		);
	}
}