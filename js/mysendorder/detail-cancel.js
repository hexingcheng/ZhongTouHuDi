mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();

	var orderid = plus.storage.getItem("my-send-order");
	sendmsg(orderid);

	// 获取当前page
	var cpage = plus.webview.currentWebview();
	// 重新编辑
	document.getElementById("edit-btn").addEventListener("tap", function() {
		mui.openWindow({
			url: "../sendorder/createorder.html",
			id: "createorder",
			extras: {
				orderId: orderid
			},
			show: {
				aniShow: "slide-in-left",
				duration: 200
			},
			waiting: {
				autoShow: true,
				title: "正在加载...",
				options: {
					background: '#d1d1d1'
				}
			}
		})
		setTimeout(function() {
			cpage.close("none", 0)
		}, 300)
		plus.storage.removeItem("my-send-order")

	})

	// 重新发布
	document.getElementById("resend-btn").addEventListener("tap", function() {
		myAjax({
			url: "order/release",
			data: {
				orderId: orderid
			}
		}, function(data) {
			if (data.ret == 1) {
				mui.toast("发布成功")
				mui.openWindow({
					url: "./my-send-order.html",
					id: "my-send-order",
					createNew: true,
					waiting: {
						autoShow: true,
						title: "正在加载...",
						options: {
							background: '#d1d1d1'
						}
					}
				})
				setTimeout(function() {
					cpage.close("none", 0)
				}, 200)
			}
		}, function(xhr, type) {
			console.log(xhr.status);
		})
	}, false)

})

// 发送消息显示页面信息
function sendmsg(orderid) {
	// 页面加载时，获取数据
	myAjax({
		url: "order/goodShow",
		data: {
			orderId: orderid,
			type: "send"
		}
	}, function(data) {
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
			for (var i = 0; i < box.length; i++) {
				if(i < len){
					var url = per + pic[i].path;
					var html = '<img src=' + url + ' width="100%">';
					box[i].innerHTML = html;
				} else {
					box[i].style.display = "none";
				}
			}
		} else {
			var that = document.getElementById("last-wrap");
			that.parentNode.removeChild(that);
		}

		// 判断是否在议价,显示议价消息链接框
		if (data.res.bargain == 1) {
			$("#msg-warn").css("display", "block")
		} else {
			$("#msg-warn").css("display", "none")
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
		console.log(type);
	})
}