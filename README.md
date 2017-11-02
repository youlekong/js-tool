# js-tool

**常用js类**

- 图片上传

```
var u = new Upload()
u.init({
	trigger: 'file',
	imgHeight: 200,
	complete: function () {
		document.getElementById('img').src = this.files[0]
		this.files = []
	}
})
u.submit()
```

- 页面提示

```
var t = new Toast()
t.show('toast...', _=>{
	console.log('1111')
})
setTimeout(_=>t.show('toast...'), 4000)
```

- localStorage存储

```
storage.set('name', 'koyole')
console.log(storage.get('name'))
```

- 轮播图

```
swiper('cardflip', {})
```

- 表单验证

```
var nn = document.getElementById('nickname').value
var pwd = document.getElementById('pwd').value

var rules = {
	'nn|昵称': 'required|trim|is_numeric',
	'pwd|密码': 'required|trim|is_numeric',
}
var form = new FormValidate({nn, pwd})
form.set_rules(rules)
if (!form.validate()) 
	console.log(form.error_string())

var rs = form.get_validation_data()
console.log(rs)
```