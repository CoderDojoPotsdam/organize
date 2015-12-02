// Überprüfen, ob jQuery vorhanden ist
if(typeof jQuery === 'function') {
	
	// DOM-ready
	jQuery(document).ready(function() {
		
		// Array für die ClipClap-Accordion-Nummern
		var clipclapAccordions = [];
		
		// Alle ClipClap-Elemente durchgehen
		jQuery('.tx_dscclipclap').each(function(index, item) {
			item = jQuery(item);
			item.find('.tx_dscclipclap_content').find('.tx_dscclipclap_content').removeAttr('style');
			item.find('.tx_dscclipclap_content').find('.tx_dscclipclap_content').removeClass('tx_dscclipclap_content');	
			var clipclapAccordionNumber = item.attr('data-tx_dscclipclap_accordion');
			if(typeof clipclapAccordionNumber === 'undefined' || clipclapAccordionNumber === false)
				clipclapAccordionNumber = -1;
			
			// Erstes Element jedes ClipClap-Accordions einblenden. Wenn die Accordion-Nummer noch nicht im Array ist, füge sie hinzu
			// und Blende das Element ein.
			if(clipclapAccordionNumber > -1 && jQuery.inArray(clipclapAccordionNumber, clipclapAccordions) === -1) {
				clipclapAccordions.push(clipclapAccordionNumber);
				showClipclapItem(item);
			}
			
			// Klick-Event
			item.find('.tx_dscclipclap_header').click(function() {
				var clipclapContent = item.find('.tx_dscclipclap_content');
				
				// Wenn das Element geschlossen ist
				if(!clipclapContent.is(':visible')) {
					
					// Wenn Akkordeon, schließe alle anderen Elemente
					if(clipclapAccordionNumber > -1) {
						jQuery('.tx_dscclipclap[data-tx_dscclipclap_accordion=' + clipclapAccordionNumber + ']').each(function(accordionIndex, accordionItem) {
							hideClipclapItem(jQuery(accordionItem));
						});
					}
					
					// Öffne Element
					showClipclapItem(item);
				}
				
				// Wieder zuklappen
				else if(clipclapAccordionNumber === -1 || tx_dscclipclap_conf.collapseAll) {
					hideClipclapItem(item); 
				}
			});
		});

	});
	
	/**
	 * Öffnet ein ClipClap-Element
	 * 
	 * @param {type} item
	 * @returns void
	 */
	function showClipclapItem(item) {
		var itemContent = item.find('.tx_dscclipclap_content');
		switch(tx_dscclipclap_conf.animationEffect) {
			default:
			case 'slide':
				itemContent.slideDown(tx_dscclipclap_conf.animationSpeed);
				break;
			case 'none':
				itemContent.show();
				break;
			case 'fade':
				itemContent.fadeIn(tx_dscclipclap_conf.animationSpeed);
				break;
		}
		item.removeClass('closed');
		item.addClass('open');
	}
	
	/**
	 * Schließt ein ClipClap-Element
	 * 
	 * @param {type} item
	 * @returns void
	 */
	function hideClipclapItem(item) {
		var itemContent = item.find('.tx_dscclipclap_content');
		switch(tx_dscclipclap_conf['animationEffect']) {
			default:
			case 'slide':
				itemContent.slideUp(tx_dscclipclap_conf['animationSpeed']);
				break;
			case 'fade':
			case 'none':
				itemContent.hide();
				break;
		}
		item.removeClass('open');
		item.addClass('closed');
	}
	
}
else {
	alert(noJQueryMessage);
}