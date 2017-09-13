
function Cookie() {

}

Cookie.prototype = {
	cookieStr : document.cookie,

	set: function (key, val, options) {
	},

	get: function (key) {
		var all = Cookie.all()
		return all[key]
	},

	remove: function (key) {
		// body...
	},

	clear: function () {
		// body...
	},

	all: function () {
		var arr = document.cookie.split(';')
		var obj = {}
		arr.forEach(function(v, k) {
			var item = v.split('=')
			obj[decodeURI((item[0]).trim())] = decodeURI(item.splice(1).join('='))
		})

		return obj
	}
}