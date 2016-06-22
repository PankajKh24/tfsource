$(document).ready(function(){
	/*- Cancel Preorder -*/
	$('.cancel_stack_preorder').click(function(event){
		event.preventDefault();
		var id = $(this).attr('href');
		var customer_id = $('#customer_id').val();
		
		if ( confirm('Are you sure you want to cancel this Preorder?') ){
			$.post(
				'/customer/cancel-stack-preorder/',
				{id:id, customer_id:customer_id},
				function(){
					window.location.reload();
				}
			);
		}
	});
	
	/*- Cancel Instock -*/
	$('.cancel_stack_instock').click(function(event){
		event.preventDefault();
		var id = $(this).attr('href');
		var customer_id = $('#customer_id').val();
		
		if ( confirm('Are you sure you want to cancel this Instock item?') ){
			$.post(
				'/customer2/cancel-stack-instock/',
				{id:id, customer_id:customer_id},
				function(){
					window.location.reload();
				}
			);
		}
	});
	
	$(".calculate_shipment").live("click",function(event){
		
		if (!isCheckedById("selector")) 
        	{ 
            		alert ("Please select at least one available item"); 
            		return false; 
        	}
		else
		{ 				
			$.post('/customer/shipcalculator-new/', $("#form1").serialize(),
					function(data){
						var button = '<label class="inp_label w90">Shipment Cost:</label>';
  						$("#ship_cost_value").html(button + data.options);	
						help_array = $("#shipment_calculator").val().split('#');
						//value_array = help_array[1].split(',');
						//cost = sum(value_array);
						cost = help_array[1];
						
						var ship_state = $('#ship_state:not(:disabled)').val();							
						if ( ship_state == 'MN' )
							var tax = $("#item_cost").val()*1 * 6.875/100;
						else 
							var tax = 0;
	
						$('#tax_charge').val(tax.toFixed(2));
						$('#span_tax').text('$'+ tax.toFixed(2));

						if(cost)
						{
							$("#submit_order").show();
							$("#total_div").html('<label class="inp_label w90">Total Due:</label>' + '<span class="inp_label">$' + (cost*1 + $("#order_subtotal").val()*1 + tax).toFixed(2) + '</span>');
						}
						else
						{
							$("#submit_order").hide();
							$("#total_div").html('<label class="inp_label w90">Total Due:</label>' + '<span class="inp_label">$' + ($("#order_subtotal").val()*1 + tax).toFixed(2) + '</span>');
						}
 				}, "json");
		}
		event.preventDefault();
	});
	
	/*- Change Country -*/
	$('#bill_country').change(function(){
		var country = $(this).val();
		
		if ( country == 'US' ) {
			$('.bill_state_text').attr('disabled','disabled');
			$('.bill_state_text').hide();
			$('.bill_state_select').removeAttr('disabled');
			$('.bill_state_select').show();
		}
		else {
			$('.bill_state_select').attr('disabled','disabled');
			$('.bill_state_select').hide();
			$('.bill_state_text').removeAttr('disabled');
			$('.bill_state_text').show();
		}		
	});
	$('#bill_country').trigger('change');
	
	$('#ship_country').change(function(){
		var country = $(this).val();
		
		if ( country == 'US' ) {
			$('.ship_state_text').attr('disabled','disabled');
			$('.ship_state_text').hide();
			$('.ship_state_select').removeAttr('disabled');
			$('.ship_state_select').show();
		}
		else {
			$('.ship_state_select').attr('disabled','disabled');
			$('.ship_state_select').hide();
			$('.ship_state_text').removeAttr('disabled');
			$('.ship_state_text').show();
		}		
	});
	$('#ship_country').trigger('change');
	
	//show-hide bill and shipp
	$("#ship_continue").click(function(event){
		
		if (!isCheckedById("selector")) 
            		alert ("Please select at least one available item"); 
		else
		{ 
			if($(this).val() == 'Ship Selected Items')
				$(this).val('Back to Items');
			else
				$(this).val('Ship Selected Items');

			var checkedStuff = $("input:checkbox:checked"); 				
			$.post('/customer/calculateweigth/', checkedStuff.serialize(),
				function(data){
					$("#shipment_weigh").val(data);
					if($("#ship_continue").val() == 'Back to Items')
					{
						$.post('/customer/shipcalculator-new/', $("#form1").serialize(),
							function(data){
								var button = '<label class="inp_label w90">Shipment Cost:</label>';
								$("#ship_cost_value").html(button + data.options);	
								help_array = $("#shipment_calculator").val().split('#');
								//value_array = help_array[1].split(',');
								//cost = sum(value_array);
								cost = help_array[1];
								
								var ship_state = $('#ship_state:not(:disabled)').val();	
								if ( ship_state == 'MN' )
									var tax = $("#item_cost").val()*1 * 6.875/100;
								else 
									var tax = 0;
								$('#tax_charge').val(tax.toFixed(2));
								$('#span_tax').text('$'+ tax.toFixed(2));
								
								if(cost)
								{
									$("#submit_order").show();
									$("#total_div").html('<label class="inp_label w90">Total Due:</label>' + '<span class="inp_label">$' + (cost*1 + $("#order_subtotal").val()*1 + tax).toFixed(2) +'</span>');
								}
								else
								{
									$("#submit_order").hide();
									$("#total_div").html('<label class="inp_label w90">Total Due:</label>' + '<span class="inp_label">$' + ($("#order_subtotal").val()*1 + tax).toFixed(2) + '</span>');
								}
						}, "json");
					}		 
			});
			$("#bill-shipp").slideToggle();
			$("#items_list").slideToggle();
		}
		event.preventDefault();
	});
	
	$(".checkbox").click(function(event){
		var checkedStuff = $("input:checkbox:checked"); 						   	
		$.post('/customer/calculatecost/', checkedStuff.serialize(),
			function(data){
				$("#item_cost").val(data);
		});
		
		$.post('/customer/calculatesubtotal/', checkedStuff.serialize(),
			function(data){
				$("#span_item_cost").html('$' + (data*1).toFixed(2));
				$("#order_subtotal").val(data);
				if($("#shipment_calculator").val())
				{
					help_array = $("#shipment_calculator").val().split('#');
					cost = help_array[1];
					
					var ship_state = $('#ship_state:not(:disabled)').val();	
					if ( ship_state == 'MN' )
						var tax = $("#item_cost").val()*1 * 6.875/100;
					else 
						var tax = 0;
					
					$('#tax_charge').val(tax.toFixed(2));
					$('#span_tax').text('$'+ tax.toFixed(2));
					$("#total_div").html('<label class="inp_label w90">Total Due:</label>' + '<span class="inp_label">$' + (cost*1 + $("#order_subtotal").val()*1 + tax).toFixed(2) +'</span>');
				}
		});
	});
	
	function isCheckedById(id) 
    	{ 
        	var checked = $("input[@id="+id+"]:checked").length; 
        	if (checked == 0) 
        	{ 
           		return false; 
        	} 
        	else 
        	{ 
            		return true; 
        	} 
    	}
	
	/*--- Stack Manager Tabs ---*/
	tabsControl('#items_list');
	
	/*=============== need recheck =======================*/
	
	/*--- Credit Crad Exp. Validate Method ---*/
	$.validator.addMethod(
		"CCExp",
		function(value, element, params) {
			var minMonth = new Date().getMonth() + 1;
			var minYear = new Date().getFullYear();
			var $month = $(params.month);
			var $year = $(params.year);
			
			var month = parseInt($month.val(), 10);
			var year = parseInt($year.val(), 10);

			if ((year > minYear) || ((year === minYear) && (month >= minMonth))) {
				return true;
			} else {
				return false;
			}
		},
		"Your Credit Card Expiration date is invalid."
	);

	/*--- Bill-Shipp Validate Rules ----*/
	var form1_validate = $("#form1").validate({
		errorLabelContainer: "#messageBoxBilling",
		wrapper: "",
		onkeyup: false, 
		rules: {
			bill_first_name:{required:true},
			bill_last_name:{required:true},
			bill_phone_number: {required:true},
			bill_address1:{required:true},
			bill_zip: {required:true},
			bill_city:{required:true},
			bill_state: {required:{
				depends:function(element){ return ( $('#bill_country').val()=='US' ); }
			}},
			
			ship_first_name:{required:true},
			ship_last_name:{required:true},
			ship_address1:{required:true},
			ship_zip: {required:true},
			ship_city:{required:true},	
			ship_state: {required:{
				depends:function(element){ return ( $('#ship_country').val()=='US' ); }
			}},
			
			payment_type: {required:true},
			paypal_email: {required:{
				depends:function(element){ return ( $('input[name="payment_type"]:checked').val() == 'Paypal' ); }
			}},
			
			cc_number:{required:true},
			card_cvn:{
				required:true,
				maxlength:4,
				digits: true
			},
			exp_year: {
				CCExp: { month:"#exp_month", year:"#exp_year"}
			}
		},
		messages: {
			bill_first_name: "Enter your firstname",
			bill_last_name: "Enter your lastname",
			bill_phone_number: "Provide phone number",
			bill_address1: "Enter Address",
			bill_zip: {	
				required: "Zip Code is Required",
				remote: "Invalid Zip Code"
			},
			bill_city: "Enter City",
			bill_state: "Enter State",
			
			ship_first_name: "Enter your firstname",
			ship_last_name: "Enter your lastname",
			ship_address1: "Enter Address",
			ship_zip: {	
				required: "Zip Code is Required",
				remote: "Invalid Zip Code"
			},
			ship_city: "Enter City",
			ship_state: "Enter State",
			
			payment_type: "Enter Payment Type",
			paypal_email: "Enter PayPal email",
			
			cc_number:"Invalid Credit Card",
			card_cvn:{
				required: "Security # is Required",
				digits: "Only digits allowed",
				maxlength: jQuery.format("Enter only {0} characters")
			}
		}//,
		//submitHandler: function() { alert("Submitted!");return false; }
	});
	
		
	/*--- Submit Order Click ---*/
	$("#submit_order").click(function(event){
		$("#messageBoxCreditCard").hide();
		var pay_type = $('input[name="payment_type"]:checked').val();
		
		if(form1_validate.form()) {
			$('body').append('<div class="process"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');
			//$.blockUI();
			if ( pay_type == 'Credit Card' ) {
				$.post(
					"/customer/charge/",
					$("#form1").serialize(),
					function(data){
						if(data){
							$('.process').remove();
							$("#messageBoxCreditCard").show();
							$("#messageBoxCreditCard").html('<span for="exp_year" generated="true" class="error" style="display: block;padding:10px 10px 10px 10px;">Your credit card has been declined.<br /> This could be for the following reasons: <br />1) Confirm the card # is correct, this is the most common error in miskeying your card #<br /> 2) Your billing address entered does not match the billing address on file with your bank<br /> 3) A reason other than the above. Please try another card, try entering and submitting the same card again, or contact your credit card company and inquire as to the reason the card was declined.</span>');
						} else $("#form1").submit();
					}
				);
			} else $("#form1").submit();
		}
		return false;
	});

});

/*=============== TABS FNs ================*/
function tabsControl(tabObj){
	/*- Select First Tab or .current Tab -*/
	$(tabObj+' .tabs_holder').each(function(){
		if ( $(this).children('.current').length==0 ) {
			actTab = $(this).find('.tab:first-child');
			actTab.addClass('current');
		} else {
			actTab = $(this).children('.current');
		};
		showTab(actTab);
	});
	
	/*- Click on tabs -*/
	$(tabObj+' .tab').live('click',function(event){
		event.preventDefault();
		var actTab = $(this);
		$(actTab).parent().children('.current').removeClass('current');
		$(actTab).addClass('current');
		showTab(actTab);
	});
	
	/*- Show Current tab -*/
	function showTab(actTabObj){
		var tabPath = actTabObj.attr('href');
		$(actTabObj).parents('.tabs_control').find('.tab_cont:visible').hide();
		$(actTabObj).parents('.tabs_control').find(tabPath).show();
	};
	
};

/*======================================================================================================================*/
/*Add to order scripts (stack manager)*/

function set_shippment(checked_flag) {
	if(checked_flag) {
		document.getElementById('ship_first_name').value = document.getElementById('bill_first_name').value;
		document.getElementById('ship_last_name').value = document.getElementById('bill_last_name').value;
		document.getElementById('ship_address1').value = document.getElementById('bill_address1').value;
		document.getElementById('ship_address2').value = document.getElementById('bill_address2').value;
		document.getElementById('ship_country').value = document.getElementById('bill_country').value;
		document.getElementById('ship_city').value = document.getElementById('bill_city').value;
		var country = document.getElementById('ship_country').value;
		if ( country == 'US' ) {
			$('.ship_state_text').attr('disabled','disabled');
			$('.ship_state_text').hide();
			$('.ship_state_select').removeAttr('disabled');
			$('.ship_state_select').show();
			$('.ship_state_select').val( $('.bill_state_select').val() );
		}
		else {
			$('.ship_state_select').attr('disabled','disabled');
			$('.ship_state_select').hide();
			$('.ship_state_text').removeAttr('disabled');
			$('.ship_state_text').show();
			$('.ship_state_text').val( $('.bill_state_text').val() );
		}
		//document.getElementById('ship_state').value = document.getElementById('bill_state').value;
		document.getElementById('ship_zip').value = document.getElementById('bill_zip').value;
		document.getElementById('ship_phone').value = document.getElementById('bill_phone').value ;
	}
	
}

function shipment_calculator_change(){									   
	help_array = $("#shipment_calculator").val().split('#');
	//value_array = help_array[1].split(',');
	//cost = sum(value_array);
	cost = help_array[1];
	
	var ship_state = $('#ship_state:not(:disabled)').val();	
	if ( ship_state == 'MN' )
		var tax = $("#item_cost").val()*1 * 6.875/100;
	else 
		var tax = 0;
	
	$('#tax_charge').val(tax.toFixed(2));
	$('#span_tax').text('$'+ tax.toFixed(2));
	$("#total_div").html('<label class="inp_label w90">Total Due:</label><span class="inp_label">$' + (cost*1 + $("#order_subtotal").val()*1 + tax).toFixed(2)+'</span>');	
}