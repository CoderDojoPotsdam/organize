/* desktop-only libs (mobile has them in base) */
/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
	"use strict";

	// Localise Globals
	var
		History = window.History = window.History||{},
		jQuery = window.jQuery;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Add the Adapter
	History.Adapter = {
		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {function} callback
		 * @return {void}
		 */
		bind: function(el,event,callback){
			jQuery(el).bind(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {void}
		 */
		trigger: function(el,event,extra){
			jQuery(el).trigger(event,extra);
		},

		/**
		 * History.Adapter.extractEventData(key,event,extra)
		 * @param {string} key - key for the event data to extract
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {mixed}
		 */
		extractEventData: function(key,event,extra){
			// jQuery Native then jQuery Custom
			var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;

			// Return
			return result;
		},

		/**
		 * History.Adapter.onDomLoad(callback)
		 * @param {function} callback
		 * @return {void}
		 */
		onDomLoad: function(callback) {
			jQuery(callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);

/**
 * History.js HTML4 Support
 * Depends on the HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// ========================================================================
	// Initialise

	// Localise Globals
	var
		document = window.document, // Make sure we are using the correct document
		setTimeout = window.setTimeout||setTimeout,
		clearTimeout = window.clearTimeout||clearTimeout,
		setInterval = window.setInterval||setInterval,
		History = window.History = window.History||{}; // Public History Object

	// Check Existence
	if ( typeof History.initHtml4 !== 'undefined' ) {
		throw new Error('History.js HTML4 Support has already been loaded...');
	}


	// ========================================================================
	// Initialise HTML4 Support

	// Initialise HTML4 Support
	History.initHtml4 = function(){
		// Initialise
		if ( typeof History.initHtml4.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initHtml4.initialized = true;
		}


		// ====================================================================
		// Properties

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = true;


		// ====================================================================
		// Hash Storage

		/**
		 * History.savedHashes
		 * Store the hashes in an array
		 */
		History.savedHashes = [];

		/**
		 * History.isLastHash(newHash)
		 * Checks if the hash is the last hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.isLastHash = function(newHash){
			// Prepare
			var oldHash = History.getHashByIndex(),
				isLast;

			// Check
			isLast = newHash === oldHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.isHashEqual(newHash, oldHash)
		 * Checks to see if two hashes are functionally equal
		 * @param {string} newHash
		 * @param {string} oldHash
		 * @return {boolean} true
		 */
		History.isHashEqual = function(newHash, oldHash){
			newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
			oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
			return newHash === oldHash;
		};

		/**
		 * History.saveHash(newHash)
		 * Push a Hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.saveHash = function(newHash){
			// Check Hash
			if ( History.isLastHash(newHash) ) {
				return false;
			}

			// Push the Hash
			History.savedHashes.push(newHash);

			// Return true
			return true;
		};

		/**
		 * History.getHashByIndex()
		 * Gets a hash by the index
		 * @param {integer} index
		 * @return {string}
		 */
		History.getHashByIndex = function(index){
			// Prepare
			var hash = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				hash = History.savedHashes[History.savedHashes.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				hash = History.savedHashes[History.savedHashes.length+index];
			}
			else {
				// Get from the beginning
				hash = History.savedHashes[index];
			}

			// Return hash
			return hash;
		};


		// ====================================================================
		// Discarded States

		/**
		 * History.discardedHashes
		 * A hashed array of discarded hashes
		 */
		History.discardedHashes = {};

		/**
		 * History.discardedStates
		 * A hashed array of discarded states
		 */
		History.discardedStates = {};

		/**
		 * History.discardState(State)
		 * Discards the state by ignoring it through History
		 * @param {object} State
		 * @return {true}
		 */
		History.discardState = function(discardedState,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Prepare
			var discardedStateHash = History.getHashByState(discardedState),
				discardObject;

			// Create Discard Object
			discardObject = {
				'discardedState': discardedState,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to DiscardedStates
			History.discardedStates[discardedStateHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardHash(hash)
		 * Discards the hash by ignoring it through History
		 * @param {string} hash
		 * @return {true}
		 */
		History.discardHash = function(discardedHash,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Create Discard Object
			var discardObject = {
				'discardedHash': discardedHash,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to discardedHash
			History.discardedHashes[discardedHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardedState(State)
		 * Checks to see if the state is discarded
		 * @param {object} State
		 * @return {bool}
		 */
		History.discardedState = function(State){
			// Prepare
			var StateHash = History.getHashByState(State),
				discarded;

			// Check
			discarded = History.discardedStates[StateHash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.discardedHash(hash)
		 * Checks to see if the state is discarded
		 * @param {string} State
		 * @return {bool}
		 */
		History.discardedHash = function(hash){
			// Check
			var discarded = History.discardedHashes[hash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.recycleState(State)
		 * Allows a discarded state to be used again
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.recycleState = function(State){
			//History.debug('History.recycleState', arguments);
			// Prepare
			var StateHash = History.getHashByState(State);

			// Remove from DiscardedStates
			if ( History.discardedState(State) ) {
				delete History.discardedStates[StateHash];
			}

			// Return true
			return true;
		};


		// ====================================================================
		// HTML4 HashChange Support

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			/**
			 * History.hashChangeInit()
			 * Init the HashChange Emulation
			 */
			History.hashChangeInit = function(){
				// Define our Checker Function
				History.checkerFunction = null;

				// Define some variables that will help in our checker function
				var lastDocumentHash = '',
					iframeId, iframe,
					lastIframeHash, checkerRunning,
					startedWithHash = Boolean(History.getHash());

				// Handle depending on the browser
				if ( History.isInternetExplorer() ) {
					// IE6 and IE7
					// We need to use an iframe to emulate the back and forward buttons

					// Create iFrame
					iframeId = 'historyjs-iframe';
					iframe = document.createElement('iframe');

					// Adjust iFarme
					// IE 6 requires iframe to have a src on HTTPS pages, otherwise it will throw a
					// "This page contains both secure and nonsecure items" warning.
					iframe.setAttribute('id', iframeId);
					iframe.setAttribute('src', '#');
					iframe.style.display = 'none';

					// Append iFrame
					document.body.appendChild(iframe);

					// Create initial history entry
					iframe.contentWindow.document.open();
					iframe.contentWindow.document.close();

					// Define some variables that will help in our checker function
					lastIframeHash = '';
					checkerRunning = false;

					// Define the checker function
					History.checkerFunction = function(){
						// Check Running
						if ( checkerRunning ) {
							return false;
						}

						// Update Running
						checkerRunning = true;

						// Fetch
						var
							documentHash = History.getHash(),
							iframeHash = History.getHash(iframe.contentWindow.document);

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							if ( iframeHash !== documentHash ) {
								//History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

								// Equalise
								lastIframeHash = iframeHash = documentHash;

								// Create History Entry
								iframe.contentWindow.document.open();
								iframe.contentWindow.document.close();

								// Update the iframe's hash
								iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
							}

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
							//History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

							// Equalise
							lastIframeHash = iframeHash;
							
							// If there is no iframe hash that means we're at the original
							// iframe state.
							// And if there was a hash on the original request, the original
							// iframe state was replaced instantly, so skip this state and take
							// the user back to where they came from.
							if (startedWithHash && iframeHash === '') {
								History.back();
							}
							else {
								// Update the Hash
								History.setHash(iframeHash,false);
							}
						}

						// Reset Running
						checkerRunning = false;

						// Return true
						return true;
					};
				}
				else {
					// We are not IE
					// Firefox 1 or 2, Opera

					// Define the checker function
					History.checkerFunction = function(){
						// Prepare
						var documentHash = History.getHash()||'';

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));

				// Done
				return true;
			}; // History.hashChangeInit

			// Bind hashChangeInit
			History.Adapter.onDomLoad(History.hashChangeInit);

		} // History.emulated.hashChange


		// ====================================================================
		// HTML5 State Support

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * History.onHashChange(event)
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			History.onHashChange = function(event){
				//History.debug('History.onHashChange', arguments);

				// Prepare
				var currentUrl = ((event && event.newURL) || History.getLocationHref()),
					currentHash = History.getHashByUrl(currentUrl),
					currentState = null,
					currentStateHash = null,
					currentStateHashExits = null,
					discardObject;

				// Check if we are the same state
				if ( History.isLastHash(currentHash) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onHashChange: no change');
					History.busy(false);
					return false;
				}

				// Reset the double check
				History.doubleCheckComplete();

				// Store our location for use in detecting back/forward direction
				History.saveHash(currentHash);

				// Expand Hash
				if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
					//History.debug('History.onHashChange: traditional anchor', currentHash);
					// Traditional Anchor Hash
					History.Adapter.trigger(window,'anchorchange');
					History.busy(false);
					return false;
				}

				// Create State
				currentState = History.extractState(History.getFullUrl(currentHash||History.getLocationHref()),true);

				// Check if we are the same state
				if ( History.isLastSavedState(currentState) ) {
					//History.debug('History.onHashChange: no change');
					// There has been no change (just the page's hash has finally propagated)
					History.busy(false);
					return false;
				}

				// Create the state Hash
				currentStateHash = History.getHashByState(currentState);

				// Check if we are DiscardedState
				discardObject = History.discardedState(currentState);
				if ( discardObject ) {
					// Ignore this state as it has been discarded and go back to the state before it
					if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
						// We are going backwards
						//History.debug('History.onHashChange: go backwards');
						History.back(false);
					} else {
						// We are going forwards
						//History.debug('History.onHashChange: go forwards');
						History.forward(false);
					}
					return false;
				}

				// Push the new HTML5 State
				//History.debug('History.onHashChange: success hashchange');
				History.pushState(currentState.data,currentState.title,encodeURI(currentState.url),false);

				// End onHashChange closure
				return true;
			};
			History.Adapter.bind(window,'hashchange',History.onHashChange);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// We assume that the URL passed in is URI-encoded, but this makes
				// sure that it's fully URI encoded; any '%'s that are encoded are
				// converted back into '%'s
				url = encodeURI(url).replace(/%25/g, "%");

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Object
				var newState = History.createStateObject(data,title,url),
					newStateHash = History.getHashByState(newState),
					oldState = History.getState(false),
					oldStateHash = History.getHashByState(oldState),
					html4Hash = History.getHash(),
					wasExpected = History.expectedStateId == newState.id;

				// Store the newState
				History.storeState(newState);
				History.expectedStateId = newState.id;

				// Recycle the State
				History.recycleState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Check if we are the same State
				if ( newStateHash === oldStateHash ) {
					//History.debug('History.pushState: no change', newStateHash);
					History.busy(false);
					return false;
				}

				// Update HTML5 State
				History.saveState(newState);

				// Fire HTML5 Event
				if(!wasExpected)
					History.Adapter.trigger(window,'statechange');

				// Update HTML4 Hash
				if ( !History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref())) ) {
					History.setHash(newStateHash,false);
				}
				
				History.busy(false);

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// We assume that the URL passed in is URI-encoded, but this makes
				// sure that it's fully URI encoded; any '%'s that are encoded are
				// converted back into '%'s
				url = encodeURI(url).replace(/%25/g, "%");

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Objects
				var newState        = History.createStateObject(data,title,url),
					newStateHash = History.getHashByState(newState),
					oldState        = History.getState(false),
					oldStateHash = History.getHashByState(oldState),
					previousState   = History.getStateByIndex(-2);

				// Discard Old State
				History.discardState(oldState,newState,previousState);

				// If the url hasn't changed, just store and save the state
				// and fire a statechange event to be consistent with the
				// html 5 api
				if ( newStateHash === oldStateHash ) {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;
	
					// Recycle the State
					History.recycleState(newState);
	
					// Force update of the title
					History.setTitle(newState);
					
					// Update HTML5 State
					History.saveState(newState);

					// Fire HTML5 Event
					//History.debug('History.pushState: trigger popstate');
					History.Adapter.trigger(window,'statechange');
					History.busy(false);
				}
				else {
					// Alias to PushState
					History.pushState(newState.data,newState.title,newState.url,false);
				}

				// End replaceState closure
				return true;
			};

		} // History.emulated.pushState



		// ====================================================================
		// Initialise

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/**
			 * Ensure initial state is handled correctly
			 */
			if ( History.getHash() && !History.emulated.hashChange ) {
				History.Adapter.onDomLoad(function(){
					History.Adapter.trigger(window,'hashchange');
				});
			}

		} // History.emulated.pushState

	}; // History.initHtml4

	// Try to Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// ========================================================================
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		sessionStorage = window.sessionStorage||false, // sessionStorage
		setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout,
		setInterval = window.setInterval,
		clearInterval = window.clearInterval,
		JSON = window.JSON,
		alert = window.alert,
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	try {
		sessionStorage.setItem('TEST', '1');
		sessionStorage.removeItem('TEST');
	} catch(e) {
		sessionStorage = false;
	}

	// MooTools Compatibility
	JSON.stringify = JSON.stringify||JSON.encode;
	JSON.parse = JSON.parse||JSON.decode;

	// Check Existence
	if ( typeof History.init !== 'undefined' ) {
		throw new Error('History.js Core has already been loaded...');
	}

	// Initialise History
	History.init = function(options){
		// Check Load Status of Adapter
		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// Check Load Status of Core
		if ( typeof History.initCore !== 'undefined' ) {
			History.initCore();
		}

		// Check Load Status of HTML4 Support
		if ( typeof History.initHtml4 !== 'undefined' ) {
			History.initHtml4();
		}

		// Return true
		return true;
	};


	// ========================================================================
	// Initialise Core

	// Initialise Core
	History.initCore = function(options){
		// Initialise
		if ( typeof History.initCore.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initCore.initialized = true;
		}


		// ====================================================================
		// Options

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = History.options||{};

		/**
		 * History.options.hashChangeInterval
		 * How long should the interval be before hashchange checks
		 */
		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = History.options.safariPollInterval || 500;

		/**
		 * History.options.doubleCheckInterval
		 * How long should the interval be before we perform a double check
		 */
		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

		/**
		 * History.options.disableSuid
		 * Force History not to append suid
		 */
		History.options.disableSuid = History.options.disableSuid || false;

		/**
		 * History.options.storeInterval
		 * How long should we wait between store calls
		 */
		History.options.storeInterval = History.options.storeInterval || 1000;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = History.options.busyDelay || 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = History.options.debug || false;

		/**
		 * History.options.initialTitle
		 * What is the title of the initial state
		 */
		History.options.initialTitle = History.options.initialTitle || document.title;

		/**
		 * History.options.html4Mode
		 * If true, will force HTMl4 mode (hashtags)
		 */
		History.options.html4Mode = History.options.html4Mode || false;

		/**
		 * History.options.delayInit
		 * Want to override default options and call init manually.
		 */
		History.options.delayInit = History.options.delayInit || false;


		// ====================================================================
		// Interval record

		/**
		 * History.intervalList
		 * List of intervals set, to be cleared when document is unloaded.
		 */
		History.intervalList = [];

		/**
		 * History.clearAllIntervals
		 * Clears all setInterval instances.
		 */
		History.clearAllIntervals = function(){
			var i, il = History.intervalList;
			if (typeof il !== "undefined" && il !== null) {
				for (i = 0; i < il.length; i++) {
					clearInterval(il[i]);
				}
				History.intervalList = null;
			}
		};


		// ====================================================================
		// Debug

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.options.debug||false) ) {
				History.log.apply(History,arguments);
			}
		};

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			// Prepare
			var
				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
				textarea = document.getElementById('log'),
				message,
				i,n,
				args,arg
				;

			// Write to Console
			if ( consoleExists ) {
				args = Array.prototype.slice.call(arguments);
				message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}
			else {
				message = ("\n"+arguments[0]+"\n");
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				arg = arguments[i];
				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
					try {
						arg = JSON.stringify(arg);
					}
					catch ( Exception ) {
						// Recursive Object
					}
				}
				message += "\n"+arg+"\n";
			}

			// Textarea
			if ( textarea ) {
				textarea.value += message+"\n-----\n";
				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
			}
			// No Textarea, No Console
			else if ( !consoleExists ) {
				alert(message);
			}

			// Return true
			return true;
		};


		// ====================================================================
		// Emulated Status

		/**
		 * History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		History.getInternetExplorerMajorVersion = function(){
			var result = History.getInternetExplorerMajorVersion.cached =
					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	History.getInternetExplorerMajorVersion.cached
				:	(function(){
						var v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
						return (v > 4) ? v : false;
					})()
				;
			return result;
		};

		/**
		 * History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		History.isInternetExplorer = function(){
			var result =
				History.isInternetExplorer.cached =
				(typeof History.isInternetExplorer.cached !== 'undefined')
					?	History.isInternetExplorer.cached
					:	Boolean(History.getInternetExplorerMajorVersion())
				;
			return result;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */

		if (History.options.html4Mode) {
			History.emulated = {
				pushState : true,
				hashChange: true
			};
		}

		else {

			History.emulated = {
				pushState: !Boolean(
					window.history && window.history.pushState && window.history.replaceState
					&& !(
						(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
						|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
					)
				),
				hashChange: Boolean(
					!(('onhashchange' in window) || ('onhashchange' in document))
					||
					(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
				)
			};
		}

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = !History.emulated.pushState;

		/**
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {
			/**
			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
			 * https://bugs.webkit.org/show_bug.cgi?id=56249
			 */
			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
			 * https://bugs.webkit.org/show_bug.cgi?id=42940
			 */
			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
			 */
			ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

			/**
			 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
			 */
			hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
		};

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				if ( obj.hasOwnProperty(name) ) {
					return false;
				}
			}
			return true;
		};

		/**
		 * History.cloneObject(obj)
		 * Clones a object and eliminate all references to the original contexts
		 * @param {Object} obj
		 * @return {Object}
		 */
		History.cloneObject = function(obj) {
			var hash,newObj;
			if ( obj ) {
				hash = JSON.stringify(obj);
				newObj = JSON.parse(hash);
			}
			else {
				newObj = {};
			}
			return newObj;
		};


		// ====================================================================
		// URL Helpers

		/**
		 * History.getRootUrl()
		 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
		 * @return {String} rootUrl
		 */
		History.getRootUrl = function(){
			// Create
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
		};

		/**
		 * History.getBaseHref()
		 * Fetches the `href` attribute of the `<base href="...">` element if it exists
		 * @return {String} baseHref
		 */
		History.getBaseHref = function(){
			// Create
			var
				baseElements = document.getElementsByTagName('base'),
				baseElement = null,
				baseHref = '';

			// Test for Base Element
			if ( baseElements.length === 1 ) {
				// Prepare for Base Element
				baseElement = baseElements[0];
				baseHref = baseElement.href.replace(/[^\/]+$/,'');
			}

			// Adjust trailing slash
			baseHref = baseHref.replace(/\/+$/,'');
			if ( baseHref ) baseHref += '/';

			// Return
			return baseHref;
		};

		/**
		 * History.getBaseUrl()
		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
		 * @return {String} baseUrl
		 */
		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		/**
		 * History.getPageUrl()
		 * Fetches the URL of the current page
		 * @return {String} pageUrl
		 */
		History.getPageUrl = function(){
			// Fetch
			var
				State = History.getState(false,false),
				stateUrl = (State||{}).url||History.getLocationHref(),
				pageUrl;

			// Create
			pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/\./).test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {String} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/[^\/]$/).test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @param {Boolean} allowBaseHref
		 * @return {string} fullUrl
		 */
		History.getFullUrl = function(url,allowBaseHref){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);
			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

			// Check
			if ( /[a-z]+\:\/\//.test(url) ) {
				// Full URL
			}
			else if ( firstChar === '/' ) {
				// Root URL
				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
			}
			else if ( firstChar === '#' ) {
				// Anchor URL
				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
			}
			else if ( firstChar === '?' ) {
				// Query URL
				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
			}
			else {
				// Relative URL
				if ( allowBaseHref ) {
					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
				} else {
					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
				}
				// We have an if condition above as we do not want hashes
				// which are relative to the baseHref in our URLs
				// as if the baseHref changes, then all our bookmarks
				// would now point to different locations
				// whereas the basePageUrl will always stay the same
			}

			// Return
			return fullUrl.replace(/\#$/,'');
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

			// Trim baseUrl
			if ( History.emulated.pushState ) {
				// We are in a if statement as when pushState is not emulated
				// The actual url these short urls are relative to can change
				// So within the same session, we the url may end up somewhere different
				shortUrl = shortUrl.replace(baseUrl,'');
			}

			// Trim rootUrl
			shortUrl = shortUrl.replace(rootUrl,'/');

			// Ensure we can still detect it as a state
			if ( History.isTraditionalAnchor(shortUrl) ) {
				shortUrl = './'+shortUrl;
			}

			// Clean It
			shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

			// Return
			return shortUrl;
		};

		/**
		 * History.getLocationHref(document)
		 * Returns a normalized version of document.location.href
		 * accounting for browser inconsistencies, etc.
		 *
		 * This URL will be URI-encoded and will include the hash
		 *
		 * @param {object} document
		 * @return {string} url
		 */
		History.getLocationHref = function(doc) {
			doc = doc || document;

			// most of the time, this will be true
			if (doc.URL === doc.location.href)
				return doc.location.href;

			// some versions of webkit URI-decode document.location.href
			// but they leave document.URL in an encoded state
			if (doc.location.href === decodeURIComponent(doc.URL))
				return doc.URL;

			// FF 3.6 only updates document.URL when a page is reloaded
			// document.location.href is updated correctly
			if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
				return doc.location.href;

			if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
				return doc.location.href;
			
			return doc.URL || doc.location.href;
		};


		// ====================================================================
		// State Storage

		/**
		 * History.store
		 * The store for all session specific data
		 */
		History.store = {};

		/**
		 * History.idToState
		 * 1-1: State ID to State Object
		 */
		History.idToState = History.idToState||{};

		/**
		 * History.stateToId
		 * 1-1: State String to State ID
		 */
		History.stateToId = History.stateToId||{};

		/**
		 * History.urlToId
		 * 1-1: State URL to State ID
		 */
		History.urlToId = History.urlToId||{};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = History.storedStates||[];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = History.savedStates||[];

		/**
		 * History.noramlizeStore()
		 * Noramlize the store by adding necessary values
		 */
		History.normalizeStore = function(){
			History.store.idToState = History.store.idToState||{};
			History.store.urlToId = History.store.urlToId||{};
			History.store.stateToId = History.store.stateToId||{};
		};

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @param {Boolean} friendly
		 * @param {Boolean} create
		 * @return {Object} State
		 */
		History.getState = function(friendly,create){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }
			if ( typeof create === 'undefined' ) { create = true; }

			// Fetch
			var State = History.getLastSavedState();

			// Create
			if ( !State && create ) {
				State = History.createStateObject();
			}

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				State.url = State.cleanUrl||State.url;
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByState(State)
		 * Gets a ID for a State
		 * @param {State} newState
		 * @return {String} id
		 */
		History.getIdByState = function(newState){

			// Fetch ID
			var id = History.extractId(newState.url),
				str;

			if ( !id ) {
				// Find ID via State String
				str = History.getStateString(newState);
				if ( typeof History.stateToId[str] !== 'undefined' ) {
					id = History.stateToId[str];
				}
				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
					id = History.store.stateToId[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToId[str] = id;
					History.idToState[id] = newState;
				}
			}

			// Return ID
			return id;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Variables
			var newState, dataNotEmpty;

			// Prepare
			if ( !oldState || (typeof oldState !== 'object') ) {
				oldState = {};
			}

			// Check
			if ( typeof oldState.normalized !== 'undefined' ) {
				return oldState;
			}

			// Adjust
			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
				oldState.data = {};
			}

			// ----------------------------------------------------------------

			// Create
			newState = {};
			newState.normalized = true;
			newState.title = oldState.title||'';
			newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
			newState.hash = History.getShortUrl(newState.url);
			newState.data = History.cloneObject(oldState.data);

			// Fetch ID
			newState.id = History.getIdByState(newState);

			// ----------------------------------------------------------------

			// Clean the URL
			newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
			newState.url = newState.cleanUrl;

			// Check to see if we have more than just a url
			dataNotEmpty = !History.isEmptyObject(newState.data);

			// Apply
			if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
				// Add ID to Hash
				newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_suid='+newState.id;
			}

			// Create the Hashed URL
			newState.hashedUrl = History.getFullUrl(newState.hash);

			// ----------------------------------------------------------------

			// Update the URL if we have a duplicate
			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
				newState.url = newState.hashedUrl;
			}

			// ----------------------------------------------------------------

			// Return
			return newState;
		};

		/**
		 * History.createStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.createStateObject = function(data,title,url){
			// Hashify
			var State = {
				'data': data,
				'title': title,
				'url': url
			};

			// Expand the State
			State = History.normalizeState(State);

			// Return object
			return State;
		};

		/**
		 * History.getStateById(id)
		 * Get a state by it's UID
		 * @param {String} id
		 */
		History.getStateById = function(id){
			// Prepare
			id = String(id);

			// Retrieve
			var State = History.idToState[id] || History.store.idToState[id] || undefined;

			// Return State
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			var State, cleanedState, str;

			// Fetch
			State = History.normalizeState(passedState);

			// Clean
			cleanedState = {
				data: State.data,
				title: passedState.title,
				url: passedState.url
			};

			// Fetch
			str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {String} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			var State, id;

			// Fetch
			State = History.normalizeState(passedState);

			// Fetch
			id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {String} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var State, hash;

			// Fetch
			State = History.normalizeState(passedState);

			// Hash
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.extractId(url_or_hash)
		 * Get a State ID by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string} id
		 */
		History.extractId = function ( url_or_hash ) {
			// Prepare
			var id,parts,url, tmp;

			// Extract
			
			// If the URL has a #, use the id from before the #
			if (url_or_hash.indexOf('#') != -1)
			{
				tmp = url_or_hash.split("#")[0];
			}
			else
			{
				tmp = url_or_hash;
			}
			
			parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
			id = parts ? String(parts[2]||'') : '';

			// Return
			return id||false;
		};

		/**
		 * History.isTraditionalAnchor
		 * Checks to see if the url is a traditional anchor or not
		 * @param {String} url_or_hash
		 * @return {Boolean}
		 */
		History.isTraditionalAnchor = function(url_or_hash){
			// Check
			var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

			// Return
			return isTraditional;
		};

		/**
		 * History.extractState
		 * Get a State by it's URL or Hash
		 * @param {String} url_or_hash
		 * @return {State|null}
		 */
		History.extractState = function(url_or_hash,create){
			// Prepare
			var State = null, id, url;
			create = create||false;

			// Fetch SUID
			id = History.extractId(url_or_hash);
			if ( id ) {
				State = History.getStateById(id);
			}

			// Fetch SUID returned no State
			if ( !State ) {
				// Fetch URL
				url = History.getFullUrl(url_or_hash);

				// Check URL
				id = History.getIdByUrl(url)||false;
				if ( id ) {
					State = History.getStateById(id);
				}

				// Create State
				if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
					State = History.createStateObject(null,null,url);
				}
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByUrl()
		 * Get a State ID by a State URL
		 */
		History.getIdByUrl = function(url){
			// Fetch
			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

			// Return
			return id;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.savedStates[History.savedStates.length-1]||undefined;
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.storedStates[History.storedStates.length-1]||undefined;
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasDuplicate
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var hasDuplicate = false,
				oldState;

			// Fetch
			oldState = History.extractState(newState.url);

			// Check
			hasDuplicate = oldState && oldState.id !== newState.id;

			// Return
			return hasDuplicate;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Store the State
			History.urlToId[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(History.cloneObject(newState));

			// Return newState
			return newState;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState){
			// Prepare
			var isLast = false,
				newId, oldState, oldId;

			// Check
			if ( History.savedStates.length ) {
				newId = newState.id;
				oldState = History.getLastSavedState();
				oldId = oldState.id;

				// Check
				isLast = (newId === oldId);
			}

			// Return
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return false;
			}

			// Push the State
			History.savedStates.push(History.cloneObject(newState));

			// Return true
			return true;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				State = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = History.savedStates[index];
			}

			// Return State
			return State;
		};
		
		/**
		 * History.getCurrentIndex()
		 * Gets the current index
		 * @return (integer)
		*/
		History.getCurrentIndex = function(){
			// Prepare
			var index = null;
			
			// No states saved
			if(History.savedStates.length < 1) {
				index = 0;
			}
			else {
				index = History.savedStates.length-1;
			}
			return index;
		};

		// ====================================================================
		// Hash Helpers

		/**
		 * History.getHash()
		 * @param {Location=} location
		 * Gets the current document hash
		 * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
		 * @return {string}
		 */
		History.getHash = function(doc){
			var url = History.getLocationHref(doc),
				hash;
			hash = History.getHashByUrl(url);
			return hash;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @param {String} hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Unescape hash
			result = decodeURIComponent(result);

			// Return result
			return result;
		};

		/**
		 * History.normalizeHash()
		 * normalize a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
			// Prepare
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

			// Return result
			return result;
		};

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {History}
		 */
		History.setHash = function(hash,queue){
			// Prepare
			var State, pageUrl;

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.setHash: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.setHash,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Log
			//History.debug('History.setHash: called',hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			State = History.extractState(hash,true);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( History.getHash() !== hash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.setHash ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					pageUrl = History.getPageUrl();

					// Safari hash apply
					History.pushState(null,null,pageUrl+'#'+hash,false);
				}
				else {
					// Normal hash apply
					document.location.hash = hash;
				}
			}

			// Chain
			return History;
		};

		/**
		 * History.escape()
		 * normalize and Escape a Hash
		 * @return {string}
		 */
		History.escapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Escape hash
			result = window.encodeURIComponent(result);

			// IE6 Escape Bug
			if ( !History.bugs.hashEscape ) {
				// Restore common parts
				result = result
					.replace(/\%21/g,'!')
					.replace(/\%26/g,'&')
					.replace(/\%3D/g,'=')
					.replace(/\%3F/g,'?');
			}

			// Return result
			return result;
		};

		/**
		 * History.getHashByUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getHashByUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Unescape hash
			hash = History.unescapeHash(hash);

			// Return hash
			return hash;
		};

		/**
		 * History.setTitle(title)
		 * Applies the title to the document
		 * @param {State} newState
		 * @return {Boolean}
		 */
		History.setTitle = function(newState){
			// Prepare
			var title = newState.title,
				firstState;

			// Initial
			if ( !title ) {
				firstState = History.getStateByIndex(0);
				if ( firstState && firstState.url === newState.url ) {
					title = firstState.title||History.options.initialTitle;
				}
			}

			// Apply
			try {
				document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
			}
			catch ( Exception ) { }
			document.title = title;

			// Chain
			return History;
		};


		// ====================================================================
		// Queueing

		/**
		 * History.queues
		 * The list of queues to use
		 * First In, First Out
		 */
		History.queues = [];

		/**
		 * History.busy(value)
		 * @param {boolean} value [optional]
		 * @return {boolean} busy
		 */
		History.busy = function(value){
			// Apply
			if ( typeof value !== 'undefined' ) {
				//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				var fireNext = function(){
					var i, queue, item;
					if ( History.busy.flag ) return;
					for ( i=History.queues.length-1; i >= 0; --i ) {
						queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						item = queue.shift();
						History.fireQueueItem(item);
						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
					}
				};
				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
			}

			// Return
			return History.busy.flag;
		};

		/**
		 * History.busy.flag
		 */
		History.busy.flag = false;

		/**
		 * History.fireQueueItem(item)
		 * Fire a Queue Item
		 * @param {Object} item
		 * @return {Mixed} result
		 */
		History.fireQueueItem = function(item){
			return item.callback.apply(item.scope||History,item.args||[]);
		};

		/**
		 * History.pushQueue(callback,args)
		 * Add an item to the queue
		 * @param {Object} item [scope,callback,args,queue]
		 */
		History.pushQueue = function(item){
			// Prepare the queue
			History.queues[item.queue||0] = History.queues[item.queue||0]||[];

			// Add to the queue
			History.queues[item.queue||0].push(item);

			// Chain
			return History;
		};

		/**
		 * History.queue (item,queue), (func,queue), (func), (item)
		 * Either firs the item now if not busy, or adds it to the queue
		 */
		History.queue = function(item,queue){
			// Prepare
			if ( typeof item === 'function' ) {
				item = {
					callback: item
				};
			}
			if ( typeof queue !== 'undefined' ) {
				item.queue = queue;
			}

			// Handle
			if ( History.busy() ) {
				History.pushQueue(item);
			} else {
				History.fireQueueItem(item);
			}

			// Chain
			return History;
		};

		/**
		 * History.clearQueue()
		 * Clears the Queue
		 */
		History.clearQueue = function(){
			History.busy.flag = false;
			History.queues = [];
			return History;
		};


		// ====================================================================
		// IE Bug Fix

		/**
		 * History.stateChanged
		 * States whether or not the state has changed since the last double check was initialised
		 */
		History.stateChanged = false;

		/**
		 * History.doubleChecker
		 * Contains the timeout used for the double checks
		 */
		History.doubleChecker = false;

		/**
		 * History.doubleCheckComplete()
		 * Complete a double check
		 * @return {History}
		 */
		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckClear();

			// Chain
			return History;
		};

		/**
		 * History.doubleCheckClear()
		 * Clear a double check
		 * @return {History}
		 */
		History.doubleCheckClear = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = false;
			}

			// Chain
			return History;
		};

		/**
		 * History.doubleCheck()
		 * Create a double check
		 * @return {History}
		 */
		History.doubleCheck = function(tryAgain){
			// Reset
			History.stateChanged = false;
			History.doubleCheckClear();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckClear();
						if ( !History.stateChanged ) {
							//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.doubleCheckInterval
				);
			}

			// Chain
			return History;
		};


		// ====================================================================
		// Safari Bug Fix

		/**
		 * History.safariStatePoll()
		 * Poll the current state
		 * @return {History}
		 */
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.extractState(History.getLocationHref()),
				newState;

			// Check for a difference
			if ( !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				//History.debug('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			//History.debug('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};


		// ====================================================================
		// State Aliases

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {Integer} queue [optional]
		 */
		History.back = function(queue){
			//History.debug('History.back: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.back: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.back,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.back(false);
			});

			// Go back
			history.go(-1);

			// End back closure
			return true;
		};

		/**
		 * History.forward(queue)
		 * Send the browser history forward one item
		 * @param {Integer} queue [optional]
		 */
		History.forward = function(queue){
			//History.debug('History.forward: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.forward: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.forward,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.forward(false);
			});

			// Go forward
			history.go(1);

			// End forward closure
			return true;
		};

		/**
		 * History.go(index,queue)
		 * Send the browser history back or forward index times
		 * @param {Integer} queue [optional]
		 */
		History.go = function(index,queue){
			//History.debug('History.go: called', arguments);

			// Prepare
			var i;

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( i=1; i<=index; ++i ) {
					History.forward(queue);
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( i=-1; i>=index; --i ) {
					History.back(queue);
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// Chain
			return History;
		};


		// ====================================================================
		// HTML5 State Support

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/*
			 * Provide Skeleton for HTML4 Browsers
			 */

			// Prepare
			var emptyFunction = function(){};
			History.pushState = History.pushState||emptyFunction;
			History.replaceState = History.replaceState||emptyFunction;
		} // History.emulated.pushState

		// Native pushState Implementation
		else {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			History.onPopState = function(event,extra){
				// Prepare
				var stateId = false, newState = false, currentHash, currentState;

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				currentHash = History.getHash();
				if ( currentHash ) {
					// Expand Hash
					currentState = History.extractState(currentHash||History.getLocationHref(),true);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						//History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
					}
					else {
						// Traditional Anchor
						//History.debug('History.onPopState: traditional anchor', currentHash);
						History.Adapter.trigger(window,'anchorchange');
						History.busy(false);
					}

					// We don't care for hashes
					History.expectedStateId = false;
					return false;
				}

				// Ensure
				stateId = History.Adapter.extractEventData('state',event,extra) || false;

				// Fetch State
				if ( stateId ) {
					// Vanilla: Back/forward button was used
					newState = History.getStateById(stateId);
				}
				else if ( History.expectedStateId ) {
					// Vanilla: A new state was pushed, and popstate was called manually
					newState = History.getStateById(History.expectedStateId);
				}
				else {
					// Initial State
					newState = History.extractState(History.getLocationHref());
				}

				// The State did not exist in our store
				if ( !newState ) {
					// Regenerate the State
					newState = History.createStateObject(null,null,History.getLocationHref());
				}

				// Clean
				History.expectedStateId = false;

				// Check if we are the same state
				if ( History.isLastSavedState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onPopState: no change', newState, History.savedStates);
					History.busy(false);
					return false;
				}

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Fire Our Event
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',History.onPopState);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.pushState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.replaceState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End replaceState closure
				return true;
			};

		} // !History.emulated.pushState


		// ====================================================================
		// Initialise

		/**
		 * Load the Store
		 */
		if ( sessionStorage ) {
			// Fetch
			try {
				History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
			}
			catch ( err ) {
				History.store = {};
			}

			// Normalize
			History.normalizeStore();
		}
		else {
			// Default Load
			History.store = {};
			History.normalizeStore();
		}

		/**
		 * Clear Intervals on exit to prevent memory leaks
		 */
		History.Adapter.bind(window,"unload",History.clearAllIntervals);

		/**
		 * Create the initial State
		 */
		History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

		/**
		 * Bind for Saving Store
		 */
		if ( sessionStorage ) {
			// When the page is closed
			History.onUnload = function(){
				// Prepare
				var	currentStore, item, currentStoreString;

				// Fetch
				try {
					currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
				}
				catch ( err ) {
					currentStore = {};
				}

				// Ensure
				currentStore.idToState = currentStore.idToState || {};
				currentStore.urlToId = currentStore.urlToId || {};
				currentStore.stateToId = currentStore.stateToId || {};

				// Sync
				for ( item in History.idToState ) {
					if ( !History.idToState.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.idToState[item] = History.idToState[item];
				}
				for ( item in History.urlToId ) {
					if ( !History.urlToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.urlToId[item] = History.urlToId[item];
				}
				for ( item in History.stateToId ) {
					if ( !History.stateToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.stateToId[item] = History.stateToId[item];
				}

				// Update
				History.store = currentStore;
				History.normalizeStore();

				// In Safari, going into Private Browsing mode causes the
				// Session Storage object to still exist but if you try and use
				// or set any property/function of it it throws the exception
				// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
				// add something to storage that exceeded the quota." infinitely
				// every second.
				currentStoreString = JSON.stringify(currentStore);
				try {
					// Store
					sessionStorage.setItem('History.store', currentStoreString);
				}
				catch (e) {
					if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
						if (sessionStorage.length) {
							// Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
							// removing/resetting the storage can work.
							sessionStorage.removeItem('History.store');
							sessionStorage.setItem('History.store', currentStoreString);
						} else {
							// Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
						}
					} else {
						throw e;
					}
				}
			};

			// For Internet Explorer
			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

			// For Other Browsers
			History.Adapter.bind(window,'beforeunload',History.onUnload);
			History.Adapter.bind(window,'unload',History.onUnload);

			// Both are enabled for consistency
		}

		// Non-Native pushState Implementation
		if ( !History.emulated.pushState ) {
			// Be aware, the following is only for native pushState implementations
			// If you are wanting to include something for all browsers
			// Then include it above this if block

			/**
			 * Setup Safari Fix
			 */
			if ( History.bugs.safariPoll ) {
				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
			}

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
				/**
				 * Fix Safari HashChange Issue
				 */

				// Setup Alias
				History.Adapter.bind(window,'hashchange',function(){
					History.Adapter.trigger(window,'popstate');
				});

				// Initialise Alias
				if ( History.getHash() ) {
					History.Adapter.onDomLoad(function(){
						History.Adapter.trigger(window,'hashchange');
					});
				}
			}

		} // !History.emulated.pushState


	}; // History.initCore

	// Try to Initialise History
	if (!History.options || !History.options.delayInit) {
		History.init();
	}

})(window);

/* Core deps */
;(function(undefined, $) { if (Meetup.MustacheTemplates === undefined) { Meetup.MustacheTemplates = {}; }; Meetup.MustacheTemplates['messaging'] = $.extend(Meetup.MustacheTemplates['messaging'] || {}, {"viewHeader": "{{! the Desktop equivalent of navBarDetail for messaging views }}\n{{#viewConfig}}\n<div id=\"{{viewId}}\" class=\"{{class}}\">\n{{/viewConfig}}\n{{#innerWrap}}\n\t<div class=\"messagesInnerWrapper\">\n{{/innerWrap}}\n\n\n{{#navbar}}\n<div class=\"topBar ffbox\">\n\t{{#titleBlock}}\n\t\t<div class=\"ffbox-flex\">\n\t\t\t{{title}}\n\t\t\t{{#actionButtons}}\n\t\t\t\t<a class=\"{{classes}}\" {{#content}}data-content=\"{{.}}\"{{/content}}>\n\t\t\t\t\t{{{html}}}\n\t\t\t\t</a>\n\t\t\t{{/actionButtons}}\n\t\t</div>\n\t{{/titleBlock}}\n\t{{#actionButton}}\n\t<a  href=\"{{{urlTarget}}}\"\n\t\t{{#id}}id=\"{{id}}\"{{/id}}\n\t\tclass=\"ffbox-fix j-action {{classes}}\">\n\t\t{{{html}}}\n\t</a>\n\t{{/actionButton}}\n</div>\n\n{{/navbar}}\n", "viewFooter": "\t{{#innerWrap}}</div>{{/innerWrap}}\n</div>\n", "addMembers": "<div class=\"addMembers-pickWrapper j-pickWrapper\"></div>\n<div class=\"addMembers-participantsWrapper line\">\n\t<div class=\"addMembers-participants j-addMembers-participants unit size4of5\">\n\t\t{{> memberListPartial}}\n\t</div>\n\t<div class=\"addMembers-saveButtonWrapper lastUnit\">\n\t\t<a href=\"#\" class=\"addMembers-cancelButton\">{{cancelText}}</a>\n\t\t<button class=\"addMembers-saveButton j-addMembers-saveButton messagingButton\">{{addMembersText}}</button>\n\t</div>\n</div>\n", "recipientCollection": "<div class='recipients display-none'></div>", "newConversationPartial": "{{>viewHeader}}\n\n<div id=\"convoNewContainer\">\n\t<div id=\"j-memberPickerContainer\"></div>\n\t{{#originText}}<div class=\"convoNew-originStrip small ellipsize\">{{{../originText}}}</div>{{/originText}}\n</div>\n\n{{>viewFooter}}", "message": "<li class='message {{#start}}start{{/start}} noFocus {{#isNullMember}}message--nullMember{{/isNullMember}}' role='listitem' tabindex='0'>\n\t{{#start}}\n\t\t<div class='message-avatarWrapper'>\n\t\t\t<img class='message-avatarImage' src='{{member.photo.thumb_link}}'>\n\t\t</div>\n\t{{/start}}\n\t<div class='message-contentWrapper'>\n\t\t{{#start}}\n\t\t\t<div class='message-detailsContainer'>\n\t\t\t\t{{#if isNullMember}}\n\t\t\t\t\t<span class='message-authorName'>{{member.name}}</span>\n\t\t\t\t{{else}}\n\t\t\t\t\t<a class='message-authorName j-authorName' data-id='{{member.id}}'>{{member.name}}</a>\n\t\t\t\t{{/if}}\n\t\t\t\t<span class='message-timestamp'>{{timestamp}}</span>\n\t\t\t\t<div class='message-origin small ellipsize'>{{{originText}}}</div>\n\t\t\t</div>\n\t\t{{/start}}\n\t\t<div class='message-text wrapNice'>{{#if isGeo}}<a href=\"{{staticMapLinkURL}}\" target=\"_blank\"><img class=\"message-map\" src=\"{{staticMapImageURL}}\" /></a>{{else}}{{{escapedText}}}{{/if}}</div>\n\t</div>\n</li>\n", "composeBox": "<div id=\"messageDetails\"></div>\n{{! note that this template produces TWO root-level els }}\n<div class=\"messaging-bottomControls composeBox clearfix\" id=\"message-controls\">\n\t{{!-- State to show if no blocker IDs present --}}\n\t{{#if open}}\n\t<textarea maxlength=\"30000\" class=\"composeBox-textArea\" id=\"{{composeBoxId}}\" placeholder=\"{{placeholderText}}\"></textarea>\n\t{{^composeOnly}}\n\t\t<div class=\"composeBox-buttonContainer\">\n\t\t\t<button class=\"composeBox-sendButton inline j-messageSend messagingButton\" id=\"{{composeBoxSendId}}\">{{sendText}}</button>\n\t\t\t{{#helpText}}<div class=\"muted composeBox-helpText align-center\">{{shiftEnter}}</div>{{/helpText}}\n\n\t\t</div>\n\t{{/composeOnly}}\n\t{{/if}}\n\n\t{{!-- State to show if the user is blocking the other user --}}\n\t{{#if selfBlocked}}\n\t\t<div class=\"composeBox-blocked line\">\n\t\t\t<div class=\"unit size2of3\">\n\t\t\t\t<h3>{{blockTitleText}}</h3>\n\t\t\t\t<p class=\"muted\">{{convoLockedText}}</p>\n\t\t\t</div>\n\t\t\t<div class=\"unit lastUnit align-right\">\n\t\t\t\t<button id=\"messaging-unblock\" class=\"primary messagingButton composeBox-unblockButton span-75\">{{unblockText}}</button>\n\t\t\t</div>\n\t\t</div>\n\t{{/if}}\n\n\t{{!-- State to show if the user is blocking the other user --}}\n\t{{#if blocked}}\n\t<div class=\"composeBox-blocked line\">\n\t\t<h3>{{blockedText}}</h3>\n\t\t<p class=\"muted\">{{blockedHelpText}}</p>\n\t</div>\n\t{{/if}}\n</div>\n", "participantsHeader": "<div class=\"participantsHeader\">\n\tParticipants ({{count}})\n</div>", "overlay": "<div class=\"messagingOverlay noFocus {{overlayClass}}\" id=\"{{overlayId}}\" tabindex=\"0\">\n\t<div class=\"clearfix\">\n\t{{> header }}\n\t{{#closeButton}}\n\t\t<i class=\"icon-x muted messagingOverlay-close j-close\"></i>\n\t{{/closeButton}}\n\t</div>\n\t<div class=\"messagingOverlay-contentScroller\">\n\t\t<div class=\"messagingOverlay-content\">\n\t\t\t{{> content }}\n\t\t</div>\n\t</div>\n</div>\n", "recipient": "<div class='recipients-token'>\n\t{{name}} <a href=\"#\" class=\"j-remove\"><i class='icon icon-x'></i></a>\n</div>\n", "memberListPartial": "<b>{{currentMembersText}} ({{count}}):</b>\n<ul class=\"inline commaList\">\n\t{{#members}}\n\t\t<li>{{name}}</li>\n\t{{/members}}\n</ul>\n", "leaveConfirm": "<div class=\"leaveConfirmOverlay-headerText\">{{leaveHeaderText}}</div>\n<div class=\"leaveConfirmOverlay-mainText\">{{leaveHelperText}}</div>\n<button class=\"leaveConfirmOverlay-leaveButton j-leaveConfirmOverlay-leaveButton\">{{leaveText}}</button>\n<button class=\"leaveConfirmOverlay-cancelButton j-leaveConfirmOverlay-cancelButton\">{{nevermindText}}</button>\n", "activeConversation": "<div id=\"convo\" class=\"messagesInnerWrapper activeConvo\">\n</div>\n", "messagingMemberPick": "<div class=\"memberPicker\">\n\t<div class=\"recipientTokenizer j-recipientTokenizer clearfix\">\n\t\t<label class=\"recipientTokenizer-prompt\">{{prompt}}:</label>\n\t\t<div id=\"recipients\" title=\"Recipients\"></div>\n\t\t<div class=\"recipientTokenizer-input\">\n\t\t\t<input class=\"recipient-input member-search j-member-search\" title=\"{{title}}\" type=\"text\"/>\n\t\t</div>\n\t</div>\n\t<div class='memberList-wrapper j-memberList-wrapper'></div>\n</div>", "flashMessage": "<div class=\"flashMessage flashMessage--{{alertType}} {{controlClass}}\" data-cid=\"{{cid}}\">\n\t{{#closeButton}}<a href=\"#\" class=\"j-flashMessageClose\"><i class=\"flashMessage-close icon-x\"></i></a>{{/closeButton}}\n\t{{#icon}}<i class=\"icon-m icon-{{icon}}\"></i>{{/icon}} {{content}}\n</div>", "messageCollection": "<ul class='j-messageList messageList' role=\"list\"></ul>\n", "blockForm": "<form id=\"messaging-block-form\" class=\"reportForm\">\n\t<div class=\"reportForm-prompt\">{{prompt}}</div>\n\n\t<div class=\"reportForm-block\">\n\t\t<label class=\"blockForm-label\" for=\"messaging-report-toggle\">\n\t\t\t<input type=\"checkbox\" id=\"messaging-report-toggle\" name=\"report\" value=\"true\" />\n\t\t\t{{reportUserPrompt}}\n\t\t</label>\n\t</div>\n\n\t<div id=\"messaging-report-form\" class=\"reportForm-block hidden\">\n\t\t<label class=\"muted\">\n\t\t\t{{additionalReportPrompt}}\n\t\t\t<textarea class=\"reportForm-textArea\" name=\"reportDetails\" placeholder=\"{{reportPlaceholder}}\"></textarea>\n\t\t</label>\n\t\t<label class=\"reportForm-label\" for=\"report-isSpam\">\n\t\t\t<input class=\"valign-top\" id=\"report-isSpam\" value=\"true\" type=\"checkbox\" name=\"isSpam\" />\n\t\t\t<div class=\"inline-block size3of4\">\n\t\t\t\t{{isSpamPrompt}}\n\t\t\t\t<p class=\"muted\">\n\t\t\t\t\t{{spamHelpText}}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</label>\n\t</div>\n\n\t<button class=\"button--blue messagingButton\" type=\"submit\">{{action}}</button>\n\t<a href=\"#\" class=\"unlink j-close reportForm-cancel\">{{cancel}}</a>\n</form>\n", "memberInfo": "<a href=\"#\" class=\"inline-block avatar avatar--person memberInfo-avatar\" style=\"background-image: url({{photo.photo_link}});\">\n{{name}}\n</a>\n<div class=\"memberInfo-memberName\">{{name}}</div>\n<h5 class=\"muted\">\n\t<ul class=\"commaList inlineList memberInfo-groups\">\n\t{{#common_groups}}\n\t\t<li><a href=\"{{link}}\" class=\"unlink\" target=\"_blank\">{{name}}</a></li>\n\t{{/common_groups}}\n\t</ul>\n</h5>\n<hr class=\"memberInfo-hr\">\n<div class=\"memberInfo-links\">\n\t<a href=\"{{link}}\" target=\"_blank\">{{visitProfileText}}</a>\n\t\t<div class=\"memberInfo-bullet inline-block valign-middle\"></div>\n\t{{#isSkeleton}}\n\t\t<em class=\"muted\">{{leftConversationText}}</em>\n\t{{/isSkeleton}}\n\t{{^isSkeleton}}\n\t\t{{#blocked}}\n\t\t\t<a href=\"#\" class=\"j-unblockMember\">{{unblockText}}</a>\n\t\t{{/blocked}}\n\t\t{{^blocked}}\n\t\t\t<a href=\"#\" class=\"j-blockMember\">{{blockText}}</a>\n\t\t{{/blocked}}\n\t{{/isSkeleton}}\n</div>", "titleControls": "{{^isMobile}}\n{{!- displayControl shows when title is not being edited, editControl shows when title is being edited }}\n<div class=\"titleControlsTop j-titleControlsTop\">\n\t<div class=\"ffbox\">\n\t\t{{! Participants button }}\n\t\t{{#isGroup}}\n\t\t<div class=\"ffbox-fix\">\n\t\t\t<a class='titleControlsTop-participantsButton j-viewParticipants inline-block' title='View Participants'>\n\t\t\t\t<i class=\"icon icon-messaging-circle-person\"></i>\n\t\t\t\t<span class=\"inline-block titleControlsTop-participantsButtonCount\">{{count}}</>\n\t\t\t</a>\n\t\t</div>\n\t\t{{/isGroup}}\n\n\t\t<div class=\"ffbox-flex\">\n\n\t\t\t{{! title and controls go here }}\n\t\t\t<div class=\"ffbox\" id=\"titleBox\">\n\n\t\t\t\t{{! title, common groups (if 1-1), and (if group) edit field }}\n\t\t\t\t<div class=\"ffbox-flex\">\n\n\t\t\t\t\t<div class=\"ffbox\">\n\t\t\t\t\t\t{{! the title }}\n\t\t\t\t\t\t<div class=\"j-title-text title-text titleControlsTop-displayControl ffbox-fix\">{{title}}</div>\n\n\t\t\t\t\t\t{{#isGroup}}\n\t\t\t\t\t\t<div class=\"ffbox-flex titleControlsTop-displayControl\">\n\t\t\t\t\t\t\t<a class=\"titleControlsTop-editNameButton j-editNameButton\" title='{{editTitle}}'>{{#isTitleUnmodified}}{{setNameText}}{{/isTitleUnmodified}}{{^isTitleUnmodified}}{{editText}}{{/isTitleUnmodified}}</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t{{/isGroup}}\n\n\t\t\t\t\t</div>\n\n\t\t\t\t\t{{! the edit field }}\n\t\t\t\t\t{{#isGroup}}\n\t\t\t\t\t\t<input class='titleControlsTop-editNameInput titleControlsTop-editControl j-editNameInput' placeholder=\"{{editTitlePlaceholder}}\" type=\"text\" maxlength=\"55\" />\n\t\t\t\t\t{{/isGroup}}\n\n\t\t\t\t</div>\n\n\t\t\t\t{{! edit title control buttons }}\n\t\t\t\t{{#isGroup}}\n\t\t\t\t<div class=\"ffbox-fix titleControlsTop-editControl\">\n\t\t\t\t\t<button class='titleControlsTop-editCancelButton j-editCancelButton' title='{{cancelText}}'>{{cancelText}}</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"ffbox-fix titleControlsTop-editControl\">\n\t\t\t\t\t<button class='titleControlsTop-editSaveButton j-editSaveButton' title='{{saveText}}'>{{saveText}}</button>\n\t\t\t\t</div>\n\t\t\t\t{{/isGroup}}\n\n\t\t\t\t{{! other convo controls get appended }}\n\n\t\t\t\t<div class=\"ffbox-fix\">\n\t\t\t\t\t<button class=\"titleControlsTop-openControlsButton j-toggleControls noFocus\" title=\"{{openControlsText}}\">\n\t\t\t\t\t\t<i class=\"icon icon-more\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</div>\n{{/isMobile}}\n{{#isMobile}}\n{{>mobile.navBarDetail}}\n{{/isMobile}}\n", "convoControls": "{{!-- Mobile Layout --}}\n{{#isMobile}}\n\t{{#isGroup}}\n\t<div class=\"line\">\n\t\t<a href=\"#\"\n\t\t\tclass='unit size1of2 messagingOverlay-gridButton {{#isArchived}}j-unarchiveConvoButton{{/isArchived}}{{^isArchived}}j-archiveConvoButton{{/isArchived}}'>\n\t\t\t<i class=\"icon {{#isArchived}}icon-messaging-unarchive{{/isArchived}}{{^isArchived}}icon-messaging-archive{{/isArchived}}\"></i>\n\t\t\t<p class=\"titleControlstop-label\">{{#isArchived}}{{unarchiveText}}{{/isArchived}}{{^isArchived}}{{archiveText}}{{/isArchived}}</p>\n\t\t</a>\n\t\t<a href=\"#\"\n\t\t\tclass='lastUnit {{#muted}}titleControlsTop-muteConvoButton--muted{{/muted}} j-muteConvoButton messagingOverlay-gridButton'\n\t\t\ttitle='{{muteConvoText}}'>\n\t\t\t<i class=\"icon icon-messaging-mute\"></i>\n\t\t\t<p class=\"titleControlsTop-label\">{{#muted}}{{unmuteText}}{{/muted}}{{^muted}}{{muteText}}{{/muted}}</p>\n\t\t</a>\n\t</div>\n\t<div class=\"line\">\n\t\t<a href=\"#\" class='unit size1of2 j-leaveConvoButton messagingOverlay-gridButton' title=\"{{leaveConvoText}}\">\n\t\t\t<i class=\"icon icon-messaging-leave\"></i>\n\t\t\t<p class=\"titleControlsTop-label\">{{leaveText}}</p>\n\t\t</a>\n\t\t<a href=\"#\" class='lastUnit j-reportConvoButton messagingOverlay-gridButton' title=\"{{reportConvoText}}\">\n\t\t\t<i class=\"icon icon-messaging-report\"></i>\n\t\t\t<p class=\"titleControlsTop-label\">{{reportText}}</p>\n\t\t</a>\n\t</div>\n\t<div class=\"line align-center\">\n\t\t<a href=\"#\"\n\t\t\tclass='j-addMembersButton messagingOverlay-gridButton'\n\t\t\ttitle='{{addPeopleText}}'>\n\t\t\t<i class=\"icon icon-messaging-add-people\"></i>\n\t\t\t<p class=\"titleControlsTop-label\">{{addPeopleText}}</p>\n\t\t</a>\n\t</div>\n\t<div class=\"line\">\n\t\t<p><a class=\"j-editTitle\" href=\"#\">{{setNameText}}</a></p>\n\t\t<p><a class=\"j-viewParticipants\" href=\"#\">{{viewParticipantsText}}</a></p>\n\t</div>\n\t{{/isGroup}}\n\t{{^isGroup}}\n\t\t<div class=\"line\">\n\t\t<a href=\"#\"\n\t\t\tclass='unit size1of2 messagingOverlay-gridButton {{#isArchived}}j-unarchiveConvoButton{{/isArchived}}{{^isArchived}}j-archiveConvoButton{{/isArchived}}'>\n\t\t\t<i class=\"icon {{#isArchived}}icon-messaging-unarchive{{/isArchived}}{{^isArchived}}icon-messaging-archive{{/isArchived}}\"></i>\n\t\t\t<p class=\"titleControlstop-label\">{{#isArchived}}{{unarchiveText}}{{/isArchived}}{{^isArchived}}{{archiveText}}{{/isArchived}}</p>\n\t\t</a>\n\t\t<a href=\"#\" class='lastUnit j-reportConvoButton messagingOverlay-gridButton' title=\"{{reportConvoText}}\">\n\t\t\t<i class=\"icon icon-messaging-report\"></i>\n\t\t\t<p class=\"titleControlsTop-label\">{{reportText}}</p>\n\t\t</a>\n\t{{/isGroup}}\n{{/isMobile}}\n\n\n{{!-- Desktop Layout --}}\n{{^isMobile}}\n\t<ul class=\"messaging-convoControls resetList\">\n\t\t<li>\n\t\t\t<a href=\"#\"\n\t\t\t\tclass=\"{{#isArchived}}j-unarchiveConvoButton{{/isArchived}}{{^isArchived}}j-archiveConvoButton{{/isArchived}} convoControl-link\" title=\"{{#isArchived}}{{unarchiveText}}{{/isArchived}}{{^isArchived}}{{archiveText}}{{/isArchived}}\">\n\t\t\t\t<span class=\"convoControl-label valign-middle\">{{#isArchived}}{{unarchiveText}}{{/isArchived}}{{^isArchived}}{{archiveText}}{{/isArchived}}</span><i class=\"icon {{#isArchived}}icon-messaging-unarchive{{/isArchived}}{{^isArchived}}icon-messaging-archive{{/isArchived}}\"></i>\n\t\t\t</a>\n\t\t</li>\n\t\t{{#isGroup}}\n\t\t<li>\n\t\t\t<a href=\"#\"\n\t\t\tclass='{{#muted}}titleControlsTop-muteConvoButton--muted{{/muted}} j-muteConvoButton convoControl-link'\n\t\t\ttitle='{{muteConvoText}}'>\n\t\t\t\t<span class=\"convoControl-label valign-middle\">{{#muted}}{{unmuteText}}{{/muted}}{{^muted}}{{muteText}}{{/muted}}</span> <i class=\"icon icon-messaging-mute\"></i>\n\t\t\t</a>\n\t\t</li>\n\n\t\t<li>\n\t\t\t<a href=\"#\" class='j-leaveConvoButton convoControl-link' title=\"{{leaveConvoText}}\">\n\t\t\t\t<span class=\"convoControl-label valign-middle\">{{leaveText}}</span> <i class=\"icon icon-messaging-leave\"></i>\n\t\t\t</a>\n\t\t</li>\n\t\t{{/isGroup}}\n\n\t\t<li>\n\t\t\t<a href=\"#\" class='j-reportConvoButton convoControl-link' title=\"{{reportConvoText}}\">\n\t\t\t\t<span class=\"convoControl-label valign-middle\">{{reportText}}</span> <i class=\"icon icon-messaging-report\"></i>\n\t\t\t</a>\n\t\t</li>\n\n\t\t{{#isGroup}}\n\t\t<li>\n\t\t\t<a href=\"#\" class='j-addMembersButton convoControl-link'>\n\t\t\t\t<span class=\"convoControl-label valign-middle\">{{addPeopleText}}</span> <i class=\"icon icon-messaging-add-people\"></i>\n\t\t\t</a>\n\t\t</li>\n\t\t{{/isGroup}}\n\t</ul>\n{{/isMobile}}\n\n\n", "flashMessagesCollection": "", "reportForm": "<form class=\"reportForm\" id=\"messaging-report-form\">\n\t<div class=\"reportForm-prompt\">{{prompt}}</div>\n\n\t<div class=\"reportForm-block line\">\n\t\t<div class=\"unit size1of2\">\n\t\t\t<label class=\"muted reportForm-selectLabel\">\n\t\t\t\t{{whoAreYouReporting}}\n\t\t\t</label>\n\t\t</div>\n\t\t<div class=\"unit size1of2\">\n\t\t\t<select name=\"memberId\" class=\"reportForm-select\">\n\t\t\t\t{{#members}}\n\t\t\t\t<option value=\"{{id}}\">{{name}}</option>\n\t\t\t\t{{/members}}\n\t\t\t</select>\n\t\t</div>\n\t</div>\n\n\t<label class=\"muted\">\n\t\t{{additionalReportPrompt}}\n\t\t<textarea class=\"reportForm-textArea\" name=\"reportDetails\" placeholder=\"{{reportPlaceholder}}\"></textarea>\n\t</label>\n\n\n\t<label for=\"report-isSpam\">\n\t\t<input type=\"checkbox\" id=\"report-isSpam\" class=\"valign-top\" name=\"isSpam\" value=\"true\" />\n\t\t<div class=\"reportForm-labelText inline-block\">\n\t\t\t{{isSpamPrompt}}\n\t\t\t<p class=\"muted\">\n\t\t\t\t{{spamHelpText}}\n\t\t\t</p>\n\t\t</div>\n\t</label>\n\n\t<label class=\"margin-bottom\" for=\"report-isBlock\">\n\t\t<input type=\"checkbox\" id=\"report-isBlock\" class=\"valign-top\" name=\"isBlock\" value=\"true\" />\n\t\t<div class=\"reportForm-labelText inline-block\">\n\t\t\t{{isBlockPrompt}}\n\t\t</div>\n\t</label>\n\n\t<button type=\"submit\" class=\"reportForm-submit messagingButton\">{{action}}</button>\n\t<a href=\"#\" class=\"unlink j-close reportForm-cancel\">{{cancel}}</a>\n</form>\n", "helpText": "{{#emptyInit}}\n\t<div class=\"noConversationsText\">\n\t\t<p>{{{noConvoLine1}}}</p>\n\t\t<p>{{{noConvoLine2}}}</p>\n\t\t<hr>\n\t\t<p class=\"noConversationsText--tip\">{{noConvoTip}}</p>\n\t</div>\n{{/emptyInit}}\n\n{{^emptyInit}}\n\t<div class='noConversationSelected'>\n\t\t<h4 class=\"muted\">{{noConversationSelected}}</h4>\n\t\t{{#archiveText}}\n\t\t<div class='archiveHelpText muted'></div>\n\t\t{{/archiveText}}\n\t</div>\n{{/emptyInit}}\n", "messaging": "{{! ----------------- Desktop Wrapper -------------------------- }}\n{{! For proper sizing of the desktop client                      }}\n{{^isMobile}}\n\t<div id=\"messagingClient\">\n{{/isMobile}}\n\n{{! ----------------- Conversation List View ------------------- }}\n{{! Mostly static - header doesn't change, just the convo list   }}\n{{#convoList}}\n\t{{^isMobile}}{{>messaging.viewHeader}}{{/isMobile}}\n\t{{#isMobile}}{{>mobile.viewOpen}}{{/isMobile}}\n\n\t<div class=\"conversationsWrapper\" id=\"conversationsWrapper\">\n\t\t{{#isMobile}}\n\t\t<div class=\"newConvoButtonWrapper messaging-topControls row paddingLeft\" style=\"-webkit-box-align:center;\">\n\t\t\t<a class=\"j-openInbox row-item row-item--shrink row-item--alignMiddle topBar-convoListSwitch\">{{trnInbox}}</a>\n\t\t\t<a class=\"j-openArchive row-item row-item--alignMiddle topBar-convoListSwitch\">{{trnArchive}}</a>\n\t\t\t<div class=\"row-item row-item--shrink row-item--alignMiddle\">\n\t\t\t\t<a href=\"?new_convo=true\" class=\"newConvoButton\"><i class=\"icon-messaging-new-message\"></i></a>\n\t\t\t</div>\n\t\t</div>\n\t\t{{/isMobile}}\n\t\t<div class=\"conversationsListWrapper\" id=\"conversations\" role=\"navigation\">\n\t\t</div>\n\t</div>\n\n\t{{#isMobile}}{{>mobile.viewClose}}{{/isMobile}}\n\t{{^isMobile}}{{>messaging.viewFooter}}{{/isMobile}}\n{{/convoList}}\n\n\n{{! ----------------- Conversation View - #messaging-convoDetail ------------------ }}\n{{! All dynamic - we'll load the default/empty state initially, but replace it all\t}}\n{{! using javascript when a convo is loaded\t\t\t\t\t\t\t\t\t\t\t}}\n\n{{#convoDetail}}\n\t{{! no navbar here, just a 'view' div }}\n\t{{^isMobile}}{{>messaging.viewHeader}}{{/isMobile}}\n\t{{#isMobile}}{{>mobile.viewOpen}}{{/isMobile}}\n\n\t<div id=\"convoDetail\"></div>\n\n\t{{#isMobile}}{{>mobile.viewClose}}{{/isMobile}}\n\t{{^isMobile}}{{>messaging.viewFooter}}{{/isMobile}}\n{{/convoDetail}}\n\n\n{{! ----------------- New Conversation View - #messaging-convoNew -----------------\t}}\n{{! Mostly static - view state is cleared by Javascript but markup remains the same\t}}\n\n{{#convoNew}}\n\t{{^isMobile}}{{>messaging.viewHeader}}{{/isMobile}}\n\t{{#isMobile}}{{#convoNew}}{{>mobile.viewOpen}}{{/convoNew}}{{/isMobile}}\n\n\t<div id=\"convoNewContainer\">\n\t\t{{! <div id=\"messagingOverlay\" class=\"messagingOverlay\"></div> }}\n\t\t<div id=\"j-memberPickerContainer\"></div>\n\t</div>\n\n\t{{#isMobile}}{{>mobile.viewClose}}{{/isMobile}}\n\t{{^isMobile}}{{>messaging.viewFooter}}{{/isMobile}}\n{{/convoNew}}\n\n{{! ----------------- Desktop Wrapper -------------------------- }}\n{{! For proper sizing of the desktop client                      }}\n{{^isMobile}}\n\t</div>\n{{/isMobile}}\n"}); })(undefined, jQuery);

/* The actual shit */
/*!
	Autosize 1.18.17
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function ($) {
	var
	defaults = {
		className: 'autosizejs',
		id: 'autosizejs',
		append: '\n',
		callback: false,
		resizeDelay: 10,
		placeholder: true
	},

	// border:0 is unnecessary, but avoids a bug in Firefox on OSX
	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	typographyStyles = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent',
		'whiteSpace'
	],

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css('lineHeight') === '99px') {
		typographyStyles.push('lineHeight');
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		if (!this.length) {
			return this;
		}

		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
			ta = this,
			$ta = $(ta),
			maxHeight,
			minHeight,
			boxOffset = 0,
			callback = $.isFunction(options.callback),
			originalStyles = {
				height: ta.style.height,
				overflow: ta.style.overflow,
				overflowY: ta.style.overflowY,
				wordWrap: ta.style.wordWrap,
				resize: ta.style.resize
			},
			timeout,
			width = $ta.width(),
			taResize = $ta.css('resize');

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}
			$ta.data('autosize', true);

			if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box'){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			// IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
			minHeight = Math.max(parseFloat($ta.css('minHeight')) - boxOffset || 0, $ta.height());

			$ta.css({
				overflow: 'hidden',
				overflowY: 'hidden',
				wordWrap: 'break-word' // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
			});

			if (taResize === 'vertical') {
				$ta.css('resize','none');
			} else if (taResize === 'both') {
				$ta.css('resize', 'horizontal');
			}

			// getComputedStyle is preferred here because it preserves sub-pixel values, while jQuery's .width() rounds to an integer.
			function setWidth() {
				var width;
				var style = window.getComputedStyle ? window.getComputedStyle(ta, null) : null;

				if (style) {
					width = parseFloat(style.width);
					if (style.boxSizing === 'border-box' || style.webkitBoxSizing === 'border-box' || style.mozBoxSizing === 'border-box') {
						$.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i,val){
							width -= parseFloat(style[val]);
						});
					}
				} else {
					width = $ta.width();
				}

				mirror.style.width = Math.max(width,0) + 'px';
			}

			function initMirror() {
				var styles = {};

				mirrored = ta;
				mirror.className = options.className;
				mirror.id = options.id;
				maxHeight = parseFloat($ta.css('maxHeight'));

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(typographyStyles, function(i,val){
					styles[val] = $ta.css(val);
				});

				$(mirror).css(styles).attr('wrap', $ta.attr('wrap'));

				setWidth();

				// Chrome-specific fix:
				// When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
				// made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
				if (window.chrome) {
					var width = ta.style.width;
					ta.style.width = '0px';
					var ignore = ta.offsetWidth;
					ta.style.width = width;
				}
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, originalHeight;

				if (mirrored !== ta) {
					initMirror();
				} else {
					setWidth();
				}

				if (!ta.value && options.placeholder) {
					// If the textarea is empty, copy the placeholder text into
					// the mirror control and use that for sizing so that we
					// don't end up with placeholder getting trimmed.
					mirror.value = ($ta.attr("placeholder") || '');
				} else {
					mirror.value = ta.value;
				}

				mirror.value += options.append || '';
				mirror.style.overflowY = ta.style.overflowY;
				originalHeight = parseFloat(ta.style.height) || 0;

				// Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
				mirror.scrollTop = 0;

				mirror.scrollTop = 9e4;

				// Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
				height = mirror.scrollTop;

				if (maxHeight && height > maxHeight) {
					ta.style.overflowY = 'scroll';
					height = maxHeight;
				} else {
					ta.style.overflowY = 'hidden';
					if (height < minHeight) {
						height = minHeight;
					}
				}

				height += boxOffset;

				if (Math.abs(originalHeight - height) > 1/100) {
					ta.style.height = height + 'px';

					// Trigger a repaint for IE8 for when ta is nested 2 or more levels inside an inline-block
					mirror.className = mirror.className;

					if (callback) {
						options.callback.call(ta,ta);
					}
					$ta.trigger('autosize.resized');
				}
			}

			function resize () {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					var newWidth = $ta.width();

					if (newWidth !== width) {
						width = newWidth;
						adjust();
					}
				}, parseInt(options.resizeDelay,10));
			}

			if ('onpropertychange' in ta) {
				if ('oninput' in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occasions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					$ta.on('input.autosize keyup.autosize', adjust);
				} else {
					// IE7 / IE8
					$ta.on('propertychange.autosize', function(){
						if(event.propertyName === 'value'){
							adjust();
						}
					});
				}
			} else {
				// Modern Browsers
				$ta.on('input.autosize', adjust);
			}

			// Set options.resizeDelay to false if using fixed-width textarea elements.
			// Uses a timeout and width check to reduce the amount of times adjust needs to be called after window resize.

			if (options.resizeDelay !== false) {
				$(window).on('resize.autosize', resize);
			}

			// Event for manual triggering if needed.
			// Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
			$ta.on('autosize.resize', adjust);

			// Event for manual triggering that also forces the styles to update as well.
			// Should only be needed if one of typography styles of the textarea change, and the textarea is already the target of the adjust method.
			$ta.on('autosize.resizeIncludeStyle', function() {
				mirrored = null;
				adjust();
			});

			$ta.on('autosize.destroy', function(){
				mirrored = null;
				clearTimeout(timeout);
				$(window).off('resize', resize);
				$ta
					.off('autosize')
					.off('.autosize')
					.css(originalStyles)
					.removeData('autosize');
			});

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(jQuery || $)); // jQuery or jQuery-like library, such as Zepto
;
define("autosize", function(){});

;(function () {
	// Global deps: Meetup.Copy, Meetup.MustacheTemplates.messaging.composeBox

	define('app/messages/views/ComposeBoxView',['jquery', 'backbone', 'underscore', 'handlebars', 'autosize', 'state', 'core/constants'], ComposeBoxView);

	function ComposeBoxView($, Backbone, _, Handlebars, Autosize, State, Constants) {

		/**
  * private vars for konami code entry
  */
		var sequenceTimeout,
		    kCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
		    keySequence = [],
		    Keyboard = Constants.Keyboard;

		/**
  * Compose box that lets you enter text and shit
  *
  * @class ComposeBoxView
  * @extends Backbone.View
  */
		return Backbone.View.extend({

			/**
   * Defaults that can and should be overridden on instantiation
   *
   * @property defaults
   */
			defaults: {
				enterSendMode: false,
				isMobile: false
			},

			/**
    * this.$el is a collection of jQuery objects, not a single $el
    *
    * this.$el.filter(".composeBox") will return the composeBox div
    */
			initialize: function initialize(options) {
				_.extend(this, this.defaults, options);

				if (this.model) this.model.on('change:blocker_member_ids', this.render, this);

				this.enterSendMode = this.enterSendMode || false;

				this.render();
			},

			template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.composeBox),

			templateVars: {
				placeholderText: Meetup.Copy['messaging.activeConvoPlaceholder'],
				sendText: Meetup.Copy['common.send'],
				blockTitleText: Meetup.Copy['messaging.youveBlockedThisPerson'],
				convoLockedText: Meetup.Copy['messaging.convoLocked'],
				unblockText: Meetup.Copy['common.unblock'],
				blockedText: Meetup.Copy['messaging.blocked'],
				blockedHelpText: Meetup.Copy['messaging.blockedHelp'],
				composeBoxId: 'messaging-text',
				composeBoxSendId: 'messaging-send',
				shiftEnter: Meetup.Copy['messaging.shiftEnterKeyboard'],
				open: function open() {
					return _.isEmpty(this.blocker_member_ids);
				},
				selfBlocked: function selfBlocked() {
					return _.contains(this.blocker_member_ids, State.Member.id);
				},
				blocked: function blocked() {
					return !_.isEmpty(_.reject(this.blocker_member_ids, function (id) {
						return id === State.Member.id;
					})) && !this.selfBlocked();
				}
			},

			events: function events() {
				var _events = {
					// "normal" events go here
				};

				// construct variable selector events
				_events['keydown ' + '#' + this.templateVars.composeBoxId] = 'handleTextAreaKeyPress';
				_events['paste ' + '#' + this.templateVars.composeBoxId] = 'handleTextAreaKeyPress';
				_events['keyup ' + '#' + this.templateVars.composeBoxId] = 'handleKeyup';
				_events['input ' + '#' + this.templateVars.composeBoxId] = 'handleKeyup';
				_events['click ' + '#' + this.templateVars.composeBoxSendId] = 'triggerSend';

				return _events;
			},

			handleResize: function handleResize() {
				this.trigger('composebox:resize');
			},

			handleKeyup: function handleKeyup() {
				this.trigger('composebox:keyup');
			},

			render: function render() {
				var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {}))),
				    $composeBox;

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				if (!this.isMobile) {
					$composeBox = this.$el.find('#' + this.templateVars.composeBoxId);
					$composeBox.autosize();
					$composeBox.on('autosize.resized', _.bind(this.handleResize, this));
				}

				return this;
			},

			/**
   * Handle a keypress within the text area. If it's an enter, either send the message or insert a newline depending on
   * the status of modifier keys. If you are butting up against the text limit, then display the text limit error.
   *
   * @method textAreaKeyPress
   * @param {Event} e the event
   */
			handleTextAreaKeyPress: function handleTextAreaKeyPress(e) {
				// If enter, send it.
				var keyCode = e.which || e.keyCode;

				this.checkKonamiCode(keyCode);

				// If butting up against limit, show error, UNLESS its a backspace that puts us into an OK spot
				if (e.target.value.length >= 30000 && !(keyCode === Keyboard.BACKSPACE && e.target.value.length - 1 < 30000)) {
					this.trigger('composebox:lengthlimit');
					return;
				} else {
					// Can auto hide if they back off
					this.trigger('composebox:underlimit');
				}

				// Shift/ctrl + enter sends, unless in enter send mode which then enter sends and shift enter
				if (keyCode === Keyboard.ENTER && (e.ctrlKey || e.shiftKey) !== this.enterSendMode) {
					e.preventDefault();
					this.triggerSend();
				}
			},

			/**
   * Trigger send event to be handled on a higher level
   *
   * @
   */
			triggerSend: function triggerSend(e) {
				this.trigger('composebox:send', this.getText());
				return false;
			},

			/**
   * Check to see if konami code has been triggered
   *
   * @method checkSequence
   */
			checkKonamiCode: function checkKonamiCode(keyCode) {
				keySequence.push(keyCode);

				clearTimeout(sequenceTimeout);

				// Keep it at the last kCode length chars
				if (keySequence.length > kCode.length) {
					keySequence.shift();
				}

				sequenceTimeout = setTimeout(function () {
					keySequence = [];
				}, 500);

				if (_.isEqual(keySequence, kCode)) {
					this.enterSendMode = true;
				}
			},

			/*
   * Utility function to get the value of the send text area as well as reset it.
   *
   * @method getText
   * @param {Boolean} clean whether to clean the text
   */
			getText: function getText() {
				var $textarea = this.$el.find('#' + this.templateVars.composeBoxId),
				    message = $.trim($textarea.val());

				return message;
			},

			reset: function reset() {
				this.$el.find('#' + this.templateVars.composeBoxId).val('').trigger('autosize.resize');
			},

			destroy: function destroy() {
				if (this.model) this.model.off(null, this.render);
				this.remove();
			}

		});
	}
})();

;(function () {
	define('shared/MemberSearch/SearchMemberModel',['jquery', 'backbone', 'underscore', 'core/constants'], SearchMemberModel);

	function SearchMemberModel($, Backbone, _, Constants) {
		

		/**
  * Represents a member. Expects following data from BE:
  *
  *{
  * "id": 128968152,
  * "name": "Lisa Dahl",
  * "photo": {
  *	"id": 171370712,
  *	"photo_link": "http://photos4.meetupstatic.com/photos/member/2/9/d/8/member_171370712.jpeg",
  *	"highres_link": null,
  *	"thumb_link": "http://photos2.meetupstatic.com/photos/member/2/9/d/8/thumb_171370712.jpeg"
  * }
  *}
  * @class SearchMemberModel
  * @extends Model
  */
		return Backbone.Model.extend({

			/*
   * Assign the thumbLink attribute based on the status of the member's photo.
   * Also assign selected attribute as false.
   *
   * @method parse
   * @return {Object} attrs the attributes to be set on the object
   */
			parse: function parse(attrs) {
				if (attrs.photo) {
					attrs.thumbLink = attrs.photo.thumb_link || attrs.photo;
				} else {
					attrs.thumbLink = Constants.NO_PHOTO;
				}

				attrs.selected = false;

				return attrs;
			}

		});
	}
})();

;(function () {
	define('shared/MemberSearch/SearchMemberCollection',['backbone', 'shared/MemberSearch/SearchMemberModel'], SearchMemberCollection);

	function SearchMemberCollection(Backbone, SearchMemberModel) {
		

		/**
  * Represents a list of member objects
  *
  * @class SearchMemberCollection
  * @extends Collection
  */
		return Backbone.Collection.extend({
			model: SearchMemberModel,

			/**
   * Method to mark a member in the collection as selected. Will mark all others as not selected. Used for keyboard navigation.
   *
   * @method selectMember
   * @param {Number} index the index to mark as selected
   */
			selectMember: function selectMember(index) {
				this.each(function (item, i) {
					item.set('selected', i === index);
				});
			}

		});
	}
})();

define('tmpl/memberSearch/member',['handlebars-runtime'], function (Handlebars) {

  return Handlebars.template({ "1": function _(depth0, helpers, partials, data) {
      return "selected";
    }, "3": function _(depth0, helpers, partials, data) {
      return "				<i class=\"icon icon-l icon-search\"></i>\n";
    }, "5": function _(depth0, helpers, partials, data) {
      var lambda = this.lambda,
          escapeExpression = this.escapeExpression;
      return "				<img class='member-avatarImage' src=\"" + escapeExpression(lambda(depth0 != null ? depth0.thumbLink : depth0, depth0)) + "\"/>\n";
    }, "7": function _(depth0, helpers, partials, data) {
      var stack1,
          lambda = this.lambda,
          escapeExpression = this.escapeExpression,
          buffer = escapeExpression(lambda(depth0 != null ? depth0.name : depth0, depth0));
      stack1 = helpers.unless.call(depth0, data && data.last, { "name": "unless", "hash": {}, "fn": this.program(8, data), "inverse": this.noop, "data": data });
      if (stack1 != null) {
        buffer += stack1;
      }
      return buffer + " ";
    }, "8": function _(depth0, helpers, partials, data) {
      return ",";
    }, "compiler": [6, ">= 2.0.0-beta.1"], "main": function main(depth0, helpers, partials, data) {
      var stack1,
          lambda = this.lambda,
          escapeExpression = this.escapeExpression,
          buffer = "<li class='member ";
      stack1 = helpers['if'].call(depth0, depth0 != null ? depth0.selected : depth0, { "name": "if", "hash": {}, "fn": this.program(1, data), "inverse": this.noop, "data": data });
      if (stack1 != null) {
        buffer += stack1;
      }
      buffer += " j-member' data-id=\"" + escapeExpression(lambda(depth0 != null ? depth0.id : depth0, depth0)) + "\">\n	<div class=\"ffbox\">\n		<div class=\"member-avatarWrapper ffbox-fix\">\n";
      stack1 = helpers['if'].call(depth0, depth0 != null ? depth0.empty : depth0, { "name": "if", "hash": {}, "fn": this.program(3, data), "inverse": this.program(5, data), "data": data });
      if (stack1 != null) {
        buffer += stack1;
      }
      buffer += "		</div>\n		<div class=\"member-detailsWrapper\">\n			<div>\n				<span class=\"member-name\">" + escapeExpression(lambda(depth0 != null ? depth0.name : depth0, depth0)) + "</span>\n				<div class=\"member-groups ellipsize\">\n					";
      stack1 = helpers.each.call(depth0, depth0 != null ? depth0.common_groups : depth0, { "name": "each", "hash": {}, "fn": this.program(7, data), "inverse": this.noop, "data": data });
      if (stack1 != null) {
        buffer += stack1;
      }
      return buffer + "\n				</div>\n			</div>\n		</div>\n	</div>\n</li>\n";
    }, "useData": true });
});

;(function () {
	define('shared/MemberSearch/SearchMemberView',['jquery', 'backbone', 'underscore', 'tmpl/memberSearch/member'], SearchMemberView);

	function SearchMemberView($, Backbone, _, MemberTpl) {
		

		/**
  * Renders a member model for display
  *
  * @class SearchMemberView
  * @extends View
  */
		return Backbone.View.extend({

			/**
   * @property template
   * @type {String}
   */
			template: MemberTpl,

			/**
   * Bind UI events
   *
   * @method delegateEvents
   */
			events: function events() {
				if (!this.suppressClick) {
					return {
						'click': 'handleClick'
					};
				}

				return;
			},

			/**
   * bind events, init is boring yawn
   *
   * @method init
   */
			initialize: function initialize() {
				this.render();

				this.listenTo(this.model, 'change:selected', this.render);
			},

			/*
   * Needs to trigger an event to be heard by the parent (usually memberpicker)
   *
   * @method handleClick
   */
			handleClick: function handleClick(e) {
				if (!this.model.get('empty')) this.model.trigger('member:click', this.model, e);
			},

			render: function render() {
				var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				return this;
			},

			/**
   * burn
   *
   * @method destroy
   */
			destroy: function destroy() {
				this.remove();
			}

		});
	}
})();

define('tmpl/memberSearch/memberCollection',['handlebars-runtime'], function (Handlebars) {

  return Handlebars.template({ "compiler": [6, ">= 2.0.0-beta.1"], "main": function main(depth0, helpers, partials, data) {
      return "<ul class='memberList'></ul>";
    }, "useData": true });
});

;(function () {
	define('shared/MemberSearch/SearchMemberCollectionView',['jquery', 'backbone', 'underscore', 'shared/MemberSearch/SearchMemberView', 'tmpl/memberSearch/memberCollection'], SearchMemberCollectionView);

	function SearchMemberCollectionView($, Backbone, _, SearchMemberView, MemberCollectionTpl) {
		

		/**
  * Render and display member objects contained in the collection model.
  *
  * @class SearchMemberCollectionView
  * @extends View
  */
		return Backbone.View.extend({

			/**
   * @property template
   * @type {Function}
   */
			template: MemberCollectionTpl,

			/**
   * Lock property to stop the mouse from interfering with keyboard navigation.
   *
   * @property mouseLock
   * @type {Boolean}
   */
			mouseLock: false,

			/**
   * Are we on the mobile site?
   *
   * @property isMobile
   * @type {Boolean}
   */
			isMobile: false,

			/**
   * Select the first member on render
   *
   * @property selectOnRender
   * @type {Boolean}
   */
			selectOnRender: true,

			/**
   * Currently selected member index.
   *
   * @property selectedIndex
   * @type {Number}
   */
			selectedIndex: 0,

			/*
   * Initialize child view array and bindings
   *
   * @method init
   */
			initialize: function initialize(options) {
				_.extend(this, _.pick(options, ['selectOnRender', 'isMobile', 'suppressClick']));

				this.render();

				this.listenTo(this.model, 'reset', this.render);
				this.listenTo(this, 'memberpicker:move', this.moveSelection);
				this.listenTo(this.model, 'member:click', this.handleMemberAdd);

				this.memberViews = [];
			},

			/**
   * Bind UI events
   *
   * @method delegateEvents
   */
			events: {
				'mouseover .j-member': 'handleMouseOver',
				'mousemove': 'unlockMouse'
			},

			/*
   * Render and append a member object to the list
   *
   * @method add
   * @param {Array} models the models that have been
   */
			handleAdd: function handleAdd(models) {
				models = _.isArray(models) ? models : [models];

				var createAndAdd = _.compose(this.addSubview, this.createSubview);

				_.each(models, function (model) {
					createAndAdd(model);
				}, this);
			},

			addSubview: function addSubview(view, fragment) {
				this.memberViews.push(view);

				if (fragment) {
					fragment.appendChild(view.el);
				} else {
					this.$el.append(view.$el);
				}
			},

			createSubview: function createSubview(model) {
				var memberView = new SearchMemberView({
					model: model,
					suppressClick: this.suppressClick
				});

				return memberView;
			},

			/**
   * Unlocks the mouse, allowing it to select items again.
   *
   * @method unlockMouse
   */
			unlockMouse: function unlockMouse() {
				this.mouseLock = false;
			},

			/*
   * Upon collection reset, calculate timestamps and render every message in collection
   *
   * @method render
   */
			render: function render() {
				var fragment,
				    vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				this.selectedIndex = 0;

				if (this.selectOnRender) {
					// CALL BEFORE RENDER LEST YOU DESTROY THE APPENDED ELEMENTS
					this.model.selectMember(this.selectedIndex);
				}

				this.memberViews = [];

				fragment = document.createDocumentFragment();

				this.model.each(function (member) {
					this.addSubview(this.createSubview(member), fragment);
				}, this);

				this.$el.html(fragment);

				return this;
			},

			/*
   * Move the "cursor" for the list of members.
   *
   * @method moveSelection
   * @param {Number} delta the amount to move the index
   */
			moveSelection: function moveSelection(delta) {
				var newIndex = this.selectedIndex + delta;
				this.mouseLock = true;

				// If this doesn't put us out of bounds, update the selected index.
				if (!(newIndex >= this.memberViews.length || newIndex < 0)) {
					this.makeSelection(newIndex);
					this.memberViews[newIndex].$el[0].scrollIntoView(true);
				}
			},

			/**
   * Select the member at a specified index, and update selected index
   *
   * @method makeSelection
   * @param {Number} index
   */
			makeSelection: function makeSelection(index) {
				if (!this.isMobile) {
					this.model.selectMember(index);
				}
				this.selectedIndex = index;
			},

			/*
   * Handler for when a member item has been clicked, resets the view.
   *
   * @method handleMemberAdd
   * @param {Event} e the event
   * @param {SearchMemberModel} member a member model that was added
   */
			handleMemberAdd: function handleMemberAdd(member) {
				this.model.reset();
				this.trigger('member:add', member);
			},

			/**
   * Handler to set the selected index based on the mouse's position
   *
   * @method handleMouseOver
   * @ {Event} e
   */
			handleMouseOver: function handleMouseOver(e) {
				var newIndex = this.$el.find('li.member').index($(e.currentTarget));
				// Compare to avoid unnecessary renders, also, if the mouse is locked ignore mouseover
				if (newIndex !== this.selectedIndex && !this.mouseLock) {
					this.makeSelection(newIndex);
				}
			},

			/**
   * destroy the model and all subviews
   *
   * @method destroy
   */
			destroy: function destroy() {
				_.invoke(this.memberViews, 'destroy');
				this.memberViews = [];
				this.remove();
			}

		});
	}
})();

;(function () {
	define('shared/MemberSearch/MemberPickerView',['jquery', 'backbone', 'underscore', 'state', 'core/api', 'core/constants'], MemberPickerView);

	function MemberPickerView($, Backbone, _, State, Api, Constants) {
		

		/**
   * Renders the generic member picker widget, for autocomplete search and more! It's self contained ~WoWzEr~
   * Emits the following events: search.memberpicker, done.search.memberpicker
   *
   * @class MemberPickerView
   * @extends View
   */
		var Keyboard = Constants.Keyboard;
		return Backbone.View.extend({

			/**
   * Class name of the search input
   *
   * @property searchElementClass
   * @type {String}
   */
			searchElementClass: 'memberSearch-input',

			/**
   * Keep track of previous search value
   *
   * @property searchVal
   * @type {String}
   */
			searchVal: '',

			/**
   * Inject child views, bind events.
   *
   * @method initialize
   */
			initialize: function initialize(options) {
				this.listenTo(this, 'memberpicker:search', _.debounce(this.lookAhead, 500));
			},

			/*
    * override lookAheadData to extend default API request params
    */
			lookAheadData: {},

			/**
   * Searches for members in current chapter by name using the memberSuggest API call
   * lookAhead can be overridden to provide a new API endpoint
   *
   * @method lookAhead
   * @param {String} val the value of the search input
   */
			lookAhead: function lookAhead(val) {
				if (val.length >= 2) {
					Api.RemoteApi.get({
						data: _.extend({
							'method': 'memberSuggestExclude',
							'arg_excludeMemberIds': null,
							'arg_memberId': State.Member.id,
							'arg_chapter': State.Chapter.id,
							'arg_token': val,
							'arg_offset': 0
						}, this.lookAheadData)
					}).done(_.bind(this.handleLookAhead, this));
				}
			},

			/**
    * successful AJAX response handler - override this for the basic usage
    * case where you just want to do something when members are returned
    */
			handleLookAhead: function handleLookAhead(members) {
				// exclude current member from results
				var filtered = _.reject(members, function (member) {
					return member.id === State.Member.id;
				});
				this.trigger('memberpicker:searchdone', members);
			},

			events: function events() {
				var _events = {};

				// handle search input events
				_events['focus ' + '.' + this.searchElementClass] = 'handleChange';
				_events['keyup ' + '.' + this.searchElementClass] = 'handleChange';
				_events['input ' + '.' + this.searchElementClass] = 'handleChange';

				return _events;
			},

			/**
   * Focuses the search input
   *
   * @method focusInput
   */
			focusInput: function focusInput() {
				if (this.el.offsetParent !== null) {
					this.$el.find('.' + this.searchElementClass)[0].focus();
				}
			},

			/*
   * Handler to handle a change in the search input
   *
   * @method handleChange
   * @param {Event} e the event
   */
			handleChange: function handleChange(e) {
				if (this.searchVal !== $(e.target).val()) {
					this.trigger('memberpicker:search', $(e.target).val());
					this.searchVal = $(e.target).val();
				}
			}
		});
	}
})();

;(function () {
	// Global deps: Meetup.MustacheTemplates.messaging.recipient

	define('app/messages/views/RecipientView',['jquery', 'backbone', 'handlebars'], RecipientView);

	function RecipientView($, Backbone, Handlebars) {
		

		/**
  * Displays a pilled recipient.
  *
  * @class RecipientView
  * @extends View
  * @module Meetup.Backbone
  */
		return Backbone.View.extend({

			/**
    * @property template
    * @type {String}
    */
			template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.recipient),

			events: {
				'click .j-remove': 'handleClick'
			},

			initialize: function initialize() {
				this.render();
			},

			render: function render() {
				var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				return this;
			},

			/**
   * Handler for when a recipient view has been clicked on. Destroys underlying model, which will signal collection
   * and thus signal removal of this view.
   *
   * @method handleClick.
   */
			handleClick: function handleClick(e) {
				this.model.trigger('destroy', this.model);
				return false;
			},

			/**
   * burn it
   *
   * @method destroy
   */
			destroy: function destroy() {
				this.remove();
			}

		});
	}
})();

;(function () {
	// Global deps:  Meetup.MustacheTemplates.messaging.recipientCollection

	define('app/messages/views/RecipientCollectionView',['jquery', 'backbone', 'underscore', 'handlebars', './RecipientView'], RecipientCollectionView);

	function RecipientCollectionView($, Backbone, _, Handlebars, RecipientView) {
		

		/**
  * In charge of displaying list of pilled recipients. Wraps over MemberCollection.
  * Has child views: RecipientViews
  *
  * @class RecipientCollectionView
  * @extends View
  * @module Meetup.Backbone
  */
		return Backbone.View.extend({

			/**
   * @property template
   */
			template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.recipientCollection),

			/*
   * Bind custom events, instantiate subview containers
   *
   * @method init
   */
			initialize: function initialize() {
				this.render();

				this.listenTo(this.model, 'reset', this.render).listenTo(this.model, 'remove', this.removeSubview).listenTo(this.model, 'add', this.handleAdd).listenTo(this.model, 'all', this.handleVisibility);

				this.recipientViews = [];
			},

			handleAdd: function handleAdd(models) {
				models = _.isArray(models) ? models : [models];

				var createAndAdd = _.bind(_.compose(this.addSubview, this.createSubview), this);

				_.each(models, function (model) {
					// this.addSubview(this.createSubview(model));
					createAndAdd(model);
				}, this);
			},

			addSubview: function addSubview(view, fragment) {
				this.recipientViews.push(view);

				if (fragment) {
					fragment.appendChild(view.el);
				} else {
					this.$el.append(view.$el);
				}
			},

			createSubview: function createSubview(model) {
				var recipientView = new RecipientView({
					model: model
				});

				return recipientView;
			},

			/*
   * Remove a single view...
   * @method remove
   * @param {MessageModel} the model that was removed
   */
			removeSubview: function removeSubview(model) {
				this.recipientViews = _.reject(this.recipientViews, function (view) {
					var toBeRemoved = view.model.id === model.id;

					if (toBeRemoved) {
						view.destroy();
						this.trigger('recipient:remove');
					}

					return toBeRemoved;
				}, this);
			},

			/*
   * Upon collection reset, calculate timestamps and render every message in collection
   *
   * @method render
   */
			render: function render() {
				var fragment,
				    vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				this.recipientViews = [];

				fragment = document.createDocumentFragment();

				this.model.each(function (recipient) {
					this.addSubview(this.createSubview(recipient), fragment);
				}, this);

				this.$el.html(fragment);
			},

			/*
   * Toggle display property based on having recipients or not
   *
   * @method handleVisibility
   */
			handleVisibility: function handleVisibility() {
				if (this.model.isEmpty()) {
					this.$el.addClass('display-none');
				} else {
					this.$el.removeClass('display-none');
				}
			},

			/**
   * Destroy all the kids
   *
   * @method destroySubviews
   */
			destroySubviews: function destroySubviews() {
				_.each(this.recipientViews, function (view) {
					this.stopListening(view);
					view.destroy();
				}, this);

				this.recipientViews = [];
			},

			/*
   * Unbind and destroy
   *
   * @method destroy
   */
			destroy: function destroy() {
				this.destroySubviews();
				this.remove();
			}

		});
	}
})();

;(function () {
	// global deps: Meetup.Copy
	define('app/messages/views/MessagingMemberPickerView',['jquery', 'backbone', 'underscore', 'handlebars', 'state', 'core/api', 'shared/MemberSearch/SearchMemberCollection', 'shared/MemberSearch/SearchMemberCollectionView', 'shared/MemberSearch/MemberPickerView', './RecipientCollectionView', 'core/constants'], MessagingMemberPickerView);

	function MessagingMemberPickerView($, Backbone, _, Handlebars, State, Api, SearchMemberCollection, SearchMemberCollectionView, MemberPickerView, RecipientCollectionView, Constants) {
		

		var Keyboard = Constants.Keyboard;

		/**
   * Renders the messaging-specific member picker widget, for autocomplete search and more! It's self contained ~WoWzEr~
   * Emits the following events: search.memberpicker, done.search.memberpicker, add.memberpicker
   *
   * If provided with a conversation object upon instantiation, then it will filter out existing members as well.
   *
   * Contains 2 direct child views: SearchMemberCollectionView and RecipientCollectionView
   *
   * @class MemberPickerView
   * @extends View
   */
		return MemberPickerView.extend({

			/**
   * @property template
   * @type {String}
   */
			template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.messagingMemberPick),

			/**
   * Class name of the search input
   *
   * @property searchElementClass
   * @type {String}
   */
			searchElementClass: 'recipient-input',

			/**
   * Keep track of previous search value
   *
   * @property searchVal
   * @type {String}
   */
			searchVal: '',

			/**
   * Inject child views, bind events.
   *
   * @method init
   */
			initialize: function initialize(options) {

				_.extend(this, options);

				this.render();

				// Create these but don't necessarily populate them, this will handle itself.
				this.memberCollection = new SearchMemberCollection();
				this.memberCollectionView = new SearchMemberCollectionView({ model: this.memberCollection });

				this.recipientCollection = new SearchMemberCollection();
				this.recipientCollectionView = new RecipientCollectionView({ model: this.recipientCollection, el: this.$el.find('#recipients') });

				// Bind Events
				this.listenTo(this.memberCollectionView, 'member:add', this.handleMemberAdd);

				this.listenTo(this.recipientCollectionView.model, 'remove', this.focusInput).listenTo(this.recipientCollectionView.model, 'remove add', this.handleRecipientChange);

				this.listenTo(this, 'memberpicker:search', _.debounce(this.lookAhead, 500));

				// Inject child views
				this.$el.find('.j-memberList-wrapper').append(this.memberCollectionView.$el);
			},

			render: function render() {
				var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				return this;
			},

			/**
   	* Searches for members by name using the messaging API's /find/members call
   	*
   	* @method lookAhead
   	* @param {String} val the value of the search input
   	*/
			lookAhead: function lookAhead(val) {
				var search,
				    filtered,
				    self = this;

				if (val.length >= 2 && !this.readOnly) {
					search = Api.PublicApi().messaging.memberSearch({ q: val, cache: false });

					search.done(function (members) {
						var currMemberIds = self.conversation ? _.pluck(self.conversation.get('members'), 'id') : [];

						filtered = _.reject(members, function (member) {
							return self.recipientCollection.get(member.id) || _.contains(currMemberIds, member.id) || member.id === State.Member.id;
						});

						// Create dummy member that tells you there's no results
						if (filtered.length === 0) {
							filtered.push({
								name: Meetup.Copy['messaging.noResults'],
								common_groups: [{
									name: Meetup.Copy['messaging.noResultsSubtext']
								}],
								empty: true
							});
						}

						self.memberCollection.reset(filtered, { parse: true });

						self.trigger('memberpicker:searchdone', members);
					});
				} else {
					self.memberCollection.reset();
				}
			},

			/*
   * Removes last recipient from the collection
   *
   * @method popRecipient
   * @returns if the collection isn't empty, return the last recipient in the collection. Otherwise, returns false.
   */
			popRecipient: function popRecipient() {
				if (this.recipientCollection.isEmpty()) {
					return false;
				}

				this.focusInput();
				return this.recipientCollection.pop();
			},

			/*
   * Handler to propogate change recipient event
   *
   * @method handleRecipientChange
   */
			handleRecipientChange: function handleRecipientChange() {
				this.trigger('recipient:change');
			},

			/*
   * Handler to add member to recipient collection
   *
   * @method handleMemberAdd
   * @param {SearchMemberModel} member the member model to add
   */
			handleMemberAdd: function handleMemberAdd(member) {
				this.$el.find('.' + this.searchElementClass).val('');

				this.recipientCollection.add(member);
				this.focusInput();
			},

			/*
   * Handler to handle a keydown event in the search input
   *
   * @method handleKeyDown
   * @param {Event} e the event
   */
			handleKeyDown: function handleKeyDown(e) {
				switch (e.which) {
					// Backspace deletion of "selected" members
					case Keyboard.BACKSPACE:
						if ($(e.target).val() === '' && !this.readOnly) this.popRecipient();
						break;
					// Escape to close
					case Keyboard.ESCAPE:
						this.trigger('memberpicker:close');
						break;
					// UP key triggers member collection nav
					case Keyboard.UP:
						e.preventDefault();
						this.memberCollectionView.trigger('memberpicker:move', -1);
						break;
					// down key triggers member collection nav
					case Keyboard.DOWN:
						e.preventDefault();
						this.memberCollectionView.trigger('memberpicker:move', 1);
						break;
					// Select the selected member, and reset
					case Keyboard.TAB:
						if (this.memberCollection.isEmpty()) {
							// Simply allow default tab action (next field)
							break;
						}
						// Otherwise allow it to fall through to the enter action
						e.preventDefault();
					/* falls through */
					case Keyboard.ENTER:
						if (!this.memberCollection.isEmpty() && !this.memberCollection.at(this.memberCollectionView.selectedIndex).get('empty') && !this.readOnly) {
							this.handleMemberAdd(this.memberCollection.at(this.memberCollectionView.selectedIndex));
							this.memberCollection.reset();
						}
						break;
				}
			},

			/**
   * Make this view readonly
   *
   * @method lock
   */
			setReadonly: function setReadonly(flag) {
				this.readOnly = flag;
				this.$el.find('.j-member-search').prop('disabled', flag);

				// Don't allow them to edit the recipient list if it's readonly
				if (flag) {
					this.$el.find('.j-remove').css('display', 'none');
				}
			},

			/*
   * Reset the memberpicker to an empty state
   *
   * @method reset
   */
			reset: function reset() {
				this.memberCollection.reset();
				this.recipientCollection.reset();
				this.setReadonly(false);
				this.$el.find('.' + this.searchElementClass).val('');
			},

			/*
   * Destroy, duh.
   *
   * @method destroy
   */
			destroy: function destroy() {
				this.memberCollectionView.destroy();
				this.recipientCollectionView.destroy();

				this.remove();
			}

		});
	}
})();

;(function () {
	define('app/messages/models/FlashMessageModel',['underscore', 'backbone'], FlashMessageModel);

	function FlashMessageModel(_, Backbone) {
		

		/**
  * Represents a flash message, expects attributes such as displayTime, message, controlClass, and messageType.
  *}
  * @class FlashMessageModel
  * @extends Model
  */
		return Backbone.Model.extend({
			/**
   * If a display time was set on this model, then start the countdown to self destruct
   *
   * @method init
   */
			initialize: function initialize() {
				// Trigger destroy event to remove self from collection
				if (this.get('displayTime')) setTimeout(_.bind(this.trigger, this, 'destroy', this), this.get('displayTime'));
			}
		});
	}
})();

;(function () {
	define('app/messages/models/FlashMessageCollection',['backbone', './FlashMessageModel'], FlashMessageCollection);

	function FlashMessageCollection(Backbone, FlashMessageModel) {
		

		/**
  * Holds flash message models.
  *
  * @class FlashMessagesCollection
  * @extends Collection
  */
		return Backbone.Collection.extend({
			model: FlashMessageModel
		});
	}
})();

//! moment.js
//! version : 2.6.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.6.0",
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        function printMsg() {
            if (moment.suppressDeprecationWarnings === false &&
                    typeof console !== 'undefined' && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        return extend(function () {
            if (firstTime) {
                printMsg();
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return parseTokenOrdinal;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(input, 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var intVal = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (intVal > 68 ? 1900 + intVal : 2000 + intVal) : intVal) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
            "moment construction falls back to js Date. This is " +
            "discouraged and will be removed in upcoming major " +
            "release. Please refer to " +
            "https://github.com/moment/moment/issues/1407 for more info.",
            function (config) {
        config._d = new Date(config._i);
    });

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        // keepTime = true means only change the timezone, without affecting
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
        // adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepTime) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    if (!keepTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this._lang._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.lang().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    "Accessing Moment through the global scope is " +
                    "deprecated, and will be removed in an upcoming " +
                    "release.",
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === "function" && define.amd) {
        define("moment", ['require','exports','module'],function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

;(function () {
	// Global deps: Meetup.Copy
	define('app/messages/models/ConversationModel',['jquery', 'backbone', 'state', 'core/utils', 'core/constants', 'moment'], ConversationModel);

	function ConversationModel($, Backbone, State, Utils, Constants, moment) {
		

		/**
  * Represents a conversation. Expects following data from BE:
  *
  *{
  * "id": 12345,
  * "id_str": "12345",
  * "status": "active",
  * "title": "hello",
  * "kind": "one_one", // one_one, group
  * "unread": 1,
  * "members": [
  * 	{
  * 	"id": 234,
  * 	"name": "bob",
  * 	"photo": {
  * 		"id": 12345,
  * 			"thumb_link": "http://...",
  * 			"photo_link": "http://...",
  * 			"highres_link": "http://...",
  * 		},
  * 	},
  * // ...
  * ],
  * "last_message": {
  * 		"id": 123,
  * 		"id_str": "123",
  * 		"conversation_id": 12345,
  * 		"conversation_id_str": "12345",
  * 		"member": {
  * 			"id": 234,
  * 			"name": "bob",
  * 			"photo": {
  * 				"id": 12345,
  * 				"thumb_link": "http://...",
  * 				"photo_link": "http://...",
  * 				"highres_link": "http://...",
  * 			},
  * 		},
  * 		"kind": "plain",
  * 		"text": "hello world",
  * 		"updated": 9345739847509,
  * },
  *}
  *
  *
  * @class ConversationModel
  * @extends Model
  */
		return Backbone.Model.extend({

			idAttribute: 'id_str',

			/**
   * Defaults is a function to avoid sharing obj references
   *
   * @method defaults
   */
			defaults: function defaults() {
				return {
					blocker_member_ids: []
				};
			},

			/**
   * This is a meety (ha) parse function, because there's a lot of data that needs to be
   * massaged into particular formats. Particularly tricky is the title, because it's often given as an empty string
   * and needs to be coerced into a generic set of names.
   *
   * @method parse
   * @param {Object} attrs the set of attributes to parse
   * @return {Object} the modified attributes to be set on the model
   */
			parse: function parse(attrs) {
				// So as to not trample our original data
				var attrsCopy = $.extend(true, {}, attrs);

				// Conversations are used as the underlying model for more than one view.
				// These attributes are useful for TitleControls
				if (attrsCopy.kind === 'group') {
					attrsCopy.isGroup = true;
				} else if (attrsCopy.kind === 'one_one') {
					// Mark the other member
					attrsCopy.otherMember = _.find(attrsCopy.members, function (member) {
						return member.id !== State.Member.id;
					});

					// check if the other member is former member, mask name if so
					if (attrsCopy.otherMember.id === 0) {
						attrsCopy.title = Meetup.Copy['messaging.formerMember'];
					}
				}

				// Calculate and set our dynamic fields
				attrsCopy.isTitleUnmodified = !attrsCopy.title && !this.attributes.title;

				// Woah what's this? Why an undefined check!? Well because parse can be called multiple times throughout the lifecycle of a
				// conversation model, and it may not include a title key. Unfortunately, we can't just ignore falsey title keys because
				// the backend will be handing us empty strings which need to be turned into a default title.
				if (!_.isUndefined(attrsCopy.title)) {
					// We must re-render when the title is set, but we need to take into account an update vs updating but setting the same title
					attrsCopy.titleUpdateTime = new Date().valueOf();
					attrsCopy.title = attrsCopy.title || this.calculateTitle(attrsCopy.members || this.attributes.members);
				}

				// Get the photos of all the members, except you!
				if (attrsCopy.members) attrsCopy.photos = this.calculatePhotos(attrsCopy.members || this.attributes.members, attrsCopy.isGroup || this.attributes.isGroup);

				// If we were given a last message, update the timestamp of that too, and make sure text is escaped
				if (attrsCopy.last_message) {
					if (attrsCopy.last_message.member.id === 0) {
						// member is gone
						attrsCopy.last_message.isNullMember = true;
						attrsCopy.last_message.escapedText = attrsCopy.last_message.text = Meetup.Copy['messaging.messageRemoved'];
					}
					attrsCopy.timestamp = this.calcTimestamp(attrsCopy.last_message.updated);
					attrsCopy.last_message.escapedText = attrsCopy.last_message.escapedText || Utils.escapeHTML(attrsCopy.last_message.text);
					// Geo messages get "shared location" preview text
					if (attrsCopy.last_message.kind === 'geo') {
						attrsCopy.last_message.text = Meetup.Copy['messaging.sharedLocation'];
					}
				}

				return attrsCopy;
			},

			/**
   * Calculate a 'default' title from a list of members. Takes into account who you are so you're name doesn't appear.
   *
   * @method calculateTitle
   * @param {Array} an array of raw member objects
   * @return {String} your custom tailored title
   */
			calculateTitle: function calculateTitle(members) {
				var title, memberNames;

				memberNames = _.chain(members).reject(function (member) {
					return member.id === State.Member.id;
				}).pluck('name').value();

				switch (memberNames.length) {
					// Case 0 only happens when a group conversation has been abandoned by all but one.
					case 0:
						title = Meetup.Copy['messaging.defaultTitle'];
						break;
					case 1:
						title = memberNames.join('');
						break;
					case 2:
						title = memberNames.join(' & ');
						break;
					case 3:
						title = memberNames.slice(0, 2).join(', ') + ' & ' + memberNames.slice(2, 3);
						break;
					default:
						title = memberNames.slice(0, 2).join(', ') + ' & ' + (memberNames.length - 2) + ' others';
				}

				return title;
			},

			/**
   * Calculate the photo links to be displayed. Ignores the current user. If a group conversation, then returns
   * an array of size 4, regardless of group size. If the group has less than 5 members, then placeholder objects will be
   * inserted until the proper size is reached. For 1-1 convos, just an array of size 1 will be returned.
   *
   * @method calculatePhotos
   * @param {Array} an array of raw member objects
   * @return {Array} your custom tailored array of photo objects
   */
			calculatePhotos: function calculatePhotos(members, isGroup) {
				var photos;

				photos = _.chain(members).reject(function (member) {
					return member.id === State.Member.id;
				}).map(function (member) {
					var photo = member.photo ? member.photo.thumb_link : Constants.NO_PHOTO;
					return { photo: photo };
				}).value().slice(0, 4);

				while (isGroup && photos.length < 4) {
					photos.push({ placeholder: true });
				}

				return photos;
			},

			/**
   * Update the timestamp for this conversation based on the last message
   *
   * @method updateTimestamp
   */
			updateTimestamp: function updateTimestamp() {
				this.set('timestamp', this.calcTimestamp(this.get('last_message').updated));
			},

			/**
   * Calculate a timestamp based on the difference between now and the last message
   *
   * @method calcTimestamp
   * @param {Number} a unix timestamp
   * @param {String} a formatted timestamp string representing the time elapsed between now and the last message
   */
			calcTimestamp: function calcTimestamp(updated) {
				var last_moment = moment(updated),
				    timestamp;

				if (moment().diff(last_moment, 'minutes') < 1) {
					timestamp = moment().diff(last_moment, 'seconds') + 's';
				} else if (moment().diff(last_moment, 'minutes') < 60) {
					timestamp = moment().diff(last_moment, 'minutes') + 'm';
				} else if (moment().diff(last_moment, 'hours') < 24) {
					timestamp = moment().diff(last_moment, 'hours') + 'h';
				} else {
					timestamp = moment().diff(last_moment, 'days') + 'd';
				}
				return timestamp;
			},

			/**
   * Compare to method used for sorting. Sorts with latest message first. Returns based on these rules:
   * if conversation1's last message is before conversation2's last message, then return 1
   * if conversation1's last message is after conversation2's last message, then return -1
   * if equal, return 0
   * THESE ARE REVERSED BECAUSE BACKBONE COLLECTIONS SORT DONT SUPPORT REVERSE SORTING
   *
   * @method compareTo
   * @param {ConversationModel} a conversation to compare
   * @param {ConversationModel} a conversation to compare
   */
			compareTo: function compareTo(conversation1, conversation2) {
				var moment1 = moment(conversation1.get('last_message').updated),
				    moment2 = moment(conversation2.get('last_message').updated);

				if (moment1.isBefore(moment2)) {
					return 1;
				}

				if (moment1.isAfter(moment2)) {
					return -1;
				}

				return 0;
			}
		});
	}
})();

;(function () {
	// Global deps: Meetup.MustacheTemplates.messaging.flashMessage
	define('app/messages/views/FlashMessageView',['jquery', 'backbone', 'underscore', 'handlebars'], FlashMessageView);

	function FlashMessageView($, Backbone, _, Handlebars) {
		

		/**
  * Displays a flash message
  *
  * @class FlashMessagesView
  * @extends View
  */
		return Backbone.View.extend({

			/**
   * @property template
   * @type {String}
   */
			template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.flashMessage),

			initialize: function initialize() {
				this.render();
			},

			render: function render() {
				var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
				    $old = this.$el,
				    $newEl = $($.trim(this.template(vars, this.partials || {})));

				this.setElement($newEl);
				$old.replaceWith(this.$el);

				return this;
			},

			events: {
				'click .j-flashMessageClose': 'handleClose'
			},

			/**
   * stop event propogation and signal close by "destroying" the model, which will trigger collection removal and fadeouts
   *
   * @method handleClose
   */
			handleClose: function handleClose(e) {
				this.model.trigger('destroy', this.model);
				return false;
			},

			/**
   * Fadeout the message
   *
   * @method fadeOut
   */
			fadeOut: function fadeOut() {
				this.$el.css('opacity', 0);
				this.fadeOutTimeout = setTimeout(_.bind(function () {
					this.model.trigger('flashmessage:faded', this.el.getAttribute('data-cid'));
					this.destroy();
				}, this), 600);
			},

			/*
   * unbind and demolish
   *
   * @method destroy
   */
			destroy: function destroy() {
				this.remove();
			}
		});
	}
})();

;(function () {
	define('app/messages/views/FlashMessageCollectionView',['jquery', 'backbone', 'underscore', './FlashMessageView'], FlashMessageCollectionView);

	function FlashMessageCollectionView($, Backbone, _, FlashMessageView) {
		

		/**
  * In charge of displaying the collection of conversations contained in it's collection model.
  * Has child views: FlashMessageView
  *
  * @class FlashMessagesCollectionView
  * @extends View
  */
		return Backbone.View.extend({

			tagName: 'div',

			className: 'flashMessages',

			/**
   * bind events and initialize array of subviews
   *
   * @method init
   */
			initialize: function initialize() {
				this.listenTo(this.model, 'remove', this.removeSubview).listenTo(this.model, 'add', this.addSubview);

				this.flashMessageViews = [];
			},

			/*
   * Render and append a single flash message view to the element or document fragment
   *
   * @method add
   * @param {ConversationModel} the model to be used in the child view
   * @param {DocumentFragment} fragment if provided, this method will append to this fragment instead of the view's element
   */
			addSubview: function addSubview(model) {
				var flashMessageView = new FlashMessageView({
					model: model
				});

				this.flashMessageViews.push(flashMessageView);

				this.$el.prepend(flashMessageView.$el);
			},

			/*
   * Remove a single flash message view...
   * @method remove
   * @param {Event} e the event (if used as a callback)
   * @param {ConversationModel} the model that was removed
   */
			removeSubview: function removeSubview(model) {
				this.conversationViews = _.reject(this.flashMessageViews, function (view) {
					var toBeRemoved = view.model.id === model.id;

					if (toBeRemoved) {
						view.fadeOut();
					}

					return toBeRemoved;
				}, this);
			},

			/**
   * unbind and burn to the ground
   *
   * @method destroy
   */
			destroy: function destroy() {
				_.invoke(this.flashMessageViews, 'destroy');
				this.flashMessageViews = [];

				this.remove();
			}
		});
	}
})();

;(function () {
	// Global deps: Meetup.Copy, History

	define('app/messages/views/NewConversationView',['jquery', 'backbone', 'underscore', 'core/api', 'state', './ComposeBoxView', './MessagingMemberPickerView', '../models/FlashMessageCollection', '../models/ConversationModel', './FlashMessageCollectionView'], NewConversationView);

	function NewConversationView($, Backbone, _, Api, State, ComposeBoxView, MessagingMemberPickerView, FlashMessageCollection, ConversationModel, FlashMessageCollectionView) {
		

		var sendLock = false;

		/**
  * In charge of the new conversation flow. Has child view: MemberPickerView
  *
  * @class NewConversationView
  * @extends View
  */
		return Backbone.View.extend({

			el: document.getElementById('convoNew-view'), // loaded on render

			defaults: {
				isMobile: false,
				beforeMessageText: ''
			},

			/*
   * Initialize memberpicker and custom events
   *
   * @param init
   */
			initialize: function initialize(options) {

				_.extend(this, this.defaults, options);

				this.render();

				var composeConfig = _.defaults(this.composeConfig || {}, {
					composeBoxId: 'messaging-new-convo',
					composeBoxSendId: 'messaging-new-send',
					composeOnly: this.isMobile,
					helpText: !this.isMobile
				}),
				    $innerWrapper = this.$el.find('.messagesInnerWrapper'),
				    $flashMessageInsertion;

				// text input
				this.composeBoxView = new ComposeBoxView({
					templateVars: _.extend({}, ComposeBoxView.prototype.templateVars, composeConfig),
					isMobile: this.isMobile
				});

				// To manage current recipients
				var PickerView = MessagingMemberPickerView.extend({
					templateVars: {
						prompt: Meetup.Copy['common.to'],
						title: 'Search for Members'
					}
				});
				this.memberPickerView = new PickerView();

				// manage error messages
				this.flashMessageCollection = new FlashMessageCollection();
				this.flashMessageCollectionView = new FlashMessageCollectionView({
					model: this.flashMessageCollection
				});

				// Bind events
				this.memberPickerView.on('memberpicker:close', this.handleClose, this).on('recipient:change', this.handleSendState, this);

				var listenToComposeBox = _.bind(this.listenTo, this, this.composeBoxView);
				listenToComposeBox('composebox:send', this.createConversation);
				listenToComposeBox('composebox:lengthlimit', this.displayMessageLengthError);
				listenToComposeBox('compsoebox:underlimit', this.removeMessageLengthError);
				listenToComposeBox('composebox:keyup', this.handleSendState);

				if (this.isMobile) {
					// composeBox Send is in navbar, so set handler separately
					$(document).on('click', '#' + composeConfig.composeBoxSendId, _.bind(this.composeBoxView.triggerSend, this.composeBoxView));
				}

				// Handle send button
				this.handleSendState();

				// Inject member picker
				this.$el.find('#j-memberPickerContainer').append(this.memberPickerView.$el);

				// Depending on where this is used, different insertion points exist
				$flashMessageInsertion = $innerWrapper.length ? $innerWrapper : this.$el.find('.recipientTokenizer');
				$flashMessageInsertion.append(this.flashMessageCollectionView.$el);

				this.$el.find('#newConversation-overlay').addClass('active');

				$(document).on('click', '.j-messageSend', _.bind(this.createConversation, this)); // send button in navbar - need document handler

				// inject compose box
				this.$el.find('#convoNewContainer').append(this.composeBoxView.$el);

				// Focus input once UI ready
				_.defer(_.bind(this.handleSendState, this));
			},

			/**
   * Bind all ui events. DO NOT BIND MODEL EVENTS HERE EVER.
   *
   * @method delegateEvents
   */
			events: {
				'click .j-close, #newConversation-overlay': 'handleClose',
				'click .j-messageFailFlash': 'handleResend'
			},

			handleResend: function handleResend() {
				this.composeBoxView.triggerSend();
			},

			/*
   * Pass recipients and message up to root controller to make new conversation.
   *
   * @method createConversation
   * @returns {Array} an array of member model
   */
			createConversation: function createConversation(message) {
				if (this.$el.find('#messaging-new-send').prop('disabled') || !message) {
					return false;
				}

				sendLock = true;
				this.handleSendState();

				var recipients = this.memberPickerView.recipientCollection,
				    conversationKind = this.conversationKind || (recipients.length > 1 ? 'group' : 'one_one'),
				    request,
				    self = this,
				    title = '',
				    options,
				    recipientIds;

				// Ids for API param
				recipientIds = recipients.pluck('id').join(',');

				// Set contact symbol based on if suggestion or org contact
				if (this.isSuggest) {
					title = '✩ ';
				} else if (this.isOrg) {
					title = '✎ ';
				}

				// finishing touch for predefined titles
				if (title) {
					title = title + State.Member.unescapedName + ' (' + (this.groupName || State.Chapter.name) + ')';
				}

				options = {
					title: title,
					text: this.beforeMessageText + message
				};

				if (this.messageOrigin) {
					options.origin = this.messageOrigin;
				}

				// Make da request
				if (this.isOrg) {
					request = Api.PublicApi().messaging.contactOrgs(_.extend(options, {
						groupUrl: this.groupUrl || State.Chapter.urlname
					}));
				} else {
					request = Api.PublicApi().messaging.newConvo(_.extend(options, {
						member: recipientIds,
						conversation_kind: conversationKind
					}));
				}

				request.done(function (data) {
					var conversation = new ConversationModel(data, { parse: true });
					self.trigger('conversation:new', conversation);
					self.reset();
				}).fail(function (xhr) {
					var error;

					try {
						error = JSON.parse(xhr.responseText).errors[0];
					} catch (e) {
						// If no parseable response text, assign empty obj
						error = {};
					}

					self.displayError(error, xhr.status);
				}).always(function () {
					self.resetLock();
				});

				return false;
			},

			/*
   * Handle close click (just go back!)
   *
   * @method handleClose
   */
			handleClose: function handleClose(e) {
				if (e) e.preventDefault();
				this.reset();
				History.back();
			},

			populateIds: function populateIds(id, name) {
				if (id) {
					this.memberPickerView.recipientCollection.add({
						id: id,
						name: name
					});
				}
			},

			/**
   * Provides external views to reset the lock
   * TODO: just fucking move the new convo xhr to here i mean comon
   * @method resetLock
   */
			resetLock: function resetLock() {
				sendLock = false;
				this.handleSendState();
			},

			displayMessageLengthError: function displayMessageLengthError() {
				this.flashMessageCollection.add({
					id: 'message-failure-length',
					content: Meetup.Copy['messaging.longTextError'],
					icon: 'error',
					alertType: 'failure'
				});
			},

			removeMessageLengthError: function removeMessageLengthError() {
				this.flashMessageCollection.remove({ id: 'message-failure-length' });
			},

			setReadonly: function setReadonly(flag) {
				this.memberPickerView.setReadonly(flag);
			},

			/**
   * Generic error display, string from BE
   *
   * @method displayError
   */
			displayError: function displayError(error, status) {
				var flashOpts = {
					id: error.code,
					closeButton: true,
					content: error.message,
					alertType: 'failure',
					icon: 'error'
				};

				// If we don't know the error (not a 4XX), allow click to retry.
				if (!status || status < 400 && status >= 500) {
					_.extend(flashOpts, {
						controlClass: 'j-messageFailFlash',
						content: Meetup.Copy['messaging.sendFailure'],
						id: 'unknown_error'
					});
				}

				this.flashMessageCollection.add(flashOpts);
			},

			/*
   * Handle state of send button. If there are no recipients, disable it. If there's a sending lock (xhr in progress), disable it.
   *
   * Can't cache $("#messaging-new-send") because it is created and destroyed
   * willy-nilly on mobile
   *
   * @method handleSendState
   */
			handleSendState: function handleSendState() {
				var isDisabled = this.memberPickerView.recipientCollection.isEmpty() || sendLock || !this.composeBoxView.getText();
				$('#messaging-new-send').prop('disabled', isDisabled).toggleClass('disabled', isDisabled);

				return this;
			},

			/**
   * Resets all components of this view
   *
   * @method reset
   */
			reset: function reset() {
				this.composeBoxView.reset();
				this.memberPickerView.reset();
			},

			/*
   * Unbind, destroy children NOTE: don't call this in messaging
   *
   * @method destroy
   */
			destroy: function destroy() {

				$(document).off('click', '.j-messageSend'); // send button in navbar - need document handler

				this.composeBoxView.destroy();

				this.memberPickerView.destroy();

				this.remove();
			}

		});
	}
})();

;(function () {

	define('app/messages/controllers/NewConversationStandaloneController',['jquery', 'backbone', 'underscore', 'handlebars', 'state', 'core/utils', '../views/NewConversationView', '../models/FlashMessageCollection', '../views/FlashMessageCollectionView'], NewConversationStandaloneController);

	function NewConversationStandaloneController($, Backbone, _, Handlebars, State, Utils, NewConversationView, FlashMessageCollection, FlashMessageCollectionView) {
		

		var newConvoController = function newConvoController(bindTo) {
			this.bindTo = bindTo;
		};

		NewConversationView.prototype.render = function () {
			var vars = _.extend({ 'id': this.id }, this.model ? this.model.attributes : {}, this.templateVars),
			    $old = this.$el,
			    partials = this.partials ? { partials: this.partials } : {};

			$newEl = $($.trim(this.template(vars, partials)));

			this.setElement($newEl);
			$old.replaceWith(this.$el);

			return this;
		};

		_.extend(newConvoController.prototype, {

			init: function init() {
				var newConvoConfig = {
					template: Handlebars['default'].compile(Meetup.MustacheTemplates.messaging.newConversationPartial),
					partials: {
						viewHeader: Meetup.MustacheTemplates.messaging.viewHeader,
						viewFooter: Meetup.MustacheTemplates.messaging.viewFooter
					},
					templateVars: {
						viewConfig: {
							viewId: 'convoNew-view'
						},
						navbar: {
							titleBlock: {
								title: Meetup.Copy['messaging.sendAMessageTo']
							}
						}
					}
				};

				// If in chapter context, add messaging origin.
				if (State.Chapter.id) {
					newConvoConfig.messageOrigin = 'group:' + State.Chapter.id;
					newConvoConfig.templateVars.originText = Meetup.Copy['messaging.sendFromOrigin'];
				}

				this.newConversationView = new NewConversationView(newConvoConfig);

				this.newConversationView.$el.dialog({
					autoOpen: false,
					dialogClass: 'messaging active',
					zindex: 500,
					open: this.openOverlay,
					close: _.bind(this.closeOverlay, this)
				});

				this.newConversationView.on('conversation:new', this.handleNewConversation, this);

				this.delegateEvents();
			},
			delegateEvents: function delegateEvents() {
				this.bindTo.on('click', _.bind(this.displayOverlay, this));
			},

			openOverlay: function openOverlay(e) {
				$('.muOverlay').addClass('messaging');
				_.defer(function () {
					$('.muOverlay').addClass('active');
					$('#messaging-new-convo').focus();
				});
			},

			closeOverlay: function closeOverlay(e) {
				this.newConversationView.reset();
				$('.muOverlay').removeClass('active').removeClass('messaging');
			},

			displayOverlay: function displayOverlay(e) {
				var ids,
				    names,
				    i,
				    memberObjs,
				    $currentTarget = $(e.currentTarget);

				e.preventDefault();

				// Extract all recipients and names (in order) *dont use .data to avoid coerce!*
				ids = $currentTarget.attr('data-id') ? _.map($currentTarget.attr('data-id').split(','), Number) : [];
				names = $currentTarget.attr('data-name') ? $currentTarget.attr('data-name').split(',') : [];
				names = _.map(names, Utils.unescapeHTML);

				// Extra data for isOrg
				this.newConversationView.isOrg = $currentTarget.data('org');

				// Extra data for suggestions
				this.newConversationView.isSuggest = $currentTarget.data('suggest');

				// Modify ids and names to just be the dummy "contact orgs" user,
				// lock down the new conversation view recipients view
				if (this.newConversationView.isOrg) {
					this.newConversationView.groupName = State.Chapter.name;
					this.newConversationView.groupUrl = State.Chapter.urlname;
					ids = [-1];
					names = [Utils.unescapeHTML(Meetup.Copy['messaging.organizersOf'])]; // Chapter name is by default escaped, so we must unescape to prevent double escape
				}

				memberObjs = _.chain(_.zip(ids, names)).reject(function (pair) {
					return pair[0] === State.Member.id;
				}).reduce(function (memo, pair) {
					memo.push({ id: pair[0], name: pair[1] });
					return memo;
				}, []).value();

				// Populate with members
				this.newConversationView.memberPickerView.recipientCollection.add(memberObjs);

				if (this.newConversationView.isOrg) {
					this.newConversationView.setReadonly(true);
				}

				this.newConversationView.$el.dialog('open');
			},

			/**
   * Handle creation of new conversation
   *
   * @method handleNewConversation
   * @param {ConversationModel} the created conversation
   */
			handleNewConversation: function handleNewConversation(conversation) {
				this.newConversationView.$el.trigger('close');
				window.location.assign('/messages/?convo_id=' + conversation.id);
			}
		});

		return newConvoController;
	}
})();

;(function () {
	require(['app/messages/controllers/NewConversationStandaloneController'], function (NewConversationStandaloneController) {
		var newConvoController = new NewConversationStandaloneController($('.j-composeNewMessage'));
		newConvoController.init();

		// Set the proper max height
		$('#messaging-new-convo').css('max-height', 0.4 * $(this).height()).trigger('autosize.resizeIncludeStyle');

		$(window).on('resize', function () {
			$('#messaging-new-convo').css('max-height', 0.4 * $(this).height()).trigger('autosize.resizeIncludeStyle');
		});
	});
})();

define("site/messages/standalone", function(){});