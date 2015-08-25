mui.init();
<<<<<<< HEAD
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	var mp;
	var mask = document.getElementById("order-mask");
	var panel = document.getElementById("order-popup");
	// 显示markup弹出层
	document.getElementById("markup").addEventListener("tap", function() {
			var cshow = document.getElementById("current-price"); // 弹出层显示当前价格
			var cp = document.getElementById("goods-value").innerHTML; // 页面显示当前价格
			cshow.innerHTML = cp;
			var cprice = parseFloat(cp);
			mp = parseFloat(document.getElementById("plus-price").innerHTML); // 获取需要加价的金额
			var total = document.getElementById("total-price");
			total.innerHTML = cprice + mp; // 显示总金额

			mask.style.display = "block";
			panel.style.display = "block";
		}, false)
		// 隐藏显示层
=======
var money;
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	var mp;
	var mask = document.getElementById("order-mask");
	var panel = document.getElementById("markups");
	// 显示markup弹出层
	document.getElementById("markup").addEventListener("tap", function() {
		//			var cshow = document.getElementById("current-price"); // 弹出层显示当前价格
		//			var cp = document.getElementById("goods-value").innerHTML; // 页面显示当前价格
		//			cshow.innerHTML = cp;
		//			var cprice = parseFloat(cp);
		//			mp = parseFloat(document.getElementById("plus-price").innerHTML); // 获取需要加价的金额
		//			var total = document.getElementById("total-price");
		//			total.innerHTML = cprice + mp; // 显示总金额

		//			mask.style.display = "block";
		//			panel.style.display = "block";
		$('#order-mask').removeClass('mui-hidden');
		$('#markups').removeClass('mui-hidden');
	}, false)
	$('#mar-i').on('keyup', function() {
		var v = parseInt($(this).val()) || 0
		var or = parseInt($('.rewrod').text());
		var str = v + or;
		$('.rel').text(str)
	})

	// 隐藏显示层
>>>>>>> 0694bcd3d905405a976feb0e1758d94229ec5190
	document.getElementById("cancel").addEventListener("tap", function() {
		mask.style.display = "none";
		panel.style.display = "none";
	}, false)

	mask.addEventListener("tap", function() {
		mask.style.display = "none";
		panel.style.display = "none";
	}, false)

	var order = JSON.parse(plus.storage.getItem("order"));

	// 议价弹出层
	var getoderpage = plus.webview.getWebviewById("getorder/get-order");
	document.getElementById("ok").addEventListener("tap", function() {
<<<<<<< HEAD
		plus.nativeUI.showWaiting("议价中...", {
			background: "#ddd"
		});
		myAjax({
			url : "deliver/bargain",
			data: {
				orderId: order.orderid,
				money: mp
			}
		}, function(data) {
			if (data.ret == 1) {
				plus.nativeUI.closeWaiting();
				mui.alert("议价成功", "议价");
				if (getoderpage) {
					getoderpage.show("slide-in-left", 300);
					setTimeout(function() {
						plus.webview.currentWebview().close("fade-out", 200);
					}, 320)
				} else {
					plus.webview.getLaunchWebview().show("slide-in-left", 300);
					setTimeout(function() {
						plus.webview.currentWebview().close("fade-out", 200);
					}, 320)
				}
				mask.style.display = "none";
				panel.style.display = "none";
			} else if (data.ret == 2) {
				plus.nativeUI.closeWaiting();
				mui.alert("已加价，不可重复加价", "议价");
				mask.style.display = "none";
				panel.style.display = "none";
			}
		}, function(err) {
			plus.nativeUI.closeWaiting();
			console.log(err);
		})
=======
		if (parseInt(money) < parseInt($('.rel').text())) {
			alert('余额不足')
		} else {
			plus.nativeUI.showWaiting("议价中...", {
				background: "#ddd"
			});
			myAjax({
				url: "deliver/bargain",
				data: {
					orderId: order.orderid,
					money: $('.rel').text()
				}
			}, function(data) {
				if (data.ret == 1) {
					plus.nativeUI.closeWaiting();
					openWindow('./get-result.html', {
						orderId: order.orderid
					});
				} else if (data.ret == 2) {
					plus.nativeUI.closeWaiting();
					mui.alert("已加价，不可重复加价", "议价");
					mask.style.display = "none";
					panel.style.display = "none";
				} else if (data.ret == 4) {
					mui.toast('您还不是递送人')
				} else if (data.ret == 5) {
					mui.toast('不能接自己的单')
				} else if (data.ret == 6) {
					mui.toast('当前禁止议价接单')
				} else if (data.ret == 7) {
					mui.toast('押金不足');
				}
			}, function(err) {
				plus.nativeUI.closeWaiting();
				console.log(err.status);
			})
		}
>>>>>>> 0694bcd3d905405a976feb0e1758d94229ec5190
	}, false)


	// collect 按钮抢单
	document.getElementById("collect").addEventListener("tap", function() {
<<<<<<< HEAD
		plus.nativeUI.showWaiting("接单中...", {
			background: "#ddd"
		});
		myAjax({
			url : "deliver/receive",
			data: {
				orderId: order.orderid
			}
		}, function(data) {
			plus.nativeUI.closeWaiting();
			if (data.ret == 1) {
				openWindow("./get-result.html");
			} else if (data.ret == 2) {
				mui.alert("此单已不存在", "提示");
			} else if (data.ret == 3) {
				mui.alert("其他人已接单", "提示");
			} else if (data.ret == 4) {
				mui.alert("需要递送人身份", "提示");
			}
		}, function(err) {
			plus.nativeUI.closeWaiting();
			console.log(err);
		})
	}, false)


	// 页面加载时，获取数据
	myAjax({
		url : "order/goodShow",
=======
			if (parseInt(money) < parseInt($('.rel').text())) {
				alert('余额不足')
			} else {
				alert(1)
				plus.nativeUI.showWaiting("接单中...", {
					background: "#ddd"
				});
				myAjax({
					url: "deliver/receive",
					data: {
						orderId: order.orderid
					}
				}, function(data) {
					plus.nativeUI.closeWaiting();
					if (data.ret == 1) {
						openWindow("./get-result.html");
					} else if (data.ret == 2) {
						mui.alert("此单已不存在", "提示");
					} else if (data.ret == 3) {
						mui.alert("其他人已接单", "提示");
					} else if (data.ret == 4) {
						mui.alert("需要递送人身份", "提示");
					}
				}, function(err) {
					plus.nativeUI.closeWaiting();
					console.log(err.status);
				})
			}
		}, false)
		//获取用户余额
	myAjax({
			url: 'wallet/money',
			wait: false
		}, function(data) {
			if (data.ret == 1) {
				money = data.res.money;
			}
		})
		// 页面加载时，获取数据
	myAjax({
		url: "order/goodShow",
>>>>>>> 0694bcd3d905405a976feb0e1758d94229ec5190
		data: {
			orderId: order.orderid,
			type: "comm"
		}
	}, function(data) {
<<<<<<< HEAD
			$(".goods-name").html(data.res.gName); // 货物名称
			$("#goods-value").html(data.res.money); // 价值
			$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
			$("#get-time").html(data.res.getTime); // 获取时间
			$("#deadline").html(data.res.finTime); // 期望时间
			$("#sendaddr").html(data.res.sendAddr); // 发送地
			$("#receiveaddr").html(data.res.receiveAddr) // 接收地
			$("#gvalue").html(data.res.gValue); // value
			$("#info").html(data.res.info); // 信息描述
			var pic = data.res.pics;

			var n = BASEURL.indexOf('/api/');

			var per = BASEURL.substring(0, n);
			var len = pic.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var url = per + pic[i].path;
					var html = '<img src=' + url + ' width="100%">';
					document.querySelectorAll(".img-box")[i].innerHTML = html;
				}
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
=======
		$(".goods-name").html(data.res.gName); // 货物名称
		$("#goods-value").html(data.res.money); // 价值
		$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
		$("#get-time").html(data.res.getTime); // 获取时间
		$("#deadline").html(data.res.finTime); // 期望时间
		$("#sendaddr").html(data.res.sendAddr.name); // 发送地
		$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
		$("#gvalue").html(data.res.gValue); // value
		$("#info").html(data.res.info); // 信息描述
		var pic = data.res.pics;
		$('.rewrod').text(data.res.money)
		$('.rel').text(data.res.money)
		var n = BASEURL.indexOf('/api/');

		var per = BASEURL.substring(0, n);
		var len = pic.length;
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				var url = per + pic[i].path;
				//					var html = '<img src=' + url + ' width="100%">';
				//					document.querySelectorAll(".img-box")[i].innerHTML = html;
				$('<img class="picture" src="' + url + '">').appendTo('#picwrap');
			}
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
>>>>>>> 0694bcd3d905405a976feb0e1758d94229ec5190
	}, function(xhr, type) {
		console.log("错误代码：" + xhr.status + "    错误类型：" + type);
	})
})