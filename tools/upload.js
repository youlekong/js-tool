
;(function(f) {
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
        g.Upload = f();
    }
})(function () {	
	/**
	 * 压缩
	 * @param  {Data} imgData    图片数据
	 * @param  {Float} maxHeight  图片高度
	 * @param  {Function} onCompress 回调
	 * @return {Null}            null
	 */
	function _compressImg(imgData, maxHeight, onCompress){
		if(!imgData)return;
		onCompress = onCompress || function(){};

		var canvas = document.createElement('canvas');

		var img = new Image();
		img.onload = function(){ 
			if(img.height > maxHeight) {						//按最大高度等比缩放
				img.width *= maxHeight / img.height; 
				img.height = maxHeight; 
			}
			var ctx = canvas.getContext("2d"); 
			ctx.clearRect(0, 0, canvas.width, canvas.height); 	// canvas清屏 	
	        //重置canvans宽高
			canvas.width = img.width;
			canvas.height = img.height;	
			ctx.drawImage(img, 0, 0, img.width, img.height); 	// 将图像绘制到canvas上 

			onCompress(canvas.toDataURL("image/png", 0.8));		//必须等压缩完才读取canvas值，否则canvas内容是黑帆布
		};
		// 记住必须先绑定事件，才能设置src属性，否则img没内容可以画到canvas
		img.src = imgData;
	}
	/**
	 * base64转blob
	 * @param  {Data} dataurl 图片base64数据
	 * @return {Blob}         Blob实例
	 */
	function _dataURItoBlob(dataurl) {
	    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	    while(n--){
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new Blob([u8arr], {type:mime});
	}

	/**
	 * 重置input
	 */
	function clearFileInput(){
		var file = document.getElementById("file")
		// 保存input位置
		var pos = file.parentNode
		// 创建form，置空form，移除form
		var form = document.createElement('form');
	    document.body.appendChild(form);
	    form.appendChild(file);
	    form.reset();
	    document.body.removeChild(form);
	    // 还原input
	    pos.appendChild(file);
	}

	function Upload () {
		this.files = []
		this.trigger  = {}
		this.imgHeight = 200
	}

	Upload.prototype = {
		init: function(option) {
			if (option && option instanceof Object) {
				if (option.hasOwnProperty('trigger')) {
					this.trigger = document.getElementById(option.trigger)
					this.trigger.addEventListener('change', this.readAsDataURL.bind(this))
				}
				if (option.hasOwnProperty('complete')) {
					this.complete = option.complete
				} else {
					throw Error()
				}
				if (option.hasOwnProperty('imgHeight')) {
					this.imgHeight = option.imgHeight
				} 
			}
		},

		readAsDataURL: function() {
			var self = this
			var file = self.trigger.files;

		    for(let i = 0; i< file.length; i++) {
		        var reader = new FileReader();    
		        reader.readAsDataURL(file[i]);  
		        reader.onload = function(e){
		        	_compressImg(this.result, this.imgHeight, function(data){//压缩完成后执行的callback
						self.files.push(data)
						self.complete(data)
					})
		        }
		    }
		    clearFileInput()
		},

		submit(url, cb) {
			var self = this

			var fd = new FormData()
			Object.keys(this.files).forEach( function(v, k) {
				fd.append(v, _dataURItoBlob(self.files[v]), 'image.png');
			});

			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.onreadystatechange = function(res){
				if(xhr.readyState==4 && xhr.status==200){
					try {
						var res = JSON.parse(xhr.responseText)
					} catch(e) {}
					if(typeof cb === 'function') cb(res)
				} else {}
			};
			xhr.send(fd);
		},
	}

	return Upload
})
