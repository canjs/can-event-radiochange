'use strict';

var events = require('can-util/dom/events/events');
var domData = require('can-util/dom/data/data');
var getDocument = require('can-util/dom/document/document');
var domDispatch = require('can-util/dom/dispatch/dispatch');
var CIDMap = require('can-util/js/cid-map/cid-map');

function getRoot () {
	return getDocument().documentElement;
}

function getRegistryName (eventName) {
	return 'can-event-radiochange:' + eventName + ':registry';
}

function getListenerName (eventName) {
	return 'can-event-radiochange:' + eventName + ':listener';
}

function getRegistry (eventName) {
	var root = getRoot();
	var name = getRegistryName(eventName);
	var registry = domData.get.call(root, name);
	if (!registry) {
		registry = new CIDMap();
		domData.set.call(root, name, registry);
	}
	return registry;
}

function findParentForm (el) {
	while (el) {
		if (el.nodeName === 'FORM') {
			break;
		}
		el = el.parentNode;
	}
	return el;
}

function shouldReceiveEventFromRadio (source, dest) {
	// Must have the same name attribute and parent form
	var name = source.getAttribute('name');
	return (
		name &&
		name === dest.getAttribute('name') &&
		findParentForm(source) === findParentForm(dest)
	);
}

function isRadioInput (el) {
	return el.nodeName === 'INPUT' && el.type === 'radio';
}

function dispatch (eventName, target) {
	var registry = getRegistry(eventName);
	var event = {type: eventName};
	registry.forEach(function (el) {
		if (shouldReceiveEventFromRadio(target, el)) {
			domDispatch.call(el, event, [], false);
		}
	});
}

function attachRootListener (eventName) {
	var root = getRoot();
	var listenerName = getListenerName(eventName);
	var listener = domData.get.call(root, listenerName);
	if (listener) {
		return;
	}
	var newListener = function (event) {
		var target = event.target;
		if (isRadioInput(target)) {
			dispatch(eventName, target);
		}
	};
	events.addEventListener.call(root, 'change', newListener);
	domData.set.call(root, listenerName, newListener);
}

function detachRootListener (eventName) {
	var root = getRoot();
	var listenerName = getListenerName(eventName);
	var listener = domData.get.call(root, listenerName);
	if (!listener) {
		return;
	}
	var registry = getRegistry(eventName);
	if (registry.size > 0) {
		return;
	}
	events.removeEventListener.call(root, 'change', listener);
	domData.clean.call(root, listenerName);
}

function addListener (eventName, el) {
	if (!isRadioInput(el)) {
		throw new Error('Listeners for ' + eventName + ' must be radio inputs');
	}
	getRegistry(eventName).set(el, el);
	attachRootListener(eventName);
}

function removeListener (eventName, el) {
	getRegistry(eventName).delete(el);
	detachRootListener(eventName);
}

/**
 * @module {events} can-event-radiochange can-event-radiochange
 * @parent can-infrastructure
 *
 * A custom event for listening to changes of inputs with type "radio",
 * which fires when a conflicting radio input changes. A "conflicting"
 * radio button has the same "name" attribute and exists within in the
 * same form, or lack thereof. This event coordinates state bound to
 * whether a radio is checked. The "change" event does not fire for deselected
 * radios. By using this event instead, deselected radios receive notification.
 *
 * ```js
 * var events = require("can-util/dom/events/events");
 * var radioChange = require("can-util/dom/events/radiochange/radiochange");
 * events.addCustomEvent(radioChange);
 *
 * var el = document.createElement("div");
 *
 * function radiochangeHandler() {
 * 	console.log("radiochange event fired");
 * }
 *
 * events.addEventListener.call(el, "radiochange", radiochangeHandler, false);
 * events.removeEventListener.call(el, "radiochange", radiochangeHandler);
 *
 * events.removeCustomEvent(radioChange);
 * ```
 */
module.exports = {
	eventName: 'radiochange',
	applyEventListener: true,

	addEventListener: function addEventListener (eventName) {
		addListener(eventName, this);
	},

	removeEventListener: function removeEventListener (eventName) {
		removeListener(eventName, this);
	}
};
