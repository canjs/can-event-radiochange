@page can-event-radiochange

# can-event-radiochange

A custom event for listening to changes of inputs with type "radio", which fires when a conflicting radio input changes. A "conflicting" radio button has the same "name" attribute and exists within in the same form, or lack thereof. This event coordinates state bound to whether a radio is checked. The "change" event does not fire for deselected radios. By using this event instead, deselected radios receive notification.
