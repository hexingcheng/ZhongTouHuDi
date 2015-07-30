var pic = "";
mui.init({
	swipeBack: true
});
var pageDraft = null;
mui.back = function() {
	var name = $('#gname').val();
	var weight = $('#gweight').val();
	var value = parseInt($('#gvalue').val());
	//	var info = $('#info').val();
	if (name && weight && value && pic) {
		mui.confirm('是否存为草稿', '提示', ['是', '否'], function(e) {
			if (e.index == 0) {
				//发送ajax,存为草稿;
				plus.webview.getLaunchWebview().show('slide-in-left', 150);
			} else {
				//放弃存为草稿直接返回
				return;
			}
		})
	} else {
		plus.webview.getLaunchWebview().show('slide-in-left', 150);
	}
}
var nextpage = null;
mui.plusReady(function() {

	//预加载
	setTimeout(function() {
			pageDraft = mui.preload({
				url: "../page/draft.html",
				id: "deliver-goods-draft"
			})
		}, 200)
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
			//				that.picsrc = plus.io.convertLocalFileSystemURL(path);
			$(_this).data('picsrc', plus.io.convertLocalFileSystemURL(path))
				//				that.setAttribute('picsrc',plus.io.convertLocalFileSystemURL(path))	
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
						'<img src="' + base + '" alt="goods photo" title="' + local + '" width="100%"/>' +
						'</div><i id="clear-img" class="mui-icon mui-icon-closeempty"></i>';
					_this.innerHTML = img;

					// 在此过程中还要包base64数据 传到后台                   ====================================
					console.log("压缩后：" + base.length * 0.8 / 1024 + "KB");
					sendData(BASEURL + "/common/file/imgUp", base);
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
	mui("#take-photo").on("tap", "#clear-img", function() {
		var icon = '<span class="iconfont icon-xiangji icon-photo"></span>';
		this.parentNode.innerHTML = icon;
	});

	// 绑定预览图片
	mui("#take-photo").on("tap", ".img-item", function() {
		var src = $(this).parent().data('picsrc');
		var param = {
			psrc: src
		}
		openWindow('../page/showpic.html', param);
		var showpic = plus.webview.getWebviewById('showpic');
		mui.fire(showpic, 'geturl');
	});

	/*	// 回调name值
		function callbackName(name){
			console.log(name)
		}*/


	// 发送数据
	function sendData(url, base) {
		var pics
		mui.ajax(url, {
			type: "post",
			data: {
				imgName: Math.floor(Math.random() * 100000) + ".jpg",
				imgData: base, // base字符串
				dataLength: base.length // base字符串长度
			},
			success: function(data) {
				
				pics+=data.res.path+",";
				pic = pics.substring(0,pics.length-1);
			},
			error: function(xhr, type) {
				console.log("错误信息显示：" + type);
				errorhandle(type);
			}
		})
	}

mui.back = function(){
	plus.webview.currentWebview().close()
}

	//  获取表单数据
	//	var formdatas = {
	//		gName: $('#gname').val(),
	//		gValue: parseInt($('').val()),
	//		gWeight: parseInt($('').val()),
	//		info: $('').val()
	//	}

	var oderdata = {
		gName: "巧克力",
		gValue: 100,
		gWeight: 50,
		info: "选填",
		insType: "简单保险",
		pics: " ",
		money: 5,
		getTime: "2015-7-26",
		finTime: "2015-7-30",
		senderAddress: "重庆邮电大学",
		receiverAddress: "重庆工商大学",
		sender: "99966663333",
		senderPhone: "18883843333",
		sendJd: 30,
		sendWd: 120,
		receiver: "小何",
		receiverPhone: "18883846369",
		receiveJd: 30,
		receiveWd: 120,
		status: 1
	}

	function getlatlot() {
		var obj = {};
		plus.geolocation.getCurrentPosition(function(pos) {
			var lat = pos.coords.latitude;
			var lot = pos.coords.longitude;
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			provider: "baidu"
		})
		return obj;
	}
	document.getElementById('next-button').addEventListener('tap', function() {
		var name = $('#gname').val();
		var weight = $('#gweight').val();
		var value = parseInt($('#gvalue').val());
		//	var info = $('#info').val();
		if(name&&weight&&value&&pic){
			var param = {
				gName:name,
				gWeight:weight,
				gValue:value,
				pics:pic
			}
			alert(param.pics)
			openWindow('../page/next.html',param);
		}else{
			mui.alert('请填写相关必要信息在进行下一步！')
			return;
		}
	})
})