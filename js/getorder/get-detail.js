mui.init();
var money;
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	var mp;
	var mask = document.getElementById("order-mask");
	var panel = document.getElementById("markups");
	// 显示markup弹出层
	document.getElementById("markup").addEventListener("tap", function() {
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
	document.getElementById("cancel").addEventListener("tap", function() {
		$('#order-mask').addClass('mui-hidden');
		$('#markups').addClass('mui-hidden');
	}, false)

	mask.addEventListener("tap", function() {
		$('#order-mask').addClass('mui-hidden');
		$('#markups').addClass('mui-hidden');
	}, false)
  
	var order = JSON.parse(plus.storage.getItem("order"));

	// 议价弹出层
	var getoderpage = plus.webview.getWebviewById("getorder/get-order");
	document.getElementById("ok").addEventListener("tap", function() {
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
	}, false)


	// collect 按钮抢单
	document.getElementById("collect").addEventListener("tap", function() {
			if (parseInt(money) < parseInt($('.rel').text())) {
				alert('余额不足')
			} else {
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
						openWindow("./get-result.html", {
							orderId: order.orderid
						});
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
	
	// 定义刷新页面数据显示
	window.addEventListener("refresh:data", function(){
		refreshdata();
	})
	
		// 页面加载时，获取数据
	refreshdata(); 
	alert(1)
	function refreshdata() {
		myAjax({
			url: "order/goodShow",
			data: {
				orderId: order.orderid,
				type: "comm"
			}
		}, function(data) {
		alert(JSON.stringify(data));    
//			showobj(data.res.pics[0]);
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
			alert(JSON.stringify(data.res.pics))
			$('.rewrod').text(data.res.money)
			$('.rel').text(data.res.money)
			var n = BASEURL.indexOf('/api/');
			var per = BASEURL.substring(0, n);
			var len = pic.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var url = per + pic[i].path;   
					console.log(url)
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
		}, function(xhr, type) {
			console.log("错误代码：" + xhr.status + "    错误类型：" + type);
		})
	}
})