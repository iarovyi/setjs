/*! 
 * set.js 1.0.0 (c) 2015 Sergii Iarovyi - MIT license
 */
;(function (definition) {
    if (typeof define === "function" && define.amd) {
        define(definition);
    } else {
        window['set'] = definition();
    }
}(function() {
    
    'use strict';
	
	var w3c = "addEventListener" in document,
		push = Array.prototype.push,
		splice = Array.prototype.splice,
		isReady = false,
		readyHandlers = [],
		docReadyEvent = w3c ? 'DOMContentLoaded' : 'readystatechange';

	function set(selector) {
		return new Set(selector);
	}

	function Set(selector) {
		push.apply(this, typeof (selector) === "string" ? document.querySelectorAll(selector) : [selector]);
	}

	extend(Set.prototype, {
		each: function(func) {
			for (var i = 0; i < this.length; i++) {
				func.call(this, this[i], this);
			}
			return this;
		},
		ready: function (callback) {
			isReady ? setTimeout(callback, 1) : readyHandlers.push(callback);
		},
		on: function (eventName, callback) {
			return this.each(function (elem) {
				w3c ? elem.addEventListener(eventName, callback, false) : elem.attachEvent("on" + eventName, callback);
			});
		},
		off: function (eventName, callback) {
			return this.each(function (elem) {
				w3c ? elem.removeEventListener(eventName, callback, false) : elem.detachEvent("on" + eventName, callback);
			});
		},
		addClass: function (cssClass) {
			var r = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
			return this.each(function (elem) {
				r.test(elem.className) || (elem.className = (elem.className + " " + cssClass).replace(/\s+/g, " ").replace(/(^ | $)/g, ""));
			});
		},
		removeClass: function (cssClass) {
			var r = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
			return this.each(function (elem) {
				elem.className = elem.className.replace(r, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
			});
		},
		append: function (html) {
			return this.each(function (elem) {
				if (typeof(html) === "string") {
					elem.innerHTML += html;
				} else {
					(html instanceof Set ? html : set(html)).each(function(el) {
						elem.appendChild(el);
					});
				}
			});
		},
		remove: function() {
			return this.each(function (el) { el.parentNode && el.parentNode.removeChild(el); });
		},
		splice: function () { splice.apply(this, arguments); },
	});

	if (document.readyState === "complete") {
		setTimeout(triggerReady, 1);
	} else {
		set(document).on(docReadyEvent, onComplete);
		set(window).on('load', onComplete);
	}

	function triggerReady() {
		isReady = true;
		var fn;
		while (fn = readyHandlers.shift()) { setTimeout(fn, 1); }
	}

	function onComplete(e) {
		if (w3c || e.type === "load" || document.readyState === "complete") {
			set(document).off(docReadyEvent, onComplete);
			set(window).off('load', onComplete);
			triggerReady();
		}
	}

	function extend(target, source) {
		for (var i in source) {
			source.hasOwnProperty(i) && (target[i] = source[i]);
		}
	}

    return set;
}));