
;(function () {
	'use strict'

	function storage() {
		var localStorage = window.localStorage

		function set(key, val) {
			if (typeof val === 'object') val = JSON.stringify(val)

			try {
				localStorage.setItem(key, val)
			} catch(oException) {
				if(oException.name == 'QuotaExceededError'){
					console.error('已经超出本地存储限定大小！');
				}
			}
		}

		function get(key) {
			var val = localStorage.getItem(key) || ""

			try {
				if (typeof val === 'object') val = JSON.parse(val)
			} catch(e) {
				val = ""
				// throw('localStorage JSON parse error')
			}
			return val
		}

		function remove(key) {
			localStorage.removeItem(key)
		}

		function clear() {
			localStorage.clear()
		}

		return {
			set: set, 
			get: get,
			remove: remove,
			clear: clear
		}
	}

	if (typeof define === 'function' && define.amd === 'object' && define.amd) {
		define(function () { return storage() })
	} else if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = storage()
	} else {
		window.storage = storage()
	}
})()