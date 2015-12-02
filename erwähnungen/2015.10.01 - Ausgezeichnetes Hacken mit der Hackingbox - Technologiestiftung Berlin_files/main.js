jQuery.noConflict();
jQuery(document).ready(function($){

	/**************************************************
	 * Inhaltsverzeichnis
	 **************************************************
	 * TouchSwipe Events
	 * Thesaurus
	 * Silbentrennung
	 * Mobile Navigation
	 * dynamische Schriftgröße
	 * Scroll-To-Top, Logo tauschen
	 * Lightbox Aufrufe
	 * Klick-Vergrößern
	 * Text-Bild-Pfeile
	 * csc-linkwrap Buttons
	 * Top-Themen
	 * Startseite dynamischer Header
	 * Startseite Highlight Teaser
	 * Startseite Buttons
	 * Startseite Hover Boxen
	 * Hauptmenue
	 * Zweispalter Höhenberechnung
	 * Ansprechpartner
	 * Social Media Buttons
	 * News/Event Liste
	 * Media Liste
	 * News/Event Details
	 * News/Event Galerie
	 * Glossar Unterteilung, großer Anfangsbuchstabe
	 * Rightcol Affix
	 * KE_SEARCH
	 **************************************************/

	/**************************************************
	 * TouchSwipe Events
	 **************************************************/
	function isBreakpoint( alias ) {
		return $('.device-' + alias).is(':visible');
	}
	if( isBreakpoint('xs') || isBreakpoint('sm') ) {
		// bootstrap carousel
		$('body').swipe({
			//Generic swipe handler for all directions
			swipeLeft: function (event, direction, distance, duration, fingerCount) {
				if($('.mfp-content .carousel').length == 0) {
					$.sidr('open', 'sidr-navbar');
				} else {
					$('.mfp-content .carousel').carousel('next');
				}
			},
			swipeRight: function (event, direction, distance, duration, fingerCount) {
				if($('.mfp-content .carousel').length == 0) {
					$.sidr('close', 'sidr-navbar');
				} else {
					$('.mfp-content .carousel').carousel('prev');
				}
			},
			//Default is 75px, set to 0 for demo so any distance triggers swipe
			threshold: 75
		});
	}

	/**************************************************
	 * Thesaurus
	 **************************************************/
	var toGlossary = ($('html').attr('lang') == 'de')? 'Zum Glossar' : 'Go to Glossary';
	var url = "typo3conf/sites/tsb/data/glossar.json";
	$.get(url, function(data){

		var initialNodes = $('body.content').not('.p19').find('#content p').not('.mediaDesc');
		markWords(initialNodes, data);
		setTooltips(initialNodes);

		$('.glossar-word').each(function(){
			var link = '<a href="'+$(this).attr('data-link')+'"><span class="tsbbutton size20 colorWhite"><span class="tsbicon i-pfeil"></span></span><span class="link-label">'+toGlossary+'</span></a>';
			$(this).hover(function(){
				var widthTooltip = 300;
				var vpWidth = $( window ).width();
				var bbox = this.getBoundingClientRect();
				var horizontal = (vpWidth - bbox.left < widthTooltip && bbox.left > widthTooltip)? 'glossar-tooltip-right' : 'glossar-tooltip-left';
				var arrowStyle = '';
				var centerPosition = '';
				if(vpWidth - bbox.left < widthTooltip && bbox.left < widthTooltip){
					horizontal = 'glossar-tooltip-center';
					arrowStyle =  'left: '+parseInt(bbox.left)+'px; right: auto;';
					centerPosition = 'left: -'+bbox.left+'px';
				}
				var vertical = (bbox.top < 300)? 'glossar-tooltip-top' : 'glossar-tooltip-bottom';
				var arrowClass = (bbox.top < 300)? 'arrow-top' : 'arrow-bottom';

				$(this).append('<div class="glossar-tooltip ' + horizontal + ' ' + vertical + '" style="'+centerPosition+'">'
					+'<div class="glossar-text">'
						+$(this).attr('data-description')
						+'<div class="glossar-link">'
							+link
						+'</div>'
					+'</div>'
					+'<div class="'+arrowClass+'" style="'+arrowStyle+'"></div>'
				+'</div>');
				$('.glossar-tooltip').fadeIn(300);
			},
			function(){
				$('.glossar-tooltip').fadeOut(300, function(){
					$('.glossar-tooltip').remove();
				});
			})
		})
	}, 'json');
	$(document).click(function(e){
		if(!$(e.target).hasClass('glossar-word')) {
			$('.glossar-tooltip').fadeOut(300, function () {
				$('.glossar-tooltip').remove();
			});
		}
	});

	function markWords(nodes, data){
		filteredNodes = nodes.contents().filter(function() {
			// if element node (type 1)
			if(this.nodeType === 1){
				markWords($(this));
			}
			// if text node (type 3) keep it
			return this.nodeType === 3 && $.trim($(this).text()).length;
		});
		filteredNodes.each(function(){
			var node = this;
			if(data){
				$.each(data, function(){
					var text = $(node).text();
					var rx = new RegExp('##GLOSSARTOOLTIP#(.*?)'+this.title+'(.*?)#GLOSSARTOOLTIP##');
					if(!text.match(rx))
					{
						text = text.replace(this.title, '##GLOSSARTOOLTIP#'+ this.title +'#'+ this.description +'#'+ this.wordLink +'#GLOSSARTOOLTIP##');
					}
					node.nodeValue = text;

				});
			}
		});
	}

	function setTooltips(nodes) {
		nodes.find('script').detach();
		nodes.html(function(inx, html){
			var re = new RegExp('##GLOSSARTOOLTIP#' + "(.*?)" + '#' + "(.*?)" + '#' + "(.*?)" + '#GLOSSARTOOLTIP##', 'gm');



			return html.replace(re, '<dfn class="glossar-word" data-description="$2" data-link="$3">$1</dfn>');
		});
	}

	/**************************************************
	 * Silbentrennung
	 **************************************************/
	Hyphenator.config({
		displaytogglebox: true,
		minwordlength: 8,
		classname: 'homecontent',
		remoteloading: false,
		displaytogglebox: false,
		onerrorhandler: function (e) {/*do nothing*/}
	});
	Hyphenator.run();

	/**************************************************
	 * Mobile Navigation
	 **************************************************/
	$('#navbar').click(function(e) {
		e.preventDefault();
	});
	$('#navbar').sidr({
		name: 'sidr-navbar',
		source: '.sidr-sitemap',
		side: 'right',
		renaming: 'true',
		onOpen: function(){
			$('.carousel').carousel('pause');
		},
		onClose: function(){
			$('.carousel').carousel('cycle');
		}
	});
	$('.sidr-class-i-close').click(function(){
		$.sidr('close','sidr-navbar');
	});

	// init accordion
	sidebarElements = $('#sidr-navbar').find('ul.sidr-class-navSitemap > li');
	sidebarElements.each(function(){
		var subNav = $(this).find('ul');
		if(subNav.length != 0){
			subNav.slideUp(0).addClass('sidebarSubNav');
			$(this).find('> a').click(function(e){
				e.preventDefault();
				if(subNav.hasClass('open')){
					// close selected
					subNav.slideUp().removeClass('open');
				} else {
					// close all others and open selected
					$('.sidebarSubNav').slideUp().removeClass('open');
					subNav.slideDown().addClass('open');
				}
			})
		}
	});


	/**************************************************
	 * dynamische Schriftgröße
	 **************************************************/
	var affixBase = 4.25;
	function setFontSize(){
		if(!$('body').hasClass('lightbox')) {
			var width = $("body").width();
			var fontsize = width * 100 / 1596;
			var fontsize2 = width * 100 / 970;
			if (width >= 1596) {
				$("body").css("font-size","100%");
			} else if (width >= 970 && width < 1596) {
				$("body").css("font-size",fontsize+"%");
			} else if (width >=750 && width < 970) {
				$("body").css("font-size",fontsize2+"%");
				affixBase = 5.5;
			} else if (width < 750) {
				$("body").css("font-size","14px");
				$('.affixContainer').trigger('detach.ScrollToFixed');
			}
		}
	}
	function setLightboxHeight(){
		var wHeight = $(window).height();
		var wWidth = $(window).width();
		var wProportion = wWidth/wHeight;
		// Podcast
		if($('.mfp-inline-holder .type1').length > 0) {
			// maxWidth 1596 : maxHeight 800 = 1.995
			var bodyFont = $('body').css('font-size').slice(0,-2);
			var fontsize = wHeight*16/800;
			if(bodyFont < fontsize) { fontsize = bodyFont; }
			if(wHeight < 800 && wProportion > 1.995) {
				$('.previewLayerContent').css({'height':wHeight+'px','font-size':fontsize+'px'});
			} else {
				$('.previewLayerContent').css({'height':'','font-size':''});
			}
		}
		// Video
		if($('.mfp-inline-holder .type2').length > 0) {
			// maxWidth 1596 : maxHeight 800 = 1.995
			if(wHeight < 800 && wProportion > 1.995) {
				$('.previewLayerContent, .previewLayerContent iframe').css({'height':wHeight+'px','width':(wHeight*1.995)+'px'});
			} else if(wWidth < 1596) {
				$('.previewLayerContent, .previewLayerContent iframe').css({'height':(wWidth/1.995)+'px','width':''});
			} else {
				$('.previewLayerContent, .previewLayerContent iframe').css({'height':'','width':''});
			}
		}
		// Gallery
		if($('.mfp-inline-holder .type3').length > 0) {
			// maxWidth 1200 : maxHeight 846 = 1.4184
			if(wHeight < 846 && wProportion > 1.4184) {
				$('.previewLayerContent').css({'height':wHeight+'px'});
			} else {
				$('.previewLayerContent').css({'height':''});
			}
		}
	}

	$(window).resize(function() {
		setFontSize();
		setLightboxHeight();
	});setFontSize();

	/**************************************************
	 * Scroll-To-Top, Logo tauschen
	 **************************************************/
	$(window).scroll(function() {
		var scrollPos = $(window).scrollTop();
		if($('body').hasClass('home')) {
			if(scrollPos > 430) {
				$('.logo-small').addClass('visible');
				$('.scrollToTop').addClass('visible');
			} else {
				$('.logo-small').removeClass('visible');
				$('.scrollToTop').removeClass('visible');
			}
			if(scrollPos > 200) {
				$('body.home #tablogo').addClass('visible');
			} else {
				$('body.home #tablogo').removeClass('visible');
			}
		} else {
			if(scrollPos > 300) {
				$('.logo-small').addClass('visible');
				$('.scrollToTop').addClass('visible');
			} else {
				$('.logo-small').removeClass('visible');
				$('.scrollToTop').removeClass('visible');
			}
		}
	});

	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});

	/**************************************************
	 * Lightbox Aufrufe
	 **************************************************/
	$('.open-medialayer').magnificPopup({
		type:'inline',
		midClick: true,
		closeOnBgClick: false,
		enableEscapeKey: false,
		fixedContentPos: true,
		fixedBgPos: false,
		closeMarkup: '<button title="%title%" class="mfp-close"><span class="tsbbutton size50 colorRed"><span class="tsbicon i-close"></span></span></button>',
		callbacks: {
			beforeOpen: function() {},
			open: function() {
				$('.mfp-bg, .mfp-wrap').addClass('mediaPopupActive');
				setLightboxHeight();
				$('.mfp-close').click(function(){$.magnificPopup.close();});
				$('body, html').addClass('no-scroll');
			},
			close: function() {
				$('body, html').removeClass('no-scroll');
				// Video anhalten
				$('.mediaLayer.type2 iframe').each(function(){
					var iframe = $(this)[0].contentWindow;
					iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
				});
				// Audio anhalten
			}
		}
	});

	$('.contactform').magnificPopup({
		type: 'iframe',
		/*iframe: {
		 markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" style="min-height:675px" frameborder="0" allowfullscreen></iframe></div>'
		 },*/
		closeOnBgClick: false,
		enableEscapeKey: false,
		fixedContentPos: true,
		fixedBgPos: false,
		closeMarkup: '<button title="%title%" class="mfp-close"><span class="tsbbutton size50 colorRed"><span class="tsbicon i-close"></span></span></button>',
		callbacks: {
			open: function() {
				$('.mfp-close').click(function(){$.magnificPopup.close();});
				$('.mfp-content').addClass('contact');
				$('body, html').addClass('no-scroll');
			},
			close: function() {
				$('body, html').removeClass('no-scroll');
			}
		}
	});
	$('.newsletterform').magnificPopup({
		type: 'iframe',
		/*iframe: {
		 markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" style="min-height:550px" frameborder="0" allowfullscreen></iframe></div>'
		 },*/
		closeOnBgClick: false,
		enableEscapeKey: false,
		fixedContentPos: true,
		fixedBgPos: false,
		closeMarkup: '<button title="%title%" class="mfp-close"><span class="tsbbutton size50 colorRed"><span class="tsbicon i-close"></span></span></button>',
		callbacks: {
			open: function() {
				$('.mfp-close').click(function(){$.magnificPopup.close();});
				$('.mfp-content').addClass('newsletter');
				$('body, html').addClass('no-scroll');
			},
			close: function() {
				$('body, html').removeClass('no-scroll');
			}
		}
	});

	$('.eventFormLink').magnificPopup({
		type: 'inline',
		preloader: false,
		closeOnBgClick: false,
		enableEscapeKey: false,
		fixedContentPos: true,
		fixedBgPos: false,
		closeMarkup: '<button title="%title%" class="mfp-close"><span class="tsbbutton size50 colorRed"><span class="tsbicon i-close"></span></span></button>',
		callbacks: {
			open: function() {
				$('.mfp-close').click(function(){$.magnificPopup.close();});
				$('body, html').addClass('no-scroll');
			},
			close: function() {
				$('body, html').removeClass('no-scroll');
			}
		}
	});
	$('.zoomlink').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: true,
		enableEscapeKey: false,
		fixedContentPos: true,
		fixedBgPos: false,
		mainClass: 'mfp-no-margins mfp-with-zoom',
		image: {
			verticalFit: true
		},
		zoom: {
			enabled: true,
			duration: 300
		},
		closeMarkup: '<button title="%title%" class="mfp-close"><span class="tsbbutton size50 colorRed"><span class="tsbicon i-close"></span></span></button>',
		callbacks: {
			open: function() {
				$('.mfp-close').click(function(){$.magnificPopup.close();});
				$('body, html').addClass('no-scroll');
			},
			close: function() {
				$('body, html').removeClass('no-scroll');
			}
		}
	});

	if($('body').hasClass('lightbox')) {
		if(window.parent.innerWidth < 750) {
			$('body').addClass('viewport-xs');
		}
		$('.powermail_fieldwrap_7').addClass('clear-xs');
	}

	/**************************************************
	 * Klick-Vergrößern
	 **************************************************/
	$('.zoomlink').each(function(){
		if($(this).find('span.img-enlarge').length == 0) {
			$(this).prepend('<span class="tsbbutton size42 colorTrans img-enlarge"><span class="tsbicon i-plus"></span></span>');
		}
	});

	/**************************************************
	 * Text-Bild-Pfeile
	 **************************************************/
		// Standard Inhaltselemente
	$('.csc-textpic-imagewrap').each(function(){
		if($(this).parent().hasClass('csc-textpic-intext-right-nowrap')) {
			$(this).append('<span class="arrow-right hidden-xs"></span><span class="arrow-top visible-xs"></span>');
		}
		if($(this).parent().hasClass('csc-textpic-intext-left-nowrap')) {
			$(this).append('<span class="arrow-left hidden-xs"></span><span class="arrow-top visible-xs"></span>');
		}
	});
	// Übersichtsseiten
	$('.overview-text > div.csc-default, .contact-text > div.csc-default').each(function(){
		$(this).append('<div class="arrow-right hidden-xs"></div><span class="arrow-bottom visible-xs"></span>');
	});

	/**************************************************
	 * csc-linkwrap Buttons
	 **************************************************/
		// Standard Inhaltselemente
	$('body').not('.home').find('.csc-default').each(function(){
		// Übersichtsseiten Boxen
		if($(this).parent().hasClass('overview-text')) {
			$(this).find('> .csc-textonly > .csc-linkwrap a').html('<span>'+$(this).find('> .csc-textonly > .csc-linkwrap a').html()+'</span>');
			if($('body').hasClass('area-foundation')) {
				$(this).find('> .csc-textonly > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
			} else {
				$(this).find('> .csc-textonly > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorWhite"><span class="tsbicon i-pfeil"></span></span>');
			}
			// Textinhalte
		} else {
			$(this).find('> .csc-textonly > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
		}
	});

	/**************************************************
	 * Top-Themen
	 **************************************************/
	$('.hotTopic .csc-linkwrap a').each(function(){
		$(this).html('<span>'+$(this).html()+'</span>');
		$(this).prepend('<span class="tsbbutton size50 colorWhite"><span class="tsbicon i-pfeil"></span></span>');
	});
	$('.hotTopic').hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	$('.hotTopic .csc-default').click(function(){
		var boxLink = $(this).find("a").attr("href");
		//alert(boxLink);
		setTimeout(window.location = boxLink, 10);
		return false;
	});

	/**************************************************
	 * Startseite dynamischer Header
	 **************************************************/
	if( $('body').hasClass('home') ){
		// Berechnung auf EM-Basis (body fontsize, Basis 16px)
		var bodyFont = $('body').css('font-size').slice(0,-2);
		var teaserHeight = $('#teaser').height()/bodyFont;
		var contentHeight = $('.header-right .csc-default').height()/bodyFont;
		if(contentHeight > 11) {
			var heightDiff = Math.abs(teaserHeight-contentHeight-15);
			var newHeight = (teaserHeight+heightDiff);
			// max Height
			if(newHeight > 31.875) newHeight = 31.875;
			$('#teaser').css({'height':newHeight*bodyFont+'px'});
		}
	}

	/**************************************************
	 * Startseite Highlight Teaser
	 **************************************************/
	$('.home100 .csc-default').each(function(){
		$(this).find('.csc-text').prepend($(this).find('.csc-header').html());
	});

	/**************************************************
	 * Startseite Buttons
	 **************************************************/
		// Startseite Textelemente
	$('body.home .csc-default').each(function(){
		if($(this).parent().hasClass('home100')) {
			$(this).find('.csc-linkwrap a').prepend('<span class="tsbbutton size80 colorRed"><span class="tsbicon i-pfeil"></span></span>');
		} else {
			if($(this).hasClass('dark-blue') || $(this).hasClass('light-blue') || $(this).hasClass('red')) {
				// Text-Bild
				$(this).find('> .csc-textpic > .csc-textpic-text > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorWhite"><span class="tsbicon i-pfeil"></span></span>');
				// Text
				$(this).find('> .csc-textonly > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorWhite"><span class="tsbicon i-pfeil"></span></span>');
			} else {
				// Text-Bild
				$(this).find('> .csc-textpic > .csc-textpic-text > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
				// Text
				$(this).find('> .csc-textonly > .csc-linkwrap a').prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
			}
		}
	});
	// Startseite Teaser
	$('body.home .tx-tsb-ccontent').each(function(){
		if($(this).parent().hasClass('grey')) {
			$(this).find('.csc-linkwrap a').prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
		} else {
			$(this).find('.csc-linkwrap a').prepend('<span class="tsbbutton size50 colorWhite"><span class="tsbicon i-pfeil"></span></span>');
		}
	});

	$('body.home .csc-textonly, body.home .csc-textpic, body.home .newsLatest .item').click(function(){
		var boxLink = $(this).find("a");
		var boxLinkHref = boxLink.attr("href");
		var boxLinkTarget = boxLink.attr("target");

		if (typeof(boxLinkHref) != "undefined" && boxLinkTarget == "_blank"){
			window.open(boxLinkHref, '_blank');
			return false;
		} else if (typeof(boxLinkHref) != "undefined") {
			window.location = boxLinkHref;
			return false;
		}
		return false;
	});

	/**************************************************
	 * Startseite Hover Boxen
	 * Text-Bild-Elemente, Text-Elemente, TSB-Teaser
	 **************************************************/
	$('.home #content .csc-default > .csc-textpic, .home #content .csc-default > .csc-textonly, .home #content .tx-tsb-ccontent > div').hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});

	/**************************************************
	 * Hauptmenue
	 **************************************************/
	if(!!('ontouchstart' in window)){
		// show overview menu entries
		$('ul.navMain').find('li').css('display', 'block');
		// init click actions
		$('ul.navMain > li > a').click(function(e){
			// prevent direct click if subnav exists
			if($(this).parent().find('ul').length){
				e.preventDefault();
			}
			if($(this).parent().hasClass('hover')){
				$(this).parent().removeClass("hover");
				$('ul.navMain').removeClass("hover");
			} else {
				$('ul.navMain > li').removeClass("hover");
				$(this).parent().addClass("hover");
				$('ul.navMain').addClass("hover");
			}
		});
	} else {
		$('ul.navMain > li > a').mouseenter(function(){
			$(this).parent().addClass("hover");
			$('ul.navMain').addClass("hover");
		});
		$('ul.navMain > li').mouseleave(function(){
			$(this).removeClass("hover");
			$('ul.navMain').removeClass("hover");
		});
	}

	/**************************************************
	 * Zweispalter Höhenberechnung
	 **************************************************/
	$('.twocols').not('.noJS').each(function(){
		var leftCol = $(this).find('.content-left').height();
		var rightCol = $(this).find('.content-right').height();
		if(rightCol >= leftCol) {
			var maxHeight = rightCol;
		} else {
			var maxHeight = leftCol;
		}
		$(this).find('.content-left').css({'height':maxHeight+'px'});
		$(this).find('.content-left > div').css({'position':'absolute','bottom':'0','margin-bottom':'0'});
	});

	/**************************************************
	 * Ansprechpartner
	 **************************************************/
	if($('.rightcol .contactBox').length == 1) {
		$('.contactBox').addClass('singleContact');
	}
	if($('.rightcol .singleContact').length == 0) {
		// Einzelelement
		$('.contactBox .name, .contactBox .function, .contactBox img').click(function(){
			var boxIcon = $(this).parent().parent().find('.glyphicon');
			if(boxIcon.hasClass('glyphicon-chevron-down')) {
				$('.contactBox .glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
				$('.contactBox .options').css('opacity','0').slideUp(200);
				boxIcon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
				$(this).parent().parent().find('.options').slideDown(200, function(el){
					$(this).css('opacity','1');
				});
			} else {
				boxIcon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
				$(this).parent().parent().find('.options').css('opacity','0').slideUp(200);
			}
		});
	}

	// Icons tauschen
	$('.area-foundation .contactBox .options .mail img').attr('src','/typo3conf/sites/tsb/img/icon_contact_mail.png');
	$('.area-foundation .contactBox .options .phone img').attr('src','/typo3conf/sites/tsb/img/icon_contact_phone.png');
	$('.area-foundation .contactBox .options .twitter img').attr('src','/typo3conf/sites/tsb/img/icon_contact_twitter.png');
	// Liste
	$('.contactList .listItem').hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});

	/**************************************************
	 * Social Media Buttons
	 **************************************************/
	$('.social a, .mediaSocial a, .eventShare a, .newsShare a').hover(function(){
		$(this).tooltip('toggle');
	});

	$('.open-social-media, .close-social-media').click(function(e){
		e.preventDefault();
		$('.close-social-media').fadeToggle(300);
		$('.social-mobile').animate({width:'toggle'}, 350);
	});

	/**************************************************
	 * News/Event Liste
	 **************************************************/
		// csc-linkwrap Buttons
	$('.listItem .csc-linkwrap a').each(function(){
		$(this).prepend('<span class="tsbbutton size50 colorRed"><span class="tsbicon i-pfeil"></span></span>');
	});
	// csc-linkwrap Buttons
	$('.eventTopevents .listItem, .newsTopnews .listItem, .mediaTopmedia .listItem, ' +
		'.eventList .listItem .event-image, .eventList .listItem .event-teaser, .newsList .listItem .news-image, .newsList .listItem .news-teaser, ' +
		'.overview-text').hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	// Boxlinks
	$('.eventTopevents .listItem, .newsTopnews .listItem, .mediaTopmedia .listItem, ' +
		'.eventList .listItem .event-image, .eventList .listItem .event-teaser, .newsList .listItem .news-image, .newsList .listItem .news-teaser, ' +
		'.overview-text .csc-default .csc-linkwrap').click(function(){
		var boxLink = $(this).find("a").attr("href");
		setTimeout(window.location = boxLink, 10);
		return false;
	});

	/**************************************************
	 * Media Liste
	 **************************************************/
	// Media Mehr-Link
	if($('.mediaList').length > 0) {
		var mediaLinkMore = $('.mediaLinkMore').text();
		var mediaLinkLess = $('.mediaLinkLess').text();
		var bodyFont = $('body').css('font-size').slice(0,-2);
		$('.mediaDesc').each(function(){
			var textHeight = $(this).height();
			if(Math.floor(textHeight/bodyFont) > 6) {
				$(this).addClass('toggletext');
				$(this).parent().append('<hr class="stripe" /><p class="readmore closed"><span class="glyphicon glyphicon-chevron-down"></span><span class="rm-text">'+mediaLinkMore+'</span></p>');
				$(this).css({'height':'6em', 'min-height':'6em', 'max-height':(textHeight/bodyFont)+'em'});
			}
		});
		$('.readmore').click(function(){
			if($(this).hasClass('closed')) {
				var toggleHeight = $(this).siblings('.toggletext').css('max-height');
				$(this).siblings('.toggletext').animate({height:toggleHeight},500);
				$(this).find('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
				$(this).removeClass('closed').addClass('open');
				$(this).find('.rm-text').html(mediaLinkLess);
			} else {
				var toggleHeight = $(this).siblings('.toggletext').css('min-height');
				$(this).siblings('.toggletext').animate({height:toggleHeight},500);
				$(this).find('.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
				$(this).removeClass('open').addClass('closed');
				$(this).find('.rm-text').html(mediaLinkMore);
			}
		});
	}
	// Click Event
	$('.mediaLinks .btnPlay').click(function(){
		return false;
	});

	/**************************************************
	 * News/Event Details
	 **************************************************/
	// News/Event Breadcrumb
	if($('.eventDetail, .newsDetail').length > 0) {
		var breadcrumb = $('.eventDetail .eventTitle, .newsDetail .newsTitle').text();
		$('.navBreadcrumb ol').append('<li class="active"><img src="/typo3conf/sites/tsb/img/breadcrumb-arrow.gif" />'+breadcrumb+'</li>');
	}

	/**************************************************
	 * News/Event Galerie
	 **************************************************/
	if($('.mediaGalleryItem').length > 0) {
		// Hover Effekt
		$('.mediaPreview').hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		});
	}
	/* SLIDER */
	if($('.mediaSlider').length > 0) {
		var curPos = 1;
		var countMedia = $('.mediaSliderElements .mediaGalleryItem').length;
		var maxPos = countMedia-2;
		$('.mediaSliderElements').css('width',(countMedia+1)*16.625+'em');
		$('.mediaSliderRight').addClass('active');
		$('.mediaSliderRight').click(function(){
			if($(this).hasClass('active')) {
				if(maxPos > curPos) {
					$('.mediaSliderElements').animate({'margin-left':'-'+(curPos*16.625)+'em'},300);
					$('.mediaSliderLeft').addClass('active');
					curPos = curPos+1;
					if(maxPos == curPos) $('.mediaSliderRight').removeClass('active');
				}
			}
		});
		$('.mediaSliderLeft').click(function(){
			if($(this).hasClass('active')) {
				if(curPos > 1) {
					$('.mediaSliderElements').animate({'margin-left':'-'+((curPos-2)*16.625)+'em'},300);
					$('.mediaSliderRight').addClass('active');
					curPos = curPos-1;
					if(curPos == 1) $('.mediaSliderLeft').removeClass('active');
				}
			}
		});
	}

	/**************************************************
	 * Glossar Unterteilung, großer Anfangsbuchstabe
	 **************************************************/
	if( !$('body').hasClass('lightbox') ){
		var listitems = $('.wordList').find('.listItem');
		listitems.each(function(key, value){
			var prev = $(this).prev().find('h3').text().charAt(0);
			var curr = $(this).find('h3').text().charAt(0);
			if(curr != prev){
				$(this).before('<div class="listItem clearfix letterBox" id="letter'+curr+'"><div class="wordImage"></div><span class="letter">'+curr+'</span></div>');
			}
		});
	}

	/**************************************************
	 * Rightcol Affix
	 **************************************************/
	var body = $('body');
	var bodyFont = body.css('font-size').slice(0,-2);
	var heightFooter = bodyFont*35.4375; // em = 567px
	var heightBody = body.height();
	var affixContainer = $('.affixContainer');
	var limit = heightBody - (heightFooter + affixContainer.height());
	var width = $("body").width();
	if (width >= 750) {
		affixContainer.scrollToFixed({
			marginTop: bodyFont*affixBase,
			limit: limit,
			removeOffsets: true,
			zIndex: 800
		});
	}

	/**************************************************
	 * KE_SEARCH
	 **************************************************/
	// ke_search ajax
	var searchResultWrap = $('#ke_search_results_wrap');
	var searchForm = $('#xajax_form_kesearch_pi1');
	var searchSword = $('#ke_search_sword');
	initSearch(searchResultWrap, searchForm, searchSword);

	var searchResultWrapMobile = $('#ke_search_results_wrap');
	var searchFormMobile = $('#xajax_form_kesearch_pi1-mobile');
	var searchSwordMobile = $('#ke_search_sword-mobile');
	initSearchMobile(searchResultWrapMobile, searchFormMobile, searchSwordMobile);

	/*
	 * SEARCH DESKTOP
	 */
	function initSearch(searchResultWrap, searchForm, searchSword){
		searchSword.keypress(function(event){
			if( (event.keyCode == 13) ) {
				event.preventDefault();
				showResults(searchForm, searchResultWrap, searchSword, '7.5em');
				return false;
			}
		});

		searchForm.submit(function(e){
			e.preventDefault();
			if($('#open-search').length == 0)
				showResults(searchForm, searchResultWrap, searchSword, '7.5em');
		});

		// initialize search box
		// hide reset button
		var reset = $('#reset-wrap').find('.resetbutt');
		reset.css({'margin-top': '-100px', 'position': 'absolute'});
		// hide searchsword
		searchSword.animate({
			'width': '0'
		}, 0, function(){
			searchSword.hide(0);
		});
		var label = $('#search-label');
		var sm = $('.head-social .social');

		$('#open-search, #search-label').hover(function(){
			$('.kesearchbox').addClass('hover');
		},function(){
			$('.kesearchbox').removeClass('hover');
		});
		// open
		$('#open-search, #search-label').click(function(e){
			var self = $(this);
			if(self.attr('id') == '#search-label') e.preventDefault();

			// hide social media icons
			sm.animate({
				'opacity': 0,
				'margin-right': '-200px'
			}, 400, function(){
				sm.hide(0);
			});
			// hide search label
			label.hide(0);
			// show searchsword
			searchSword.show(0);
			searchSword.animate({
				'width': '16em',
				'padding':'0 1em'
			}, 400, function(){
				$('#open-search').attr('id', 'start-search');
			});
			reset.animate({'margin-top': '0px'}, 400);
		});

		// close
		$('#close-search').click(function(e){
			e.preventDefault();
			var self = $(this);
			searchResultWrap.slideUp(300);
			// hide closing button
			reset.animate({'margin-top': '-100px'}, 400);
			// show social media icons
			sm.show(0);
			sm.animate({
				'opacity': 1,
				'margin-right': '0'
			}, 400);
			// hide searchsword
			searchSword.animate({
				'width': '0',
				'padding':'0'
			}, 400, function(){
				searchSword.hide(0);
				$('#start-search').attr('id', 'open-search');
				// show search label
				label.show(0);
			});
		});
	}

	/*
	 * SEARCH MOBILE
	 */
	function initSearchMobile(searchResultWrap, searchForm, searchSword){
		searchWrapper = $('#search-panel-mobile');

		searchSword.keypress(function(event){
			if( (event.keyCode == 13) ) {
				event.preventDefault();
				showResults(searchForm, searchResultWrap, searchSword, 0);
				return false;
			}
		});

		searchForm.submit(function(e){
			e.preventDefault();
			showResults(searchForm, searchResultWrap, searchSword, 0);
		});

		// initialize search box
		// hide searchwrapper
		headerHeight = $('#headerWrap').height();
		searchWrapper.css({
			'margin-top': '-'+headerHeight+'px'
		});

		// close
		$('#close-search-mobile').click(function(e){
			e.preventDefault();
			var self = $(this);
			// close results
			searchResultWrap.slideUp(300);
			// switch open/close buttons
			var open = $('#open-search-mobile');
			open.show(0);
			open.animate({'opacity': 1}, 200);
			self.animate({'opacity': 0}, 200, function(){
				self.hide(0);
			});
			// close search
			searchWrapper.animate({
				'margin-top': '-'+headerHeight+'px'
			}, 400, function(){
				self.removeClass('isOpen');
			});
		});
		// open
		$('#open-search-mobile').click(function(e){
			e.preventDefault();
			var self = $(this);
			$('html, body').animate({scrollTop : 0},800);
			// switch open/close buttons
			var close = $('#close-search-mobile');
			close.show(0);
			close.animate({'opacity': 1}, 200);
			self.animate({'opacity': 0}, 200, function(){
				self.hide(0);
			});
			// open search
			searchWrapper.animate({
				'margin-top': headerHeight+'px'
			}, 400, function(){
				self.addClass('isOpen');
			});
		});
	}


	function showResults(searchForm, searchResultWrap, searchSword){
		searchResultWrap.slideUp(300, function(){
			var parameter = {
				'id': searchForm.find('input[name="id"]').val(),
				'tx_kesearch_pi1[sword]': searchSword.val()
			};
			getResults(searchForm, searchResultWrap, parameter);
		});
	}

	function getResults(searchForm, searchResultWrap, parameter, headerPlaceholderHeight){
		$.get(searchForm.attr('action'), parameter, function(data){
			searchResultWrap.css({'margin-bottom':'-100px'});
			var filteredData = $(data).filter('div');
			$('#ke_search_results').html(filteredData).css({'margin-top': headerPlaceholderHeight});
			$('#kesearch_search_value').html('"'+searchSword.val()+'"');
			searchResultWrap.find('.result_txt').remove();

			// add more link and hide pagebrowser
			var pagebrowser = $('.kesearch_pagebrowser');
			var moreHref = pagebrowser.find('.next').attr('href');
			pagebrowser.hide(0).after('<br /><hr class="stripe"><a href="'+moreHref+'" id="resultsShowMore" ><span class="glyphicon glyphicon-chevron-down"></span>Mehr anzeigen</a>');
			$('#resultsShowMore').click(function(e){
				e.preventDefault();
				var self = $(this);
				$.get(moreHref, function(data){
					var filteredData = $(data).filter('div');
					var moreResults = filteredData.find('#kesearch_results');
					$('body').find('#kesearch_results').append('<div class="resultload">'+moreResults.html()+'</div>');

					$('.resultload .result-list-item').each(function(){
						addSearchIcons($(this));
					});
					$('.resultload').slideDown(500).removeClass('resultload');
					var nextButton = filteredData.find('.kesearch_pagebrowser').find('.next');
					(nextButton.length) ? moreHref = nextButton.attr('href') : self.remove();
				});
			});
			$('.result-list-item').each(function(){
				addSearchIcons($(this));
			});

			$('.result-list-item').click(function(){
				var boxLink = $(this).find("a").attr("href");
				setTimeout(window.location = boxLink, 10);
				return false;
			});

			searchResultWrap.slideDown(500);
			$('html, body').animate({scrollTop : 0},800);
		})
		function addSearchIcons(item){
			var iconType = "icon-50-red-arrow";
			if(item.hasClass('item-page')) {
				var searchPath = item.find('.result-info a').attr('href');
				if(searchPath.indexOf("top-themen") == -1) {
					item.removeClass('item-page').addClass('item-specialpage');
				}
			}
			item.prepend('<span class="tsbbutton size50 colorRed pull-left"><span class="tsbicon i-pfeil"></span></span>');
		}
	}
});
