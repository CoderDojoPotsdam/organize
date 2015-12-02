var articlefilter = new Class({
	Implements: Options,
	
	options: {
		formSubmit: false
	},
	
	initialize: function() {
		if(!$('frmArticleFilterCtrl')) return;
		$('frmArticleFilterCtrl').addEvent('submit', function() {
			var objIsAjax = new Element('input', {
				'type': 'hidden',
				'name': 'isAjax',
				'value': '1'
			});
			objIsAjax.inject(this);
			this.set('send', {
				onComplete: function(res) {
				  var response = JSON.decode(res);
				  $('ctrl_afsubmit').value = response.resultCount + ' treffer anzeigen';
				},
			});
			
			this.send();
			objIsAjax.destroy();
		});
		
		$('frmArticleFilterCtrl').getElements('input').each(function(item, index) {
			if(item.type == 'checkbox') this.addCheckboxEvent(item);
			else if(item.type == 'radio') this.addRadioboxEvent(item);
		}.bind(this));
		
		$('frmArticleFilterCtrl').getElements('select').each(function(item, index) {
			if(item.type == 'select') this.addSelectboxEvent(item);
			else if(item.type == 'select-multi') this.addSelectboxEvent(item);
		}.bind(this));
	},
	
	addCheckboxEvent: function(obj) {
		obj.addEvent('change', function() {
			this.updateFilterResults();
		}.bind(this));
	},
	addRadioboxEvent: function(obj) {
		obj.addEvent('change', function() {
			this.updateFilterResults();
		}.bind(this));
	},
	
	addSelectboxEvent: function(obj) {
		obj.addEvent('change', function() {
			this.updateFilterResults();
		}.bind(this));
	},
	
	updateFilterResults: function() {
		$('frmArticleFilterCtrl').fireEvent('submit');
	}
});

articlefilter.implement(new Events, new Options);