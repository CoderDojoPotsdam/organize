/**
 * Functions for Ajax Live Search (Informatiklexikon).
 *
 **/
var tx_mhajaxsearch_spinner = '1';
var tx_mhajaxsearch_lastq = '';
var tx_mhajaxsearch_keyupdelay = 500;

function tx_mhajaxsearch_trim(_string) {
  while(_string.substring(0, 1) == '') {
    _string = _string.substring(1, _string.length);
  }

  while(_string.substring(_string.length - 1, _string.length) == '')  {
    _string = _string.substring(0, _string.length - 1);
  }

  return _string;
}

function tx_mhajaxsearch_search(_q) {
  _q = tx_mhajaxsearch_trim(_q);

  mhajaxsearch_start_spinner();

  if(tx_mhajaxsearch_spinner != 1) {
    jQuery('#tx_mhajaxsearch_spinner').css('display','inline');
  }

  tx_mhajaxsearch_lastq = _q;
  tx_mhajaxsearch_pi1Search(_q);
}


function init2() {
  jQuery('#tx_mhajaxsearch_q').attr('name','tx_mhajaxsearch_q');
	if (jQuery('#tx_mhajaxsearch_q').val() == 'Fachbegriff') {
		jQuery('#tx_mhajaxsearch_q').val('');
	}
}

function search2() {

	var input = jQuery('#tx_mhajaxsearch_q');
	// Don't update live-search if it's got the same value as last time
	if ((input.val().length >= 3) && (input.val() != input.data('lastValue'))) {
	  var q = input.val();

  	// Stop previous ajax-request
		if (input.timer) {
			clearTimeout(input.timer);
		}

	  // Start a new ajax-request in X ms
    input.timer = setTimeout(function () {
    	jQuery('#tx_mhajaxsearch_result').css('display','block');
    	tx_mhajaxsearch_search(xajax.getFormValues('tx_mhajaxsearch_form', 0, 'tx_mhajaxsearch_q'));
		}, tx_mhajaxsearch_keyupdelay);
  	input.data('lastValue', input.val());
  }
}

function mhajaxsearch_start_spinner() {
  jQuery( '#tx_mhajaxsearch_q' ).addClass( 'autocompleter-loading' );
}

function mhajaxsearch_kill_spinner() {
  jQuery( '#tx_mhajaxsearch_q' ).removeClass( 'autocompleter-loading' );
}

jQuery( document ).ready( function()
{
  jQuery( document ).click( function( e ) {
    if ( jQuery( 'span.tx_mhajaxsearch_result' ).is( ':visible' ) ) {
      if ( jQuery( e.target ).parents( '#tx_mhajaxsearch_result' ).length ) {
        // do nothing
      } else {
        mhajaxsearch_kill();
      }
    }
  } );
} );

function mhajaxsearch_kill() {
  mhajaxsearch_kill_spinner();
  jQuery('#tx_mhajaxsearch_q').val('Fachbegriff');
  jQuery('#tx_mhajaxsearch_result').hide();
}


/**
 * Functions for Tagcloud.
 *
 **/

jQuery( document ).ready( function()
{
  jQuery( '.tx-tagpack-pi1-linkbox ul' ).each( function()
  {
    var $ul = jQuery(this);
    var $liArr = $ul.children( 'li' );
    $liArr.sort(function( a, b )
    {
      var temp = parseInt( Math.random()*10 );
      var isOddOrEven = temp%2;
      var isPosOrNeg = temp>5 ? 1 : -1;
      return( isOddOrEven*isPosOrNeg );
    } ).appendTo( $ul );
  } );
} );


/**
 * Functions for Login in Header
 *
 **/

function initLoginUser()
{
	if ( jQuery( '#login .input_fields input#user').val() == 'Mitgliedsnr.' )
  {
		jQuery( '#login .input_fields input#user' ).val( '' );
	}

  jQuery( '#login .input_fields input#user' ).timer = setTimeout( function ()
  {
    if ( jQuery( '#login .input_fields input#user' ).val() == '' )
    {
      jQuery( '#login .input_fields input#user' ).val( 'Mitgliedsnr.' );
    }
	}, 10000);
}

function initLoginPW()
{
  if ( jQuery( '#login .input_fields input#pass' ).val() == 'Passwort' )
  {
    jQuery( '#login .input_fields input#pass' ).val( '' );
  }

  jQuery( '#login .input_fields input#pass' ).timer = setTimeout( function ()
  {
    if (jQuery( '#login .input_fields input#pass' ).val() == '' )
    {
      jQuery( '#login .input_fields input#pass' ).val( 'Passwort' );
    }
  }, 10000);
}


/**
 * Functions for new publication tt_news widget
 *
 **/
jQuery( document ).ready( function()
{
  var widget = jQuery( '.publication_widget' );
  var orig_list = widget.find( 'ul' );

  /* split in new rows */
  var results =[];
  var elements = orig_list.children( 'li' );
  jQuery.map( elements, function( i, n )
  {
    if( n%5 === 0 )
    {
      results.push( n );
    }
  } );
  jQuery.each( results, function( i, v )
  {
    elements.slice( v, v+5 ).wrapAll( '<li class="row"><ul class="clearfix"></ul></li>' );
  } );

  /* call bxSlider */
  var slider = orig_list.bxSlider( {
    mode: 'vertical',
    /*slideWidth: 87,*/
    minSlides: 1,
    maxSlides: 5,
    slideMargin: 10,
    slideSelector: 'li.row',
    pager: false
  } );
} );


