;(function (fn) {
	if (typeof define === 'function' && define.amd === 'object' && define.amd) {
		define(function () { return fn() })
	} else if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = fn()
	} else {
		window.FormValidate = fn()
	}
})(function () {
	const RULES = {
		is_numeric: [/^[0-9]*$/, '请填写数字'],
		money: [/^([1-9]\\d*(\\.\\d{1,2})?|0\\.[1-9]\\d?|0\\.0[1-9]|0|0.0)$/, "请填写有效的金额"],
		letters: [/^[a-z]+$/i, "请输入字母"],
		date: [/^\d{4}-\d{2}-\d{2}$/, "请输入有效的日期，格式:yyyy-mm-dd"],
		email:[/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '请输入有效的邮箱'],
		url: [/^(https?|s?ftp):\/\/\S+$/i, "请输入有效的网址"],
		qq: [/^[1-9]\d{4,}$/,"请输入有效的QQ号"],
		IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, "请输入正确的身份证号码"],
		phone: [/^(1[0-9]{2})[0-9]{8}$/, "请输入有效的手机号"],
		zipcode: [/^\d{6}$/, "请检查邮政编码格式"],
		chinese: [/^[Α-￥]+$/, "请输入中文字符"],
		username: [/^\w{3,12}$/, "请输入3-12位数字、字母、下划线"],
		password: [/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$/, "请输入6-16位字母加数字组合，不能包含空格"],
		trim: [(val, name)=>{
			if (typeof val === 'string') {
				this.valObj[name] = val.trim()
			}
		}],
		required: [(val) => { return !!(val+'').trim() }, '不能为空'],
	}

	function FormValidate(valObj) {
		this.forms = valObj
		this.msgArr = []
	}
	FormValidate.prototype.set_rules = function(rules) {
		var keys = Object.keys(rules)
		for (var i in keys) {
			var key = keys[i]

			var keyArr = key.split('|'),
				keyVal = this.forms[keyArr[0]],
				keyName = keyArr[1]

			rules[key].split('|').forEach(function(v) {
				var regs = RULES[v]
				if (typeof regs[0] === 'function') {
					var rs = regs[0]()
					rs && rs === false && regs[1] && this.msgArr.unshift(keyName + regs[1])
				} else if (regs[0] instanceof RegExp === true) {
					if (!regs[0].test(keyVal))
						this.msgArr.push(keyName + regs[1])	
				}
			}, this)
		}
	}

	FormValidate.prototype.validate = function() {
		return this.msgArr.length === 0
	}

	FormValidate.prototype.error_string = function() {
		return this.msgArr
	}

	FormValidate.prototype.get_validation_data = function(rules) {
		return this.forms
	}

	return FormValidate
})