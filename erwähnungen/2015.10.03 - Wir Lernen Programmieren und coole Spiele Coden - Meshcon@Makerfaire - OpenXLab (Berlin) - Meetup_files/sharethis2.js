if (typeof(Meetup.FB) === "undefined") {
	Meetup.FB = {};
}

(function () {
/**
 * @class
 * @see Meetup.FB
 * @author Takashi Mizohata <takashi@meetup.com>
 * @description
 * This is a better replacement of what it used to be called
 * "Meetup.Facebook.streamPublish" is now under Meetup.FB.feed.
 * It's a simple wrapper class to FB.ui and takes care of permission
 * setting.
 * and I think this should take care of custom domain issues, too.
 * Created on 08/22/2011
 * @example
 * Meetup.FB.feed.publish(
 *   template [..Facebook publishing template..},
 *   callback [Function]
 * );
 */
Meetup.FB.feed = {};

/**
 * good old stream publishing. When it's needed, it will automatically popup.
 * @function
 * @param {object} template publishing template
 * @param {function} callback
 * @see http://developers.facebook.com/docs/reference/javascript/FB.ui/
 */
Meetup.FB.feed.publish = function (template, callback) {
	callback = (typeof(callback) === 'function' ? callback : undefined);
	template.display = 'dialog';
	template.method = 'share';
	// if FB can't access the url (in dev), it won't get posted to feed
	template.href = template.href || template.link || window.location.href;
	var func = function () {
		FB.ui(
			template,
			callback
		);
	};
	// REMEMBER! FB.getLoginStatus won't get fired,
	// see Meetup.FB.init() for detail.
	Meetup.FB.ready(function() {
		FB.getLoginStatus(
			function (response) {
				if (!response) {
					return false;
				}
				if (response.status === 'connected') {
					func();
				} else {
					// allow posting without being connected (triggers popup)
					delete template.display;
					func();
				}
			}
		);
	});
};

})();

if (typeof(Meetup) === 'undefined') {
	Meetup = {};
}
if (Meetup.ShareThis === undefined) {
	/**
	 * This code should be lazy loaded.
	 * Twitter share template should be same as Facebook attachment template
	 * <pre>
	 * {
	 * 	name: 'Name of event/action',
	 * 	href: 'http://url_for_link/and/it/is/used/for/shortener',
	 * 	caption: 'should be very short and sweet. Remember 140.'
	 * }
	 * </pre>
	 * description and media doesn't seem to be needed.
	 * Eventually, we may wanna separate Twitter as another object.
	 * Future project: This ShareThis object should be abstruction layer
	 * for both Facebook and Twitter?
	 *
	 * @author: Takashi Mizohata <takashi@meetup.com>
	 *
	 * @class Meetup.ShareThis
	 */
	Meetup.ShareThis = {};
}

(function(self) {

/**
 * This is default tracking code. You should be setting in init.
 * REMEMBER! Table col for short_url src_code is char(4).
 */
Meetup.ShareThis.shortUrlTracking = 'UNKW';

/**
 * init
 */
Meetup.ShareThis.init = function () {
	var $facebook = $("#facebookShare");
	var $twitter = $("#twitterShare");
	if ($facebook.length > 0) {
		Meetup.FB.fbSrcCode = 'fb_shr';
		$facebook.bind('click', Meetup.ShareThis.onFacebookClick);
	}
	if ($twitter.length > 0) {
		self.shortUrlTracking = Meetup.Twitter.srcCode;
		if (!self.shortUrlTracking) {
			throw new Error('You have to set a Twitter tracking code here.');
		}
		$twitter.bind('click', Meetup.ShareThis.onTwitterClick);
	}
};

/**
 * all data on facebook should be on template.
 */
Meetup.ShareThis.onFacebookClick = function (ev) {
	ev.preventDefault();
	ev.stopPropagation();
	$(document.body).click(); //Hide dropdown

	var tpl;
	if (Meetup.FB.altTemplateKey) {
		tpl = $.extend({}, Meetup.FB.altTemplate[ Meetup.FB.altTemplateKey ]);
	}
	else {
		tpl = $.extend({}, Meetup.FB.template);
		tpl.link = window.location.href;
	}
	var $img = $('#D_photoGallery_image');
	if ($img.length) {
		tpl.picture = $img.attr('src');
		if (IS_DEV) {
			tpl.picture = tpl.picture.replace('.dev.', '.');
		}
	}
	Meetup.FB.ready(function() { Meetup.FB.feed.publish(tpl); });
	$.get( ['/r/site/www/0/', Meetup.FB.fbSrcCode, '/http://', window.location.hostname, '/img/clear.gif'].join('') );

	return false;
};

/**
 * twitter click
 */
Meetup.ShareThis.onTwitterClick = function (ev) {
	ev.preventDefault();
	var tpl, url,
	tracking = self.shortUrlTracking;
	if (Meetup.FB.altTemplateKey) {
		tpl = $.extend({}, Meetup.FB.altTemplate[Meetup.FB.altTemplateKey]);
	}
	else {
		tpl = $.extend({}, Meetup.FB.template);
	}
	if (Meetup.Data.shortUrl) {
		tpl.link = Meetup.Data.shortUrl;
	} else if (!tpl.link) {
		tpl.link = window.location.href;
	}

	self.hideActDropdown();
	Meetup.Twitter.publish(tpl);

};

Meetup.ShareThis.hideActDropdown = function () {
	if (Meetup.ActionDropdown) {
		Meetup.ActionDropdown.hide($("#shareThisDropdown"));
	}
};

})(Meetup.ShareThis);