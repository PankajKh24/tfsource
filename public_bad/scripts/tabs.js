$(document).ready(function(){
	//tabs control
	$(".tab_holder a").each(function(){
		$(this).click(function(event){
			$(this).parent().find('.current').removeClass('current');
			$(this).addClass('current');
			var path=$(this).attr('href');
			$(this).parent().parent().find('.curr').removeClass('curr');
			$(this).parent().parent().find(path).addClass('curr');
			event.preventDefault();
		});
	});
	
	$(".calculate_shipment").click(function(event){
		
		if (!isCheckedById("selector")) 
        	{ 
            		alert ("Please select at least one available item"); 
            		return false; 
        	}
		else
		{ 				
			$.post('/customer/shipcalculator/', $("#form1").serialize(),
					function(data){
						var button = '<label>Shipment Cost:</label>';
  						$("#ship_cost_value").html(button + data.options);	
						help_array = $("#shipment_calculator").val().split('#');
						//value_array = help_array[1].split(',');
						//cost = sum(value_array);
						cost = help_array[1];
						$("#submit_order").show();
						$("#total_div").html('<label>Total:</label>' + '$' + (cost*1 + $("#item_cost").val()*1).toFixed(2));
 				}, "json");
		}
		event.preventDefault();
	});
	
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
						$.post('/customer/shipcalculator/', $("#form1").serialize(),
							function(data){
								var button = '<label>Shipment Cost:</label>';
								$("#ship_cost_value").html(button + data.options);	
								help_array = $("#shipment_calculator").val().split('#');
								//value_array = help_array[1].split(',');
								//cost = sum(value_array);
								cost = help_array[1];
								$("#submit_order").show();
								$("#total_div").html('<label>Total:</label>' + '$' + (cost*1 + $("#item_cost").val()*1).toFixed(2));
						}, "json");
					}		 
			});
			$("#bill-shipp").toggleClass('no_displ');
			$("#items_list").toggleClass('no_displ');
		}
		event.preventDefault();
	});
	
	$(".checkbox").click(function(event){
		var checkedStuff = $("input:checkbox:checked"); 						   	
		$.post('/customer/calculatecost/', checkedStuff.serialize(),
			function(data){
				$("#span_item_cost").html('$' + (data*1).toFixed(2));
				$("#item_cost").val(data);
				if($("#shipment_calculator").val())
				{
					help_array = $("#shipment_calculator").val().split('#');
					cost = help_array[1];
					$("#total_div").html('<label>Total:</label>' + '$' + (cost*1 + $("#item_cost").val()*1).toFixed(2));
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
});