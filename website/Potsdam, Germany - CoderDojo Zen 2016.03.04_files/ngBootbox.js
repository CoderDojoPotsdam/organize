angular.module("ngBootbox",[]).directive("ngBootboxAlert",function(){return{restrict:"A",scope:!1,link:function(o,t,n){var e=n.ngBootboxAlert||"Yo!";t.bind("click",function(){bootbox.alert(e)})}}}).directive("ngBootboxConfirm",function(){return{restrict:"A",scope:{actionOK:"&ngBootboxConfirmAction",actionCancel:"&ngBootboxConfirmActionCancel"},link:function(o,t,n){var e=n.ngBootboxConfirm||"Are you sure?";t.bind("click",function(){bootbox.confirm(e,function(t){o.$apply(t?o.actionOK:o.actionCancel)})})}}}).directive("ngBootboxPrompt",function(){return{restrict:"A",scope:{actionOK:"&ngBootboxPromptAction",actionCancel:"&ngBootboxPromptActionCancel"},link:function(o,t,n){var e=n.ngBootboxPrompt||"Are you sure?";t.bind("click",function(){bootbox.prompt(e,function(t){o.$apply(null!==t?function(){o.actionOK({result:t})}:o.actionCancel)})})}}}).directive("ngBootboxCustomDialog",["$templateCache","$compile","$q","$http",function(o,t,n,e){var i=function(t){var i=n.defer(),c=o.get(t);return"undefined"==typeof c?e.get(t).success(function(n){o.put(t,n),i.resolve(n)}):i.resolve(c),i.promise};return{restrict:"A",scope:{title:"@ngBootboxTitle",buttons:"=ngBootboxButtons",className:"@ngBootboxClassName",data:"=ngBootboxData",options:"=ngBootboxOptions"},link:function(o,n,e){var c="",r=e.ngBootboxCustomDialogTemplate;r?i(r).then(function(n){c=t(n)(o)}):c=e.ngBootboxCustomDialog,n.bind("click",function(){bootbox.dialog(o.options?o.options:{message:c,title:o.title,buttons:o.buttons,className:o.className})})}}}]).factory("$ngBootbox",["$q","$templateCache","$compile","$rootScope","$http",function(o,t,n,e,i){function c(n){var e=o.defer(),c=t.get(n);return"undefined"==typeof c?i.get(n).success(function(o){t.put(n,o),e.resolve(o)}):e.resolve(c),e.promise}return{alert:function(t){var n=o.defer();return bootbox.alert(t,function(){n.resolve()}),n.promise},confirm:function(t){var n=o.defer();return bootbox.confirm(t,function(o){o?n.resolve():n.reject()}),n.promise},prompt:function(t){var n=o.defer();return bootbox.prompt(t,function(o){null!==o?n.resolve(o):n.reject()}),n.promise},customDialog:function(o){o.templateUrl?c(o.templateUrl).then(function(t){o.message=n(t)(e),bootbox.dialog(o)})["catch"](function(){bootbox.dialog(o)}):bootbox.dialog(o)},setDefaults:function(o){bootbox.setDefaults(o)},hideAll:function(){bootbox.hideAll()},setLocale:function(o){bootbox.setLocale(o)},addLocale:function(o,t){bootbox.addLocale(o,t)},removeLocale:function(o){bootbox.removeLocale(o)}}}]);