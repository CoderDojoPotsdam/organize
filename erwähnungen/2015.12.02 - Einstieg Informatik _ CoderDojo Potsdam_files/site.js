
function initFilter(o) {
	o._up = false;
	o.len = o.selection.length;
	o.block = function() {
		return false;
	}
	o.clearAll = function() {
		this.selection = [];
		this.reset();
	}
	o.reset = function() {
		this._selected = {};
		this.count = 0;
		this.first = null;
		var ci = $(this.categoryItems,this.c);
		for(var i=0;i<this.selection.length;i++) {
			var t = "t_"+this.selection[i];
			this._selected[t] = true;
			this.count++;
		}
		var sel = this._selected;
		ci.find(".item").each(function() {
			var f = sel[this.name] || false;
			sel[this.name] = f;
		});
		this.updateSelection();
		this.first = $(this.categories,this.c).find(".item.has:first");
		if(this.first.length==0) this.first = $(this.categories,this.c).find(".item:first");
	}
	o.changeCategory = function(e) {
		$(o.categoryItems,o.c).find(".item").hide();
		for(var i=0;i<this.items.length;i++) {
			var t = "[name=t_"+this.items[i]+"]";
			$(o.categoryItems,o.c).find(t).css("display","block");
		}
		$(this).addClass("cur").siblings(".item").removeClass("cur");
		return false;
	}
	o.selectItem = function(e) {
		var f = o._selected[this.name] || false;
		f = !f;
		if(f && o.count==15) {
			$(".filterInfo",o.c).fadeIn();
			return false;
		} else if(o.count==15) {
			$(".filterInfo",o.c).hide();
		}
		o.count += (f ? 1 : -1);
		o._selected[this.name] = f;
		o.updateSelection();
		return false;
	}
	o.updateSelection = function() {
		var ca = $(this.categories,this.c);
		var si = $(this.selectedItems,this.c);
		var ci = $(this.categoryItems,this.c);
		ca.find(".has").removeClass("has");
		si.empty();
		for(var n in this._selected) {
			var el = ci.find("[name="+n+"]");
			var e = "[name=c_"+el.get(0).rel+"]";
			if(this._selected[n]) {
				si.append(el.clone(true).removeClass("cur").css("display","block"));
				el.addClass("cur");
				ca.find(e).addClass("has");
			} else {
				el.removeClass("cur");
			}
		}
	}
	o.submit = function() {
		var ids=[];
		$(o.selectedItems,o.c).find("[name]").each(function() {
			ids.push(parseInt(this.name.split("_")[1]));
		});
		writeCookie("hs_themenfilter",ids.join(","));
		var f = ids.length > 0 ? 1 : 0;
		writeCookie("hs_themen_on",1);
		$(o.bgnd).hide();
		$(o.sheet).hide();
		setTimeout(function() {	location.reload() },100);
	}
	o.close = function() {
		if(!o._up) return false;
		o._up = false;
		$(o.bgnd).fadeOut("fast");
		$(o.sheet).hide();
		return false;
	}

	var c = $(o.sheet).get(0);
	o.c = c;
	$(o.submitButton,c).click(o.submit);
	$(o.closeButton,c).click(o.close);
	$(o.resetButton,c).click(function() {o.clearAll(); o.first.click() } );
	$(o.bgnd).click(o.close);
	$(o.viewButton).click(function() {
		window.scrollTo(0,0);
		var h = Math.max($(document).height(),$(window).height());
		o.reset();
		if(o.first) o.first.click();
		o._up = true;
		$(o.sheet).show();
		$(o.bgnd).css({opacity:0.0,height:h,top:"0px",left:"0px"}).show().animate({opacity:0.6},500);
		return false;
	});
	$(o.switchButton).click(function() {
		var sw = o.switchStatus > 0 ? 0 : 1;
		o.switchStatus = sw;
		writeCookie("hs_themen_on",sw);
		if(o._up) {
			o.submit();
		} else {
			if(o.selection.length==0) {
				$(o.viewButton).click();
			} else {
				location.reload();
			}
		}
	}).toggleClass("active",(o.switchStatus > 0));
	$(o.categories,c).find(".item").each(function() { 
		this.items = this.rel.split(",");
	}).click(o.changeCategory);

	$(o.categoryItems,c).find(".item").click(o.selectItem);
	$(".item",c).bind("mousedown",o.block);
}
function initMap(m) {
	var d = document.getElementById(m.mapContainer);
	if(!d) return;
	d.style.visibility = "visible";
	m.div = d;
	m.map = new google.maps.Map(document.getElementById("map"),{
		center: new google.maps.LatLng(m.defaultLocation.lat,m.defaultLocation.lng),
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		zoom:m.defaultLocation.zoom,
		scrollwheel:false
	});
	m.geo = new google.maps.Geocoder();
	m.focusLoc = null;
	m.focusZoom = 12;
	m.center = null;
	m.locked = false;
	m.cls = "hs";
	m.markers_count = 0;
	m.infoWindow = new google.maps.InfoWindow({content:"einstieg-informatik",maxWidth:300});
	m.infoWindow.isOpen = false;
	m.infoWindow.iv = 0;
	google.maps.event.addListener(m.infoWindow,'closeclick',function() {
		//infoClosed
	});
	//Loc eintragen
	m.setMarker = function(pt,o) {
		var marker = new google.maps.Marker({position:pt,map:this.map});
		if(!marker) return null;
		marker._o = {text:o.text,aid:o.aid,hid:o.hid};
		marker._m = this;

		//ExtInfoWindow-Ersatz
		if(o.text && o.text != "") {
			google.maps.event.addListener(marker,'mouseover',this.showInfo);
			google.maps.event.addListener(marker,'mouseout',this.hideInfoDelayed);
		}

		if(o.aid != "0" && o.aid != "") {
			google.maps.event.addListener(marker,"click",function() {
				window.location.href = "index.php?article_id="+o.aid;
			});
		}
		return marker;
	}
	m.hideInfoDelayed = function(ev) {
		//at marker
		var inst = this._m;
		var wnd = inst.infoWindow;
		if(!wnd.isOpen) return;
		if(wnd.iv > 0) clearTimeout(wnd.iv);
		wnd.iv = setTimeout(function() {
			inst.hideInfo();
		},2000);
	}
	m.hideInfo = function(ev) {
		//at theMap
		var wnd = this.infoWindow;
		if(wnd.iv > 0) {
			clearTimeout(wnd.iv);
			wnd.iv = 0;
		}
		wnd.close();
		wnd.isOpen = false;
	}
	m.showInfo = function(ev) {
		//at marker
		var wnd = this._m.infoWindow;
		if(wnd.isOpen) {
			this._m.hideInfo();
		}
		wnd.setContent("<div class='map_info'>"+this._o.text+"</div>");
		wnd.open(this._m.map,this);
		wnd.isOpen = true;
	}
	//Loc anfordern
	m.setLocation = function(o) {

		var me = this;
		var lat = o.lat;
		var lng = o.lng;
		var marker;

		if(lat > 0 && lng > 0) {
			var pt = new google.maps.LatLng(lat,lng);
			o.marker = this.setMarker(pt,o);
			this.markers_count++;
		} else {
			this.geo.geocode({'address':o.adr},function(results,status) {
				if(status != google.maps.GeocoderStatus.OK) return;
				var pt = results[0].geometry.location;
				o.marker = me.setMarker(pt,o);
				me.markers_count++;
				if(me.markers_count == me.locs.length) {
					me.markersSet();
				}
			});
		}
	}
	m.showMarkers = function(vis_map) {
		for(var i=0;i<this.locs.length;i++) {
			var loc = this.locs[i];
			if(!loc.hid || !loc.marker) continue;
			var vis = vis_map ? vis_map[loc.hid] : true;
			loc.marker.setVisible(vis);
		}
	}
	//Alle Markierungen gesetzt
	m.markersSet = function() {
		updateRelatedContent();
		if(this.locs.length == 0) {
			$(".content_filter").hide();
		}
		
		if(!$("#cmap").hasClass("active")) {
			setTimeout(function() {	
				$("#d_cmap").slideUp();
			},500);
		}
		return;
		//var cm = document.getElementById("cmap");
		if(cm) {
			setTimeout(function() {
				if(!cm._first) return;
				cm._first = false;
				$("#d_cmap").slideUp();
			},750);
		}
	}
	//Loc setzen (wg. Refs in eig. Methode)
	m.setLocations = function() {
		for(var i=0;i<this.locs.length;i++) {
			this.setLocation(this.locs[i]);
		}
		if(this.markers_count == this.locs.length) {
			this.markersSet();
		}
	}
	m.setLock = function(f) {
		if(f) {
			$(this.lockSwitch).addClass("active");
		} else {
			$(this.lockSwitch).removeClass("active");
		}
		this.locked = f;
		writeCookie("geoLock",(f ? 1 : 0));
	}
	m.setFocus = function() {
		var z = this.map.getZoom();
		var c = this.map.getCenter();
		var lt = c.lat();
		var lg = c.lng();
		this.focusLoc = c;
		this.focusZoom = z;
		writeCookie("geo",lt+"|"+lg+"|"+z);
	}
	m.showFocus = function() {
		if(this.locked) {
			var pt = this.focusLoc;
			var z = this.focusZoom;
		} else {
			var pt = this.center;
			var z = this.zoom;
		}
		this.map.setZoom(z);
		this.map.panTo(pt);
	}
	m.check = function(oz) {
		if(this.locked) {
			this.setLock(false);
		}
	}
	//Events, dragging schaltet Fokus aus
	/*
	google.maps.event.addListener(m.map,"dragstart",function() {
		m.check();
	});
	*/
	//Buttons
	//Doppelklick-Auswahl unterbinden
	$(m.mapButtons).bind('mousedown',function() { return false});
	$(m.mapHeader).bind('mousedown',function() {return false});

	//Geofilter an/aus
	$(m.lockSwitch).click(function() {
		if(!m.focusLoc) {
			var ok = confirm("Noch kein Fokus gesetzt. Fokus hier setzen?");
			if(ok) m.setFocus();
			else return false;
		}
		m.setLock(!m.locked);
		m.showFocus();
		return false;
	});
	//Geofilter setzen
	$(m.lockButton).click(function() {
		m.setFocus();
		m.setLock(true);
		m.showFocus();
		return false;
	});
	//Zoom ein/aus
	$(m.zoomButton).toggle(
		function() {
			var c = m.map.getCenter();
			$(m.mapHolder).addClass("zoomed");
			m.map.checkResize();
			m.map.setCenter(c);
			$(this).html(m.zoomButtonCaption[1]);
		},
		function() {
			var c = m.map.getCenter();
			$(m.mapHolder).removeClass("zoomed");
			m.map.checkResize();
			m.map.setCenter(c);
			$(this).html(m.zoomButtonCaption[0]);
		}
	);
	//Geofilter oder Eintrag
	//Geofilter via cookies
	var g = readCookie("geo");
	var f = parseInt(readCookie("geoLock")) == 1;
	if(g && g.indexOf("|") > 0) {
		var a = g.split("|");
		var lt = parseFloat(a[0]);
		var lg = parseFloat(a[1]);
		var z = parseInt(a[2]);
		var pt = new google.maps.LatLng(lt,lg);
		m.focusLoc = pt;
		m.focusZoom = z;
		m.setLock(f);
	}
	//Oder evtl. Seite / Uni als Vorauswahl
	var pt = null;
	var fo = m.focus;
	//Vorauswahl naeher zoomen
	if(fo > -1) {
		m.zoom = Math.max(m.zoom,11);
	} else {
		fo = 0;
		var pt = new google.maps.LatLng(m.defaultLocation.lat,m.defaultLocation.lng);
		m.zoom = m.defaultLocation.zoom;
	}
	//Eintrag
	if(!pt) {
		var o = m.locs[fo];
		//Geocode für
		m.geo.geocode({'address':o.adr},function(results,status) {
			if(status != google.maps.GeocoderStatus.OK) return;
			var pt = results[0].geometry.location;
			if(!pt) {
				//Punkt nicht gefunden
				var pt = new google.maps.LatLng(m.defaultLocation.lat,m.defaultLocation.lng);
				m.zoom = m.defaultLocation.zoom;
			}
			m.center = pt;
			//Fokus an/aus
			if(m.locked && m.focusLoc) {
				m.map.setCenter(m.focusLoc,m.focusZoom);
			} else {
				m.map.setCenter(pt,m.zoom);
			}
			//Alle Marker setzen
			m.setLocations();
		});
	} else {
		m.center = pt;
		if(m.locked) {
			m.map.setCenter(m.focusLoc,m.focusZoom);
		} else {
			m.map.setCenter(pt,m.zoom);
		}
		m.setLocations();
	}
	m.div.style.visibility = "visible";
	//updateRelatedContent();
}
function readCookie(n) {
	return $.cookie(n);
}
function writeCookie(n,v) {
	$.cookie(n,v,{path:"/"});
}
function deleteCookie(n) {
	$.cookie(n,null);
}

function trace(s) {
	if(window.console) console.log(s);
}
//Cookie
jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		// NOTE Needed to parenthesize options.path and options.domain
		// in the following expressions, otherwise they evaluate to undefined
		// in the packed version for some reason...
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
function initBubbles() {
	hs_popups = {};
	var cnt = 1;
	if(jQuery.browser.msie) {
		var cso = {background:"none",filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/bubble_top.png',sizingMethod='scale')"};
		$(".popup_top").css(cso);
		cso.filter = cso.filter.replace(/_top/,'_middle');
		$(".popup_content").css(cso);
		cso.filter = cso.filter.replace(/_middle/,'_bottom');
		$(".popup_bottom").css(cso);
		$(".popup_inner").css("opacity",1);
	}
	$(".popup").each(function() {
		this.fx = 0;
		this.id = "p_"+cnt++;
		this.hide2=function() {
			if(this.fx==2) return;
			this.fx = 2;
			hs_popups[this.id] = false;
			$(this).animate({
				opacity:0,
				top:"+=20px"
			},300,"swing",function() {
				this.fx=0;
				this.style.display="none";
			});
		}
	});
	$(".popup_block").hover(function() {
		var p = $(this).find(".popup");
		var h = p.get(0);
		if(h.fx==1) return;
		if(h.fx==2) {
			p.stop(true,true);
		}
		h.fx = 1;
		for(var pp in hs_popups) {
			var op = hs_popups[pp];
			if(op) {
				$("#"+pp).get(0).hide2();
			}
		}
		hs_popups[h.id] = true;
		p.css({top:-30,opacity:0,display:'block'}).animate({
			top:-20,
			opacity:1
		},500,"swing",function() {
			h.fx=0;
		});
		
	},function() {
		var p = $(this).find(".popup");
		var h = p.get(0);
		if(h.fx==2) return;
		if(h.fx==1) {
			p.stop(true,true);
		}
		h.hide2();
	});
}
function initPanes(o) {
	var p = $(o.panes);
	var b = $(o.tabs);
	if(b.length==0) return;

	o.cur = {n:"",r:"",h:"",c:"",abschl:"",hs:"",kat:""};
	o.pane = null;
	o.block = function() {return false};
	o.filter = function() {
		var n = this.name;
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		o.cur[n] = this.rel=="0" ? "" : this.rel;
		o.update();
	}
	o.update = function() {
	
		var cn = this.cur.n; //ort
		var cr = this.cur.r; //abschluss
		var ch = this.cur.h; //hochschulart
		var cc = this.cur.c; //studiengang
		
		var is_hs = o.pane.id == 'pane_2';
		if(is_hs) {
			cr = "";
			cc = "";
		}
		//alle aus
		if(cn=="" && cr=="" && ch=="" && cc=="") {
			p.find(".entry").show();
			if(theMap) theMap.showMarkers(null);
			return;
		}
		//str-suche (schneller als array)
		if(cr != "") cr = ","+cr+",";
		if(cc != "") cc = ","+cc+",";

		var vis_map = {};
		var cnt=0;
		
		for(var i=0;i<o.pane.entries.length;i++) {
			var entry = o.pane.entries[i];
			//Anfangsbuchstabe
			var vis = cn == "" || cn.indexOf(entry.nn) > -1;
			//Hochschulart
			if(vis) vis = ch == "" || entry.hs == false || entry.hs == ch;
			//Abschluss
			if(vis) vis = entry.abschl == false || cr == "" || cr.indexOf(entry.abschl) > -1;	
			//Studiengang-Kategorie
			if(vis) vis = entry.kat == "" || cc == "" || entry.kat.indexOf(cc) > -1;
			
			//Nur Einträge mit Hochschul-ID sind auch auf der Karte
			if(entry.hid > 0) {
				vis_map[entry.hid] = vis_map[entry.hid] || vis;
			}
			$(entry).toggle(vis);
		}
		if(theMap) theMap.showMarkers(vis_map);
	}
	o.reset = function() {
		return;
		p.find(".filter").removeClass("active");
		p.find('.filter[rel="0"]').addClass("active");
		this.cur = {n:"",r:"",h:"",c:""};
		this.update();

	}
	//tabs
	b.find(".tab").click(function() {
		//tab
		var self = $(this);
		if(self.hasClass("active")) return false;
	
		self.siblings().removeClass("active");
		self.addClass("active");
		var r = this.rel;
		//Abschluss und Kategoriefilter nur in pane 1
		p.find(".filters").toggle(r=="pane_1");
		//pane
		p.find(".pane").removeClass("active");
		o.pane = document.getElementById(r);
		$("#"+r).addClass("active");
		o.update();
		return false;
	}).bind("mousedown",o.block);

	var vis_map = {};
	o.pane = document.getElementById("pane_1");
	//filter buttons
	p.find(".filter").click(o.filter).bind("mousedown",o.block);
	//alle eintraege
	
	p.find(".pane").each(function() {
		var pane = this.id;
		//Alle Einträge
		this.entries = $(this).find(".entry[rel]").each(function() {
			this._pane = pane;
//			var r = this.getAttribute("rel");
			
			this.nn = this.getAttribute("name");
			
			this.abschl = this.getAttribute("a");
			if(this.abschl == "0") this.abschl = false;
			
			this.hs = this.getAttribute("h");
			if(this.hs == "0") this.hs = false;
			
			this.kat = this.getAttribute("c");
			if(this.kat != "0") this.kat = ","+this.kat+",";
			else this.kat = "";

/*			
			var rr = r.split("|");
	
			this._n = this._name;
			this._r = ","+rr[0]+",";
			this._h = rr[1];
			
			this._c = rr.length > 1 ? ","+rr[2]+"," : ",0,";
	
			this._rel = rr[0];
*/
			this.hid = this.getAttribute("hid");
			if(this.hid) vis_map[this.hid] = this.style.display != "none";
		});
	});
	if(o.paneContentOnly && theMap.locs) {
		for(var i=0;i<theMap.locs.length;i++) {
			var loc = theMap.locs[i];
			if(!loc.marker) continue;
			if(!loc.hid) {
				loc.marker.setVisible(false);
				loc.hidden = true;
			}
		}
	}
	p.find(".filter.active").trigger("click");
	
}

function initContentFilter() {

	$("#content").find(".list_block,.news_block").each(function() {
		this._rel = this.getAttribute("rel") || "||";
		this._matches = this._rel.split("|");
		if(this._matches.length < 3) {
			while(this._matches.length < 3) this._matches.push("");
		}
		for(var i=0;i<this._matches.length;i++) {
			if(this._matches[i]) this._matches[i] = "("+escReg(this._matches[i]).replace(/;/g,"|")+")";
		}
		if(this.id && this.id.indexOf("_")) {
			this.aid = this.id.split("_",2)[1];
		} else {
			this.aid = 0;
		}
	});

	var page = $("#d_cf").attr("rel");
	var filter_cookie = readCookie("hscf_"+page) || "||";
	
	//filter sets
	filter_sets = filter_cookie.split("|",3);
	
	if(filter_sets.length != 3) {
		filter_cookie = "||";
		writeCookie("hscf_"+page,filter_cookie);
		filter_sets = ["","",""];
	}
	var row = 0;
	$(".filter_set").each(function() {
		$(this).find(".word").each(function() {
			this._word = unescape(this.hash.substr(1));
			this._fword = this._word+";";
			this._row = row;
		});
		$(this).find(".reset").each(function() {
			this._row = row;
		});
		row++;
	});
	$("a.reset").click(function() {
		$(this).addClass("active");
		filter_sets[this._row] = "";
		filterPage(page);
		return false;
	});
	//statt toggle (wg. cookies)
	$("a.word").click(function() {
		if(this._word=="all") {
			filter_sets = ["","",""];
		} else if(this._word=="reset") {
			filter_sets[this._row] = "";
		} else {
			var filter_set = filter_sets[this._row];
			var idx = filter_set.indexOf(this._fword);
			if(idx == -1) {
				filter_sets[this._row] += this._fword;
			} else {
				filter_sets[this._row] = filter_set.replace(this._fword,"");
			}
		}
		filterPage(page);
		return false;
	});
	
	
	filterPage(page);
	
	//filterblock slide show/hide
	$(".content_filter .toggle").click(function() {
		$(this).toggleClass("active");
		var tgt = $("#d_"+this.id);
		/*
		if(this._first) {
			this._first = false;
		}
		*/
		tgt.slideToggle("fast");
	}).css("cursor","pointer");
	
	
	//filter einblenden, wenn gesetzt
	if(filter_cookie != "||") {
		$(".content_filter .toggle").click();
	}
	
	//google map ausblenden
	//$("#cmap").removeClass("active");
	//var cm = document.getElementById("cmap");
	//if(cm) cm._first = true;
	updateRelatedContent();
	
}
function escReg(s) {
	return s.replace(/([.?*+^$[\]\\(){}-])/g,"\\$1");
}
function filterPage(page) {
	
	//nur zur Sicherheit
	if(!page) var page = $("#d_cf").attr("rel");
	if(!filter_sets || !(filter_sets instanceof Array) || filter_sets.length < 3) {
		filter_sets = ["","",""];
	}

	//cookie per page
	var cookie = filter_sets.join("|");
	writeCookie("hscf_"+page,cookie);

	$('.content_filter a.word').removeClass("active");
	$('.content_filter a.reset').addClass("active");
	//shortcut
	if(cookie == "||") {
		$('.content_filter a.reset').addClass("active");
		$("#content").find(".list_block,.news_block").show();
		updateRelatedContent();
		return;
	}
	var ids = [];
	var sets = {};
	//set active
	$(".content_filter a.word").each(function() {
		if(this._word == "reset") return;
		var filter_set = filter_sets[this._row];
		if(filter_set.indexOf(this._fword) > -1) {
			$(this).addClass("active");
			if(!sets[this._row]) {
				sets[this._row] = true;
				$(this).siblings("a.reset").removeClass("active");
				
			}
		}
	});
	//Alle list_blocks und news_blocks koennen gefilterter werden
	$("#content").find(".list_block,.news_block").each(function() {
		if(this._rel == "||") {
			$(this).hide();
			return;
		}
		var visible = true;
		for(var i=0;i<this._matches.length;i++) {
			var match = this._matches[i];
			var filter_set = filter_sets[i];
			

			
			//Kein Filter auf dieser Ebene, weiter
			if(!filter_set) {
				continue;
			}
			//Filter war, aber kein Eintrag, nicht sichtbar, weiter
			if(!match) {
				visible = false;
				continue;
			}
			//Filter und Eintrag, match
			var reg = i < 2 ? new RegExp(match,"gi") : new RegExp(match,"g");
			var found = filter_set.match(reg);
			
			//unsichtbarkeit nicht ueberschreiben
			if(visible) visible = (found != null);
		}
		this.style.display = visible ? 'block' : 'none';
	});
	updateRelatedContent();
}
function findNote(hid,sid) {
	for(var i=0;i<hs_notes.length;i++) {
		var note = hs_notes[i];
		var pn = note.split("|");
		var nhid = pn[3];
		var nsid = pn[4];
		if(nhid == hid && nsid == sid) return i;
	}
	return -1;
}
function readNotePad() {
	hs_notes = [];
	hs_notepad = readCookie('hs_notes');
	if(!hs_notepad) {
		hs_notepad = '';
	} else {
		hs_notes = hs_notepad.split("#");
	}
}
function writeNotePad() {
	var n = hs_notes.join("#");
	writeCookie('hs_notes',n);
	readNotePad();
}
function initNotePad() {
	readNotePad();
	var div = $("#d_notes");
	var t = $("#notes .klinketext").html()+" ("+hs_notes.length+")";
	$("#notes .klinketext").html(t);
	if(hs_notes.length > 0) {
		var ul = document.createElement("ul");
		ul.className = 'notes_list';
		var items = "";
		for(var i=0;i<hs_notes.length;i++) {
			var note = hs_notes[i];
			var pp = note.split("|");
			var txt = pp[1];
			var aid = pp[2];
			var hid = pp[3];
			var sid = pp[4];
			var ref = "index.php?article_id="+aid+"&hid="+hid+"&sid="+sid;
			items += "<li><a href='"+ref+"'>&raquo; "+txt+"</a></li>";
		}
		items += "<li class='button'><a rel='del'>Merkliste leeren</a></li>";
		ul.innerHTML = items;
		div.append(ul);
		$(ul).find('a[rel="del"]').click(function() {
			hs_notes = [];
			writeNotePad();
			window.location.reload(false);
			return false;
		}).css("cursor","pointer");
	}
	$(".note").click(function() {
		var r = this.rel;
		var pp = r.split("|");
		if(pp.lenght < 4) return false;
		var hid = pp[3];
		var sid = pp[4];
		var idx = findNote(hid,sid);
		if(idx < 0) {
			hs_notes.push(r);
			
			writeNotePad();
		}
		var what = pp[1];
		alert(what+" wurde zur Merkliste hinzugefügt.");
		//return false;
	});
}
function createCopyrightSection() {
	var images = {};
	var cnt = 0;
	$("#content img").each(function() {
		var cpy = $.trim(this.getAttribute('copyright'));
		if(!cpy) {
			return;
		}
		var blockParent = $(this).parents(".list_block,.news_block");
		var blockID = blockParent.length ? blockParent[0].id : '';

		var headline = $.trim(this.getAttribute('for'));
		var title = $.trim(this.getAttribute('title'));

		if(!headline && !title) return;
		if(!headline) headline = title;

		if(typeof(images[headline])=="undefined") images[headline] = {};
		var sect = images[headline];
		sect[this.src] = {copy:cpy,block:blockID};
		cnt++;
	});
	var html = "";
	if(cnt > 0) {
		for(var title in images) {
			var sect = images[title];
			//html += "<h5>"+title+"</h5>";
			var cc = [];
			var blockID = '';
			for(var src in sect) {
				var cpy_and_block = sect[src];
				cc.push(cpy_and_block.copy);
				if(!blockID) blockID = cpy_and_block.block;
			}
			html += "<span class='copyright_entry "+blockID+"'<span class='work'>"+title+":</span><span class='artists'>"+cc.join(", ")+"</span></span>";
		}
		html = "<div class='copyrights'><h4>Bildnachweis</h4>"+html+"</div>";
		$("#content").append(html);
	}
}
function updateRelatedContent() {
	var wMap = typeof theMap != "undefined";
	var vis_map = {};
	$(".list_block,.news_block").each(function() {
		var vis = this.style.display != "none";
		if(this.id)	$(".copyright_entry."+this.id).toggle(vis);
		if(wMap && this.aid) vis_map[this.aid] = vis ? 1 : 2;
	});
	//ggf. asynch
	if(!wMap || !theMap.markers_count || theMap.markers_count < theMap.locs.length) return;
	//marker filtern
	for(var i=0;i<theMap.locs.length;i++) {
		var loc = theMap.locs[i];
		if(!loc.marker || !loc.aid || !vis_map[loc.aid]) continue;
		if(vis_map[loc.aid] == 1) loc.marker.setVisible(true);
		else loc.marker.setVisible(false);
	}
}

$(document).ready(function() {
	initNotePad();
	createCopyrightSection();
	initContentFilter();
});