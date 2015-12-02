var items = 0;
var rotate;
var left = 0;
var itemClass = 'videoListItem';
var innerHeight = 0;
var interval;

function getPlayerAPI(elem) {
    var retID = parseInt(elem.parents('.yb_videoplayer:first').children(':first').attr('data-flowplayer-instance-id'));
    retID = isNaN(retID) ? 0 : retID;
    if(retID == 0)
        return flowplayer();
    else
        return flowplayer(retID);
}
function getPlayerParent(elem) {
    return elem.parents('.yb_videoplayer:first');
}



$(window).on('load', function () {
//	$('.fp-controls').hide(); 


    $('.yb_videoplayer').each( function() {
	var controls = $(this).find($('.fp-controls'));
        var timeline = $(this).find($('.fp-timeline'));
        var volume = $(this).find($('.fp-volume'));
        var play = $(this).find($('.fp-play'));
        var time = $(this).find($('.fp-time'));
        var full = $(this).find($('.fp-fullscreen'));
        $(this).find($('.fp-remaining')).remove();
        $(this).find($('.flowplayer')).after(controls);
        //  $('.fp-controls').prepend(time); 
        $(this).find($('<em>&nbsp;/</em>')).insertAfter($(this).find('.fp-elapsed'));
        $(play).insertAfter($(this).find('.fp-timeline'));
        $(time).insertAfter($(this).find('.fp-play'));
        $(volume).insertAfter($(this).find('.fp-time'));
        $(full).insertBefore($(this).find('.fp-volume'));
        $(this).find($('.fp-controls')).show();
    });
    $('.fp-mute').click(function(){
        var api = getPlayerAPI($( this ));
        getPlayerParent($( this )).find('.fp-mute').toggleClass('mute');
        //$('.fp-volumeslider').toggle();
        api.mute();
    });                                  
    $('.fp-play').click(function() {     
        var api = getPlayerAPI($( this ));
        getPlayerParent($( this )).find('.fp-play').toggleClass('pause');
        getPlayerParent($( this )).find('.fp-progress').addClass('isplay');
        api.toggle();
    });                                  
    $('.fp-fullscreen').click(function(){    
        var api = getPlayerAPI($( this ));
        api.fullscreen();
        });                                
    $('.flowplayer').click(function(){    
        getPlayerParent($( this )).find('.fp-play').toggleClass('pause');
        getPlayerParent($( this )).find('.fp-progress').addClass('isplay');
    });

	//2015-04-17 DSC-EF: Ticket #14031
	var mSlider = jQuery('.mSlider');
	if(jQuery('.mSlider').length){
		var lock = false,
		animationDuration = 1800,
		autotimerDuration = animationDuration+1200,
		playlistWindow = jQuery('#playlistWindow'),
		playlistWindowWidth = playlistWindow.width(),
		playlistItem = jQuery('.videoListItem'),
		playlistItemLength = playlistItem.length,
		playlistItemWidth = playlistItem.outerWidth(true),
		playlistVisibleCount = (playlistWindowWidth/playlistItemWidth)|0,
		playlistVisibleItems = playlistItem.clone().slice(-playlistVisibleCount).clone(),
		playlistVisibleItemsWidth = playlistVisibleCount*playlistItemWidth,
		playlistItemLength = playlistItemLength + playlistVisibleCount,
		playlistTotalWidth = playlistItemLength * playlistItemWidth,
		playlistTotalReset = playlistTotalWidth-playlistVisibleItemsWidth,
		slLeft = mSlider.children('.slLeft'),
		slRight = mSlider.children('.slRight');
		playlistItem.css({'position':'static'});
		jQuery(playlistItem[0]).before(playlistVisibleItems);
		playlistVisibleItems.css({'position':'static'});
		playlistWindow.wrapInner('<div id="playlistWindowInner"></div>');
		var playlistWindowInner = jQuery('#playlistWindowInner');
		playlistWindowInner.css({'width':playlistTotalWidth+'px','position':'absolute','left':'-'+playlistVisibleItemsWidth+'px','top':0});		
		slLeft.on('click',function(e){
			clearInterval(autotimer);
			e.stopPropagation();
			moveSlider('+');
		});
		slRight.on('click',function(e){
			clearInterval(autotimer);
			e.stopPropagation();
			moveSlider('-');
		});
		function moveSlider(direction){
			if(!lock){
				if(parseInt(playlistWindowInner.css('left'))<=-playlistTotalReset){
					playlistWindowInner.css({'left':direction+0+'px'});
				}		
				playlistWindowInner.animate(
					{left: direction+'='+playlistItemWidth},
					animationDuration,
					'easeInOutCirc',
					function(){lock=false;}
				);			
			}
			lock=true;			
		}
		autotimer = window.setInterval(function(){moveSlider('-');},autotimerDuration); 
	}
	return;
	//	
	if($('.mSlider').size()>0){
		$('.mSlider').find('.inner').each(function(){
			innerHeight = 0;
			interval = window.setInterval(function(){$(this).next().click();},3000);     
			items = $(this).find('.'+itemClass);
			left = 0;
			$(this).parent().find("span[data-dir]").mousedown(function(){
				clearInterval(interval);
			});
			rotate = $(this).outerWidth(true)<=($(this).find('.'+itemClass+'').outerWidth()*(items.length-1));
			if(rotate){
				$(this).parent().addClass('rotate');
			}
			$(this).parent().find("span[data-dir='-']").unbind('click');
			$(this).parent().find("span[data-dir='+']").unbind('click');
			items.each(function(){
				if(parseInt($(this).outerHeight(true))>innerHeight)
					innerHeight = parseInt($(this).outerHeight(true));
				$(this).css('left',left+'px');
				left += $(this).outerWidth();
				checkBtns($(this));
			});
			$(this).parent().find("span[data-dir='-']").css('margin-top',parseInt(innerHeight/2-25));
//			innerHeight += $(this).parent().find('h2').outerHeight(true);
			$(this).parent().find("span[data-dir='+']").css('margin-top',parseInt(innerHeight/2-25));//+$(this).parent().find('h2').outerHeight(true)
			$(this).css('height',innerHeight+'px');
		});
	}
 });




// The controlbar plugin is loaded by specifying it in the plugins section of
// the configuration.
 
plugins: {
    {controls: null;}
}



//$(document).ready(function(){
//	alert('ready');
//	if($('.yb_videolist').size()>0){
//		interval = window.setInterval(function(){$(".yb_videolist .inner").next().click();},3000);     
//		items = $('.yb_videolist .'+itemClass+'');
//		left = 0;
//		$("span[data-dir]").mousedown(function(){
//			clearInterval(interval);
//		});
//
//		rotate = $('.yb_videolist .inner').outerWidth(true)<=($('.'+itemClass+'').outerWidth()*(items.length-1));
//
//		$("span[data-dir='-']").unbind('click');
//		$("span[data-dir='+']").unbind('click');
//		items.each(function(){
//			$(this).css('left',left+'px');
//			left += $(this).outerWidth();
//			checkBtns();
//		});
//	}
//});

function checkBtns(elem){
	if(!$(elem).parent().parent().hasClass('rotate')){
        jQuery(elem).parent().parent().find("span[data-dir='-']").addClass('inActive');
        jQuery(elem).parent().parent().find("span[data-dir='-']").unbind('click');
    }else{
        jQuery(elem).parent().parent().find("span[data-dir='-']").removeClass('inActive');
		jQuery(elem).parent().parent().find("span[data-dir='-']").bind('click',{
            dir: '-',
			elem: elem
        },customClickEvent);
    }
    if(!$(elem).parent().parent().hasClass('rotate')){
        jQuery(elem).parent().parent().find("span[data-dir='+']").addClass('inActive');
        jQuery(elem).parent().parent().find("span[data-dir='+']").unbind('click');
    }else{
        jQuery(elem).parent().parent().find("span[data-dir='+']").removeClass('inActive');
        jQuery(elem).parent().parent().find("span[data-dir='+']").bind('click',{
            dir: '+',
			elem: elem
        },customClickEvent);
    }
}
function customClickEvent(event){
    $(event.data.elem).parent().parent().find("span[data-dir='+']").unbind('click');
    $(event.data.elem).parent().parent().find("span[data-dir='+']").addClass('inActive');
    $(event.data.elem).parent().parent().find("span[data-dir='-']").unbind('click');
    $(event.data.elem).parent().parent().find("span[data-dir='-']").addClass('inActive');
    event.stopPropagation();
    event.preventDefault();
	if($(event.data.elem).parent().parent().hasClass('rotate')){
		var itemse = jQuery(event.data.elem).parent().find('.'+jQuery(event.data.elem).attr('class')).filter(function(index) {
			if(parseInt(jQuery(this).css('left'))<0){
				return true;
			}
		});
        if(event.data.dir==='-' && itemse.first().length > 0){
            itemse.first().css('left',jQuery(event.data.elem).outerWidth(true)*(jQuery(event.data.elem).parent().find(('.'+itemClass+'')).length-1)+'px').appendTo(jQuery(event.data.elem).parent());
        }
		itemse = jQuery(event.data.elem).parent().find('.'+jQuery(event.data.elem).attr('class')).filter(function(index) {
			if(parseInt(jQuery(this).css('left'))>=jQuery(event.data.elem).parent().outerWidth(true)){
				return true;
			}
		});
        if(event.data.dir==='+' && itemse.length > 0){
			console.log(itemse.first());
            itemse.last().css('left','-'+jQuery(event.data.elem).outerWidth(true)+'px').prependTo(jQuery(event.data.elem).parent());
        }
    }
	jQuery(event.data.elem).parent().find('.'+jQuery(event.data.elem).attr('class')).animate({
        left: event.data.dir+"="+jQuery(event.data.elem).outerWidth()
    }, {
        duration: 1800,
        easing: 'easeInOutCirc',
        queue: false,
        complete: function(){
            if (!jQuery(event.data.elem).is(':animated')){
                checkBtns(jQuery(event.data.elem));
            }
        }
    });
}
