/*
*  Ajax Autocomplete for jQuery, version 1.0.7
*  (c) 2009 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*  Last Review: 07/01/2009
*/

(function(jQuery) {

  jQuery.fn.autocomplete = function(options) {
    return this.each(function() {
      return new Autocomplete(this, options);
    });
  };

  var reEscape = new RegExp( '(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g' );

  var fnFormatResult = function( value, data, currentValue, wordCount )
  {
    var pattern = '(' + currentValue.replace( reEscape, '\\$1' ) + ')';
    if ( wordCount == 1 )
      return value.replace( new RegExp( pattern, 'gi' ), '<strong>$1<\/strong>' ) + ' <span>(' + data + ')</span>';
    else
      return value.replace( new RegExp( pattern, 'gi' ), '<strong>$1<\/strong>' );
  };

  var Autocomplete = function(el, options) {
    this.el = jQuery(el);
    this.el.attr('autocomplete', 'off');
    this.suggestions = [];
    this.data = [];
    this.badQueries = [];
    this.selectedIndex = -1;
    this.currentValue = this.el.val();
    this.intervalId = 0;
    this.cachedResponse = [];
    this.onChangeInterval = null;
    this.ignoreValueChange = false;
    this.serviceUrl = options.serviceUrl;
    this.spinner = options.spinner;
    this.placeholderText = 'Suchbegriff';
    this.wordCount = options.wordCount;
    this.isLocal = false;
    this.options = {
      autoSubmit: false,
      minChars: 1,
      maxHeight: 300,
      deferRequestBy: 0,
      width: 0,
      highlight: true,
      params: {},
      fnFormatResult: fnFormatResult,
      delimiter: null
    };
    if (options) { jQuery.extend(this.options, options); }
    if(this.options.lookup){
      this.isLocal = true;
      if(jQuery.isArray(this.options.lookup)){ this.options.lookup = { suggestions:this.options.lookup, data:[] }; }
    }
    this.initialize();
  };

  Autocomplete.prototype = {

    killerFn: null,

    initialize: function() {

      var me, zindex;
      me = this;

      this.initPlaceholderText();

      zindex = Math.max.apply(null, jQuery.map(jQuery('body > *'), function(e, n) { var pos = jQuery(e).css('position'); if (pos === 'absolute' || pos === 'relative') { return parseInt(jQuery(e).css('z-index'), 10) || 1; } }));

      this.killerFn = function(e) {
        if (jQuery(e.target).parents('.autocomplete').size() === 0) {
          me.killSuggestions();
          me.disableKillerFn();
        }
      };

      var uid = new Date().getTime();
      var autocompleteElId = 'Autocomplete_' + uid;

      if (!this.options.width) { this.options.width = this.el.width(); }
      this.mainContainerId = 'AutocompleteContainter_' + uid;

      jQuery('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:' + zindex + '"><div class="autocomplete-w1"><div class="autocomplete" id="' + autocompleteElId + '" style="display:none; width:' + this.options.width + 'px;"></div></div></div>').appendTo('body');

      this.container = jQuery('#' + autocompleteElId);
      this.fixPosition();
      if (window.opera) {
        this.el.keypress(function(e) { me.onKeyPress(e); });
      } else {
        this.el.keydown(function(e) { me.onKeyPress(e); });
      }
      this.el.keyup(function(e) { me.onKeyUp(e); });
      this.el.blur(function() { me.enableKillerFn(); });
      this.el.focus(function() { me.fixPosition(); });

      this.container.css({ maxHeight: this.options.maxHeight + 'px' });
    },

    initPlaceholderText: function() {
      var me;
      me = this;

      if ( me.placeholderText != '' )
      {
        me.el.each( function()
        {
          var input = jQuery( this );
          var val = input.val();
          if ( val.length < 1 )
            input.val( me.placeholderText );

          input.bind( 'focus', function()
          {
            if ( input.val() == me.placeholderText )
              input.val( '' );
            else
              input.select();
          });
        });
      }
    },

    fixPosition: function() {
      var offset = this.el.offset();
      jQuery('#' + this.mainContainerId).css({ top: (offset.top + this.el.innerHeight()) + 'px', left: offset.left + 'px' });
    },

    enableKillerFn: function() {
      var me = this;
      jQuery(document).bind('click', me.killerFn);
    },

    disableKillerFn: function() {
      var me = this;
      jQuery(document).unbind('click', me.killerFn);
    },

    killSuggestions: function() {
      var me = this;
      this.stopKillSuggestions();
      this.intervalId = window.setInterval(function() { me.hide(); me.stopKillSuggestions(); }, 300);
    },

    stopKillSuggestions: function() {
      window.clearInterval(this.intervalId);
    },

    onKeyPress: function(e) {
      if (!this.enabled) { return; }
      // return will exit the function
      // and event will not fire
      switch (e.keyCode) {
        case 27: //Event.KEY_ESC:
          this.el.val(this.currentValue);
          this.hide();
          break;
        case 9: //Event.KEY_TAB:
        case 13: //Event.KEY_RETURN:
          if (this.selectedIndex === -1) {
            this.hide();
            return;
          }
          this.select(this.selectedIndex);
          if (e.keyCode === 9/* Event.KEY_TAB */) { return; }
          break;
        case 38: //Event.KEY_UP:
          this.moveUp();
          break;
        case 40: //Event.KEY_DOWN:
          this.moveDown();
          break;
        default:
          return;
      }
      e.stopImmediatePropagation();
      e.preventDefault();
    },

    onKeyUp: function(e) {
      switch (e.keyCode) {
        case 38: //Event.KEY_UP:
        case 40: //Event.KEY_DOWN:
          return;
      }
      clearInterval(this.onChangeInterval);
      if (this.currentValue !== this.el.val()) {
        if (this.options.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          var me = this;
          this.onChangeInterval = setInterval(function() { me.onValueChange(); }, this.options.deferRequestBy);
        } else {
          this.onValueChange();
        }
      }
    },

    onValueChange: function() {
      clearInterval(this.onChangeInterval);
      this.currentValue = this.el.val();
      var q = this.getQuery(this.currentValue);
      this.selectedIndex = -1;
      if (this.ignoreValueChange) {
        this.ignoreValueChange = false;
        return;
      }
      if (q === '' || q.length < this.options.minChars) {
        this.hide();
      } else {
        this.getSuggestions(q);
      }
    },

    getQuery: function(val) {
      var d, arr;
      d = this.options.delimiter;
      if (!d) { return jQuery.trim(val); }
      arr = val.split(d);
      return jQuery.trim(arr[arr.length - 1]);
    },

    getSuggestionsLocal: function(q) {
      var ret, arr, len, val;
      arr = this.options.lookup;
      len = arr.suggestions.length;
      ret = { suggestions:[], data:[] };
      for(var i=0; i< len; i++){
        val = arr.suggestions[i];
        if(val.toLowerCase().indexOf(q.toLowerCase()) === 0){
          ret.suggestions.push(val);
          ret.data.push(arr.data[i]);
        }
      }
      return ret;
    },

    getSuggestions: function(q) {
      var cr, me, ls;
      cr = this.isLocal ? this.getSuggestionsLocal(q) : this.cachedResponse[q];
      if (cr && jQuery.isArray(cr.suggestions)) {
        this.suggestions = cr.suggestions;
        this.data = cr.data;
        this.suggest();
      } else if (!this.isBadQuery(q)) {
        me = this;
        me.options.params.query = q;
        //jQuery.get(this.serviceUrl, me.options.params, function(txt) { me.processResponse(txt); }, 'text');
        jQuery.ajax({
          url: this.serviceUrl,
          data: me.options.params,
          beforeSend: function()
          {
            if ( me.spinner == 1 )
            {
              me.el.addClass('autocompleter-loading');
            }
          },
          success: function( txt )
          {
            me.processResponse( txt );
          },
          dataType: 'text'
        }).always( function()
        {
          if ( me.spinner == 1 )
          {
            me.el.removeClass('autocompleter-loading');
          }
        } );
      }
    },

    isBadQuery: function(q) {
      var i = this.badQueries.length;
      while (i--) {
        if (q.indexOf(this.badQueries[i]) === 0) { return true; }
      }
      return false;
    },

    hide: function() {
      this.enabled = false;
      this.selectedIndex = -1;
      this.container.hide();
    },

    suggest: function() {
      if (this.suggestions.length === 0) {
        this.hide();
        return;
      }

      var me, len, div, f;
      me = this;
      len = this.suggestions.length;
      f = this.options.fnFormatResult;
      v = this.getQuery(this.currentValue);
      wc = this.wordCount;
      this.container.hide().empty();
      for (var i = 0; i < len; i++) {
        console.debug(this);
        div = jQuery((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' title="' + this.suggestions[i] + '">' + f(this.suggestions[i], this.data[i], v, wc) + '</div>');
        div.mouseover((function(xi) { return function() { me.activate(xi); }; })(i));
        div.click((function(xi) { return function() { me.select(xi); }; })(i));
        //console.log(div);
        this.container.append(div);
      }
      this.enabled = true;
      this.container.show();
    },

    processResponse: function(text) {
      var response;
      try {
        response = eval('(' + text + ')');
      } catch (err) { return; }
      if (!jQuery.isArray(response.data)) { response.data = []; }
      this.cachedResponse[response.query] = response;
      if (response.suggestions.length === 0) { this.badQueries.push(response.query); }
      if (response.query === this.getQuery(this.currentValue)) {
        this.suggestions = response.suggestions;
        this.data = response.data;
        this.suggest();
      }
    },

    activate: function(index) {
      var divs = this.container.children();
      var activeItem;
      // Clear previous selection:
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        jQuery(divs.get(this.selectedIndex)).attr('class', '');
      }
      this.selectedIndex = index;
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        activeItem = divs.get(this.selectedIndex);
        jQuery(activeItem).attr('class', 'selected');
      }
      return activeItem;
    },

    deactivate: function(div, index) {
      div.className = '';
      if (this.selectedIndex === index) { this.selectedIndex = -1; }
    },

    select: function(i) {
      var selectedValue = this.suggestions[i];
      if (selectedValue) {
        this.el.val(selectedValue);
        if (this.options.autoSubmit) {
          var f = this.el.parents('form');
          if (f.length > 0) { f.get(0).submit(); }
        }
        this.ignoreValueChange = true;
        this.hide();
        this.onSelect(i);
      }
    },

    moveUp: function() {
      if (this.selectedIndex === -1) { return; }
      if (this.selectedIndex === 0) {
        this.container.children().get(0).className = '';
        this.selectedIndex = -1;
        this.el.val(this.currentValue);
        return;
      }
      this.adjustScroll(this.selectedIndex - 1);
    },

    moveDown: function() {
      if (this.selectedIndex === (this.suggestions.length - 1)) { return; }
      this.adjustScroll(this.selectedIndex + 1);
    },

    adjustScroll: function(i) {
      var activeItem, offsetTop, upperBound, lowerBound;
      activeItem = this.activate(i);
      offsetTop = activeItem.offsetTop;
      upperBound = this.container.scrollTop();
      lowerBound = upperBound + this.options.maxHeight - 25;
      if (offsetTop < upperBound) {
        this.container.scrollTop(offsetTop);
      } else if (offsetTop > lowerBound) {
        this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
      }
      //this.el.val(this.suggestions[i]);
    },

    onSelect: function(i) {
      var me, onSelect, getValue, s, d;
      me = this;
      onSelect = me.options.onSelect;
      getValue = function(value) {
        var del, currVal;
        del = me.options.delimiter;
        currVal = me.currentValue;
        if (!del) { return value; }
        var arr = currVal.split(del);
        if (arr.length === 1) { return value; }
        return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
      };
      s = me.suggestions[i];
      d = me.data[i];
      me.el.val(getValue(s));
      if (jQuery.isFunction(onSelect)) { onSelect(s, d); }
    }

  };

})(jQuery);
