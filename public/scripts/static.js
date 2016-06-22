$(document).ready(function() {
	
	$('.faqQuest').click(function(event){
		event.preventDefault();
		$(this).siblings('.faqAnsw').slideToggle(400);
		
		var questParentSiblings = $(this).parent('.faqHolder').siblings();
		var groupParentSiblings = $(this).parents('.faqGroup').siblings();
		questParentSiblings.find('.faqAnsw').slideUp(400);
		groupParentSiblings.find('.faqAnsw').slideUp(400);
	});
	
	
});

/* =================================== FUNCTIONS =====================================*/