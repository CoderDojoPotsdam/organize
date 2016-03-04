/**
 * angular-alert-banner - Angular module for display alert as banner
 * @version v1.0.0
 * @link https://github.com/samouss/angular-alert-banner
 * @license MIT
 */
(function(module) {
try {
  module = angular.module('alert-banner/alert-banner.template.html');
} catch (e) {
  module = angular.module('alert-banner/alert-banner.template.html', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('alert-banner.template.html',
    '<div\n' +
    '  class="{{ ::className }} {{ alert.type }}"\n' +
    '>\n' +
    '  <div class="container">\n' +
    '    <div class="row">\n' +
    '      <p ng-bind-html="alert.message"></p>\n' +
    '      <a\n' +
    '        href=""\n' +
    '        ng-click="close()"\n' +
    '      >X</a>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);
})();

/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */
'use strict';

var _bind = Function.prototype.bind;
function register(appName) {

    var app = angular.module(appName);

    return {
        directive: directive,
        controller: controller,
        service: service,
        provider: provider,
        factory: factory
    };

    function directive(name, constructorFn) {

        constructorFn = _normalizeConstructor(constructorFn);

        if (!constructorFn.prototype.compile) {
            // create an empty compile function if none was defined.
            constructorFn.prototype.compile = function () {};
        }

        var originalCompileFn = _cloneFunction(constructorFn.prototype.compile);

        // Decorate the compile method to automatically return the link method (if it exists)
        // and bind it to the context of the constructor (so `this` works correctly).
        // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
        // returns `this.link` from within the compile function.
        _override(constructorFn.prototype, 'compile', function () {
            return function () {
                originalCompileFn.apply(this, arguments);

                if (constructorFn.prototype.link) {
                    return constructorFn.prototype.link.bind(this);
                }
            };
        });

        var factoryArray = _createFactoryArray(constructorFn);

        app.directive(name, factoryArray);
        return this;
    }

    function controller(name, contructorFn) {
        app.controller(name, contructorFn);
        return this;
    }

    function service(name, contructorFn) {
        app.service(name, contructorFn);
        return this;
    }

    function provider(name, constructorFn) {
        app.provider(name, constructorFn);
        return this;
    }

    function factory(name, constructorFn) {
        constructorFn = _normalizeConstructor(constructorFn);
        var factoryArray = _createFactoryArray(constructorFn);
        app.factory(name, factoryArray);
        return this;
    }

    /**
     * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
     * we need to pull out the array of dependencies and add it as an $inject property of the
     * actual constructor function.
     * @param input
     * @returns {*}
     * @private
     */
    function _normalizeConstructor(input) {
        var constructorFn;

        if (input.constructor === Array) {
            //
            var injected = input.slice(0, input.length - 1);
            constructorFn = input[input.length - 1];
            constructorFn.$inject = injected;
        } else {
            constructorFn = input;
        }

        return constructorFn;
    }

    /**
     * Convert a constructor function into a factory function which returns a new instance of that
     * constructor, with the correct dependencies automatically injected as arguments.
     *
     * In order to inject the dependencies, they must be attached to the constructor function with the
     * `$inject` property annotation.
     *
     * @param constructorFn
     * @returns {Array.<T>}
     * @private
     */
    function _createFactoryArray(constructorFn) {
        // get the array of dependencies that are needed by this component (as contained in the `$inject` array)
        var args = constructorFn.$inject || [];
        var factoryArray = args.slice(); // create a copy of the array
        // The factoryArray uses Angular's array notation whereby each element of the array is the name of a
        // dependency, and the final item is the factory function itself.
        factoryArray.push(function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            //return new constructorFn(...args);
            var instance = new (_bind.apply(constructorFn, [null].concat(args)))();
            for (var key in instance) {
                instance[key] = instance[key];
            }
            return instance;
        });

        return factoryArray;
    }

    /**
     * Clone a function
     * @param original
     * @returns {Function}
     */
    function _cloneFunction(original) {
        return function () {
            return original.apply(this, arguments);
        };
    }

    /**
     * Override an object's method with a new one specified by `callback`.
     * @param object
     * @param methodName
     * @param callback
     */
    function _override(object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    }
}
'use strict';

(function () {

  'use strict';

  /**
  * Angular alert banner
  */
  angular.module('angular-alert-banner', ['alert-banner/alert-banner.template.html']);
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

  'use strict';

  /**
   * @name   AlertBannerAttrDirective
   * @desc   <any alert-banner> directive
   * @param  {AlertBanner} AlertBanner
   * @ngInject
   */

  var AlertBannerAttrDirective = (function () {
    function AlertBannerAttrDirective(AlertBanner) {
      _classCallCheck(this, AlertBannerAttrDirective);

      this.restrict = 'A';
      this.scope = {
        type: '@',
        message: '@',
        autoClose: '@?',
        timeCollapse: '@?',
        onOpen: '&?',
        onClose: '&?'
      };

      this._AlertBanner = AlertBanner;

      this._options = this._AlertBanner.getDefaultOptions();
      this.queue = [];
    }
    AlertBannerAttrDirective.$inject = ["AlertBanner"];

    _createClass(AlertBannerAttrDirective, [{
      key: 'onClick',

      /**
       * @name   onClick
       */
      value: function onClick() {
        var _this = this;

        var options = {};

        options.type = this._scope.type;
        options.message = this._scope.message;

        if (typeof this._scope.autoClose !== 'undefined') {
          options.autoClose = this._scope.autoClose;
        }

        if (typeof this._scope.timeCollapse !== 'undefined') {
          options.timeCollapse = this._scope.timeCollapse;
        }

        if (typeof this._scope.onOpen !== 'undefined') {
          options.onOpen = this._scope.onOpen;
        }

        if (typeof this._scope.onClose !== 'undefined') {
          options.onClose = this._scope.onClose;
        }

        this._scope.$apply(function () {
          _this._AlertBanner.publish(options);
        });
      }
    }, {
      key: 'link',

      /**
       * @name   link
       * @desc   link function for alert banner attr directive
       * @param  {$scope}   $scope
       * @param  {$element} $el
       */
      value: function link($scope, $el) {
        var _this2 = this;

        this._scope = $scope;

        $el[0].addEventListener('click', function () {
          _this2.onClick();
        });
      }
    }]);

    return AlertBannerAttrDirective;
  })();

  register('angular-alert-banner').directive('alertBannerAttr', AlertBannerAttrDirective);
})();
'use strict';

(function () {

  angular.module('angular-alert-banner').constant('ALERT_BANNER', {
    EVENTS: {
      PREFIX: 'alert:',
      TYPES: {
        PUBLISH: 'publish'
      }
    },
    TYPES: {
      SUCCESS: 'success',
      INFO: 'info',
      ERROR: 'error'
    }
  });
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

  'use strict';

  /**
   * @name   AlertBanner
   * @desc   <alert-banner> directive
   * @param  {constant}    ALERT_BANNER
   * @param  {$timeout}    $timeout
   * @param  {$rootScope}  $rootScope
   * @param  {AlertBanner} AlertBanner
   * @ngInject
   */

  var AlertBannerDirective = (function () {
    function AlertBannerDirective(ALERT_BANNER, $timeout, $rootScope, AlertBanner) {
      _classCallCheck(this, AlertBannerDirective);

      this.restrict = 'E';
      this.templateUrl = 'alert-banner.template.html';

      this._ALERT_BANNER = ALERT_BANNER;
      this._timeout = $timeout;
      this._rootScope = $rootScope;
      this._AlertBanner = AlertBanner;

      this._options = this._AlertBanner.getDefaultOptions();
      this.queue = [];
    }
    AlertBannerDirective.$inject = ["ALERT_BANNER", "$timeout", "$rootScope", "AlertBanner"];

    _createClass(AlertBannerDirective, [{
      key: 'onMessage',

      /**
       * Callback for event alert:publish
       * @param  {event}  event
       * @param  {object} data
       * @return {void}
       */
      value: function onMessage(event, data) {
        var _this = this;

        this.clearQueue();

        angular.copy(this._options, this._$scope.alert);
        angular.extend(this._$scope.alert, data);

        this._el.querySelector('.' + this._AlertBanner.getClassName()).classList.add('active');

        this.queue.push(this._timeout(function () {
          _this._$scope.alert.onOpen();
        }, this._AlertBanner.getAnimationDuration()));

        if (this._$scope.alert.autoClose) {
          this.queue.push(this._timeout(function () {
            _this.close();
          }, this._$scope.alert.timeCollapse));
        }
      }
    }, {
      key: 'close',

      /**
       * Close alert message
       * @return {void}
       */
      value: function close() {
        var _this2 = this;

        if (this._el.querySelector('.' + this._AlertBanner.getClassName()).classList.contains('active')) {
          this.clearQueue();
          this._el.querySelector('.' + this._AlertBanner.getClassName()).classList.remove('active');
          this.queue.push(this._timeout(function () {
            _this2._$scope.alert.onClose();
            angular.copy(_this2._options, _this2._$scope.alert);
          }, this._AlertBanner.getAnimationDuration()));
        }
      }
    }, {
      key: 'clearQueue',

      /**
       * Clear queue for alert timer
       * @return {void}
       */
      value: function clearQueue() {
        var _this3 = this;

        this.queue.forEach(function (promise) {
          _this3._timeout.cancel(promise);
        });
        this.queue = [];
      }
    }, {
      key: 'link',

      /**
       * @name   link
       * @desc   link function for alert banner directive
       * @param  {$scope}   $scope
       * @param  {$element} $el
       */
      value: function link($scope, $el) {
        var _this4 = this;

        this._$scope = $scope;
        this._el = $el[0];

        $scope.alert = {};
        $scope.className = this._AlertBanner.getClassName();

        $scope.close = function () {
          _this4.close();
        };

        $scope.$on(this._ALERT_BANNER.EVENTS.PREFIX + this._ALERT_BANNER.EVENTS.TYPES.PUBLISH, function (event, data) {
          _this4.onMessage(event, data);
        });
      }
    }]);

    return AlertBannerDirective;
  })();

  register('angular-alert-banner').directive('alertBanner', AlertBannerDirective);
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

  'use strict';

  /**
  * @name AlertBannerProvider
  * @desc Provider for alert banner
  */

  var AlertBannerProvider = (function () {
    function AlertBannerProvider() {
      _classCallCheck(this, AlertBannerProvider);

      this.className = 'alert-message';
      this.animationDuration = 250;

      this.timeCollapse = 5000;
      this.autoClose = true;

      this.onOpen = function () {};
      this.onClose = function () {};
    }

    _createClass(AlertBannerProvider, [{
      key: 'setClassName',

      /**
       * [setClassName]
       * @param {string} value
       * return AlertBannerProvider
       */
      value: function setClassName(value) {
        if (typeof value !== 'string') {
          throw new Error('String value is provide for parameter className');
        }

        this.className = value;

        return this;
      }
    }, {
      key: 'setTimeCollapse',

      /**
       * [setTimeCollapse]
       * @param {integer} value
       * return AlertBannerProvider
       */
      value: function setTimeCollapse(value) {
        if (typeof value !== 'number') {
          throw new Error('Number value is provide for parameter timeCollapse');
        }

        this.timeCollapse = value;

        return this;
      }
    }, {
      key: 'setAnimationDuration',

      /**
       * [setAnimationDuration]
       * @param {integer} value
       * return AlertBannerProvider
       */
      value: function setAnimationDuration(value) {
        if (typeof value !== 'number') {
          throw new Error('Number value is provide for parameter animationDuration');
        }

        this.animationDuration = value;

        return this;
      }
    }, {
      key: 'setAutoClose',

      /**
       * [setAutoClose description]
       * @param {boolean} value
       */
      value: function setAutoClose(value) {
        if (typeof value !== 'boolean') {
          throw new Error('Boolean value is provide for parameter autoClose');
        }

        this.autoClose = value;

        return this;
      }
    }, {
      key: '$get',

      /**
       * @name   $get
       * @desc   AlertBanner factory for dispatch events alert
       * @param  {constant}   ALERT_BANNER
       * @param  {$rootScope} $rootScope
       * @ngInject
       */
      value: ["ALERT_BANNER", "$rootScope", function $get(ALERT_BANNER, $rootScope) {
        var _this = this;

        return {
          TYPES: ALERT_BANNER.TYPES,

          /**
           * @name   publish
           * @desc   Publish    dispatch event to handle directive
           * @param  {object}   params
           * @param  {string}   params.type
           * @param  {string}   params.message
           * @param  {integer}  params.timeCollapse
           * @param  {boolean}  params.autoClose
           * @param  {function} params.onOpen
           * @param  {function} params.onClose
           */
          publish: function publish(params) {
            $rootScope.$broadcast(ALERT_BANNER.EVENTS.PREFIX + ALERT_BANNER.EVENTS.TYPES.PUBLISH, params);
          },

          /**
           * @name   getClassName
           * @return {string}
           */
          getClassName: function getClassName() {
            return _this.className;
          },

          /**
           * @name   getAnimationDuration
           * @return {string}
           */
          getAnimationDuration: function getAnimationDuration() {
            return _this.animationDuration;
          },

          /**
           * @name   getDefaultOptions
           * @return {object}
           */
          getDefaultOptions: function getDefaultOptions() {
            return {
              timeCollapse: _this.timeCollapse,
              autoClose: _this.autoClose,
              onOpen: _this.onOpen,
              onClose: _this.onClose
            };
          }
        };
      }]
    }]);

    return AlertBannerProvider;
  })();

  angular.module('angular-alert-banner').provider('AlertBanner', AlertBannerProvider);
})();