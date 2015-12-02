function getCookie(id)
{
    value = null;
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++){
        name = cookies[i].substring(0,cookies[i].search(/=/));
        name = trim(name);
        if(name == id){
            value = cookies[i].substr(cookies[i].search(/=/) + 1, cookies[i].length);
        }
    }
    return value;
}

function setCookie(name, value, minutes)
{
    minutes = (minutes == undefined) ? 30 : minutes;
    now = new Date();
    expire = new Date(now.getTime() + (minutes * 1000 * 60));
    document.cookie = name + '=' + value +  '; expires=' + expire.toGMTString() + '; path=/';
}

function trim (zeichenkette)
{
   return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}

//preloading pictures for womensday
function preloader(){
	var i_1	= new Image();
	i_1.src	= "/extension/silver.project.kompi/design/silver.project/images/8maerz2015.png";
}

//start preloading now!!!
//preloader();

function womensday(force)
{
	if(typeof(force) == "undefined"){
		force = false;
	}
	if(null === getCookie('womensday') || force == true){
   		$body	= jQuery('body');
		$window	= jQuery(window);
		
		
		$layer	= jQuery('<div id="wd_container"><div id="wd_layer"><img src="/extension/silver.project.kompi/design/silver.project/images/8maerz2015.png" /></div></div>');
		$layer.bind('click.wd', function(){
			$layer.fadeOut(700, 'swing', function(){
				$window.unbind('.wd');
				jQuery("body").removeClass('no-overflow');		
				$layer.remove();
			});
		});
		$layer.height(jQuery(document).height()).width(jQuery(document).width());
		$body.append($layer);

		currentscrollposwd = jQuery(window).scrollTop()
		jQuery("#wd_container").css('top',currentscrollposwd);
		jQuery("body").addClass('no-overflow');		

		$window.bind('resize.wd', function(){
			$layer.height(jQuery(document).height()).width(jQuery(document).width());
		});
		$window.bind('scroll.wd', function(){
			$layer.height(jQuery(document).height()).width(jQuery(document).width());
		});
		if(force){
			$layer.fadeIn(500, 'swing');
			force	= false;
		}else{
			$layer.css('display', 'block');
		}
	setCookie('womensday', 'setted', 120);
	
		if (force) {
			$window.css('scrollTop',0);
		}
	}
}

var currentscrollposwd;

jQuery(function($){
	$('#showWomensDay').click(function(){
		currentscrollposwd = jQuery(window).scrollTop()
		womensday(true);
		return false;
	});

	// every 8th of March start the layer 
	var today = new Date(); 
	if( today.getDate()==8 && today.getMonth()==2 ) {
		womensday();
	}

});

