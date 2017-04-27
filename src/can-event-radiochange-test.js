'use strict';

var radioChange = require('./can-event-radiochange');
var domEvents = require('can-util/dom/events/');
var domDispatch = require('can-util/dom/dispatch/');

function fixture () {
	return document.getElementById("qunit-fixture");
}

var oldAddEventListener = domEvents.addEventListener;
var oldRemoveEventListener = domEvents.removeEventListener;

QUnit = require('steal-qunit');
QUnit.module('can-event-radiochange', {
	setup: function () {
		domEvents.addEventListener = function (eventName) {
			if (eventName === radioChange.eventName) {
				radioChange.addEventListener.apply(this, arguments);
				if (!radioChange.applyEventListener) {
					return;
				}
			}
			return oldAddEventListener.apply(this, arguments);
		};
		domEvents.removeEventListener = function (eventName) {
			if (eventName === radioChange.eventName) {
				radioChange.removeEventListener.apply(this, arguments);
				if (!radioChange.applyEventListener) {
					return;
				}
			}
			return oldRemoveEventListener.apply(this, arguments);
		};
		// domEvents.addCustomEvent(radioChange);
	},
	teardown: function () {
		domEvents.addEventListener = oldAddEventListener;
		domEvents.removeEventListener = oldRemoveEventListener;
		// domEvents.removeCustomEvent(radioChange);
	}
});

test("subscription to an untracked radio should call listener", function () {
	expect(1);
	var listener = document.createElement('input');
	listener.id = 'listener';
	listener.type = 'radio';
	listener.name = 'myfield';
	domEvents.addEventListener.call(listener, 'radiochange', function handler () {
		ok(true, 'called from other element');
		domEvents.removeEventListener.call(listener, 'radiochange', handler);
	});

	var radio = document.createElement('input');
	radio.id = 'radio';
	radio.type = 'radio';
	radio.name = 'myfield';

	fixture().appendChild(listener);
	fixture().appendChild(radio);

	radio.setAttribute('checked', 'checked');
	domDispatch.call(radio, 'change');
});

test("subscription to a tracked radio should call itself", function () {
	expect(1);
	var radio = document.createElement('input');
	radio.id = 'selfish';
	radio.type = 'radio';
	radio.name = 'anynamejustsothereisaname';
	domEvents.addEventListener.call(radio, 'radiochange', function handler () {
		ok(true, 'called from self');
		domEvents.removeEventListener.call(radio, 'radiochange', handler);
	});

	fixture().appendChild(radio);

	radio.setAttribute('checked', 'checked');
	domDispatch.call(radio, 'change');
});
