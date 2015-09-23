(function(global, factory) {
	factory(global);
})(window, function(global) {

	var defaults = {
		width: 300,
		height: 200,
		addmaskevent : false,
		title: {
			height: 40,
			content: "提示",
			color: "#5f5d5d",
			background: "#fff"
		},
		main: {
			content: "内容项填写",
			align: "left",
			background: "#fff",
			font: "16px",
			color: "#aaa"
		},
		buttons: [{
			name: "确定",
			background: "#c4e8da",
			color: "#26a65b",
			click: function() {
				return true;
			},
			touchstart: function() {
				return true;
			},
			touchend: function() {
				return true;
			}
		}, {
			name: "取消",
			background: "#f6ccc2",
			color: "#d64541",
			click: function() {
				return true;
			},
			touchstart: function() {
				return true;
			},
			touchend: function() {
				return true;
			}
		}]
	};
	
	

	function Popup(options) {
		if (this instanceof Popup) {
			this.args = util.extend(defaults, options);
			this.renderNode() // 渲染节点
			this.renderAttr() // 渲染属性值
			this.maskevent(); // 给mask添加时间蒙层
		} else {
			new Popup(options);
		}
	}

	Popup.prototype = {
		// render model
		renderNode: function() {
			this.mask = document.createElement("div");
			this.mask.id = "lee-mask";
			this.content = document.createElement("div");
			this.content.id = "lee-content-wrap";
			this.content.innerHTML = '<div id="lee-content">'+
										'<div class="title"></div>'+
										'<div class="content-wrap">'+
										'</div>'+
										'<div class="footer">'+
											'<div class="btn-group">'+
											'</div>'+
										'</div>'+
									'</div>';
			document.body.appendChild(this.mask);
			document.body.appendChild(this.content);
		},
		// 给mask添加点击隐藏事件函数
		maskevent : function(){
			var _this = this;
			if(_this.args["addmaskevent"]){
				_this.mask.addEventListener("tap", function(){
					_this.hide(_this.mask, _this.content)
				})
			} else {
				return;
			}
		},
		// 渲染属性值
		renderAttr: function() {
			var inner = this.innerContent = document.getElementById("lee-content"); // 内容
			var title = this.title = inner.querySelector(".title"); // 头部信息显示
			var group = this.group = inner.querySelector(".btn-group"); // 按钮组件
			var wrap = this.wrap = inner.querySelector(".content-wrap"); // 内容环绕部分
			var _this = this;
			// 整体框架大小设置
			util.renderCss(inner, {
				"width": this.args["width"] + "px",
				"height": this.args["height"] + "px"
			});
			util.renderCss(this.content, { // 渲染整体大小的同时需要渲染框体位置的改变
				"margin-top": -this.args["height"] / 2 + "px",
				"margin-left": -this.args["width"] / 2 + "px"
			});

			// title内容显示
			if (this.args["title"]["height"] == 0) {
				inner.removeChild(title);
			} else {
				title.innerHTML = this.args["title"]["content"];
				util.renderCss(title, {
					"color": this.args["title"]["color"],
					"background": this.args["title"]["background"],
					"height": this.args["title"]["height"] + "px",
					"line-height": this.args["title"]["height"] + "px"
				});
			}

			// 内容区显示部分
			wrap.innerHTML = this.args["main"]["content"]; // 可以是html代码嵌入
			util.renderCss(wrap, {
				"top": this.args["title"]["height"] + "px",
				"text-align": this.args["main"]["align"],
				"font-size": this.args["main"]["font"],
				"background": this.args["main"]["background"],
				"color": this.args["main"]["color"]
			})

			// buttons
			if (this.args.buttons.length == 1) {
				group.innerHTML = '<div class="button-block button">' + this.args.buttons[0]["name"] + '</div>';
			} else if (this.args.buttons.length == 2) {
				group.innerHTML = '<div class="button-one button">' + this.args.buttons[0]["name"] +
					'</div><div class="button-two button">' + this.args.buttons[1]["name"] + '</div>';
			}
			var button = this.buttons = group.querySelectorAll(".button");
			for (var i = 0; i < button.length; i++) {
				(function(i) {
					util.renderCss(button[i], {
						"color": _this.args.buttons[i]["color"],
						"background": _this.args.buttons[i]["background"]
					});
					var obj = _this.args.buttons[i];
					if (_this.args.buttons[i]["click"]) {
						button[i].addEventListener("tap", function() {
							obj["click"]();
							_this.hide(_this.mask, _this.content)
						}, false);
					} else if (_this.args.buttons[i]["touchstart"]) {
						button[i].addEventListener("touchstart", function() {
							obj["touchstart"]();
							_this.hide(_this.mask, _this.content)
						}, false);
					} else if (_this.args.buttons[i]["touchend"]) {
						button[i].addEventListener("touchend", function() {
							obj["touchend"]();
							_this.hide(_this.mask, _this.content)
						}, false);
					}
				})(i)
			}
		},
		show: function() {
			var _this = this;
			_this.mask.style.display = "block";
			_this.content.style.display = "block";
			_this.mask.classList.add("mask-fadein");
			_this.content.classList.add("fadein");
			_this.mask.addEventListener("webkitAnimationEnd", function() {
				_this.mask.style.opacity = "0.7";
				_this.content.style.opacity = "1";
			})
		},
		hide: function(mask, content) {
			var that = this;
			mask.classList.add("mask-fadeout");
			content.classList.add("fadeout");
			mask.addEventListener("webkitAnimationEnd", function() {
				mask.style.display = "none";
				content.style.display = "none";
				mask.classList.remove("mask-fadeout");
				content.classList.remove("fadeout");
				mask.style.opacity = "0";
				content.style.opacity = "0";
				mask.removeEventListener("webkitAnimationEnd", arguments.callee)
				that.deleteNode();
			})
		},
		active: function(node) {
			node.classList.add("tap-active")
		},
		// 处理节点
		deleteNode : function(){
			this.mask.parentNode.removeChild(this.mask);
			this.content.parentNode.removeChild(this.content);
		}
	};


	var util = {
		// 合并参数
		extend: function(old, opt) {
			var newopt = opt;
			var oldopt = old;
			for (var name in newopt) {
				if (typeof oldopt[name] != "boolean" && oldopt[name]) {
					if (typeof newopt[name] === "object" && !Array.isArray(newopt[name])) {
						arguments.callee(oldopt[name], newopt[name])
					} else if (Array.isArray(newopt[name])) {
						for (var i = 0; i < newopt[name].length; i++) {
							if (typeof newopt[name][i] === "object" && !Array.isArray(newopt[name][i])) {
								if (oldopt[name].length == newopt[name].length) {
									arguments.callee(oldopt[name][i], newopt[name][i])
								} else if(newopt[name].length == 1) {
									oldopt[name].splice(1, 1) // 删除当前默认节点对象
									arguments.callee(oldopt[name][0], newopt[name][0])
								} else if (oldopt[name].length == 1 && newopt[name].length == 2) {
									var temp = newopt[name][1];
									var demo = {
										name: "取消",
										background: "#f6ccc2",
										color: "#d64541",
										click: function() {
											return true;
										},
										touchstart: function() {
											return true;
										},
										touchend: function() {
											return true;
										}
									}
									var tempobj = arguments.callee(demo, temp)
									oldopt[name].push(tempobj)
								}
							}
						}
					} else {
						oldopt[name] = newopt[name]
					}
				} else if(typeof oldopt[name] == "boolean"){
					oldopt[name] = newopt[name]
				}
			}
			return oldopt;
		},
		// 渲染css工具函数
		renderCss: function(obj, options) {
			for (var name in options) {
				obj.style[name] = options[name];
			}
		},
		// 深拷贝复制
		simplyDeepCopy : function(obj){
			var objstr = JSON.stringify(obj);
			var temp = JSON.parse(objstr);
			return temp;
		}
	};

	// 闭包中暴露出该函数
	global.Popup = Popup;
});