# can-event-radiochange

[![Build Status](https://travis-ci.org/canjs/can-event-radiochange.svg?branch=master)](https://travis-ci.org/canjs/can-event-radiochange)

A custom event for listening to changes of inputs with type "radio", which fires when a conflicting radio input changes. A "conflicting" radio button has the same "name" attribute and exists within in the same form, or lack thereof. This event coordinates state bound to whether a radio is checked. The "change" event does not fire for deselected radios. By using this event instead, deselected radios receive notification.

## Usage

### ES6 use

With StealJS, you can import this module directly in an auto-rendered template:

```js
import radioChange from 'can-event-radiochange';
import domEvents from 'can-util/dom/events';
domEvents.addCustomEvent(radioChange);
```

### CommonJS use

Use `require` to load `can-event-radiochange` and everything else
needed to create a template that uses `can-event-radiochange`:

```js
var radioChange = require("can-event-radiochange");
var domEvents = require('can-util/dom/events');
domEvents.addCustomEvent(radioChange);
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-event-radiochange/dist/global/can-event-radiochange.js'></script>
```
