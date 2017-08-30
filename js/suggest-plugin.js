/*
    Javascript Suggest Plugin
    Copyright (c) 2017 Cris Lee / leecris241@gmail.com
    Github: https://github.com/leecris/suggest-apps
    License: http://www.opensource.org/licenses/mit-license.php
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.SuggestPlugin = factory();
    }
}(this, function() {
    function SuggestPlugin(options) {

        if (options.selector === null || !Array.isArray(options.source)) return;

        var defaults = {
            selector    : 'input',
            source      : typeof APP_DATA !== 'undefined' ? APP_DATA : [],
            minChars    : 1
        };

        this.opts = extend({}, defaults, options);

        this.elems = typeof this.opts.selector == 'object' ? [this.opts.selector] : document.querySelectorAll(this.opts.selector);

        for (var i = 0; i < this.elems.length; i++) {
            var that = this.elems[i];
            this.init(that, i);
        }
    }

    SuggestPlugin.prototype = {
        init:  function(el, key) {
            this.suggestion = new Suggestion(this.opts.source);
            this.key = key;
            this.initSuggestContainer(el);
            this.updateSuggestContainer(el.parentNode.querySelector('div.auto-suggestion'));
            this.bindEvents(el);
        },
        bindEvents: function(el) {
            var that = this;
            //addEventListener(el, 'keydown', this.keydownHandler);
            var container = el.parentNode.querySelector('div.auto-suggestion');
            this.addEventListener(el, 'keyup', this.keyUpHandler.bind(this, el, container));
            this.addEventListener(el, 'focus', this.focusHandler.bind(this, el, container));
            this.addEventListener(el, 'blur', this.blurHanlder.bind(this, el, container));

            this.addGlobalEvent('suggestion-item', 'mouseleave', this.mouseleaveHandler, el, container);
            this.addGlobalEvent('suggestion-item', 'mouseover', this.mouseoverHandler, el, container);
            this.addGlobalEvent('suggestion-item', 'mousedown', this.mousedownHandler, el, container);
            this.addGlobalEvent('suggestion-link', 'click', this.suggestionItemClickHandler, el, container);
        },
        initSuggestContainer: function(el) {
            var parent = el.parentNode;
            el.sc = document.createElement('div');
            el.sc.className = 'auto-suggestion';
            el.sc.id = 'auto-suggestion-'+this.key;
            el.autoCompleteAttr = el.getAttribute('autocomplete');
            el.setAttribute('autocomplete', 'off');
            el.sc.style.display = 'none';
            el.history = {};
            parent.appendChild(el.sc);
        },
        updateSuggestContainer: function(container,string, method) {
            var data = this.search(string);
            this.renderData(container, data, method);
        },

        initializeData: function(data) {
            var html = document.createElement('div');
            var name = stripHtmlTags(data.name);
            html.className = 'suggestion-item';
            html.setAttribute('data-id',data.id);
            html.setAttribute('data-name',name);

            var innerHtml = '<a href="#" class="suggestion-link" data-name="'+name+'"><img class="logo" src="'+data.thumbnailUrl+'"/>';
            innerHtml += '<span>'+name+'</span></a>';
            html.innerHTML = innerHtml;

            return html;
        },
        renderData: function(container, data, method) {
            var that = this;
            console.log(data);
            if (method === 'update') {
                var items = container.querySelectorAll('div.suggestion-item');

                for (var i = 0; i < items.length; i++) items[i].style.display = 'none';

                for (var i = 0; i < data.length; i++) {
                    var matchItem = container.querySelector('[data-id="'+data[i].id+'"]');
                    matchItem.style.display = 'block';
                }
            } else {
                container.innerHtml = '';
                for (var i = 0; i < data.length; i++) {
                    var html = that.initializeData(data[i]);
                    container.appendChild(html);
                }
            }
        },
        search: function(text) {
            return this.suggestion.searchFor(text);
        },

        highlight: function() {

        },
        loadHistory: function() {

        },
        deleteHistory: function() {

        },
        keydownHandler: function(el, container, e) {
            var that = this;
            var key = window.event ? e.keyCode : e.which;
            console.log(e.keyCode);
            return false;
            // down (40), up (38)
            if ((key === 40 || key === 38) && container.innerHTML) {

                return false;
            }
            // esc
            else if (key === 27) { that.value = that.last_val;  }
            // enter
            else if (key === 13 || key === 9) {

            }
        },

        keyUpHandler: function(el, container, e) {
            var that = this;
            var key = window.event ? e.keyCode : e.which;
            console.log(e.keyCode);
            if (!key || (key < 35 || key > 40) && key !== 13 && key !== 27) {
                var val = el.value;
                that.last_val = val;
                that.updateSuggestContainer(container,val,'update');
            }
        },

        focusHandler: function (el, container, e) {
            var that = this;
            container.style.display = 'block';
        },

        blurHanlder: function (el, container, e) {
            var that = this;
            try { var hoverItems = document.querySelector('.suggestion-item:hover'); } catch(e) { var hoverItems = 0; }
            if (!hoverItems) {
                that.last_val = that.value;
                container.style.display = 'none';
                setTimeout(function(){ container.style.display = 'none'; }, 350); // hide suggestions on fast input
            } else if (that !== document.activeElement) setTimeout(function(){ el.focus(); }, 20);
        },

        mouseleaveHandler: function (el, container, e) {
            console.log('mouseleave');
            var sel = container.querySelector('.suggestion-item.selected');
            if (sel) setTimeout(function(){ sel.className = sel.className.replace('selected', ''); }, 20);
        },

        mouseoverHandler: function (el, container, e) {
            console.log('mouseover');
            var sel = container.querySelector('.suggestion-item.selected');
            if (sel) sel.className = sel.className.replace('selected', '');
            this.className += ' selected';
        },

        mousedownHandler: function (el, container, e) {
            console.log('mousedown');
            var that = this;
            if (hasClass(this, 'suggestion-item')) { // else outside click
                var v = el.getAttribute('data-name');
                that.value = v;
                container.style.display = 'none';
            }
        },

        suggestionItemClickHandler: function(el, container, e) {
            e.preventDefault();
            var clickItem = e.target;
            var v = clickItem.innerText;
            el.value = v;
            el.last_val = v;
        },

        addEventListener: function(el, type, handler) {
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        },

        addGlobalEvent: function (elClass, event, callback, el, context){
            var elems = context.getElementsByClassName(elClass);
            for (var i = 0; i < elems.length; i++) {
                this.addEventListener(elems[i], event, callback.bind(this, el, context));
            }
        }
    };

    function Suggestion(data) {
        this.data = data;
    }

    Suggestion.prototype = {
        trimString: function(s) {
            var l=0, r=s.length -1;
            while(l < s.length && s[l] == ' ') l++;
            while(r > l && s[r] == ' ') r-=1;
            return s.substring(l, r+1);
        },
        searchFor: function(stringSearch) {
            var that = this;
            var results = [];
            var source = this.data;
            if (stringSearch === '' || typeof stringSearch === 'undefined') {
                return source;
            }
            stringSearch = that.trimString(stringSearch).toLowerCase(); // trim it
            for(var i=0; i<source.length; i++) {
                var name = source[i].name.toLowerCase();
                if(name.search(stringSearch) !== -1) {
                    results.push(source[i]);
                }
            }
            return results;
        }
    };


    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    function hasClass(el, className){
        return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
    }

    function stripHtmlTags(str) {
        if ((str===null) || (str===''))
            return false;
        else
            str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }

    return SuggestPlugin;
}));