$(document).ready(function(){
	
	/*============= CLIENT BROWSER and IE FIXES ==================*/
	var uav = $.browser.version;
	
	/*--- IE < 8 ---*/
	if($.browser.msie && uav<='8.0'/* || $.browser.mozilla && uav.version.slice(0,3) < '1.9'*/){
		/*-- required label fix --*/
		$('.label_req').prepend('<span class="red">*</span> ');
	}
	/*--- IE < 9 ---*/
	if($.browser.msie && uav<='9.0'/* || $.browser.mozilla && uav.version.slice(0,3) < '1.9'*/){
		/*-- cols grid --*/
		$('.col:last-child').addClass('lastCol');
		$('#account_summary > div:last-child').addClass('lastCol');
	}
	
	$.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	
	
	/*============= PRINT ==================*/
	$('.page_print').click(function(event){
		event.preventDefault();
		window.print() ;
	});
	
	
	/* --- Hover over Product Gall Fix --- */
	$('#main_menu>li>ul').hover(
		function() {
			$( '#wrap' ).css( 'z-index', 1100 );
		}, function() {
			$( '#wrap' ).css( 'z-index', 10 );
		}
	);
	
	
	
	/*============= MENU HOVER ==================*/
	$('#main_menu>li').hoverIntent({
		sensitivity: 2,
        interval: 100,
		timeout:200,
		over: function(){ 
			$(this).children('ul').stop().slideDown(200);
		},
		out: function(){ 
			$(this).children('ul').stop().slideUp(100);
		}
	});
	
	/*============= ACCOUNT SUBMENUS ==================*/
	// removed #sec_menu #login a.not_logged
	$('#sec_menu #register a.not_logged').click(function(event){
		event.preventDefault();
		if( $(this).parent().hasClass('submenu_expanded') ) {
			$(this).next('ul').slideUp(100);
			$(this).parent().toggleClass('submenu_expanded');
		} else{
			$(this).parents('#sec_menu').find('ul:visible').slideUp(50);
			$(this).parents('#sec_menu').find('ul:visible').parent('li').removeClass('submenu_expanded');
			$(this).next('ul').slideDown(100);
			$(this).parent().toggleClass('submenu_expanded');
		};
	});
	
	
	/*============== TOOLTIPS ================*/
	$('.tooltip').live({
        mouseenter : function (){
            var tipTarg = $(this).attr('href');
            $(tipTarg).clone().appendTo(this);
            $(this).children('.tip_content').fadeIn(100);
        },
        mouseleave : function (){
            $(this).children('.tip_content').fadeOut(200, function(){ $(this).remove(); });
        },
        click : function(event){
            event.preventDefault();
        }
    });
	
	
	/*============== DINO MESSAGES ================*/
	/*- Check Cookie And Show message on first page open -*/
	var dinoShowInterval;
	var dinoHideInterval;
	if ( readCookie("TF_Dino_Message")!='showed' ) {
		createCookie("TF_Dino_Message","showed",6);
		dinoShowInterval = setInterval(function(){dinoSpeaks()},9000);
		dinoHideInterval = setInterval(function(){dinoSilent()},15000);
	};
	
	/*- Hover on Dino -*/
	$('#rex').hoverIntent({
		over:dinoSpeaks,
		timeout:150,
		out:dinoSilent
	});
	
	/*- Show Message -*/
	function dinoSpeaks(){
		$('#rex').addClass('dinoSpeaks');
		$('#bubble-wrap').show(100);
		clearInterval(dinoShowInterval);
	};
	
	/*- Hide Message -*/
	function dinoSilent(){
		$('#rex').removeClass('dinoSpeaks');
		$('#bubble-wrap').hide(100);
		clearInterval(dinoHideInterval);
	};
	
	
	/*============== SHARING TOOLBAR ================*/
	/*var shareAnimSpeed = 200;
	
	if ( $('#share_tools').length>0 ){
		scrollMenu('#share_tools');
	};
	
	$('#share_tools').hover(
		function(){
			$('#share_tools').stop().animate({
				'margin-left':'990px'
			},shareAnimSpeed);
			$('#share_shadow').stop().animate({
				'margin-left':'-7px'						   
			},shareAnimSpeed);
		},
		function(){
			$('#share_tools').stop().animate({
				'margin-left':'930px'
			},shareAnimSpeed);
			$('#share_shadow').stop().animate({
				'margin-left':'53px'						   
			},shareAnimSpeed);
		}
	);*/
	
	
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
		modalCreate(videoTitle,'video_modal');
		fillVideoModal(videoUrl,videoWidth,videoHeight);
	});
	
	/*- Open Ajax cont. in Modal -*/
	$('.modal_act').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		
		modalCreate(contTitle,contId);
		fillAjaxModal(contUrl);
	});
	
	/*- Open Image cont. in Modal -*/
	$('.modal_img').live('click',function(event){
		event.preventDefault();
		var contUrl = $(this).attr('href');
		var contTitle = $(this).attr('title');
		var contId = $(this).attr('data-style');
		
		modalCreate(contTitle,contId);
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
	
	/* Feedback Lightbox */
	$('.tfs_feedback').click(function(event){
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
	
	


	/*================= SEARCH FORM ===================*/
	
	/*- Input Focus/Blur -*/
	$('#search #search_fld').focus(function(){
		if(this.value=='Type Your Search Here'){this.value=''};
	});
	
	$('#search #search_fld').blur(function(){
		if(this.value==''){this.value='Type Your Search Here'};
	});
	
	/* - Fix Url For Get - */
	$('#search').live("submit",function(event){
		event.preventDefault();
		var search_url = $(this).parents().find('form').attr('action');
		
		var term = $('#search_fld').val();
		var url = search_url + 'search_term/' + term + '/';
		
		window.location = url;
	});
	
	/* - Autocomplete - */
	if( $("#search-wrap #search_fld").length>0 ){
		$("#search-wrap #search_fld").autocomplete({
			source: function( request, response ) {
				$.ajax({
					url: "/search/autocomplete/",
					type: "POST",
					data: {
						q: request.term
					},
					dataType: "json",
					success: function( data ) {
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
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			if( item.image=='all' )
				return $("<li></li>").data("item.autocomplete", item).append('<a class="all_resaults_lnk" href="'+ item.url +'">'+ item.name +'</a>' ).appendTo(ul);
			
			else 
				return $("<li></li>").data("item.autocomplete", item).append('<a href="'+ item.url +'"><img src="'+ item.image +'" width="60" height="60" /><span>' + item.label + '</span></a>' ).appendTo(ul);
		};
	}
	
	
	
	/*============== LOGIN FORM =====================*/
	
	/*- Input Focus/Blur -*/
	$('#login-form #username').focus(function(){
		if(this.value=='Email'){this.value=''};
	});
	
	$('#login-form #username').blur(function(){
		if(this.value==''){this.value='Email'};
	});
	
	$('#login-form #password').focus(function(){
		if(this.value=='********'){this.value=''};
	});
	
	$('#login-form #password').blur(function(){
		if(this.value==''){this.value='********'};
	});
	
	
	/*- Append Error Holders -*/
	$('#login-form').append('<div class="error"><span class="email_error"></span><span class="pasword_error"></span></div>');
	
	
	/*- Validation and Submit -*/
	$("#login-submit").click(function(){					   				   
		$("#login-form .error, #login-form .error span").hide();
		var hasError = false;
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		
		var subscriberEmail = $("#username").val();
		if(subscriberEmail == '') {
			$("#login-form .email_error").html('You forgot to enter the email address.').show();
			hasError = true;
		} else if(!emailReg.test(subscriberEmail)) {	
			$("#login-form .email_error").html('Enter a valid email address.').show();
			hasError = true;
		}
		
		var subscriberName = $("#password").val();
		if(subscriberName == '') {
			$("#login-form .pasword_error").html('You forgot to enter Password.').show();
			hasError = true;
		}
		
		if(hasError == false) {
			$("#login-form fieldset").append('<div class="processing"></div>');
			
			$.post(
				"/lightbox/check-login/",
   				{username: subscriberEmail, password: subscriberName},
				function(data){
					if(data == 'Login succesfully'){
						$("#login-form").slideUp("normal", function() {				   
							$("#login-form").before(data);
							setTimeout("window.location.reload()",1000);											
						});
					} else if (data == 'Wholesale') {
						window.location = "/wholesale/category/";
					} else if (data == 'Blocked') {
						window.location = "/customer/blocked/";
					} else {
						$("#login-form div.processing").remove();
						alert(data);
					};
				}
			);
		} else {
			$("#login-form .error").slideDown();
		};
		return false;
	});
	
	
	
	/*============== REGISTRATION FORM ================*/
	
	/*- Append Error Holders -*/
	$('#register-form').append('<div class="error"><span class="first_error"></span><span class="last_error"></span><span class="email_error"></span><span class="pasword_error"></span><span class="retype_error"></span></div>');
	
	
	/*- Validation and Submit -*/
	$("#register-submit").click(function(){					   				   
		$("#register-form .error, #register-form .error span").hide();
		hasError = false;
		
		var customer_first_name = $("#customer_first_name").val();
		if(customer_first_name == '') {
			$("#register-form .first_error").html('You forgot to enter Your First Name.').show();
			hasError = true;
		}
		
		var customer_last_name = $("#customer_last_name").val();
		if(customer_last_name == '') {
			$("#register-form .last_error").html('You forgot to enter Your Last Name.').show();
			hasError = true;
		}
		
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		
		var customer_email = $("#customer_email").val();
		if(customer_email == '') {
			$("#register-form .email_error").html('You forgot to enter the email address.').show();
			hasError = true;
		} else if(!emailReg.test(customer_email)) {	
			$("#register-form .email_error").html('Enter a valid email address.').show();
			hasError = true;
		}
		
		var customer_password = $("#customer_password").val();
		if(customer_password == '') {
			$("#register-form .pasword_error").html('You forgot to enter Password.').show();
			hasError = true;
		}
		
		var retype_customer_password = $("#retype_customer_password").val();
		if(retype_customer_password == '') {
			$("#register-form .retype_error").html('You forgot to Retype Password.').show();
			hasError = true;
		}
		if(retype_customer_password != customer_password) {
			$("#register-form .retype_error").html('Retyped Password different than original.').show();
			hasError = true;
		}
		
		if ( $('#newsletter_signup_header').is(':checked') )
			var newsletter = 1;
		else
			var newsletter = 0;
		
		if(hasError == false) {
			$("#register-form").append('<div class="processing"></div>');
			
			$.post(
				"/lightbox/check-new/",
				{customer_first_name: customer_first_name, customer_last_name: customer_last_name, customer_email: customer_email, customer_password: customer_password, newsletter: newsletter},
   				function(data){
					if(data == 'Login succesfully'){
						$("#register-form").slideUp("normal", function() {
							$("#register-form").before(data);
							setTimeout("window.location.reload()",1000);
						});
					} else {
						$("#register-form div.processing").remove();
						alert(data);
					};
				}
			);
		}  else {
			$("#register-form .error").slideDown();
		};
		return false;
	});
	
	
	
	
	
	
});



/*=============== COOKIEs FNs===============*/
/*- Create cookie -*/
function createCookie(cook_name, cook_value, cook_exp_h) {
	if (cook_exp_h) {
		var date = new Date();
		date.setTime(date.getTime()+(cook_exp_h*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = cook_name+"="+cook_value+expires+"; path=/";
}

/*- Read Cookie -*/
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

/*- Delete Cookie -*/
function eraseCookie(cook_name) {
	createCookie(cook_name,"",-1);
}
	

/*========== ALERT BOX -start =========*/
function alertBox(alertOpts){
	var alertMessage = alertOpts['alertMessage'];
	var alertType = alertOpts['alertType'];
	var offTimeout = alertOpts['offTimeout'];
	if (!offTimeout) offTimeout=2000;
	if (!alertType) alertType='';
	var alertTimeout;
	
	$('.alert_box').remove();
	$('body').append('<div class="alert_box '+alertType+'"><div>'+alertMessage+'</div></div>');
	
	$('.alert_box').show(100, function(){
		$('.alert_box').bind('click', function(){
			$('.alert_box').hide(100,function(){
				$(this).remove();
				clearInterval(alertTimeout);
			});
			$('.alert_box').unbind('click');
		});
		alertTimeout = setInterval(function(){
			$('.alert_box').hide(100,function(){
				$(this).remove();
				clearInterval(alertTimeout);
			});
		},offTimeout);
	});
};
/*========== ALERT BOX -end =========*/


/*========= FLOATING BOX on Scroll ==========*/
function scrollMenu (scrl_o){
	var init_pos = $(scrl_o).position();
	
	$(window).scroll(function(){
		var scrl_top = $(window).scrollTop();
		if (scrl_top>init_pos.top){
			$(scrl_o).addClass('scroll_float');
		} else {
			$(scrl_o).removeClass('scroll_float');
		};
	});
}




/*=============== LIGHTBOX FNs ================*/
/*- Build Modal Structure With Title -*/
function modalCreate(contTitle,contId){
	if(!contTitle) contTitle = '';
	$('body').append('<div class="modal_overlay loading"></div><div id="'+contId+'" class="modal"><div class="modal_bar"><span class="modal_title">'+contTitle+'</span><a class="modal_close" href="#" title="Close this window" rel="noindex,nofollow">X</a></div><div class="modal_hold"></div></div>');
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
function fillVideoModal(videoPath,videoWidth,videoHeight){
	$('.modal_hold').append('<iframe width="'+videoWidth+'" height="'+videoHeight+'" src="'+videoPath+'" frameborder="0" allowfullscreen></iframe>');
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
	
	$(refTarg).parents('.modal').css({
		'position':'absolute',
		'top': fullTopOfs+'px',
		'margin-left': '-'+(elWidth/2)+'px'
	});
	
	$('.modal').fadeIn(150);
	
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
	
	$(refTarg).parents('.modal').css({
		'top': fullTopOfs+'px',
		'margin-left': '-'+(elWidth/2)+'px'
	});
	
};





/*=============== THUMBNAIL SLIDER ================*/
function thumbSlide(settings){
	var prodVisible = settings['numb_visible'];
	var itemsHold = settings['items_hold'];
	var prodItem = $(itemsHold).find(settings['slide_items']);
	var prodCount = prodItem.length;
	var sliderRows = settings['rows'];
	
	
	
	// Build Additional Elements and adjust CSS
	$(itemsHold).wrap('<div class="thumbs_wrap"><div class="thumbs_hold"></div></div>');
	$(itemsHold).parents('.thumbs_wrap').append('<div class="thumb_nav"><a class="thumbPrev" href="#" rel="noindex,nofollow">Prev</a><a class="thumbNext" href="#" rel="noindex,nofollow">Next</a></div>');
	
	//define new objs
	var prodHold = $(itemsHold);
	var prodPrev = prodHold.parents('.thumbs_wrap').find('.thumbPrev');
	var prodNext = prodHold.parents('.thumbs_wrap').find('.thumbNext');
	
	//adjust thumbnail slider css
	if ( prodCount>0 ) {
		var prodWidth = prodItem.outerWidth(true);
		
		if( prodCount > (prodVisible/sliderRows) ) {
			if( prodCount>prodVisible ) var prodHoldWidth = prodWidth*Math.ceil(prodCount/sliderRows);
			else var prodHoldWidth = prodWidth*Math.ceil(prodVisible/sliderRows);
		} else 
			var prodHoldWidth = (prodWidth*prodCount);
		
		$(prodHold).width(prodHoldWidth);
		
		var itemHeight = $(prodItem).outerHeight(true);
		var holdHeight = itemHeight*sliderRows;
		$(prodItem).parents('.thumbs_hold').css('height', holdHeight);
		//alert(holdHeight);
		
		$(prodHold).addClass('thumbsActivated');
		if ( prodCount<=prodVisible ) { $(prodHold).addClass('thumbsFull'); } else { $(prodHold).removeClass('thumbsFull'); };
		dissableProdNav();
	} else {
		$(prodHold).parents('.thumbs_wrap').hide();
	};
	
	// Dissable/Enable Thumbnails Arrow Navigator
	function dissableProdNav(){
		if ( prodCount<=prodVisible ) {
			$(prodPrev).addClass('dissabled');
			$(prodNext).addClass('dissabled');
		} else {
			if ( $(prodHold).position().left >= 0 ) {
				$(prodPrev).addClass('dissabled');
				$(prodNext).removeClass('dissabled');
			} else if ( $(prodHold).width()+$(prodHold).position().left <= (prodWidth*prodVisible)/sliderRows ) {
				$(prodNext).addClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			} else {
				$(prodNext).removeClass('dissabled');
				$(prodPrev).removeClass('dissabled');
			};
		}
	};
	
	// Thumbnails Slider Controls
	prodNext.click(function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"-="+(prodWidth*prodVisible)/sliderRows +'px'}, 300, function(){dissableProdNav()}  );
		};

	});
	prodPrev.click(function(event){
		event.preventDefault();
		if ( !$(this).hasClass('dissabled') && !prodHold.is(':animated') ) {
			prodHold.animate(  {'left':"+="+(prodWidth*prodVisible)/sliderRows +'px'}, 300, function(){dissableProdNav()}  );
		};
	});
};

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