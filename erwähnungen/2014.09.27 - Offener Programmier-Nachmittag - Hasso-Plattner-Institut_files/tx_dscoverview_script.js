/*
 * Dieses Programm einschließlich Programmdaten und Dokumentation unterliegt den ausschließlichen Rechten von "die_schnittsteller",
 * soweit nicht anders gekennzeichnet. Insbesondere jede Vervielfältigung, Verbreitung oder Zugänglichmachung dieses Programms oder
 * Teilen davon sowie die Unterlizenzierung oder Weitergabe bedarf der vorherigen Zustimmung von der "die schnittsteller GmbH" (Lizenz). Unzulässig
 * sind die Bearbeitung oder andere Umarbeitungen des Programms ohne Zustimmung der "die schnittsteller GmbH". Unberührt bleiben die
 * Rechte nach §§ 69 d) Abs. 2 und 3 sowie e) UrhG. Die Entfernung dieses Rechtehinweises ist untersagt.
 * 
 */

var lazyLoadInProgress = false;

/**
 * 
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function submitForm(targetPluginId) {
	var targetCon = jQuery('#tx_dscoverview_' + targetPluginId);
	var listForm = targetCon.find('.tx_dscoverview_filterForm');
	var filterForm = jQuery('#tx_dscoverview_filterForm_' + targetPluginId);
	var requestParameters = jQuery.merge(filterForm.serializeArray(), listForm.serializeArray());
	showAjaxLoader(targetCon);
	console.info(requestParameters);
	jQuery.post(ajaxRequestUrl, requestParameters, function(response) {
		returnAjaxCall(response, targetCon);
	});
}

/**
 * 
 * @param {type} response
 * @param {type} targetCon
 * @returns {undefined}
 */
//function returnAjaxCall(response, targetCon) {
//	targetCon.hide();
//	targetCon.html(response);
//	hideAjaxLoader();
//}

/**
 * 
 * @param {type} el
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function setLimitItemsOffset(el, targetPluginId) {
	//2015-06-04 DSC-EF: Ticket #14323
	if(history.state===null)history.replaceState({page: [jQuery('#tx_dscoverview_'+targetPluginId+' .tx_dscoverview_pbLink.page.current').data().value,targetPluginId]}, '', window.location.href);
	history.pushState({page: [el.data().value,targetPluginId]}, '', window.location.href);
	//
	el = jQuery(el);
	if(el.hasClass('active')) {
		var parentOverview = el.closest('.tx_dscoverview');
		parentOverview.find('.tx_dscoverview_pbLink.page').removeClass('current');
		parentOverview.find('.tx_dscoverview_limitItemsOffset').val(el.attr('data-value'));
		el.addClass('current');
		submitForm(targetPluginId);
	}
}

//2015-06-04 DSC-EF: Ticket #14323
function getPageFromHistory(){
	if(history.state!==null && history.state.hasOwnProperty('page')){
		jQuery('#tx_dscoverview_'+history.state.page[1]+' .tx_dscoverview_limitItemsOffset').val(history.state.page[0]);
		submitForm(history.state.page[1]);
	}
}
window.addEventListener('popstate', getPageFromHistory);
window.addEventListener('DOMContentLoaded', getPageFromHistory);
//

/**
 * 
 * @param {type} el
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function setLimitItemsLength(el, targetPluginId) {
	el = jQuery(el);
	var parentOverview = el.closest('.tx_dscoverview');
	parentOverview.find('.tx_dscoverview_pbLink.amount').removeClass('current');
	el.addClass('current');
	parentOverview.find('.tx_dscoverview_limitItemsLength').val(el.attr('data-value'));
	submitForm(targetPluginId);
}

/**
 * 
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function initLazyLoad(targetPluginId) {
	var targetCon = jQuery('#tx_dscoverview_' + targetPluginId);
	targetCon.find('.tx_dscoverview_lazyLoad').val(1);
	targetCon.find('.tx_dscoverview_lazyLoadOffset').val(0);
	targetCon.find('.tx_dscoverview_lazyLoadInProgress').val(0);
	jQuery(window).scroll(function() {
		if(jQuery(window).scrollTop() + jQuery(window).height() >= jQuery(document).height() && !lazyLoadInProgress && targetCon.find('.tx_dscoverview_lazyLoad').val() == '1') {
			lazyLoadItems(targetPluginId);
		}
	});
	if(jQuery(document).height() <= jQuery(window).height() && !lazyLoadInProgress && targetCon.find('.tx_dscoverview_lazyLoad').val() == '1')
		lazyLoadItems(targetPluginId);
}

/**
 * 
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function lazyLoadItems(targetPluginId) {
	lazyLoadInProgress = true;
	var targetCon = jQuery('#tx_dscoverview_' + targetPluginId);
	var lazyLoader = jQuery('<div class="lazyLoader"></div>');
	targetCon.find('.tx_dscoverview_items').append(lazyLoader);
	targetCon.find('.tx_dscoverview_lazyLoadOffset').val(parseInt(targetCon.find('.tx_dscoverview_lazyLoadOffset').val()) + 1);
	targetCon.find('.tx_dscoverview_lazyLoadInProgress').val(1);
	jQuery('#debugDiv').html(targetCon.find('.tx_dscoverview_lazyLoadOffset').val());
	var listForm = targetCon.find('.tx_dscoverview_filterForm');
	var filterForm = jQuery('#tx_dscoverview_filterForm_' + targetPluginId);
	var requestParameters = jQuery.merge(listForm.serializeArray(), filterForm.serializeArray());
	showAjaxLoader(lazyLoader);
	jQuery.post(ajaxRequestUrl, requestParameters, function(response) {
		returnLazyLoadCall(response, targetCon);
		targetCon.find('.tx_dscoverview_item').removeClass('last');
		targetCon.find('.tx_dscoverview_item').last().addClass('last');
		targetCon.find('.tx_dscoverview_lazyLoadInProgress').val(0);
		hideAjaxLoader();
		jQuery('.lazyLoader').remove();
		lazyLoadInProgress = false;
	});
}

/**
 * 
 * @param {type} targetPluginId
 * @returns {undefined}
 */
function setEndOfLazyLoad(targetPluginId) {
	var targetCon = jQuery('#tx_dscoverview_' + targetPluginId);
	targetCon.find('.tx_dscoverview_lazyLoad').val('0');
}

/**
 * 
 * @param {type} el
 * @returns {undefined}
 */
function showAjaxLoader(el) {
	hideAjaxLoader();
	var ajaxLoader = jQuery('<div class="ajaxLoader"></div>');
	ajaxLoader.appendTo('body');
	el = jQuery(el);
	if(el !== null) {
		var sourcePosition = el.offset();
		ajaxLoader.css({
			top: sourcePosition.top + 'px',
			left: sourcePosition.left + 'px',
			width: el.outerWidth() + 'px',
			height: el.outerHeight() + 'px',
			display: 'block'
		});
	}
}

/**
 * 
 * @returns {undefined}
 */
function hideAjaxLoader() {
	if(jQuery('.ajaxLoader').length > 0) jQuery('.ajaxLoader').remove();
}