/*SVN Add-ins
$Rev:: 15128         $: Revision of last commit
$Author:: abod       $: Author of last commit
$Date:: 2013-10-23 1#$: Date of last commit
Authors: JDE
Copyright (c) A&B One Digital GmbH
*/
/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/*
    docbehaviour.js (body, dom)
    fuer MIN13002 (Komm mach MINT)
    28.01.2013 JDE
*/
/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* default vars    */
var lang='de';
var path = '/extension/silver.project/design/silver.project/';
var path_styleimg = path + 'stylesheets/';
var path_img = path + 'images/';
var tb_pathToImage = path_img+'loadingAnimation.gif';
var pageurl = String(location.protocol+'//'+location.host+location.pathname)||  'http://www.komm-mach-mint.de'; 
var epageurl = encodeURIComponent(pageurl);


/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* default options (woptions = wording, eoptions = domelems, doptions = domoptions ) */

var wording = {
  'general':{
    'hintlinkextern': {
      'de': 'externer Link - &ouml;ffnet in neuem Fenster',
      'en': 'external link opens new window'
    },
    'hintnewwindow': {
      'de': '&ouml;ffnet in neuem Fenster',
      'en': 'opens new window'
    }
  },
  'toggle_fvalue': {
    'search': {
      'de': 'Suchbegriff',
      'en': 'search term'
    }
  },
  'write_printlink':{
    'linktxt': {
      'de': 'Drucken',
      'en': 'print'
    },
    'linktitle': {
      'de': 'diese Seite ausdrucken',
      'en': 'print this page'
    }
  },
  'initialize_startpage_topteaser': {
    'browsetxt' : '<span class="out">Aktuelle Nachricht: </span>',
    'prevalt': 'vorherige Nachricht anzeigen',
    'nextalt': 'n&auml;chste Nachricht anzeigen',
    'head': 'Bl&auml;tterfunktion'
  },
  'initialize_page_blockquote': {
    'browsetxt' : '<span class="out">Aktuelles Zitat: </span>',
    'prevalt': 'vorheriges Zitat anzeigen',
    'nextalt': 'n&auml;chstes Zitat anzeigen',
    'head': 'Bl&auml;tterfunktion'
  },
  'lighbox_thickbox': {
    'tb_loadimg': {
      'de' : 'Bitte warten, das Bild wird geladen',
      'en' : 'Please wait, the picture is loading'
    },
    'tb_closeimg': {
      'de' : 'Großansicht schließen',
      'en' : 'Close enlarged picture'
    },
    'tb_loaderror' : {
      'de' : 'Die Großversion des Bildes konnte nicht geladen werden',
      'en' : 'The enlarged picture could not be loaded.'
    },
    'tb_titletxt' : {
      'de' : 'Großversion des Bildes einblenden',
      'en' : 'Show enlarged picture'
    },
    'tb_iframetitletxt' : {
      'de' : 'Lightbox einblenden',
      'en' : 'Show lightbox'
    }
  },
  'partnerlogo': {
    'playAlt': {
      'de' : 'Animation fortzusetzen',
      'en' : 'continue animation'
    },
    'stopAlt': {
      'de' : 'Animation anhalten',
      'en' : 'stop animation'
    }
  },
  'socialmediabuttons': {
    'smhead': {
      'de': '\"Komm mach MINT\" in den soziale Netzwerken',
      'en': '\"Komm mach MINT\" and social networks'
    },
    'smsocdefault': {
      'de': (function(a){ return 'Best&auml;tige mit OK, um den Artikel auf dem sozialen Netzwerk <span class="soc_name">'+a+'</span> zu empfehlen.'; }),
      'en': (function(a){ return 'Please use the OK button to confirm that you want to recommend this article in the chosen social network<span class="soc_name">'+a+'</span>'; })
    },
    'smsharehead': {
      'de': 'Best&auml;tigen f&uuml;r mehr Datenschutz:',
      'en': 'Privacy Protection:'
    },
    'smsocmore': {
      'de': 'Nach Deiner Empfehlung werden keinerlei Daten mehr an an Dritte gesendet.',
      'en': 'privacy protection:'
    },
    'smclick': {
      'de': 'Mehr dazu hier: <a target="_blank" title="&ouml;ffnet in neuem Fenster" href="/Datenschutz">Informationen zum Datenschutz</a>',
      'en': 'Read our <a target="_blank" title="opens new window" href="/Datenschutz">Privacy Policy</a>'
    }
  },
  'interviewlist': {
    'browsetxt' : '<span class="out">Aktuelle Seite mit Interviews: </span>',
    'prevalt': 'vorherige Interviews anzeigen',
    'nextalt': 'n&auml;chste Interviews anzeigen',
    'head': 'Bl&auml;tterfunktion'
  },
  'gallery':{
    'browsetxt' : '<span class="out">Aktuelles Set mit Bildern: </span>',
    'prevalt': 'vorherige Bilderset anzeigen',
    'nextalt': 'n&auml;chste Bilderset anzeigen',
    'head': 'Bl&auml;tterfunktion'
  },
  'initialize_flickrbox':{
    'thumbtitle': 'Detailinformationen zum Bild einblenden',
    'altCloseBtn': 'Box schlie&szlig;en'
  },
  'terminlisttoggle':{
    'headsuffixo': {
      'de': 'Details anzeigen',
      'en': 'show details'
    },
    'headsuffixc': {
      'de': 'Details ausblenden',
      'en': 'hide details'
    }
  }
};

var domelems = {
  'general':{ },
  'toggle_fvalue':{ },
  'write_printlink': {
    'de': (function(){ return '<a id="soc_print" href="javascript:jQuery(this).countSocPrint();window.print()" title="'+wording.write_printlink.linktitle.de+'">'+wording.write_printlink.linktxt.de+'</a>'; }),
    'en': (function(){ return '<a id="soc_print" href="javascript:jQuery(this).countSocPrint();window.print()" title="'+wording.write_printlink.linktitle.en+'">'+wording.write_printlink.linktxt.en+'</a>'; })   
  },
  'initialize_startpage_topteaser': {},
  'initialize_page_blockquote': {},
  'lighbox_thickbox': {
    'de': (function(){ var btclass=domoptions.lighbox_thickbox.tboverlayd; if(is_mac_ff) btclass=domoptions.lighbox_thickbox.tboverlayc; return '<div style="display: none;" id="'+domoptions.lighbox_thickbox.tboverlay+'" class="TB_overlayBG"></div><div style="display: none;" id="'+domoptions.lighbox_thickbox.tbwindow+'"><div id="'+domoptions.lighbox_thickbox.tbclose+'"><a id="'+domoptions.lighbox_thickbox.tbclosea+'" href="#content"><img src="'+domoptions.general.closeImage+'" alt="'+wording.lighbox_thickbox.tb_closeimg.de+'" /></a></div></div><div style="display: none;" id="'+domoptions.lighbox_thickbox.tbload+'"><img alt="'+wording.lighbox_thickbox.tb_loadimg.de+'." src="'+tb_pathToImage+'"/></div>'; }),
    'en': (function(){ var btclass=domoptions.lighbox_thickbox.tboverlayd; if(is_mac_ff) btclass=domoptions.lighbox_thickbox.tboverlayc; return '<div style="display: none;" id="'+domoptions.lighbox_thickbox.tboverlay+'" class="TB_overlayBG"></div><div style="display: none;" id="'+domoptions.lighbox_thickbox.tbwindow+'"><div id="'+domoptions.lighbox_thickbox.tbclose+'"><a id="'+domoptions.lighbox_thickbox.tbclosea+'" href="#content"><img src="'+domoptions.general.closeImage+'" alt="'+wording.lighbox_thickbox.tb_closeimg.en+'" /></a></div></div><div style="display: none;" id="'+domoptions.lighbox_thickbox.tbload+'"><img alt="'+wording.lighbox_thickbox.tb_loadimg.en+'." src="'+tb_pathToImage+'"/></div>'; })
  },
  'partnerlogo': {
    'de': (function(){ return '<p class="'+domoptions.partnerlogo.statusImage+'"><a href="javascript:stop_animation();"><img src="'+domoptions.partnerlogo.stopImage+'" alt="'+wording.partnerlogo.stopAlt.de+'" /></a></p>'; }),
    'en': (function(){ return '<p class="'+domoptions.partnerlogo.statusImage+'"><a href="javascript:stop_animation();"><img src="'+domoptions.partnerlogo.stopImage+'" alt="'+wording.partnerlogo.stopAlt.en+'" /></a></p>'; })
  },
  'socialmediabuttons': {
    'de': (function(){ return '<h2 class="out">'+wording.socialmediabuttons.smhead.de+'</h2><div id="'+domoptions.socialmediabuttons.promptid+'"></div><div class="clearer"></div>'; }),
    'en': (function(){ return '<h2 class="out">'+wording.socialmediabuttons.smhead.de+'</h2><div id="'+domoptions.socialmediabuttons.promptid+'"></div><div class="clearer"></div>'; })
  },
  'interviewlist': {},
  'gallery':{},
  'initialize_flickrbox':{
    'closebtn': (function(){ return '<div class="close"><a href="#"><img alt="'+wording.initialize_flickrbox.altCloseButton+'" src="'+domoptions.general.closeImage+'" /></a></div>';})
  },
  'terminlisttoggle':{
  }
};

var domoptions = {
  'general':{
    'closeImage': '/extension/silver.project/design/silver.project/images/ico_close.png'
  },
  'toggle_fvalue':{ },
  'write_printlink': { },
  'initialize_startpage_topteaser': {
    'container' : '#startslider',
    'nojscontainer': '#startslider noscript',
    'teaser' : '#startslider div.tscript',
    'browse' : '#startslider .browse',
    'browseval' : '#startslider .browse strong.current',
    'browseprev': '#startslider .browse a.prev',
    'browsenext': '#startslider .browse a.next'
  },
  'initialize_page_blockquote': {
    'container' : '#slidersmall',
    'morelink' : '.big div.morelink',
    'teaser' : '#slidersmall div.tscript',
    'browse' : '#slidersmall .browse',
    'browseval' : '#slidersmall .browse strong.current',
    'browseprev': '#slidersmall .browse a.prev',
    'browsenext': '#slidersmall .browse a.next'
  },
  'lighbox_thickbox': {
    'tboverlay' : 'TB_overlay',
    'tbwindow' : 'TB_window',
    'tbload' : 'TB_load',
    'tboverlayc' : 'TB_overlayBG',
    'tboverlayd' : 'TB_overlayMacFFBGHack',
    'tbclose': 'TB_closeWindow',
    'tbclosea': 'TB_closeWindowButton',
    'tbcaption': 'TB_caption',
    'tbimage': 'TB_ImageOff',
    'tbimg': 'TB_Image',
    'clink': 'thickbox',
    'cmorebtn': 'more',
    'cframesize': 'framesize'
  },
  'partnerlogo': {
    'delay': 3000, //3-5 Sekunden in Millisekunden
    'containerHeight': 180,
    'containerWidth': null,
    'container': 'partnerlogo',
    'innercontainer': 'left',
    'logolist': 'logolist_',
    'logo': 'logoNo_',
    'current': 'current',
    'last': 'last',
    'statusImage': 'statusImage',
    'playImage': '/extension/silver.project/design/silver.project/images/logoPlay.jpg',
    'stopImage': '/extension/silver.project/design/silver.project/images/logoStop.jpg',   
    'url': '/partnerlogo/list',
    '$container': null,      
    '$currentLogo': null,
    '$logolist': null,
    'interval': null
  },
  'socialmediabuttons': {
    'smid': 'socialmedia',
    'promptid': 'share_privacy',
    'head2click': (function(){ return '<h3>'+wording.socialmediabuttons.smsharehead[lang]+'</h3>'; }),
    'txt2click': (function(a){ return '<p><span class="preface">'+wording.socialmediabuttons.smsocdefault[lang](a)+'</span><span class="soc_more">'+wording.socialmediabuttons.smsocmore[lang]+'</span></p>';  }),
    'privacy2click': (function(){ return '<p>'+wording.socialmediabuttons.smclick[lang]+'</p>'; }),
    'morebtn': (function(a, b){ return '<div class="morelink"><p><a target="_blank" title="'+wording.general.hintnewwindow[lang]+'" class="'+domoptions.lighbox_thickbox.cmorebtn+' soc_button" id="'+b+'" href="'+a+'" onclick="jQuery(this).countSoc();">OK</a></p></div>'; }),
    'smitems': {
      'fb': {
        'url': (function(){ return 'http://www.facebook.com/sharer.php?u='+epageurl; }),
        'prefix': 'Facebook',
        'lang': 'lang="en"',
        'title': 'Auf Facebook teilen',
        'alt': 'teilen',
        'langalt': '',
        'extern': true,
        'src': '/extension/silver.project/design/silver.project/images/button_facebook.gif',
        'soc_id': (function(){ return 'soc_facebook'; })
      },
      'twitter': {
        'url': (function(){ var contenthead = jQuery('#path p strong').text() || jQuery('#main #headerTop h2 span').text() || 'Komm mach Mint'; return 'http://twitter.com/share?url='+epageurl+'&amp;via=komm_mach_mint&amp;text='+contenthead; }),
        'prefix': 'Twitter',
        'lang': '',
        'title': 'Zwitscher es deinen Freunden',
        'alt': 'Artikel zwitschern',
        'langalt': '',
        'extern': true,
        'src': '/extension/silver.project/design/silver.project/images/button_twitter.gif',
        'soc_id': (function(){ return 'soc_twitter'; })
      },
      'xing': {
        'url': (function(){ var contenthead = jQuery('#path p strong').text() || jQuery('#main #headerTop h2 span').text() || 'Komm mach Mint'; return 'https://www.xing.com/app/user?op=share;url='+epageurl+';title='+contenthead; }),
        'prefix': 'Xing',
        'lang': '',
        'title': 'Ihren XING-Kontakten zeigen',
        'alt': 'Kontakten zeigen',
        'langalt': '',
        'extern': true,
        'src': '/extension/silver.project/design/silver.project/images/button_xing.gif',
        'soc_id': (function(){ return 'soc_xing'; })
      },
      'rss': {
        'url': (function(){  return '/rss/feed/news'; }),
        'prefix': 'Nachrichten',
        'lang': '',
        'title': 'Nachrichten von komm-mach-mint als RSS aufrufen',
        'alt': 'RSS Feed',
        'langalt': 'lang="en"',
        'extern': false,
        'src': '/extension/silver.project/design/silver.project/images/button_rss.gif',
        'soc_id': (function(){ return 'soc_rss'; })
      }
    }
  },
  'interviewlist': {
    'cscript': 'js_styles',
    'cpic': 'pic',
    'cbrowse': 'browse',
    'cprevbrowse': 'prev',
    'cnextbrowse': 'next',
    'ajax_type': 'GET',
    'ajax_data': '',
    'ajax_detail': 'interview-detail',
    'ajax_box': 'interview-container'
  },
  'gallery':{
    'cscript': 'js_styles',
    'cpic': 'pic',
    'cbrowse': 'browse',
    'cprevbrowse': 'prev',
    'cnextbrowse': 'next'
  },
  'initialize_flickrbox':{
    'div_lb': 'tooltip',
    'div_thumb': 'photo',
    'grid': 'flickr-grid'
  },
  'terminlisttoggle':{
    'chead': 'headerLeft',
    'cdetail': 'event_description',
    'iddetail': 'event_desc_'
  }
};

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* general funcs   */


/* get options of object */
var getOptions = function(key, options){
  var result = null;
  if ('object' == typeof(options)) {
    result = options[key];
  }
  if (!result) { return ""; }
  return result;
}; 

/* add func to load event */
var addLoadEvent = function(func_name){
  var lastonload = window.onload;
  if (typeof window.onload != 'function') { window.onload = func_name; }
  else { window.onload = function() { lastonload(); func_name(); } }
};

/* set focus to dom object: param obj */
var set_newfocus = function(focusobj){ 
  try{ 
    if(focusobj) focusobj.focus(); 
  }catch(err){ 
  } 
};

/* set focus to dom object: param id */
var set_newfocusID = function(fid){
  var focusobj = document.getElementById(fid);
  if(focusobj) focusobj.focus();
};

/* change src-Attribut of img elem in container */
var switch_imgsrc = function(container, old,replace){
  if('object' == typeof(jQuery(container).find('img'))){ 
    var isrc = jQuery(container).find('img').attr('src'); 
    jQuery(container).find('img').attr('src', isrc.replace(old,replace)); 
  }
};

/* set tabindex='0' to create focussable container,
   remove other tabindeces  */
var set_tabindex = function(remobj,setobj,i){
  if(typeof(remobj)=='object'){
    remobj.removeAttr('tabindex');
  }
  if(typeof(setobj)=='object'){
    setobj.attr('tabindex',i);
  }
};

/* count dom elems with certain markup */
var count = function(jqdom){
  var num = 0;
  jQuery(jqdom).each(function() {
    num++; 
  });
  return num;
};

Array.prototype.shuffle = function(){
  var tmp, rand;
  for(var i =0; i < this.length; i++){
    rand = Math.floor(Math.random() * this.length);
    tmp = this[i]; 
    this[i] = this[rand]; 
    this[rand] =tmp;
  }
};

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
  }
}

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* funcs top teaser   */
var lOptionsTeaser = jQuery.extend({}, domoptions.initialize_startpage_topteaser, domelems.initialize_startpage_topteaser, wording.initialize_startpage_topteaser);

var set_ttactive = function(num, nummax){
  if(iev > 5 && iev < 8){
    jQuery(lOptionsTeaser.teaser).each(function(){
      jQuery(this).css({display: 'none'});
      jQuery('#startslider').css({display: 'inline',position: 'relative'});
    });
    jQuery(lOptionsTeaser.teaser+':nth-child('+num+')').fadeIn(1, function () {
      jQuery(lOptionsTeaser.teaser).removeAttr('tabindex');
      jQuery(this).attr('tabindex','0');
      set_newfocus(this);
      write_ttbrowse(num, nummax);
      handle_ttbrowseclick(num, nummax);
      jQuery('#startslider').css({display: 'block',position: 'static'});

    });
  }else{
    jQuery(lOptionsTeaser.teaser).attr('style', 'display: none');
    jQuery(lOptionsTeaser.teaser+':nth-child('+num+')').fadeIn(500, function () {
      jQuery(lOptionsTeaser.teaser).removeAttr('tabindex');
      jQuery(this).attr('tabindex','0');
      set_newfocus(this);
      write_ttbrowse(num, nummax);
      handle_ttbrowseclick(num, nummax);
    });
  }
};

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* small browserslider
*/
var write_ttbrowse = function(num, nummax){
  jQuery(lOptionsTeaser.browse+' div:first').empty().append('<h3 class="out">'+lOptionsTeaser.head+'</h3><p><a class="prev noprint" href="#nachricht"><img src="'+path_img+'browse_rew_big.gif" alt="'+lOptionsTeaser.prevalt+'" /></span></a><span class="out"> / </span><strong class="current">('+lOptionsTeaser.browsetxt+num+' von '+nummax+')</strong><span class="out"> / </span><a class="next noprint" href="#nachricht"><span class="noborder"><img src="'+path_img+'browse_ff_big.gif" alt="'+lOptionsTeaser.nextalt+'" /></span></a></p>')
};


var handle_ttbrowseclick = function(num, nummax){
  if(num > nummax && num < 1){
    num = 1;
  }
  var next = num + 1, prev = num - 1;
  if(num == nummax) next = 1;
  else if(num == 1) prev = nummax;

  jQuery(lOptionsTeaser.browseprev).click(function(e) {
    e.preventDefault();
    set_ttactive(prev,nummax);
  });
  jQuery(lOptionsTeaser.browsenext).click(function(e) {
    e.preventDefault();
    set_ttactive(next,nummax);
  });
};


/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* funcs testimonials
*/
var lOptionsBlockquote = jQuery.extend({}, domoptions.initialize_page_blockquote, domelems.initialize_page_blockquote, wording.initialize_page_blockquote);


var set_tblactive = function(num, nummax){
  if(iev > 5 && iev < 8){
    jQuery(lOptionsBlockquote.teaser).each(function(){
      jQuery(this).css({display: 'none'});
      jQuery('#slidersmall').css({display: 'inline',position: 'relative'});
     /*  jQuery('.content.first').css({float: 'none'}); */
    });
    jQuery(lOptionsBlockquote.teaser+':nth-child('+num+')').fadeIn(1, function () {
      jQuery(lOptionsBlockquote.teaser).removeAttr('tabindex');
      jQuery(this).attr('tabindex','0');
      set_newfocus(this);
      write_tblbrowse(num, nummax);
      handle_tblbrowseclick(num, nummax);
      jQuery('#slidersmall').css({display: 'block',position: 'static'});

    });
  }else{
    jQuery(lOptionsBlockquote.teaser).attr('style', 'display: none');
    jQuery(lOptionsBlockquote.teaser+':nth-child('+num+')').fadeIn(500, function () {
      jQuery(lOptionsBlockquote.teaser).removeAttr('tabindex');
      jQuery(this).attr('tabindex','0');
      set_newfocus(this);
      write_tblbrowse(num, nummax);
      handle_tblbrowseclick(num, nummax);
    });
  }
};

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* big browserslider
*/
var write_tblbrowse = function(num, nummax){
  jQuery(lOptionsBlockquote.browse+' div:first').empty().append('<h3 class="out">'+lOptionsBlockquote.head+'</h3><p><a class="prev noprint" href="#Testimonial"><img width="17" height="17" src="'+path_img+'browse_rew.gif" alt="'+lOptionsBlockquote.prevalt+'"></span></a><span class="out"> / </span><strong class="current">('+lOptionsBlockquote.browsetxt+num+' von '+nummax+')</strong><span class="out"> / </span><a class="next noprint" href="#Testimonial"><span class="noborder"><img width="17" height="17" src="'+path_img+'browse_ff.gif" alt="'+lOptionsBlockquote.nextalt+'"></span></a></p>')
};


var handle_tblbrowseclick = function(num, nummax){
  if(num > nummax && num < 1){
    num = 1;
  }
  var next = num + 1, prev = num - 1;
  if(num == nummax) next = 1;
  else if(num == 1) prev = nummax;

  jQuery(lOptionsBlockquote.browseprev).click(function(e) {
    e.preventDefault();
    set_tblactive(prev,nummax);
  });
  jQuery(lOptionsBlockquote.browsenext).click(function(e) {
    e.preventDefault();
    set_tblactive(next,nummax);
  });
};
/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* funcs thickbox image
*/
var initiate_tblightbox = function($initlink,tb_options,tb_src,tb_alt,tb_caption, is_gallery, is_iframe){

  try{
    var pagesize=tb_getPageSize();
    var x=pagesize[0]-150;
    var y=pagesize[1]-150;
    var TB_WIDTH= 300;
    var TB_HEIGHT=300;

    if(!is_iframe){ /*image*/
      var tb_img = new Image();
      tb_img.onload = function() {
        tb_img.onload=null;
        var imageWidth=tb_img.width;
        var imageHeight=tb_img.height;
        if(imageWidth>x){
          imageHeight=imageHeight*(x/imageWidth);
          imageWidth=x;
          if(imageHeight>y){
            imageWidth=imageWidth*(y/imageHeight);
            imageHeight=y;
          }
        }else if(imageHeight>y){
          imageWidth=imageWidth*(y/imageHeight);
          imageHeight=y;
          if(imageWidth>x){
            imageHeight=imageHeight*(x/imageWidth);
            imageWidth=x;
          }
        }
        TB_WIDTH=imageWidth+30;
        TB_HEIGHT=imageHeight+60;
        jQuery("#TB_window").css({marginLeft:'-'+parseInt((TB_WIDTH/2),10)+'px',width:TB_WIDTH+'px'});
        if(!(iev > 1 && iev < 7)){
        	jQuery("#TB_window").css({marginTop:'-'+parseInt((TB_HEIGHT/2),10)+'px'});
        }
        var tbcontent = '<div id="'+tb_options.tbimage+'"><img width="'+imageWidth+'" height="'+imageHeight+'" id="'+tb_options.tbimg+'" src="'+tb_src+'" alt="'+tb_alt+'" /></div>';
        if(tb_caption){
          if(is_gallery){
            tbcontent += '<div id="'+tb_options.tbcaption+'">'+tb_caption+'</div>';
          }else{
            tbcontent += '<div id="'+tb_options.tbcaption+'"><p>'+tb_caption+'</p></div>';
          }
        }
        tbcontent += '<div id="'+tb_options.tbclose+'"><a href="#" id="'+tb_options.tbclosea+'"><img src="'+domoptions.general.closeImage+'" alt="'+tb_options.tb_closeimg[lang]+'" /></a></div>';
        open_tblightbox($initlink,tb_options,tbcontent,is_iframe);
      };
      tb_img.onerror =function() {
        jQuery("#TB_window").css({marginLeft:'-'+parseInt((TB_WIDTH/2),10)+'px',width:TB_WIDTH+'px'});
        if(!(iev > 1 && iev < 7)){
          jQuery("#TB_window").css({marginTop:'-'+parseInt((TB_HEIGHT/2),10)+'px'});
        }
        var tbcontent = '<div id="'+tb_options.tbimage+'"></div>'
        if(tb_caption){
          if(is_gallery){
            tbcontent += '<div id="'+tb_options.tbcaption+'">'+tb_caption+'</div>';
          }else{
            tbcontent += '<div id="'+tb_options.tbcaption+'"><p>'+tb_caption+'</p></div>';
          }
        }
      };
      tb_img.src = tb_src;
    }else{ /*iframe*/
      if(!(tb_options.frameheight&&tb_options.framewidth) || (tb_options.framewidth > x)){
        TB_WIDTH=x;
        TB_HEIGHT=y;
        jQuery("#TB_window").css({marginLeft:'-'+parseInt((TB_WIDTH/2),10)+'px',width:TB_WIDTH+'px'});
        if(!(iev > 1 && iev < 7)){
        	jQuery("#TB_window").css({marginTop:'-'+parseInt((TB_HEIGHT/2),10)+'px'});
        }
        var smallframe = ' ';
        if(tb_options.framewidth > x || 1020 > x ) smallframe = ' class="small" ';
        var tbcontent = '<iframe frameborder="0" title="'+tb_alt+'"'+smallframe+'src="'+tb_src+'" width="100%" style="max-height: '+y+'px" height="'+y+'"></iframe>';
        tbcontent += '<div id="'+tb_options.tbclose+'"><a href="#" id="'+tb_options.tbclosea+'"><img src="'+domoptions.general.closeImage+'" alt="'+tb_options.tb_closeimg[lang]+'" /></a></div>';
        open_tblightbox($initlink,tb_options,tbcontent,is_iframe);
      }else{
        TB_WIDTH=tb_options.framewidth;
        TB_HEIGHT=tb_options.frameheight+60;
        jQuery("#TB_window").css({marginLeft:'-'+parseInt((TB_WIDTH/2),10)+'px',width:TB_WIDTH+'px'});
        if(!(iev > 1 && iev < 7)){
          if((TB_HEIGHT + parseInt((TB_HEIGHT/2),10) > y)){
        	  jQuery("#TB_window").css({marginTop:'0px',top: '5%'});
          }else{ 
        	  jQuery("#TB_window").css({marginTop:'-'+parseInt((TB_HEIGHT/2),10)+'px'});
          }
        }
        var tbcontent = '<iframe frameborder="0" title="'+tb_alt+'" src="'+tb_src+'" width="'+tb_options.framewidth+'" style="max-height: '+(y-60)+'px" height="'+tb_options.frameheight+'"></iframe>';
        tbcontent += '<div id="'+tb_options.tbclose+'"><a href="#" id="'+tb_options.tbclosea+'"><img src="'+domoptions.general.closeImage+'" alt="'+tb_options.tb_closeimg[lang]+'" /></a></div>';
        open_tblightbox($initlink,tb_options,tbcontent,is_iframe);
      }
    }

  }catch(err){
    console.log(err);
  }
};

var initiate_smlightbox = function($initlink, options){

  try{
    var sm_options = jQuery.extend({}, options, domoptions.lighbox_thickbox, wording.lighbox_thickbox);
    var pagesize=tb_getPageSize();
    var x=pagesize[0]-150;
    var y=pagesize[1]-150;
    var TB_WIDTH= 400;
    var TB_HEIGHT=300;
    jQuery("#TB_window").css({marginLeft:'-'+parseInt((TB_WIDTH/2),10)+'px',width:TB_WIDTH+'px'});
    if(!(iev > 1 && iev < 7)){
    	jQuery("#TB_window").css({marginTop:'-'+parseInt((TB_HEIGHT/2),10)+'px'});
    }
    var smn = sm_options.smitems[$initlink.attr('class')].prefix || '';
    var soc_type = sm_options.smitems[$initlink.attr('class')].soc_id(); 
    var smcontent = '<div class="prompt content-view-full">'+sm_options.head2click()+sm_options.txt2click(smn)+' '+sm_options.privacy2click()+' '+sm_options.morebtn(sm_options.smitems[$initlink.attr('class')].url(), sm_options.smitems[$initlink.attr('class')].soc_id() )+'</div>';
    smcontent += '<div id="'+sm_options.tbclose+'"><a href="#" id="'+sm_options.tbclosea+'"><img src="'+domoptions.general.closeImage+'" alt="'+sm_options.tb_closeimg[lang]+'" /></a></div>';
    open_tblightbox($initlink,sm_options,smcontent,false);

    /*jQuery('a#'+soc_type).addEventListener('click', function(){
        alert('a#'+ soc_type);
		jQuery.get( 
				'/urlwrapper/logger/social', 
		  		{type : ''+soctype },  //this.attr('id')},  
		  		function(){ 
		  			//alert("Jo" + e.toString());
		  			smfinish(this); 
		  		}
		); 
	});*/

//    jQuery('a#'+ soc_type).initScheduler(soc_type);
    

  }catch(err){
    console.log(err);
  }
};

var close_tblightbox = function($initlink,tb_options){
	jQuery('#'+tb_options.tboverlay+', '+'#'+tb_options.tbwindow).css({'display':'none'});
	jQuery('body,html').removeAttr('style');
	jQuery('#'+tb_options.tbwindow).empty();
  if($initlink) set_newfocus($initlink);
  jQuery('#'+tb_options.tbwindow).removeAttr('tabindex');
  jQuery('#'+tb_options.tboverlay+',#'+tb_options.tbwindow).off();
};

var open_tblightbox = function($initlink,tb_options,tbcontent,is_iframe){
	jQuery('#'+tb_options.tbwindow).empty().append(tbcontent);
	jQuery('#'+tb_options.tboverlay+', '+'#'+tb_options.tbwindow).css({'display':'block'});
  /*if(!is_iframe){*/
	jQuery('body','html').css({height:'100%',width:'100%'});
	jQuery("html").css('overflow','hidden');
  /*}*/
	jQuery('#'+tb_options.tbwindow).attr('tabindex','0');
  set_newfocus(jQuery('#'+tb_options.tbwindow));
  jQuery('#'+tb_options.tboverlay+',#'+tb_options.tbwindow).on({
    click: function(e){ 
      e.stopPropagation();
      if(e.target.nodeName != 'A'){
        e.preventDefault();
        close_tblightbox($initlink,tb_options)
      }else{
        $t = jQuery(e.target);
        if(!opentarget($t,$initlink,tb_options)) e.preventDefault();
      }
    }
  });
};

var opentarget = function($t, $initlink, tb_options){
  if($t.attr('id') && $t.attr('id') == tb_options.tbclosea){
    close_tblightbox($initlink,tb_options);
    return false;
  }else if($t.attr('class') && $t.attr('class') == tb_options.cmorebtn){
    close_tblightbox($initlink,tb_options);
    return tblinkbehaviour($initlink, 800,600);
   
  }else{
   return true
  }
};

var p = null;
var pdown = function() {
  if (p && !p.closed) p.close();
};

var tblinkbehaviour = function($initlink,w,h){
  var purl = $initlink.attr('href');
  if (!purl) return true;
  w = (w) ? w += 20 : 150;  /* default: 150px*150px */
  h = (h) ? h += 25 : 150;
  var args = 'width='+w+',height='+h+',resizable';
  pdown();
  p = window.open(purl,'',args);
  return (p) ? false : true;
}

window.onunload = pdown;

var init_overlay = function(markup){
  jQuery('body').append(markup);
};

var tb_parseQuery = function(query){
  var params={};
  if(!query){
    return params;
  }
  var pairs=query.split(/[;&]/);
  for(var i=0;i<pairs.length;i++){
    var keyVal=pairs[i].split('=');
    if(!keyVal||keyVal.length!=2){
      continue
    }
    var key=unescape(keyVal[0]);
    var val=unescape(keyVal[1]);
    val=val.replace(/\+/g,' ');
    params[key]=val;
  }

  return params;
};

var tb_getPageSize = function(){
  var de=document.documentElement;
  var w=window.innerWidth||self.innerWidth||(de&&de.clientWidth)||document.body.clientWidth;
  var h=window.innerHeight||self.innerHeight||(de&&de.clientHeight)||document.body.clientHeight;
  arrayPageSize=[w,h];
  return arrayPageSize
};

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* funcs partnerbox
*/
var initiate_animation = function(){
}

var stop_animation = function(){
  window.clearInterval(domoptions.partnerlogo.interval);
  toggle_animation(domoptions.partnerlogo.statusImage,'start_animation()',domoptions.partnerlogo.playImage,wording.partnerlogo.playAlt[lang]);
};

var start_animation = function(){
  nextLogo();  
  toggle_animation(domoptions.partnerlogo.statusImage,'stop_animation()',domoptions.partnerlogo.stopImage,wording.partnerlogo.stopAlt[lang]);
};

var nextLogo = function(){
  try{
    var num = 0,newnum = 1;
    var $curr = jQuery('.'+domoptions.partnerlogo.container).find('li.'+domoptions.partnerlogo.current);

    var tmp = String($curr.attr('class'));
    tmp = tmp.replace(domoptions.partnerlogo.current,'');
    tmp = tmp.replace(domoptions.partnerlogo.last,'');
    tmp = tmp.replace(domoptions.partnerlogo.logo,'');
    tmp = tmp.trim();
    num = parseInt(tmp);

    if(!isNaN(num)){ 
      if($curr.hasClass('last')){
        newnum = 1;
      }else{
        newnum = num+1;
      }
      $newcurr = jQuery('.'+domoptions.partnerlogo.container).find('li').eq(newnum);
      $curr.css({'z-index': '100','opacity':'0'}).removeClass(domoptions.partnerlogo.current);
      $newcurr.css({'z-index': '200','opacity':'0'}).addClass(domoptions.partnerlogo.current).animate({ opacity: 1 }, 800, function() { });
    }
  }catch(err){
    /*console.log(err);*/
  }
  domoptions.partnerlogo.interval = window.setTimeout(nextLogo, domoptions.partnerlogo.delay);
};

var toggle_animation = function(statusImage,method,imgsrc,imgalt){
  jQuery('.'+statusImage+' a').attr('href','javascript: '+method);
  jQuery('.'+statusImage+' a').find('img').attr('src',imgsrc).attr('alt',imgalt);
};


/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* funcs interviewlist
*/
var write_picbrowse = function(c,lOptions){
  (lOptions[c].$cpic).find('div.'+lOptions.cbrowse+' div:first').empty().append('<h3 class="out">'+lOptions.browsetxt+'</h3><p><a class="prev noprint" href="#interview"><span class="noborder"><img alt="'+lOptions.prevalt+'" src="/extension/silver.project/design/silver.project/images/browse_rew_big.gif"></span></a><span class="out"> - </span><strong class="current">'+lOptions.browsetxt+' '+lOptions[c].numpage+' / '+lOptions[c].numpages+'</strong><span class="out"> - </span><a class="next noprint" href="#interview"><span class="noborder"><img src="/extension/silver.project/design/silver.project/images/browse_ff_big.gif" alt="'+lOptions.nextalt+'"></span></a></p>');
};

var handle_picbrowseclick = function(c,lOptions){

  var numpage = lOptions[c].numpage;
  var numpages = lOptions[c].numpages;
  var numpics = lOptions[c].numpics;

  if(numpage > numpages || numpage < 1){ numpage = 1; }
  var nextpage = numpage + 1, prevpage = numpage - 1;
  if(numpage == numpages) nextpage = 1;
  else if(numpage == 1) prevpage = numpages;

  (lOptions[c].$cpic).find('div.'+lOptions.cbrowse+' a.'+lOptions.cprevbrowse).click(function(e) {
    e.preventDefault();
    lOptions[c].numpage = prevpage;
    set_picactive(c,lOptions);
  });
  (lOptions[c].$cpic).find('div.'+lOptions.cbrowse+' a.'+lOptions.cnextbrowse).click(function(e) {
    e.preventDefault();
    lOptions[c].numpage = nextpage;
    set_picactive(c,lOptions);
  });
};

var set_picactive = function(c,lOptions){
  var numpage = lOptions[c].numpage;
  jQuery('.'+lOptions.cpic).css({'display': 'none'});
  jQuery('.'+lOptions.cpic+'.pic_'+numpage).fadeIn(500, function () {
    jQuery(this).attr('style', 'display: block');
    set_newfocus(jQuery('.'+lOptions.cpic+'.pic_'+numpage+' a[tabindex!="-1"]:first'));
    write_picbrowse(c,lOptions);
    handle_picbrowseclick(c,lOptions);
  });

};

var handle_picclick = function(c,lOptions){
  jQuery('.'+lOptions.cpic+' a').click(function(e) {
    var $pcontainer = jQuery(this).parents('.'+lOptions.cpic);
    if(!jQuery.isEmptyObject($pcontainer)){
      e.preventDefault();
      if(String($pcontainer.attr('class')).indexOf('active') >= 0){
        
      }else{
        get_interviewdetail(c,lOptions,jQuery(this).attr('href'));
        set_tabindex(jQuery('.'+lOptions.cpic+' a'),jQuery(this),'-1');
        jQuery('.'+lOptions.cpic).removeClass('active');
        $pcontainer.addClass('active');
        set_newfocusID('interview-detail');
      }
    }
  });
};

var handle_picsclick = function(c,lOptions){

};

var get_interviewdetail = function(c,lOptions,url){
  var rtype = lOptions.ajax_type || 'GET';
  var rdata = lOptions.ajax_data || '';
  try{
    jQuery.ajax({
    url: url,
    cache: false,
    type: rtype,
    data: rdata,
    context: document.body,
      success: function(html){
        var htmlElements = jQuery(html);
        for(var i = 0; i < htmlElements.length; i++){
          lbcontent = jQuery(htmlElements[i]).find('#'+lOptions.ajax_detail+' .'+lOptions.ajax_box);
          if(lbcontent.length > 0){
            i = htmlElements.length;
          }
        }
        if(lbcontent.length < 1){
          window.location.replace(url);
        }
        jQuery('#'+lOptions.ajax_detail).empty();
        jQuery('#'+lOptions.ajax_detail).append(lbcontent);
        jQuery('#'+lOptions.ajax_detail+' a.thickbox').lighbox_thickbox(domoptions.lighbox_thickbox, domelems.lighbox_thickbox, wording.lighbox_thickbox);
      }
    });
  }catch(e){
    window.location.replace(url);
  }
}

/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* jquery */ 

;(function(jQuery) {

/* + + + + + + + + + */ 
/* set page language */
(function(l){ if(typeof(l)!= 'undefined' && l.length>=2) lang=l.substr(0,2); })(jQuery("html").attr("lang"));


/* + + + + + + + + + */ 
/* toggle value of input field on blur vs. focus: german / english */
jQuery.fn.toggle_fvalue = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function() {
    var $this = jQuery(this);
    try{
      if(lOptions[lang]){
        $this.attr('value',lOptions[lang]);
        $this.focus(function(){ if(this.value == lOptions[lang]) this.value = ''; });
        $this.blur(function(){ if(this.value == '') this.value = lOptions[lang]; });
      }
    }catch(err){
      /*console.log(err);*/
    }
  });
};


/* + + + + + + + + + */ 
/* add printlink : german / english  */
jQuery.fn.write_printlink = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function() {
    var $this = jQuery(this);
    try{
      if(lOptions[lang]) $this.append('<li class="print"><span>'+lOptions[lang]()+'</span></li>');
    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* topteaser slider: german only   */
jQuery.fn.initialize_startpage_topteaser = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function() {
    var $this = jQuery(this);
    try{
      
      var count = 0;
      jQuery(lOptions.container).attr('aria-live', 'polite');
      jQuery(lOptions.nojscontainer).remove();
      jQuery(lOptions.teaser).each(function(i) {
        count++;
      });
      if(count > 1){
        write_ttbrowse(1, count);
        handle_ttbrowseclick(1, count);
      }
      jQuery(lOptions.teaser+':first').attr('style', 'display: block');
    }catch(err){
      console.log(err);
    }
  });
};

/* + + + + + + + + + */ 
/* testimonials slider german only  */
jQuery.fn.initialize_page_blockquote = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function() {
    var $this = jQuery(this);
    try{
      var count = 0;
      jQuery(lOptions.container).attr('aria-live', 'polite');
      jQuery(lOptions.morelink).addClass('jscript');
      
      jQuery(lOptions.teaser).each(function(i) {
        count++;
      });
      if(count > 1){
        write_tblbrowse(1, count);
        handle_tblbrowseclick(1, count);
      }
      jQuery(lOptions.teaser+':first').attr('style', 'display: block');
    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* thickbox images: german / english  */
jQuery.fn.lighbox_thickbox = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  var imgLoader=new Image();
  imgLoader.src=tb_pathToImage;
  if(!document.getElementById(lOptions.tboverlay)) init_overlay(lOptions[lang]);
  
  var $1stlink = jQuery('body a').first();
  var $lastlink = jQuery('#footer a').last();
  $1stlink.on({
    focus: function(e){ 
      close_tblightbox(false,lOptions);
    }
  });
  $lastlink.on({
    focus: function(e){ 
      close_tblightbox(false,lOptions);
    }
  });
  
  return this.each(function() {
    var $this = jQuery(this);
    try{
      if(lOptions[lang]){

        if(!$this.attr('href').toLowerCase().match(/\.swf$/)) $this.attr('title',lOptions.tb_titletxt[lang]);
        
        $this.removeAttr('target');
        var is_gallery = false;
        if($this.attr('class').indexOf('buttonstyle') >= 0) is_gallery = true;

        $this.on({
          click: function(e){ 
            e.preventDefault();

            var tb_imgsrc ='', tb_imgalt='', tb_imgcaption;
            tb_imgsrc = $this.attr('href') || $this.find('img').attr('src');
            tb_imgalt = $this.has('img').find('img').attr('alt') || $this.text();
            if(is_gallery){
              tb_imgcaption = $this.has('img').parents('div.pic').find('div.txt').clone().html() || null;
            }else{
              tb_imgcaption = $this.has('img').parent('div.image').find('p').clone().html() || null;
            }
            

            var reImg =/\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
            var urlType=tb_imgsrc.toLowerCase().match(reImg);
            if(urlType=='.jpg'||urlType=='.jpeg'||urlType=='.png'||urlType=='.gif'||urlType=='.bmp'){
              initiate_tblightbox($this,lOptions,tb_imgsrc,tb_imgalt,tb_imgcaption,is_gallery,false);
            }else{
              $this.attr('title',lOptions.tb_iframetitletxt[lang]);
              lOptions.frameheight = false;
              lOptions.framewidth = false;
              if(String($this.attr('class')).indexOf(lOptions.cframesize) >=0){
                var classval = String($this.attr('class'));
                var framesize = classval.substring(classval.indexOf(lOptions.cframesize),classval.lastIndexOf('_'));
                var framewidth = framesize.substring(framesize.indexOf('_')+1,framesize.indexOf('x'));
                var frameheight = framesize.substring(framesize.indexOf('x')+1,framesize.length);
                if(!isNaN(Number(frameheight))) lOptions.frameheight = Number(frameheight);
                if(!isNaN(Number(framewidth))) lOptions.framewidth = Number(framewidth);
              }
              initiate_tblightbox($this,lOptions,tb_imgsrc,tb_imgalt,tb_imgcaption,false,true);
            }
          }
        });
      }
    }catch(err){
      /*console.log(err); */
    }
  });
};

/* + + + + + + + + + */ 
/* partnerlogo: german / english  */
jQuery.fn.partnerlogo = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function(c) {
    var $this = jQuery(this);
    try{
      lOptions.$container = $this.parents('.'+lOptions.container);
      $this.attr('id',lOptions.logolist+c);
      var j = count($this.find('li'));
      lOptions.$logolist = $this;
      if(lOptions.$container && j>1){
        lOptions.$container.find('.'+lOptions.innercontainer).attr('aria-live', 'polite');
        lOptions.$currentLogo = lOptions.$logolist.find('li:first');
        lOptions.$logolist.find('li').css({'z-index': '100','opacity':'0'});
        if(lOptions[lang]){
          var p = new Array();
          var cHeight = domoptions.partnerlogo.containerHeight;
          lOptions.$logolist.css({'opacity':'0'}).animate({ opacity: 1 }, 6500, function() { 
            lOptions.$logolist.find('li').each(function(i) {
              jQuery(this).addClass('logoNo_'+i);
              p[i] = new Image();
              p[i].onload = function() {
                p[i].onload;
              }
              p[i].src = jQuery(this).find('img').attr('src');
              if(p[i].onload){            
                var imgHeight=jQuery(this).find('img').height() || 180;
                if(cHeight >= imgHeight){
                  jQuery(this).find('img').css({marginTop:''+parseInt((cHeight-imgHeight)/2)+'px' });
                }
              }
              if(i==j-1){ 
                lOptions.$currentLogo.css({'z-index': '200','opacity':'1'}); 
                lOptions.$currentLogo.addClass("current");
                $this.find('li:nth('+i+')').addClass("last");
                $this.before(lOptions[lang]());
                start_animation();
              }
            });
          });
        }
      }      

    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* socialmediabuttons: german only  */
jQuery.fn.socialmediabuttons = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function(c) {
    var $this = jQuery(this);
    try{
      if(lOptions.de){
        if(c >= 1){
          lOptions.smid = lOptions.smid+'_'+c;
        }
        $this.append(lOptions.de());
        var smlist = '<ul>';
        for (element in lOptions.smitems){
          try{
            var altsuff = ' '+wording.general.hintnewwindow.de;
            if(lOptions.smitems.extern) altsuff = ' '+wording.general.hintlinkextern.de;
            smlist += '<li class="'+element+'"><a target="_blank" title="'+lOptions.smitems[element].title+'" href="'+lOptions.smitems[element].url()+'" class="'+element+'"><span class="out" '+lOptions.smitems[element].lang+'>'+lOptions.smitems[element].prefix+': </span><img src="'+lOptions.smitems[element].src+'" alt="'+lOptions.smitems[element].alt+altsuff+'" '+lOptions.smitems[element].langalt+'/></a></li>';
          }catch(err){ }
        }
        smlist += '</ul>';
        if(smlist.length > 10){
          $this.find('#'+lOptions.promptid).append(smlist);
          jQuery('#'+lOptions.smid+' ul li a:not(.rss)').on({ 
            click: function(e){ 
              e.preventDefault(); 
              initiate_smlightbox(jQuery(this),lOptions);
            } 
          });
        }
      }
    }catch(err){
      console.log(err);
    }
  });
};

/* + + + + + + + + + */ 
/* interviewlist: german only  */
jQuery.fn.interviewlist = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function(c) {
    var $this = jQuery(this);
    try{
      $this.addClass(lOptions.cscript);
      $this.find('div.'+lOptions.cpic).wrapAll('<div class="pics" ></div>');
      var numpics = count($this.find('div.'+lOptions.cpic));
      if(numpics > 4){
        $this.attr('aria-live', 'polite');
        var picobject = {};
        var numpages = Math.round(numpics / 4);
        if(numpics%4 == 1) numpages++;
        for(var page=1;page<=numpages;page++){
          for(var pic=1;pic<5;pic++){
            var nth = (((page-1)*4) + pic);
            if(nth <= numpics){
              $this.find('div.'+lOptions.cpic+':nth-child('+nth+')').addClass('pic_'+page).addClass('pcount_'+nth);
            }
            if(nth > 4){ $this.find('div.'+lOptions.cpic+':nth-child('+nth+')').attr('style','display: none;'); }
          }
        }
        picobject[c] = {};
        picobject[c].numpages = numpages;
        picobject[c].numpics = numpics;
        picobject[c].c = c;
        picobject[c].numpage = 1;
        picobject[c].numpic = 1;
        picobject[c].$cpic = $this;
        jQuery.extend(lOptions, picobject);
        jQuery('#interview-detail').attr('tabindex',0).attr('aria-live', 'polite');
        write_picbrowse(c,lOptions);
        handle_picbrowseclick(c,lOptions);
        handle_picclick(c,lOptions);
      }
    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* gallery: german only  */
jQuery.fn.gallery = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function(c) {
    var $this = jQuery(this);
    try{
      $this.addClass('js_styles');
      $this.find('div.thumbs .pic').wrapAll('<div class="pics" ></div>');
      var numpics = count($this.find('div.thumbs .pic'));
      if(numpics > 16){
        $this.attr('aria-live', 'polite');
        var picobject = {};
        var numpages = Math.round(numpics / 16);
        if(numpics%16 == 1) numpages++;
        for(var page=1;page<=numpages;page++){
          for(var pic=1;pic<17;pic++){
            var nth = (((page-1)*16) + pic);
            if(nth <= numpics){
              $this.find('div.thumbs .pic:nth-child('+nth+')').addClass('pic_'+page).addClass('pcount_'+nth);
            }
            if(nth > 16){ $this.find('div.thumbs .pic:nth-child('+nth+')').attr('style','display: none;'); }
          }
        }
        picobject[c] = {};
        picobject[c].numpages = numpages;
        picobject[c].numpics = numpics;
        picobject[c].c = c;
        picobject[c].numpage = 1;
        picobject[c].numpic = 1;
        picobject[c].$cpic = $this;
        jQuery.extend(lOptions, picobject);
        write_picbrowse(c,lOptions);
        handle_picbrowseclick(c,lOptions);
        handle_picsclick(c,lOptions);        
      }
    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* flickrbox german only  */
jQuery.fn.initialize_flickrbox = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({}, eoptions, doptions, woptions);
  return this.each(function(i) {
    var $this = jQuery(this);
    try{
      var thumbId = $this.parent('.photo').attr('id') || null;
      if(thumbId && thumbId.indexOf(lOptions.div_thumb+'_') >= 0){
        var flickrId = thumbId.replace(lOptions.div_thumb+'_','') || null;
        if(flickrId){
          var lbId = lOptions.div_lb+'_'+flickrId || null;            
          if(lbId && document.getElementById(lbId)){
            $divs_lb = jQuery('.'+lOptions.grid+' .'+lOptions.div_lb);
            $div_lb = jQuery('#'+lbId);
            $div_lb.css({'opacity': '0','display': 'none'});
            $this.attr('title',lOptions.thumbtitle);
            $this.on({
              click: function(e){ 
                try{
                  e.preventDefault();
                  $divs_lb.css({'opacity': '0','display': 'none'});
                  var clbId = String(lOptions.div_lb+'_'+String(jQuery(this).parent('.photo').attr('id')).replace(lOptions.div_thumb+'_',''));
                  if(document.getElementById(clbId)){
                    $cdiv_lb = jQuery('#'+clbId);
                    set_tabindex($divs_lb,$cdiv_lb,0);
                    $cdiv_lb.css({'display':'block'}).animate({ opacity: 1 }, 600, function() {
                      $divs_lb.find('div.close').remove();
                      set_newfocus($cdiv_lb);
                      $cdiv_lb.find('div.inner').prepend(lOptions.closebtn());
                      $cdiv_lb.find('div.close a').on({ click: function(e){ e.preventDefault(); set_tabindex($divs_lb,'',0); set_newfocus($this); $divs_lb.css({'opacity': '0','display': 'none'});  } });
                    });
                  }
                }catch(err){
                  /*console.log(err);*/
                }
              }
            });                
          }
        }
      }
    }catch(err){
      /*console.log(err);*/
    }
  });
};

/* + + + + + + + + + */ 
/* toggle details in terminlisten entries  */
jQuery.fn.terminlisttoggle = function(eoptions, doptions, woptions){
  var lOptions = jQuery.extend({ 
    toggleDetail: function($h,$c,txt, isOpen){
      $h.remove('span.out').append('<span class="out"> '+txt+'</span>');
      if(isOpen){
        $c.slideUp( 'slow', function() { $h.addClass('closed').removeClass('opened'); });
      }else{
        $c.slideDown( 'slow', function() { $h.addClass('opened').removeClass('closed'); });
      }
    }
  }, eoptions, doptions, woptions);
  return this.each(function(c) {
    var $this = jQuery(this);
    try{
      var chead = lOptions.chead, cdetail = lOptions.cdetail, iddetail = lOptions.iddetail,
      suffo = lOptions.headsuffixo[lang], suffc = lOptions.headsuffixc[lang],
      $head = $this.find('div.'+chead+' h4'), $headlink = $head.find('div.'+chead+' h4 a'), $description = $this.find('div.'+cdetail);

      if(($head.length + $description.length)  > 1 && $headlink.length < 1){
        $head.wrapInner('<a href="#'+iddetail+c+'"></a>');
        $description.attr('id',iddetail+c);
        lOptions.toggleDetail($head.find('a'),jQuery($head.find('a').attr('href')),suffo,true);
        $head.find('a').on({ click: function(e){ e.preventDefault(); if(jQuery(this).hasClass('opened')) lOptions.toggleDetail(jQuery(this),jQuery(jQuery(this).attr('href')),suffo, true); else lOptions.toggleDetail(jQuery(this),jQuery(jQuery(this).attr('href')),suffc, false); } });
      }
    }catch(err){
      /*console.log(err);*/
    }
  });
};


/* ++++++++++++++++ */
/* count the hits on social media buttons */
/* starts a GET request to the counting server to scheduler.kompetenzz.net */

jQuery.fn.countSoc = function(){
	
	jQuery.get( 
			'/urlwrapper/logger/social', 
	  		{type : this.attr('id') },  
	  		function(){ 
				; //alert(this.attr('id'));
	  		//	smfinish(this); 
	  		}
	); 
}
jQuery.fn.countSocPrint = function(){
	
	jQuery.get( 
			'/urlwrapper/logger/social', 
	  		{type : 'soc_print' },  
	  		function(){ 
				; //alert(this.attr('id'));
	  		//	smfinish(this); 
	  		}
	); 
}



/*jQuery.fn.initScheduler = function() {
	this.addEventListener('click', function(e){
		jQuery.get( 
				'/urlwrapper/logger/social', 
		  		{type : this.attr('id')},  
		  		function(){ 
		  			alert("Jo" + e.toString());
		  			//smfinish(this);
		  		}
		); 
	});
};
*/
/*
jQuery.fn.smfinish = function($target) {
    _handler    = this;
    href        = $target.attr('href');
    alert(href);
	if (href) {
		socWindow = window.open(href, 'socwindow');
        if (!socWindow) {
        	location.href = href;
        }
	}
};
*/
})(jQuery);


/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */ 
/* execute jQuery funcs on document ready: jQuery(elem).fnname({},{}); */
jQuery(function(jQuery) {
  jQuery('#bottom .pageservice').write_printlink({},domelems.write_printlink,{});
  jQuery('#startslider').initialize_startpage_topteaser(domoptions.initialize_startpage_topteaser, domelems.initialize_startpage_topteaser, wording.initialize_startpage_topteaser);
  jQuery('#slidersmall').initialize_page_blockquote(domoptions.initialize_page_blockquote, domelems.initialize_page_blockquote, wording.initialize_page_blockquote);
  jQuery('a.thickbox').lighbox_thickbox(domoptions.lighbox_thickbox, domelems.lighbox_thickbox, wording.lighbox_thickbox);
  jQuery('#socialmedia.small').socialmediabuttons(domoptions.socialmediabuttons, domelems.socialmediabuttons, wording.socialmediabuttons);
  jQuery('#main .galerie .entry-navigation').interviewlist(domoptions.interviewlist, domelems.interviewlist, wording.interviewlist);
  jQuery('#main .galerie .content-view-children').gallery(domoptions.gallery, domelems.gallery, wording.gallery);
  jQuery('.photo a.flickrbox').initialize_flickrbox(domoptions.initialize_flickrbox, domelems.initialize_flickrbox, wording.initialize_flickrbox);
  jQuery('#page.start .bottomColumn .teaser .image.left ul').partnerlogo(domoptions.partnerlogo, domelems.partnerlogo, wording.partnerlogo);
  jQuery('.class-event_calendar .content-view-line .class-event').terminlisttoggle(domoptions.terminlisttoggle, domelems.terminlisttoggle, wording.terminlisttoggle);


//yy  jQuery('.sc-video-starter').scVideoGallery(); // options
  
  
  
/*  jQuery('a.soc_button').addEventListener('click',
		  function(e){
	  			e.preventDefault(); alert("Jo"); var $this = jQuery(this); jQuery.get( '/urlwrapper/logger/social', {type : $this.attr('id')}, function(){ smfinish($this); }); 
  		}
  );
*/
  
});


/* + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + */
/* execute other funcs on document ready: addLoadEvent(func_name); */

jQuery.noConflict();
jQuery(document).ready(function(jQuery){
    var options     = {
        beforeInit : function(){
        	jQuery('body').append('<div id="pager-container"></div>');
        },
        'targetContainer' : '#pager-container'
    };
    jQuery('a.epager').scEPager(options);
    
    jQuery('input#searchtext , input#Search' ).change(function(){
    	jQuery('#q').val(jQuery(this).val());
    });

   jQuery('.sc-video-starter').scVideoGallery(); 

    
});
