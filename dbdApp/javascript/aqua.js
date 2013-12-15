//@import jquery-1.7.2.js;
//@import jquery.ext.js;
//@import jquery.global.js;
//@import jquery.role.js;
//@import history.js;
//@import history.adapter.jquery.js;
//@import xregexp.js;
//@import handlebars.js;
//@import bourbon.js;
//@import bootstrap.js;
//@import bootstrapSwitch.js;
//@import pusher.min.js;
//@import highcharts.src.js;
//@import highcharts.theme.dark.js;
//@import models.js;
//@import views.js;
//@import controllers.js;


bRouter.routes = {
	'^/$': 'homeController',
	'^/timers/?$': 'timersController',
	'^/timers/new$': 'timersCreateController',
	'^/timers/(?<id>[0-9]+)/?$': 'timersInstanceController',
	'^/alerts/?$': 'alertsController',
	'^/alerts/new$': 'alertsCreateController',
	'^/alerts/(?<id>[0-9]+)/?$': 'alertsInstanceController',
	'^/charts/?': 'chartsController',
	'^/power/?$': 'powerController'
};

var aqua = {
	intervalTime: 1000,
	pusherKey: '562d02c947852152616a',
	pusherChannel: 'aqua',
	pusherEvent: 'event',
	highchartsColors: [
		'#3a87ad'
	],
	power: function (status) {
		$this.power = (status == 'on');
		if ($('#powerButtons').length) {
			bView.update('powerButtons');
		}
		if ($('.timersRow').length && !$('.timersRow').is('.editing')) {
			bView.update('timersRow');
		}
		if ($('#dashboard').length) {
			hyTimers.all(0, 1).done(function (data) {
				var timer = false;
				if (data.timers.length > 0) {
					timer = data.timers[0];
				}
				bView.update('dashboard', {'timer': timer}, true);
			});
		}
	},
	light: function (light) {
		if ($('#dashboard').length) {
			bView.update('dashboard', {'light': light / 1000}, true);
		}
	},
	liquid: function (level) {
		if ($('#dashboard').length) {
			bView.update('dashboard', {'level': level / 500}, true);
		}
	},
	handleEvents: function (event, data) {
		$.log(event + ': ' + data);
		switch (event) {
			case 'power':
				aqua.power(data);
				break;
			case 'light':
				aqua.light(data);
				break;
			case 'liquid':
				aqua.liquid(data);
				break;
		}
	},
	startEventSocket: function () {
		var pusher = new Pusher(aqua.pusherKey);
		var channel = pusher.subscribe(aqua.pusherChannel);
		channel.bind(aqua.pusherEvent, function(payload) {
			aqua.handleEvents(payload.event, payload.data);
		});
	},
	timeToSeconds: function (time) {
		var parts = time.split(':');
		return (parseInt(parts[1]) + (parseInt(parts[0]) * 60)) * 60;
	}
};

Handlebars.registerHelper('power', function (options){
	if ($this.power) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper('timeUntil', function (time){
	var seconds = aqua.timeToSeconds(time);
	var date = new Date();
	var now = (((date.getHours() * 60) + date.getMinutes()) * 60) + date.getSeconds();
	if (seconds < now) {
		seconds += 86400;
	}
	return $.timeLength(seconds - now, true, true);
});

Handlebars.registerHelper('timeDiff', function (start, stop){
	return $.timeLength(aqua.timeToSeconds(stop) - aqua.timeToSeconds(start), true, true);
});

Handlebars.registerHelper('alertTypeIcon', function (type, options){
	switch (type) {
		case '1': //sms
			return 'comment';
		case '2': //call
			return 'phone';
		case '3': //twitter
			return 'twitter';
		case '4': //webhook
			return 'link';
		case '5': //notifyr
			return 'bolt';
		case '6': //pusher
			return 'cloud';
		case '7': //email
			return 'envelope';
		case '8': //splunk
			return 'terminal';
		default:
			return 'question';
	}
});

Handlebars.registerHelper('alertTypeOptions', function (type, options){
	var html = '';
	html += '<option value="1"' + (type == '1' ? ' selected="selected"' : '') + '>SMS</option>';
	html += '<option value="2"' + (type == '2' ? ' selected="selected"' : '') + '>Call</option>';
	html += '<option value="3"' + (type == '3' ? ' selected="selected"' : '') + '>Twitter</option>';
	html += '<option value="4"' + (type == '4' ? ' selected="selected"' : '') + '>Webhook</option>';
	html += '<option value="5"' + (type == '5' ? ' selected="selected"' : '') + '>Notifyr</option>';
	html += '<option value="6"' + (type == '6' ? ' selected="selected"' : '') + '>Pusher</option>';
	html += '<option value="7"' + (type == '7' ? ' selected="selected"' : '') + '>Email</option>';
	html += '<option value="8"' + (type == '8' ? ' selected="selected"' : '') + '>Splunk</option>';
	return html;
});

Handlebars.registerHelper('triggerTypeIcon', function (type, options){
	switch (type) {
		case '1': //data = value
			return 'data = value';
		case '2': //data != value
			return 'data != value';
		case '3': //data > value
			return 'data > value';
		case '4': //data < value
			return 'data < value';
		default:
			return 'event';
	}
});

Handlebars.registerHelper('triggerTypeOptions', function (type, options){
	var html = '';
	html += '<option value="0"' + (type == '0' ? ' selected="selected"' : '') + '>Event</option>';
	html += '<option value="1"' + (type == '1' ? ' selected="selected"' : '') + '>Data == Value</option>';
	html += '<option value="2"' + (type == '2' ? ' selected="selected"' : '') + '>Data != Value</option>';
	html += '<option value="3"' + (type == '3' ? ' selected="selected"' : '') + '>Data > Value</option>';
	html += '<option value="4"' + (type == '4' ? ' selected="selected"' : '') + '>Data < Value</option>';
	return html;
});

$(function (){
	$(window).bind('statechange', function (e){
		bourbon.run(e);
	}).trigger('statechange');
});