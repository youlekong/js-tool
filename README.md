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