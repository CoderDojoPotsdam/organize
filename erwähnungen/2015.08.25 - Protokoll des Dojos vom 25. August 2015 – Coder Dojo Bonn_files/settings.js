jQuery(document).ready(function($){
	$('.sf-menu ul').superfish();

	$('.widget-tab-nav a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	})

});