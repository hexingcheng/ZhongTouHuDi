mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	var status; // 当前状态
	var cpage = plus.webview.currentWebview();

	var orderid = plus.storage.getItem("my-send-order") || cpage.orderId;
	// 加载数据
	sendmsg(orderid);
	
	document.getElementById("button-pay").addEventListener("tap", function() {
		openWindow("../pay/pay.html");
	}, false)

	// 当页面是从选择递送人界面打开的时候
	if (cpage.orderId) {
		// 重新定义返回按钮
		mui.back = function() {
			openWindow("./my-send-order.html");
			setTimeout(function() {
				plus.webview.close(cpage, "none", 0)
			}, 1000)
		}
	}

	// 发信息
	document.getElementById("sendmsg").addEventListener("tap", function() {
		var phonenum = this.getAttribute("data-phone");
		var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		msg.to = [phonenum];
		msg.body = '';
		plus.messaging.sendMessage(msg);
	})

	// 打电话
	document.getElementById("phone").addEventListener("tap", function() {
		var phonenum = this.getAttribute("data-phone");
		plus.device.dial(phonenum, false);
	})

	// 添加点击样式与过渡效果
	window.addEventListener("touchstart", function() {
			var target = window.event.target;
			var cls = target.classList;
			if (cls.contains("mui-icon-phone-filled") || cls.contains("mui-icon-chatbubble-filled")) {
				target.style.webkitTransition = "all 100ms ease-in-out";
				cls.add("tap-active");
			}
		})
		// 清除添加样式与过渡效果
	window.addEventListener("touchend", function() {
		var target = window.event.target;
		var cls = target.classList;
		if (cls.contains("mui-icon-phone-filled") || cls.contains("mui-icon-chatbubble-filled")) {
			target.style.webkitTransition = "all 100ms ease-in-out";
			cls.remove("tap-active");
		}
	})

	// 取消订单弹出框
	var options = {
		height : 160,
		title : {
			height : 40,
			content : ""
		},
		main : {
			content : ""
		},
		buttons : [{
			name : "OK",
			click : function(){ return true }
		},{
			name : "cancel",
			click : function(){ return true; }
		}]
	}
	
	// 取消订单 status=3
	$("#cancel-order").on("tap", function() {
		options.height = 180;
		options.title.content = "取消提示";
		options.main.content = "您确定要取消此条订单信息吗？在付款的阶段取消订单将会扣除50%的报酬给递送人",
		options.buttons[0] = {
			name : "OK",
			click : function(){
				openWindow("./cancel-reason.html", {
					orderId: orderid,
					status: status
				})
			}
		}
		options.buttons[1].name = "cancel";
		var pop = new Popup(options)
		pop.show();
	})
	
	// 取消订单 status=2
	$("#cancel").on("tap", function() {
		options.title.content = "取消提示";
		options.main.content = "您确定要取消此条订单信息吗？在付款的阶段取消订单将会扣除10积分",
		options.buttons[0] = {
			name : "OK",
			click : function(){
				openWindow("./cancel-reason.html", {
					orderId: orderid,
					status: status
				})
			}
		}
		options.buttons[1].name = "cancel";
		var pop = new Popup(options)
		pop.show();
	})
	
	// 通过订单号获取数据
	function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
	mui('#porel').on('tap', 'img', function() {
		toverticalcenter()
		$('.presee').removeClass('mui-hidden')
		$('.mui-slider-item', '#slider').filter(function(index) {
			return $('.mui-slider-item', '#slider').eq(index).find('img').attr('src') == '';
		}).remove();
		var index = this.index;
		var gallery = mui('#slider');
		gallery.slider({
			interval: 0
		}).gotoItem(index);
	})
		$('.presee').on('tap', function() {
		$(this).addClass('mui-hidden')
	})
	function sendmsg(orderid) {
		// 页面加载时，获取数据
		myAjax({
			url: "order/goodShow",
			data: {
				orderId: orderid,
				type: "send"
			},
			wait: false
		}, function(data) {
			//		console.log(JSON.stringify(data))
			status = data.res.status;
			$(".goods-name").html(data.res.gName); // 货物名称
			$("#goods-value").html(data.res.money); // 价值
			$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
			$("#get-time").html(data.res.getTime); // 获取时间
			$("#deadline").html(data.res.finTime); // 期望时间
			$("#host").html(data.res.sender); // 发送者
			$("#sendaddr").html(data.res.sendAddr.name); // 发送地
			$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
			$("#gvalue").html(data.res.gValue); // value
			$("#info").html(data.res.info); // 信息描述
			var pic = data.res.pics;
			var n = BASEURL.indexOf('/api/');
			var per = BASEURL.substring(0, n);
			var len = pic.length;
			var box = document.querySelectorAll(".img-box");
			if (len > 0) {
				for (var i = 0; i < len; i++) {
				var picurl = pic[i].path;
				var minurl = pic[i].minPath;
				var n = BASEURL.indexOf('/a');
				var perurls = BASEURL.substring(0, n);
				var imgurl = perurls + picurl;
				var img = document.createElement('img');
				img.className = 'picture'
				img.src = imgurl;
				img.index = i;
				document.getElementById('porel').appendChild(img);
				$('.mui-slider-item', '.mui-slider-group').eq(i).find('img').attr('src', perurls + minurl);
			}
			}
			// 验证是否需要取消按钮
			if (data.res.status == 4) {
				$("#footer-cancel").css("display", "none")
				$(".mui-scroll-wrapper").css("bottom", 0)
			} else if (data.res.status == 3) {
				$(".status-3").css("display", "block");
				$(".status-2").css("display", "none");
			} else if (data.res.status == 2) {
				$(".status-3").css("display", "none");
				$(".status-2").css("display", "block");
			}
			// sender 递送人信息显示
			if (data.res.deliver.headPic) { // 头像显示
				$("#head-img").attr("src", data.res.deliver.headPic);
			}
			if (data.res.deliver.nickName) { // 昵称
				$("#nickName").html(data.res.deliver.nickName);
			}
			if (data.res.deliver.ptitle) { // 等级
				$("#ptitle").html(data.res.deliver.ptitle);
			}
			if (data.res.deliver.orderCount) { // 接单数量
				$("#orderCount").html(data.res.deliver.orderCount);
			}
			if (data.res.deliver.phone) { // 电话号码
				$("#pnone").attr("data-phone", data.res.deliver.phone);
			}
			// 300毫秒之后清除等待框
			setTimeout(function() {
				var lmask = document.getElementById("loading-mask");
				var lbox = document.getElementById("loading-box");
				var mcl = lmask.classList;
				var bcl = lbox.classList;
				mcl.add("fade-out");
				bcl.add("fade-out");
				// 过渡动画结束的时候执行该事件
				lmask.addEventListener("webkitTransitionEnd", function() {
					document.getElementById("loading-mask").style.display = "none";
					document.getElementById("loading-box").style.display = "none";
					mcl.remove("fade-out");
					bcl.remove("fade-out");
				}, false)
			}, 300)
		}, function(xhr, type) {
			mui.toast("未知错误");
			mui.back();
			console.log(type);
		})
	}


})