// Copyright: Realis informacijske tehnologije d.o.o; http://www.realis.si
if (navigator.userAgent.toLowerCase().indexOf('msie') == - 1 || navigator.userAgent.toLowerCase().indexOf('opera') > - 1)
{
    function __loadCompat(w) {
        w.Debug = function () {
        };
        w.Debug._fail = function (message) {
            throw new Error(message);
        };
        w.Debug.writeln = function (text) {
            if (window.console) {
                window.console.debug(text);
            }
        };
        w.__getNonTextNode = function (node) {
            try {
                while (node && (node.nodeType != 1)) {
                    node = node.parentNode;
                }
            } 
            catch (ex) {
                node = null;
            }
            return node;
        };
        w.__getLocation = function (e) {
            var loc = {
                x: 0,
                y: 0
            };
            while (e) {
                loc.x += e.offsetLeft;
                loc.y += e.offsetTop;
                e = e.offsetParent;
            }
            return loc;
        };
        // Allow caching regex objects for performance
        RegExp._cacheable = true;
        // Skip RegExp.test in String.quote to improve performance.
        String._quoteSkipTest = true;
    }
    function _loadMozillaCompat(w)
    {
        w.navigate = function (url) {
            window.setTimeout('window.location = "' + url + '";', 0);
        };
        var attachEventProxy = function (eventName, eventHandler) {
            eventHandler._mozillaEventHandler = function (e) {
                window.event = e;
                var rv = eventHandler();
                if (e.type == 'beforeunload' && navigator.userAgent.indexOf('Safari') > - 1)
                return rv;
                return e.returnValue;
            };
            if (eventName == 'onmousewheel' && navigator.userAgent.toLowerCase().indexOf('gecko') > - 1 && navigator.userAgent.indexOf('Safari') == - 1 && navigator.userAgent.indexOf('Trident') == - 1)
            eventName = 'onDOMMouseScroll';
            this.addEventListener(eventName.slice(2), eventHandler._mozillaEventHandler, false);
        };
        var detachEventProxy = function (eventName, eventHandler) {
            if (eventHandler._mozillaEventHandler) {
                var mozillaEventHandler = eventHandler._mozillaEventHandler;
                delete eventHandler._mozillaEventHandler;
                if (eventName == 'onmousewheel' && navigator.userAgent.toLowerCase().indexOf('gecko') > - 1 && navigator.userAgent.indexOf('Safari') == - 1 && navigator.userAgent.indexOf('Trident') == - 1)
                eventName = 'onDOMMouseScroll';
                this.removeEventListener(eventName.slice(2), mozillaEventHandler, false);
            }
        };
        w.attachEvent = attachEventProxy;
        w.detachEvent = detachEventProxy;
        w.HTMLDocument.prototype.attachEvent = attachEventProxy;
        w.HTMLDocument.prototype.detachEvent = detachEventProxy;
        w.HTMLElement.prototype.attachEvent = attachEventProxy;
        w.HTMLElement.prototype.detachEvent = detachEventProxy;
        if (w.Event.prototype.__defineGetter__ == null)
        w.Event.prototype.__defineGetter__ = function (a, f) {
            if (!w.Event.prototype[a]) w.Event.prototype[a] = f
        }
        if (w.Event.prototype.__defineSetter__ == null)
        w.Event.prototype.__defineSetter__ = function (a, f) {
            if (!w.Event.prototype[a]) w.Event.prototype[a] = f
        }
        if (w.HTMLElement.prototype.__defineGetter__ == null)
        w.HTMLElement.prototype.__defineGetter__ = function (a, f) {
            if (!w.HTMLElement.prototype[a]) w.HTMLElement.prototype[a] = f
        }
        if (w.HTMLElement.prototype.__defineSetter__ == null)
        w.HTMLElement.prototype.__defineSetter__ = function (a, f) {
            if (!w.HTMLElement.prototype[a]) w.HTMLElement.prototype[a] = f
        }
        if (w.HTMLStyleElement.prototype.__defineGetter__ == null)
        w.HTMLStyleElement.prototype.__defineGetter__ = function (a, f) {
            if (!w.HTMLStyleElement.prototype[a]) w.HTMLStyleElement.prototype[a] = f
        }
        if (w.HTMLStyleElement.prototype.__defineSetter__ == null)
        w.HTMLStyleElement.prototype.__defineSetter__ = function (a, f) {
            if (!w.HTMLStyleElement.prototype[a]) w.HTMLStyleElement.prototype[a] = f
        }
        if (w.CSSStyleSheet.prototype.__defineGetter__ == null)
        w.CSSStyleSheet.prototype.__defineGetter__ = function (a, f) {
            if (!w.CSSStyleSheet.prototype[a]) w.CSSStyleSheet.prototype[a] = f
        }
        if (w.CSSStyleSheet.prototype.__defineSetter__ == null)
        w.CSSStyleSheet.prototype.__defineSetter__ = function (a, f) {
            if (!w.CSSStyleSheet.prototype[a]) w.CSSStyleSheet.prototype[a] = f
        }
        if (w.CSSStyleDeclaration.prototype.__defineGetter__ == null)
        w.CSSStyleDeclaration.prototype.__defineGetter__ = function (a, f) {
            if (!w.CSSStyleDeclaration.prototype[a]) w.CSSStyleDeclaration.prototype[a] = f
        }
        if (w.CSSStyleDeclaration.prototype.__defineSetter__ == null)
        w.CSSStyleDeclaration.prototype.__defineSetter__ = function (a, f) {
            if (!w.CSSStyleDeclaration.prototype[a]) w.CSSStyleDeclaration.prototype[a] = f
        }
        if (w.Node.prototype.__defineGetter__ == null)
        w.Node.prototype.__defineGetter__ = function (a, f) {
            if (!w.Node.prototype[a]) w.Node.prototype[a] = f
        }
        if (w.Node.prototype.__defineSetter__ == null)
        w.Node.prototype.__defineSetter__ = function (a, f) {
            if (!w.Node.prototype[a]) w.Node.prototype[a] = f
        }
        w.Event.prototype.__defineGetter__('srcElement', function () {
            // __getNonTextNode(this.target) is the expected implementation.
            // However script.load has target set to the Document object... so we
            // need to throw in currentTarget as well.
            return __getNonTextNode(this.target) || this.currentTarget;
        });
        w.Event.prototype.__defineGetter__('cancelBubble', function () {
            return this._bubblingCanceled || false;
        });
        w.Event.prototype.__defineSetter__('cancelBubble', function (v) {
            if (v) {
                this._bubblingCanceled = true;
                this.stopPropagation();
            }
        });
        w.Event.prototype.__defineGetter__('returnValue', function () {
            return !this._cancelDefault;
        });
        w.Event.prototype.__defineSetter__('returnValue', function (v) {
            if (!v) {
                this._cancelDefault = true;
                this.preventDefault();
            }
        });
        w.Event.prototype.__defineGetter__('fromElement', function () {
            var n;
            if (this.type == 'mouseover') {
                n = this.relatedTarget;
            } 
            else if (this.type == 'mouseout') {
                n = this.target;
            }
            return __getNonTextNode(n);
        });
        w.Event.prototype.__defineGetter__('toElement', function () {
            var n;
            if (this.type == 'mouseout') {
                n = this.relatedTarget;
            } 
            else if (this.type == 'mouseover') {
                n = this.target;
            }
            return __getNonTextNode(n);
        });
        w.Event.prototype.__defineGetter__('button', function () {
            return (this.which == 1) ? 1 : (this.which == 3) ? 2 : 0
        });
        w.Event.prototype.__defineGetter__('offsetX', function () {
            return window.pageXOffset + this.clientX - __getLocation(this.srcElement).x;
        });
        w.Event.prototype.__defineGetter__('offsetY', function () {
            return window.pageYOffset + this.clientY - __getLocation(this.srcElement).y;
        });
        w.HTMLElement.prototype.__defineGetter__('parentElement', function () {
            return this.parentNode;
        });
        w.HTMLElement.prototype.__defineGetter__('children', function () {
            var children = [
            ];
            var childCount = this.childNodes.length;
            for (var i = 0; i < childCount; i++) {
                var childNode = this.childNodes[i];
                if (childNode.nodeType == 1) {
                    children.push(childNode);
                }
            }
            return children;
        });
        w.HTMLElement.prototype.__defineGetter__('innerText', function () {
            try {
                return this.textContent
            } 
            catch (ex) {
                var text = '';
                for (var i = 0; i < this.childNodes.length; i++) {
                    if (this.childNodes[i].nodeType == 3) {
                        text += this.childNodes[i].textContent;
                    }
                }
                return str;
            }
        });
        w.HTMLElement.prototype.__defineSetter__('innerText', function (v) {
            var textNode = document.createTextNode(v);
            this.innerHTML = '';
            this.appendChild(textNode);
        });
        w.HTMLElement.prototype.__defineGetter__('currentStyle', function () {
            return window.getComputedStyle(this, null);
        });
        w.HTMLElement.prototype.__defineGetter__('runtimeStyle', function () {
            return window.getOverrideStyle(this, null);
        });
        w.HTMLElement.prototype.removeNode = function (b) {
            return this.parentNode.removeChild(this)
        };
        w.HTMLElement.prototype.contains = function (el) {
            while (el != null && el != this) {
                el = el.parentNode;
            }
            return (el != null)
        };
        w.HTMLStyleElement.prototype.__defineGetter__('styleSheet', function () {
            return this.sheet;
        });
        w.CSSStyleSheet.prototype.__defineGetter__('rules', function () {
            return this.cssRules;
        });
        w.CSSStyleSheet.prototype.addRule = function (selector, style, index) {
            this.insertRule(selector + '{' + style + '}', index);
        };
        w.CSSStyleSheet.prototype.removeRule = function (index) {
            this.deleteRule(index);
        };
        w.CSSStyleDeclaration.prototype.__defineGetter__('styleFloat', function () {
            return this.cssFloat;
        });
        w.CSSStyleDeclaration.prototype.__defineSetter__('styleFloat', function (v) {
            this.cssFloat = v;
        });
        DocumentFragment.prototype.getElementById = function (id) {
            var nodeQueue = [
            ];
            var childNodes = this.childNodes;
            var node;
            var c;
            for (c = 0; c < childNodes.length; c++) {
                node = childNodes[c];
                if (node.nodeType == 1) {
                    nodeQueue.push(node);
                }
            }
            while (nodeQueue.length) {
                node = nodeQueue.dequeue();
                if (node.id == id) {
                    return node;
                }
                childNodes = node.childNodes;
                if (childNodes.length != 0) {
                    for (c = 0; c < childNodes.length; c++) {
                        node = childNodes[c];
                        if (node.nodeType == 1) {
                            nodeQueue.push(node);
                        }
                    }
                }
            }
            return null;
        };
        DocumentFragment.prototype.getElementsByTagName = function (tagName) {
            var elements = [
            ];
            var nodeQueue = [
            ];
            var childNodes = this.childNodes;
            var node;
            var c;
            for (c = 0; c < childNodes.length; c++) {
                node = childNodes[c];
                if (node.nodeType == 1) {
                    nodeQueue.push(node);
                }
            }
            while (nodeQueue.length) {
                node = nodeQueue.dequeue();
                if (node.tagName == tagName) {
                    elements.add(node);
                }
                childNodes = node.childNodes;
                if (childNodes.length != 0) {
                    for (c = 0; c < childNodes.length; c++) {
                        node = childNodes[c];
                        if (node.nodeType == 1) {
                            nodeQueue.push(node);
                        }
                    }
                }
            }
            return elements;
        };
        DocumentFragment.prototype.createElement = function (tagName) {
            return document.createElement(tagName);
        };
        var selectNodes = function (doc, path, contextNode) {
            contextNode = contextNode ? contextNode : doc;
            var xpath = new XPathEvaluator();
            var result = xpath.evaluate(path, contextNode, doc.createNSResolver(doc.documentElement), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var nodeList = new Array(result.snapshotLength);
            for (var i = 0; i < result.snapshotLength; i++) {
                nodeList[i] = result.snapshotItem(i);
            }
            return nodeList;
        };
        var selectSingleNode = function (doc, path, contextNode) {
            path += '[1]';
            var nodes = selectNodes(doc, path, contextNode);
            if (nodes.length != 0) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i]) {
                        return nodes[i];
                    }
                }
            }
            return null;
        };
        if (w.XMLDocument != null)
        {
            w.XMLDocument.prototype.selectNodes = function (path, contextNode) {
                return selectNodes(this, path, contextNode);
            };
            w.XMLDocument.prototype.selectSingleNode = function (path, contextNode) {
                return selectSingleNode(this, path, contextNode);
            };
            w.XMLDocument.prototype.transformNode = function (xsl) {
                var xslProcessor = new XSLTProcessor();
                xslProcessor.importStylesheet(xsl);
                var ownerDocument = document.implementation.createDocument('', '', null);
                var transformedDoc = xslProcessor.transformToDocument(this);
                return transformedDoc.xml;
            };
        }
        Node.prototype.selectNodes = function (path) {
            var doc = this.ownerDocument;
            return doc.selectNodes(path, this);
        };
        Node.prototype.selectSingleNode = function (path) {
            var doc = this.ownerDocument;
            return doc.selectSingleNode(path, this);
        };
        Node.prototype.__defineGetter__('baseName', function () {
            return this.localName;
        });
        Node.prototype.__defineGetter__('text', function () {
            return (typeof (this.textContent) != 'undefined' ? this.textContent : (typeof (this.value) != 'undefined' ? this.value : null)); //stara Mozilla.
        });
        Node.prototype.__defineSetter__('text', function (value) {
            this.textContent = value;
            this.value = value; //stara Mozilla.
        });
        Node.prototype.__defineGetter__('xml', function () {
            return (new XMLSerializer()).serializeToString(this);
        });
        var _capturing = null;
        var _root = document.getElementsByTagName('HTML') [0];
        function _getNonTextNode(n)
        {
            try
            {
                while (n && n.nodeType != 1)
                n = n.parentNode;
            } 
            catch (ex)
            {
                n = null;
            }
            return n;
        }
        function _captureMouse(ev)
        {
            if (_capturing)
            {
                ev.preventDefault();
                ev.returnValue = false;
                document.removeEventListener('mousemove', _captureMouse, true);
                var oEvent = document.createEvent('MouseEvents');
                oEvent.initMouseEvent(ev.type, ev.bubbles, ev.cancelable, ev.view, ev.detail, ev.screenX, ev.screenY, ev.clientX, ev.clientY, ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, ev.button, ev.relatedTarget);
                oEvent._fixOffset = _getNonTextNode(ev.srcElement);
                if (oEvent._fixOffset == _root)
                oEvent._fixOffset = document.body;
                _capturing.dispatchEvent(oEvent);
                document.addEventListener('mousemove', _captureMouse, true);
                ev.stopPropagation();
                oEvent._fixOffset = null;
            }
        }
        function _releaseMouse(ev)
        {
            if (_capturing)
            {
                document.removeEventListener('mouseup', _releaseMouse, true);
                document.removeEventListener('mousemove', _captureMouse, true);
                var eventCanBubble = ev.bubbles;
                var eventIsCancelable = ev.cancelable;
                if (ev.type == 'mouseup')
                {
                    eventCanBubble = false;
                    eventIsCancelable = false;
                }
                var oEvent = document.createEvent('MouseEvents');
                oEvent.initMouseEvent(ev.type, eventCanBubble, eventIsCancelable, ev.view, ev.detail, ev.screenX, ev.screenY, ev.clientX, ev.clientY, ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, ev.button, ev.relatedTarget);
                oEvent._fixOffset = _getNonTextNode(ev.srcElement);
                if (oEvent._fixOffset == _root)
                oEvent._fixOffset = document.body;
                _capturing.dispatchEvent(oEvent);
                _capturing = null;
                ev.stopPropagation();
                ev.preventDefault();
                oEvent._fixOffset = null;
            }
        }
        function _stopEvent(ev)
        {
            ev.stopPropagation();
            ev.preventDefault();
        }
        var _validateButton = function (ev)
        {
        }
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > - 1)
        {
            _validateButton = function (ev)
            {
                if (ev.button != 0) // Fix Firefox bug with right click button firing onclick event
                ev.stopPropagation();
            }
        }
        w.document.addEventListener('click', _validateButton, true);
        w.HTMLElement.prototype.click = function ()
        {
            var oEvent = document.createEvent('MouseEvents');
            oEvent.initEvent('click', true, true);
            var blnRet = this.dispatchEvent(oEvent);
            if (blnRet || (typeof (event.returnValue) == 'boolean' && event.returnValue))
            {
                var elRoot = this;
                while (elRoot)
                {
                    if (elRoot.tagName == 'A' && elRoot.href != '')
                    {
                        if (elRoot.target)
                        window.open(elRoot.href, elRoot.target) 
                        else
                        document.location = elRoot.href;
                        elRoot = null;
                    } 
                    else
                    elRoot = elRoot.parentElement;
                }
            }
        }
        w.HTMLElement.prototype.setCapture = function (ev)
        {
            _capturing = this;
            document.addEventListener('mousemove', _captureMouse, true);
            document.addEventListener('mouseover', _stopEvent, true);
            document.addEventListener('mouseout', _stopEvent, true);
            document.addEventListener('mouseenter', _stopEvent, true);
            document.addEventListener('mouseleave', _stopEvent, true);
            document.addEventListener('mouseup', _releaseMouse, true);
        };
        w.HTMLElement.prototype.releaseCapture = function ()
        {
            _capturing = null;
            document.removeEventListener('mousemove', _captureMouse, true);
            document.removeEventListener('mouseover', _stopEvent, true);
            document.removeEventListener('mouseout', _stopEvent, true);
            document.removeEventListener('mouseenter', _stopEvent, true);
            document.removeEventListener('mouseleave', _stopEvent, true);
            document.removeEventListener('mouseup', _releaseMouse, true);
        };
        try
        {
            w.SVGElement.prototype.attachEvent = w.attachEvent;
            w.SVGElement.prototype.detachEvent = w.detachEvent;
        } 
        catch (e) {
        }
    }
    __loadCompat(window);
    _loadMozillaCompat(window);
}
// Script# Core Runtime
// Copyright (c) 2007, Nikhil Kothari. All Rights Reserved.
// http://projects.nikhilk.net
//

function isUndefined(o) {
    return (o === undefined);
}
function isNull(o) {
    return (o === null);
}
function isNullOrUndefined(o) {
    return (o === null) || (o === undefined);
}
function $(id) {
    return document.getElementById(id);
}
document.getElementsBySelector = function (cssSelector, root) {
    var all = root ? root.getElementsByTagName('*')  : document.getElementsByTagName('*');
    var matches = [
    ];
    var styleSheet = document.getElementsBySelector.styleSheet;
    if (!styleSheet) {
        var styleSheetNode = document.createElement('style');
        styleSheetNode.type = 'text/css';
        document.getElementsByTagName('head') [0].appendChild(styleSheetNode);
        styleSheet = styleSheetNode.styleSheet || styleSheetNode.sheet;
        document.getElementsBySelector.styleSheet = styleSheet;
    }
    if (window.navigator.userAgent.indexOf('MSIE') >= 0) {
        styleSheet.addRule(cssSelector, 'ssCssMatch:true', 0);
        for (var i = all.length - 1; i >= 0; i--) {
            var element = all[i];
            if (element.currentStyle.ssCssMatch) {
                matches[matches.length] = element;
            }
        }
        styleSheet.removeRule(0);
    } else {
        var matchValue = document.getElementsBySelector.matchValue;
        if (!matchValue) {
            matchValue = (window.navigator.userAgent.indexOf('Opera') >= 0) ? '"ssCssMatch"' : 'ssCssMatch 1';
            document.getElementsBySelector.matchValue = matchValue;
        }
        styleSheet.insertRule(cssSelector + ' { counter-increment: ssCssMatch }', 0);
        var docView = document.defaultView;
        for (var i = all.length - 1; i >= 0; i--) {
            var element = all[i];
            if (docView.getComputedStyle(element, null).counterIncrement === matchValue) {
                matches[matches.length] = element;
            }
        }
        styleSheet.deleteRule(0);
    }
    if (matches.length > 1) {
        matches.reverse();
    }
    return matches;
}
Object.__typeName = 'Object';
Object.__baseType = null;
Object.parse = function (s) {
    return eval(s);
}
Object.getKeyCount = function (d) {
    var count = 0;
    for (var n in d) {
        count++;
    }
    return count;
}
Object.clearKeys = function (d) {
    for (var n in d) {
        delete d[n];
    }
}
Object.keyExists = function (d, key) {
    return d[key] !== undefined;
}
Function.parse = function (s) {
    if (!Function._parseCache) {
        Function._parseCache = {
        };
    }
    var fn = Function._parseCache[s];
    if (!fn) {
        try {
            eval('fn = ' + s);
            if (typeof (fn) != 'function') {
                fn = null;
            } else {
                Function._parseCache[s] = fn;
            }
        } catch (ex) {
        }
    }
    return fn;
}
Boolean.__typeName = 'Boolean';
Boolean.parse = function (s) {
    return (s.toLowerCase() == 'true');
}
Number.__typeName = 'Number';
Number.parse = function (s) {
    if (!s || !s.length) {
        return 0;
    }
    if ((s.indexOf('.') >= 0) || (s.indexOf('e') >= 0) || s.endsWith('f') || s.endsWith('F')) {
        return parseFloat(s);
    }
    return parseInt(s);
}
Number.prototype.format = function (format, useLocale) {
    if (isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        if (useLocale) {
            return this.toLocaleString();
        } else {
            return this.toString();
        }
    }
    return this._netFormat(format, useLocale);
}
Number._commaFormat = function (number, groups, decimal, comma) {
    var decimalPart = null;
    var decimalIndex = number.indexOf(decimal);
    if (decimalIndex > 0) {
        decimalPart = number.substr(decimalIndex);
        number = number.substr(0, decimalIndex);
    }
    var negative = number.startsWith('-');
    if (negative) {
        number = number.substr(1);
    }
    var groupIndex = 0;
    var groupSize = groups[groupIndex];
    if (number.length < groupSize) {
        return decimalPart ? number + decimalPart : number;
    }
    var index = number.length;
    var s = '';
    var done = false;
    while (!done) {
        var length = groupSize;
        var startIndex = index - length;
        if (startIndex < 0) {
            groupSize += startIndex;
            length += startIndex;
            startIndex = 0;
            done = true;
        }
        if (!length) {
            break;
        }
        var part = number.substr(startIndex, length);
        if (s.length) {
            s = part + comma + s;
        } else {
            s = part;
        }
        index -= length;
        if (groupIndex < groups.length - 1) {
            groupIndex++;
            groupSize = groups[groupIndex];
        }
    }
    if (negative) {
        s = '-' + s;
    }
    return decimalPart ? s + decimalPart : s;
}
Number.prototype._netFormat = function (format, useLocale) {
    var nf = useLocale ? CultureInfo.Current.numberFormat : CultureInfo.Neutral.numberFormat;
    var s = '';
    var precision = - 1;
    if (format.length > 1) {
        precision = parseInt(format.substr(1));
    }
    var fs = format.charAt(0);
    switch (fs) {
        case 'd':
        case 'D':
            s = parseInt(Math.abs(this)).toString();
            if (precision != - 1) {
                s = s.padLeft(precision, '0');
            }
            if (this < 0) {
                s = '-' + s;
            }
            break;
        case 'x':
        case 'X':
            s = parseInt(Math.abs(this)).toString(16);
            if (fs == 'X') {
                s = s.toUpperCase();
            }
            if (precision != - 1) {
                s = s.padLeft(precision, '0');
            }
            break;
        case 'e':
        case 'E':
            if (precision == - 1) {
                s = this.toExponential();
            } else {
                s = this.toExponential(precision);
            }
            if (fs == 'E') {
                s = s.toUpperCase();
            }
            break;
        case 'f':
        case 'F':
        case 'n':
        case 'N':
            if (precision == - 1) {
                precision = nf.numberDecimalDigits;
            }
            s = this.toFixed(precision).toString();
            if (precision && (nf.numberDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.numberDecimalSeparator + s.substr(index + 1);
            }
            if ((fs == 'n') || (fs == 'N')) {
                s = Number._commaFormat(s, nf.numberGroupSizes, nf.numberDecimalSeparator, nf.numberGroupSeparator);
            }
            break;
        case 'c':
        case 'C':
            if (precision == - 1) {
                precision = nf.currencyDecimalDigits;
            }
            s = Math.abs(this).toFixed(precision).toString();
            if (precision && (nf.currencyDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.currencyDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.currencyGroupSizes, nf.currencyDecimalSeparator, nf.currencyGroupSeparator);
            if (this < 0) {
                s = String.format(nf.currencyNegativePattern, s);
            } else {
                s = String.format(nf.currencyPositivePattern, s);
            }
            break;
        case 'p':
        case 'P':
            if (precision == - 1) {
                precision = nf.percentDecimalDigits;
            }
            s = (Math.abs(this) * 100).toFixed(precision).toString();
            if (precision && (nf.percentDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.percentDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.percentGroupSizes, nf.percentDecimalSeparator, nf.percentGroupSeparator);
            if (this < 0) {
                s = String.format(nf.percentNegativePattern, s);
            } else {
                s = String.format(nf.percentPositivePattern, s);
            }
            break;
    }
    return s;
}
Math.truncate = function (n) {
    return (n >= 0) ? Math.floor(n)  : Math.ceil(n);
}
String.__typeName = 'String';
String.Empty = '';
String.compare = function (s1, s2, ignoreCase) {
    if (ignoreCase) {
        if (s1) {
            s1 = s1.toUpperCase();
        }
        if (s2) {
            s2 = s2.toUpperCase();
        }
    }
    s1 = s1 || '';
    s2 = s2 || '';
    if (s1 == s2) {
        return 0;
    }
    if (s1 < s2) {
        return - 1;
    }
    return 1;
}
String.prototype.compareTo = function (s, ignoreCase) {
    return String.compare(this, s, ignoreCase);
}
String.prototype.endsWith = function (suffix) {
    if (!suffix.length) {
        return true;
    }
    if (suffix.length > this.length) {
        return false;
    }
    return (this.substr(this.length - suffix.length) == suffix);
}
String.equals = function (s1, s2, ignoreCase) {
    return String.compare(s1, s2, ignoreCase) == 0;
}
String._format = function (format, values, useLocale) {
    if (!String._formatRE) {
        String._formatRE = /(\{[^\}^\{]+\})/g;
    }
    return format.replace(String._formatRE, function (str, m) {
        var index = parseInt(m.substr(1));
        var value = values[index + 1];
        if (isNullOrUndefined(value)) {
            return '';
        }
        if (value.format) {
            var formatSpec = null;
            var formatIndex = m.indexOf(':');
            if (formatIndex > 0) {
                formatSpec = m.substring(formatIndex + 1, m.length - 1);
            }
            return value.format.call(value, formatSpec, useLocale);
        } else {
            if (useLocale) {
                return value.toLocaleString();
            }
            return value.toString();
        }
    });
}
String.format = function (format) {
    return String._format(format, arguments, false);
}
String.fromChar = function (ch, count) {
    var s = ch;
    for (var i = 1; i < count; i++) {
        s += ch;
    }
    return s;
}
String.prototype.htmlDecode = function () {
    if (!String._htmlDecRE) {
        String._htmlDecMap = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"'
        };
        String._htmlDecRE = /(&amp;|&lt;|&gt;|&quot;)/gi;
    }
    var s = this;
    s = s.replace(String._htmlDecRE, function (str, m) {
        return String._htmlDecMap[m];
    });
    return s;
}
String.prototype.htmlEncode = function () {
    if (!String._htmlEncRE) {
        String._htmlEncMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        };
        String._htmlEncRE = /([&<>"])/g;
    }
    var s = this;
    if (String._htmlEncRE.test(s)) {
        s = s.replace(String._htmlEncRE, function (str, m) {
            return String._htmlEncMap[m];
        });
    }
    return s;
}
String.prototype.indexOfAny = function (chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return - 1;
    }
    startIndex = startIndex || 0;
    count = count || length;
    var endIndex = startIndex + count - 1;
    if (endIndex >= length) {
        endIndex = length - 1;
    }
    for (var i = startIndex; i <= endIndex; i++) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return - 1;
}
String.prototype.insert = function (index, value) {
    if (!value) {
        return this;
    }
    if (!index) {
        return value + this;
    }
    var s1 = this.substr(0, index);
    var s2 = this.substr(index);
    return s1 + value + s2;
}
String.isNullOrEmpty = function (s) {
    return !s || !s.length;
}
String.prototype.lastIndexOfAny = function (chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return - 1;
    }
    startIndex = startIndex || length - 1;
    count = count || length;
    var endIndex = startIndex - count + 1;
    if (endIndex < 0) {
        endIndex = 0;
    }
    for (var i = startIndex; i >= endIndex; i--) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return - 1;
}
String.localeFormat = function (format) {
    return String._format(format, arguments, true);
}
String.prototype.padLeft = function (totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = ch || ' ';
        return String.fromChar(ch, totalWidth - this.length) + this;
    }
    return this;
}
String.prototype.padRight = function (totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = ch || ' ';
        return this + String.fromChar(ch, totalWidth - this.length);
    }
    return this;
}
String.prototype.quote = function () {
    if (!String._quoteMap) {
        String._quoteMap = {
            '\\': '\\\\',
            '\'': '\\\'',
            '"': '\\"',
            '\r': '\\r',
            '\n': '\\n',
            '\t': '\\t',
            '\f': '\\f',
            '': '\\b'
        };
    }
    if (!String._quoteRE || !RegExp._cacheable) {
        String._quoteRE = new RegExp('([\'"\\\\\0--?])', 'g');
    }
    var s = this;
    if (String._quoteSkipTest || String._quoteRE.test(s)) {
        s = this.replace(String._quoteRE, function (str, m) {
            var c = String._quoteMap[m];
            if (c) {
                return c;
            }
            c = m.charCodeAt(0);
            return '\\u' + c.toString(16).toUpperCase().padLeft(4, '0');
        });
    }
    return '"' + s + '"';
}
String.prototype.remove = function (index, count) {
    if (!count || ((index + count) > this.length)) {
        return this.substr(0, index);
    }
    return this.substr(0, index) + this.substr(index + count);
}
String.prototype._replace = String.prototype.replace;
String.prototype.replace = function (oldValue, newValue) {
    if (oldValue.constructor == String) {
        newValue = newValue || '';
        return this.split(oldValue).join(newValue);
    }
    return String.prototype._replace.call(this, oldValue, newValue);
}
String.prototype.startsWith = function (prefix) {
    if (!prefix.length) {
        return true;
    }
    if (prefix.length > this.length) {
        return false;
    }
    return (this.substr(0, prefix.length) == prefix);
}
String.prototype.trim = function () {
    return this.trimEnd().trimStart();
}
String.prototype.trimEnd = function () {
    return this.replace(/\s*$/, '');
}
String.prototype.trimStart = function () {
    return this.replace(/^\s*/, '');
}
String.prototype.unquote = function () {
    return eval('(' + this + ')');
}
Array.__typeName = 'Array';
Array.prototype.add = function (item) {
    this[this.length] = item;
}
Array.prototype.addRange = function (items) {
    if (!items) {
        return;
    }
    var length = items.length;
    for (var index = 0; index < length; index++) {
        this[this.length] = items[index];
    }
}
Array.prototype.aggregate = function (seed, callback) {
    var length = this.length;
    for (var index = 0; index < length; index++) {
        seed = callback(seed, this[index], index, this);
    }
    return seed;
}
Array.prototype.clear = function () {
    if (this.length > 0) {
        this.splice(0, this.length);
    }
}
Array.prototype.clone = function () {
    var length = this.length;
    var array = new Array(length);
    for (var index = 0; index < length; index++) {
        array[index] = this[index];
    }
    return array;
}
Array.prototype.contains = function (item) {
    var index = this.indexOf(item);
    return (index >= 0);
}
Array.prototype.dequeue = function () {
    return this.shift();
}
Array.prototype.enqueue = function (item) {
    this._queue = true;
    this.push(item);
}
Array.prototype.peek = function () {
    if (this.length) {
        var index = this._queue ? 0 : this.length - 1;
        return this[index];
    }
    return null;
}
if (!Array.prototype.every) {
    Array.prototype.every = function (callback) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (!callback(this[i], i, this)) {
                return false;
            }
        }
        return true;
    }
}
Array.prototype.extract = function (index, count) {
    if (!count) {
        return this.slice(index);
    }
    return this.slice(index, index + count);
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback) {
        var filtered = [
        ];
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                filtered.add(this[i]);
            }
        }
        return filtered;
    }
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    }
}
Array.prototype.groupBy = function (callback) {
    var length = this.length;
    var groups = [
    ];
    var keys = {
    };
    for (var index = 0; index < length; index++) {
        var key = callback(this[index], index);
        if (String.isNullOrEmpty(key)) {
            continue;
        }
        var items = keys[key];
        if (!items) {
            items = [
            ];
            items.key = key;
            keys[key] = items;
            groups.add(items);
        }
        items.add(this[index]);
    }
    return groups;
}
Array.prototype.index = function (callback) {
    var length = this.length;
    var items = {
    };
    for (var index = 0; index < length; index++) {
        var key = callback(this[index], index);
        if (String.isNullOrEmpty(key)) {
            continue;
        }
        items[key] = this[index];
    }
    return items;
}
Array.prototype.indexOf = function (item) {
    var length = this.length;
    if (length) {
        for (var index = 0; index < length; index++) {
            if (this[index] === item) {
                return index;
            }
        }
    }
    return - 1;
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
}
Array.prototype.insertRange = function (index, items) {
    this.splice(index, 0, items);
}
if (!Array.prototype.map) {
    Array.prototype.map = function (callback) {
        var mapped = new Array(this.length);
        for (var i = this.length - 1; i >= 0; i--) {
            mapped[i] = callback(this[i], i, this);
        }
        return mapped;
    }
}
Array.parse = function (s) {
    return eval('(' + s + ')');
}
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index >= 0) {
        this.splice(index, 1);
        return true;
    }
    return false;
}
Array.prototype.removeAt = function (index) {
    return this.splice(index, 1) [0];
}
Array.prototype.removeRange = function (index, count) {
    return this.splice(index, count);
}
if (!Array.prototype.some) {
    Array.prototype.some = function (callback) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (callback(this[i], i, this)) {
                return true;
            }
        }
        return false;
    }
}
RegExp.__typeName = 'RegExp';
RegExp.parse = function (s) {
    if (s.startsWith('/')) {
        var endSlashIndex = s.lastIndexOf('/');
        if (endSlashIndex > 1) {
            var expression = s.substring(1, endSlashIndex);
            var flags = s.substr(endSlashIndex + 1);
            return new RegExp(expression, flags);
        }
    }
    return null;
}
Date.__typeName = 'Date';
Date.get_now = function () {
    return new Date();
}
Date.get_today = function () {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
Date.prototype.format = function (format, useLocale) {
    if (isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        if (useLocale) {
            return this.toLocaleString();
        } else {
            return this.toString();
        }
    }
    if (format == 'id') {
        if (useLocale) {
            return this.toLocaleDateString();
        } else {
            return this.toDateString();
        }
    }
    if (format == 'it') {
        if (useLocale) {
            return this.toLocaleTimeString();
        } else {
            return this.toTimeString();
        }
    }
    return this._netFormat(format, useLocale);
}
Date.prototype._netFormat = function (format, useLocale) {
    var dtf = useLocale ? CultureInfo.Current.dateFormat : CultureInfo.Neutral.dateFormat;
    var useUTC = false;
    if (format.length == 1) {
        switch (format) {
            case 'f':
                format = dtf.longDatePattern + ' ' + dtf.shortTimePattern;
            case 'F':
                format = dtf.dateTimePattern;
                break;
            case 'd':
                format = dtf.shortDatePattern;
                break;
            case 'D':
                format = dtf.longDatePattern;
                break;
            case 't':
                format = dtf.shortTimePattern;
                break;
            case 'T':
                format = dtf.longTimePattern;
                break;
            case 'g':
                format = dtf.shortDatePattern + ' ' + dtf.shortTimePattern;
                break;
            case 'G':
                format = dtf.shortDatePattern + ' ' + dtf.longTimePattern;
                break;
            case 'R':
            case 'r':
                format = dtf.gmtDateTimePattern;
                useUTC = true;
                break;
            case 'u':
                format = dtf.universalDateTimePattern;
                useUTC = true;
                break;
            case 'U':
                format = dtf.dateTimePattern;
                useUTC = true;
                break;
            case 's':
                format = dtf.sortableDateTimePattern;
                break;
        }
    }
    if (format.charAt(0) == '%') {
        format = format.substr(1);
    }
    if (!Date._formatRE) {
        Date._formatRE = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;
    }
    var re = Date._formatRE;
    var sb = new StringBuilder();
    var dt = this;
    if (useUTC) {
        dt = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds()));
    }
    re.lastIndex = 0;
    while (true) {
        var index = re.lastIndex;
        var match = re.exec(format);
        sb.append(format.slice(index, match ? match.index : format.length));
        if (!match) {
            break;
        }
        var fs = match[0];
        var part = fs;
        switch (fs) {
            case 'dddd':
                part = dtf.dayNames[dt.getDay()];
                break;
            case 'ddd':
                part = dtf.shortDayNames[dt.getDay()];
                break;
            case 'dd':
                part = dt.getDate().toString().padLeft(2, '0');
                break;
            case 'd':
                part = dt.getDate();
                break;
            case 'MMMM':
                part = dtf.monthNames[dt.getMonth()];
                break;
            case 'MMM':
                part = dtf.shortMonthNames[dt.getMonth()];
                break;
            case 'MM':
                part = (dt.getMonth() + 1).toString().padLeft(2, '0');
                break;
            case 'M':
                part = (dt.getMonth() + 1);
                break;
            case 'yyyy':
                part = dt.getFullYear();
                break;
            case 'yy':
                part = (dt.getFullYear() % 100).toString().padLeft(2, '0');
                break;
            case 'y':
                part = (dt.getFullYear() % 100);
                break;
            case 'h':
            case 'hh':
                part = dt.getHours() % 12;
                if (!part) {
                    part = '12';
                } else if (fs == 'hh') {
                    part = part.toString().padLeft(2, '0');
                }
                break;
            case 'HH':
                part = dt.getHours().toString().padLeft(2, '0');
                break;
            case 'H':
                part = dt.getHours();
                break;
            case 'mm':
                part = dt.getMinutes().toString().padLeft(2, '0');
                break;
            case 'm':
                part = dt.getMinutes();
                break;
            case 'ss':
                part = dt.getSeconds().toString().padLeft(2, '0');
                break;
            case 's':
                part = dt.getSeconds();
                break;
            case 't':
            case 'tt':
                part = (dt.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator;
                if (fs == 't') {
                    part = part.charAt(0);
                }
                break;
            case 'fff':
                part = dt.getMilliseconds().toString().padLeft(3, '0');
                break;
            case 'ff':
                part = dt.getMilliseconds().toString().padLeft(3).substr(0, 2);
                break;
            case 'f':
                part = dt.getMilliseconds().toString().padLeft(3).charAt(0);
                break;
            case 'z':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part));
                break;
            case 'zz':
            case 'zzz':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part)).toString().padLeft(2, '0');
                if (fs == 'zzz') {
                    part += dtf.timeSeparator + Math.abs(dt.getTimezoneOffset() % 60).toString().padLeft(2, '0');
                }
                break;
        }
        sb.append(part);
    }
    return sb.toString();
}
Error.__typeName = 'Error';
Error.create = function (message, userData, innerException) {
    var e = new Error(message);
    if (userData) {
        e.userData = userData;
    }
    if (innerException) {
        e.innerException = innerException;
    }
    return e;
}
if (!Debug._fail) {
    Debug._fail = function (message) {
        Debug.writeln(message);
        eval('debugger;');
    }
}
Debug.assert = function (condition, message) {
    if (!condition) {
        message = 'Assert failed: ' + message;
        if (confirm(message + '\r\n\r\nBreak into debugger?')) {
            Debug._fail(message);
        }
    }
}
Debug._dumpCore = function (sb, object, name, indentation, dumpedObjects) {
    if (object === null) {
        sb.appendLine(indentation + name + ': null');
        return;
    }
    switch (typeof (object)) {
        case 'undefined':
            sb.appendLine(indentation + name + ': undefined');
            break;
        case 'number':
        case 'string':
        case 'boolean':
            sb.appendLine(indentation + name + ': ' + object);
            break;
        default:
            if (Date.isInstance(object) || RegExp.isInstance(object)) {
                sb.appendLine(indentation + name + ': ' + object);
                break;
            }
            if (dumpedObjects.contains(object)) {
                sb.appendLine(indentation + name + ': ...');
                break;
            }
            dumpedObjects.add(object);
            var type = Type.getInstanceType(object);
            var typeName = type.get_fullName();
            var recursiveIndentation = indentation + '  ';
            if (IArray.isInstance(object)) {
                sb.appendLine(indentation + name + ': {' + typeName + '}');
                var length = object.getLength();
                for (var i = 0; i < length; i++) {
                    Debug._dumpCore(sb, object.getItem(i), '[' + i + ']', recursiveIndentation, dumpedObjects);
                }
            } else {
                var td = TypeDescriptor._getObjectDescriptor(object);
                if (!td) {
                    if (object.tagName) {
                        sb.appendLine(indentation + name + ': <' + object.tagName + '>');
                        var attributes = object.attributes;
                        for (var i = 0; i < attributes.length; i++) {
                            var attrValue = attributes[i].nodeValue;
                            if (attrValue) {
                                Debug._dumpCore(sb, attrValue, attributes[i].nodeName, recursiveIndentation, dumpedObjects);
                            }
                        }
                    } else {
                        sb.appendLine(indentation + name + ': {' + typeName + '}');
                        for (var field in object) {
                            var v = object[field];
                            if (!Function.isInstance(v)) {
                                Debug._dumpCore(sb, v, field, recursiveIndentation, dumpedObjects);
                            }
                        }
                    }
                } else {
                    sb.appendLine(indentation + name + ': {' + typeName + '}');
                    var properties = td._properties;
                    if (properties) {
                        for (var prop in properties) {
                            var propValue = TypeDescriptor.getProperty(object, prop);
                            Debug._dumpCore(sb, propValue, prop, recursiveIndentation, dumpedObjects);
                        }
                    }
                }
            }
            dumpedObjects.remove(object);
            break;
    }
}
Debug.dump = function (object, name) {
    if ((!name || !name.length) && (object !== null)) {
        name = Type.getInstanceType(object).get_fullName();
    }
    if (!name || !name.length) {
        return;
    }
    var sb = new StringBuilder();
    Debug._dumpCore(sb, object, name, '', [
    ]);
    Debug.writeLine(sb.toString());
}
Debug.fail = function (message) {
    Debug._fail(message);
}
Debug.inspect = function (object, name) {
    var dumped = false;
    if (window.debugService) {
        dumped = window.debugService.inspect(name, object);
    }
    if (!dumped) {
        Debug.dump(object, name);
    }
}
Debug.writeLine = function (message) {
    if (window.debugService) {
        window.debugService.trace(message);
        return;
    }
    Debug.writeln(message);
    var traceTextBox = $('_traceTextBox');
    if (traceTextBox) {
        traceTextBox.value = traceTextBox.value + '\r\n' + message;
    }
}
Debug.__typeName = 'Debug';
var Type = Function;
Type.__typeName = 'Type';
var __Namespace = function (name) {
    this.__typeName = name;
}
__Namespace.prototype = {
    __namespace: true,
    getName: function () {
        return this.__typeName;
    }
}
Type.createNamespace = function (name) {
    if (!window.__namespaces) {
        window.__namespaces = {
        };
    }
    if (!window.__rootNamespaces) {
        window.__rootNamespaces = [
        ];
    }
    if (window.__namespaces[name]) {
        return;
    }
    var ns = window;
    var nameParts = name.split('.');
    for (var i = 0; i < nameParts.length; i++) {
        var part = nameParts[i];
        var nso = ns[part];
        if (!nso) {
            ns[part] = nso = new __Namespace(nameParts.slice(0, i + 1).join('.'));
            if (i == 0) {
                window.__rootNamespaces.add(nso);
            }
        }
        ns = nso;
    }
    window.__namespaces[name] = ns;
}
Type.prototype.createClass = function (name, baseType, interfaceType) {
    this.prototype.constructor = this;
    this.__typeName = name;
    this.__class = true;
    this.__baseType = baseType || Object;
    if (baseType) {
        this.__basePrototypePending = true;
    }
    if (interfaceType) {
        this.__interfaces = [
        ];
        for (var i = 2; i < arguments.length; i++) {
            interfaceType = arguments[i];
            this.__interfaces.add(interfaceType);
        }
    }
}
Type.prototype.createInterface = function (name) {
    this.__typeName = name;
    this.__interface = true;
}
Type.prototype.createEnum = function (name, flags) {
    for (var field in this.prototype) {
        this[field] = this.prototype[field];
    }
    this.__typeName = name;
    this.__enum = true;
    if (flags) {
        this.__flags = true;
    }
}
Type.prototype.setupBase = function () {
    if (this.__basePrototypePending) {
        var baseType = this.__baseType;
        if (baseType.__basePrototypePending) {
            baseType.setupBase();
        }
        for (var memberName in baseType.prototype) {
            var memberValue = baseType.prototype[memberName];
            if (!this.prototype[memberName]) {
                this.prototype[memberName] = memberValue;
            }
        }
        delete this.__basePrototypePending;
    }
}
Type.prototype.constructBase = function (instance, args) {
    if (this.__basePrototypePending) {
        this.setupBase();
    }
    if (!args) {
        this.__baseType.apply(instance);
    } else {
        this.__baseType.apply(instance, args);
    }
}
Type.prototype.callBase = function (instance, name, args) {
    var baseMethod = this.__baseType.prototype[name];
    if (!args) {
        return baseMethod.apply(instance);
    } else {
        return baseMethod.apply(instance, args);
    }
}
Type.prototype.get_baseType = function () {
    return this.__baseType || null;
}
Type.prototype.get_fullName = function () {
    return this.__typeName;
}
Type.prototype.get_name = function () {
    var fullName = this.__typeName;
    var nsIndex = fullName.lastIndexOf('.');
    if (nsIndex > 0) {
        return fullName.substr(nsIndex + 1);
    }
    return fullName;
}
Type.prototype.isInstance = function (instance) {
    if (isNullOrUndefined(instance)) {
        return false;
    }
    if ((this == Object) || (instance instanceof this)) {
        return true;
    }
    var type = Type.getInstanceType(instance);
    return this.isAssignableFrom(type);
}
Type.prototype.isAssignableFrom = function (type) {
    if ((this == Object) || (this == type)) {
        return true;
    }
    if (this.__class) {
        var baseType = type.__baseType;
        while (baseType) {
            if (this == baseType) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    } else if (this.__interface) {
        var interfaces = type.__interfaces;
        if (interfaces && interfaces.contains(this)) {
            return true;
        }
        var baseType = type.__baseType;
        while (baseType) {
            interfaces = baseType.__interfaces;
            if (interfaces && interfaces.contains(this)) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    return false;
}
Type.isClass = function (type) {
    return (type.__class == true);
}
Type.isEnum = function (type) {
    return (type.__enum == true);
}
Type.isFlagsEnum = function (type) {
    return ((type.__enum == true) && (type.__flags == true));
}
Type.isInterface = function (type) {
    return (type.__interface == true);
}
Type.canCast = function (instance, type) {
    return type.isInstance(instance);
}
Type.safeCast = function (instance, type) {
    if (type.isInstance(instance)) {
        return instance;
    }
    return null;
}
Type.getInstanceType = function (instance) {
    var ctor = null;
    try {
        ctor = instance.constructor;
    } catch (ex) {
    }
    if (!ctor || !ctor.__typeName) {
        ctor = Object;
    }
    return ctor;
}
Type.getType = function (typeName) {
    if (!typeName) {
        return null;
    }
    if (!Type.__typeCache) {
        Type.__typeCache = {
        };
    }
    var type = Type.__typeCache[typeName];
    if (!type) {
        type = eval(typeName);
        Type.__typeCache[typeName] = type;
    }
    return type;
}
Type.parse = function (typeName) {
    return Type.getType(typeName);
}
var Enum = function () {
}
Enum.createClass('Enum');
Enum.parse = function (enumType, s) {
    var values = enumType.prototype;
    if (!enumType.__flags) {
        for (var f in values) {
            if (f === s) {
                return values[f];
            }
        }
    } else {
        var parts = s.split('|');
        var value = 0;
        var parsed = true;
        for (var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            var found = false;
            for (var f in values) {
                if (f === part) {
                    value |= values[f];
                    found = true;
                    break;
                }
            }
            if (!found) {
                parsed = false;
                break;
            }
        }
        if (parsed) {
            return value;
        }
    }
    throw 'Invalid Enumeration Value';
}
Enum.toString = function (enumType, value) {
    var values = enumType.prototype;
    if (!enumType.__flags || (value === 0)) {
        for (var i in values) {
            if (values[i] === value) {
                return i;
            }
        }
        throw 'Invalid Enumeration Value';
    } else {
        var parts = [
        ];
        for (var i in values) {
            if (values[i] & value) {
                if (parts.length) {
                    parts.add(' | ');
                }
                parts.add(i);
            }
        }
        if (!parts.length) {
            throw 'Invalid Enumeration Value';
        }
        return parts.join('');
    }
}
var Delegate = function () {
}
Delegate.createClass('Delegate');
Delegate.Null = function () {
}
Delegate._create = function (targets) {
    var delegate = function () {
        if (targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        } else {
            for (var i = 0; i < targets.length; i += 2) {
                targets[i + 1].apply(targets[i], arguments);
            }
            return null;
        }
    };
    delegate.invoke = delegate;
    delegate._targets = targets;
    return delegate;
}
Delegate.create = function (object, method) {
    if (!object) {
        method.invoke = method;
        return method;
    }
    return Delegate._create([object,
    method]);
}
Delegate.combine = function (delegate1, delegate2) {
    if (!delegate1) {
        if (!delegate2._targets) {
            return Delegate.create(null, delegate2);
        }
        return delegate2;
    }
    if (!delegate2) {
        if (!delegate1._targets) {
            return Delegate.create(null, delegate1);
        }
        return delegate1;
    }
    var targets1 = delegate1._targets ? delegate1._targets : [
        null,
        delegate1
    ];
    var targets2 = delegate2._targets ? delegate2._targets : [
        null,
        delegate2
    ];
    return Delegate._create(targets1.concat(targets2));
}
Delegate.remove = function (delegate1, delegate2) {
    if (!delegate1 || (delegate1 === delegate2)) {
        return null;
    }
    if (!delegate2) {
        return delegate1;
    }
    var targets = delegate1._targets;
    var object = null;
    var method;
    if (delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    } else {
        method = delegate2;
    }
    for (var i = 0; i < targets.length; i += 2) {
        if ((targets[i] === object) && (targets[i + 1] === method)) {
            if (targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return Delegate._create(targets);
        }
    }
    return delegate1;
}
Delegate.createExport = function (delegate, multiUse) {
    var name = '__' + (new Date()).valueOf();
    Delegate[name] = function () {
        if (!multiUse) {
            Delegate.deleteExport(name);
        }
        delegate.apply(null, arguments);
    };
    return name;
}
Delegate.deleteExport = function (name) {
    if (Delegate[name]) {
        delete Delegate[name];
    }
}
Delegate.clearExport = function (name) {
    if (Delegate[name]) {
        Delegate[name] = Delegate.Null;
    }
}
var CultureInfo = function (name, numberFormat, dateFormat) {
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateFormat = dateFormat;
}
CultureInfo.createClass('CultureInfo');
CultureInfo.Neutral = new CultureInfo('en-US', {
    naNSymbol: 'NaN',
    negativeSign: '-',
    positiveSign: '+',
    negativeInfinityText: '-Infinity',
    positiveInfinityText: 'Infinity',
    percentSymbol: '%',
    percentGroupSizes: [
        3
    ],
    percentDecimalDigits: 2,
    percentDecimalSeparator: '.',
    percentGroupSeparator: ',',
    percentPositivePattern: '{0} %',
    percentNegativePattern: '-{0} %',
    currencySymbol: '$',
    currencyGroupSizes: [
        3
    ],
    currencyDecimalDigits: 2,
    currencyDecimalSeparator: '.',
    currencyGroupSeparator: ',',
    currencyNegativePattern: '(${0})',
    currencyPositivePattern: '${0}',
    numberGroupSizes: [
        3
    ],
    numberDecimalDigits: 2,
    numberDecimalSeparator: '.',
    numberGroupSeparator: ','
}, {
    amDesignator: 'AM',
    pmDesignator: 'PM',
    dateSeparator: '/',
    timeSeparator: ':',
    gmtDateTimePattern: 'ddd, dd MMM yyyy HH:mm:ss \'GMT\'',
    universalDateTimePattern: 'yyyy-MM-dd HH:mm:ssZ',
    sortableDateTimePattern: 'yyyy-MM-ddTHH:mm:ss',
    dateTimePattern: 'dddd, MMMM dd, yyyy h:mm:ss tt',
    longDatePattern: 'dddd, MMMM dd, yyyy',
    shortDatePattern: 'M/d/yyyy',
    longTimePattern: 'h:mm:ss tt',
    shortTimePattern: 'h:mm tt',
    firstDayOfWeek: 0,
    dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    shortDayNames: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ],
    minimizedDayNames: [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa'
    ],
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
        ''
    ],
    shortMonthNames: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        ''
    ]
});
CultureInfo.Current = CultureInfo.Neutral;
var IArray = function () {
};
IArray.createInterface('IArray');
var IEnumerator = function () {
};
IEnumerator.createInterface('IEnumerator');
var IEnumerable = function () {
};
IEnumerable.createInterface('IEnumerable');
var ArrayEnumerator = function (array) {
    this._array = array;
    this._index = - 1;
}
ArrayEnumerator.prototype = {
    get_current: function () {
        return this._array[this._index];
    },
    moveNext: function () {
        this._index++;
        return (this._index < this._array.length);
    },
    reset: function () {
        this._index = - 1;
    }
}
ArrayEnumerator.createClass('ArrayEnumerator', null, IEnumerator);
Array.__interfaces = [
    IArray,
    IEnumerable
];
Array.prototype.getLength = function () {
    return this.length;
}
Array.prototype.getItem = function (index) {
    return this[index];
}
Array.prototype.getEnumerator = function () {
    return new ArrayEnumerator(this);
}
var IDisposable = function () {
};
IDisposable.createInterface('IDisposable');
var IServiceProvider = function () {
};
IServiceProvider.createInterface('IServiceProvider');
var IServiceContainer = function () {
};
IServiceContainer.createInterface('IServiceContainer');
var StringBuilder = function (s) {
    if ((s !== undefined) && (s !== null)) {
        this._parts = [
            s
        ];
    } else {
        this._parts = [
        ];
    }
}
StringBuilder.prototype = {
    get_isEmpty: function () {
        return (this._parts.length == 0);
    },
    append: function (s) {
        if ((s !== undefined) && (s !== null)) {
            this._parts.add(s);
        }
    },
    appendLine: function (s) {
        this.append(s);
        this.append('\r\n');
    },
    clear: function () {
        this._parts.clear();
    },
    toString: function () {
        return this._parts.join('');
    }
};
StringBuilder.createClass('StringBuilder');
var EventArgs = function () {
}
EventArgs.createClass('EventArgs');
EventArgs.Empty = new EventArgs();
var IEventAccessor = function () {
};
IEventAccessor.createInterface('IEventAccessor');
var IPropertyAccessor = function () {
};
IPropertyAccessor.createInterface('IPropertyAccessor');
var IMethodAccessor = function () {
};
IMethodAccessor.createInterface('IMethodAccessor');
var TypeDescriptor = function (attributes, properties, methods, events, options) {
    if (attributes) {
        this._attributes = attributes;
    }
    if (properties) {
        this._properties = properties;
    }
    if (methods) {
        this._methods = methods;
    }
    if (events) {
        this._events = events;
    }
    if (options) {
        this._options = options;
    }
}
TypeDescriptor.prototype = {
    _attributes: null,
    _properties: null,
    _methods: null,
    _events: null,
    _options: null
};
TypeDescriptor.createClass('TypeDescriptor');
TypeDescriptor.createMetadata = function (memberName, memberType, params, attrs) {
    var memberInfo = {
        name: memberName,
        type: memberType,
        parameters: params
    };
    if (attrs) {
        memberInfo.attributes = attrs;
    }
    return memberInfo;
}
TypeDescriptor._getDescriptor = function (type) {
    if (!type.getMetadata) {
        return null;
    }
    var td = type._td;
    if (td) {
        return td;
    }
    var attributes;
    var properties;
    var methods;
    var events;
    var options;
    var baseType = type.get_baseType();
    if (baseType) {
        var baseTD = TypeDescriptor._getDescriptor(baseType);
        attributes = Object._clone(baseTD._attributes);
        properties = Object._clone(baseTD._properties);
        methods = Object._clone(baseTD._methods);
        events = Object._clone(baseTD._events);
        options = Object._clone(baseTD._options);
    }
    var metadata = type.getMetadata();
    if (metadata) {
        if (metadata.attributes) {
            if (!attributes) {
                attributes = {
                };
            }
            var attrsEnum = metadata.attributes.getEnumerator();
            while (attrsEnum.moveNext()) {
                var attr = attrsEnum.get_current();
                attributes[attr.name] = attr;
            }
        }
        if (metadata.properties) {
            if (!properties) {
                properties = {
                };
            }
            var propEnum = metadata.properties.getEnumerator();
            while (propEnum.moveNext()) {
                var propInfo = propEnum.get_current();
                properties[propInfo.name] = propInfo;
            }
        }
        if (metadata.methods) {
            if (!methods) {
                methods = {
                };
            }
            var methodEnum = metadata.methods.getEnumerator();
            while (methodEnum.moveNext()) {
                var methodInfo = methodEnum.get_current();
                methods[methodInfo.name] = methodInfo;
            }
        }
        if (metadata.events) {
            if (!events) {
                events = {
                };
            }
            var eventEnum = metadata.events.getEnumerator();
            while (eventEnum.moveNext()) {
                var eventInfo = eventEnum.get_current();
                events[eventInfo.name] = eventInfo;
            }
        }
        if (metadata.options) {
            if (!options) {
                options = {
                };
            }
            var optionsEnum = metadata.events.getEnumerator();
            while (optionsEnum.moveNext()) {
                var optionInfo = optionsEnum.get_current();
                options[optionInfo.name] = optionInfo;
            }
        }
    }
    td = new TypeDescriptor(attributes, properties, methods, events);
    type._td = td;
    return td;
}
TypeDescriptor._getObjectDescriptor = function (instance) {
    var type = Type.getInstanceType(instance);
    return TypeDescriptor._getDescriptor(type);
}
TypeDescriptor.getProperty = function (instance, propName, propKey) {
    var propValue = null;
    if (IPropertyAccessor.isInstance(instance)) {
        propValue = instance.getProperty(propName);
    } else {
        var td = TypeDescriptor._getObjectDescriptor(instance);
        if (!td) {
            propValue = instance[propName];
        } else if (td._properties) {
            var propInfo = td._properties[propName];
            if (propInfo) {
                var getter = instance['get_' + propName];
                propValue = getter.call(instance);
            }
        }
    }
    if (propValue && propKey) {
        propValue = propValue[propKey];
    }
    return propValue;
}
TypeDescriptor.setProperty = function (instance, propName, propKey, value) {
    if (propKey) {
        var prop = TypeDescriptor.getProperty(instance, propName);
        prop[propKey] = value;
        return;
    }
    if (IPropertyAccessor.isInstance(instance)) {
        instance.setProperty(propName, value);
    } else {
        var td = TypeDescriptor._getObjectDescriptor(instance);
        if (!td) {
            instance[propName] = value;
        } else if (td._properties) {
            var propInfo = td._properties[propName];
            if (propInfo && !propInfo.readOnly) {
                if ((propInfo.type != String) && (typeof (value) == 'string') && propInfo.type.parse) {
                    value = propInfo.type.parse(value);
                }
                var setter = instance['set_' + propName];
                propValue = setter.call(instance, value);
            }
        }
    }
}
TypeDescriptor.addHandler = function (instance, eventName, handler) {
    if (IEventAccessor.isInstance(instance)) {
        instance.addHandler(eventName, handler);
        return;
    }
    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (td && td._events) {
        var eventInfo = td._events[eventName];
        if (eventInfo) {
            var addMethod = instance['add_' + eventName];
            addMethod.call(instance, handler);
        }
    }
}
TypeDescriptor.removeHandler = function (instance, eventName, handler) {
    if (IEventAccessor.isInstance(instance)) {
        instance.removeHandler(eventName, handler);
        return;
    }
    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (td && td._events) {
        var eventInfo = td._events[eventName];
        if (eventInfo) {
            var removeMethod = instance['remove_' + eventName];
            removeMethod.call(instance, handler);
        }
    }
}
TypeDescriptor.invokeMethod = function (instance, methodName, args) {
    if (IMethodAccessor.isInstance(instance)) {
        return instance.invokeMethod(methodName, args);
    }
    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (!td) {
        return instance[methodName].call(instance);
    }
    if (td._methods) {
        var methodInfo = td._methods[methodName];
        var method = instance[methodInfo.name];
        if (!methodInfo.parameters) {
            return method.call(instance);
        } else {
            var arguments = [
            ];
            for (var i = 0; i < methodInfo.parameters.length; i++) {
                var paramInfo = methodInfo.parameters[i];
                var value = args[parameterInfo.name];
                if (value && (paramInfo.type != String) && (typeof (value) == 'string') && paramInfo.type.parse) {
                    value = paramInfo.type.parse(value);
                }
                arguments[i] = value;
            }
            return method.apply(instance, arguments);
        }
    }
    return null;
}
if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function () {
        var progIDs = [
            'Msxml2.XMLHTTP',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < progIDs.length; i++) {
            try {
                var xmlHttp = new ActiveXObject(progIDs[i]);
                return xmlHttp;
            } catch (ex) {
            }
        }
        return null;
    }
}
var XMLDocumentParser = function () {
}
XMLDocumentParser.createClass('XMLDocumentParser');
XMLDocumentParser.parse = function (markup) {
    if (!window.DOMParser) {
        var progIDs = [
            'Msxml2.DOMDocument.3.0',
            'Msxml2.DOMDocument'
        ];
        for (var i = 0; i < progIDs.length; i++) {
            try {
                var xmlDOM = new ActiveXObject(progIDs[i]);
                xmlDOM.async = false;
                xmlDOM.loadXML(markup);
                xmlDOM.setProperty('SelectionLanguage', 'XPath');
                return xmlDOM;
            } catch (ex) {
            }
        }
    } else {
        try {
            var domParser = new DOMParser();
            return domParser.parseFromString(markup, 'text/xml');
        } catch (ex) {
        }
    }
    return null;
}
var ScriptLoader = function ScriptLoader(scriptURLs) {
    Debug.assert((scriptURLs) && (scriptURLs.length));
    this._scriptURLs = scriptURLs;
    this._scriptLoadIndex = - 1;
}
ScriptLoader.prototype = {
    _scriptURLs: null,
    _loadedHandler: null,
    _errorHandler: null,
    _isIE: false,
    _onLoadHandler: null,
    _onErrorHandler: null,
    _scriptLoadIndex: 0,
    _scriptElements: null,
    _loadedScripts: 0,
    _inError: false,
    _loaded: false,
    dispose: function () {
        if (this._scriptElements) {
            for (var i = 0; i < this._scriptElements.length; i++) {
                var scriptElement = this._scriptElements[i];
                if (this._isIE) {
                    scriptElement.detachEvent('onreadystatechange', this._onLoadHandler);
                } else {
                    scriptElement.detachEvent('onload', this._onLoadHandler);
                    scriptElement.detachEvent('onerror', this._onErrorHandler);
                }
            }
            this._scriptElements = null;
        }
    },
    load: function (loadInParallel, timeout, loadedHandler, errorHandler) {
        Debug.assert(loadedHandler);
        Debug.assert(errorHandler);
        this._loadedHandler = loadedHandler;
        this._errorHandler = errorHandler;
        this._isIE = (window.navigator.userAgent.indexOf('MSIE') >= 0);
        this._onLoadHandler = Delegate.create(this, this._onScriptLoad);
        if (!this._isIE) {
            this._onErrorHandler = Delegate.create(this, this._onScriptError);
        }
        this._scriptElements = [
        ];
        if (loadInParallel) {
            for (var i = 0; i < this._scriptURLs.length; i++) {
                this._loadScript(this._scriptURLs[i]);
            }
        } else {
            this._scriptLoadIndex++;
            this._loadScript(this._scriptURLs[this._scriptLoadIndex]);
        }
        if (timeout) {
            window.setTimeout(Delegate.create(this, this._onScriptError), timeout);
        }
    },
    _loadScript: function (scriptURL) {
        var scriptElement = document.createElement('SCRIPT');
        if (this._isIE) {
            scriptElement.attachEvent('onreadystatechange', this._onLoadHandler);
        } else {
            scriptElement.readyState = 'complete';
            scriptElement.attachEvent('onload', this._onLoadHandler);
            scriptElement.attachEvent('onerror', this._onErrorHandler);
        }
        scriptElement.type = 'text/javascript';
        scriptElement.src = scriptURL;
        this._scriptElements.add(scriptElement);
        document.getElementsByTagName('HEAD') [0].appendChild(scriptElement);
    },
    _onScriptError: function () {
        if ((!this._inError) && (!this._loaded)) {
            this._inError = true;
            this._errorHandler.invoke(this, EventArgs.Empty);
        }
    },
    _onScriptLoad: function () {
        if (this._inError) {
            return;
        }
        var scriptElement = window.event.srcElement;
        if ((scriptElement.readyState != 'complete') && (scriptElement.readyState != 'loaded')) {
            return;
        }
        if (this._scriptLoadIndex != - 1) {
            this._scriptLoadIndex++;
            if (this._scriptLoadIndex != this._scriptURLs.length) {
                this._loadScript(this._scriptURLs[this._scriptLoadIndex]);
                return;
            }
        } else {
            this._loadedScripts++;
            if (this._loadedScripts != this._scriptURLs.length) {
                return;
            }
        }
        this._loaded = true;
        this._loadedHandler.invoke(this, EventArgs.Empty);
    }
};
ScriptLoader.createClass('ScriptLoader', null, IDisposable);
var ScriptHost = function ScriptHost() {
}
ScriptHost.get_isLoading = function () {
    return ScriptHost._loading;
}
ScriptHost.add_load = function (value) {
    if (ScriptHost._loaded) {
        value.invoke(null, EventArgs.Empty);
    } else {
        ScriptHost._loadHandler = Delegate.combine(ScriptHost._loadHandler, value);
    }
}
ScriptHost.remove_load = function (value) {
    ScriptHost._loadHandler = Delegate.remove(ScriptHost._loadHandler, value);
}
ScriptHost.add_unload = function (value) {
    ScriptHost._unloadHandler = Delegate.combine(ScriptHost._unloadHandler, value);
}
ScriptHost.remove_unload = function (value) {
    ScriptHost._unloadHandler = Delegate.remove(ScriptHost._unloadHandler, value);
}
ScriptHost.close = function () {
    if (ScriptHost._fxScripts) {
        ScriptHost._fxScripts.dispose();
        ScriptHost._fxScripts = null;
    }
    if (ScriptHost._coreScripts) {
        ScriptHost._coreScripts.dispose();
        ScriptHost._coreScripts = null;
    }
    if (ScriptHost._unloadHandler) {
        ScriptHost._unloadHandler.invoke(null, EventArgs.Empty);
        ScriptHost._unloadHandler = null;
    }
    if (ScriptHost._windowLoadHandler) {
        window.detachEvent('onload', ScriptHost._windowLoadHandler);
        ScriptHost._windowLoadHandler = null;
    }
    if (ScriptHost._windowUnloadHandler) {
        window.detachEvent('onunload', ScriptHost._windowUnloadHandler);
        ScriptHost._windowUnloadHandler = null;
    }
}
ScriptHost.initialize = function (coreScriptURLs, fxScriptURLs) {
    if (!ScriptHost._initialized) {
        ScriptHost._initialized = true;
        if (ScriptHost._windowLoadHandler) {
            window.detachEvent('onload', ScriptHost._windowLoadHandler);
            ScriptHost._windowLoadHandler = null;
        }
        if ((coreScriptURLs) && (coreScriptURLs.length)) {
            ScriptHost._coreScripts = new ScriptLoader(coreScriptURLs);
        }
        if ((fxScriptURLs) && (fxScriptURLs.length)) {
            ScriptHost._fxScripts = new ScriptLoader(fxScriptURLs);
        }
        if ((!ScriptHost._coreScripts) && (!ScriptHost._fxScripts)) {
            ScriptHost._onLoaded();
        } else {
            ScriptHost._loadScripts();
        }
    }
}
ScriptHost._loadScripts = function () {
    ScriptHost._loading = true;
    if (ScriptHost._coreScripts) {
        ScriptHost._coreScripts.load(false, 20 * 1000, Delegate.create(null, ScriptHost._onScriptsCompleted), Delegate.create(null, ScriptHost._onScriptsError));
        return;
    } else {
        ScriptHost._fxScripts.load(true, 20 * 1000, Delegate.create(null, ScriptHost._onScriptsCompleted), Delegate.create(null, ScriptHost._onScriptsError));
    }
}
ScriptHost._onLoaded = function () {
    ScriptHost._loaded = true;
    if (window.main) {
        window.main();
    }
    if (ScriptHost._loadHandler) {
        ScriptHost._loadHandler.invoke(null, EventArgs.Empty);
        ScriptHost._loadHandler = null;
    }
}
ScriptHost._onScriptsCompleted = function (sender, e) {
    if (sender == ScriptHost._coreScripts) {
        ScriptHost._coreScripts.dispose();
        ScriptHost._coreScripts = null;
        if (ScriptHost._fxScripts) {
            ScriptHost._fxScripts.load(true, 20 * 1000, Delegate.create(null, ScriptHost._onScriptsCompleted), Delegate.create(null, ScriptHost._onScriptsError));
            return;
        }
    } else {
        ScriptHost._fxScripts.dispose();
        ScriptHost._fxScripts = null;
    }
    ScriptHost._loading = false;
    ScriptHost._onLoaded();
}
ScriptHost._onScriptsError = function (sender, e) {
}
ScriptHost._onWindowLoad = function () {
    ScriptHost.initialize(null, null);
}
ScriptHost._onWindowUnload = function () {
    ScriptHost.close();
}
ScriptHost.createClass('ScriptHost');
ScriptHost._coreScripts = null;
ScriptHost._fxScripts = null;
ScriptHost._loadHandler = null;
ScriptHost._unloadHandler = null;
ScriptHost._initialized = false;
ScriptHost._loading = false;
ScriptHost._loaded = false;
ScriptHost._windowLoadHandler = Delegate.create(null, ScriptHost._onWindowLoad);
ScriptHost._windowUnloadHandler = Delegate.create(null, ScriptHost._onWindowUnload);
window.attachEvent('onload', ScriptHost._windowLoadHandler);
window.attachEvent('onunload', ScriptHost._windowUnloadHandler);
Type.createNamespace('ScriptFX');
ScriptFX.CollectionChangedAction = function () {
};
ScriptFX.CollectionChangedAction.prototype = {
    add: 0,
    remove: 1,
    reset: 2
}
ScriptFX.CollectionChangedAction.createEnum('ScriptFX.CollectionChangedAction', false);
ScriptFX.$create__Core$1 = function (eventType, sender, eventArgs, eventCookie) {
    var $o = {
    };
    $o.$1 = eventType;
    $o.$0 = sender;
    $o.$2 = eventArgs;
    $o.$3 = eventCookie;
    return $o;
}
ScriptFX.IEventManager = function () {
};
ScriptFX.IEventManager.createInterface('ScriptFX.IEventManager');
ScriptFX.ISupportInitialize = function () {
};
ScriptFX.ISupportInitialize.createInterface('ScriptFX.ISupportInitialize');
ScriptFX.INotifyDisposing = function () {
};
ScriptFX.INotifyDisposing.createInterface('ScriptFX.INotifyDisposing');
ScriptFX.HostName = function () {
};
ScriptFX.HostName.prototype = {
    other: 0,
    IE: 1,
    mozilla: 2,
    safari: 3,
    opera: 4
}
ScriptFX.HostName.createEnum('ScriptFX.HostName', false);
ScriptFX.INotifyCollectionChanged = function () {
};
ScriptFX.INotifyCollectionChanged.createInterface('ScriptFX.INotifyCollectionChanged');
ScriptFX.INotifyPropertyChanged = function () {
};
ScriptFX.INotifyPropertyChanged.createInterface('ScriptFX.INotifyPropertyChanged');
ScriptFX.ITask = function () {
};
ScriptFX.ITask.createInterface('ScriptFX.ITask');
ScriptFX.IObjectWithOwner = function () {
};
ScriptFX.IObjectWithOwner.createInterface('ScriptFX.IObjectWithOwner');
ScriptFX.Application = function () {
    this.$9 = [
    ];
    this.$A = 100;
    ScriptHost.add_load(Delegate.create(this, this.$18));
    ScriptHost.add_unload(Delegate.create(this, this.$19));
    this.$12 = Delegate.create(this, this.$1C);
    window.attachEvent('onbeforeunload', this.$12);
    this.$13 = Delegate.create(this, this.$1B);
    window.attachEvent('onerror', this.$13);
    var $0 = document.documentElement;
    var $1 = $0.className;
    if ($1.startsWith('$')) {
        var $2 = this.get_host();
        $1 = $1.replace('$browser', Enum.toString(ScriptFX.HostName, $2.get_name()));
        $1 = $1.replace('$majorver', $2.get_majorVersion().toString());
        $1 = $1.replace('$minorver', $2.get_minorVersion().toString());
        $0.className = $1;
    }
}
ScriptFX.Application.prototype = {
    $0: null,
    $1: 0,
    $2: null,
    $3: false,
    $4: false,
    $5: false,
    $6: null,
    $7: null,
    $8: null,
    $9: null,
    $A: 0,
    $B: 0,
    $C: null,
    $D: 0,
    $E: null,
    $F: null,
    $10: null,
    $11: null,
    $12: null,
    $13: null,
    $14: null,
    $15: null,
    get_domain: function () {
        return window.document.domain;
    },
    set_domain: function (value) {
        window.document.domain = value;
        return value;
    },
    get_$16: function () {
        if (!this.$8) {
            this.$8 = new ScriptFX.EventList();
        }
        return this.$8;
    },
    get_history: function () {
        return this.$7;
    },
    get_host: function () {
        if (!this.$0) {
            this.$0 = new ScriptFX.HostInfo();
        }
        return this.$0;
    },
    get_idleFrequency: function () {
        return this.$A;
    },
    set_idleFrequency: function (value) {
        this.$A = value;
        return value;
    },
    get_isFirstLoad: function () {
        return this.$5;
    },
    get_isIE: function () {
        if (!this.$1) {
            this.$1 = (this.get_host().get_name() === 1) ? 1 : - 1;
        }
        return (this.$1 === 1) ? true : false;
    },
    get_sessionState: function () {
        return this.$6;
    },
    add_error: function (value) {
        this.get_$16().addHandler('error', value);
    },
    remove_error: function (value) {
        this.get_$16().removeHandler('error', value);
    },
    add_idle: function (value) {
        this.get_$16().addHandler('idle', value);
        if (!this.$B) {
            if (!this.$14) {
                this.$14 = Delegate.create(this, this.$17);
            }
            this.$B = window.setTimeout(this.$14, this.$A);
        }
    },
    remove_idle: function (value) {
        var $0 = this.get_$16().removeHandler('idle', value);
        if ((!$0) && (this.$B)) {
            window.clearTimeout(this.$B);
            this.$B = 0;
        }
    },
    add_load: function (value) {
        if (this.$3) {
            value.invoke(this, EventArgs.Empty);
        } else {
            this.get_$16().addHandler('load', value);
        }
    },
    remove_load: function (value) {
        this.get_$16().removeHandler('load', value);
    },
    add_unload: function (value) {
        this.get_$16().addHandler('unload', value);
    },
    remove_unload: function (value) {
        this.get_$16().removeHandler('unload', value);
    },
    add_unloading: function (value) {
        this.get_$16().addHandler('unloading', value);
    },
    remove_unloading: function (value) {
        this.get_$16().removeHandler('unloading', value);
    },
    addTask: function (task) {
        if (!this.$C) {
            this.$C = [
            ];
        }
        this.$C.enqueue(task);
        if (!this.$D) {
            if (!this.$15) {
                this.$15 = Delegate.create(this, this.$1A);
            }
            this.$D = window.setTimeout(this.$15, 0);
        }
    },
    enableHistory: function () {
        if (this.$7) {
            return;
        }
        this.$7 = ScriptFX.HistoryManager.$8();
    },
    getService: function (serviceType) {
        if ((serviceType === IServiceContainer) || (serviceType === ScriptFX.IEventManager)) {
            return this;
        }
        if (this.$11) {
            var $0 = serviceType.get_fullName().replace('.', '$');
            return this.$11[$0];
        }
        return null;
    },
    $17: function () {
        this.$B = 0;
        var $0 = this.get_$16().getHandler('idle');
        if ($0) {
            $0.invoke(this, EventArgs.Empty);
            this.$B = window.setTimeout(this.$14, this.$A);
        }
    },
    $18: function ($p0, $p1) {
        var $0 = $('__session');
        if ($0) {
            var $2 = $0.value;
            if (String.isNullOrEmpty($2)) {
                this.$5 = true;
                this.$6 = {
                };
            } else {
                this.$6 = ScriptFX.JSON.deserialize($2);
                if (isUndefined(this.$6['__appLoaded'])) {
                    this.$5 = true;
                }
            }
            this.$6['__appLoaded'] = true;
        } else {
            this.$5 = true;
        }
        if (this.$2) {
            for (var $3 = 0; $3 < this.$2.length; $3 += 2) {
                this.$2[$3].main(this.$2[$3 + 1]);
            }
            this.$2 = null;
        }
        this.$3 = true;
        var $1 = this.get_$16().getHandler('load');
        if ($1) {
            $1.invoke(this, EventArgs.Empty);
        }
        if (this.$7) {
            this.$7.$A();
        }
    },
    $19: function ($p0, $p1) {
        if (!this.$4) {
            this.$4 = true;
            if (this.$D) {
                window.clearTimeout(this.$D);
            }
            if (this.$B) {
                window.clearTimeout(this.$B);
            }
            var $0 = this.get_$16().getHandler('unload');
            if ($0) {
                $0.invoke(this, EventArgs.Empty);
            }
            if (this.$C) {
                while (this.$C.length) {
                    var $1 = this.$C.dequeue();
                    if (Type.canCast($1, IDisposable)) {
                        ($1).dispose();
                    }
                }
            }
            if (this.$9.length) {
                var $enum1 = this.$9.getEnumerator();
                while ($enum1.moveNext()) {
                    var $2 = $enum1.get_current();
                    $2.dispose();
                }
                this.$9.clear();
            }
            if (this.$7) {
                this.$7.dispose();
                this.$7 = null;
            }
            window.detachEvent('onbeforeunload', this.$12);
            window.detachEvent('onerror', this.$13);
            this.$12 = null;
            this.$13 = null;
            this.$15 = null;
            this.$14 = null;
        }
    },
    $1A: function () {
        this.$D = 0;
        if (this.$C.length) {
            var $0 = this.$C.dequeue();
            if (!$0.execute()) {
                this.$C.enqueue($0);
            } else {
                if (Type.canCast($0, IDisposable)) {
                    ($0).dispose();
                }
            }
            if (this.$C.length) {
                this.$D = window.setTimeout(this.$15, 0);
            }
        }
    },
    $1B: function () {
        var $0 = this.get_$16().getHandler('error');
        if ($0) {
            var $1 = new ScriptFX.CancelEventArgs();
            $1.set_canceled(true);
            $0.invoke(this, $1);
            if ($1.get_canceled()) {
                window.event.returnValue = false;
            }
        }
    },
    $1C: function () {
        var $0 = this.get_$16().getHandler('unloading');
        if ($0) {
            var $1 = new ScriptFX.ApplicationUnloadingEventArgs();
            $0.invoke(this, $1);
        }
        if (this.$6) {
            var $2 = $('__session');
            $2.value = ScriptFX.JSON.serialize(this.$6);
        }
    },
    raiseEvent: function (eventType, sender, e) {
        if (this.$E) {
            var $0 = this.$E[eventType];
            if ($0) {
                $0.invoke(sender, e);
            }
        }
    },
    registerDisposableObject: function (disposableObject) {
        if (!this.$4) {
            this.$9.add(disposableObject);
        }
    },
    registerEvent: function (eventType, sender, e) {
        if (this.$E) {
            var $1 = this.$E[eventType];
            if ($1) {
                $1.invoke(sender, e);
            }
        }
        if (!this.$10) {
            this.$10 = [
            ];
        }
        if (!this.$F) {
            this.$F = {
            };
            this.$F[eventType] = 1;
        } else {
            var $2 = this.$F[eventType];
            if (isUndefined($2)) {
                this.$F[eventType] = 1;
            } else {
                this.$F[eventType] = 1 + $2;
            }
        }
        var $0 = ScriptFX.$create__Core$1(eventType, sender, e, this.$10.length);
        this.$10.add($0);
        return $0.$3;
    },
    registerEventHandler: function (eventType, handler) {
        var $0 = null;
        if (!this.$E) {
            this.$E = {
            };
        } else {
            $0 = this.$E[eventType];
        }
        this.$E[eventType] = Delegate.combine($0, handler);
        if (!isNullOrUndefined(this.$F[eventType])) {
            var $enum1 = this.$10.getEnumerator();
            while ($enum1.moveNext()) {
                var $1 = $enum1.get_current();
                if (!$1) {
                    continue;
                }
                if ($1.$1 === eventType) {
                    handler.invoke($1.$0, $1.$2);
                }
            }
        }
    },
    registerService: function (serviceType, service) {
        if (!this.$11) {
            this.$11 = {
            };
        }
        var $0 = serviceType.get_fullName().replace('.', '$');
        this.$11[$0] = service;
    },
    run: function (scriptletType, args) {
        if (this.$3) {
            scriptletType.main(args);
        } else {
            if (!this.$2) {
                this.$2 = [
                ];
            }
            this.$2.add(scriptletType);
            this.$2.add(args);
        }
    },
    unregisterDisposableObject: function (disposableObject) {
        if (!this.$4) {
            this.$9.remove(disposableObject);
        }
    },
    unregisterEvent: function (eventCookie) {
        var $0 = this.$10[eventCookie];
        var $1 = this.$F[$0.$1];
        if ($1 === 1) {
            delete this.$F[$0.$1];
        } else {
            this.$F[$0.$1] = $1 - 1;
        }
        this.$10[eventCookie] = null;
    },
    unregisterEventHandler: function (eventType, handler) {
        if (this.$E) {
            var $0 = this.$E[eventType];
            if ($0) {
                $0 = Delegate.remove($0, handler);
                if (!$0) {
                    delete this.$E[eventType];
                } else {
                    this.$E[eventType] = $0;
                }
            }
        }
    },
    unregisterService: function (serviceType) {
        if (this.$11) {
            var $0 = serviceType.get_fullName().replace('.', '$');
            delete this.$11[$0];
        }
    }
}
ScriptFX.CancelEventArgs = function () {
    ScriptFX.CancelEventArgs.constructBase(this);
}
ScriptFX.CancelEventArgs.prototype = {
    $1_0: false,
    get_canceled: function () {
        return this.$1_0;
    },
    set_canceled: function (value) {
        this.$1_0 = value;
        return value;
    }
}
ScriptFX.CollectionChangedEventArgs = function (action, item) {
    ScriptFX.CollectionChangedEventArgs.constructBase(this);
    this.$1_0 = action;
    this.$1_1 = item;
}
ScriptFX.CollectionChangedEventArgs.prototype = {
    $1_0: 0,
    $1_1: null,
    get_action: function () {
        return this.$1_0;
    },
    get_item: function () {
        return this.$1_1;
    }
}
ScriptFX.ApplicationUnloadingEventArgs = function () {
    ScriptFX.ApplicationUnloadingEventArgs.constructBase(this);
}
ScriptFX.ApplicationUnloadingEventArgs.prototype = {
    setUnloadPrompt: function (prompt) {
        window.event.returnValue = prompt;
    }
}
ScriptFX.HistoryManager = function (enabled, iframe) {
    this.$0 = enabled;
    this.$1 = iframe;
}
ScriptFX.HistoryManager.$8 = function () {
    var $0 = ScriptFX.Application.current.get_host().get_name();
    if (($0 !== 1) && ($0 !== 2)) {
        return new ScriptFX.HistoryManager(false, null);
    }
    var $1 = null;
    if ($0 === 1) {
        $1 = $('_historyFrame');
    }
    return new ScriptFX.HistoryManager(true, $1);
}
ScriptFX.HistoryManager.prototype = {
    $0: false,
    $1: null,
    $2: null,
    $3: null,
    $4: false,
    $5: false,
    $6: null,
    get_isEnabled: function () {
        return this.$0;
    },
    add_navigated: function (value) {
        this.$7 = Delegate.combine(this.$7, value);
    },
    remove_navigated: function (value) {
        this.$7 = Delegate.remove(this.$7, value);
    },
    $7: null,
    addEntry: function (entryName) {
        if (!this.$0) {
            return;
        }
        this.$4 = true;
        if (this.$1) {
            this.$5 = true;
            this.$1.src = this.$2 + entryName;
        } else {
            this.$E(entryName);
        }
    },
    dispose: function () {
        if (this.$1) {
            this.$1.detachEvent('onload', this.$3);
            this.$1 = null;
        }
    },
    $9: function () {
        var $0 = window.location.hash;
        if (($0.length) && ($0.charAt(0) === '#')) {
            $0 = $0.substr(1);
        }
        return $0;
    },
    goBack: function () {
        window.history.back();
    },
    goForward: function () {
        window.history.forward();
    },
    $A: function () {
        if (!this.$0) {
            return;
        }
        ScriptFX.Application.current.add_idle(Delegate.create(this, this.$B));
        if (this.$1) {
            this.$2 = this.$1.src + '?';
            this.$3 = Delegate.create(this, this.$C);
            this.$1.attachEvent('onload', this.$3);
        }
        this.$6 = this.$9();
        this.$D(this.$6);
    },
    $B: function ($p0, $p1) {
        var $0 = this.$9();
        if ($0 !== this.$6) {
            if (this.$4) {
                return;
            }
            this.$6 = $0;
            this.$D($0);
        } else {
            this.$4 = false;
        }
    },
    $C: function () {
        var $0 = this.$1.contentWindow.location.search;
        if (($0.length) && ($0.charAt(0) === '?')) {
            $0 = $0.substr(1);
        }
        this.$E($0);
        if (this.$5) {
            this.$5 = false;
            return;
        }
        this.$D($0);
    },
    $D: function ($p0) {
        if (this.$7) {
            this.$7.invoke(this, new ScriptFX.HistoryEventArgs($p0));
        }
    },
    $E: function ($p0) {
        this.$6 = $p0;
        window.location.hash = $p0;
    }
}
ScriptFX.HistoryEventArgs = function (entryName) {
    ScriptFX.HistoryEventArgs.constructBase(this);
    this.$1_0 = entryName;
}
ScriptFX.HistoryEventArgs.prototype = {
    $1_0: null,
    get_entryName: function () {
        return this.$1_0;
    }
}
ScriptFX.HostInfo = function () {
    var $0 = window.navigator.userAgent.toLowerCase();
    var $1 = null;
    var $2;
    if (($2 = $0.indexOf('opera')) >= 0) {
        this.$0 = 4;
        $1 = $0.substr($2 + 6);
    } else if (($2 = $0.indexOf('msie')) >= 0) {
        this.$0 = 1;
        $1 = $0.substr($2 + 5);
    } else if (($2 = $0.indexOf('safari')) >= 0) {
        this.$0 = 3;
        $1 = $0.substr($2 + 7);
    } else if (($2 = $0.indexOf('firefox')) >= 0) {
        this.$0 = 2;
        $1 = $0.substr($2 + 8);
    } else if ($0.indexOf('gecko') >= 0) {
        this.$0 = 2;
        $1 = window.navigator.appVersion;
    }
    if ($1) {
        this.$1 = parseFloat($1);
        this.$2 = parseInt(this.$1);
        if (($2 = $1.indexOf('.')) >= 0) {
            this.$3 = parseInt($1.substr($2 + 1));
        }
    }
}
ScriptFX.HostInfo.prototype = {
    $0: 0,
    $1: 0,
    $2: 0,
    $3: 0,
    get_majorVersion: function () {
        return this.$2;
    },
    get_minorVersion: function () {
        return this.$3;
    },
    get_name: function () {
        return this.$0;
    },
    get_version: function () {
        return this.$1;
    }
}
ScriptFX.EventList = function () {
}
ScriptFX.EventList.prototype = {
    $0: null,
    addHandler: function (key, handler) {
        if (!this.$0) {
            this.$0 = {
            };
        }
        this.$0[key] = Delegate.combine(this.$0[key], handler);
    },
    getHandler: function (key) {
        if (this.$0) {
            return this.$0[key];
        }
        return null;
    },
    removeHandler: function (key, handler) {
        if (this.$0) {
            var $0 = this.$0[key];
            if ($0) {
                var $1 = Delegate.remove($0, handler);
                this.$0[key] = $1;
                return ($1);
            }
        }
        return false;
    }
}
ScriptFX.JSON = function () {
}
ScriptFX.JSON.deserialize = function (s) {
    if (String.isNullOrEmpty(s)) {
        return null;
    }
    if (!ScriptFX.JSON.$0) {
        ScriptFX.JSON.$0 = new RegExp('(\'|")\\\\@(-?[0-9]+)@(\'|")', 'gm');
    }
    s = s.replace(ScriptFX.JSON.$0, 'new Date($2)');
    return eval('(' + s + ')');
}
ScriptFX.JSON.serialize = function (o) {
    if (isNullOrUndefined(o)) {
        return String.Empty;
    }
    var $0 = new StringBuilder();
    ScriptFX.JSON.$1($0, o);
    return $0.toString();
}
ScriptFX.JSON.$1 = function ($p0, $p1) {
    if (isNullOrUndefined($p1)) {
        $p0.append('null');
        return;
    }
    var $0 = typeof ($p1);
    switch ($0) {
        case 'boolean':
            $p0.append($p1.toString());
            return;
        case 'number':
            $p0.append((isFinite($p1)) ? $p1.toString()  : 'null');
            return;
        case 'string':
            $p0.append(($p1).quote());
            return;
        case 'object':
            if (Array.isInstance($p1)) {
                $p0.append('[');
                var $1 = $p1;
                var $2 = $1.length;
                var $3 = true;
                for (var $4 = 0; $4 < $2; $4++) {
                    if ($3) {
                        $3 = false;
                    } else {
                        $p0.append(',');
                    }
                    ScriptFX.JSON.$1($p0, $1[$4]);
                }
                $p0.append(']');
            } else if (Date.isInstance($p1)) {
                var $5 = $p1;
                var $6 = Date.UTC($5.getUTCFullYear(), $5.getUTCMonth(), $5.getUTCDate(), $5.getUTCHours(), $5.getUTCMinutes(), $5.getUTCSeconds(), $5.getUTCMilliseconds());
                $p0.append('"\\@');
                $p0.append($6.toString());
                $p0.append('@"');
            } else if (RegExp.isInstance($p1)) {
                $p0.append($p1.toString());
            } else {
                $p0.append('{');
                var $7 = true;
                var $dict1 = $p1;
                for (var $key2 in $dict1) {
                    var $8 = {
                        key: $key2,
                        value: $dict1[$key2]
                    };
                    if (($8.key).startsWith('$') || Function.isInstance($8.value)) {
                        continue;
                    }
                    if ($7) {
                        $7 = false;
                    } else {
                        $p0.append(',');
                    }
                    $p0.append($8.key);
                    $p0.append(':');
                    ScriptFX.JSON.$1($p0, $8.value);
                }
                $p0.append('}');
            }
            return;
        default:
            $p0.append('null');
            return;
    }
}
ScriptFX.PropertyChangedEventArgs = function (propertyName) {
    ScriptFX.PropertyChangedEventArgs.constructBase(this);
    this.$1_0 = propertyName;
}
ScriptFX.PropertyChangedEventArgs.prototype = {
    $1_0: null,
    get_propertyName: function () {
        return this.$1_0;
    }
}
ScriptFX.ObservableCollection = function (owner, disposableItems) {
    this.$0 = owner;
    this.$1 = [
    ];
    this.$2 = disposableItems;
}
ScriptFX.ObservableCollection.prototype = {
    $0: null,
    $1: null,
    $2: false,
    $3: null,
    add_collectionChanged: function (value) {
        this.$3 = Delegate.combine(this.$3, value);
    },
    remove_collectionChanged: function (value) {
        this.$3 = Delegate.remove(this.$3, value);
    },
    add: function (item) {
        (item).setOwner(this.$0);
        this.$1.add(item);
        if (this.$3) {
            this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(0, item));
        }
    },
    clear: function () {
        if (this.$1.length) {
            var $enum1 = this.$1.getEnumerator();
            while ($enum1.moveNext()) {
                var $0 = $enum1.get_current();
                $0.setOwner(null);
            }
            this.$1.clear();
            if (this.$3) {
                this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(2, null));
            }
        }
    },
    contains: function (item) {
        return this.$1.contains(item);
    },
    dispose: function () {
        if (this.$2) {
            var $enum1 = this.$1.getEnumerator();
            while ($enum1.moveNext()) {
                var $0 = $enum1.get_current();
                $0.dispose();
            }
        }
        this.$1 = null;
        this.$0 = null;
        this.$3 = null;
    },
    getEnumerator: function () {
        return this.$1.getEnumerator();
    },
    getItem: function (index) {
        return this.$1[index];
    },
    getItems: function () {
        return this.$1;
    },
    getLength: function () {
        return this.$1.length;
    },
    remove: function (item) {
        if (this.$1.contains(item)) {
            (item).setOwner(null);
            this.$1.remove(item);
            if (this.$3) {
                this.$3.invoke(this, new ScriptFX.CollectionChangedEventArgs(1, item));
            }
        }
    }
}
Type.createNamespace('ScriptFX.Net');
ScriptFX.Net.HTTPStatusCode = function () {
};
ScriptFX.Net.HTTPStatusCode.prototype = {
    canContinue: 100,
    switchingProtocols: 101,
    OK: 200,
    created: 201,
    partialContent: 206,
    accepted: 202,
    nonAuthoritativeInformation: 203,
    noContent: 204,
    resetContent: 205,
    ambiguous: 300,
    moved: 301,
    redirect: 302,
    redirectMethod: 303,
    notModified: 304,
    useProxy: 305,
    temporaryRedirect: 307,
    badRequest: 400,
    methodNotAllowed: 400,
    unauthorized: 401,
    paymentRequired: 402,
    forbidden: 403,
    notFound: 404,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    requestEntityTooLarge: 413,
    requestUriTooLong: 414,
    unsupportedMediaType: 415,
    requestedRangeNotSatisfiable: 416,
    expectationFailed: 417,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505
}
ScriptFX.Net.HTTPStatusCode.createEnum('ScriptFX.Net.HTTPStatusCode', false);
ScriptFX.Net.HTTPRequestState = function () {
};
ScriptFX.Net.HTTPRequestState.prototype = {
    inactive: 0,
    inProgress: 1,
    completed: 2,
    aborted: 3,
    timedOut: 4
}
ScriptFX.Net.HTTPRequestState.createEnum('ScriptFX.Net.HTTPRequestState', false);
ScriptFX.Net.HTTPVerb = function () {
};
ScriptFX.Net.HTTPVerb.prototype = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3
}
ScriptFX.Net.HTTPVerb.createEnum('ScriptFX.Net.HTTPVerb', false);
ScriptFX.Net.IHTTPResponse = function () {
};
ScriptFX.Net.IHTTPResponse.createInterface('ScriptFX.Net.IHTTPResponse');
ScriptFX.Net.HTTPRequest = function () {
}
ScriptFX.Net.HTTPRequest.createRequest = function (uri, verb) {
    var $0 = new ScriptFX.Net.HTTPRequest();
    if (!uri.startsWith('{')) {
        $0.$0 = uri;
    } else {
        var $1 = ScriptFX.JSON.deserialize(uri);
        $0.$0 = $1['__uri'];
        if ($1['__nullParams']) {
            $0.$6 = $1['__transportType'];
        } else {
            $0.$6 = Type.getType($1['__transportType']);
            delete $1.__uri;
            delete $1.__transportType;
            $0.$7 = $1;
        }
    }
    $0.$1 = verb;
    return $0;
}
ScriptFX.Net.HTTPRequest.createURI = function (uri, parameters) {
    var $0 = new StringBuilder(uri);
    if (uri.indexOf('?') < 0) {
        $0.append('?');
    }
    var $1 = 0;
    var $dict1 = parameters;
    for (var $key2 in $dict1) {
        var $2 = {
            key: $key2,
            value: $dict1[$key2]
        };
        if ($1) {
            $0.append('&');
        }
        $0.append($2.key);
        $0.append('=');
        $0.append(encodeURIComponent($2.value.toString()));
        $1++;
    }
    return $0.toString();
}
ScriptFX.Net.HTTPRequest.prototype = {
    $0: null,
    $1: 0,
    $2: null,
    $3: null,
    $4: null,
    $5: null,
    $6: null,
    $7: null,
    $8: 0,
    $9: null,
    $A: null,
    $B: 0,
    $C: null,
    $D: null,
    $E: null,
    get_content: function () {
        return this.$2;
    },
    set_content: function (value) {
        this.$2 = value;
        return value;
    },
    get_hasCredentials: function () {
        return (!String.isNullOrEmpty(this.$4));
    },
    get_hasHeaders: function () {
        return (this.$3);
    },
    get_headers: function () {
        if (!this.$3) {
            this.$3 = {
            };
        }
        return this.$3;
    },
    get_password: function () {
        return this.$5;
    },
    get_response: function () {
        return this.$D;
    },
    get_state: function () {
        return this.$B;
    },
    get_timeout: function () {
        return this.$8;
    },
    set_timeout: function (value) {
        this.$8 = value;
        return value;
    },
    get_timeStamp: function () {
        return this.$E;
    },
    get_$F: function () {
        return this.$C;
    },
    get_$10: function () {
        return this.$7;
    },
    get_transportType: function () {
        return this.$6;
    },
    get_URI: function () {
        return this.$0;
    },
    get_userName: function () {
        return this.$4;
    },
    get_verb: function () {
        return this.$1;
    },
    abort: function () {
        if (this.$B === 1) {
            ScriptFX.Net.HTTPRequestManager.$5(this, false);
        }
    },
    dispose: function () {
        if (this.$C) {
            this.abort();
        }
    },
    invoke: function (callback, context) {
        this.$9 = callback;
        this.$A = context;
        ScriptFX.Application.current.registerDisposableObject(this);
        ScriptFX.Net.HTTPRequestManager.$6(this);
    },
    $11: function () {
        ScriptFX.Application.current.unregisterDisposableObject(this);
        if (this.$C) {
            this.$C.dispose();
            this.$C = null;
        }
        if (this.$9) {
            this.$9.invoke(this, this.$A);
            this.$9 = null;
            this.$A = null;
        }
    },
    $12: function () {
        this.$B = 3;
        this.$11();
    },
    $13: function ($p0) {
        this.$C = $p0;
        this.$B = 1;
        this.$E = new Date();
    },
    $14: function ($p0) {
        this.$D = $p0;
        this.$B = 2;
        this.$11();
    },
    $15: function () {
        this.$B = 4;
        this.$11();
    },
    setContentAsForm: function (data) {
        this.get_headers() ['Content-Type'] = 'application/x-www-form-urlencoded';
        var $0 = new StringBuilder();
        var $1 = true;
        var $dict1 = data;
        for (var $key2 in $dict1) {
            var $2 = {
                key: $key2,
                value: $dict1[$key2]
            };
            if (!$1) {
                $0.append('&');
            }
            $0.append($2.key);
            $0.append('=');
            $0.append(encodeURIComponent($2.value.toString()));
            $1 = false;
        }
        this.set_content($0.toString());
    },
    setContentAsJSON: function (data) {
        this.get_headers() ['Content-Type'] = 'text/json';
        this.set_content(ScriptFX.JSON.serialize(data));
    },
    setCredentials: function (userName, password) {
        this.$4 = userName;
        this.$5 = password;
    }
}
ScriptFX.Net.HTTPRequestManager = function () {
}
ScriptFX.Net.HTTPRequestManager.add_requestInvoking = function (value) {
    ScriptFX.Net.HTTPRequestManager.$0 = Delegate.combine(ScriptFX.Net.HTTPRequestManager.$0, value);
}
ScriptFX.Net.HTTPRequestManager.remove_requestInvoking = function (value) {
    ScriptFX.Net.HTTPRequestManager.$0 = Delegate.remove(ScriptFX.Net.HTTPRequestManager.$0, value);
}
ScriptFX.Net.HTTPRequestManager.add_requestInvoked = function (value) {
    ScriptFX.Net.HTTPRequestManager.$1 = Delegate.combine(ScriptFX.Net.HTTPRequestManager.$1, value);
}
ScriptFX.Net.HTTPRequestManager.remove_requestInvoked = function (value) {
    ScriptFX.Net.HTTPRequestManager.$1 = Delegate.remove(ScriptFX.Net.HTTPRequestManager.$1, value);
}
ScriptFX.Net.HTTPRequestManager.get_online = function () {
    return window.navigator.onLine;
}
ScriptFX.Net.HTTPRequestManager.get_timeoutInterval = function () {
    return ScriptFX.Net.HTTPRequestManager.$2;
}
ScriptFX.Net.HTTPRequestManager.set_timeoutInterval = function (value) {
    ScriptFX.Net.HTTPRequestManager.$2 = value;
    return value;
}
ScriptFX.Net.HTTPRequestManager.$5 = function ($p0, $p1) {
    var $0 = $p0.get_$F();
    if ($0) {
        $0.abort();
        ScriptFX.Net.HTTPRequestManager.$7($p0, null, $p1);
    }
}
ScriptFX.Net.HTTPRequestManager.abortAll = function () {
    var $0 = ScriptFX.Net.HTTPRequestManager.$3;
    ScriptFX.Net.HTTPRequestManager.$3 = [
    ];
    var $enum1 = $0.getEnumerator();
    while ($enum1.moveNext()) {
        var $1 = $enum1.get_current();
        ScriptFX.Net.HTTPRequestManager.$5($1, false);
    }
}
ScriptFX.Net.HTTPRequestManager.$6 = function ($p0) {
    if (ScriptFX.Net.HTTPRequestManager.$0) {
        var $2 = new ScriptFX.Net.PreHTTPRequestEventArgs($p0);
        ScriptFX.Net.HTTPRequestManager.$0.invoke(null, $2);
        if ($2.get_isSuppressed()) {
            $p0.$14($2.get_response());
            return;
        }
    }
    var $0 = $p0.get_transportType();
    if (!$0) {
        $0 = ScriptFX.Net._Core$3;
    }
    var $1 = new $0($p0);
    $p0.$13($1);
    ScriptFX.Net.HTTPRequestManager.$3.add($p0);
    $1.invoke();
    if (((ScriptFX.Net.HTTPRequestManager.$2) || ($p0.get_timeout())) && (!ScriptFX.Net.HTTPRequestManager.$4)) {
        ScriptFX.Net.HTTPRequestManager.$4 = Delegate.create(null, ScriptFX.Net.HTTPRequestManager.$8);
        ScriptFX.Application.current.add_idle(ScriptFX.Net.HTTPRequestManager.$4);
    }
}
ScriptFX.Net.HTTPRequestManager.$7 = function ($p0, $p1, $p2) {
    ScriptFX.Net.HTTPRequestManager.$3.remove($p0);
    if ($p1) {
        $p0.$14($p1);
    } else if ($p2) {
        $p0.$15();
    } else {
        $p0.$12();
    }
    if (ScriptFX.Net.HTTPRequestManager.$1) {
        var $0 = new ScriptFX.Net.PostHTTPRequestEventArgs($p0, $p1);
        ScriptFX.Net.HTTPRequestManager.$1.invoke(null, $0);
    }
    if ((!ScriptFX.Net.HTTPRequestManager.$3.length) && (ScriptFX.Net.HTTPRequestManager.$4)) {
        ScriptFX.Application.current.remove_idle(ScriptFX.Net.HTTPRequestManager.$4);
        ScriptFX.Net.HTTPRequestManager.$4 = null;
    }
}
ScriptFX.Net.HTTPRequestManager.$8 = function ($p0, $p1) {
    if (!ScriptFX.Net.HTTPRequestManager.$3.length) {
        return;
    }
    var $0 = null;
    var $1 = (new Date()).getTime();
    var $enum1 = ScriptFX.Net.HTTPRequestManager.$3.getEnumerator();
    while ($enum1.moveNext()) {
        var $2 = $enum1.get_current();
        var $3 = $2.get_timeStamp().getTime();
        var $4 = $2.get_timeout();
        if (!$4) {
            $4 = ScriptFX.Net.HTTPRequestManager.$2;
            if (!$4) {
                continue;
            }
        }
        if (($1 - $3) > $4) {
            if (!$0) {
                $0 = [
                ];
            }
            $0.add($2);
        }
    }
    if ($0) {
        var $enum2 = $0.getEnumerator();
        while ($enum2.moveNext()) {
            var $5 = $enum2.get_current();
            ScriptFX.Net.HTTPRequestManager.$5($5, true);
        }
    }
}
ScriptFX.Net.HTTPRequestManager.$9 = function ($p0, $p1) {
    ScriptFX.Net.HTTPRequestManager.$7($p0, $p1, false);
}
ScriptFX.Net.HTTPTransport = function (request) {
    this.$0 = request;
}
ScriptFX.Net.HTTPTransport.createURI = function (uri, transportType, parameters) {
    if (!parameters) {
        return '{__nullParams: true, __uri:\'' + uri + '\', __transportType: ' + transportType.get_fullName() + '}';
    } else {
        parameters['__uri'] = uri;
        parameters['__transportType'] = transportType.get_fullName();
        return ScriptFX.JSON.serialize(parameters);
    }
}
ScriptFX.Net.HTTPTransport.prototype = {
    $0: null,
    get_parameters: function () {
        return this.$0.get_$10();
    },
    get_request: function () {
        return this.$0;
    },
    getMethod: function () {
        return Enum.toString(ScriptFX.Net.HTTPVerb, this.$0.get_verb());
    },
    onCompleted: function (response) {
        ScriptFX.Net.HTTPRequestManager.$9(this.$0, response);
    }
}
ScriptFX.Net.PostHTTPRequestEventArgs = function (request, response) {
    ScriptFX.Net.PostHTTPRequestEventArgs.constructBase(this);
    this.$1_0 = request;
    this.$1_1 = response;
}
ScriptFX.Net.PostHTTPRequestEventArgs.prototype = {
    $1_0: null,
    $1_1: null,
    get_request: function () {
        return this.$1_0;
    },
    get_response: function () {
        return this.$1_1;
    }
}
ScriptFX.Net.PreHTTPRequestEventArgs = function (request) {
    ScriptFX.Net.PreHTTPRequestEventArgs.constructBase(this);
    this.$1_0 = request;
}
ScriptFX.Net.PreHTTPRequestEventArgs.prototype = {
    $1_0: null,
    $1_1: null,
    $1_2: false,
    get_isSuppressed: function () {
        return this.$1_2;
    },
    get_request: function () {
        return this.$1_0;
    },
    get_response: function () {
        return this.$1_1;
    },
    suppressRequest: function (response) {
        this.$1_2 = true;
        this.$1_1 = response;
    }
}
ScriptFX.Net._Core$2 = function (request, xmlHTTP) {
    this.$3 = new Date();
    this.$0 = request;
    this.$1 = xmlHTTP;
}
ScriptFX.Net._Core$2.prototype = {
    $0: null,
    $1: null,
    $2: null,
    $3: null,
    $4: null,
    $5: null,
    $6: null,
    get_contentLength: function () {
        return this.getText().length;
    },
    get_contentType: function () {
        return this.$1.getResponseHeader('Content-Type');
    },
    get_headers: function () {
        if (!this.$2) {
            var $0 = this.$1.getAllResponseHeaders();
            var $1 = $0.split('\r\n');
            this.$2 = {
            };
            var $enum1 = $1.getEnumerator();
            while ($enum1.moveNext()) {
                var $2 = $enum1.get_current();
                var $3 = $2.indexOf(':');
                this.$2[$2.substr(0, $3)] = $2.substr($3 + 1);
            }
        }
        return this.$2;
    },
    get_request: function () {
        return this.$0;
    },
    get_statusCode: function () {
        return this.$1.status;
    },
    get_statusText: function () {
        return this.$1.statusText;
    },
    get_timeStamp: function () {
        return this.$3;
    },
    getHeader: function ($p0) {
        return this.$1.getResponseHeader($p0);
    },
    getObject: function () {
        if (!this.$5) {
            this.$5 = ScriptFX.JSON.deserialize(this.getText());
        }
        return this.$5;
    },
    getText: function () {
        if (!this.$4) {
            this.$4 = this.$1.responseText;
        }
        return this.$4;
    },
    getXML: function () {
        if (!this.$6) {
            var $0 = this.$1.responseXML;
            if ((!$0) || (!$0.documentElement)) {
                try {
                    $0 = XMLDocumentParser.parse(this.$1.responseText);
                    if (($0) && ($0.documentElement)) {
                        this.$6 = $0;
                    }
                } catch ($1) {
                }
            } else {
                this.$6 = $0;
                if (ScriptFX.Application.current.get_isIE()) {
                    $0.setProperty('SelectionLanguage', 'XPath');
                }
            }
        }
        return this.$6;
    }
}
ScriptFX.Net._Core$3 = function (request) {
    ScriptFX.Net._Core$3.constructBase(this, [
        request
    ]);
}
ScriptFX.Net._Core$3.prototype = {
    $1: null,
    abort: function () {
        if (this.$1) {
            this.$1.onreadystatechange = Delegate.Null;
            this.$1.abort();
            this.$1 = null;
        }
    },
    dispose: function () {
        this.abort();
    },
    invoke: function () {
        var $0 = this.get_request();
        this.$1 = new XMLHttpRequest();
        this.$1.onreadystatechange = Delegate.create(this, this.$2);
        if (!this.get_request().get_hasCredentials()) {
            this.$1.open(this.getMethod(), $0.get_URI(), true);
        } else {
            this.$1.open(this.getMethod(), $0.get_URI(), true, $0.get_userName(), $0.get_password());
        }
        var $1 = ($0.get_hasHeaders()) ? $0.get_headers()  : null;
        if ($1) {
            var $dict1 = $1;
            for (var $key2 in $dict1) {
                var $3 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                this.$1.setRequestHeader($3.key, $3.value);
            }
        }
        var $2 = $0.get_content();
        if (($2) && ((!$1) || (!$1['Content-Type']))) {
            this.$1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        this.$1.send($2);
    },
    $2: function () {
        if (this.$1.readyState === 4) {
            var $0 = new ScriptFX.Net._Core$2(this.get_request(), this.$1);
            this.$1.onreadystatechange = Delegate.Null;
            this.$1 = null;
            this.onCompleted($0);
        }
    }
}
Type.createNamespace('ScriptFX.UI');
ScriptFX.UI.AnimationStopState = function () {
};
ScriptFX.UI.AnimationStopState.prototype = {
    complete: 0,
    abort: 1,
    revert: 2
}
ScriptFX.UI.AnimationStopState.createEnum('ScriptFX.UI.AnimationStopState', false);
ScriptFX.UI.$create_Bounds = function (left, top, width, height) {
    var $o = {
    };
    $o.left = left;
    $o.top = top;
    $o.width = width;
    $o.height = height;
    return $o;
}
ScriptFX.UI.$create_DragDropData = function (mode, dataType, data) {
    var $o = {
    };
    $o.mode = mode;
    $o.dataType = dataType;
    $o.data = data;
    return $o;
}
ScriptFX.UI.DragMode = function () {
};
ScriptFX.UI.DragMode.prototype = {
    move: 0,
    copy: 1
}
ScriptFX.UI.DragMode.createEnum('ScriptFX.UI.DragMode', false);
ScriptFX.UI.IAction = function () {
};
ScriptFX.UI.IAction.createInterface('ScriptFX.UI.IAction');
ScriptFX.UI.IDragDrop = function () {
};
ScriptFX.UI.IDragDrop.createInterface('ScriptFX.UI.IDragDrop');
ScriptFX.UI.IDragSource = function () {
};
ScriptFX.UI.IDragSource.createInterface('ScriptFX.UI.IDragSource');
ScriptFX.UI.IDropTarget = function () {
};
ScriptFX.UI.IDropTarget.createInterface('ScriptFX.UI.IDropTarget');
ScriptFX.UI.IEditableText = function () {
};
ScriptFX.UI.IEditableText.createInterface('ScriptFX.UI.IEditableText');
ScriptFX.UI.IStaticText = function () {
};
ScriptFX.UI.IStaticText.createInterface('ScriptFX.UI.IStaticText');
ScriptFX.UI.IToggle = function () {
};
ScriptFX.UI.IToggle.createInterface('ScriptFX.UI.IToggle');
ScriptFX.UI.IValidator = function () {
};
ScriptFX.UI.IValidator.createInterface('ScriptFX.UI.IValidator');
ScriptFX.UI.Key = function () {
};
ScriptFX.UI.Key.prototype = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    del: 127
}
ScriptFX.UI.Key.createEnum('ScriptFX.UI.Key', false);
ScriptFX.UI.$create_Location = function (left, top) {
    var $o = {
    };
    $o.left = left;
    $o.top = top;
    return $o;
}
ScriptFX.UI.$create_OverlayOptions = function (cssClass) {
    var $o = {
    };
    $o.cssClass = cssClass;
    $o.fadeInOutInterval = 250;
    $o.opacity = 0.75;
    return $o;
}
ScriptFX.UI.PopupMode = function () {
};
ScriptFX.UI.PopupMode.prototype = {
    center: 0,
    anchorTopLeft: 1,
    anchorTopRight: 2,
    anchorBottomRight: 3,
    anchorBottomLeft: 4,
    alignTopLeft: 5,
    alignTopRight: 6,
    alignBottomRight: 7,
    alignBottomLeft: 8
}
ScriptFX.UI.PopupMode.createEnum('ScriptFX.UI.PopupMode', false);
ScriptFX.UI.$create_PopupOptions = function (referenceElement, mode) {
    var $o = {
    };
    $o.referenceElement = referenceElement;
    $o.mode = mode;
    $o.id = null;
    $o.xOffset = 0;
    $o.yOffset = 0;
    return $o;
}
ScriptFX.UI.$create_Size = function (width, height) {
    var $o = {
    };
    $o.width = width;
    $o.height = height;
    return $o;
}
ScriptFX.UI.Animation = function (domElement) {
    if (!domElement) {
        domElement = document.documentElement;
    }
    this.$0 = domElement;
    this.$1 = 1;
    ScriptFX.Application.current.registerDisposableObject(this);
}
ScriptFX.UI.Animation.prototype = {
    $0: null,
    $1: 0,
    $2: false,
    $3: 0,
    $4: false,
    $5: false,
    $6: false,
    $7: 0,
    $8: 0,
    $9: false,
    add_repeating: function (value) {
        this.$A = Delegate.combine(this.$A, value);
    },
    remove_repeating: function (value) {
        this.$A = Delegate.remove(this.$A, value);
    },
    $A: null,
    add_starting: function (value) {
        this.$B = Delegate.combine(this.$B, value);
    },
    remove_starting: function (value) {
        this.$B = Delegate.remove(this.$B, value);
    },
    $B: null,
    add_stopped: function (value) {
        this.$C = Delegate.combine(this.$C, value);
    },
    remove_stopped: function (value) {
        this.$C = Delegate.remove(this.$C, value);
    },
    $C: null,
    get_autoReverse: function () {
        return this.$2;
    },
    set_autoReverse: function (value) {
        this.$2 = value;
        return value;
    },
    get_completed: function () {
        return this.$4;
    },
    get_domElement: function () {
        return this.$0;
    },
    get_isPlaying: function () {
        return this.$5;
    },
    get_isReversed: function () {
        return this.$9;
    },
    get_repeatCount: function () {
        return this.$1;
    },
    set_repeatCount: function (value) {
        this.$1 = value;
        return value;
    },
    get_repeatDelay: function () {
        return this.$3;
    },
    set_repeatDelay: function (value) {
        this.$3 = value;
        return value;
    },
    get_repetitions: function () {
        return this.$7;
    },
    dispose: function () {
        if (this.$5) {
            this.stop(1);
        }
        if (this.$0) {
            this.$0 = null;
            ScriptFX.Application.current.unregisterDisposableObject(this);
        }
    },
    $D: function ($p0) {
        if (this.$B) {
            this.$B.invoke(this, EventArgs.Empty);
        }
        this.performSetup();
        this.$5 = true;
        this.$7 = 1;
        this.$9 = $p0;
        this.playCore();
    },
    $E: function ($p0, $p1) {
        this.stopCore($p0, $p1);
        this.$4 = $p0;
        this.$5 = false;
        this.performCleanup();
        if (this.$C) {
            this.$C.invoke(this, EventArgs.Empty);
        }
    },
    $F: function ($p0) {
        if (this.$6) {
            if ((this.$3) && ((this.$8 + this.$3) > $p0)) {
                return false;
            }
        }
        var $0 = this.progressCore(this.$6, $p0);
        this.$6 = false;
        if ($0 && ((!this.$1) || (this.$1 > this.$7))) {
            $0 = false;
            this.$7++;
            if (this.$A) {
                var $1 = new ScriptFX.CancelEventArgs();
                this.$A.invoke(this, $1);
                $0 = $1.get_canceled();
            }
            if (!$0) {
                this.$6 = true;
                if (this.$2) {
                    this.$9 = !this.$9;
                }
                this.$8 = $p0;
                this.performRepetition(this.$9);
            }
        }
        return $0;
    },
    performCleanup: function () {
    },
    performRepetition: function (reversed) {
    },
    performSetup: function () {
    },
    play: function () {
        this.$4 = false;
        ScriptFX.UI.AnimationManager.$4(this, this.$0);
    },
    stop: function (stopState) {
        ScriptFX.UI.AnimationManager.$5(this, stopState);
    }
}
ScriptFX.UI.AnimationManager = function () {
}
ScriptFX.UI.AnimationManager.get_FPS = function () {
    return ScriptFX.UI.AnimationManager.$0;
}
ScriptFX.UI.AnimationManager.set_FPS = function (value) {
    ScriptFX.UI.AnimationManager.$0 = value;
    return value;
}
ScriptFX.UI.AnimationManager.$3 = function () {
    ScriptFX.UI.AnimationManager.$2 = 0;
    if (!ScriptFX.UI.AnimationManager.$1.length) {
        return;
    }
    var $0 = (new Date()).getTime();
    var $1 = ScriptFX.UI.AnimationManager.$1;
    var $2 = [
    ];
    ScriptFX.UI.AnimationManager.$1 = null;
    var $enum1 = $1.getEnumerator();
    while ($enum1.moveNext()) {
        var $3 = $enum1.get_current();
        var $4 = $3.$F($0);
        if ($4) {
            $3.$E(true, 0);
        } else {
            $2.add($3);
        }
    }
    if ($2.length) {
        ScriptFX.UI.AnimationManager.$1 = $2;
        if (!ScriptFX.UI.AnimationManager.$2) {
            ScriptFX.UI.AnimationManager.$2 = window.setTimeout(Delegate.create(null, ScriptFX.UI.AnimationManager.$3), 1000 / ScriptFX.UI.AnimationManager.$0);
        }
    }
}
ScriptFX.UI.AnimationManager.$4 = function ($p0, $p1) {
    if (!ScriptFX.UI.AnimationManager.$1) {
        ScriptFX.UI.AnimationManager.$1 = [
        ];
    }
    ScriptFX.UI.AnimationManager.$1.add($p0);
    $p0.$D(false);
    if (!ScriptFX.UI.AnimationManager.$2) {
        ScriptFX.UI.AnimationManager.$2 = window.setTimeout(Delegate.create(null, ScriptFX.UI.AnimationManager.$3), 1000 / ScriptFX.UI.AnimationManager.$0);
    }
}
ScriptFX.UI.AnimationManager.$5 = function ($p0, $p1) {
    $p0.$E(false, $p1);
    ScriptFX.UI.AnimationManager.$1.remove($p0);
}
ScriptFX.UI.AnimationSequence = function (animations) {
    ScriptFX.UI.AnimationSequence.constructBase(this, [
        null
    ]);
    this.$10 = animations;
    this.$12 = - 1;
}
ScriptFX.UI.AnimationSequence.prototype = {
    $10: null,
    $11: 0,
    $12: 0,
    $13: false,
    $14: 0,
    get_successionDelay: function () {
        return this.$11;
    },
    set_successionDelay: function (value) {
        this.$11 = value;
        return value;
    },
    playCore: function () {
        if (!this.get_isReversed()) {
            this.$12 = 0;
        } else {
            this.$12 = this.$10.length - 1;
        }
        this.$10[this.$12].$D(this.get_isReversed());
    },
    progressCore: function (startRepetition, timeStamp) {
        if (startRepetition) {
            if (!this.get_isReversed()) {
                this.$12 = 0;
            } else {
                this.$12 = this.$10.length - 1;
            }
            this.$13 = true;
        }
        var $0 = this.$10[this.$12];
        if (this.$13) {
            if ((this.$11) && ((this.$14 + this.$11) > timeStamp)) {
                return false;
            }
            this.$13 = false;
            $0.$D(this.get_isReversed());
        }
        var $1 = $0.$F(timeStamp);
        if ($1) {
            $0.$E(true, 0);
            if (!this.get_isReversed()) {
                this.$12++;
            } else {
                this.$12--;
            }
            this.$13 = true;
            this.$14 = timeStamp;
        }
        return $1 && ((this.$12 === this.$10.length) || (this.$12 === - 1));
    },
    stopCore: function (completed, stopState) {
        if (!completed) {
            var $0 = this.$10[this.$12];
            $0.$E(false, stopState);
        }
    }
}
ScriptFX.UI.Behavior = function (domElement, id) {
    ScriptFX.Application.current.registerDisposableObject(this);
    this.$0 = domElement;
    this.$1 = id;
    if (!String.isNullOrEmpty(id)) {
        if (id === 'control') {
            var $1 = domElement[id];
            if (($1) && (Type.getInstanceType($1) === ScriptFX.UI._Core$4)) {
                delete domElement.control;
                ScriptFX.Application.current.unregisterDisposableObject($1);
                this.$3 = $1.get_$5();
            }
        }
        domElement[id] = this;
    }
    if (id !== 'control') {
        var $2 = domElement.control;
        if (!$2) {
            $2 = new ScriptFX.UI._Core$4(domElement);
        }
    }
    var $0 = domElement._behaviors;
    if (!$0) {
        $0 = [
        ];
        domElement._behaviors = $0;
    }
    $0.add(this);
}
ScriptFX.UI.Behavior.getBehavior = function (domElement, type) {
    var $0 = domElement._behaviors;
    if ($0) {
        var $enum1 = $0.getEnumerator();
        while ($enum1.moveNext()) {
            var $1 = $enum1.get_current();
            if (type.isAssignableFrom(Type.getInstanceType($1))) {
                return $1;
            }
        }
    }
    return null;
}
ScriptFX.UI.Behavior.getBehaviors = function (domElement, type) {
    var $0 = domElement._behaviors;
    if (isNullOrUndefined($0) || (!$0.length)) {
        return null;
    }
    if (!type) {
        return $0.clone();
    }
    return $0.filter(Delegate.create(null, function ($p1_0) {
        return type.isAssignableFrom(Type.getInstanceType($p1_0));
    }));
}
ScriptFX.UI.Behavior.getNamedBehavior = function (domElement, id) {
    return domElement[id];
}
ScriptFX.UI.Behavior.prototype = {
    $0: null,
    $1: null,
    $2: null,
    $3: null,
    $4: false,
    get_domElement: function () {
        return this.$0;
    },
    get_domEvents: function () {
        if (!this.$2) {
            this.$2 = new ScriptFX.UI.DOMEventList(this.$0);
        }
        return this.$2;
    },
    get_events: function () {
        if (!this.$3) {
            this.$3 = new ScriptFX.EventList();
        }
        return this.$3;
    },
    get_$5: function () {
        return this.$3;
    },
    get_isDisposed: function () {
        return (!this.$0);
    },
    get_isInitializing: function () {
        return this.$4;
    },
    add_propertyChanged: function (value) {
        this.get_events().addHandler('PropertyChanged', value);
    },
    remove_propertyChanged: function (value) {
        this.get_events().removeHandler('PropertyChanged', value);
    },
    beginInitialize: function () {
        this.$4 = true;
    },
    dispose: function () {
        if (this.$2) {
            this.$2.dispose();
        }
        if (this.$0) {
            if (this.$1) {
                if (ScriptFX.Application.current.get_isIE()) {
                    this.$0.removeAttribute(this.$1);
                } else {
                    delete this.$0[this.$1];
                }
            }
            var $0 = this.$0._behaviors;
            $0.remove(this);
            this.$0 = null;
            ScriptFX.Application.current.unregisterDisposableObject(this);
        }
    },
    endInitialize: function () {
        this.$4 = false;
    },
    raisePropertyChanged: function (propertyName) {
        var $0 = this.get_events().getHandler('PropertyChanged');
        if ($0) {
            $0.invoke(this, new ScriptFX.PropertyChangedEventArgs(propertyName));
        }
    }
}
ScriptFX.UI.Color = function (red, green, blue) {
    this.$0 = red;
    this.$1 = green;
    this.$2 = blue;
}
ScriptFX.UI.Color.format = function (red, green, blue) {
    return String.format('#{0:X2}{1:X2}{2:X2}', red, green, blue);
}
ScriptFX.UI.Color.parse = function (s) {
    if (String.isNullOrEmpty(s)) {
        return null;
    }
    if ((s.length === 7) && s.startsWith('#')) {
        var $0 = parseInt(s.substr(1, 2), 16);
        var $1 = parseInt(s.substr(3, 2), 16);
        var $2 = parseInt(s.substr(5, 2), 16);
        return new ScriptFX.UI.Color($0, $1, $2);
    } else if (s.startsWith('rgb(') && s.endsWith(')')) {
        var $3 = s.substring(4, s.length - 1).split(',');
        if ($3.length === 3) {
            return new ScriptFX.UI.Color(parseInt($3[0].trim()), parseInt($3[1].trim()), parseInt($3[2].trim()));
        }
    }
    return null;
}
ScriptFX.UI.Color.prototype = {
    $0: 0,
    $1: 0,
    $2: 0,
    get_blue: function () {
        return this.$2;
    },
    get_green: function () {
        return this.$1;
    },
    get_red: function () {
        return this.$0;
    },
    toString: function () {
        return ScriptFX.UI.Color.format(this.$0, this.$1, this.$2);
    }
}
ScriptFX.UI.Control = function (domElement) {
    ScriptFX.UI.Control.constructBase(this, [
        domElement,
        'control'
    ]);
}
ScriptFX.UI.Control.getControl = function (domElement) {
    return ScriptFX.UI.Behavior.getNamedBehavior(domElement, 'control');
}
ScriptFX.UI.Control.prototype = {
    add_disposing: function (value) {
        this.get_events().addHandler('disposing', value);
    },
    remove_disposing: function (value) {
        this.get_events().removeHandler('disposing', value);
    },
    dispose: function () {
        var $0 = this.get_domElement();
        if ($0) {
            var $1 = this.get_events().getHandler('disposing');
            if ($1) {
                $1.invoke(this, EventArgs.Empty);
            }
            var $2 = ScriptFX.UI.Behavior.getBehaviors($0, null);
            if ($2.length > 1) {
                var $enum1 = $2.getEnumerator();
                while ($enum1.moveNext()) {
                    var $3 = $enum1.get_current();
                    if ($3 !== this) {
                        $3.dispose();
                    }
                }
            }
        }
        ScriptFX.UI.Control.callBase(this, 'dispose');
    }
}
ScriptFX.UI.DOMEventList = function (element) {
    this.$0 = element;
    this.$1 = {
    };
}
ScriptFX.UI.DOMEventList.prototype = {
    $0: null,
    $1: null,
    attach: function (eventName, handler) {
        this.$0.attachEvent(eventName, handler);
        this.$1[eventName] = handler;
    },
    detach: function (eventName) {
        var $0 = this.$1[eventName];
        if ($0) {
            this.$0.detachEvent(eventName, $0);
            return true;
        }
        return false;
    },
    dispose: function () {
        if (this.$0) {
            var $dict1 = this.$1;
            for (var $key2 in $dict1) {
                var $0 = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                this.$0.detachEvent($0.key, $0.value);
            }
            this.$0 = null;
            this.$1 = null;
        }
    },
    isAttached: function (eventName) {
        return (this.$1[eventName]) ? true : false;
    }
}
ScriptFX.UI.DragDropEventArgs = function (dataObject) {
    ScriptFX.UI.DragDropEventArgs.constructBase(this);
    this.$1_0 = dataObject;
}
ScriptFX.UI.DragDropEventArgs.prototype = {
    $1_0: null,
    get_dataObject: function () {
        return this.$1_0;
    }
}
ScriptFX.UI.DragDropManager = function () {
}
ScriptFX.UI.DragDropManager.get_canDragDrop = function () {
    return (ScriptFX.UI.DragDropManager.$0);
}
ScriptFX.UI.DragDropManager.get_supportsDataTransfer = function () {
    return ScriptFX.UI.DragDropManager.$0.get_supportsDataTransfer();
}
ScriptFX.UI.DragDropManager.add_dragDropEnding = function (value) {
    ScriptFX.UI.DragDropManager.$3 = Delegate.combine(ScriptFX.UI.DragDropManager.$3, value);
}
ScriptFX.UI.DragDropManager.remove_dragDropEnding = function (value) {
    ScriptFX.UI.DragDropManager.$3 = Delegate.remove(ScriptFX.UI.DragDropManager.$3, value);
}
ScriptFX.UI.DragDropManager.add_dragDropStarting = function (value) {
    ScriptFX.UI.DragDropManager.$2 = Delegate.combine(ScriptFX.UI.DragDropManager.$2, value);
}
ScriptFX.UI.DragDropManager.remove_dragDropStarting = function (value) {
    ScriptFX.UI.DragDropManager.$2 = Delegate.remove(ScriptFX.UI.DragDropManager.$2, value);
}
ScriptFX.UI.DragDropManager.$5 = function () {
    if (ScriptFX.UI.DragDropManager.$3) {
        ScriptFX.UI.DragDropManager.$3.invoke(null, new ScriptFX.UI.DragDropEventArgs(ScriptFX.UI.DragDropManager.$4));
    }
    ScriptFX.UI.DragDropManager.$4 = null;
}
ScriptFX.UI.DragDropManager.registerDragDropImplementation = function (dragDrop) {
    ScriptFX.UI.DragDropManager.$0 = dragDrop;
}
ScriptFX.UI.DragDropManager.registerDropTarget = function (target) {
    ScriptFX.UI.DragDropManager.$1.add(target);
}
ScriptFX.UI.DragDropManager.startDragDrop = function (data, dragVisual, dragOffset, source, context) {
    if (ScriptFX.UI.DragDropManager.$4) {
        return false;
    }
    var $0 = [
    ];
    var $enum1 = ScriptFX.UI.DragDropManager.$1.getEnumerator();
    while ($enum1.moveNext()) {
        var $1 = $enum1.get_current();
        if ($1.supportsDataObject(data)) {
            $0.add($1);
        }
    }
    if (!$0.length) {
        return false;
    }
    ScriptFX.UI.DragDropManager.$4 = data;
    if (ScriptFX.UI.DragDropManager.$2) {
        ScriptFX.UI.DragDropManager.$2.invoke(null, new ScriptFX.UI.DragDropEventArgs(data));
    }
    ScriptFX.UI.DragDropManager.$0.dragDrop(new ScriptFX.UI._Core$0(source), context, $0, dragVisual, dragOffset, ScriptFX.UI.DragDropManager.$4);
    return true;
}
ScriptFX.UI.DragDropManager.unregisterDropTarget = function (target) {
    ScriptFX.UI.DragDropManager.$1.remove(target);
}
ScriptFX.UI._Core$0 = function (actualSource) {
    this.$0 = actualSource;
}
ScriptFX.UI._Core$0.prototype = {
    $0: null,
    get_domElement: function () {
        return this.$0.get_domElement();
    },
    onDragStart: function ($p0) {
        if (this.$0) {
            this.$0.onDragStart($p0);
        }
    },
    onDrag: function ($p0) {
        if (this.$0) {
            this.$0.onDrag($p0);
        }
    },
    onDragEnd: function ($p0, $p1) {
        if (this.$0) {
            this.$0.onDragEnd($p0, $p1);
        }
        ScriptFX.UI.DragDropManager.$5();
    }
}
ScriptFX.UI.Element = function () {
}
ScriptFX.UI.Element.addCSSClass = function (element, className) {
    var $0 = element.className;
    if ($0.indexOf(className) < 0) {
        element.className = $0 + ' ' + className;
    }
}
ScriptFX.UI.Element.containsCSSClass = function (element, className) {
    return element.className.split(' ').contains(className);
}
ScriptFX.UI.Element.getBounds = function (element) {
    var $0 = ScriptFX.UI.Element.getLocation(element);
    return ScriptFX.UI.$create_Bounds($0.left, $0.top, element.offsetWidth, element.offsetHeight);
}
ScriptFX.UI.Element.getLocation = function (element) {
    var $0 = 0;
    var $1 = 0;
    for (var $2 = element; $2; $2 = $2.offsetParent) {
        $0 += $2.offsetLeft;
        $1 += $2.offsetTop;
    }
    return ScriptFX.UI.$create_Location($0, $1);
}
ScriptFX.UI.Element.getSize = function (element) {
    return ScriptFX.UI.$create_Size(element.offsetWidth, element.offsetHeight);
}
ScriptFX.UI.Element.removeCSSClass = function (element, className) {
    var $0 = ' ' + element.className + ' ';
    var $1 = $0.indexOf(' ' + className + ' ');
    if ($1 >= 0) {
        var $2 = $0.substr(0, $1) + ' ' + $0.substr($1 + className.length + 1);
        element.className = $2;
    }
}
ScriptFX.UI.Element.setLocation = function (element, location) {
    element.style.left = location.left + 'px';
    element.style.top = location.top + 'px';
}
ScriptFX.UI.Element.setSize = function (element, size) {
    element.style.width = size.width + 'px';
    element.style.height = size.height + 'px';
}
ScriptFX.UI.FadeEffect = function (domElement, duration, opacity) {
    ScriptFX.UI.FadeEffect.constructBase(this, [
        domElement,
        duration
    ]);
    this.$14 = opacity;
}
ScriptFX.UI.FadeEffect.prototype = {
    $13: false,
    $14: 0,
    get_isFadingIn: function () {
        return this.$13;
    },
    fadeIn: function () {
        if (this.get_isPlaying()) {
            this.stop(0);
        }
        this.$13 = true;
        this.play();
    },
    fadeOut: function () {
        if (this.get_isPlaying()) {
            this.stop(0);
        }
        this.$13 = false;
        this.play();
    },
    performCleanup: function () {
        ScriptFX.UI.FadeEffect.callBase(this, 'performCleanup');
        if (!this.$13) {
            this.$15(0);
            this.get_domElement().style.display = 'none';
        }
    },
    performSetup: function () {
        ScriptFX.UI.FadeEffect.callBase(this, 'performSetup');
        if (this.$13) {
            this.$15(0);
            this.get_domElement().style.display = '';
        }
    },
    performTweening: function (frame) {
        if (this.$13) {
            this.$15(this.$14 * frame);
        } else {
            this.$15(this.$14 * (1 - frame));
        }
    },
    $15: function ($p0) {
        if (ScriptFX.Application.current.get_isIE()) {
            this.get_domElement().style.filter = 'alpha(opacity=' + ($p0 * 100) + ')';
        } else {
            this.get_domElement().style.opacity = $p0.toString();
        }
    }
}
ScriptFX.UI._Core$4 = function (domElement) {
    ScriptFX.UI._Core$4.constructBase(this, [
        domElement
    ]);
}
ScriptFX.UI.OverlayBehavior = function (domElement, options) {
    ScriptFX.UI.OverlayBehavior.constructBase(this, [
        domElement,
        options.id
    ]);
    this.$7 = options;
    this.$8 = document.createElement('div');
    this.$8.className = options.cssClass;
    var $0 = this.$8.style;
    $0.display = 'none';
    $0.top = '0px';
    $0.left = '0px';
    $0.width = '100%';
    if (ScriptFX.Application.current.get_isIE() && (ScriptFX.Application.current.get_host().get_majorVersion() < 7)) {
        $0.position = 'absolute';
    } else {
        this.$9 = true;
        $0.position = 'fixed';
        $0.height = '100%';
    }
    document.body.appendChild(this.$8);
    if (options.fadeInOutInterval) {
        this.$A = new ScriptFX.UI.FadeEffect(this.$8, options.fadeInOutInterval, options.opacity);
        this.$A.set_easingFunction(Delegate.create(null, ScriptFX.UI.TimedAnimation.easeInOut));
        this.$A.add_stopped(Delegate.create(this, this.$D));
    }
}
ScriptFX.UI.OverlayBehavior.prototype = {
    $7: null,
    $8: null,
    $9: false,
    $A: null,
    $B: null,
    $C: false,
    get_isVisible: function () {
        return this.$C;
    },
    add_visibilityChanged: function (value) {
        this.get_events().addHandler(ScriptFX.UI.OverlayBehavior.$6, value);
    },
    remove_visibilityChanged: function (value) {
        this.get_events().removeHandler(ScriptFX.UI.OverlayBehavior.$6, value);
    },
    dispose: function () {
        if (this.$A) {
            this.$A.dispose();
            this.$A = null;
        }
        if (this.$B) {
            window.detachEvent('onresize', this.$B);
            this.$B = null;
        }
        ScriptFX.UI.OverlayBehavior.callBase(this, 'dispose');
    },
    hide: function () {
        if ((!this.$C) || this.$A.get_isPlaying()) {
            return;
        }
        if (this.$B) {
            window.detachEvent('onresize', this.$B);
            this.$B = null;
        }
        if (this.$A) {
            this.$A.fadeOut();
        } else {
            this.$8.style.display = 'none';
            this.$C = false;
            var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
            if ($0) {
                $0.invoke(this, EventArgs.Empty);
            }
        }
    },
    $D: function ($p0, $p1) {
        this.$C = this.$A.get_isFadingIn();
        var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
        if ($0) {
            $0.invoke(this, EventArgs.Empty);
        }
    },
    $E: function () {
        this.$8.style.height = document.documentElement.offsetHeight + 'px';
    },
    show: function () {
        if (this.$C || this.$A.get_isPlaying()) {
            return;
        }
        if (!this.$9) {
            this.$8.style.height = document.documentElement.offsetHeight + 'px';
            this.$B = Delegate.create(this, this.$E);
            window.attachEvent('onresize', this.$B);
        }
        if (this.$A) {
            this.$A.fadeIn();
        } else {
            this.$8.style.display = '';
            this.$C = true;
            var $0 = this.get_events().getHandler(ScriptFX.UI.OverlayBehavior.$6);
            if ($0) {
                $0.invoke(this, EventArgs.Empty);
            }
        }
    }
}
ScriptFX.UI.PopupBehavior = function (domElement, options) {
    ScriptFX.UI.PopupBehavior.constructBase(this, [
        domElement,
        options.id
    ]);
    this.$6 = options;
    domElement.style.position = 'absolute';
    domElement.style.display = 'none';
}
ScriptFX.UI.PopupBehavior.prototype = {
    $6: null,
    $7: null,
    dispose: function () {
        if (this.get_domElement()) {
            this.hide();
        }
        ScriptFX.UI.PopupBehavior.callBase(this, 'dispose');
    },
    hide: function () {
        this.get_domElement().style.display = 'none';
        if (this.$7) {
            this.$7.parentNode.removeChild(this.$7);
            this.$7 = null;
        }
    },
    show: function () {
        var $0 = this.get_domElement().offsetParent;
        if (!$0) {
            $0 = document.documentElement;
        }
        this.get_domElement().style.display = 'block';
        var $1 = 0;
        var $2 = 0;
        var $3 = 1;
        var $4 = 1;
        var $5 = false;
        var $6 = ScriptFX.UI.Element.getBounds($0);
        var $7 = ScriptFX.UI.Element.getBounds(this.get_domElement());
        var $8 = ScriptFX.UI.Element.getBounds(this.$6.referenceElement);
        var $9 = $8.left - $6.left;
        var $A = $8.top - $6.top;
        switch (this.$6.mode) {
            case 0:
                $1 = Math.round($8.width / 2 - $7.width / 2);
                $2 = Math.round($8.height / 2 - $7.height / 2);
                break;
            case 1:
                $1 = 0;
                $2 = - $7.height;
                break;
            case 2:
                $1 = $8.width - $7.width;
                $2 = - $7.height;
                break;
            case 3:
                $1 = $8.width - $7.width;
                $2 = $8.height;
                break;
            case 4:
                $1 = 0;
                $2 = $8.height;
                break;
            case 5:
                $1 = $8.left;
                $2 = $8.top;
                $5 = true;
                break;
            case 6:
                $1 = $8.left + $8.width - $7.width;
                $2 = $8.top;
                $3 = - 1;
                $5 = true;
                break;
            case 7:
                $1 = $8.left + $8.width - $7.width;
                $2 = $8.top + $8.height - $7.height;
                $3 = - 1;
                $4 = - 1;
                $5 = true;
                break;
            case 8:
                $1 = $8.left;
                $2 = $8.top + $8.height - $7.height;
                $4 = - 1;
                $5 = true;
                break;
        }
        if (!$5) {
            $1 += $9 + this.$6.xOffset;
            $2 += $A + this.$6.yOffset;
    } else {
        $1 += $9 + this.$6.xOffset * $3;
        $2 += $A + this.$6.yOffset * $4;
}
var $B = document.body.clientWidth;
if ($1 + $7.width > $B - 2) {
    $1 -= ($1 + $7.width - $B + 2);
}
if ($1 < 0) {
$1 = 2;
}
if ($2 < 0) {
$2 = 2;
}
ScriptFX.UI.Element.setLocation(this.get_domElement(), ScriptFX.UI.$create_Location($1, $2));
var $C = ScriptFX.Application.current.get_host();
if (($C.get_name() === 1) && ($C.get_majorVersion() < 7)) {
this.$7 = document.createElement('IFRAME');
this.$7.src = 'javascript:false;';
this.$7.scrolling = 'no';
this.$7.style.position = 'absolute';
this.$7.style.display = 'block';
this.$7.style.border = 'none';
this.$7.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
this.$7.style.left = $1 + 'px';
this.$7.style.top = $2 + 'px';
this.$7.style.width = $7.width + 'px';
this.$7.style.height = $7.height + 'px';
this.$7.style.zIndex = 1;
this.get_domElement().parentNode.insertBefore(this.$7, this.get_domElement());
}
}
}
ScriptFX.UI.TimedAnimation = function (domElement, duration) {
ScriptFX.UI.TimedAnimation.constructBase(this, [
domElement
]);
this.$10 = duration;
}
ScriptFX.UI.TimedAnimation.easeIn = function (t) {
return t * t;
}
ScriptFX.UI.TimedAnimation.easeInOut = function (t) {
t = t * 2;
if (t < 1) {
return t * t / 2;
}
return - ((--t) * (t - 2) - 1) / 2;
}
ScriptFX.UI.TimedAnimation.easeOut = function (t) {
return - t * (t - 2);
}
ScriptFX.UI.TimedAnimation.prototype = {
$10: 0,
$11: null,
$12: 0,
get_duration: function () {
return this.$10;
},
set_duration: function (value) {
this.$10 = value;
return value;
},
get_easingFunction: function () {
return this.$11;
},
set_easingFunction: function (value) {
this.$11 = value;
return value;
},
playCore: function () {
this.$12 = (new Date()).getTime();
this.progressCore(false, this.$12);
},
progressCore: function (startRepetition, timeStamp) {
var $0 = 0;
var $1 = false;
if (!startRepetition) {
$0 = (timeStamp - this.$12) / this.$10;
if (!this.get_isReversed()) {
$1 = ($0 >= 1);
$0 = Math.min(1, $0);
} else {
$0 = 1 - $0;
$1 = ($0 <= 0);
$0 = Math.max(0, $0);
}
if ((!$1) && (this.$11)) {
$0 = this.$11.invoke($0);
}
} else {
this.$12 = timeStamp;
if (this.get_isReversed()) {
$0 = 1;
}
}
this.performTweening($0);
return $1;
},
stopCore: function (completed, stopState) {
if (!completed) {
if (!stopState) {
this.performTweening(1);
} else if (stopState === 2) {
this.performTweening(0);
}
}
}
}
ScriptFX.Application.createClass('ScriptFX.Application', null, IServiceProvider, IServiceContainer, ScriptFX.IEventManager);
ScriptFX.CancelEventArgs.createClass('ScriptFX.CancelEventArgs', EventArgs);
ScriptFX.CollectionChangedEventArgs.createClass('ScriptFX.CollectionChangedEventArgs', EventArgs);
ScriptFX.ApplicationUnloadingEventArgs.createClass('ScriptFX.ApplicationUnloadingEventArgs', EventArgs);
ScriptFX.HistoryManager.createClass('ScriptFX.HistoryManager', null, IDisposable);
ScriptFX.HistoryEventArgs.createClass('ScriptFX.HistoryEventArgs', EventArgs);
ScriptFX.HostInfo.createClass('ScriptFX.HostInfo');
ScriptFX.EventList.createClass('ScriptFX.EventList');
ScriptFX.JSON.createClass('ScriptFX.JSON');
ScriptFX.PropertyChangedEventArgs.createClass('ScriptFX.PropertyChangedEventArgs', EventArgs);
ScriptFX.ObservableCollection.createClass('ScriptFX.ObservableCollection', null, IDisposable, IArray, IEnumerable, ScriptFX.INotifyCollectionChanged);
ScriptFX.Net.HTTPRequest.createClass('ScriptFX.Net.HTTPRequest', null, IDisposable);
ScriptFX.Net.HTTPRequestManager.createClass('ScriptFX.Net.HTTPRequestManager');
ScriptFX.Net.HTTPTransport.createClass('ScriptFX.Net.HTTPTransport', null, IDisposable);
ScriptFX.Net.PostHTTPRequestEventArgs.createClass('ScriptFX.Net.PostHTTPRequestEventArgs', EventArgs);
ScriptFX.Net.PreHTTPRequestEventArgs.createClass('ScriptFX.Net.PreHTTPRequestEventArgs', EventArgs);
ScriptFX.Net._Core$2.createClass('ScriptFX.Net._Core$2', null, ScriptFX.Net.IHTTPResponse);
ScriptFX.Net._Core$3.createClass('ScriptFX.Net._Core$3', ScriptFX.Net.HTTPTransport);
ScriptFX.UI.Animation.createClass('ScriptFX.UI.Animation', null, IDisposable);
ScriptFX.UI.AnimationManager.createClass('ScriptFX.UI.AnimationManager');
ScriptFX.UI.AnimationSequence.createClass('ScriptFX.UI.AnimationSequence', ScriptFX.UI.Animation);
ScriptFX.UI.Behavior.createClass('ScriptFX.UI.Behavior', null, IDisposable, ScriptFX.ISupportInitialize, ScriptFX.INotifyPropertyChanged);
ScriptFX.UI.Color.createClass('ScriptFX.UI.Color');
ScriptFX.UI.Control.createClass('ScriptFX.UI.Control', ScriptFX.UI.Behavior, ScriptFX.INotifyDisposing);
ScriptFX.UI.DOMEventList.createClass('ScriptFX.UI.DOMEventList', null, IDisposable);
ScriptFX.UI.DragDropEventArgs.createClass('ScriptFX.UI.DragDropEventArgs', EventArgs);
ScriptFX.UI.DragDropManager.createClass('ScriptFX.UI.DragDropManager');
ScriptFX.UI._Core$0.createClass('ScriptFX.UI._Core$0', null, ScriptFX.UI.IDragSource);
ScriptFX.UI.Element.createClass('ScriptFX.UI.Element');
ScriptFX.UI.TimedAnimation.createClass('ScriptFX.UI.TimedAnimation', ScriptFX.UI.Animation);
ScriptFX.UI.FadeEffect.createClass('ScriptFX.UI.FadeEffect', ScriptFX.UI.TimedAnimation);
ScriptFX.UI._Core$4.createClass('ScriptFX.UI._Core$4', ScriptFX.UI.Control);
ScriptFX.UI.OverlayBehavior.createClass('ScriptFX.UI.OverlayBehavior', ScriptFX.UI.Behavior);
ScriptFX.UI.PopupBehavior.createClass('ScriptFX.UI.PopupBehavior', ScriptFX.UI.Behavior);
ScriptFX.Application.current = new ScriptFX.Application();
ScriptFX.JSON.$0 = null;
ScriptFX.Net.HTTPRequestManager.$0 = null;
ScriptFX.Net.HTTPRequestManager.$1 = null;
ScriptFX.Net.HTTPRequestManager.$2 = 0;
ScriptFX.Net.HTTPRequestManager.$3 = [
];
ScriptFX.Net.HTTPRequestManager.$4 = null;
ScriptFX.UI.AnimationManager.$0 = 100;
ScriptFX.UI.AnimationManager.$1 = null;
ScriptFX.UI.AnimationManager.$2 = 0;
ScriptFX.UI.DragDropManager.$0 = null;
ScriptFX.UI.DragDropManager.$1 = [
];
ScriptFX.UI.DragDropManager.$2 = null;
ScriptFX.UI.DragDropManager.$3 = null;
ScriptFX.UI.DragDropManager.$4 = null;
ScriptFX.UI.OverlayBehavior.$6 = 'visibilityChanged';
// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------
Date.prototype._netFormat = function Date$_netFormat(format, useLocale) {
var dtf = useLocale ? CultureInfo.Current.dateFormat : CultureInfo.Neutral.dateFormat;
var useUTC = false;
if (format.length == 1) {
switch (format) {
case 'f':
format = dtf.longDatePattern + ' ' + dtf.shortTimePattern;
case 'F':
format = dtf.dateTimePattern;
break;
case 'd':
format = dtf.shortDatePattern;
break;
case 'D':
format = dtf.longDatePattern;
break;
case 't':
format = dtf.shortTimePattern;
break;
case 'T':
format = dtf.longTimePattern;
break;
case 'g':
format = dtf.shortDatePattern + ' ' + dtf.shortTimePattern;
break;
case 'G':
format = dtf.shortDatePattern + ' ' + dtf.longTimePattern;
break;
case 'R':
case 'r':
format = dtf.gmtDateTimePattern;
useUTC = true;
break;
case 'u':
format = dtf.universalDateTimePattern;
useUTC = true;
break;
case 'U':
format = dtf.dateTimePattern;
useUTC = true;
break;
case 's':
format = dtf.sortableDateTimePattern;
break;
}
}
if (format.charAt(0) == '%') {
format = format.substr(1);
}
if (!Date._formatRE) {
Date._formatRE = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;
}
var re = Date._formatRE;
var sb = new StringBuilder();
var dt = this;
if (useUTC) {
dt = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds()));
}
re.lastIndex = 0;
while (true) {
var index = re.lastIndex;
var match = re.exec(format);
sb.append(format.slice(index, match ? match.index : format.length));
if (!match) {
break;
}
var fs = match[0];
var part = fs;
switch (fs) {
case 'dddd':
part = dtf.dayNames[dt.getDay()];
break;
case 'ddd':
part = dtf.shortDayNames[dt.getDay()];
break;
case 'dd':
part = dt.getDate().toString().padLeft(2, '0'); //fix
break;
case 'd':
part = dt.getDate(); //fix
break;
case 'MMMM':
part = dtf.monthNames[dt.getMonth()];
break;
case 'MMM':
part = dtf.shortMonthNames[dt.getMonth()];
break;
case 'MM':
part = (dt.getMonth() + 1).toString().padLeft(2, '0');
break;
case 'M':
part = (dt.getMonth() + 1);
break;
case 'yyyy':
part = dt.getFullYear();
break;
case 'yy':
part = (dt.getFullYear() % 100).toString().padLeft(2, '0');
break;
case 'y':
part = (dt.getFullYear() % 100);
break;
case 'h':
case 'hh':
part = dt.getHours() % 12;
if (!part) {
part = '12';
} 
else if (fs == 'hh') {
part = part.toString().padLeft(2, '0');
}
break;
case 'HH':
part = dt.getHours().toString().padLeft(2, '0');
break;
case 'H':
part = dt.getHours();
break;
case 'mm':
part = dt.getMinutes().toString().padLeft(2, '0');
break;
case 'm':
part = dt.getMinutes();
break;
case 'ss':
part = dt.getSeconds().toString().padLeft(2, '0');
break;
case 's':
part = dt.getSeconds();
break;
case 't':
case 'tt':
part = (dt.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator;
if (fs == 't') {
part = part.charAt(0);
}
break;
case 'fff':
part = dt.getMilliseconds().toString().padLeft(3, '0');
break;
case 'ff':
part = dt.getMilliseconds().toString().padLeft(3).substr(0, 2);
break;
case 'f':
part = dt.getMilliseconds().toString().padLeft(3).charAt(0);
break;
case 'z':
part = dt.getTimezoneOffset() / 60;
part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part));
break;
case 'zz':
case 'zzz':
part = dt.getTimezoneOffset() / 60;
part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part)).toString().padLeft(2, '0');
if (fs == 'zzz') {
part += dtf.timeSeparator + Math.abs(dt.getTimezoneOffset() % 60).toString().padLeft(2, '0');
}
break;
}
sb.append(part);
}
return sb.toString();
}
Delegate._create = function Delegate$_create(targets) { // popravek klicanja delegatov ob notify eventih - ?e se med klicanjem kateri delegat odattacha, je originalna funkcija skraj?ala array delegatov in presko?ila naslednjega veljavnega.
var delegate = function () {
if (targets.length == 2) {
return targets[1].apply(targets[0], arguments);
} 
else {
var tempTargets = targets.clone();
for (var i = 0; i < tempTargets.length; i += 2) {
tempTargets[i + 1].apply(tempTargets[i], arguments);
}
return null;
}
};
delegate.invoke = delegate;
delegate._targets = targets;
return delegate;
}
String.prototype.replace = String.prototype._replace;
ScriptHost._onLoaded = function ScriptHost$_onLoaded() { // popravek funkcije, ker si Script# domi?lja, da ?e obstaja window.main objekt, da je to funkcija, in jo samodejno kli?e ob window.onload eventu.
ScriptHost._loaded = true;
if (ScriptHost._loadHandler) {
ScriptHost._loadHandler.invoke(null, EventArgs.Empty);
ScriptHost._loadHandler = null;
}
}
Type.createNamespace('RMap.CS');
RMap.CS.REllipsoid = function (semiMajorAxis, inverseFlattening) {
this.semiMajorAxis = semiMajorAxis;
if (inverseFlattening > 0) {
this.flattening = 1 / inverseFlattening;
this.semiMinorAxis = semiMajorAxis * (1 - this.flattening);
this.eccentricitySquared = 2 * this.flattening - this.flattening * this.flattening;
this.eccentricity = Math.sqrt(this.eccentricitySquared);
this.secondEccentricitySquared = (this.semiMajorAxis * this.semiMajorAxis - this.semiMinorAxis * this.semiMinorAxis) / (this.semiMinorAxis * this.semiMinorAxis);
this.inverseFlattening = inverseFlattening;
} else {
this.flattening = 0;
this.semiMinorAxis = semiMajorAxis;
this.eccentricitySquared = 0;
this.eccentricity = 0;
this.secondEccentricitySquared = 0;
this.inverseFlattening = Number.POSITIVE_INFINITY;
}
}
RMap.CS.REllipsoid.prototype = {
semiMajorAxis: 0,
semiMinorAxis: 0,
flattening: 0,
inverseFlattening: 0,
eccentricity: 0,
eccentricitySquared: 0,
secondEccentricitySquared: 0
}
RMap.CS.RGeodeticDatum = function (ellipsoid, primeMeridian, toWgs84Parameters) {
this.ellipsoid = ellipsoid;
this.primeMeridian = primeMeridian;
if (!toWgs84Parameters) {
this.toWgs84Parameters = new RMap.CS.RToWgs84Parameters(0, 0, 0, 0, 0, 0, 0, RMap.CS.RUnit.createAngularUnit(1));
} else {
this.toWgs84Parameters = toWgs84Parameters;
}
}
RMap.CS.RGeodeticDatum.prototype = {
ellipsoid: null,
primeMeridian: 0,
toWgs84Parameters: null
}
RMap.CS.RGeodeticDatumTransform = function () {
}
RMap.CS.RGeodeticDatumTransform.geographicToGeographic = function (fromDatum, toDatum, from, to, computeGeoidHeight) {
RMap.CS.RGeodeticDatumTransform.geographicToGeocentric(fromDatum, from, to, computeGeoidHeight);
RMap.CS.RGeodeticDatumTransform.geocentricToGeocentric(fromDatum, toDatum, to, to);
RMap.CS.RGeodeticDatumTransform.geocentricToGeographic(toDatum, to, to, computeGeoidHeight);
if (!computeGeoidHeight) {
to.z = from.z;
}
}
RMap.CS.RGeodeticDatumTransform.geographicToGeocentric = function (datum, geographic, geocentric, computeGeoidHeight) {
RMap.CS.RGeodeticDatumTransform.$1(geographic, geocentric, datum.ellipsoid.semiMajorAxis, datum.ellipsoid.eccentricitySquared, computeGeoidHeight);
}
RMap.CS.RGeodeticDatumTransform.geocentricToGeographic = function (datum, geocentric, geographic, computeGeoidHeight) {
RMap.CS.RGeodeticDatumTransform.$5(geocentric, geographic, datum.ellipsoid.semiMajorAxis, datum.ellipsoid.semiMinorAxis, datum.ellipsoid.eccentricitySquared, datum.ellipsoid.secondEccentricitySquared, computeGeoidHeight);
}
RMap.CS.RGeodeticDatumTransform.geocentricToGeocentric = function (fromDatum, toDatum, from, to) {
var $0 = new RMap.CS.RCoordinate2D(0, 0);
RMap.CS.RGeodeticDatumTransform.$6(from, $0, fromDatum.toWgs84Parameters);
RMap.CS.RGeodeticDatumTransform.$7($0, to, toDatum.toWgs84Parameters);
}
RMap.CS.RGeodeticDatumTransform.geographicToGeographicWgs84 = function (datum, geographic, geographicWgs84, computeGeoidHeight) {
if (datum.toWgs84Parameters.needsBursaWolf()) {
RMap.CS.RGeodeticDatumTransform.geographicToGeocentric(datum, geographic, geographicWgs84, computeGeoidHeight);
var $0 = new RMap.CS.RCoordinate2D(0, 0);
RMap.CS.RGeodeticDatumTransform.$6(geographicWgs84, $0, datum.toWgs84Parameters);
RMap.CS.RGeodeticDatumTransform.geocentricToGeographic(RMap.CS.RGeodeticDatumTransform.$0, $0, geographicWgs84, computeGeoidHeight);
if (!computeGeoidHeight) {
geographicWgs84.z = geographic.z;
}
} else {
geographicWgs84.x = geographic.x;
geographicWgs84.y = geographic.y;
geographicWgs84.z = geographic.z;
}
}
RMap.CS.RGeodeticDatumTransform.geographicWgs84ToGeographic = function (datum, geographicWgs84, geographic, computeGeoidHeight) {
if (datum.toWgs84Parameters.needsBursaWolf()) {
RMap.CS.RGeodeticDatumTransform.geographicToGeocentric(RMap.CS.RGeodeticDatumTransform.$0, geographicWgs84, geographic, computeGeoidHeight);
var $0 = new RMap.CS.RCoordinate2D(0, 0);
RMap.CS.RGeodeticDatumTransform.$7(geographic, $0, datum.toWgs84Parameters);
RMap.CS.RGeodeticDatumTransform.geocentricToGeographic(datum, $0, geographic, computeGeoidHeight);
if (!computeGeoidHeight) {
geographic.z = geographicWgs84.z;
}
} else {
geographic.x = geographicWgs84.x;
geographic.y = geographicWgs84.y;
geographic.z = geographicWgs84.z;
}
}
RMap.CS.RGeodeticDatumTransform.$1 = function ($p0, $p1, $p2, $p3, $p4) {
$p1.x = RMap.CS.SupportClass.degreesToRadians($p0.x);
$p1.y = RMap.CS.SupportClass.degreesToRadians($p0.y);
$p1.z = ($p4) ? $p0.z : 0;
var $0 = Math.cos($p1.y);
var $1 = Math.sin($p1.y);
var $2 = $p2 / Math.sqrt(1 - $p3 * ($1 * $1));
var $3 = $p1.x;
$p1.x = ($2 + $p1.z) * $0 * Math.cos($3);
$p1.y = ($2 + $p1.z) * $0 * Math.sin($3);
$p1.z = ($2 * (1 - $p3) + $p1.z) * $1;
}
RMap.CS.RGeodeticDatumTransform.$4 = function ($p0) {
return ($p0 * 180 / Math.PI);
}
RMap.CS.RGeodeticDatumTransform.$5 = function ($p0, $p1, $p2, $p3, $p4, $p5, $p6) {
$p1.x = $p0.x;
$p1.y = $p0.y;
$p1.z = $p0.z;
var $0 = $p1.x * $p1.x + $p1.y * $p1.y;
var $1 = Math.sqrt($0);
var $2 = $p1.z * 1.0026;
var $3 = Math.sqrt($2 * $2 + $0);
var $4 = $2 / $3;
var $5 = $1 / $3;
var $6 = $4 * $4 * $4;
var $7 = $p1.z + $p3 * $p5 * $6;
var $8 = $1 - $p2 * $p4 * ($5 * $5 * $5);
var $9 = Math.sqrt($7 * $7 + $8 * $8);
var $A = $7 / $9;
var $B = $8 / $9;
$p1.x = RMap.CS.RGeodeticDatumTransform.$4(Math.atan2($p1.y, $p1.x));
$p1.y = RMap.CS.RGeodeticDatumTransform.$4(Math.atan($A / $B));
if ($p6) {
var $C = $p2 / Math.sqrt(1 - $p4 * ($A * $A));
if ($B >= 0.38268343236509) {
$p1.z = $1 / $B - $C;
} else if ($B <= - 0.38268343236509) {
$p1.z = - $1 / - $B - $C;
} else {
$p1.z = $p1.z / $A + $C * ($p4 - 1);
}
} else {
$p1.z = 0;
}
}
RMap.CS.RGeodeticDatumTransform.$6 = function ($p0, $p1, $p2) {
$p1.x = $p2.m * ($p0.x - $p2.rZ * $p0.y + $p2.rY * $p0.z) + $p2.dX;
$p1.y = $p2.m * ($p2.rZ * $p0.x + $p0.y - $p2.rX * $p0.z) + $p2.dY;
$p1.z = $p2.m * (( - $p2.rY) * $p0.x + $p2.rX * $p0.y + $p0.z) + $p2.dZ;
}
RMap.CS.RGeodeticDatumTransform.$7 = function ($p0, $p1, $p2) {
$p1.x = $p2.mInv * ($p0.x + $p2.rZ * $p0.y - $p2.rY * $p0.z) - $p2.dX;
$p1.y = $p2.mInv * (( - $p2.rZ) * $p0.x + $p0.y + $p2.rX * $p0.z) - $p2.dY;
$p1.z = $p2.mInv * ($p2.rY * $p0.x - $p2.rX * $p0.y + $p0.z) - $p2.dZ;
}
RMap.CS.RToWgs84Parameters = function (dX, dY, dZ, rX, rY, rZ, dS, unit) {
this.dX = dX;
this.dY = dY;
this.dZ = dZ;
this.rX = unit.conversionFactor * rX;
this.rY = unit.conversionFactor * rY;
this.rZ = unit.conversionFactor * rZ;
this.dS = dS;
this.m = 1 + dS / 1000000;
this.mInv = 1 - dS / 1000000;
this.$0 = !(!dX && !dY && !dZ && !rX && !rY && !rZ && !dS);
}
RMap.CS.RToWgs84Parameters.prototype = {
dX: 0,
dY: 0,
dZ: 0,
rX: 0,
rY: 0,
rZ: 0,
dS: 0,
m: 0,
mInv: 0,
$0: false,
needsBursaWolf: function () {
return this.$0;
}
}
RMap.CS.REqudistantCylindricalProjection = function (ellipsoid, latitudeOfOrigin, centralMeridian, unit) {
RMap.CS.REqudistantCylindricalProjection.constructBase(this);
this.$0 = ellipsoid;
this.$1 = RMap.CS.SupportClass.degreesToRadians(latitudeOfOrigin);
this.$2 = RMap.CS.SupportClass.degreesToRadians(centralMeridian);
this.$3 = unit.conversionFactor;
this.$5();
}
RMap.CS.REqudistantCylindricalProjection.prototype = {
$0: null,
$1: 0,
$2: 0,
$3: 0,
$4: 0,
r: 0,
$5: function () {
this.$4 = Math.cos(this.$1);
var $0 = Math.sin(this.$2);
var $1 = 1 - this.$0.eccentricitySquared * $0 * $0;
var $2 = this.$0.semiMajorAxis * this.$0.semiMajorAxis / (this.$3 * this.$3);
this.r = Math.sqrt($2 * (1 - this.$0.eccentricitySquared) / ($1 * $1));
},
setAutoProjectionParameters: function (projectionCenter) {
var $0 = new RMap.CS.RCoordinate2D(0, 0);
this.inverse(projectionCenter, $0);
this.$1 = RMap.CS.SupportClass.degreesToRadians($0.y);
this.$5();
return $0;
},
forward: function (geographic, projected) {
projected.x = this.r * (RMap.CS.SupportClass.degreesToRadians(geographic.x) - this.$2) * this.$4;
projected.y = this.r * RMap.CS.SupportClass.degreesToRadians(geographic.y);
projected.z = geographic.z;
},
inverse: function (projected, geographic) {
geographic.x = RMap.CS.SupportClass.radiansToDegrees(this.$2 + (projected.x / (this.r * this.$4)));
geographic.y = RMap.CS.SupportClass.radiansToDegrees(projected.y / this.r);
geographic.z = projected.z;
}
}
RMap.CS.RGoogleMercatorProjection = function () {
this.$0 = RMap.CS.RUnit.createAngularUnit(2);
RMap.CS.RGoogleMercatorProjection.constructBase(this);
}
RMap.CS.RGoogleMercatorProjection.prototype = {
forward: function (geographic, projected) {
projected.x = geographic.x;
var $0 = Math.sin(geographic.y * this.$0.conversionFactor);
projected.y = 0.5 * Math.log((1 + $0) / (1 - $0)) / this.$0.conversionFactor;
projected.z = geographic.z;
},
inverse: function (projected, geographic) {
geographic.x = projected.x;
var $0 = Math.exp(2 * projected.y * this.$0.conversionFactor);
geographic.y = Math.asin(($0 - 1) / ($0 + 1)) / this.$0.conversionFactor;
geographic.z = projected.z;
}
}
RMap.CS.RMercator1SpProjection = function (ellipsoid, latitudeOfOrigin, centralMeridian, scaleFactor, falseEasting, falseNorthing, unit) {
RMap.CS.RMercator1SpProjection.constructBase(this);
this.$0 = ellipsoid;
this.$2 = RMap.CS.SupportClass.degreesToRadians(centralMeridian);
this.$1 = RMap.CS.SupportClass.degreesToRadians(latitudeOfOrigin);
this.$3 = scaleFactor;
this.$4 = falseEasting;
this.$5 = falseNorthing;
this.$6 = unit.conversionFactor;
this.$8();
}
RMap.CS.RMercator1SpProjection.prototype = {
$0: null,
$1: 0,
$2: 0,
$3: 0,
$4: 0,
$5: 0,
$6: 0,
$7: 0,
$8: function () {
if (this.$3 === 1) {
this.$7 = this.$0.semiMajorAxis * this.$3 / this.$6;
} else {
var $0 = Math.abs(RMap.CS.SupportClass.degreesToRadians(this.$1));
this.$7 = (this.$0.semiMajorAxis / this.$6) * this.$A(Math.sin($0), Math.cos($0));
}
},
forward: function (geographic, projected) {
projected.x = this.$4 + (RMap.CS.SupportClass.degreesToRadians(geographic.x) - this.$2) * this.$7;
var $0 = RMap.CS.SupportClass.degreesToRadians(geographic.y);
projected.y = this.$5 - this.$7 * Math.log(this.$B($0, Math.sin($0)));
projected.z = geographic.z;
},
inverse: function (projected, geographic) {
geographic.x = RMap.CS.SupportClass.radiansToDegrees((projected.x - this.$4) / this.$7 + this.$2);
geographic.y = Math.exp(this.$5 - projected.y / this.$7);
geographic.y = RMap.CS.SupportClass.radiansToDegrees(this.$9(geographic.y));
geographic.z = projected.z;
},
$9: function ($p0) {
var $0 = 0.5 * this.$0.eccentricity;
var $1 = (Math.PI / 2) - 2 * Math.atan($p0);
for (var $2 = 0; $2 < 16; $2++) {
var $3 = this.$0.eccentricity * Math.sin($1);
var $4 = (Math.PI / 2) - 2 * Math.atan($p0 * Math.pow((1 - $3) / (1 + $3), $0)) - $1;
$1 += $4;
}
return $1;
},
$A: function ($p0, $p1) {
return $p1 / Math.sqrt(1 - $p0 * $p0 * this.$0.eccentricitySquared);
},
$B: function ($p0, $p1) {
$p1 *= this.$0.eccentricity;
return Math.tan(0.5 * ((Math.PI / 2) - $p0)) / Math.pow((1 - $p1) / (1 + $p1), 0.5 * this.$0.eccentricity);
}
}
RMap.CS.RProjection = function () {
}
RMap.CS.RProjection.prototype = {
setAutoProjectionParameters: function (projectionCenter) {
var $0 = new RMap.CS.RCoordinate2D(0, 0);
this.inverse(projectionCenter, $0);
return $0;
}
}
RMap.CS.RTransverseMercatorProjection = function (ellipsoid, latitudeOfOrigin, centralMeridian, scaleFactor, falseEasting, falseNorthing, unit) {
RMap.CS.RTransverseMercatorProjection.constructBase(this);
this.$0 = ellipsoid;
this.$1 = RMap.CS.SupportClass.degreesToRadians(centralMeridian);
this.$2 = RMap.CS.SupportClass.degreesToRadians(latitudeOfOrigin);
this.$3 = scaleFactor;
this.$4 = falseEasting;
this.$5 = falseNorthing;
this.$6 = unit.conversionFactor;
this.$26();
}
RMap.CS.RTransverseMercatorProjection.prototype = {
$0: null,
$1: 0,
$2: 0,
$3: 0,
$4: 0,
$5: 0,
$6: 0,
$7: 0,
$8: 0,
$9: 0,
$A: 0,
$B: 0,
$C: 0,
$D: 0,
$E: 0,
$26: function () {
this.$7 = this.$3 * this.$0.semiMajorAxis / this.$6;
this.$8 = this.$0.eccentricitySquared / (1 - this.$0.eccentricitySquared);
var $0;
this.$9 = 1 - this.$0.eccentricitySquared * (0.25 + this.$0.eccentricitySquared * (0.046875 + this.$0.eccentricitySquared * (0.01953125 + this.$0.eccentricitySquared * 0.01068115234375)));
this.$A = this.$0.eccentricitySquared * (0.75 - this.$0.eccentricitySquared * (0.046875 + this.$0.eccentricitySquared * (0.01953125 + this.$0.eccentricitySquared * 0.01068115234375)));
this.$B = ($0 = this.$0.eccentricitySquared * this.$0.eccentricitySquared) * (0.46875 - this.$0.eccentricitySquared * (0.0130208333333333 + this.$0.eccentricitySquared * 0.00712076822916667));
this.$C = ($0 *= this.$0.eccentricitySquared) * (0.364583333333333 - this.$0.eccentricitySquared * 0.00569661458333333);
this.$D = $0 * this.$0.eccentricitySquared * 0.3076171875;
this.$E = this.$27(this.$2, Math.sin(this.$2), Math.cos(this.$2));
},
setAutoProjectionParameters: function (projectionCenter) {
var $0 = new RMap.CS.RCoordinate2D(0, 0);
this.inverse(projectionCenter, $0);
this.$1 = RMap.CS.SupportClass.degreesToRadians($0.x);
this.$26();
return $0;
},
forward: function (geographic, projected) {
projected.x = RMap.CS.SupportClass.degreesToRadians(geographic.x) - this.$1;
projected.y = RMap.CS.SupportClass.degreesToRadians(geographic.y);
var $0 = Math.sin(projected.y);
var $1 = Math.cos(projected.y);
var $2 = (Math.abs($1) > 0.000001) ? $0 / $1 : 0;
$2 *= $2;
var $3 = $1 * projected.x;
var $4 = $3 * $3;
$3 /= Math.sqrt(1 - this.$0.eccentricitySquared * $0 * $0);
var $5 = this.$8 * $1 * $1;
var $6 = (1 + 0.0833333333333333 * $4 * (5 - $2 + $5 * (9 + 4 * $5) + 0.0333333333333333 * $4 * (61 + $2 * ($2 - 58) + $5 * (270 - 330 * $2) + 0.0178571428571429 * $4 * (1385 + $2 * ($2 * (543 - $2) - 3111)))));
projected.y = (this.$27(projected.y, $0, $1) - this.$E + $0 * $3 * projected.x * 0.5 * $6);
projected.x = $3 * (1 + 0.166666666666667 * $4 * (1 - $2 + $5 + 0.05 * $4 * (5 + $2 * ($2 - 18) + $5 * (14 - 58 * $2) + 0.0238095238095238 * $4 * (61 + $2 * ($2 * (179 - $2) - 479)))));
projected.x = projected.x * this.$7 + this.$4;
projected.y = projected.y * this.$7 + this.$5;
projected.z = geographic.z;
},
inverse: function (projected, geographic) {
geographic.x = (projected.x - this.$4) / this.$7;
geographic.y = (projected.y - this.$5) / this.$7;
var $0 = this.$28(this.$E + geographic.y);
if (Math.abs($0) >= (Math.PI / 2)) {
geographic.y = (geographic.y < 0) ? - (Math.PI / 2)  : (Math.PI / 2);
geographic.x = 0;
} else {
var $1 = Math.sin($0);
var $2 = Math.cos($0);
var $3 = (Math.abs($2) > 0.000001) ? $1 / $2 : 0;
var $4 = this.$8 * $2 * $2;
var $5 = 1 - this.$0.eccentricitySquared * $1 * $1;
var $6 = geographic.x * Math.sqrt($5);
$5 *= $3;
$3 *= $3;
var $7 = $6 * $6;
geographic.y = $0 - ($5 * $7 / (1 - this.$0.eccentricitySquared)) * 0.5 * (1 - $7 * 0.0833333333333333 * (5 + $3 * (3 - 9 * $4) + $4 * (1 - 4 * $4) - $7 * 0.0333333333333333 * (61 + $3 * (90 - 252 * $4 + 45 * $3) + 46 * $4 - $7 * 0.0178571428571429 * (1385 + $3 * (3633 + $3 * (4095 + 1574 * $3))))));
geographic.x = $6 * (1 - $7 * 0.166666666666667 * (1 + 2 * $3 + $4 - $7 * 0.05 * (5 + $3 * (28 + 24 * $3 + 8 * $4) + 6 * $4 - $7 * 0.0238095238095238 * (61 + $3 * (662 + $3 * (1320 + 720 * $3)))))) / $2;
}
geographic.x = RMap.CS.SupportClass.radiansToDegrees(geographic.x + this.$1);
geographic.y = RMap.CS.SupportClass.radiansToDegrees(geographic.y);
geographic.z = projected.z;
},
$27: function ($p0, $p1, $p2) {
$p2 *= $p1;
$p1 *= $p1;
return this.$9 * $p0 - $p2 * (this.$A + $p1 * (this.$B + $p1 * (this.$C + $p1 * this.$D)));
},
$28: function ($p0) {
var $0,
$1,
$2,
$3 = 1 / (1 - this.$0.eccentricitySquared);
var $4;
$2 = $p0;
for ($4 = 15; true; ) {
if (--$4 < 0) {
return $2;
}
$0 = Math.sin($2);
$1 = 1 - this.$0.eccentricitySquared * $0 * $0;
$1 = (this.$27($2, $0, Math.cos($2)) - $p0) * ($1 * Math.sqrt($1)) * $3;
$2 -= $1;
if (Math.abs($1) < 1e-11) {
return $2;
}
}
}
}
RMap.CS.RAxisInfo = function (xAxisAbbreaviation, yAxisAbbreaviation, zAxisAbbreaviation, axisOrderOrientation) {
this.xAxisAbbreaviation = xAxisAbbreaviation;
this.yAxisAbbreaviation = yAxisAbbreaviation;
this.zAxisAbbreaviation = zAxisAbbreaviation;
this.axisOrderOrientation = axisOrderOrientation;
}
RMap.CS.RAxisInfo.prototype = {
xAxisAbbreaviation: null,
yAxisAbbreaviation: null,
zAxisAbbreaviation: null,
axisOrderOrientation: 0
}
RMap.CS.RCoordinate2D = function (x, y) {
this.x = x;
this.y = y;
}
RMap.CS.RCoordinate2D.prototype = {
x: 0,
y: 0,
z: 0
}
RMap.CS.RCoordinate3D = function (x, y, z) {
RMap.CS.RCoordinate3D.constructBase(this, [
x,
y
]);
this.z = z;
}
RMap.CS.RCoordinateSystem = function (crsId, validAreaWgs84, units, verticalUnit, axisInfo) {
if (crsId) {
this.crsId = crsId;
}
this.validAreaWgs84 = validAreaWgs84;
this.units = units;
this.verticalUnit = verticalUnit;
this.axisInfo = axisInfo;
}
RMap.CS.RCoordinateSystem.prototype = {
get_validArea: function () {
if (!this.$0) {
this.$0 = RMap.CS.REnvelope.createEmpty();
this.transformFromWgs84(this.validAreaWgs84.upperLeft, this.$0.upperLeft);
this.transformFromWgs84(this.validAreaWgs84.lowerRight, this.$0.lowerRight);
}
return this.$0;
},
crsId: null,
validAreaWgs84: null,
units: null,
verticalUnit: null,
axisInfo: null,
$0: null,
$1: null,
transformFrom: function (sourceCs, source, dest) {
if (sourceCs.equals(this)) {
dest.x = source.x;
dest.y = source.y;
dest.z = source.z;
} else {
var $0 = new RMap.CS.RCoordinate2D(0, 0);
sourceCs.transformToWgs84(source, $0);
this.transformFromWgs84($0, dest);
}
},
transformToDisplay: function (world, display, csView, displayWidth, displayHeight) {
if (this.$1 !== csView) {
this.$1 = this.transformCsView(csView);
}
display.x = Math.floor(displayWidth / 2 - (displayWidth / this.$1.get_width()) * (this.$1.get_centerX() - world.x) + 0.5);
display.y = Math.floor(displayHeight / 2 - (displayHeight / this.$1.getHeight(displayWidth, displayHeight)) * (world.y - this.$1.get_centerY()) + 0.5);
},
transformFromDisplay: function (display, world, csView, displayWidth, displayHeight) {
if (this.$1 !== csView) {
this.$1 = this.transformCsView(csView);
}
world.x = this.$1.get_centerX() - (this.$1.get_width() / displayWidth) * (displayWidth / 2 - display.x);
world.y = this.$1.get_centerY() + (this.$1.getHeight(displayWidth, displayHeight) / displayHeight) * (displayHeight / 2 - display.y);
},
transformCsView: function (srcView) {
if (srcView.get_coordinateSystem().equals(this)) {
return srcView;
}
var $0 = new RMap.CS.RCoordinate2D(0, 0);
this.transformFrom(srcView.get_coordinateSystem(), new RMap.CS.RCoordinate2D(srcView.get_centerX(), srcView.get_centerY()), $0);
var $1 = new RMap.CS.RCsView(this);
$1.setCenterView($0.x, $0.y, srcView.get_scaleInMeters());
return $1;
},
calculateDistanceInMeters: function (from, to) {
var $0 = 6367;
var $1 = 0.017453293;
var $2 = new RMap.CS.RCoordinate2D(0, 0);
this.transformToWgs84(to, $2);
var $3 = $2.y * $1;
var $4 = $2.x * $1;
this.transformToWgs84(from, $2);
var $5 = $2.y * $1;
var $6 = $2.x * $1;
var $7 = $4 - $6;
var $8 = $3 - $5;
var $9 = (Math.sin($8 / 2) * Math.sin($8 / 2)) + (Math.cos($5) * Math.cos($3) * Math.sin($7 / 2) * Math.sin($7 / 2));
var $A = 2 * Math.asin(Math.sqrt($9));
return ($0 * 1000 * $A);
},
measureUnitsInMeters: function (world) {
var $0 = Math.abs(this.calculateDistanceInMeters(new RMap.CS.RCoordinate2D(world.x - 0.5, world.y), new RMap.CS.RCoordinate2D(world.x + 0.5, world.y)));
var $1 = Math.abs(this.calculateDistanceInMeters(new RMap.CS.RCoordinate2D(world.x, world.y - 0.5), new RMap.CS.RCoordinate2D(world.x, world.y + 0.5)));
return new RMap.CS.RCoordinate2D($0, $1);
},
isInsideValidArea: function (world) {
return this.get_validArea().containsPoint(world);
},
equals: function (otherCs) {
if (this === otherCs) {
return true;
}
if (this.crsId.crsUniqueId > 0) {
if (this.crsId.crsUniqueId === (otherCs).crsId.crsUniqueId) {
return true;
} else {
return false;
}
}
return (this.crsId.crsCode === (otherCs).crsId.crsCode);
},
getHashCode: function () {
return this.crsId.crsCodeNumber;
}
}
RMap.CS.RCoordinateSystemFactory = function () {
}
RMap.CS.RCoordinateSystemFactory.createUnknown = function (validArea, units) {
return new RMap.CS.RUnknownCoordinateSystem(validArea, units, units, new RMap.CS.RAxisInfo('X', 'Y', 'Z', 1));
}
RMap.CS.RCoordinateSystemFactory.createFromCrsCode = function (crsCode) {
crsCode = crsCode.toUpperCase();
var $0 = null;
var $1 = null;
var $2 = RMap.CS.RCrsId.getCrsCodeAuthority(crsCode);
var $3 = RMap.CS.RCrsId.getCrsCodeNumber(crsCode, $2);
var $4 = 0;
var $5 = null;
var $6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 180, 90), new RMap.CS.RCoordinate2D(180, - 90));
var $7 = RMap.CS.RUnit.createLinearUnit(20);
var $8 = RMap.CS.RUnit.createLinearUnit(20);
var $9 = new RMap.CS.RAxisInfo('X', 'Y', 'H', 1);
var $A = new RMap.CS.RAxisInfo('Long', 'Lat', 'h', 2);
var $B = new RMap.CS.REllipsoid(6378137, 298.257223563);
var $C = null;
var $D = new RMap.CS.RGeodeticDatum($B, 0, $C);
var $E;
if ($2 === 'GOOGLE') {
if ($3 === 41001) {
$1 = new RMap.CS.RCrsId(crsCode, 'WGS84 / Google Mercator');
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 180, 85.0511287798066), new RMap.CS.RCoordinate2D(180, - 85.0511287798066));
$9 = new RMap.CS.RAxisInfo('E', 'N', 'H', 1);
$E = new RMap.CS.RGoogleMercatorProjection();
$7 = RMap.CS.RUnit.createLinearUnit(2);
return new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
}
}
if ($2 === 'EPSG' || $2 === 'AUTO') {
if ($3 === 4326) {
$5 = 'WGS84';
$4 = 4326;
} else if ($3 === 4979) {
$5 = 'WGS84 (3D)';
$4 = 4326;
} else if ($3 === 4269) {
$5 = 'NAD83';
$4 = 4269;
} else if ($3 === 4267) {
$5 = 'NAD27';
$4 = 4267;
} else if ($3 === 42001) {
$5 = 'WGS84 / Auto UTM';
$4 = 42002;
} else if ($3 === 42004) {
$5 = 'WGS84 / Auto Equirectangular';
$4 = 32662;
} else if ($3 === 42002) {
$5 = 'WGS84 / Auto Transverse Mercator';
$4 = 42002;
} else if ($3 === 3395 || $3 === 41001 || $3 === 54004) {
$5 = 'WGS84 / World Mercator';
$4 = 3395;
} else if ($3 === 3857) {
$5 = 'WGS84 / Pseudo-Mercator';
$4 = 3857;
} else if ($3 === 42310) {
$5 = 'WGS84+GRS80 / Mercator';
$4 = 42310;
} else if ($3 === 32662) {
$5 = 'WGS84 / Plate Carree';
$4 = 32662;
} else if ($3 === 2170) {
$5 = 'MGI / Slovenia Grid (D48)';
$4 = 2170;
} else if ($3 === 27700) {
$5 = 'OSGB1936 / British National Grid';
$4 = 27700;
} else if ($3 === 2326) {
$5 = 'Hong Kong 1980 Grid System  EPSG 2326';
$4 = 2326;
}
}
if (!$4) {
return null;
} else {
$1 = new RMap.CS.RCrsId(crsCode, $5);
}
if ($4 === 4326) {
$0 = new RMap.CS.RGeographicCoordinateSystem($1, $6, $8, $A, $D);
} else if ($4 === 4269) {
$B = new RMap.CS.REllipsoid(6378137, 298.257222101);
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$0 = new RMap.CS.RGeographicCoordinateSystem($1, $6, $8, $A, $D);
} else if ($4 === 4267) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 52, 72), new RMap.CS.RCoordinate2D(172, 8));
$B = new RMap.CS.REllipsoid(6378206.4, 294.978698213898);
$C = new RMap.CS.RToWgs84Parameters( - 8, 160, 176, 0, 0, 0, 0, RMap.CS.RUnit.createAngularUnit(3));
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$0 = new RMap.CS.RGeographicCoordinateSystem($1, $6, $8, $A, $D);
} else if ($4 === 3395) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 180, 84), new RMap.CS.RCoordinate2D(180, - 80));
$9 = new RMap.CS.RAxisInfo('E', 'N', 'H', 1);
$E = new RMap.CS.RMercator1SpProjection($B, 0, 0, 1, 0, 0, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 3857) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 180, 85.0511287798066), new RMap.CS.RCoordinate2D(180, - 85.0511287798066));
$E = new RMap.CS.RGoogleBingProjection();
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 42310) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 180, 84), new RMap.CS.RCoordinate2D(180, - 80));
$9 = new RMap.CS.RAxisInfo('E', 'N', 'H', 1);
$B = new RMap.CS.REllipsoid(6378137, 298.257222101);
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$E = new RMap.CS.RMercator1SpProjection($B, 0, 0, 1, 0, 0, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 32662) {
$E = new RMap.CS.REqudistantCylindricalProjection($B, 0, 0, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 42002) {
$E = new RMap.CS.RTransverseMercatorProjection($B, 0, 0, 0.9996, 500000, 0, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 2170) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D(13.33, 46.89), new RMap.CS.RCoordinate2D(16.72, 45.33));
$9 = new RMap.CS.RAxisInfo('Y', 'X', 'H', 2);
$B = new RMap.CS.REllipsoid(6377397.155, 299.1528128);
$C = new RMap.CS.RToWgs84Parameters(426.9, 142.6, 460.1, 4.91, 4.49, - 12.42, 17.1, RMap.CS.RUnit.createAngularUnit(3));
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$E = new RMap.CS.RTransverseMercatorProjection($B, 0, 15, 0.9999, 500000, - 5000000, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 27700) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D( - 27, 64), new RMap.CS.RCoordinate2D(3.5, 48));
$9 = new RMap.CS.RAxisInfo('E', 'N', 'H', 1);
$B = new RMap.CS.REllipsoid(6377563.396, 299.3249646);
$C = new RMap.CS.RToWgs84Parameters(446.448, - 125.157, 542.06, 0.15, 0.247, 0.842, - 20.489, RMap.CS.RUnit.createAngularUnit(3));
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$E = new RMap.CS.RTransverseMercatorProjection($B, 49, - 2, 0.9996012717, 400000, - 100000, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
} else if ($4 === 2326) {
$6 = new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D(113.89, 22.62), new RMap.CS.RCoordinate2D(114.57, 22.16));
$9 = new RMap.CS.RAxisInfo('E', 'N', 'H', 1);
$B = new RMap.CS.REllipsoid(6378388, 297.00000000006);
$C = new RMap.CS.RToWgs84Parameters( - 162.619, - 276.959, - 161.764, 0.067753, - 2.24365, - 1.15883, - 1.09425, RMap.CS.RUnit.createAngularUnit(3));
$D = new RMap.CS.RGeodeticDatum($B, 0, $C);
$E = new RMap.CS.RTransverseMercatorProjection($B, 22.3121333333333, 114.178555555556, 1, 836694.05, 819069.8, $7);
$0 = new RMap.CS.RProjectedCoordinateSystem($1, $6, $7, $8, $9, $D, $E);
}
return $0;
}
RMap.CS.RCrsId = function (crsCode, crsName) {
this.crsCode = crsCode.toUpperCase();
this.crsCodeAthority = RMap.CS.RCrsId.getCrsCodeAuthority(crsCode);
this.crsCodeNumber = RMap.CS.RCrsId.getCrsCodeNumber(crsCode, this.crsCodeAthority);
this.crsName = crsName;
this.crsUniqueId = RMap.CS.RCrsId.$0(this.crsCodeAthority, this.crsCodeNumber);
}
RMap.CS.RCrsId.getCrsCodeNumber = function (crsCode, authority) {
var $0 = crsCode.toUpperCase();
var $1 = authority.toUpperCase() + ':';
var $2 = - 1;
if ($0.indexOf($1) >= 0) {
try {
$2 = Number.parse($0.substring($1.length, $0.length));
} catch ($3) {
$2 = - 1;
String.format('{0},{1}', 1, 2);
}
}
return $2;
}
RMap.CS.RCrsId.getCrsCodeAuthority = function (crsCode) {
var $0 = crsCode.toUpperCase();
var $1;
try {
$1 = $0.substring(0, ($0.indexOf(':')) - (0));
} catch ($2) {
$1 = '';
}
return $1;
}
RMap.CS.RCrsId.$0 = function ($p0, $p1) {
var $0 = - 1;
if ($p0.toUpperCase() === 'EPSG' && $p1 > 0) {
$0 = $p1;
} else if ($p0.toUpperCase() === 'AUTO' && $p1 > 0) {
$0 = 10000 + $p1;
}
return $0;
}
RMap.CS.RCrsId.prototype = {
crsCode: null,
crsCodeAthority: null,
crsCodeNumber: 0,
crsName: null,
crsUniqueId: 0
}
RMap.CS.RCsView = function (viewCs) {
this.$2 = viewCs;
this.setEnvelopeView(viewCs.get_validArea());
}
RMap.CS.RCsView.prototype = {
get_coordinateSystem: function () {
return this.$2;
},
get_center: function () {
return this.$0;
},
get_centerX: function () {
return this.$0.x;
},
get_centerY: function () {
return this.$0.y;
},
get_scaleInMeters: function () {
return this.$1;
},
get_width: function () {
return this.$3;
},
$0: null,
$1: 0,
$2: null,
$3: 0,
$4: 0,
setCenterView: function (centerX, centerY, scaleInMeters) {
if (isNaN(centerX) || isNaN(centerY) || isNaN(scaleInMeters)) {
this.setEnvelopeView(this.$2.get_validArea());
return;
}
this.$0 = new RMap.CS.RCoordinate2D(centerX, centerY);
if (scaleInMeters < RMap.CS.RCsView.$5) {
scaleInMeters = RMap.CS.RCsView.$5;
}
this.$1 = scaleInMeters;
var $0 = this.$2.measureUnitsInMeters(this.$0);
this.$3 = this.$1 / $0.x;
this.$4 = this.$3;
if (this.$2.get_crsType() === 2) {
this.$4 *= $0.x / $0.y;
}
},
setEnvelopeView: function (extent) {
var $0 = (extent.lowerRight.x + extent.upperLeft.x) / 2;
var $1 = (extent.upperLeft.y + extent.lowerRight.y) / 2;
var $2 = this.$2.measureUnitsInMeters(new RMap.CS.RCoordinate2D($0, $1));
var $3 = (extent.lowerRight.x - extent.upperLeft.x) * $2.x;
this.setCenterView($0, $1, $3);
},
setView: function (view) {
var $0 = this.$2.transformCsView(view);
this.setCenterView($0.$0.x, $0.$0.y, $0.$1);
},
panZoom: function (displayWidth, displayHeight, panX, panY, zoomFactor) {
var $0 = this.$0.x + this.get_width() * (panX / displayWidth);
var $1 = this.$0.y - this.getHeight(displayWidth, displayHeight) * (panY / displayHeight);
var $2 = this.$2.measureUnitsInMeters(this.$0);
var $3 = this.$2.measureUnitsInMeters(new RMap.CS.RCoordinate2D($0, $1));
var $4 = zoomFactor * this.$1 * $3.x / $2.x;
this.setCenterView($0, $1, $4);
},
getPixelWidthInMeters: function (displayWidth) {
return this.$1 / displayWidth;
},
getEnvelope: function (displayWidth, displayHeight, bufferInPercent) {
var $0 = 1 + bufferInPercent / 100;
var $1 = 0.5 * this.get_width() * $0;
var $2 = 0.5 * this.getHeight(displayWidth, displayHeight) * $0;
var $3 = new RMap.CS.RCoordinate2D(this.$0.x - $1, this.$0.y + $2);
var $4 = new RMap.CS.RCoordinate2D(this.$0.x + $1, this.$0.y - $2);
return new RMap.CS.REnvelope($3, $4);
},
getHeight: function (displayWidth, displayHeight) {
return this.$4 * (displayHeight / displayWidth);
},
copy: function () {
var $0 = new RMap.CS.RCsView(this.$2);
$0.setCenterView(this.$0.x, this.$0.y, this.$1);
return $0;
}
}
RMap.CS.RDisplayCoordinate = function (x, y) {
this.x = x;
this.y = y;
}
RMap.CS.RDisplayCoordinate.prototype = {
x: 0,
y: 0
}
RMap.CS.REnvelope = function (upperLeft, lowerRight) {
this.upperLeft = upperLeft;
this.lowerRight = lowerRight;
}
RMap.CS.REnvelope.createEmpty = function () {
return new RMap.CS.REnvelope(new RMap.CS.RCoordinate2D(0, 0), new RMap.CS.RCoordinate2D(0, 0));
}
RMap.CS.REnvelope.prototype = {
get_width: function () {
return (this.lowerRight.x - this.upperLeft.x);
},
get_height: function () {
return (this.upperLeft.y - this.lowerRight.y);
},
upperLeft: null,
lowerRight: null,
union: function (target) {
if (!target) {
return;
}
target.upperLeft.x = Math.min(target.upperLeft.x, this.upperLeft.x);
target.upperLeft.y = Math.max(target.upperLeft.y, this.upperLeft.y);
target.lowerRight.x = Math.max(target.lowerRight.x, this.lowerRight.x);
target.lowerRight.y = Math.min(target.lowerRight.y, this.lowerRight.y);
},
containsPoint: function (point) {
return (point.x <= this.lowerRight.x && point.x >= this.upperLeft.x && point.y >= this.lowerRight.y && point.y <= this.upperLeft.y);
},
containsEnvelope: function (envelope) {
return (this.containsPoint(envelope.upperLeft) && this.containsPoint(envelope.lowerRight));
},
intersects: function (envelope) {
var $0 = false;
if (this.$0(this.upperLeft.x, envelope.upperLeft.x, envelope.lowerRight.x) || this.$0(this.lowerRight.x, envelope.upperLeft.x, envelope.lowerRight.x)) {
$0 = true;
} else if (this.$0(envelope.upperLeft.x, this.upperLeft.x, this.lowerRight.x) || this.$0(envelope.lowerRight.x, this.upperLeft.x, this.lowerRight.x)) {
$0 = true;
}
if ($0) {
var $1 = false;
if (this.$0(this.lowerRight.y, envelope.lowerRight.y, envelope.upperLeft.y) || this.$0(this.upperLeft.y, envelope.lowerRight.y, envelope.upperLeft.y)) {
$1 = true;
} else if (this.$0(envelope.lowerRight.y, this.lowerRight.y, this.upperLeft.y) || this.$0(envelope.upperLeft.y, this.lowerRight.y, this.upperLeft.y)) {
$1 = true;
}
if ($1) {
return true;
}
}
return false;
},
copy: function () {
var $0 = RMap.CS.REnvelope.createEmpty();
$0.upperLeft.x = this.upperLeft.x;
$0.upperLeft.y = this.upperLeft.y;
$0.lowerRight.x = this.lowerRight.x;
$0.lowerRight.y = this.lowerRight.y;
return $0;
},
$0: function ($p0, $p1, $p2) {
return ($p0 >= $p1 && $p0 <= $p2);
}
}
RMap.CS.RGeographicCoordinateSystem = function (crsId, validAreaWgs84, verticalUnit, axisInfo, datum) {
RMap.CS.RGeographicCoordinateSystem.constructBase(this, [
crsId,
validAreaWgs84,
RMap.CS.RUnit.createAngularUnit(2),
verticalUnit,
axisInfo
]);
this.datum = datum;
}
RMap.CS.RGeographicCoordinateSystem.prototype = {
get_crsType: function () {
return 2;
},
datum: null,
computeGeoidHeight: false,
transformToWgs84: function ($p0, $p1) {
RMap.CS.RGeodeticDatumTransform.geographicToGeographicWgs84(this.datum, $p0, $p1, this.computeGeoidHeight);
},
transformFromWgs84: function ($p0, $p1) {
RMap.CS.RGeodeticDatumTransform.geographicWgs84ToGeographic(this.datum, $p0, $p1, this.computeGeoidHeight);
}
}
RMap.CS.RGoogleBingProjection = function () {
RMap.CS.RGoogleBingProjection.constructBase(this);
}
RMap.CS.RGoogleBingProjection.prototype = {
forward: function (geographic, projected) {
projected.x = geographic.x * 20037508.34 / 180;
projected.y = Math.log(Math.tan((90 + geographic.y) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;
projected.z = geographic.z;
},
inverse: function (projected, geographic) {
geographic.x = (projected.x / 20037508.34) * 180;
geographic.y = (projected.y / 20037508.34) * 180;
geographic.y = 180 / Math.PI * (2 * Math.atan(Math.exp(geographic.y * Math.PI / 180)) - Math.PI / 2);
geographic.z = projected.z;
}
}
RMap.CS.RProjectedCoordinateSystem = function (crsId, validAreaWgs84, units, verticalUnits, axisInfo, datum, projection) {
RMap.CS.RProjectedCoordinateSystem.constructBase(this, [
crsId,
validAreaWgs84,
units,
verticalUnits,
axisInfo
]);
this.datum = datum;
this.projection = projection;
}
RMap.CS.RProjectedCoordinateSystem.prototype = {
get_crsType: function () {
return 1;
},
projection: null,
datum: null,
computeGeoidHeight: false,
transformToWgs84: function ($p0, $p1) {
var $0 = new RMap.CS.RCoordinate3D($p0.x, $p0.y, $p0.z);
this.projection.inverse($p0, $0);
RMap.CS.RGeodeticDatumTransform.geographicToGeographicWgs84(this.datum, $0, $p1, this.computeGeoidHeight);
},
transformFromWgs84: function ($p0, $p1) {
var $0 = new RMap.CS.RCoordinate3D($p0.x, $p0.y, $p0.z);
RMap.CS.RGeodeticDatumTransform.geographicWgs84ToGeographic(this.datum, $p0, $0, this.computeGeoidHeight);
this.projection.forward($0, $p1);
}
}
RMap.CS.RUnit = function (type, name, abbreviation, conversionFactor) {
if (type !== 1 && type !== 2) {
type = 1;
}
this.type = type;
if (type === 1) {
this.baseUnit = 'meter';
} else {
this.baseUnit = 'radian';
}
this.name = name;
this.abbreviation = abbreviation;
this.conversionFactor = conversionFactor;
}
RMap.CS.RUnit.createLinearUnit = function (predefinedUnit) {
switch (predefinedUnit) {
case 20:
return new RMap.CS.RUnit(1, 'meter', 'm', 1);
case 21:
return new RMap.CS.RUnit(1, 'kilometer', 'km', 1000);
case 22:
return new RMap.CS.RUnit(1, 'mile', 'mi', 1609.344);
case 23:
return new RMap.CS.RUnit(1, 'nautical mile', 'NM', 1852);
case 24:
return new RMap.CS.RUnit(1, 'foot', 'ft', 0.3048);
case 25:
return new RMap.CS.RUnit(1, 'US survey foot', 'ftUS', 0.304800609601219);
case 26:
return new RMap.CS.RUnit(1, 'Clarke\'s foot', 'ftCla', 0.3047972654);
case 2:
return new RMap.CS.RUnit(1, 'degree', 'deg', 111321);
}
return null;
}
RMap.CS.RUnit.createAngularUnit = function (predefinedUnit) {
switch (predefinedUnit) {
case 1:
return new RMap.CS.RUnit(2, 'radian', 'rad', 1);
case 2:
return new RMap.CS.RUnit(2, 'degree', 'deg', Math.PI / 180);
case 3:
return new RMap.CS.RUnit(2, 'arc-second', 'sec', Math.PI / (180 * 3600));
}
return null;
}
RMap.CS.RUnit.prototype = {
name: null,
baseUnit: null,
abbreviation: null,
type: 0,
conversionFactor: 0
}
RMap.CS.RUnknownCoordinateSystem = function (validArea, units, verticalUnit, axisInfo) {
RMap.CS.RUnknownCoordinateSystem.constructBase(this, [
null,
validArea,
units,
verticalUnit,
axisInfo
]);
}
RMap.CS.RUnknownCoordinateSystem.prototype = {
get_crsType: function () {
return 3;
},
transformToWgs84: function ($p0, $p1) {
$p1.x = $p0.x;
$p1.y = $p0.y;
$p1.z = $p0.z;
},
transformFromWgs84: function ($p0, $p1) {
$p1.x = $p0.x;
$p1.y = $p0.y;
$p1.z = $p0.z;
},
calculateDistanceInMeters: function (from, to) {
var $0 = to.x - from.x;
var $1 = to.y - from.y;
var $2 = Math.sqrt($0 * $0 + $1 * $1);
return $2 * this.units.conversionFactor;
},
measureUnitsInMeters: function (world) {
return new RMap.CS.RCoordinate3D(this.units.conversionFactor, this.units.conversionFactor, this.verticalUnit.conversionFactor);
}
}
RMap.CS.SupportClass = function () {
}
RMap.CS.SupportClass.degreesToRadians = function (angleInDegrees) {
var $0 = (2 * Math.PI) / 360;
return angleInDegrees * $0;
}
RMap.CS.SupportClass.radiansToDegrees = function (angleInRadians) {
var $0 = 360 / (2 * Math.PI);
return angleInRadians * $0;
}
RMap.CS.REllipsoid.createClass('RMap.CS.REllipsoid');
RMap.CS.RGeodeticDatum.createClass('RMap.CS.RGeodeticDatum');
RMap.CS.RGeodeticDatumTransform.createClass('RMap.CS.RGeodeticDatumTransform');
RMap.CS.RToWgs84Parameters.createClass('RMap.CS.RToWgs84Parameters');
RMap.CS.RProjection.createClass('RMap.CS.RProjection');
RMap.CS.REqudistantCylindricalProjection.createClass('RMap.CS.REqudistantCylindricalProjection', RMap.CS.RProjection);
RMap.CS.RGoogleMercatorProjection.createClass('RMap.CS.RGoogleMercatorProjection', RMap.CS.RProjection);
RMap.CS.RMercator1SpProjection.createClass('RMap.CS.RMercator1SpProjection', RMap.CS.RProjection);
RMap.CS.RTransverseMercatorProjection.createClass('RMap.CS.RTransverseMercatorProjection', RMap.CS.RProjection);
RMap.CS.RAxisInfo.createClass('RMap.CS.RAxisInfo');
RMap.CS.RCoordinate2D.createClass('RMap.CS.RCoordinate2D');
RMap.CS.RCoordinate3D.createClass('RMap.CS.RCoordinate3D', RMap.CS.RCoordinate2D);
RMap.CS.RCoordinateSystem.createClass('RMap.CS.RCoordinateSystem');
RMap.CS.RCoordinateSystemFactory.createClass('RMap.CS.RCoordinateSystemFactory');
RMap.CS.RCrsId.createClass('RMap.CS.RCrsId');
RMap.CS.RCsView.createClass('RMap.CS.RCsView');
RMap.CS.RDisplayCoordinate.createClass('RMap.CS.RDisplayCoordinate');
RMap.CS.REnvelope.createClass('RMap.CS.REnvelope');
RMap.CS.RGeographicCoordinateSystem.createClass('RMap.CS.RGeographicCoordinateSystem', RMap.CS.RCoordinateSystem);
RMap.CS.RGoogleBingProjection.createClass('RMap.CS.RGoogleBingProjection', RMap.CS.RProjection);
RMap.CS.RProjectedCoordinateSystem.createClass('RMap.CS.RProjectedCoordinateSystem', RMap.CS.RCoordinateSystem);
RMap.CS.RUnit.createClass('RMap.CS.RUnit');
RMap.CS.RUnknownCoordinateSystem.createClass('RMap.CS.RUnknownCoordinateSystem', RMap.CS.RCoordinateSystem);
RMap.CS.SupportClass.createClass('RMap.CS.SupportClass');
RMap.CS.RGeodeticDatumTransform.$0 = new RMap.CS.RGeodeticDatum(new RMap.CS.REllipsoid(6378137, 298.257223563), 0, null);
RMap.CS.RGeodeticDatumTransform.$2 = 1.0026;
RMap.CS.RGeodeticDatumTransform.$3 = 0.38268343236509;
RMap.CS.RTransverseMercatorProjection.$F = 1;
RMap.CS.RTransverseMercatorProjection.$10 = 0.25;
RMap.CS.RTransverseMercatorProjection.$11 = 0.046875;
RMap.CS.RTransverseMercatorProjection.$12 = 0.01953125;
RMap.CS.RTransverseMercatorProjection.$13 = 0.01068115234375;
RMap.CS.RTransverseMercatorProjection.$14 = 0.75;
RMap.CS.RTransverseMercatorProjection.$15 = 0.46875;
RMap.CS.RTransverseMercatorProjection.$16 = 0.0130208333333333;
RMap.CS.RTransverseMercatorProjection.$17 = 0.00712076822916667;
RMap.CS.RTransverseMercatorProjection.$18 = 0.364583333333333;
RMap.CS.RTransverseMercatorProjection.$19 = 0.00569661458333333;
RMap.CS.RTransverseMercatorProjection.$1A = 0.3076171875;
RMap.CS.RTransverseMercatorProjection.$1B = 1;
RMap.CS.RTransverseMercatorProjection.$1C = 0.5;
RMap.CS.RTransverseMercatorProjection.$1D = 0.166666666666667;
RMap.CS.RTransverseMercatorProjection.$1E = 0.0833333333333333;
RMap.CS.RTransverseMercatorProjection.$1F = 0.05;
RMap.CS.RTransverseMercatorProjection.$20 = 0.0333333333333333;
RMap.CS.RTransverseMercatorProjection.$21 = 0.0238095238095238;
RMap.CS.RTransverseMercatorProjection.$22 = 0.0178571428571429;
RMap.CS.RTransverseMercatorProjection.$23 = 1e-11;
RMap.CS.RTransverseMercatorProjection.$24 = 0.000001;
RMap.CS.RTransverseMercatorProjection.$25 = 15;
RMap.CS.RAxisInfo.easT_NORTH = 1;
RMap.CS.RAxisInfo.nortH_EAST = 2;
RMap.CS.RAxisInfo.nortH_WEST = 3;
RMap.CS.RAxisInfo.wesT_NORTH = 4;
RMap.CS.RAxisInfo.wesT_SOUTH = 5;
RMap.CS.RAxisInfo.soutH_WEST = 6;
RMap.CS.RCoordinateSystem.crS_TYPE_PROJECTED = 1;
RMap.CS.RCoordinateSystem.crS_TYPE_GEOGRAPHIC = 2;
RMap.CS.RCoordinateSystem.crS_TYPE_UNKNOWN = 3;
RMap.CS.RCsView.$5 = 1e-8;
RMap.CS.RUnit.typE_LINEAR = 1;
RMap.CS.RUnit.typE_ANGULAR = 2;
RMap.CS.RUnit.RADIAN = 1;
RMap.CS.RUnit.DEGREE = 2;
RMap.CS.RUnit.arC_SECOND = 3;
RMap.CS.RUnit.METER = 20;
RMap.CS.RUnit.KILOMETER = 21;
RMap.CS.RUnit.MILE = 22;
RMap.CS.RUnit.NAUTICALMILE = 23;
RMap.CS.RUnit.FOOT = 24;
RMap.CS.RUnit.USSURVEYFOOT = 25;
RMap.CS.RUnit.CLARKESFOOT = 26;
// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------
Type.createNamespace('RMap');
RMap.EditType = function () {
};
RMap.EditType.prototype = {
None: 0,
AddMarker: 1,
AddPolyline: 2,
AddPolygon: 4,
AddElement: 7,
EditPosition: 8,
EditGeometry: 16,
ChangeIcon: 32,
ChangeIconAnchor: 64,
ChangeInfoWindowAnchor: 128,
EditMarker: 224,
ChangeStrokeColor: 256,
ChangeStrokeType: 512,
ChangeStrokeWidth: 1024,
ChangeStrokeOpacity: 2048,
ChangeFillColor: 4096,
ChangeFillType: 8192,
ChangeFillOpacity: 16384,
EditStyle: 32736,
RemoveElement: 32768,
EditAttributes: 65536,
Full: 131071
}
RMap.EditType.createEnum('RMap.EditType', true);
RMap.MouseAction = function () {
};
RMap.MouseAction.prototype = {
Up: 0,
Down: 1,
Move: 2,
Click: 4,
DblClick: 8,
ContextMenu: 16,
Wheel: 32,
Edit: 64,
Dragging: 3
}
RMap.MouseAction.createEnum('RMap.MouseAction', true);
RMap.RoutingAction = function () {
};
RMap.RoutingAction.prototype = {
Changed: 1,
GeocodingFailed: 99,
NoRoad: 100
}
RMap.RoutingAction.createEnum('RMap.RoutingAction', false);
RMap.CollectionChangedAction = function () {
};
RMap.CollectionChangedAction.prototype = {
Add: 1,
Remove: 2,
Clear: 3,
Refresh: 4,
Schema: 5,
Filter: 16,
Sort: 17,
Update: 32,
StyleUpdate: 33
}
RMap.CollectionChangedAction.createEnum('RMap.CollectionChangedAction', false);
RMap.IOAction = function () {
};
RMap.IOAction.prototype = {
Unknown: 0,
Loading: 1,
Loaded: 2,
LoadError: 3,
Saving: 4,
Saved: 5,
Abort: 6,
SaveError: 7
}
RMap.IOAction.createEnum('RMap.IOAction', false);
RMap.PanelAction = function () {
};
RMap.PanelAction.prototype = {
Load: 1,
Focus: 2,
Edit: 4,
Save: 5,
Dispose: 256
}
RMap.PanelAction.createEnum('RMap.PanelAction', false);
RMap.PropertyInfo = function () {
};
RMap.PropertyInfo.prototype = {
Default: 0,
Nullable: 1,
Hidden: 2,
Cachable: 4,
Identifier: 16,
Timestamp: 32,
Sortable: 64
}
RMap.PropertyInfo.createEnum('RMap.PropertyInfo', true);
RMap.PropertyFormat = function () {
};
RMap.PropertyFormat.prototype = {
Default: 0,
Integer: 1,
Double: 2,
Longstring: 3,
Html: 4
}
RMap.PropertyFormat.createEnum('RMap.PropertyFormat', false);
RMap._ClipCode = function () {
};
RMap._ClipCode.prototype = {
In: 0,
$0: 1,
$1: 2,
$2: 4,
$3: 8
}
RMap._ClipCode.createEnum('RMap._ClipCode', false);
RMap.IMapControl = function () {
};
RMap.IMapControl.createInterface('RMap.IMapControl');
RMap.OrderPosition = function () {
};
RMap.OrderPosition.prototype = {
Front: 1,
Back: 2,
Forward: 3,
Backward: 4
}
RMap.OrderPosition.createEnum('RMap.OrderPosition', false);
RMap._LayerState = function () {
};
RMap._LayerState.prototype = {
$0: 0,
$1: 2
}
RMap._LayerState.createEnum('RMap._LayerState', false);
RMap.StateChangedAction = function () {
};
RMap.StateChangedAction.prototype = {
Hide: 1,
Show: 2,
Selected: 3,
EditStart: 4,
EditEnd: 5,
Style: 8,
Disposed: 256
}
RMap.StateChangedAction.createEnum('RMap.StateChangedAction', false);
RMap.DrawingAction = function () {
};
RMap.DrawingAction.prototype = {
Select: 3,
GeometryEdit: 9,
DblClick: 11,
RightClick: 12,
MouseOver: 13,
MouseOut: 14
}
RMap.DrawingAction.createEnum('RMap.DrawingAction', false);
RMap.$create_Coordinate = function (x, y) {
var $o = {
};
$o.x = x;
$o.y = y;
return $o;
}
RMap.$create_Vector = function (dx, dy) {
var $o = {
};
$o.dx = dx;
$o.dy = dy;
return $o;
}
RMap.GeometryType = function () {
};
RMap.GeometryType.prototype = {
Point: 1,
Polyline: 2,
Polygon: 3,
Polybezier: 4
}
RMap.GeometryType.createEnum('RMap.GeometryType', false);
RMap._MapState = function () {
};
RMap._MapState.prototype = {
$0: 0,
$1: 1,
$2: 2,
$3: 4
}
RMap._MapState.createEnum('RMap._MapState', false);
RMap.StrokeType = function () {
};
RMap.StrokeType.prototype = {
Solid: 0,
Dotted: 1,
Dashed: 2,
Longdashed: 4,
Dashdotted: 8,
Longdashdotted: 16
}
RMap.StrokeType.createEnum('RMap.StrokeType', false);
RMap.FillType = function () {
};
RMap.FillType.prototype = {
Empty: 0,
Solid: 1,
Verticalpattern: 2,
Horizontalpattern: 4,
Fallingpattern: 8,
Raisingpattern: 16,
Rectangularpattern: 32,
Diagonalpattern: 64
}
RMap.FillType.createEnum('RMap.FillType', false);
RMap.$create__Cell = function (column, row) {
var $o = {
};
$o.$0 = column;
$o.$1 = row;
return $o;
}
RMap._ViewChangeAction = function () {
};
RMap._ViewChangeAction.prototype = {
$0: 0,
$1: 1,
$2: 2,
$3: 4,
$4: 8,
$5: 64
}
RMap._ViewChangeAction.createEnum('RMap._ViewChangeAction', true);
RMap._Clipping = function (bbox, cfg) {
this.$1 = bbox;
this.$2 = (cfg) ? cfg : {
};
this.$8 = Delegate.create(this, this.$A);
}
RMap._Clipping.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: function ($p0) {
this.$0 = $p0;
var $0 = '';
this.$3 = RMap._DomHelper.$3(null);
this.$3.className = 'Clipping';
this.$4 = RMap._DomHelper.$3(this.$3);
this.$4.style.lineHeight = '0px';
this.$4.innerHTML = '<P></P>';
this.$5 = RMap._DomHelper.$3(this.$3);
this.$5.style.lineHeight = '0px';
this.$5.innerHTML = '<P></P>';
this.$6 = RMap._DomHelper.$3(this.$3);
this.$6.style.lineHeight = '0px';
this.$6.innerHTML = '<P></P>';
this.$7 = RMap._DomHelper.$3(this.$3);
this.$7.style.lineHeight = '0px';
this.$7.innerHTML = '<P></P>';
if (this.$2['opacity']) {
this.$B(this.$4, {
filter: 'alpha(opacity=' + this.$2['opacity'] + ')',
opacity: this.$2['opacity'] / 100,
MozOpacity: this.$2['opacity'] / 100
});
this.$B(this.$5, {
filter: 'alpha(opacity=' + this.$2['opacity'] + ')',
opacity: this.$2['opacity'] / 100,
MozOpacity: this.$2['opacity'] / 100
});
this.$B(this.$6, {
filter: 'alpha(opacity=' + this.$2['opacity'] + ')',
opacity: this.$2['opacity'] / 100,
MozOpacity: this.$2['opacity'] / 100
});
this.$B(this.$7, {
filter: 'alpha(opacity=' + this.$2['opacity'] + ')',
opacity: this.$2['opacity'] / 100,
MozOpacity: this.$2['opacity'] / 100
});
}
if (this.$2['color']) {
this.$B(this.$4, {
backgroundColor: this.$2['color']
});
this.$B(this.$5, {
backgroundColor: this.$2['color']
});
this.$B(this.$6, {
backgroundColor: this.$2['color']
});
this.$B(this.$7, {
backgroundColor: this.$2['color']
});
}
this.$C(0);
this.$0.$4.insertBefore(this.$3, this.$0.$7);
this.$0.add_$26(this.$8);
},
$A: function ($p0, $p1) {
this.$C(0);
},
$B: function ($p0, $p1) {
var $dict1 = $p1;
for (var $key2 in $dict1) {
var $0 = {
key: $key2,
value: $dict1[$key2]
};
$p0.style[$0.key] = $0.value;
}
},
$C: function ($p0) {
var $0 = this.$0.$39().$11().width;
var $1 = this.$0.$39().$11().height;
this.$3.style.width = $0 + 'px';
this.$3.style.height = $1 + 'px';
var $2 = ($p0 > 0) ? this.$0.$39().$19(RMap.$create_Coordinate(this.$1.minX, this.$1.minY), $p0)  : this.$0.$39().$18(RMap.$create_Coordinate(this.$1.minX, this.$1.minY));
var $3 = ($p0 > 0) ? this.$0.$39().$19(RMap.$create_Coordinate(this.$1.maxX, this.$1.maxY), $p0)  : this.$0.$39().$18(RMap.$create_Coordinate(this.$1.maxX, this.$1.maxY));
$2.left = Math.min(Math.max($2.left, 0), $0);
$2.top = Math.max(Math.min($2.top, $1), 0);
$3.left = Math.max(Math.min($3.left, $0), 0);
$3.top = Math.min(Math.max($3.top, 0), $1);
this.$B(this.$4, {
left: '0px',
width: $2.left + 'px',
top: '0px',
height: $1 + 'px'
});
this.$B(this.$7, {
left: $2.left + 'px',
top: $2.top + 'px',
width: ($3.left - $2.left) + 'px',
height: ($1 - $2.top) + 'px'
});
this.$B(this.$5, {
left: $3.left + 'px',
width: ($0 - $3.left) + 'px',
top: '0px',
height: $1 + 'px'
});
this.$B(this.$6, {
left: $2.left + 'px',
top: '0px',
width: ($3.left - $2.left) + 'px',
height: $3.top + 'px'
});
}
}
RMap.Command = function (title, callback) {
this.$0 = title;
this.$1 = callback;
}
RMap.Command.prototype = {
$0: null,
$1: null,
invoke: function () {
this.$1.invoke();
}
}
RMap._ContexMenu = function () {
}
RMap._ContexMenu.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: null,
$B: function ($p0) {
this.$0 = $p0;
this.$5 = Delegate.create(this, this.$E);
this.$6 = Delegate.create(null, RMap._DomHelper.$B);
this.$7 = Delegate.create(null, RMap._DomHelper.$B);
this.$8 = Delegate.create(null, RMap._DomHelper.$B);
this.$9 = Delegate.create(this, this.$10);
this.$A = Delegate.create(this, this.$F);
this.$3 = document.createElement('div');
this.$3.className = 'ContexMenu';
this.$3.style.zIndex = 32767;
this.$3.style.position = 'absolute';
this.$3.attachEvent('onclick', this.$5);
this.$3.attachEvent('onmousedown', this.$6);
this.$3.attachEvent('ondblclick', this.$7);
this.$3.attachEvent('onmousewheel', this.$8);
this.$3.attachEvent('onmouseenter', this.$9);
this.$3.attachEvent('onmouseleave', this.$A);
this.$4 = this.$3;
if (!ScriptFX.Application.current.get_isIE()) {
this.$4 = document.createElement('input');
this.$4.style.position = 'absolute';
this.$4.style.visibility = 'hidden';
this.$4.style.top = '-1000px';
this.$3.appendChild(this.$4);
}
},
$C: function () {
this.$3.detachEvent('onclick', this.$5);
this.$3.detachEvent('onmousedown', this.$6);
this.$3.detachEvent('ondblclick', this.$7);
this.$3.detachEvent('onmousewheel', this.$8);
this.$3.detachEvent('onmouseenter', this.$9);
this.$3.detachEvent('onmouseleave', this.$A);
this.$5 = null;
this.$6 = null;
this.$7 = null;
this.$8 = null;
this.$9 = null;
this.$A = null;
},
$D: function ($p0, $p1) {
if (isNullOrUndefined($p1) || !$p1.length) {
return;
}
this.$2 = $p0;
this.$1 = $p1;
this.$3.innerHTML = '';
this.$0.$4.appendChild(this.$3);
this.$11();
this.$12();
this.$3.appendChild(this.$4);
this.$4.attachEvent('onblur', this.$5);
this.$4.focus();
},
$E: function () {
this.$4.detachEvent('onblur', this.$5);
if (this.$3.parentNode) {
this.$3.parentNode.removeChild(this.$3);
}
},
$F: function () {
this.$4.attachEvent('onblur', this.$5);
},
$10: function () {
this.$4.focus();
this.$4.detachEvent('onblur', this.$5);
},
$11: function () {
var $0 = 0;
for (var $1 = 0; $1 < this.$1.length; ++$1) {
if (!this.$1[$1]) {
var $2 = document.createElement('hr');
$2.className = 'Separator';
this.$3.appendChild($2);
} else {
var $3 = document.createElement('span');
$3.className = 'Item';
$3.style.whiteSpace = 'nowrap';
$3.innerHTML = this.$1[$1].$0 + '<br/>';
$3.attachEvent('onclick', Delegate.create(this.$1[$1], this.$1[$1].invoke));
this.$3.appendChild($3);
$0 = Math.max($0, $3.offsetWidth);
}
}
this.$3.style.width = $0 + 'px';
},
$12: function () {
var $0 = this.$0.$39().$11();
var $1 = this.$2.left;
var $2 = this.$2.top;
if ($1 + this.$3.offsetWidth > $0.width) {
$1 = $1 - this.$3.offsetWidth;
}
if ($2 + this.$3.offsetHeight > $0.height) {
$2 = $2 - ($2 + this.$3.offsetHeight - $0.height);
}
this.$3.style.left = $1 + 'px';
this.$3.style.top = $2 + 'px';
}
}
RMap._ExternalMapControl = function (dict) {
this.$0 = (dict) ? dict['id'] : null;
this.$2 = dict['cfg'];
this.$3 = dict['url'];
}
RMap._ExternalMapControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
attach: function ($p0) {
this.$1 = $p0;
this.$4 = document.createElement('div');
this.$4.style.position = 'absolute';
this.$4.className = 'ExternalMapControl';
this.$4.attachEvent('onclick', Delegate.create(this, this.$6));
this.$5 = document.createElement('img');
this.$5.src = RMap.MapApplication.resourcesUrl + 'Controls/fullscreen.gif';
this.$5.style.height = '12px';
this.$5.style.width = '15px';
this.$4.appendChild(this.$5);
this.$1.getControlsSurface().appendChild(this.$4);
return this.$4;
},
$6: function () {
var $0 = this.$2;
if (!this.$2 && this.$1) {
$0 = this.$1.$1;
}
RMap.MapApplication.openExternalMap(this.$3, $0);
},
detach: function () {
this.$1.getControlsSurface().removeChild(this.$4);
},
$7: function () {
}
}
RMap.IndicatorControl = function (dict) {
this.$2 = {
};
this._id = (dict) ? dict['id'] : null;
this.$1 = (dict && dict['el']) ? dict['el'] : null;
if (!this.$1) {
this.$1 = document.createElement('img');
(this.$1).src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.indImg;
this.$1.style.position = 'absolute';
this.$1.style.display = 'none';
this.$1.attachEvent('onclick', Delegate.create(this, this.stop));
}
}
RMap.IndicatorControl.prototype = {
_id: null,
$0: null,
$1: null,
attach: function (map) {
this.$0 = map;
this.$0.getControlsSurface().appendChild(this.$1);
this.$0.setBusyIndicator(this);
return this.$1;
},
detach: function () {
this.$0.getControlsSurface().removeChild(this.$1);
},
notifyBusy: function (key, ok) {
if (ok) {
this.$2[key] = true;
this.start();
} else {
delete this.$2[key];
if (Object.getKeyCount(this.$2) < 1) {
window.setTimeout(Delegate.create(this, this.stop), 0);
}
}
},
start: function () {
this.$1.style.display = '';
},
stop: function () {
this.$1.style.display = 'none';
},
dispose: function () {
}
}
RMap.MessageControl = function (dict) {
this._id = (dict) ? dict['id'] : null;
}
RMap.MessageControl.prototype = {
_id: null,
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
attach: function (map) {
this.$0 = map;
this.$1 = document.createElement('div');
this.$1.style.position = 'absolute';
this.$1.style.background = '#ffaa33';
this.$1.style.border = '#aa5500 1px solid';
this.$1.style.padding = '5px';
this.$1.style.cursor = 'default';
this.$1.style.textAlign = 'center';
this.$2 = document.createElement('div');
this.$2.style.cursor = 'default';
this.$2.style.textAlign = 'center';
this.$1.appendChild(this.$2);
this.$3 = document.createElement('input');
this.$3.type = 'button';
this.$3.value = 'OK';
this.$3.style.width = '80px';
this.$3.style.cursor = RMap.Browser.crsPointer;
this.$1.appendChild(this.$3);
this.$4 = Delegate.create(this, this.onClick);
this.$3.attachEvent('onmousedown', this.$4);
this.hide();
this.$0.getControlsSurface().appendChild(this.$1);
return this.$1;
},
detach: function () {
this.$0.getControlsSurface().removeChild(this.$1);
},
show: function (message) {
this.$1.style.display = '';
this.$2.innerHTML = message + '<br>&#160;';
},
hide: function () {
this.$1.style.display = 'none';
},
onClick: function () {
RMap._DomHelper.$B();
this.hide();
},
dispose: function () {
this.$1.removeChild(this.$2);
this.$2 = null;
this.$3.detachEvent('onclick', this.$4);
this.$4 = null;
this.$1.removeChild(this.$3);
this.$3 = null;
this.$1 = null;
this.$0 = null;
}
}
RMap._ZoomControl = function (dict) {
this.$0 = (dict) ? dict['id'] : null;
if (dict && dict['scale']) {
this.$5 = dict['scale'];
}
}
RMap._ZoomControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: 1,
attach: function ($p0) {
this.$1 = $p0;
this.$2 = document.createElement('div');
this.$2.style.position = 'absolute';
this.$2.style.height = Math.round(this.$5 * 17) + 'px';
this.$2.style.width = Math.round(this.$5 * 37) + 'px';
var $0 = document.createElement('img');
$0.src = RMap.MapApplication.resourcesUrl + 'Controls/navigation-small.gif';
$0.style.position = 'relative';
$0.style.height = Math.round(this.$5 * 17) + 'px';
$0.style.width = Math.round(this.$5 * 37) + 'px';
this.$2.appendChild($0);
this.$4 = this.$6('ZO', 'zoom out', 0, 0, 17, 17);
this.$3 = this.$6('ZI', 'zoom in', 20, 0, 17, 17);
this.$1.getControlsSurface().appendChild(this.$2);
return this.$2;
},
detach: function () {
this.$1.getControlsSurface().removeChild(this.$2);
},
$6: function ($p0, $p1, $p2, $p3, $p4, $p5) {
var $0 = document.createElement('div');
$0._cmd = $p0;
$0.title = $p1;
var $1 = $0.style;
$1.cursor = RMap.Browser.crsPointer;
$1.position = 'absolute';
$1.backgroundColor = '#ffffff';
$1.filter = 'alpha(opacity=1)';
$1.opacity = '0';
$1.MozOpacity = 0;
$1.width = Math.round(this.$5 * $p4) + 'px';
$1.height = Math.round(this.$5 * $p5) + 'px';
$1.left = Math.round(this.$5 * $p2) + 'px';
$1.top = Math.round(this.$5 * $p3) + 'px';
$0.attachEvent('onclick', Delegate.create(this, this.$7));
$0.attachEvent('ondblclick', Delegate.create(this, this.$7));
$0.attachEvent('onmousedown', Delegate.create(null, RMap._DomHelper.$B));
this.$2.appendChild($0);
return $0;
},
$7: function () {
RMap._DomHelper.$B();
var $0 = window.event.srcElement._cmd;
if (isNullOrUndefined($0)) {
return;
}
var $1 = this.$1.$39().$11();
switch ($0) {
case 'ZI':
this.$1.zoomIn(1);
break;
case 'ZO':
this.$1.zoomOut(1);
break;
}
},
$8: function () {
}
}
RMap._AttributeEditor = function (control) {
this.$5 = new Array(0);
this.$1 = control;
}
RMap._AttributeEditor.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$6: false,
$7: false,
$8: null,
$9: null,
$A: null,
$B: null,
$C: null,
attach: function ($p0) {
this.$0 = $p0;
this.$0.disableKeyboard();
this.$2 = new RMap._Container($p0.getControlsSurface());
this.$2.get_$1().style.visibility = 'hidden';
if (isNullOrUndefined(this.$1)) {
this.$2.get_$1().className = 'EditControl';
}
this.$8 = document.createElement('div');
this.$8.innerHTML = '<hr>';
this.$2.get_$1().appendChild(this.$8);
this.$9 = document.createElement('div');
this.$9.style.overflowY = 'auto';
this.$9.style.overflowX = 'hidden';
this.$2.get_$1().appendChild(this.$9);
this.$A = document.createElement('div');
this.$A.style.textAlign = 'center';
this.$2.get_$1().appendChild(this.$A);
this.$B = document.createElement('input');
this.$B.type = 'button';
this.$B.value = 'OK';
this.$B.attachEvent('onclick', Delegate.create(this, this.$15));
this.$A.appendChild(this.$B);
this.$C = document.createElement('input');
this.$C.type = 'button';
this.$C.value = 'Cancel';
this.$C.attachEvent('onclick', Delegate.create(this, this.$16));
this.$A.appendChild(this.$C);
return this.$2.get_$1();
},
detach: function () {
},
$D: function ($p0) {
this.$E($p0.getFeature());
},
$E: function ($p0) {
if (!($p0.$1.getEditPermissions() & 65536)) {
return;
}
if (!isNullOrUndefined(this.$3)) {
this.$17();
}
this.$3 = $p0;
this.$4 = this.$F(this.$3.properties);
this.$3.$1.add_collectionChangedEvent(Delegate.create(this, this.$13));
this.$10();
window.setTimeout(Delegate.create(this, this.$12), 0);
},
$F: function ($p0) {
return $p0;
},
$10: function () {
var $0 = this.$11(this.$3);
for (var $1 = 0; $1 < $0.length; $1++) {
if (($0[$1].$1 & 2) > 0) {
continue;
}
var $2;
switch ($0[$1].type.get_fullName()) {
case ('Number') :
if (!($0[$1].$2 & 1)) {
$2 = new RMap._NumberFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name), false);
} else {
$2 = new RMap._NumberFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name), true);
}(this.$5).add($2);
break;
case ('Boolean') :
$2 = new RMap._BooleanFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name));
(this.$5).add($2);
break;
case ('String') :
if (!($0[$1].$2 & 3)) {
$2 = new RMap._TextFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name));
} else {
$2 = new RMap._LongTextFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name));
}(this.$5).add($2);
break;
default:
$2 = new RMap._ObjectFieldEditor(this.$9, $0[$1].name, $0[$1].type, this.$3.getProperty($0[$1].name));
(this.$5).add($2);
break;
}
}
},
$11: function ($p0) {
return $p0.getSchema().$9();
},
$12: function () {
if (this.$9.offsetHeight > 200) {
this.$9.style.height = '200px';
}
this.$2.get_$1().style.visibility = 'visible';
},
$13: function ($p0, $p1) {
if (this.$6) {
return;
}
switch ($p1.action) {
case 2:
break;
case 4:
break;
case 32:
break;
}
},
$14: function () {
var $0 = true;
for (var $1 = 0; $1 < this.$5.length; $1++) {
var $2 = this.$3.getSchema().$8(this.$5[$1].$9(), this.$5[$1].$B());
if ($2) {
this.$5[$1].$8();
this.$3.setProperty(this.$5[$1].$9(), this.$5[$1].$B());
} else {
this.$5[$1].$7();
$0 = false;
}
}
this.$6 = true;
if (!isNullOrUndefined(this.$1)) {
this.$1.$56();
} else {
this.$3.update();
}
this.$6 = false;
return $0;
},
$15: function () {
RMap._DomHelper.$B();
var $0 = true;
if (!isNullOrUndefined(this.$3)) {
$0 = this.$14();
}
if ($0) {
this.$19();
}
},
$16: function () {
RMap._DomHelper.$B();
this.$19();
},
$17: function () {
if (!isNullOrUndefined(this.$5)) {
for (var $0 = 0; $0 < this.$5.length; $0++) {
this.$5[$0].$C();
this.$5[$0] = null;
}(this.$5).clear();
}
if (!isNullOrUndefined(this.$3)) {
this.$3.$1.remove_collectionChangedEvent(Delegate.create(this, this.$13));
}
this.$3 = null;
this.$4 = null;
},
$18: function () {
return this.$7;
},
$19: function () {
this.$17();
if (!isNullOrUndefined(this.$2)) {
this.$5 = null;
this.$B.detachEvent('onclick', Delegate.create(this, this.$15));
this.$B.parentNode.removeChild(this.$B);
this.$B = null;
this.$C.detachEvent('onclick', Delegate.create(this, this.$16));
this.$C.parentNode.removeChild(this.$C);
this.$C = null;
this.$8.parentNode.removeChild(this.$8);
this.$8 = null;
this.$9.parentNode.removeChild(this.$9);
this.$9 = null;
this.$A.parentNode.removeChild(this.$A);
this.$A = null;
this.$2.$4();
this.$2 = null;
}
this.$7 = true;
this.$0.enableKeyboard();
}
}
RMap._PropertyEditor = function (container, key, type, value) {
this.$0 = key;
this.$1 = type;
this.$2 = value;
this.$3 = document.createElement('div');
this.$3.style.paddingTop = '2px';
this.$3.style.paddingBottom = '2px';
this.$4 = document.createElement('div');
this.$4.innerHTML = key;
this.$3.appendChild(this.$4);
this.$5 = document.createElement('input');
this.$5.type = 'text';
this.$3.appendChild(this.$5);
container.appendChild(this.$3);
this.$6(value);
}
RMap._PropertyEditor.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: function ($p0) {
this.$5.value = $p0;
if (typeof ($p0) === 'object') {
this.$5.value = '[object]';
}
if (!$p0) {
this.$5.value = '[null]';
}
this.$8();
},
$7: function () {
this.$5.style.background = 'ffaaaa';
},
$8: function () {
this.$5.style.background = '';
},
$9: function () {
return this.$0;
},
$A: function () {
return this.$1;
},
$C: function () {
this.$4.parentNode.removeChild(this.$4);
this.$4 = null;
this.$5.parentNode.removeChild(this.$5);
this.$5 = null;
this.$3.parentNode.removeChild(this.$3);
this.$3 = null;
this.$2 = null;
}
}
RMap._TextFieldEditor = function (container, key, type, value) {
RMap._TextFieldEditor.constructBase(this, [
container,
key,
type,
value
]);
this.$5.style.width = '180px';
}
RMap._TextFieldEditor.prototype = {
$6: function ($p0) {
RMap._TextFieldEditor.callBase(this, '$6', [
$p0
]);
if (!$p0) {
this.$5.value = '';
}
this.$5.style.fontFamily = this.$3.currentStyle.fontFamily.toString();
this.$5.style.fontSize = '10px';
if (ScriptFX.Application.current.get_host().get_name() === 2) {
this.$5.attachEvent('onmousedown', Delegate.create(this, this.$D));
}
},
$B: function () {
var $0;
$0 = this.$5.value;
return $0;
},
$D: function () {
this.$5.focus();
this.$5.select();
}
}
RMap._NumberFieldEditor = function (container, key, type, value, isInteger) {
RMap._NumberFieldEditor.constructBase(this, [
container,
key,
type,
value
]);
this.$D = isInteger;
}
RMap._NumberFieldEditor.prototype = {
$D: false,
$B: function () {
var $0 = Object.parse(this.$5.value);
if (this.$D && Math.round($0) === $0) {
var $1 = Math.round($0);
return $1;
} else {
return $0;
}
}
}
RMap._BooleanFieldEditor = function (container, key, type, value) {
RMap._BooleanFieldEditor.constructBase(this, [
container,
key,
type,
value
]);
}
RMap._BooleanFieldEditor.prototype = {
$D: null,
$6: function ($p0) {
this.$5.style.display = 'none';
this.$D = document.createElement('input');
this.$D.type = 'checkbox';
this.$3.appendChild(this.$D);
this.$D.checked = $p0;
this.$8();
},
$B: function () {
var $0 = this.$D.checked;
return $0;
},
$7: function () {
this.$D.style.background = 'ffaaaa';
},
$8: function () {
this.$D.style.background = '';
},
$C: function () {
this.$3.removeChild(this.$D);
this.$D = null;
RMap._BooleanFieldEditor.callBase(this, '$C');
}
}
RMap._LongTextFieldEditor = function (container, key, type, value) {
RMap._LongTextFieldEditor.constructBase(this, [
container,
key,
type,
value
]);
}
RMap._LongTextFieldEditor.prototype = {
$D: null,
$6: function ($p0) {
this.$5.style.display = 'none';
this.$D = document.createElement('textarea');
this.$D.style.width = '180px';
if (!$p0) {
this.$D.value = '';
} else {
this.$D.value = $p0;
}
this.$D.style.height = '50px';
this.$D.style.fontSize = this.$3.currentStyle.fontSize.toString();
this.$D.style.fontSize = '10px';
this.$3.appendChild(this.$D);
this.$10();
if (ScriptFX.Application.current.get_host().get_name() === 2) {
this.$D.attachEvent('onmousedown', Delegate.create(this, this.$E));
}
},
$E: function () {
this.$D.focus();
this.$D.select();
},
$F: function () {
this.$D.style.background = 'ffaaaa';
},
$10: function () {
this.$D.style.background = '';
},
$B: function () {
var $0 = new String();
$0 = this.$D.value;
return $0;
},
$C: function () {
this.$3.removeChild(this.$D);
this.$D = null;
RMap._LongTextFieldEditor.callBase(this, '$C');
}
}
RMap._ObjectFieldEditor = function (container, key, type, value) {
RMap._ObjectFieldEditor.constructBase(this, [
container,
key,
type,
value
]);
this.$D = type;
this.$5.disabled = true;
this.$5.style.textDecoration = 'underline';
this.$5.style.cursor = RMap.Browser.crsPointer;
}
RMap._ObjectFieldEditor.prototype = {
$D: null,
$B: function () {
return this.$2;
}
}
RMap._EditableShape = function (feature, control) {
RMap._EditableShape.constructBase(this, [
feature
]);
this.$9 = this._feature.geometry.getGeometryType();
this.$1A = control;
this.$11 = new RMap.ShapeStyle();
this.$11.strokeColor = 'red';
this.$11.strokeOpacity = 100;
this.$11.strokeWidth = 3;
this.$11.fillColor = 'white';
this.$11.fillOpacity = 100;
this.$12 = new RMap.ShapeStyle();
this.$12.strokeColor = 'green';
this.$12.strokeOpacity = 100;
this.$12.strokeWidth = 3;
this.$12.fillColor = 'white';
this.$12.fillOpacity = 100;
this.$13 = new RMap.ShapeStyle();
this.$13.strokeColor = 'red';
this.$13.strokeOpacity = 100;
this.$13.strokeWidth = 1;
this.$14 = new RMap.ShapeStyle();
this.$14.strokeColor = 'green';
this.$14.strokeOpacity = 100;
this.$14.strokeWidth = 2;
this.$15 = new RMap.ShapeStyle();
this.$15.strokeColor = 'gray';
this.$15.strokeOpacity = 50;
this.$15.strokeWidth = 1;
if (ScriptFX.Application.current.get_isIE()) {
this.$F = document.createElement('v:g');
this.$10 = document.createElement('v:g');
this.$E = new RMap._VMLGraphics(2);
} else {
this.$F = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'g');
this.$10 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'g');
this.$E = new RMap._SVGGraphics(2);
}
this.$E.$4(this.$15);
this.$B = new Array(0);
this.$C = new Array(0);
}
RMap._EditableShape.prototype = {
$8: null,
$9: 0,
$A: null,
$B: null,
$C: null,
$D: null,
$E: null,
$F: null,
$10: null,
$11: null,
$12: null,
$13: null,
$14: null,
$15: null,
$16: 5,
$17: 0,
$18: 0,
$19: null,
$1A: null,
$1B: true,
$2: function ($p0) {
this.$0 = $p0;
this.$8 = $p0.$30();
$p0.$32().appendChild(this.$E.$1);
$p0.$32().appendChild(this.$10);
$p0.$32().appendChild(this.$F);
var $0 = 0;
var $1 = 0;
var $2 = 0;
var $3 = 0;
this.$A = new Array(0);
for (var $4 = 0; $4 < this._feature.geometry.getCoordinates().length - 1; $4 += 2) {
$2 = this._feature.geometry.getCoordinates() [$4];
$3 = this._feature.geometry.getCoordinates() [$4 + 1];
if ($4 < 2 || $0 !== $2 || $1 !== $3) {
this.$A[this.$A.length] = $2;
this.$A[this.$A.length] = $3;
$0 = $2;
$1 = $3;
}
}
if (this.$8.$39().$E().crsId.crsCode !== this._feature.$1.getSchema().getCoordinateSystem().crsId.crsCode) {
this.$A = RMap.CoordinateSystem.transformCS(this.$A, this._feature.$1.getSchema().getCoordinateSystem(), this.$8.$39().$E());
}(this.$B).clear();
(this.$C).clear();
if (this.$A.length > 1) {
if (this.$9 === 3 && (this.$A[0] !== this.$A[this.$A.length - 2] || this.$A[1] !== this.$A[this.$A.length - 1])) {
this.$A[this.$A.length] = this.$A[0];
this.$A[this.$A.length] = this.$A[1];
}
for (var $5 = 0; $5 < this.$A.length; $5 += 2) {
if ((this.$9 !== 3 && $5 < this.$A.length - 1) || (this.$9 === 3 && (!$5 || $5 < this.$A.length - 3))) {
this.$B[Math.round($5 / 2)] = new RMap._EditVertex(RMap.$create_Coordinate(this.$A[$5], this.$A[$5 + 1]), this);
}
if ((this.$9 !== 3 && $5 < this.$A.length - 3) || (this.$9 === 3 && $5 < this.$A.length - 5)) {
this.$C[Math.round($5 / 2)] = new RMap._EditLine(RMap.$create_Coordinate(this.$A[$5], this.$A[$5 + 1]), RMap.$create_Coordinate(this.$A[$5 + 2], this.$A[$5 + 3]), this);
} else if ((this.$9 === 3 && (!$5 || $5 < this.$A.length - 3))) {
this.$C[Math.round($5 / 2)] = new RMap._EditLine(RMap.$create_Coordinate(this.$A[$5], this.$A[$5 + 1]), RMap.$create_Coordinate(this.$A[0], this.$A[1]), this);
}
}
}
this.$8.attachEvent('mouse', Delegate.create(this, this.$1F));
},
$1C: function () {
if (this.$B.length > 0) {
this.$23(this.$B[this.$B.length - 1]);
}
},
get_$1D: function () {
return this.$1B;
},
set_$1D: function ($p0) {
this.$1B = $p0;
return $p0;
},
update: function ($p0) {
return;
},
updateStyle: function ($p0) {
return;
},
$3: function ($p0) {
return true;
},
$4: function ($p0) {
if (($p0 & 1)) {
return;
}
if (this.$17 !== - 1) {
window.clearTimeout(this.$17);
}
this.$17 = - 1;
this.$2D(false);
},
$5: function ($p0) {
if (this.$17 !== - 1) {
window.clearTimeout(this.$17);
}
this.$17 = - 1;
this.$17 = window.setTimeout(Delegate.create(this, this.$1E), 200);
},
$1E: function () {
this.$2E();
this.$2D(true);
if (this.$18) {
this.$8.$47(4);
}
this.$2B();
},
$1F: function ($p0, $p1) {
var $0 = $p1;
if (($0.action & 1)) {
if ((ScriptFX.Application.current.get_isIE() && window.event.button === 1) || (!ScriptFX.Application.current.get_isIE() && !window.event.button)) {
if (this.$18 > 0) {
this.$26(this.$B.length, $0.displayLocation);
}
if (this.$18 < 0) {
this.$26(0, $0.displayLocation);
}
this.$19 = $0.displayLocation;
}
return;
}
if ($0.action === 8) {
this.$2A(0);
this.$8.$47(2);
this.$19 = null;
return;
}
if (($0.action & 64)) {
if (this.$D) {
var $1 = $0.displayLocation;
this.$19 = null;
this.$24(this.$D, $1);
return;
} else {
this.$2B();
}
return;
}
if (!$0.action) {
if (this.$D) {
this.$D.$D(false);
this.$D = null;
if (!this.$18) {
this.$8.$47(2);
this.$8.$46(false);
}
this.$2C();
}
if (!this.$18) {
if (!isNullOrUndefined(this.$19)) {
if (this.$19.left === $0.displayLocation.left && this.$19.top === $0.displayLocation.top) {
this.$1A.$43();
}
}
}
}
},
$20: function ($p0) {
for (var $0 = 0; $0 < this.$B.length; $0++) {
if ($p0 === this.$B[$0]) {
return $0;
}
}
return - 1;
},
$21: function ($p0) {
for (var $0 = 0; $0 < this.$C.length; $0++) {
if ($p0 === this.$C[$0]) {
return $0;
}
}
return - 1;
},
$22: function ($p0) {
this.$23($p0);
},
$23: function ($p0) {
if (!this.$1B) {
return;
}
this.$D = $p0;
this.$E.$1.style.display = 'none';
$p0.$D(true);
this.$8.$47(4);
this.$8.$46(true);
},
$24: function ($p0, $p1) {
this.$25($p0, this.$8.$39().$17($p1));
},
$25: function ($p0, $p1) {
if (!this.$1B) {
return;
}
$p0.$2 = $p1;
$p0.$9();
var $0 = this.$20($p0);
if ($0 === - 1) {
return;
}
var $1 = $0 - 1;
if ($1 < 0 && this.$9 === 3 && this.$B.length > 1) {
$1 = this.$B.length - 1;
}
if ($1 >= 0) {
this.$C[$1].$3.x = $p0.$2.x;
this.$C[$1].$3.y = $p0.$2.y;
this.$C[$1].$B();
}
if ($0 < this.$C.length) {
this.$C[$0].$2.x = $p0.$2.x;
this.$C[$0].$2.y = $p0.$2.y;
if (this.$B.length === 1) {
this.$C[$0].$3.x = $p0.$2.x;
this.$C[$0].$3.y = $p0.$2.y;
}
this.$C[$0].$B();
}
},
$26: function ($p0, $p1) {
if (ScriptFX.Application.current.get_isIE()) {
$p1.left -= 2;
$p1.top -= 3;
}
this.$27($p0, this.$8.$39().$17($p1));
},
$27: function ($p0, $p1) {
if (!this.$1B) {
return;
}
var $0 = new RMap._EditVertex(RMap.$create_Coordinate($p1.x, $p1.y), this);
if ($p0 < this.$B.length) {
(this.$B).insert($p0, $0);
(this.$C).insert($p0, new RMap._EditLine(RMap.$create_Coordinate($p1.x, $p1.y), RMap.$create_Coordinate(this.$B[$p0 + 1].$2.x, this.$B[$p0 + 1].$2.y), this));
if ($p0 > 0) {
this.$C[$p0 - 1].$3.x = $p1.x;
this.$C[$p0 - 1].$3.y = $p1.y;
this.$C[$p0 - 1].$B();
} else if (this.$9 === 3) {
this.$C[this.$C.length - 1].$3.x = $p1.x;
this.$C[this.$C.length - 1].$3.y = $p1.y;
this.$C[this.$C.length - 1].$B();
}
} else {
(this.$B).add($0);
if (this.$9 === 3) {
this.$C[this.$C.length - 1].$3.x = $p1.x;
this.$C[this.$C.length - 1].$3.y = $p1.y;
this.$C[this.$C.length - 1].$B();
(this.$C).add(new RMap._EditLine(RMap.$create_Coordinate($p1.x, $p1.y), RMap.$create_Coordinate(this.$B[0].$2.x, this.$B[0].$2.y), this));
} else {
(this.$C).add(new RMap._EditLine(RMap.$create_Coordinate(this.$B[this.$B.length - 2].$2.x, this.$B[this.$B.length - 2].$2.y), RMap.$create_Coordinate($p1.x, $p1.y), this));
}
}
this.$2C();
},
$28: function ($p0) {
this.$8.$16['preventContext'] = true;
if (!this.$1B) {
return;
}
if (this.$B.length < 2) {
return;
}
this.$D = $p0;
var $0 = this.$20($p0);
if ($0 === - 1) {
return;
}
var $1 = $0 - 1;
var $2 = $0;
if ($0 === this.$B.length - 1 && this.$9 === 2) {
$1 = - 1;
$2 = $0 - 1;
}
if (!$0 && this.$9 === 3) {
$1 = this.$C.length - 1;
}
if ($1 > - 1) {
this.$C[$1].$3.x = this.$C[$0].$3.x;
this.$C[$1].$3.y = this.$C[$0].$3.y;
this.$C[$1].$B();
}
if ($2 > - 1) {
this.$C[$2].$11();
this.$C[$2] = null;
(this.$C).removeAt($2);
}
this.$B[$0].$F();
this.$B[$0] = null;
(this.$B).removeAt($0);
this.$D = null;
if (this.$B.length < 2) {
this.$27(this.$B.length, RMap.$create_Coordinate(this.$B[0].$2.x, this.$B[0].$2.y));
} else {
this.$2C();
}
},
$29: function ($p0, $p1) {
if (!this.$1B) {
return;
}
var $0 = this.$21($p0);
if ($0 === - 1) {
return;
}
$p1.left -= this.$16 / 2;
$p1.top -= this.$16 / 2;
var $1 = this.$8.$39().$17($p1);
var $2 = new RMap._EditVertex(RMap.$create_Coordinate($1.x, $1.y), this);
if ($0 + 1 < this.$B.length) {
(this.$B).insert($0 + 1, $2);
} else {
(this.$B).add($2);
}
if ($0 + 1 < this.$C.length) {
(this.$C).insert($0 + 1, new RMap._EditLine(RMap.$create_Coordinate($1.x, $1.y), RMap.$create_Coordinate($p0.$3.x, $p0.$3.y), this));
} else {
(this.$C).add(new RMap._EditLine(RMap.$create_Coordinate($1.x, $1.y), RMap.$create_Coordinate($p0.$3.x, $p0.$3.y), this));
}
this.$C[$0].$3.x = $1.x;
this.$C[$0].$3.y = $1.y;
this.$C[$0].$B();
$p0.$F(false);
this.$22($2);
},
$2A: function ($p0) {
this.$18 = $p0;
if (this.$8) {
if (!$p0) {
this.$8.$47(2);
this.$8.$46(false);
} else {
this.$8.$47(4);
this.$8.$46(true);
}
}
},
$2B: function () {
if (!window.event || !this.$18) {
this.$E.$1.style.display = 'none';
return;
}
var $0 = RMap._DomHelper.$9(window.event, this.$8.$D);
var $1 = this.$8.$39().$17($0);
var $2 = this.$8.$39().$14($1);
var $3;
if (this.$18 > 0) {
$3 = this.$B[this.$B.length - 1].$3;
} else {
$3 = this.$B[0].$3;
}
$2.x = Math.round($2.x);
$2.y = Math.round($2.y);
$3.x = Math.round($3.x);
$3.y = Math.round($3.y);
var $4 = RMap._GeometryOperation.$2([$2.x,
$2.y,
$3.x,
$3.y], this.$8.$39().$13(), 2, false);
this.$E.$2($4, 2);
this.$E.$1.style.display = '';
},
$2C: function () {
var $0 = new Array(0);
for (var $1 = 0; $1 < this.$B.length; $1++) {
($0).add(this.$B[$1].$2.x);
($0).add(this.$B[$1].$2.y);
}
if (this.$9 === 3) {
($0).add(this.$B[0].$2.x);
($0).add(this.$B[0].$2.y);
}
if (this.$B.length < 2) {
($0).add(this.$B[0].$2.x);
($0).add(this.$B[0].$2.y);
}
if (this.$8.$39().$E().crsId.crsCode !== this._feature.$1.getSchema().getCoordinateSystem().crsId.crsCode) {
$0 = RMap.CoordinateSystem.transformCS($0, this.$8.$39().$E(), this._feature.$1.getSchema().getCoordinateSystem());
}
this._feature.geometry.setCoordinates($0);
this.$1A.$41(9);
this.$1A.$56();
},
$2D: function ($p0) {
for (var $0 = 0; $0 < this.$B.length; $0++) {
this.$B[$0].$E($p0);
}
for (var $1 = 0; $1 < this.$C.length; $1++) {
this.$C[$1].$10($p0);
}
if ($p0) {
this.$E.$1.style.display = '';
} else {
this.$E.$1.style.display = 'none';
}
},
$2E: function () {
for (var $0 = 0; $0 < this.$B.length; $0++) {
this.$B[$0].$9();
}
for (var $1 = 0; $1 < this.$C.length; $1++) {
this.$C[$1].$B();
}
},
$7: function () {
if (this.$8) {
window.clearTimeout(this.$17);
this.$8.detachEvent('mouse', Delegate.create(this, this.$1F));
this.$F.parentNode.removeChild(this.$F);
this.$10.parentNode.removeChild(this.$10);
for (var $0 = 0; $0 < this.$B.length; $0++) {
this.$B[$0].$F();
}(this.$B).clear();
this.$F = null;
for (var $1 = 0; $1 < this.$C.length; $1++) {
this.$C[$1].$11();
}(this.$C).clear();
this.$10 = null;
this.$D = null;
this.$E.$5();
this.$E = null;
this.$8 = null;
this.$A = null;
if (this._element && this._element.parentNode) {
this._element.parentNode.removeChild(this._element);
}
this._targetCSGeometry = null;
this.$0 = null;
this._element = null;
this._feature = null;
}
}
}
RMap._EditablePushpin = function (feature, control) {
this.$13 = ScriptFX.UI.$create_Location(0, 0);
this.$15 = ScriptFX.UI.$create_Location(0, 0);
this.$19 = document.createElement('img');
RMap._EditablePushpin.constructBase(this, [
feature
]);
this.$17 = control;
}
RMap._EditablePushpin.prototype = {
$11: null,
$12: null,
$14: false,
$16: null,
$17: null,
$18: true,
$1A: 7,
$2: function ($p0) {
RMap._EditablePushpin.callBase(this, '$2', [
$p0
]);
this.$11 = $p0.$30();
this.$11.attachEvent('mouse', Delegate.create(this, this.$1D));
this._element.style.cursor = 'default';
this.$19.style.position = 'absolute';
this.$19.style.zIndex = 99;
this.$19.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2a.gif';
this.$0.$33().appendChild(this.$19);
this.$19.attachEvent('onmouseover', Delegate.create(this, this.$1E));
this.$19.attachEvent('onmousedown', Delegate.create(this, this.$1F));
this.$19.attachEvent('onmouseout', Delegate.create(this, this.$20));
this.$25();
},
$1B: function () {
this.$1F();
},
get_$1C: function () {
return this.$18;
},
set_$1C: function ($p0) {
this.$18 = $p0;
return $p0;
},
$1D: function ($p0, $p1) {
var $0 = $p1;
if ($0.action === 8) {
this.$11.$47(2);
this.$16 = null;
return;
}
if (($0.action & 64) && this.$14) {
var $1 = $0.displayLocation;
$1.left += this.$15.left;
$1.top += this.$15.top;
this.$16 = null;
this.$22($1);
return;
}
if (!$0.action) {
if (this.$14) {
this.$21(false);
this.$11.$47(2);
this.$11.$46(false);
this.$26();
this.$14 = false;
this.$15.left = 0;
this.$15.top = 0;
} else {
if (!isNullOrUndefined(this.$16)) {
if (this.$16.left === $0.displayLocation.left && this.$16.top === $0.displayLocation.top) {
this.$17.$43();
}
}
}
}
if ($0.action === 1) {
this.$16 = $0.displayLocation;
}
},
$1E: function () {
if (this.$18) {
this.$19.style.cursor = RMap.Browser.crsPointer;
this.$19.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2b.gif';
} else {
this.$19.style.cursor = 'default';
this.$20();
}
},
$1F: function () {
if (this.$18) {
var $0 = window.event.button;
RMap._DomHelper.$B();
if (!this.$18) {
return;
}
if ((ScriptFX.Application.current.get_isIE() && $0 === 1) || (!ScriptFX.Application.current.get_isIE() && !$0)) {
this.$15 = RMap._DomHelper.$9(window.event, this.$19);
this.$15.left = this.$1A - this.$15.left;
this.$15.top = this.$1A - this.$15.top;
this.$21(true);
this.$11.$47(4);
this.$11.$46(true);
this.$14 = true;
}
if (window.event.button === 2) {
}
}
},
$20: function () {
if (!this.$14) {
this.$19.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2a.gif';
}
},
$21: function ($p0) {
if ($p0) {
RMap._DomHelper.$C(this.$11.$D);
this.$1E();
try {
this.$11.$D.style.cursor = 'url(\'' + RMap.MapApplication.resourcesUrl + 'EditControl/anchor.cur\'), default';
this.$19.style.cursor = this.$11.$D.style.cursor;
} catch ($0) {
}
} else {
this.$11.$D.style.cursor = 'default';
this.$19.style.cursor = RMap.Browser.crsPointer;
}
},
$4: function ($p0) {
RMap._EditablePushpin.callBase(this, '$4', [
$p0
]);
this.$19.style.visibility = 'hidden';
},
$5: function ($p0) {
RMap._EditablePushpin.callBase(this, '$5', [
$p0
]);
this.$25();
this.$19.style.visibility = '';
},
update: function ($p0) {
RMap._EditablePushpin.callBase(this, 'update', [
$p0
]);
this.$25();
},
$22: function ($p0) {
if (!this.$18) {
return;
}
this.$13.left = $p0.left - this.$0.$33().parentNode.offsetLeft;
this.$13.top = $p0.top - this.$0.$33().parentNode.offsetTop;
this.$12 = this.$11.$39().$17($p0);
this.$24();
},
$23: function ($p0) {
var $0 = this.$11.$39().$14($p0);
this.$13 = ScriptFX.UI.$create_Location(Math.round($0.x), Math.round($0.y));
this.$12 = RMap.$create_Coordinate($p0.x, $p0.y);
this.$24();
},
$24: function () {
this.$19.style.left = (this.$13.left - this.$1A) + 'px';
this.$19.style.top = (this.$13.top - this.$1A) + 'px';
},
$25: function () {
var $0 = RMap.CoordinateSystem.transformCS(this._feature.geometry.getCoordinates(), this._feature.$1.getSchema().getCoordinateSystem(), this.$11.$39().$E());
this.$12 = RMap.$create_Coordinate($0[0], $0[1]);
this.$23(this.$12);
},
$26: function () {
var $0 = [
this.$12.x,
this.$12.y
];
if (this.$11.$39().$E().crsId.crsCode !== this._feature.$1.getSchema().getCoordinateSystem().crsId.crsCode) {
$0 = RMap.CoordinateSystem.transformCS($0, this.$11.$39().$E(), this._feature.$1.getSchema().getCoordinateSystem());
}
this._feature.geometry.setCoordinates($0);
this.$17.$41(9);
this.$17.$56();
this.update(4);
},
openInfoWindow: function () {
return;
},
$7: function () {
if (this.$11) {
this.$11.detachEvent('mouse', Delegate.create(this, this.$1D));
this.$19.detachEvent('onmouseover', Delegate.create(this, this.$1E));
this.$19.detachEvent('onmousedown', Delegate.create(this, this.$1F));
this.$19.detachEvent('onmouseout', Delegate.create(this, this.$20));
this.$19.parentNode.removeChild(this.$19);
this.$19 = null;
this.$11 = null;
RMap._EditablePushpin.callBase(this, '$7');
}
}
}
RMap._EditControl = function () {
this.$13 = new RMap.ImageSymbolPointStyle();
(this.$13).iconSrc = RMap.MapApplication.resourcesUrl + 'Icons/default.gif';
(this.$13).iconSize = ScriptFX.UI.$create_Size(12, 20);
(this.$13).anchor = ScriptFX.UI.$create_Location(7, 20);
(this.$13).infoWindowAnchor = ScriptFX.UI.$create_Location(7, 0);
this.$12 = new RMap.ShapeStyle();
this.$12.fillColor = '#ffff00';
this.$12.fillOpacity = 30;
this.$12.strokeColor = '#3333ff';
this.$12.strokeWidth = 3;
this.$12.strokeOpacity = 80;
this.$32();
var $0 = this.$D.$4(0);
if ($0 && $0.$D() > - 1) {
(this.$13).iconSrc = $0.$B(0).get_$3();
(this.$13).iconSize = ScriptFX.UI.$create_Size($0.$6.width, $0.$6.height);
(this.$13).anchor = ScriptFX.UI.$create_Location($0.$4.left, $0.$4.top);
(this.$13).infoWindowAnchor = ScriptFX.UI.$create_Location($0.$5.left, $0.$5.top);
}
this.$2A = document.createElement('img');
this.$2A.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2a.gif';
this.$2B = document.createElement('img');
this.$2B.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2b.gif';
this.$2C = document.createElement('img');
this.$2C.src = RMap.MapApplication.resourcesUrl + 'EditControl/anchor2b.gif';
}
RMap._EditControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: 0,
$7: 0,
$8: null,
$9: null,
$A: false,
$B: null,
$C: null,
$D: null,
$E: null,
$F: null,
$10: 'http://localhost/RMap_Website/',
$11: 'RMap_service.aspx',
$12: null,
$13: null,
$14: null,
$15: null,
$16: null,
$17: null,
$18: null,
$19: null,
$1A: '#ffffaa',
$1B: '#cccccc',
$1C: null,
$1D: null,
$1E: null,
$1F: null,
$20: null,
$21: null,
$22: null,
$23: null,
$24: null,
$25: null,
$26: null,
$27: null,
$28: null,
$29: false,
$2A: null,
$2B: null,
$2C: null,
attach: function ($p0) {
this.$0 = $p0;
this.$C = new RMap._Container(this.$0.getControlsSurface());
this.$C.get_$1().style.position = 'absolute';
this.$C.get_$1().style.right = '5px';
this.$C.get_$1().style.top = '5px';
this.$C.get_$1().className = 'EditControl';
this.$C.get_$1().attachEvent('onmousedown', Delegate.create(this, this.$33));
this.$C.get_$1().attachEvent('onmouseup', Delegate.create(this, this.$33));
this.$C.get_$1().attachEvent('ondblclick', Delegate.create(this, this.$33));
this.$C.get_$1().style.display = 'none';
this.$1C = document.createElement('div');
this.$C.get_$1().appendChild(this.$1C);
this.$1D = document.createElement('img');
this.$1D.src = RMap.MapApplication.resourcesUrl + 'EditControl/add_point_trans.gif';
this.$1D.style.cursor = RMap.Browser.crsPointer;
this.$1D.title = 'new marker';
this.$1D.hspace = '1';
this.$1E = document.createElement('img');
this.$1E.src = RMap.MapApplication.resourcesUrl + 'EditControl/add_polyline_trans.gif';
this.$1E.style.cursor = RMap.Browser.crsPointer;
this.$1E.title = 'new polyline';
this.$1E.hspace = '1';
this.$1F = document.createElement('img');
this.$1F.src = RMap.MapApplication.resourcesUrl + 'EditControl/add_polygon_trans.gif';
this.$1F.style.cursor = RMap.Browser.crsPointer;
this.$1F.title = 'new polygon';
this.$1F.hspace = '1';
this.$20 = document.createElement('img');
this.$20.src = RMap.MapApplication.resourcesUrl + 'EditControl/icon_trans.gif';
this.$20.style.cursor = RMap.Browser.crsPointer;
this.$20.title = 'select icon';
this.$20.hspace = '1';
this.$21 = document.createElement('img');
this.$21.src = RMap.MapApplication.resourcesUrl + 'EditControl/fill_color_trans.gif';
this.$21.style.cursor = RMap.Browser.crsPointer;
this.$21.title = 'fill color';
this.$21.hspace = '1';
this.$22 = document.createElement('img');
this.$22.src = RMap.MapApplication.resourcesUrl + 'EditControl/stroke_color_trans.gif';
this.$22.style.cursor = RMap.Browser.crsPointer;
this.$22.title = 'border color';
this.$22.hspace = '1';
this.$23 = document.createElement('img');
this.$23.src = RMap.MapApplication.resourcesUrl + 'EditControl/stroke_width_trans.gif';
this.$23.style.cursor = RMap.Browser.crsPointer;
this.$23.title = 'border width';
this.$23.hspace = '1';
this.$24 = document.createElement('img');
this.$24.src = RMap.MapApplication.resourcesUrl + 'EditControl/stroke_type_trans.gif';
this.$24.style.cursor = RMap.Browser.crsPointer;
this.$24.title = 'border type';
this.$24.hspace = '1';
this.$25 = document.createElement('img');
this.$25.src = RMap.MapApplication.resourcesUrl + 'EditControl/attributes_trans.gif';
this.$25.style.cursor = RMap.Browser.crsPointer;
this.$25.title = 'edit attributes';
this.$25.hspace = '1';
this.$27 = document.createElement('img');
this.$27.src = RMap.MapApplication.resourcesUrl + 'EditControl/cancel.gif';
this.$27.style.cursor = RMap.Browser.crsPointer;
this.$27.title = 'delete element';
this.$27.hspace = '1';
this.$26 = document.createElement('img');
this.$26.src = RMap.MapApplication.resourcesUrl + 'EditControl/confirm.gif';
this.$26.style.cursor = RMap.Browser.crsPointer;
this.$26.title = 'confirm';
this.$26.hspace = '1';
this.$28 = document.createElement('img');
this.$28.src = RMap.MapApplication.resourcesUrl + 'EditControl/close.gif';
this.$28.style.cursor = RMap.Browser.crsPointer;
this.$28.style.position = 'absolute';
this.$28.style.top = '2px';
this.$28.style.right = '2px';
this.$C.get_$1().appendChild(this.$1D);
this.$1D.attachEvent('onclick', Delegate.create(this, this.$37));
this.$C.get_$1().appendChild(this.$1E);
this.$1E.attachEvent('onclick', Delegate.create(this, this.$38));
this.$C.get_$1().appendChild(this.$1F);
this.$1F.attachEvent('onclick', Delegate.create(this, this.$39));
this.$C.get_$1().appendChild(this.$20);
this.$20.attachEvent('onclick', Delegate.create(this, this.$46));
this.$C.get_$1().appendChild(this.$21);
this.$21.attachEvent('onclick', Delegate.create(this, this.$47));
this.$C.get_$1().appendChild(this.$22);
this.$22.attachEvent('onclick', Delegate.create(this, this.$48));
this.$C.get_$1().appendChild(this.$23);
this.$23.attachEvent('onclick', Delegate.create(this, this.$49));
this.$C.get_$1().appendChild(this.$24);
this.$24.attachEvent('onclick', Delegate.create(this, this.$4A));
this.$C.get_$1().appendChild(this.$25);
this.$25.attachEvent('onclick', Delegate.create(this, this.$57));
this.$C.get_$1().appendChild(this.$27);
this.$27.attachEvent('onclick', Delegate.create(this, this.$45));
this.$C.get_$1().appendChild(this.$26);
this.$26.attachEvent('onclick', Delegate.create(this, this.$4B));
this.$C.get_$1().appendChild(this.$28);
this.$28.attachEvent('onclick', Delegate.create(this, this.$2E));
this.$36(['none',
'none',
'none',
'none',
'none',
'none',
'none',
'none',
'none',
'none']);
this.$34(null);
this.$35(null);
return this.$C.get_$1();
},
$2D: function ($p0) {
if (!$p0.getFeatureView().getStorage().getEditPermissions()) {
return;
}
if (isNullOrUndefined(this.$5)) {
this.$5 = new RMap._EditLayer('myEditLayer', new RMap.FeatureStorage(null, - 1).getDefaultView(), null);
this.$0.addLayer(this.$5);
}
RMap._DomHelper.$5(this.$5.$33(), 1);
RMap._DomHelper.$5(this.$5.$32(), 1);
if (!isNullOrUndefined(this.$1)) {
this.$1.remove_editDrawingEvent(Delegate.create(this, this.$2F));
this.$1.remove_stateChangedEvent(Delegate.create(this, this.$31));
this.$1.remove_collectionChangedEvent(Delegate.create(this, this.$30));
if (this.$1 !== $p0) {
this.$43();
this.$1.$34(0);
}
this.$1.$27(new RMap.StateChangedEventArgs(null, 5));
}
this.$1 = $p0;
this.$1.$34(2);
this.$1.add_editDrawingEvent(Delegate.create(this, this.$2F));
this.$1.add_stateChangedEvent(Delegate.create(this, this.$31));
this.$1.add_collectionChangedEvent(Delegate.create(this, this.$30));
this.$1.$27(new RMap.StateChangedEventArgs(null, 4));
this.$4 = $p0.getFeatureView().getStorage();
this.$1C.innerHTML = RMap.Messages.layer_editing + ((this.$4.$9['title']) ? this.$4.$9['title'] : this.$1.getId());
this.$36(['',
'',
'',
'',
'',
'',
'',
'',
'none',
'none']);
this.$C.get_$1().style.display = '';
},
$2E: function () {
this.$43();
this.$C.get_$1().style.display = 'none';
if (this.$1) {
this.$1.$34(0);
this.$1.remove_editDrawingEvent(Delegate.create(this, this.$2F));
this.$1.remove_stateChangedEvent(Delegate.create(this, this.$31));
this.$1.remove_collectionChangedEvent(Delegate.create(this, this.$30));
this.$1.$27(new RMap.StateChangedEventArgs(null, 5));
this.$1 = null;
}
},
$2F: function ($p0) {
if (this.$0.$48() !== 4) {
this.$3D($p0);
}
},
$30: function ($p0, $p1) {
if (!this.$40() || this.$29) {
return;
}
var $0 = String.Empty;
switch ($p1.action) {
case 2:
var $enum1 = $p1.items.getEnumerator();
while ($enum1.moveNext()) {
var $1 = $enum1.get_current();
if ($1 === this.$3) {
$0 = RMap.Messages.eddrRem;
}
}
break;
case 16:
if (!this.$1.drawings[this.$3.getId()]) {
$0 = RMap.Messages.eddrFlt;
}
break;
case 4:
$0 = RMap.Messages.eddrRef;
break;
case 3:
$0 = RMap.Messages.eddrRem;
break;
case 32:
var $enum2 = $p1.items.getEnumerator();
while ($enum2.moveNext()) {
var $2 = $enum2.get_current();
if ($2 === this.$3) {
$0 = RMap.Messages.eddrUpd;
}
}
break;
case 33:
var $enum3 = $p1.items.getEnumerator();
while ($enum3.moveNext()) {
var $3 = $enum3.get_current();
if ($3 === this.$3) {
$0 = RMap.Messages.eddrUpd;
}
}
break;
}
this.$29 = true;
if ($0 !== String.Empty) {
RMap.Messages.$2(this.$0, $0);
this.$43();
}
this.$29 = false;
},
$31: function ($p0, $p1) {
if ($p1.action === 256 || $p1.action === 1) {
this.$2E();
}
},
$32: function () {
if (isNullOrUndefined(this.$D)) {
this.$D = new RMap._PaletteCollection();
try {
var $0 = 'getElementsByTagName';
var $1 = RMap.MapSettingsLoader.$0(RMap.MapApplication.paletteUrl, null);
var $2 = $1.documentElement;
var $3 = ($2[$0]('palette'));
for (var $4 = 0; $4 < $3.length; $4++) {
var $5 = (($3[$4][$0]('items')) [0][$0]('item'));
if (!$5.length) {
continue;
}
var $6 = RMap.XmlTools.getNodeAtributeValue($3[$4].attributes.getNamedItem('name'));
var $7 = new RMap._Palette($4.toString(), $6);
for (var $B = 0; $B < $5.length; $B++) {
var $C = $B.toString();
if ($5[$B].attributes.getNamedItem('name')) {
$C = RMap.XmlTools.getNodeAtributeValue($5[$B].attributes.getNamedItem('name'));
}
$7.$9($C, RMap.XmlTools.getNodeAtributeValue($5[$B].attributes.getNamedItem('href')));
}
var $8 = ($3[$4][$0]('defaultIconSize')) [0];
$7.$6 = ScriptFX.UI.$create_Size(parseInt(RMap.XmlTools.getNodeAtributeValue($8.attributes.getNamedItem('width'))), parseInt(RMap.XmlTools.getNodeAtributeValue($8.attributes.getNamedItem('height'))));
var $9 = ($3[$4][$0]('defaultIconAnchor')) [0];
$7.$4 = ScriptFX.UI.$create_Location(parseInt(RMap.XmlTools.getNodeAtributeValue($9.attributes.getNamedItem('x'))), parseInt(RMap.XmlTools.getNodeAtributeValue($9.attributes.getNamedItem('y'))));
var $A = ($3[$4][$0]('defaultInfoWinfowAnchor')) [0];
$7.$5 = ScriptFX.UI.$create_Location(parseInt(RMap.XmlTools.getNodeAtributeValue($A.attributes.getNamedItem('x'))), parseInt(RMap.XmlTools.getNodeAtributeValue($A.attributes.getNamedItem('y'))));
this.$D.$2($7);
}
} catch ($D) {
}
}
},
$33: function () {
RMap._DomHelper.$B();
},
detach: function () {
this.$2E();
},
$34: function ($p0) {
this.$1D.style.background = this.$1B;
this.$1E.style.background = this.$1B;
this.$1F.style.background = this.$1B;
if ($p0) {
$p0.style.background = this.$1A;
}
},
$35: function ($p0) {
this.$20.style.background = this.$1B;
this.$21.style.background = this.$1B;
this.$22.style.background = this.$1B;
this.$23.style.background = this.$1B;
this.$24.style.background = this.$1B;
this.$25.style.background = this.$1B;
if ($p0) {
$p0.style.background = this.$1A;
}
},
$36: function ($p0) {
if (!isNullOrUndefined(this.$4)) {
var $0 = this.$4.getEditPermissions();
if (!($0 & 1)) {
$p0[0] = 'none';
}
if (!($0 & 2)) {
$p0[1] = 'none';
}
if (!($0 & 4)) {
$p0[2] = 'none';
}
if (!($0 & 224)) {
$p0[3] = 'none';
}
if (!($0 & 4096)) {
$p0[4] = 'none';
}
if (!($0 & 256)) {
$p0[5] = 'none';
}
if (!($0 & 1024)) {
$p0[6] = 'none';
}
if (!($0 & 512)) {
$p0[7] = 'none';
}
if (!($0 & 32768)) {
$p0[8] = 'none';
}
}
this.$1D.style.display = $p0[0];
this.$1E.style.display = $p0[1];
this.$1F.style.display = $p0[2];
this.$20.style.display = $p0[3];
this.$21.style.display = $p0[4];
this.$22.style.display = $p0[5];
this.$23.style.display = $p0[6];
this.$24.style.display = $p0[7];
this.$25.style.display = $p0[8];
this.$27.style.display = $p0[8];
this.$26.style.display = $p0[9];
},
$37: function () {
if (!this.$3F() || this.$7 === 1 && !(this.$4.getEditPermissions() & 1)) {
return;
}
if (this.$3A(1)) {
this.$34(this.$1D);
} else {
this.$42();
}
},
$38: function () {
if (!this.$3F() || this.$7 === 2 && !(this.$4.getEditPermissions() & 2)) {
return;
}
if (this.$3A(2)) {
this.$34(this.$1E);
} else {
this.$42();
}
},
$39: function () {
if (!this.$3F() || this.$7 === 3 && !(this.$4.getEditPermissions() & 4)) {
return;
}
if (this.$3A(3)) {
this.$34(this.$1F);
} else {
this.$42();
}
},
$3A: function ($p0) {
if (isNullOrUndefined(this.$1) || isNullOrUndefined(this.$4) || !(this.$4.getEditPermissions() & 7)) {
return false;
}
if (!isNullOrUndefined(this.$A) && this.$A && this.$7 === $p0) {
return false;
}
if (this.$40()) {
this.$43();
}
this.$A = true;
this.$7 = $p0;
this.$0.$47(4);
this.$0.attachEvent('mouse', Delegate.create(this, this.$3B));
this.$0.$46(true);
this.$0.$D.style.cursor = 'crosshair';
try {
this.$0.$D.focus();
} catch ($0) {
}
if ($p0 === 1 && isNullOrUndefined(this.$16)) {
this.$46();
}
return true;
},
$3B: function ($p0, $p1) {
if (this.$A && !($p1).action) {
this.$B = RMap._DomHelper.$9(window.event, this.$0.$D);
this.$3C();
}
},
$3C: function () {
this.$42();
var $0;
var $1 = this.$0.$39().$17(this.$B);
switch (this.$7) {
case 1:
this.$F = null;
this.$F = this.$13.clone();
$0 = RMap.CoordinateSystem.transformCS([$1.x,
$1.y], this.$0.$39().$E(), this.$4.getSchema().getCoordinateSystem());
this.$3 = new RMap.Feature(null, new RMap.Geometry(this.$7, $0), null);
break;
case 2:
this.$F = null;
this.$F = this.$12.clone();
$0 = RMap.CoordinateSystem.transformCS([$1.x,
$1.y,
$1.x,
$1.y], this.$0.$39().$E(), this.$4.getSchema().getCoordinateSystem());
this.$3 = new RMap.Feature(null, new RMap.Geometry(this.$7, $0), null);
break;
case 3:
this.$F = null;
this.$F = this.$12.clone();
$0 = RMap.CoordinateSystem.transformCS([$1.x,
$1.y,
$1.x,
$1.y,
$1.x,
$1.y], this.$0.$39().$E(), this.$4.getSchema().getCoordinateSystem());
this.$3 = new RMap.Feature(null, new RMap.Geometry(this.$7, $0), null);
break;
}
this.$29 = true;
this.$4.add(this.$3);
this.$2 = this.$1.drawings[this.$3.getId()];
this.$41(9);
this.$3E(this.$2);
this.$56();
if (this.$7 === 2 || this.$7 === 3) {
this.$8.$2A(1);
}
},
$3D: function ($p0) {
if (!this.$3F() || !$p0 || this.$2 === $p0 || !this.$4.getEditPermissions()) {
return;
}
if (this.$40()) {
this.$43();
}
if ($p0.$0 !== this.$1) {
this.$2D($p0.$0);
}
this.$3 = $p0.getFeature();
this.$7 = this.$3.geometry.getGeometryType();
this.$F = null;
if (this.$7 === 1) {
this.$F = ($p0.getStyle()).clone();
} else {
this.$F = ($p0.getStyle()).clone();
}
this.$3E($p0);
if (this.$7 === 1 && !(this.$4.getEditPermissions() & 16)) {
this.$9.set_$1C(false);
}
if (this.$7 !== 1 && !(this.$4.getEditPermissions() & 8)) {
this.$8.set_$1D(false);
}
},
$3E: function ($p0) {
this.$0.$47(2);
this.$2 = $p0;
this.$3.setStyle(this.$F);
if (this.$7 === 1) {
this.$9 = new RMap._EditablePushpin(this.$3, this);
this.$5.$3F(this.$9);
} else {
this.$8 = new RMap._EditableShape(this.$3, this);
this.$5.$3E(this.$8);
}
this.$36(['',
'',
'',
'',
'',
'',
'',
'',
'',
'']);
this.$34(null);
this.$35(null);
},
$3F: function () {
if (isNullOrUndefined(this.$1)) {
return false;
} else {
return true;
}
},
$40: function () {
if (this.$8 || this.$9) {
return true;
} else {
return false;
}
},
$41: function ($p0) {
this.$1.$28(new RMap.DrawingEventArgs([this.$2], $p0));
},
$42: function () {
this.$A = false;
this.$0.detachEvent('mouse', Delegate.create(this, this.$3B));
this.$0.$46(false);
this.$0.$D.style.cursor = '';
this.$0.$47(0);
this.$4D();
this.$34(null);
},
$43: function () {
this.$5.$40();
if (this.$9) {
this.$9.$7();
this.$9 = null;
}
if (this.$8) {
this.$8.$7();
this.$8 = null;
}
if (!isNullOrUndefined(this.$A) && this.$A) {
this.$42();
}
this.$0.$47(0);
this.$44();
this.$2 = null;
this.$3 = null;
this.$F = null;
this.$36(['',
'',
'',
'',
'',
'',
'',
'',
'none',
'none']);
},
$44: function () {
this.$4D();
this.$4F();
this.$51();
this.$53();
this.$35(null);
this.$58();
},
$45: function () {
var $0 = this.$3;
this.$43();
$0.$1.remove($0.getId());
$0 = null;
},
$46: function () {
if (!isNullOrUndefined(this.$16)) {
this.$4D();
return;
}
this.$44();
this.$6 = 224;
this.$4C();
this.$35(this.$20);
},
$47: function () {
if (!isNullOrUndefined(this.$17) && this.$6 === 4096) {
this.$4F();
return;
}
this.$44();
this.$6 = 4096;
this.$4E();
this.$35(this.$21);
},
$48: function () {
if (!isNullOrUndefined(this.$17) && this.$6 === 256) {
this.$4F();
return;
}
this.$44();
this.$6 = 256;
this.$4E();
this.$35(this.$22);
},
$49: function () {
if (!isNullOrUndefined(this.$19)) {
this.$53();
return;
}
this.$44();
this.$6 = 1024;
this.$52();
this.$35(this.$23);
},
$4A: function () {
if (!isNullOrUndefined(this.$18)) {
this.$51();
return;
}
this.$44();
this.$6 = 512;
this.$50();
this.$35(this.$24);
},
$4B: function () {
this.$43();
},
$4C: function () {
if (!isNullOrUndefined(this.$16)) {
this.$16.$16();
this.$16 = null;
}
var $0 = (isNullOrUndefined(this.$9) || !(Type.canCast(this.$F, RMap.ImageSymbolPointStyle))) ? this.$13 : this.$F;
this.$16 = new RMap._IconPicker($0, this.$D);
this.$16.$B(this.$C.get_$1(), 'Izbira ikone');
this.$16.get_$A().className = 'PaletteContainer';
this.$16.$C($0);
this.$16.$11(Delegate.create(this, this.$54));
},
$4D: function () {
if (!isNullOrUndefined(this.$15)) {
this.$15.$16();
this.$15 = null;
}
if (!isNullOrUndefined(this.$16)) {
this.$16.$16();
this.$16 = null;
}
if (!isNullOrUndefined(this.$14)) {
this.$14.$4();
this.$14 = null;
}
this.$35(null);
},
$4E: function () {
if (!isNullOrUndefined(this.$17)) {
this.$17.$16();
this.$17 = null;
}
var $0 = (isNullOrUndefined(this.$8)) ? this.$12 : this.$F;
this.$17 = new RMap._ColorPicker($0, this.$6);
this.$17.$B(this.$C.get_$1(), 'Izbira barve');
this.$17.get_$A().className = 'PaletteContainer';
this.$17.$C($0);
this.$17.$11(Delegate.create(this, this.$55));
},
$4F: function () {
if (!isNullOrUndefined(this.$17)) {
this.$17.$16();
this.$17 = null;
}
this.$35(null);
},
$50: function () {
if (!isNullOrUndefined(this.$18)) {
this.$18.$16();
this.$18 = null;
}
var $0 = (isNullOrUndefined(this.$8)) ? this.$12 : this.$F;
this.$18 = new RMap._StroketypePicker($0);
this.$18.$B(this.$C.get_$1(), 'Izbira tipa');
this.$18.get_$A().className = 'PaletteContainer';
this.$18.$C($0);
this.$18.$11(Delegate.create(this, this.$55));
},
$51: function () {
if (!isNullOrUndefined(this.$18)) {
this.$18.$16();
this.$18 = null;
}
this.$35(null);
},
$52: function () {
if (!isNullOrUndefined(this.$19)) {
this.$19.$16();
this.$19 = null;
}
var $0 = (isNullOrUndefined(this.$8)) ? this.$12 : this.$F;
this.$19 = new RMap._StrokewidthPicker($0);
this.$19.$B(this.$C.get_$1(), 'Izbira debeline');
this.$19.get_$A().className = 'PaletteContainer';
this.$19.$C($0);
this.$19.$11(Delegate.create(this, this.$55));
},
$53: function () {
if (!isNullOrUndefined(this.$19)) {
this.$19.$16();
this.$19 = null;
}
this.$35(null);
},
$54: function ($p0, $p1) {
this.$44();
this.$35(null);
if (!isNullOrUndefined(this.$9)) {
this.$3.setStyle($p0);
this.$56();
var $0 = this.$2;
this.$43();
this.$3D($0);
}
},
$55: function ($p0, $p1) {
this.$44();
this.$35(null);
if (!isNullOrUndefined(this.$8)) {
this.$3.setStyle($p0);
this.$56();
}
if (!isNullOrUndefined(this.$9) && Type.canCast(this.$F, RMap.TextSymbolPointStyle)) {
if ($p1 === 4096) {
(this.$F).style['background'] = ($p0).fillColor.toString();
}
if ($p1 === 256) {
(this.$F).style['border'] = ($p0).strokeColor.toString() + ' ' + (this.$2.$1().currentStyle).borderWidth + ' ' + (this.$2.$1().currentStyle).borderStyle;
}
if ($p1 === 1024) {
(this.$F).style['border'] = (this.$2.$1().currentStyle).borderColor + ' ' + ($p0).strokeWidth.toString() + 'px solid';
}
this.$3.setStyle(this.$F);
this.$56();
var $0 = this.$2;
this.$43();
this.$3D($0);
}
},
$56: function () {
this.$29 = true;
if (!isNullOrUndefined(this.$3)) {
this.$3.update();
}
this.$29 = false;
},
$57: function () {
if (isNullOrUndefined(this.$2)) {
return;
}
this.$44();
this.$6 = 65536;
this.$E = new RMap._AttributeEditor(this);
this.$C.get_$1().appendChild(this.$E.attach(this.$0));
this.$E.$D(this.$2);
this.$25.style.backgroundColor = this.$1A;
return;
},
$58: function () {
if (!isNullOrUndefined(this.$E)) {
if (!this.$E.$18()) {
this.$E.$19();
}
this.$E = null;
}
},
$59: function () {
this.$2E();
this.$2A = null;
this.$2B = null;
this.$2C = null;
this.$0.removeLayer(this.$5.getId());
this.$5.$3();
this.$5 = null;
this.$4.$2();
this.$4 = null;
if (this.$D) {
this.$D.$7();
this.$D = null;
}
this.$C.get_$1().detachEvent('onmousedown', Delegate.create(this, this.$33));
this.$C.get_$1().detachEvent('onmouseup', Delegate.create(this, this.$33));
this.$C.get_$1().detachEvent('ondblclick', Delegate.create(this, this.$33));
this.$1D.detachEvent('onclick', Delegate.create(this, this.$37));
this.$1E.detachEvent('onclick', Delegate.create(this, this.$38));
this.$1F.detachEvent('onclick', Delegate.create(this, this.$39));
this.$20.detachEvent('onclick', Delegate.create(this, this.$46));
this.$21.detachEvent('onclick', Delegate.create(this, this.$47));
this.$22.detachEvent('onclick', Delegate.create(this, this.$48));
this.$23.detachEvent('onclick', Delegate.create(this, this.$49));
this.$24.detachEvent('onclick', Delegate.create(this, this.$4A));
this.$27.detachEvent('onclick', Delegate.create(this, this.$45));
this.$26.detachEvent('onclick', Delegate.create(this, this.$4B));
this.$5A(this.$1D);
this.$5A(this.$1E);
this.$5A(this.$1F);
this.$5A(this.$20);
this.$5A(this.$21);
this.$5A(this.$22);
this.$5A(this.$23);
this.$5A(this.$24);
this.$5A(this.$27);
this.$5A(this.$26);
this.$C.$4();
this.$C = null;
},
$5A: function ($p0) {
if (!isNullOrUndefined($p0.parentNode)) {
$p0.parentNode.removeChild($p0);
}
$p0 = null;
}
}
RMap._EditLayer = function (id, featureView, styler) {
RMap._EditLayer.constructBase(this, [
id,
featureView,
styler,
null
]);
}
RMap._EditLayer.prototype = {
$3D: 'mySingleElement',
$3E: function ($p0) {
(this._complexDrawings).add($p0);
$p0.$2(this);
this.drawings[this.$3D] = $p0;
},
$3F: function ($p0) {
(this._simpleDrawings).add($p0);
$p0.$2(this);
this.drawings[this.$3D] = $p0;
},
$40: function () {
(this._simpleDrawings).clear();
this.drawings[this.$3D] = null;
(this._complexDrawings).clear();
this.drawings[this.$3D] = null;
},
$41: function ($p0, $p1) {
return;
}
}
RMap.MouseEventArgs = function (worldLocation, displayLocation, action, userData) {
RMap.MouseEventArgs.constructBase(this);
this.worldLocation = worldLocation;
this.displayLocation = displayLocation;
this.action = action;
this.userData = userData;
}
RMap.MouseEventArgs.prototype = {
worldLocation: null,
displayLocation: null,
action: 0,
userData: null
}
RMap._MouseTool = function (map) {
this.$B = - 1;
this.$C = - 1;
this.$0 = map;
this.$D = Delegate.create(this, this.$20);
this.$E = Delegate.create(this, this.$22);
this.$F = Delegate.create(this, this.$25);
this.$10 = Delegate.create(this, this.$28);
this.$11 = Delegate.create(this, this.$2A);
this.$12 = Delegate.create(this, this.$2C);
this.$13 = Delegate.create(this, this.$2D);
this.$14 = Delegate.create(this, this.$21);
this.$15 = Delegate.create(this, this.$24);
this.$16 = Delegate.create(this, this.$27);
}
RMap._MouseTool.prototype = {
$0: null,
$1: 0,
$2: null,
$3: null,
$4: null,
$5: null,
$6: 'none',
$7: false,
$8: false,
$9: false,
$A: null,
$D: null,
$E: null,
$F: null,
$10: null,
$11: null,
$12: null,
$13: null,
$14: null,
$15: null,
$16: null,
add_$17: function ($p0) {
this.$18 = Delegate.combine(this.$18, $p0);
},
remove_$17: function ($p0) {
this.$18 = Delegate.remove(this.$18, $p0);
},
$18: null,
add_$19: function ($p0) {
this.$1A = Delegate.combine(this.$1A, $p0);
},
remove_$19: function ($p0) {
this.$1A = Delegate.remove(this.$1A, $p0);
},
$1A: null,
$1B: function () {
this.$1D();
this.$D = null;
this.$E = null;
this.$F = null;
this.$10 = null;
this.$11 = null;
this.$12 = null;
this.$13 = null;
this.$14 = null;
this.$15 = null;
this.$16 = null;
this.$18 = null;
this.$1A = null;
this.$0 = null;
},
$1C: function () {
if (this.$7) {
return;
}
this.$0.$D.attachEvent('onclick', this.$D);
this.$0.$D.attachEvent('onmousedown', this.$E);
this.$0.$D.attachEvent('onmousemove', this.$F);
this.$0.$D.attachEvent('onmouseup', this.$10);
this.$0.$D.attachEvent('ondblclick', this.$11);
this.$0.$D.attachEvent('onmousewheel', this.$12);
this.$0.$D.attachEvent('oncontextmenu', this.$13);
try {
this.$0.$D.attachEvent('ontouchstart', this.$14);
this.$0.$D.attachEvent('ontouchmove', this.$15);
this.$0.$D.attachEvent('ontouchend', this.$16);
} catch ($0) {
}
this.$7 = true;
},
$1D: function () {
if (!this.$7) {
return;
}
if (this.$6 !== 'none') {
this.$29(window.event);
}
this.$0.$D.detachEvent('onclick', this.$D);
this.$0.$D.detachEvent('onmousedown', this.$E);
this.$0.$D.detachEvent('onmousemove', this.$F);
this.$0.$D.detachEvent('onmouseup', this.$10);
this.$0.$D.detachEvent('ondblclick', this.$11);
this.$0.$D.detachEvent('onmousewheel', this.$12);
this.$0.$D.detachEvent('oncontextmenu', this.$13);
try {
this.$0.$D.detachEvent('ontouchstart', this.$14);
this.$0.$D.detachEvent('ontouchmove', this.$15);
this.$0.$D.detachEvent('ontouchend', this.$16);
} catch ($0) {
}
this.$7 = false;
},
$1E: function ($p0) {
if (!this.$18 || this.$0.$48() === 1) {
return;
}
var $0 = this.$4;
if ($p0 === 1) {
$0 = this.$3;
}
if (!$0) {
return;
}
var $1 = this.$0.$39().$17($0);
$1 = RMap.CoordinateSystem.$4($1, this.$0.$39().$E(), this.$0.getDefaultCoordinateSystem());
var $2 = this.$0.$16['userData'];
if ($2 && !isNullOrUndefined($2['drawing'])) {
var $3 = $2['drawing'];
$1 = RMap.CoordinateSystem.$4($1, this.$0.getDefaultCoordinateSystem(), $3.getFeature().$7());
$1 = $3.getGeometry().$7($1);
$1 = RMap.CoordinateSystem.$4($1, $3.getFeature().$7(), this.$0.getDefaultCoordinateSystem());
}
this.$0.$16['userData'] = null;
this.$18.invoke(this.$0, new RMap.MouseEventArgs($1, $0, $p0, $2));
},
$1F: function () {
if (!this.$1A || this.$0.$48() === 1) {
return;
}
var $0 = this.$4;
var $1 = this.$0.$39().$17($0);
$1 = RMap.CoordinateSystem.$4($1, this.$0.$39().$E(), this.$0.getDefaultCoordinateSystem());
var $2 = this.$0.$16['userData'];
this.$0.$16['userData'] = null;
this.$1A.invoke(this.$0, new RMap.MouseEventArgs($1, $0, 2, $2));
},
$20: function () {
RMap._DomHelper.$B();
this.$1E(4);
},
$21: function () {
this.$8 = true;
this.$9 = true;
var $0 = window.event;
if ($0.srcElement !== this.$0.$5 && $0.srcElement !== this.$0.$9) {
return;
}
var $1 = $0.touches;
if (!$1 || $1.length < 1) {
return;
}
if ($0.preventDefault) {
$0.preventDefault();
}
var $2 = Date.get_now().getTime();
if ($2 - this.$B < 250) {
var $3 = 1;
if ($2 - this.$C < 250) {
$1[0].ctrlKey = true;
$3 = 4;
}
this.$C = $2;
this.$2B($1[0], true, $3);
} else {
this.$23($1[0]);
this.$A = ScriptFX.UI.$create_Location(this.$3.left, this.$3.top);
}
this.$B = $2;
},
$22: function () {
this.$8 = false;
this.$23(window.event);
},
$23: function ($p0) {
if (ScriptFX.Application.current.get_host().get_name() === 4 && $p0 && $p0.button === 2) {
this.$2D();
return;
}
RMap._DomHelper.$B();
RMap._DomHelper.$C(this.$0.$D);
this.$1 = 1;
this.$3 = RMap._DomHelper.$9($p0, this.$0.$D);
this.$2 = ScriptFX.UI.$create_Location(this.$3.left, this.$3.top);
if (this.$0.$48() !== 4) {
this.$6 = 'pan';
if (this.$0.$22) {
try {
this.$0.$C.style.cursor = 'url(\'' + RMap.MapApplication.resourcesUrl + 'Cursors/dragMapCursor.cur\'), default';
} catch ($0) {
}
}
}
this.$4 = null;
this.$1E(1);
this.$0.$D.focus();
},
$24: function () {
var $0 = window.event;
var $1 = $0.touches;
if (!$1 || $1.length < 1) {
return;
}
if ($0.preventDefault) {
$0.preventDefault();
}
this.$26($1[0], true);
},
$25: function () {
if (!this.$8) {
this.$26(window.event, false);
}
},
$26: function ($p0, $p1) {
this.$8 = false;
this.$A = null;
RMap._DomHelper.$B();
this.$1 = this.$1 | 2;
this.$4 = RMap._DomHelper.$9($p0, this.$0.$D);
if (this.$9 && !$p1 && this.$6 === 'pan' && this.$5) {
if (Math.abs(this.$4.left - this.$5.left) > 50 || Math.abs(this.$4.top - this.$5.top) > 50) {
this.$5 = this.$4;
return;
}
}
this.$5 = this.$4;
if (this.$0.$48() === 4) {
this.$6 = 'none';
this.$1E(64);
} else {
if (this.$6 === 'pan') {
this.$0.$46(true);
this.$0.panPixels(this.$3.left - this.$4.left, this.$4.top - this.$3.top);
this.$3 = this.$4;
}
this.$1F();
}
},
$27: function () {
var $0 = window.event;
if ($0.preventDefault) {
$0.preventDefault();
}
var $1 = $0.changedTouches;
if ($1 && $1.length > 0) {
this.$29($1[0]);
}
},
$28: function () {
this.$29(window.event);
if (ScriptFX.Application.current.get_host().get_name() === 3 && window.event && window.event.button === 2 && window.event.which === 3) {
this.$2D();
}
},
$29: function ($p0) {
this.$8 = false;
this.$9 = false;
RMap._DomHelper.$B();
if (this.$6 === 'pan') {
this.$0.$46(false);
if (this.$0.$22) {
this.$0.$C.style.cursor = RMap.Browser.crsPointer;
}
}
RMap._DomHelper.$D(this.$0.$D);
this.$1 = 0;
this.$4 = RMap._DomHelper.$9($p0, this.$0.$D);
if (this.$A) {
this.$0.closeInfoWindow();
}
this.$A = null;
this.$6 = 'none';
this.$1E(0);
if (ScriptFX.Application.current.get_host().get_name() === 4 && $p0 && !$p0.button && $p0.ctrlKey) {
this.$2D();
}
},
$2A: function () {
this.$2B(window.event, false, 1);
},
$2B: function ($p0, $p1, $p2) {
RMap._DomHelper.$B();
this.$4 = RMap._DomHelper.$9($p0, this.$0.$4);
if (this.$0.$48() !== 4) {
if ($p0.shiftKey || $p0.ctrlKey || $p1) {
if ($p2 === 99) {
this.$0.setDefaultView();
} else if ($p0.ctrlKey) {
this.$0.$25 = this.$0.$39().$17(this.$4);
this.$0.zoomOut($p2);
} else {
this.$0.$25 = this.$0.$39().$17(this.$4);
this.$0.zoomIn($p2);
}
} else {
this.$0.panPixels(this.$4.left - this.$0.$4.clientWidth / 2, this.$0.$4.clientHeight / 2 - this.$4.top);
}
}
this.$1E(8);
},
$2C: function () {
RMap._DomHelper.$B();
var $0 = window.event;
if ($0.preventDefault) {
$0.preventDefault();
}
if (this.$6 !== 'none') {
return;
}
if (!this.$4) {
return;
}
var $1 = RMap._DomHelper.$A(window.event);
if (!$1) {
return;
}
if (!window.event.shiftKey && this.$0.$22) {
this.$0.$25 = this.$0.$39().$17(this.$4);
}
this.$1E(32);
if ($1 > 0) {
this.$0.zoomIn(1);
} else if ($1 < 0) {
this.$0.zoomOut(1);
}
this.$0.$D.focus();
},
$2D: function () {
RMap._DomHelper.$B();
this.$4 = RMap._DomHelper.$9(window.event, this.$0.$D);
if (this.$0.$16['preventContext']) {
this.$0.$16['preventContext'] = null;
} else {
this.$1E(16);
}
}
}
RMap._PaletteCollection = function () {
this.$0 = {
};
this.$1 = new Array(0);
}
RMap._PaletteCollection.prototype = {
$2: function ($p0) {
this.$0[$p0.get_id()] = $p0;
(this.$1).add($p0);
},
$3: function ($p0) {
return this.$0[$p0];
},
$4: function ($p0) {
return this.$1[$p0];
},
$5: function () {
return this.$1;
},
$6: function () {
return this.$1.length;
},
$7: function () {
}
}
RMap._Palette = function (id, description) {
this.$2 = {
};
this.$3 = new Array(0);
this.$0 = id;
this.$1 = description;
}
RMap._Palette.prototype = {
$0: null,
$1: null,
$4: null,
$5: null,
$6: null,
get_id: function () {
return this.$0;
},
set_id: function ($p0) {
this.$0 = $p0;
return $p0;
},
get_$7: function () {
return this.$1;
},
set_$7: function ($p0) {
this.$1 = $p0;
return $p0;
},
$8: function ($p0) {
this.$2[$p0.get_id()] = $p0;
(this.$3).add($p0);
},
$9: function ($p0, $p1) {
this.$8(new RMap._PaletteItem($p0, $p1, this));
},
$A: function ($p0) {
return this.$2[$p0];
},
$B: function ($p0) {
return this.$3[$p0];
},
$C: function () {
return this.$3;
},
$D: function () {
return this.$3.length;
}
}
RMap._PaletteItem = function (id, src, palette) {
this.$0 = id;
this.$1 = src;
this.$2 = palette;
}
RMap._PaletteItem.prototype = {
$0: null,
$1: null,
$2: null,
get_id: function () {
return this.$0;
},
set_id: function ($p0) {
this.$0 = $p0;
return $p0;
},
get_$3: function () {
return this.$1;
},
set_$3: function ($p0) {
this.$1 = $p0;
return $p0;
},
$4: function () {
return this.$2;
}
}
RMap._Container = function (parentContainer) {
this.$0 = document.createElement('div');
if (parentContainer) {
parentContainer.appendChild(this.$0);
} else {
document.body.appendChild(this.$0);
this.$0.style.position = 'absolute';
this.$0.style.zIndex = 999;
}
}
RMap._Container.prototype = {
$0: null,
get_$1: function () {
return this.$0;
},
set_$1: function ($p0) {
this.$0 = $p0;
return $p0;
},
$2: function ($p0) {
this.$0.style.left = $p0.left.toString() + 'px';
this.$0.style.top = $p0.top.toString() + 'px';
},
$3: function ($p0) {
this.$0.style.width = $p0.width.toString() + 'px';
this.$0.style.height = $p0.height.toString() + 'px';
},
$4: function () {
if (!isNullOrUndefined(this.$0.parentNode)) {
this.$0.parentNode.removeChild(this.$0);
}
this.$0 = null;
}
}
RMap._Picker = function (style, type) {
this.$5 = new Array(0);
this.$0 = style;
this.$7 = type;
}
RMap._Picker.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$6: null,
$7: 0,
$8: null,
$9: 0,
get_$A: function () {
return this.$2;
},
set_$A: function ($p0) {
this.$2 = $p0;
return $p0;
},
$B: function ($p0, $p1) {
this.$1 = new RMap._Container($p0);
this.$2 = this.$1.get_$1();
this.$2.style.visibility = 'hidden';
this.$4 = document.createElement('hr');
this.$2.appendChild(this.$4);
this.$3 = document.createElement('div');
this.$10();
this.$2.appendChild(this.$3);
if (this.$9) {
window.clearTimeout(this.$9);
}
this.$9 = window.setTimeout(Delegate.create(this, this.$E), 0);
},
$C: function ($p0) {
for (var $0 = 0; $0 < this.$5.length; $0++) {
if (this.$5[$0].$4($p0)) {
this.$F(this.$5[$0]);
} else {
this.$5[$0].$8();
}
}
},
$D: function ($p0) {
for (var $0 = 0; $0 < this.$5.length; $0++) {
if ($0 === $p0) {
this.$F(this.$5[$0]);
}
}
},
$E: function () {
if (this.$3.offsetHeight > 200) {
this.$3.style.overflowY = 'auto';
this.$3.style.height = '200px';
}
this.$2.style.visibility = 'visible';
},
$F: function ($p0) {
for (var $0 = 0; $0 < this.$5.length; $0++) {
this.$5[$0].$8();
}
$p0.$7();
this.$12($p0);
this.$8 = $p0;
},
$10: function () {
},
$11: function ($p0) {
this.$6 = $p0;
},
$12: function ($p0) {
if (!isNullOrUndefined(this.$6)) {
this.$6.invoke($p0.$5(this.$0), this.$7);
}
},
$13: function ($p0) {
this.$1.$2($p0);
},
$14: function ($p0) {
this.$1.$3($p0);
},
$15: function () {
for (var $0 = 0; $0 < this.$5.length; $0++) {
this.$5[$0].$A();
this.$5[$0] = null;
}(this.$5).clear();
this.$3.style.height = '';
},
$16: function () {
if (this.$9) {
window.clearTimeout(this.$9);
}
this.$15();
this.$2.removeChild(this.$4);
this.$2.removeChild(this.$3);
this.$3 = null;
this.$4 = null;
this.$1.$4();
this.$1 = null;
this.$2 = null;
this.$6 = null;
this.$0 = null;
}
}
RMap._PickerItem = function (picker, referece, parentContainer) {
this.$1 = picker;
this.$2 = referece;
this.$0 = document.createElement('div');
this.$0.style.padding = this.$3 + 'px';
this.$0.style.cursor = RMap.Browser.crsPointer;
this.$0.attachEvent('onclick', Delegate.create(this, this.$9));
parentContainer.appendChild(this.$0);
}
RMap._PickerItem.prototype = {
$0: null,
$1: null,
$2: null,
$3: 0,
$4: function ($p0) {
return false;
},
$5: function ($p0) {
return $p0;
},
$6: function () {
return this.$2;
},
$7: function () {
this.$0.style.border = '#00ff00 ' + this.$3 + 'px solid';
this.$0.style.padding = '0px';
},
$8: function () {
this.$0.style.border = '';
this.$0.style.padding = this.$3 + 'px';
},
$9: function () {
this.$1.$F(this);
},
$A: function () {
this.$0.detachEvent('onclick', Delegate.create(this, this.$9));
this.$0.parentNode.removeChild(this.$0);
this.$0 = null;
this.$2 = null;
this.$1 = null;
}
}
RMap._PalettePicker = function (style, collection) {
RMap._PalettePicker.constructBase(this, [
style,
224
]);
this.$18 = collection;
this.$19 = document.createElement('select');
this.$19.style.width = '100%';
this.$19.attachEvent('onchange', Delegate.create(this, this.$1A));
}
RMap._PalettePicker.prototype = {
$17: null,
$18: null,
$19: null,
$1A: function () {
var $0 = new RMap.ImageSymbolPointStyle();
$0.iconSrc = this.$19.options[this.$19.selectedIndex].innerHTML;
this.$C($0);
},
$10: function () {
this.$4.style.display = 'none';
this.$3.appendChild(this.$19);
if (this.$18) {
for (var $0 = 0; $0 < (this.$18).$6(); $0++) {
var $1 = new RMap._PalettepickerItem(this, (this.$18).$4($0), this.$19);
(this.$5).add($1);
}
}
},
$1B: function ($p0) {
this.$17 = $p0;
},
$12: function ($p0) {
if (!isNullOrUndefined(this.$6)) {
this.$6.invoke($p0.$5(this.$0), 224);
}
if (!isNullOrUndefined(this.$17)) {
this.$17.invoke($p0.$6());
}
},
$16: function () {
this.$17 = null;
this.$18 = null;
this.$19.detachEvent('onchange', Delegate.create(this, this.$1A));
this.$3.removeChild(this.$19);
RMap._PalettePicker.callBase(this, '$16');
this.$19 = null;
}
}
RMap._PalettepickerItem = function (picker, palette, parentContainer) {
RMap._PalettepickerItem.constructBase(this, [
picker,
palette,
parentContainer
]);
parentContainer.removeChild(this.$0);
this.$0 = null;
this.$0 = document.createElement('option');
parentContainer.appendChild(this.$0);
this.$0.innerHTML = palette.get_$7();
this.$0.style.cursor = RMap.Browser.crsPointer;
this.$0.value = palette.get_id();
this.$0.selected = false;
}
RMap._PalettepickerItem.prototype = {
$4: function ($p0) {
if (($p0).iconSrc === this.$0.innerHTML) {
return true;
}
var $0 = window.location.href;
if ($0.indexOf('?') > - 1) {
$0 = $0.substring(0, $0.indexOf('?'));
}
var $1 = $0.split('/');
$1[$1.length - 1] = '';
var $2 = $1.join('/');
for (var $3 = 0; $3 < (this.$2).$D(); $3++) {
if (($p0).iconSrc === (this.$2).$B($3).get_$3() || ($p0).iconSrc === $2 + (this.$2).$B($3).get_$3()) {
return true;
}
}
return false;
},
$5: function ($p0) {
($p0).anchor = (this.$2).$4;
($p0).infoWindowAnchor = (this.$2).$5;
return $p0;
},
$7: function () {
this.$0.selected = true;
},
$8: function () {
this.$0.selected = false;
}
}
RMap._IconPicker = function (style, collection) {
RMap._IconPicker.constructBase(this, [
style,
224
]);
this.$17 = new RMap._PalettePicker(style, collection);
this.$17.$1B(Delegate.create(this, this.$19));
this.$18 = document.createElement('hr');
}
RMap._IconPicker.prototype = {
$17: null,
$18: null,
$10: function () {
this.$17.$B(this.get_$A(), null);
this.$17.get_$A().className = '';
if (this.$17.$5.length < 2) {
this.$17.get_$A().style.display = 'none';
} else {
this.get_$A().appendChild(this.$18);
}
this.$17.$D(0);
},
$C: function ($p0) {
this.$17.$C($p0);
RMap._IconPicker.callBase(this, '$C', [
$p0
]);
},
$19: function ($p0) {
this.$15();
this.$8 = null;
for (var $0 = 0; $0 < $p0.$D(); $0++) {
var $1 = new RMap._IconpickerItem(this, $p0.$B($0), this.$3);
(this.$5).add($1);
if ($1.$4(this.$0)) {
$1.$7();
this.$8 = $1;
}
}
if (this.$9) {
window.clearTimeout(this.$9);
}
this.$9 = window.setTimeout(Delegate.create(this, this.$E), 0);
},
$16: function () {
if (!isNullOrUndefined(this.$18)) {
if (this.$18.parentNode) {
this.$18.parentNode.removeChild(this.$18);
}
this.$18 = null;
}
this.$17.$16();
this.$17 = null;
RMap._IconPicker.callBase(this, '$16');
}
}
RMap._IconpickerItem = function (picker, item, parentContainer) {
RMap._IconpickerItem.constructBase(this, [
picker,
item,
parentContainer
]);
this.$0.style.display = 'inline';
this.$0.innerHTML = '<image src=\'' + item.get_$3() + '\' title=\'' + item.get_id() + '\' style=\'width:' + item.$4().$6.width.toString() + 'px; height:' + item.$4().$6.height.toString() + 'px;\'/>';
}
RMap._IconpickerItem.prototype = {
$B: 3,
$4: function ($p0) {
var $0 = window.location.href;
if ($0.indexOf('?') > - 1) {
$0 = $0.substring(0, $0.indexOf('?'));
}
var $1 = $0.split('/');
$1[$1.length - 1] = '';
var $2 = $1.join('/');
if (($p0).iconSrc === (this.$2).get_$3() || ($p0).iconSrc === $2 + (this.$2).get_$3()) {
return true;
} else {
return false;
}
},
$5: function ($p0) {
($p0).iconSrc = (this.$2).get_$3();
($p0).iconSize = (this.$2).$4().$6;
($p0).anchor = (this.$2).$4().$4;
($p0).infoWindowAnchor = (this.$2).$4().$5;
return $p0;
},
$7: function () {
this.$0.firstChild.style.border = '#00ff00 ' + this.$B + 'px solid';
this.$0.firstChild.style.padding = '0px';
},
$8: function () {
this.$0.firstChild.style.border = '';
this.$0.firstChild.style.padding = this.$B + 'px';
}
}
RMap._ColorPicker = function (style, type) {
RMap._ColorPicker.constructBase(this, [
style,
type
]);
this.$17 = type;
}
RMap._ColorPicker.prototype = {
$17: 0,
$18: null,
$19: null,
$1A: null,
$10: function () {
var $0 = [
'transparent',
'#000000',
'#555555',
'#aaaaaa',
'#dddddd',
'#ffffff',
'#ff0000',
'#00ff00',
'#0000ff',
'#ffff00',
'#ff00ff',
'#00ffff'
];
if (this.$17 === 256) {
($0).removeAt(0);
}
var $1 = (this.$0).fillColor;
if (this.$17 === 256) {
$1 = (this.$0).strokeColor;
}
if (isNull($1) || $1 === 'undefined') {
$1 = '#000000';
}
var $2 = false;
for (var $3 = 0; $3 < $0.length; $3++) {
var $4 = new RMap._ColorpickerItem(this, $0[$3], this.$3);
(this.$5).add($4);
if ($1 === $0[$3]) {
$2 = true;
}
}
if (!$2) {
var $5 = new RMap._ColorpickerItem(this, $1, this.$3);
(this.$5).add($5);
}
this.$18 = document.createElement('br');
this.$3.appendChild(this.$18);
this.$19 = document.createElement('span');
this.$19.innerHTML = 'curent color:&#160;';
this.$3.appendChild(this.$19);
this.$1A = document.createElement('input');
this.$1A.type = 'text';
this.$1A.value = $1;
this.$1A.style.width = '50px';
this.$3.appendChild(this.$1A);
},
$16: function () {
this.$19.parentNode.removeChild(this.$19);
this.$19 = null;
this.$1A.parentNode.removeChild(this.$1A);
this.$1A = null;
this.$18.parentNode.removeChild(this.$18);
this.$18 = null;
RMap._ColorPicker.callBase(this, '$16');
}
}
RMap._ColorpickerItem = function (picker, color, parentContainer) {
RMap._ColorpickerItem.constructBase(this, [
picker,
color,
parentContainer
]);
if (color.toLowerCase() === 'transparent') {
this.$B = '../resources/editcontrol/color_transparent.gif';
}
this.$0.style.display = 'inline';
this.$8();
}
RMap._ColorpickerItem.prototype = {
$B: 'blank.gif',
$4: function ($p0) {
if ((this.$1).$17 === 4096 && ($p0).fillColor === this.$2) {
return true;
} else if ((this.$1).$17 === 256 && ($p0).strokeColor === this.$2) {
return true;
} else {
return false;
}
},
$5: function ($p0) {
if ((this.$1).$17 === 4096) {
($p0).fillColor = this.$2;
} else {
($p0).strokeColor = this.$2;
}
return $p0;
},
$7: function () {
this.$0.innerHTML = '<image src=\'' + this.$B + '\' title=\'' + this.$2 + '\' style=\'border:#00ff00 3px solid; background:' + this.$2 + '; width:12px; height:12px\'/></image>';
},
$8: function () {
this.$0.innerHTML = '<image src=\'' + this.$B + '\' title=\'' + this.$2 + '\' vspace=\'2\' hspace=\'2\' style=\'border:#000000 1px solid; background:' + this.$2 + '; width:12px; height:12px\'/></image>';
}
}
RMap._StroketypePicker = function (style) {
RMap._StroketypePicker.constructBase(this, [
style,
512
]);
}
RMap._StroketypePicker.prototype = {
$10: function () {
var $0 = [
0,
1,
2,
4,
8,
16
];
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = new RMap._StroketypePickerItem(this, $0[$1], this.$3);
(this.$5).add($2);
}
}
}
RMap._StroketypePickerItem = function (picker, type, parentContainer) {
RMap._StroketypePickerItem.constructBase(this, [
picker,
type,
parentContainer
]);
if (ScriptFX.Application.current.get_isIE()) {
this.$0.innerHTML = ('<div style=\'width:' + this.$C + 'px; height:10px\'><v:line from=\'1px,3px\' to=\'' + this.$C + 'px,3px\'><v:stroke color=\'#000000\' weight=\'1\' dashstyle=\'' + RMap._StyleHelper.$0(type, 1) + '\'/></v:line></div>');
} else {
var $0 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'svg');
$0.setAttribute('width', this.$C + 'px');
$0.setAttribute('height', 10 + 'px');
$0.setAttribute('viewBox', '0 0 ' + this.$C + ' 10');
this.$0.appendChild($0);
var $1 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'path');
$1.style.width = this.$C + 'px';
$1.style.height = '10px';
$1.setAttribute('stroke', '#000000');
$1.setAttribute('stroke-dasharray', RMap._StyleHelper.$0(type, 1));
$1.setAttribute('d', 'M 0 3 L ' + this.$C + ' 3');
$0.appendChild($1);
}
this.$0.title = Enum.toString(RMap.StrokeType, type);
}
RMap._StroketypePickerItem.prototype = {
$B: 3,
$C: 190,
$D: null,
$E: null,
$4: function ($p0) {
if (($p0).strokeType === this.$2) {
return true;
} else {
return false;
}
},
$5: function ($p0) {
($p0).strokeType = this.$2;
return $p0;
},
$7: function () {
this.$0.style.border = '#00ff00 ' + this.$B + 'px solid';
this.$0.style.padding = '0px';
},
$8: function () {
this.$0.style.border = '';
this.$0.style.padding = this.$B + 'px';
},
$A: function () {
if (!isNullOrUndefined(this.$D)) {
this.$D.removeChild(this.$E);
this.$E = null;
this.$0.removeChild(this.$D);
this.$D = null;
}
RMap._StroketypePickerItem.callBase(this, '$A');
}
}
RMap._StrokewidthPicker = function (style) {
RMap._StrokewidthPicker.constructBase(this, [
style,
1024
]);
}
RMap._StrokewidthPicker.prototype = {
$10: function () {
var $0 = [
1,
2,
3,
5,
8
];
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = new RMap._StrokewidthPickerItem(this, $0[$1], this.$3);
(this.$5).add($2);
}
}
}
RMap._StrokewidthPickerItem = function (picker, width, parentContainer) {
RMap._StrokewidthPickerItem.constructBase(this, [
picker,
width,
parentContainer
]);
if (ScriptFX.Application.current.get_isIE()) {
this.$0.innerHTML = ('<div style=\'width:' + this.$C + 'px; height:' + (width + 5) + 'px\'><v:line from=\'1px,3px\' to=\'' + this.$C + 'px,3px\'><v:stroke color=\'#000000\' weight=\'' + width + '\'/></v:line></div>');
} else {
var $0 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'svg');
$0.setAttribute('width', this.$C + 'px');
$0.setAttribute('height', (width + 5) + 'px');
$0.setAttribute('viewBox', '0 0 ' + this.$C + ' ' + (width + 5));
this.$0.appendChild($0);
var $1 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'path');
$1.style.width = this.$C + 'px';
$1.style.height = (width + 5) + 'px';
$1.setAttribute('stroke', '#000000');
$1.setAttribute('stroke-width', width);
$1.setAttribute('d', 'M 0 3 L ' + this.$C + ' 3');
$0.appendChild($1);
}
this.$0.title = width.toString();
}
RMap._StrokewidthPickerItem.prototype = {
$B: 3,
$C: 190,
$D: null,
$E: null,
$4: function ($p0) {
if (($p0).strokeWidth === this.$2) {
return true;
} else {
return false;
}
},
$5: function ($p0) {
($p0).strokeWidth = this.$2;
return $p0;
},
$7: function () {
this.$0.style.border = '#00ff00 ' + this.$B + 'px solid';
this.$0.style.padding = '0px';
},
$8: function () {
this.$0.style.border = '';
this.$0.style.padding = this.$B + 'px';
},
$A: function () {
if (!isNullOrUndefined(this.$D)) {
this.$D.removeChild(this.$E);
this.$E = null;
this.$0.removeChild(this.$D);
this.$D = null;
}
RMap._StrokewidthPickerItem.callBase(this, '$A');
}
}
RMap._EditVertex = function (coord, parentClass) {
this.$2 = coord;
this.$0 = parentClass;
if (ScriptFX.Application.current.get_isIE()) {
this.$1 = new RMap._VMLGraphics(3);
} else {
this.$1 = new RMap._SVGGraphics(3);
}
this.$1.$4(this.$0.$11);
this.$1.$1.style.cursor = RMap.Browser.crsPointer;
this.$0.$F.appendChild(this.$1.$1);
this.$9();
this.$7();
}
RMap._EditVertex.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: function () {
this.$4 = Delegate.create(this, this.$B);
this.$5 = Delegate.create(this, this.$A);
this.$6 = Delegate.create(this, this.$C);
this.$1.$1.attachEvent('onmousedown', this.$4);
this.$1.$1.attachEvent('onmouseover', this.$5);
this.$1.$1.attachEvent('onmouseout', this.$6);
},
$8: function () {
this.$1.$1.detachEvent('onmousedown', this.$4);
this.$1.$1.detachEvent('onmouseover', this.$5);
this.$1.$1.detachEvent('onmouseout', this.$6);
this.$4 = null;
this.$5 = null;
this.$6 = null;
},
$9: function () {
this.$3 = this.$0.$8.$39().$14(this.$2);
this.$3.x = Math.round(this.$3.x);
this.$3.y = Math.round(this.$3.y);
var $0 = new Array(1);
$0[0] = [
this.$3.x - this.$0.$16,
this.$3.y - this.$0.$16,
this.$3.x - this.$0.$16,
this.$3.y + this.$0.$16,
this.$3.x + this.$0.$16,
this.$3.y + this.$0.$16,
this.$3.x + this.$0.$16,
this.$3.y - this.$0.$16,
this.$3.x - this.$0.$16,
this.$3.y - this.$0.$16
];
this.$1.$2($0, 3);
},
$A: function () {
if (this.$0.get_$1D()) {
this.$1.$1.style.cursor = RMap.Browser.crsPointer;
this.$1.$4(this.$0.$12);
} else {
this.$1.$1.style.cursor = 'default';
this.$C();
}
},
$B: function () {
if (this.$0.get_$1D()) {
var $0 = window.event.button;
RMap._DomHelper.$B();
if ((ScriptFX.Application.current.get_isIE() && $0 === 1) || (!ScriptFX.Application.current.get_isIE() && !$0)) {
this.$0.$22(this);
}
if (window.event.button === 2) {
this.$0.$28(this);
}
}
},
$C: function () {
this.$1.$4(this.$0.$11);
},
$D: function ($p0) {
if ($p0) {
try {
this.$0.$8.$D.style.cursor = 'url(\'' + RMap.MapApplication.resourcesUrl + 'EditControl/anchor.cur\'), default';
} catch ($0) {
}
this.$0.$F.appendChild(this.$1.$1);
RMap._DomHelper.$C(this.$0.$8.$D);
this.$A();
} else {
this.$0.$8.$D.style.cursor = 'default';
this.$1.$4(this.$0.$11);
}
},
$E: function ($p0) {
if ($p0) {
this.$1.$1.style.display = '';
} else {
this.$1.$1.style.display = 'none';
}
},
$F: function () {
this.$8();
this.$1.$5();
this.$1 = null;
this.$2 = null;
this.$3 = null;
this.$0 = null;
}
}
RMap._EditLine = function (coordsA, coordsB, parentClass) {
this.$2 = coordsA;
this.$3 = coordsB;
this.$0 = parentClass;
if (ScriptFX.Application.current.get_isIE()) {
this.$1 = new RMap._VMLGraphics(2);
} else {
this.$1 = new RMap._SVGGraphics(2);
}
this.$1.$4(this.$0.$13);
this.$1.$1.style.cursor = RMap.Browser.crsPointer;
this.$0.$10.appendChild(this.$1.$1);
this.$B();
this.$9();
}
RMap._EditLine.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: function () {
this.$6 = Delegate.create(this, this.$D);
this.$7 = Delegate.create(this, this.$C);
this.$8 = Delegate.create(this, this.$E);
this.$1.$1.attachEvent('onmousedown', this.$6);
this.$1.$1.attachEvent('onmouseover', this.$7);
this.$1.$1.attachEvent('onmouseout', this.$8);
},
$A: function () {
this.$1.$1.detachEvent('onmousedown', this.$6);
this.$1.$1.detachEvent('onmouseover', this.$7);
this.$1.$1.detachEvent('onmouseout', this.$8);
this.$6 = null;
this.$7 = null;
this.$8 = null;
},
$B: function () {
this.$4 = this.$0.$8.$39().$14(this.$2);
this.$4.x = Math.round(this.$4.x);
this.$4.y = Math.round(this.$4.y);
this.$5 = this.$0.$8.$39().$14(this.$3);
this.$5.x = Math.round(this.$5.x);
this.$5.y = Math.round(this.$5.y);
var $0 = RMap._GeometryOperation.$2([this.$4.x,
this.$4.y,
this.$5.x,
this.$5.y], this.$0.$8.$39().$13(), 2, false);
this.$1.$2($0, 2);
},
$C: function () {
if (this.$0.get_$1D()) {
this.$1.$1.style.cursor = RMap.Browser.crsPointer;
this.$1.$4(this.$0.$14);
} else {
this.$1.$1.style.cursor = 'default';
this.$E();
}
},
$D: function () {
if (this.$0.get_$1D()) {
RMap._DomHelper.$B();
if ((ScriptFX.Application.current.get_isIE() && window.event.button === 1) || (!ScriptFX.Application.current.get_isIE() && !window.event.button)) {
this.$0.$29(this, RMap._DomHelper.$9(window.event, this.$0.$8.$D));
}
}
},
$E: function () {
this.$1.$4(this.$0.$13);
},
$F: function ($p0) {
if ($p0) {
this.$C();
} else {
this.$E();
}
},
$10: function ($p0) {
if ($p0) {
this.$1.$1.style.display = '';
} else {
this.$1.$1.style.display = 'none';
}
},
$11: function () {
this.$A();
this.$1.$5();
this.$1 = null;
this.$2 = null;
this.$3 = null;
this.$4 = null;
this.$5 = null;
this.$0 = null;
}
}
RMap.FeatureSerializer = function () {
}
RMap.FeatureSerializer.prototype = {
$2: function ($p0) {
return (!isNullOrUndefined($p0)) ? $p0.toString()  : '';
}
}
RMap.GeoRssSerializer = function () {
RMap.GeoRssSerializer.constructBase(this);
}
RMap.GeoRssSerializer.prototype = {
$0: function ($p0) {
var $0 = '<?xml version=\'1.0\' encoding=\'UTF-8\' ?>';
$0 += '<feed xmlns=\'http://www.w3.org/2005/Atom\' xmlns:georss=\'http://www.georss.org/georss\' xmlns:rml=\'http://rmap.realis.si/rml/1.0\'>';
$0 += '<title><![CDATA[' + this.$2($p0.$9['title']) + ']]></title>';
$0 += '<description><![CDATA[' + this.$2($p0.$9['description']) + ']]></description>';
$0 += '<updated>' + Date.get_now().toString() + '</updated>';
for (var $1 = 0; $1 < $p0.getFeatures().length; $1++) {
var $2 = $p0.getFeatures() [$1];
var $3 = $2.geometry.getGeometryType();
var $4 = '<entry>';
$4 += '<id>' + $2.getId() + '</id>';
if ($2.getProperty('title')) {
$4 += '<title><![CDATA[' + $2.getProperty('title') + ']]></title>';
}
if ($2.getProperty('description')) {
$4 += '<description><![CDATA[' + $2.getProperty('description') + ']]></description>';
} else if ($2.getProperty('content')) {
$4 += '<description><![CDATA[' + $2.getProperty('content') + ']]></description>';
}
var $5 = $2.geometry.getCoordinates();
$5 = RMap.CoordinateSystem.transformCS($5, $p0.getSchema().getCoordinateSystem(), RMap.CoordinateSystem.getCoordinateSystem('EPSG:4326'));
$5 = RMap._GeometryOperation.$3($5);
if ($3 === 1) {
$4 += '<georss:point>' + $5[0].toString() + ' ' + $5[1].toString() + '</georss:point>';
} else if ($3 === 2) {
$4 += '<georss:line>' + $5.join(' ') + '</georss:line>';
} else if ($3 === 3) {
$4 += '<georss:polygon>' + $5.join(' ') + '</georss:polygon>';
}
$4 += '</entry>';
$0 += $4;
}
$0 += '</feed>';
return $0;
},
$1: function () {
return 'georss';
}
}
RMap.RmlSerializer = function () {
RMap.RmlSerializer.constructBase(this);
}
RMap.RmlSerializer.prototype = {
$0: function ($p0) {
var $0 = new StringBuilder('<?xml version=\'1.0\' encoding=\'UTF-8\' ?>');
$0.append('<rml xmlns=\'http://rmap.realis.si/rml/1.0\'>');
$0.append('<FeatureData>');
$0.append('<MetaInfo>');
$0.append('<title><![CDATA[' + this.$2($p0.$9['title']) + ']]></title>');
$0.append('<description><![CDATA[' + this.$2($p0.$9['description']) + ']]></description>');
$0.append('<lastUpdate>' + Date.get_now().toString() + '</lastUpdate>');
$0.append('<url>www.realis.si</url>');
$0.append('</MetaInfo>');
$0.append('<Crs crsId=\'' + $p0.getSchema().getCoordinateSystem().crsId.crsCode + '\'/>');
$0.append('<AttSchemas>');
$0.append('<AttSchema id=\'#schema1\'>');
$0.append('<attColumn name=\'title\'/>');
$0.append('<attColumn name=\'description\'/>');
$0.append('<attColumn name=\'content\'/>');
$0.append('<attColumn name=\'link\'/>');
$0.append('<attColumn name=\'image\'/>');
$0.append('</AttSchema>');
$0.append('</AttSchemas>');
$0.append('<Features>');
for (var $1 = 0; $1 < $p0.getFeatures().length; $1++) {
var $2 = $p0.getFeatures() [$1];
var $3 = $2.geometry.getGeometryType();
var $4 = new StringBuilder();
$4.append('<Ftr>');
$4.append('<Att>');
if (!isNullOrUndefined($2.properties['title'])) {
$4.append('<title><![CDATA[' + $2.properties['title'].toString() + ']]></title>');
}
if (!isNullOrUndefined($2.properties['description'])) {
$4.append('<description><![CDATA[' + $2.properties['description'] + ']]></description>');
}
if (!isNullOrUndefined($2.properties['content'])) {
$4.append('<content><![CDATA[' + $2.properties['content'] + ']]></content>');
}
if (!isNullOrUndefined($2.properties['link'])) {
$4.append('<link><![CDATA[' + $2.properties['link'] + ']]></link>');
}
if (!isNullOrUndefined($2.properties['image'])) {
$4.append('<image><![CDATA[' + $2.properties['image'] + ']]></image>');
}
$4.append('</Att>');
$4.append('<Geom>');
if ($3 === 1) {
$4.append('<point>' + $2.geometry.getCoordinates().join(' ') + '</point>');
} else if ($3 === 2) {
$4.append('<line>' + $2.geometry.getCoordinates().join(' ') + '</line>');
} else if ($3 === 3) {
$4.append('<polygon>' + $2.geometry.getCoordinates().join(' ') + '</polygon>');
}
$4.append('</Geom>');
if (!isNullOrUndefined($2.getStyle())) {
$4.append('<Style>');
if ($3 === 1) {
var $5 = ($2.getStyle());
$4.append('<PointStyle>');
$4.append($5.writeToRml());
$4.append('</PointStyle>');
} else {
if ($3 === 3) {
$4.append('<PolygonStyle>');
} else {
$4.append('<LineStyle>');
}
var $6 = ($2.getStyle());
$4.append('<lineProperties');
if (!isNull($6.strokeColor)) {
var $7 = '';
if (!isNull($6.strokeOpacity)) {
var $8 = Math.round($6.strokeOpacity * 255 / 100);
$7 = $8.toString(16);
} else {
$7 = 'ff';
}
if ($6.strokeColor === 'transparent') {
$7 = '00';
}
$4.append(' color=\'' + $7 + $6.strokeColor.substring(1, 7) + '\'');
}
if (!isNull($6.strokeWidth)) {
$4.append(' width=\'' + $6.strokeWidth.toString() + '\'');
}
if (!isNull($6.strokeType)) {
$4.append(' type=\'' + Enum.toString(RMap.StrokeType, $6.strokeType).toUpperCase() + '\'');
}
$4.append('/>');
if ($3 === 3) {
$4.append('<fillProperties');
if (!isNull($6.fillColor)) {
var $9 = '';
if (!isNull($6.strokeOpacity)) {
var $A = Math.round($6.fillOpacity * 255 / 100);
$9 = $A.toString(16);
} else {
$9 = 'ff';
}
if ($6.strokeColor === 'transparent') {
$9 = '00';
}
$4.append(' color=\'' + $9 + $6.fillColor.substring(1, 7) + '\'');
}
$4.append('/></PolygonStyle>');
} else {
$4.append('</LineStyle>');
}
}
$4.append('</Style>');
}
$4.append('</Ftr>');
$0.append($4.toString());
}
$0.append('</Features>');
$0.append('</FeatureData>');
$0.append('</rml>');
return $0.toString();
},
$1: function () {
return 'rml';
}
}
RMap.WktSerializer = function () {
RMap.WktSerializer.constructBase(this);
}
RMap.WktSerializer.prototype = {
$0: function ($p0) {
var $0 = '';
var $1 = new StringBuilder('');
$1.append('GEOMETRYCOLLECTION' + $0);
$1.append('(' + $0);
for (var $2 = 0; $2 < $p0.getFeatures().length; $2++) {
var $3 = $p0.getFeatures() [$2];
var $4 = $3.geometry.getGeometryType();
var $5 = $3.geometry.getCoordinates();
if ($2 > 0) {
$1.append(',' + $0);
}
if ($4 === 1) {
$1.append('POINT(' + $5[0] + ' ' + $5[1] + ')' + $0);
} else if ($4 === 2) {
$1.append('LINESTRING(');
for (var $6 = 0; $6 < $5.length - 1; $6 += 2) {
if ($6 > 0) {
$1.append(',');
}
$1.append($5[$6] + ' ' + $5[$6 + 1]);
}
$1.append(')' + $0);
} else if ($4 === 3) {
$1.append('POLYGON(');
for (var $7 = 0; $7 < $5.length - 1; $7 += 2) {
if ($7 > 0) {
$1.append(',');
}
$1.append($5[$7] + ' ' + $5[$7 + 1]);
}
$1.append(')' + $0);
}
}
$1.append(')' + $0);
return $1.toString();
},
$1: function () {
return 'wkt';
}
}
RMap.GeoJsonSerializer = function () {
RMap.GeoJsonSerializer.constructBase(this);
}
RMap.GeoJsonSerializer.prototype = {
$0: function ($p0) {
var $0 = '';
var $1 = new StringBuilder('');
$1.append('{' + $0);
$1.append('"type": "FeatureCollection",' + $0);
$1.append('"features":' + $0);
$1.append('[' + $0);
for (var $2 = 0; $2 < $p0.getFeatures().length; $2++) {
var $3 = $p0.getFeatures() [$2];
var $4 = $3.geometry.getGeometryType();
if ($2 > 0) {
$1.append(',' + $0);
}
$1.append('{' + $0);
$1.append('"type": "Feature",' + $0);
$1.append('"geometry":' + $0);
$1.append('{' + $0);
if ($4 === 1) {
$1.append('"type": "Point",' + $0);
} else if ($4 === 2) {
$1.append('"type": "LineString",' + $0);
} else if ($4 === 3) {
$1.append('"type": "Polygon",' + $0);
}
$1.append('"coordinates":' + $0);
var $5 = $3.geometry.getCoordinates();
if ($4 !== 1) {
$1.append('[' + $0);
}
for (var $6 = 0; $6 < $5.length; $6 += 2) {
if ($6 > 0) {
$1.append(',' + $0);
}
$1.append('[' + $0);
$1.append($5[$6] + ', ' + $5[$6 + 1]);
$1.append(']' + $0);
}
if ($4 !== 1) {
$1.append(']' + $0);
}
$1.append('},' + $0);
$1.append('"properties":' + $0);
$1.append('{' + $0);
$1.append('"id": "' + ($3.getId()).replace(new RegExp('"', 'g'), '\\"') + '"' + $0);
var $dict1 = $3.properties;
for (var $key2 in $dict1) {
var $7 = {
key: $key2,
value: $dict1[$key2]
};
$1.append(',' + $0);
if (!$7.value) {
$1.append('"' + $7.key + '": null' + $0);
} else if (typeof ($7.value) === 'string') {
$1.append('"' + $7.key + '": "' + ($7.value).replace(new RegExp('"', 'g'), '\\"') + '"' + $0);
} else {
$1.append('"' + $7.key + '": ' + $7.value + $0);
}
}
$1.append('}' + $0);
$1.append('}' + $0);
}
$1.append(']' + $0);
$1.append('}' + $0);
return $1.toString();
},
$1: function () {
return 'geojson';
}
}
RMap._StorageSaver = function (storage, writer) {
this.$0 = storage;
this.$1 = writer;
}
RMap._StorageSaver.prototype = {
$0: null,
$1: null,
$2: null,
$3: function ($p0, $p1, $p2) {
var $0 = '?request=saveStorage&format={0}&id={1}';
if ($p2) {
$0 += '&' + $p2;
}
this.$2 = ScriptFX.Net.HTTPRequest.createRequest(RMap.MapApplication.saverUrl + String.format($0, this.$1.$1(), $p1), 1);
this.$2.set_timeout(60000);
this.$2.set_content(this.$1.$0(this.$0));
this.$2.invoke(Delegate.create(this, this.$5), $p0);
},
$4: function () {
if (this.$2) {
this.$2.abort();
}
this.$2 = null;
},
$5: function ($p0, $p1) {
var $0 = $p1;
if ($p0.get_state() !== 2 || $p0.get_response().get_statusCode() !== 200) {
if (this.$2) {
this.$2.dispose();
this.$2 = null;
}
if ($p0.get_state() !== 3) {
$0.invoke(this, ($p0.get_response()) ? $p0.get_response().get_statusText()  : Enum.toString(ScriptFX.Net.HTTPRequestState, $p0.get_state()));
}
return;
}
this.$2.dispose();
this.$2 = null;
if ($0) {
$0.invoke(this, null);
}
},
$6: function () {
this.$1 = null;
this.$0 = null;
}
}
RMap.ContentLoader = function () {
}
RMap.ContentLoader.prototype = {
_myCallback: null,
_url: null,
_nCnt: 0,
_timeoutInterval: 60000,
_cfg: null,
_checkVersion: false,
_lastVersion: '',
_resetVersionTimeout: 0,
_lastVersionTime: 0,
$2: function () {
this._lastVersion = '0';
}
}
RMap.HttpContentLoader = function (proxyUrl, method, checkVersion, resetVersionTimeout) {
RMap.HttpContentLoader.constructBase(this);
this.$4 = proxyUrl;
this.$5 = method;
this._checkVersion = checkVersion && RMap.MapApplication.enableVersionChecking;
this._resetVersionTimeout = resetVersionTimeout;
}
RMap.HttpContentLoader.prototype = {
$3: null,
$4: null,
$5: null,
load: function (url, data, callback, noCache, type, cfg) {
this._myCallback = callback;
this._url = url;
this._cfg = cfg;
this._nCnt++;
if (this.$3) {
this.$3.abort();
}
if (!this.$4) {
var $0 = this._url;
if (noCache) {
$0 += (($0.indexOf('?') > - 1) ? '&' : '?') + 'nocache=' + new Date().getTime();
}
this.$3 = ScriptFX.Net.HTTPRequest.createRequest($0, 0);
} else {
var $1 = (this.$4.indexOf('?') === - 1) ? '?method={0}&remoteUrl={1}' : 'method={0}&remoteUrl={1}';
if (type && type.toString().length > 0) {
$1 += '&rproxytype=' + type.toString();
}
if (noCache) {
$1 += '&nocache=' + new Date().getTime();
}
this.$3 = ScriptFX.Net.HTTPRequest.createRequest(this.$4 + String.format($1, this.$5, escape(this._url)), 1);
if (isNullOrUndefined(data)) {
data = '';
}
this.$3.set_content(data);
}
if (this._checkVersion && !String.isNullOrEmpty(this._lastVersion) && this._resetVersionTimeout > 0 && this._lastVersionTime + this._resetVersionTimeout < new Date().getTime()) {
this.$2();
}
if (this._checkVersion && !String.isNullOrEmpty(this._lastVersion)) {
this.$3.get_headers() ['If-Modified-Since'] = this._lastVersion;
}
this.$3.set_timeout(this._timeoutInterval);
this.$3.invoke(Delegate.create(this, this.onLoaded), callback);
},
onLoaded: function (req, obj) {
var $0 = req;
if (this._checkVersion && !String.isNullOrEmpty(this._lastVersion) && $0.get_state() === 2 && $0.get_response().get_statusCode() === 304) {
this._myCallback.invoke($0.get_response().getText(), 'NOTMODIFIED', $0.get_state(), $0.get_response().get_statusCode(), this._cfg);
$0.dispose();
this.$3 = null;
this._cfg = null;
return;
}
if ($0.get_state() !== 2 || $0.get_response().get_statusCode() !== 200) {
if ($0.get_state() !== 3) {
this._myCallback.invoke(null, (($0.get_response()) ? $0.get_response().get_statusText()  : 'Unknown error'), $0.get_state(), $0.get_response().get_statusCode(), this._cfg);
}
$0.dispose();
$0 = null;
this._cfg = null;
return;
}
if (this._checkVersion && $0.get_response().get_headers() ['Last-Modified']) {
this._lastVersion = $0.get_response().get_headers() ['Last-Modified'].toString();
}
this._lastVersionTime = new Date().getTime();
this._myCallback.invoke($0.get_response().getText(), 'OK', $0.get_state(), $0.get_response().get_statusCode(), this._cfg);
$0.dispose();
this.$3 = null;
this._cfg = null;
},
abort: function () {
if (this.$3) {
this.$3.abort();
}
this._cfg = null;
},
$0: function () {
return !this.$3;
},
$1: function () {
if (this.$3) {
this.$3.dispose();
}
this.$3 = null;
this._cfg = null;
}
}
RMap.ScriptContentLoader = function (swCallbackName, idString, checkVersion, resetVersionTimeout) {
RMap.ScriptContentLoader.constructBase(this);
this.$4 = swCallbackName;
if (String.isNullOrEmpty(this.$4)) {
this.$4 = '__RMapSWGlobalObject_';
if (!String.isNullOrEmpty(idString)) {
this.$4 += Math.abs(RMap._DictionaryUtils.$3(idString.toLowerCase())).toString();
}
while (window.self[this.$4]) {
this.$4 += String.fromCharCode(65 + 25 * parseInt(Math.random()));
}
}
this.$7 = Delegate.create(this, this.onLoaded);
window.self[this.$4] = this.$7;
this.$8 = Delegate.create(this, this.$D);
this.$9 = Delegate.create(this, this.$E);
this.$A = Delegate.create(this, this.$F);
this._checkVersion = checkVersion && RMap.MapApplication.enableVersionChecking;
this._resetVersionTimeout = resetVersionTimeout;
}
RMap.ScriptContentLoader.prototype = {
$3: null,
$4: null,
$5: null,
$6: 0,
$7: null,
$8: null,
$9: null,
$A: null,
$B: null,
load: function (url, data, callback, noCache, type, cfg) {
this.$C(url, data, callback, noCache, type, cfg, this._checkVersion);
},
$C: function ($p0, $p1, $p2, $p3, $p4, $p5, $p6) {
this.$11();
this._myCallback = $p2;
this._url = $p0;
this._cfg = $p5;
this._nCnt++;
var $0 = RMap.MapApplication.swUrl + ((RMap.MapApplication.swUrl.indexOf('?') === - 1) ? '?' : '&') + 'method=GET&callback={0}&remoteUrl={1}';
if ($p4 && $p4.toString().length > 0) {
$0 += '&rproxytype=' + $p4.toString();
}
if ($p3) {
$0 += '&nocache=' + new Date().getTime();
}
this.$6 = window.setTimeout(Delegate.create(this, this.$10), this._timeoutInterval);
this.$3 = document.createElement('script');
this.$3.id = this.$4 + '_scr';
this.$5 = this.$3.id;
this.$3.charset = 'UTF-8';
this.$3.attachEvent('onload', this.$8);
this.$3.attachEvent('onerror', this.$9);
this.$3.attachEvent('onreadystatechange', this.$A);
this.$B = {
};
if ($p6 && !String.isNullOrEmpty(this._lastVersion) && this._resetVersionTimeout > 0 && this._lastVersionTime + this._resetVersionTimeout < new Date().getTime()) {
this.$2();
}
if ($p6) {
$0 += '&modifiedSince=' + this._lastVersion + '&dt=' + new Date().getTime();
this.$B['url'] = $p0;
this.$B['data'] = $p1;
this.$B['callback'] = $p2;
this.$B['noCache'] = $p3;
this.$B['type'] = $p4;
this.$B['cfg'] = $p5;
this.$B['isVersionCheck'] = true;
}
this.$3.src = String.format($0, this.$4, escape(this._url));
(((document.getElementsByTagName('head')) [0])).appendChild(this.$3);
},
onLoaded: function (req, obj) {
if (this._checkVersion && this.$B && this.$B['isVersionCheck']) {
var $0 = true;
try {
var $1 = eval('(' + req + ')');
this._lastVersion = $1['modifiedTime'];
$0 = $1['modified'];
} catch ($2) {
}
if (!$0) {
if (this.$5 && this.$3) {
this._myCallback.invoke(req, 'NOTMODIFIED', 2, 304, this._cfg);
}
this.$11();
} else {
this.$C(this.$B['url'], this.$B['data'], this.$B['callback'], this.$B['noCache'], this.$B['type'], this.$B['cfg'], false);
}
return;
}
if (this.$5 && this.$3) {
this._lastVersionTime = new Date().getTime();
this._myCallback.invoke(req, 'OK', 2, 200, this._cfg);
}
this.$11();
},
$D: function ($p0) {
if ($p0 && $p0.srcElement && $p0.srcElement.id === this.$5 && this.$3) {
this._myCallback.invoke('', 'Error', 2, 417, this._cfg);
}
this.$11();
},
$E: function ($p0) {
if ($p0 && $p0.srcElement && $p0.srcElement.id === this.$5 && this.$3) {
this._myCallback.invoke('', 'Error', 2, 417, this._cfg);
}
this.$11();
},
$F: function () {
if (window.event && window.event.srcElement) {
var $0 = window.event.srcElement.readyState;
if ($0 !== 'loaded' && $0 !== 'complete') {
return;
}
if (window.event.srcElement.id === this.$5 && this.$3) {
this._myCallback.invoke('', 'Error', 2, 417, this._cfg);
}
this.$11();
}
},
$10: function () {
if (this.$3) {
this._myCallback.invoke('', 'Timeout', 4, 408, this._cfg);
}
this.$11();
},
abort: function () {
this.$11();
},
$0: function () {
return !this.$3;
},
$11: function () {
window.clearTimeout(this.$6);
if (this.$3) {
this.$3.detachEvent('onload', this.$8);
this.$3.detachEvent('onerror', this.$9);
this.$3.detachEvent('onreadystatechange', this.$A);
if (this.$3.parentNode) {
this.$3.parentNode.removeChild(this.$3);
}
this.$3 = null;
this.$5 = null;
this._cfg = null;
this.$B = null;
}
},
$1: function () {
this.$11();
this.$8 = null;
this.$9 = null;
this.$A = null;
this.$7 = null;
if (!String.isNullOrEmpty(this.$4)) {
window.self[this.$4] = null;
delete window.self[this.$4];
}
}
}
RMap.LoadRequest = function (_url, _key) {
this.url = _url;
this.key = _key;
}
RMap.LoadRequest.prototype = {
url: null,
key: null,
result: null,
msg: null,
state: 0,
code: 0,
cfg: null,
isCompleted: false,
_isSuccess: false
}
RMap.ImageFeature = function (_src, _title) {
this.src = _src;
this.id = _title;
}
RMap.ImageFeature.prototype = {
src: null,
id: null
}
RMap.ImageLayer = function (id, elements, envelope, schema, config) {
this.$D = - 1;
RMap.ImageLayer.constructBase(this);
this.$4 = id;
this.$19(elements);
this.$16 = envelope;
this.$9 = schema;
this.$8 = config;
if (isNullOrUndefined(this.$8)) {
this.$8 = {
};
}
this.$F = Delegate.create(this, this.$1B);
this.$10 = Delegate.create(this, this.$1C);
this.$11 = Delegate.create(this, this.$1A);
}
RMap.ImageLayer.prototype = {
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: null,
$B: null,
$C: null,
$E: true,
$F: null,
$10: null,
$11: null,
$12: 0,
$13: 0,
$14: 0,
$15: null,
$16: null,
add_stateChangedEvent: function (value) {
this.$17 = Delegate.combine(this.$17, value);
},
remove_stateChangedEvent: function (value) {
this.$17 = Delegate.remove(this.$17, value);
},
$17: null,
add_collectionChangedEvent: function (value) {
this.$18 = Delegate.combine(this.$18, value);
},
remove_collectionChangedEvent: function (value) {
this.$18 = Delegate.remove(this.$18, value);
},
$18: null,
getId: function () {
return this.$4;
},
$2: function ($p0) {
this.$5 = $p0;
if (this.$9 && this.$9.getCoordinateSystem()) {
var $0 = new RMap.Geometry(3, [
this.$16.minX,
this.$16.minY,
this.$16.minX,
this.$16.maxY,
this.$16.maxX,
this.$16.maxY,
this.$16.maxX,
this.$16.minY,
this.$16.minX,
this.$16.minY
]);
var $1 = RMap.CoordinateSystem.$5($0, this.$9.getCoordinateSystem(), this.$5.$39().$E());
this.$16 = new RMap.Envelope($1.getCoordinates() [0], $1.getCoordinates() [1], $1.getCoordinates() [2], $1.getCoordinates() [3]);
}
this.$A = RMap._DomHelper.$3(this.$5.$6);
this.$C = document.createElement('img');
this.$C.style.position = 'absolute';
this.$C.attachEvent('onload', this.$F);
this.$C.attachEvent('onerror', this.$10);
this.$C.attachEvent('onabort', this.$11);
this.$1E(true);
},
$19: function ($p0) {
this.$6 = $p0;
if ($p0 && Type.canCast($p0, String)) {
this.$6 = [
new RMap.ImageFeature($p0, $p0)
];
} else if ($p0 && $p0.src) {
this.$6 = [
new RMap.ImageFeature($p0.src, ($p0.id) ? $p0.id : $p0.src)
];
} else if ($p0 && $p0.length > 0) {
if (Type.canCast($p0[0], String)) {
for (var $0 = 0; $0 < $p0.length; $0++) {
this.$6[$0] = new RMap.ImageFeature($p0[$0], $p0[$0]);
}
}
if ($p0[0] && $p0[0].src && !$p0[0].id) {
for (var $1 = 0; $1 < $p0.length; $1++) {
this.$6[$1] = new RMap.ImageFeature($p0[0].src, $p0[0].src);
}
}
}
},
$1A: function () {
this.$E = true;
if (this.$C.parentNode) {
this.$C.parentNode.removeChild(this.$C);
}
},
$1B: function () {
this.$E = true;
if (!this.$C.parentNode) {
this.$A.appendChild(this.$C);
}
this.$24(this.$C);
var $0 = new RMap.IOEventArgs(2, new Date().getTime(), ((this.$8['reloadTimeout'] > 0) ? new Date().getTime() + this.$8['reloadTimeout'] : 0), null);
this.notifyIO($0);
if (this.$8['reloadTimeout'] > 0) {
this.$1F();
}
},
$1C: function () {
this.$E = true;
if (this.$C.parentNode) {
this.$C.parentNode.removeChild(this.$C);
}
var $0 = new RMap.IOEventArgs(3, new Date().getTime(), ((this.$8['reloadTimeout'] > 0) ? new Date().getTime() + this.$8['reloadTimeout'] : 0), null);
this.notifyIO($0);
if (this.$8['reloadTimeout'] > 0) {
this.$1F();
}
},
$1D: function ($p0) {
if (this.$B && $p0) {
for (var $0 = 0; $0 < this.$B.length; $0++) {
this.$B[$0] = null;
}
this.$B = null;
}
},
$1E: function ($p0) {
window.clearTimeout(this.$14);
if ($p0) {
this.$1D(true);
this.$B = [
];
this.$D = (this.$6.length > 0) ? 0 : - 1;
}
for (var $0 = 0; $0 < this.$6.length; $0++) {
if (!this.$B[$0]) {
this.$B[$0] = document.createElement('img');
}
this.$B[$0].title = this.$6[$0].id;
if (this.$8['static']) {
this.$B[$0].src = this.$6[$0].src.replace('{nocache}', new Date().getTime().toString());
} else {
var $1 = this.$5.$39().$11();
var $2 = this.$5.$39().$12();
var $3 = this.$5.$39().$13();
this.$B[$0].src = this.$6[$0].src.replace('{nocache}', new Date().getTime().toString()).replace('{width}', $1.width.toString()).replace('{height}', $1.height.toString()).replace('{left}', $2.minX.toString()).replace('{right}', $2.maxX.toString()).replace('{top}', $2.maxY.toString()).replace('{bottom}', $2.minY.toString());
}
}
if (this.$6.length > 0 && this.$D > - 1) {
this.notifyIO(new RMap.IOEventArgs(1, 0, 0, null));
this.$C.src = this.$B[this.$D].src;
} else {
this.$C.src = RMap._Environment.$1();
}
this.$28(new RMap.CollectionChangedEventArgs(this.$B, 4));
if (this.$6.length > 0) {
this.$29(new RMap.StateChangedEventArgs([this.$6[this.$D]], 3));
}
this.$15 = new Date();
},
$1F: function () {
if (this.$8['reloadTimeout'] > 0) {
window.clearTimeout(this.$12);
this.$12 = window.setTimeout(Delegate.create(this, this.$20), this.$8['reloadTimeout']);
}
},
$20: function () {
this.$1E(false);
},
$21: function () {
if (this.$C) {
if (this.$8['static']) {
this.$24(this.$C);
this.$C.style.display = '';
} else {
this.$1E(false);
}
}
},
$22: function () {
return this.$5;
},
getElements: function () {
return this.$6;
},
$23: function () {
return this.$9;
},
getLastLoadingTime: function () {
return this.$15;
},
$24: function ($p0) {
if (this.$C.src === RMap._Environment.$1()) {
return;
}
var $0 = this.$5.$39().$11();
var $1 = this.$5.$39().$12();
var $2 = this.$5.$39().$13();
if (this.$8['static']) {
var $3 = Math.abs(($1.maxX - $1.minX) / ($2.maxX - $2.minX));
var $4 = Math.abs(($1.maxY - $1.minY) / ($2.maxY - $2.minY));
if (this.$8['mode'] !== 'filter') {
$p0.style.left = ($2.minX + (this.$16.minX - $1.minX) / $3) + 'px';
$p0.style.top = ($2.minY - (this.$16.maxY - $1.maxY) / $4) + 'px';
this.$7 = ScriptFX.UI.$create_Size(Math.round((this.$16.maxX - this.$16.minX) / $3), Math.round((this.$16.maxY - this.$16.minY) / $4));
$p0.style.width = this.$7.width + 'px';
$p0.style.height = this.$7.height + 'px';
} else {
if (!this.$7) {
this.$7 = ScriptFX.UI.$create_Size($p0.offsetWidth, $p0.offsetHeight);
}
if (this.$7 && this.$7.width > 0 && this.$7.height > 0) {
if (ScriptFX.Application.current.get_isIE()) {
$p0.style.left = ($2.minX + (this.$16.minX - $1.minX) / $3) + 'px';
$p0.style.top = ($2.minY - (this.$16.maxY - $1.maxY) / $4) + 'px';
$p0.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + ((this.$16.maxX - this.$16.minX) / ($3 * this.$7.width)) + ',M12=0, M21=0, M22=' + ((this.$16.maxY - this.$16.minY) / ($4 * this.$7.height)) + ', Dx=0, Dy=0, SizingMethod=\'auto expand\')';
} else {
$p0.style.left = ((this.$16.maxX - this.$16.minX) / ($3 * 2) - this.$7.width / 2 + $2.minX + (this.$16.minX - $1.minX) / $3) + 'px';
$p0.style.top = ((this.$16.maxY - this.$16.minY) / ($4 * 2) - this.$7.height / 2 + $2.minY - (this.$16.maxY - $1.maxY) / $4) + 'px';
var $5 = 'MozTransform';
if (ScriptFX.Application.current.get_host().get_name() === 4) {
$5 = 'OTransform';
} else if (ScriptFX.Application.current.get_host().get_name() === 3) {
$5 = 'webkitTransform';
}
$p0.style[$5] = 'scale(' + ((this.$16.maxX - this.$16.minX) / ($3 * this.$7.width)) + ', ' + ((this.$16.maxY - this.$16.minY) / ($4 * this.$7.height)) + ')';
}
}
}
} else {
$p0.style.left = $2.minX + 'px';
$p0.style.top = $2.minY + 'px';
$p0.style.display = '';
}
},
changeCollection: function (elements) {
this.$D = - 1;
this.$19(elements);
this.$1E(true);
},
changeReloadInterval: function (n) {
this.$8['reloadTimeout'] = n;
this.$1F();
},
$25: 0,
$26: null,
play: function (dt) {
if (!this.$26) {
this.$26 = Delegate.create(this, this.$27);
}
this.$25 = dt;
this.$D = - 1;
this.$27();
},
$27: function () {
if (this.$D < this.$6.length - 1) {
if (this.$E) {
this.$D++;
if (this.$C) {
this.$E = false;
this.$C.src = this.$B[this.$D].src;
this.$29(new RMap.StateChangedEventArgs([this.$6[this.$D]], 3));
}
}
window.clearTimeout(this.$14);
this.$14 = window.setTimeout(this.$26, this.$25);
}
},
select: function (id) {
if (!this.$C) {
return;
}
for (var $0 = 0; $0 < this.$6.length; $0++) {
if (this.$6[$0].id === id) {
window.clearTimeout(this.$14);
this.$D = $0;
this.$C.src = this.$B[$0].src;
this.$29(new RMap.StateChangedEventArgs([this.$6[$0]], 3));
break;
}
}
},
hide: function () {
if (this.isHidden()) {
return;
}
this.$A.style.visibility = 'hidden';
this.$29(new RMap.StateChangedEventArgs(null, 1));
},
show: function () {
if (!this.isHidden()) {
return;
}
this.$A.style.visibility = '';
this.$29(new RMap.StateChangedEventArgs(null, 2));
},
isHidden: function () {
return this.$A.style.visibility === 'hidden';
},
$0: function ($p0) {
if (($p0 & 1)) {
return;
}
if (this.$13) {
window.clearTimeout(this.$13);
this.$13 = 0;
}
if (this.$C) {
this.$C.style.display = 'none';
}
},
$1: function ($p0, $p1) {
if (this.$13) {
window.clearTimeout(this.$13);
}
this.$13 = window.setTimeout(Delegate.create(this, this.$21), 1000);
},
$28: function ($p0) {
if (this.$18) {
this.$18.invoke(this, $p0);
}
},
$29: function ($p0) {
if (this.$17) {
this.$17.invoke(this, $p0);
}
},
add_ioEvent: function (value) {
this.$2A = Delegate.combine(this.$2A, value);
},
remove_ioEvent: function (value) {
this.$2A = Delegate.remove(this.$2A, value);
},
$2A: null,
notifyIO: function (args) {
if (this.$2A) {
this.$2A.invoke(this, args);
}
},
$3: function () {
if (this.$13) {
window.clearTimeout(this.$13);
this.$13 = 0;
}
window.clearTimeout(this.$14);
window.clearTimeout(this.$13);
window.clearTimeout(this.$12);
if (this.$C) {
this.$C.detachEvent('onload', this.$F);
this.$C.detachEvent('onerror', this.$10);
this.$C.detachEvent('onabort', this.$11);
if (this.$C.parentNode) {
this.$C.parentNode.removeChild(this.$C);
}
this.$C = null;
}
this.$F = null;
this.$10 = null;
this.$11 = null;
this.$1D(true);
this.$B = null;
this.$6 = null;
},
$2B: function () {
return new RMap.ImageLayer(this.$4, this.$6, this.$16, this.$9, this.$8);
}
}
RMap.ImageLayerPanel = function (layer, label, config) {
this.$E = new Array(0);
this._itemsLookup = {
};
RMap.ImageLayerPanel.constructBase(this, [
label
]);
this._layer = layer;
this._config = config;
if (!this._config) {
this._config = {
};
}
this.$3 = document.createElement('div');
this.$3.style.width = '100%';
this.$3.style.overflow = 'auto';
this.$3.style.overflowX = 'hidden';
this.$2.appendChild(this.$3);
this.$11 = document.createElement('div');
this.$11.className = 'Buttons';
this.$11.style.position = 'absolute';
this.$11.style.right = '3px';
this.$11.style.top = '4px';
this.$2.appendChild(this.$11);
this.$13 = document.createElement('img');
this.$13.hspace = 1;
if (!this._config['unreloadable']) {
this.$13.title = 'Reload';
this.$13.style.cursor = RMap.Browser.crsPointer;
this.$1A = Delegate.create(this, this.$2A);
this.$13.attachEvent('onclick', this.$1A);
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.reloadBtn;
} else {
this.$15 = false;
this.$13.title = 'Ready';
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.doneBtn;
}
this.$11.appendChild(this.$13);
if (!isNullOrUndefined(this._config['reverse'])) {
this.$16 = this._config['reverse'];
}
if (!isNullOrUndefined(this._config['autoformat'])) {
this.$17 = this._config['autoformat'];
}
if (!isNullOrUndefined(this._config['noheader']) && this._config['noheader']) {
this.$11.style.display = 'none';
this.$4.style.display = 'none';
}
this._body = document.createElement('div');
this._body.style.width = '100%';
this._body.style.height = 'auto';
this._body.style.overflowY = 'auto';
this._body.style.overflowX = 'hidden';
this.$10 = document.createElement('div');
this.$10.className = 'Description';
if (!isNullOrUndefined(this._config['content'])) {
this.$10.innerHTML = this._config['content'];
} else {
this.$10.style.display = 'none';
}
this._body.appendChild(this.$10);
this._footer = document.createElement('div');
this._footer.className = 'Footer';
this.$18 = Delegate.create(this, this.$28);
this.$5.style.visibility = '';
this.$5.src = RMap.MapApplication.resourcesUrl + 'common/check-' + ((this._layer.isHidden()) ? 'false' : 'true') + '.png';
this.$5.attachEvent('onclick', this.$18);
if (this._config['removable']) {
this.$12 = document.createElement('img');
this.$12.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.closeBtn;
this.$12.style.cursor = RMap.Browser.crsPointer;
this.$12.hspace = 1;
this.$11.appendChild(this.$12);
this.$19 = Delegate.create(this, this.$29);
this.$12.attachEvent('onclick', this.$19);
}
this.$3.style.overflowY = 'hidden';
this.$3.appendChild(this._body);
this.$3.appendChild(this._footer);
this.$24();
this.$1B = Delegate.create(this, this.$1C);
this._layer.add_ioEvent(this.$1B);
this._layer.add_collectionChangedEvent(Delegate.create(this, this.onCollectionChanged));
this._layer.add_stateChangedEvent(Delegate.create(this, this.$1E));
}
RMap.ImageLayerPanel.prototype = {
_layer: null,
_config: null,
$F: null,
$10: null,
_body: null,
_footer: null,
$11: null,
$12: null,
$13: null,
$14: false,
$15: true,
$16: false,
$17: true,
$18: null,
$19: null,
$1A: null,
$1B: null,
$1C: function ($p0, $p1) {
var $0 = '';
if (this.$15) {
$0 = 'Reload\n';
}
if ($p1.action === 1) {
$0 = 'Loading ... ';
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.waitBtn;
} else if ($p1.action === 3) {
$0 += 'Error ' + $p1.errorMessage;
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.failedBtn;
var $1 = $p1.userData;
} else if ($p1.action === 2) {
if (this.$15) {
$0 += 'Loaded at ' + (new Date($p1.lastLoadTime)).format('HH:mm:ss');
if ($p1.nextLoadTime > 0) {
$0 += '\nAuto reload at ' + (new Date($p1.nextLoadTime)).format('HH:mm:ss');
}
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.reloadBtn;
} else {
$0 = 'Ready';
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.doneBtn;
}
var $2 = $p1.userData;
}
this.$13.title = $0;
},
getElement: function () {
return this.$3;
},
$1D: function () {
return this._body;
},
getLayer: function () {
return this._layer;
},
onCollectionChanged: function (sender, args) {
switch (args.action) {
case 4:
this.$1F();
break;
}
this.$F = null;
if (this.$1.$B['count']) {
this.$4.title = RMap.Messages.itemCount + this.$E.length;
}
},
$1E: function ($p0, $p1) {
if ($p1.action === 256) {
this.$23();
} else if ($p1.action === 1 || $p1.action === 2) {
this.$5.src = RMap.MapApplication.resourcesUrl + 'common/check-' + ((this._layer.isHidden()) ? 'false' : 'true') + '.png';
} else if ($p1.action === 3) {
var $0 = ($p1.items[0]).id;
if (!isNullOrUndefined(this._itemsLookup[$0])) {
this.$25(this._itemsLookup[$0], true);
}
}
},
$1F: function () {
this.$23();
this.$24();
},
$20: function () {
},
$21: function () {
if (!String.isNullOrEmpty(this.$10.innerHTML)) {
this.$10.style.display = '';
}
},
$22: function () {
this.$10.style.display = 'none';
},
$23: function () {
this.$22();
for (var $0 = 0; $0 < this.$E.length; ++$0) {
(this.$E[$0]).$9();
}(this.$E).clear();
this._itemsLookup = {
};
this.$F = null;
},
$24: function () {
this.$20();
this.$21();
var $0 = this._layer.getElements();
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = new RMap._ImagePanelItem(this, $0[$1], this.$16, this.$17);
this.$E[$1] = $2;
this._itemsLookup[$0[$1].id] = $2;
}
},
$25: function ($p0, $p1) {
if (this.$F) {
this.$F.$D();
}
this.$F = $p0;
this.$F.$C(false);
},
$26: function ($p0) {
RMap._DomHelper.$B();
this.$25($p0, false);
this._layer.select(($p0.$B()).id);
},
$27: function ($p0) {
},
$28: function () {
window.event.cancelBubble = true;
if (this._layer.isHidden()) {
this._layer.show();
} else {
this._layer.hide();
}
},
$29: function () {
RMap._DomHelper.$B();
this.$1.$C(this, 256);
this.$D();
},
$2A: function () {
RMap._DomHelper.$B();
this._layer.$1E(false);
},
resize: function () {
if (this.$1.$A !== 'none') {
this._body.style.height = Math.max(0, (this.$3.offsetHeight - this._footer.offsetHeight)) + 'px';
}
},
$D: function () {
this._layer.remove_collectionChangedEvent(Delegate.create(this, this.onCollectionChanged));
this._layer.remove_stateChangedEvent(Delegate.create(this, this.$1E));
this.$5.detachEvent('onclick', this.$18);
this.$18 = null;
if (this.$1B && this._layer) {
this._layer.remove_ioEvent(this.$1B);
this.$1B = null;
}
if (this._layer.$22()) {
this._layer.$22().removeLayer(this._layer.getId());
}
this._layer = null;
if (!isNullOrUndefined(this.$1)) {
this.$1.detach(this);
}
this.$23();
if (!isNull(this.$12)) {
this.$12.detachEvent('onclick', this.$19);
this.$19 = null;
this.$11.removeChild(this.$12);
this.$12 = null;
}
if (!isNull(this.$13)) {
this.$13.detachEvent('onclick', this.$1A);
this.$1A = null;
this.$11.removeChild(this.$13);
this.$13 = null;
}
this.$3.removeChild(this._footer);
this.$3.removeChild(this._body);
this.$2.removeChild(this.$3);
this.$2.removeChild(this.$11);
RMap.ImageLayerPanel.callBase(this, '$D');
}
}
RMap._ImagePanelItem = function (parent, feature, reverse, autoFormat) {
this.$0 = parent;
this.$1 = feature;
this.$3 = autoFormat;
this.$4 = Delegate.create(this, this.$F);
this.$5 = Delegate.create(this, this.$10);
this.$2 = document.createElement('div');
this.$2.className = 'Item';
this.$2.attachEvent('onclick', this.$4);
this.$2.attachEvent('ondblclick', this.$5);
if (isNullOrUndefined(this.$0.$1D().firstChild) || !reverse) {
this.$0.$1D().appendChild(this.$2);
} else if (this.$0.$1D().childNodes.length > 1) {
this.$0.$1D().insertBefore(this.$2, this.$0.$1D().childNodes[1]);
} else {
this.$0.$1D().appendChild(this.$2);
}
this.$E();
}
RMap._ImagePanelItem.prototype = {
$0: null,
$1: null,
$2: null,
$3: true,
$4: null,
$5: null,
$6: function () {
if (!isNullOrUndefined(this.$2.parentNode)) {
this.$2.parentNode.removeChild(this.$2);
}
},
$7: function () {
this.$6();
this.$0.$1D().appendChild(this.$2);
},
$8: function () {
this.$E();
},
$9: function () {
if (!this.$2) {
return;
}
this.$2.detachEvent('onclick', this.$4);
this.$2.detachEvent('ondblclick', this.$5);
this.$4 = null;
this.$5 = null;
this.$2.innerHTML = '';
if (this.$2.parentNode === this.$0.$1D()) {
this.$0.$1D().removeChild(this.$2);
}
this.$2 = null;
this.$0 = null;
this.$1 = null;
},
$A: function () {
return this.$2;
},
$B: function () {
return this.$1;
},
$C: function ($p0) {
if ($p0 && !isNullOrUndefined(this.$2.parentNode)) {
if (this.$2.offsetTop < this.$2.parentNode.scrollTop || this.$2.offsetTop + this.$2.offsetHeight > this.$2.parentNode.scrollTop + this.$2.parentNode.offsetHeight) {
this.$2.scrollIntoView(true);
}
}
this.$2.className = 'SelectedItem';
},
$D: function () {
this.$2.className = 'Item';
},
$E: function () {
var $0 = '';
if ((this.$0.getLayer()).$23()) {
$0 = (this.$0.getLayer()).$23().getPanelItemContent(this.$1);
}
if (!$0) {
$0 = (this.$1).id;
}
if (this.$3) {
$0 = $0 + '<br clear=\'all\'/>';
}
if (this.$2.innerHTML !== $0) {
this.$2.innerHTML = $0;
}
},
$F: function () {
this.$0.$26(this);
},
$10: function () {
this.$0.$27(this);
}
}
RMap.RoutingPanel = function (layer, label, config) {
RMap.RoutingPanel.constructBase(this, [
layer,
label,
config
]);
this._footer.style.display = 'none';
this.$3B = document.createElement('div');
this.$3B.className = 'Description';
this._body.appendChild(this.$3B);
if (!isNullOrUndefined(this._config['routing'])) {
this.$48 = this._config['routing'];
}
if (!isNullOrUndefined(this._config['onfastest'])) {
this.$3C = document.createElement('span');
this.$3C.style.textDecoration = 'underline';
this.$3C.style.color = '#0000ff';
this.$3C.innerHTML = '</br>' + RMap.RoutingSettings.fastest;
this.$3C.style.cursor = RMap.Browser.crsPointer;
this.$3C.style.display = 'none';
this.$3B.appendChild(this.$3C);
this.$40 = Delegate.create(this, this.$49);
this.$3C.attachEvent('onclick', this.$40);
this.$44 = this._config['onfastest'];
}
if (!isNullOrUndefined(this._config['onshortest'])) {
this.$3D = document.createElement('span');
this.$3D.style.textDecoration = 'underline';
this.$3D.style.color = '#0000ff';
this.$3D.innerHTML = '<br/>' + RMap.RoutingSettings.shortest;
this.$3D.style.cursor = RMap.Browser.crsPointer;
this.$3D.style.display = 'none';
this.$3B.appendChild(this.$3D);
this.$41 = Delegate.create(this, this.$4A);
this.$3D.attachEvent('onclick', this.$41);
this.$45 = this._config['onshortest'];
}
if (!isNullOrUndefined(this._config['onreverse'])) {
this.$3E = document.createElement('span');
this.$3E.style.textDecoration = 'underline';
this.$3E.style.color = '#0000ff';
this.$3E.innerHTML = '<br/>' + RMap.RoutingSettings.reverse;
this.$3E.style.cursor = RMap.Browser.crsPointer;
this.$3E.style.display = 'none';
this.$3B.appendChild(this.$3E);
this.$43 = Delegate.create(this, this.$4B);
this.$3E.attachEvent('onclick', this.$43);
this.$46 = this._config['onreverse'];
}
if (!isNullOrUndefined(this._config['onclear'])) {
this.$3F = document.createElement('span');
this.$3F.style.textDecoration = 'underline';
this.$3F.style.color = '#0000ff';
this.$3F.innerHTML = '<br/>' + RMap.RoutingSettings.clear + '<br/><br/>';
this.$3F.style.cursor = RMap.Browser.crsPointer;
this.$3F.style.display = 'none';
this.$3B.appendChild(this.$3F);
this.$42 = Delegate.create(this, this.$4C);
this.$3F.attachEvent('onclick', this.$42);
this.$47 = this._config['onclear'];
}
if (!isNullOrUndefined(this._config['message']) && this._config['message'] !== '') {
var $0 = document.createElement('span');
$0.className = 'ExtraMessage';
$0.innerHTML = '<br/>' + this._config['message'].toString();
this.$3B.appendChild($0);
}
}
RMap.RoutingPanel.prototype = {
$3B: null,
$3C: null,
$3D: null,
$3E: null,
$3F: null,
$40: null,
$41: null,
$42: null,
$43: null,
$44: null,
$45: null,
$46: null,
$47: null,
$48: null,
onCollectionChanged: function (sender, args) {
this.$2B();
},
$31: function () {
this.$2D();
var $0 = this._layer.getFeatureView().getFeatures();
for (var $1 = 0; $1 < $0.length; $1++) {
if ($0[$1].properties['xsi_type'].toString() !== 'Route') {
var $2 = new RMap._PanelItem(this, $0[$1], false, true);
this.$E[this.$E.length] = $2;
this._itemsLookup[$0[$1].getId()] = $2;
}
}
},
$2B: function () {
this._body.removeChild(this.$3B);
this.$30();
this.$31();
this._body.appendChild(this.$3B);
var $0 = false;
if (!RMap.RoutingSettings.autoReload && this.$48 && this.$48.getStart().valid && this.$48.getEnd().valid) {
$0 = true;
}
if (this.$3C) {
if ((!isNullOrUndefined(this._storage.$9['param']) && (this._storage.$9['param']) ['type'] !== 'fastest') || (isNullOrUndefined(this._storage.$9['param']) && $0)) {
this.$3C.style.display = '';
} else {
this.$3C.style.display = 'none';
}
}
if (this.$3D) {
if ((!isNullOrUndefined(this._storage.$9['param']) && (this._storage.$9['param']) ['type'] !== 'shortest') || (isNullOrUndefined(this._storage.$9['param']) && $0)) {
this.$3D.style.display = '';
} else {
this.$3D.style.display = 'none';
}
}
if (this.$3E) {
if (this.$E.length > 1) {
this.$3E.style.display = '';
} else {
this.$3E.style.display = 'none';
}
}
if (this.$3F) {
if (this.$E.length > 0) {
this.$3F.style.display = '';
} else {
this.$3F.style.display = 'none';
}
}
},
$49: function () {
if (!isNullOrUndefined(this.$44)) {
this.$44.invoke();
}
},
$4A: function () {
if (!isNullOrUndefined(this.$45)) {
this.$45.invoke();
}
},
$4B: function () {
if (!isNullOrUndefined(this.$46)) {
this.$46.invoke();
}
},
$4C: function () {
if (!isNullOrUndefined(this.$47)) {
this.$47.invoke();
}
},
$D: function () {
RMap.RoutingPanel.callBase(this, '$D');
for (var $0 = this.$3B.childNodes.length - 1; $0 >= 0; $0--) {
this.$3B.removeChild(this.$3B.childNodes[$0]);
}
if (this.$3B.parentNode) {
this.$3B.parentNode.removeChild(this.$3B);
}
this.$3B = null;
this.$3C = null;
this.$3D = null;
this.$3E = null;
this.$3F = null;
}
}
RMap.RoutingDeserializer = function (properties) {
RMap.RoutingDeserializer.constructBase(this, [
properties
]);
}
RMap.RoutingDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = new Array(0);
var $1 = (data.startsWith('({')) ? (ScriptFX.JSON.deserialize(data)) ['Route'] : (this.xmlStr2Json(data) ['Route']);
this._json = $1;
var $2 = $1['Header'];
var $3 = $1['Description'];
var $4 = RMap._DomHelper.$1B($1['LineString']);
for (var $6 = 0; $6 < $4.length; $6++) {
var $7 = $4[$6];
var $8 = $7['value'];
var $9 = $8.replace(new RegExp(' ', 'g'), ',').split(',');
var $A = new Array(0);
for (var $D = 0; $D < $9.length; $D++) {
$A[$D] = parseFloat($9[$D]);
}
var $B = new RMap.Geometry(2, $A);
$2['xsi_type'] = 'Route';
var $C = $0.length;
$0[$C] = new RMap.Feature(null, $B, $2);
$0[$C].setInteractive(false);
}
var $5 = (isNullOrUndefined($3)) ? [
] : RMap._DomHelper.$1B($3['RouteDescription']);
for (var $E = 0; $E < $5.length; $E++) {
var $F = $5[$E];
var $10 = $F['xsi_type'];
if ($10 === 'RouteDescriptionTurn' || $10 === 'RouteDescriptionTerminal' || $10 === 'RouteDescriptionStart' || $10 === 'RouteDescriptionEnd' || $10 === 'RouteDescriptionVia') {
if ($10 === 'RouteDescriptionTerminal') {
var $13 = $F['Price'];
if (!isNullOrUndefined($13)) {
var $14 = (isNullOrUndefined($13)) ? [
] : RMap._DomHelper.$1B($13['double']);
if ($14.length > 0) {
var $15 = new Array(0);
for (var $16 = 0; $16 < $14.length; $16++) {
$15[$15.length] = $14[$16];
}
$F['Prices'] = $15;
}
}
}
var $11 = $0.length;
var $12 = new RMap.Geometry(1, [
parseFloat($F['PointX']),
parseFloat($F['PointY'])
]);
$0[$11] = new RMap.Feature(null, $12, $F);
}
}
return $0;
} catch ($17) {
return null;
}
},
getDescription: function (data) {
var $0 = {
};
try {
var $1 = this._json;
var $2 = $1['Header'];
$0['description'] = $2['Abstract'];
var $3 = {
};
$3['type'] = $2['RouteType'];
$3['hasACHC'] = $2['HasACHC'];
if ($2['HasACHC'] === 'true' && !String.isNullOrEmpty(RMap.RoutingSettings.messageACHC)) {
$0['description'] = $0['description'] + RMap.RoutingSettings.messageACHC;
}
$0['param'] = $3;
} catch ($4) {
}
return $0;
}
}
RMap.RoutingStyler = function () {
RMap.RoutingStyler.constructBase(this);
}
RMap.RoutingStyler.prototype = {
getStyle: function (feature) {
var $0 = null;
switch (feature.getProperty('xsi_type').toString()) {
case 'RouteDescriptionTurn':
$0 = new RMap.ImageSymbolPointStyle();
($0).iconSrc = RMap.MapApplication.resourcesUrl + 'routing/tocka.gif';
($0).iconSize = ScriptFX.UI.$create_Size(10, 10);
($0).anchor = ScriptFX.UI.$create_Location(5, 5);
$0.getHTML2 = $0.getHTML;
$0.getHTML = null;
break;
case 'RouteDescriptionTerminal':
$0 = new RMap.ImageSymbolPointStyle();
($0).iconSrc = RMap.MapApplication.resourcesUrl + 'routing/tocka_cestnina.gif';
($0).iconSize = ScriptFX.UI.$create_Size(10, 10);
($0).anchor = ScriptFX.UI.$create_Location(5, 5);
$0.getHTML2 = $0.getHTML;
$0.getHTML = null;
break;
case 'RouteDescriptionStart':
$0 = new RMap.ImageSymbolPointStyle();
($0).iconSrc = RMap.MapApplication.resourcesUrl + 'routing/start.gif';
($0).iconSize = ScriptFX.UI.$create_Size(12, 16);
($0).anchor = ScriptFX.UI.$create_Location(2, 16);
($0).infoWindowAnchor = ScriptFX.UI.$create_Location(7, 5);
$0.getHTML2 = $0.getHTML;
$0.getHTML = null;
break;
case 'RouteDescriptionEnd':
$0 = new RMap.ImageSymbolPointStyle();
($0).iconSrc = RMap.MapApplication.resourcesUrl + 'routing/cilj.gif';
($0).iconSize = ScriptFX.UI.$create_Size(12, 16);
($0).anchor = ScriptFX.UI.$create_Location(2, 16);
($0).infoWindowAnchor = ScriptFX.UI.$create_Location(7, 5);
$0.getHTML2 = $0.getHTML;
$0.getHTML = null;
break;
case 'RouteDescriptionVia':
$0 = new RMap.ImageSymbolPointStyle();
($0).iconSrc = RMap.MapApplication.resourcesUrl + 'routing/via.gif';
($0).iconSize = ScriptFX.UI.$create_Size(12, 16);
($0).anchor = ScriptFX.UI.$create_Location(2, 16);
($0).infoWindowAnchor = ScriptFX.UI.$create_Location(7, 5);
$0.getHTML2 = $0.getHTML;
$0.getHTML = null;
break;
case 'Route':
$0 = new RMap.ShapeStyle();
($0).strokeColor = '#0000ff';
($0).strokeWidth = 4;
($0).strokeType = 0;
($0).strokeOpacity = 40;
break;
default:
$0 = new RMap.ImageSymbolPointStyle();
break;
}
return $0;
}
}
RMap.RoutingEventArgs = function (items, action) {
RMap.RoutingEventArgs.constructBase(this);
this.items = items;
this.action = action;
}
RMap.RoutingEventArgs.prototype = {
action: 0,
items: null
}
RMap.RoutingPoint = function () {
}
RMap.RoutingPoint.prototype = {
location: null,
road: null,
stac: null,
descr: null,
valid: false
}
RMap.Routing = function (map, panel, config) {
this.$7 = new RMap.RoutingPoint();
this.$8 = new Array(0);
this.$9 = new RMap.RoutingPoint();
this.$0 = map;
this.$1 = panel;
if (isNullOrUndefined(config)) {
config = {
};
}
var $0 = new RMap.FeatureReader(RMap.RoutingSettings.serviceUrl, 'post', new RMap.RoutingDeserializer(null), null, null, null, null, null);
var $1 = new RMap.FeatureSchema(new Array(0), RMap.CoordinateSystem.getCoordinateSystem('EPSG:2170'));
this.$F = new RMap.RoutingStyler();
if (config['schema']) {
$1 = config['schema'];
} else {
$1.setInfoWindowContentTemplate(Delegate.create(this, this.$23));
$1.setPanelItemContentTemplate(Delegate.create(this, this.$24));
}
if (config['styler']) {
this.$F = config['styler'];
}
var $2 = new RMap.RemoteFeatureStorage($1, $0, 0, false, 0);
this.$A = new RMap.DrawingLayer('Realis.Rmap.Routing.Layer', $2.getDefaultView(), this.$F, null);
this.$A.add_collectionChangedEvent(Delegate.create(this, this.$13));
if (config['forceBlowup']) {
this.$C = true;
this.$3 = Delegate.create(this, this.$15);
this.$A.attachEvent('drawing', this.$3);
}
map.addLayer(this.$A);
if (!isNullOrUndefined(panel)) {
panel.add(new RMap.RoutingPanel(this.$A, RMap.RoutingSettings.caption, {
routing: this,
onfastest: Delegate.create(this, this.$17),
onshortest: Delegate.create(this, this.$16),
onreverse: Delegate.create(this, this.revert),
onclear: Delegate.create(this, this.clear),
unreloadable: true,
message: RMap.RoutingSettings.message,
buttons: config['buttons']
}));
}
if (!config['externalMode']) {
this.$2 = Delegate.create(this, this.$14);
map.attachEvent('mouse', this.$2);
} else {
this.$D = true;
}
}
RMap.Routing.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: 0,
$A: null,
$B: true,
$C: false,
$D: false,
$E: 'fastest',
$F: null,
add_$10: function ($p0) {
this.$11 = Delegate.combine(this.$11, $p0);
},
remove_$10: function ($p0) {
this.$11 = Delegate.remove(this.$11, $p0);
},
$11: null,
routeItemDescriptor: null,
attachEvent: function (name, handler) {
if (name.toLowerCase() === 'routing') {
this.add_$10(handler);
}
},
detachEvent: function (name, handler) {
if (name.toLowerCase() === 'routing') {
this.remove_$10(handler);
}
},
$12: function ($p0) {
if (this.$11) {
this.$11.invoke(this, $p0);
}
},
$13: function ($p0, $p1) {
if ($p1.action === 3) {
this.removeStart();
this.removeAllVias();
this.removeCilj();
}
this.$12(new RMap.RoutingEventArgs(null, 1));
},
$14: function ($p0, $p1) {
if (!this.$B) {
return;
}
var $0 = $p1;
if ($0.action === 16) {
var $1 = new Array(0);
if (!$0.userData) {
$1 = [
new RMap.Command(RMap.RoutingSettings.start, Delegate.create(this, this.$19)),
new RMap.Command(RMap.RoutingSettings.via, Delegate.create(this, this.$1A)),
new RMap.Command(RMap.RoutingSettings.end, Delegate.create(this, this.$1B))
];
if (this.$8.length >= RMap.RoutingSettings.maxViaNumber) {
$1.splice(1, 1);
}
} else {
this.$4 = null;
var $2 = '';
var $3 = ($0.userData['drawing']).getFeature().properties['xsi_type'].toString();
if ($3 === 'RouteDescriptionStart') {
this.$4 = Delegate.create(this, this.$1C);
$2 = ' ' + RMap.RoutingSettings.start;
} else if ($3 === 'RouteDescriptionVia') {
this.$6 = - 1;
var $4 = this.$A.getFeatureView().getStorage().getFeatures();
var $5 = ($0.userData['drawing']).getFeature();
for (var $6 = 0; $6 < $4.length; $6++) {
if ($4[$6].properties['xsi_type'].toString() === 'RouteDescriptionVia') {
this.$6++;
}
if ($5 === $4[$6]) {
break;
}
}
this.$4 = Delegate.create(this, this.$1D);
$2 = ' ' + RMap.RoutingSettings.via;
} else if ($3 === 'RouteDescriptionEnd') {
this.$4 = Delegate.create(this, this.$1E);
$2 = ' ' + RMap.RoutingSettings.end;
}
if (this.$4) {
$1[0] = new RMap.Command(RMap.RoutingSettings.remove + $2, this.$4);
}
}
if ($1.length > 0) {
this.$5 = RMap.$create_Coordinate($0.worldLocation.x, $0.worldLocation.y);
this.$0.openContextMenu($1, $0.worldLocation.x, $0.worldLocation.y);
}
}
},
$15: function ($p0, $p1) {
var $0 = $p1;
if ($0.action === 3 && $0.items.length > 0) {
var $1 = $0.items[0];
this.$0.closeInfoWindow();
this.$0.$41().$1F(RMap.$create_Coordinate($1.getGeometry().getCoordinates() [0], $1.getGeometry().getCoordinates() [1]), $p0, $1);
}
},
getRoutingLayer: function () {
return this.$A;
},
getRouteType: function () {
return this.$E;
},
setShortest: function () {
this.$E = 'shortest';
},
setFastest: function () {
this.$E = 'fastest';
},
$16: function () {
this.$E = 'shortest';
this.loadRoute(true);
},
$17: function () {
this.$E = 'fastest';
this.loadRoute(true);
},
revert: function () {
var $0 = this.$7;
this.$7 = this.$9;
this.$9 = $0;
this.$8.reverse();
this.loadRoute(true);
},
enable: function () {
this.$B = true;
},
disable: function () {
this.$B = false;
},
clear: function () {
this.$A.getFeatureView().getStorage().$9 = {
};
this.$A.getFeatureView().getStorage().clear();
},
setStart: function (x, y, road, station, descr) {
var $0 = this.$18(x, y, road, station, descr);
if ($0.valid) {
this.$7 = $0;
}
return $0.valid;
},
addVia: function (x, y, road, station, descr) {
return this.setVia(x, y, road, station, descr, this.$8.length);
},
setVia: function (x, y, road, station, descr, n) {
if (isNullOrUndefined(n) || n === - 1) {
n = 0;
}
if (n >= RMap.RoutingSettings.maxViaNumber) {
return false;
}
var $0 = this.$18(x, y, road, station, descr);
if ($0.valid) {
this.$8[n] = $0;
}
return $0.valid;
},
setEnd: function (x, y, road, station, descr) {
var $0 = this.$18(x, y, road, station, descr);
if ($0.valid) {
this.$9 = $0;
}
return $0.valid;
},
$18: function ($p0, $p1, $p2, $p3, $p4) {
var $0 = new RMap.RoutingPoint();
if (isNullOrUndefined($p2) || isNullOrUndefined($p3)) {
$0 = this.$1F($p0, $p1);
} else {
$0.location = RMap.$create_Coordinate($p0, $p1);
$0.road = $p2;
$0.stac = $p3.toString();
$0.valid = true;
}
if (!isNullOrUndefined($p4) && $0.valid) {
$0.descr = $p4;
}
return $0;
},
getStart: function () {
return this.$7;
},
getVias: function () {
return this.$8;
},
getEnd: function () {
return this.$9;
},
removeStart: function () {
this.$7 = new RMap.RoutingPoint();
},
removeVia: function (n) {
if (isNullOrUndefined(n) || n === - 1) {
n = this.$8.length - 1;
}
if (n >= 0 && n < this.$8.length) {
this.$8.splice(n, 1);
}
},
removeAllVias: function () {
this.$8 = new Array(0);
},
removeCilj: function () {
this.$9 = new RMap.RoutingPoint();
},
$19: function () {
var $0 = this.$1F(this.$5.x, this.$5.y);
if ($0.valid) {
this.$7 = $0;
this.loadRoute(false);
}
},
$1A: function () {
var $0 = this.$1F(this.$5.x, this.$5.y);
if ($0.valid) {
this.$8[this.$8.length] = $0;
this.loadRoute(false);
}
},
$1B: function () {
var $0 = this.$1F(this.$5.x, this.$5.y);
if ($0.valid) {
this.$9 = $0;
this.loadRoute(false);
}
},
$1C: function () {
this.$7 = new RMap.RoutingPoint();
this.loadRoute(false);
},
$1D: function () {
var $0 = false;
if (!$0 && this.$6 >= 0) {
var $1 = - 1;
for (var $2 = 0; $2 < this.$8.length; $2++) {
if (this.$8[$2].valid) {
$1++;
if ($1 === this.$6) {
this.$8.splice($2, 1);
$0 = true;
break;
}
}
}
}
if (!$0) {
this.$8 = new Array(0);
}
this.loadRoute(false);
},
$1E: function () {
this.$9 = new RMap.RoutingPoint();
this.loadRoute(false);
},
$1F: function ($p0, $p1) {
var $0 = new RMap.RoutingPoint();
$0.location = RMap.$create_Coordinate($p0, $p1);
var $1 = this.$22(RMap.RoutingSettings.geocodingUrl, 'content=ceste&x=' + $0.location.x.toString() + '&y=' + $0.location.y.toString() + '&dist=' + RMap.RoutingSettings.geocodingTolerance.toString());
if ($1 && $1['items']) {
var $2 = $1['items'];
if ($2.length > 0 && $2[0]['odsek'] && $2[0]['ds_at']) {
$0.location = RMap.$create_Coordinate($2[0]['bvx'], $2[0]['bvy']);
$0.road = $2[0]['odsek'];
$0.stac = $2[0]['ds_at'];
$0.descr = $2[0]['descr'];
$0.valid = true;
} else {
this.$12(new RMap.RoutingEventArgs(null, 100));
if (!this.$D) {
window.setTimeout(Delegate.create(this, this.$20), 0);
}
}
} else {
this.$12(new RMap.RoutingEventArgs(null, 99));
if (!this.$D) {
window.setTimeout(Delegate.create(this, this.$21), 0);
}
}
return $0;
},
$20: function () {
RMap.Messages.$2(this.$0, RMap.RoutingSettings.geocoding_noRoad);
},
$21: function () {
RMap.Messages.$2(this.$0, RMap.RoutingSettings.geocoding_requestProblem);
},
$22: function ($p0, $p1) {
var $0 = new XMLHttpRequest();
try {
if (!ScriptFX.Application.current.get_isIE()) {
$0._defaultCharset = 'utf-8';
}
$p0 = RMap._DomHelper.$17($p0, RMap._DomHelper.$14());
$p0 = RMap.MapApplication.proxyUrl + '?method=POST&remoteUrl=' + escape($p0);
$0.open('POST', $p0, false);
$0.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
$0.send($p1);
if ($0.status === 200) {
var $1 = eval('(' + $0.responseText + ')');
return $1;
}
} catch ($2) {
}
return null;
},
loadRoute: function (forceReload) {
var $0 = [
];
if (this.$7.valid) {
var $1 = new RMap.Geometry(1, [
this.$7.location.x,
this.$7.location.y
]);
var $2 = {
xsi_type: 'RouteDescriptionStart',
Description: this.$7.descr
};
$0[$0.length] = new RMap.Feature('start', $1, $2);
}
for (var $3 = 0; $3 < this.$8.length; $3++) {
if (this.$8[$3].valid) {
var $4 = new RMap.Geometry(1, [
this.$8[$3].location.x,
this.$8[$3].location.y
]);
var $5 = {
xsi_type: 'RouteDescriptionVia',
Description: this.$8[$3].descr
};
$0[$0.length] = new RMap.Feature('via_' + $3.toString(), $4, $5);
}
}
if (this.$9.valid) {
var $6 = new RMap.Geometry(1, [
this.$9.location.x,
this.$9.location.y
]);
var $7 = {
xsi_type: 'RouteDescriptionEnd',
Description: this.$9.descr
};
$0[$0.length] = new RMap.Feature('cilj', $6, $7);
}
this.$A.getFeatureView().getStorage().$9 = {
};
if (!forceReload && !RMap.RoutingSettings.autoReload) {
this.$A.getFeatureView().getStorage().update(new Array(0), null);
this.$A.getFeatureView().getStorage().update($0, null);
return;
} else {
this.$A.getFeatureView().getStorage().update($0, null);
}
if (this.$7.valid && this.$9.valid) {
var $8 = 'typeOfRoute=' + this.$E;
$8 += '&road=' + this.$7.road;
$8 += '&station=' + this.$7.stac.toString();
for (var $9 = 0; $9 < this.$8.length; $9++) {
if (this.$8[$9].valid) {
$8 += '&road=' + this.$8[$9].road;
$8 += '&station=' + this.$8[$9].stac.toString();
}
}
$8 += '&road=' + this.$9.road;
$8 += '&station=' + this.$9.stac.toString();
$8 += '&decimalPlaces=' + RMap.RoutingSettings.decimalPlaces;
$8 += '&useCache=false';
if (RMap.RoutingSettings.transformer) {
$8 += '&xslt=' + RMap.RoutingSettings.transformer;
}(this.$A.getFeatureView().getStorage()).setData($8);
(this.$A.getFeatureView().getStorage()).load();
}
},
$23: function ($p0) {
if (this.$C) {
return '';
}
return this.$25($p0, false);
},
$24: function ($p0) {
return this.$25($p0, true);
},
$25: function ($p0, $p1) {
var $0 = '';
if ($p1) {
var $3 = this.$A.$22($p0);
if ($p0.properties['Icon']) {
$0 += '<img src=\'' + RMap.MapApplication.resourcesUrl + 'routing/' + $p0.properties['Icon'] + '.gif\' style=\'margin-right:5px\'/>';
} else if (!isNullOrUndefined($3.getHTML2)) {
$0 += $3.getHTML2($p0, 'margin-right:5px');
}
}
if ($p0.properties['Time'] && $p0.properties['Station']) {
$0 += '<span class=\'RouteTimeStation\'>' + $p0.properties['Time'].toString() + ', ' + $p0.properties['Station'].toString() + '</span><br/>';
}
var $1 = '';
switch ($p0.properties['xsi_type'].toString()) {
case 'RouteDescriptionTurn':
$0 += $p0.properties['Description'].toString();
break;
case 'RouteDescriptionTerminal':
$0 += $p0.properties['Description'].toString();
var $2 = $p0.properties['Prices'];
if ($2 && $2.length > 0) {
$1 += '<br/>';
$1 += '<img src=\'' + RMap.MapApplication.resourcesUrl + 'routing/ikona-cestnina_A.gif\' hspace=\'3\'/><span style=\'font-size:80%\'> 1. ' + RMap.RoutingSettings.category + ': ' + $2[0] + '</span><br/>';
$1 += '<img src=\'' + RMap.MapApplication.resourcesUrl + 'routing/ikona-cestnina_B.gif\' hspace=\'3\'/><span style=\'font-size:80%\'> 2. ' + RMap.RoutingSettings.category + ': ' + $2[1] + '</span><br/>';
$1 += '<img src=\'' + RMap.MapApplication.resourcesUrl + 'routing/ikona-cestnina_C.gif\' hspace=\'3\'/><span style=\'font-size:80%\'> ' + RMap.RoutingSettings.category3 + ': ' + $2[2] + '</span><br/>';
$1 += '<img src=\'' + RMap.MapApplication.resourcesUrl + 'routing/ikona-cestnina_D.gif\' hspace=\'3\'/><span style=\'font-size:80%\'> ' + RMap.RoutingSettings.category4 + ': ' + $2[3] + '</span>';
}
break;
case 'RouteDescriptionStart':
$0 += RMap.RoutingSettings.start + ': ' + $p0.properties['Description'].toString();
break;
case 'RouteDescriptionEnd':
$0 += RMap.RoutingSettings.end + ': ' + $p0.properties['Description'].toString();
break;
case 'RouteDescriptionVia':
$0 += RMap.RoutingSettings.via + ': ' + $p0.properties['Description'].toString();
break;
default:
$0 += $p0.properties['xsi_type'].toString();
break;
}
if (this.routeItemDescriptor) {
$1 = this.routeItemDescriptor.invoke($p0, $p1);
}
return $0 + $1;
}
}
RMap.RoutingSettings = function () {
}
RMap._TEAE = function () {
}
RMap._TEAE.$1 = function ($p0, $p1) {
if (!$p1) {
$p1 = RMap._TEAE.$0;
}
if (!$p0.length) {
return String.Empty;
}
var $0 = RMap._TEAE.$3($p0);
var $1 = RMap._TEAE.$3($p1);
if ($0.length <= 1) {
$0 = [
$0[0],
0
];
}
var $2 = $0.length;
var $3 = $0[$2 - 1],
$4 = $0[0],
$5 = 2654435769;
var $6,
$7,
$8 = Math.floor((6 + 52 / $2)),
$9 = 0;
while ($8-- > 0) {
$9 += $5;
$7 = $9 >>> 2 & 3;
for (var $B = 0; $B < $2; $B++) {
$4 = $0[($B + 1) % $2];
$6 = ($3 >>> 5 ^ $4 << 2) + ($4 >>> 3 ^ $3 << 4) ^ ($9 ^ $4) + ($1[$B & 3 ^ $7] ^ $3);
$3 = $0[$B] += $6;
}
}
var $A = RMap._TEAE.$4($0);
$A = RMap._TEAE.$A($A);
return $A;
}
RMap._TEAE.$2 = function ($p0, $p1) {
if (!$p1) {
$p1 = RMap._TEAE.$0;
}
$p0 = RMap._TEAE.$C($p0);
if (!$p0.length) {
return String.Empty;
}
var $0 = RMap._TEAE.$3($p0);
var $1 = RMap._TEAE.$3($p1);
var $2 = $0.length;
var $3 = $0[$2 - 1],
$4 = $0[0],
$5 = 2654435769;
var $6,
$7,
$8 = Math.floor((6 + 52 / $2)),
$9 = $8 * $5;
while ($9) {
$7 = $9 >>> 2 & 3;
for (var $B = $2 - 1; $B >= 0; $B--) {
$3 = $0[($B > 0) ? $B - 1 : $2 - 1];
$6 = ($3 >>> 5 ^ $4 << 2) + ($4 >>> 3 ^ $3 << 4) ^ ($9 ^ $4) + ($1[$B & 3 ^ $7] ^ $3);
$4 = $0[$B] -= $6;
}
$9 -= $5;
}
var $A = RMap._TEAE.$4($0);
return $A;
}
RMap._TEAE.$3 = function ($p0) {
var $0 = new Array(Math.ceil(($p0.length / 4)));
for (var $1 = 0; $1 < $0.length; ++$1) {
$0[$1] = (RMap._TEAE.$5($p0, $1 * 4) + (RMap._TEAE.$5($p0, $1 * 4 + 1) << 8) + (RMap._TEAE.$5($p0, $1 * 4 + 2) << 16) + (RMap._TEAE.$5($p0, $1 * 4 + 3) << 24));
}
return $0;
}
RMap._TEAE.$4 = function ($p0) {
var $0 = new StringBuilder();
for (var $1 = 0; $1 < $p0.length; ++$1) {
var $2 = $p0[$1];
$0.append(RMap._TEAE.$8(($2 & 255), ($2 >> 8) & 255, ($2 >> 16) & 255, ($2 >> 24) & 255));
}
return $0.toString();
}
RMap._TEAE.$5 = function ($p0, $p1) {
return $p0.charCodeAt($p1);
}
RMap._TEAE.$6 = function ($p0, $p1) {
return $p0.charAt($p1);
}
RMap._TEAE.$7 = function ($p0) {
return String.fromCharCode($p0);
}
RMap._TEAE.$8 = function ($p0, $p1, $p2, $p3) {
return String.fromCharCode($p0, $p1, $p2, $p3);
}
RMap._TEAE.$A = function ($p0) {
var $0 = new StringBuilder();
for (var $1 = 0; $1 < $p0.length; ++$1) {
var $2 = RMap._TEAE.$5($p0, $1);
$0.append(RMap._TEAE.$6('0123456789ABCDEF', ($2 >> 4) & 15));
$0.append(RMap._TEAE.$6('0123456789ABCDEF', $2 & 15));
}
return $0.toString();
}
RMap._TEAE.$B = function ($p0) {
if ($p0 >= '0' && $p0 <= '9') {
return $p0 - '0';
} else if ($p0 >= 'A' && $p0 <= 'F') {
return ($p0).charCodeAt(0) - 55;
} else if ($p0 >= 'a' && $p0 <= 'f') {
return ($p0).charCodeAt(0) - 87;
} else {
throw new Error('FromHex error');
}
}
RMap._TEAE.$C = function ($p0) {
var $0 = new StringBuilder();
for (var $1 = 0; $1 < $p0.length; $1 += 2) {
$0.append(RMap._TEAE.$7((RMap._TEAE.$B(RMap._TEAE.$6($p0, $1)) << 4) | (RMap._TEAE.$B(RMap._TEAE.$6($p0, $1 + 1)))));
}
return $0.toString();
}
RMap._TEAE.$D = function ($p0) {
var $0 = new StringBuilder();
var $1 = $p0.length - 1;
var $2 = Math.ceil($p0.length / 2);
for (var $3 = 0; $3 < $2; $3++) {
$0.append(String.fromCharCode(255 - $p0.charCodeAt($3)));
$0.append(String.fromCharCode(255 - $p0.charCodeAt($1 - $3)));
}
return $0.toString().substring(0, $p0.length);
}
RMap._TEAE.$E = function ($p0) {
var $0 = new StringBuilder();
for (var $1 = 0; $1 < $p0.length; $1 += 2) {
$0.append(String.fromCharCode(255 - $p0.charCodeAt($1)));
}
if ($p0.length > 0 && $p0.length % 2 === 1) {
$p0 = $p0.substring(0, $p0.length - 1);
}
for (var $2 = $p0.length - 1; $2 >= 0; $2 -= 2) {
$0.append(String.fromCharCode(255 - $p0.charCodeAt($2)));
}
return $0.toString();
}
RMap._MsgEventArgs = function (msg) {
RMap._MsgEventArgs.constructBase(this);
this.$1_0 = msg;
}
RMap._MsgEventArgs.prototype = {
$1_0: null
}
RMap.Messages = function () {
}
RMap.Messages.add_$0 = function ($p0) {
RMap.Messages.$1 = Delegate.combine(RMap.Messages.$1, $p0);
}
RMap.Messages.remove_$0 = function ($p0) {
RMap.Messages.$1 = Delegate.remove(RMap.Messages.$1, $p0);
}
RMap.Messages.$2 = function ($p0, $p1) {
if (!$p1) {
return;
}
var $0 = new RMap._MsgEventArgs($p1);
if (RMap.Messages.$1) {
RMap.Messages.$1.invoke($p0, $0);
}
if (($0) ['returnValue'] !== false) {
alert($p1);
}
}
RMap.MapApplication = function () {
}
RMap.MapApplication.getDefaultMapSetting = function () {
if (RMap.MapApplication.settingsXml) {
return RMap.MapSettingsLoader.loadMap(RMap.MapApplication.settingsXml);
}
return RMap.MapSettingsLoader.loadMap(RMap.MapApplication.settingsUrl);
}
RMap.MapApplication.getBlankImage = function () {
return RMap._Environment.$1();
}
RMap.MapApplication.enableExt = function () {
RMap._DomHelper.$1C();
}
RMap.MapApplication.geDefaultStyle = function (feature) {
if (feature.geometry.getGeometryType() === 1) {
if (!RMap.MapApplication.$0) {
RMap.MapApplication.$0 = new RMap.ImageSymbolPointStyle();
RMap.MapApplication.$0.iconSrc = RMap.MapApplication.resourcesUrl + 'Icons/default.gif';
RMap.MapApplication.$0.iconSize = ScriptFX.UI.$create_Size(12, 20);
RMap.MapApplication.$0.anchor = ScriptFX.UI.$create_Location(6, 20);
RMap.MapApplication.$0.infoWindowAnchor = ScriptFX.UI.$create_Location(6, 6);
}
return RMap.MapApplication.$0;
}
if (feature.geometry.getGeometryType() === 3) {
if (!RMap.MapApplication.$1) {
RMap.MapApplication.$1 = new RMap.ShapeStyle();
RMap.MapApplication.$1.strokeColor = '#000000';
RMap.MapApplication.$1.strokeWidth = 3;
RMap.MapApplication.$1.strokeOpacity = 80;
RMap.MapApplication.$1.fillColor = '#ffff00';
RMap.MapApplication.$1.fillOpacity = 30;
}
return RMap.MapApplication.$1;
} else {
if (!RMap.MapApplication.$2) {
RMap.MapApplication.$2 = new RMap.ShapeStyle();
RMap.MapApplication.$2.strokeColor = '#0000ff';
RMap.MapApplication.$2.strokeWidth = 5;
RMap.MapApplication.$2.strokeOpacity = 50;
}
return RMap.MapApplication.$2;
}
}
RMap.MapApplication.$7 = function () {
if (!RMap._DomHelper.$1E()) {
RMap.MapApplication.$9();
}
return (RMap._DomHelper.$1E());
}
RMap.MapApplication.registerInitCallback = function (func) {
if (RMap._DomHelper.$1E()) {
func.invoke();
} else {
RMap.MapApplication.$9();
RMap.MapApplication.$4[RMap.MapApplication.$4.length] = func;
}
}
RMap.MapApplication.$8 = function () {
if (!RMap._DomHelper.$1E()) {
return;
}
for (var $0 = 0; $0 < RMap.MapApplication.$4.length; $0++) {
if (RMap.MapApplication.$4[$0]) {
RMap.MapApplication.$4[$0].invoke();
RMap.MapApplication.$4[$0] = null;
}
}
}
RMap.MapApplication.$9 = function () {
if (!RMap.MapApplication.$3) {
RMap.MapApplication.$5 = Delegate.create(null, RMap.MapApplication.$8);
window.document.attachEvent('onreadystatechange', RMap.MapApplication.$5);
window.self.attachEvent('onload', RMap.MapApplication.$5);
document.attachEvent('onload', RMap.MapApplication.$5);
window.document.attachEvent('onDOMContentLoaded', RMap.MapApplication.$5);
RMap.MapApplication.$3 = true;
}
}
RMap.MapApplication.initializeV2 = function (url) {
if (!url.endsWith('/')) {
url += '/';
}
RMap.MapApplication.resourcesUrl = url + 'Realis.RMap.Client/_resources/';
RMap.MapApplication.proxyUrl = null;
RMap.MapApplication.swUrl = url + 'Realis.RMap.RWProxy/RwProxy.ashx';
RMap.MapApplication.tileBuffer = 0;
RMap.MapApplication.appInternalZoomLevels = [
];
for (var $0 = - 10; $0 <= 16; $0++) {
RMap.MapApplication.appInternalZoomLevels[RMap.MapApplication.appInternalZoomLevels.length] = Math.pow(2, $0);
}
}
RMap.MapApplication.initializeV2Map = function (cfg, el, url, map, noTiles, noLayers, noControls, extraCfg) {
if (url) {
RMap.MapApplication.initializeV2(url);
}
if (cfg) {
if (cfg['tileBuffer']) {
RMap.MapApplication.tileBuffer = cfg['tileBuffer'];
}
if (!map) {
map = new RMap.Map();
var $0 = new RMap.MapSettings();
$0.defaultCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem((cfg['defaultView']) ['defaultCrs']);
$0.tileMapCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem((cfg['defaultView']) ['tilesetCrs']);
$0.defaultCenter = (cfg['defaultView']) ['center'];
$0.defaultMetersPerUnit = (cfg['defaultView']) ['defaultMetersPerUnit'];
if ($0.defaultMetersPerUnit > 0) {
var $2 = $0.getBestZoomLevel(($0.defaultMetersPerUnit + 'm'));
$0.zoomLevels[$2] = $0.defaultMetersPerUnit;
for (var $3 = $2 + 1; $3 < $0.zoomLevels.length; $3++) {
$0.zoomLevels[$3] = $0.zoomLevels[$3 - 1] * 2;
}
for (var $4 = $2 - 1; $4 >= 0; $4--) {
$0.zoomLevels[$4] = $0.zoomLevels[$4 + 1] / 2;
}
}
if ((cfg['defaultView']) ['detailMetersPerUnit']) {
$0.detailZoomLevel = $0.getBestZoomLevel(((cfg['defaultView']) ['detailMetersPerUnit'] + 'm'));
}
var $1 = {
};
$1['mapSettings'] = $0;
if (cfg['appCopyright']) {
$1['cprAppending'] = cfg['appCopyright'];
}
$1['autoResize'] = true;
map.initialize(el, $1);
}
if (!noTiles) {
var $5 = (cfg['tileSets']);
for (var $6 = 0; $6 < $5.length; $6++) {
map.addTileThemeLayer(($5[$6]) ['title'], ($5[$6]) ['url']);
}
}
if (!noLayers) {
if (cfg['layerDefinitions'] && cfg['startupLayers']) {
var $7 = (cfg['startupLayers']);
for (var $8 = 0; $8 < $7.length; $8++) {
var $9 = (cfg['layerDefinitions']) [$7[$8]];
var $A = $9.getLayer($9, map);
if (!map.layers[($9) ['id']]) {
map.addLayer($A);
}
}
}
}
if (!noControls) {
if (cfg['controls']) {
var $B = (cfg['controls']);
var $C = window.self.RMap;
var $D = $C.MapControl;
for (var $E = 0; $E < $B.length; $E++) {
var $F = $B[$E];
var $10 = 'create' + $F['type'] + 'Control';
if ($D[$10]) {
var $11 = $F['config'];
if (isNullOrUndefined($11)) {
$11 = {
};
}
if (!Object.keyExists($11, 'id')) {
$11['id'] = $F['type'];
}
var $12 = $D[$10]($11);
map.addControl($12, (($F['style']) ? $F['style'] : null));
}
}
}
}
}
map.$1 = cfg;
return map;
}
RMap.MapApplication.openExternalMap = function (mapUrl, cfg) {
var $0 = document.createElement('form');
$0.action = mapUrl;
$0.target = '_blank';
$0.method = 'POST';
$0.style.display = 'none';
var $1 = document.createElement('input');
if (typeof (cfg) === 'string') {
$1.name = 'configurl';
$1.value = cfg;
} else {
$1.name = 'config';
$1.value = 'var rmapApplicationSettings=' + RMap.JsonTools.obj2json(cfg, false);
}
$0.appendChild($1);
document.body.appendChild($0);
$0.submit();
for (var $2 = $0.childNodes.length - 1; $2 >= 0; $2--) {
$0.removeChild($0.childNodes[$2]);
document.body.removeChild($0);
}
}
RMap._NavigationControl = function (dict) {
this.$0 = (dict) ? dict['id'] : null;
if (dict && dict['scale']) {
this.$A = dict['scale'];
}
var $0 = document.createElement('img');
$0.src = RMap.MapApplication.resourcesUrl + 'Controls/navigation.gif';
$0.style.position = 'absolute';
$0.style.height = Math.round(this.$A * 58) + 'px';
$0.style.width = Math.round(this.$A * 105) + 'px';
this.$2 = document.createElement('div');
this.$2.style.position = 'absolute';
this.$2.style.height = Math.round(this.$A * 58) + 'px';
this.$2.style.width = Math.round(this.$A * 105) + 'px';
this.$2.appendChild($0);
this.$3 = this.$C('PL', 'pan left', 0, 20, 17, 17);
this.$4 = this.$C('PR', 'pan right', 40, 20, 17, 17);
this.$5 = this.$C('PU', 'pan up', 20, 0, 17, 17);
this.$6 = this.$C('PD', 'pan down', 20, 40, 17, 17);
this.$7 = this.$C('DV', 'default view', 20, 20, 17, 17);
this.$9 = this.$C('ZO', 'zoom out', 67, 20, 17, 17);
this.$8 = this.$C('ZI', 'zoom in', 87, 20, 17, 17);
}
RMap._NavigationControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: 1,
$B: 0,
attach: function ($p0) {
this.$1 = $p0;
this.$1.getControlsSurface().appendChild(this.$2);
return this.$2;
},
detach: function () {
this.$1.getControlsSurface().removeChild(this.$2);
},
$C: function ($p0, $p1, $p2, $p3, $p4, $p5) {
var $0 = document.createElement('div');
$0._cmd = $p0;
$0.title = $p1;
var $1 = $0.style;
$1.cursor = RMap.Browser.crsPointer;
$1.position = 'absolute';
$1.backgroundColor = '#ffffff';
$1.filter = 'alpha(opacity=1)';
$1.opacity = '0';
$1.MozOpacity = 0;
$1.width = Math.round(this.$A * $p4) + 'px';
$1.height = Math.round(this.$A * $p5) + 'px';
$1.left = Math.round(this.$A * $p2) + 'px';
$1.top = Math.round(this.$A * $p3) + 'px';
$0.attachEvent('ontouchstart', Delegate.create(this, this.$D));
$0.attachEvent('onclick', Delegate.create(this, this.$E));
$0.attachEvent('ondblclick', Delegate.create(this, this.$E));
$0.attachEvent('oncontextmenu', Delegate.create(null, RMap._DomHelper.$B));
this.$2.appendChild($0);
return $0;
},
$D: function () {
if (!this.$B) {
this.$B = 1;
}
if (this.$B === 1) {
this.$F();
}
},
$E: function () {
RMap._DomHelper.$B();
if (this.$B === 1) {
this.$B = 2;
return;
}
this.$F();
},
$F: function () {
var $0 = window.event.srcElement._cmd;
if (isNullOrUndefined($0)) {
return;
}
var $1 = this.$1.$39().$11();
switch ($0) {
case 'PL':
this.$1.panPixels( - $1.width / 3, 0);
break;
case 'PR':
this.$1.panPixels($1.width / 3, 0);
break;
case 'PU':
this.$1.panPixels(0, $1.height / 3);
break;
case 'PD':
this.$1.panPixels(0, - $1.height / 3);
break;
case 'DV':
this.$1.setDefaultView();
break;
case 'ZI':
this.$1.zoomIn(1);
break;
case 'ZO':
this.$1.zoomOut(1);
break;
}
},
$10: function () {
}
}
RMap._MapOverviewControl = function (dict) {
this.$0 = (dict) ? dict['id'] : null;
if (dict) {
if (!isNullOrUndefined(dict['zoomFactor'])) {
this.$8 = dict['zoomFactor'];
}
if (dict['closed']) {
this.$7 = false;
}
if (!isNullOrUndefined(dict['size'])) {
this.$A = parseInt(dict['size']);
}
if (!isNullOrUndefined(dict['border'])) {
this.$B = parseInt(dict['border']);
}
}
this.$1 = new RMap.Map();
this.$1.$11 = this.$8;
this.$3 = document.createElement('div');
this.$3.style.position = 'absolute';
this.$3.style.backgroundColor = '#ffffff';
this.$3.style.width = (this.$A + this.$B) + 'px';
this.$3.style.height = (this.$A + this.$B) + 'px';
this.$3.style.borderLeft = 'solid 1px gray';
this.$3.style.borderTop = 'solid 1px gray';
this.$5 = document.createElement('img');
this.$5.src = RMap.MapApplication.resourcesUrl + 'Overview/se-arrow.gif';
this.$5.style.position = 'absolute';
this.$5.style.right = '0px';
this.$5.style.bottom = '0px';
this.$5.style.cursor = RMap.Browser.crsPointer;
if (!dict || isNullOrUndefined(dict['envelopeRectangle']) || dict['envelopeRectangle']) {
this.$6 = document.createElement('div');
this.$6.className = 'Overview';
this.$6.style.position = 'absolute';
this.$6.innerHTML = '<div class=\'Region\' style=\'position:relative; width:100%; height:100%\'><b></b></div>';
this.$6.style.left = '50%';
this.$6.style.top = '50%';
}
this.$5.attachEvent('onclick', Delegate.create(this, this.$C));
}
RMap._MapOverviewControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: true,
$8: 5,
$9: 0,
$A: 200,
$B: 5,
attach: function ($p0) {
this.$2 = $p0;
this.$4 = document.createElement('div');
this.$4.style.position = 'absolute';
this.$4.style.width = this.$A + 'px';
this.$4.style.height = this.$A + 'px';
this.$4.style.right = '0px';
this.$4.style.bottom = '0px';
this.$4.style.border = 'solid 1px gray';
this.$3.appendChild(this.$4);
this.$3.appendChild(this.$5);
this.$2.getControlsSurface().appendChild(this.$3);
this.$1.initialize(this.$4, {
mapSettings: this.$2.$0
});
this.$1.$32();
this.$1.disableAnimation();
this.$1.$13 = this.$2.$13 + this.$8;
this.$1.$14 = this.$2.$14 + this.$8;
this.$1.setView(this.$2.$12.$F().x, this.$2.$12.$F().y, this.$2.$15 + this.$8, this.$2.$12.$E());
if (this.$6) {
this.$1.getControlsSurface().appendChild(this.$6);
this.$13();
}
this.$1.add_$26(Delegate.create(this, this.$10));
if (this.$7) {
this.$2.add_$26(Delegate.create(this, this.$11));
this.$5.src = RMap.MapApplication.resourcesUrl + 'Overview/se-arrow.gif';
} else {
this.$4.style.display = 'none';
this.$3.style.width = '0px';
this.$3.style.height = '0px';
this.$5.src = RMap.MapApplication.resourcesUrl + 'Overview/nw-arrow.gif';
}
this.$2.add_$28(Delegate.create(this, function ($p1_0, $p1_1) {
this.$1.$40(this.$2.getCurrentTheme(), true);
}));
return this.$3;
},
detach: function () {
this.$2.getControlsSurface().removeChild(this.$1.$4);
},
$C: function () {
RMap._DomHelper.$B();
if (this.$7) {
this.$E();
} else {
this.$D();
}
},
$D: function () {
if (this.$7) {
return;
}
this.$1.setView(this.$2.$12.$F().x, this.$2.$12.$F().y, this.$2.$15 + this.$8, this.$2.$12.$E());
this.$2.add_$26(Delegate.create(this, this.$11));
this.$4.style.display = 'block';
this.$3.style.width = (this.$A + this.$B) + 'px';
this.$3.style.height = (this.$A + this.$B) + 'px';
this.$5.src = RMap.MapApplication.resourcesUrl + 'Overview/se-arrow.gif';
this.$7 = true;
if (this.$6) {
this.$13();
}
},
$E: function () {
if (!this.$7) {
return;
}
this.$2.remove_$26(Delegate.create(this, this.$11));
this.$4.style.display = 'none';
this.$3.style.width = '0px';
this.$3.style.height = '0px';
this.$5.src = RMap.MapApplication.resourcesUrl + 'Overview/nw-arrow.gif';
this.$7 = false;
},
$10: function ($p0, $p1) {
window.clearTimeout(this.$9);
this.$9 = window.setTimeout(Delegate.create(this, function () {
this.$2.setView(this.$1.$12.$F().x, this.$1.$12.$F().y, this.$1.$15 - this.$8, this.$1.$12.$E());
}), RMap._MapOverviewControl.$F);
},
$11: function ($p0, $p1) {
window.clearTimeout(this.$9);
this.$9 = window.setTimeout(Delegate.create(this, this.$12), RMap._MapOverviewControl.$F);
},
$12: function () {
this.$1.setView(this.$2.$12.$F().x, this.$2.$12.$F().y, this.$2.$15 + this.$8, this.$2.$12.$E());
this.$13();
},
$13: function () {
if (this.$6) {
var $0 = this.$1.$39().$10() / this.$2.$39().$10();
var $1 = this.$2.$39().$11();
var $2 = parseInt($1.width / $0);
var $3 = - parseInt($2 / 2);
var $4 = parseInt($1.height / $0);
var $5 = - parseInt($4 / 2);
this.$6.style.width = $2.toString() + 'px';
this.$6.style.marginLeft = $3.toString() + 'px';
this.$6.style.height = $4.toString() + 'px';
this.$6.style.marginTop = $5.toString() + 'px';
}
}
}
RMap.ScaleBarControl = function (dict) {
this._id = (dict) ? dict['id'] : null;
this.$1 = (dict) ? dict['crs'] : null;
this.$3 = Delegate.create(this, this.$B);
this.$4 = Delegate.create(this, this.$C);
}
RMap.ScaleBarControl.prototype = {
_id: null,
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
attach: function (map) {
this.$0 = map;
if (isNullOrUndefined(this.$1)) {
this.$1 = this.$0.getDefaultCoordinateSystem();
}
this.$2 = document.createElement('div');
this.$2.style.position = 'absolute';
this.$2.style.height = '26px';
this.$2.style.width = '413px';
this.$5 = this.$E(0, 0, 4, 26, 0, 0);
this.$6 = this.$E(3, 11, 400, 4, - 413 + 150, 0);
this.$7 = this.$E(100, 0, 4, 12, - 4, 0);
this.$2.appendChild(this.$5);
this.$2.appendChild(this.$6);
this.$2.appendChild(this.$7);
this.$8 = document.createElement('div');
this.$8.style.position = 'absolute';
this.$8.style.bottom = '15px';
this.$8.style.left = '8px';
this.$8.style.fontFamily = 'arial';
this.$8.style.fontSize = '10px';
this.$2.appendChild(this.$8);
this.$9 = document.createElement('div');
this.$9.style.position = 'absolute';
this.$9.style.top = '15px';
this.$9.style.left = '8px';
this.$9.style.fontFamily = 'arial';
this.$9.style.fontSize = '10px';
this.$2.appendChild(this.$9);
this.$0.attachEvent('view', this.$3);
this.$0.attachEvent('mousemove', this.$4);
this.$0.getControlsSurface().appendChild(this.$2);
this.$D();
return this.$2;
},
setCoordinateSystem: function (crsId) {
this.$1 = RMap.CoordinateSystem.getCoordinateSystem(crsId);
},
detach: function () {
window.clearTimeout(this.$A);
this.$0.detachEvent('view', this.$3);
this.$0.detachEvent('mouse', this.$4);
this.$3 = null;
this.$4 = null;
this.$0.getControlsSurface().removeChild(this.$2);
},
$A: 0,
$B: function ($p0, $p1) {
if (this.$A) {
window.clearTimeout(this.$A);
}
this.$A = window.setTimeout(Delegate.create(this, this.$D), 50);
},
$C: function ($p0, $p1) {
var $0 = $p1;
var $1 = RMap.CoordinateSystem.$4($0.worldLocation, this.$0.getDefaultCoordinateSystem(), this.$1);
this.$9.innerText = $1.x.toFixed(5) + ',' + $1.y.toFixed(5);
},
$D: function () {
this.$A = 0;
var $0 = this.$0.$39().$1A();
var $1 = 100 * $0;
var $2 = $1.toExponential(0).split('e+');
var $3 = parseFloat($2[0]);
var $4 = parseFloat($2[1]);
var $5 = Math.round(($3 * Math.pow(10, $4) / $1) * 100);
if (!isNaN($5)) {
this.$7.style.left = $5 + 'px';
this.$6.children[0].style.left = ( - 413 + $5 + 30) + 'px';
}
if ($4 > 2) {
this.$8.innerText = $3 * Math.pow(10, $4 - 3) + ' km';
} else {
this.$8.innerText = $3 * Math.pow(10, $4) + ' m';
}
},
$E: function ($p0, $p1, $p2, $p3, $p4, $p5) {
var $0 = document.createElement('div');
var $1 = document.createElement('img');
$1.src = RMap.MapApplication.resourcesUrl + 'Controls/scalebar.png';
var $2 = $1.style;
$2.position = 'absolute';
$2.left = $p4 + 'px';
$2.top = $p5 + 'px';
$2.width = '413px';
$2.height = '26px';
$2.padding = '0px';
$2.margin = '0px';
$2.border = '0px';
$2 = $0.style;
$2.position = 'absolute';
$2.overflow = 'hidden';
$2.width = $p2 + 'px';
$2.height = $p3 + 'px';
$2.left = $p0 + 'px';
$2.top = $p1 + 'px';
$0.appendChild($1);
return $0;
},
dispose: function () {
}
}
RMap._ThemeSelectorControl = function (dict) {
this.$5 = new Array(0);
this.$0 = (dict) ? dict['id'] : null;
}
RMap._ThemeSelectorControl.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
attach: function ($p0) {
this.$1 = $p0;
this.$3 = document.createElement('table');
this.$3.style.position = 'absolute';
this.$3.className = 'ThemeSelectorControl';
this.$3.cellPadding = '0';
this.$3.cellSpacing = '1';
this.$3.border = '0';
this.$4 = this.$3.insertRow(0);
this.$2 = this.$1.getThemes();
this.$6();
return this.$3;
},
$6: function () {
if (this.$5.length > 0) {
for (var $0 = 0; $0 < this.$5.length; ++$0) {
this.$3.removeChild(this.$5[$0]);
}
this.$5 = new Array(0);
}
for (var $1 = 0; $1 < this.$2.length; ++$1) {
var $2 = this.$4.insertCell( - 1);
$2._cmd = this.$2[$1];
$2.className = 'Unselected';
$2.attachEvent('onclick', Delegate.create(this, this.$7));
this.$5[$1] = $2;
var $3 = document.createElement('div');
$3.innerText = this.$2[$1];
$3.className = 'DIV';
$3._cmd = this.$2[$1];
this.$5[$1].appendChild($3);
}
this.$8(this, EventArgs.Empty);
this.$1.add_$28(Delegate.create(this, this.$8));
this.$1.getControlsSurface().appendChild(this.$3);
},
detach: function () {
this.$1.remove_$28(Delegate.create(this, this.$8));
this.$1.getControlsSurface().removeChild(this.$3);
},
$7: function () {
var $0 = window.event.srcElement._cmd;
this.$1.setTheme($0);
},
$8: function ($p0, $p1) {
var $0 = this.$1.getThemes();
if ($0.length === this.$2.length) {
for (var $2 = 0; $2 < $0.length; ++$2) {
if ($0[$2] !== this.$2[$2]) {
this.$2 = $0;
this.$6();
break;
}
}
} else {
this.$2 = $0;
this.$6();
}
var $1 = this.$1.getCurrentTheme();
for (var $3 = 0; $3 < this.$5.length; ++$3) {
var $4 = this.$5[$3]._cmd;
if ($4 === $1) {
this.$5[$3].className = 'Selected';
} else {
this.$5[$3].className = 'Unselected';
}
}
}
}
RMap.CollectionChangedEventArgs = function (items, action) {
RMap.CollectionChangedEventArgs.constructBase(this);
this.items = items;
this.action = action;
}
RMap.CollectionChangedEventArgs.prototype = {
items: null,
action: 0,
innerArgs: null
}
RMap.Feature = function (id, geometry, properties) {
this.$0 = id;
this.geometry = geometry;
this.properties = (isNullOrUndefined(properties)) ? {
}
 : properties;
this.$3 = true;
}
RMap.Feature.prototype = {
$0: null,
$1: null,
$2: null,
$3: false,
$4: null,
geometry: null,
properties: null,
getId: function () {
return this.$0;
},
$5: function ($p0) {
this.$0 = $p0;
},
setInteractive: function (value) {
this.$3 = value;
},
isInteractive: function () {
return this.$3;
},
setStyle: function (style) {
this.$4 = style;
},
getStyle: function () {
return this.$4;
},
getSchema: function () {
return this.$1.getSchema();
},
$6: function ($p0) {
RMap._DomHelper.$0(this.geometry, $p0.geometry);
RMap._DomHelper.$0(this.properties, $p0.properties);
},
getProperty: function (name) {
var $0 = this.properties[name];
if (!isUndefined($0)) {
return $0;
}
return this.$1.getSchema().$A(this, name);
},
setProperty: function (name, value) {
this.$1.getSchema().$B(this, name, value);
},
$7: function () {
return this.$1.getSchema().getCoordinateSystem();
},
update: function () {
if (this.$1) {
this.$1.$1(new RMap.CollectionChangedEventArgs([this], 32));
}
}
}
RMap.FeatureDeserializer = function (properties) {
this._properties = properties;
}
RMap.FeatureDeserializer.prototype = {
_json: null,
_properties: null,
getDescription: function (data) {
return {
};
},
xmlStr2Json: function (data) {
return RMap.XmlTools.xml2json(RMap.XmlTools.xmlstr2xml(data));
},
parseWKT: function (wkt) {
var $0 = wkt.indexOf('(');
var $1 = wkt.lastIndexOf(')');
if ($0 > - 1 && $1 > - 1 && $1 > $0) {
var $2 = wkt.substr($0 + 1, $1 - $0 - 1).replace(new RegExp(', ', 'g'), ',').replace(new RegExp(' ', 'g'), ',');
if (wkt.substr(0, 5) === 'POINT') {
return new RMap.Geometry(1, eval('[' + $2 + ']'));
} else if (wkt.substr(0, 10) === 'LINESTRING') {
return new RMap.Geometry(2, eval('[' + $2 + ']'));
} else if (wkt.substr(0, 7) === 'POLYGON') {
$0 = $2.indexOf('(');
$1 = $2.indexOf(')');
if ($0 > - 1 && $1 > - 1 && $0 < $1) {
$2 = $2.substr($0 + 1, $1 - $0 - 1);
}
return new RMap.Geometry(3, eval('[' + $2 + ']'));
}
if (wkt.substr(0, 15) === 'MULTILINESTRING') {
$2 = $2.replace(new RegExp('\\(', 'g'), '').replace(new RegExp('\\)', 'g'), '');
return new RMap.Geometry(2, eval('[' + $2 + ']'));
}
}
return null;
},
applySchema: function (ftrs, schema) {
if (!schema) {
return ftrs;
}
var $0 = schema.$9();
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = $0[$1].name;
if ($0[$1].type.get_fullName() === 'Date') {
for (var $3 = 0; $3 < ftrs.length; $3++) {
ftrs[$3].properties[$2] = RMap.XmlTools.parseDate(ftrs[$3].properties[$2]);
}
} else if ($0[$1].type.get_fullName() === 'Number') {
if ($0[$1].$2 === 1) {
for (var $4 = 0; $4 < ftrs.length; $4++) {
ftrs[$4].properties[$2] = (ftrs[$4].properties[$2]) ? parseInt(ftrs[$4].properties[$2])  : null;
}
} else {
for (var $5 = 0; $5 < ftrs.length; $5++) {
ftrs[$5].properties[$2] = (ftrs[$5].properties[$2]) ? parseFloat(ftrs[$5].properties[$2])  : null;
}
}
} else if ($0[$1].type.get_fullName() === 'Boolean') {
for (var $6 = 0; $6 < ftrs.length; $6++) {
ftrs[$6].properties[$2] = Boolean.parse(ftrs[$6].properties[$2]);
}
}
}
return ftrs;
}
}
RMap.WktDeserializer = function (properties) {
RMap.WktDeserializer.constructBase(this, [
properties
]);
}
RMap.WktDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = parseInt(Math.random() * 89999) + 10000;
var $1 = new Array(0);
data = data.trim().replace(new RegExp(' ', 'g'), ' ').replace(new RegExp(', ', 'g'), ',').toUpperCase();
if (data.startsWith('GEOMETRYCOLLECTION')) {
data = data.substring(data.indexOf('(') + 1, data.lastIndexOf(')'));
var $2 = data.replace(new RegExp('\\),', 'g'), ')<BR>').split('<BR>');
for (var $3 = 0; $3 < $2.length; $3++) {
var $4 = this.parseWKT($2[$3]);
var $5 = {
};
var $6 = ($3 + 1).toString();
$5['title'] = $6;
$1[$1.length] = new RMap.Feature($0 + '_' + $6, $4, $5);
}
}
return $1;
} catch ($7) {
return null;
}
}
}
RMap.JsonDeserializer = function (properties) {
RMap.JsonDeserializer.constructBase(this, [
properties
]);
}
RMap.JsonDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = eval('(' + data + ')');
var $1 = $0;
if (this._properties['item']) {
var $A = (this._properties['item']).split('.');
for (var $B = 0; $B < $A.length; ++$B) {
$1 = $1[$A[$B]];
}
}
var $2 = $1;
var $3 = this._properties['id'];
var $4 = this._properties['x'];
var $5 = this._properties['y'];
var $6 = this._properties['wkt'];
var $7 = this._properties['image'];
var $8 = this._properties['link'];
var $9 = new Array(0);
for (var $C = 0; $C < $2.length; ++$C) {
var $D = $2[$C];
var $E = null;
if ($4 && $5) {
$E = new RMap.Geometry(1, [
$D[$4],
$D[$5]
]);
} else if ($6) {
$E = this.parseWKT($D[$6]);
}
if ($7) {
$D['image'] = $D[$7];
}
if ($8) {
$D['link'] = $D[$8];
}
$9[$C] = new RMap.Feature($D[$3], $E, $D);
}
return $9;
} catch ($F) {
return null;
}
}
}
RMap.GeoJsonDeserializer = function (properties) {
RMap.GeoJsonDeserializer.constructBase(this, [
properties
]);
}
RMap.GeoJsonDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = eval('(' + data + ')');
var $1 = $0;
var $2 = $1['features'];
var $3 = new Array(0);
for (var $4 = 0; $4 < $2.length; ++$4) {
var $5 = $2[$4];
var $6 = $5['geometry'];
var $7 = null;
var $8 = $6['type'];
var $9 = $6['coordinates'];
if ($8 === 'Point') {
var $B = [
];
$B[$B.length] = $9[0];
$B[$B.length] = $9[1];
$7 = new RMap.Geometry(1, $B);
} else if ($8 === 'LineString' || $8 === 'Polygon') {
var $C = [
];
for (var $D = 0; $D < $9.length; $D++) {
var $E = $9[$D];
$C[$C.length] = $E[0];
$C[$C.length] = $E[1];
}
if ($8 === 'LineString') {
$7 = new RMap.Geometry(2, $C);
} else {
$7 = new RMap.Geometry(3, $C);
}
}
var $A = $5['properties'];
$3[$4] = new RMap.Feature($A['id'], $7, $A);
}
return $3;
} catch ($F) {
return null;
}
}
}
RMap.CSVDeserializer = function (properties) {
RMap.CSVDeserializer.constructBase(this, [
properties
]);
}
RMap.CSVDeserializer.prototype = {
deserialize: function (data, schema) {
try {
if (!this._properties) {
this._properties = {
};
}
var $0 = (this._properties['delimiter']) ? (this._properties['delimiter'])  : ';';
var $1 = data.replace(new RegExp('[\\r|\\n]', 'g'), '\n').replace(new RegExp('\\n\\n', 'g'), '\n').split('\n');
var $2 = (this._properties['noheader']) ? false : true;
var $3 = {
};
var $4 = {
};
var $5 = new Array(0);
for (var $6 = 0; $6 < $1.length; ++$6) {
var $7 = false;
var $8 = $1[$6];
if ($0 !== '\t') {
var $C = $1[$6].split('');
for (var $D = 0; $D < $C.length; ++$D) {
if ($C[$D] === '"') {
if (!$7) {
$7 = true;
$C[$D] = '';
} else if ($C[$D + 1] === '"') {
$D++;
$C[$D] = '';
} else {
$7 = false;
$C[$D] = '';
}
} else if ($C[$D] === $0 && !$7) {
$C[$D] = '\t';
}
}
$8 = $C.join('');
}
var $9 = $8.split('\t');
if ($9.length < 2) {
continue;
}
if (!$6) {
var $E = this._properties['id'];
var $F = this._properties['title'];
var $10 = this._properties['x'];
var $11 = this._properties['y'];
var $12 = this._properties['point'];
var $13 = this._properties['geometry'];
var $14 = this._properties['description'];
var $15 = this._properties['image'];
var $16 = this._properties['link'];
if ($2) {
for (var $17 = 0; $17 < $9.length; $17++) {
$3[$9[$17]] = $17;
if (!$E && $9[$17].toLowerCase() === 'id') {
$E = $17;
}
if (!$F && $9[$17].toLowerCase() === 'title') {
$F = $17;
}
if (!$10 && $9[$17].toLowerCase() === 'x') {
$10 = $17;
}
if (!$11 && $9[$17].toLowerCase() === 'y') {
$11 = $17;
}
if (!$12 && $9[$17].toLowerCase() === 'point') {
$12 = $17;
}
if (!$13 && $9[$17].toLowerCase() === 'geometry') {
$13 = $17;
}
if (!$14 && $9[$17].toLowerCase() === 'description') {
$14 = $17;
}
if (!$15 && $9[$17].toLowerCase() === 'image') {
$15 = $17;
}
if (!$16 && $9[$17].toLowerCase() === 'link') {
$16 = $17;
}
}
} else {
for (var $18 = 0; $18 < $9.length; $18++) {
$3[$18.toString()] = $18;
}
}
$4 = {
};
$4['id'] = this.$0($E, (($2) ? $3 : null), - 1);
$4['title'] = this.$0($F, (($2) ? $3 : null), 0);
$4['x'] = this.$0($10, (($2) ? $3 : null), 1);
$4['y'] = this.$0($11, (($2) ? $3 : null), 2);
$4['description'] = this.$0($14, (($2) ? $3 : null), 3);
$4['point'] = this.$0($12, (($2) ? $3 : null), - 1);
$4['geometry'] = this.$0($13, (($2) ? $3 : null), - 1);
$4['image'] = this.$0($15, (($2) ? $3 : null), - 1);
$4['link'] = this.$0($16, (($2) ? $3 : null), - 1);
var $dict1 = $3;
for (var $key2 in $dict1) {
var $19 = {
key: $key2,
value: $dict1[$key2]
};
var $1A = true;
var $dict3 = $4;
for (var $key4 in $dict3) {
var $1B = {
key: $key4,
value: $dict3[$key4]
};
if ($19.value === $1B.value) {
$1A = false;
}
}
if ($1A) {
$4[$19.key] = $19.value;
}
}
$3 = $4;
if ($2) {
continue;
}
}
var $A = $9[$3['id']];
var $B = null;
if ($3['point'] > - 1 && $9[$3['point']]) {
var $1C = $9[$3['point']].replace(new RegExp('[ |,]', 'g'), ' ').split(' ');
if (this._properties['geominv']) {
$B = new RMap.Geometry(1, [
parseFloat($1C[1]),
parseFloat($1C[0])
]);
} else {
$B = new RMap.Geometry(1, [
parseFloat($1C[0]),
parseFloat($1C[1])
]);
}
} else if ($3['geometry'] > - 1 && $9[$3['geometry']]) {
var $1D = $9[$3['geometry']].replace(new RegExp('[ |,]', 'g'), ' ').split(' ');
var $1E = new Array(0);
for (var $1F = 0; $1F < $1D.length - 1; $1F = $1F + 2) {
($1E).add(parseFloat($1D[$1F]));
($1E).add(parseFloat($1D[$1F + 1]));
}
if ($1E.length > 2) {
if ($1E[0] === $1E[$1E.length - 2] && $1E[1] === $1E[$1E.length - 1]) {
$B = new RMap.Geometry(3, $1E);
} else {
$B = new RMap.Geometry(2, $1E);
}
}
} else {
var $20 = ($9[$3['x']]) ? parseFloat($9[$3['x']])  : 0;
var $21 = ($9[$3['y']]) ? parseFloat($9[$3['y']])  : 0;
$B = new RMap.Geometry(1, [
$20,
$21
]);
}
$4 = {
};
var $dict5 = $3;
for (var $key6 in $dict5) {
var $22 = {
key: $key6,
value: $dict5[$key6]
};
if ($22.value > - 1) {
$4[$22.key] = $9[$22.value];
}
}
$5[$5.length + 1] = new RMap.Feature($A, $B, $4);
}
if (!schema || !schema.getCoordinateSystem()) {
schema.$7(RMap.CoordinateSystem.getCoordinateSystem('EPSG:4326'));
}
return this.applySchema($5, schema);
} catch ($23) {
return null;
}
},
$0: function ($p0, $p1, $p2) {
if (isNullOrUndefined($p0)) {
$p0 = $p2;
}
if (typeof ($p0) === 'string' && $p1 && !isNull($p1[$p0])) {
return $p1[$p0];
} else {
return parseInt($p0);
}
}
}
RMap.GeoRssDeserializer = function (properties) {
RMap.GeoRssDeserializer.constructBase(this, [
properties
]);
}
RMap.GeoRssDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = new Array(0);
var $1 = (data.startsWith('({')) ? ScriptFX.JSON.deserialize(data)  : this.xmlStr2Json(data);
this._json = $1;
var $2 = {
};
var $3 = 'georss';
if (this._properties && this._properties['georssNamespace']) {
$3 = this._properties['georssNamespace'];
}
if ($1['rss']) {
$2 = $1['rss'];
} else if ($1['feed']) {
$2 = $1['feed'];
} else if ($1['rdf_RDF']) {
$2 = $1['rdf_RDF'];
}
var $4 = {
};
if ($2['channel']) {
$4 = $2['channel'];
} else {
$4 = $2;
}
var $5 = [
];
if (!isNullOrUndefined($4['item'])) {
$5 = RMap._DomHelper.$1B($4['item']);
} else if (!isNullOrUndefined($4['entry'])) {
$5 = RMap._DomHelper.$1B($4['entry']);
}
for (var $6 = 0; $6 < $5.length; ++$6) {
var $7 = $5[$6];
var $8 = null;
if (!isNullOrUndefined($7['geo_lat'])) {
$8 = new RMap.Geometry(1, [
parseFloat($7['geo_long']),
parseFloat($7['geo_lat'])
]);
} else if (!isNullOrUndefined($7[$3 + '_point'])) {
var $A = ($7[$3 + '_point']).replace(new RegExp(',', 'g'), ' ');
var $B = $A.split(' ');
$8 = new RMap.Geometry(1, [
parseFloat($B[1]),
parseFloat($B[0])
]);
} else if (!isNullOrUndefined($7['geo_Point'])) {
var $C = $2['geo_Point'];
$8 = new RMap.Geometry(1, [
parseFloat($C['geo_long']),
parseFloat($C['geo_lat'])
]);
} else if (!isNullOrUndefined($7[$3 + '_line']) || !isNullOrUndefined($7[$3 + '_polygon'])) {
var $D;
if ($7[$3 + '_line']) {
$D = ($7[$3 + '_line']).replace(new RegExp(',', 'g'), ' ');
} else {
$D = ($7[$3 + '_polygon']).replace(new RegExp(',', 'g'), ' ');
}
var $E = $D.split(' ');
var $F = new Array($E.length);
for (var $10 = 0; $10 < $F.length; $10++) {
$F[$10] = Object.parse($E[$10]);
}
if ($7[$3 + '_line']) {
$8 = new RMap.Geometry(2, RMap._GeometryOperation.$3($F));
} else {
$8 = new RMap.Geometry(3, RMap._GeometryOperation.$3($F));
}
} else {
$8 = new RMap.Geometry(1, [
0,
0
]);
}
var $9 = null;
if (this._properties && this._properties['id']) {
$9 = $7[this._properties['id']];
}
if ($8) {
$0[$6] = new RMap.Feature($9, $8, $7);
}
}
return this.applySchema($0, schema);
} catch ($11) {
return null;
}
},
getDescription: function (data) {
var $0 = {
};
try {
var $1 = this._json;
var $2 = {
};
if ($1['rss']) {
$2 = $1['rss'];
} else if ($1['feed']) {
$2 = $1['feed'];
} else if ($1['rdf_RDF']) {
$2 = $1['rdf_RDF'];
}
var $3 = {
};
if ($2['channel']) {
$3 = $2['channel'];
} else {
$3 = $2;
}
$0['title'] = $3['title'];
$0['description'] = $3['description'];
if ($3['docs']) {
$0['description'] = $3['docs'];
}
$0['CSystem'] = 'EPSG:4326';
} catch ($4) {
}
return $0;
}
}
RMap.KMLDeserializer = function (properties) {
RMap.KMLDeserializer.constructBase(this, [
properties
]);
}
RMap.KMLDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = new Array(0);
var $1 = (data.startsWith('({')) ? (ScriptFX.JSON.deserialize(data)) ['kml'] : this.xmlStr2Json(data) ['kml'];
var $2 = {
};
if ($1['Document']) {
$2 = $1['Document'];
} else {
$2 = $1;
}
var $3 = {
};
var $4 = (isNullOrUndefined($2)) ? [
] : RMap._DomHelper.$1B($2['Style']);
for (var $6 = 0; $6 < $4.length; $6++) {
var $7 = $4[$6];
if ($7['id']) {
if ($7['LineStyle']) {
var $8 = $7['LineStyle'];
var $9 = new RMap.ShapeStyle();
$9.strokeOpacity = 100;
if ($8['color']) {
var $A = $8['color'].toString();
if ($A.length === 8) {
$9.strokeColor = '#' + $A.substring(6, 8) + $A.substring(4, 6) + $A.substring(2, 4);
$9.strokeOpacity = Math.truncate((parseInt($A.substring(0, 2), 16) * 100 / 255));
}
}
if ($8['width']) {
$9.strokeWidth = $8['width'];
}
$3['#' + $7['id'].toString()] = $9;
}
if ($7['PolyStyle']) {
var $B = $7['PolyStyle'];
var $C = $3['#' + $7['id']];
if (!$C) {
$C = new RMap.ShapeStyle();
}
$C.fillOpacity = 100;
if ($B['color']) {
var $D = $B['color'].toString();
if ($D.length === 8) {
$C.fillColor = '#' + $D.substring(6, 8) + $D.substring(4, 6) + $D.substring(2, 4);
$C.fillOpacity = Math.truncate((parseInt($D.substring(0, 2), 16) * 100 / 255));
}
}
if ($B['fill'] && !$B['fill']) {
$C.fillOpacity = 0;
}
$3['#' + $7['id'].toString()] = $C;
}
if ($7['IconStyle']) {
var $E = $7['IconStyle'];
var $F = $E['Icon'];
var $10 = new RMap.ImageSymbolPointStyle();
if ($F['href']) {
$10.iconSrc = $F['href'].toString();
}
$3['#' + $7['id'].toString()] = $10;
}
}
}
var $5 = (isNullOrUndefined($2)) ? [
] : RMap._DomHelper.$1B($2['Placemark']);
for (var $11 = 0; $11 < $5.length; ++$11) {
var $12 = $5[$11];
if (this._properties && this._properties['title']) {
$12['title'] = $12[this._properties['title']];
}
var $13 = null;
if (!isNullOrUndefined($12['Point'])) {
var $14 = $12['Point'];
var $15 = ($14['coordinates']).split(',');
$13 = new RMap.Geometry(1, [
parseFloat($15[0]),
parseFloat($15[1])
]);
} else if (!isNullOrUndefined($12['LineString']) || !isNullOrUndefined($12['Polygon'])) {
var $16;
var $17;
var $18 = String.Empty;
if (!isNullOrUndefined($12['LineString'])) {
$16 = $12['LineString'];
$17 = 2;
$18 = $16['coordinates'];
} else {
$16 = $12['Polygon'];
$17 = 3;
$16 = $16['outerBoundaryIs'];
if ($16) {
$16 = $16['LinearRing'];
$18 = $16['coordinates'];
}
}
var $19 = $18.replace(new RegExp('[\\r|\\n|\\t]', 'g'), ' ').split(' ');
var $1A = new Array(0);
for (var $1B = 0; $1B < $19.length; $1B++) {
if ($19[$1B] !== String.Empty) {
var $1C = $19[$1B].split(',');
($1A).add(parseFloat($1C[0]));
($1A).add(parseFloat($1C[1]));
}
}
$13 = new RMap.Geometry($17, $1A);
} else {
$13 = new RMap.Geometry(1, [
0,
0
]);
}
if ($13) {
$0[$11] = new RMap.Feature(null, $13, $12);
if ($12['styleUrl']) {
$0[$11].setStyle($3[$12['styleUrl'].toString()]);
}
}
}
return this.applySchema($0, schema);
} catch ($1D) {
return null;
}
}
}
RMap.GPXDeserializer = function (properties) {
RMap.GPXDeserializer.constructBase(this, [
properties
]);
}
RMap.GPXDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = new Array(0);
var $1 = (data.startsWith('({')) ? (ScriptFX.JSON.deserialize(data)) ['gpx'] : (this.xmlStr2Json(data) ['gpx']);
var $2 = (isNullOrUndefined($1)) ? [
] : RMap._DomHelper.$1B($1['wpt']);
for (var $5 = 0; $5 < $2.length; ++$5) {
var $6 = $2[$5];
if (this._properties) {
if (this._properties['title']) {
$6['title'] = $6[this._properties['title']];
}
if (this._properties['description']) {
$6['description'] = $6[this._properties['description']];
}
}
var $7 = new RMap.Geometry(1, [
parseFloat($6['lon']),
parseFloat($6['lat'])
]);
$0[$0.length] = new RMap.Feature(null, $7, $6);
}
var $3 = (isNullOrUndefined($1)) ? [
] : RMap._DomHelper.$1B($1['rte']);
for (var $8 = 0; $8 < $3.length; $8++) {
var $9 = $3[$8];
$2 = (isNullOrUndefined($9)) ? [
] : RMap._DomHelper.$1B($9['rtept']);
for (var $A = 0; $A < $2.length; $A++) {
var $B = $2[$A];
var $C = new RMap.Geometry(1, [
parseFloat($B['lon']),
parseFloat($B['lat'])
]);
$0[$0.length] = new RMap.Feature(null, $C, $9);
}
}
var $4 = (isNullOrUndefined($1)) ? [
] : RMap._DomHelper.$1B($1['trk']);
for (var $D = 0; $D < $4.length; $D++) {
var $E = $4[$D];
var $F = (isNullOrUndefined($E)) ? [
] : RMap._DomHelper.$1B($E['trkseg']);
for (var $10 = 0; $10 < $F.length; $10++) {
var $11 = null;
var $12 = new Array(0);
var $13 = $F[$10];
$2 = (isNullOrUndefined($13)) ? [
] : RMap._DomHelper.$1B($13['trkpt']);
for (var $14 = 0; $14 < $2.length; $14++) {
var $15 = $2[$14];
($12).add(parseFloat($15['lon']));
($12).add(parseFloat($15['lat']));
}
$11 = new RMap.Geometry(2, $12);
$0[$0.length] = new RMap.Feature(null, $11, $E);
}
}
return this.applySchema($0, schema);
} catch ($16) {
return null;
}
}
}
RMap.RmlDeserializer = function (properties) {
RMap.RmlDeserializer.constructBase(this, [
properties
]);
}
RMap.RmlDeserializer.prototype = {
deserialize: function (data, schema) {
try {
var $0 = new Array(0);
var $1 = null;
if (schema) {
var $6 = schema.getPropertyFields(16);
if ($6 && $6[0]) {
$1 = $6[0].name;
}
}
var $2 = (data.startsWith('({')) ? (ScriptFX.JSON.deserialize(data)) ['rml'] : (this.xmlStr2Json(data) ['rml']);
this._json = $2;
var $3 = $2['FeatureData'];
var $4 = $3['Features'];
var $5 = (isNullOrUndefined($4)) ? [
] : RMap._DomHelper.$1B($4['Ftr']);
for (var $7 = 0; $7 < $5.length; $7++) {
var $8 = $5[$7];
var $9 = {
};
var $A = null;
var $B = null;
var $C = $8['Att'];
var $D = $8['Geom'];
if (!isNullOrUndefined($D['point'])) {
$B = new RMap.Geometry(1, eval('[' + ($D['point']).replace(new RegExp(' ', 'g'), ',') + ']'));
} else if (!isNullOrUndefined($D['line'])) {
$B = new RMap.Geometry(2, eval('[' + ($D['line']).replace(new RegExp(' ', 'g'), ',') + ']'));
} else if (!isNullOrUndefined($D['polygon'])) {
$B = new RMap.Geometry(3, eval('[' + ($D['polygon']).replace(new RegExp(' ', 'g'), ',') + ']'));
} else if (!isNullOrUndefined($D['WKT'])) {
$B = this.parseWKT($D['WKT']);
}
if (!isNullOrUndefined($8['Style'])) {
var $E = $8['Style'];
if ($B.getGeometryType() === 1) {
$E = $E['PointStyle'];
if (!isNullOrUndefined($E)) {
if (!isNullOrUndefined($E['ImageSymbolPointStyle'])) {
var $F = $E['ImageSymbolPointStyle'];
$A = new RMap.ImageSymbolPointStyle();
($A).readFromRml($F);
} else if (!isNullOrUndefined($E['TextSymbolPointStyle'])) {
var $10 = $E['TextSymbolPointStyle'];
$A = new RMap.TextSymbolPointStyle();
($A).readFromRml($10);
} else if (!isNullOrUndefined($E['CompositePointStyle'])) {
var $11 = $E['CompositePointStyle'];
$A = new RMap.CompositePointStyle();
($A).readFromRml($11);
}
}
} else {
if ($B.getGeometryType() === 2) {
$E = $E['LineStyle'];
} else {
$E = $E['PolygonStyle'];
}
if (!isNullOrUndefined($E) && (!isNullOrUndefined($E['lineProperties']) || !isNullOrUndefined($E['fillProperties']))) {
$A = new RMap.ShapeStyle();
if (!isNullOrUndefined($E['lineProperties'])) {
var $12 = $E['lineProperties'];
if (!isNullOrUndefined($12['color'])) {
var $13 = $12['color'].toString();
if ($13.length === 8) {
($A).strokeColor = '#' + $13.substring(2, 8);
($A).strokeOpacity = parseInt($13.substring(0, 2), 16) * 100 / 255;
if ($13.substring(0, 2) === '00') {
    ($A).strokeColor = 'transparent';
}
}
}
if (!isNullOrUndefined($12['width'])) {
var $14 = parseInt($12['width'].toString());
if (isNaN($14)) {
$14 = 0;
}($A).strokeWidth = $14;
}
if (!isNullOrUndefined($12['type'])) {
($A).strokeType = RMap._StyleHelper.$1($12['type'].toString());
}
}
if (!isNullOrUndefined($E['fillProperties'])) {
var $15 = $E['fillProperties'];
if (!isNullOrUndefined($15['color'])) {
var $16 = $15['color'].toString();
if ($16.length === 8) {
($A).fillColor = '#' + $16.substring(2, 8);
($A).fillOpacity = parseInt($16.substring(0, 2), 16) * 100 / 255;
}
}
if (!isNullOrUndefined($15['type'])) {
($A).fillType = RMap._StyleHelper.$2($15['type'].toString());
}
}
}
}
}
if ($B) {
$0[$7] = new RMap.Feature((($C && $1 && $C[$1]) ? $C[$1] : null), $B, $C);
if ($A) {
$0[$7].setStyle($A);
}
}
}
return this.applySchema($0, schema);
} catch ($17) {
return null;
}
},
getDescription: function (data) {
var $0 = {
};
try {
var $1 = new Array(0);
var $2 = this._json;
var $3 = $2['FeatureData'];
var $4 = $3['MetaInfo'];
$0['title'] = $4['title'];
$0['description'] = $4['description'];
var $5 = $3['Crs'];
if (!isNullOrUndefined($5)) {
$0['CSystem'] = $5['crsId'];
}
} catch ($6) {
}
return $0;
}
}
RMap.IOEventArgs = function (action, lastLoadTime, nextLoadTime, errorMessage) {
RMap.IOEventArgs.constructBase(this);
this.action = action;
this.lastLoadTime = lastLoadTime;
this.nextLoadTime = nextLoadTime;
this.errorMessage = errorMessage;
}
RMap.IOEventArgs.prototype = {
action: 0,
lastLoadTime: 0,
nextLoadTime: 0,
errorMessage: null
}
RMap.RemoteFeatureStorage = function (schema, reader, reloadTimeout, autoLoad, restyleTimeout) {
RMap.RemoteFeatureStorage.constructBase(this, [
schema,
restyleTimeout
]);
this._reader = reader;
if (reader) {
this._reader.setSchema(schema);
}
this._onLoadedCallback = Delegate.create(this, this.onLoaded);
this._loadCallback = Delegate.create(this, this.reload);
if (!isNullOrUndefined(reloadTimeout)) {
this._reloadTimeout = reloadTimeout;
}
if (!isNullOrUndefined(autoLoad) && autoLoad) {
this._loadTimeoutId = window.setTimeout(this._loadCallback, 0);
}
}
RMap.RemoteFeatureStorage.prototype = {
_reader: null,
_reloadTimeout: 0,
_data: null,
_lastLoadTime: 0,
_nextLoadTime: 0,
_loadTimeoutId: 0,
_errorMessage: '',
_onLoadedCallback: null,
_loadCallback: null,
setData: function (data) {
this._data = data;
},
load: function () {
this.reload();
},
setReloadTimeout: function (i) {
window.clearTimeout(this._loadTimeoutId);
this._reloadTimeout = i;
if (this._reloadTimeout > 0) {
window.clearTimeout(this._loadTimeoutId);
this._loadTimeoutId = window.setTimeout(this._loadCallback, this._reloadTimeout);
}
},
reload: function () {
this._errorMessage = String.Empty;
if (!this._reader) {
return;
}
window.clearTimeout(this._loadTimeoutId);
if (this._referenceCounter.length < 1 && this._reloadTimeout > 0) {
this._loadTimeoutId = window.setTimeout(Delegate.create(this, this.reload), this._reloadTimeout);
this._nextLoadTime = this._lastLoadTime + this._reloadTimeout;
return;
}
this.notifyLoad(1);
this._reader.load(this._data, this._onLoadedCallback);
},
onLoaded: function (reader, features, descriptions, errorMessage) {
this._lastLoadTime = Date.get_now().getTime();
if (this._reloadTimeout > 0) {
window.clearTimeout(this._loadTimeoutId);
this._loadTimeoutId = window.setTimeout(this._loadCallback, this._reloadTimeout);
this._nextLoadTime = this._lastLoadTime + this._reloadTimeout;
}
if (errorMessage === 'NOTMODIFIED') {
this.notifyLoad(2);
if (this._restyleTimeout === this._reloadTimeout && this._restyleTimeout > 0) {
this.restyle();
}
return;
} else if (errorMessage === String.Empty && !isNull(features)) {
this.$9['title'] = descriptions['title'];
this.$9['description'] = descriptions['description'];
this.$9['param'] = descriptions['param'];
if (this.getSchema().$6 && !isNullOrUndefined(descriptions['CSystem']) && RMap.CoordinateSystem.getCoordinateSystem(descriptions['CSystem'].toString())) {
this.getSchema().$7(RMap.CoordinateSystem.getCoordinateSystem(descriptions['CSystem'].toString()));
}
var $0 = this.$D();
this.setChangeMonitor(false);
this.update(features, reader);
this.setChangeMonitor($0);
this.notifyLoad(2);
if (this._restyleTimeout === this._reloadTimeout && this._restyleTimeout > 0) {
this.restyle();
}
} else if (errorMessage === String.Empty) {
errorMessage = 'Data error';
}
if (errorMessage !== String.Empty && this._errorMessage.indexOf(errorMessage) < 0) {
this._errorMessage += ((this._errorMessage === String.Empty) ? '' : ', ') + errorMessage;
}
if (this._errorMessage !== String.Empty || !features) {
this.notifyLoad(3);
}
},
resetVersion: function () {
if (this._reader) {
this._reader.resetVersion();
}
},
notifyLoad: function (action) {
this.notifyIO(new RMap.IOEventArgs(action, this._lastLoadTime, this._nextLoadTime, this._errorMessage));
},
isIdle: function () {
return (!this._reader || this._reader.$D());
},
isOK: function () {
return (this._errorMessage === String.Empty);
},
$2: function () {
window.clearTimeout(this._loadTimeoutId);
if (this._reader) {
this._reader.$E();
}
this._reader = null;
RMap.RemoteFeatureStorage.callBase(this, '$2');
}
}
RMap.MRemoteFeatureStorage = function (schema, readers, reloadTimeout, autoLoad, restyleTimeout) {
RMap.MRemoteFeatureStorage.constructBase(this, [
schema,
null,
reloadTimeout,
autoLoad,
restyleTimeout
]);
this._readers = readers;
for (var $0 = 0; $0 < readers.length; $0++) {
this._readers[$0].setSchema(schema);
}
}
RMap.MRemoteFeatureStorage.prototype = {
_readers: null,
reload: function () {
this._errorMessage = String.Empty;
if (!this._readers || !this._readers.length) {
return;
}
window.clearTimeout(this._loadTimeoutId);
if (this._referenceCounter.length < 1 && this._reloadTimeout > 0) {
this._loadTimeoutId = window.setTimeout(Delegate.create(this, this.reload), this._reloadTimeout);
this._nextLoadTime = this._lastLoadTime + this._reloadTimeout;
return;
}
for (var $0 = 0; $0 < this._readers.length; $0++) {
this._readers[$0].load(this._data, this._onLoadedCallback);
}
this.notifyLoad(1);
},
resetVersion: function () {
for (var $0 = 0; $0 < this._readers.length; $0++) {
if (this._readers[$0]) {
this._readers[$0].resetVersion();
}
}
},
isIdle: function () {
for (var $0 = 0; $0 < this._readers.length; $0++) {
if (this._readers[$0] && !this._readers[$0].$D()) {
return false;
}
}
return true;
},
$2: function () {
for (var $0 = 0; $0 < this._readers.length; $0++) {
this._readers[$0].$E();
}
this._readers = null;
RMap.MRemoteFeatureStorage.callBase(this, '$2');
}
}
RMap.MapSettingsLoader = function () {
}
RMap.MapSettingsLoader.$0 = function ($p0, $p1) {
var $0 = new XMLHttpRequest();
try {
if (!ScriptFX.Application.current.get_isIE()) {
$0._defaultCharset = 'utf-8';
}
if ($p0.indexOf('?') === - 1) {
$p0 += '?ts=' + Date.get_now().getTime();
} else {
$p0 += '&ts=' + Date.get_now().getTime();
}
var $1 = RMap._DomHelper.$14();
var $2 = RMap._DomHelper.$15() + '/';
$p0 = RMap._DomHelper.$17($p0, $1);
if (!isNullOrUndefined(RMap.MapApplication.proxyUrl) && !RMap._DomHelper.$18($p0, $2)) {
$p0 = RMap.MapApplication.proxyUrl + '?method=get&remoteUrl=' + escape($p0);
}
$0.open('GET', $p0, false);
$0.send(null);
if ($0.status === 200) {
var $3 = $0.responseXML;
if (!isNullOrUndefined($3.documentElement)) {
return $3;
}
}
} catch ($4) {
}
return null;
}
RMap.MapSettingsLoader.loadMap = function (url) {
var $0 = new RMap.MapSettings();
$0.$0 = new Array(0);
if (url.constructor === Type.getType('Array')) {
return RMap.MapSettingsLoader.loadThemes(url, null);
}
var $1 = (typeof (url) === 'object') ? url : RMap.MapSettingsLoader.$0(url, null);
if (!$1) {
RMap.Messages.$2(null, RMap.Messages.settings_loadingProblem);
$0.zoomLevels = [
1
];
$0.defaultCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem('EPSG:4326');
$0.tileMapCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem('EPSG:4326');
$0.defaultZoomLevel = $0.zoomLevels.length - 1;
$0.defaultCenter = RMap.$create_Coordinate(0, 0);
$0.$0 = [
new RMap.TileTheme()
];
$0.failed = true;
} else {
try {
var $2 = $1.documentElement;
var $3 = $2;
var $4 = ($3.getElementsByTagName('Crs')) [0];
if (!isNullOrUndefined($4.attributes.getNamedItem('crsId'))) {
$0.defaultCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(RMap.XmlTools.getNodeAtributeValue($4.attributes.getNamedItem('crsId')));
}
var $5 = ($3.getElementsByTagName('MapLayers')) [0];
var $6 = ($5.getElementsByTagName('GroupLayer'));
for (var $7 = 0; $7 < $6.length; $7++) {
if (RMap.XmlTools.getNodeAtributeValue($6[$7].attributes.getNamedItem('groupType')) === 'CHOICE') {
for (var $8 = 0; $8 < $6[$7].childNodes.length; $8++) {
if ($6[$7].childNodes[$8].nodeName === 'TileMapLayer') {
var $9 = RMap.MapSettingsLoader.$2($6[$7].childNodes[$8], url);
if ($9) {
$0.$0[$0.$0.length] = $9;
}
}
if ($6[$7].childNodes[$8].nodeName === 'GroupLayer' && RMap.XmlTools.getNodeAtributeValue($6[$7].childNodes[$8].attributes.getNamedItem('groupType')) === 'MULTIPLE') {
var $A = RMap.MapSettingsLoader.$4($6[$7].childNodes[$8], url);
if ($A) {
$0.$0[$0.$0.length] = $A;
}
}
}
}
}
if ($0.$0.length > 0 && $0.$0[0].$0.length > 0) {
RMap.MapSettingsLoader.$1($0);
} else {
throw new Error(RMap.Messages.settings_noTileset);
}
} catch ($B) {
RMap.Messages.$2(null, RMap.Messages.settings_processingProblem);
}
}
return $0;
}
RMap.MapSettingsLoader.$1 = function ($p0) {
$p0.zoomLevels = $p0.$0[0].$0[0].$8();
$p0.tileMapCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem($p0.$0[0].$0[0].$0);
$p0.defaultZoomLevel = $p0.zoomLevels.length - 1;
var $0 = $p0.$0[0].$0[0].$2;
var $1 = RMap.$create_Coordinate(($0.minX + $0.maxX) / 2, ($0.minY + $0.maxY) / 2);
$p0.defaultCenter = RMap.CoordinateSystem.$4($1, RMap.CoordinateSystem.getCoordinateSystem($p0.$0[0].$0[0].$0), $p0.defaultCoordinateSystem);
}
RMap.MapSettingsLoader.loadThemes = function (urls, alias) {
var $0 = new RMap.MapSettings();
$0.$0 = new Array(0);
var $1 = new RMap.TileTheme();
$1.label = alias;
$1.$0 = new Array(0);
for (var $2 = 0; $2 < urls.length; $2++) {
try {
var $3 = (typeof (urls[$2]) === 'object') ? urls[$2] : RMap.MapSettingsLoader.$0(urls[$2], null);
if ($3) {
var $4 = $3.documentElement;
var $5 = $4;
$1.$0[$1.$0.length] = RMap.MapSettingsLoader.$5($5);
var $6 = ($5.getElementsByTagName('Crs')) [0];
if (!$0.defaultCoordinateSystem && !isNullOrUndefined($6.attributes.getNamedItem('crsId'))) {
$0.defaultCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(RMap.XmlTools.getNodeAtributeValue($6.attributes.getNamedItem('crsId')));
}
}
} catch ($7) {
RMap.Messages.$2(null, RMap.Messages.settings_processingProblem);
}
}
if (!$0.defaultCoordinateSystem) {
$0.defaultCoordinateSystem = RMap.CoordinateSystem.getCoordinateSystem('EPSG:4326');
}
$0.$0[$0.$0.length] = $1;
if ($0.$0.length > 0 && $0.$0[0].$0.length > 0) {
RMap.MapSettingsLoader.$1($0);
} else {
throw new Error(RMap.Messages.settings_noTileset);
}
return $0;
}
RMap.MapSettingsLoader.$2 = function ($p0, $p1) {
var $0 = RMap.XmlTools.getNodeAtributeValue($p0.attributes.getNamedItem('alias'));
var $1 = ($p0.getElementsByTagName('TileMapSvcDef')) [0];
var $2 = (!isNullOrUndefined($1.attributes.getNamedItem('href'))) ? RMap.XmlTools.getNodeAtributeValue($1.attributes.getNamedItem('href'))  : null;
var $3 = (isNullOrUndefined($2)) ? ($1.getElementsByTagName('TileMap')) [0] : null;
return RMap.MapSettingsLoader.$3($0, $2, $p1, $3);
}
RMap.MapSettingsLoader.$3 = function ($p0, $p1, $p2, $p3) {
var $0 = new RMap.TileTheme();
$0.label = $p0;
$0.$0 = new Array(0);
var $1 = null;
if (!isNullOrUndefined($p1)) {
try {
var $2 = RMap._DomHelper.$17($p1, $p2);
var $3 = RMap.MapSettingsLoader.$0($2, null);
var $4 = $3.documentElement;
$1 = $4;
} catch ($5) {
}
} else {
$1 = $p3;
}
if ($1) {
$0.$0[0] = RMap.MapSettingsLoader.$5($1);
return $0;
}
return null;
}
RMap.MapSettingsLoader.$4 = function ($p0, $p1) {
var $0 = ($p0.getElementsByTagName('TileMapLayer'));
var $1 = new RMap.TileTheme();
$1.label = RMap.XmlTools.getNodeAtributeValue($p0.attributes.getNamedItem('alias'));
$1.$0 = new Array(0);
for (var $2 = 0; $2 < $0.length; $2++) {
var $3 = ($0[$2].getElementsByTagName('TileMapSvcDef')) [0];
var $4 = null;
if (!isNullOrUndefined($3.attributes.getNamedItem('href'))) {
try {
var $5 = RMap._DomHelper.$17(RMap.XmlTools.getNodeAtributeValue($3.attributes.getNamedItem('href')), $p1);
var $6 = RMap.MapSettingsLoader.$0($5, null);
var $7 = $6.documentElement;
$4 = $7;
} catch ($8) {
}
} else {
$4 = ($3.getElementsByTagName('TileMap')) [0];
}
if ($4) {
var $9 = $1.$0.length;
$1.$0[$9] = RMap.MapSettingsLoader.$5($4);
if ($1.$0[$9].$4.toLowerCase() === 'png' && $9 > 0 && RMap._Environment.$0()) {
$1.$0[$9].$4 = 'transparentPng';
}
}
}
if ($1.$0.length > 0) {
return $1;
}
return null;
}
RMap.MapSettingsLoader.$5 = function ($p0) {
try {
var $0 = $p0;
var $1 = ($0.getElementsByTagName('Crs')) [0];
var $2 = ($0.getElementsByTagName('boundingBox')) [0];
var $3 = ($0.getElementsByTagName('origin')) [0];
var $4 = ($0.getElementsByTagName('tileFormat')) [0];
var $5 = ($0.getElementsByTagName('TileSets')) [0];
var $6 = $5.getElementsByTagName('tileSet');
var $7 = RMap.XmlTools.getNodeAtributeValue($1.attributes.getNamedItem('crsId'));
var $8 = RMap.$create_Coordinate(Number.parse(RMap.XmlTools.getNodeAtributeValue($3.attributes.getNamedItem('x'))), Number.parse(RMap.XmlTools.getNodeAtributeValue($3.attributes.getNamedItem('y'))));
var $9 = new RMap.Envelope(Number.parse(RMap.XmlTools.getNodeAtributeValue($2.attributes.getNamedItem('minX'))), Number.parse(RMap.XmlTools.getNodeAtributeValue($2.attributes.getNamedItem('minY'))), Number.parse(RMap.XmlTools.getNodeAtributeValue($2.attributes.getNamedItem('maxX'))), Number.parse(RMap.XmlTools.getNodeAtributeValue($2.attributes.getNamedItem('maxY'))));
var $A = ScriptFX.UI.$create_Size(parseInt(RMap.XmlTools.getNodeAtributeValue($4.attributes.getNamedItem('width'))), parseInt(RMap.XmlTools.getNodeAtributeValue($4.attributes.getNamedItem('height'))));
var $B = RMap.XmlTools.getNodeAtributeValue($4.attributes.getNamedItem('mime-type'));
if ($B.split('/').length === 2) {
$B = $B.split('/') [1];
}
var $C = 'GRID';
var $D = '';
var $E = null;
var $F = $6.length - 1;
var $10 = null;
var $11 = ($0.getElementsByTagName('tileService'));
if ($11.length > 0) {
var $15 = $11[0].attributes;
if (!isNullOrUndefined($15.getNamedItem('method'))) {
$C = RMap.XmlTools.getNodeAtributeValue($15.getNamedItem('method'));
}
if (!isNullOrUndefined($15.getNamedItem('href'))) {
$D = RMap.XmlTools.getNodeAtributeValue($15.getNamedItem('href'));
}
if (!isNullOrUndefined($15.getNamedItem('servers'))) {
$E = RMap.XmlTools.getNodeAtributeValue($15.getNamedItem('servers')).split(',');
}
if (!isNullOrUndefined($15.getNamedItem('quadtreeBaseLevel'))) {
$F = parseInt(RMap.XmlTools.getNodeAtributeValue($15.getNamedItem('quadtreeBaseLevel')));
}
if (!isNullOrUndefined($15.getNamedItem('quadtreeSequence'))) {
$10 = RMap.XmlTools.getNodeAtributeValue($15.getNamedItem('quadtreeSequence')).split(',');
}
}
var $12 = new Array($6.length);
var $13 = new Array($6.length);
for (var $16 = 0; $16 < $12.length; $16++) {
var $17 = $12.length - 1 - $16;
$13[$16] = Number.parse(RMap.XmlTools.getNodeAtributeValue($6[$17].attributes.getNamedItem('units-per-pixel')));
var $18 = $D;
if (!isNullOrUndefined($6[$17].attributes.getNamedItem('href'))) {
$18 = RMap.XmlTools.getNodeAtributeValue($6[$17].attributes.getNamedItem('href'));
}
var $19 = $16.toString();
if (!isNullOrUndefined($6[$17].attributes.getNamedItem('levelId'))) {
$19 = RMap.XmlTools.getNodeAtributeValue($6[$17].attributes.getNamedItem('levelId'));
}
$12[$16] = new RMap._TileSet(null, $16, $19, $13[$16], $18, $E);
}
var $14;
if ($C === 'GRID') {
$14 = new RMap._GridTileSetProvider($7, $8, $9, $A, $B, $12);
} else if ($C === 'QUADTREE') {
$14 = new RMap._QuadtreeTileSetProvider($7, $8, $9, $A, $B, $12, $F, $10);
} else if ($C === 'EGRID') {
$14 = new RMap._EncodedGridTileSetProvider($7, $8, $9, $A, $B, $12);
} else {
throw new Error('Invalid provider method');
}
return $14;
} catch ($1A) {
}
return null;
}
RMap._OptimalContainer = function (afterResizeCallback) {
this.$8 = ScriptFX.UI.$create_Size(1, 1);
this.$B = ScriptFX.UI.$create_Size(100, 10);
this.$C = ScriptFX.UI.$create_Size(400, 250);
this.$D = ScriptFX.UI.$create_Size(600, 400);
this.$7 = afterResizeCallback;
this.$0 = document.createElement('table');
this.$0.cellPadding = '0';
this.$0.cellSpacing = '0';
this.$0.border = '0';
this.$0.style.left = '0px';
this.$0.style.top = '0px';
this.$1 = this.$0.insertRow(0);
this.$2 = this.$1.insertCell(0);
this.$2.style.position = 'relative';
this.$3 = document.createElement('div');
this.$3.style.position = 'relative';
this.$3.style.width = '1px';
this.$3.style.height = '1px';
this.$3.style.overflow = 'auto';
this.$2.appendChild(this.$3);
this.$4 = document.createElement('div');
this.$4.style.position = 'relative';
this.$4.style.display = 'inline-block';
this.$3.appendChild(this.$4);
this.$5 = document.createElement('span');
this.$6 = Delegate.create(this, this.$1D);
if (window.navigator.userAgent.toLowerCase().indexOf('mozilla') > - 1 && window.navigator.userAgent.toLowerCase().indexOf('firefox') === - 1) {
this.$11 = true;
}
}
RMap._OptimalContainer.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$9: false,
$A: true,
$E: 10,
$F: 0,
$10: false,
$11: false,
$12: function () {
return this.$0;
},
$13: function () {
return this.$4.innerHTML;
},
$14: function () {
return this.$8;
},
$15: function ($p0, $p1, $p2) {
this.$B = $p0;
this.$C = $p1;
this.$D = $p2;
if (this.$B.width > this.$D.width) {
this.$B.width = $p2.width;
}
if (this.$B.height > this.$D.height) {
this.$B.height = $p2.height;
}
},
$16: function ($p0) {
this.$3.style.overflow = $p0;
},
$17: function ($p0) {
this.$A = $p0;
},
$18: function () {
if (this.$10) {
return;
}
this.$9 = true;
this.$21();
for (var $0 = this.$4.childNodes.length - 1; $0 >= 0; $0--) {
this.$4.removeChild(this.$4.childNodes[$0]);
}
this.$4.innerHTML = '';
},
$19: function ($p0) {
if (this.$10) {
return;
}
this.$5.innerHTML = $p0;
this.$1A(this.$5);
},
$1A: function ($p0) {
this.$9 = true;
this.$1E();
for (var $0 = this.$4.childNodes.length - 1; $0 >= 0; $0--) {
this.$4.removeChild(this.$4.childNodes[$0]);
}
this.$4.innerHTML = '';
this.$4.appendChild($p0);
this.$22();
this.$1F();
},
$1B: function ($p0) {
this.$9 = true;
this.$1E();
this.$4.appendChild($p0);
this.$1F();
},
$1C: function () {
this.$9 = true;
this.$1E();
this.$22();
this.$1F();
},
$1D: function () {
if (this.$9) {
return;
}
if (!isNullOrUndefined(this.$F)) {
window.clearTimeout(this.$F);
}
this.$F = window.setTimeout(Delegate.create(this, this.$1C), 0);
},
$1E: function () {
this.$21();
this.$4.style.visibility = 'hidden';
this.$0.style.width = '';
this.$2.style.width = '';
this.$3.style.width = '';
this.$3.style.height = '';
this.$3.style.overflow = '';
},
$1F: function () {
this.$0.style.width = '';
this.$2.style.width = '';
this.$3.style.overflow = 'auto';
this.$4.style.visibility = '';
if (!isNullOrUndefined(this.$F)) {
window.clearTimeout(this.$F);
}
this.$F = window.setTimeout(Delegate.create(this, this.$20), 0);
if (this.$7) {
this.$7.invoke();
}
},
$20: function () {
if (this.$7) {
this.$7.invoke();
}
if (!this.$9 || !this.$A) {
return;
}
this.$3.attachEvent('onoverflow', this.$6);
this.$3.attachEvent('onunderflow', this.$6);
this.$4.attachEvent('onresize', this.$6);
this.$9 = false;
},
$21: function () {
this.$3.detachEvent('onoverflow', this.$6);
this.$3.detachEvent('onunderflow', this.$6);
this.$4.detachEvent('onresize', this.$6);
},
$22: function () {
if (!this.$A) {
return;
}
var $0 = this.$2.offsetWidth;
var $1 = this.$2.offsetHeight;
var $2 = 0;
var $3 = 0;
$0 = this.$D.width;
$1 = 0;
for (var $5 = this.$D.width; $5 >= this.$B.width; $5 -= this.$E) {
$1 = this.$2.offsetHeight;
if (this.$11) {
this.$0.parentNode.style.width = $5 + 'px';
}
this.$0.style.width = $5 + 'px';
this.$2.style.width = $5 + 'px';
if ($5 < this.$0.offsetWidth || ($5 < this.$C.width && $1 < this.$0.offsetHeight)) {
this.$0.style.width = $5 + this.$E + 'px';
this.$2.style.width = $5 + this.$E + 'px';
break;
}
}
$0 = this.$2.offsetWidth;
$1 = this.$2.offsetHeight;
if ($1 < this.$B.height) {
$1 = this.$B.height;
} else if ($1 > this.$D.height) {
$2 = 20;
$1 = Math.min(this.$D.height, Math.round($0 * this.$C.height / this.$C.width));
}
if ($0 > this.$D.width) {
$3 = 20;
$0 = this.$D.width;
}
if (ScriptFX.Application.current.get_isIE() && ScriptFX.Application.current.get_host().get_majorVersion() >= 7) {
$2 += 2;
$3 += 2;
}
this.$23($0 + $2, $1 + $3);
this.$3.style.overflow = 'auto';
var $4 = this.$3.offsetWidth - this.$3.clientWidth;
if ($4 > 0 && this.$3.offsetWidth <= this.$D.width - $4 && this.$8.height < this.$D.height) {
var $6 = ScriptFX.UI.$create_Size(this.$8.width, this.$8.height);
this.$23($6.width + $4, $6.height);
if (this.$3.offsetWidth > this.$3.clientWidth) {
this.$23($6.width, $6.height);
}
}
},
$23: function ($p0, $p1) {
this.$8.width = $p0;
this.$8.height = $p1;
this.$3.style.width = this.$8.width + 'px';
this.$3.style.height = this.$8.height + 'px';
if (this.$11) {
this.$0.parentNode.style.width = this.$8.width + 'px';
this.$0.parentNode.style.height = this.$8.height + 'px';
}
},
$24: function () {
if (this.$10) {
return;
}
this.$9 = true;
this.$21();
this.$6 = null;
this.$7 = null;
if (this.$5.parentNode) {
this.$5.parentNode.removeChild(this.$5);
}
this.$5 = null;
this.$3.removeChild(this.$4);
this.$4 = null;
this.$2.removeChild(this.$3);
this.$3 = null;
this.$1.deleteCell(0);
this.$2 = null;
this.$0.deleteRow(0);
this.$1 = null;
this.$0.parentNode.removeChild(this.$0);
this.$0 = null;
this.$10 = true;
}
}
RMap.LayerPanel = function (layer, label, config) {
this.$E = new Array(0);
this._itemsLookup = {
};
RMap.LayerPanel.constructBase(this, [
label
]);
this._layer = layer;
this._storage = this._layer.getFeatureView().getStorage();
this._config = config;
if (!this._config) {
this._config = {
};
}
this.$3 = document.createElement('div');
this.$3.style.width = '100%';
this.$3.style.overflow = 'auto';
this.$3.style.overflowX = 'hidden';
this.$2.appendChild(this.$3);
this.$11 = document.createElement('div');
this.$11.className = 'Buttons';
this.$11.style.position = 'absolute';
this.$11.style.right = '3px';
this.$11.style.top = '4px';
this.$2.appendChild(this.$11);
this.$25 = [
];
if (!isNullOrUndefined(this._config['buttons'])) {
var $0 = this._config['buttons'];
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = document.createElement('img');
$2.src = ($0[$1]) ['icon'];
$2.title = ($0[$1]) ['title'];
$2.style.cursor = RMap.Browser.crsPointer;
$2.hspace = 1;
this.$11.appendChild($2);
var $3 = (($0[$1]) ['click']);
$2.attachEvent('onclick', $3);
this.$25[this.$25.length] = $2;
}
}
if (!isNullOrUndefined(this._config['enableContextMenu'])) {
this.$1C = this._config['enableContextMenu'];
}
if (!isNullOrUndefined(this._config['onMenu'])) {
this.$17 = document.createElement('img');
this.$17.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.menuBtn;
this.$17.title = 'Menu';
this.$17.style.cursor = RMap.Browser.crsPointer;
this.$17.hspace = 1;
this.$11.appendChild(this.$17);
this.$24 = Delegate.create(this, this.$27);
this.$17.attachEvent('onclick', this.$24);
}
this.$16 = document.createElement('img');
if (!isNullOrUndefined(this._config['onFilterSortMenu'])) {
this.$16.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.filter0Btn;
this.$16.title = 'Sort and Filter';
this.$16.style.cursor = RMap.Browser.crsPointer;
this.$16.hspace = 1;
this.$11.appendChild(this.$16);
}
if (Type.canCast(this._storage, RMap.RemoteFeatureStorage)) {
this.$15 = document.createElement('img');
this.$15.hspace = 1;
if (!this._config['unreloadable']) {
this.$15.title = 'Reload';
this.$15.style.cursor = RMap.Browser.crsPointer;
this.$21 = Delegate.create(this, this.$38);
this.$15.attachEvent('onclick', this.$21);
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.reloadBtn;
} else {
this.$19 = false;
this.$15.title = 'Ready';
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.doneBtn;
}
this.$11.appendChild(this.$15);
}
this.$22 = Delegate.create(this, this.$28);
this._storage.add_ioEvent(this.$22);
if (!isNullOrUndefined(this._config['reverse'])) {
this.$1A = this._config['reverse'];
}
if (!isNullOrUndefined(this._config['autoformat'])) {
this.$1B = this._config['autoformat'];
}
if (!isNullOrUndefined(this._config['noheader']) && this._config['noheader']) {
this.$11.style.display = 'none';
this.$4.style.display = 'none';
}
if (this._storage.getEditPermissions()) {
this.$13 = document.createElement('img');
this.$13.style.cursor = RMap.Browser.crsPointer;
this.$13.hspace = 1;
this.$11.appendChild(this.$13);
this.$2F(false);
this.$1E = Delegate.create(this, this.$39);
this.$13.attachEvent('onclick', this.$1E);
if (this._config['savable']) {
this.$14 = document.createElement('img');
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save0Btn;
this.$14.style.cursor = RMap.Browser.crsPointer;
this.$14.hspace = 1;
this.$14.title = 'save';
this.$11.appendChild(this.$14);
this.$1F = Delegate.create(this, this.$3A);
this.$14.attachEvent('onclick', this.$1F);
}
}
this._body = document.createElement('div');
this._body.style.width = '100%';
this._body.style.height = 'auto';
this._body.style.overflowY = 'auto';
this._body.style.overflowX = 'hidden';
this.$10 = document.createElement('div');
this.$10.className = 'Description';
this.$10.style.display = 'none';
if (!isNullOrUndefined(this._config['description'])) {
this.$10.innerHTML = this._config['description'] + '<br>&#160;';
}
this._body.appendChild(this.$10);
this._footer = document.createElement('div');
this._footer.className = 'Footer';
this.$1D = Delegate.create(this, this.$36);
this.$5.style.visibility = '';
this.$5.src = RMap.MapApplication.resourcesUrl + 'common/check-' + ((this._layer.isHidden()) ? 'false' : 'true') + '.png';
this.$5.attachEvent('onclick', this.$1D);
if (this._config['removable']) {
this.$12 = document.createElement('img');
this.$12.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.closeBtn;
this.$12.style.cursor = RMap.Browser.crsPointer;
this.$12.hspace = 1;
this.$11.appendChild(this.$12);
this.$20 = Delegate.create(this, this.$37);
this.$12.attachEvent('onclick', this.$20);
}
this.$3.style.overflowY = 'hidden';
this.$3.appendChild(this._body);
this.$3.appendChild(this._footer);
this.$31();
this._layer.add_collectionChangedEvent(Delegate.create(this, this.onCollectionChanged));
this._layer.add_stateChangedEvent(Delegate.create(this, this.$2A));
this.$23 = Delegate.create(this, this.$26);
this.$16.attachEvent('onclick', this.$23);
}
RMap.LayerPanel.prototype = {
_layer: null,
_storage: null,
_config: null,
$F: null,
$10: null,
_body: null,
_footer: null,
$11: null,
$12: null,
$13: null,
$14: null,
$15: null,
$16: null,
$17: null,
$18: false,
$19: true,
$1A: false,
$1B: true,
$1C: false,
$1D: null,
$1E: null,
$1F: null,
$20: null,
$21: null,
$22: null,
$23: null,
$24: null,
$25: null,
$26: function () {
var $0 = this._config['onFilterSortMenu'];
if (!$0) {
return;
}
$0.call(this._layer);
},
$27: function () {
var $0 = this._config['onMenu'];
if (!$0) {
return;
}
$0.call(this._layer);
},
$28: function ($p0, $p1) {
if ($p1.action === 4 || $p1.action === 5 || $p1.action === 7) {
if ($p1.action === 5 && !isNullOrUndefined(this.$14)) {
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save0Btn;
}
}
if (!(Type.canCast(this._storage, RMap.RemoteFeatureStorage))) {
return;
}
var $0 = '';
if (this.$19) {
$0 = 'Reload\n';
}
if ($p1.action === 1) {
$0 = 'Loading ... ';
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.waitBtn;
} else if ($p1.action === 3) {
$0 += 'Error ' + $p1.errorMessage;
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.failedBtn;
} else if (!(Type.canCast(this._storage, RMap.MRemoteFeatureStorage)) || ((this._storage).isIdle() && (this._storage).isOK())) {
if (this.$19) {
$0 += 'Loaded at ' + (new Date($p1.lastLoadTime)).format('HH:mm:ss');
if ($p1.nextLoadTime > 0) {
$0 += '\nAuto reload at ' + (new Date($p1.nextLoadTime)).format('HH:mm:ss');
}
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.reloadBtn;
} else {
$0 = 'Ready';
this.$15.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.doneBtn;
}
}
this.$15.title = $0;
},
getElement: function () {
return this.$3;
},
$29: function () {
return this._body;
},
getLayer: function () {
return this._layer;
},
onCollectionChanged: function (sender, args) {
switch (args.action) {
case 1:
var $enum1 = args.items.getEnumerator();
while ($enum1.moveNext()) {
var $0 = $enum1.get_current();
var $1 = new RMap._PanelItem(this, $0, this.$1A, this.$1B);
this.$E[this.$E.length] = $1;
this._itemsLookup[$0.getId()] = $1;
}
break;
case 2:
var $enum2 = args.items.getEnumerator();
while ($enum2.moveNext()) {
var $2 = $enum2.get_current();
var $3 = this._itemsLookup[$2.getId()];
if (!isNullOrUndefined($3)) {
if (this.$F === $3) {
this.$F = null;
}
for (var $4 = 0; $4 < this.$E.length; $4++) {
if (this.$E[$4] === $3) {
this.$E[$4] = null;
(this.$E).removeAt($4);
break;
}
}
this._itemsLookup[$2.getId()] = null;
$3.$A();
$3 = null;
}
}
break;
case 3:
this.$30();
break;
case 4:
this.$2B();
break;
case 16:
this.$2B();
break;
case 17:
this.$2B();
break;
case 32:
var $enum3 = args.items.getEnumerator();
while ($enum3.moveNext()) {
var $5 = $enum3.get_current();
if (!isNullOrUndefined(this._itemsLookup[$5.getId()])) {
(this._itemsLookup[$5.getId()]).$9();
}
}
break;
case 33:
if (args.items && args.items.length > 0 && args.items.length !== this.$E.length) {
var $enum4 = args.items.getEnumerator();
while ($enum4.moveNext()) {
var $6 = $enum4.get_current();
if (!isNullOrUndefined(this._itemsLookup[$6.getId()])) {
(this._itemsLookup[$6.getId()]).$9();
}
}
} else {
for (var $7 = 0; $7 < this.$E.length; $7++) {
this.$E[$7].$9();
}
}
break;
}
if (this.$F && (!this.$F.$C() || isNullOrUndefined(this._itemsLookup[this.$F.$C().getId()]))) {
this.$F = null;
}
if (!isNullOrUndefined(this.$14)) {
if (this._storage.hasChanged()) {
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save1Btn;
} else {
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save0Btn;
}
}
if (args.action === 16 || args.action === 17) {
if (this._layer.getFeatureView().getSort() || this._layer.getFeatureView().getFilter()) {
this.$16.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.filter1Btn;
} else {
this.$16.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.filter0Btn;
}
}
if (this.$1.$B['count']) {
this.$4.title = RMap.Messages.itemCount + this.$E.length;
}
},
$2A: function ($p0, $p1) {
if ($p1.action === 256) {
this.$30();
} else if ($p1.action === 1 || $p1.action === 2) {
this.$5.src = RMap.MapApplication.resourcesUrl + 'common/check-' + ((this._layer.isHidden()) ? 'false' : 'true') + '.png';
} else if ($p1.action === 4) {
this.$2F(true);
} else if ($p1.action === 5) {
this.$2F(false);
} else if ($p1.action === 3) {
var $0 = ($p1.items[0]).getFeature().getId();
if (!isNullOrUndefined(this._itemsLookup[$0])) {
this.$32(this._itemsLookup[$0], true);
}
}
},
$2B: function () {
this.$30();
this.$31();
if (!isNullOrUndefined(this.$14)) {
if (this._storage.hasChanged()) {
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save1Btn;
} else {
this.$14.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.save0Btn;
}
}
},
$2C: function () {
if (this.$0 === '...' && !isNullOrUndefined(this._storage.$9['title'])) {
var $0 = this._storage.$9['title'].toString();
if ($0.length > 0) {
this.$6.innerText = $0;
}
}
},
$2D: function () {
if (!isNullOrUndefined(this._config['description'])) {
this.$10.innerHTML = this._config['description'] + '<br>&#160;';
this.$10.style.display = '';
} else if (!isNullOrUndefined(this._storage.$9['description'])) {
var $0 = this._storage.$9['description'].toString();
if ($0.length > 0) {
this.$10.innerHTML = $0 + '<br>&#160;';
this.$10.style.display = '';
} else {
this.$2E();
}
}
},
$2E: function () {
this.$10.innerHTML = '';
this.$10.style.display = 'none';
},
$2F: function ($p0) {
if ($p0) {
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.edit1Btn;
this.$13.title = 'lock';
} else {
this.$13.src = RMap.MapApplication.resourcesUrl + RMap.MapApplication.edit0Btn;
this.$13.title = 'edit';
}
this.$18 = !$p0;
},
$30: function () {
this.$2E();
for (var $0 = 0; $0 < this.$E.length; ++$0) {
(this.$E[$0]).$A();
}(this.$E).clear();
this._itemsLookup = {
};
this.$F = null;
},
$31: function () {
this.$2C();
this.$2D();
var $0 = this._layer.getFeatureView().getFeatures();
for (var $1 = 0; $1 < $0.length; $1++) {
var $2 = new RMap._PanelItem(this, $0[$1], this.$1A, this.$1B);
this.$E[$1] = $2;
this._itemsLookup[$0[$1].getId()] = $2;
}
},
showItemByFeature: function (f) {
if (!isNullOrUndefined(this._itemsLookup[f.getId()])) {
this.$32(this._itemsLookup[f.getId()], true);
}
},
$32: function ($p0, $p1) {
if (this.$F) {
this.$F.$E();
}
this.$F = $p0;
this.$F.$D($p1);
},
$33: function ($p0) {
RMap._DomHelper.$B();
this.$32($p0, false);
this.$1.$D(this, $p0, 4);
this._layer.$3A(this._layer.drawings[$p0.$C().getId()], false);
},
$34: function ($p0) {
RMap._DomHelper.$B();
this.$32($p0, false);
this.$1.$D(this, $p0, 8);
var $0 = this._layer.drawings[$p0.$C().getId()];
this._layer.$36($0, null);
this._layer.$30().$41().$23(Math.min(this._layer.$30().getZoomLevel(), this._layer.$30().getDetailZoomLevel()));
},
$35: function ($p0) {
RMap._DomHelper.$B();
this.$1.$D(this, $p0, 16);
},
$36: function () {
window.event.cancelBubble = true;
if (this._layer.isHidden()) {
this._layer.show();
} else {
this._layer.hide();
}
},
$37: function () {
RMap._DomHelper.$B();
this.$1.$C(this, 256);
this.$D();
},
$38: function () {
RMap._DomHelper.$B();
var $0 = this._storage;
(this._storage).load();
},
$39: function () {
RMap._DomHelper.$B();
if (this.$18) {
this.$1.$C(this, 4);
this._layer.$30().beginEdit(this._layer.getId());
} else {
this._layer.$30().endEdit();
}
},
$3A: function () {
var $0 = this.$1.$C(this, 5);
if (($0) ['returnValue'] !== false) {
this._storage.saveStorage(this._layer.getId(), null, new RMap.RmlSerializer());
}
},
resize: function () {
if (this.$1.$A !== 'none') {
this._body.style.height = Math.max(0, (this.$3.offsetHeight - this._footer.offsetHeight)) + 'px';
}
},
$D: function () {
this._layer.remove_collectionChangedEvent(Delegate.create(this, this.onCollectionChanged));
this._layer.remove_stateChangedEvent(Delegate.create(this, this.$2A));
this.$16.detachEvent('onclick', this.$23);
this.$23 = null;
if (!isNullOrUndefined(this.$17)) {
this.$17.detachEvent('onclick', this.$24);
this.$24 = null;
}
this.$5.detachEvent('onclick', this.$1D);
this.$1D = null;
if (this.$22 && this._storage) {
this._storage.remove_ioEvent(this.$22);
this.$22 = null;
}
this._storage = null;
if (this._layer.$30()) {
this._layer.$30().removeLayer(this._layer.getId());
}
this._layer = null;
if (!isNullOrUndefined(this.$1)) {
this.$1.detach(this);
}
this.$30();
if (!isNullOrUndefined(this.$25)) {
for (var $0 = 0; $0 < this.$25.length; $0++) {
this.$25[$0].parentNode.removeChild(this.$25[$0]);
this.$25[$0] = null;
}
}
if (!isNull(this.$13)) {
this.$13.detachEvent('onclick', this.$1E);
this.$1E = null;
this.$11.removeChild(this.$13);
this.$13 = null;
}
if (!isNull(this.$14)) {
this.$14.detachEvent('onclick', this.$1F);
this.$1F = null;
this.$11.removeChild(this.$14);
this.$14 = null;
}
if (!isNull(this.$12)) {
this.$12.detachEvent('onclick', this.$20);
this.$20 = null;
this.$11.removeChild(this.$12);
this.$12 = null;
}
if (!isNull(this.$15)) {
this.$15.detachEvent('onclick', this.$21);
this.$21 = null;
this.$11.removeChild(this.$15);
this.$15 = null;
}
this.$3.removeChild(this._footer);
this.$3.removeChild(this._body);
this.$2.removeChild(this.$3);
this.$2.removeChild(this.$11);
RMap.LayerPanel.callBase(this, '$D');
}
}
RMap._PanelItem = function (parent, feature, reverse, autoFormat) {
this.$0 = parent;
this.$1 = feature;
this.$3 = autoFormat;
this.$4 = Delegate.create(this, this.$10);
this.$5 = Delegate.create(this, this.$11);
this.$2 = document.createElement('div');
this.$2.className = 'Item';
this.$2.attachEvent('onclick', this.$4);
this.$2.attachEvent('ondblclick', this.$5);
if (parent.$1C) {
this.$6 = Delegate.create(this, this.$12);
this.$2.attachEvent('oncontextmenu', this.$6);
}
if (isNullOrUndefined(this.$0.$29().firstChild) || !reverse) {
this.$0.$29().appendChild(this.$2);
} else if (this.$0.$29().childNodes.length > 1) {
this.$0.$29().insertBefore(this.$2, this.$0.$29().childNodes[1]);
} else {
this.$0.$29().appendChild(this.$2);
}
this.$F();
}
RMap._PanelItem.prototype = {
$0: null,
$1: null,
$2: null,
$3: true,
$4: null,
$5: null,
$6: null,
$7: function () {
if (!isNullOrUndefined(this.$2.parentNode)) {
this.$2.parentNode.removeChild(this.$2);
}
},
$8: function () {
this.$7();
this.$0.$29().appendChild(this.$2);
},
$9: function () {
this.$F();
},
$A: function () {
if (!this.$2) {
return;
}
this.$2.detachEvent('onclick', this.$4);
this.$2.detachEvent('ondblclick', this.$5);
this.$4 = null;
this.$5 = null;
if (this.$0.$1C) {
this.$2.detachEvent('oncontextmenu', this.$5);
this.$6 = null;
}
this.$2.innerHTML = '';
if (this.$2.parentNode === this.$0.$29()) {
this.$0.$29().removeChild(this.$2);
}
this.$2 = null;
this.$0 = null;
this.$1 = null;
},
$B: function () {
return this.$2;
},
$C: function () {
return this.$1;
},
$D: function ($p0) {
if ($p0 && !isNullOrUndefined(this.$2.parentNode)) {
if (this.$2.offsetTop < this.$2.parentNode.scrollTop || this.$2.offsetTop + this.$2.offsetHeight > this.$2.parentNode.scrollTop + this.$2.parentNode.offsetHeight) {
this.$2.scrollIntoView(true);
}
}
this.$2.className = 'SelectedItem';
},
$E: function () {
this.$2.className = 'Item';
},
$F: function () {
var $0 = '';
var $1 = this.$0.getLayer().$22(this.$1);
var $2 = this.$1.getSchema().getPanelItemContent(this.$1);
if (this.$3) {
if (Type.canCast($1, RMap.PointStyle)) {
if (!isNullOrUndefined($1.getHTML)) {
$0 = ($1).getHTML(this.$1, 'float:left; margin-right:5px; margin-bottom:5px;');
}
} else {
if (this.$1.geometry.getGeometryType() === 3) {
$0 = RMap._StyleIconGenerator.$2($1);
} else {
$0 = RMap._StyleIconGenerator.$1($1);
}
$0 = '<div style=\'float: left; margin: 5px\'>' + $0 + '</div>';
}
$2 = $0 + $2 + '<br clear=\'all\'/>';
}
if (this.$2.innerHTML !== $2) {
this.$2.innerHTML = $2;
}
},
$10: function () {
this.$0.$33(this);
},
$11: function () {
this.$0.$34(this);
},
$12: function () {
this.$0.$35(this);
}
}
RMap.Panel = function (label) {
this.$0 = label;
this.$2 = document.createElement('div');
this.$2.className = 'Panel';
this.$2.style.position = 'relative';
this.$2.style.width = '100%';
this.$2.style.overflowX = 'hidden';
this.$4 = document.createElement('div');
this.$4.className = 'Title';
this.$4.style.overflow = 'hidden';
this.$4.style.textOverflow = 'ellipsis';
this.$4.style.whiteSpace = 'nowrap';
this.$7 = Delegate.create(this, this.$9);
this.$4.attachEvent('onclick', this.$7);
this.$8 = Delegate.create(this, this.$A);
this.$4.attachEvent('oncontextmenu', this.$8);
this.$5 = document.createElement('img');
this.$5.style.visibility = 'hidden';
this.$4.appendChild(this.$5);
if (!this.$0 || this.$0 === String.Empty) {
this.$0 = '...';
}
this.$6 = document.createElement('span');
this.$6.style.paddingLeft = '4px';
this.$6.innerText = this.$0;
this.$4.appendChild(this.$6);
this.$2.appendChild(this.$4);
}
RMap.Panel.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
getTitle: function () {
return this.$0;
},
$9: function () {
this.$1.open(this);
},
$A: function () {
this.$1.$D(this, null, 16);
},
$B: function () {
return this.$4.offsetHeight + 2;
},
$C: function ($p0) {
if (this.$3) {
if (this.$1.$A !== 'none') {
this.$3.style.height = Math.max(0, $p0) + 'px';
}
this.$3.style.display = '';
this.resize();
}
},
$D: function () {
this.$4.detachEvent('onclick', this.$7);
this.$7 = null;
this.$2.removeChild(this.$4);
this.$4 = null;
this.$3 = null;
}
}
RMap.PanelEventArgs = function (action, panel) {
RMap.PanelEventArgs.constructBase(this);
this.action = action;
this.panel = panel;
}
RMap.PanelEventArgs.prototype = {
action: 0,
panel: null
}
RMap.PanelContainer = function (container, config) {
this.$3 = new Array(0);
if (!config) {
config = {
};
}
this.$B = config;
this.$0 = container;
this.$0.style.overflow = 'hidden';
this.$1 = document.createElement('div');
this.$1.style.width = '100%';
this.$1.style.height = '100%';
this.$1.style.overflowX = 'hidden';
this.$1.style.overflowY = 'auto';
this.$0.appendChild(this.$1);
this.$5 = Delegate.create(this, this.dispose);
window.attachEvent('onunload', this.$5);
if (!isNullOrUndefined(config['sizelimit'])) {
this.$A = config['sizelimit'].toString();
}
}
RMap.PanelContainer.prototype = {
$0: null,
$1: null,
$2: 0,
$4: null,
$5: null,
add_$6: function ($p0) {
this.$7 = Delegate.combine(this.$7, $p0);
},
remove_$6: function ($p0) {
this.$7 = Delegate.remove(this.$7, $p0);
},
$7: null,
add_$8: function ($p0) {
this.$9 = Delegate.combine(this.$9, $p0);
},
remove_$8: function ($p0) {
this.$9 = Delegate.remove(this.$9, $p0);
},
$9: null,
$A: 'auto',
$B: null,
add: function (panel) {
if (panel.$1) {
return;
}(this.$3).add(panel);
panel.$1 = this;
this.$1.appendChild(panel.$2);
this.$2 += panel.$B();
this.open(panel);
},
addLayer: function (layer, title, config) {
if (Type.canCast(layer, RMap.DrawingLayer)) {
var $0 = new RMap.LayerPanel(layer, title, config);
this.add($0);
return $0;
} else if (Type.canCast(layer, RMap.ImageLayer)) {
var $1 = new RMap.ImageLayerPanel(layer, title, config);
this.add($1);
return $1;
}
return null;
},
attachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'mouse') {
this.add_$6(handler);
} else if (name === 'panel') {
this.add_$8(handler);
}
},
detachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'mouse') {
this.remove_$6(handler);
} else if (name === 'panel') {
this.remove_$8(handler);
}
},
$C: function ($p0, $p1) {
if (!this.$9) {
return null;
}
var $0 = new RMap.PanelEventArgs($p1, $p0);
this.$9.invoke(this, $0);
return $0;
},
$D: function ($p0, $p1, $p2) {
if (!this.$7) {
return;
}
RMap._DomHelper.$B();
var $0 = RMap._DomHelper.$8(window.event);
var $1 = {
};
$1['panel'] = $p0;
if ($p1) {
$1['element'] = ((Type.canCast($p1, RMap._ImagePanelItem)) ? ($p1).$B()  : $p1.$C());
}
this.$7.invoke(this, new RMap.MouseEventArgs(null, $0, $p2, $1));
},
open: function (panel) {
if (panel.$1 !== this) {
return;
}
if (this.$4) {
this.$4.$C(0);
this.$4.$4.className = 'Title';
}
this.$4 = panel;
this.$4.$4.className = 'SelectedTitle';
this.$4.$C(this.$1.offsetHeight - this.$2);
this.$C(panel, 2);
},
detach: function (panel) {
if (panel.$1 !== this) {
return;
}
var $0 = this.$3.indexOf(panel);
(this.$3).remove(panel);
this.$1.removeChild(panel.$2);
if (this.$4 === panel) {
if (!this.$3.length) {
this.$4 = null;
} else {
$0 = Math.max(0, $0 - 1);
this.open(this.$3[$0]);
}
}
panel.$1 = null;
panel = null;
this.resize();
},
remove: function (panel) {
if (panel.$1 !== this) {
return;
}
this.detach(panel);
panel.$D();
panel.$2 = null;
panel = null;
},
resize: function () {
this.$2 = 0;
for (var $0 = 0; $0 < this.$3.length; ++$0) {
this.$2 += this.$3[$0].$B();
}
if (this.$4 && this.$1.offsetHeight > 0) {
this.$4.$C(this.$1.offsetHeight - this.$2);
}
},
dispose: function () {
window.detachEvent('onunload', this.$5);
this.$7 = null;
this.$5 = null;
while (this.$3.length > 0) {
this.remove(this.$3[0]);
}
}
}
RMap.CustomStyler = function (method) {
RMap.CustomStyler.constructBase(this);
this.$0 = (Type.canCast(method, Delegate)) ? method : Delegate.create(this, method);
}
RMap.CustomStyler.prototype = {
$0: null,
getStyle: function (feature) {
return this.$0.invoke(feature);
}
}
RMap._LegendRule = function (filter, style) {
this.$0 = filter;
this.$1 = style;
}
RMap._LegendRule.prototype = {
$0: null,
$1: null
}
RMap._LegendStyler = function (rules, defaultStyle) {
this.$0 = new Array(0);
RMap._LegendStyler.constructBase(this);
this.$0 = rules;
this.$1 = defaultStyle;
}
RMap._LegendStyler.prototype = {
$1: null,
getStyle: function ($p0) {
for (var $0 = 0; $0 < this.$0.length; ++$0) {
if (this.$0[$0].$0.invoke($p0)) {
return this.$0[$0].$1;
}
}
return this.$1;
}
}
RMap.FeatureReader = function (url, method, deserializer, xsltTransformer, proxyUrl, type, noCache, cfg) {
this.$0 = RMap._DomHelper.$17(url, RMap._DomHelper.$14());
this.$1 = method;
this.$3 = deserializer;
this.$2 = xsltTransformer;
this.$4 = proxyUrl;
if (isNullOrUndefined(this.$4)) {
this.$4 = RMap.MapApplication.proxyUrl;
}
this.$5 = type;
this.$6 = noCache;
this.$8 = cfg;
this.$A = Delegate.create(this, this.$C);
}
RMap.FeatureReader.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: null,
$B: null,
setUrl: function (url) {
this.$0 = RMap._DomHelper.$17(url, RMap._DomHelper.$14());
},
setSchema: function (schema) {
this.$7 = schema;
},
load: function (data, callback) {
this.$B = callback;
var $0 = this.$4 || RMap._DomHelper.$18(this.$0, RMap._DomHelper.$14());
if (!this.$9) {
if ($0) {
this.$9 = new RMap.HttpContentLoader(this.$4, this.$1, this.$8 && this.$8['checkVersion'], (this.$8) ? this.$8['resetVersionTimeout'] : 0);
} else {
this.$9 = new RMap.ScriptContentLoader((this.$8) ? this.$8['swCallbackName'] : null, this.$0, this.$8 && this.$8['checkVersion'], (this.$8) ? this.$8['resetVersionTimeout'] : 0);
}
}
this.$9.load(this.$0, data, this.$A, this.$6, this.$5, null);
},
$C: function ($p0, $p1, $p2, $p3, $p4) {
if ($p3 === 304 && $p1 === 'NOTMODIFIED') {
this.$B.invoke(null, null, null, $p1);
return;
}
if ($p2 !== 2 || $p3 !== 200) {
if ($p2 !== 3) {
this.$B.invoke(this, null, null, ($p1) ? $p1 : 'Unknown error');
}
return;
}
var $0 = $p0.replace(new RegExp('^[\\s]+', ''), '');
if (!$0.startsWith('<') && !$0.startsWith('{') && !$0.startsWith('(') && !$0.startsWith('[') && !(Type.canCast(this.$3, RMap.CSVDeserializer))) {
try {
$0 = RMap._TEAE.$E($p0);
} catch ($4) {
}
}
var $1 = this.$3.deserialize($0, this.$7);
var $2 = this.$3.getDescription($0);
var $3 = null;
if ($1 && this.$8 && !isNullOrUndefined(this.$8['idPrefix'])) {
var $5 = this.$8['idPrefix'].toString();
for (var $6 = 0; $6 < $1.length; $6++) {
$1[$6].$5($5 + $1[$6].getId());
}
$3 = this;
}
this.$B.invoke($3, $1, $2, '');
},
abort: function () {
if (this.$9) {
this.$9.abort();
}
},
resetVersion: function () {
if (this.$9) {
this.$9.$2();
}
},
$D: function () {
return !this.$9 || this.$9.$0();
},
$E: function () {
this.$7 = null;
if (this.$9) {
this.$9.$1();
}
this.$9 = null;
}
}
RMap.Property = function (name, type, info, expression, format, alias) {
this.name = name;
this.alias = (isNullOrUndefined(alias)) ? name : alias;
this.type = (isNullOrUndefined(type)) ? String : type;
this.$0 = (isNullOrUndefined(expression)) ? null : expression;
this.$1 = (isNullOrUndefined(info)) ? 0 : info;
this.$2 = (isNullOrUndefined(format)) ? 0 : format;
}
RMap.Property.prototype = {
name: null,
alias: null,
type: null,
$0: null,
$1: 0,
$2: 0,
$3: function ($p0) {
if (isNull($p0) && !(this.$1 & 1)) {
return false;
}
if (this.type.get_fullName() === 'Number' && this.$2 === 1) {
if ($p0 !== Math.round($p0)) {
return false;
}
}
return this.$0 || this.type === Type.getInstanceType($p0);
}
}
RMap.FeatureSchema = function (properties, coordinateSystem) {
this.$0 = new Array(0);
this.$1 = {
};
this.$0 = properties;
this.$2 = coordinateSystem;
for (var $0 = 0; $0 < this.$0.length; ++$0) {
this.$1[this.$0[$0].name] = this.$0[$0];
}
}
RMap.FeatureSchema.prototype = {
$2: null,
$3: null,
$4: null,
$5: null,
$6: true,
getCoordinateSystem: function () {
return this.$2;
},
$7: function ($p0) {
this.$2 = $p0;
},
setInfoWindowContentTemplate: function (infoWindowContentTemplate) {
this.$3 = infoWindowContentTemplate;
},
getInfoWindowContent: function (feature) {
if (this.$3) {
return this.$3.invoke(feature);
}
var $0 = feature.getProperty('content');
if (!isNullOrUndefined($0)) {
return $0;
}
$0 = feature.getProperty('description');
return $0;
},
setCommandTemplate: function (commandTemplate) {
this.$4 = commandTemplate;
},
getCommandTemplate: function (feature) {
if (!this.$4) {
return new Array(0);
}
return this.$4.invoke(feature);
},
setPanelItemContentTemplate: function (panelItemContentTemplate) {
this.$5 = panelItemContentTemplate;
},
getPanelItemContent: function (feature) {
if (this.$5) {
return this.$5.invoke(feature);
}
return feature.getProperty('title');
},
isValid: function (feature) {
return true;
},
$8: function ($p0, $p1) {
var $0 = this.$1[$p0];
if ($0) {
return $0.$3($p1);
}
return true;
},
$9: function () {
return this.$0;
},
getPropertyFields: function (info) {
var $0 = new Array(0);
for (var $1 = 0; $1 < this.$0.length; ++$1) {
if ((this.$0[$1].$1 & info)) {
($0).add(this.$0[$1]);
}
}
return $0;
},
$A: function ($p0, $p1) {
var $0 = this.$1[$p1];
if ($0 && $0.$0) {
return $0.$0.invoke($p0);
}
return $p0.properties[$p1];
},
$B: function ($p0, $p1, $p2) {
var $0 = this.$1[$p1];
if ($0 && $0.$0) {
return;
}
$p0.properties[$p1] = $p2;
}
}
RMap.FeatureSource = function () {
this._features = new Array(0);
this._lookup = {
};
}
RMap.FeatureSource.prototype = {
_suspendNotify: false,
add_collectionChangedEvent: function (value) {
this.$0 = Delegate.combine(this.$0, value);
},
remove_collectionChangedEvent: function (value) {
this.$0 = Delegate.remove(this.$0, value);
},
$0: null,
getCount: function () {
return this._features.length;
},
getFeatures: function () {
return this._features;
},
getFeatureAt: function (index) {
return this._features[index];
},
getFeature: function (id) {
return this._lookup[id];
},
getEnvelope: function () {
if (!this._features.length) {
return null;
}
var $0 = this._features[0].geometry.getEnvelope().clone();
for (var $1 = 1; $1 < this._features.length; $1++) {
var $2 = this._features[$1].geometry.getEnvelope();
if ($2.minX < $0.minX) {
$0.minX = $2.minX;
}
if ($2.minY < $0.minY) {
$0.minY = $2.minY;
}
if ($2.maxX > $0.maxX) {
$0.maxX = $2.maxX;
}
if ($2.maxY > $0.maxY) {
$0.maxY = $2.maxY;
}
}
return $0;
},
$1: function ($p0) {
if (!this._suspendNotify && this.$0) {
this.$0.invoke(this, $p0);
}
},
$2: function () {
this._features = null;
this._lookup = null;
}
}
RMap.FeatureStorage = function (schema, restyleTimeout) {
this._referenceCounter = [
];
RMap.FeatureStorage.constructBase(this);
this.$3 = schema;
this.$4 = new RMap.FeatureView(this);
this.$5 = 0;
this.$6 = 0;
this.$9 = {
};
if (restyleTimeout > 0) {
this._restyleTimeout = restyleTimeout;
this._restyleTimeoutId = window.setTimeout(Delegate.create(this, this.restyle), restyleTimeout);
}
}
RMap.FeatureStorage.prototype = {
$3: null,
$4: null,
$5: 0,
$6: 0,
$7: false,
$8: false,
$9: null,
_restyleTimeout: 0,
_restyleTimeoutId: 0,
isInternal: false,
getSchema: function () {
return this.$3;
},
getDefaultView: function () {
return this.$4;
},
$A: function ($p0) {
this._referenceCounter.add($p0);
},
$B: function ($p0) {
for (var $0 = this._referenceCounter.length - 1; $0 >= 0; $0--) {
if (this._referenceCounter[$0] === $p0) {
this._referenceCounter.removeAt($0);
}
}
},
getEditPermissions: function () {
return this.$6;
},
setEditPermissions: function (editPermissions) {
this.$6 = editPermissions;
},
hasChanged: function () {
return this.$7;
},
restyle: function () {
try {
var $0 = this.$D();
this.setChangeMonitor(false);
this.$1(new RMap.CollectionChangedEventArgs(this._features, 33));
this.setChangeMonitor($0);
} catch ($1) {
}
if (this._restyleTimeout > 0) {
window.clearTimeout(this._restyleTimeoutId);
this._restyleTimeoutId = window.setTimeout(Delegate.create(this, this.restyle), this._restyleTimeout);
}
},
$C: function () {
this.$7 = false;
},
setChangeMonitor: function (state) {
this.$8 = state;
this.$7 = false;
},
$D: function () {
return this.$8;
},
$1: function ($p0) {
if (this.$8) {
this.$7 = true;
}
RMap.FeatureStorage.callBase(this, '$1', [
$p0
]);
},
merge: function (attrs) {
var $0 = this.$3.getPropertyFields(16) [0].name;
var $1 = new Array(0);
for (var $2 = 0; $2 < attrs.length; ++$2) {
var $3 = attrs[$2][$0];
var $4 = this.getFeature($3);
if (!isNullOrUndefined($4)) {
RMap._DomHelper.$0($4.properties, attrs[$2]);
($1).add($4);
}
}
if ($1.length > 0) {
this.$1(new RMap.CollectionChangedEventArgs($1, 32));
}
},
update: function (features, source) {
var $0 = this.$3.getPropertyFields(32);
var $1 = 0;
var $2 = new Array(0);
var $3 = new Array(0);
var $4 = new Array(0);
for (var $5 = 0; $5 < features.length; ++$5) {
if (isNullOrUndefined(features[$5])) {
continue;
}
var $6 = features[$5].getId();
var $7 = this._lookup[$6];
if (isNullOrUndefined($7)) {
($3).add(features[$5]);
} else {
$1++;
if (!$0.length) {
$7.$6(features[$5]);
($4).add($7);
} else {
for (var $8 = 0; $8 < $0.length; ++$8) {
var $9 = $7.getProperty($0[$8].name);
var $A = this.$3.$A(features[$5], $0[$8].name);
if ((($9) ? $9.toString()  : $9) !== (($A) ? $A.toString()  : $A)) {
$7.$6(features[$5]);
($4).add($7);
break;
}
}
}
}
}
if ($1 !== this._features.length) {
$2 = this._features.clone();
for (var $B = 0; $B < features.length; ++$B) {
if (isNullOrUndefined(features[$B])) {
continue;
}
var $C = this._lookup[features[$B].getId()];
if (!isNullOrUndefined($C)) {
($2).remove($C);
}
}
}
if (source) {
for (var $D = 0; $D < $3.length; $D++) {
$3[$D].$2 = source;
}
for (var $E = 0; $E < $4.length; $E++) {
$4[$E].$2 = source;
}
for (var $F = $2.length - 1; $F >= 0; $F--) {
if ($2[$F].$2 !== source) {
($2).remove($2[$F]);
}
}
}
if ($2.length > 0) {
this.$E($2);
}
if ($4.length > 0) {
this.$1(new RMap.CollectionChangedEventArgs($4, 32));
}
if ($3.length > 0) {
this.$F($3);
}
},
$E: function ($p0) {
this._suspendNotify = true;
for (var $0 = 0; $0 < $p0.length; ++$0) {
var $1 = $p0[$0];
$1.$1 = null;
(this._features).remove($1);
delete this._lookup[$1.getId()];
}
this._suspendNotify = false;
this.$1(new RMap.CollectionChangedEventArgs($p0, 2));
},
$F: function ($p0) {
this._suspendNotify = true;
for (var $0 = 0; $0 < $p0.length; ++$0) {
var $1 = $p0[$0];
if (isNullOrUndefined($1.getId())) {
$1.$5('$' + (++this.$5));
}
this._features[this._features.length] = $1;
this._lookup[$1.getId()] = $1;
$1.$1 = this;
}
this._suspendNotify = false;
this.$1(new RMap.CollectionChangedEventArgs($p0, 1));
},
clear: function () {
var $0 = null;
if (!this._suspendNotify) {
$0 = this._features.clone();
}(this._features).clear();
this._lookup = {
};
if (!this._suspendNotify) {
this.$1(new RMap.CollectionChangedEventArgs($0, 3));
}
},
add: function (feature) {
if (!isNullOrUndefined(feature) && this.$3.isValid(feature) && isUndefined(this._lookup[feature.getId()])) {
if (isNullOrUndefined(feature.getId())) {
feature.$5('$' + (++this.$5));
}
this._features[this._features.length] = feature;
this._lookup[feature.getId()] = feature;
feature.$1 = this;
this.$1(new RMap.CollectionChangedEventArgs([feature], 1));
return true;
}
return false;
},
remove: function (id) {
var $0 = this._lookup[id];
if (isUndefined($0)) {
return;
}(this._features).remove($0);
delete this._lookup[id];
this.$1(new RMap.CollectionChangedEventArgs([$0], 2));
},
$10: function ($p0) {
var $0 = new Array(0);
for (var $1 = 0; $1 < this._features.length; ++$1) {
if ($p0.invoke(this._features[$1])) {
($0).add(this._features[$1]);
}
}
this.$E($0);
},
add_ioEvent: function (value) {
this.$11 = Delegate.combine(this.$11, value);
},
remove_ioEvent: function (value) {
this.$11 = Delegate.remove(this.$11, value);
},
$11: null,
notifyIO: function (args) {
if (this.$11) {
this.$11.invoke(this, args);
}
},
saveStorage: function (id, prms, writer) {
if (!writer) {
writer = new RMap.RmlSerializer();
}
this.notifyIO(new RMap.IOEventArgs(4, 0, 0, null));
var $0 = new RMap._StorageSaver(this, writer);
$0.$3(Delegate.create(this, this.onSaveCallback), id, prms);
},
onSaveCallback: function (sender, errorMessage) {
var $0 = null;
var $1 = null;
if (!errorMessage) {
this.$C();
$0 = RMap.Messages.layer_saved;
$1 = new RMap.IOEventArgs(5, 0, 0, null);
} else {
$0 = RMap.Messages.layer_savingProblem.replace('{errorMessage}', errorMessage);
$1 = new RMap.IOEventArgs(7, 0, 0, errorMessage);
}
this.notifyIO($1);
if (($1) ['returnValue'] !== false) {
RMap.Messages.$2(this, $0);
}(sender).$6();
},
exportData: function (fs) {
return fs.$0(this);
},
importData: function (data, fd) {
var $0 = fd.deserialize(data, this.$3);
if ($0) {
this.$F($0);
}
},
isDisposed: function () {
return !this.$4;
},
getDescriptions: function () {
return this.$9;
},
$2: function () {
RMap.FeatureStorage.callBase(this, '$2');
if (this.$4) {
this.$4.$2();
}
this.$4 = null;
this.$9 = null;
}
}
RMap.FeatureView = function (storage) {
this.$4 = new Array(0);
RMap.FeatureView.constructBase(this);
this.$3 = storage;
this.$5 = null;
this.$6 = null;
this.$7(false, null);
this.$3.add_collectionChangedEvent(Delegate.create(this, this.$9));
}
RMap.FeatureView.prototype = {
$3: null,
$5: null,
$6: null,
getStorage: function () {
return this.$3;
},
getSchema: function () {
return this.$3.getSchema();
},
getFilter: function () {
return this.$5;
},
setFilter: function (filter) {
if (filter === this.$5) {
return;
}
this.$5 = filter;
this.$7(true, null);
},
getSort: function () {
return this.$6;
},
setSort: function (sort) {
if (sort === this.$6) {
return;
}
this.$6 = sort;
this.$8(true, null);
},
setSortByProperty: function (propertyName, desc) {
if (isNullOrUndefined(desc)) {
desc = false;
}
var $0 = Delegate.create(this, function ($p1_0, $p1_1) {
var $1_0 = $p1_0.getProperty(propertyName);
var $1_1 = $p1_1.getProperty(propertyName);
var $1_2 = (desc) ? - 1 : 1;
if (!$1_0) {
return $1_2;
} else if (!$1_1) {
return $1_2 *= - 1;
}
if ($1_0 > $1_1) {
return $1_2;
} else if ($1_0 < $1_1) {
return $1_2 *= - 1;
} else {
return 0;
}
});
this.setSort($0);
},
$7: function ($p0, $p1) {
var $0 = this.$3.getFeatures();
if (!this.$5 && this.$4 === $0) {
this.$8(true, $p1);
return;
}
if (this.$5) {
this.$4 = new Array(0);
for (var $1 = 0, $2 = 0; $1 < $0.length; ++$1) {
if (this.$5.invoke($0[$1])) {
this.$4[$2++] = $0[$1];
}
}
} else {
this.$4 = $0;
}
this.$8(false, $p1);
if ($p0) {
var $3 = new RMap.CollectionChangedEventArgs(null, 16);
$3.innerArgs = $p1;
this.$1($3);
}
},
$8: function ($p0, $p1) {
if (!this.$6) {
this._features = this.$4;
} else {
if (!this.$5) {
this.$4 = this.$3.getFeatures();
}
this._features = this.$4.clone();
this._features.sort(this.$6);
}
if ($p0) {
var $0 = new RMap.CollectionChangedEventArgs(null, 17);
$0.innerArgs = $p1;
this.$1($0);
}
},
$9: function ($p0, $p1) {
if (this.$5) {
this.$7(true, $p1);
} else if (this.$6) {
this.$8(true, $p1);
} else {
this.$4 = this.$3.getFeatures();
this._features = this.$4;
this.$1($p1);
}
},
$2: function () {
RMap.FeatureView.callBase(this, '$2');
this.$4 = null;
if (this.$3) {
this.$3.remove_collectionChangedEvent(Delegate.create(this, this.$9));
}
this.$3 = null;
}
}
RMap._GeometryOperation = function () {
}
RMap._GeometryOperation.$0 = function ($p0, $p1, $p2) {
var $0 = 0;
if ($p0 < $p2.minX) {
$0 |= 1;
} else if ($p0 > $p2.maxX) {
$0 |= 2;
}
if ($p1 < $p2.minY) {
$0 |= 4;
} else if ($p1 > $p2.maxY) {
$0 |= 8;
}
return $0;
}
RMap._GeometryOperation.$1 = function ($p0, $p1, $p2, $p3, $p4, $p5, $p6) {
var $0 = RMap._GeometryOperation.$0($p2, $p3, $p6);
var $1 = RMap._GeometryOperation.$0($p4, $p5, $p6);
var $2 = $p0.length;
if (!($p1 & $0) && !($p1 & $1)) {
$p0[$2++] = $p2;
$p0[$2++] = $p3;
return $1;
} else if (($p1 & $0) && ($p1 & $1)) {
return $1;
}
var $3 = !($p1 & $0);
if ($p1 === 1) {
var $4 = $p3 + ($p5 - $p3) * ($p6.minX - $p2) / ($p4 - $p2);
if ($3) {
$p0[$2++] = $p2;
$p0[$2++] = $p3;
}
$p0[$2++] = $p6.minX;
$p0[$2++] = Math.round($4);
} else if ($p1 === 2) {
var $5 = $p3 + ($p5 - $p3) * ($p6.maxX - $p2) / ($p4 - $p2);
if ($3) {
$p0[$2++] = $p2;
$p0[$2++] = $p3;
}
$p0[$2++] = $p6.maxX;
$p0[$2++] = Math.round($5);
} else if ($p1 === 8) {
var $6 = $p2 + ($p4 - $p2) * ($p6.maxY - $p3) / ($p5 - $p3);
if ($3) {
$p0[$2++] = $p2;
$p0[$2++] = $p3;
}
$p0[$2++] = Math.round($6);
$p0[$2++] = $p6.maxY;
} else if ($p1 === 4) {
var $7 = $p2 + ($p4 - $p2) * ($p6.minY - $p3) / ($p5 - $p3);
if ($3) {
$p0[$2++] = $p2;
$p0[$2++] = $p3;
}
$p0[$2++] = Math.round($7);
$p0[$2++] = $p6.minY;
}
return $1;
}
RMap._GeometryOperation.$2 = function ($p0, $p1, $p2, $p3) {
var $0 = new Array(0);
for (var $2 = 0; $2 < $p0.length; ++$2) {
$0[$2] = $p0[$2];
}
var $1 = 1;
while ($1 <= 8) {
var $3 = $0[$0.length - 2];
var $4 = $0[$0.length - 1];
$0[$0.length] = $3;
$0[$0.length] = $4;
var $5 = new Array(0);
for (var $6 = 0; $6 < $0.length - 2; $6 += 2) {
RMap._GeometryOperation.$1($5, $1, $0[$6], $0[$6 + 1], $0[$6 + 2], $0[$6 + 3], $p1);
}
if ($p3 && ($5[0] !== $5[$5.length - 2] || $5[1] !== $5[$5.length - 1])) {
$5[$5.length] = $5[0];
$5[$5.length] = $5[1];
}
$0 = null;
$1 = ($1 * 2);
$0 = $5;
}
return [$0];
}
RMap._GeometryOperation.$3 = function ($p0) {
var $0 = new Array($p0.length);
for (var $1 = 0; $1 < $p0.length - 1; $1 += 2) {
$0[$1] = $p0[$1 + 1];
$0[$1 + 1] = $p0[$1];
}
return $0;
}
RMap._GeometryOperation.$4 = function ($p0) {
var $0 = new RMap.Envelope($p0[0], $p0[1], $p0[0], $p0[1]);
for (var $1 = 2; $1 < $p0.length; $1 += 2) {
if ($p0[$1] < $0.minX) {
$0.minX = $p0[$1];
} else if ($p0[$1] > $0.maxX) {
$0.maxX = $p0[$1];
}
if ($p0[$1 + 1] < $0.minY) {
$0.minY = $p0[$1 + 1];
} else if ($p0[$1 + 1] > $0.maxY) {
$0.maxY = $p0[$1 + 1];
}
}
return $0;
}
RMap._InfoWindow = function () {
this.$16 = ScriptFX.UI.$create_Size(400, 250);
this.$17 = ScriptFX.UI.$create_Size(100, 10);
RMap._InfoWindow.constructBase(this);
}
RMap._InfoWindow.prototype = {
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: null,
$B: null,
$C: null,
$D: true,
$E: null,
$F: false,
$10: 0,
$11: null,
$12: null,
$13: null,
$14: null,
$15: null,
$18: null,
$19: null,
$1A: null,
$2: function ($p0) {
this.$4 = $p0;
this.$18 = Delegate.create(this, function () {
this.$4.closeInfoWindow();
});
this.$19 = Delegate.create(null, RMap._DomHelper.$B);
this.$11 = document.createElement('div');
this.$11.className = 'InfoWindow';
this.$11.style.position = 'absolute';
this.$11.style.padding = '10px';
this.$11.style.paddingTop = '15px';
this.$11.style.backgroundColor = 'white';
this.$11.style.border = 'solid 1px black';
this.$11.style.cursor = RMap.Browser.crsPointer;
this.$11.style.visibility = 'hidden';
this.$11.attachEvent('onmousedown', this.$19);
this.$11.attachEvent('ondblclick', this.$19);
this.$11.attachEvent('onmousewheel', this.$19);
this.$11.attachEvent('oncontextmenu', this.$19);
this.$4.$B.appendChild(this.$11);
this.$13 = new RMap._OptimalContainer(Delegate.create(this, this.$27));
this.$13.$12().style.position = 'relative';
this.$11.appendChild(this.$13.$12());
this.$14 = document.createElement('div');
this.$14.style.position = 'relative';
this.$14.style.border = 'solid 1px gray';
this.$14.style.width = '255px';
this.$14.style.height = '225px';
this.$8 = ScriptFX.UI.$create_Location(0, 0);
this.$9 = ScriptFX.UI.$create_Location(0, 0);
var $0 = document.createElement('img');
$0.src = RMap.MapApplication.resourcesUrl + 'InfoWindow/anchor.gif';
$0.style.position = 'absolute';
$0.style.bottom = '-15px';
$0.style.left = '-1px';
this.$11.appendChild($0);
this.$12 = document.createElement('img');
this.$12.src = RMap.MapApplication.resourcesUrl + 'Common/close.gif';
this.$12.style.position = 'absolute';
this.$12.style.cursor = RMap.Browser.crsPointer;
this.$12.style.right = '2px';
this.$12.style.top = '2px';
this.$12.attachEvent('ontouchstart', this.$18);
this.$12.attachEvent('onclick', this.$18);
this.$11.appendChild(this.$12);
},
$1B: function () {
return this.$11;
},
$1C: function ($p0, $p1) {
if (!this.$5.getFeatureView().getFeatures().contains(this.$7)) {
this.$20(true);
return;
}
var $0 = $p1;
while ($0.innerArgs) {
$0 = $0.innerArgs;
}
if ($0.action === 1 || $0.action === 17 || $0.action === 33) {
return;
}
var $1 = (this.$6) && ($0.items) && $0.items.contains(this.$7);
if ($0.action === 2) {
if ($1) {
this.$20(true);
}
return;
}
if ($0.action === 32 || $0.action === 5) {
if ($1) {
this.$B = null;
this.$C = null;
this.$E = null;
this.$26(false);
}
return;
}
},
$1D: function ($p0, $p1) {
if ($p1.action === 256) {
this.$20(true);
} else if ($p1.action === 1) {
if (!$p1.items || $p1.items.contains(this.$6)) {
this.$20(true);
}
}
},
$1E: function ($p0, $p1, $p2, $p3) {
if (!this.$D && $p2 === this.$5 && this.$6 === $p3 && $p3 && !this.$F && this.$E === $p1) {
if ($p3) {
this.$28();
}
return;
}
this.$B = RMap.$create_Coordinate($p0.x, $p0.y);
this.$A = this.$4.$39().$E();
this.$C = this.$4.$39().$14(this.$B);
this.$20(this.$6 !== $p3);
if (isNullOrUndefined($p1)) {
this.$28();
return;
}
$p1 = RMap._DomHelper.$F($p1);
this.$E = $p1;
this.$5 = $p2;
this.$6 = $p3;
if (this.$6) {
this.$7 = this.$6.getFeature();
var $0 = this.$5.$22(this.$7);
if (Type.canCast($0, RMap.PointStyle)) {
if (($0).infoWindowAnchor) {
this.$8 = ($0).infoWindowAnchor;
}
if (($0).anchor) {
this.$9 = ($0).anchor;
}
}
}
if (this.$5) {
this.$5.add_collectionChangedEvent(Delegate.create(this, this.$1C));
this.$5.add_stateChangedEvent(Delegate.create(this, this.$1D));
}
this.$21();
this.$26(false);
},
$1F: function ($p0, $p1, $p2) {
if (!this.$D && $p1 === this.$5 && this.$6 === $p2 && $p2 && this.$F) {
if ($p2) {
this.$28();
}
return;
}
this.$13.$17(false);
this.$20(this.$6 !== $p2);
this.$F = true;
this.$5 = $p1;
this.$6 = $p2;
if (this.$6) {
this.$7 = this.$6.getFeature();
var $0 = this.$5.$22(this.$7);
if (Type.canCast($0, RMap.PointStyle)) {
if (($0).infoWindowAnchor) {
this.$8 = ($0).infoWindowAnchor;
}
if (($0).anchor) {
this.$9 = ($0).anchor;
}
}
}
this.$E = '';
this.$B = RMap.$create_Coordinate($p0.x, $p0.y);
this.$A = this.$4.$39().$E();
this.$C = this.$4.$39().$14(this.$B);
this.$13.$19('');
this.$13.$1A(this.$14);
this.$11.style.display = '';
if (!this.$1A) {
this.$1A = new RMap.Map();
this.$4.blowmap = this.$1A;
this.$1A.initialize(this.$14, {
mapSettings: this.$4.$0,
preventUnload: true
});
this.$1A.$32();
this.$1A.addControl(new RMap._ZoomControl(null), {
top: '5px',
left: '5px'
});
this.$1A.$45();
this.$1A.disablePan();
var $dict1 = this.$4.layers;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
var $2 = ($1.value).$3C();
this.$1A.addLayer($2);
($1.value).add_stateChangedEvent(Delegate.create($2, $2.$25));
}
this.$4.add_$28(Delegate.create(this, function ($p1_0, $p1_1) {
this.$1A.setTheme(this.$4.getCurrentTheme());
}));
this.$4.add_$2A(Delegate.create(this.$1A, this.$1A.$43));
}
this.$1A.setCenter(this.$B.x, this.$B.y, this.$4.$39().$E());
this.$1A.setZoomLevel(this.$4.getZoomLevel() - 5);
this.$1A.resize();
if (ScriptFX.Application.current.get_isIE()) {
this.$1A.$30(true);
}
if (this.$5) {
this.$5.add_collectionChangedEvent(Delegate.create(this, this.$1C));
this.$5.add_stateChangedEvent(Delegate.create(this, this.$1D));
}
this.$21();
this.$13.$17(true);
this.$13.$1C();
this.$28();
},
$20: function ($p0) {
if (this.$5) {
this.$5.remove_collectionChangedEvent(Delegate.create(this, this.$1C));
this.$5.remove_stateChangedEvent(Delegate.create(this, this.$1D));
if ($p0 && this.$6) {
this.$7 = null;
this.$5.$3B(this.$6);
}
}
this.$F = false;
this.$5 = null;
this.$6 = null;
this.$7 = null;
this.$8 = ScriptFX.UI.$create_Location(0, 0);
this.$9 = ScriptFX.UI.$create_Location(0, 0);
if (this.$13) {
this.$13.$18();
}
this.$22();
},
$21: function () {
this.$11.style.visibility = '';
this.$11.style.display = '';
this.$D = false;
},
$22: function () {
this.$11.style.display = 'none';
this.$11.style.visibility = 'hidden';
this.$D = true;
if (!isNullOrUndefined(this.$13)) {
this.$13.$18();
}
},
$23: function ($p0) {
if (this.$D) {
return;
}
this.$4.setView(this.$B.x, this.$B.y, $p0, null);
},
$24: function () {
return this.$D;
},
$25: function () {
if (this.$D || !this.$6) {
return;
}
this.$26(true);
},
$26: function ($p0) {
if (this.$6 && !this.$B) {
this.$B = this.$7.geometry.$7(null);
this.$A = this.$4.$39().$E();
this.$B = RMap.CoordinateSystem.$4(this.$B, this.$7.getSchema().getCoordinateSystem(), this.$A);
this.$C = this.$4.$39().$14(this.$B);
}
if (!this.$F) {
if (this.$6 && (!this.$E || $p0)) {
this.$E = this.$7.getSchema().getInfoWindowContent(this.$7);
this.$E = RMap._DomHelper.$F(this.$E);
}
if (this.$13.$13() !== this.$E) {
this.$11.style.display = '';
this.$11.style.visibility = '';
var $0 = this.$4.$39().$11();
this.$13.$15(this.$17, this.$16, ScriptFX.UI.$create_Size(Math.round($0.width * (2 / 3)), Math.round($0.height * (2 / 3))));
this.$13.$19(this.$E);
}
} else if (this.$6) {
this.$1A.disableAnimation();
this.$1A.setCenter(this.$6.getFeature().geometry.getCoordinates() [0], this.$6.getFeature().geometry.getCoordinates() [1], this.$4.$39().$E());
this.$1A.enableAnimation();
}
this.$27();
this.$28();
},
$27: function () {
if (!this.$C) {
return;
}
this.$15 = this.$13.$14();
var $0 = this.$29();
this.$11.style.top = (this.$C.y - this.$11.offsetHeight - 15 + $0.top) + 'px';
this.$11.style.left = (this.$C.x + $0.left) + 'px';
if (ScriptFX.Application.current.get_host().get_name() === 4) {
this.$11.style.width = this.$15.width + 20 + 'px';
}
this.$11.style.visibility = 'hidden';
this.$11.style.visibility = '';
window.clearTimeout(this.$10);
if (!this.$2A) {
this.$10 = window.setTimeout(Delegate.create(this, this.$28), 50);
}
},
$28: function () {
if (this.$D) {
return;
}
if (this.$4.$1D.$6 === 'pan' || this.$2A) {
return;
}
if (this.$13.$9) {
window.clearTimeout(this.$10);
this.$10 = window.setTimeout(Delegate.create(this, this.$28), 50);
return;
}
var $0 = this.$4.$39().$13();
var $1 = this.$4.$39().$14(this.$B);
var $2 = 0;
var $3 = 0;
this.$15 = this.$13.$14();
if ($1.x + this.$15.width + 50 > $0.maxX) {
$2 = $1.x + this.$15.width - $0.maxX + 50;
} else if ($1.x - 50 < $0.minX) {
$2 = $1.x - $0.minX - 50;
}
if ($1.y + 50 > $0.maxY) {
$3 = $0.maxY - $1.y - 50;
} else if ($1.y - this.$15.height - 50 < $0.minY) {
$3 = $0.minY - $1.y + this.$15.height + 50;
}
if (!$2 && !$3) {
return;
}
this.$4.panPixels($2, $3);
},
$29: function () {
var $0 = ScriptFX.UI.$create_Location(0, 0);
if (this.$6) {
var $1 = this.$5.$22(this.$7);
if (Type.canCast($1, RMap.PointStyle) && ($1).infoWindowAnchor) {
var $2 = ScriptFX.UI.$create_Size(0, 0);
if (($1).iconSize) {
if (isFinite(($1).iconSize.width) && !isNaN(($1).iconSize.width)) {
$2.width = ($1).iconSize.width;
}
if (isFinite(($1).iconSize.height) && !isNaN(($1).iconSize.height)) {
$2.height = ($1).iconSize.height;
}
} else if (!isNullOrUndefined(this.$6.$1())) {
$2.width = this.$6.$1().offsetWidth;
$2.height = this.$6.$1().offsetHeight;
}
if (($1).anchor) {
if (($1).anchorBase) {
$0.left = - $2.width * ($1).anchorBase.left;
$0.top = - $2.height * ($1).anchorBase.top;
}
$0.left -= parseInt(($1).anchor.left);
$0.top -= parseInt(($1).anchor.top);
} else {
$0.left = ( - $2.width / 2);
$0.top = ( - $2.height / 2);
}
if (($1).infoWindowAnchor) {
if (($1).infoWindowAnchorBase) {
$0.left += $2.width * ($1).infoWindowAnchorBase.left;
$0.top += $2.height * ($1).infoWindowAnchorBase.top;
}
$0.left += parseInt(($1).infoWindowAnchor.left);
$0.top += parseInt(($1).infoWindowAnchor.top);
}
}
}
return $0;
},
$0: function ($p0) {
if (this.$D) {
return;
}
if (ScriptFX.Application.current.get_host().get_name() === 2) {
this.$13.$16('hidden');
}
if (!($p0 & 1)) {
this.$11.style.visibility = 'hidden';
}
},
$1: function ($p0, $p1) {
if (this.$D) {
return;
}
if (ScriptFX.Application.current.get_host().get_name() === 2) {
if (this.$2A) {
window.clearTimeout(this.$2A);
}
this.$2A = window.setTimeout(Delegate.create(this, this.$2B), 500);
}
if (($p0 & 4)) {
var $0 = this.$4.$39().$E();
this.$B = RMap.CoordinateSystem.$4(this.$B, this.$A, $0);
this.$A = $0;
}
if (!($p0 & 1)) {
this.$15 = this.$13.$14();
this.$C = this.$4.$39().$14(this.$B);
this.$11.style.visibility = '';
var $1 = this.$29();
this.$11.style.top = (this.$C.y - this.$11.offsetHeight - 15 + $1.top) + 'px';
this.$11.style.left = (this.$C.x + $1.left) + 'px';
}
},
$2A: 0,
$2B: function () {
this.$13.$16('auto');
this.$2A = 0;
},
$3: function () {
this.$12.attachEvent('onclick', this.$18);
this.$11.detachEvent('onmousedown', this.$19);
this.$11.detachEvent('ondblclick', this.$19);
this.$11.detachEvent('onmousewheel', this.$19);
this.$11.detachEvent('oncontextmenu', this.$19);
this.$18 = null;
this.$19 = null;
this.$13.$24();
this.$13 = null;
if (this.$1A) {
this.$4.remove_$2A(Delegate.create(this.$1A, this.$1A.$43));
this.$1A.dispose();
}
this.$1A = null;
}
}
RMap.MapControl = function () {
}
RMap.MapControl.createNavigationControl = function (dict) {
return new RMap._NavigationControl(dict);
}
RMap.MapControl.createZoomControl = function (dict) {
return new RMap._ZoomControl(dict);
}
RMap.MapControl.createIndicatorControl = function (dict) {
return new RMap.IndicatorControl(dict);
}
RMap.MapControl.createThemeSelectorControl = function (dict) {
return new RMap._ThemeSelectorControl(dict);
}
RMap.MapControl.createScaleBarControl = function (dict) {
var $0 = null;
var $1 = dict;
if (!isNullOrUndefined(dict)) {
if (typeof (dict) === 'string') {
$1 = {
};
$1['crs'] = RMap.CoordinateSystem.getCoordinateSystem(dict);
}
}
return new RMap.ScaleBarControl($1);
}
RMap.MapControl.createMapOverviewControl = function (dict) {
return new RMap._MapOverviewControl(dict);
}
RMap.MapControl.createMessageControl = function (dict) {
return new RMap.MessageControl(dict);
}
RMap.MapControl.createExternalMapControl = function (dict) {
return new RMap._ExternalMapControl(dict);
}
RMap.CoordinateSystem = function () {
}
RMap.CoordinateSystem.getCoordinateSystem = function (csId) {
if (!Object.keyExists(RMap.CoordinateSystem.$0, csId)) {
RMap.CoordinateSystem.$0[csId] = RMap.CS.RCoordinateSystemFactory.createFromCrsCode(csId);
}
return RMap.CoordinateSystem.$0[csId];
}
RMap.CoordinateSystem.$1 = function ($p0, $p1, $p2) {
return $p0.measureUnitsInMeters(new RMap.CS.RCoordinate2D($p1, $p2)).x;
}
RMap.CoordinateSystem.$2 = function ($p0, $p1, $p2, $p3) {
var $0 = $p0.measureUnitsInMeters(new RMap.CS.RCoordinate2D($p1, $p2)).x;
return $p3 / $0;
}
RMap.CoordinateSystem.$3 = function ($p0, $p1) {
return $p1.isInsideValidArea(new RMap.CS.RCoordinate2D($p0.x, $p0.y));
}
RMap.CoordinateSystem.transformCS = function (coordinates, sourceCS, targetCS) {
if (sourceCS === targetCS) {
return coordinates;
}
var $0 = new Array(0);
var $1 = new RMap.CS.RCoordinate2D(0, 0);
for (var $2 = 0; $2 < coordinates.length; $2 += 2) {
var $3 = new RMap.CS.RCoordinate2D(coordinates[$2], coordinates[$2 + 1]);
targetCS.transformFrom(sourceCS, $3, $1);
$0[$2] = $1.x;
$0[$2 + 1] = $1.y;
}
return $0;
}
RMap.CoordinateSystem.$4 = function ($p0, $p1, $p2) {
if ($p1 === $p2) {
return $p0;
}
var $0 = RMap.CoordinateSystem.transformCS([$p0.x,
$p0.y], $p1, $p2);
return RMap.$create_Coordinate($0[0], $0[1]);
}
RMap.CoordinateSystem.$5 = function ($p0, $p1, $p2) {
if ($p1 === $p2) {
return $p0;
}
var $0 = RMap.CoordinateSystem.transformCS($p0.getCoordinates(), $p1, $p2);
return new RMap.Geometry($p0.getGeometryType(), $0);
}
RMap._DomHelper = function () {
}
RMap._DomHelper.$0 = function ($p0, $p1) {
if ($p0 && $p1) {
var $dict1 = $p1;
for (var $key2 in $dict1) {
var $0 = {
key: $key2,
value: $dict1[$key2]
};
($p0) [$0.key] = $0.value;
}
}
return $p0;
}
RMap._DomHelper.$1 = function ($p0) {
if (ScriptFX.Application.current.get_isIE()) {
if ($p0 === 1) {
return 0;
}
if ($p0 === 4) {
return 1;
}
}
return $p0;
}
RMap._DomHelper.$2 = function ($p0, $p1) {
return document.createElementNS($p0, $p1);
}
RMap._DomHelper.$3 = function ($p0) {
var $0 = document.createElement('div');
$0.style.display = 'block';
$0.style.position = 'absolute';
$0.style.left = '0px';
$0.style.top = '0px';
$0.style.width = 'auto';
$0.style.height = 'auto';
$0.style.margin = '0px';
$0.unselectable = 'on';
$0.style.hasLayout = - 1;
if ($p0) {
$p0.appendChild($0);
}
return $0;
}
RMap._DomHelper.$4 = function ($p0) {
return document.createTextNode($p0);
}
RMap._DomHelper.$5 = function ($p0, $p1) {
if (!$p0 || !$p0.parentNode) {
return;
}
var $0 = $p0.parentNode;
switch ($p1) {
case 1:
$0.appendChild($p0);
break;
case 2:
if ($0.firstChild && $0.firstChild !== $p0) {
$0.insertBefore($p0, $0.firstChild);
}
break;
case 4:
if ($p0.previousSibling) {
$0.insertBefore($p0, $p0.previousSibling);
}
break;
case 3:
if ($p0.nextSibling) {
if ($p0.nextSibling.nextSibling) {
$0.insertBefore($p0.nextSibling.nextSibling);
} else {
$0.appendChild($p0);
}
}
break;
default:
throw new Error('invalid argument');
}
}
RMap._DomHelper.$6 = function ($p0, $p1) {
var $0 = $p0.parentNode;
if ($p1 <= 0) {
RMap._DomHelper.$5($p0, 2);
return;
}
if ($p1 >= $0.childNodes.length) {
RMap._DomHelper.$5($p0, 1);
return;
}
var $1 = $0.childNodes[$p1];
$0.insertBefore($p0, $1);
}
RMap._DomHelper.$7 = function ($p0) {
var $0 = ScriptFX.UI.$create_Location(0, 0);
if ($p0.offsetParent) {
$0.left = $p0.offsetLeft + (($p0.style.borderLeftWidth) ? parseInt($p0.style.borderLeftWidth)  : 0);
$0.top = $p0.offsetTop + (($p0.style.borderTopWidth) ? parseInt($p0.style.borderTopWidth)  : 0);
while (($p0 = $p0.offsetParent)) {
$0.left += $p0.offsetLeft + (($p0.style.borderLeftWidth) ? parseInt($p0.style.borderLeftWidth)  : 0);
$0.top += $p0.offsetTop + (($p0.style.borderTopWidth) ? parseInt($p0.style.borderTopWidth)  : 0);
}
}
return $0;
}
RMap._DomHelper.$8 = function ($p0) {
if ($p0.pageX && window.navigator.userAgent.indexOf('Firefox/3.') === - 1) {
return ScriptFX.UI.$create_Location($p0.pageX, $p0.pageY);
} else {
return ScriptFX.UI.$create_Location($p0.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, $p0.clientY + document.body.scrollTop + document.documentElement.scrollTop);
}
}
RMap._DomHelper.$9 = function ($p0, $p1) {
var $0 = RMap._DomHelper.$8($p0);
var $1 = RMap._DomHelper.$7($p1);
return ScriptFX.UI.$create_Location($0.left - $1.left, $0.top - $1.top);
}
RMap._DomHelper.$A = function ($p0) {
if (!isNullOrUndefined($p0.wheelDelta)) {
return $p0.wheelDelta;
}
if (!isNullOrUndefined($p0.detail)) {
return - $p0.detail;
}
return 0;
}
RMap._DomHelper.$B = function () {
var $0 = window.event;
if (isNullOrUndefined($0)) {
return;
}
if (!$0.srcElement || $0.srcElement.tagName !== 'A') {
$0.returnValue = false;
}
$0.cancelBubble = true;
}
RMap._DomHelper.$C = function ($p0) {
$p0.setCapture();
}
RMap._DomHelper.$D = function ($p0) {
$p0.releaseCapture();
}
RMap._DomHelper.$E = function ($p0) {
return $p0.offsetWidth - $p0.clientWidth;
}
RMap._DomHelper.$F = function ($p0) {
while ($p0.indexOf('realisatt_noncachable=') > - 1) {
$p0 = $p0.replace('realisatt_noncachable=', 'rnd=' + Date.get_now().toString());
}
var $0 = $p0.indexOf('realisatt_refreshable=');
while ($0 > - 1) {
var $1 = $p0.substring(0, $0).lastIndexOf('<');
var $2 = $p0.substring($0, $p0.length).indexOf('/>');
if ($1 > - 1 && $2 > - 1) {
var $4 = $p0.substring($1, $0 + $2 + 2);
var $5 = RMap._DomHelper.$10($4);
$p0 = $p0.replace($4, $5);
}
var $3 = $p0.indexOf('realisatt_refreshable=');
if ($3 !== $0) {
$0 = $3;
} else {
$0 = - 1;
}
}
return $p0;
}
RMap._DomHelper.$10 = function ($p0) {
var $0 = document.createElement('div');
$0.innerHTML = $p0;
var $1 = new StringBuilder();
for (var $2 = 0; $2 < $0.childNodes.length; $2++) {
if ($0.childNodes[$2].nodeName === '#text') {
$1.append($0.childNodes[$2].nodeValue);
} else if ($0.childNodes[$2].nodeName === 'TABLE') {
var $3 = $0.childNodes[$2];
$1.append('<TABLE ' + RMap._DomHelper.$12($3) + '>');
for (var $4 = 0; $4 < $3.rows.length; $4++) {
$1.append('<TR>');
var $5 = $3.rows[$4];
for (var $6 = 0; $6 < $5.childNodes.length; $6++) {
$1.append('<TD>' + RMap._DomHelper.$10($5.childNodes[$6].innerHTML) + '</TD>');
}
$1.append('</TR>');
}
$1.append('</TABLE>');
} else if ($0.childNodes[$2].nodeName === 'IMG') {
var $7 = ($0.childNodes[$2]).src;
var $8 = 0;
if ($7.toLowerCase().indexOf('realisatt') > - 1) {
var $9 = $7.replace('?', '&').split('&');
$7 = $9[0] + '?';
for (var $A = $9.length - 1; $A > 0; $A--) {
var $B = $9[$A].split('=');
if ($B.length === 2 && $B[0] === 'realisatt_refreshable') {
$8 = parseInt($B[1]) * 1000;
} else if ($B[0] === 'realisatt_noncachable') {
$7 += '&rnd=' + Date.get_now().toString();
} else if ($B[0].indexOf('realisatt') === - 1) {
$7 += '&' + $9[$A];
}
}
}
if (!isFinite($8) || $8 < 1) {
$1.append('<IMG src=\'' + $7 + '\' ' + RMap._DomHelper.$12($0.childNodes[$2]) + '/>');
} else {
$1.append('<IMG title=\'loading...\' alt=\'loading...\' src=\'' + $7 + '&time=' + Date.get_now().toString() + '\'');
$1.append(' onerror=\'onload()\'');
$1.append(' onload=\'var _this=this; _this.title=&quot;' + $7 + ' &quot;+Date(); if(_this._timeout)clearTimeout(_this._timeout); _this._timeout=setTimeout(function(){this._p=_this;while(this._p.parentNode){this._p=this._p.parentNode;if(this._p==document.body){_this.src=&quot;' + $7 + '&time=&quot; + Date();break}};this._p=null;_this=null},' + $8.toString() + ')\'');
$1.append(' alt=\'' + $7 + '\'');
$1.append(' ' + RMap._DomHelper.$12($0.childNodes[$2]));
$1.append('/>');
}
} else if ($0.childNodes[$2].nodeName !== 'SCRIPT') {
if ($0.childNodes[$2].innerHTML !== '') {
$1.append('<' + $0.childNodes[$2].nodeName + '>' + RMap._DomHelper.$10($0.childNodes[$2].innerHTML) + '</' + $0.childNodes[$2].nodeName + '>');
} else {
if ($0.childNodes[$2].nodeName.indexOf('/') === - 1) {
$1.append('<' + $0.childNodes[$2].nodeName + '/>');
} else {
$1.append('<' + $0.childNodes[$2].nodeName + '>');
}
}
}
}
$0.innerHTML = '';
$0 = null;
return $1.toString();
}
RMap._DomHelper.$11 = function ($p0) {
var $0 = document.createElement('div');
$0.innerHTML = $p0;
var $1 = new StringBuilder();
for (var $2 = 0; $2 < $0.childNodes.length; $2++) {
if ($0.childNodes[$2].nodeName === '#text') {
$1.append($0.childNodes[$2].nodeValue);
} else if ($0.childNodes[$2].nodeName !== 'SCRIPT') {
$1.append(RMap._DomHelper.$11($0.childNodes[$2].innerHTML));
}
}
$0.innerHTML = '';
$0 = null;
return $1.toString();
}
RMap._DomHelper.$12 = function ($p0) {
var $0 = new StringBuilder();
if (!isNullOrUndefined($p0.border) && $p0.border !== '') {
$0.append(' border=\'' + $p0.border + '\'');
}
if (!isNullOrUndefined($p0.style)) {
$0.append(' style=\'');
if (!isNullOrUndefined($p0.style.width) && $p0.style.width !== '') {
$0.append('width:' + $p0.style.width + ';');
}
if (!isNullOrUndefined($p0.style.height) && $p0.style.height !== '') {
$0.append('height:' + $p0.style.height + ';');
}
$0.append('\'');
}
return $0.toString();
}
RMap._DomHelper.$14 = function () {
if (!RMap._DomHelper.$13) {
RMap._DomHelper.$13 = RMap._DomHelper.$16(window.location.href);
}
return RMap._DomHelper.$13;
}
RMap._DomHelper.$15 = function () {
return window.location.protocol + '//' + window.location.host;
}
RMap._DomHelper.$16 = function ($p0) {
var $0 = $p0.indexOf('?');
if ($0 !== - 1) {
$p0 = $p0.substring(0, $0);
}
return $p0.substring(0, $p0.lastIndexOf('/') + 1);
}
RMap._DomHelper.$17 = function ($p0, $p1) {
if ($p0.toLowerCase().startsWith('http://') || $p0.toLowerCase().startsWith('https://')) {
return $p0;
}
if ($p0.startsWith('/')) {
var $0 = $p1.split('//');
if ($0.length > 1 && ($0[0].toLowerCase() === 'http:' || $0[0].toLowerCase() === 'https:')) {
var $1 = $0[1].split('/');
if ($1.length > 0 && $1[0].length > 0) {
return $0[0] + '//' + $1[0] + $p0;
}
}
}
return RMap._DomHelper.$16($p1) + $p0;
}
RMap._DomHelper.$18 = function ($p0, $p1) {
var $0 = $p0.replace('//', '/').split('/');
var $1 = $p1.replace('//', '/').split('/');
var $2 = ($0.length > 1) ? $0[1].toLowerCase()  : '';
var $3 = ($1.length > 1) ? $1[1].toLowerCase()  : '';
return $2.length > 0 && $2 === $3;
}
RMap._DomHelper.$19 = function ($p0, $p1) {
var $0 = $p0.replace('//', '/').split('/');
var $1 = $p1.replace('//', '/').split('/');
var $2 = ($0.length > 1) ? $0[1].toLowerCase()  : '';
var $3 = ($1.length > 1) ? $1[1].toLowerCase()  : '';
var $4 = $2.split('.');
var $5 = $3.split('.');
for (var $8 = $4.length - 3; $8 >= 0; $8--) {
$4.splice($8, 1);
}
for (var $9 = $5.length - 3; $9 >= 0; $9--) {
$5.splice($9, 1);
}
var $6 = $4.join('.');
var $7 = $5.join('.');
return $6.replace('.', '').length > 0 && $6 === $7;
}
RMap._DomHelper.$1A = function ($p0, $p1) {
if (!$p1) {
$p1 = '';
}
while ($p1.substring(0, 3) === '../') {
$p0 = $p0.substring(0, $p0.length - 1);
$p0 = $p0.substring(0, $p0.lastIndexOf('/'));
$p1 = $p1.substring($p1.indexOf('/'), $p1.length);
}
return $p0 + $p1;
}
RMap._DomHelper.$1B = function ($p0) {
var $0 = $p0;
if (isNullOrUndefined($0) || isNullOrUndefined($0.length)) {
$0 = [
];
if ($p0) {
$0[0] = $p0;
}
}
return $0;
}
RMap._DomHelper.$1C = function () {
RMap._DomHelper.$1D = Delegate.create(null, RMap._TEAE.$E);
}
RMap._DomHelper.$1E = function () {
var $0 = window.document.readyState;
return $0 === 'complete';
}
RMap.Drawing = function (feature) {
this._feature = feature;
}
RMap.Drawing.prototype = {
$0: null,
_feature: null,
_isHidden: false,
_element: null,
_targetCSGeometry: null,
getFeature: function () {
return this._feature;
},
$1: function () {
return this._element;
},
getStyle: function () {
return this.$0.$22(this._feature);
},
setStyle: function (style) {
this._feature.setStyle(style);
},
select: function () {
if (!isNullOrUndefined(this.$0)) {
this.$0.$3A(this, false);
}
},
isHidden: function () {
return this._isHidden;
},
hide: function () {
if (this._isHidden || !this._element) {
return;
}
this._element.style.visibility = 'hidden';
this._isHidden = true;
this.$0.$27(new RMap.StateChangedEventArgs([this], 1));
},
show: function () {
if (!this._isHidden || !this._element) {
return;
}
this._element.style.visibility = '';
this._isHidden = false;
this.$0.$27(new RMap.StateChangedEventArgs([this], 2));
},
openInfoWindow: function () {
this.$0.$36(this, null);
},
setOrder: function (order) {
RMap._DomHelper.$5(this._element, order);
},
getProperty: function (name) {
return this._feature.getProperty(name);
},
setProperty: function (name, value) {
this._feature.setProperty(name, value);
},
getGeometry: function () {
return this._feature.geometry;
},
setGeometry: function (geometry) {
this._feature.geometry = geometry;
},
$6: function () {
return !this._feature;
},
$7: function () {
if (this._element && this._element.parentNode) {
this._element.parentNode.removeChild(this._element);
}
this._element = null;
this._targetCSGeometry = null;
this.$0 = null;
this._feature = null;
}
}
RMap._Environment = function () {
}
RMap._Environment.$0 = function () {
return ScriptFX.Application.current.get_isIE() && ScriptFX.Application.current.get_host().get_majorVersion() < 7;
}
RMap._Environment.$1 = function () {
return RMap.MapApplication.resourcesUrl + 'blank.gif';
}
RMap.Browser = function () {
}
RMap.Browser.checkCompatibility = function () {
var $0 = ScriptFX.Application.current.get_host();
if ($0.get_name() === 1 && $0.get_version() >= 6) {
return true;
}
if ($0.get_name() === 2 && $0.get_version() >= 1.5) {
try {
document.body.focus();
return true;
} catch ($1) {
}
}
return false;
}
RMap.Browser.dStr = function (s) {
if (RMap._DomHelper.$1D) {
return RMap._DomHelper.$1D.invoke(s);
} else {
return '';
}
}
RMap.Layer = function () {
}
RMap.DrawingEventArgs = function (items, action) {
RMap.DrawingEventArgs.constructBase(this);
this.items = items;
this.action = action;
}
RMap.DrawingEventArgs.prototype = {
action: 0,
items: null
}
RMap.StateChangedEventArgs = function (items, action) {
RMap.StateChangedEventArgs.constructBase(this);
this.items = items;
this.action = action;
}
RMap.StateChangedEventArgs.prototype = {
items: null,
action: 0
}
RMap.DrawingLayer = function (id, featureView, styler, config) {
this.$7 = 0;
this._simpleDrawings = new Array(0);
this._complexDrawings = new Array(0);
this.drawings = {
};
this.$12 = new RMap._TimeoutInvoker();
this.$13 = new RMap._TimeoutInvoker();
RMap.DrawingLayer.constructBase(this);
this.$4 = id;
this.$6 = featureView;
this.$6.getStorage().$A(this);
if (styler) {
this.$8 = (Type.canCast(styler, RMap.Styler)) ? styler : new RMap.CustomStyler(styler);
}
this.$A = config;
if (this.$A) {
if (config['selstyler']) {
this.$9 = (Type.canCast(config['selstyler'], RMap.Styler)) ? config['selstyler'] : new RMap.CustomStyler(config['selstyler']);
}
if (this.$A['enableMouseOver']) {
this.$B = true;
}
if (this.$A['enableDblClick']) {
this.$C = true;
}
}
if (isNullOrUndefined(this.$A)) {
this.$A = {
};
}
this.$D = false;
this.$1F = 0;
this.$20 = null;
this.$17 = Delegate.create(this, this.$37);
this.$18 = Delegate.create(this, this.$38);
this.$19 = Delegate.create(this, this.onContextMenu);
this.$1A = Delegate.create(this, this.onMouseOver);
this.$1B = Delegate.create(this, this.onMouseOut);
this.$1C = Delegate.create(this, this.onDblClick);
this.$21 = Delegate.create(this, this.$23);
if (featureView && featureView.getStorage()) {
featureView.getStorage().add_ioEvent(this.$21);
}
}
RMap.DrawingLayer.prototype = {
$4: null,
$5: null,
$6: null,
$8: null,
$9: null,
$A: null,
$B: false,
$C: false,
$D: false,
$E: 0,
$F: 0,
$10: null,
$11: null,
lastSelLoc: null,
add_collectionChangedEvent: function (value) {
this.$14 = Delegate.combine(this.$14, value);
},
remove_collectionChangedEvent: function (value) {
this.$14 = Delegate.remove(this.$14, value);
},
$14: null,
add_stateChangedEvent: function (value) {
this.$15 = Delegate.combine(this.$15, value);
},
remove_stateChangedEvent: function (value) {
this.$15 = Delegate.remove(this.$15, value);
},
$15: null,
add_editDrawingEvent: function (value) {
this.$16 = Delegate.combine(this.$16, value);
},
remove_editDrawingEvent: function (value) {
this.$16 = Delegate.remove(this.$16, value);
},
$16: null,
$17: null,
$18: null,
$19: null,
$1A: null,
$1B: null,
$1C: null,
add_$1D: function ($p0) {
this.$1E = Delegate.combine(this.$1E, $p0);
},
remove_$1D: function ($p0) {
this.$1E = Delegate.remove(this.$1E, $p0);
},
$1E: null,
$1F: 0,
$20: null,
$21: null,
getId: function () {
return this.$4;
},
getFeatureView: function () {
return this.$6;
},
exportData: function (fs) {
return this.getFeatureView().getStorage().exportData(fs);
},
importData: function (data, fd) {
this.getFeatureView().getStorage().importData(data, fd);
},
setStyler: function (styler) {
this.$8 = (Type.canCast(styler, RMap.Styler)) ? styler : new RMap.CustomStyler(styler);
this.$24(this, new RMap.CollectionChangedEventArgs(this.$6.getStorage().getFeatures(), 33));
},
$22: function ($p0) {
if (this.$9 && this.$5.$41().$7 === $p0) {
return this.$9.getStyle($p0);
}
if (this.$8) {
return this.$8.getStyle($p0);
}
if (!isNullOrUndefined($p0.getStyle())) {
return $p0.getStyle();
}
return RMap.MapApplication.geDefaultStyle($p0);
},
isHidden: function () {
return this.$D;
},
hide: function () {
if (this.$D) {
return;
}
try {
this.$10.style.visibility = 'hidden';
} catch ($0) {
}
this.$11.style.visibility = 'hidden';
this.$D = true;
this.$27(new RMap.StateChangedEventArgs(null, 1));
},
show: function () {
if (!this.$D) {
return;
}
this.$D = false;
if (this.$1F) {
this.$0(this.$1F);
this.$1(this.$1F, this.$20);
this.$20 = 0;
}
try {
this.$10.style.visibility = '';
} catch ($0) {
}
this.$11.style.visibility = '';
this.$27(new RMap.StateChangedEventArgs(null, 2));
},
$2: function ($p0) {
this.$5 = $p0;
if (ScriptFX.Application.current.get_isIE()) {
this.$10 = RMap._DomHelper.$3(this.$5.$9);
} else {
this.$10 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'g');
this.$5.$9.appendChild(this.$10);
}
this.$11 = RMap._DomHelper.$3(this.$5.$A);
try {
this.$10.attachEvent('onmousedown', Delegate.create(null, RMap._DomHelper.$B));
this.$10.attachEvent('ondblclick', Delegate.create(null, RMap._DomHelper.$B));
} catch ($0) {
}
this.$11.attachEvent('onmousedown', Delegate.create(null, RMap._DomHelper.$B));
this.$11.attachEvent('ondblclick', Delegate.create(null, RMap._DomHelper.$B));
this.$2D();
this.$6.add_collectionChangedEvent(Delegate.create(this, this.$24));
},
$23: function ($p0, $p1) {
if (this.$5) {
this.$5.$31(this.$4, ($p1 && ($p1.action === 4 || $p1.action === 1)));
}
},
$24: function ($p0, $p1) {
switch ($p1.action) {
case 1:
var $enum1 = $p1.items.getEnumerator();
while ($enum1.moveNext()) {
var $0 = $enum1.get_current();
this.$2A($0);
}
break;
case 2:
var $enum2 = $p1.items.getEnumerator();
while ($enum2.moveNext()) {
var $1 = $enum2.get_current();
this.$2C($1.getId());
}
break;
case 3:
this.$2F();
break;
case 4:
this.$2E();
break;
case 16:
this.$2E();
break;
case 17:
this.$2E();
break;
case 32:
var $enum3 = $p1.items.getEnumerator();
while ($enum3.moveNext()) {
var $2 = $enum3.get_current();
var $3 = this.drawings[$2.getId()];
if (!isNullOrUndefined($3)) {
$3.update($p1.action);
}
}
break;
case 33:
var $enum4 = $p1.items.getEnumerator();
while ($enum4.moveNext()) {
var $4 = $enum4.get_current();
var $5 = this.drawings[$4.getId()];
if (!isNullOrUndefined($5)) {
$5.updateStyle($p1.action);
}
}
break;
}
this.$26($p1);
},
$25: function ($p0, $p1) {
switch ($p1.action) {
case 1:
this.hide();
break;
case 2:
this.show();
break;
}
this.$27($p1);
},
$26: function ($p0) {
if (this.$14) {
this.$14.invoke(this, $p0);
}
},
$27: function ($p0) {
if (this.$15) {
this.$15.invoke(this, $p0);
}
},
attachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'drawing') {
this.add_$1D(handler);
} else if (name === 'collection') {
this.add_collectionChangedEvent(handler);
}
},
detachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'drawing') {
this.remove_$1D(handler);
}
},
$28: function ($p0) {
if (this.$1E) {
this.$1E.invoke(this, $p0);
}
},
$29: function ($p0) {
if ($p0) {
for (var $0 = 0; $0 < this._complexDrawings.length; ++$0) {
(this._complexDrawings[$0]).updateStyle(33);
}
}
return (this._complexDrawings.length > 0);
},
$2A: function ($p0) {
var $0 = null;
if ($p0.geometry.getGeometryType() === 1 && !this.$A['forceShape']) {
$0 = new RMap._Marker($p0);
(this._simpleDrawings).add($0);
} else {
$0 = new RMap._Shape($p0);
(this._complexDrawings).add($0);
}
$0.$2(this);
this.drawings[$p0.getId()] = $0;
},
$2B: function ($p0) {
if (!$p0.length) {
return;
}
var $0 = new Array(0);
for (var $2 = 0; $2 < $p0.length; ++$2) {
if ($p0[$2].geometry.getGeometryType() === 1 && !this.$A['forceShape']) {
$0[$2] = new RMap._Marker($p0[$2]);
(this._simpleDrawings).add($0[$2]);
} else {
$0[$2] = new RMap._Shape($p0[$2]);
(this._complexDrawings).add($0[$2]);
}
$0[$2].$0 = this;
this.drawings[$p0[$2].getId()] = $0[$2];
}
var $1 = new RMap._TimeoutInvoker();
$1.$9($0, Delegate.create(this, function ($p1_0) {
if (!($p1_0).$6()) {
($p1_0).$2(this);
}
}), null, null);
},
$2C: function ($p0) {
var $0 = this.drawings[$p0];
if (isUndefined($0)) {
return;
}
delete this.drawings[$p0];
(this._complexDrawings).remove($0);
(this._simpleDrawings).remove($0);
$0.$7();
},
$2D: function () {
var $0 = this.$6.getFeatures();
this.$2B($0);
},
$2E: function () {
this.$2F();
this.$2D();
},
$2F: function () {
for (var $0 = 0; $0 < this._complexDrawings.length; ++$0) {
(this._complexDrawings[$0]).$7();
}
this._complexDrawings = new Array(0);
for (var $1 = 0; $1 < this._simpleDrawings.length; ++$1) {
(this._simpleDrawings[$1]).$7();
}
this._simpleDrawings = new Array(0);
this.drawings = {
};
},
$30: function () {
return this.$5;
},
setOrder: function (order) {
RMap._DomHelper.$5(this.$10, order);
RMap._DomHelper.$5(this.$11, order);
},
$31: function () {
return this.$5.getDefaultCoordinateSystem();
},
$32: function () {
return this.$10;
},
$33: function () {
return this.$11;
},
$0: function ($p0) {
if (this.$D) {
return;
}
if (($p0 & 1)) {
this.$13.$A();
return;
}
this.$13.$A();
this.$12.$A();
for (var $0 = 0; $0 < this._complexDrawings.length; ++$0) {
this._complexDrawings[$0].$4($p0);
}
for (var $1 = 0; $1 < this._simpleDrawings.length; ++$1) {
this._simpleDrawings[$1].$4($p0);
}
},
$1: function ($p0, $p1) {
if (this.$D) {
this.$1F = Math.max(this.$1F, $p0);
this.$20 = $p1;
return;
}
var $0 = Delegate.create(this, function ($p1_0) {
($p1_0).$5($p0);
});
if (($p0 & 1)) {
if (this._complexDrawings.length > 0) {
this.$13.$9(this._complexDrawings, $0, null, null);
}
} else {
if (this._complexDrawings.length > 0) {
var $1 = this._simpleDrawings.clone();
($1).addRange(this._complexDrawings);
this.$12.$9($1, $0, null, null);
} else {
this.$12.$9(this._simpleDrawings, $0, null, null);
}
}
},
$34: function ($p0) {
this.$7 = $p0;
},
$35: function () {
return this.$7;
},
beginEdit: function () {
this.$5.beginEdit(this.$4);
},
endEdit: function () {
this.$5.endEdit();
},
$36: function ($p0, $p1) {
var $0;
if (!isNullOrUndefined($p1)) {
var $2 = RMap.CoordinateSystem.$4($p1, this.$5.$39().$E(), this.$6.getSchema().getCoordinateSystem());
if ($p0.getFeature().geometry.getGeometryType() === 3) {
$0 = $2;
} else {
$0 = $p0.getFeature().geometry.$7($2);
}
} else {
$0 = $p0.getFeature().geometry.$7(null);
}
var $1 = RMap.CoordinateSystem.$4($0, this.$6.getSchema().getCoordinateSystem(), this.$5.$39().$E());
if (window.event && window.event.shiftKey) {
this.$5.$41().$1F($1, this, $p0);
} else {
this.$5.$41().$1E($1, this.$6.getSchema().getInfoWindowContent($p0.getFeature()), this, $p0);
}
},
$37: function () {
if (this.$E === 2 && window.navigator.userAgent.indexOf('Chrome') > - 1) {
this.$F += 1;
if (this.$F > 2) {
this.$E = 3;
}
}
if (!this.$E) {
this.$E = 1;
}
if (this.$E === 1 || this.$E === 3) {
this.$39();
}
},
$38: function () {
RMap._DomHelper.$B();
this.$F = 0;
if (this.$E === 1) {
this.$E = 2;
return;
}
this.$39();
},
$39: function () {
var $0 = window.event.srcElement;
this.$3A(this.drawings[$0._id], true);
},
$3A: function ($p0, $p1) {
this.lastSelLoc = null;
if (isNullOrUndefined($p0)) {
return;
}
if (!this.$7) {
var $0 = null;
if ($p1) {
$0 = this.$5.$39().$17(RMap._DomHelper.$9(window.event, this.$5.$4));
}
this.lastSelLoc = $0;
this.$36($p0, $0);
} else {
this.$16.invoke($p0);
}
this.$27(new RMap.StateChangedEventArgs([$p0], 3));
this.$28(new RMap.DrawingEventArgs([$p0], 3));
if (!isNullOrUndefined(this.$9)) {
$p0.updateStyle(4);
this.$24(this, new RMap.CollectionChangedEventArgs([$p0.getFeature()], 33));
}
},
$3B: function ($p0) {
if ($p0.$0 === this && !isNullOrUndefined(this.$9)) {
$p0.updateStyle(4);
this.$24(this, new RMap.CollectionChangedEventArgs([$p0.getFeature()], 33));
}
},
onContextMenu: function () {
var $0 = this.drawings[window.event.srcElement._id];
this.$5.$16['userData'] = {
layer: this,
drawing: $0
};
this.$28(new RMap.DrawingEventArgs([$0], 12));
},
onMouseOver: function () {
var $0 = this.drawings[window.event.srcElement._id];
this.$28(new RMap.DrawingEventArgs([$0], 13));
},
onMouseOut: function () {
var $0 = this.drawings[window.event.srcElement._id];
this.$28(new RMap.DrawingEventArgs([$0], 14));
},
onDblClick: function () {
var $0 = this.drawings[window.event.srcElement._id];
this.$28(new RMap.DrawingEventArgs([$0], 11));
},
$3: function () {
this.$13.$A();
this.$12.$A();
for (var $0 = 0; $0 < this._complexDrawings.length; ++$0) {
(this._complexDrawings[$0]).$7();
}(this._complexDrawings).clear();
for (var $1 = 0; $1 < this._simpleDrawings.length; ++$1) {
(this._simpleDrawings[$1]).$7();
}(this._simpleDrawings).clear();
this.$1E = null;
this.$27(new RMap.StateChangedEventArgs(null, 256));
this.$17 = null;
this.$18 = null;
this.$19 = null;
this.$1A = null;
this.$1B = null;
this.$1C = null;
if (this.$6) {
if (this.$6.getStorage()) {
this.$6.getStorage().remove_ioEvent(this.$21);
this.$23(null, null);
}
this.$6.remove_collectionChangedEvent(Delegate.create(this, this.$24));
if (this.$6.getStorage()) {
this.$6.getStorage().$B(this);
}
}
this.$21 = null;
this.$6 = null;
this.$5 = null;
},
$3C: function () {
return new RMap.DrawingLayer(this.$4, this.$6, this.$8, this.$A);
}
}
RMap.SimpleDrawingLayer = function (id, featureView, styler, config) {
RMap.SimpleDrawingLayer.constructBase(this, [
id,
featureView,
styler,
config
]);
}
RMap.SimpleDrawingLayer.prototype = {
allowHtml: false,
setEditPermissions: function (type) {
this.getFeatureView().getStorage().setEditPermissions(type);
this.getFeatureView().getStorage().setChangeMonitor(true);
},
addMarker: function (id, x, y, dict) {
var $0 = new RMap.Feature(id, new RMap.Geometry(1, [
x,
y
]), dict);
this.$3D($0, dict);
if (dict && dict['style']) {
(this.drawings[id]).setStyle(dict['style']);
(this.drawings[id]).update(33);
}
return this.drawings[id];
},
addPolyline: function (id, coordinates, dict) {
var $0 = new RMap.Feature(id, new RMap.Geometry(2, coordinates), dict);
this.$3D($0, dict);
if (dict && dict['style']) {
(this.drawings[id]).setStyle(dict['style']);
(this.drawings[id]).update(33);
}
return this.drawings[id];
},
addPolygon: function (id, coordinates, dict) {
var $0 = new RMap.Feature(id, new RMap.Geometry(3, coordinates), dict);
this.$3D($0, dict);
if (dict && dict['style']) {
(this.drawings[id]).setStyle(dict['style']);
(this.drawings[id]).update(33);
}
return this.drawings[id];
},
$3D: function ($p0, $p1) {
if (!$p1 || Type.getInstanceType($p1).get_name() !== 'Object') {
$p1 = {
};
}
try {
this.getFeatureView().getStorage().add($p0);
} catch ($0) {
}
if (!isUndefined($p1['title'])) {
$p0.setProperty('title', $p1['title']);
}
if (!isUndefined($p1['description'])) {
$p0.setProperty('description', $p1['description']);
}
if (!isUndefined($p1['content'])) {
$p0.setProperty('content', $p1['content']);
}
if (!isUndefined($p1['image'])) {
$p0.setProperty('image', $p1['image']);
}
if (!isUndefined($p1['link'])) {
$p0.setProperty('link', $p1['link']);
}
},
removeElement: function (drawing) {
if (typeof (drawing) === 'string') {
this.getFeatureView().getStorage().remove(drawing);
} else if (drawing && drawing.getFeature()) {
this.getFeatureView().getStorage().remove(drawing.getFeature().getId());
}
},
clear: function () {
this.getFeatureView().getStorage().clear();
},
$3E: function ($p0) {
var $0 = '';
if ($p0.properties['title']) {
$0 = '<b>' + $p0.properties['title'].toString() + '</b><br>';
}
if ($p0.properties['description']) {
$0 += $p0.properties['description'].toString() + '<br>';
}
if ($p0.properties['content']) {
$0 += $p0.properties['content'].toString() + '<br>';
}
if (!this.allowHtml) {
$0 = RMap._DomHelper.$10($0);
}
if ($p0.properties['image'] && $p0.properties['image'].toString().length > 0) {
var $1 = RMap._DomHelper.$11($p0.properties['image'].toString());
$0 += '<img alt=\'' + $1 + '\' onerror=\'this.style.display=&quot;none&quot;\' onload=\'this.alt=&quot;&quot;\' src=\'' + $1 + '\' height=\'100\'/><br>';
}
if ($p0.properties['link']) {
var $2 = $p0.properties['link'];
var $3 = typeof ($2);
var $4 = RMap._DomHelper.$11(($3 === 'object' && ($2) ['href']) ? ($2) ['href'].toString()  : $2.toString());
var $5 = RMap._DomHelper.$11(($3 === 'object' && ($2) ['text']) ? ($2) ['text'].toString()  : $4);
$0 += '<a href=\'' + $4 + '\' target=\'_blank\'>' + $5 + '</a>';
}
return $0;
},
$3F: function ($p0) {
var $0 = '<br/>';
if ($p0.properties['title']) {
$0 = '<b>' + RMap._DomHelper.$11($p0.properties['title'].toString()) + '</b><br/>';
}
if ($p0.properties['description']) {
$0 += RMap._DomHelper.$11($p0.properties['description'].toString()) + '<br/>';
}
if ($p0.properties['link']) {
var $1 = $p0.properties['link'];
var $2 = typeof ($1);
var $3 = RMap._DomHelper.$11(($2 === 'object' && ($1) ['href']) ? ($1) ['href'].toString()  : $1.toString());
var $4 = RMap._DomHelper.$11(($2 === 'object' && ($1) ['text']) ? ($1) ['text'].toString()  : $3);
$0 += '<a href=\'' + $3 + '\' target=\'_blank\'>' + $4 + '</a><br/>';
}
return $0.substring(0, $0.length - 5);
}
}
RMap.CanvasLayer = function (id, featureView, styler, config) {
this.$7 = 0;
this.drawings = {
};
this.$14 = new RMap._TimeoutInvoker();
this.$15 = new RMap._TimeoutInvoker();
RMap.CanvasLayer.constructBase(this);
this.$4 = id;
this.$6 = featureView;
this.$6.getStorage().$A(this);
if (styler) {
this.$8 = (Type.canCast(styler, RMap.Styler)) ? styler : new RMap.CustomStyler(styler);
}
this.$A = config;
if (this.$A) {
if (config['selstyler']) {
this.$9 = (Type.canCast(config['selstyler'], RMap.Styler)) ? config['selstyler'] : new RMap.CustomStyler(config['selstyler']);
}
if (this.$A['enableMouseOver']) {
this.$B = true;
}
if (this.$A['enableDblClick']) {
this.$C = true;
}
}
if (isNullOrUndefined(this.$A)) {
this.$A = {
};
}
this.$D = false;
this.$1D = 0;
this.$1E = null;
this.$19 = Delegate.create(this, this.$38);
this.$1A = Delegate.create(this, this.onImgLoaded);
this.$11 = Delegate.create(this, this.$31);
this.$1F = Delegate.create(this, this.$22);
if (featureView && featureView.getStorage()) {
featureView.getStorage().add_ioEvent(this.$1F);
}
}
RMap.CanvasLayer.prototype = {
$4: null,
$5: null,
$6: null,
$8: null,
$9: null,
$A: null,
$B: false,
$C: false,
$D: false,
$E: 0,
$F: 0,
$10: 0,
$11: null,
$12: null,
$13: null,
lastSelLoc: null,
add_collectionChangedEvent: function (value) {
this.$16 = Delegate.combine(this.$16, value);
},
remove_collectionChangedEvent: function (value) {
this.$16 = Delegate.remove(this.$16, value);
},
$16: null,
add_stateChangedEvent: function (value) {
this.$17 = Delegate.combine(this.$17, value);
},
remove_stateChangedEvent: function (value) {
this.$17 = Delegate.remove(this.$17, value);
},
$17: null,
add_editDrawingEvent: function (value) {
this.$18 = Delegate.combine(this.$18, value);
},
remove_editDrawingEvent: function (value) {
this.$18 = Delegate.remove(this.$18, value);
},
$18: null,
$19: null,
$1A: null,
add_$1B: function ($p0) {
this.$1C = Delegate.combine(this.$1C, $p0);
},
remove_$1B: function ($p0) {
this.$1C = Delegate.remove(this.$1C, $p0);
},
$1C: null,
$1D: 0,
$1E: null,
$1F: null,
$20: false,
$2: function ($p0) {
this.$5 = $p0;
this.$12 = document.createElement('canvas');
this.$12.style.position = 'absolute';
this.$32();
this.$12.unselectable = 'on';
if (!this.$12 || !this.$12.getContext) {
this.$20 = false;
this.$13 = null;
} else {
this.$20 = true;
this.$5.$A.appendChild(this.$12);
this.$13 = this.$12.getContext('2d');
this.$12.attachEvent('onclick', this.$19);
this.$2B();
}
this.$6.add_collectionChangedEvent(Delegate.create(this, this.$23));
},
getId: function () {
return this.$4;
},
getFeatureView: function () {
return this.$6;
},
setStyler: function (styler) {
this.$8 = (Type.canCast(styler, RMap.Styler)) ? styler : new RMap.CustomStyler(styler);
this.$23(this, new RMap.CollectionChangedEventArgs(this.$6.getStorage().getFeatures(), 33));
},
$21: function ($p0) {
if (this.$9 && this.$5.$41().$7 === $p0) {
return this.$9.getStyle($p0);
}
if (this.$8) {
return this.$8.getStyle($p0);
}
if (!isNullOrUndefined($p0.getStyle())) {
return $p0.getStyle();
}
return RMap.MapApplication.geDefaultStyle($p0);
},
isHidden: function () {
return this.$D;
},
hide: function () {
if (this.$D) {
return;
}
this.$12.style.visibility = 'hidden';
this.$D = true;
this.$26(new RMap.StateChangedEventArgs(null, 1));
},
show: function () {
if (!this.$D) {
return;
}
this.$D = false;
if (this.$1D) {
this.$0(this.$1D);
this.$1(this.$1D, this.$1E);
this.$1E = 0;
}
this.$12.style.visibility = '';
this.$26(new RMap.StateChangedEventArgs(null, 2));
},
$22: function ($p0, $p1) {
if (this.$5) {
this.$5.$31(this.$4, ($p1 && ($p1.action === 4 || $p1.action === 1)));
}
},
$23: function ($p0, $p1) {
switch ($p1.action) {
case 1:
var $enum1 = $p1.items.getEnumerator();
while ($enum1.moveNext()) {
var $0 = $enum1.get_current();
this.$29($0);
}
break;
case 3:
this.$2D();
break;
case 2:
this.$2C();
break;
default:
this.$2C();
break;
}
this.$25($p1);
},
$24: function ($p0, $p1) {
switch ($p1.action) {
case 1:
this.hide();
break;
case 2:
this.show();
break;
}
this.$26($p1);
},
$25: function ($p0) {
if (this.$16) {
this.$16.invoke(this, $p0);
}
},
$26: function ($p0) {
if (this.$17) {
this.$17.invoke(this, $p0);
}
},
attachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'drawing') {
this.add_$1B(handler);
}
},
detachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'drawing') {
this.remove_$1B(handler);
}
},
$27: function ($p0) {
if (this.$1C) {
this.$1C.invoke(this, $p0);
}
},
$28: function ($p0) {
var $0 = this.$21($p0);
var $1 = this.drawings[$0.iconSrc];
if (!$1) {
$1 = document.createElement('img');
$1.id = $0.iconSrc;
$1.attachEvent('onload', this.$1A);
$1.attachEvent('onerror', this.$1A);
$1.attachEvent('onabort', this.$1A);
$1.src = $0.iconSrc;
this.drawings[$0.iconSrc] = $1;
} else {
try {
var $2 = this.$5.$39();
var $3 = RMap.CoordinateSystem.$5($p0.geometry, $p0.$7(), $2.$E());
var $4 = $2.$16($3.getCoordinates(), 0, 2);
if ($0.iconSize) {
if ($0.anchor) {
this.$13.drawImage($1, this.$E + $4[0] - $0.anchor.left, this.$F + $4[1] - $0.anchor.top, $0.iconSize.width, $0.iconSize.height);
} else {
this.$13.drawImage($1, this.$E + $4[0], this.$F + $4[1], $0.iconSize.width, $0.iconSize.height);
}
} else {
this.$13.drawImage($1, this.$E + $4[0], this.$F + $4[1]);
}
} catch ($5) {
}
}
},
$29: function ($p0) {
if (!this.$20) {
return;
}
if ($p0.geometry.getGeometryType() === 1 && !this.$A['forceShape']) {
this.$28($p0);
} else {
}
},
$2A: function ($p0) {
if (!this.$20 || !$p0.length) {
return;
}
for (var $0 = 0; $0 < $p0.length; ++$0) {
if ($p0[$0].geometry.getGeometryType() === 1 && !this.$A['forceShape']) {
this.$28($p0[$0]);
} else {
}
}
},
$2B: function () {
var $0 = this.$6.getFeatures();
this.$2A($0);
},
$2C: function () {
this.$2D();
this.$2B();
},
$2D: function () {
this.$33();
},
$2E: function () {
return this.$5;
},
setOrder: function (order) {
RMap._DomHelper.$5(this.$12, order);
},
$2F: function () {
return this.$5.getDefaultCoordinateSystem();
},
$30: function () {
return this.$12;
},
$0: function ($p0) {
if (this.$D) {
return;
}
if (($p0 & 1)) {
this.$15.$A();
return;
} else {
this.$32();
}
this.$15.$A();
this.$14.$A();
this.$33();
},
$1: function ($p0, $p1) {
if (this.$D) {
this.$1D = Math.max(this.$1D, $p0);
this.$1E = $p1;
return;
}
if (($p0 & 1)) {
var $0 = Math.abs(this.$12.offsetLeft + this.$5.$39().$6.dx + this.$5.$4.offsetWidth) > 1.5 * this.$5.$4.offsetWidth || Math.abs(this.$12.offsetTop + this.$5.$39().$6.dy + this.$5.$4.offsetHeight) > 1.5 * this.$5.$4.offsetHeight;
window.clearTimeout(this.$10);
this.$10 = window.setTimeout(this.$11, ($0) ? 100 : 500);
} else {
window.clearTimeout(this.$10);
this.$10 = window.setTimeout(this.$11, 250);
}
},
$31: function () {
window.clearTimeout(this.$10);
this.$32();
this.$2B();
},
$32: function () {
var $0 = Math.round(this.$5.$4.offsetWidth);
var $1 = Math.round(this.$5.$4.offsetHeight);
var $2 = this.$5.$39().$6.dx + $0;
var $3 = this.$5.$39().$6.dy + $1;
this.$12.style.left = - $2 + 'px';
this.$12.style.top = - $3 + 'px';
this.$12.style.width = $0 * 3 + 'px';
this.$12.style.height = $1 * 3 + 'px';
this.$12.width = $0 * 3;
this.$12.height = $1 * 3;
this.$E = $2;
this.$F = $3;
},
$33: function () {
if (!this.$20) {
return;
}
this.$13.clearRect(0, 0, this.$12.offsetWidth, this.$12.offsetHeight);
this.$12.width = this.$12.width;
},
$34: function ($p0) {
this.$7 = $p0;
},
$35: function () {
return this.$7;
},
$36: function ($p0, $p1) {
if (window.event && window.event.shiftKey) {
this.$5.$41().$1F($p1, null, null);
} else {
this.$5.$41().$1E($p1, this.$6.getSchema().getInfoWindowContent($p0), null, null);
}
},
$37: function ($p0, $p1) {
var $0 = this.$5.$39();
var $1 = this.$6.getFeatures();
var $2 = null;
try {
for (var $3 = $1.length - 1; $3 >= 0; $3--) {
var $4 = this.$21($1[$3]);
var $5 = RMap.CoordinateSystem.$5($1[$3].geometry, $1[$3].$7(), $0.$E());
var $6 = $0.$16($5.getCoordinates(), 0, 2);
if ($4.iconSize) {
if ($4.anchor) {
if ($p0 >= this.$E + $6[0] - $4.anchor.left && $p0 <= this.$E + $6[0] - $4.anchor.left + $4.iconSize.width && $p1 >= this.$F + $6[1] - $4.anchor.top && $p1 <= this.$F + $6[1] - $4.anchor.top + $4.iconSize.height) {
$2 = $1[$3];
break;
}
} else {
if ($p0 >= this.$E + $6[0] && $p0 <= this.$E + $6[0] + $4.iconSize.width && $p1 >= this.$F + $6[1] && $p1 <= this.$F + $6[1] + $4.iconSize.height) {
$2 = $1[$3];
break;
}
}
} else {
var $7 = this.drawings[$4.iconSrc];
if ($7 && $p0 >= this.$E + $6[0] && $p0 <= this.$E + $6[0] + $7.offsetWidth && $p1 >= this.$F + $6[1] && $p1 <= this.$F + $6[1] + $7.offsetHeight) {
$2 = $1[$3];
break;
}
}
}
} catch ($8) {
}
return $2;
},
$38: function () {
var $0 = RMap._DomHelper.$9(window.event, this.$12);
var $1 = this.$13.getImageData($0.left, $0.top, 1, 1);
if ($1 && ($1.data) [3] > 0) {
RMap._DomHelper.$B();
var $2 = this.$37($0.left, $0.top);
if ($2) {
this.$39($2, true);
}
}
},
$39: function ($p0, $p1) {
this.lastSelLoc = null;
if (isNullOrUndefined($p0)) {
return;
}
if (!this.$7) {
var $0 = null;
if ($p1) {
$0 = this.$5.$39().$17(RMap._DomHelper.$9(window.event, this.$5.$4));
}
this.lastSelLoc = $0;
this.$36($p0, $0);
}
this.$26(new RMap.StateChangedEventArgs([$p0], 3));
this.$27(new RMap.DrawingEventArgs([$p0], 3));
},
onImgLoaded: function () {
window.event.srcElement._isRMAPComplete = true;
var $0 = true;
var $dict1 = this.drawings;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
if (!$1.value._isRMAPComplete) {
$0 = false;
break;
}
}
if ($0) {
window.clearTimeout(this.$10);
this.$10 = window.setTimeout(this.$11, 100);
}
},
$3: function () {
this.$15.$A();
this.$14.$A();
window.clearTimeout(this.$10);
this.$11 = null;
this.drawings = null;
this.$1C = null;
this.$26(new RMap.StateChangedEventArgs(null, 256));
this.$12.detachEvent('onclick', this.$19);
this.$19 = null;
var $dict1 = this.drawings;
for (var $key2 in $dict1) {
var $0 = {
key: $key2,
value: $dict1[$key2]
};
($0.value).detachEvent('onload', this.$1A);
($0.value).detachEvent('onerror', this.$1A);
($0.value).detachEvent('onabort', this.$1A);
this.drawings[$0.key] = null;
}
this.$1A = null;
if (this.$6) {
if (this.$6.getStorage()) {
this.$6.getStorage().remove_ioEvent(this.$1F);
this.$22(null, null);
}
this.$6.remove_collectionChangedEvent(Delegate.create(this, this.$23));
if (this.$6.getStorage()) {
this.$6.getStorage().$B(this);
}
}
this.$1F = null;
this.$6 = null;
this.$5 = null;
},
$3A: function () {
return new RMap.CanvasLayer(this.$4, this.$6, this.$8, this.$A);
}
}
RMap.Envelope = function (minX, minY, maxX, maxY) {
this.minX = minX;
this.minY = minY;
this.maxX = maxX;
this.maxY = maxY;
}
RMap.Envelope.prototype = {
minX: 0,
minY: 0,
maxX: 0,
maxY: 0,
inflate: function (dx, dy) {
this.minX -= dx;
this.minY -= dy;
this.maxX += dx;
this.maxY += dy;
},
clone: function () {
return new RMap.Envelope(this.minX, this.minY, this.maxX, this.maxY);
}
}
RMap.Geometry = function (type, coordinates) {
this.$0 = type;
this.$1 = coordinates;
this.$2 = null;
this.$3(this.$1);
}
RMap.Geometry.prototype = {
$0: 0,
$1: null,
$2: null,
$3: function ($p0) {
if ($p0.length % 2) {
throw new Error('invalid arguments');
}
if (this.$0 === 2 && $p0.length < 4) {
throw new Error('invalid arguments');
} else if (this.$0 === 3 && $p0.length < 6) {
throw new Error('invalid arguments');
} else if (this.$0 === 4 && ($p0.length < 8 || $p0.length % 6 !== 2)) {
throw new Error('invalid arguments');
}
},
getGeometryType: function () {
return this.$0;
},
getEnvelope: function () {
if (!this.$2) {
this.$2 = RMap._GeometryOperation.$4(this.$1);
}
return this.$2;
},
getCoordinates: function () {
return this.$1;
},
setCoordinates: function (coordinates) {
this.$3(coordinates);
this.$1 = coordinates;
this.$2 = null;
},
$4: function ($p0) {
this.getEnvelope();
return $p0.minX < this.$2.maxX && $p0.maxX > this.$2.minX && $p0.minY < this.$2.maxY && $p0.maxY > this.$2.minY;
},
$5: function ($p0) {
this.getEnvelope();
return this.$2.minX > $p0.minX && this.$2.maxX < $p0.maxX && this.$2.minY > $p0.minY && this.$2.maxY < $p0.maxY;
},
$6: function () {
return (this.$0 === 4) ? 6 : 2;
},
$7: function ($p0) {
if (!$p0) {
return RMap.$create_Coordinate(this.$1[0], this.$1[1]);
}
if (this.$0 === 2) {
var $0 = Number.MAX_VALUE;
var $1 = 0;
for (var $2 = 2; $2 < this.$1.length; $2 += 2) {
var $3 = Math.pow($p0.x - this.$1[$2], 2) + Math.pow($p0.y - this.$1[$2 + 1], 2);
if ($3 < $0) {
$0 = $3;
$1 = $2;
}
}
return RMap.$create_Coordinate(this.$1[$1], this.$1[$1 + 1]);
}
return RMap.$create_Coordinate(this.$1[0], this.$1[1]);
},
$8: function () {
return new RMap.Geometry(this.$0, this.$1.clone());
}
}
RMap._KeyboardTool = function (map) {
this.$5 = RMap.$create_Vector(0, 0);
this.$0 = map;
this.$1 = Delegate.create(this, this.$A);
this.$2 = Delegate.create(this, this.$B);
this.$3 = Delegate.create(this, this.$C);
}
RMap._KeyboardTool.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: false,
$6: 20,
$7: function () {
this.$9();
this.$1 = null;
this.$2 = null;
this.$3 = null;
this.$0 = null;
},
$8: function () {
if (this.$4) {
return;
}
this.$0.$D.tabIndex = 0;
this.$0.$D.attachEvent('onkeydown', this.$1);
this.$0.$D.attachEvent('onkeyup', this.$2);
this.$0.$D.attachEvent('onblur', this.$3);
this.$4 = true;
},
$9: function () {
if (!this.$4) {
return;
}
this.$0.$D.detachEvent('onkeydown', this.$1);
this.$0.$D.detachEvent('onkeyup', this.$2);
this.$0.$D.detachEvent('onblur', this.$3);
this.$4 = false;
},
$A: function () {
RMap._DomHelper.$B();
switch (window.event.keyCode) {
case 32:
this.$0.$7.style.visibility = 'hidden';
break;
case 37:
this.$5.dx = - this.$6;
break;
case 38:
this.$5.dy = this.$6;
break;
case 39:
this.$5.dx = this.$6;
break;
case 40:
this.$5.dy = - this.$6;
break;
case 107:
case 187:
case 61:
case 43:
this.$5.dx = 0;
this.$5.dy = 0;
this.$0.zoomIn(1);
break;
case 109:
case 189:
this.$5.dx = 0;
this.$5.dy = 0;
this.$0.zoomOut(1);
break;
default:
break;
}
if (!this.$0.$22) {
return;
}
if (!this.$5.dx && !this.$5.dy) {
this.$0.$4E();
} else {
var $0 = Math.min(50, this.$0.$12.$11().width / 20);
if (window.event.ctrlKey) {
$0 = 2;
}
this.$5.dx = (this.$5.dx < 0) ? Math.max( - $0, this.$5.dx)  : Math.min($0, this.$5.dx);
this.$5.dy = (this.$5.dy < 0) ? Math.max( - $0, this.$5.dy)  : Math.min($0, this.$5.dy);
this.$0.$4D(this.$5, - 1);
}
},
$B: function () {
RMap._DomHelper.$B();
switch (window.event.keyCode) {
case 32:
this.$0.$7.style.visibility = '';
break;
case 37:
this.$5.dx = 0;
break;
case 38:
this.$5.dy = 0;
break;
case 39:
this.$5.dx = 0;
break;
case 40:
this.$5.dy = 0;
break;
}
if (!this.$0.$22) {
return;
}
if (!this.$5.dx && !this.$5.dy) {
this.$0.$4E();
}
},
$C: function () {
RMap._DomHelper.$B();
}
}
RMap.Map = function () {
this.$16 = {
};
this.$17 = [
];
this.$19 = [
];
this.$1A = [
];
this.layers = {
};
this.controls = {
};
this.$35 = new Array(0);
this.$4A = RMap.$create_Vector(0, 0);
}
RMap.Map.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: null,
$8: null,
$9: null,
$A: null,
$B: null,
$C: null,
$D: null,
$E: null,
$F: null,
$10: null,
$11: 0,
$12: null,
$13: 0,
$14: 0,
$15: 0,
$18: null,
$1B: null,
$1C: null,
$1D: null,
$1E: 0,
$1F: null,
$20: null,
$21: true,
$22: true,
$23: true,
$24: null,
$25: null,
add_$26: function ($p0) {
this.$27 = Delegate.combine(this.$27, $p0);
},
remove_$26: function ($p0) {
this.$27 = Delegate.remove(this.$27, $p0);
},
$27: null,
add_$28: function ($p0) {
this.$29 = Delegate.combine(this.$29, $p0);
},
remove_$28: function ($p0) {
this.$29 = Delegate.remove(this.$29, $p0);
},
$29: null,
add_$2A: function ($p0) {
this.$2B = Delegate.combine(this.$2B, $p0);
},
remove_$2A: function ($p0) {
this.$2B = Delegate.remove(this.$2B, $p0);
},
$2B: null,
$2C: null,
$2D: 'RMap infrastructure, &copy www.realis.si',
initialize: function (container, config) {
this.$2 = container;
this.$3 = RMap._DomHelper.$3(this.$2);
this.$3.style.position = 'relative';
this.$3.id = this.$2.id + '-internal';
this.$3.style.display = '';
this.$3.className = 'Map';
this.$3.style.width = '100%';
this.$3.style.height = '100%';
this.$3.style.overflow = 'hidden';
this.$4 = RMap._DomHelper.$3(this.$3);
this.$4.style.display = '';
this.$4.style.width = '100%';
this.$4.style.height = '100%';
if (!isNullOrUndefined(config) && !isNullOrUndefined(config['mapSettings'])) {
this.$0 = config['mapSettings'];
} else {
this.$0 = RMap.MapApplication.getDefaultMapSetting();
}
var $0 = 0;
this.$15 = - 1;
var $1 = null;
if (!isNullOrUndefined(config)) {
if (!isNullOrUndefined(config['center']) && (config['center']).length === 2) {
$1 = RMap.$create_Coordinate((config['center']) [0], (config['center']) [1]);
}
if (!isNullOrUndefined(config['defaultCenter']) && (config['defaultCenter']).length === 2) {
this.$0.defaultCenter = RMap.$create_Coordinate((config['defaultCenter']) [0], (config['defaultCenter']) [1]);
}
if (this.$0.defaultMetersPerUnit > 0) {
config['defaultZoomLevel'] = this.$0.getBestZoomLevel((parseFloat(this.$0.defaultMetersPerUnit) + 'm'));
config['zoomLevel'] = config['defaultZoomLevel'];
}
if (!isNullOrUndefined(config['zoomLevel'])) {
this.$15 = this.$2F(config['zoomLevel']);
}
if (!isNullOrUndefined(config['defaultZoomLevel'])) {
this.$0.defaultZoomLevel = this.$2F(config['defaultZoomLevel']);
}
if (!isNullOrUndefined(config['detailZoomLevel'])) {
this.$0.detailZoomLevel = this.$2F(config['detailZoomLevel']);
}
if (!isNullOrUndefined(config['theme']) && this.$0.$0) {
for (var $4 = 0; $4 < this.$0.$0.length; $4++) {
if (this.$0.$0[$4].label.toLowerCase() === config['theme'].toString().toLowerCase()) {
$0 = $4;
}
}
}
}
if (isNullOrUndefined(this.$0.defaultZoomLevel)) {
this.$0.defaultZoomLevel = this.$0.zoomLevels.length - 1;
}
if (isNullOrUndefined(this.$0.detailZoomLevel)) {
this.$0.detailZoomLevel = 0;
}
if (!this.$0.$0) {
this.$0.$0 = [
];
}
this.$17.addRange(this.$0.$0);
this.$6 = RMap._DomHelper.$3(this.$4);
this.$6.className = 'TileSurface';
this.$5 = document.createElement('div');
this.$5.style.position = 'absolute';
this.$5.style.left = '0px';
this.$5.style.top = '0px';
this.$5.style.width = '100%';
this.$5.style.height = '100%';
this.$5.style.backgroundColor = '#ffffff';
this.$5.style.filter = 'alpha(opacity=1)';
this.$5.style.opacity = '0.0';
this.$5.style.MozOpacity = 0;
this.$5.className = 'RMapNonPrintable';
this.$4.appendChild(this.$5);
this.$7 = RMap._DomHelper.$3(this.$4);
this.$8 = RMap._DomHelper.$3(this.$7);
this.$9 = this.$8;
if (!ScriptFX.Application.current.get_isIE()) {
try {
this.$9 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'svg');
this.$9.style.position = 'absolute';
this.$9.style.display = 'block';
this.$8.appendChild(this.$9);
} catch ($5) {
}
}
this.$A = RMap._DomHelper.$3(this.$7);
this.$B = RMap._DomHelper.$3(this.$4);
this.$E = document.createElement('div');
this.$E.style.position = 'absolute';
this.$E.style.left = '0px';
this.$E.style.top = '0px';
this.$E.style.width = '100%';
this.$E.style.height = '100%';
this.$E.style.backgroundColor = '#ffffff';
this.$E.style.filter = 'alpha(opacity=1)';
this.$E.style.opacity = '0.0';
this.$E.style.MozOpacity = 0;
this.$C = this.$3;
this.$C.style.cursor = RMap.Browser.crsPointer;
this.$D = this.$3;
this.$1F = new RMap._InfoWindow();
this.$1F.$2(this);
this.$20 = new RMap._ContexMenu();
this.$20.$B(this);
this.$13 = 0;
this.$14 = this.$0.zoomLevels.length - 1;
if (this.$15 === - 1) {
this.$15 = this.$0.defaultZoomLevel;
}
if (!this.$0.tileMapCoordinateSystem) {
this.$0.tileMapCoordinateSystem = this.$0.defaultCoordinateSystem;
}
var $2 = this.$0.tileMapCoordinateSystem;
if (!$1) {
$1 = RMap.$create_Coordinate(this.$0.defaultCenter.x, this.$0.defaultCenter.y);
}
var $3 = RMap.CoordinateSystem.$4($1, this.$0.defaultCoordinateSystem, $2);
this.$12 = new RMap._View(this, $2, $3, this.$0.zoomLevels[this.$15], ScriptFX.UI.$create_Size(this.$4.clientWidth, this.$4.clientHeight));
this.$33(Math.round(this.$12.$6.dx) + 'px', Math.round(this.$12.$6.dy) + 'px');
this.$2C = Delegate.create(this, this.dispose);
if (isNullOrUndefined(config) || !config['preventUnload']) {
window.attachEvent('onunload', this.$2C);
}
this.$3E($0, false);
this.$1C = new RMap._KeyboardTool(this);
this.$1D = new RMap._MouseTool(this);
this.$F = document.createElement('div');
this.$F.style.position = 'absolute';
this.$F.style.fontFamily = 'arial';
this.$F.style.fontSize = '10px';
this.$F.style.left = '1px';
this.$F.style.bottom = '1px';
this.$2E((isNullOrUndefined(config)) ? '' : config['cprAppending']);
this.$C.appendChild(this.$F);
this.enableMouse();
this.enableKeyboard();
if (config.autoResize) {
this.$3B();
}
if (this.$0.failed) {
return false;
}
return true;
},
$2E: function ($p0) {
this.$F.innerHTML = this.$2D + ((isNullOrUndefined($p0)) ? '' : $p0);
},
$2F: function ($p0) {
if ($p0 < 0) {
$p0 = 0;
}
if ($p0 > this.$0.zoomLevels.length - 1) {
$p0 = this.$0.zoomLevels.length - 1;
}
if ($p0.toString().endsWith('m')) {
$p0 = this.$0.getBestZoomLevel($p0);
}
return $p0;
},
$30: function ($p0) {
var $0 = false;
for (var $1 = 0; $1 < this.$1A.length; $1++) {
$0 = ((this.$1A[$1]).$29($p0)) || $0;
}
return $0;
},
setBusyIndicator: function (ctrl) {
this.$10 = ctrl;
},
$31: function ($p0, $p1) {
if (this.$10) {
this.$10.notifyBusy($p0, $p1);
}
},
dispose: function () {
window.clearTimeout(this.$49);
window.detachEvent('onunload', this.$2C);
this.$2C = null;
if (this.$1F) {
this.$1F.$3();
this.$1F = null;
}
if (this.$20) {
this.$20.$C();
this.$20 = null;
}
if (this.$1D) {
this.$1D.$1B();
this.$1D = null;
}
if (this.$1C) {
this.$1C.$7();
this.$1C = null;
}
if (this.$1A) {
for (var $0 = this.$1A.length - 1; $0 >= 0; --$0) {
(this.$1A[$0]).$3();
}
this.$1A.clear();
this.$1A = null;
}
if (this.$19) {
for (var $1 = this.$19.length - 1; $1 >= 0; --$1) {
(this.$19[$1]).$3();
}
this.$19.clear();
this.$19 = null;
}
},
$32: function () {
this.$C.removeChild(this.$F);
},
$33: function ($p0, $p1) {
this.$6.style.left = $p0;
this.$6.style.top = $p1;
this.$8.style.left = $p0;
this.$8.style.top = $p1;
this.$A.style.left = $p0;
this.$A.style.top = $p1;
this.$1F.$0(1);
this.$B.style.left = $p0;
this.$B.style.top = $p1;
this.$1F.$1(1, null);
this.$34();
},
$34: function () {
if (ScriptFX.Application.current.get_isIE()) {
return;
}
var $0 = this.$12.$13();
$0.inflate(512, 512);
var $1 = Math.round($0.minX);
var $2 = Math.round($0.minY);
var $3 = Math.round($0.maxX - $0.minX);
var $4 = Math.round($0.maxY - $0.minY);
try {
this.$9.setAttribute('viewBox', $1 + ' ' + $2 + ' ' + $3 + ' ' + $4);
this.$9.style.left = $1 + 'px';
this.$9.style.top = $2 + 'px';
this.$9.setAttribute('width', $3 + 'px');
this.$9.setAttribute('height', $4 + 'px');
} catch ($5) {
}
},
getDefaultZoomLevel: function () {
return this.$0.defaultZoomLevel;
},
getDetailZoomLevel: function () {
return this.$0.detailZoomLevel;
},
getUpp: function (meters) {
return (meters) ? this.$12.$1A()  : this.$12.$10();
},
changeSettings: function (settings) {
this.$50(4);
this.$0 = settings;
this.$17.clear();
for (var $4 = this.$19.length - 1; $4 >= 0; --$4) {
(this.$19[$4]).$3();
}
this.$19.clear();
var $0 = RMap.CoordinateSystem.getCoordinateSystem(this.$0.$0[0].$0[0].$0);
var $1 = this.$12.$1A();
var $2 = RMap.CoordinateSystem.$4(this.$12.$F(), this.$12.$E(), $0);
var $3 = RMap.CoordinateSystem.$2($0, $2.x, $2.y, $1);
this.$15 = this.$0.getBestZoomLevel($3);
this.$13 = 0;
this.$14 = this.$0.zoomLevels.length - 1;
this.$12 = new RMap._View(this, $0, $2, this.$0.zoomLevels[this.$15], ScriptFX.UI.$create_Size(this.$4.clientWidth, this.$4.clientHeight));
this.$4C();
this.$17.addRange(this.$0.$0);
this.$18 = null;
this.$3E(0, false);
this.$51(4, null);
this.$36(4);
},
getControlsSurface: function () {
return this.$C;
},
addControl: function (control, style) {
var $0 = control.attach(this);
var $1 = $0.style;
if (!isNullOrUndefined(style)) {
var $dict1 = style;
for (var $key2 in $dict1) {
var $3 = {
key: $key2,
value: $dict1[$key2]
};
$1[$3.key] = $3.value;
}
}
var $2 = control._id;
if (String.isNullOrEmpty($2)) {
$2 = Date.get_now().getTime() + '_' + Math.random();
}
this.controls[$2] = control;
},
removeControl: function (control) {
if ((this.$35).remove(control)) {
control.detach();
}
},
addClipping: function (bbox, cfg) {
if (!this.$1B) {
this.$1B = new RMap._Clipping(bbox, cfg);
this.$1B.$9(this);
}
},
enableAnimation: function () {
this.$21 = true;
},
disableAnimation: function () {
this.$21 = false;
},
enablePan: function () {
this.$22 = true;
this.$C.style.cursor = RMap.Browser.crsPointer;
},
disablePan: function () {
this.$22 = false;
this.$C.style.cursor = 'default';
},
enableZoom: function () {
this.$23 = true;
},
disableZoom: function () {
this.$23 = false;
},
enableKeyboard: function () {
if (this.$1C) {
this.$1C.$8();
}
},
disableKeyboard: function () {
this.$1C.$9();
},
enableMouse: function () {
this.$1D.$1C();
},
disableMouse: function () {
this.$1D.$1D();
},
setOpacity: function (opacity) {
this.$5.style.filter = 'alpha(opacity = ' + opacity + ')';
this.$5.style.opacity = (opacity / 100).toString();
this.$5.style.MozOpacity = opacity / 100;
},
setGrayscale: function (g) {
this.$6.style.filter = '';
this.$6.style.filter = 'grayscale(' + g + '%)';
if (g >= 50) {
this.$6.style.filter = 'gray';
}
this.$6.style.MozFilter = 'grayscale(' + g + '%)';
this.$6.style.webkitFilter = 'grayscale(' + g + '%)';
this.$6.style.MsFilter = 'grayscale(' + g + '%)';
},
attachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'mouse' && this.$1D) {
this.$1D.add_$17(handler);
} else if (name === 'mousemove' && this.$1D) {
this.$1D.add_$19(handler);
} else if (name === 'view') {
this.add_$26(handler);
} else if (name === 'theme') {
this.add_$28(handler);
} else if (name === 'message') {
RMap.Messages.add_$0(handler);
}
},
detachEvent: function (name, handler) {
name = name.toLowerCase();
if (name === 'mouse' && this.$1D) {
this.$1D.remove_$17(handler);
} else if (name === 'mousemove' && this.$1D) {
this.$1D.remove_$19(handler);
} else if (name === 'view') {
this.remove_$26(handler);
} else if (name === 'theme') {
this.remove_$28(handler);
} else if (name === 'message') {
RMap.Messages.remove_$0(handler);
}
},
$36: function ($p0) {
if (!this.$27) {
return;
}
this.$27.invoke(this, new RMap._ViewChangeEventArgs($p0));
},
$37: function () {
if (!this.$29) {
return;
}
this.$29.invoke(this, EventArgs.Empty);
},
$38: function ($p0) {
if (!this.$2B) {
return;
}
this.$2B.invoke(this, $p0);
},
$39: function () {
return this.$12;
},
getDefaultCoordinateSystem: function () {
return this.$0.defaultCoordinateSystem;
},
setView: function (x, y, zoomLevel, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
this.setCenter(x, y, coordinateSystem);
this.setZoomLevel(zoomLevel);
},
setViewByUpp: function (x, y, upp, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
this.setCenter(x, y, coordinateSystem);
this.setZoom(upp);
},
setDefaultView: function () {
this.setView(this.$0.defaultCenter.x, this.$0.defaultCenter.y, this.$0.defaultZoomLevel, this.$0.defaultCoordinateSystem);
},
setCenter: function (x, y, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
if (isNullOrUndefined(coordinateSystem)) {
coordinateSystem = this.getDefaultCoordinateSystem();
}
var $0 = RMap.$create_Coordinate(x, y);
if (coordinateSystem !== this.$12.$E() && !RMap.CoordinateSystem.$3($0, coordinateSystem)) {
return;
}
var $1 = RMap.CoordinateSystem.$4($0, coordinateSystem, this.$12.$E());
this.$50(1);
var $2 = this.$12.$7($1.x, $1.y);
this.$51(1, $2);
},
getCenter: function () {
return RMap.CoordinateSystem.$4(this.$12.$F(), this.$12.$E(), this.getDefaultCoordinateSystem());
},
panPixels: function (dx, dy) {
if (!this.$22) {
return;
}
this.$50(1);
var $0 = this.$12.$B(dx, dy);
this.$51(1, $0);
},
$3A: function ($p0) {
if (!this.$23) {
return;
}
this.$50(2);
if (this.$25) {
this.$24 = this.$12.$9($p0, this.$25);
} else {
this.$12.$8($p0);
}
this.$51(2, null);
this.$25 = null;
this.$24 = null;
},
getZoomLevel: function () {
return this.$15;
},
setZoomLevel: function (zoomLevel) {
if (zoomLevel < this.$13) {
zoomLevel = this.$13;
} else if (zoomLevel > this.$14) {
zoomLevel = this.$14;
}
if (zoomLevel === this.$15) {
this.$25 = null;
this.$24 = null;
return;
}
this.$15 = zoomLevel;
if (this.$15 >= this.$0.zoomLevels.length) {
this.$3A(this.$0.zoomLevels[this.$0.zoomLevels.length - 1] * (this.$15 - (this.$0.zoomLevels.length - 1)) * 2);
} else if (this.$15 < 0) {
this.$3A(this.$0.zoomLevels[0] / (0 - this.$15) / 2);
} else {
this.$3A(this.$0.zoomLevels[this.$15]);
}
},
setZoom: function (upp) {
if (upp <= 0) {
return;
}
var $0 = RMap.MapApplication.tileTreshold;
var $1 = - 1;
var $2 = - 1;
for (var $3 = 0; $3 < this.$0.zoomLevels.length; $3++) {
var $4 = upp - this.$0.zoomLevels[$3];
$4 = ($4 > 0) ? $4 / (2 * $0)  : - $4 * (2 * $0);
if ($4 < $2 || $2 === - 1) {
$2 = $4;
$1 = $3;
}
}
this.$15 = $1;
this.$3A(upp);
},
zoomToLocation: function (zoomLevel, x, y, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
if (isNullOrUndefined(coordinateSystem)) {
coordinateSystem = this.getDefaultCoordinateSystem();
}
var $0 = RMap.$create_Coordinate(x, y);
if (!RMap.CoordinateSystem.$3($0, coordinateSystem)) {
return;
}
this.$25 = RMap.CoordinateSystem.$4($0, coordinateSystem, this.$12.$E());
this.setZoomLevel(zoomLevel);
},
zoomIn: function (n) {
if (isNullOrUndefined(n) || n < 1) {
n = 1;
}
this.setZoomLevel(this.$15 - n);
},
zoomOut: function (n) {
if (isNullOrUndefined(n) || n < 1) {
n = 1;
}
this.setZoomLevel(this.$15 + n);
},
setViewByEnvelope: function (envelope, coordinateSystem, floatingScale) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
if (isNullOrUndefined(coordinateSystem)) {
coordinateSystem = this.getDefaultCoordinateSystem();
}
var $0 = RMap.CoordinateSystem.$4(RMap.$create_Coordinate(envelope.minX, envelope.minY), coordinateSystem, this.$0.tileMapCoordinateSystem);
var $1 = RMap.CoordinateSystem.$4(RMap.$create_Coordinate(envelope.maxX, envelope.maxY), coordinateSystem, this.$0.tileMapCoordinateSystem);
var $2 = 0;
if (floatingScale) {
var $3 = ($1.x - $0.x) / this.$12.$11().width;
this.setViewByUpp(($0.x + $1.x) / 2, ($0.y + $1.y) / 2, $3, this.$12.$E());
} else {
if ($0.x !== $1.x || $0.y !== $1.y) {
var $4 = 0;
var $5 = 0;
if ($0.x !== $1.x) {
$4 = Math.abs($1.x - $0.x) / this.$12.$11().width;
}
if ($0.y !== $1.y) {
$5 = Math.abs($1.y - $0.y) / this.$12.$11().height;
}
if ($5 > $4) {
$4 = $5;
}
var $6 = - 1;
for (var $7 = 0; $7 < this.$0.zoomLevels.length; $7++) {
if ($4 <= this.$0.zoomLevels[$7] && ($6 === - 1 || $6 > this.$0.zoomLevels[$7] - $4)) {
$2 = $7;
$6 = this.$0.zoomLevels[$7] - $4;
}
}
}
this.setView(($0.x + $1.x) / 2, ($0.y + $1.y) / 2, $2, this.$12.$E());
}
},
$3B: function () {
var $0 = '<!DOCTYPE html><html><head></head><body><script>window.onresize=function (){if(this.frameElement && this.frameElement.resizeCallback)this.frameElement.resizeCallback(this.frameElement)}</script></body></html>';
var $1 = [
'<iframe src=\'about:blank\' style=\'position:absolute; border:0px; padding:0px; margin:0px; visibility:hidden; top:-50000px; left:0px; width:100%;\'></iframe>',
'<iframe src=\'about:blank\' style=\'position:absolute; border:0px; padding:0px; margin:0px; visibility:hidden; top:0; left:-50000px; height:100%;\'></iframe>'
];
for (var $2 = 0; $2 < $1.length; $2++) {
var $3 = document.createElement('div');
$3.innerHTML = $1[$2];
var $4 = $3.childNodes[0];
$3.removeChild($4);
$3 = null;
this.$2.appendChild($4);
$4.resizeCallback = Delegate.create(this, this.$3D);
$4.contentWindow.emitcontent = $0;
$4.src = 'javascript:window.emitcontent';
}
},
$3C: 0,
$3D: function () {
window.clearTimeout(this.$3C);
this.$3C = window.setTimeout(Delegate.create(this, this.resize), 100);
},
resize: function () {
var $0 = this.$12.$11();
if ($0.width === this.$4.clientWidth && $0.height === this.$4.clientHeight) {
return;
}
this.$12.$A(this.$4.clientWidth, this.$4.clientHeight);
if ($0.width < this.$4.clientWidth || $0.height < this.$4.clientHeight) {
this.$33(Math.round(this.$12.$6.dx) + 'px', Math.round(this.$12.$6.dy) + 'px');
} else {
this.$33(Math.round(this.$12.$6.dx) + 'px', Math.round(this.$12.$6.dy) + 'px');
}
for (var $1 = 0; $1 < this.$19.length; ++$1) {
(this.$19[$1]).$1(8, null);
}
this.$36(8);
},
$3E: function ($p0, $p1) {
if (this.$18 === this.$17[$p0] && !$p1 && this.$18 && !this.$18.$1) {
return;
}
var $0;
for ($0 = 0; $0 < this.$19.length; ++$0) {
(this.$19[$0]).$1F();
}
this.$18 = this.$17[$p0];
if (!this.$18) {
return;
}
this.$3F();
for ($0 = 0; $0 < this.$19.length && $0 < this.$18.$0.length; ++$0) {
(this.$19[$0]).$20(this.$18.$0[$0]);
}
for (; $0 < this.$18.$0.length; ++$0) {
var $1 = new RMap._TileLayer($0);
$1.$2(this);
$1.$20(this.$18.$0[$0]);
this.$19.add($1);
}
while ($0 < this.$19.length) {
(this.$19[$0]).$3();
this.$19[$0] = null;
this.$19.removeAt($0);
}
this.$37();
},
$3F: function () {
if (!this.$0 || !this.$18 || !this.$18.$0.length || this.$11) {
return;
}
var $0 = this.$0.zoomLevels[this.$15];
if (this.$18.$1) {
this.$0.$1();
this.$18.$1 = false;
}
this.$13 = 0;
this.$14 = this.$0.zoomLevels.length - 1;
this.$15 = this.$0.getBestZoomLevel($0);
var $1 = this.$0.zoomLevels[this.$15];
if ($1 !== $0) {
this.setZoom($1);
}
},
getThemes: function () {
var $0 = new Array(0);
for (var $1 = 0; $1 < this.$0.$0.length; ++$1) {
$0[$1] = this.$0.$0[$1].label;
}
return $0;
},
setTheme: function (themeId) {
this.$40(themeId, false);
},
$40: function ($p0, $p1) {
for (var $0 = 0; $0 < this.$0.$0.length; ++$0) {
if (this.$0.$0[$0].label === $p0) {
this.$3E($0, $p1);
}
}
},
getCurrentTheme: function () {
return (this.$18) ? this.$18.label : null;
},
$41: function () {
return this.$1F;
},
openInfoWindow: function (content, x, y, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
if (isNullOrUndefined(coordinateSystem)) {
coordinateSystem = this.getDefaultCoordinateSystem();
}
var $0 = null;
if (isNullOrUndefined(x)) {
$0 = this.$12.$F();
} else {
$0 = RMap.CoordinateSystem.$4(RMap.$create_Coordinate(x, y), coordinateSystem, this.$12.$E());
}
this.$1F.$1E($0, content, null, null);
},
openBlowupWindow: function (x, y, coordinateSystem) {
if (typeof (coordinateSystem) === 'string') {
coordinateSystem = RMap.CoordinateSystem.getCoordinateSystem(coordinateSystem);
}
if (isNullOrUndefined(coordinateSystem)) {
coordinateSystem = this.getDefaultCoordinateSystem();
}
var $0 = null;
if (isNullOrUndefined(x)) {
$0 = this.$12.$F();
} else {
$0 = RMap.CoordinateSystem.$4(RMap.$create_Coordinate(x, y), coordinateSystem, this.$12.$E());
}
this.$1F.$1F($0, null, null);
},
closeInfoWindow: function () {
this.$1F.$20(true);
},
refreshInfoWindow: function () {
this.$1F.$25();
},
$42: function () {
return this.$20;
},
openContextMenu: function (commands, x, y) {
var $0 = null;
if (isNullOrUndefined(x)) {
$0 = this.$12.$F();
} else {
$0 = RMap.CoordinateSystem.$4(RMap.$create_Coordinate(x, y), this.getDefaultCoordinateSystem(), this.$12.$E());
}
var $1 = this.$12.$18($0);
this.$20.$D($1, commands);
},
addLayer: function (layer) {
var $0 = layer.getId();
if (!isNullOrUndefined(this.layers[$0])) {
throw new Error('duplicated id');
}
this.$1A.add(layer);
layer.$2(this);
this.layers[$0] = layer;
this.$38(new RMap.CollectionChangedEventArgs([layer], 1));
},
removeLayer: function (layerId) {
var $0 = this.layers[layerId];
if (isNullOrUndefined(this.layers[layerId])) {
return;
}
this.$38(new RMap.CollectionChangedEventArgs([$0], 2));
$0.$3();
this.$1A.remove($0);
delete this.layers[$0.getId()];
},
$43: function ($p0, $p1) {
switch ($p1.action) {
case 1:
var $enum1 = $p1.items.getEnumerator();
while ($enum1.moveNext()) {
var $0 = $enum1.get_current();
var $1 = $0.$3C();
this.addLayer($1);
$0.add_stateChangedEvent(Delegate.create($1, $1.$25));
}
break;
case 2:
var $enum2 = $p1.items.getEnumerator();
while ($enum2.moveNext()) {
var $2 = $enum2.get_current();
var $3 = $2.getId();
if (isNullOrUndefined(this.layers[$3])) {
continue;
}
$2.remove_stateChangedEvent(Delegate.create((this.layers[$3]), (this.layers[$3]).$25));
this.removeLayer($3);
}
break;
}
},
beforeUnload: function () {
for (var $0 = 0; $0 < this.$1A.length; $0++) {
if ((this.$1A[$0]).getFeatureView().getStorage().getEditPermissions()) {
if ((this.$1A[$0]).getFeatureView().getStorage().hasChanged()) {
return RMap.Messages.notSaved;
}
}
}
return null;
},
$44: true,
$45: function () {
this.$44 = false;
this.$46(true);
},
$46: function ($p0) {
if ($p0) {
if (this.$E.parentNode !== this.$4) {
this.$4.appendChild(this.$E);
}
} else if (this.$44) {
if (this.$E.parentNode === this.$4) {
this.$4.removeChild(this.$E);
}
}
},
$47: function ($p0) {
this.$1E = $p0;
},
$48: function () {
return this.$1E;
},
$49: 0,
$4B: 0,
$4C: function () {
if (ScriptFX.Application.current.get_isIE() && Math.abs(this.$12.$6.dx) > 250000 || Math.abs(this.$12.$6.dy) > 250000) {
this.$12.$C();
}
var $0 = RMap.$create_Vector(parseInt(this.$6.style.left) - this.$12.$6.dx, this.$12.$6.dy - parseInt(this.$6.style.top));
if (!$0.dx && !$0.dy) {
return;
}
this.$33(Math.round(this.$12.$6.dx) + 'px', Math.round(this.$12.$6.dy) + 'px');
for (var $1 = 0; $1 < this.$19.length; ++$1) {
(this.$19[$1]).$1(1, $0);
}
for (var $2 = 0; $2 < this.$1A.length; ++$2) {
(this.$1A[$2]).$1(1, $0);
}
this.$1F.$1(1, $0);
},
$4D: function ($p0, $p1) {
this.$4A = $p0;
this.$4B = $p1;
this.$47(1);
if (!this.$49) {
this.$49 = window.setTimeout(Delegate.create(this, this.$4F), 1);
}
},
$4E: function () {
if (this.$49) {
window.clearTimeout(this.$49);
this.$4C();
}
this.$4A.dx = 0;
this.$4A.dy = 0;
this.$4B = 0;
this.$49 = 0;
this.$47(0);
},
$4F: function () {
if (this.$4B < 0) {
this.$12.$B(this.$4A.dx, this.$4A.dy);
}
this.$4B--;
if (!this.$4B) {
this.$4E();
return;
}
var $0 = Math.round(parseInt(this.$6.style.left) - this.$4A.dx);
var $1 = Math.round(parseInt(this.$6.style.top) + this.$4A.dy);
this.$33($0 + 'px', $1 + 'px');
for (var $2 = 0; $2 < this.$19.length; ++$2) {
(this.$19[$2]).$1(1, this.$4A);
}
for (var $3 = 0; $3 < this.$1A.length; ++$3) {
(this.$1A[$3]).$1(1, this.$4A);
}
this.$1F.$1(1, this.$4A);
this.$49 = window.setTimeout(Delegate.create(this, this.$4F), 1);
},
$50: function ($p0) {
this.$4E();
this.$1F.$0($p0);
for (var $0 = 0; $0 < this.$1A.length; ++$0) {
(this.$1A[$0]).$0($p0);
}
for (var $1 = 0; $1 < this.$19.length; ++$1) {
(this.$19[$1]).$0($p0);
}
},
$51: function ($p0, $p1) {
if (($p0 & 1)) {
if (this.$21 && (!this.$1D || this.$1D.$1 !== 3)) {
var $0 = $p1;
var $1 = Math.sqrt($0.dx * $0.dx + $0.dy * $0.dy);
var $2 = Math.ceil($1 / 50);
if ($2 > 1 && $1 > 10 && $1 < 1000) {
var $3 = Math.atan2($0.dy, $0.dx);
var $4 = $1 / $2;
this.$47(1);
this.$4D(RMap.$create_Vector(Math.cos($3) * $4, Math.sin($3) * $4), $2);
return;
}
}
this.$4C();
} else if (this.$21 && ($p0 & 2)) {
if (this.$19.length > 0) {
this.$47(1);
(this.$19[0]).$1(2 | 64, Delegate.create(this, this.$52));
} else {
window.setTimeout(Delegate.create(this, this.$52), 0);
}
} else {
for (var $5 = 0; $5 < this.$19.length; ++$5) {
(this.$19[$5]).$1($p0, $p1);
}
for (var $6 = 0; $6 < this.$1A.length; ++$6) {
(this.$1A[$6]).$1($p0, $p1);
}
this.$1F.$1($p0, $p1);
}
},
$52: function () {
for (var $0 = 0; $0 < this.$19.length; ++$0) {
(this.$19[$0]).$1(2, null);
}
for (var $1 = 0; $1 < this.$1A.length; ++$1) {
(this.$1A[$1]).$1(2, null);
}
this.$1F.$1(2, null);
this.$47(0);
},
$53: null,
beginEdit: function (layerId) {
var $0 = this.layers[layerId];
if (isNullOrUndefined($0)) {
return;
}
if (!this.$53) {
this.$53 = new RMap._EditControl();
this.addControl(this.$53, {
top: '5px',
right: '5px'
});
}
this.$53.$2D($0);
},
endEdit: function () {
this.$53.$2E();
},
addImageLayer: function (id, items, config) {
if (!config) {
config = {
};
}
if (!config['schema']) {
config['schema'] = new RMap.FeatureSchema([], null);
}
var $0 = new RMap.ImageLayer(id, items, config['envelope'], config['schema'], config);
this.addLayer($0);
return $0;
},
addDrawingLayer: function (id, config, config2) {
if (!config) {
config = {
};
}
if (!config2) {
var $dict1 = config2;
for (var $key2 in $dict1) {
var $5 = {
key: $key2,
value: $dict1[$key2]
};
config[$5.key] = $5.value;
}
}
var $0;
if (!isUndefined(config['properties'])) {
$0 = config['properties'];
} else {
$0 = new Array(4);
$0[0] = new RMap.Property('title', String, 0, null, 0, null);
$0[1] = new RMap.Property('description', String, 0, null, 0, null);
$0[2] = new RMap.Property('image', String, 0, null, 0, null);
$0[3] = new RMap.Property('link', String, 0, null, 0, null);
}
var $1 = null;
if (!isUndefined(config['crsId'])) {
$1 = RMap.CoordinateSystem.getCoordinateSystem(config['crsId']);
}
if (!$1) {
$1 = this.getDefaultCoordinateSystem();
}
var $2;
if (!isUndefined(config['schema'])) {
$2 = config['schema'];
} else {
$2 = new RMap.FeatureSchema($0, $1);
}
var $3 = new RMap.FeatureStorage($2, - 1);
$3.isInternal = true;
if (!isUndefined(config['title'])) {
$3.$9['title'] = config['title'];
}
if (!isUndefined(config['description'])) {
$3.$9['description'] = config['description'];
}
var $4 = new RMap.SimpleDrawingLayer(id, $3.getDefaultView(), config['styler'], {
enableMouseOver: config['enableMouseOver'],
enableDblClick: config['enableDblClick']
});
this.addLayer($4);
$2.setInfoWindowContentTemplate(Delegate.create($4, $4.$3E));
$2.setPanelItemContentTemplate(Delegate.create($4, $4.$3F));
if (!isNullOrUndefined(config['allowHtml'])) {
$4.allowHtml = config['allowHtml'];
}
return $4;
},
addJsonLayer: function (id, url, config) {
return this.addRemoteLayer(id, url, new RMap.JsonDeserializer(config), config);
},
addCsvLayer: function (id, url, config) {
return this.addRemoteLayer(id, url, new RMap.CSVDeserializer(config), config);
},
addGeorssLayer: function (id, url, config) {
return this.addRemoteLayer(id, url, new RMap.GeoRssDeserializer(null), config);
},
addRmlLayer: function (id, url, config) {
return this.addRemoteLayer(id, url, new RMap.RmlDeserializer(null), config);
},
addKmlLayer: function (id, url, config) {
if (!config) {
config = {
};
}
if (!config['title']) {
config['title'] = 'name';
}
return this.addRemoteLayer(id, url, new RMap.KMLDeserializer(config), config);
},
addGpxLayer: function (id, url, config) {
if (!config) {
config = {
};
}
if (!config['title']) {
config['title'] = 'name';
}
if (!config['description']) {
config['description'] = 'desc';
}
return this.addRemoteLayer(id, url, new RMap.GPXDeserializer(config), config);
},
addRemoteLayer: function (id, url, deserializer, config) {
if (!config) {
config = {
};
}
var $0;
if (!isUndefined(config['properties'])) {
$0 = config['properties'];
} else {
$0 = new Array(4);
$0[0] = new RMap.Property('title', String, 0, null, 0, null);
$0[1] = new RMap.Property('description', String, 0, null, 0, null);
$0[2] = new RMap.Property('image', String, 0, null, 0, null);
$0[3] = new RMap.Property('link', String, 0, null, 0, null);
}
var $1;
if (!isUndefined(config['schema'])) {
$1 = config['schema'];
$1.$6 = false;
} else {
$1 = new RMap.FeatureSchema($0, this.getDefaultCoordinateSystem());
}
if (!isUndefined(config['crsId'])) {
$1.$7(RMap.CoordinateSystem.getCoordinateSystem(config['crsId']));
$1.$6 = false;
}
var $2 = new RMap.FeatureReader(url, 'get', deserializer, null, null, null, null, {
idPrefix: config['idPrefix'],
swCallbackName: config['swCallbackName']
});
var $3 = new RMap.RemoteFeatureStorage($1, $2, ((!isNullOrUndefined(config['reloadInterval'])) ? config['reloadInterval'] * 1000 : 0), true, ((!isNullOrUndefined(config['restyleInterval'])) ? config['restyleInterval'] * 1000 : 0));
$3.isInternal = true;
var $4 = new RMap.SimpleDrawingLayer(id, $3.getDefaultView(), config['styler'], {
enableMouseOver: config['enableMouseOver'],
enableDblClick: config['enableDblClick']
});
this.addLayer($4);
$1.setInfoWindowContentTemplate(Delegate.create($4, $4.$3E));
$1.setPanelItemContentTemplate(Delegate.create($4, $4.$3F));
if (!isNullOrUndefined(config['allowHtml'])) {
$4.allowHtml = config['allowHtml'];
}
return $4;
},
addTileThemeLayer: function (label, urls) {
var $0 = new RMap.TileTheme();
$0.label = label;
$0.initializeFromRemoteSource(urls, this);
this.$17.add($0);
if (!this.$0.$0) {
this.$0.$0 = [
];
}
this.$0.$0[this.$0.$0.length] = $0;
if (this.$17.length === 1) {
this.setTheme(label);
}
return $0;
}
}
RMap.MapSettings = function () {
if (RMap.MapApplication.appInternalZoomLevels) {
this.zoomLevels = RMap.MapApplication.appInternalZoomLevels.clone();
}
}
RMap.MapSettings.prototype = {
$0: null,
defaultCoordinateSystem: null,
zoomLevels: null,
tileMapCoordinateSystem: null,
defaultZoomLevel: 0,
detailZoomLevel: 0,
defaultCenter: null,
defaultMetersPerUnit: 0,
getBestZoomLevel: function (unitsPerPixel) {
if (Type.getInstanceType(unitsPerPixel).get_fullName() === 'String') {
var $2 = unitsPerPixel;
if ($2.indexOf('m') > 0) {
unitsPerPixel = RMap.CoordinateSystem.$2((this.tileMapCoordinateSystem) ? this.tileMapCoordinateSystem : this.defaultCoordinateSystem, this.defaultCenter.x, this.defaultCenter.y, parseFloat($2.replace('m', '')));
}
}
var $0 = - 1;
var $1 = Number.MAX_VALUE;
for (var $3 = 0; $3 < this.zoomLevels.length; $3++) {
var $4 = Math.abs(unitsPerPixel - this.zoomLevels[$3]);
if ($4 < $1) {
$0 = $3;
$1 = $4;
}
}
return $0;
},
$1: function () {
this.zoomLevels = this.$0[0].$0[0].$8();
this.defaultZoomLevel = this.zoomLevels.length - 1;
if (this.defaultMetersPerUnit > 0) {
this.defaultZoomLevel = this.getBestZoomLevel((this.defaultMetersPerUnit + 'm'));
}
}
}
RMap._Marker = function (feature) {
RMap._Marker.constructBase(this, [
feature
]);
this.$9 = Delegate.create(this, this.$E);
}
RMap._Marker.prototype = {
$8: null,
$9: null,
$A: null,
$B: 0,
$2: function ($p0) {
if (this.$6()) {
return;
}
this.$0 = $p0;
this.$8 = this.$0.$22(this._feature);
this._element = this.$C(this.$8);
this.$0.$33().appendChild(this._element);
this.$D(true);
},
$C: function ($p0) {
var $0 = $p0.createElement(this._feature);
$0.style.position = 'absolute';
$0.style.cursor = RMap.Browser.crsPointer;
$0.attachEvent('ontouchstart', this.$0.$17);
$0.attachEvent('onclick', this.$0.$18);
$0.attachEvent('oncontextmenu', this.$0.$19);
if (!(Type.canCast(this, RMap._EditablePushpin))) {
if (this.$0.$B) {
$0.attachEvent('onmouseover', this.$0.$1A);
$0.attachEvent('onmouseout', this.$0.$1B);
}
if (this.$0.$C) {
$0.attachEvent('ondblclick', this.$0.$1C);
}
}
$0.style.visibility = 'hidden';
return $0;
},
$D: function ($p0) {
if ($p0) {
window.clearTimeout(this.$B);
this.$B = window.setTimeout(Delegate.create(this, this.$E), 0);
}
},
$3: function ($p0) {
return !($p0 & 1);
},
$4: function ($p0) {
if (!this._element) {
return;
}
if (($p0 & 1)) {
return;
}
if (($p0 & 4)) {
this._targetCSGeometry = null;
}
this._element.style.visibility = 'hidden';
},
$5: function ($p0) {
if (!this._element) {
return;
}
if (($p0 & 1)) {
return;
}
this.$10();
},
update: function ($p0) {
this._targetCSGeometry = null;
var $0 = this.$0.$22(this._feature);
if (this._element && Type.getInstanceType(this.$8).get_fullName() !== Type.getInstanceType($0).get_fullName()) {
this.$8.destroyElement(this._element, this._feature);
var $1 = this.$C($0);
this.$0.$33().replaceChild($1, this._element);
this._element = null;
this._element = $1;
}
this.$8 = $0;
this.$F();
this.$10();
},
updateStyle: function ($p0) {
var $0 = this.$0.$22(this._feature);
if (Type.getInstanceType(this.$8).get_fullName() !== Type.getInstanceType($0).get_fullName()) {
this.update($p0);
} else {
this.$8 = $0;
this.$F();
}
},
$E: function () {
this.$D(false);
this._element.style.visibility = 'hidden';
this.$F();
this.$10();
},
$F: function () {
this.$8.updateElement(this._element, this._feature);
},
$10: function () {
if (!this._element) {
return;
}
var $0 = this.$0.$30().$39();
if (!this._targetCSGeometry) {
this._targetCSGeometry = RMap.CoordinateSystem.$5(this._feature.geometry, this._feature.$7(), $0.$E());
}
try {
var $1 = $0.$16(this._targetCSGeometry.getCoordinates(), 0, 2);
this._element.style.left = $1[0] + 'px';
this._element.style.top = $1[1] + 'px';
this._element.style.visibility = (this._isHidden) ? 'hidden' : '';
} catch ($2) {
}
},
$7: function () {
window.clearTimeout(this.$B);
if (this._element) {
this.$D(false);
this.$8.destroyElement(this._element, this._feature);
if (this._element.parentNode === this.$0.$33()) {
this.$0.$33().removeChild(this._element);
}
this._element = null;
}
this.$8 = null;
this.$9 = null;
RMap._Marker.callBase(this, '$7');
}
}
RMap._Shape = function (feature) {
this.$B = - 1;
RMap._Shape.constructBase(this, [
feature
]);
}
RMap._Shape.prototype = {
$8: null,
$9: null,
$A: null,
$2: function ($p0) {
if (this.$6()) {
return;
}
this.$0 = $p0;
this.$9 = this.$0.$22(this._feature);
try {
if (ScriptFX.Application.current.get_isIE()) {
this.$8 = new RMap._VMLGraphics(this._feature.geometry.getGeometryType());
} else {
this.$8 = new RMap._SVGGraphics(this._feature.geometry.getGeometryType());
}
this._element = this.$8.$1;
this._element._id = this._feature.getId();
if (this._feature.isInteractive()) {
this._element.style.cursor = RMap.Browser.crsPointer;
this._element.attachEvent('onclick', this.$0.$18);
this._element.attachEvent('oncontextmenu', this.$0.$19);
if (this.$0.$B) {
this._element.attachEvent('onmouseover', this.$0.$1A);
this._element.attachEvent('onmouseout', this.$0.$1B);
}
if (this.$0.$C) {
this._element.attachEvent('ondblclick', this.$0.$1C);
}
}
this.$0.$32().appendChild(this._element);
this.$C();
this.$D();
} catch ($0) {
this._element = null;
}
},
update: function ($p0) {
this.$A = null;
this._targetCSGeometry = null;
this.$9 = this.$0.$22(this._feature);
this.$C();
this.$D();
},
updateStyle: function ($p0) {
var $0 = this.$0.$22(this._feature);
this.$9 = $0;
this.$C();
},
$3: function ($p0) {
return true;
},
$4: function ($p0) {
if (!this._element) {
return;
}
if (($p0 & 1)) {
return;
}
if (($p0 & 4)) {
this.$A = null;
this._targetCSGeometry = null;
}
this._element.style.visibility = 'hidden';
},
$5: function ($p0) {
if (!this._element) {
return;
}
if (($p0 & 1)) {
this.$A = null;
}
this.$D();
},
$C: function () {
try {
this.$8.$4(this.$9);
} catch ($0) {
}
},
$D: function () {
if (!this._element) {
return;
}
var $0 = this.$0.$30().$39();
if (!this._targetCSGeometry) {
this._targetCSGeometry = RMap.CoordinateSystem.$5(this._feature.geometry, this._feature.$7(), $0.$E());
}
var $1 = $0.$12();
if (!this._targetCSGeometry.$4($1)) {
this.$8.$3();
return;
}
if (!this.$A || this.$B !== $0.$10()) {
this.$A = $0.$16(this._targetCSGeometry.getCoordinates(), this.$9.strokeWidth, this._feature.geometry.$6());
this.$B = $0.$10();
}
if (this._targetCSGeometry.$5($1)) {
this.$8.$2([this.$A], this._feature.geometry.getGeometryType());
} else {
var $2 = $0.$13();
$2.inflate(1024, 1024);
var $3 = RMap._GeometryOperation.$2(this.$A, $2, this._feature.geometry.$6(), this._feature.geometry.getGeometryType() === 3);
this.$8.$2($3, this._feature.geometry.getGeometryType());
}
if (!this._element.parentNode) {
this.$0.$32().appendChild(this._element);
}
this._element.style.visibility = (this._isHidden) ? 'hidden' : '';
},
$7: function () {
if (this._element) {
this._element.detachEvent('onclick', this.$0.$18);
this._element.detachEvent('oncontextmenu', this.$0.$19);
this._element.detachEvent('onmouseover', this.$0.$1A);
this._element.detachEvent('onmouseout', this.$0.$1B);
this._element.detachEvent('ondblclick', this.$0.$1C);
}
if (this.$8) {
this.$8.$5();
}
this.$9 = null;
this.$A = null;
RMap._Shape.callBase(this, '$7');
}
}
RMap.DrawingStyle = function () {
}
RMap.PointStyle = function () {
RMap.PointStyle.constructBase(this);
}
RMap.PointStyle.prototype = {
iconSize: null,
anchor: null,
anchorBase: null,
infoWindowAnchor: null,
infoWindowAnchorBase: null,
$0: function ($p0) {
if (this.iconSize) {
$p0.style.width = this.iconSize.width + 'px';
$p0.style.height = this.iconSize.height + 'px';
$p0.style.overflow = 'hidden';
} else {
$p0.style.width = '';
$p0.style.height = '';
$p0.style.overflow = '';
}
},
applyAnchor: function (element) {
var $0 = 0;
var $1 = 0;
if (this.anchor) {
if (this.anchorBase) {
$0 = - element.offsetWidth * this.anchorBase.left;
$1 = - element.offsetHeight * this.anchorBase.top;
}
$0 -= parseInt(this.anchor.left);
$1 -= parseInt(this.anchor.top);
} else {
$0 = ( - element.offsetWidth / 2);
$1 = ( - element.offsetHeight / 2);
}
element.style.marginLeft = $0.toString() + 'px';
element.style.marginTop = $1.toString() + 'px';
}
}
RMap.MarkerStyle = function () {
RMap.MarkerStyle.constructBase(this);
}
RMap.ImageSymbolPointStyle = function () {
RMap.ImageSymbolPointStyle.constructBase(this);
this.onloadHandler = Delegate.create(this, this.onLoad);
}
RMap.ImageSymbolPointStyle.prototype = {
iconSrc: null,
onloadHandler: null,
createElement: function (feature) {
var $0 = document.createElement('img');
$0._id = feature.getId();
return $0;
},
updateElement: function (element, feature) {
if (feature && (element).src !== this.iconSrc && (element).src !== RMap._DomHelper.$1A(RMap._DomHelper.$14(), this.iconSrc)) {
if (this.needsCenter()) {
element.detachEvent('onload', this.onloadHandler);
element.attachEvent('onload', this.onloadHandler);
(element).src = this.iconSrc;
return;
}(element).src = this.iconSrc;
}
this.$0(element);
this.applyAnchor(element);
},
destroyElement: function (element, feature) {
element.detachEvent('onload', this.onloadHandler);
element._id = null;
},
getHTML: function (feature, outerStyle) {
if (isNullOrUndefined(outerStyle)) {
outerStyle = '';
}
if (!isNullOrUndefined(this.iconSize)) {
outerStyle = 'width:' + this.iconSize.width + 'px;height:' + this.iconSize.height + 'px;' + outerStyle;
}
return '<img src=\'' + this.iconSrc + '\' style=\'' + outerStyle + '\'/>';
},
onLoad: function () {
var $0 = window.event.srcElement;
if ($0) {
$0.detachEvent('onload', this.onloadHandler);
this.updateElement($0, null);
}
},
needsCenter: function () {
if (!this.anchor) {
return true;
}
return false;
},
readFromRml: function (imageSymbolPointStyleNode) {
if (!isNullOrUndefined(imageSymbolPointStyleNode['href'])) {
this.iconSrc = imageSymbolPointStyleNode['href'].toString();
}
if (!isNullOrUndefined(imageSymbolPointStyleNode['width']) && !isNullOrUndefined(imageSymbolPointStyleNode['height'])) {
this.iconSize = ScriptFX.UI.$create_Size(parseInt(imageSymbolPointStyleNode['width'].toString()), parseInt(imageSymbolPointStyleNode['height'].toString()));
}
var $0 = imageSymbolPointStyleNode['Anchors'];
if (!isNullOrUndefined($0)) {
var $1 = RMap._DomHelper.$1B($0['anchor']);
for (var $2 = 0; $2 < $1.length; $2++) {
var $3 = $1[$2];
if ($3['type'].toString() === 'ORIGIN') {
this.anchor = ScriptFX.UI.$create_Location(parseInt($3['x'].toString()), parseInt($3['y'].toString()));
if (!isNullOrUndefined($3['baseX'])) {
this.anchorBase = ScriptFX.UI.$create_Location($3['baseX'], $3['baseY']);
}
}
if ($3['type'].toString() === 'INFO') {
this.infoWindowAnchor = ScriptFX.UI.$create_Location(parseInt($3['x'].toString()), parseInt($3['y'].toString()));
if (!isNullOrUndefined($3['baseX'])) {
this.infoWindowAnchorBase = ScriptFX.UI.$create_Location($3['baseX'], $3['baseY']);
}
}
}
}
},
writeToRml: function () {
var $0 = new StringBuilder();
$0.append('<ImageSymbolPointStyle');
if (!isNull(this.iconSrc)) {
$0.append(' href=\'' + this.iconSrc + '\'');
}
if (!isNull(this.iconSize)) {
$0.append(' width=\'' + this.iconSize.width + '\' height=\'' + this.iconSize.height + '\'');
}
if (!isNull(this.anchor) || !isNull(this.infoWindowAnchor)) {
$0.append('>');
$0.append('<Anchors>');
if (!isNull(this.anchor)) {
$0.append('<anchor type=\'ORIGIN\' x=\'' + this.anchor.left + '\' y=\'' + this.anchor.top + '\'');
if (!isNull(this.anchorBase)) {
$0.append('baseX=\'' + this.anchorBase.left + '\' baseY=\'' + this.anchorBase.top + '\'');
}
$0.append('/>');
}
if (!isNull(this.infoWindowAnchor)) {
$0.append('<anchor type=\'INFO\' x=\'' + this.infoWindowAnchor.left + '\' y=\'' + this.infoWindowAnchor.top + '\'');
if (!isNull(this.infoWindowAnchorBase)) {
$0.append('baseX=\'' + this.infoWindowAnchorBase.left + '\' baseY=\'' + this.infoWindowAnchorBase.top + '\'');
}
$0.append('/>');
}
$0.append('</Anchors>');
$0.append('</ImageSymbolPointStyle>');
} else {
$0.append('/>');
}
return $0.toString();
},
clone: function () {
var $0 = new RMap.ImageSymbolPointStyle();
$0.iconSrc = this.iconSrc;
if (!isNullOrUndefined(this.iconSize)) {
$0.iconSize = ScriptFX.UI.$create_Size(this.iconSize.width, this.iconSize.height);
}
if (!isNullOrUndefined(this.anchor)) {
$0.anchor = ScriptFX.UI.$create_Location(this.anchor.left, this.anchor.top);
}
if (!isNullOrUndefined(this.anchorBase)) {
$0.anchorBase = ScriptFX.UI.$create_Location(this.anchorBase.left, this.anchorBase.top);
}
if (!isNullOrUndefined(this.infoWindowAnchor)) {
$0.infoWindowAnchor = ScriptFX.UI.$create_Location(this.infoWindowAnchor.left, this.infoWindowAnchor.top);
}
if (!isNullOrUndefined(this.infoWindowAnchorBase)) {
$0.infoWindowAnchorBase = ScriptFX.UI.$create_Location(this.infoWindowAnchorBase.left, this.infoWindowAnchorBase.top);
}
return $0;
}
}
RMap.TextSymbolPointStyle = function () {
this.style = {
};
RMap.TextSymbolPointStyle.constructBase(this);
this.style['color'] = '#000000';
this.style['background'] = '#ffffff';
this.style['border'] = '#000000 1px solid';
}
RMap.TextSymbolPointStyle.prototype = {
value: '',
createElement: function (feature) {
var $0 = document.createElement('div');
var $dict1 = this.style;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
$0.style[$1.key] = $1.value;
}
$0._id = feature.getId();
return $0;
},
updateElement: function (element, feature) {
element.innerHTML = this.$1(feature, this.value);
this.$0(element);
this.applyAnchor(element);
},
destroyElement: function (element, feature) {
element._id = null;
},
getHTML: function (feature, outerStyle) {
if (isNullOrUndefined(outerStyle)) {
outerStyle = '';
}
var $dict1 = this.style;
for (var $key2 in $dict1) {
var $0 = {
key: $key2,
value: $dict1[$key2]
};
outerStyle = $0.key + ':' + $0.value + ';' + outerStyle;
}
if (!isNullOrUndefined(this.iconSize)) {
outerStyle = 'width:' + this.iconSize.width.toString() + 'px;height:' + this.iconSize.height.toString() + 'px;overflow:hidden;' + outerStyle;
}
return '<div style=\'' + outerStyle + '\'>' + this.$1(feature, this.value) + '</div>';
},
$1: function ($p0, $p1) {
if ($p1.indexOf('$') === - 1) {
return $p1;
}
var $dict1 = $p0.properties;
for (var $key2 in $dict1) {
var $0 = {
key: $key2,
value: $dict1[$key2]
};
$p1 = $p1.replace(new RegExp('$' + $0.key, 'g'), $0.value);
}
return $p1;
},
readFromRml: function (textSymbolPointStyleNode) {
if (!isNullOrUndefined(textSymbolPointStyleNode['value'])) {
this.value = textSymbolPointStyleNode['value'].toString();
}
if (!isNullOrUndefined(textSymbolPointStyleNode['width']) && !isNullOrUndefined(textSymbolPointStyleNode['height'])) {
this.iconSize = ScriptFX.UI.$create_Size(parseInt(textSymbolPointStyleNode['width'].toString()), parseInt(textSymbolPointStyleNode['height'].toString()));
}
var $0 = textSymbolPointStyleNode['fillProperties'];
if (!isNullOrUndefined($0)) {
if (!isNullOrUndefined($0['color'])) {
if ($0['color'].toString().length === 8) {
this.style['background'] = '#' + $0['color'].toString().substring(2, 8);
}
}
}
var $1 = textSymbolPointStyleNode['lineProperties'];
if (!isNullOrUndefined($1)) {
if (!isNullOrUndefined($1['color'])) {
if ($1['color'].toString().length === 8) {
this.style['border'] = '#' + $1['color'].toString().substring(2, 8) + ' 1px solid';
}
}
}
var $2 = textSymbolPointStyleNode['fontProperties'];
if (!isNullOrUndefined($2)) {
var $4 = '';
if ($2['bold']) {
$4 += 'bold ';
}
if ($2['italic']) {
$4 += 'italic ';
}
if ($2['underline']) {
this.style['textDecoration'] = 'underline';
}
if (!isNullOrUndefined($2['size'])) {
if ($2['size'].toString() === 'SMALL') {
$4 += '8px';
} else if ($2['size'].toString() === 'MEDIUM') {
$4 += '12px';
} else if ($2['size'].toString() === 'LARGE') {
$4 += '16px';
} else {
$4 += parseFloat($2['size'].toString()) + 'px ';
}
}
if (!isNullOrUndefined($2['family'])) {
$4 += $2['family'].toString() + ',';
}
$4 += 'verdana,arial';
this.style['font'] = $4;
if (!isNullOrUndefined($2['color'])) {
if ($2['color'].toString().length === 8) {
this.style['color'] = '#' + $2['color'].toString().substring(2, 8);
}
}
}
var $3 = textSymbolPointStyleNode['Anchors'];
if (!isNullOrUndefined($3)) {
var $5 = RMap._DomHelper.$1B($3['anchor']);
for (var $6 = 0; $6 < $5.length; $6++) {
var $7 = $5[$6];
if ($7['type'].toString() === 'ORIGIN') {
this.anchor = ScriptFX.UI.$create_Location(parseInt($7['x'].toString()), parseInt($7['y'].toString()));
if (!isNullOrUndefined($7['baseX'])) {
this.anchorBase = ScriptFX.UI.$create_Location($7['baseX'], $7['baseY']);
}
}
if ($7['type'].toString() === 'INFO') {
this.infoWindowAnchor = ScriptFX.UI.$create_Location(parseInt($7['x'].toString()), parseInt($7['y'].toString()));
if (!isNullOrUndefined($7['baseX'])) {
this.infoWindowAnchorBase = ScriptFX.UI.$create_Location($7['baseX'], $7['baseY']);
}
}
}
}
},
writeToRml: function () {
var $0 = new StringBuilder();
$0.append('<ImageSymbolPointStyle');
if (!isNull(this.value)) {
$0.append(' value=\'' + this.value + '\'');
}
if (!isNull(this.iconSize)) {
$0.append(' width=\'' + this.iconSize.width + '\' height=\'' + this.iconSize.height + '\'');
}
$0.append('>');
if (!isNull(this.style['border'])) {
$0.append('<lineProperties color=\'ff' + this.style['border'].toString().replace(new RegExp('#', 'g'), '').substring(0, 6) + '\'/>');
}
if (!isNull(this.style['background'])) {
$0.append('<fillProperties color=\'ff' + this.style['background'].toString().replace(new RegExp('#', 'g'), '') + '\'/>');
}
if (!isNull(this.style['font'])) {
}
if (!isNull(this.anchor) || !isNull(this.infoWindowAnchor)) {
$0.append('>');
$0.append('<Anchors>');
if (!isNull(this.anchor)) {
$0.append('<anchor type=\'ORIGIN\' x=\'' + this.anchor.left + '\' y=\'' + this.anchor.top + '\'');
if (!isNull(this.anchorBase)) {
$0.append('baseX=\'' + this.anchorBase.left + '\' baseY=\'' + this.anchorBase.top + '\'');
}
$0.append('/>');
}
if (!isNull(this.infoWindowAnchor)) {
$0.append('<anchor type=\'INFO\' x=\'' + this.infoWindowAnchor.left + '\' y=\'' + this.infoWindowAnchor.top + '\'');
if (!isNull(this.infoWindowAnchorBase)) {
$0.append('baseX=\'' + this.infoWindowAnchorBase.left + '\' baseY=\'' + this.infoWindowAnchorBase.top + '\'');
}
$0.append('/>');
}
$0.append('</Anchors>');
$0.append('</ImageSymbolPointStyle>');
} else {
$0.append('/>');
}
return $0.toString();
},
clone: function () {
var $0 = new RMap.TextSymbolPointStyle();
$0.value = this.value;
var $dict1 = this.style;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
$0.style[$1.key] = $1.value;
}
if (!isNullOrUndefined(this.iconSize)) {
$0.iconSize = ScriptFX.UI.$create_Size(this.iconSize.width, this.iconSize.height);
}
if (!isNullOrUndefined(this.anchor)) {
$0.anchor = ScriptFX.UI.$create_Location(this.anchor.left, this.anchor.top);
}
if (!isNullOrUndefined(this.anchorBase)) {
$0.anchorBase = ScriptFX.UI.$create_Location(this.anchorBase.left, this.anchorBase.top);
}
if (!isNullOrUndefined(this.infoWindowAnchor)) {
$0.infoWindowAnchor = ScriptFX.UI.$create_Location(this.infoWindowAnchor.left, this.infoWindowAnchor.top);
}
if (!isNullOrUndefined(this.infoWindowAnchorBase)) {
$0.infoWindowAnchorBase = ScriptFX.UI.$create_Location(this.infoWindowAnchorBase.left, this.infoWindowAnchorBase.top);
}
return $0;
}
}
RMap.CompositePointStyle = function () {
this.substyles = new Array(0);
RMap.CompositePointStyle.constructBase(this);
}
RMap.CompositePointStyle.prototype = {
createElement: function (feature) {
var $0 = document.createElement('div');
for (var $1 = 0; $1 < this.substyles.length; $1++) {
var $2 = this.substyles[$1].createElement(feature);
$2.style.position = 'absolute';
$0.appendChild($2);
}
return $0;
},
updateElement: function (element, feature) {
for (var $0 = 0; $0 < this.substyles.length; $0++) {
this.substyles[$0].updateElement(element.childNodes[$0], feature);
}
},
destroyElement: function (element, feature) {
for (var $0 = this.substyles.length - 1; $0 >= 0; $0--) {
this.substyles[$0].destroyElement(element.lastChild, feature);
element.removeChild(element.lastChild);
}
},
getHTML: function (feature, outerStyle) {
if (isNullOrUndefined(outerStyle)) {
outerStyle = '';
}
var $0 = '<div style=\'' + outerStyle + '\'>';
for (var $1 = 0; $1 < this.substyles.length; $1++) {
$0 += this.substyles[$1].getHTML(feature, null);
}
$0 += '</div>';
return $0;
},
readFromRml: function (rmlNode) {
var $0 = rmlNode['PointStyles'];
if (!isNullOrUndefined($0)) {
var $2 = RMap._DomHelper.$1B($0['ImageSymbolPointStyle']);
for (var $4 = 0; $4 < $2.length; $4++) {
var $5 = this.substyles.length;
(this.substyles) [$5] = new RMap.ImageSymbolPointStyle();
this.substyles[$5].readFromRml($2[$4]);
}
var $3 = RMap._DomHelper.$1B($0['TextSymbolPointStyle']);
for (var $6 = 0; $6 < $3.length; $6++) {
var $7 = this.substyles.length;
(this.substyles) [$7] = new RMap.TextSymbolPointStyle();
this.substyles[$7].readFromRml($3[$6]);
}
}
var $1 = rmlNode['Anchors'];
if (!isNullOrUndefined($1)) {
var $8 = RMap._DomHelper.$1B($1['anchor']);
for (var $9 = 0; $9 < $8.length; $9++) {
var $A = $8[$9];
if ($A['type'].toString() === 'ORIGIN') {
this.anchor = ScriptFX.UI.$create_Location(parseInt($A['x'].toString()), parseInt($A['y'].toString()));
if (!isNullOrUndefined($A['baseX'])) {
this.anchorBase = ScriptFX.UI.$create_Location($A['baseX'], $A['baseY']);
}
}
if ($A['type'].toString() === 'INFO') {
this.infoWindowAnchor = ScriptFX.UI.$create_Location(parseInt($A['x'].toString()), parseInt($A['y'].toString()));
if (!isNullOrUndefined($A['baseX'])) {
this.infoWindowAnchorBase = ScriptFX.UI.$create_Location($A['baseX'], $A['baseY']);
}
}
}
}
},
writeToRml: function () {
var $0 = new StringBuilder();
$0.append('<CompositePointStyle>');
if (!isNull(this.anchor) || !isNull(this.infoWindowAnchor)) {
$0.append('<Anchors>');
if (!isNull(this.anchor)) {
$0.append('<anchor type=\'ORIGIN\' x=\'' + this.anchor.left + '\' y=\'' + this.anchor.top + '\'');
if (!isNull(this.anchorBase)) {
$0.append('baseX=\'' + this.anchorBase.left + '\' baseY=\'' + this.anchorBase.top + '\'');
}
$0.append('/>');
}
if (!isNull(this.infoWindowAnchor)) {
$0.append('<anchor type=\'INFO\' x=\'' + this.infoWindowAnchor.left + '\' y=\'' + this.infoWindowAnchor.top + '\'');
if (!isNull(this.infoWindowAnchorBase)) {
$0.append('baseX=\'' + this.infoWindowAnchorBase.left + '\' baseY=\'' + this.infoWindowAnchorBase.top + '\'');
}
$0.append('/>');
}
$0.append('</Anchors>');
}
$0.append('<PointStyles>');
for (var $1 = 0; $1 < this.substyles.length; $1++) {
$0.append(this.substyles[$1].writeToRml());
}
$0.append('</PointStyles>');
$0.append('</CompositePointStyle>');
return $0.toString();
},
clone: function () {
var $0 = new RMap.CompositePointStyle();
var $1 = new Array(this.substyles.length);
for (var $2 = 0; $2 < this.substyles.length; $2++) {
$1[$2] = this.substyles[$2].clone();
}
$0.substyles = $1;
if (!isNullOrUndefined(this.anchor)) {
$0.anchor = ScriptFX.UI.$create_Location(this.anchor.left, this.anchor.top);
}
if (!isNullOrUndefined(this.anchorBase)) {
$0.anchorBase = ScriptFX.UI.$create_Location(this.anchorBase.left, this.anchorBase.top);
}
if (!isNullOrUndefined(this.infoWindowAnchor)) {
$0.infoWindowAnchor = ScriptFX.UI.$create_Location(this.infoWindowAnchor.left, this.infoWindowAnchor.top);
}
if (!isNullOrUndefined(this.infoWindowAnchorBase)) {
$0.infoWindowAnchorBase = ScriptFX.UI.$create_Location(this.infoWindowAnchorBase.left, this.infoWindowAnchorBase.top);
}
return $0;
}
}
RMap.ShapeStyle = function () {
RMap.ShapeStyle.constructBase(this);
}
RMap.ShapeStyle.prototype = {
strokeColor: null,
strokeOpacity: 0,
strokeWidth: 0,
strokeType: 0,
fillColor: null,
fillOpacity: 0,
fillType: 0,
clone: function () {
var $0 = new RMap.ShapeStyle();
$0.strokeColor = this.strokeColor;
$0.strokeOpacity = this.strokeOpacity;
$0.strokeType = this.strokeType;
$0.strokeWidth = this.strokeWidth;
$0.fillColor = this.fillColor;
$0.fillOpacity = this.fillOpacity;
$0.fillType = this.fillType;
return $0;
}
}
RMap._StyleIconGenerator = function () {
}
RMap._StyleIconGenerator.$1 = function ($p0) {
var $0 = $p0.strokeOpacity / 100;
var $1 = '<div style=\'width:' + RMap._StyleIconGenerator.$0.width.toString() + 'px; border-top:' + $p0.strokeColor + ' ' + $p0.strokeWidth.toString() + 'px solid; filter:alpha(opacity=' + $p0.strokeOpacity.toString() + '); opacity:' + $0.toString() + '\'><p></p></div>';
return $1;
}
RMap._StyleIconGenerator.$2 = function ($p0) {
var $0 = $p0.strokeOpacity / 100;
var $1 = $p0.fillOpacity / 100;
var $2 = RMap._StyleIconGenerator.$0.width - 2 * $p0.strokeWidth;
if ($2 < 0) {
$2 = 0;
}
var $3 = '<table style=\'width:' + RMap._StyleIconGenerator.$0.width.toString() + 'px;\'><tr>';
$3 += '<td style=\'padding:0px; border:' + $p0.strokeColor + ' ' + $p0.strokeWidth.toString() + 'px solid; filter:alpha(opacity=' + $p0.strokeOpacity.toString() + '); opacity:' + $0.toString() + '\'>';
$3 += '<div style=\'width:100%; height:' + RMap._StyleIconGenerator.$0.height.toString() + 'px; background:' + $p0.fillColor + '; filter:alpha(opacity=' + $p0.fillOpacity.toString() + '); opacity:' + $1.toString() + '\'><b></b></div></td></tr></table>';
return $3;
}
RMap._StyleHelper = function () {
}
RMap._StyleHelper.$0 = function ($p0, $p1) {
if (isNull($p1)) {
$p1 = 1;
}
var $0 = ScriptFX.Application.current.get_isIE();
switch ($p0) {
case 0:
if ($0) {
return 'solid';
} else {
return 'none';
}
break;
case 1:
if ($0) {
return 'dot';
} else {
return $p1 + ',' + ($p1 * 4);
}
break;
case 2:
if ($0) {
return 'dash';
} else {
return ($p1 * 5) + ',' + ($p1 * 4);
}
break;
case 4:
if ($0) {
return 'longdash';
} else {
return ($p1 * 10) + ',' + ($p1 * 4);
}
break;
case 8:
if ($0) {
return 'dashdot';
} else {
return ($p1 * 5) + ',' + ($p1 * 3) + ',' + ($p1 * 1) + ',' + ($p1 * 3);
}
break;
case 16:
if ($0) {
return 'longdashdot';
} else {
return ($p1 * 10) + ',' + ($p1 * 3) + ',' + ($p1 * 1) + ',' + ($p1 * 3);
}
break;
}
return String.Empty;
}
RMap._StyleHelper.$1 = function ($p0) {
switch ($p0.toLowerCase()) {
case 'solid':
return 0;
case 'dotted':
return 1;
case 'dashed':
return 2;
case 'longdashed':
return 4;
case 'dashdotted':
return 8;
case 'longdashdotted':
return 16;
default:
return 0;
}
}
RMap._StyleHelper.$2 = function ($p0) {
switch ($p0.toLowerCase()) {
case 'solid':
return 1;
case 'empty':
return 0;
case 'Verticalpattern':
return 2;
case 'Horizontalpattern':
return 4;
case 'Fallingpattern':
return 8;
case 'Raisingpattern':
return 16;
case 'Rectangularpattern':
return 32;
case 'Diagonalpattern':
return 64;
default:
return 1;
}
}
RMap.Styler = function () {
}
RMap._Tile = function (layer, tileFormat) {
this.$B = Delegate.create(this, this.$10);
this.$C = Delegate.create(this, this.$11);
this.$0 = layer;
this.$6 = (RMap._Environment.$0() && tileFormat === 'transparentPng');
}
RMap._Tile.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$6: false,
$7: null,
$8: null,
$9: 0,
$A: 0,
$B: null,
$C: null,
$D: function () {
this.$12();
this.$0 = null;
this.$3 = null;
this.$4 = null;
this.$5 = null;
this.$7 = null;
},
$E: function ($p0, $p1, $p2) {
if (!$p1 && $p0.$0 === this.$4.$0 && $p0.$1 === this.$4.$1) {
return;
}
this.$3 = this.$0.$25();
this.$4 = $p0;
this.$5 = this.$0.$26();
this.$7 = this.$0.$27(this.$4);
this.$8 = this.$0.$28(this.$4);
this.$9 = this.$0.$29();
if ($p2) {
return;
}
this.$12();
this.$1 = document.createElement('img');
this.$1.attachEvent('onload', this.$B);
this.$1.attachEvent('onerror', this.$C);
this.$A = window.setTimeout(Delegate.create(this, this.$F), ($p1) ? RMap.MapApplication.tileLoadTimeout : RMap.MapApplication.tileLoadShortTimeout);
},
$F: function () {
this.$1.src = this.$8;
},
$10: function () {
if (!this.$1) {
return;
}
this.$1.detachEvent('onload', this.$B);
this.$1.detachEvent('onerror', this.$C);
this.$2 = this.$1;
this.$1 = null;
this.$2.unselectable = 'on';
this.$14();
},
$11: function () {
this.$13();
},
$12: function () {
this.$13();
if (this.$2) {
if (this.$2.parentNode === this.$3) {
this.$3.removeChild(this.$2);
}
this.$2 = null;
}
},
$13: function () {
if (this.$1) {
if (this.$A) {
window.clearTimeout(this.$A);
this.$A = 0;
}
this.$1.detachEvent('onload', this.$B);
this.$1.detachEvent('onerror', this.$C);
this.$1.src = RMap._Environment.$1();
this.$1 = null;
}
},
$14: function () {
var $0 = this.$2.style;
if (this.$6) {
$0.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=\'scale\', src=\'' + this.$8 + '\')';
this.$2.src = RMap._Environment.$1();
}
ScriptFX.UI.Element.setLocation(this.$2, this.$7);
ScriptFX.UI.Element.setSize(this.$2, this.$5);
if (this.$2.parentNode !== this.$3) {
$0.position = 'absolute';
this.$3.appendChild(this.$2);
}
},
$15: function ($p0, $p1) {
if (!this.$2) {
return;
}
var $0 = this.$9 / $p1;
if ($0 > 4 || $0 < 1 / 8) {
this.$12();
return;
}
this.$2.style.left = Math.floor((this.$7.left + $p0.dx) * $0 - $p0.dx) + 'px';
this.$2.style.top = Math.floor((this.$7.top + $p0.dy) * $0 - $p0.dy) + 'px';
this.$2.style.width = Math.round(this.$5.width * $0 + 1) + 'px';
this.$2.style.height = Math.round(this.$5.height * $0 + 1) + 'px';
}
}
RMap._TileLayer = function (ordinal) {
RMap._TileLayer.constructBase(this);
this.$7 = ordinal;
}
RMap._TileLayer.prototype = {
$4: null,
$5: null,
$6: null,
$7: 0,
$8: null,
$9: null,
$A: null,
$B: null,
$C: null,
$D: null,
$E: null,
$F: null,
$10: null,
$11: null,
$12: 0,
$13: 0,
$14: null,
$15: null,
$16: 0,
$17: 0,
$18: 0,
$19: 0,
$1A: null,
$1B: 0,
$1C: 0,
$1D: null,
$1E: null,
$2: function ($p0) {
this.$4 = $p0;
this.$A = [
];
this.$B = [
];
this.$8 = RMap._DomHelper.$3(this.$4.$6);
this.$9 = RMap._DomHelper.$3(this.$4.$6);
this.$14 = Delegate.create(this, this.$24);
this.$15 = Delegate.create(this, this.$22);
this.$1D = Delegate.create(this, this.$21);
},
$3: function () {
window.clearTimeout(this.$18);
window.clearTimeout(this.$16);
window.clearTimeout(this.$17);
this.$14 = null;
this.$15 = null;
this.$1D = null;
for (var $0 = 0; $0 < this.$A.length; ++$0) {
(this.$A[$0]).$D();
}
this.$A.clear();
this.$A = null;
for (var $1 = 0; $1 < this.$B.length; ++$1) {
(this.$B[$1]).$D();
}
this.$B.clear();
this.$B = null;
if (this.$9 && this.$9.parentNode) {
this.$9.parentNode.removeChild(this.$9);
}
this.$9 = null;
if (this.$8 && this.$8.parentNode) {
this.$8.parentNode.removeChild(this.$8);
}
this.$8 = null;
this.$6 = null;
this.$5 = null;
this.$4 = null;
},
$1F: function () {
for (var $0 = 0; $0 < this.$B.length; ++$0) {
(this.$B[$0]).$12();
}
},
$20: function ($p0) {
if (!this.$4) {
throw new Error('object is not initialized');
}
if (this.$4.$39().$E() !== RMap.CoordinateSystem.getCoordinateSystem($p0.$0)) {
throw new Error('invalid arguments - not implemented');
}
this.$5 = $p0;
for (var $0 = 0; $0 < this.$A.length; ++$0) {
(this.$A[$0]).$D();
}
this.$A = [
];
if (this.$B.length > 0 && $p0.$3.width !== this.$5.$3.width || $p0.$3.height !== this.$5.$3.height || $p0.$4 !== this.$5.$4) {
for (var $1 = 0; $1 < this.$B.length; ++$1) {
(this.$B[$1]).$D();
}
this.$B = [
];
}
this.$5 = $p0;
if (this.$17) {
window.clearTimeout(this.$17);
this.$17 = 0;
}
this.$22();
},
$0: function ($p0) {
if (($p0 & 1)) {
return;
}
if (($p0 & 2)) {
if (this.$1B > 0) {
this.$1B = 0;
this.$1E.invoke();
}
}
if (this.$16) {
window.clearTimeout(this.$16);
this.$16 = 0;
}
if (this.$17) {
window.clearTimeout(this.$17);
this.$17 = 0;
}
if (!this.$7) {
this.$19 = this.$4.$39().$10();
} else {
this.$1F();
}
},
$1: function ($p0, $p1) {
if (($p0 & 1)) {
if (this.$16) {
window.clearTimeout(this.$16);
this.$16 = 0;
}
var $0 = $p1;
this.$D.dx -= $0.dx;
this.$D.dy += $0.dy;
this.$16 = window.setTimeout(this.$14, (!this.$7) ? 10 : 200);
} else if (($p0 & 2) && ($p0 & 64)) {
if (this.$17) {
window.clearTimeout(this.$17);
this.$17 = 0;
}
this.$1E = $p1;
var $1 = this.$4.$39();
if (this.$9.hasChildNodes()) {
for (var $4 = 0; $4 < this.$B.length; ++$4) {
(this.$B[$4]).$13();
}
for (var $5 = 0; $5 < this.$A.length; ++$5) {
(this.$A[$5]).$12();
}
this.$9.parentNode.insertBefore(this.$9, this.$8);
var $2 = this.$A;
this.$A = this.$B;
this.$B = $2;
var $3 = this.$8;
this.$8 = this.$9;
this.$9 = $3;
}
if (!this.$4.$24) {
this.$1A = RMap.$create_Vector($1.$5.dx, $1.$5.dy);
} else {
this.$1A = RMap.$create_Vector($1.$5.dx + this.$4.$24.dx, $1.$5.dy - this.$4.$24.dy);
}
this.$1B = 4;
this.$1C = ($1.$10() - this.$19) / this.$1B;
this.$21();
} else if (($p0 & 2) || ($p0 & 8)) {
if (this.$17) {
window.clearTimeout(this.$17);
this.$17 = 0;
}
if (($p0 & 2)) {
this.$17 = window.setTimeout(this.$15, (!this.$7) ? 10 : 100);
} else {
this.$17 = window.setTimeout(this.$15, (!this.$7) ? 100 : 500);
}
}
},
$21: function () {
this.$18 = 0;
if (this.$1B-- > 0) {
this.$19 += this.$1C;
for (var $0 = 0; $0 < this.$A.length; ++$0) {
(this.$A[$0]).$15(this.$1A, this.$19);
}
this.$18 = window.setTimeout(this.$1D, 0);
} else {
this.$1E.invoke();
}
},
$22: function () {
this.$23(false);
},
$23: function ($p0) {
if (this.$16) {
window.clearTimeout(this.$16);
this.$16 = 0;
}
var $0 = this.$4.$39();
var $1 = $0.$10();
var $2 = $0.$F();
var $3 = $0.$11();
this.$6 = this.$5.$A($1);
this.$C = ScriptFX.UI.$create_Size(Math.round(this.$5.$3.width * this.$6.$2 / $1), Math.round(this.$5.$3.height * this.$6.$2 / $1));
var $4 = ($2.x - this.$5.$1.x) / (this.$5.$3.width * this.$6.$2);
var $5 = (this.$5.$1.y - $2.y) / (this.$5.$3.height * this.$6.$2);
var $6 = Math.floor($3.width / this.$C.width) + 2 + RMap.MapApplication.tileBuffer * 2;
var $7 = Math.floor($3.height / this.$C.height) + 2 + RMap.MapApplication.tileBuffer * 2;
$6 += 1 - ($6 % 2);
$7 += 1 - ($7 % 2);
this.$E = ScriptFX.UI.$create_Size($6, $7);
var $8 = this.$F;
if (!$8) {
$p0 = false;
}
this.$F = RMap.$create__Cell(Math.floor($4), Math.floor($5));
this.$10 = RMap.$create__Cell(0, 0);
var $9 = $0.$14($2);
this.$11 = RMap.$create_Vector($9.x - Math.floor(($4 - this.$F.$0) * this.$C.width), $9.y - Math.floor(($5 - this.$F.$1) * this.$C.height));
this.$12 = ($6 - 1) / 2;
this.$13 = ($7 - 1) / 2;
var $A = Math.max(this.$12, this.$13);
var $B = {
};
var $C = {
};
var $D = [
];
var $E = 0;
if ($p0) {
for (var $10 = 0; $10 <= $A; ++$10) {
for (var $11 = - $10; $11 <= $10; ++$11) {
if (Math.abs($11) > this.$12) {
continue;
}
for (var $12 = - $10; $12 <= $10; ++$12) {
if (Math.abs($12) > this.$13) {
continue;
}
if (Math.abs($11) < $10 && Math.abs($12) < $10) {
continue;
}
var $13 = (this.$F.$0 + $11) + '_' + (this.$F.$1 + $12);
$B[$13] = $E;
$E++;
}
}
}
}
for (var $14 = 0; $14 < this.$B.length; ++$14) {
if ($p0 && (this.$B[$14]).$4) {
var $15 = ($8.$0 + (this.$B[$14]).$4.$0) + '_' + ($8.$1 + (this.$B[$14]).$4.$1);
if (Object.keyExists($B, $15)) {
$C[$15] = this.$B[$14];
} else {
$D[$D.length] = this.$B[$14];
}
} else {
$D[$D.length] = this.$B[$14];
}
}
var $F = [
];
$E = 0;
for (var $16 = 0; $16 <= $A; ++$16) {
for (var $17 = - $16; $17 <= $16; ++$17) {
if (Math.abs($17) > this.$12) {
continue;
}
for (var $18 = - $16; $18 <= $16; ++$18) {
if (Math.abs($18) > this.$13) {
continue;
}
if (Math.abs($17) < $16 && Math.abs($18) < $16) {
continue;
}
var $19 = (this.$F.$0 + $17) + '_' + (this.$F.$1 + $18);
if ($p0 && $C[$19]) {
$F[$E] = $C[$19];
($F[$E]).$E(RMap.$create__Cell($17, $18), false, true);
} else {
if ($D.length > 0) {
$F[$E] = $D[$D.length - 1];
$D.removeAt($D.length - 1);
} else {
$F[$E] = new RMap._Tile(this, this.$5.$4);
}($F[$E]).$E(RMap.$create__Cell($17, $18), true, false);
}
$E++;
}
}
}
for (var $1A = 0; $1A < $E; ++$1A) {
this.$B[$1A] = $F[$1A];
}
this.$B.removeRange($E, this.$B.length - $E);
for (var $1B = 0; $1B < $D.length; ++$1B) {
($D[$1B]).$D();
}
$C = null;
$D = null;
$F = null;
$B = null;
this.$D = RMap.$create_Vector(0, 0);
},
$24: function () {
this.$16 = 0;
if (RMap.MapApplication.tileBuffer > 0 && Math.abs(this.$D.dx) <= this.$C.width && Math.abs(this.$D.dy) <= this.$C.height) {
return;
}
if (Math.abs(this.$D.dx) > this.$C.width * this.$E.width || Math.abs(this.$D.dy) > this.$C.height * this.$E.height) {
this.$23(true);
return;
}
var $0 = this.$D.dx / this.$C.width;
var $1 = this.$D.dy / this.$C.height;
var $2 = Math.floor($0 + 0.5);
var $3 = Math.floor($1 + 0.5);
this.$D.dx = ($0 - $2) * this.$C.width;
this.$D.dy = ($1 - $3) * this.$C.height;
this.$10.$0 += $2;
this.$10.$1 += $3;
var $4 = null;
var $5 = null;
var $6 = null;
var $7 = null;
var $8 = [
];
for (var $9 = 0; $9 < this.$B.length; ++$9) {
var $A = RMap.$create__Cell((this.$B[$9]).$4.$0, (this.$B[$9]).$4.$1);
if ($A.$0 > this.$12 - this.$10.$0) {
$A.$0 -= this.$E.width;
} else if ($A.$0 < - this.$12 - this.$10.$0) {
$A.$0 += this.$E.width;
}
if ($A.$1 > this.$13 - this.$10.$1) {
$A.$1 -= this.$E.height;
} else if ($A.$1 < - this.$13 - this.$10.$1) {
$A.$1 += this.$E.height;
}
$4 = (isNull($4)) ? $A.$0 : Math.min($4, $A.$0);
$5 = (isNull($5)) ? $A.$0 : Math.max($5, $A.$0);
$6 = (isNull($6)) ? $A.$1 : Math.min($6, $A.$1);
$7 = (isNull($7)) ? $A.$1 : Math.max($7, $A.$1);
$8[$8.length] = $A;
}
if (!RMap.MapApplication.tileBuffer && this.$B.length > 0) {
var $B = Math.floor(this.$11.dx + ($4 * this.$C.width));
var $C = Math.floor(this.$11.dx + ($5 * this.$C.width)) + this.$C.width;
var $D = Math.floor(this.$11.dy + ($6 * this.$C.height));
var $E = Math.floor(this.$11.dy + ($7 * this.$C.height)) + this.$C.height;
var $F = this.$4.$39().$13();
if ($F.minX < $B || $F.maxX > $C || $F.minY < $D || $F.maxY > $E) {
this.$23(true);
return;
}
}
for (var $10 = 0; $10 < $8.length; ++$10) {
(this.$B[$10]).$E($8[$10], false, false);
}
},
$25: function () {
return this.$9;
},
$26: function () {
return this.$C;
},
$27: function ($p0) {
return ScriptFX.UI.$create_Location(Math.floor(this.$11.dx + ($p0.$0 * this.$C.width)), Math.floor(this.$11.dy + ($p0.$1 * this.$C.height)));
},
$28: function ($p0) {
return this.$5.$6(this.$6.$1, (this.$F.$1 + $p0.$1), (this.$F.$0 + $p0.$0));
},
$29: function () {
return this.$4.$39().$10();
}
}
RMap._TileSet = function (title, level, levelId, unitsPerPixel, url, servers) {
this.$0 = title;
this.$1 = level;
this.$4 = levelId;
this.$2 = unitsPerPixel;
this.$3 = url;
if (servers && !servers.length) {
servers = null;
}
this.$5 = servers;
}
RMap._TileSet.prototype = {
$0: null,
$1: 0,
$2: 0,
$3: null,
$4: null,
$5: null
}
RMap._TileSetProvider = function (csId, origin, envelope, tileSize, tileFormat) {
this.$0 = csId;
this.$1 = origin;
this.$2 = envelope;
this.$3 = tileSize;
this.$4 = tileFormat;
}
RMap._TileSetProvider.prototype = {
$0: null,
$1: null,
$2: null,
$3: null,
$4: null,
$5: null,
$8: function () {
var $0 = new Array(this.$5.length);
for (var $1 = 0; $1 < this.$5.length; $1++) {
$0[$1] = this.$5[$1].$2;
}
return $0;
},
$9: function ($p0) {
if ($p0 < 0) {
$p0 = 0;
} else if ($p0 > this.$5.length - 1) {
$p0 = this.$5.length - 1;
}
return this.$5[$p0];
},
$A: function ($p0) {
var $0 = 0;
var $1 = - 1;
for (var $2 = 0; $2 < this.$5.length; $2++) {
var $3 = Math.abs(this.$5[$2].$2 - $p0);
if ($3 < $1 || $1 === - 1) {
$1 = $3;
$0 = $2;
}
}
return this.$5[$0];
}
}
RMap.TileTheme = function () {
this.$0 = new Array(0);
this.$3 = - 1;
}
RMap.TileTheme.prototype = {
label: null,
title: null,
copyright: null,
$1: false,
$2: false,
$4: null,
$5: null,
$6: null,
$7: 0,
$8: false,
$9: null,
initializeFromRemoteSource: function (urls, map) {
this.$9 = map;
this.$6 = urls.clone();
this.$4 = Delegate.create(this, this.$A);
this.$5 = [
];
for (var $0 = 0; $0 < urls.length; $0++) {
var $1 = RMap.MapApplication.proxyUrl || RMap._DomHelper.$18(urls[$0], RMap._DomHelper.$14());
var $2 = null;
if ($1) {
$2 = new RMap.HttpContentLoader(RMap.MapApplication.proxyUrl, 'GET', false, 0);
} else {
$2 = new RMap.ScriptContentLoader(null, null, false, 0);
}
this.$5[this.$5.length] = $2;
}
for (var $3 = 0; $3 < this.$5.length; $3++) {
this.$5[$3].load(urls[$3], null, this.$4, null, null, urls[$3]);
}
},
$A: function ($p0, $p1, $p2, $p3, $p4) {
var $0 = false;
for (var $1 = 0; $1 < this.$6.length; $1++) {
if (this.$6[$1] === $p4) {
this.$7++;
this.$6[$1] = null;
$0 = true;
}
}
if ($0) {
if ($p2 !== 2 || $p3 !== 200) {
RMap.Messages.$2(null, RMap.Messages.settings_loadingProblem);
} else {
var $2 = RMap.XmlTools.xmlstr2xml($p0);
var $3 = $2.documentElement;
this.$0[this.$0.length] = RMap.MapSettingsLoader.$5($3);
}
}
if (this.$7 === this.$6.length && !this.$8) {
this.$8 = true;
this.$1 = true;
if (this.$9.getCurrentTheme() === this.label) {
this.$9.$40(this.label, true);
}
}
}
}
RMap._GridTileSetProvider = function (csId, origin, envelope, tileSize, tileFormat, tileSets) {
RMap._GridTileSetProvider.constructBase(this, [
csId,
origin,
envelope,
tileSize,
tileFormat
]);
this.$5 = tileSets;
}
RMap._GridTileSetProvider.prototype = {
$6: function ($p0, $p1, $p2) {
var $0 = this.$5[$p0].$3;
$0 = $0.replace(RMap._GridTileSetProvider.$B, this.$5[$p0].$4);
$0 = $0.replace(RMap._GridTileSetProvider.$C, $p1.toString());
$0 = $0.replace(RMap._GridTileSetProvider.$D, $p2.toString());
if (this.$5[$p0].$5) {
$0 = $0.replace(RMap._TileSetProvider.$7, this.$5[$p0].$5[Math.abs(($p2 + 2 * $p1) % this.$5[$p0].$5.length)]);
}
return $0;
}
}
RMap._EncodedGridTileSetProvider = function (csId, origin, envelope, tileSize, tileFormat, tileSets) {
RMap._EncodedGridTileSetProvider.constructBase(this, [
csId,
origin,
envelope,
tileSize,
tileFormat,
tileSets
]);
}
RMap._EncodedGridTileSetProvider.prototype = {
$6: function ($p0, $p1, $p2) {
var $0 = RMap._TEAE.$1(this.$5[$p0].$4 + '_' + $p1 + '_' + $p2, RMap._EncodedGridTileSetProvider.$E);
var $1 = this.$5[$p0].$3;
$1 = $1.replace(RMap._EncodedGridTileSetProvider.$F, $0);
if (this.$5[$p0].$5) {
$1 = $1.replace(RMap._TileSetProvider.$7, this.$5[$p0].$5[Math.abs(($p2 + 2 * $p1) % this.$5[$p0].$5.length)]);
}
return $1;
}
}
RMap._QuadtreeTileSetProvider = function (csId, origin, envelope, tileSize, tileFormat, tileSets, baseLevel, qtSequence) {
RMap._QuadtreeTileSetProvider.constructBase(this, [
csId,
origin,
envelope,
tileSize,
tileFormat
]);
this.$5 = tileSets;
this.$B = baseLevel;
if (qtSequence.join() !== '0123') {
this.$C = qtSequence;
} else {
this.$C = null;
}
}
RMap._QuadtreeTileSetProvider.prototype = {
$B: 0,
$C: null,
$6: function ($p0, $p1, $p2) {
var $0 = new StringBuilder();
for (var $3 = this.$B - parseInt(this.$5[$p0].$4); $3 > 0; $3--) {
var $4 = 0;
var $5 = 1 << ($3 - 1);
if (($p2 & $5)) {
$4++;
}
if (($p1 & $5)) {
$4++;
$4++;
}
$0.append($4);
}
var $1 = $0.toString();
if (this.$C) {
$0.clear();
for (var $6 = 0; $6 < $1.length; $6++) {
$0.append(this.$C[parseInt($1.substr($6, 1))]);
}
}
$1 = $0.toString();
var $2 = this.$5[$p0].$3.replace(RMap._QuadtreeTileSetProvider.$D, $1);
if (this.$5[$p0].$5) {
$2 = $2.replace(RMap._TileSetProvider.$7, this.$5[$p0].$5[Math.abs(($p2 + 2 * $p1) % this.$5[$p0].$5.length)]);
}
return $2;
}
}
RMap._TimeoutInvoker = function () {
this.$6 = Delegate.create(this, this.$B);
}
RMap._TimeoutInvoker.prototype = {
$2: null,
$3: null,
$4: null,
$5: null,
$6: null,
$7: 0,
$8: 0,
$9: function ($p0, $p1, $p2, $p3) {
this.$A();
this.$2 = $p0;
this.$3 = $p1;
this.$4 = $p2;
this.$5 = $p3;
this.$7 = window.setTimeout(this.$6, RMap._TimeoutInvoker.$1);
},
$A: function () {
if (this.$7) {
window.clearTimeout(this.$7);
}
this.$7 = 0;
this.$8 = 0;
this.$2 = null;
this.$3 = null;
},
$B: function () {
if (!this.$2) {
return;
}
if (!this.$8 && this.$4) {
this.$4.invoke();
}
if (this.$8 >= this.$2.length) {
if (this.$5) {
this.$5.invoke();
}
this.$2 = null;
this.$7 = 0;
return;
}
var $0 = Date.get_now().getTime();
while (this.$8 < this.$2.length && Date.get_now().getTime() - $0 < RMap._TimeoutInvoker.$0) {
this.$3.invoke(this.$2[this.$8]);
this.$8++;
}
this.$7 = window.setTimeout(this.$6, RMap._TimeoutInvoker.$1);
}
}
RMap._DictionaryUtils = function () {
}
RMap._DictionaryUtils.$0 = function ($p0) {
var $0 = [
];
var $dict1 = $p0;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
$0.add($1.value);
}
return $0;
}
RMap._DictionaryUtils.$1 = function ($p0) {
var $0 = [
];
var $dict1 = $p0;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
$0.add($1.key);
}
return $0;
}
RMap._DictionaryUtils.$2 = function ($p0) {
var $0 = {
};
var $dict1 = $p0;
for (var $key2 in $dict1) {
var $1 = {
key: $key2,
value: $dict1[$key2]
};
$0[$1.key] = $1.value;
}
return $0;
}
RMap._DictionaryUtils.$3 = function ($p0) {
var $0 = 0;
if (String.isNullOrEmpty($p0)) {
return $0;
}
for (var $1 = 0; $1 < $p0.length; $1++) {
var $2 = $p0.charCodeAt($1);
$0 = (($0 << 5) - $0) + $2;
$0 = $0 & $0;
}
return $0;
}
RMap._ViewChangeEventArgs = function (action) {
RMap._ViewChangeEventArgs.constructBase(this);
this.$1_0 = action;
}
RMap._ViewChangeEventArgs.prototype = {
$1_0: 0
}
RMap._View = function (map, coordinateSystem, center, unitsPerPixel, displaySize) {
this.$0 = map;
this.$1 = coordinateSystem;
this.$2 = center;
this.$3 = unitsPerPixel;
this.$4 = displaySize;
this.$5 = RMap.$create_Vector(0, 0);
this.$6 = RMap.$create_Vector(displaySize.width / 2, displaySize.height / 2);
}
RMap._View.prototype = {
$0: null,
$1: null,
$2: null,
$3: 0,
$4: null,
$5: null,
$6: null,
$7: function ($p0, $p1) {
if (this.$2.x === $p0 && this.$2.y === $p1) {
return RMap.$create_Vector(0, 0);
}
var $0 = RMap.$create_Vector(($p0 - this.$2.x) / this.$3, ($p1 - this.$2.y) / this.$3);
this.$2.x = $p0;
this.$2.y = $p1;
this.$D($0.dx, $0.dy);
this.$0.$36(1);
return $0;
},
$8: function ($p0) {
if (this.$3 === $p0) {
return;
}
this.$3 = $p0;
this.$0.$36(2);
},
$9: function ($p0, $p1) {
if (this.$3 === $p0) {
return RMap.$create_Vector(0, 0);
}
var $0 = this.$3 / $p0;
var $1 = this.$2.x + ($p1.x - this.$2.x) * ($0 - 1) / $0;
var $2 = this.$2.y + ($p1.y - this.$2.y) * ($0 - 1) / $0;
var $3;
if (this.$3 > $p0) {
$3 = RMap.$create_Vector((this.$2.x - $1) / $p0, (this.$2.y - $2) / $p0);
} else {
$3 = RMap.$create_Vector(($1 - this.$2.x) / this.$3, ($2 - this.$2.y) / this.$3);
}
this.$2.x = $1;
this.$2.y = $2;
this.$3 = $p0;
this.$0.$36(2);
return $3;
},
$A: function ($p0, $p1) {
this.$6.dx += ($p0 - this.$4.width) / 2;
this.$6.dy += ($p1 - this.$4.height) / 2;
this.$4.width = $p0;
this.$4.height = $p1;
},
$B: function ($p0, $p1) {
if (!$p0 && !$p1) {
return RMap.$create_Vector(0, 0);
}
this.$D($p0, $p1);
this.$2.x += $p0 * this.$3;
this.$2.y += $p1 * this.$3;
this.$0.$36(1);
return RMap.$create_Vector($p0, $p1);
},
$C: function () {
this.$D(this.$6.dx, - this.$6.dy);
},
$D: function ($p0, $p1) {
this.$5.dx -= $p0;
this.$5.dy += $p1;
this.$6.dx -= $p0;
this.$6.dy += $p1;
},
$E: function () {
return this.$1;
},
$F: function () {
return this.$2;
},
$10: function () {
return this.$3;
},
$11: function () {
return this.$4;
},
$12: function () {
return new RMap.Envelope(this.$2.x - this.$4.width / 2 * this.$3, this.$2.y - this.$4.height / 2 * this.$3, this.$2.x + this.$4.width / 2 * this.$3, this.$2.y + this.$4.height / 2 * this.$3);
},
$13: function () {
return new RMap.Envelope(Math.floor( - this.$6.dx), Math.floor( - this.$6.dy), Math.ceil( - this.$6.dx + this.$4.width), Math.ceil( - this.$6.dy + this.$4.height));
},
$14: function ($p0) {
return RMap.$create_Coordinate(($p0.x - this.$2.x) / this.$3 - this.$5.dx, (this.$2.y - $p0.y) / this.$3 - this.$5.dy);
},
$15: function ($p0) {
return RMap.$create_Coordinate(($p0.x + this.$5.dx) * this.$3 + this.$2.x, this.$2.y - ($p0.y + this.$5.dy) * this.$3);
},
$16: function ($p0, $p1, $p2) {
var $0 = $p1 * this.$3;
var $1 = new Array(0);
$1[0] = Math.round(($p0[0] - this.$2.x) / this.$3 - this.$5.dx);
$1[1] = Math.round((this.$2.y - $p0[1]) / this.$3 - this.$5.dy);
var $2 = 2;
var $3 = 2;
var $4 = 0;
for (; $2 < $p0.length - $p2; $2 += $p2) {
if (Math.abs($p0[$2] - $p0[$4]) < $0 && Math.abs($p0[$2 + 1] - $p0[$4 + 1]) < $0) {
continue;
}
$1[$3] = Math.round(($p0[$2] - this.$2.x) / this.$3 - this.$5.dx);
$1[$3 + 1] = Math.round((this.$2.y - $p0[$2 + 1]) / this.$3 - this.$5.dy);
$3 += 2;
$4 = $2;
for (var $5 = 0; $5 < $p2 - 2; $5 += 2) {
$2 += 2;
$1[$3] = Math.round(($p0[$2] - this.$2.x) / this.$3 - this.$5.dx);
$1[$3 + 1] = Math.round((this.$2.y - $p0[$2 + 1]) / this.$3 - this.$5.dy);
$3 += 2;
}
}
for (var $6 = 0; $6 < $p2 - 2; $6 += 2) {
$2 += 2;
$1[$3] = Math.round(($p0[$2] - this.$2.x) / this.$3 - this.$5.dx);
$1[$3 + 1] = Math.round((this.$2.y - $p0[$2 + 1]) / this.$3 - this.$5.dy);
$3 += 2;
}
$1[$3] = Math.round(($p0[$2] - this.$2.x) / this.$3 - this.$5.dx);
$1[$3 + 1] = Math.round((this.$2.y - $p0[$2 + 1]) / this.$3 - this.$5.dy);
return $1;
},
$17: function ($p0) {
return RMap.$create_Coordinate(this.$2.x - (this.$6.dx - $p0.left - this.$5.dx) * this.$3, this.$2.y - ( - this.$6.dy + $p0.top + this.$5.dy) * this.$3);
},
$18: function ($p0) {
return ScriptFX.UI.$create_Location(Math.round(($p0.x - this.$2.x) / this.$3 + (this.$6.dx - this.$5.dx)), Math.round((this.$2.y - $p0.y) / this.$3 - ( - this.$6.dy + this.$5.dy)));
},
$19: function ($p0, $p1) {
return ScriptFX.UI.$create_Location(Math.round(($p0.x - this.$2.x) / $p1 + (this.$6.dx - this.$5.dx)), Math.round((this.$2.y - $p0.y) / $p1 - ( - this.$6.dy + this.$5.dy)));
},
$1A: function () {
var $0 = RMap.CoordinateSystem.$1(this.$1, this.$2.x, this.$2.y);
return $0 * this.$3;
}
}
RMap._Graphics = function () {
}
RMap._Graphics.prototype = {
$0: 0,
$1: null,
$5: function () {
if (this.$1 && this.$1.parentNode) {
this.$1.parentNode.removeChild(this.$1);
}
this.$1 = null;
}
}
RMap._VMLGraphics = function (type) {
RMap._VMLGraphics.constructBase(this);
this.$0 = type;
this.$1 = document.createElement('v:shape');
this.$1.style.position = 'absolute';
this.$1.style.width = '1000px';
this.$1.style.height = '1000px';
this.$1.unselectable = 'on';
this.$1.path = '';
this.$6 = document.createElement('v:stroke');
this.$6.weight = 5;
this.$6.joinstyle = 'round';
this.$6.color = '#000000';
this.$6.endcap = 'round';
this.$6.opacity = '0.5';
this.$6.dashstyle = 'solid';
this.$7 = document.createElement('v:fill');
this.$7.color = '#0000FF';
this.$7.opacity = '0.2';
this.$1.appendChild(this.$7);
this.$1.appendChild(this.$6);
}
RMap._VMLGraphics.prototype = {
$6: null,
$7: null,
$2: function ($p0, $p1) {
var $0 = ($p1 === 4) ? 6 : 2;
var $1 = ($p1 === 4) ? ' c ' : ' l ';
var $2 = new StringBuilder();
for (var $3 = 0; $3 < $p0.length; ++$3) {
var $4 = $p0[$3];
$2.append(' m ' + $4[0] + ',' + $4[1] + $1);
if ($p1 === 1) {
$2.append(($4[0] + 1) + ',' + ($4[1] + 1) + ' ');
} else {
for (var $5 = 2; $5 < $4.length; $5 += 2) {
$2.append($4[$5] + ',' + $4[$5 + 1] + ' ');
}
}
}
$2.append(' e');
this.$1.path = $2.toString();
},
$3: function () {
this.$1.path = 'm 0 0';
},
$4: function ($p0) {
if (!isNullOrUndefined($p0.strokeColor)) {
this.$6.color = $p0.strokeColor;
}
if (!isNullOrUndefined($p0.strokeType)) {
this.$6.dashstyle = RMap._StyleHelper.$0($p0.strokeType, $p0.strokeWidth);
}
if (!isNullOrUndefined($p0.strokeOpacity)) {
this.$6.opacity = $p0.strokeOpacity / 100;
}
if (!isNullOrUndefined($p0.strokeWidth)) {
this.$6.weight = $p0.strokeWidth;
}
if (this.$0 === 3 && $p0.fillColor !== 'transparent') {
if (!isNullOrUndefined($p0.fillOpacity)) {
this.$7.opacity = $p0.fillOpacity / 100;
}
if (!isNullOrUndefined($p0.fillColor)) {
this.$7.color = $p0.fillColor;
this.$1.filled = true;
}
} else {
this.$1.filled = false;
}
},
$5: function () {
this.$1.removeChild(this.$7);
this.$1.removeChild(this.$6);
this.$7 = null;
this.$6 = null;
RMap._VMLGraphics.callBase(this, '$5');
}
}
RMap._SVGGraphics = function (type) {
RMap._SVGGraphics.constructBase(this);
this.$0 = type;
this.$1 = RMap._DomHelper.$2('http://www.w3.org/2000/svg', 'path');
this.$1.style.position = 'absolute';
this.$1.style.width = '1000px';
this.$1.style.height = '1000px';
this.$1.setAttribute('unselectable', 'on');
this.$1.setAttribute('stroke', '#000000');
this.$1.setAttribute('stroke-width', '5');
this.$1.setAttribute('stroke-opacity', '0.5');
this.$1.setAttribute('stroke-linejoin', 'round');
this.$1.setAttribute('fill', 'none');
this.$1.setAttribute('fill-opacity', '0.2');
this.$1.setAttribute('filled', 'none');
if (!(this.$1) ['attachEvent']) {
(this.$1) ['attachEvent'] = (((window.self) ['HTMLElement']) ['prototype']) ['attachEvent'];
(this.$1) ['detachEvent'] = (((window.self) ['HTMLElement']) ['prototype']) ['detachEvent'];
}
}
RMap._SVGGraphics.prototype = {
$2: function ($p0, $p1) {
var $0 = ($p1 === 4) ? 6 : 2;
var $1 = ($p1 === 4) ? ' C ' : ' L ';
var $2 = new StringBuilder();
for (var $3 = 0; $3 < $p0.length; ++$3) {
var $4 = $p0[$3];
$2.append(' M ' + $4[0] + ' ' + $4[1] + $1);
for (var $5 = 2; $5 < $4.length; $5 += 2) {
$2.append($4[$5] + ' ' + $4[$5 + 1] + ' ');
}
}
this.$1.setAttribute('d', $2.toString());
},
$3: function () {
this.$1.setAttribute('d', '');
},
$4: function ($p0) {
if (!isNullOrUndefined($p0.strokeColor)) {
this.$1.setAttribute('stroke', $p0.strokeColor);
}
if (!isNullOrUndefined($p0.strokeType)) {
this.$1.setAttribute('stroke-dasharray', RMap._StyleHelper.$0($p0.strokeType, $p0.strokeWidth));
}
if (!isNullOrUndefined($p0.strokeOpacity)) {
this.$1.setAttribute('stroke-opacity', $p0.strokeOpacity / 100);
}
if (!isNullOrUndefined($p0.strokeWidth)) {
this.$1.setAttribute('stroke-width', $p0.strokeWidth);
}
if (this.$0 === 3 && $p0.fillColor !== 'transparent') {
if (!isNullOrUndefined($p0.fillOpacity)) {
this.$1.setAttribute('fill-opacity', $p0.fillOpacity / 100);
}
if (!isNullOrUndefined($p0.fillColor)) {
this.$1.setAttribute('fill', $p0.fillColor);
this.$1.setAttribute('filled', '');
}
} else {
this.$1.setAttribute('fill', 'none');
this.$1.setAttribute('filled', 'none');
}
},
$5: function () {
RMap._SVGGraphics.callBase(this, '$5');
}
}
RMap.XmlTools = function () {
}
RMap.XmlTools.xmlstr2xml = function (tab) {
throw new Error(RMap.XmlTools.notImplementedMsg);
}
RMap.XmlTools.xml2json = function (doc) {
throw new Error(RMap.XmlTools.notImplementedMsg);
}
RMap.XmlTools.parseDate = function (dat) {
throw new Error(RMap.XmlTools.notImplementedMsg);
}
RMap.XmlTools.getNodeAtributeValue = function (n) {
return (!n.text) ? n.value : n.text;
}
RMap.JsonTools = function () {
}
RMap.JsonTools.obj2json = function (obj, clean) {
throw new Error(RMap.JsonTools.notImplementedMsg);
}
RMap._Clipping.createClass('RMap._Clipping');
RMap.Command.createClass('RMap.Command');
RMap._ContexMenu.createClass('RMap._ContexMenu');
RMap._ExternalMapControl.createClass('RMap._ExternalMapControl', null, RMap.IMapControl);
RMap.IndicatorControl.createClass('RMap.IndicatorControl', null, RMap.IMapControl);
RMap.MessageControl.createClass('RMap.MessageControl', null, RMap.IMapControl);
RMap._ZoomControl.createClass('RMap._ZoomControl', null, RMap.IMapControl);
RMap._AttributeEditor.createClass('RMap._AttributeEditor', null, RMap.IMapControl);
RMap._PropertyEditor.createClass('RMap._PropertyEditor');
RMap._TextFieldEditor.createClass('RMap._TextFieldEditor', RMap._PropertyEditor);
RMap._NumberFieldEditor.createClass('RMap._NumberFieldEditor', RMap._PropertyEditor);
RMap._BooleanFieldEditor.createClass('RMap._BooleanFieldEditor', RMap._PropertyEditor);
RMap._LongTextFieldEditor.createClass('RMap._LongTextFieldEditor', RMap._PropertyEditor);
RMap._ObjectFieldEditor.createClass('RMap._ObjectFieldEditor', RMap._PropertyEditor);
RMap.Drawing.createClass('RMap.Drawing');
RMap._EditableShape.createClass('RMap._EditableShape', RMap.Drawing);
RMap._Marker.createClass('RMap._Marker', RMap.Drawing);
RMap._EditablePushpin.createClass('RMap._EditablePushpin', RMap._Marker);
RMap._EditControl.createClass('RMap._EditControl', null, RMap.IMapControl);
RMap.Layer.createClass('RMap.Layer');
RMap.DrawingLayer.createClass('RMap.DrawingLayer', RMap.Layer);
RMap._EditLayer.createClass('RMap._EditLayer', RMap.DrawingLayer);
RMap.MouseEventArgs.createClass('RMap.MouseEventArgs', EventArgs);
RMap._MouseTool.createClass('RMap._MouseTool');
RMap._PaletteCollection.createClass('RMap._PaletteCollection');
RMap._Palette.createClass('RMap._Palette');
RMap._PaletteItem.createClass('RMap._PaletteItem');
RMap._Container.createClass('RMap._Container');
RMap._Picker.createClass('RMap._Picker');
RMap._PickerItem.createClass('RMap._PickerItem');
RMap._PalettePicker.createClass('RMap._PalettePicker', RMap._Picker);
RMap._PalettepickerItem.createClass('RMap._PalettepickerItem', RMap._PickerItem);
RMap._IconPicker.createClass('RMap._IconPicker', RMap._Picker);
RMap._IconpickerItem.createClass('RMap._IconpickerItem', RMap._PickerItem);
RMap._ColorPicker.createClass('RMap._ColorPicker', RMap._Picker);
RMap._ColorpickerItem.createClass('RMap._ColorpickerItem', RMap._PickerItem);
RMap._StroketypePicker.createClass('RMap._StroketypePicker', RMap._Picker);
RMap._StroketypePickerItem.createClass('RMap._StroketypePickerItem', RMap._PickerItem);
RMap._StrokewidthPicker.createClass('RMap._StrokewidthPicker', RMap._Picker);
RMap._StrokewidthPickerItem.createClass('RMap._StrokewidthPickerItem', RMap._PickerItem);
RMap._EditVertex.createClass('RMap._EditVertex');
RMap._EditLine.createClass('RMap._EditLine');
RMap.FeatureSerializer.createClass('RMap.FeatureSerializer');
RMap.GeoRssSerializer.createClass('RMap.GeoRssSerializer', RMap.FeatureSerializer);
RMap.RmlSerializer.createClass('RMap.RmlSerializer', RMap.FeatureSerializer);
RMap.WktSerializer.createClass('RMap.WktSerializer', RMap.FeatureSerializer);
RMap.GeoJsonSerializer.createClass('RMap.GeoJsonSerializer', RMap.FeatureSerializer);
RMap._StorageSaver.createClass('RMap._StorageSaver');
RMap.ContentLoader.createClass('RMap.ContentLoader');
RMap.HttpContentLoader.createClass('RMap.HttpContentLoader', RMap.ContentLoader);
RMap.ScriptContentLoader.createClass('RMap.ScriptContentLoader', RMap.ContentLoader);
RMap.LoadRequest.createClass('RMap.LoadRequest');
RMap.ImageFeature.createClass('RMap.ImageFeature');
RMap.ImageLayer.createClass('RMap.ImageLayer', RMap.Layer);
RMap.Panel.createClass('RMap.Panel');
RMap.ImageLayerPanel.createClass('RMap.ImageLayerPanel', RMap.Panel);
RMap._ImagePanelItem.createClass('RMap._ImagePanelItem');
RMap.LayerPanel.createClass('RMap.LayerPanel', RMap.Panel);
RMap.RoutingPanel.createClass('RMap.RoutingPanel', RMap.LayerPanel);
RMap.FeatureDeserializer.createClass('RMap.FeatureDeserializer');
RMap.RoutingDeserializer.createClass('RMap.RoutingDeserializer', RMap.FeatureDeserializer);
RMap.Styler.createClass('RMap.Styler');
RMap.RoutingStyler.createClass('RMap.RoutingStyler', RMap.Styler);
RMap.RoutingEventArgs.createClass('RMap.RoutingEventArgs', EventArgs);
RMap.RoutingPoint.createClass('RMap.RoutingPoint');
RMap.Routing.createClass('RMap.Routing');
RMap.RoutingSettings.createClass('RMap.RoutingSettings');
RMap._TEAE.createClass('RMap._TEAE');
RMap._MsgEventArgs.createClass('RMap._MsgEventArgs', EventArgs);
RMap.Messages.createClass('RMap.Messages');
RMap.MapApplication.createClass('RMap.MapApplication');
RMap._NavigationControl.createClass('RMap._NavigationControl', null, RMap.IMapControl);
RMap._MapOverviewControl.createClass('RMap._MapOverviewControl', null, RMap.IMapControl);
RMap.ScaleBarControl.createClass('RMap.ScaleBarControl', null, RMap.IMapControl);
RMap._ThemeSelectorControl.createClass('RMap._ThemeSelectorControl', null, RMap.IMapControl);
RMap.CollectionChangedEventArgs.createClass('RMap.CollectionChangedEventArgs', EventArgs);
RMap.Feature.createClass('RMap.Feature');
RMap.WktDeserializer.createClass('RMap.WktDeserializer', RMap.FeatureDeserializer);
RMap.JsonDeserializer.createClass('RMap.JsonDeserializer', RMap.FeatureDeserializer);
RMap.GeoJsonDeserializer.createClass('RMap.GeoJsonDeserializer', RMap.FeatureDeserializer);
RMap.CSVDeserializer.createClass('RMap.CSVDeserializer', RMap.FeatureDeserializer);
RMap.GeoRssDeserializer.createClass('RMap.GeoRssDeserializer', RMap.FeatureDeserializer);
RMap.KMLDeserializer.createClass('RMap.KMLDeserializer', RMap.FeatureDeserializer);
RMap.GPXDeserializer.createClass('RMap.GPXDeserializer', RMap.FeatureDeserializer);
RMap.RmlDeserializer.createClass('RMap.RmlDeserializer', RMap.FeatureDeserializer);
RMap.IOEventArgs.createClass('RMap.IOEventArgs', EventArgs);
RMap.FeatureSource.createClass('RMap.FeatureSource');
RMap.FeatureStorage.createClass('RMap.FeatureStorage', RMap.FeatureSource);
RMap.RemoteFeatureStorage.createClass('RMap.RemoteFeatureStorage', RMap.FeatureStorage);
RMap.MRemoteFeatureStorage.createClass('RMap.MRemoteFeatureStorage', RMap.RemoteFeatureStorage);
RMap.MapSettingsLoader.createClass('RMap.MapSettingsLoader');
RMap._OptimalContainer.createClass('RMap._OptimalContainer');
RMap._PanelItem.createClass('RMap._PanelItem');
RMap.PanelEventArgs.createClass('RMap.PanelEventArgs', EventArgs);
RMap.PanelContainer.createClass('RMap.PanelContainer');
RMap.CustomStyler.createClass('RMap.CustomStyler', RMap.Styler);
RMap._LegendRule.createClass('RMap._LegendRule');
RMap._LegendStyler.createClass('RMap._LegendStyler', RMap.Styler);
RMap.FeatureReader.createClass('RMap.FeatureReader');
RMap.Property.createClass('RMap.Property');
RMap.FeatureSchema.createClass('RMap.FeatureSchema');
RMap.FeatureView.createClass('RMap.FeatureView', RMap.FeatureSource);
RMap._GeometryOperation.createClass('RMap._GeometryOperation');
RMap._InfoWindow.createClass('RMap._InfoWindow', RMap.Layer);
RMap.MapControl.createClass('RMap.MapControl');
RMap.CoordinateSystem.createClass('RMap.CoordinateSystem');
RMap._DomHelper.createClass('RMap._DomHelper');
RMap._Environment.createClass('RMap._Environment');
RMap.Browser.createClass('RMap.Browser');
RMap.DrawingEventArgs.createClass('RMap.DrawingEventArgs', EventArgs);
RMap.StateChangedEventArgs.createClass('RMap.StateChangedEventArgs', EventArgs);
RMap.SimpleDrawingLayer.createClass('RMap.SimpleDrawingLayer', RMap.DrawingLayer);
RMap.CanvasLayer.createClass('RMap.CanvasLayer', RMap.Layer);
RMap.Envelope.createClass('RMap.Envelope');
RMap.Geometry.createClass('RMap.Geometry');
RMap._KeyboardTool.createClass('RMap._KeyboardTool');
RMap.Map.createClass('RMap.Map');
RMap.MapSettings.createClass('RMap.MapSettings');
RMap._Shape.createClass('RMap._Shape', RMap.Drawing);
RMap.DrawingStyle.createClass('RMap.DrawingStyle');
RMap.PointStyle.createClass('RMap.PointStyle', RMap.DrawingStyle);
RMap.ImageSymbolPointStyle.createClass('RMap.ImageSymbolPointStyle', RMap.PointStyle);
RMap.MarkerStyle.createClass('RMap.MarkerStyle', RMap.ImageSymbolPointStyle);
RMap.TextSymbolPointStyle.createClass('RMap.TextSymbolPointStyle', RMap.PointStyle);
RMap.CompositePointStyle.createClass('RMap.CompositePointStyle', RMap.PointStyle);
RMap.ShapeStyle.createClass('RMap.ShapeStyle', RMap.DrawingStyle);
RMap._StyleIconGenerator.createClass('RMap._StyleIconGenerator');
RMap._StyleHelper.createClass('RMap._StyleHelper');
RMap._Tile.createClass('RMap._Tile');
RMap._TileLayer.createClass('RMap._TileLayer', RMap.Layer);
RMap._TileSet.createClass('RMap._TileSet');
RMap._TileSetProvider.createClass('RMap._TileSetProvider');
RMap.TileTheme.createClass('RMap.TileTheme');
RMap._GridTileSetProvider.createClass('RMap._GridTileSetProvider', RMap._TileSetProvider);
RMap._EncodedGridTileSetProvider.createClass('RMap._EncodedGridTileSetProvider', RMap._GridTileSetProvider);
RMap._QuadtreeTileSetProvider.createClass('RMap._QuadtreeTileSetProvider', RMap._TileSetProvider);
RMap._TimeoutInvoker.createClass('RMap._TimeoutInvoker');
RMap._DictionaryUtils.createClass('RMap._DictionaryUtils');
RMap._ViewChangeEventArgs.createClass('RMap._ViewChangeEventArgs', EventArgs);
RMap._View.createClass('RMap._View');
RMap._Graphics.createClass('RMap._Graphics');
RMap._VMLGraphics.createClass('RMap._VMLGraphics', RMap._Graphics);
RMap._SVGGraphics.createClass('RMap._SVGGraphics', RMap._Graphics);
RMap.XmlTools.createClass('RMap.XmlTools');
RMap.JsonTools.createClass('RMap.JsonTools');
RMap.RoutingSettings.serviceUrl = '';
RMap.RoutingSettings.transformer = 'xslt/rmap1.xslt';
RMap.RoutingSettings.geocodingUrl = '';
RMap.RoutingSettings.geocodingTolerance = 1000;
RMap.RoutingSettings.maxViaNumber = 255;
RMap.RoutingSettings.decimalPlaces = 1;
RMap.RoutingSettings.autoReload = true;
RMap.RoutingSettings.message = 'Iskanje poti poteka po državnih in regionalnih cestah na obmoèju Republike Slovenije. Iskanje poti po lokalnih cestah in ulicah ni možno. Èas poti je ocenjen na podlagi najvišje dovoljene hitrosti na posameznem cestnem odseku, pri tem pa niso upoštevane morebitne upoèasnitve zaradi semaforjev, zastojev ali drugih vzrokov.';
RMap.RoutingSettings.geocoding_requestProblem = 'Težava pri poizvedbi na lokacijo.';
RMap.RoutingSettings.geocoding_noRoad = 'V bližini ni ceste.';
RMap.RoutingSettings.fastest = 'izraèunaj nahitrejšo pot';
RMap.RoutingSettings.shortest = 'izraèunaj najkrajšo pot';
RMap.RoutingSettings.reverse = 'obrni pot';
RMap.RoutingSettings.clear = 'poèisti pot';
RMap.RoutingSettings.category = 'razred';
RMap.RoutingSettings.category3 = 'R3';
RMap.RoutingSettings.category4 = 'R4';
RMap.RoutingSettings.start = 'Zaèetek poti';
RMap.RoutingSettings.via = 'Vmesna postaja';
RMap.RoutingSettings.end = 'Konec poti';
RMap.RoutingSettings.remove = 'Odstrani';
RMap.RoutingSettings.caption = 'Naèrtovana pot';
RMap.RoutingSettings.messageACHC = '';
RMap._TEAE.$0 = '1234567890123456';
RMap._TEAE.$9 = '0123456789ABCDEF';
RMap.Messages.$1 = null;
RMap.Messages.layer_saved = 'Sloj je bil uspešno shranjen.';
RMap.Messages.layer_savingProblem = 'Težava pri shranjevanju: {errorMessage}';
RMap.Messages.layer_editing = 'urejanje: ';
RMap.Messages.settings_loadingProblem = 'Težava pri nalaganju nastavitev RMap.';
RMap.Messages.settings_processingProblem = 'Težava pri procesiraju nastavitev RMap: {errorMessage}';
RMap.Messages.settings_noTileset = 'Running application with no tileSets is not supported';
RMap.Messages.eddrRem = 'Editirani element je bil odstranjen.';
RMap.Messages.eddrFlt = 'Editirani element je bil odfiltriran.';
RMap.Messages.eddrRef = 'Editirani element je bil osvežen.';
RMap.Messages.eddrUpd = 'Editirani element je bil spremenjen.';
RMap.Messages.itemCount = 'št. elementov: ';
RMap.Messages.notSaved = 'Spremembe uporabniških slojev niso shranjene.';
RMap.MapApplication.version = '2.1.1';
RMap.MapApplication.tileTreshold = 0.5;
RMap.MapApplication.tileBuffer = 1;
RMap.MapApplication.tileLoadTimeout = 250;
RMap.MapApplication.tileLoadShortTimeout = 100;
RMap.MapApplication.appInternalZoomLevels = null;
RMap.MapApplication.enableVersionChecking = true;
RMap.MapApplication.$0 = null;
RMap.MapApplication.$1 = null;
RMap.MapApplication.$2 = null;
RMap.MapApplication.resourcesUrl = null;
RMap.MapApplication.paletteUrl = null;
RMap.MapApplication.proxyUrl = null;
RMap.MapApplication.swUrl = null;
RMap.MapApplication.saverUrl = null;
RMap.MapApplication.settingsUrl = null;
RMap.MapApplication.settingsXml = null;
RMap.MapApplication.reloadBtn = 'Common/reload.png';
RMap.MapApplication.failedBtn = 'Common/reload-error.png';
RMap.MapApplication.doneBtn = 'Common/accept.png';
RMap.MapApplication.waitBtn = 'Common/hourglass.png';
RMap.MapApplication.filter1Btn = 'Common/filtersort-on.png';
RMap.MapApplication.filter0Btn = 'Common/filtersort-off.png';
RMap.MapApplication.save1Btn = 'Common/save_red.gif';
RMap.MapApplication.save0Btn = 'Common/save_gray.gif';
RMap.MapApplication.edit1Btn = 'Common/edit.gif';
RMap.MapApplication.edit0Btn = 'Common/locked.gif';
RMap.MapApplication.closeBtn = 'Common/close.gif';
RMap.MapApplication.menuBtn = 'Common/menu.png';
RMap.MapApplication.indImg = 'Controls/hourglass.gif';
RMap.MapApplication.$3 = false;
RMap.MapApplication.$4 = [
];
RMap.MapApplication.$5 = null;
RMap.MapApplication.$6 = RMap.MapApplication.$7();
RMap._MapOverviewControl.$F = 200;
RMap.CoordinateSystem.$0 = {
};
RMap._DomHelper.$13 = null;
RMap._DomHelper.$1D = null;
RMap._Environment.$2 = null;
RMap.Browser.crsPointer = (ScriptFX.Application.current.get_host().get_name() === 1 && ScriptFX.Application.current.get_host().get_version() < 6) ? 'hand' : 'pointer';
RMap.Browser.$0 = null;
RMap._StyleIconGenerator.$0 = ScriptFX.UI.$create_Size(30, 5);
RMap._TileSetProvider.$7 = new RegExp('{SERVER}');
RMap._GridTileSetProvider.$B = new RegExp('{LEVEL}');
RMap._GridTileSetProvider.$C = new RegExp('{ROW}');
RMap._GridTileSetProvider.$D = new RegExp('{COLUMN}');
RMap._EncodedGridTileSetProvider.$E = null;
RMap._EncodedGridTileSetProvider.$F = new RegExp('{ETILE}');
RMap._QuadtreeTileSetProvider.$D = new RegExp('{QUADTREE}');
RMap._TimeoutInvoker.$0 = 100;
RMap._TimeoutInvoker.$1 = 50;
RMap.XmlTools.notImplementedMsg = 'Not implemented. This method is suposed to be included as an external tool.';
RMap.JsonTools.notImplementedMsg = 'Not implemented. This method is suposed to be included as an external tool.';
// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------
RMap.XmlTools.xmlstr2xml = function (xml)
{
var dom = null;
try
{
if (window.DOMParser)
{
dom = (new DOMParser()).parseFromString(xml, 'text/xml');
} 
else if (window.ActiveXObject)
{
dom = new ActiveXObject('Microsoft.XMLDOM');
dom.async = false;
if (!dom.loadXML(xml)) return null;
}
} 
catch (e)
{
}
return dom;
}
RMap.XmlTools.xml2json = function (xml) {
var X = {
toObj: function (xml) {
var o = {
};
if (xml.nodeType == 1) {
if (xml.attributes.length)
for (var i = 0; i < xml.attributes.length; i++)
o[xml.attributes[i].nodeName.replace(':', '_')] = (xml.attributes[i].nodeValue || '').toString();
if (xml.firstChild) {
var textChild = 0,
cdataChild = 0,
hasElementChild = false;
for (var n = xml.firstChild; n; n = n.nextSibling) {
if (n.nodeType == 1) hasElementChild = true;
 else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++;
 else if (n.nodeType == 4) cdataChild++;
}
if (hasElementChild) {
if (textChild < 2 && cdataChild < 2) {
for (var n = xml.firstChild; n; n = n.nextSibling) {
var nName = n.nodeName.replace(':', '_');
if (n.nodeType == 3)
o['value'] = n.nodeValue;
 else if (n.nodeType == 4)
o['value'] = n.nodeValue;
 else if (o[nName]) {
if (o[nName] instanceof Array)
o[nName][o[nName].length] = X.toObj(n);
 else
o[nName] = [
o[nName],
X.toObj(n)
];
} 
else
o[nName] = X.toObj(n);
}
} 
else {
if (!xml.attributes.length)
o = X.innerXml(xml);
 else
o['value'] = X.innerXml(xml);
}
} 
else if (textChild) {
if (!xml.attributes.length)
o = X.innerXml(xml);
 else
o['value'] = X.innerXml(xml);
} 
else if (cdataChild) {
if (cdataChild > 1)
o = X.innerXml(xml);
 else
for (var n = xml.firstChild; n; n = n.nextSibling)
o = n.nodeValue;
}
}
if (!xml.attributes.length && !xml.firstChild) o = null;
} 
else if (xml.nodeType == 9) {
o = X.toObj(xml.documentElement);
}
return o;
},
innerXml: function (node) {
var s = [
]
if ('innerHTML' in node)
s.push(node.innerHTML);
 else {
var asXml = function (n) {
var s = [
];
if (n.nodeType == 1) {
s.push('<' + n.nodeName);
for (var i = 0; i < n.attributes.length; i++)
s.push(' ' + n.attributes[i].nodeName + '="' + (n.attributes[i].nodeValue || '').toString() + '"');
if (n.firstChild) {
s.push('>');
for (var c = n.firstChild; c; c = c.nextSibling)
s.push(asXml(c));
s.push('</' + n.nodeName + '>');
} 
else
s.push('/>');
} 
else if (n.nodeType == 3)
s.push(n.nodeValue);
 else if (n.nodeType == 4)
s.push('<![CDATA[' + n.nodeValue + ']]>');
return s.join('');
};
for (var c = node.firstChild; c; c = c.nextSibling)
s.push(asXml(c));
}
return s.join('');
}
};
try
{
if (xml.nodeType == 9) // document node
xml = xml.documentElement;
var res = {
};
res[xml.nodeName.replace(':', '_')] = X.toObj(xml);
return res;
} 
catch (e)
{
}
return null;
}
// funkcija za parsanje datumov v RSS-jih (ISO8601 format npr. '2008-12-19T16:39:57.67Z')

RMap.XmlTools.parseDate = function (dat)
{
var dt = NaN;
var regexp = /^\s*(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(|Z|([+-])(\d\d)(:)?(\d\d))\s*$/;
if (!dat)
return null;
if (dat.toString().match(new RegExp(regexp)))
{
dt = new Date();
var d = dat.match(new RegExp(regexp));
var offset = 0;
dt.setUTCFullYear(parseInt(d[1]));
dt.setUTCMonth(d[3] - 1);
dt.setUTCDate(d[5]);
dt.setUTCHours(d[7]);
dt.setUTCMinutes(d[9]);
dt.setUTCSeconds(d[11]);
if (d[12])
dt.setUTCMilliseconds(parseFloat(d[12]) * 1000);
 else
dt.setUTCMilliseconds(0);
if (d[13] != 'Z' && d[14]) //!="") 
{
offset = (d[15] * 60) + parseInt(d[17]);
offset *= ((d[14] == '-') ? - 1 : 1);
dt.setTime(dt.getTime() - offset * 60 * 1000);
}
} 
else
{
dt = new Date(dat);
}
return dt;
};
// funkcija za javascipt object to JSON
RMap.JsonTools.obj2json = function (obj, clean) //TODO: celo to metodo nadomestiti s kak?no standardno!!!
{
clean = clean == true;
var res = [
];
if (obj != null)
{
if (typeof (obj) == 'object' && obj.length != null) //TODO: kak bolj zanesljiv kriterij, ali gre za Array in ne Object
{
var r = [
];
for (var f = 0; f < obj.length; f++)
{
r.push(RMap.JsonTools.obj2json(obj[f], clean));
}
res.push('[' + r.join(',') + ']');
} 
else if (typeof (obj) == 'object')
{
var r = [
];
for (var f in obj)
{
if (clean != true || (obj[f] != null && obj[f] !== ''))
r.push('"' + f + '"' + ':' + RMap.JsonTools.obj2json(obj[f], clean));
}
res.push('{' + r.join(',') + '}');
} 
else if (typeof (obj) == 'string')
{
res.push('\'' + (obj.replace(/'/g, '\\\'')) + '\'');
} 
else
{
res.push(obj);
}
} 
else
{
res.push('null');
}
return res.join('');
}
