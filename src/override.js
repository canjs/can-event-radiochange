var radioChange = require('./can-event-radiochange');

/*
	This module conforms to the current custom event
	overriding behavior which will be replaced by the
	end result of https://github.com/canjs/can-util/issues/249.

	Until then (and for older can-util versions), this
	module is a means on including the radiochange event.
*/

function isDomEvents (obj) {
	return !!(obj && obj.addEventListener && obj.removeEventListener);
}

function override (domEvents) {
	if (!isDomEvents(domEvents)) {
		throw new Error ('override() must be passed domEvents');
	}

	var isOverriding = true;
	var oldAddEventListener = domEvents.addEventListener;
	var addEventListener = domEvents.addEventListener = function (eventName) {
		if (isOverriding && eventName === radioChange.eventName) {
			radioChange.addEventListener.apply(this, arguments);
		}
		return oldAddEventListener.apply(this, arguments);
	};

	var oldRemoveEventListener = domEvents.removeEventListener;
	var removeEventListener = domEvents.removeEventListener = function (eventName) {
		if (isOverriding && eventName === radioChange.eventName) {
			radioChange.removeEventListener.apply(this, arguments);
		}
		return oldRemoveEventListener.apply(this, arguments);
	};

	return function removeOverride () {
		isOverriding = false;
		if (domEvents.addEventListener === addEventListener) {
			domEvents.addEventListener = oldAddEventListener;
		}
		if (domEvents.removeEventListener === removeEventListener) {
			domEvents.removeEventListener = oldRemoveEventListener;
		}
	};
}

module.exports = {
	override: override
};
