mui.init({
	swipeBack: true
});
var pageDraft = null;
mui.plusReady(function() {
	setTimeout(function() {
		pageDraft = mui.preload({
			url: "deliver-goods-draft.html",
			id: "deliver-goods-draft"
		})
	}, 200)
})
mui.ready(function() {
	// 草稿
	document.getElementById("btn-draft").addEventListener("tap", function() {
		pageDraft.show("slide-in-right", 150)
	});

	// 添加说明
	document.querySelector("#write-plain").addEventListener("tap", function() {
		mui.alert("物品说明");
	})

	/**
	 * 图片压缩，默认同比例压缩
	 * @param {Object} path
	 * 		pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
	 * @param {Object} obj
	 * 		obj 对象 有 width， height， quality(0-1)
	 * @param {Object} callback
	 * 		回调函数有一个参数，base64的字符串数据
	 */
	function dealImage(path, obj, callback) {
		var img = new Image();
		img.src = path;
		img.onload = function() {
			var that = this;
			// 默认按比例压缩
			var w = that.width,
				h = that.height,
				scale = w / h;
			w = obj.width || w;
			h = obj.height || (w / scale);
			var quality = 0.7; // 默认图片质量为0.7

			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);

			ctx.drawImage(that, 0, 0, w, h);
			// 图像质量
			if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
				quality = obj.quality;
			}
			// quality值越小，所绘制出的图像越模糊
			var base64 = canvas.toDataURL('image/jpeg', quality);
			// 回调函数返回base64的值
			callback(base64);
		}
	}

	// 物品照相功能    
	mui("#take-photo").on("tap", ".icon-photo", function(eve) {
		var _this = this.parentNode;
		// 获取相机对象
		var camera = plus.camera.getCamera();
		var res = camera.supportedImageResolutions[0];
		var fmt = camera.supportedImageFormats[0];
		
		// 获取摄像头进行拍照
		camera.captureImage(function(path) {

			// 获取原始文件大小				测试原始文件大小
	/*		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs){
				fs.root.getFile(path, {create: true}, function(fileEntry){
					fileEntry.file(function(file){
						// 数据只能在该函数内部显示
//						console.log("原始文件大小：" + file.size / 1024 +"KB   filename:"+file.name);
						callbackName(file.name);
					})
				})
			})*/
			
			
			// 移动端图片压缩处理
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				var local = entry.toLocalURL();
				//	var oimg = document.getElementById("origin");
				//	oimg.src = local;
				// 图片压缩处理
				dealImage(local, {
					width: 17 * 4, 
					quality: 0.5
				}, function(base) {
					/**
					 * 	在此处可以将base传入后台，让后台进行数据的储存为相片
					 */
					var img = '<div class="img-item">' +
						'<img src="' + base + '" alt="goods photo" title="'+ local +'" width="100%"/>' +
						'</div><i id="clear-img" class="mui-icon mui-icon-closeempty"></i>';
					_this.innerHTML = img;

					// 在此过程中还要包base64数据 传到后台                   ====================================
					console.log("压缩后：" + base.length * 0.8 / 1024 + "KB");
					sendData("http://172.31.56.19:8080/api/common/file/imgUp", base);
				})
			})

		}, function(err) {
			console.log("获取相片错误：" + err.message);
		}, {
			resolution: res,
			format: fmt
		})
	})
	
	// 删除图片选择
	mui("#take-photo").on("tap", "#clear-img", function(){
		var icon = '<span class="iconfont icon-xiangji icon-photo"></span>';
		this.parentNode.innerHTML = icon;
	});

	// 绑定预览图片
	mui("#take-photo").on("tap", ".img-item", function(){
		mui.alert("预览图片");
	});
	
/*	// 回调name值
	function callbackName(name){
		console.log(name)
	}*/
	
	// 发送数据
	function sendData(url, base){
		mui.plusReady(function(){
			mui.ajax(url, {
			type : "post",
			data : {
				imgName : Math.floor(Math.random()*100000) + ".jpg",
				imgData : base,			// base字符串
				dataLength : base.length	// base字符串长度
			},
			success : function(data){
				console.log(data.ret);
				console.log(data.res.path)
			},
			error : function(xhr, type){
				console.log("错误信息显示："+type);
			}
		})
		})
	}
	
	
	
	
})