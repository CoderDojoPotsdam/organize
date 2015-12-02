/*** Directives and services for responding to idle users in AngularJS
* @author Mike Grabski <me@mikegrabski.com>
* @version v1.1.0
* @link https://github.com/HackedByChinese/ng-idle.git
* @license MIT
*/

!function(a,b,c){"use strict";b.module("ngIdle",["ngIdle.keepalive","ngIdle.idle","ngIdle.countdown","ngIdle.title","ngIdle.localStorage"]),b.module("ngIdle.keepalive",[]).provider("Keepalive",function(){var a={http:null,interval:600};this.http=function(c){if(!c)throw new Error("Argument must be a string containing a URL, or an object containing the HTTP request configuration.");b.isString(c)&&(c={url:c,method:"GET"}),c.cache=!1,a.http=c};var c=this.interval=function(b){if(b=parseInt(b),isNaN(b)||0>=b)throw new Error("Interval must be expressed in seconds and be greater than 0.");a.interval=b};this.$get=["$rootScope","$log","$interval","$http",function(d,e,f,g){function h(a,b){d.$broadcast("KeepaliveResponse",a,b)}function i(){d.$broadcast("Keepalive"),b.isObject(a.http)&&g(a.http).success(h).error(h)}var j={ping:null};return{_options:function(){return a},setInterval:c,start:function(){return f.cancel(j.ping),j.ping=f(i,1e3*a.interval),j.ping},stop:function(){f.cancel(j.ping)},ping:function(){i()}}}]}),b.module("ngIdle.idle",["ngIdle.keepalive","ngIdle.localStorage"]).provider("Idle",function(){var a={idle:1200,timeout:30,autoResume:"idle",interrupt:"mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll",keepalive:!0},c=this.timeout=function(c){if(c===!1)a.timeout=0;else{if(!(b.isNumber(c)&&c>=0))throw new Error("Timeout must be zero or false to disable the feature, or a positive integer (in seconds) to enable it.");a.timeout=c}};this.interrupt=function(b){a.interrupt=b};var d=this.idle=function(b){if(0>=b)throw new Error("Idle must be a value in seconds, greater than 0.");a.idle=b};this.autoResume=function(b){b===!0?a.autoResume="idle":b===!1?a.autoResume="off":a.autoResume=b},this.keepalive=function(b){a.keepalive=b===!0},this.$get=["$interval","$log","$rootScope","$document","Keepalive","IdleLocalStorage","$window",function(e,f,g,h,i,j,k){function l(){a.keepalive&&(t.running&&i.ping(),i.start())}function m(){a.keepalive&&i.stop()}function n(){t.idling=!t.idling;var b=t.idling?"Start":"End";g.$broadcast("Idle"+b),t.idling?(m(),a.timeout&&(t.countdown=a.timeout,o(),t.timeout=e(o,1e3,a.timeout,!1))):l(),e.cancel(t.idle)}function o(){return t.countdown<=0?void p():(g.$broadcast("IdleWarn",t.countdown),void t.countdown--)}function p(){m(),e.cancel(t.idle),e.cancel(t.timeout),t.idling=!0,t.running=!1,t.countdown=0,g.$broadcast("IdleTimeout")}function q(a,b,c){var d=a.running();a.unwatch(),b(c),d&&a.watch()}function r(){var a=j.get("expiry");return a&&a.time?new Date(a.time):null}function s(a){a?j.set("expiry",{id:u,time:a}):j.remove("expiry")}var t={idle:null,timeout:null,idling:!1,running:!1,countdown:null},u=(new Date).getTime(),v={_options:function(){return a},_getNow:function(){return new Date},getIdle:function(){return a.idle},getTimeout:function(){return a.timeout},setIdle:function(a){q(this,d,a)},setTimeout:function(a){q(this,c,a)},isExpired:function(){var a=r();return null!==a&&a<=this._getNow()},running:function(){return t.running},idling:function(){return t.idling},watch:function(b){e.cancel(t.idle),e.cancel(t.timeout);var c=a.timeout?a.timeout:0;b||s(new Date((new Date).getTime()+1e3*(a.idle+c))),t.idling?n():t.running||l(),t.running=!0,t.idle=e(n,1e3*a.idle,0,!1)},unwatch:function(){e.cancel(t.idle),e.cancel(t.timeout),t.idling=!1,t.running=!1,s(null),m()},interrupt:function(b){return t.running?a.timeout&&this.isExpired()?void p():void(("idle"===a.autoResume||"notIdle"===a.autoResume&&!t.idling)&&this.watch(b)):void 0}};h.find("body").on(a.interrupt,function(){v.interrupt()});var w=function(a){if("ngIdle.expiry"===a.key&&a.newValue!==a.oldValue){var c=b.fromJson(a.newValue);if(c.id===u)return;v.interrupt(!0)}};return k.addEventListener?k.addEventListener("storage",w,!1):k.attachEvent("onstorage",w),v}]}),b.module("ngIdle.countdown",["ngIdle.idle"]).directive("idleCountdown",["Idle",function(a){return{restrict:"A",scope:{value:"=idleCountdown"},link:function(b){b.value=a.getTimeout(),b.$on("IdleWarn",function(a,c){b.$evalAsync(function(){b.value=c})}),b.$on("IdleTimeout",function(){b.$evalAsync(function(){b.value=0})})}}}]),b.module("ngIdle.title",[]).factory("Title",["$document","$interpolate",function(a,c){function d(a,b,c){return new Array(b-String(a).length+1).join(c||"0")+a}var e={original:null,idle:"{{minutes}}:{{seconds}} until your session times out!",timedout:"Your session has expired."};return{original:function(a){return b.isUndefined(a)?e.original:void(e.original=a)},store:function(a){(a||!e.original)&&(e.original=this.value())},value:function(c){return b.isUndefined(c)?a[0].title:void(a[0].title=c)},idleMessage:function(a){return b.isUndefined(a)?e.idle:void(e.idle=a)},timedOutMessage:function(a){return b.isUndefined(a)?e.timedout:void(e.timedout=a)},setAsIdle:function(a){this.store();var b={totalSeconds:a};b.minutes=Math.floor(a/60),b.seconds=d(a-60*b.minutes,2),this.value(c(this.idleMessage())(b))},setAsTimedOut:function(){this.store(),this.value(this.timedOutMessage())},restore:function(){this.original()&&this.value(this.original())}}}]).directive("title",["Title",function(a){return{restrict:"E",link:function(b,c,d){d.idleDisabled||(a.store(!0),b.$on("IdleStart",function(){a.original(c[0].innerText)}),b.$on("IdleWarn",function(b,c){a.setAsIdle(c)}),b.$on("IdleEnd",function(){a.restore()}),b.$on("IdleTimeout",function(){a.setAsTimedOut()}))}}}]),b.module("ngIdle.localStorage",[]).service("IdleLocalStorage",["$window",function(a){var c=a.localStorage;return{set:function(a,d){c.setItem("ngIdle."+a,b.toJson(d))},get:function(a){return b.fromJson(c.getItem("ngIdle."+a))},remove:function(a){c.removeItem("ngIdle."+a)}}}])}(window,window.angular);
//# sourceMappingURL=angular-idle.map