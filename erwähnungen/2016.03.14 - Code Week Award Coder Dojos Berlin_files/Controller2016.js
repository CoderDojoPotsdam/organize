(function(window){

    Controller.prototype.constructor = Controller;
    Controller.prototype = {
        deviceType: "", //computer || tablet || phone
        pageId: "", //wordpress page ID
        themePath: "", //path to wordpress theme
        breakpoints:{ // screen resolutions breakpoints
            screen_xs: 480,
            screen_sm: 768,
            screen_md: 992,
            screen_lg: 1200,
            screen_xlg: 1440
        }
    }


    var $, ref, $siteWrapper, $toggleNavButton, $newsfeedContainer, $verticalCenterContainer,
        $scrollToTopBtn, $projectMoreWrapper, $contentMoreWrapper, initialized,
        scrollMagicController;
    function Controller(jQuery){
        $ = jQuery;
    }

    Controller.prototype.init = function(){

        ref = this;
        this.deviceType = window.deviceType;
        this.pageId = window.currentPageId;
        this.themePath = window.themePath;

        Logger.useDefaults();

        //Logger.setLevel(Logger.OFF);

        Logger.info("Startup 2016 site on deviceType: " + this.deviceType + " pageId: " + this.pageId + ", width: " + ref.viewport().width + ", height: " + ref.viewport().height + ", screensize: " + ref.viewport().screensize);
        Logger.info("path: " +this.themePath);

        //resize handler
        var delay = (function(){
            var timer = 0;
            return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
            };
        })();

        $(window).resize(function() {
            delay(function(){
                ref.resize();
            }, 250);
        });


        //define jQuery references here
        $siteWrapper = $('#site-wrapper');
        $newsfeedContainer = $('#socialtimeline');
        $scrollToTopBtn = $('.backtotop');
        $projectMoreWrapper = $('.project-more-wrapper');
        $contentMoreWrapper = $('.content-more-wrapper');
        $verticalCenterContainer = $('.vertical-center-container');

        // ref.initMenu();

        // init stuff for > 768 only
        if( viewport.width > this.breakpoints.screen_sm ) {
            
            $('#header-col-1').append($('#meta-col-1').html());
            $('.meta-row #meta-col-1').remove();
            $('#header-col-2').append($('#meta-col-2').html());
            $('.meta-row #meta-col-2').remove();
            $('.meta-row').css('display','none');

        }

        //newsfeed
        if($newsfeedContainer.length > 0){

            var _feeds = {};

            if(window.socialObject.twitter) _feeds.twitter = { data: this.themePath + '/library/php/twitter_oauth/user_timeline.php?screen_name=' + window.socialObject.twitter};
            if(window.socialObject.youtube) _feeds.youtube = { data: window.socialObject.youtube};
            if(window.socialObject.google) _feeds.google = { data: window.socialObject.google};
            if(window.socialObject.instagram) _feeds.instagram = { data: this.themePath + '/library/php/instagram_auth/instagram.php?username=' + window.socialObject.instagram};
            if(window.socialObject.facebook) _feeds.facebook_page = { data: this.themePath + '/library/php/facebook_auth/facebook_page.php?page_id=' + window.socialObject.facebook};
            if(window.socialObject.tumblr) _feeds.tumblr = { data: window.socialObject.tumblr};
            if(window.socialObject.vimeo) _feeds.vimeo = { data: window.socialObject.vimeo};
            if(window.socialObject.flickr) _feeds.flickr = { data: window.socialObject.flickr};

            Logger.info(JSON.stringify(_feeds));

            var timelineItemWidth = '637px';
            switch (ref.viewport().screensize) {
                case 'screen_xs':
                    timelineItemWidth = '220px';
                    break;
                case 'screen_sm':
                    timelineItemWidth = '300px';
                    break;
                case 'screen_md':
                    timelineItemWidth = '400px';
                    break;
                case 'screen_lg':
                    timelineItemWidth = '520px';
                    break;
                case 'screen_xlg':
                    timelineItemWidth = '600px';
                    break;
            }

            $newsfeedContainer.dpSocialTimeline({
                feeds: _feeds,
                custom:
                {
                    'rss': {
                        name: 'rss',
                        /*url: 'http://wartegarten.de/codeweekawards/site/?feed=rss2',*/
                        /*url: 'http://feeds.feedburner.com/1stwebdesigner',*/
                        url: window.socialObject.rss,
                        limit: 10
                    }
                },
                timelineItemWidth:   timelineItemWidth,
                columnsItemWidth: '200px',
                oneColumnItemWidth: '100%',
                allowMultipleFilters: false,
                showLayout: false,
                skin: 'light',
                share: true,
                addLightbox: false,
                total: 30
            });

        } else {
            $('#indicator-newsfeed').css('display','none');
        }

        // done in CSS3 
        // if(this.deviceType == "computer"){
        //     $('.project-image, .project-desc-wrap').on({
        //         mouseenter: function () {
        //             TweenMax.to($(this).closest('.project'),.2, {scale:1.05, ease:Back.easeInOut});
        //         }
        //     });
        //     $('.project').on({
        //         mouseleave: function () {
        //             TweenMax.to($(this),.2, {scale:1, ease:Sine.easeOut});
        //         }
        //     });
        // }

        // Responsive Video-Embeds
        $('.embed-responsive').fitVids();


        // the image slider
        $('.slick-slider').slick({
              dots: true,
              infinite: false,
              autoplay: true,
              arrows: false,
              speed: 300,
              slidesToShow: 3,
              variableWidth: false,
              responsive: [
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                      variableWidth: false
                    }
                  }
                  // You can unslick at a given breakpoint now by adding:
                  // settings: "unslick"
                  // instead of a settings object
                ]
        });

        ref.initOERList();

        //project less/more buttons
        if($projectMoreWrapper.length > 0){
            $('.project-morebutton').click(function(i){
                $(this).css({display: 'none'});
                $projectMoreWrapper.addClass('open');
                ref.updateProjectScenes();
            }).css('cursor','pointer');

            // move the more button INSIDE the last paragraph in overview to have it inline
            var lastChild = $('.project-overview').children().last();
            
            if(lastChild.length > 0) { 
                if(lastChild[0].tagName == 'P') {
                    $('.project-morebutton').detach().appendTo(lastChild);
                }
            }

            $('.project-lessbutton').click(function(i){
                $('.project-morebutton').css({display: 'inline-block'});
                $projectMoreWrapper.removeClass('open');
                ref.updateProjectScenes();
            }).css('cursor','pointer');
        }

        //more general ... content less/more buttons
        if($contentMoreWrapper.length > 0){
            $('.content-morebutton').click(function(i){
                $(this).css({display: 'none'});
                $contentMoreWrapper.addClass('open');
            }).css('cursor','pointer');

            // move the more button INSIDE the last paragraph in overview to have it inline
            var lastChild = $('.content-overview').children().last();
            
            if(lastChild.length > 0) { 
                if(lastChild[0].tagName == 'P') {
                    $('.content-morebutton').detach().appendTo(lastChild);
                }
            }

            $('.content-lessbutton').click(function(i){
                $('.content-morebutton').css({display: 'inline-block'});
                $contentMoreWrapper.removeClass('open');
                ref.updateProjectScenes();
            }).css('cursor','pointer');
        }
    
        //handle the animations
        //scrollMagicController = new ScrollMagicController(this.pageId, this.deviceType);
        // scrollMagicController.init();

        setTimeout(function(){
            $('.pjs-layer-main').addClass('visible')
        }, 3000);

    };

    Controller.prototype.initMenu = function() {

            var toggles = document.querySelectorAll(".mobile-menu-toggle");
            
            for (var i = toggles.length - 1; i >= 0; i--) {
              var toggle = toggles[i];
              toggleHandler(toggle);
            };

            function toggleHandler(toggle) {
              toggle.addEventListener( "click", function(e) {
                e.preventDefault();
                (this.classList.contains("is-active") === true) ? this.classList.remove("is-active") : this.classList.add("is-active");
                $('body').toggleClass('mobile-menu-open');
            });
            }
    };


    Controller.prototype.initOERList = function()
    {

        var options = {
           valueNames: ['oer-age','oer-year','oer-title','oer-project' ]
            //valueNames: ['name','age' ]

        };

        OERList = new List('oer-list', options);
        console.log(OERList.items);

        // var options = {
        //     valueNames: [ 'name', 'city' ]
        // };

        // hackerList = new List('hacker-list', options);
        // console.log(hackerList);
    };


    Controller.prototype.resize = function()
    {
        // scrollMagicController.init();
        // reset the menu
        $('body').removeClass('mobile-menu-open');
        $(".mobile-menu-toggle").removeClass('is-active');
        
    };

    /*
     *
     * GENERIC HELPERS - GETTER/SETTER FUNCTIONS
     *
     * */

    //this returns the "real" windows width/height as used in media queries (returns Object{ width:x, height:y })
    Controller.prototype.viewport = function()
    {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        var screensize = "screen_xxs";
        if(e[ a+'Width' ] >= ref.breakpoints.screen_xs) screensize = "screen_xs";
        if(e[ a+'Width' ] >= ref.breakpoints.screen_sm) screensize = "screen_sm";
        if(e[ a+'Width' ] >= ref.breakpoints.screen_md) screensize = "screen_md";
        if(e[ a+'Width' ] >= ref.breakpoints.screen_lg) screensize = "screen_lg";
        if(e[ a+'Width' ] >= ref.breakpoints.screen_xlg) screensize = "screen_xlg";

        return { width : e[ a+'Width' ] , height : e[ a+'Height' ], screensize : screensize };
    };

    window.Controller = Controller;

}(window));
