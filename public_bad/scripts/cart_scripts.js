$(document).ready(function(){
	
	/*============== MISC ================*/
	
	/*- Scrolling Overview Box Init -*/
	if ( $('#cart_overview').length>0 ){
		scrollMenu('#cart_overview');
	};
	
	/*- Print -*/
	$('.cart_print').click(function(event){
		event.preventDefault();
		window.print() ;
	});
	
	
	/*============== EROLL SOURCE REWARDS ================*/
	$('#enroll_btn').click(function(event){
		event.preventDefault();
		if ( $('#enroll_check').is(':checked') ) {
			var enrollTarg = $(this).attr('href');
			$.post(
				enrollTarg,
				function(data){
					alert(data);
					window.location.reload();
				}
			);
		} else {
			alert('You have to agree to Terms and Conditions of Source Points.');
		};
	});
	
	$('.shop_next').click(function(event){
		event.preventDefault();
		
		$.post(
			'/cart/check/',
			function(data) {
				if (data == 'error')
				{
					alertBox({
						alertMessage: 'Your merchandise total is is below the minimum amount required to receive the freebies you have selected.<br />Please add additional merchandise to your cart that will meet this minimum spend requirement.',
						alertType: '',
						offTimeout: 10000
					});	
				}
				else
					window.location = '/checkout/login/';
			}
		);
	});
	
});