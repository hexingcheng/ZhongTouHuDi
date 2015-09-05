(function(window) {
	// 母函数
	function App() {}
		/**
		 * 图片压缩，默认同比例压缩
		 * @param {Object} path
		 * 		pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
		 * @param {Object} obj
		 * 		obj 对象 有 width， height， quality(0-1)
		 * @param {Object} callback
		 * 		回调函数有一个参数，base64的字符串数据
		 */
	App.prototype.dealImage = function(path, obj, callback) {
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



	/**
	 * 获取图片后处理回调处理数据
	 * @param {Object} delobj
	 * 		需要处理的对象参数
	 * @param {Object} cb
	 * 		回调函数返回需要处理的数据，包括源文件大小，处理后的文件大小，文件名
	 */
	App.prototype.delPhotoMsg = function(delobj, cb) {
		var camera = plus.camera.getCamera();
		var res = camera.supportedImageResolutions[0];
		var fmt = camera.supportedImageFormats[0];
		var _this = this;
		var fileObj = {
			origin: {},
			now: {}
		}; // 回调对象接口
		// 获取摄像头进行拍照
		camera.captureImage(function(path) {
			plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
				fs.root.getFile(path, {
					create: true
				}, function(fileEntry) {
					fileEntry.file(function(file) {
						//					console.log("原始文件大小：" + file.size / 1024 +"KB   filename:"+file.name);
						origin(file.size, file.name);
					})
				})
			})

			function origin(filesize, filename) {
				// 移动端图片压缩处理
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
					var local = entry.toLocalURL(); // 获取本地地址
					// 图片压缩处理
					_this.dealImage(local, delobj, function(base) {
						fileObj.now.base64Char = base;
						fileObj.now.base64Length = base.length;
						fileObj.now.fileSize = (base.length / 1024).toFixed(2) + "KB";
						fileObj.origin.fileSize = (filesize / 1024).toFixed(2) + "KB";
						fileObj.origin.filePath = local;
						fileObj.fileName = filename;
						cb(fileObj);
					})
				})
			}
		}, function(err) {
			console.log("获取相片错误：" + err.message);
		}, {
			resolution: res,
			format: fmt
		})
	}


	/**
	 *
	 * @param {Object} del
	 * 		需要直接处理的参数对象
	 * 			例如： "{width : 100, height: 100, quality : 0.5}"
	 * 				默认处理按比例处理，只要设置width或height，quality默认0.7
	 * @param {Object} options
	 * 		图片处理的属性  处理文件格式 multiple 选择多张文件进行批量处理
	 * 			例如：{filter : "image", multiple : true}
	 * @param {Object} callback
	 * 		回调函数返回相应的参数
	 * 			返回对象数组，包括原始文件大小等内容
	 * 			例如：obj[0].origin.fileSize, obj[0].now.fileSize,obj[0].now.filePath等
	 */
	App.prototype.delGalleryImg = function(del, options, callback, errcb) {
		var _this = this;
		var fileObj = {
			now: {},
			origin: {}
		}
		plus.gallery.pick(function(eve) {
			if (options.multiple) {
				delmultiple(eve); // 多张照片处理回调函数
			} else {
				delsingle(eve); // 单张图片处理回调函数
			}
		}, function(err) {
			errcb(err);
		}, {
			filter: options.filter || "image",
			multiple: options.multiple || false
		})

		// 处理多张图片
		function delmultiple(eve) {
				for (var i = 0, len = eve.files.length; i < len; i++) {
					//			console.log(i +" : "+ eve.files[i])
					(function(i, len) { // 因为此处为异步操作，需要自动执行函数传入index的值到函数中进行自动执行
						retValue(eve.files[i], function(filepro) {
							//					console.log(JSON.stringify(filepro))
							inner(i, len, filepro);
						})

					})(i, len)
				}

				var cbobj = []; // 暂存json字符串话的字符数组
				function inner(index, len, result) {
					//			console.log(index +"  "+ JSON.stringify(result));
					cbobj.push(JSON.stringify(result)); // 此处如果直接将对象push到数值中，会存在相同的对象元素（不知为什么），所以进行了一个
					if (cbobj.length == len) {
						var tempobj = []; // 解析字符串 后回调该对象数组
						for (var i = 0; i < len; i++) { // 遍历所有的文件进行字符串解析
							var obj = JSON.parse(cbobj[i])
							tempobj[i] = obj;
						}
						callback(tempobj); // 回调数组对象
					}
				}
			}
			// 处理单张图片

		function delsingle(path) {
			// 调用内部函数回调函数进行外部单一图片选择处理属性回调
			retValue(path, function(filepro) {
				callback(filepro);
			});
		}

		function retValue(path, cb) {
			plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
					fs.root.getFile(path, {
						create: true
					}, function(fileEntry) {
						fileEntry.file(function(file) {
							//					console.log("原始文件大小：" + file.size / 1024 +"KB   filename:"+file.name);
							origin(file.size, file.name);
						})
					})
				})
				// 回调函数

			function origin(filesize, filename) {
				// 移动端图片压缩处理
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
					var local = entry.toLocalURL(); // 获取本地地址
					// 图片压缩处理
					_this.dealImage(local, del, function(base) {
						fileObj.now.base64Char = base;
						fileObj.now.base64Length = base.length;
						fileObj.now.fileSize = (base.length / 1024).toFixed(2) + "KB";
						fileObj.origin.fileSize = (filesize / 1024).toFixed(2) + "KB";
						fileObj.origin.filePath = local;
						fileObj.fileName = filename;
						cb(fileObj);
					})
				})
			}
		}
	}
	
	window.pic = new App();
	
})(window)