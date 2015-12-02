var currentscrollpos;

jQuery(function() {
	jQuery( ".epager" ).click(function() {
		currentscrollpos = jQuery(window).scrollTop()
		// alert (currentscrollpos);
		jQuery("#pager-container").css('top',currentscrollpos);
		jQuery("body").addClass('no-overflow');
		// return false;
	});
});

jQuery(function($)
{		
	var config 	= {
        homeUrl			: '/app', // 'mint.dev.kompetenzz.net/app',  //home url of the epager, empty string for the same domain
        markupUrl		: '/brochure/getPagerMarkup',
        styleUrl        : '/brochure/styles',      
        metaDataUrl     : '/brochure/metadata', 
        easing          : 'swing',
        duration        : 600, //duration of paging
        enableCaching   : false, 
		targetContainer : null, //target for inserting the pager markup, don't use the body, because auf aria
        namespace		: 'scepager', //namespace for events and datas        
        hideOnShow      : null,       // hide this element when pager starts
        debug           : false,
        zoomMax         : 40, // px
        zoomStep        : '1.5px', // used as pattern
        
        //these attributes are used internally, don't use these ones
        metaData        : {}, 
        actualBrochure  : null,
        doublePage      : {    // don't overwrite, container for data
            width       : 0,
            height      : 0,
            fontSize    : 0
        },
        window          : {
            width   : 0,
            height  : 0
        },
        //if actual ratio > : use height
        //if actual ratio < : use width
        ratio           : 1.4141,  // 2 x A4 = (2  x 210) x 297 width	-> width / height 
		overlayClass    : 'scEPagerOverlay', // the styles for the overlay style
		// callbacks
		beforeInit              : null,
		afterInit               : null,
        beforeLoadBrochure      : null,
        afterLoadBrochure       : null,
        beforeHidingPager       : null,
        afterHidingPager        : null,
        beforeLoadPage          : null,
        afterLoadPage           : null
	};
	
	var methods = {
        log : function(msg){
            if (config.debug && console) {
                console.log('debuglog: ' + msg);
            }
        },
        
        /**
         *  initializes plugin, loads styles, initializes event handlers
         *  @todo: refactor and preload the metadata of all brochures
         */
		init : function(){
            methods.log('init'); 
            if ($.isFunction(config.beforeInit)) {
                config.beforeInit.call(this);
            }
            return this.each(function(){              
                var $container	= $(config.targetContainer);                
                var $this           = $(this);
                
                // load metadata
                var brochureName        = this  .href.split('/').pop();                
                config.metaData[brochureName]   = {url : this.href};
                
                //callback
                
                
                $.get(
                    config.homeUrl + config.metaDataUrl,
                    {'name' : brochureName},
                    function(data) {
                        $.extend(config.metaData[data.name], data);
                    },
                    'json'
                );
                  
                // bind the click handler
                $this.bind('click.' + config.namespace + ' cclick.' + config.namespace, function(e){
                    methods.loadBrochure.call(this);
                    return false;
                });
                
                // call this block only once
                if (!$container.data(config.namespace)) {

                    $container  .hide()
                                .attr('aria-hidden', 'true');
                                
                        
                    $container	.load(config.homeUrl + config.markupUrl, {ajax : 1})
                                .data(config.namespace, $.extend({}, $container.data(config.namespace), {'markup' : true}));
                                
                    
                    // event handler                   
                    $container.on('click.' + config.namespace, '#pageFirst, #pageLast, #pageBack, #pageNext, #brochureContent a', function(){
                        methods.loadPage.call(this);
                        return false;
                    });
                    
                    $container.on('click.' + config.namespace, 'a.zoomIn, a.zoomOut', function(){
                        var $cont       = $('.doublePage','#pagecontainer');
                        var fs          = parseFloat($cont.css('fontSize'));  
                        var $this       = $(this);
                        var zoomClass   = ($this.hasClass('zoomIn')) ? 'zoomIn' : 'zoomOut';
                        
                        var initFs  = $container.data(config.namespace).fontSize; // start fontsize, used by zoom out as final point
                        if (!initFs) {
                            initFs  = fs;
                            $container.data(config.namespace, $.extend({}, $container.data(config.namespace), {'fontSize' : initFs}));
                        } 
                        
                        switch (zoomClass) {
                            case 'zoomIn':
                                
                                if (fs < config.zoomMax) {    
                                    console.log($cont);
                                    console.log(config.zoomStep);
                                    $cont   .css('fontSize', '+=' + config.zoomStep)
                                            .draggable()
                                            .addClass('draggable');
                                    $('a.zoomOut', $container).css('visibility', 'visible');
                                }
                                break;
                            case 'zoomOut':
                                $cont   .css('fontSize', '100%');
                                $('a.zoomOut', $container).css('visibility', 'hidden');
                                $cont.removeClass('draggable');
                                $cont.animate({
                                    'top' : 0,
                                    'left': 0
                                }, 'fast');
//                                altes verkleinern
//                                if (fs > initFs) {
//                                    $cont   .css('fontSize', '-=' + config.zoomStep);
//                                    
//                                } else {
//                                    $('a.zoomOut', $container).css('visibility', 'hidden');
//                                    $cont.removeClass('draggable');
//                                    $cont.animate({
//                                        'top' : 0,
//                                        'left': 0
//                                    }, 'fast');
//                                }
                                break;
                            
                            default:
                                break;
                        }                        
                        return false;
                    }); 
                    
                    //callback
                    if ($.isFunction(config.afterInit)) {
                            config.afterInit.call(this);
                    }
                }
            });
		},
        
        initPagerLayout : function(triggerSetLayout){
            methods.log('initPagerLayout');
           
            var data    = $(config.targetContainer).data(config.namespace);
            if (data.show !== 'undefined') {
                // do the work only if shown
                methods.log('resize Pagerlayout');
                var $window     = $(window);
                var height      = $window.innerHeight();
                var width       = $window.innerWidth();
                var fontSize    = 0;
                
                config.window.height    = height;
                config.window.width     = width;
                
                actualRatio = width / height;
                if (actualRatio > config.ratio) {
                    height -= 60;
                } else {
                    height  = (width / config.ratio) - 60;
                }
                width       = config.ratio * height;
                fontSize    = height / 842;
                
                config.doublePage.height    = Math.round(height);
                config.doublePage.width     = Math.round(width);
                config.doublePage.fontSize  = fontSize;
                // $('body').addClass('no-overflow');
                              
                if (triggerSetLayout) {
                    methods.setPagerLayout.call($('#pagecontainer'));
                }
            }
       },
       
       /**
        *   usage: this is a div#pagecontainer
        */
       setPagerLayout : function(){
            methods.log('setPagerLayout ');
            var $this   = this;
            $this   .width(config.doublePage.width) 
                    .height(config.doublePage.height)
                    .css({
                        'top'       : 30,
                        'fontSize'  : config.doublePage.fontSize + 'em'
                    });
//                    .find('.brochurePage')
//                    .width(config.doublePage.width / 2 - 1);
       },
       
       /**
        *  important: use this-pointer for the link with the target page of the brochure,
        *  otherwise use the parameter href
        */
       loadPage : function(){
            methods.log('loadPage');
            var $container  = $(config.targetContainer);
            
            if ($.isFunction(config.beforeLoadPage)) {
                methods.beforeLoadPage.call($container);
            }
//            this.href    = 'http://onepage.local/broschueren/nawi/50';            
            if (config.enableCaching && methods.isCached(this.href)) {
                var $first  = methods.getCache(this.href);
                var data    = {};
                if ($first.attr('data-dir') == 'left') {
                    data.leftPage       = $first.clone().children().eq(0);
                    data.leftPageIndex  = parseInt($first.attr('data-index'));
                    
                    data.rightPageIndex = data.leftPageIndex + 1;
                    var $second  = methods.getCache(config.metaData[config.actualBrochure].url + '/' + data.rightPageIndex);
                    data.rightPage  = $second.clone().children().eq(0);
                } else {
                    data.rightPage      = $first.clone().children().eq(0);
                    data.rightPageIndex = $first.attr('data-index');
                }   
                methods.setPage(data);
            } else { 
               $.get(
                    this.href,
                    {ajax : 1},
                    function(data){
                        if (config.enableCaching) {
                            methods.setCache(data);
                        }
                        methods.setPage(data);
                    },
                    'json'
                );
            }
            
            if (config.enableCaching) {
                 methods.preloadPage(this.href);
            }
            
            if ($.isFunction(config.afterLoadPage)) {
                methods.afterLoadPage.call($container);
            }
//            return false;
        },
       
        preloadPage : function(href){
            var i       = methods.getPageNumber(href);
            var baseUrl = config.metaData[config.actualBrochure].url + '/';
            
            if (i === null) {                
                i = (config.metaData[config.actualBrochure].hasStartPage) ? 2 : 3;
            } 
            
            href    = baseUrl + i;
            if (!methods.isCached(href)){
                $.get(
                    href,
                    {'ajax' : 1},
                    function(data){
                        methods.setCache(data)
                    },
                    'json'
                );
            }
            
            i       -= 2;
            href    = baseUrl + i;
            if (i > 0 && !methods.isCached(href)){
                
                $.get(
                    href,
                    {'ajax' : 1},
                    function(data){
                        methods.setCache(data)
                    },
                    'json'
                );
            }
        },
       /*
        *  sets da data to the pages
        *  @todo implement the animation
        */
        setPage  : function(data){   
            var $container      = $(config.targetContainer);
            var $pager          = $('#scEPager', $container);
            var $pagecontainer  = $('#pagecontainer', $pager);
            var $oldPage        = $('.doublePage', $pagecontainer);
            var $next           = $('#pageNext', $pager);
            var $back           = $('#pageBack', $pager);
           
            var baseUrl         = config.metaData[config.actualBrochure].url;
            
            // set navigation caption
            var pageInfo = '';
            if (data.leftPageIndex) {
                pageInfo += data.leftPageIndex;
            }
            if (data.rightPageIndex) {
                if (pageInfo) {
                    pageInfo = pageInfo + ' - ' + data.rightPageIndex;
                } else {
                    pageInfo = data.rightPageIndex;
                }
            }
            
            $('#actualPageInfo').text(pageInfo);
            $('#pageCountInfo').text(config.metaData[config.actualBrochure].pageCount);
            
            var $newPage   = $('.template', $container) .clone()
                                                        .removeClass('template')
                                                        .attr('aria-hidden', 'false');
                        
            //hide/show navigation button in case of first or last page
            if (data.leftPageIndex == 1 || data.rightPageIndex == 1) {
                $back.addClass('hiddenBlock');
                $('#pageFirst', $container).addClass('hiddenBlock');
            } else {
                $back.removeClass('hiddenBlock');
                $('#pageFirst', $container).removeClass('hiddenBlock');
            }
            
            if (data.leftPageIndex == config.metaData[config.actualBrochure].pageCount || data.rightPageIndex == config.metaData[config.actualBrochure].pageCount) {
                $next.addClass('hiddenBlock');
                $('#pageLast', $container).addClass('hiddenBlock');
            } else {
                $next.removeClass('hiddenBlock');
                $('#pageLast', $container).removeClass('hiddenBlock');
            }
            
            // note the actual page number with data
            var direction   = ''; // animation direction
            var oldIndex    = null;
           
            // set the html
            if (data.leftPage) {
                oldIndex    = methods.getPageNumber($back.prop('href'));
                if (oldIndex !== null) {
                    oldIndex    += 2;
                }
                direction   = (oldIndex && data.leftPageIndex > oldIndex) ? '-=' : '+=';
                if ('string' == typeof data.leftPage) {
                    $('.leftPage', $newPage).html(data.leftPage);
                } else {
                    $('.leftPage', $newPage).append(data.leftPage);
                }
            }
            var backIndex   = (data.leftPageIndex > 2) ? data.leftPageIndex - 2 : 1;
            $back.prop('href',baseUrl + '/' + backIndex);
            
            if (data.rightPage) {
                oldIndex    = methods.getPageNumber($next.prop('href')) - 2;
                direction   = (oldIndex >= 0 && data.rightPageIndex > oldIndex) ? '-=' : '+=';       
                
                if ('string' == typeof data.rightPage) { // loaded directly
                    $('.rightPage', $newPage).html(data.rightPage);
                 
                } else { // cached content, jQuery-object                   
                    $('.rightPage', $newPage).append(data.rightPage);
                }
                
            }
            $next.prop('href', baseUrl + '/' + (parseInt(data.rightPageIndex) + 1));
            
            if ($oldPage.length > 0) {
                $newPage.css({'zIndex' : 45});
                direction += (config.doublePage.width + 10);
                $pagecontainer.append($newPage);
                $oldPage.animate(
                    {left : direction},
                    {
                        duration : config.duration,
                        easing   : config.easing,
                        complete : function(){
                            $(this).remove();
                            $newPage.css({'zIndex' : 50});
                        }
                    }
                );
            } else {
                $pagecontainer.append($newPage);
            }
            methods.setPagerLayout.call($pagecontainer);
        },
       
        getPageNumber : function(url){
           var page = url.split('/').pop();
           return ($.isNumeric(page)) ? parseInt(page) : null;
        },
       
        isOdd : function(i){
           return ((i % 2) == 1);
        },
       
        getCache : function(href){
            var $cacheContainer = $('#pageCache', config.targetContainer);
            return $('div[data-href="' + href + '"]', $cacheContainer);
        },
        
        isCached : function(href){
            var $cacheContainer = $('#pageCache', config.targetContainer);
            var result          = $('div[data-href="' + href + '"]', $cacheContainer).length;
            return (result > 0);
        },

        setCache : function(data){
            var $cacheContainer = $('#pageCache', config.targetContainer);
            if (data.leftPage) {
                var $left = $('<div />', {
                                            'class' : 'cached_' + data.leftPageIndex,
                                            'data-href' : config.metaData[config.actualBrochure].url + '/' + data.leftPageIndex,
                                            'data-dir'  : 'left',
                                            'data-index': data.leftPageIndex
                            });
                $left.html(data.leftPage);
                $cacheContainer.append($left);
            }
            if (data.rightPage) {
                var $right  = $('<div />', {
                                                'class' : 'cached_' + data.rightPageIndex,
                                                'data-href' : config.metaData[config.actualBrochure].url + '/' + data.rightPageIndex,
                                                'data-dir'  : 'right',
                                                'data-index': data.rightPageIndex
                            });
                $right.html(data.rightPage);
                $cacheContainer.append($right);
            }
        },

        loadBrochure : function(){
            methods.log('loadBrochure');
            
            $(window).bind('resize.' + config.namespace, function(){
                methods.initPagerLayout(true);
            });
                    
            var $container          = $(config.targetContainer);
            config.actualBrochure   = this.href.split('/').pop();
            $container.addClass(config.actualBrochure);
            
            //callback
            if ($.isFunction(config.beforeLoadBrochure)) {
                config.beforeLoadBrochure.call($container);
            }
            
            $container.on('click.' + config.namespace, '#closePager', function(){
                                    methods.hide();
                                    return false;
                                });
           
            /**
             * set the static links, that doesn't change
             */
            var data    = config.metaData[config.actualBrochure];
           
            if (data.content) {
                $('#contentLink', $container)   .prop('href', data.url + '/' + data.content )
                                                .bind('click.' + config.namespace, function(e){ 
                                                    methods.loadPage.call(this);
                                                    return false;
                                                });   
            } else {
                $('#contentLink', $container).hide();
            }
                     
          
            if (data.downloadLink) {
                $('#downloadBrochure', $container).prop('href', data.downloadLink);
            } else {
                $('#downloadBrochure', $container).hide();
            }
            
            // set the href's for the first and last page
            $('#pageFirst', $container).prop('href', data.url + '/1');
            if (data.hasStartPage) {
                var l = (methods.isOdd(data.pageCount)) ? data.pageCount - 1 : data.pageCount;
            } else {
                var l = (methods.isOdd(data.pageCount)) ? data.pageCount : data.pageCount - 1;
            }
            $('#pageLast', $container).prop('href', data.url + '/' + l);
            
            title   = (config.metaData[config.actualBrochure].title && config.metaData[config.actualBrochure].subtitle) ? config.metaData[config.actualBrochure].title + ' : ' : config.metaData[config.actualBrochure].title;
            $('#brochureTitle', $container).text(title);
            $('#brochureSubtitle', $container).text(config.metaData[config.actualBrochure].subtitle);

            methods.loadPage.call(this);
            methods.show();
            
            //callback
            if ($.isFunction(config.afterLoadBrochure)) {
                    config.afterLoadBrochure.call($container);
            }
        },

        show : function(){
            methods.log('show');
            var $container  = $(config.targetContainer);
            
            if (config.hideOnShow) {
                $(config.hideOnShow).hide();
            }
            $container  .addClass(config.overlayClass)
                        .attr({
                            'aria-hidden' : 'false'
                            })
                        .show()
                        .data(config.namespace, $.extend({}, $container.data(config.namespace), {'show' : true}));          
            methods.initPagerLayout(true);
//            methods.setPagerLayout.call($('.doublePage', $container), true);
        }, 
        
        hide : function(){
            methods.log('hide');
            
            var $container  = $(config.targetContainer);
            if ($.isFunction(config.beforeHidingPager)) {
                config.beforeHidingPager.call($container);
            }
            $('body').removeClass('no-overflow');
            $container  .hide()
                        .removeClass(config.actualBrochure)
                        .attr('aria-hidden', true)
                        .data(config.namespace, $.extend({}, $container.data(config.namespace), {'show' : false}));
               
            // cleaning
            config.actualBrochure   = null;
//            $container.unbind('.' + config.namespace);
            $('#pagecontainer').empty();
            
            if (config.hideOnShow) {
                $(config.hideOnShow).show();
            }
            
            $(window).unbind('resize.' + config.namespace);
            
            if ($.isFunction(config.afterHidingPager)) {
                config.afterHidingPager.call($container);
            }
        }
	};
	
	$.fn.scEPager = function(options, method)
	{ 
        if ($.isPlainObject(options)) {			
            config 	= $.extend({}, config, options);			
        } else {
            method	= options;
            options	= null;
        }

        if (!method) {
            method = 'init';
        }

        if ( methods[method] ) {
            return methods[method].apply( this, new Array(options));
        }else {
                $.error('unknown method ' + method + ' in plugin scEPager');
        }
	};
}) ; //(jQuery);
