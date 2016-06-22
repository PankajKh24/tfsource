$(document).ready(function(){
	
	$('#stack_button').click(function(){
		$('body').append('<div class="processing"><div>Please Wait</div></div>');
	});
	
	/* - New Validator Method - CC Expire - */
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
	
	
	/* - Same Billing And Shipping - */
	/*function set_shippment(checked_flag) {
		if(checked_flag) {
			document.getElementById('ship_first_name').value = document.getElementById('bill_first_name').value;
			document.getElementById('ship_last_name').value = document.getElementById('bill_last_name').value;
			document.getElementById('ship_address1').value = document.getElementById('bill_address1').value;
			document.getElementById('ship_address2').value = document.getElementById('bill_address2').value;
			document.getElementById('ship_country').value = document.getElementById('bill_country').value;
			document.getElementById('ship_city').value = document.getElementById('bill_city').value;
			document.getElementById('ship_state').value = document.getElementById('bill_state').value;
			document.getElementById('ship_zip').value = document.getElementById('bill_zip').value;
			document.getElementById('ship_phone').value = document.getElementById('bill_phone').value ;
		}	
	}*/
	
	$('#same_checkbox').click(function(){
		set_shippment(this.checked);
		calculateShipping($('#stack_submit_items'));
	});
		
	$('#po_box_flag').change(function(){
		calculateShipping($('#stack_submit_items'));
	});	
		
	$('#micko_paypal').click(function(event){
		event.preventDefault();
		
		$('#stack_form').attr('action','/customer/paypal/');
		$('#paypal_submit_img').trigger('click');
	});	
	
	/* - Change Country - */
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
        calculateShipping($('#stack_submit_items'));
	});
	$('#ship_country').trigger('change');

    $('#ship_state:not(:disabled)').change(function(){
        calculateShipping($('#stack_submit_items'));
    });

    $('#ship_zip').blur(function() {
        calculateShipping($('#stack_submit_items'));
    });

	
	/* - Cancel InStock / Preorder - */
	$('.cancel_stack_preorder, .cancel_stack_instock').click(function(event){
		event.preventDefault();
		var actObj = $(this);
		
		if ( confirm('Are you sure you want to cancel this item?') ){
			$.post(
				actObj.attr('href'),
				{id:actObj.attr('data-id'), customer_id:$('#customer_id').val()},
				function(){
					window.location.reload();
				}
			);
		}
	});
	
	
	/* - Calculate Shipment - */
	$('.calculate_shipment').live('click',function(event){
		event.preventDefault();
        if( !isCheckedById() ){
            alert ("Please select at least one available item");
            return false;

        } else {
            calculateShipping($('#stack_submit_items'));
        }

	});
	
	
	/* - Check Items - */
	$(".checkbox").click(function(event){
		var checkedStuff = $("input:checkbox:checked");
        calculateSummary(checkedStuff);
	});
	
	



	/* - Ship Items (Continue) - */
	$("#stack_submit_items").click(function(event){
		event.preventDefault();
		var actObj = $(this);
		
		if (!isCheckedById()) alert ("Please select at least one available item");
		else { 
			//- adjust btn
			if( actObj.attr('data-step')=='1' ) {
				//actObj.val('Back to Items');
				actObj.attr('data-step','2');
			} else {
				//actObj.val('Ship My Stack');
				actObj.attr('data-step','1');
			}
            calculateShipping($(this));

            $("#bill-shipp").slideDown(200);
            $("#items_list .itemsListHold").slideUp(200);
			$("#items_list .sm_main").append('<a href="#" id="backToItems">&laquo; Back To Items</a>');

		}
	});
	
	$("#backToItems").live('click',function(event){
		event.preventDefault();
		$("#bill-shipp").slideUp(200);
        $("#items_list .itemsListHold").slideDown(200);
		$(this).remove();
		$("#stack_submit_items").attr('data-step','1');
	});

	/* - Slide Textarea Gift - */
	$('#stack_inp_textarea').change(function(){
		if( $(this).is(':checked') ){
			$('#notes_requests').slideDown(300);
		}else{
			$('#notes_requests').slideUp(300);
		}
	});
	
	
	
	
	/* - Bill-Shipp Validate Rules - */
	var form_stack_validate = $("#stack_form").validate({
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
	
		
		
		
	/* - Submit Order Click - */
	$("#submit_order").click(function(event){
		event.preventDefault();
		
		$("#messageBoxCreditCard").hide();
		var pay_type = $('input[name="payment_type"]:checked').val();
		var pay_check_loc = $('input[name="payment_type"]:checked').attr('data-paycheck');

		if ( typeof(pay_type) == 'undefined' ) {
			alert("Please choose Payment Type first");
			return false;
		}

        if($("#regular_items_div").is(":visible")){
            var ship_string = $("input[name='instock_shipment_calculator']:checked").val();
            if(ship_string == null){
                alert("Please Fill your Shipping data first");
                return false;
            }
        }

        if($("#vintage_items_div").is(":visible")){
            var ship_string = $("input[name='vintage_shipment_calculator']:checked").val();
            if(ship_string == null){
                alert("Please Fill your Shipping data first");
                return false;
            }
        }

		if( form_stack_validate.form() ) {
			$('body').append('<div class="ch_processing processing"><div>Please Wait<span>Please wait for the order to complete, do not hit refresh or go back on your browser</span></div></div>');
			if( pay_type == 'Credit Card' ) {
				$.post(
					pay_check_loc,
					$("#stack_form").serialize(),
					function(data){
						if(data){
							$('.processing').remove();
							$("#messageBoxCreditCard").show();
							var response_text = '<span for="exp_year" generated="true" class="error" style="display: block;padding:10px 10px 10px 10px;">Your credit card has been declined.<br />This could be for the following reasons: <br />1) Confirm the card # is correct, this is the most common error in miskeying your card #<br /> 2) Your billing address entered does not match the billing address on file with your bank<br /> 3) A reason other than the above. Please try another card, try entering and submitting the same card again, or contact your credit card company and inquire as to the reason the card was declined.<br /><br /><strong>Processor Repsonse:</strong><br />'+data+'</span>';
							$("#messageBoxCreditCard").html(response_text);
						
						} else $("#stack_form").submit();
					}
				);
			
			} else if( pay_type == 'Paypal' ) {
				$.post(
					pay_check_loc,
					$("#stack_form").serialize(),
					function(){
						$("#stack_form").submit();
					}
				);
			} else {
				$("#stack_form").submit();
			}
		}
		return false;
	});

});



/*======================================================================================================================*/
function calculateShipping(actObj)
{
    //- calculate weight
    var checkedStuff = $(".check_items:checked");
    hideShipping(checkedStuff);
	if ( $('.processing').length == 0 ) 
		$('#shipment_charge').append('<div class="processing ch_processing"><div>Please Wait</div></div>');
    $.post(
        actObj.attr('data-weight-loc'),
        checkedStuff.serialize(),
        function(data){
            //- calculate shipping
            if( actObj.attr('data-step')=='2' ){
                $("#shipment_weigh").val(data.regular_items);
                $("#shipment_weigh_vintage").val(data.vintage_items);
                if ($('#instock_shipment_div').is(':visible')) {
                    $.post(
                        actObj.attr('data-ship-loc'),
                        $("#stack_form").serialize(),
                        function (data) {
                            $("#instock_shipment_div").html(data.options);
                            calculateSummary(checkedStuff);
                        },
                        "json"
                    );
                }

                if ($('#vintage_shipment_div').is(':visible')) {
                    $.post(
                        actObj.attr('data-ship-loc-vintage'),
                        $("#stack_form").serialize(),
                        function (data) {
                            $("#vintage_shipment_div").html(data.options);
                            calculateSummary(checkedStuff);
                        },
                        "json"
                    );
                }
            }
        },
        "json"
    );
}

/* Check Selected Items */
function isCheckedById()
{ 
	var checked = $(".check_items:checked").length;
	if (checked == 0) { 
		return false; 
	
	} else { 
		return true; 
	} 
}


/* Copy Bill To Ship */
function set_shippment(checked_flag)
{
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


/* Change Shipping Cost (Method) */
function shipment_calculator_change()
{
    var checkedStuff = $("input:checkbox:checked");
    calculateSummary(checkedStuff);
}

function hideShipping(checked){
    var hasRegular = false;
    var hasVintage = false;
    var total_regular = 0;
    var total_vintage = 0;
    var subtotal_regular = 0;
    var subtotal_vintage = 0;
    checked.each(function(){
        if($(this).attr("data-vintage") == 1) {
            hasVintage = 1;
            if ($(this).attr("data-charged") == 0)
                total_vintage += $(this).attr("data-price") * 1;
            subtotal_vintage += $(this).attr("data-price") * 1;
        }
        else {
            hasRegular = 1;
            if($(this).attr("data-charged") == 0)
                total_regular += $(this).attr("data-price") * 1;
            subtotal_regular += $(this).attr("data-price") * 1;
        }
    });

    $("#item_cost").val(total_regular);
    $("#total_vintage").val(total_vintage);
    $("#subtotal_regular").val(subtotal_regular);
    $("#subtotal_vintage").val(subtotal_vintage);

    if (!hasRegular)
        $("#regular_items_div").hide();
    if (!hasVintage)
        $("#vintage_items_div").hide();
}

function calculateSummary(checked){
    var item_count = 0;
    var total_regular = 0;
    var total_vintage = 0;

    checked.each(function(){
        if($(this).attr("data-vintage") == 1) {
            if($(this).attr("data-charged") == 0)
                total_vintage += $(this).attr("data-price") * 1;

        }
        else {
            if($(this).attr("data-charged") == 0)
                total_regular += $(this).attr("data-price") * 1;

        }
        item_count++;
    });

    $("#item_count").text(item_count);

    var ship_cost = 0;

    if($("#regular_items_div").is(":visible")){
        var ship_string = $("input[name='instock_shipment_calculator']:checked").val();
        if(ship_string != null){
            var help_array = ship_string.split('#');
            ship_cost += help_array[1] * 1;
        }
    }

    if($("#vintage_items_div").is(":visible")){
        var ship_string = $("input[name='vintage_shipment_calculator']:checked").val();
        if(ship_string != null){
            var help_array = ship_string.split('#');
            ship_cost += help_array[1] * 1;
        }
    }

    var order_subtotal = total_regular + total_vintage;
    $("#span_item_cost_regular").text("$"+number_format(total_regular,2));
    $("#span_item_cost_vintage").text("$"+number_format(total_vintage,2));

    var ship_state = $('#ship_state:not(:disabled)').val();
    if ( ship_state == 'NV' ){
        var tax = ( $("#subtotal_regular").val()*1 + $("#subtotal_vintage").val()*1 ) * 8.1/100;

		$("#tax_span").show();
		$("#tax_span").next('hr').show();
		$("#tax_label").show();
	} else {
		var tax = 0;
		$("#tax_span").hide();
		$("#tax_span").next('hr').hide();
		$("#tax_label").hide();
	}

	$("#tax_span").text("$"+number_format(tax,2));

    var total_credit = $("#customer_credit").val();
    var used_credit = 0;
    if(total_credit > 0){
        if(total_credit >= (order_subtotal + tax + ship_cost))
            used_credit = order_subtotal + tax + ship_cost;
        else
            used_credit = total_credit;
    }
    $("#span_credit").text("$"+number_format(used_credit,2));

    var order_total = order_subtotal + tax + ship_cost - used_credit;
    $("#order_total_span").text("$"+number_format(order_total,2));
	
	$('.processing').remove();
}