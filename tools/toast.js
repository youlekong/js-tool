
const Transitions = {
	'HIDE': {
		'opacity': 0,
		'transform': 'scale(0.001, 0.001)'
	},
	'SHOW': {
		'opacity': 1,
		'transform': 'scale(1, 1)'
	}
}

const DEFAULT_STYLE = {
	'word-break': 'keep-all',
	'background-color': 'rgba(0, 0, 0, 0.8)',

	'z-index': '999999',
	'font-size': '30px',
	'text-align': 'center',
	'color': '#fff',
	'border-radius': '10px',
	'transition': 'opacity 1s, transform 1s',

	'padding': '10px 15px',
	'max-width': '60%',
	'width': '100%',
	'word-break': 'keep-all',
	'margin': '0 auto',
	'text-align': 'center',

	'position': 'fixed',
	'left': '0',
	'right': '0',
}

function Toast () {
	this._toastDom = {}
	this.isHide = false
}

;(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.Toast = f();
    }
})(function () {
	Toast.prototype.init = function(options, text){

		var el = document.createDocumentFragment()
		var wrap = document.createElement('div')
		var txt = document.createElement('span')

		var styles = DEFAULT_STYLE
		if (options instanceof Object) {
			styles = this._mergeOptions(styles, options)
		}

		this._appendStyles(wrap, styles)

		txt.innerText = text

		wrap.appendChild(txt)
		el.appendChild(wrap)

		this._toastDom = wrap
		document.body.appendChild(this._toastDom)
	}

	Toast.prototype.show = function () {
		this.isHide = false
		Toast.prototype._appendStyles(this._toastDom, Transitions['SHOW'])
	}

	Toast.prototype.hide = function () {
		this.isHide = true
		Toast.prototype._appendStyles(this._toastDom, Transitions['HIDE'])
	}

	Toast.prototype._appendStyles = function(el, options){
		Object.keys(options).forEach( function(v, k) {
			el.style[v] = options[v]
		});
	};

	Toast.prototype._mergeOptions = function(initialOptions, customOptions){
		var merged = customOptions
		for (var prop in initialOptions) {
			if (merged.hasOwnProperty(prop)) {
				merged[prop] = initialOptions[prop]
			} else {
				merged[prop] = initialOptions[prop];
			}
		}
		return merged
	}

	return Toast
})