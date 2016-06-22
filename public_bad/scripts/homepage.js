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
	
	if( $('#instockSlider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#instockSlider .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	if( $('#bestSellerSlider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#bestSellerSlider .thumbnails',
			slide_items: '.itemsWrap'
		});
		
	};
	
	if( $('#saleSlider .thumbnails').length>0 ){
		thumbSlide({
			items_hold:'#saleSlider .thumbnails',
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
	
	
	
	/* - facebook Likebox - */
	$(window).scroll(function(){
		var loaderObj = $('#tfCommunity');
		var loaderOffset = loaderObj.offset();
		var windowScroll = $(window).scrollTop();
		var windowHeight = $(window).height();

		if( (loaderOffset.top - windowScroll - 80) < windowHeight && !loaderObj.hasClass('disabled') ){
			loaderObj.addClass('disabled');
			$.post(
				'/index/load-facebook/',
				function(data){
					$('#fb-content').html(data);
					FB.XFBML.parse($('#fb-content')[0]);
				}
			);
			/*$('#fb-content').html('<div class="fb-page" data-href="http://www.facebook.com/TFsource" data-width="700" data-height="750" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-show-posts="true"><div class="fb-xfbml-parse-ignore"><blockquote cite="http://www.facebook.com/TFsource"><a href="http://www.facebook.com/TFsource">TFsource</a></blockquote></div></div>');*/
			
		}
	});
	
	
});

/* =================================== FUNCTIONS =====================================*/