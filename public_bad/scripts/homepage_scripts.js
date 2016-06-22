$(document).ready(function(){
	/*- Carousels -*/	
	$("div.carousel").carousel({
		dispItems: 6,
		nextBtn: '<span>Next</span>',
		prevBtn: '<span>Back</span>'
	});
	
	
	/*--- Input Elements Focus/Blur text ---*/
	/*- Newsletter Subscription -*/
	$('#newsletter #news_email').focus(function(){
		if(this.value=='Enter your e-mail'){this.value=''};
	});
	$('#newsletter #news_email').blur(function(){
		if(this.value==''){this.value='Enter your e-mail'};
	});
	
	
	/*--- Testimonials ---*/
	$('.modal_testimonial').click(function(event){
		event.preventDefault();
		var targStatic = $(this).attr('href');
		$('body').append('<div class="modal_overlay"> <div id="static_lightbox" style="width:330px; margin-left:-165px"><div id="sl_content"><div id="sl_hold"></div><a class="sl_close" href="#" title="Close This Window">X</a></div></div>  <div class="gallery_loading">Loading...</div></div>');
		$('#sl_hold').load(
			targStatic,
			function(){
				$('.gallery_loading').remove();
				$('#static_lightbox').fadeIn(100);
			}
		);
	});
	
	
	/* - Preorder Slider - */
	if( $('#featured-preorders-wrap .single_item').length>0 ){
		thumbSlide({
			items_hold:'#featured-preorders-wrap .slide_wrap',
			slide_items: '.single_item',
			numb_visible:12,
			rows:2
		});
	};
	
	/* - Instock Slider - */
	if( $('#now-instock-wrap .single_item').length>0 ){
		thumbSlide({
			items_hold:'#now-instock-wrap .slide_wrap',
			slide_items: '.single_item',
			numb_visible:12,
			rows:2
		});
	};
	
	/* - Hot Items Slider - */
	if( $('#hot-items-wrap .single_item').length>0 ){
		thumbSlide({
			items_hold:'#hot-items-wrap .slide_wrap',
			slide_items: '.single_item',
			numb_visible:6,
			rows:1
		});
	};
	
	
	/* - Sale Slider - */
	if( $('#sale-wrap .single_item').length>0 ){
		thumbSlide({
			items_hold:'#sale-wrap .slide_wrap',
			slide_items: '.single_item',
			numb_visible:6,
			rows:1
		});
	};
	
	
	
	
	
	
});

/* ======================================================================================================================== */
function formatText(index, panel) {
	return index + "";
}

/*- Homepage Slideshow -*/
$(function () {        
	$('.anythingFader').anythingFader({
		autoPlay: true,                 // This turns off the entire FUNCTIONALY, not just if it starts running or not.
		delay: 5000,                    // How long between slide transitions in AutoPlay mode
		startStopped: false,            // If autoPlay is on, this can force it to start stopped
		animationTime: 500,             // How long the slide transition takes
		hashTags: false,                 // Should links change the hashtag in the URL?
		buildNavigation: true,          // If true, builds and list of anchor links to link to each slide
		pauseOnHover: true,             // If true, and autoPlay is enabled, the show will pause on hover             
		navigationFormatter: formatText   // Details at the top of the file on this use (advanced use)
	});                                  
});

