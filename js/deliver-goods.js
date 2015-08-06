var pic = '';
mui.init({
	swipeBack: true,
	keyEventBind: {
		backbutton: false //关闭back按键监听
	}
});
mui.plusReady(function() {

		// 草稿
	document.getElementById("btn-draft").addEventListener("tap", function() {
		openWindow('../page/draft.html');
	});

	// 添加说明

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
					sendData(BASEURL + "/common/file/imgUp", base, _this);
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
		setpic();
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


	// 发送数据
	function sendData(url, base, context) {
		var pics
		mui.ajax(url, {
			type: "post",
			data: {
				imgName: Math.floor(Math.random() * 100000) + ".jpg",
				imgData: base, // base字符串
				dataLength: base.length // base字符串长度
			},
			success: function(data) {
				showobj(data.res)
				console.log(data.ret);
				$('.img-item', context).data('picid', data.res.fid);
				setpic();
			},
			error: function(xhr, type) {
				//				此处应移除图片
				console.log("错误信息显示：" + type);
				errorhandle(type);
			}
		})
	}

	function setpic() {
		var $img = $('.img-item');
		var len = $img.length;
		var pics = [];
		for (var i = 0; i < len; i++) {
			pics[i] = $($img[i]).data('picid');
		}
		pic = pics.join(',');
	}
	mui.back = function() {
		plus.webview.currentWebview().close();
	}
	document.getElementById('next-button').addEventListener('tap', function() {
		var name = $('#gname').val();
		var weight = parseInt($('#gweight').val());
		var value = parseInt($('#gvalue').val());
		var info = $('#gettext').val();
		if (name && weight && value) {
			var param = {
				gName: name,
				gWeight: weight,
				gValue: value,
				pics: pic,
				info: info
			}
			mui.openWindow({
				url: '../page/next.html',
				id: 'next',
				extras: param,
				createNew: true,
				show: {
					autoShow: true,
					aniShow: 'slide-in-right'
				},
				waiting: {
					autoShow: true,
					title: '正在加载...',
					options: {
						background: '#d1d1d1'
					}
				}
			})
		} else {
			handlenotall();
			return;
		}
	})
	function handlenotall() {
		var inputs = $('input', '#group');
		var len = inputs.length;
		for (var i = 0; i < len; i++) {
			var value = inputs[i].value;
			if (value == "") {
				var v = $(inputs[i]).prev().text();
				var l = $(inputs[i]).prev().text().length;
				var s = v.substr(0, l - 2)
				mui.toast(v + "信息未填")
			}
		}
	}
	document.getElementById('gplain').addEventListener('tap', function(e) {
		openWindow('./important.html');
		e.preventDefault();
		return false;
	})
	window.addEventListener('getinfo', function(eve) {
		$('#gettext').val(eve.detail.info);
	})
	$('#gweight').blur(function() {
		var value = this.value;
		var rep = /^\d+$/;
		if (rep.test(value)) {
			return;
		} else {
			this.value = "";
			mui.toast('只能输入数字')
		}
	})
	$('#gvalue').blur(function() {
		var value = this.value;
		var rep = /^\d+$/;
		if (rep.test(value)) {
			return;
		} else {
			this.value = "";
			mui.toast('只能输入数字')
		}
	})
})