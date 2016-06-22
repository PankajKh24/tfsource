$(document).ready(function() {
	
	/* ============== HOVER SUBMENU ============== */
	$('#catDropdown').hover(
		function(){
			$('#page').append('<div id="hoverOverlay"></div>');
		},
		function(){
			$('#hoverOverlay').remove();
		}
	);

	/* ================= LIGHTBOXES ================= */
	/* - Close Lightbox - Close btn - */
	$('.modal_close').live('click',function(event){
		event.preventDefault();
		$(this).parents('.modal').fadeOut(100,function(){
			$(this).remove();
			$('.modal_overlay').fadeOut(100,function(){ $(this).remove(); });
		})
	});
	
	/*- Close Lightbox - Overlay click -*/
	$('.modal_overlay').live('click',function(event){
		if(event.target == this) {
			if( !$(this).hasClass('disabled') ){
				$('.modal').fadeOut(100, function(){
					$(this).remove();
					$('.modal_overlay').fadeOut(100,function(){ $(this).remove(); });
				});
			}
		} else {
			event.stopPropagation();
		};
	});
	
	$('.trigg_modal_close').live('click',function(event){
		event.preventDefault();
		$('.modal_close').trigger('click');
	});


	
	
	/*- Open video modal -*/
	$('.modal_video').live('click',function(event){
		event.preventDefault();
		var videoUrl = $(this).attr('href');
		var videoWidth = $(this).attr('rel').split('x')[0];
		var videoHeight = $(this).attr('rel').split('x')[1];
		var videoTitle = $(this).attr('title');
		var contPos = $(this).attr('data-pos');
		modalCreate(videoTitle,'video_modal', contPos);
		fillVideoModal(videoUrl,videoWidth,videoHeight);
	});
	
	/*- Open Ajax cont. in Modal -*/
	$('.modal_act').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		var contPos = $(this).attr('data-pos');
		
		modalCreate(contTitle,contId,contPos);
		fillAjaxModal(contUrl);
	});
	
	/*- Open Image cont. in Modal -*/
	$('.modal_img').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		var contPos = $(this).attr('data-pos');
		
		modalCreate(contTitle,contId,contPos);
		fillImgModal(contUrl);
	});
	
	/*================ STATIC CONTENT LIGHTBOXES ===============*/
	$('.modal_text_act').live('click',function(event){
		event.preventDefault();
		var targStatic = $(this).attr('href');
		$('body').append('<div class="modal_overlay"> <div id="static_lightbox"><div id="sl_content"><div id="sl_hold"></div><a class="sl_close" href="#" title="Close This Window">X</a></div></div>  <div class="gallery_loading">Loading...</div></div>');
		$('#sl_hold').load(
			targStatic,
			function(){
				$('.gallery_loading').remove();
				$('#static_lightbox').fadeIn(100);
			}
		);
	});
	
	$('.sl_close').live('click',function(event){
		event.preventDefault();
		$('#static_lightbox').fadeOut(100, function(){
			$('.modal_overlay').remove();
		});
	});
	
	$('.modal_overlay').live('click',function(event){
		//event.preventDefault();
		if(event.target == this) {
			$('#static_lightbox').fadeOut(100, function(){
				$('.modal_overlay').remove();
			});
		} else {
			event.stopPropagation();
		};
	});
	
	/* Loyalty Lightbox Fix */
	$('#lightbox_enroll').live('click',function(event){
		event.preventDefault();
		window.location = $(this).attr('href');
	});


    /*================= SEARCH FORM ===================*/
    /* - Fix Url For Get - */
    $('#search').live("submit",function(event){
        event.preventDefault();
        var search_url = $(this).parents().find('form').attr('action');

        var term = $('#search_fld').val();
        var url = search_url + 'search_term/' + term + '/';

        window.location = url;
    });

    /* - Autocomplete - */
    if( $("#search_fld").length>0 ){
        $("#search_fld").autocomplete({
            source: function( request, response ) {
                $.ajax({
                    url: "/search/autocomplete/",
                    type: "POST",
                    data: {
                        q: request.term
                    },
                    dataType: "json",
                    success: function( data ) {
                        console.log(data);
                        response($.map(data.tags, function(item) {
                            return {
                                label: item.name,
                                value: item.name,
                                name: item.name,
                                url: item.link,
                                image: item.image
                            }
                        }))
                    }
                });
            },
            select: function(e,ui) {
                window.location = ui.item.url;
            },
            minLength: 1
        }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            if( item.image=='all' )
                return $("<li></li>").data("item.autocomplete", item).append('<a class="all_resaults_lnk" href="'+ item.url +'">'+ item.name +'</a>' ).appendTo(ul);

            else
                return $("<li></li>").data("item.autocomplete", item).append('<a href="'+ item.url +'"><img src="'+ item.image +'" width="60" height="60" /><span>' + item.label + '</span></a>' ).appendTo(ul);
        };
    }
	
});

/* =================================== FUNCTIONS =====================================*/
/*=============== LIGHTBOX FNs ================*/
/*- Build Modal Structure With Title -*/
function modalCreate(contTitle,contId,contPos){
	if(!contTitle) contTitle = '';
	$('body').append('<div class="modal_overlay loading"></div><div id="'+contId+'" class="modal '+contPos+'"><div class="modal_bar"><span class="modal_title">'+contTitle+'</span><a class="modal_close" href="#" title="Close this window" rel="noindex,nofollow"><span>+</span></a></div><div class="modal_hold"></div></div>');
};

/*- Load Image to Modal -*/
function fillImgModal(imgSrc){
	$('.modal_hold').append('<div class="gallery_loading"><span>Loading...</span></div>');
	
	var preloadImg = new Image();
	$(preloadImg).load(function(){
		$('.modal_hold').html(this);
		var refTarg = $('.modal_hold img');
		centerModal(refTarg);
	}).attr('src',imgSrc);
}

/*Load ajax content to modal */
function fillAjaxModal(ajModPath){
	$('.modal_hold').append('<div class="gallery_loading"><span>Loading...</span></div>');

	$('.modal_hold').load(
		ajModPath, 
		function(){
			var refTarg = $('.modal_hold > div');
			centerModal(refTarg);
		}
	);
};

/*Load video content to modal */
//&controls=0&modestbranding=1&rel=0&showinfo=0
function fillVideoModal(videoPath,videoWidth,videoHeight){
	//var videoParams = '?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0';
	var videoParams = '';
	
	$('.modal_hold').append('<iframe id="modalVideoFrame" width="'+videoWidth+'" height="'+videoHeight+'" src="'+videoPath+videoParams+'" frameborder="0" allowfullscreen></iframe>');
	
	var refTarg = $('.modal_hold > iframe');
	centerModal(refTarg);
};


/*- Center modal depending on given element dimensions -*/
function centerModal(refTarg){
	var elWidth = $(refTarg).outerWidth(true);
	var elHeight = $(refTarg).outerHeight(true);
	var winOffs = $(window).scrollTop();
	var winHeight = $(window).height();
	
	elTop = (elHeight/2)+40;
	if ( elTop>(winHeight/2) ){ 
		elTop=winHeight/2
	};
	
	var fullTopOfs = winOffs+(winHeight/2)-elTop;
	$('.modal').hide();
	
	
	if($(refTarg).parents('.modal').hasClass('top')){
		
		if( device_flag == 'device_mobile'){
			var topOffset = fullTopOfs+'px';
		}else{
			var topOffset = '-'+elHeight+'px';
		}
		
		$(refTarg).parents('.modal').css({
			'position':'fixed',
			'top': topOffset,
			'left': 0+'px',
			'margin-left': 0+'px'
		});
		$('.modal').show();
		$('.modal').animate({
				'top':0
			}, 200);
	}else{
		$(refTarg).parents('.modal').css({
			'position':'absolute',
			'top': fullTopOfs+'px',
			'margin-left': '-'+(elWidth/2)+'px'
		});
		
		$('.modal').fadeIn(150);
	}

};



/*- Reposition modal depending on given element dimensions -*/
function repositionModal(refTarg){
	var elWidth = $(refTarg).outerWidth(true);
	var elHeight = $(refTarg).outerHeight(true);
	var winOffs = $(window).scrollTop();
	var winHeight = $(window).height();
	
	elTop = (elHeight/2)+20;
	if ( elTop>(winHeight/2) ){ 
		elTop=winHeight/2
	};
	
	var fullTopOfs = winOffs+(winHeight/2)-elTop;
	
	if($(refTarg).parents('.modal').hasClass('top')){
		$(refTarg).parents('.modal').css({
			'top': '-'+elHeight+'px',
			'left': 0+'px',
			'margin-left': 0+'px'
		});

	}else{
		$(refTarg).parents('.modal').css({
			'top': fullTopOfs+'px',
			'margin-left': '-'+(elWidth/2)+'px'
		});
	}
};


/* Thumb Slider */
function thumbSlide(settings){
	var itemsHold = settings['items_hold'];
	
	$(itemsHold).each(function(){
		var prodItem = $(this).find(settings['slide_items']);
		var prodCount = prodItem.length;
		
		// Build Additional Elements and adjust CSS
		$(this).wrap('<div class="thumbs_wrap"><div class="thumbs_hold"></div></div>');
		$(this).parents('.thumbs_wrap').append('<div class="thumb_nav"><a class="thumbPrev" href="#" rel="noindex,nofollow">Prev</a><a class="thumbNext" href="#" rel="noindex,nofollow">Next</a></div>');
		
		// get number of visible
		var visibleWidth = $(this).parent('.thumbs_hold').width();
		var thumbWidth = prodItem.outerWidth(true);
		var prodVisible = Math.floor(visibleWidth/thumbWidth);
		
		$(this).attr('data-visible',prodVisible);
		$(this).attr('data-visible-width',visibleWidth);
		$(this).attr('data-thumb-width',thumbWidth);
		$(this).attr('data-total',prodCount);
		
		
		//define new objs
		var prodPrev = $(this).parents('.thumbs_wrap').find('.thumbPrev');
		var prodNext = $(this).parents('.thumbs_wrap').find('.thumbNext');
		
		
		//adjust thumbnail slider css
		if ( prodCount>0 ) {
			var prodHoldWidth = prodCount*thumbWidth;
			$(this).width(prodHoldWidth);
			$(this).addClass('thumbsActivated');
			if ( prodCount<=prodVisible ) { 
				$(this).addClass('thumbsFull');
				$(this).parents('.thumbs_wrap').addClass('twFull'); 
			} else { 
				$(this).removeClass('thumbsFull'); 
			};
			dissableProdNav( $(this) );
		} else {
			$(this).parents('.thumbs_wrap').hide();
		};
		
	});
	
	
	// Dissable/Enable Thumbnails Arrow Navigator
	function dissableProdNav(itemsObj){
		var prodCount = itemsObj.attr('data-total')*1;
		var prodVisible = itemsObj.attr('data-visible')*1;
		var prodWidth = itemsObj.attr('data-thumb-width');
		
		var prodPrev = itemsObj.parents('.thumbs_wrap').find('.thumbPrev');
		var prodNext = itemsObj.parents('.thumbs_wrap').find('.thumbNext');
		
		if ( prodCount<=prodVisible ) {
			$(prodPrev).addClass('dissabled');
			$(prodNext).addClass('dissabled');
			
		} else {
			if ( $(itemsObj).position().left >= 0) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
				
			} else if ( $(itemsObj).width()+$(itemsObj).position().left <= (prodWidth*prodVisible) ) {
				$(prodNext).addClass('dissabled');
				$(prodPrev).removeClass('dissabled');
				
			} else {
				$(prodNext).removeClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			};
		}
	};
	var prodPrev = $(itemsHold).parents('.thumbs_wrap').find('.thumbPrev');
	var prodNext = $(itemsHold).parents('.thumbs_wrap').find('.thumbNext');
	
	
	// Thumbnails Slider Controls
	prodNext.click(function(event){
		event.preventDefault();
		
		var prodHold = $(this).parents('.thumbs_wrap').find('.thumbnails');
		var prodVisible = prodHold.attr('data-visible')*1;
		var prodWidth = prodHold.attr('data-thumb-width'); 
		
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"-="+(prodWidth*prodVisible)+'px'}, 300, function(){dissableProdNav(prodHold)}  );
		};
	});
	prodPrev.click(function(event){
		event.preventDefault();
		
		var prodHold = $(this).parents('.thumbs_wrap').find('.thumbnails');
		var prodVisible = prodHold.attr('data-visible')*1;
		var prodWidth = prodHold.attr('data-thumb-width'); 
		
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"+="+(prodWidth*prodVisible)+'px'}, 300, function(){dissableProdNav(prodHold)}  );
		};
	});
	
	
};


/*=============== THUMBNAIL SLIDER -(vertical) ================*/
function thumbVerticalSlide(settings){
	var itemsHold = settings['items_hold'];
	
	$(itemsHold).each(function(){
		var prodItem = $(this).find(settings['slide_items']);
		var prodCount = prodItem.length;
		
		// Build Additional Elements and adjust CSS
		$(this).wrap('<div class="thumbs_wrap"><div class="thumbs_hold"></div></div>');
		$(this).parents('.thumbs_wrap').append('<div class="thumb_nav"><a class="thumbPrev" href="#" rel="noindex,nofollow">Prev</a><a class="thumbNext" href="#" rel="noindex,nofollow">Next</a></div>');
		
		// get number of visible
		var visibleHeight = $(this).parent('.thumbs_hold').height();
		var thumbHeight = prodItem.outerHeight(true);
		var prodVisible = Math.floor(visibleHeight/thumbHeight);
		
		$(this).attr('data-visible',prodVisible);
		$(this).attr('data-visible-height',visibleHeight);
		$(this).attr('data-thumb-height',thumbHeight);
		$(this).attr('data-total',prodCount);
		
		
		//define new objs
		var prodPrev = $(this).parents('.thumbs_wrap').find('.thumbPrev');
		var prodNext = $(this).parents('.thumbs_wrap').find('.thumbNext');
		
		//adjust thumbnail slider css
		if ( prodCount>0 ) {
			var prodHoldHeight = prodCount*thumbHeight;
			$(this).height(prodHoldHeight);
			$(this).addClass('thumbsActivated');
			if ( prodCount<=prodVisible ) { 
				$(this).addClass('thumbsFull');
				$(this).parents('.thumbs_wrap').addClass('twFull'); 
			} else { 
				$(this).removeClass('thumbsFull'); 
			};
			dissableProdNav( $(this) );
		} else {
			$(this).parents('.thumbs_wrap').hide();
		};
		
	});
	
	
	// Dissable/Enable Thumbnails Arrow Navigator
	function dissableProdNav(itemsObj){
		var prodCount = itemsObj.attr('data-total')*1;
		var prodVisible = itemsObj.attr('data-visible')*1;
		var prodHeight = itemsObj.attr('data-thumb-height');
		
		var prodPrev = itemsObj.parents('.thumbs_wrap').find('.thumbPrev');
		var prodNext = itemsObj.parents('.thumbs_wrap').find('.thumbNext');
		
		if ( prodCount<=prodVisible ) {
			$(prodPrev).addClass('dissabled');
			$(prodNext).addClass('dissabled');
			
		} else {
			if ( $(itemsObj).position().top >= 0) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
				
			} else if ( $(itemsObj).height()+$(itemsObj).position().top <= (prodHeight*prodVisible) ) {
				$(prodNext).addClass('dissabled');
				$(prodPrev).removeClass('dissabled');
				
			} else {
				$(prodNext).removeClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			};
		}
	};
	var prodPrev = $(itemsHold).parents('.thumbs_wrap').find('.thumbPrev');
	var prodNext = $(itemsHold).parents('.thumbs_wrap').find('.thumbNext');
	
	
	// Thumbnails Slider Controls
	prodNext.click(function(event){
		event.preventDefault();
		
		var prodHold = $(this).parents('.thumbs_wrap').find('.thumbnails');
		var prodVisible = prodHold.attr('data-visible')*1;
		var prodHeight = prodHold.attr('data-thumb-height'); 
		
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'top':"-="+(prodHeight*prodVisible)+'px'}, 300, function(){dissableProdNav(prodHold)}  );
		};
	});
	prodPrev.click(function(event){
		event.preventDefault();
		
		var prodHold = $(this).parents('.thumbs_wrap').find('.thumbnails');
		var prodVisible = prodHold.attr('data-visible')*1;
		var prodHeight = prodHold.attr('data-thumb-height'); 
		
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'top':"+="+(prodHeight*prodVisible)+'px'}, 300, function(){dissableProdNav(prodHold)}  );
		};
	});
	
	
};


/*=============== THUMBNAIL Gallery ================*/
/* --- Gallery on Click --- */
function thumbGallery(settings){
	var thumb = settings['thumbnail'];
	var screenTarg = settings['target'];
	
	/* - click on thumb - */
	$(thumb).click(function(event){
		event.preventDefault();
		if ( $(this).hasClass('movieThumb') ) {
			var videoWidth = $(this).attr('data-size').split('x')[0];
			var videoHeight = $(this).attr('data-size').split('x')[1];
			var videoUrl = $(this).attr('href');
			var videoTitle = $(this).attr('title');
			modalCreate(videoTitle,'video_modal');
			fillVideoModal(videoUrl,videoWidth,videoHeight);
			
		}else{
			if( !$(this).hasClass('current') ){
				$(this).siblings().removeClass('current');
				$(this).addClass('current');
				
				var targPath = $(this).attr('href');
				
				$(screenTarg).append('<div class="processing"><div>Loading...</div></div>');
				$(screenTarg+' img').load(function(){
					$(this).siblings('.processing').remove();
				}).attr('src',targPath);
			}
		}
	});
}

/* - ======= Detect Card Type ======== - */
function ccDetect(noId){
	
	$(noId).wrap('<div class="card_no_wrap"></div>')
	$(noId).parent('.card_no_wrap').append('<span class="card_logo"></span>')
	
	$(noId).keyup(function() {
		var value = $(this).val();
		if(value){
			if (value.indexOf('4') == 0)      $(this).siblings('.card_logo').addClass('cc_visa');
			else if(value.indexOf('5') == 0)  $(this).siblings('.card_logo').addClass('cc_mastercard');
			else if(value.indexOf('34') == 0) $(this).siblings('.card_logo').addClass('cc_amex');
			else if(value.indexOf('37') == 0) $(this).siblings('.card_logo').addClass('cc_amex');
			else if(value.indexOf('6') == 0)  $(this).siblings('.card_logo').addClass('cc_discover');
			else $(this).siblings('.card_logo').removeClass('cc_visa cc_mastercard cc_amex cc_discover');
		} else {
			$(this).siblings('.card_logo').removeClass('cc_visa cc_mastercard cc_amex cc_discover');	
		}
	});
}

/*================= Number Format function =================*/
function number_format (number, decimals, dec_point, thousands_sep) {
	// Strip all characters but numerical ones.
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}


/*================= COOKIES FNs =================*/
function createCookie(cook_name, cook_value, cook_exp_h) {
	if (cook_exp_h) {
		var date = new Date();
		date.setTime(date.getTime()+(cook_exp_h*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = cook_name+"="+cook_value+expires+"; path=/";
}
function readCookie(cook_name) {
	var nameEQ = cook_name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(cook_name) {
	createCookie(cook_name,"",-1);
}
function testCookie(){
	createCookie('JB_COOKIE_TEST', Math.random(1), (1/60) );
	var cookRes = readCookie('JB_COOKIE_TEST');
	eraseCookie('JB_COOKIE_TEST');
	if(cookRes>0) return true;
	else return false;
}