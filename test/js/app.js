// Add a getElementsByClassName function if the browser doesn't have one
// Limitation: only works with one class name
// Copyright: Eike Send http://eike.se/nd
// License: MIT License

if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(search) {
        var d = document, elements, pattern, i, results = [];
        if (d.querySelectorAll) { // IE8
            return d.querySelectorAll("." + search);
        }
        if (d.evaluate) { // IE6, IE7
            pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
            elements = d.evaluate(pattern, d, null, 0, null);
            while ((i = elements.iterateNext())) {
                results.push(i);
            }
        } else {
            elements = d.getElementsByTagName("*");
            pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
            for (i = 0; i < elements.length; i++) {
                if ( pattern.test(elements[i].className) ) {
                    results.push(elements[i]);
                }
            }
        }
        return results;
    };
}

// Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
if(!("previousElementSibling" in document.documentElement)){
    Object.defineProperty(Element.prototype, "previousElementSibling", {
        get: function(){
            var e = this.previousSibling;
            while(e && 1 !== e.nodeType)
                e = e.previousSibling;
            return e;
        }
    });
}

(function () {

    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this.el = el;
        // The className needs to be trimmed and split on whitespace
        // to retrieve a list of classes.
        var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
        }
    }

    DOMTokenList.prototype = {
        add: function(token) {
            if(this.contains(token)) return;
            push.call(this, token);
            this.el.className = this.toString();
        },
        contains: function(token) {
            return this.el.className.indexOf(token) != -1;
        },
        item: function(index) {
            return this[index] || null;
        },
        remove: function(token) {
            if (!this.contains(token)) return;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == token) break;
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
        },
        toString: function() {
            return join.call(this, ' ');
        },
        toggle: function(token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter (obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop,{
                get : getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });

})();

(function() {
    ExtL = ExtL || {};

    var matchesSelector = (function () {
        var el = document.documentElement,
            w3 = 'matches',
            wk = 'webkitMatchesSelector',
            ms = 'msMatchesSelector',
            mz = 'mozMatchesSelector';

        return el[w3] ? w3 : el[wk] ? wk : el[ms] ? ms : el[mz] ? mz : null;
    })();

    // cache of document elements
    var els = {};
    var arrayPrototype = Array.prototype;
    var supportsIndexOf = 'indexOf' in arrayPrototype;

    /**
     * Checks if the specified CSS class exists on this element's DOM node.
     * @param {Element} el The element to check
     * @param (String) cls The CSS to check for
     */
    ExtL.hasCls = function(el, cls) {
        return !!( el && el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')));
    };

    /**
     * Adds a CSS class to the top level element representing this component.
     * @param {Element} el The target element to add the class to
     * @param (String) cls The CSS to add
     */
    ExtL.addCls = function(el, cls) {
        this.toggleCls(el, cls, true);
    };

    /**
     * Removes a CSS class from the top level element representing this component.
     * @param {Element} el The target element to remove the class from
     * @param (String) cls The CSS to remove
     */
    ExtL.removeCls = function(el, cls) {
        this.toggleCls(el, cls, false);
    };

    /**
     * Toggles the specified CSS class on this element (removes it if it already exists,
     * otherwise adds it).
     * @param {Element/String} el The target element to toggle the class on.  May also be
     * the id of the target element
     * @param (String) cls The CSS to toggle
     * #param {Boolean} state (optional) If specified as true, causes the class to be
     * added. If specified as false, causes the class to be removed.
     */
    ExtL.toggleCls = function(el, cls, state) {
        var reg;

        if (ExtL.isString(el)) {
            el = ExtL.get(el);
        }

        if (this.isEmpty(state)) {
            state = !this.hasCls(el, cls);
        } else {
            state = !!state;
        }

        if (state == true) {
            if (!this.hasCls(el, cls)) {
                //el.className += ' ' + cls.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                el.className += ' ' + this.trim(cls);
                el.className = ExtL.trim(el.className).replace(/  +/g, ' ');
            }
        } else {
            if (ExtL.hasCls(el, cls)) {
                //reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                reg = new RegExp(cls + '(?:\\s|$)');
                el.className = el.className.replace(reg, '');
            }
        }
    };

    /**
     *
     */
    ExtL.canLocalStorage = function() {
        var ls = ExtL.hasLocalStorage,
            uid = new Date,
            result;

        try {
            localStorage.setItem(uid, uid);
            result = localStorage.getItem(uid) == uid;
            localStorage.removeItem(uid);
            ls = ExtL.hasLocalStorage = result && localStorage;
        } catch (exception) {}

        return !!ls;
    };

    /**
     * Returns true if the passed value is empty, false otherwise. The value is deemed to
     * be empty if it is either:
     *
     *  - null
     *  - undefined
     *  - a zero-length array
     *  - a zero-length string (Unless the allowEmptyString parameter is set to true)
     *
     * @return {Boolean}
     */
    ExtL.isEmpty = function(value, allowEmptyString) {
        return (value == null) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0);
    };

    /**
     * Return an element by id
     * @return {Element} The element with the passed id.
     */
    ExtL.get = function (id) {
        return els[id] || (els[id] = document.getElementById(id));
    };

    /**
     * Returns true if the passed value is a JavaScript Date object, false otherwise.
     * @param {Object} value The object to test.
     * @return {Boolean}
     */
    ExtL.isDate = function(value) {
        return Object.prototype.toString.call(value) === '[object Date]';
    };

    /**
     * Returns true if the passed value is a JavaScript Array, false otherwise.
     * @param {Object} value The target to test.
     * @return {Boolean}
     */
    ExtL.isArray = ('isArray' in Array) ? Array.isArray : function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    /**
     * Validates that a value is numeric.
     * @param {Object} value Examples: 1, '1', '2.34'
     * @return {Boolean} True if numeric, false otherwise
     */
    ExtL.isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    /**
     * Returns true if the passed value is a JavaScript Object, false otherwise.
     * @param {Object} value The value to test.
     * @return {Boolean}
     */
    ExtL.isObject = (Object.prototype.toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && Object.prototype.toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        };

    /**
     * Returns true if the passed value is a string.
     * @param {Object} value The value to test.
     * @return {Boolean}
     */
    ExtL.isString = function(value) {
        return typeof value === 'string';
    };

    /**
     * @method
     * Get the index of the provided `item` in the given `array`, a supplement for the
     * missing arrayPrototype.indexOf in Internet Explorer.
     *
     * @param {Array} array The array to check.
     * @param {Object} item The item to find.
     * @param {Number} from (Optional) The index at which to begin the search.
     * @return {Number} The index of item in the array (or -1 if it is not found).
     */
    ExtL.indexOf = supportsIndexOf ? function(array, item, from) {
        return arrayPrototype.indexOf.call(array, item, from);
     } : function(array, item, from) {
        var i, length = array.length;

        for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    };

    ExtL.bindReady = function (handler){
        var called = false,
            isFrame;

        function ready() {
            if (called)
                return;
            called = true;
            handler();
        }

        if ( document.addEventListener ) { // native event
            document.addEventListener( "DOMContentLoaded", ready, false );
        } else if ( document.attachEvent ) {  // IE

            try {
                isFrame = window.frameElement != null;
            } catch(e) {}

            // IE, the document is not inside a frame
            if (document.documentElement.doScroll && !isFrame ) {
                function tryScroll(){
                    if (called) 
                        return;
                    try {
                        document.documentElement.doScroll("left");
                        ready();
                    } catch(e) {
                        setTimeout(tryScroll, 10);
                    }
                }
                tryScroll();
            }

            // IE, the document is inside a frame
            document.attachEvent("onreadystatechange", function(){
                if ( document.readyState === "complete" ) {
                    ready();
                }
            });
        }

        // Old browsers
        ExtL.on(window, 'load', ready);
    };

    /**
     *
     */
    ExtL.monitorMouseLeave = function (el, delay, handler, scope) {
        var timer;

        ExtL.on(el, 'mouseleave', function (e) {
            e = e || window.event;
            var obj = {
                target : e.target || e.srcElement
            };
            timer = setTimeout(function () {
                handler.call(scope || ExtL, obj);
            }, delay);
        });

        ExtL.on(el, 'mouseenter', function () {
            clearTimeout(timer);
        });
    };

    /**
     *
     */
    ExtL.monitorMouseEnter = function (el, delay, handler, scope) {
        var timer;

        ExtL.on(el, 'mouseenter', function (e) {
            e = e || window.event;
            var obj = {
                target : e.target || e.srcElement
            };
            timer = setTimeout(function () {
                handler.call(scope || ExtL, obj);
            }, delay);
        });
        ExtL.on(el, 'mouseleave', function () {
            clearTimeout(timer);
        });
    };

    ExtL.on = function (el, event, handler) {
        if (el.addEventListener) {
            el.addEventListener(event, handler);
        } else if (el.attachEvent)  {
            el.attachEvent('on' + event, handler);
        }

        return el;
    };

    /**
     *
     */
    ExtL.un = function (el, event, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(event, handler, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + event, handler);
        } else {
            el["on" + event] = null;
        }

        return el;
    }

    /**
     *
     */
    ExtL.getWidth = function (el) {
        var box = el.getBoundingClientRect();

        return box.right - box.left;
    }

    /**
     *
     */
    ExtL.getHeight = function (el) {
        var box = el.getBoundingClientRect();

        return box.bottom - box.top;
    }

    /**
     *
     */
    ExtL.getSize = function (el) {
        return {
            width: ExtL.getWidth(el),
            height: ExtL.getHeight(el)
        };
    }

    /**
     * @param {Element} el The element to apply the styles to
     * @param {String/Object} The styles to apply to the element.  This can be a string
     * to append to the element's style attribute directly or an object of style key /
     * value pairs.
     */
    ExtL.applyStyles = function (el, styles) {
        var style;

        if (ExtL.isObject(styles)) {
            ExtL.each(styles, function (key, val) {
                el.style[key] = val;
            });
        } else {
            style = el.getAttribute('style') || '';
            el.setAttribute('style', style + styles);
        }
    };

    /**
     * Converts a query string back into an object.
     *
     * Non-recursive:
     *
     *     Ext.Object.fromQueryString("foo=1&bar=2"); // returns {foo: '1', bar: '2'}
     *     Ext.Object.fromQueryString("foo=&bar=2"); // returns {foo: '', bar: '2'}
     *     Ext.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
     *     Ext.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
     *
     * Recursive:
     *
     *     Ext.Object.fromQueryString(
     *         "username=Jacky&"+
     *         "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
     *         "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
     *         "hobbies[3][0]=nested&hobbies[3][1]=stuff", true);
     *
     *     // returns
     *     {
     *         username: 'Jacky',
     *         dateOfBirth: {
     *             day: '1',
     *             month: '2',
     *             year: '1911'
     *         },
     *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
     *     }
     *
     * @param {String} queryString The query string to decode
     * @param {Boolean} [recursive=false] Whether or not to recursively decode the string. This format is supported by
     * PHP / Ruby on Rails servers and similar.
     * @return {Object}
     */
    ExtL.fromQueryString = function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            plusRe = /\+/g,
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = components[0];
                name = name.replace(plusRe, '%20');
                name = decodeURIComponent(name);

                value = components[1];
                if (value !== undefined) {
                    value = value.replace(plusRe, '%20');
                    value = decodeURIComponent(value);
                } else {
                    value = '';
                }

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!ExtL.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(keyRe);
                    matchedName = name.match(nameRe);

                    //<debug>
                    if (!matchedName) {
                        throw new Error('[Ext.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                    }
                    //</debug>

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (ExtL.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    };

    /**
     * Returns `true` if the passed value is a boolean.
     *
     * @param {Object} value The value to test.
     * @return {Boolean}
     */
    ExtL.isBoolean = function(value) {
        return typeof value === 'boolean';
    };


    /**
     *
     */
    ExtL.fromNodeList = function (nodelist) {
        var len = nodelist.length,
            i = 0,
            arr = [];

        for (; i < len; i++) {
            arr.push(nodelist.item(i));
        }

        return arr;
    };

    ExtL.encodeValue = function(value){
        var flat = '',
            i = 0,
            enc, len, key;

        if (value == null) {
            return 'e:1';
        } else if(typeof value === 'number') {
            enc = 'n:' + value;
        } else if(typeof value === 'boolean') {
            enc = 'b:' + (value ? '1' : '0');
        } else if(ExtL.isDate(value)) {
            enc = 'd:' + value.toUTCString();
        } else if(ExtL.isArray(value)) {
            for (len = value.length; i < len; i++) {
                flat += ExtL.encodeValue(value[i]);
                if (i !== len - 1) {
                    flat += '^';
                }
            }
            enc = 'a:' + flat;
        } else if (typeof value === 'object') {
            for (key in value) {
                if (typeof value[key] !== 'function' && value[key] !== undefined) {
                    flat += key + '=' + ExtL.encodeValue(value[key]) + '^';
                }
            }
            enc = 'o:' + flat.substring(0, flat.length-1);
        } else {
            enc = 's:' + value;
        }
        return escape(enc);
    };

    ExtL.decodeValue = function(value){

        // a -> Array
        // n -> Number
        // d -> Date
        // b -> Boolean
        // s -> String
        // o -> Object
        // -> Empty (null)

        var re = /^(a|n|d|b|s|o|e)\:(.*)$/,
            matches = re.exec(unescape(value)),
            all, type, keyValue, values, vLen, v;

        if (!matches || !matches[1]) {
            return; // non state
        }

        type = matches[1];
        value = matches[2];
        switch (type) {
            case 'e':
                return null;
            case 'n':
                return parseFloat(value);
            case 'd':
                return new Date(Date.parse(value));
            case 'b':
                return (value === '1');
            case 'a':
                all = [];
                if (value) {
                    values = value.split('^');
                    vLen   = values.length;

                    for (v = 0; v < vLen; v++) {
                        value = values[v];
                        all.push(ExtL.decodeValue(value));
                    }
                }
                return all;
           case 'o':
                all = {};
                if (value) {
                    values = value.split('^');
                    vLen   = values.length;

                    for (v = 0; v < vLen; v++) {
                        value = values[v];
                        keyValue         = value.split('=');
                        all[keyValue[0]] = ExtL.decodeValue(keyValue[1]);
                    }
                }
                return all;
           default:
                return value;
        }
    };

    /**
     *
     */
    ExtL.capitalize = function (text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    };

    /**
     * @private
     * Helper method for the up method
     */
    ExtL.collectionHas = function(a, b) { //helper function for up()
        for(var i = 0, len = a.length; i < len; i ++) {
            if(a[i] == b) return true;
        }
        return false;
    };

    /**
     * Finds the parent node matching the passed selector
     */
    ExtL.up = function (el, selector) {
        /*var all = document.querySelectorAll(selector),
            cur = el.parentNode;

        while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
            cur = cur.parentNode; //go up
        }
        return cur; //will return null if not found*/
        var target = el.parentNode || null;

        while (target && target.nodeType === 1) {
            if (ExtL.is(target, selector)) {
                return target;
            }
            target = target.parentNode;
        }

        //return target;
        return false;
    };

    ExtL.is = function (el, selector) {
        if (matchesSelector) {
            return el[matchesSelector](selector);
        } else {
            return (function () {
                // http://tanalin.com/en/blog/2012/12/matches-selector-ie8/
                var elems = el.parentNode.querySelectorAll(selector),
                    count = elems.length;

                for (var i = 0; i < count; i++) {
                    if (elems[i] === el) {
                        return true;
                    }
                }
                return false;
            })();
        }
    };

    ExtL.createBuffered = function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    };

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     * @param {String} string The string to trim.
     * @return {String} The trimmed string.
     */
    ExtL.trim = function (str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };

    /**
     * Converts a value to an array if it's not already an array; returns an the param
     * wrapped as an array (or the array itself if it's an already an array)
     * @return {Array}
     */
    ExtL.from = function (obj) {
        return ExtL.isArray(obj) ? obj : [obj];
    };

    /**
     *
     */
    ExtL.isIE8 = function () {
        return typeof XDomainRequest !== "undefined";
    }

    /**
     *
     */
    ExtL.isIE9 = function () {
        return (typeof XDomainRequest !== "undefined" && typeof window.msPerformance !== "undefined");
    }

    /**
     * Creates a DOM element
     * @param {String} tag The tag type to create
     * @param {Array} attributes (optional) An array of attributes to set on the element
     * @param {String} text (optional) Text to insert in the element
     * @param {Array} cn (optional) Array, or array of
     * [tag, attributes, text, children] to append to the element
     * @param {Boolean} insertBefore True to insert child elements prior to inserting text
     * @return {Element} The created element
     */
    ExtL.createElement = function (cfg) {
        var tag = cfg.tag || 'div',
            html = cfg.html,
            children = cfg.cn,
            insertBefore = cfg.insertBefore,
            el = document.createElement(tag),
            textNode;

        delete cfg.tag;
        delete cfg.html;
        delete cfg.cn;
        delete cfg.insertBefore;

        /*if (attributes) {
            ExtL.each(attributes, function (key, val) {
                el.setAttribute(key, val);
            });
        }*/

        ExtL.each(cfg, function (key, val) {
            el.setAttribute(key, val);
        });

        if (html && !insertBefore) {
            textNode = document.createTextNode(html);
            el.appendChild(textNode);
        }

        if (children) {
            children = ExtL.from(children);
            ExtL.each(children, function (child) {
                el.appendChild(ExtL.createElement(child));
            });
        }

        if (html && insertBefore) {
            textNode = document.createTextNode(html);
            el.appendChild(textNode);
        }

        return el;
    };

    /**
     *
     */
    ExtL.removeChildNodes = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };

    /**
     * Convenience array / object looping function
     * @param {Object/Array} object The object or array to loop through
     * @param {Function} fn Callback function to call on each array item / object key.
     * The callback is passed the following params:
     *
     *  - array: array item, index, the original array
     *  - object: object key, object value, original object
     *
     * @param {Object} scope (optional) The scope (this reference) in which the specified
     * function is executed.
     */
    ExtL.each = function (object, fn, scope) {
        if (ExtL.isEmpty(object)) {
            return;
        }

        if (scope === undefined) {
            scope = object;
        }

        if (ExtL.isArray(object)) {
            ExtL.arrEach.call(ExtL, object, fn, scope);
        }
        else {
            ExtL.objEach.call(ExtL, object, fn, scope);
        }
    };

    /**
     * Replaces curly-bracket-wrapped tokens or object keys in a string with either n
     * number of arguments or the values from an object.  Format may be used in the
     * following ways:
     * 1)  Allows you to define a tokenized string and pass an arbitrary number of
     * arguments to replace the tokens. Each token must be unique, and must increment in
     * the format {0}, {1}, etc. Example usage:
     *
     *     var cls = 'my-class',
     *         text = 'Some text';
     *     var s = Ext.String.format('<div class="{0}">{1}</div>', cls, text);
     *     alert(s); // '<div class="my-class">Some text</div>'
     *
     * 2) Allows you to define a parameterized string and pass in an key/value hash to
     * replace the parameters.  Example usage:
     *
     *     var obj = {
     *         cls: 'my-class',
     *         text: 'Some text'
     *     };
     *     var s = Ext.String.format('<div class="{cls}">{text}</div>', obj);
     *     alert(s); // '<div class="my-class">Some text</div>'
     *
     * @param {String} string The tokenized string to be formatted.
     * @param {String.../Object} values First param value to replace token `{0}`, then
     * next param to replace `{1}` etc.  May also be an object of key / value pairs to
     * replace `{key}` instance in the passed string with the paired key's value.
     * @return {String} The formatted string.
     */
    ExtL.format = function () {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)),
            string = args.shift(),
            len = args.length,
            i = 0,
            key, val, prop;

        if (Object.prototype.toString.call(args[0]) === '[object Object]') {
            for (key in args[0]) {
                if (!args[0].hasOwnProperty(key)) continue;

                val = args[0][key];
                string = string.replace(new RegExp("\\{" + key + "\\}", "g"), val);
            }
        } else {
            for (; i < len; i++) {
                string = string.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
            }
        }

        return string;
    };

    /**
     * Iterates an array invokes the given callback function for each item.
     * @param {Array} object The object or array to loop through
     * @param {Function} fn Callback function to call on each array item / object key.
     * The callback is passed the following params:
     *
     *  - array: array item, index, the original array
     *
     * @param {Object} scope (optional) The scope (this reference) in which the specified
     * function is executed.
     * @param {Boolean} reverse (optional) Reverse the iteration order (loop from the end
     * to the beginning).
     */
    ExtL.arrEach = function (array, fn, scope, reverse) {
        array = ExtL.from(array);

        var i,
            ln = array.length;

        if (reverse !== true) {
            for (i = 0; i < ln; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                }
            }
        }
        else {
            for (i = ln - 1; i > -1; i--) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                }
            }
        }

        return true;
    };

    /**
     * Convenience array / object looping function
     * @param {Object} object The object or array to loop through
     * @param {Function} fn Callback function to call on each array item / object key.
     * The callback is passed the following params:
     *
     *  - object: object key, object value, original object
     *
     * @param {Object} scope (optional) The scope (this reference) in which the specified
     * function is executed.
     */
    ExtL.objEach = function (object, fn, scope) {
        var i, property;

        if (object) {
            scope = scope || object;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    if (fn.call(scope, property, object[property], object) === false) {
                        return;
                    }
                }
            }
        }
    };

    /**
     * Convert certain characters (&, <, >, ', and ") to their HTML character equivalents
     * for literal display in web pages
     * @param {String} value The string to encode
     * @return {String} The encoded text
     */
    ExtL.htmlEncode = function (html) {
        return document.createElement( 'a' ).appendChild(
            document.createTextNode( html ) ).parentNode.innerHTML;
    };

    /**
     *
     */
    ExtL.htmlDecode = function (input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

})();

(function(define) {
    'use strict';

    (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else if (typeof exports === 'object') {
            module.exports = factory();
        } else {
            root.TreeView = factory();
        }
    }(window, function() {
        return (function() {

            /** List of events supported by the tree view */
            var events = ['expand', 'collapse', 'select'];

            /**
             * @constructor
             * @property {object} handlers The attached event handlers
             * @property {object} data The JSON object that represents the tree structure
             * @property {DOMElement} node The DOM element to render the tree in
             */
            function TreeView(data, node, prefix) {
                this.handlers = {};
                this.node = node;
                this.nodeEl = document.getElementById(node);
                this.prefix = prefix;
                this.data = data;
                render(this);
            }

            /**
             * A forEach that will work with a NodeList and generic Arrays
             * @param {array|NodeList} arr The array to iterate over
             * @param {function} callback Function that executes for each element. First parameter is element, second is index
             * @param {object} The context to execute callback with
             */
            function forEach(arr, callback, scope) {
                var i      = 0,
                    length = arr.length;

                for (; i < length; i++) {
                    callback.call(scope, arr[i], i);
                }
            }

            /**
             * Renders the tree view in the DOM
             */
            function render(self) {
                var container  = document.getElementById(self.node),
                    leaves     = [],
                    click      = function(e) {
                        e = e || window.event;
                        var parent = (e.target || e.currentTarget || e.srcElement).parentNode,
                            data   = JSON.parse(parent.getAttribute('data-item')),
                            leaves = parent.parentNode.querySelector('.tree-child-leaves');

                        if (leaves) {
                            if (leaves.classList.contains('hidden')) {
                                self.expand(parent, leaves);
                            } else {
                                self.collapse(parent, leaves);
                            }
                        } else {
                            emit(self, 'select', {
                                target: e,
                                data: data
                            });
                        }
                    },
                    renderLeaf = function(item) {
                        var me = this,
                            leaf    = document.createElement('div'),
                            content = document.createElement('div'),
                            text    = document.createElement('a'),
                            expando = document.createElement('span'),
                            clstype = document.createElement('span'),
                            curId   = container.id,
                            prefix  = './' + (me.prefix || ''),
                            //children, guideTree, apiTree, clsTypeClasses;
                            children, clsTypeClasses;

                        leaf.setAttribute('class', 'tree-leaf');

                        content.setAttribute('class', 'tree-leaf-content' + (item.leaf ? ' isLeaf' : ''));
                        content.setAttribute('data-item', JSON.stringify(item));
                        content.setAttribute('id', self.createNodeId(item.className || item.slug));
                        content.setAttribute('isLeaf', item.leaf);

                        text.setAttribute('class', 'tree-leaf-text');
                        text.innerHTML = item.name;

                        if ((!item.children) || (item.name == item.className) || (item.name == item.path)) {
                            if (item.className) {
                                text.href = prefix + item.className + '.html';
                            } else {
                                if (item.link) {
                                    text.href = item.link;
                                    //text.target = '_blank';
                                } else {
                                    text.href = prefix + item.path + '.html';
                                }
                            }
                        }

                        if (item.leaf === false) {
                            clsTypeClasses = 'folder-type';
                        } else if (item.slug && item.leaf === true) {
                            clsTypeClasses = 'guide-type'
                        } else {
                            clsTypeClasses = (item.type) ? item.type + '-type ' : 'class-type';
                        }

                        if(item.first) {
                            clsTypeClasses += " first";
                        }

                        clstype.setAttribute('class', clsTypeClasses);

                        expando.setAttribute('class', 'tree-expando' + (item.expanded ? ' expanded' : ''));
                        expando.innerHTML = item.expanded ? '▿' : '▸';

                        content.appendChild(expando);
                        content.appendChild(clstype);
                        content.appendChild(text);

                        leaf.appendChild(content);

                        if (item.children && item.children.length > 0) {
                            children = document.createElement('div');

                            children.setAttribute('class', 'tree-child-leaves' + (item.expanded ? '' : ' hidden'));

                            forEach(item.children, function(child) {
                                var childLeaf = renderLeaf.call(me, child);

                                children.appendChild(childLeaf);
                            });

                            leaf.appendChild(children);
                        } else {
                            expando.classList.add('hidden');
                        }

                        return leaf;
                    },
                    outer = [];

                if (ExtL.isArray(self.data)) {
                    forEach(self.data, function(item) {
                        leaves.push(renderLeaf.call(self, item));
                    });

                    ExtL.each(leaves, function (leaf) {
                        outer.push(leaf.outerHTML);
                    });
                    container.innerHTML = outer.join('');
                }

                ExtL.each(ExtL.fromNodeList(container.children), function (node) {
                    self.cascade(node, function (n) {
                        var childNodes = self.getChildNodes(n),
                            isPublic = false;

                        if (childNodes) {
                            ExtL.each(childNodes, function (child) {
                                if (!ExtL.hasCls(child, 'tree-member-private')) {
                                    isPublic = true;
                                }
                            });
                            if (!isPublic) {
                                ExtL.addCls(n, 'tree-member-private');
                            }
                        }
                    });
                });

                forEach(container.querySelectorAll('.tree-leaf-text'), function(node) {
                    node.onclick = click;
                });
                forEach(container.querySelectorAll('.tree-expando'), function(node) {
                    node.onclick = click;
                });
            };

            /**
             * Emit an event from the tree view
             * @param {string} name The name of the event to emit
             */
            function emit(instance, name) {
                var args = [].slice.call(arguments, 2);

                //if (events.indexOf(name) > -1) {
                if (ExtL.indexOf(events, name)) {
                    if (instance.handlers[name] && instance.handlers[name] instanceof Array) {
                        forEach(instance.handlers[name], function(handle) {
                            window.setTimeout(function() {
                                handle.callback.apply(handle.context, args);
                            }, 0);
                        });
                    }
                } else {
                    //throw new Error(name + ' event cannot be found on TreeView.');
                }
            }

            /**
             * Expands a leaflet by the expando or the leaf text
             * @param {DOMElement} node The parent node that contains the leaves
             * @param {DOMElement} leaves The leaves wrapper element
             */
            TreeView.prototype.expand = function(node, leaves, selectNode) {
                if (ExtL.isString(node)) {
                    node = ExtL.get(node);
                }

                if (node) {
                    leaves = leaves || node.parentNode.querySelector('.tree-child-leaves');

                    var expando = node.querySelector('.tree-expando');

                    expando.innerHTML = '▿';

                    if (selectNode) {
                        ExtL.addCls(node, 'selected-node');
                    }

                    if (leaves) {
                        leaves.classList.remove('hidden');
                    }

                    emit(this, 'expand', {
                        target: node,
                        leaves: leaves
                    });
                }
            };

            /**
             *
             */
            TreeView.prototype.getNode = function (node, prefix) {
                if (ExtL.isString(node)) {
                    node = this.createNodeId(node, prefix);
                    node = (node.indexOf(prefix) === 0) ? node : ((prefix || '') + node);
                    node = ExtL.get(node);
                }
                return node;
            };

            /**
             *
             */
            TreeView.prototype.getChildNodes = function (node) {
                var children = node.children,
                    childNodes = false;

                if (children.length) {
                    ExtL.each(ExtL.fromNodeList(children), function (direct) {
                        if (ExtL.hasCls(direct, 'tree-child-leaves')) {
                            childNodes = ExtL.fromNodeList(direct.children);
                        }
                    });
                }
                return childNodes;
            }

            /**
             *
             */
            TreeView.prototype.cascade = function (node, fn) {
                node = this.getNode(node);

                var me = this,
                    childNodes = me.getChildNodes(node);

                if (childNodes) {
                    ExtL.each(childNodes, function (n) {
                        me.cascade(n, fn);
                    })
                }
                fn.call(me, node);
            }

            /**
             * Expands the tree to the passed node
             * @param {HTMLElement/String} node The target node / leaf element to expand
             * to or the id of the target node.
             */
            TreeView.prototype.expandTo = function(node, prefix) {
                var ct, original;

                node = this.getNode(node, prefix);

                original = node;

                if (node) {
                    while (ct = this.findLeavesCt(node)) {
                    ct = this.findLeavesCt(node);
                        this.expand(ct.previousElementSibling, ct);
                        node = ct;
                    }
                }

                if (original) {
                    ExtL.addCls(original, 'selected-node');
                    this.scrollIntoView(original);
                }
            }

            TreeView.prototype.expandTreeToClass = function() {
                var path = window.location.pathname,
                    name = path.substring(path.lastIndexOf('/')+1),
                    node = name.replace(/([\d\D]+).html/, '$1'),
                    id = this.createNodeId(node),
                    el = ExtL.get(id);

                if (el) {
                    this.expandTo(el);
                }
            }

            TreeView.prototype.scrollIntoView = function(node) {
                var tree = ExtL.get('tree'),
                    height = tree.offsetHeight,
                    curPos = node.getBoundingClientRect().top;

                if (curPos > height) {
                    tree.scrollTop = curPos - 250;
                }
            }

            TreeView.prototype.findLeavesCt = function(node) {
                var ct, prev;

                if (ExtL.isString(node)) {
                    node = this.nodeEl.querySelector(node);
                }

                if (node) {
                    ct = ExtL.up(node, '.tree-child-leaves');
                    if (ct) {
                        return ct;
                    }
                }
                return false;
            }

            /**
             * Collapses a leaflet by the expando or the leaf text
             * @param {DOMElement} node The parent node that contains the leaves
             * @param {DOMElement} leaves The leaves wrapper element
             */
            TreeView.prototype.collapse = function(node, leaves) {
                if (ExtL.isString(node)) {
                    node = ExtL.get(node);
                }

                if (node) {
                    leaves = leaves || node.parentNode.querySelector('.tree-child-leaves');

                    var expando = node.querySelector('.tree-expando');

                    expando.innerHTML = '▸';

                    leaves.classList.add('hidden');

                    emit(this, 'collapse', {
                        target: node,
                        leaves: leaves
                    });
                }
            };

            /**
             * Attach an event handler to the tree view
             * @param {string} name Name of the event to attach
             * @param {function} callback The callback to execute on the event
             * @param {object} scope The context to call the callback with
             */
            TreeView.prototype.on = function(name, callback, scope) {
                if (events.indexOf(name) > -1) {
                    if (!this.handlers[name]) {
                        this.handlers[name] = [];
                    }

                    this.handlers[name].push({
                        callback: callback,
                        context: scope
                    });
                } else {
                    throw new Error(name + ' is not supported by TreeView.');
                }
            };

            /**
             * Deattach an event handler from the tree view
             * @param {string} name Name of the event to deattach
             * @param {function} callback The function to deattach
             */
            TreeView.prototype.off = function(name, callback) {
                var found = false,
                    index;

                if (this.handlers[name] instanceof Array) {
                    this.handlers[name].forEach(function(handle, i) {
                        index = i;

                        if (handle.callback === callback && !found) {
                            found = true;
                        }
                    });

                    if (found) {
                        this.handlers[name].splice(index, 1);
                    }
                }
            };

            TreeView.prototype.createNodeId = function (className, prefix) {
                var parts = className.split('.'),
                    len = parts.length,
                    nodeId = prefix || 'node',
                    i;

                for (i=0; i<len; i++) {
                    nodeId += '-' + parts[i].toLowerCase();
                }

                return nodeId;
            }

            return TreeView;
        }());
    }));
}(window.define));

(function() {
    var hasClassTemplate = window.isClassTemplate || false,
        isStateful = hasClassTemplate,
        internalId = 0, // used for setting id's
        pageSize = 10,  // used to page search results
        menuCanClose = true, // used to determine if the member type menu is closable
        state = fetchState(true),
        allowSave = false,
        isMacWebkit = (navigator.userAgent.indexOf("Macintosh") !== -1 &&
                       navigator.userAgent.indexOf("WebKit") !== -1),
        isFirefox = (navigator.userAgent.indexOf("firefox") !== -1),
        searchHistory = [],
        quickStartTree, guideTree, tree, productTree,
        masterSearchList, apiSearchRecords, guideSearchRecords, currentApiPage, currentGuidePage, eventsEl, resizeTimer, clicked, pos = {};

    if (document.addEventListener) {
        document.addEventListener('click', function(event) {
            if(!event.synthetic) {
                pos.x = event.clientX;
                pos.y = event.clientY;
                clicked = true;
            }
        }, false);
    } else {
        document.attachEvent('onclick', function(event) {
            if(!event.synthetic) {
                pos.x = event.clientX;
                pos.y = event.clientY;
                clicked = true;
            }
        });
    }

    setTimeout(function(){
        if(clicked) {
            dispatchClick(pos);
            clicked = false;
        }
    },500);

    function dispatchClick(coords){
        var event = document.createEvent("MouseEvent"),
            elem = document.elementFromPoint(coords.x, coords.y);

        event.initMouseEvent(
            "click",
            true /* bubble */, true /* cancelable */,
            window, null,
            coords.x, coords.y, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        event.synthetic = true;

        elem.dispatchEvent(event);
    }

    function addEventsAndSetMenuClose(item, event, menuClose, fn) {
        ExtL.on(item, event, function() {
            // menuCanClose is a closure variable
            if (menuClose != null) {
                menuCanClose = menuClose;
            }

            if (fn) {
                fn();
            }
        });
    }

    function gotoLink(e) {
        var elem;

        e = e || window.event;

        if (e.srcElement) {
            elem = e.srcElement;
        }  else if (e.target) {
            elem = e.target;
        }

        location.href = elem.getAttribute('data');
    }

    /**
     * Progressive ID generator
     * @param {String} prefix String to prepend to the ID.  Default to 'e-'.
     */
    function id (prefix) {
        prefix = prefix || 'e-';
        internalId++;
        return prefix + internalId;
    }

    /**
     * Show / hide members based on whether public, protected, private, or some
     * combination is checked.
     */
    function filterByAccess() {
        var publicCheckbox = ExtL.get('publicCheckbox'),
            protectedCheckbox = ExtL.get('protectedCheckbox'),
            privateCheckbox = ExtL.get('privateCheckbox'),
            inheritedCheckbox = ExtL.get('inheritedCheckbox'),
            publicCls = 'show-public',
            protectedCls = 'show-protected',
            privateCls = 'show-private',
            inheritedCls = 'show-inherited',
            membersCt = ExtL.get('rightMembers'),
            treeMembersCt = ExtL.get('tree');

        resetTempShownMembers();

        ExtL.toggleCls(treeMembersCt, publicCls, publicCheckbox.checked === true);
        ExtL.toggleCls(treeMembersCt, protectedCls, protectedCheckbox.checked === true);
        ExtL.toggleCls(treeMembersCt, privateCls, privateCheckbox.checked === true);

        ExtL.toggleCls(membersCt, publicCls, publicCheckbox.checked === true);
        ExtL.toggleCls(membersCt, protectedCls, protectedCheckbox.checked === true);
        ExtL.toggleCls(membersCt, privateCls, privateCheckbox.checked === true);
        ExtL.toggleCls(membersCt, inheritedCls, inheritedCheckbox.checked === true);

        setTypeNavAndHeaderVisibility();
        highlightTypeMenuItem();
    }

    /**
     * Reset any temporarily shown class members
     */
    function resetTempShownMembers () {
        var temps = document.querySelectorAll('.temp-show');

        temps = ExtL.fromNodeList(temps);

        if (temps.length) {
            ExtL.each(temps, function (item) {
                ExtL.removeCls(item, 'temp-show');
            });
        }
    }

    /**
     * Toggle the active navigation tab between the api docs and guide tabs
     * @param {String} The id of the tab to set active: apiTab or guideTab
     */
    function toggleNavTab(tab) {
        if (this !== window && ExtL.hasCls(this, 'active-tab')) {
            return;
        }

        var apiTab = ExtL.get('apiTab'),
            guideTab = ExtL.get('guideTab'),
            quickStartTab = ExtL.get('quickStartTab'),
            activateApiTab, activateGuideTab, activateQuickStartTab,
            toSave = true,
            tree = ExtL.get('tree'),
            guideTree = ExtL.get('guide-tree'),
            quickStartTree = ExtL.get('quick-start-tree');

        /*if (apiTab && ExtL.get(tab) === apiTab && !apiTab.offsetHeight) {
            tab = 'guideTab';
            toSave = false;
        }
        if (guideTab && ExtL.get(tab) === guideTab && !guideTab.offsetHeight) {
            tab = 'apiTab';
            toSave = false;
        }

        if (ExtL.isString(tab)) {
            activateApiTab = (tab === 'apiTab');
            activateGuideTab = !activateApiTab;
        }

        if (tree) {
            ExtL.toggleCls(tree, 'hide', activateGuideTab);
        }
        if (guideTree) {
            ExtL.toggleCls(guideTree, 'hide', activateApiTab);
        }
        if (apiTab) {
            ExtL.toggleCls(apiTab, 'active-tab', activateApiTab);
        }
        if (guideTab) {
            ExtL.toggleCls(guideTab, 'active-tab', activateGuideTab);
        }*/

        if (!ExtL.isString(tab)) {
            tab = tab || window.event;
            tab = tab.target || tab.srcElement;
            tab = tab.id;
        }
        tab = ExtL.get(tab);

        if (!tab) {
            return;
        }

        // deactivate all the tabs
        ExtL.each(ExtL.fromNodeList(tab.parentNode.querySelectorAll('.active-tab')), function (t) {
            ExtL.removeCls(t, 'active-tab');
        });
        ExtL.addCls(tab, 'active-tab');

        if (tree) {
            ExtL.toggleCls(tree, 'hide', !ExtL.hasCls(apiTab, 'active-tab'));
        }
        if (guideTree) {
            ExtL.toggleCls(guideTree, 'hide', !ExtL.hasCls(guideTab, 'active-tab'));
        }
        if (quickStartTree) {
            ExtL.toggleCls(quickStartTree, 'hide', !ExtL.hasCls(quickStartTab, 'active-tab'));
        }

        if (toSave) {
            saveState();
        }
    }

    /**
     *
     */
    function toggleContextTab() {
        var filterTab = ExtL.get('filterTab'),
            relatedClassesTab = ExtL.get('relatedClassesTab');

        ExtL.toggleCls(ExtL.get('filters-ct'), 'hide');
        ExtL.toggleCls(ExtL.get('related-classes-context-ct'), 'hide');
        ExtL.toggleCls(filterTab, 'active-tab');
        ExtL.toggleCls(relatedClassesTab, 'active-tab');
    }

    /**
     * Hide type section headers where there are no members shown by the filters
     *
     * Disable the top nav buttons when no members for that type are shown by the filters
     */
    function setTypeNavAndHeaderVisibility () {
        var headers = [],
            types = ['configs', 'properties', 'methods', 'events', 'vars', 'sass-mixins'],
            typeLen = types.length,
            i = 0,
            totalCount = 0,
            typeCt, headersLen, els, len, j, hasVisible, count, btn, memberEl;

        for (; i < typeLen; i++) {
            typeCt = ExtL.get(types[i] + '-ct');
            if (typeCt) {
                headers.push(typeCt);
            }

            // account for the required / optional configs/properties/methods sub-headings
            if (typeCt && (types[i] === 'configs' || types[i] === 'properties' || types[i] === 'methods')) {
                typeCt = ExtL.get((types[i] === 'configs' ? 'optional' : 'instance') + '-' + types[i] +'-ct');
                if (typeCt) {
                    headers.push(typeCt);
                }
                typeCt = ExtL.get((types[i] === 'configs' ? 'required' : 'static') + '-'+ types[i] +'-ct');
                if (typeCt) {
                    headers.push(typeCt);
                }
            }
        }

        headersLen = headers.length;

        for (i = 0; i < headersLen; i++) {
            ExtL.removeCls(headers[i], 'hide-type-header');
        }

        for (i = 0; i < headersLen; i++) {
            els = headers[i].querySelectorAll('div.classmembers');
            len = els.length;
            hasVisible = false;
            count = 0;
            for (j = 0; j < len; j++) {
                memberEl = els.item(j);
                if (memberEl.offsetHeight && !ExtL.hasCls(memberEl, 'accessor-method')) {
                    count++;
                    hasVisible = true;
                }
            }
            totalCount += count;
            btn = ExtL.get(headers[i].id.substring(0, headers[i].id.length - 3) + '-nav-btn');
            if (btn) {
                btn.querySelector('.nav-btn-count').innerHTML = count;
            }
            if (hasVisible) {
                ExtL.removeCls(headers[i], 'hide-type-header');
                if (btn) {
                    ExtL.removeCls(btn, 'disabled');
                }
            } else {
                ExtL.addCls(headers[i], 'hide-type-header');
                if (btn) {
                    ExtL.addCls(btn, 'disabled');
                }
            }
        }

        ExtL.toggleCls(document.body, 'no-visible-members', totalCount === 0);
    }

    function highlightMemberMatch(member, value) {
        var re = new RegExp(('(' + value + ')').replace('$', '\\$'), 'ig'),
            name = member.querySelector('.member-name') || member.querySelector('.params-list');

        name.innerHTML = (name.textContent || name.innerText).replace(re, '<strong>$1</strong>');
    }

    function unhighlightMemberMatch(member) {
        var name = member.querySelector('.member-name') || member.querySelector('.params-list');

        name.innerHTML = name.textContent || name.innerText;
    }

    /**
     * Returns an object with:
     *  - width: the viewport width
     *  - height: the viewport height
     */
    function getViewportSize(){
        var e = window,
            a = 'inner';

        if (!('innerWidth' in window)){
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[ a+'Width' ],
            height: e[ a+'Height' ]
        };
    }

    /**
     * Set class tree visibility
     * @param {Boolean} visible false to hide - defaults to true
     */
    function setTreeVisibility(visible) {
        /*var tree = ExtL.get('class-tree-ct'),
            members = ExtL.get('rightMembers'),
            hiddenCls = 'tree-hidden';

        visible = (visible === false) ? false : true;

        ExtL.toggleCls(tree, hiddenCls, !visible);
        ExtL.toggleCls(members, hiddenCls, !visible);*/

        visible = (visible === false) ? false : true;
        ExtL.toggleCls(document.body, 'tree-hidden', !visible)
        ExtL.toggleCls(document.body, 'tree-shown', visible)

        saveState();
    }

    /**
     * Toggle class tree visibility
     */
    function toggleTreeVisibility() {
        var body = document.body,
            rightMembers = ExtL.get('rightMembers'),
            contextShown = ExtL.hasCls(rightMembers, 'show-context-menu');

        if (!contextShown) {
            setTreeVisibility(ExtL.hasCls(body, 'tree-hidden'));
        }
    }

    /**
     * Fetch JSON File for search index
     * @param path
     * @param callback
     */
    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200 || httpRequest.status === 0) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }

    /**
     * Filter the members using the filter input field value
     */
    var filter = ExtL.createBuffered(function (e, target) {
        e = e || window.event;

        var value        = ExtL.trim(target.value),
            matcher      = new RegExp(value.replace('$', '\\$'), 'gi'),
            classmembers = ExtL.fromNodeList(document.getElementsByClassName('classmembers')),
            length       = classmembers.length,
            classText    = document.getElementsByClassName('classText')[0],
            matches      = [],
            i            = 0,
            matchesLen, owner;

        resetTempShownMembers();

        ExtL.each(classmembers, function (member) {
            var parent = member.parentNode,
                header = ExtL.hasCls(parent, 'accessor-method') ? parent : false,
                params = ExtL.fromNodeList(member.querySelectorAll('.param-list-item'));

            // if the filter field is cleared remove all of the filtering and temp-expanding on all of the members
            if (!value.length) {
                ExtL.removeCls(classText, 'be-hidden');
                ExtL.removeCls(member, 'member-filter-expanded');
                unhighlightMemberMatch(member);
                if (params.length) {
                    ExtL.each(params, function (paramEl) {
                        unhighlightMemberMatch(paramEl.parentNode);
                    });
                }
            } else {
                if (member.getAttribute('data-member-name').match(matcher)) {
                    matches.push(member);
                    ExtL.removeCls(member, 'be-hidden');
                    highlightMemberMatch(member, value);

                    // show the accessor header
                    if (header) {
                        ExtL.removeCls(header, 'be-hidden');
                    }
                } else {
                    ExtL.addCls(member, 'be-hidden');
                    unhighlightMemberMatch(member);

                    // hide the accessor header
                    if (header) {
                        ExtL.addCls(header, 'be-hidden');
                    }
                }

                // if the member is a sass mixin check its params for matches against the filter value
                // for matches, hide all non-matching params, highlight the matches, and temp-expand the parent mixin member
                if (parent.id === 'sass-mixins-ct') {
                    var paramMatch = false;

                    if (params.length) {
                        ExtL.each(params, function (paramEl) {
                            var name = paramEl.id.substr(paramEl.id.indexOf('--') + 2),
                                paramParent = ExtL.up(paramEl, '.param-row');

                            if (name.match(matcher)) {
                                paramMatch = true;
                                ExtL.removeCls(member, 'be-hidden');
                                ExtL.removeCls(paramParent, 'be-hidden');
                                matches.push(member);
                                highlightMemberMatch(paramParent, value);
                            } else {
                                ExtL.addCls(paramParent, 'be-hidden');
                                unhighlightMemberMatch(paramParent);
                            }
                        });
                    }

                    ExtL[paramMatch ? 'addCls' : 'removeCls'](member, 'member-filter-expanded');
                }
            }
        });

        // for all the matches found look to see if the match is an accessor method and
        // if so then show its parent config
        matchesLen = matches.length;
        for (i = 0; i < matchesLen; i++) {
            //header = ExtL.hasCls(matches[i].parentNode, 'accessor-method') ? matches[i].parentNode : false;
            header = ExtL.hasCls(matches[i], 'accessor-method') ? matches[i].parentNode : false;
            if (header) {
                owner = ExtL.up(matches[i], '.classmembers');
                if (owner) {
                    ExtL.removeCls(owner, 'be-hidden');
                    ExtL.addCls(owner, 'member-filter-expanded');
                }
            }
        }

        // decorate the body (and subsequently all be-hidden els) as filtered
        ExtL.toggleCls(document.body, 'filtered', value.length);

        setTypeNavAndHeaderVisibility();
    }, 200);

    function getSearchList () {
        var list = masterSearchList,
            itemTpl = '{0}-{1}`';

        if (!list) {
            list = '';
            ExtL.each(searchIndex, function (i, cls) {  // iterate over each class object
                var missingAccessors = [],              // collect up any missing auto-generated accessors to be added to the class object
                    composite;

                ExtL.each(cls, function (key, obj) {    // inspect each member - could be the class name, alias, or a class member object
                    var memberName, cap;

                    if (key === 'n') {                  // this is the class name
                        list += ExtL.format(itemTpl, i, obj);
                    } else if (key === 'g') {           // this is any alternate class names
                        ExtL.each(obj, function (x) {
                            list += ExtL.format(itemTpl, i, obj);
                        });
                    } else if (key === 'x') {           // this is any aliases found for the class
                        ExtL.each(obj, function (obj) {
                            list += ExtL.format(itemTpl, i, obj);
                        });
                    } else if (key !== 'a') {                            // else this is a member object
                        list += ExtL.format(itemTpl, i, key);

                        composite = key.substr(0, key.indexOf('.')) + '.' + cls.n + '.' + key.substr(key.indexOf('.') + 1);
                        list += ExtL.format(itemTpl, i, composite);

                        memberName = key.substr(key.indexOf('.') + 1);
                        cap = ExtL.capitalize(memberName);

                        if (obj.g) {                    // if this is an accessor
                            if (!cls['m.get' + cap]) { // if the getter doesn't exist already
                                missingAccessors.push('get' + cap);
                                list += ExtL.format(itemTpl, i, 'm.get' + cap);
                            }
                            if (!cls['m.set' + cap]) { // if the setter doesn't exist already
                                missingAccessors.push('set' + cap);
                                list += ExtL.format(itemTpl, i, 'm.set' + cap);
                            }
                        }
                    }
                });

                // add each missing accessor method to the class object
                // as a public setter / getter
                ExtL.each(missingAccessors, function (accessor) {
                    cls['m.' + accessor] = {
                        a: 'p'
                    };
                });
            });
            masterSearchList = list;
        }
        return list;
    }

    function doLogSearchValue (value) {
        var field = ExtL.get('searchtext'),
            value = value || field.value,
            toRemove = [],
            temp = [],
            limit = 10;

        ExtL.each(searchHistory, function (item) {
            if (item.toLowerCase() !== value.toLowerCase()) {
                temp.push(item);
            }
        });
        temp.push(value);

        if (temp.length > limit) {
            temp.reverse().length = limit;
            temp.reverse();
        }

        searchHistory = temp;
        saveState();
    }

    /**
     *
     */
    var logSearchValue = ExtL.createBuffered(doLogSearchValue, 750);

    function searchFilter (e){
        var results = [],
            hits = [],
            hasApi = ExtL.get('apiTab').offsetHeight,
            hasGuide = ExtL.get('guideTab').offsetHeight,
            searchField = ExtL.get('searchtext'),
            value = searchField.value,
            unique = [],
            catalog = {},
            searchList, keyCode, result, value, rx, re, item, match;

        e = e || window.event;

        if (e && e.type === 'keydown' && value.length) {
            keyCode = e.keyCode || e.which;
            if (keyCode !== 13 && keyCode !== 9) {
                return;
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (keyCode === 13) {
                onSearchEnter();
            }
            if (keyCode === 9) {
                onSearchTab();
            }
            return;
        }

        value = ExtL.trim((searchField).value).toLowerCase();
        value = value.replace('$', '\\$');

        if (!value.length || (ExtL.isIE8() && value.length < 2) || value.slice(-1) === '.') {
            hideSearchResults();
            showSearchHistory();
            return;
        } else {
            logSearchValue(value);
            hideSearchHistory();
        }

        // START WITH THE API SEARCH BITS
        if (hasApi) {
            searchList = getSearchList();
            rx = new RegExp('(\\d+)(?:-)([$a-zA-Z0-9\\.\-]*' + value + '[a-zA-Z0-9\\.\-]*)(?:`)', 'gi');

            while ((result = rx.exec(searchList))) {
                item = {
                    searchValue: value,
                    searchMatch: result[2],
                    classObj: searchIndex[result[1]]
                };

                results.push(item);
            }

            apiSearchRecords = prepareApiSearchRecords(results);    // save this up so it can be used ad hoc

            // Strip out any duplicate entries from the search results
            ExtL.each(apiSearchRecords, function (rec) {
                var name = rec.classObj.n,
                    type = rec.memberType,
                    member = rec.sortValue;

                if (rec.byClassMember !== true) {
                    if (!catalog[name]) {
                        catalog[name] = {};
                        unique.push(rec);
                    }
                } else if (!catalog[name]) {
                    unique.push(rec);
                    catalog[name] = {};
                    catalog[name][member] = {};
                    catalog[name][member][type] = true;
                } else if (!catalog[name][member]) {
                    unique.push(rec);
                    catalog[name][member] = {};
                    catalog[name][member][type] = true;
                } else if (!catalog[name][member][type]) {
                    unique.push(rec);
                    catalog[name][member][type] = true;
                }
            });

            apiSearchRecords = unique;
        }

        // NEXT WE'LL FOCUS ON THE GUIDE SEARCH STUFF
        if (hasGuide) {
            re = new RegExp(value.replace('$', '\\$'), 'i');

            /*ExtL.each(guideSearchWords, function (key, val) {
                match = key.match(re);
                if (match) {
                    ExtL.each(val, function (item) {
                        item.guide = guideSearchRef[item.r];
                        if (value === item.m) {
                            item.priority = 1;
                        } else if (item.m.toLowerCase().indexOf(value.toLowerCase()) === 0) {
                            item.priority = 0;
                        } else {
                            item.priority = -1;
                        }
                        hits.push(item);
                    });
                }
            });*/

            ExtL.each(guideSearches, function (results) {
                ExtL.each(results.searchWords, function (key, val) {
                    match = key.match(re);
                    if (match) {
                        ExtL.each(val, function (item) {
                            item.guide = results.searchRef[item.r];
                            if (value === item.m) {
                                item.priority = 1;
                            } else if (item.m.toLowerCase().indexOf(value.toLowerCase()) === 0) {
                                item.priority = 0;
                            } else {
                                item.priority = -1;
                            }
                            item.searchUrls = results.searchUrls;
                            item.prod = results.prod;
                            item.version = results.version;
                            hits.push(item);
                        });
                    }
                });
            });

            guideSearchRecords = prepareGuideSearchRecords(hits);  // save this up so it can be used ad hoc
        }

        showSearchResults(1);
    }

    /**
     *
     */
    function showSearchHistory (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            value = target.value,
            panel, field, fieldBox;

        if (!value.length && searchHistory && searchHistory.length) {
            panel = ExtL.get('search-history-panel');
            ExtL.removeChildNodes(panel);

            ExtL.each(searchHistory.reverse(), function (item) {
                panel.appendChild(ExtL.createElement({
                    "class": 'search-history-item',
                    html: item,
                    "data-value": item
                }));
            });
            searchHistory.reverse();

            field = target;
            fieldBox = field.getBoundingClientRect();

            ExtL.addCls(document.body, 'show-search-history');

            ExtL.applyStyles(panel, {
                top: fieldBox.bottom + 'px',
                width: (fieldBox.right - fieldBox.left) + 'px',
                left: fieldBox.left + 'px'
            });
        }
    }

    /**
     *
     */
    function hideSearchHistory () {
        ExtL.removeCls(document.body, 'show-search-history');
    }

    /**
     *
     */
    function onSearchHistoryClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            field = ExtL.get('searchtext');

        if (target) {
            field.value = target.getAttribute('data-value');
            stopEvent(e);
            hideSearchHistory();
            searchFilter();
            field.focus();
        }
    }

    function prepareGuideSearchRecords (hits) {
        if (hits.length) {
            hits.sort(function (a, b) {
                var aType = a.t,
                    bType = b.t,
                    aFrequency = a.p,
                    bFrequency = b.p,
                    aPriority = a.priority,
                    bPriority = b.priority;

                if (aType === 'b' && bType === 't') {
                    return 1;
                } else if (aType === 't' && bType === 'b') {
                    return -1;
                } else {
                    if (aPriority < bPriority) {
                        return 1;
                    } else if (aPriority > bPriority) {
                        return -1;
                    } else {
                        if (aFrequency < bFrequency) {
                            return 1;
                        } else if (aFrequency > bFrequency) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            });
        }

        return hits;
    }

    function prepareApiSearchRecords (results) {
        // BELOW IS THE SORTING ORDER

        //exact xtype                           5 -
        //exact classname (public)              10 -
        //exact configs (public)                15 -
        //exact configs (protected)             20 -
        //exact properties (public)             25 -
        //exact properties (protected)          30 -
        //exact methods (public)                35 -
        //exact methods (protected)             40 -
        //exact events (public)                 45 -
        //exact events (protected)              50 -
        //exact css vars (public)               55 -
        //exact css vars (protected)            60 -
        //exact css mixins (public)             65 -
        //exact css mixins (protected)          70 -

        //begins with xtype: alias              100 -
        //begins with classname (public)        200 -
        //begins with configs (public)          300 -
        //begins with configs (protected)       400 -
        //begins with properties (public)       500 -
        //begins with properties (protected)    600 -
        //begins with methods (public)          700 -
        //begins with methods (protected)       800 -
        //begins with events (public)           900 -
        //begins with events (protected)        1000 -
        //begins with css vars (public)         1100 -
        //begins with css vars (protected)      1200 -
        //begins with css mixins (public)       1300 -
        //begins with css mixins (protected)    1400 -

        //has xtype: alias                      1500 -
        //has classname (public)                1600 -
        //has configs (public)                  1700 -
        //has configs (protected)               1800 -
        //has properties (public)               1900 -
        //has properties (protected)            2000 -
        //has methods (public)                  2100 -
        //has methods (protected)               2200 -
        //has events (public)                   2300 -
        //has events (protected)                2400 -
        //has css vars (public)                 2500 -
        //has css vars (protected)              2600 -
        //has css mixins (public)               2700 -
        //has css mixins (protected)            2800 -

        //exact classname (private)             2805 -
        //exact configs (private)               2810 -
        //exact properties (private)            2815 -
        //exact methods (private)               2820 -
        //exact events (private)                2825 -
        //exact css vars (private)              2830 -
        //exact css mixins (private)            2835 -

        //begins with classname (private)       2900 -
        //begins with configs (private)         3000 -
        //begins with properties (private)      3100 -
        //begins with methods (private)         3200 -
        //begins with events (private)          3300 -
        //begins with css vars (private)        3400 -
        //begins with css mixins (private)      3500 -

        //has classname (private)               3600 -
        //has configs (private)                 3700 -
        //has properties (private)              3800 -
        //has methods (private)                 3900 -
        //has events (private)                  4000 -
        //has css vars (private)                4100 -
        //has css mixins (private)              4200 -

        ExtL.each(results, function (item) {
            var searchMatch = item.searchMatch,
                searchValue = item.searchValue,
                classObj = item.classObj,
                aliases = item.classObj.x,
                i, aliasPre, aliasPost, member, memberType, memberName, access,
                targetClassName, classSuffix, types, typesDisp, meta;

            types = {
                c: 'cfg',
                p: 'property',
                sp: 'property',
                m: 'method',
                sm: 'static-method',
                e: 'event',
                v: 'css_var-S',
                x: 'css_mixin',
                z: 'css_mixin'
            };

            typesDisp = {
                c: 'config',
                p: 'property',
                sp: 'property',
                m: 'method',
                sm: 'method',
                e: 'event',
                v: 'css var',
                x: 'css mixin',
                z: 'mixin param'
            };

            meta = {
                r: 'removed',
                d: 'deprecated',
                s: 'static',
                ro: 'readonly'
            };

            // prioritize alias/xtype
            if (aliases && aliases.indexOf(searchMatch) > -1) {
                ExtL.each(aliases, function (alias) {
                    i = alias.indexOf('.');
                    aliasPre = alias.substring(0, i);
                    aliasPost = alias.substr(i + 1);

                    if (searchMatch === alias) {
                        item.byAlias = true;
                        item.alias = alias;
                        item.aliasPre = aliasPre;
                        item.aliasPost = item.sortValue = aliasPost;
                        item.access = classObj.a === 'i' ? 'private' : 'public';

                        if (searchValue.toLowerCase() === aliasPost.toLowerCase()) {
                            item.priority = 5;
                        } else {
                            item.priority = (aliasPost.search(new RegExp(searchValue, 'i')) === 0) ? 100 : 1500;
                        }
                    }
                });
            }

            // prioritize class / alternate class
            else if (searchMatch === classObj.n || (classObj.g && classObj.g.indexOf(searchMatch) > -1)) {
                item.byClass = true;
                targetClassName = (searchMatch === classObj.n) ? classObj.n : searchMatch;
                classSuffix = targetClassName.substr(targetClassName.lastIndexOf('.') + 1);
                item.sortValue = classSuffix;
                item.access = classObj.a === 'i' ? 'private' : 'public';
                if (classSuffix.toLowerCase() === searchValue.toLowerCase()) {
                    item.priority = (classObj.a) ? 2805 : 10;
                }
                else if (classSuffix.search(new RegExp(searchValue, 'i')) === 0) {
                    item.priority = (classObj.a) ? 2900 : 200;
                } else {
                    item.priority = (classObj.a) ? 3600 : 1600;
                }
            }

            // prioritize members
            else {
                item.byClassMember = true;
                // regarding the below replace()..
                // The search list has entries for class + member searches, but really the member
                // is the member only, not the concatenation of class name and member name
                member = searchMatch.replace(classObj.n + '.', '');
                i = member.indexOf('.');
                memberType = member.substring(0, i);
                memberName = item.sortValue = member.substr(i + 1);
                memberObj = classObj[member];
                access = memberObj.a;
                item.access = access === 'p' ? 'public' : (access === 'i' ? 'private' : 'protected');
                item.memberType = types[memberType];
                item.memberTypeDisp = typesDisp[memberType];

                if (memberObj.x) {
                    item.meta = meta[memberObj.x];
                }

                // note regarding member type, the member's prefix maps as follows:
                //  - c  : configs
                //  - p  : properties
                //  - sp : static properties
                //  - m  : methods
                //  - sm : static methods
                //  - e  : events
                //  - v  : css vars
                //  - x  : css mixins
                //  - z  : css mixin param
                // note regarding access, the member's 'a' value maps as follows:
                //  - p : public
                //  - o : protected
                //  - i : private

                // prioritize "begins with"
                if (memberName.toLowerCase() === searchValue.toLowerCase()) {
                    // configs
                    if (memberType === 'c') {
                        item.priority = (access === 'p') ? 15 : ((access === 'o') ? 20 : 2810 );
                    }
                    // properties
                    if (memberType === 'p' || memberType === 'sp') {
                        item.priority = (access === 'p') ? 25 : ((access === 'o') ? 30 : 2815 );
                    }
                    // methods
                    if (memberType === 'm' || memberType === 'sm') {
                        item.priority = (access === 'p') ? 35 : ((access === 'o') ? 40 : 2820 );
                    }
                    // events
                    if (memberType === 'e') {
                        item.priority = (access === 'p') ? 45 : ((access === 'o') ? 50 : 2825 );
                    }
                    // css vars
                    if (memberType === 'v') {
                        item.priority = (access === 'p') ? 55 : ((access === 'o') ? 60 : 2830 );
                    }
                    // css mixins
                    if (memberType === 'x') {
                        item.priority = (access === 'p') ? 65 : ((access === 'o') ? 70 : 2835 );
                    }
                }
                else if (memberName.search(new RegExp(searchValue, 'i')) === 0) {
                    // configs
                    if (memberType === 'c') {
                        item.priority = (access === 'p') ? 300 : ((access === 'o') ? 400 : 3000 );
                    }
                    // properties
                    if (memberType === 'p' || memberType === 'sp') {
                        item.priority = (access === 'p') ? 500 : ((access === 'o') ? 600 : 3100 );
                    }
                    // methods
                    if (memberType === 'm' || memberType === 'sm') {
                        item.priority = (access === 'p') ? 700 : ((access === 'o') ? 800 : 3200 );
                    }
                    // events
                    if (memberType === 'e') {
                        item.priority = (access === 'p') ? 900 : ((access === 'o') ? 1000 : 3300 );
                    }
                    // css vars
                    if (memberType === 'v') {
                        item.priority = (access === 'p') ? 1100 : ((access === 'o') ? 1200 : 3400 );
                    }
                    // css mixins
                    if (memberType === 'x') {
                        item.priority = (access === 'p') ? 1300 : ((access === 'o') ? 1400 : 3500 );
                    }
                } else { // then has
                    // configs
                    if (memberType === 'c') {
                        item.priority = (access === 'p') ? 1700 : ((access === 'o') ? 1800 : 3700 );
                    }
                    // properties
                    if (memberType === 'p' || memberType === 'sp') {
                        item.priority = (access === 'p') ? 1900 : ((access === 'o') ? 2000 : 3800 );
                    }
                    // methods
                    if (memberType === 'm' || memberType === 'sm') {
                        item.priority = (access === 'p') ? 2100 : ((access === 'o') ? 2200 : 3900 );
                    }
                    // events
                    if (memberType === 'e') {
                        item.priority = (access === 'p') ? 2300 : ((access === 'o') ? 2400 : 4000 );
                    }
                    // css vars
                    if (memberType === 'v') {
                        item.priority = (access === 'p') ? 2500 : ((access === 'o') ? 2600 : 4100 );
                    }
                    // css mixins
                    if (memberType === 'x') {
                        item.priority = (access === 'p') ? 2700 : ((access === 'o') ? 2800 : 4200 );
                    }
                }
            }
        });

        return sortSearchItems(results);
    }

    function sortSearchItems(items) {
        return items.sort(function (a, b) {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            } else {
                if (a.sortValue < b.sortValue) {
                    return -1;
                } else if (a.sortValue > b.sortValue) {
                    return 1;
                } else {
                    if (a.classObj.n < b.classObj.n) {
                        return -1;
                    } else if (a.classObj.n > b.classObj.n) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });
    }

    function getSearchResultsCt () {
        //var size = getViewportSize(),
            //compressed = size.width <= 800,
            //ct = ExtL.get('search-results-ct'),
        var ct = ExtL.get('search-results-ct'),
            hasApi = ExtL.get('apiTab').offsetHeight,
            hasGuide = ExtL.get('guideTab').offsetHeight,
            //posRef, boundingBox, top, right, cn;
            cn;

        if (!ct) {
            //posRef = compressed ? document.querySelector('.context-menu-ct') : ExtL.get('searchtext');
            //boundingBox = posRef.getBoundingClientRect();
            //top = compressed ? (boundingBox.top + 32) : (boundingBox.top + posRef.clientHeight);
            //right = compressed ? 0 : (document.body.clientWidth - boundingBox.right);
            if (hasApi || hasGuide) {
                cn = [];
            }
            if (hasGuide) {
                cn.push({
                    id: 'guide-search-results',
                    "class": 'isHidden'
                });
            }
            if (hasApi) {
                cn.push({
                    id: 'api-search-results'
                });
            }
            ct = ExtL.createElement({
                tag: 'span',
                id: 'search-results-ct',
                //style: 'top: ' + top + 'px;right: ' + right + 'px;',
                cn: cn
            });
            document.body.appendChild(ct);
        }

        return ct;
    }

    function showSearchResults (page) {
        var apiTab = ExtL.get('apiTab'),
            apiVisible = apiTab.offsetHeight,
            guideTab = ExtL.get('guideTab'),
            guideVisible = guideTab.offsetHeight,
            ct = getSearchResultsCt(),
            size = getViewportSize(),
            compressed = size.width <= 950,
            posRef, boundingBox, top, right;

        posRef = compressed ? document.querySelector('.context-menu-ct') : ExtL.get('searchtext');
        boundingBox = posRef.getBoundingClientRect();
        top = compressed ? (boundingBox.top + 32) : (boundingBox.top + posRef.clientHeight);
        right = compressed ? 0 : (document.body.clientWidth - boundingBox.right);

        ct.style.right = right.toString() + 'px';
        ct.style.top   = top.toString() + 'px';

        sizeSearchResultsCt();

        ExtL.addCls(ct, 'show-search-results');

        if (page && apiVisible) {
            loadApiSearchPage(page);
        }

        if (page && guideVisible) {
            loadGuideSearchPage(page);
        }
    }

    function sizeSearchResultsCt () {
        var searchCt = getSearchResultsCt(),
            size = getViewportSize(),
            vpHeight = size.height,
            h = (vpHeight < 509) ? (vpHeight - 58) : 451;

            searchCt.style.height = h.toString() + 'px';
    }

    function getProductRelPath () {
        var href = window.location.href,
            i = 0,
            rel = '';

        href = href.substr(href.indexOf(product));

        for (; i < (href.split('/').length - 1); i++) {
            rel += '../default.htm';
        }

        return rel;
    }

    function loadGuideSearchPage (page) {
        var i = 0,
            start = page * pageSize - pageSize,
            value = ExtL.get('searchtext').value,
            ct = getSearchResultsCt(),
            guideCt = ExtL.get('guide-search-results'),
            i = 0,
            len = pageSize < guideSearchRecords.length ? pageSize : guideSearchRecords.length,
            curl  = window.location.href,
            rel = (curl.indexOf('guides') > -1) ? getRelativePath(curl) : '',
            matchEl, item, cn, href, badge;

        page = page || 1;

        value = ExtL.trim(value).toLowerCase();
        value = value.replace('$', '\\$');

        ExtL.removeChildNodes(guideCt);

        guideCt.appendChild(ExtL.createElement({
            "class": 'search-results-nav-header',
            cn: [{
                html: 'API Docs'
            }, {
                "class": 'active-tab',
                html: 'Guides'
            }]
        }));

        guideCt.appendChild(ExtL.createElement({
            "class": 'search-results-header',
            html: 'Guides'
        }));

        for (;i < len; i++) {
            item = guideSearchRecords[start + i];
            if (item) {
                badge = ExtL.isIE8() ? '' : ' ' + item.prod + '-badge badge';
                cn = [{
                    "class": 'guide-search-title',
                    html: item.guide
                }];

                if (item.t === 'b') {
                    cn.push({
                        "class": 'search-match',
                        html: item.m
                    });
                }

                href = getProductRelPath() + item.prod + (item.version ? ('../' + item.version) : '') + '/guides/' + item.searchUrls[item.r] + '.html';
                //href = rel + href;

                guideCt.appendChild(ExtL.createElement({
                    tag: 'a',
                    href: href,
                    "class": 'guide-search-item' + (item.t === 'b' ? ' body-result-item' : '') + badge,
                    cn: cn
                }));
            }
        }

        addSearchPagingToolbar(guideCt, guideSearchRecords, page);

        re = new RegExp('(' + value.replace('$', '\\$') + ')', 'ig');
        len = guideCt.childNodes.length;
        for (i = 0; i < len; i++) {
            var isBody = ExtL.hasCls(guideCt.childNodes.item(i), 'body-result-item');
            matchEl = guideCt.childNodes.item(i).querySelector(isBody ? '.search-match' : '.guide-search-title');
            //matchEl = guideCt.childNodes.item(i);

            if (matchEl) {
                matchEl.innerHTML = (matchEl.textContent || matchEl.innerText).replace(re, '<strong>$1</strong>');
            }
        }
    }

    function getRelativePath (curl) {
        var regex = new RegExp('.*guides\/(.*?)\.html'),
            guideMatch = regex.exec(curl)[1],
            slashCount = guideMatch.split("/"),
            rel = '', i;

        if (slashCount.length > 0) {
            for (i = 0; i < slashCount.length; i++) {
                rel = '../' + rel;
            }
        }

        return rel;
    }

    function loadApiSearchPage (page) {
        var i = 0,
            start = page * pageSize - pageSize,
            ct = getSearchResultsCt(),
            apiCt = ExtL.get('api-search-results'),
            value = ExtL.get('searchtext').value,
            curl  = window.location.href,
            rel = (curl.indexOf('guides') > -1) ? getRelativePath(curl) : '',
            rec, access, el, cn, re, matchEl, href, meta;

        page = page || 1;

        value = ExtL.trim(value).toLowerCase();
        value = value.replace('$', '\\$');

        ExtL.removeChildNodes(apiCt);

        apiCt.appendChild(ExtL.createElement({
            "class": 'search-results-nav-header',
            cn: [{
                "class": 'active-tab',
                html: 'API Docs'
            }, {
                html: 'Guides'
            }]
        }));

        apiCt.appendChild(ExtL.createElement({
            "class": 'search-results-header',
            html: 'API Docs'
        }));

        for (;i < pageSize; i++) {
            rec = apiSearchRecords[start + i];

            if (rec) {
                cn = [{
                    "class": 'search-match',
                    html: rec.sortValue
                }, {
                    "class": 'search-source',
                    html: rec.classObj.n + (rec.byClassMember ? ('.' + rec.sortValue) : '')
                }];

                access = rec.access;

                meta = [{
                    "class": 'meta-access',
                    html: access === 'private' ? 'private' : (access === 'protected' ? 'protected' : 'public')
                }, {
                    "class": 'meta-type',
                    html: rec.byAlias ? 'alias' : (rec.byClass ? 'class' : rec.memberTypeDisp)
                }];

                if (rec.byClassMember && rec.meta) {
                    meta.push({
                        "class": 'meta-meta ' + rec.meta,
                        html: rec.meta
                    });
                }

                cn.push({
                    "class": (access === 'private' ? 'private' : (access === 'protected' ? 'protected' : 'public')) + ' search-item-meta-ct',
                    cn: meta
                });

                href = rec.classObj.n + '.html';

                href = rel + href;

                if (rec.byClassMember) {
                    if (rec.searchMatch[0] === 'z') {
                        // regarding the below replace()..
                        // The search list has entries for class + member searches, but really the member
                        // is the member only, not the concatenation of class name and member name
                        href += '#' + rec.memberType + '-' + rec.classObj[rec.searchMatch.replace(rec.classObj.n + '.', '')].t + '--' + rec.sortValue;
                    } else {
                        href += '#' + rec.memberType + '-' + rec.sortValue;
                    }
                }

                el = ExtL.createElement({
                    tag: 'a',
                    href: href,
                    "class": 'search-item',
                    cn: cn
                });

                apiCt.appendChild(el);
            }
        }

        addSearchPagingToolbar(apiCt, apiSearchRecords, page);

        re = new RegExp('(' + value.replace('$', '\\$') + ')', 'ig');

        for (i = 0; i < apiCt.childNodes.length; i++) {
            matchEl = apiCt.childNodes.item(i).querySelector('.search-match');
            matchSrc = apiCt.childNodes.item(i).querySelector('.search-source');

            if (matchEl) {
                matchEl.innerHTML = (matchEl.textContent || matchEl.innerText).replace(re, '<strong>$1</strong>');
            }
            if (matchSrc) {
                matchSrc.innerHTML = (matchSrc.textContent || matchSrc.innerText).replace(re, '<strong>$1</strong>');
            }
        }
    }

    function addSearchPagingToolbar (ct, records, page) {
        var isApi = ct.id === 'api-search-results',
            rowCount = ct.querySelectorAll(isApi ? '.search-item' : '.guide-search-item').length;

        if (rowCount) {
            // check to see if we have more results than we can display with the results
            // page size and if so add a nav footer with the current page / count
            if (records.length > pageSize) {
                ct.appendChild(ExtL.createElement({
                    "class": 'search-results-nav',
                    html: (pageSize * page - pageSize + 1) + ' - ' + (pageSize * page) + ' of ' + records.length,
                    cn: [{
                       "class": 'search-nav-first' + ((page === 1) ? ' disabled' : ''),
                        html: '«'
                    },{
                        "class": 'search-nav-back' + ((page === 1) ? ' disabled' : ''),
                        html: '◄'
                    }, {
                        "class": 'search-nav-forward' + ((records.length <= page * pageSize) ? ' disabled' : ''),
                        html: '►'
                    }, {
                        "class": 'search-nav-last' + ((records.length <= page * pageSize) ? ' disabled' : ''),
                        html: '»'
                    }]
                }));
            }
            if (isApi) {
                currentApiPage = page;
            } else {
                currentGuidePage = page;
            }
        } else {
            ct.appendChild(ExtL.createElement({
                "class": 'search-results-nav-header',
                cn: [{
                    "class": isApi ? 'active-tab no-results' : null,
                    html: 'API Docs'
                }, {
                    "class": !isApi ? 'active-tab no-results' : null,
                    html: 'Guides'
                }]
            }));

            ct.appendChild(ExtL.createElement({
                "class": 'search-results-not-found',
                html: 'No results found'
            }));
            currentApiPage = null;
            currentGuidePage = null;
        }
    }

    function hideSearchResults () {
        if (ExtL.hasCls(getSearchResultsCt(), 'show-search-results')) {
            hideMobileSearch();
        }
        ExtL.removeCls(getSearchResultsCt(), 'show-search-results');
    }

    function hideMobileSearch () {
        var input = ExtL.get('peekaboo-input');
        input.style.visibility = 'hidden';
    }

    function showMobileSearch () {
        var input = ExtL.get('peekaboo-input');

        input.style.visibility = 'visible';
        ExtL.get('mobile-input').focus();
    }

    function onBodyClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            searchText = ExtL.get('searchtext'),
            isSearchInput = target.id === 'searchtext',
            isSearchNav = ExtL.up(target, '.search-results-nav-header'),
            isPagingNav = ExtL.up(target, '.search-results-nav'),
            isProductMenu = ExtL.up(target, '#product-tree-ct'),
            isHistoryConfigPanel = ExtL.up(target, '#historyConfigPanel'),
            productMenu = ExtL.get('product-tree-ct'),
            rightMembers = ExtL.get('rightMembers'),
            treeVis  = ExtL.hasCls(document.body, 'tree-hidden'),
            width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (target.id != 'searchtext' && !isSearchNav && !isPagingNav) {
            hideSearchResults();
        } else {
            if (getSearchResultsCt().childNodes.length && searchText.value.length > 0) {
                showSearchResults();
            }
        }

        if (ExtL.hasCls(target, 'member-name') || ExtL.hasCls(target, 'collapse-toggle') || (ExtL.hasCls(e.srcElement, 'collapse-toggle'))) {
            onMemberCollapseToggleClick(target);
        }

        if (ExtL.hasCls(rightMembers, 'show-context-menu')) {
            if (!ExtL.hasCls(target, 'fa-cog') && !ExtL.hasCls(target, 'context-menu-ct') && !ExtL.up(target, '.context-menu-ct')) {
                ExtL.toggleCls(rightMembers, 'show-context-menu');
            }
        }

        if (!treeVis && width < 950 && !isProductMenu) {
            if (!ExtL.hasCls(target, 'fa-bars') && !ExtL.hasCls(target, 'class-tree') && !ExtL.up(target, '.class-tree')) {
                setTreeVisibility(false);
            }
        }

        if (!isProductMenu && !ExtL.hasCls(productMenu, 'hide')) {
            hideProductMenu();
        }

        if (!isHistoryConfigPanel && ExtL.hasCls(document.body, 'show-history-panel')) {
            hideHistoryConfigPanel();
        }

        if (!isSearchInput && ExtL.hasCls(document.body, 'show-search-history')) {
            hideSearchHistory();
        }
    }

    function onMobileInputBlur (e) {
        var target = e.relatedTarget,
            node = target,
            search = 'search-results-ct',
            isResult = false;

        while (node) {
            if (node.id===search) {
                isResult = true;
                break;
            }
            else {
                isResult = false;
            }

            node = node.parentNode;
        }

        if (!isResult) {
            hideMobileSearch();
        }
    }

    function onSearchEnter() {
        var ct = getSearchResultsCt(),
            first = ct.querySelector('.search-item');

        if (first) {
            doLogSearchValue();
            window.location.href = first.href;
            return false;
        }
    }

    function onSearchTab() {
        var ct = getSearchResultsCt(),
            first = ct.querySelector('.search-item');

        if (first) {
            first.focus();
        }
    }

    /**
     *
     */
    function onResultsCtClick (e) {
        var target, counter, item;
        e = e || window.event;
        target = e.target || e.srcElement;
        counter = ExtL.up(target, '#api-search-results') ? currentApiPage : currentGuidePage;
        item = ExtL.up(target, '.search-item');

        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (ExtL.hasCls(target, 'search-nav-first') && !ExtL.hasCls(target, 'disabled')) {
            if (ExtL.up(target, '#api-search-results')) {
                loadApiSearchPage(1);
            }
            if (ExtL.up(target, '#guide-search-results')) {
                loadGuideSearchPage(1);
            }
        } else if (ExtL.hasCls(target, 'search-nav-back') && !ExtL.hasCls(target, 'disabled')) {
            if (ExtL.up(target, '#api-search-results')) {
                loadApiSearchPage(counter - 1);
            }
            if (ExtL.up(target, '#guide-search-results')) {
                loadGuideSearchPage(counter - 1);
            }
        } else if (ExtL.hasCls(target, 'search-nav-forward') && !ExtL.hasCls(target, 'disabled')) {
            if (ExtL.up(target, '#api-search-results')) {
                loadApiSearchPage(counter + 1);
            }
            if (ExtL.up(target, '#guide-search-results')) {
                loadGuideSearchPage(counter + 1);
            }
        } else if (ExtL.hasCls(target, 'search-nav-last') && !ExtL.hasCls(target, 'disabled')) {
            if (ExtL.up(target, '#api-search-results')) {
                loadApiSearchPage(Math.ceil(apiSearchRecords.length/pageSize));
            }
            if (ExtL.up(target, '#guide-search-results')) {
                loadGuideSearchPage(Math.ceil(apiSearchRecords.length/pageSize));
            }
        } else if (ExtL.up(target, '.search-results-nav-header')) {
            toggleSearchTabs(e);
        } else if (item) {
            if (window.location.href === item.href) {
                onHashChange(true);
            }
            hideSearchResults();
            doLogSearchValue();
        }
    }

    /**
     * Returns the vertical scroll position of the page
     */
    function getScrollPosition() {
        var verticalPosition = 0,
            ieOffset = document.documentElement.scrollTop,
            target;

        if (isApi) {
            target = document.querySelector('.class-body-wrap')
        } else if (isGuide) {
            target = document.querySelector('.guide-body-wrap')
        } else {
            target = document.querySelector('.generic-content')
        }

        if (window.pageYOffset) {
            verticalPosition = window.pageYOffset;
        } else if (target.clientHeight) { //ie
            verticalPosition = target.scrollTop;
        } else if (document.body) { //ie quirks
            verticalPosition = target.scrollTop;
        }else {
            verticalPosition = ieOffset;
        }

        return verticalPosition;
    }

    /**
     * Listen to the scroll event and show / hide the "scroll to top" element
     * depending on the current scroll position
     */
    function monitorScrollToTop() {
        var vertical_position = getScrollPosition();

        ExtL.toggleCls(ExtL.get('back-to-top'), 'sticky', vertical_position > 345);
        ExtL.toggleCls(document.body, 'sticky', vertical_position > 345);
    }

    /**
     * Highlight the member nav button in the top nav toolbar when that section is
     * scrolled up against the top nav toolbar
     */
    function highlightTypeMenuItem() {
        var memberTypesEl = ExtL.get('toolbar'),
            memberTypeButtons = memberTypesEl.querySelectorAll('div.toolbarButton'),
            memberTypeLen = memberTypeButtons.length,
            memberTypesBottom = memberTypesEl.getBoundingClientRect().bottom,
            typeHeaders = document.querySelectorAll('h2.type'),
            len = typeHeaders.length,
            activeCls = 'active-type-menu-item',
            i = 0,
            item, itemTop, activeItem, activeButtonEl;

        // find the active type header by whichever scrolled above the nav header last
        for (; i < len; i++) {
            item = typeHeaders.item(i);
            itemTop = item.getBoundingClientRect().top;

            if (item.offsetHeight && (itemTop < memberTypesBottom + 7)) {
                activeItem = item;
            }
        }

        // remove the activeCls from all nav buttons
        i = 0;
        for (; i < memberTypeLen; i++) {
            ExtL.removeCls(ExtL.up(memberTypeButtons.item(i), 'a'), activeCls);
        }
        // and then decorate the active one
        if (activeItem) {
            activeButtonEl = ExtL.get(activeItem.id + '-button-link');
            ExtL.addCls(activeButtonEl, activeCls);
        }
    }

    /**
     * @private
     */
    function createWrapper(ct, selector, id, title) {
        var items = ct.querySelectorAll(selector),
            wrap, header, textEl, i, len;

        len = items.length;
        if (len) {
            wrap = document.createElement('div');
            wrap.id = id;
            header = document.createElement('div');
            header.className = 'type-sub-category-title';
            textEl = document.createTextNode(title);
            header.appendChild(textEl);
            wrap.appendChild(header);
            ct.insertBefore(wrap, items.item(0));

            for (i = 0; i < len; i++) {
                wrap.appendChild(items.item(i));
            }
        }
    }

    /**
     *
     */
    function wrapSubCategories() {
        var propertiesCt = ExtL.get('properties-ct'),
            methodsCt    = ExtL.get('methods-ct'),
            configsCt    = ExtL.get('configs-ct');

        if (propertiesCt) {
            createWrapper(propertiesCt, 'div.isNotStatic', 'instance-properties-ct', 'Instance Properties');
            createWrapper(propertiesCt, 'div.isStatic', 'static-properties-ct', 'Static Properties');
        }

        if (methodsCt) {
            createWrapper(methodsCt, 'div.isNotStatic', 'instance-methods-ct', 'Instance Methods');
            createWrapper(methodsCt, 'div.isStatic', 'static-methods-ct', 'Static Methods');
        }

        if (configsCt) {
            createWrapper(configsCt, 'div.isNotRequired', 'optional-configs-ct', 'Optional Configs');
            createWrapper(configsCt, 'div.isRequired', 'required-configs-ct', 'Required Configs');
        }
    }


    function onClickMemberMenuType() {
        toggleMemberTypesMenu();
    }

    /**
     * Toggles visibility of member type menu
     */
    function toggleMemberTypesMenu() {
        var menu = ExtL.get('member-types-menu'),
            showCls = 'menu-visible',
            hasCls = ExtL.hasCls(menu, showCls);

        ExtL[hasCls ? 'removeCls' : 'addCls'](menu, showCls);
    }

    /**
     * Apply an ace editor to all elements with the 'ace-ct' class designation.
     */
    function applyAceEditors () {
        var aceTargets = document.getElementsByClassName('ace-ct'),
            len = aceTargets.length,
            runButtons = document.getElementsByClassName('da-inline-fiddle-nav-fiddle'),
            buttonsLen = runButtons.length,
            codeButtons = document.getElementsByClassName('da-inline-fiddle-nav-code'),
            beautifyButtons = ExtL.fromNodeList(document.getElementsByClassName('fiddle-code-beautify')),
            invisibles = document.getElementsByClassName('invisible'),
            codeBtnsLen = codeButtons.length,
            i = 0,
            editor;

        for (; i < len; i++) {
            editor = ace.edit(aceTargets[i]);
            editor.setTheme("ace/theme/chrome");
            editor.getSession().setMode("ace/mode/javascript");
            if (ExtL.isIE8() || ExtL.isIE9()) {
                editor.getSession().setOption("useWorker", false);
            }
            editor.setShowPrintMargin(false);
        }

        for (i = 0; i < buttonsLen; i++) {
            runButtons[i].onclick = onRunFiddleClick;
        }

        for (i = 0; i < codeBtnsLen; i++) {
            codeButtons[i].onclick = onCodeFiddleClick;
        }

        ExtL.each(beautifyButtons, function (btn) {
            btn.onclick = onBeautifyClick;
        });

        for (i = invisibles.length; i-- > 0;) {
            ExtL.removeCls(invisibles[i], 'invisible');
        }

        if (ExtL.isIE8()) {
            ExtL.each(ExtL.fromNodeList(aceTargets), function (ct) {
                var editor = ace.edit(ct),
                    beautified = js_beautify(editor.getValue());

                editor.setValue(beautified.toString(), -1);
            });
        }
    }

    /**
     * Run fiddle button handler
     * @param {Event} e The click event
     */
    function onRunFiddleClick (e) {
        e = e || window.event;
        var fiddle = e.target || e.srcElement,
            wrap = ExtL.up(fiddle, '.da-inline-code-wrap'),
            editor = ace.edit(wrap.querySelector('.ace-ct').id),
            code = editor.getValue(),
            cached = wrap.code;

        if (code === cached) {
            // if the fiddle tab's not already active activate it
            if (!ExtL.hasCls(wrap.querySelector('.da-inline-fiddle-nav-fiddle'), 'da-inline-fiddle-nav-active')) {
                showFiddle(wrap);
            } else {
                setTimeout(function () {
                    runFiddleExample(wrap);
                    disableFiddleNav(wrap);
                }, 1);
            }
            return;
        } else {
            wrap.code = code;
        }

        if (wrap && !ExtL.hasCls(wrap, 'disabled')) {
            showFiddle(wrap);
            setTimeout(function () {
                runFiddleExample(wrap);
                disableFiddleNav(wrap);
            }, 1);
        }
    }

    function onCodeFiddleClick (e) {
        e = e || window.event;
        var code = e.target || e.srcElement,
            wrap = ExtL.up(code, '.da-inline-code-wrap'),
            isActive = ExtL.hasCls(code, 'da-inline-fiddle-nav-active');

        if (wrap && !ExtL.hasCls(wrap, 'disabled') && !isActive) {
            hideFiddle(wrap);
        }
    }

    function onBeautifyClick (e) {
        e = e || window.event;
        var code = e.target || e.srcElement,
            wrap = ExtL.up(code, '.da-inline-code-wrap'),
            editor = ace.edit(wrap.querySelector('.ace-ct').id),
            beautified = js_beautify(editor.getValue());

        editor.setValue(beautified.toString(), -1);
    }

    function disableFiddleNav (wrap) {
        ExtL.addCls(wrap, 'disabled');
    }

    function enableFiddleNav (wrap) {
        ExtL.removeCls(wrap, 'disabled');
    }

    function showFiddle (wrap) {
        var codeNav = wrap.querySelector('.da-inline-fiddle-nav-code'),
            fiddleNav = wrap.querySelector('.da-inline-fiddle-nav-fiddle');

        ExtL.addCls(wrap, 'show-fiddle');
        ExtL.toggleCls(codeNav, 'da-inline-fiddle-nav-active');
        ExtL.toggleCls(fiddleNav, 'da-inline-fiddle-nav-active');
    }

    function hideFiddle (wrap) {
        var codeNav = wrap.querySelector('.da-inline-fiddle-nav-code'),
            fiddleNav = wrap.querySelector('.da-inline-fiddle-nav-fiddle');

        ExtL.removeCls(wrap, 'show-fiddle');
        ExtL.toggleCls(codeNav, 'da-inline-fiddle-nav-active');
        ExtL.toggleCls(fiddleNav, 'da-inline-fiddle-nav-active');
    }

    /**
     * Runs the fiddle example
     * @param {Element} wrap The element housing the fiddle and fiddle code
     */
    function runFiddleExample (wrap) {
        var editor  = ace.edit(wrap.querySelector('.ace-ct').id),
            meta    = JSON.parse(wrap.getAttribute('data-fiddle-meta')),
            intro   = "Ext.application({\n    name: 'Fiddle',\n\n    launch: function() {\n\n",
            outro   = "}\n});",
            iframe  = getIFrame(wrap),
            dash    = (pversion && pversion.indexOf('-') > -1),
            //ver     = dash ? pversion.substring(0, dash) : pversion,
            toolkit = (myToolkit && dash) ? pversion.substr(dash + 1) : false,
            codes   = [
                {
                    type : 'js',
                    name : 'app.js',
                    code : intro + editor.getValue() + outro
                },
                {
                    type : 'js',
                    name : 'ux-build.js',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/ux/' + toolkit + '/ux-debug.js' : '../../https@{frameworkpath}/build/packages/ext-ux/build/ext-ux-debug.js'
                },
                {
                    type : 'js',
                    name : 'google-build.js',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/google/' + toolkit + '/google-debug.js' : ''
                },
                {
                    type : 'js',
                    name : 'd3-build.js',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/d3/' + toolkit + '/d3-debug.js' : ''
                },
                {
                    type : 'css',
                    name : 'd3-classic-build.css',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/d3/' + toolkit + '/classic/resources/d3-all-debug.css' : ''
                },
                {
                    type : 'css',
                    name : 'd3-crisp-build.css',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/d3/' + toolkit + '/crisp/resources/d3-all-debug.css' : ''
                },
                {
                    type : 'css',
                    name : 'd3-neptune-build.css',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/d3/' + toolkit + '/neptune/resources/d3-all-debug.css' : ''
                },
                {
                    type : 'css',
                    name : 'd3-triton-build.css',
                    code : toolkit ? '../../https@{frameworkpath}/build/packages/d3/' + toolkit + '/triton/resources/d3-all-debug.css' : ''
                }
            ],
            data   = {
                framework : meta,
                codes     : {
                    codes : codes
                }
            },
            form   = buildForm(iframe.id, data),
            mask = wrap.appendChild(ExtL.createElement({
                "class": 'fiddle-mask'
            }));

        if (!ExtL.isIE8() && !ExtL.isIE9()) {
            mask.appendChild(ExtL.createElement({
                "class": 'spinner'
            }));
        }

        iframe.onload = function () {
            if (form && form.parentNode) {
                form.parentNode.removeChild(form);
            }
            wrap.removeChild(wrap.querySelector('.fiddle-mask'));
            enableFiddleNav(wrap);
        };

        form.submit();
    }

    /**
     * @private
     * Used by the runFiddleExample method.  Builds / returns an iframe used to run
     * the fiddle code.
     * @param {Element} wrap The element wrapping the fiddle and fiddle code
     * @return {Element} The iframe used for the anonymous fiddle
     */
    function getIFrame (wrap) {
        var iframe = wrap.querySelector('iframe');

        if (!iframe) {
            iframe = document.createElement('iframe');

            iframe.id = iframe.name = id(); //needs to be unique on whole page

            wrap.appendChild(iframe);
        }

        return iframe;
    }

    /**
     * @private
     * Used by the runFiddleExample method.  Appends a form to the body for use by the
     * anonymous fiddle examples.
     * @param {String} target The ID of the target fiddle iframe
     * @param {Array} params Array of form input fields
     * @return {Element} The form used the submit the fiddle code to the fiddle server
     */
    function buildForm (target, params) {
        var form = ExtL.createElement({
            tag    : 'form',
            role   : 'presentation',
            action : '../../https@fiddle.sencha.com/run@dc=' + new Date().getTime(),
            method : 'POST',
            target : target,
            style  : 'display:none'
        });

        ExtL.each(params, function (key, val) {
            if (ExtL.isArray || ExtL.isObject) {
                //val = ExtL.htmlEncode(JSON.stringify(val));
                val = JSON.stringify(val);
            }

            form.appendChild(ExtL.createElement({
                tag: 'input',
                type: 'hidden',
                name: key,
                value: val
            }));
        });

        document.body.appendChild(form);

        return form;
    }


    function getMemberTypeMenu () {
        var menu = ExtL.get('memberTypeMenu'),
            eventAdd;

        if (!menu) {
            menu = ExtL.createElement({
                id: 'memberTypeMenu'
            });
            document.body.appendChild(menu);

            addEventsAndSetMenuClose(menu, 'mouseenter', false);
            addEventsAndSetMenuClose(menu, 'mouseleave', true);

            ExtL.monitorMouseLeave(menu, 200, hideMemberTypeMenu);

        }

        return menu;
    }

    function showMemberTypeMenu (e) {
        e = e || window.event;
        var menu = getMemberTypeMenu(),
            target = e.target || e.ssrcElement,
            targetBox = target.getBoundingClientRect(),
            membersBox = ExtL.get('class-body-wrap').getBoundingClientRect(),
            height = (membersBox.bottom - membersBox.top) - 4,
            maxWidth = (membersBox.right - membersBox.left) - 4,
            targetId = target.id.replace('-nav-btn', ''),
            targetCt = ExtL.get(targetId + '-ct'),
            memberList = ExtL.fromNodeList(targetCt.querySelectorAll('.classmembers')),
            memberLen = memberList.length,
            i = 0,
            eligMembers = [],
            cols = [],
            tallest = 0,
            configsCt, rows, maxCols, maxLiteralWidth, useMembersWidth, width, left, colCount, rowCount, j, col, explicitAccessors;

        targetBox = target.getBoundingClientRect();
        menuCanClose = false;

        if (targetId === 'methods') {
            configsCt = ExtL.get('configs-ct');

            if (configsCt) {
                explicitAccessors = ExtL.fromNodeList(configsCt.querySelectorAll('.explicit-accessor-method'));
                if (explicitAccessors.length) {
                    memberList = memberList.concat(explicitAccessors);
                }
            }
        }

        ExtL.removeChildNodes(menu);

        ExtL.each(memberList, function (item) {
            var cn = [],
                link, memberObj, name, memberTagsCt;

            // ignore any methods that have been hoisted into the configs section or are
            // hidden
            if (item.offsetHeight && item.id.indexOf('placeholder') !== 0) {
                link = item.querySelector('[data-ref]');
                name = ExtL.trim(link.textContent || link.innerText);
                memberObj = {
                    tag: 'a',
                    html: name,
                    title: name,
                    href: '#' + link.getAttribute('data-ref'),
                    sortName: name,
                    sortPriority: 0
                };

                if (targetId === "configs" && (ExtL.hasCls(item, "accessor-method") || ExtL.hasCls(item.parentNode, "accessor-method"))) {
                    memberObj["class"] = "accessor";
                    memberObj.sortName = ExtL.up(item, '.classmembers').getAttribute('data-member-name');
                    if (ExtL.hasCls(item, 'isGetter')) {
                        memberObj.sortPriority = 1;
                    }
                    if (ExtL.hasCls(item, 'isSetter')) {
                        memberObj.sortPriority = 2;
                    }
                }

                memberTagsCt = item.querySelector('.member-tags');
                if (memberTagsCt) {
                    if (memberTagsCt.querySelector('.private')) {
                        cn.push({
                            html: 'pri',
                            "class": 'private member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.protected')) {
                        cn.push({
                            html: 'pro',
                            "class": 'protected member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.required')) {
                        cn.push({
                            html: 'req',
                            "class": 'required member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.deprecated')) {
                        cn.push({
                            html: 'dep',
                            "class": 'deprecated member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.removed')) {
                        cn.push({
                            html: 'rem',
                            "class": 'removed member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.static')) {
                        cn.push({
                            html: 'sta',
                            "class": 'static member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.readonly')) {
                        cn.push({
                            html: 'ro',
                            "class": 'readonly member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.template')) {
                        cn.push({
                            html: 'tpl',
                            "class": 'template member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.abstract')) {
                        cn.push({
                            html: 'abs',
                            "class": 'abstract member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.chainable')) {
                        cn.push({
                            html: '>',
                            "class": 'chainable member-menu-flag'
                        });
                    }

                    if (memberTagsCt.querySelector('.bindable')) {
                        cn.push({
                            html: 'bind',
                            "class": 'bindable member-menu-flag'
                        });
                    }
                }

                if (cn.length) {
                    memberObj.cn = cn;
                }

                eligMembers.push(memberObj);
            }
        });

        // sort all of the members by name
        // - for configs with getter / setters we'll also then sort by priority
        //   where the config will be sorted with all other configs and if it has a
        //   getter it will follow the config and a setter would then follow before
        //   proceeding with the natural sort order
        eligMembers.sort(function (a, b) {
            var aName = a.sortName,
                bName = b.sortName,
                aPriority = a.sortPriority,
                bPriority = b.sortPriority;

            if (aName < bName) {
                return -1;
            } else if (aName > bName) {
                return 1;
            } else {
                if (aPriority < bPriority) {
                    return -1;
                } else if (aPriority > bPriority) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        ExtL.each(eligMembers, function (member, i, arr) {
            arr[i] = ExtL.createElement(member);
        });

        rows = parseInt((height - 34) / 20);
        maxCols = Math.ceil(eligMembers.length / rows);
        maxLiteralWidth = (maxCols * 300) + 4;
        useMembersWidth = maxLiteralWidth > maxWidth;
        width = useMembersWidth ? maxWidth : maxLiteralWidth;

        if (useMembersWidth) {
            left = membersBox.left;
        } else {
            left = targetBox.left;
            // constrain to the right side of the members container
            if (left + width > (membersBox.right)) {
                left = left - ((left + width + 4) - (membersBox.right));
            }
            // constrain to the left side of the members container
            if (left < (membersBox.left)) {
                left = membersBox.left;
            }
        }

        ExtL.applyStyles(menu, {
            width: width + 'px',
            height: height + 'px',
            left: left + 'px',
            top: membersBox.top + 'px'
        });

        colCount = Math.floor(width / 300);

        for (i = 0; i < colCount; i++) {
            col = ExtL.createElement({
                "class": 'member-menu-col',
                style: 'left:' + (i * 300) + 'px;'
            });
            cols.push(col);

            rowCount = eligMembers.length / (colCount - i);

            for (j = 0; j < rowCount; j++) {
                col.appendChild(eligMembers.shift());
            }

            tallest = col.childNodes.length * 20 > tallest ? col.childNodes.length * 20 : tallest;
        }

        tallest = tallest + 37;

        if (tallest < height) {
            ExtL.applyStyles(menu, {
                height: tallest + 'px'
            });
        }

        ExtL.each(cols, function (c) {
            menu.appendChild(c);
        });

        if (rowCount) {
            ExtL.addCls(menu, 'show-menu');
        } else {
            menuCanClose = true;
            hideMemberTypeMenu();
        }
    }

    /**
     *
     */
    function hideMemberTypeMenu (e) {
        var menu = getMemberTypeMenu();

        if (menuCanClose) { // menuCanClose is a closure variable
            ExtL.removeCls(menu, 'show-menu');
        }
    }

    /**
     * Handles the expanding / collapsing of members on click
     * @param {HTMLElement} collapseEl The collapse / expand toggle element
     */
    function onMemberCollapseToggleClick(collapseEl) {
        var member = ExtL.up(collapseEl, '.classmembers');

        ExtL.toggleCls(member, 'member-expanded');
    }

    /**
     *
     */
    var addHighlight, removeHighlight;
    function highlightMemberRow (target) {
        var highlightCls = 'member-highlight',
            fadeCls = 'member-highlight-fade';

        if (addHighlight) {
            clearTimeout(addHighlight);
        }
        if (removeHighlight) {
            clearTimeout(removeHighlight);
        }
        ExtL.each(ExtL.fromNodeList(document.getElementsByClassName(highlightCls)), function (row) {
            ExtL.removeCls(row, highlightCls);
            ExtL.removeCls(row, fadeCls);
        });

        ExtL.addCls(target, highlightCls);
        addHighlight = setTimeout(function () {
            ExtL.addCls(target, fadeCls);
            removeHighlight = setTimeout(function () {
                ExtL.removeCls(target, highlightCls);
                ExtL.removeCls(target, fadeCls);
            }, 1401);
        }, 400);
    }

    /**
     *
     */
    function isMobile () {
        return getViewportSize().width < 950;
    }

    /**
     *
     */
    function initHistory () {
        saveState();

        var history = getHistory(),
            nav = ExtL.get('history-nav'),
            path = window.location.pathname,
            list = ExtL.get('history-full-list');

        nav.appendChild(ExtL.createElement({
            tag: 'span',
            html: 'History:',
            "class": 'history-title'
        }));
        if (history && history.length) {
            history.reverse();
            ExtL.each(history, function (item) {
                var current = (item.product === product && item.pversion === pversion && item.text === ExtL.htmlDecode(ExtL.htmlDecode(pageName)) && item.path === path),
                    other = (item.product !== product || item.pversion !== pversion),
                    badge = ExtL.isIE8() ? '' : ' ' + item.product + '-badge badge';

                nav.appendChild(ExtL.createElement({
                    tag: 'a',
                    //html: item.text,
                    "class": 'tooltip tooltip-tl-bl history-btn' + (other ? ' history-other' : ''),
                    href: item.path,
                    style: current ? 'display: none;' : null,
                    'data-tip': item.title + ' ' + item.pversion,
                    //insertBefore: true,
                    cn: [{
                        tag: 'span',
                        html: item.title + ' ' + item.pversion + ' | ',
                        "class": 'history-meta'
                    }, {
                        tag: 'span',
                        html: item.text
                    }, {
                        "class": 'callout callout-bl'
                    }]
                }));

                list.appendChild(ExtL.createElement({
                    tag: 'a',
                    //html: item.text,
                    "class": 'tooltip tooltip-tr-br history-item' + (other ? ' history-other' : '') + badge,
                    href: item.path,
                    style: current ? 'display: none;' : null,
                    //'data-tip': item.title + ' ' + item.pversion,
                    //insertBefore: true,
                    cn: [{
                        tag: 'div',
                        html: item.text
                    }, {
                        tag: 'div',
                        html: item.title + ' ' + item.pversion,
                        "class": 'history-meta'
                    }]
                }));
            });
        }
    }

    /**
     *
     */
    function getHistory () {
        if (!ExtL.canLocalStorage()) {
            return false;
        }

        var saved = ExtL.decodeValue(localStorage.getItem('htmlDocsState')) || {};

        return saved.history;
    }

    // page kickoff - apply state
    ExtL.bindReady(function () {
        var productId, branches, treeCt;

        //fetchState(true);
        //if (isLanding) {
            resizeHandler();
        //}
        wrapSubCategories();

        ExtL.removeCls(ExtL.get('tree-header'), 'pre-load');

        fetchState(true);

        if (hasClassTemplate) {
            // force a scroll response at load for browsers that don't fire the scroll
            // event themselves initially
            filterByAccess();
            handleScroll();
            initMemberTypeMouseoverHandlers();
            copyRelatedClasses();
            if (window.location.hash) {
                onHashChange(true);
            }

            // handle all window scroll events
            document.querySelector('.class-body-wrap').onscroll = handleScroll;
        }
        if (isHome) {
            document.querySelector('.generic-content').onscroll = handleScroll;
        }
        if (isGuide) {
            copyTOC();
            document.querySelector('.guide-body-wrap').onscroll = handleScroll;
        }

        if (!hasApi) {
            ExtL.addCls(ExtL.get('apiTab'), 'hide');
        }
        if (!hasGuides) {
            ExtL.addCls(ExtL.get('guideTab'), 'hide');
        }

        treeCt = ExtL.get('tree');
        if (treeCt && treeCt.firstChild) {
            tree = new TreeView(null, 'tree', homePath);
            treeCt.myTree = tree;
            tree.expandTo(pageName, singleton ? 'singleton' : 'node');
            branches = treeCt.querySelectorAll('.isNotLeaf');
            if (branches.length) {
                ExtL.removeCls(treeCt.querySelector('.toggle-tree'), 'hide');
            }
            if (singleton) {
                tree.expand('singleton' + '-' + pageName.toLowerCase().replace(/\./g, '-'), null, true);
            }
        } else {
            ExtL.addCls(ExtL.get('apiTab'), 'hidden');
        }

        treeCt = ExtL.get('guide-tree');
        if (treeCt && treeCt.firstChild) {
            guideTree = new TreeView(null, 'guide-tree', homePath + 'guides/');
            treeCt.myTree = guideTree;
            guideTree.expandTo(specificId);
            branches = treeCt.querySelectorAll('.isNotLeaf');
            if (branches.length) {
                ExtL.removeCls(treeCt.querySelector('.toggle-tree'), 'hide');
            }
        } else {
            ExtL.addCls(ExtL.get('guideTab'), 'hidden');
        }

        treeCt = ExtL.get('quick-start-tree');
        if (treeCt && treeCt.firstChild) {
            quickStartTree = new TreeView(null, 'quick-start-tree', homePath + 'guides/');
            treeCt.myTree = quickStartTree;
            quickStartTree.expandTo(specificId);
        } else {
            if (ExtL.get('quickStartTab')) {
                ExtL.addCls(ExtL.get('quickStartTab'), 'hidden');
            }
        }

        eventsEl = ExtL.get('guideTab');
        if (eventsEl) {
            ExtL.on(eventsEl, 'click', toggleNavTab);
        }
        eventsEl = ExtL.get('apiTab');
        if (eventsEl) {
            ExtL.on(eventsEl, 'click', toggleNavTab);
        }
        eventsEl = ExtL.get('quickStartTab');
        if (eventsEl) {
            ExtL.on(eventsEl, 'click', toggleNavTab);
        }

        eventsEl = ExtL.get('filterTab');
        if (eventsEl) {
            ExtL.on(eventsEl, 'click', toggleContextTab);
        }

        eventsEl = ExtL.get('relatedClassesTab');
        if (eventsEl) {
            ExtL.on(eventsEl, 'click', toggleContextTab);
        }

        eventsEl = ExtL.get('searchtext');
        if (eventsEl) {
            ExtL.on(eventsEl, 'keyup', searchFilter);
            ExtL.on(eventsEl, 'keydown', searchFilter);
            ExtL.on(eventsEl, 'focus', showSearchHistory);
        }

        eventsEl = ExtL.get('mobile-input');
        ExtL.on(eventsEl, 'keyup', searchFilter);
        ExtL.on(eventsEl, 'keydown', searchFilter);
        ExtL.on(eventsEl, 'blur', onMobileInputBlur);

        eventsEl = null;

        // keep the body click handler from processing
        getSearchResultsCt().onclick = onResultsCtClick;

        initEventHandlers();
        fetchState(true);

        allowSave = true;

        initHistory();

        applyAceEditors();
    });







    /**
     * ***********************************
     * EVENT HANDLERS SECTION
     * ***********************************
     */

    /*
     * Show / hide the help page
     */
    function toggleHelp () {
        ExtL.toggleCls(document.body, 'show-help');
    }

    /**
     * Scroll to the top of the document (no animation)
     */
    function setScrollPos(e, pos) {
        var el = isApi ? '.class-body-wrap' : (isGuide ? '.guide-body-wrap' : '.generic-content')
        pos = pos || 0;

        e = e || window.event;
        if(e && e.preventDefault) {
            e.preventDefault();
        }

        document.querySelector(el).scrollTop = pos;
        return false;
    }

    /**
     * Handles expand all click
     */
    function onToggleAllClick(e) {
        var memberList  = ExtL.fromNodeList(document.querySelectorAll('.classmembers')),
            symbText    = ExtL.get('toggleAll'),
            isCollapsed = ExtL.hasCls(symbText, 'fa-plus'),
            itemAction  = isCollapsed ? 'addCls' : 'removeCls';

        ExtL.each(memberList, function (item) {
            ExtL[itemAction](item, 'member-expanded');
        });

        ExtL.removeCls(symbText, isCollapsed ? 'fa-plus' : 'fa-minus');
        ExtL.addCls(symbText, isCollapsed ? 'fa-minus' : 'fa-plus');
    }

    function onToggleExampleClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            targetEl = ExtL.hasCls(target, 'example-collapse-target') || ExtL.up(target, '.example-collapse-target');

        ExtL.toggleCls(targetEl, 'example-collapsed');
        if (ExtL.isIE8()) {
            ExtL.toggleCls(document.body, 'placebo');
        }
    }

    function onToggleExamplesClick () {
        var body = document.querySelector('body'),
            collapsed = ExtL.hasCls(body, 'collapse-code-all');

        toggleExamples(!collapsed);
        saveState();
    }

    /**
     * Collapse or expand all code / fiddle blocks
     * @param {Boolean} collapse True to collapse, false to expand, or null to toggle all
     * code / fiddle blocks
     */
   function toggleExamples (collapse) {
        var body = document.querySelector('body'),
            collapseCls = 'collapse-code-all',
            collapsed = ExtL.hasCls(body, collapseCls),
            doCollapse = ExtL.isEmpty(collapse) ? !collapsed : collapse,
            action = doCollapse ? 'addCls' : 'removeCls';

        ExtL[action](body, collapseCls);
        ExtL.each(ExtL.fromNodeList(document.getElementsByClassName('example-collapse-target')), function (ex) {
            ExtL[action](ex, 'example-collapsed');
        });
    }

    /**
     * Handles search icon click
     */
    function onSearchIconClick() {
        showMobileSearch();
    }

    /**
     * Handles the click of the toggle class tree button, don't save state
     */
    function onToggleClassTreeClickNoState() {
        //if (isLanding) {
            //toggleProductMenu();
        //} else {
            toggleTreeVisibility();
        //}
    }

    /**
     *
     */
    function toggleTreeExpand (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            treeCt = ExtL.up(target, '.is-tree'),
            branches = ExtL.fromNodeList(treeCt.querySelectorAll('.isNotLeaf')),
            tree = treeCt.myTree,
            isExpanded = ExtL.hasCls(treeCt, 'is-expanded');

        ExtL.each(branches, function (node) {
            tree[isExpanded ? 'collapse' : 'expand'](node);
        });

        ExtL.toggleCls(treeCt, 'is-expanded');
    }
    /**
     * Handles the click of the toggle class tree button
     */
    function onToggleClassTreeClick() {
        toggleTreeVisibility();

        if (isStateful) {
            saveState();
        }
    }

    /**
     *
     */
    function onProductMenuItemClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            ct = ExtL.up(target, '#product-tree-ct'),
            prodId = target.id.substr("product-menu-".length),
            items = ExtL.fromNodeList(ct.querySelectorAll('.product-name-item')),
            versionCts = ExtL.fromNodeList(ct.querySelectorAll('.product-version-ct'));

        ExtL.each(items, function (item) {
            ExtL[item === target ? 'addCls' : 'removeCls'](item, 'prod-menu-selected');
        });

        ExtL.each(versionCts, function (verCt) {
            ExtL[ExtL.hasCls(verCt, prodId) ? 'removeCls' : 'addCls'](verCt, 'hide');
        });
    }

    /**
     *
     */
    function onClassTreeCtClick (e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
            href = target.href;

        if (href && isMobile()) {
            setTreeVisibility(false);
        }
    }

    /**
     *
     */
    function showHistoryConfigPanel (e) {
        e = e || window.event;

        var panel = ExtL.get('historyConfigPanel'),
            btn = ExtL.get('history-config'),
            btnBox = btn.getBoundingClientRect();

        stopEvent(e);

        ExtL.addCls(document.body, 'show-history-panel');

        ExtL.applyStyles(panel, {
            top: btnBox.bottom + 'px',
            //height: height + 'px',
            left: (btnBox.right - panel.clientWidth) + 'px'
        });
    }

    /**
     *
     */
    function hideHistoryConfigPanel () {
        ExtL.removeCls(document.body, 'show-history-panel');
    }

    /**
     *
     */
    function setHistoryType () {
        var all = ExtL.get('historyTypeAll').checked;

        ExtL.toggleCls(document.body, 'show-all-history', all);
        saveState();
    }

    /**
     *
     */
    function onToggleHistoryLabels () {
        var cb = ExtL.get('history-all-labels');

        ExtL.toggleCls(document.body, 'show-history-labels', cb.checked);
        saveState();
    }

    /**
     *
     */
    function clearHistory () {
        var historyItems = ExtL.fromNodeList(ExtL.get('history-full-list').childNodes),
            historyBtns = ExtL.fromNodeList(ExtL.get('history-nav').querySelectorAll('.history-btn'));

        if (ExtL.canLocalStorage()) {
            getState().history = [];
            saveState();
        }

        ExtL.each(historyItems, function (item) {
            item.parentNode.removeChild(item);
        });

        ExtL.each(historyBtns, function (btn) {
            btn.parentNode.removeChild(btn);
        });
    }

    /**
     * Handles the click of the hide class tree button
     */
    function onHideClassTreeClick() {
        var makeVisible = ExtL.hasCls(document.body, 'tree-hidden');

        setTreeVisibility(makeVisible);

        if (isStateful) {
            saveState();
        }
    }

    /**
     * Shows/hides the product / version menu
     */
    /*function toggleProductMenu () {
        var body = document.body,
            productTreeCt = ExtL.get('product-tree-ct');

        ExtL.toggleCls(productTreeCt, 'hide');

        if (ExtL.hasCls(body, 'tree-hidden')) {
            setTreeVisibility(true);
            ExtL.addCls(productTreeCt, 'was-collapsed')
        } else if (ExtL.hasCls(productTreeCt, 'was-collapsed')) {
            ExtL.removeCls(productTreeCt, 'was-collapsed');
            setTreeVisibility(false);
        }
    }*/

    /**
     *
     */
    function stopEvent (e) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        e.cancelBubble = true;  // IE events
        e.returnValue = false;  // IE events
    }

    /**
     * Shows the product menu
     */
    function showProductMenu (e) {
        var productTreeCt = ExtL.get('product-tree-ct');

        if (ExtL.hasCls(productTreeCt, 'hide')) {
            stopEvent(e);
        }

        ExtL.removeCls(productTreeCt, 'hide');
        positionProductMenu();
    }

    /**
     * Positions the product menu next to the show product menu button.  The height and
     * position are constrained to the viewport.
     */
    function positionProductMenu () {
        var productTreeCt = ExtL.get('product-tree-ct'),
            btns = ExtL.fromNodeList(document.querySelectorAll('.product-menu-btn')),
            vpSize = getViewportSize(),
            defaultHeight = 450,
            btn, btnBox, heightAvail, height, vpOffset;

        ExtL.each(btns, function (el) {
            btn = el.offsetHeight ? el : btn;
        });

        if (btn) {
            btnBox = btn.getBoundingClientRect();
            heightAvail = vpSize.height - btnBox.bottom;
            height = heightAvail < defaultHeight ? heightAvail - 10 : defaultHeight;
            vpOffset = (btnBox.left + ExtL.getWidth(productTreeCt)) - vpSize.width;

            ExtL.applyStyles(productTreeCt, {
                top: btnBox.bottom + 'px',
                height: height + 'px',
                left: ((vpOffset > 0) ? (btnBox.left - vpOffset) : btnBox.left) + 'px'
            });
        } else {
            hideProductMenu();
        }
    }

    /**
     * Hides the product menu
     */
    function hideProductMenu () {
        var productTreeCt = ExtL.get('product-tree-ct');

        ExtL.addCls(productTreeCt, 'hide');
    }

    /**
     * Closes / hides the product / version tree
     */
    function onProductTreeCloseClick () {
        var productTreeCt = ExtL.get('product-tree-ct');

        ExtL.addCls(productTreeCt, 'hide');

        if (ExtL.hasCls(productTreeCt, 'was-collapsed')) {
            ExtL.removeCls(productTreeCt, 'was-collapsed');
            setTreeVisibility(false);
        }
    }

    /**
     *
     */
    function toggleContextMenu () {
        var rightMembers = ExtL.get('rightMembers'),
            mainEdgeMenu = ExtL.get('class-tree-ct');

        if (mainEdgeMenu.style.left !== "0px") {
            var t = getScrollPosition();
            ExtL.toggleCls(rightMembers, 'show-context-menu');
            setScrollPos(null, t);

        }
    }

    /**
     *
     */
    function toggleSearchTabs (e) {
        e = e || window.event;
        var apiResults = ExtL.get('api-search-results'),
            guideResults = ExtL.get('guide-search-results'),
            elem, type;

        if (e.srcElement) {
            elem = e.srcElement;
        }  else if (e.target) {
            elem = e.target;
        }

        if (ExtL.hasCls(elem, 'active-tab')) {
            return;
        }

        type = ExtL.up('#api-search-results') ? 'api' : 'guide';
        ExtL.toggleCls(apiResults, 'isHidden');
        ExtL.toggleCls(guideResults, 'isHidden');
    }

    /**
     * Do all of the scroll related actions
     */
    function handleScroll() {
        monitorScrollToTop();
        if (isApi) {
            highlightTypeMenuItem();
        }
    }

    /**
     * Window resize handler
     */
    var resizeHandler = ExtL.createBuffered(function () {
        var size = getViewportSize(),
            showTree = getState('showTree'),
            width = size.width,
            prodTree = ExtL.get('product-tree-ct');

        ExtL.toggleCls(document.body, 'vp-med-size', (width < 1280 && width > 950));

        /*if (width < 1280 && showTree !== true){
            if (!isLanding || (isLanding && width <= 950)) {
                setTreeVisibility(false);
            }
        } else if (width >= 1280 && (showTree || showTree === undefined || showTree === null)) {
            setTreeVisibility(true);
        } else {
            if (!isLanding || (isLanding && width <= 950)) {
                setTreeVisibility(false);
            }
        }*/
        if (width > 950 && showTree !== false) {
            setTreeVisibility(true);
        } else if (width <= 950 && showTree !== true) {
            setTreeVisibility(false);
        }

        if (isLanding) {
            var ct = ExtL.get('rightMembers');
            ExtL[(width < 1280) ? 'addCls' : 'removeCls'](ct, 'transitional');
        }

        sizeSearchResultsCt();
        hideProductMenu();
    }, 0);

    /**
     *
     */
    function onAccessCheckboxClick(e) {
        filterByAccess();

        if (isStateful) {
            saveState();
        }
    }

    /**
     *
     */
    function initMemberTypeMouseoverHandlers() {
        var btns = document.querySelectorAll('.toolbarButton'),
            len = btns.length,
            i = 0;

        for (; i < len; i++) {
            addEventsAndSetMenuClose(btns.item(i), 'mouseenter', false);
            addEventsAndSetMenuClose(btns.item(i), 'mouseleave', true);
            addEventsAndSetMenuClose(btns.item(i), 'click', true, hideMemberTypeMenu);

            ExtL.monitorMouseLeave(btns.item(i), 250, hideMemberTypeMenu);
            ExtL.monitorMouseEnter(btns.item(i), 150, showMemberTypeMenu);
        }
    }

    /**
     *
     */
    function copyRelatedClasses() {
        var desktopRelated = document.querySelector('.classMeta'),
            copy = desktopRelated.cloneNode(true);

        if (desktopRelated.children.length > 0) {
            ExtL.get('related-classes-context-ct').appendChild(copy);
        } else {
            ExtL.addCls(ExtL.get('relatedClassesTab'), 'hide-tab');
            desktopRelated.style.display = 'none';
        }
    }

    /**
     *
     */
    function copyTOC() {
        var desktopToc = document.querySelector('.toc'),
            copy = (desktopToc) ? desktopToc.cloneNode(true) : null;

        if (copy != null) {
            ExtL.get('toc-context-ct').appendChild(copy);
        }
    }

    /**
     *
     */
    function onMemberTypeMenuClick (e) {
        var target;

        e = e || window.event;
        target = e.target || e.srcElement;

        if (ExtL.is(target, 'a')) {
            // menuCanClose is a closure variable
            menuCanClose = true;
            hideMemberTypeMenu();
            onHashChange(true);
        }
    }

    /**
     * https://dimakuzmich.wordpress.com/2013/07/16/prevent-scrolling-of-parent-element-with-javascript/
     * http://jsfiddle.net/dima_k/5mPkB/1/
     */
    function wheelHandler (event) {
        var e = event || window.event,  // Standard or IE event object

            // Extract the amount of rotation from the event object, looking
            // for properties of a wheel event object, a mousewheel event object
            // (in both its 2D and 1D forms), and the Firefox DOMMouseScroll event.
            // Scale the deltas so that one "click" toward the screen is 30 pixels.
            // If future browsers fire both "wheel" and "mousewheel" for the same
            // event, we'll end up double-counting it here. Hopefully, however,
            // cancelling the wheel event will prevent generation of mousewheel.
            deltaX = e.deltaX * -30 ||  // wheel event
                     e.wheelDeltaX / 4 ||  // mousewheel
                                    0,    // property not defined
            deltaY = e.deltaY * -30 ||  // wheel event
                      e.wheelDeltaY / 4 ||  // mousewheel event in Webkit
       (e.wheelDeltaY === undefined &&      // if there is no 2D property then
                      e.wheelDelta / 4) ||  // use the 1D wheel property
                         e.detail * -10 ||  // Firefox DOMMouseScroll event
                                   0;     // property not defined

            // Most browsers generate one event with delta 120 per mousewheel click.
            // On Macs, however, the mousewheels seem to be velocity-sensitive and
            // the delta values are often larger multiples of 120, at
            // least with the Apple Mouse. Use browser-testing to defeat this.
            if (isMacWebkit) {
                deltaX /= 30;
                deltaY /= 30;
            }
            e.currentTarget.scrollTop -= deltaY;
            // If we ever get a mousewheel or wheel event in (a future version of)
            // Firefox, then we don't need DOMMouseScroll anymore.
            if (isFirefox && e.type !== "DOMMouseScroll")
                element.removeEventListener("DOMMouseScroll", wheelHandler, false);

            // Don't let this event bubble. Prevent any default action.
            // This stops the browser from using the mousewheel event to scroll
            // the document. Hopefully calling preventDefault() on a wheel event
            // will also prevent the generation of a mousewheel event for the
            // same rotation.
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;  // IE events
            e.returnValue = false;  // IE events
            return false;
    }

    /**
     *
     */
    function onHashChange (force) {
        var hash = location.hash,
            rightMembers = ExtL.get('rightMembers'),
            contextMenuOpen = ExtL.hasCls(rightMembers, 'show-context-menu'),
            target, parent, isAccessor;

        if (!hash) {
            return;
        }

        target = ExtL.get(hash.replace('#', ''));

        if (hash && target) {
            ExtL.addCls(target, 'temp-show');
            ExtL.addCls(target, 'member-expanded');
            target.scrollIntoView(true);
            isAccessor = ExtL.hasCls(target, 'accessor-method') || ExtL.hasCls(target, 'params-list');
            highlightMemberRow(target);
            if (isAccessor) {
                parent = ExtL.up(target, '.classmembers');
                ExtL.addCls(parent, 'member-expanded');
                ExtL.addCls(parent, 'temp-show');
            }
            if (force) {
                target.scrollIntoView(true);
                //ExtL.addCls(target, 'member-expanded');
            }
            if (contextMenuOpen) {
                toggleContextMenu();
            }
        }
    }

    /**
     * ***********************************
     * eo EVENT HANDLERS SECTION
     * ***********************************
     */







    /**
     * ***********************************
     * EVENT HANDLER SETUP SECTION
     * ***********************************
     */
    function initEventHandlers() {
        ExtL.get('help-btn').onclick = toggleHelp;
        ExtL.get('help-close').onclick = toggleHelp;
        // The back-to-top element is shown when you scroll down a bit
        // clicking it will scroll to the top of the page
        ExtL.get('back-to-top').onclick = setScrollPos;
        ExtL.get('mobile-main-nav-menu-btn').onclick = onToggleClassTreeClickNoState;
        // toggle the class and guide trees
        ExtL.each(ExtL.fromNodeList(document.querySelectorAll('.toggle-tree')), function (btn) {
            btn.onclick = toggleTreeExpand;
        });
        // hide the class tree panel
        ExtL.get('hide-class-tree').onclick = onHideClassTreeClick;
        ExtL.each(ExtL.fromNodeList(document.querySelectorAll('.product-menu-btn')), function (btn) {
            btn.onclick = showProductMenu;
        });
        //ExtL.get('product-tree-close-btn').onclick = onProductTreeCloseClick;
        ExtL.get('mobile-context-menu-btn').onclick = toggleContextMenu;
        if (ExtL.get('hide-context-menu')) {
            ExtL.get('hide-context-menu').onclick = toggleContextMenu;
        }
        // Set up the product menu nav
        ExtL.each(ExtL.fromNodeList(document.querySelectorAll('.product-name-item')), function (item) {
            //item.onclick = onProductMenuItemClick;
            //item.onmouseenter = onProductMenuItemClick;
            ExtL.on(item, 'click', onProductMenuItemClick);
            ExtL.on(item, 'mouseenter', onProductMenuItemClick);
        });
        // Set up class tree ct click listener
        if (ExtL.get('class-tree-ct')) {
            ExtL.on(ExtL.get('class-tree-ct'), 'click', onClassTreeCtClick);
        }
        // Set up history details click handler
        ExtL.on(ExtL.get('history-config'), 'click', showHistoryConfigPanel);
        // and history type onchange listeners
        ExtL.on(ExtL.get('historyTypeCurrent'), 'change', setHistoryType);
        ExtL.on(ExtL.get('historyTypeAll'), 'change', setHistoryType);
        // Set up history clear click handler
        ExtL.on(ExtL.get('history-clear'), 'click', clearHistory);
        // Set up history labels checkbox click handler
        ExtL.on(ExtL.get('history-all-labels'), 'change', onToggleHistoryLabels);

        // Set up search history panel (and ultimately item) click handler
        ExtL.on(ExtL.get('search-history-panel'), 'click', onSearchHistoryClick);


        // globally handle body click events
        document.body.onclick = onBodyClick;

        if (document.getElementsByClassName('toolkit-switch')[0]) {

            var link = document.getElementsByClassName('toolkit-switch')[0],
                href = link.href,
                name = href.substring(href.lastIndexOf('/')+1),
                curl = window.location.href,
                rel  = (curl.indexOf('guides') > -1) ? getRelativePath(curl) : '';
            
            link.href = null;
            link.href = '../' + rel + name;
        }

        if (hasClassTemplate) {
            // show / hide the class tree panel when clicking the show / hide buttons

            // show member types menu
            ExtL.get('member-types-menu').onclick = onClickMemberMenuType;
            // expand / collapse the related classes

            // show / hide public, protected, and private members
            ExtL.get('publicCheckbox').onclick= onAccessCheckboxClick;
            ExtL.get('protectedCheckbox').onclick= onAccessCheckboxClick;
            ExtL.get('privateCheckbox').onclick= onAccessCheckboxClick;
            ExtL.get('inheritedCheckbox').onclick= onAccessCheckboxClick;

            // expand all members - collapse all members
            ExtL.get('toggleAll').onclick = onToggleAllClick;


            // handle the following of a link in the member type menu
            getMemberTypeMenu().onclick = onMemberTypeMenuClick;

            // prevent scrolling of the body when scrolling the member menu
            getMemberTypeMenu().onmousewheel = wheelHandler;
            getMemberTypeMenu().onwheel = wheelHandler;
            if (isFirefox) {              // Firefox only
                getMemberTypeMenu().scrollTop = 0;
                getMemberTypeMenu().addEventListener("DOMMouseScroll", wheelHandler, false);
            }

            ExtL.get('member-filter-field').oninput = function (e) {
                e = e || window.event;
                filter(e, e.target || e.srcElement);
            };
            ExtL.get('member-filter-field').onkeyup = function (e) {
                e = e || window.event;
                filter(e, e.target || e.srcElement);
            };
            ExtL.get('member-filter-field').onchange = function (e) {
                e = e || window.event;
                filter(e, e.target || e.srcElement);
            };
        }

        // expand all examples - collapse all examples
        if (isGuide || isApi) {
            ExtL.get('toggleExamples').onclick = onToggleExamplesClick;
        }
        ExtL.each(ExtL.fromNodeList(document.getElementsByClassName('collapse-tool')), function (btn) {
            btn.onclick = onToggleExampleClick;
        });
        ExtL.each(ExtL.fromNodeList(document.getElementsByClassName('expand-tool')), function (btn) {
            btn.onclick = onToggleExampleClick;
        });

        // monitor viewport resizing
        ExtL.on(window, 'resize', resizeHandler);

        // monitor changes in the url hash
        window.onhashchange = onHashChange;
    }
    /**
     * ***********************************
     * eo EVENT HANDLER SETUP SECTION
     * ***********************************
     */








    /**
     * ***********************************
     * STATE MANAGEMENT SECTION
     * ***********************************
     */

    /**
     * Returns the local state object
     */
    function getState(id) {
        return id ? state[id] : state;
    }

    /**
     * The stateful aspects of the page are collected and saved to localStorage
     */
    function saveState() {
        var path = window.location.pathname,
            historyRemoves = [];

        if (allowSave !== true || !ExtL.canLocalStorage()) {
            return;
        }
        var body = document.body,
            publicCheckbox = ExtL.get('publicCheckbox'),
            protectedCheckbox = ExtL.get('protectedCheckbox'),
            privateCheckbox = ExtL.get('privateCheckbox'),
            inheritedCheckbox = ExtL.get('inheritedCheckbox'),
            historyType = ExtL.get('historyTypeCurrent'),
            historyLabelCheckbox = ExtL.get('history-all-labels'),
            apiTab = ExtL.get('apiTab'),
            guideTab = ExtL.get('guideTab'),
            quickStartTab = ExtL.get('quickStartTab'),
            body = document.querySelector('body'),
            collapsed = ExtL.hasCls(body, 'collapse-code-all'),
            state = getState() || {},
            activeNavTab;

        if (apiTab && ExtL.hasCls(apiTab, 'active-tab')) {
            activeNavTab = 'apiTab';
        }
        if (guideTab && ExtL.hasCls(guideTab, 'active-tab')) {
            activeNavTab = 'guideTab';
        }
        if (quickStartTab && ExtL.hasCls(quickStartTab, 'active-tab')) {
            activeNavTab = 'quickStartTab';
        }

        state.showTree = !ExtL.hasCls(body, 'tree-hidden');
        if (publicCheckbox) {
            state.publicCheckbox = publicCheckbox.checked;
        }

        if (protectedCheckbox) {
            state.protectedCheckbox = protectedCheckbox.checked;
        }

        if (privateCheckbox) {
            state.privateCheckbox = privateCheckbox.checked;
        }

        if (inheritedCheckbox) {
            state.inheritedCheckbox = inheritedCheckbox.checked;
        }

        if (isGuide || isApi) {
            state.history = state.history || [];
            ExtL.each(state.history, function (item, i, arr) {
                if (item.product === product && item.pversion === pversion && item.text === ExtL.htmlDecode(ExtL.htmlDecode(pageName)) && item.path === path) {
                    historyRemoves.push(i);
                }
            });
            ExtL.each(historyRemoves, function (item) {
                state.history.splice(item, 1);
            });

            state.history.push({
                product: product,
                pversion: pversion,
                text: ExtL.htmlDecode(ExtL.htmlDecode(pageName)),
                path: path,
                title: pageTitle
            });
            // limit the history size to 150 items (across all products)
            if (state.history.length > 150) {
                state.history.length = 150;
            }
        }

        if (historyType) {
            state.historyType = historyType.checked ? 'current' : 'all';
        }

        if (historyLabelCheckbox) {
            state.historyLabels = historyLabelCheckbox.checked;
        }

        state.searchHistory = searchHistory;
        state.collapseExamples = collapsed;
        state.activeNavTab = activeNavTab;
        localStorage.setItem('htmlDocsState', ExtL.encodeValue(state));
    }

    /**
     * Fetches the state of the page from localStorage and applies the saved values to
     * the page
     */
    function fetchState(skipSave, returnOnly) {
        var saved = localStorage.getItem('htmlDocsState'),
            publicCheckbox = ExtL.get('publicCheckbox'),
            protectedCheckbox = ExtL.get('protectedCheckbox'),
            privateCheckbox = ExtL.get('privateCheckbox'),
            inheritedCheckbox = ExtL.get('inheritedCheckbox'),
            historyTypeCurrent = ExtL.get('historyTypeCurrent'),
            historyTypeAll = ExtL.get('historyTypeAll'),
            historyLabelCheckbox = ExtL.get('history-all-labels'),
            apiTab = ExtL.get('apiTab'),
            guideTab = ExtL.get('guideTab'),
            guideTree = ExtL.get('guide-tree'),
            apiTree = ExtL.get('tree'),
            body = document.querySelector('body'),
            hash = window.location.hash,
            qi = hash.indexOf('?'),
            queryString = (qi > -1) ? hash.substr(qi + 1) : false,
            activeTab, queryObj, examplesCollapseDir;

        state = ExtL.decodeValue(saved) || {
            showTree: null
        };

        if (!ExtL.canLocalStorage() || !state || ExtL.isEmpty(state.activeNavTab)) {
            if (isGuide && guideTab && guideTree) {
                ExtL.addCls(guideTab, 'active-tab');
                ExtL.removeCls(guideTree, 'hide');
                if (apiTree) {
                    ExtL.addCls(apiTree, 'hide');
                }
            } else if (isApi && apiTab && apiTree) {
                ExtL.addCls(apiTab, 'active-tab');
                ExtL.removeCls(apiTree, 'hide');
                if (guideTree) {
                    ExtL.addCls(guideTree, 'hide');
                }
            } else {
                if (hasGuides && guideTab && (guideTab.offsetHeight || guideTab.clientHeight)) {
                    toggleNavTab('guideTab');
                } else if (hasApi && apiTab && (apiTab.offsetHeight || apiTab.clientHeight)) {
                    toggleNavTab('apiTab');
                }
            }

            return;
        }

        if (returnOnly) {
            return state;
        }

        if (publicCheckbox) {
            //publicCheckbox.checked = state.publicCheckbox === false ? false : true;
            publicCheckbox.checked = !(state.publicCheckbox === false);
        }
        if (protectedCheckbox) {
            //protectedCheckbox.checked = state.protectedCheckbox === false ? false : true;
            protectedCheckbox.checked = !(state.protectedCheckbox === false);
        }
        if (privateCheckbox) {
            //privateCheckbox.checked = state.privateCheckbox === false ? false : true;
            privateCheckbox.checked = !(state.privateCheckbox === false);
        }
        if (inheritedCheckbox) {
            //inheritedCheckbox.checked = state.inheritedCheckbox === false ? false : true;
            inheritedCheckbox.checked = !(state.inheritedCheckbox === false);
        }

        if (historyLabelCheckbox) {
            historyLabelCheckbox.checked = state.historyLabels;
            onToggleHistoryLabels();
        }
        if (historyTypeCurrent && historyTypeAll && state.historyType) {
            ExtL.get('historyType' + ExtL.capitalize(state.historyType)).checked = true;
            setHistoryType();
        }

        searchHistory = state.searchHistory;

        if (queryString) {
            queryObj = ExtL.fromQueryString(queryString);
            if (queryObj.collapseExamples && (queryObj.collapseExamples === 'true' || queryObj.collapseExamples === 'false')) {
                examplesCollapseDir = queryObj.collapseExamples === 'true' ? true : false;
            }
            toggleExamples(examplesCollapseDir);
        } else {
            toggleExamples(state.collapseExamples);
        }

        activeTab = state.activeNavTab;

        if (activeTab === 'apiTab' && !hasApi) {
            activeTab = 'guideTab';
        }
        if (activeTab === 'guideTab' && !hasGuides) {
            activeTab = 'apiTab';
        }

        toggleNavTab(activeTab);
        setTreeVisibility(state.showTree);
        if (!skipSave) {
            saveState();
        }
    }

    /**
     * ***********************************
     * eo STATE MANAGEMENT SECTION
     * ***********************************
     */
})();
