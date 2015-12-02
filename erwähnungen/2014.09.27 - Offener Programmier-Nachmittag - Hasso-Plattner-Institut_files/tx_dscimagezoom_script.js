//jQuery( window ).resize(function (){
//	if(jQuery(window).width() < 822) {
//		jQuery('.zoomContainer').css('display','none');
//	}else{
//		jQuery('.zoomContainer').css('display','block');
//	}
//});

jQuery(document).ready(function() {
	jQuery('.tx_dsczoom .tx_dsczoom img').each(function(){
        jQuery(this).elevateZoom({
        	zoomWindowFadeIn: 500, zoomWindowFadeOut: 500, lensFadeIn: 500, lensFadeOut: 500 
    	}); 
	}); 
	//jQuery( window ).resize();
});

