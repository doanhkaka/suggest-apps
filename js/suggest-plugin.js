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
        if (!document.querySelector) return;

        var defaults = {
            selector    : 'input',
            data        : typeof APP_DATA !== 'undefined' ? APP_DATA : []
        };

        this.opts = extend({},defaults,options);

        this.elems = typeof this.opts.selector == 'object' ? [this.opts.selector] : document.querySelectorAll(this.opts.selector);

        this.init();
    }

    SuggestPlugin.prototype = {
        init:  function() {
            console.log(this.elems);
        },
        bindEvents: function() {

        },
        generateData: function() {

        },
        search: function() {

        },
        updateData: function() {

        },
        highlight: function() {

        },
        loadHistory: function() {

        },
        deleteHistory: function() {

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

    return SuggestPlugin;
}))