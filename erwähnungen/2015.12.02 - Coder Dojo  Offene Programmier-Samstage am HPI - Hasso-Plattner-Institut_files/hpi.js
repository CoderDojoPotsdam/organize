window.onresize = resizepage;
var submenuAim = false;
!function(a) {

	a(function() {

		if(navigator.userAgent.match(/IEMobile\/10\.0/)) {

			var b = document.createElement("style");

			b.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}")), document.querySelector("head").appendChild(b)

		}

		{

			var c = a(window), d = a(document.body);

			a(".navbar").outerHeight(!0) + 10

		}

	})

}(jQuery);
var isSafari = /constructor/i.test(window.HTMLElement);


function resizepage() {
	if(!$('body').hasClass('subpage')) {
		if($(window).width() < 822) {
			if($('.headbottom #social').length == 0) {
				if($('#bottom_stuff').length > 0)
					$('#site_nav').after('<div id="bottom_stuff">' + $('#bottom_stuff').html() + '</div>');
				else if($('#social').length > 0)
					$('#site_nav').after('<div id="social">' + $('#social').html() + '</div>');
			}

		} else {
			$('.headbottom #social').remove();
			$('.headbottom #bottom_stuff').remove();
		}
	} else {
		if($(window).width() < 500) {
			if($('.headbottom #social').length == 0) {
				if($('#bottom_stuff').length > 0)
					$('#site_nav').after('<div id="bottom_stuff">' + $('#bottom_stuff').html() + '</div>');
				else if($('#social').length > 0)
					$('#site_nav').after('<div id="social">' + $('#social').html() + '</div>');
			}

		} else {
			$('.headbottom #social').remove();
			$('.headbottom #bottom_stuff').remove();
		}
	}
	jQuery('#site_nav li ul').remove();
	updateHeader();
}

//initiating jQuery
jQuery(function($) {
	setPbEvents();
	resizepage();
	setGestureEvents();	
	sixpackStyling();
	$('.carousel').carousel({
		pause: true,
		interval: false
	});

	$('.collapse').collapse({
		toggle: false, parent: false
	});

	$('.collapse').on('show.bs.collapse', function() {
		$(this).parent().addClass('opened');
		$('#site_nav li ul').remove();
		$('#site_nav li ul li ul').remove();
	});
	$('.collapse').on('hide.bs.collapse', function() {
		$(this).parent().removeClass('opened');
	});

//	$('.site_nav').on('mouseover', 'a', function(event) {
//		if($(window).width() > 840) {
//			var cl = $(this).attr('class');
//			if(cl !== '') {
//				$('.site_nav .open').removeClass('open');
//				$('.submenu').hide();
//				if($('.submenu.' + cl).length > 0) {
//					$(this).parent().addClass('open');
//					$('.submenu.' + cl).show();
//					jQuery('.submenuli li a').removeClass('open');
//				}
//				var pos = $(this).position();
//				var top = (pos.top + $(this).height());
//				$('.site_nav').data('open', 1);
//			}
//		}
//	});

	$('.site_nav').on('touchstart', 'a', function(event) {
		if($(window).width() > 822) {
			if(!$(this).parent().hasClass('open')) {
				var cl = $(this).attr('class');
				if(cl !== '') {
					$('.site_nav .open').removeClass('open');
					$('.submenu').hide();
					if($('.submenu.' + cl).length > 0) {
						$(this).parent().addClass('open');
						$('.submenu.' + cl).show();
					}
					var pos = $(this).position();
					var top = (pos.top + $(this).height());
					$('.site_nav').data('open', 1);
				}
				return false;
			}
			else
				$(this).click();
		}
	});
	$('.submenu').on('touchstart', 'a', function(event) {
		if($(window).width() > 822) {
			if(!$(this).hasClass('open')) {

				$('.submenu .open, .subsubmenu .open').removeClass('open');
				if($(this).closest('.subsubmenu').size() > 0) {
					$(this).closest('ul').addClass('open');
				}
				$(this).addClass('open');
				$('.subsubmenu div[data-uid="' + $(this).parent().attr('data-uid') + '"] ul').addClass('open');
				return false;
			}
			else
				$(this).click();
		}
	});
	/*

	$('.headtop').on('mouseenter', function() {
		$('.submenu').hide();
		$('.subsubmenu .open').removeClass('open');
		$('.site_nav .open').removeClass('open');
	});
	$('.hideSubmenuMouseOver').on('mouseenter', function() {
		$('.submenu').hide();
		$('.subsubmenu .open').removeClass('open');
		$('.site_nav .open').removeClass('open');
	});

	$('.search').on('mouseenter', function() {
		$('.submenu').hide();
		$('.subsubmenu .open').removeClass('open');
		$('.site_nav .open').removeClass('open');
	});
	$('.submenu .clearfix').on('mouseleave', function() {
		if(!$('.submenu .closeX:hover').length){
			$('.submenu').hide();
			$('.subsubmenu .open').removeClass('open');
			$('.site_nav .open').removeClass('open');
		}
	});
	$('.submenu .closeX').on('mouseleave', function() {
		if(!$('.submenu .clearfix:hover').length){
			$('.submenu').hide();
			$('.subsubmenu .open').removeClass('open');
			$('.site_nav .open').removeClass('open');
		}
	});
	*/
	$('body').on('mouseover', function() {
		if(!$('#site_nav a:hover').length && 
		!$('.submenu .clearfix:hover').length && 
		!$('.submenu .closeX:hover').length &&
		!$('#site_nav:hover').length){
			$('.submenu').hide();
			$('.subsubmenu .open').removeClass('open');
			$('.site_nav .open').removeClass('open');
		}
	});
//	$('.site_nav').on('mouseleave', 'a', function(event) {
//		var cl = $(this).attr('class');
//		if($('.submenu.' + cl).length > 0) {
//			if($('.submenu.' + cl + ':hover').length == 0) {
//				$('.submenu').hide();
//				$('.subsubmenu .open').removeClass('open');
//				$('.site_nav .open').removeClass('open');
//			}
//		}
//	});
	$('.headtop').on('mouseover', function(event) {
		var clicked = $(event.target);
		if(!clicked.hasClass("dropdown-menu") && !clicked.parents().hasClass("dropdown-menu") && !clicked.hasClass("dropdown-toggle"))
			$('body').click();
	});
	$('.headtop div').on('mouseover', function(event) {
		event.preventDefault();
	});
	$('.submenu').on('mouseleave', function(event) {
		$('.submenu').hide();
		$('.subsubmenu .open').removeClass('open');
		$('.site_nav .open').removeClass('open');
	});

	$('.site_nav').on('click', 'a', function(event) {
		var cl;
		if($(window).width() <= 822) {
			cl = $(this).attr('class');
			if($('.submenu.' + cl + ' div:eq(2)').html()){
				if($(this).next('ul').length === 0) {
					$('#site_nav li ul').remove();
					$(this).after($('.submenu.' + cl + ' div:eq(2)').html());
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
//				else
//					$(this).next('ul').remove();
			} else {
				if($(this).next('ul').length === 0) {
					cl = $(this).parent().parent().parent().children('a').attr('class');
					if(cl !== undefined) {
						if($(this).next('ul').length === 0) {
							var submenu = $('.submenu.' + cl + ' div[data-uid=' + $(this).parent('li').attr('data-uid') + '] ul');
							if(submenu.length > 0 && !submenu.is(':visible')) {
								$('#site_nav li ul li ul').remove();
								$(this).after('<ul>' + submenu.html() + '</ul>');
								event.preventDefault();
								event.stopPropagation();
								return false;
							}
						}
					}
				}
//				else
//					$(this).next('ul').remove();
			}

		}
	});

	$('.site_nav').on('touchstart', 'a', function(event) {
		$('body').bind('click', function(e) {
			var clicked = $(e.target);
			if(!clicked.hasClass("submenu") && !clicked.parents().hasClass("submenu") && !clicked.parents().hasClass("site_nav")) {
				$('.submenu').hide();
				$('.subsubmenu .open').removeClass('open');
				$('.site_nav .open').removeClass('open');
				$('body').unbind('click');
			}
		});
//		cl = $(this).attr('class');
//		if(cl !== '') {
//			$('.site_nav .open').removeClass('open');
//			$('.submenu').hide();
//			if($('.submenu.' + cl).length > 0) {
//				$(this).parent().addClass('open');
//				$('.submenu.' + cl).show();
//			}
//			var pos = $(this).position();
//			var top = (pos.top + $(this).height());
//			$('.site_nav').data('open', 1);
//
//		}
//		event.preventDefault();
//		event.stopPropagation();
//		return false;
	});

	if($(window).width() > 822) {

		var activateSubSubmenu = function(aim) {
			/*
			 var cl = $(aim).parents('div.submenu').attr('class').substr(8);
			 var selector = '.submenu.' + cl + ' .subsubmenu div[data-uid=' + $(aim).parent('li').attr('data-uid') + '] ul';
			 $('.submenu.' + cl + ' .open').removeClass('open');
			 $(aim).children('a').addClass('open');
			 if($(selector).length > 0) {
			 $(selector).addClass('open');
			 }
			 $('#site_nav').data('open', 2);
			 jQuery('.submenuli li a').removeClass('open');
			 $(aim).addClass('open');
			 */
			aim = jQuery(aim);
			var dId = aim.attr('data-uid');
			aim.closest('.submenu').find('.open').removeClass('open');
			aim.addClass('open');
			var subSub = aim.closest('.submenu').find('.subsubmenu div[data-uid=' + dId + '] ul');
			subSub.closest('ul').addClass('open');
			aim.find('a').addClass('open');
		};
		
		var deactivateSubSubmenu = function(aim) {
			aim = jQuery(aim);
			var dId = aim.attr('data-uid');
			aim.closest('.submenu').find('.open').removeClass('open');
			aim.removeClass('open');
			var subSub = aim.closest('.submenu').find('.subsubmenu div[data-uid=' + dId + '] ul');
			subSub.closest('ul').removeClass('open');
			aim.find('a').removeClass('open');
		};
		
		var activateSubmenu = function(aim) {
			aim = jQuery(aim);
			var siteNav = aim.closest('.site_nav');
			$('.site_nav .open').removeClass('open');
			$('.submenu').hide();
			
			
			for (var i = 0; i < $('.site_nav li a').length; i++){
				if($('.site_nav li a')[i] === aim.find('a').get(0)){
					if($($('.submenu')[i]).find('.submenuli').size()>0){
						$($('.submenu')[i]).parent().addClass('open');
						$(this).parent().addClass('open');
						$($('.submenu')[i]).show();
					}
				}
			}
			/*
			if($('.submenu.' + aim.find('a').attr('class')).length > 0) {
				if($('.submenu.' + aim.find('a').attr('class')).find('.submenuli').size()>0){
					$('.submenu.' + aim.find('a').attr('class')).parent().addClass('open');
					$(this).parent().addClass('open');
					$('.submenu.' + aim.find('a').attr('class')).show();
					jQuery('.submenuli li a').removeClass('open');
				}
			}
			*/
			var pos = siteNav.position();
			var top = (pos.top + siteNav.height());
			$('.site_nav').data('open', 1);
		};
		
		var deactivateSubmenu = function(aim) {
			aim = jQuery(aim);
			if($('.submenu.' + aim.find('a').attr('class')).length > 0) {				
					$('.submenu.' + aim.find('a').attr('class')).parent().removeClass('open');
					$('.submenu.' + aim.find('a').attr('class')).hide();				
			}
		};

		$('.submenuli ul').each(function(index, item) {
			item = jQuery(item);
			item.menuAim({
				activate: activateSubSubmenu, // fired on row activation
				deactivate: deactivateSubSubmenu
				//deactivate: function(aim) {
				//	submenuAim = false;
				//	console.info('aim false');
				//}, // fired on row deactivation
				//rowSelector: '.submenuli li a',
				//tolerance: 99,
				//submenuSelector: ".subsubmenu *",
			});
		});
		
		$('#site_nav').menuAim({
			activate: activateSubmenu, // fired on row activation
			deactivate: deactivateSubmenu,
			submenuDirection: 'below'
		});

//		 $('.submenuli').on('mouseover', 'li a', function(event) {
//		 //if(submenuAim){
//		 console.info(submenuAim,this);
//		 //if(jQuery(submenuAim).index()==$(this).index()){
//		 var cl = $(this).parents('div.submenu').attr('class').substr(8);
//		 //var i = ($(this).parent().index() - 1);
//		 //			if(i >= 0) {
//		 
//		 var selector = '.submenu.' + cl + ' .subsubmenu div[data-uid=' + $(this).parent('li').attr('data-uid') + '] ul';
//		 $('.submenu.' + cl + ' .open').removeClass('open');
//		 $(this).children('a').addClass('open');
//		 if($(selector).length > 0) {
//		 $(selector).addClass('open');
//		 }
//		 $('#site_nav').data('open', 2);
//		 //			} else
//		 //				$('.submenu.' + cl + ' .open').removeClass('open');
//		 jQuery('.submenuli li a').removeClass('open');
//		 $(this).addClass('open');
//		 event.stopPropagation();
//		 //}
//		 //}
//		 });
	}

	$('.closeX').click(function(event) {
		$(this).parent().css('display', 'none');
		event.stopPropagation();
		return false;
	});
	$('#filter').click(function(event) {
		if($(this).hasClass('open')) {
			$(this).removeClass('open');
			$('.filters').css('display', 'none');
		} else {
			$(this).addClass('open');
			$('.filters').css('display', 'block');
		}
	});

	$('.nav-tabs li:last-child').click(function(event) {
		var pos = $(this).parent().find('.active').index();
		var max = $(this).parent().find('li').length;
		if((pos + 2) == max)
			$(this).parent().find('li:eq(1)').children('a').click();
		else
			$(this).parent().find('li:eq(' + (pos + 1) + ')').children('a').click();
	});

	$('.nav-tabs li:first-child').click(function(event) {
		var pos = $(this).parent().find('.active').index();
		var max = $(this).parent().find('li').length;
		if(pos == 1)
			$(this).parent().find('li:eq(' + (max - 2) + ')').children('a').click();
		else
			$(this).parent().find('li:eq(' + (pos - 1) + ')').children('a').click();
	});

	var colorbox_settings = {
		current: "Bild {current} von {total}",
		previous: "Zurück",
		next: "Vor",
		close: "Schließen",
		xhrError: "Dieser Inhalt konnte nicht geladen werden.",
		imgError: "Dieses Bild konnte nicht geladen werden.",
		slideshowStart: "Slideshow starten",
		slideshowStop: "Slideshow anhalten",
		maxWidth: '95%',
		maxHeight: '95%',
		title: function() {
			var title = $(this).children('img').attr('data-caption');
			if(title == undefined)
				title = '';
			else
				title = '<p>' + title + '</p>';
			return title;
		}
	}
	jQuery('.csc-textpic').each(function(index, item) {
		item = jQuery(item);
		if(item.find('.pics3view').size() > 0) {
			item.find('.pics3view').each(function(index2,item2){
				item2 = jQuery(item2);
				if(!item2.find('a').hasClass('lightbox')){
					item2.addClass('isLink');
				} else {
					item2.removeClass('isLink');
				}
				if(!item2.hasClass('isLink')){
					item2.find('a').colorbox(colorbox_settings);
				}
			});
			
		}

	});
	/*	jQuery.extend(jQuery.colorbox.settings, {
	 current: "Bild {current} von {total}",
	 previous: "Zurück",
	 next: "Vor",
	 close: "Schließen",
	 xhrError: "Dieser Inhalt konnte nicht geladen werden.",
	 imgError: "Dieses Bild konnte nicht geladen werden.",
	 slideshowStart: "Slideshow starten",
	 slideshowStop: "Slideshow anhalten"
	 });*/

	// Resize Colorbox when resizing window or changing mobile device orientation
	$(window).resize(function() {
		resizeColorBox(colorbox_settings);
	});
	//window.addEventListener('orientationchange', resizeColorBox, false);
		

});
$(window).scroll(function() {
	updateHeader();
});


/* Sixpack styling */
function sixpackStyling(){
	
	jQuery.each(jQuery('.tx-sixpack-pi1 table tbody td.tx_sixpack_pi1-pagenavi'), function(){
		td = jQuery(this);
		if(td.html() == ""){
			td.remove();
		}else{
			td.attr('colspan','2')
		}		
	});
	
	jQuery.each(jQuery('.tx-sixpack-pi1 table tbody tr'), function(){
		tr = jQuery(this);
		td = tr.find('td');
		td1 = jQuery(td[0]);
		td2 = jQuery(td[1]);
		if(td1.html() == "&nbsp;"){
			td1.remove();
			td2.attr('colspan','2');
		}	
	});
}

/* Colorbox resize function */
function resizeColorBox(colorbox_settings) {
	$.colorbox.resize({
		width: window.innerWidth > parseInt(colorbox_settings.maxWidth) ? colorbox_settings.maxWidth : colorbox_settings.width,
		height: window.innerHeight > parseInt(colorbox_settings.maxHeight) ? colorbox_settings.maxHeight : colorbox_settings.height
	});
//	if(resizeTimer)
//		clearTimeout(resizeTimer);
//	resizeTimer = setTimeout(function() {
//		if(jQuery('#cboxOverlay').is(':visible')) {
//			jQuery.colorbox.resize({width:'90%', height:'90%'});
//		}
//	}, 300)
}

/**
 * 
 * @returns {undefined}
 */
function updateHeader() {
	var $element = $.colorbox.element();
	var i = 1;
	//console.info('scrolling:'+$(this).scrollTop());
	$('#content .csc-textpic.csc-textpic-center.csc-textpic-above').each(function() {
		var parent = $(this).parents('.col-md-8');
		var padding = parseInt($(parent).css('padding-left')) + parseInt($(parent).css('padding-right')) + parseInt($(parent).css('margin-right'));
		width = $('.pics3view:eq(0)', this).innerWidth();
		var anz = parseInt(($('#content').innerWidth() - padding) / width);
		if($(this).parents('.imageGallery').length) {
			var length = $('.pics3view', this).length;
		} else {
			var length = $('.pics3view:not(.gt4)', this).length;
		}
		if(length < anz) {
			anz = length;
		}
		console.info(anz + ' // ' + padding);
		$(parent).addClass('ttt');
		//$(this).innerWidth(width * anz).css('margin-left', ($('#content').innerWidth() - padding - (width * anz - parseInt($('.pics3view:eq(0)', this).css('margin-right')))) / 2);
	});
	if($(window).width() > 822) {
		//console.log($(window).width());
		//console.log($(this).scrollTop());
		if(($('body').hasClass('subpage') && $(this).scrollTop() > 100)) {
			//console.info('A');
			$('.smallheader').show();
			$('.bigheader').hide();
			$('.headbg').css('position', 'fixed').css('marginTop', -318);
			$('.submenu').css('position', 'fixed').css('marginTop', '-120px');
			$('body').css('marginTop', 217);
		} else if(!$('body').hasClass('subpage') && $(this).scrollTop() > 100) {
			//console.info('B');
			$('.smallheader').show();
			$('.bigheader').hide();
			$('.headbg').css('position', 'fixed').css('marginTop', -307);
			$('.submenu').css('position', 'fixed').css('marginTop', '-100px');
			$('body').css('marginTop', 207);
		} else {
			//console.info('C');
			$('.smallheader').hide();
			$('.bigheader').show();
			$('.headbg').css('position', 'relative').css('marginTop', 0);
			$('body').css('marginTop', 0);
			$('body.subpage').css('marginTop', 61);
			$('.submenu').css('position', 'absolute').css('marginTop', '0');
			if(isSafari) {

				$('.headbg').hide();
				$('.headbg').get(0).offsetHeight; // no need to store this anywhere, the reference is enough
				$('.headbg').show();

			}
		}
	}
	else {
		//console.info('D');
		$('.smallheader').show();
		$('.bigheader').hide();
		$('.headbg').css('position', 'fixed').css('marginTop', 0);
		$('.submenu').css('position', 'fixed').css('marginTop', 0);
		$('body').css('marginTop', '98px');

	}

}

function setPbEvents() {
	jQuery('.teaser.newsarchiv').each(function(index, item) {
		var parentOverview = jQuery(item);

		parentOverview.find('.tx_dscoverview_pbLink.page, .tx_dscoverview_pbLink.prev, .tx_dscoverview_pbLink.next').each(function(index2, item2) {
			jQuery(item2).unbind('click');
			jQuery(item2).click(function() {
				if(jQuery(this).hasClass('active')) {
					jQuery('.tx_dscoverview_pbLink.page').removeClass('current');
					var limitItemsOffset = jQuery(this).attr('data-value');
					jQuery(this).addClass('current');
					parentOverview.find('.tx_dscoverview_limitItemsOffset').val(limitItemsOffset);
					parentOverview.find('.tx_dscoverview_pbForm').submit();
				}
			});
		});

		parentOverview.find('.tx_dscoverview_pbLink.amount').each(function(index2, item2) {
			jQuery(item2).unbind('click');
			jQuery(item2).click(function() {
				jQuery('.tx_dscoverview_pbLink.amount').removeClass('current');
				jQuery(this).addClass('current');
				parentOverview.find('.tx_dscoverview_limitItemsLength').val(jQuery(this).attr('data-value'));
				parentOverview.find('.tx_dscoverview_pbForm').submit();
			});
		});
	});
}

function setGestureEvents() {
	jQuery('.tab-content .tab-pane').each(function(index, item) {
		item = jQuery(item);
		item.on('tap', function(e) {
			//e.preventDefault();
		});
		item.on('swipeleft', function() {
			item.closest('.col-md-4').find('.nav-tabs li:last').click();
		});
		item.on('swiperight', function() {
			item.closest('.col-md-4').find('.nav-tabs li:first').click();
		});

	});

	jQuery(document).on('swipeleft', '#cboxLoadedContent img', function() {
		jQuery('#cboxNext').click();
	})
	jQuery(document).on('swiperight', '#cboxLoadedContent img', function() {
		jQuery('#cboxPrevious').click();
	})
}

/**
 * 
 * @param {type} el
 * @returns {undefined}
 */
function openFirstGalleryImage(el) {
	console.info('NOW');
	el.closest('.imageGalleryPreview').find('.pics3view:first a').click();
}
