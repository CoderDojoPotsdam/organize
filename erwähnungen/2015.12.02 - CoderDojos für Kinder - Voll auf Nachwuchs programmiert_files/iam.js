/*DO NOT HOST THIS SCRIPT ON YOUR OWN SERVER*/
var szmvars="";
var iom = iom || (function () {
  var dummySite = "dummy",
      baseUrl = "de.ioam.de/tx.io",
      baseUrlLSO = "de.ioam.de/aid.io",
      eventList = ["", "inst", "open", "clse", "play", "stop", "fowa", "bakw", "recd", "paus", "forg", "bakg", "dele", "refr", "view", "alve", "fini", "aforg", "abakg", "aclse", "sple", "scvl", "serr", "spyr", "smdr", "sfpl", "sfqt", "ssqt", "stqt", "soqt", "sofc", "scfc", "scqt", "splr", "spli", "sprs", "spre", "smrs", "smre", "sors", "sore", "sack"],
      LSOBlacklist = [],
      checkEvents = 1,
      tb = 0,
      sv = 1,
      lastEvent = "",
      emptyCode = "Leercode_nichtzuordnungsfaehig",
      autoEvents = {
        onfocus:"aforg",
        onblur:"abakg",
        onclose:"aclse"
      },
      nt = 0;

  var IAMPageElement = null,
      IAMQSElement = null,
      result = {},
      mode,
      eventsEnabled = 0,
      surveyCalled = 0,
      inited = 0;

  function enableEvents() {
    if ((tb == 1 || result.tb == "on") && result.tb != "off" && !eventsEnabled) {
      eventsEnabled = 1;
      mode = 1;
      for(var e in autoEvents) {
        (function(e) {
          var oldEvent = window[e];
          window[e] = function() {
            if (lastEvent != autoEvents[e]) {
              lastEvent = autoEvents[e];
              event(autoEvents[e]);
            }
            if (typeof oldEvent == "function") oldEvent();
          };
        })(e);
      }
    }
  }

  function isDoNotTrack() {
    if ((nt&2) ? ((typeof result.nt == "undefined") ? (nt&1) : result.nt) : nt & 1) {
      if (window.navigator.msDoNotTrack && window.navigator.msDoNotTrack == "1") return true; 
      if (window.navigator.doNotTrack && (window.navigator.doNotTrack == "yes" || window.navigator.doNotTrack == "1")) return true; 
    }
    return false;
  }

  function loadSurvey() {
    szmvars = result.st+"//"+result.pt+"//"+result.cp+"//VIA_SZMNG";
    if (sv && !surveyCalled && result.sv !== "ke" && result.sv === "dz") {
      surveyCalled = 1;
      iam_ng_nxss();
    }
    if (sv && !surveyCalled && result.sv !== "ke" && (result.sv === "in" || result.sv === "mo" || result.sv === "i2" )) {
      surveyCalled = 1;
      var loaded = 0;
      var cook = document.cookie.split(";");
      for(var i=0;i<cook.length;i++) {
        if(cook[i].match("POPUPCHECK=.*")) {
          var check=new Date();
          var now=check.getTime();
          check.setTime(cook[i].split("=")[1]);
          if(check.getTime() >= now) loaded=1;
          break;
        }
      }
      if (loaded==0 && result.sv === "in") document.write("<script src='"+window.location.protocol+'//qs.ioam.de/?'+((window.szmvars)?szmvars:"")+"'></script>");
      if (loaded==0 && result.sv === "i2") {
        if (IAMQSElement) {
          IAMQSElement.parentNode.removeChild(IAMQSElement);
        }
        IAMQSElement = createScriptTag(window.location.protocol+'//qs.ioam.de/?'+((window.szmvars)?szmvars:""));
      }
      if (loaded==0 && result.sv === "mo") {
        if (IAMQSElement) {
          IAMQSElement.parentNode.removeChild(IAMQSElement);
        }
        IAMQSElement = createScriptTag(window.location.protocol+'//mqs.ioam.de/?'+((window.szmvars)?szmvars:""));
      }
    }
  }

  function hash(key) {
    var hash = 0;
    for (var i=0; i<key.length; ++i) {
      hash += key.charCodeAt(i);
      hash += (hash << 10);
      hash ^= (hash >> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >> 11);
    hash += (hash << 15);
    hash = Math.abs(hash & hash);
    return hash.toString(36);
  }

  function activeXDetect() {
    var result = "",
        componentVersion,
        components =[
                     "7790769C-0471-11D2-AF11-00C04FA35D02", "89820200-ECBD-11CF-8B85-00AA005B4340",
                     "283807B5-2C60-11D0-A31D-00AA00B92C03", "4F216970-C90C-11D1-B5C7-0000F8051515",
                     "44BBA848-CC51-11CF-AAFA-00AA00B6015C", "9381D8F2-0288-11D0-9501-00AA00B911A5",
                     "4F216970-C90C-11D1-B5C7-0000F8051515", "5A8D6EE0-3E18-11D0-821E-444553540000",
                     "89820200-ECBD-11CF-8B85-00AA005B4383", "08B0E5C0-4FCB-11CF-AAA5-00401C608555",
                     "45EA75A0-A269-11D1-B5BF-0000F8051515", "DE5AED00-A4BF-11D1-9948-00C04F98BBC9",
                     "22D6F312-B0F6-11D0-94AB-0080C74C7E95", "44BBA842-CC51-11CF-AAFA-00AA00B6015B",
                     "3AF36230-A269-11D1-B5BF-0000F8051515", "44BBA840-CC51-11CF-AAFA-00AA00B6015C",
                     "CC2A9BA0-3BDD-11D0-821E-444553540000", "08B0E5C0-4FCB-11CF-AAA5-00401C608500",
                     "D27CDB6E-AE6D-11CF-96B8-444553540000", "2A202491-F00D-11CF-87CC-0020AFEECF20"
                    ];
    document.body.addBehavior( "#default#clientCaps" );
    for (var i = 0; i < components.length; i++) {
      componentVersion = document.body.getComponentVersion('{' + components[i] + '}', 'ComponentID');
      if ( componentVersion != null ) {
        result += componentVersion;
      } else {
        result += "null";
      }
    }
    return result;
  }

  function fingerprint() {
    var nav = window.navigator, t = nav.userAgent;
    t += getScreen();
    if (nav.plugins.length > 0 ) {
      for (var i = 0; i < nav.plugins.length; i++ ) {
        t += nav.plugins[i].filename + nav.plugins[i].version + nav.plugins[i].description;
      }
    }
    if (nav.mimeTypes.length > 0 ) {
      for (var i = 0; i < nav.mimeTypes.length; i++ ) {
        t += nav.mimeTypes[i].type;
      }
    }
    if ( /MSIE (\d+\.\d+);/.test(nav.userAgent) ) {
      try {
        t += activeXDetect();
      }
      catch(e) {
        //ignore
      }
    }
    return hash(t);
  }

  function createScriptTag(url){
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = url;
    var head = document.getElementsByTagName("head")[0];
    if(head) {
      head.appendChild(el);
      return el;
    }
    else return false;
  }

  function transmitData(url, mode) {
    if (url.split("/")[2].slice(url.split("/")[2].length-8) == ".ioam.de") {
      switch (mode) {
        case 1:
          if (IAMPageElement) {
            IAMPageElement.parentNode.removeChild(IAMPageElement);
          }
          IAMPageElement = createScriptTag(url+'&mo=1');
          if (!IAMPageElement) (new Image()).src = url+'&mo=0';
          break;
        case 2:
          (new Image()).src = url+'&mo=0';
          break;
        case 3:
          var IAMsendBox = document.getElementById('iamsendbox'), sendBoxStyle;
          if (IAMsendBox) {
            document.body.removeChild(IAMsendBox);
          }
          IAMsendBox = document.createElement("iframe");
          IAMsendBox.id = "iamsendbox";
          sendBoxStyle = IAMsendBox.style;
          sendBoxStyle.position = "absolute";
          sendBoxStyle.left = sendBoxStyle.top = "-999px";
          IAMsendBox.src = url + "&mo=1";
          document.body.appendChild(IAMsendBox);
          break;
        case 0:
        default:
          document.write('<script src="'+url+'&mo=1"></script>');
      }
    }
  }

  function getScreen() {
    return screen.width + "x" + screen.height + "x" + screen.colorDepth;
  }

  function arrayContains(arr, obj) {
    var i;
    for (i=0;i<arr.length;i++) {
      if (arr[i]==obj) return true;
    }
    return false;
  }

  function transformVar(value) {
    if (!value) value = "";
    value = value.replace(/[?#].*/g, "");
    value = value.replace(/[^a-zA-Z0-9,_\/-]+/g, ".");
    if (value.length > 255) value = value.substr(0,254) + '+';
    return value;
  }

  function getRefHost() {
    var url = document.referrer.split("/");
    return (url.length >= 3) ? url[2] : "";
  }

  function buildResult(params) {
    result = {};
    var i;
    for (i in params) {
      if (params.hasOwnProperty(i)) {
        result[i] = params[i];
      }
    }
    if (result.hasOwnProperty("fp")) {
      result.fp = (result.fp != "" && typeof result.fp != "undefined") ? result.fp : emptyCode;
      result.fp = transformVar(result.fp);
      result.pt = "FP";
    }
    if (result.hasOwnProperty("np")) {
      result.np = (result.np != "" && typeof result.np != "undefined") ? result.np : emptyCode;
      result.np = transformVar(result.np);
      result.pt = "NP";
    }
    if (result.hasOwnProperty("xp")) {
      result.xp = (result.xp != "" && typeof result.xp != "undefined") ? result.xp : emptyCode;
      result.xp = transformVar(result.xp);
      result.pt = "XP";
    }
    if (result.hasOwnProperty("cp")) {
      result.cp = (result.cp != "" && typeof result.cp != "undefined") ? result.cp : emptyCode;
      result.cp = transformVar(result.cp);
      result.pt = "CP";
    }
    if (!result.pt) {
      result.cp = emptyCode;
      result.pt = "CP";
      result.er = "N13";
    }
    result.rf = getRefHost();
    result.r2 = document.referrer;
    result.ur = document.location.host;
    result.xy = getScreen();
    result.lo = "DE/Berlin";
    result.cb = "000a";
    result.vr = "308";
    result.id = fingerprint();
    result.st = result.st ? result.st : dummySite;
  }

  function event(event) {
    var payLoad = "";
    var i;
    event = event || "";
    if (inited && !isDoNotTrack() && (!checkEvents || (checkEvents && arrayContains(eventList, event)))) {
      result.lt = (new Date()).getTime();
      result.ev = event;
      var proto = ( window.location.protocol.slice(0,4) === 'http' ) ? window.location.protocol : "https:";
      if ( !(arrayContains(LSOBlacklist, result.st)) && (((/iPhone/.test(window.navigator.userAgent) || /iPad/.test(window.navigator.userAgent)) && /Safari/.test(window.navigator.userAgent) && !(/Chrome/.test(window.navigator.userAgent))) || (/Maple_2011/.test(window.navigator.userAgent))) ) {
        baseUrl = baseUrlLSO;
        mode = 3;
        result.u2 = document.URL;
      }
      for (i in result) {
        if (result.hasOwnProperty(i) && i!="cs" && i!="url") {
          payLoad = payLoad + encodeURIComponent(i).slice(0,8) + "=" + encodeURIComponent(result[i]).slice(0,2048) + "&";
        }
      }
      payLoad = payLoad.slice(0,4096);
      result.cs = hash(payLoad);
      result.url = proto + "//" + baseUrl + "?" + payLoad + "cs=" + result.cs;
      transmitData(result.url, mode);
      return result;
    }
    return {};
  }

  function forwardToOldSZM() {
    if (result.oer === "yes" && !window.IVW && !document.IVW) {
      var SZMProtocol = (window.location.protocol.slice(0,4) === 'http') ? window.location.protocol : "https:";
      var SZMComment = (result.co) ? result.co + "_SENT_VIA_MIGRATION_TAG" : "SENT_VIA_MIGRATION_TAG";
      var SZMCode = (result.oc) ? result.oc : ((result.cp) ? ((result.cp == emptyCode) ? "" : result.cp) : "");
      var SZMContType = (result.pt !== null) ? result.pt : "CP";
      (new Image()).src = SZMProtocol + "//" + result.st + ".ivwbox.de/cgi-bin/ivw/" + SZMContType.toUpperCase() + "/" + SZMCode + ";" + SZMComment + "?r=" + escape(document.referrer) + "&d=" + (Math.random()*100000);
    }
  }

  function count(params, m) {
    init(params,m);
    return event(result.ev);
  }

  function init(params,m) {
    mode = m;
    buildResult(params);
    if (result.sv) {
      result.sv = (result.sv == "in" && mode == 1) ? "i2" : result.sv;
    }
    enableEvents();
    loadSurvey();
    inited = 1;
    forwardToOldSZM();
    return {};
  }

  function hybrid(params,m) {
    init(params,m);
    var ioam_smi = (typeof localStorage === 'object' && typeof localStorage.getItem === 'function') ? localStorage.getItem("ioam_smi") : null;
    var ioam_site = (typeof localStorage === 'object' && typeof localStorage.getItem === 'function') ? localStorage.getItem("ioam_site") : null;
    var ioam_bo = (typeof localStorage === 'object' && typeof localStorage.getItem === 'function') ? localStorage.getItem("ioam_bo") : null;
    if ( ioam_smi !== null && ioam_site !== null && ioam_bo !== null ) {
      result.mi = ioam_smi;
      result.fs = result.st;
      result.st = ioam_site;
      result.bo = ioam_bo;
      if (result.fs == result.st) {
        result.cp = (result.cp.slice(0,10) !== "___hyb2___") ? "___hyb2___"+result.fs+"___"+result.cp : result.cp;
      } else {
        result.cp = (result.cp.slice(0,9) !== "___hyb___") ? "___hyb___"+result.fs+"___"+result.cp : result.cp;
      }
      return event(result.ev);
    } else if ( ioam_smi !== null && ioam_bo !== null ) {
      return {};
    } else {
      if ( window.location.protocol.slice(0,4) !== 'http' || /IOAM\/\d+\.\d+/.test(window.navigator.userAgent) ) {
        return {};
      } else {
        return event(result.ev);
      }
    }
  }

  function setMultiIdentifier(midentifier) {
    if ( localStorage.getItem("ioam_smi") === null || localStorage.getItem("ioam_site") === null || localStorage.getItem("ioam_bo") === null || localStorage.getItem("ioam_smi") !== midentifier ) {
      result.fs = result.st;
      var JsonMIndetifier = null;
      var NewSite = null;
      if ( typeof midentifier === 'string' && typeof JSON === 'object' && typeof JSON.parse === 'function' ) {
        try {
          JsonMIndetifier = JSON.parse(midentifier);
          if (JsonMIndetifier.hasOwnProperty( 'library' )) {
            if (JsonMIndetifier.library.hasOwnProperty( 'offerIdentifier' )) {
              if ( JsonMIndetifier.library.offerIdentifier ) {
                NewSite = JsonMIndetifier.library.offerIdentifier;
              } else {
                result.er = "JSON(E10): offerIdentifier not valid";
              }
            } else {
              result.er = "JSON(E10): no key offerIdentifier";
            }
          } else {
            result.er = "JSON(E10): no key library";
          }
        } catch(err) {
          result.er = "JSON(E10): "+err;
        }
      }
      if ( NewSite !== null ) {
        localStorage.setItem("ioam_site", NewSite);
      }
      result.st = NewSite;
      result.mi = midentifier;
      result.bo = (new Date()).getTime();
      localStorage.setItem("ioam_smi", result.mi);
      localStorage.setItem("ioam_bo", result.bo);
      if (result.fs == result.st) {
        result.cp = (result.cp.slice(0,10) !== "___hyb2___") ? "___hyb2___"+result.fs+"___"+result.cp : result.cp;
      } else {
        result.cp = (result.cp.slice(0,9) !== "___hyb___") ? "___hyb___"+result.fs+"___"+result.cp : result.cp;
      }
      return event(result.ev);
    }
    return {};
  }

  if (typeof window.postMessage != "undefined"
      && typeof JSON === 'object'
      && typeof JSON.parse === 'function'
      && typeof JSON.stringify === 'function') {
    var evtListener;
    var evtPrefix = "";
    if (window.addEventListener) {
      evtListener = window.addEventListener;
    } else {
      evtListener = window.attachEvent;
      evtPrefix = "on";
    }
    evtListener(evtPrefix + "message", function(msg) {
      try {
        var msgdata = JSON.parse(msg.data);
      } catch(e) {
        msgdata = { type:false };
      }
      if (typeof msgdata == "object" && msgdata.type == "iam_data") {
        var respObj = {
                       seq : msgdata.seq,
                       iam_data : {
                                   st: result.st,
                                   cp: result.cp
                                  }
                      }
        msg.source.postMessage(JSON.stringify(respObj),msg.origin);
      }
    });
  }

  return {
    count: count,
    c: count,
    i:init,
    init:init,
    e:event,
    event:event,
    h:hybrid,
    hybrid:hybrid,
    setMultiIdentifier:setMultiIdentifier,
    smi:setMultiIdentifier
  }

})();
