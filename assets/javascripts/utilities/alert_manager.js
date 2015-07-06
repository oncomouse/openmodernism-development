define([
	'jquery',
	'underscore',
	'jst',
	'bootstrap/alert'
], function($,_, JST) {
	var AlertManager = {
		show_alert: function(alert) {
			alert = typeof alert === 'String' ? { message: alert } : alert;
			alert = _.defaults(alert, {
				type: 'info',
				message: '',
				target: $('body'),
				timeout: 5000,
				dismissable: true,
				id: null
			});
			if (!alert.target instanceof $) {
				alert.target = $(alert.target);
			}
			while(alert.target.css('display') != 'block') {
				alert.target = alert.target.parent();
			}
			$(JST['alerts/default']({alert: alert}))
							.attr('id', alert.id)
			                .insertBefore(alert.target);
			if(alert.timeout !== null) {
			    window.setTimeout(_.bind(function() {
			        this.clear_alerts();
			    }, this), alert.timeout);
			}
			
		},
		
		clear_alerts: function(options) {
			options = (typeof options !== 'Object') ? {} : options;
			options = _.defaults(options, {
				now: false,
				target: 'body'
			});
			if(options.now) {
				$(options.target).find('.alert.om-alert').remove();
			} else {
		        $(options.target).find('.alert.om-alert').fadeTo(500, 0).slideUp(500, function(){
		            $(this).remove(); 
		        });
			}
		},
		
		clear_alert: function(id, now) {
			if(id[0] !== '#') { id = '#' + id; }
			var $alert = $(id);
			if($alert.length > 0) {
				if(now) {
					$alert.remove();
				} else {
					$alert.fadeTo(500, 0).slideUp(500, function(){
			            $(this).remove(); 
			        });
				}
			}
		}
	}
	
	return AlertManager;
});