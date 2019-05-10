'use strict';

QUnit = require('steal-qunit');
var domEvents = require('can-util/dom/events/');
var domDispatch = require('can-util/dom/dispatch/');

var override = require('./override');

function fixture () {
	return document.getElementById("qunit-fixture");
}

var overrideStrategy = {
	name: 'override()',
	setup: function () {
		this.removeOverride = override.override(domEvents);
	},
	teardown: function () {
		this.removeOverride();
	}
};

function runTests (mod) {
	QUnit.module(mod.name, {
		beforeEach: mod.setup,
		afterEach: mod.teardown
	});

	QUnit.test("subscription to an untracked radio should call listener", function(assert) {
		assert.expect(1);
		var listener = document.createElement('input');
		listener.id = 'listener';
		listener.type = 'radio';
		listener.name = 'myfield';
		domEvents.addEventListener.call(listener, 'radiochange', function handler () {
			assert.ok(true, 'called from other element');
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

	QUnit.test("subscription to a tracked radio should call itself", function(assert) {
		assert.expect(1);
		var radio = document.createElement('input');
		radio.id = 'selfish';
		radio.type = 'radio';
		radio.name = 'anynamejustsothereisaname';
		domEvents.addEventListener.call(radio, 'radiochange', function handler () {
			assert.ok(true, 'called from self');
			domEvents.removeEventListener.call(radio, 'radiochange', handler);
		});

		fixture().appendChild(radio);

		radio.setAttribute('checked', 'checked');
		domDispatch.call(radio, 'change');
	});
}

runTests(overrideStrategy);
