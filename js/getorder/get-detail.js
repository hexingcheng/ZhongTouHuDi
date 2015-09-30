mui.init();
var money;
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	var mp, reword, value;

	// 弹出框属性设置
	var options = {
		height: 220,
		title: {
			height: 40,
			content: "please input the reword"
		},
		main: {
			content: ''
		},
		buttons: [{
			name: "OK",
			click: function() {
				return true
			}
		}, {
			name: "cancel",
			click: function() {
				return true;
			}
		}]
	}

	// 显示markup弹出层
	var order = JSON.parse(plus.storage.getItem("order"));
	var getoderpage = plus.webview.getWebviewById("getorder/get-order");
	document.getElementById("markup").addEventListener("tap", function() {
		options.height = 220;
		options.main.content = '<div class="mak-worn">please input the reword you want to be paid on the order.</div>' +
			'<div class="borporal">' +
			'<div class="inner">' +
			'<input id="mar-i" placeholder="0.00" type="number">' +
			'</div>' +
			'</div>' +
			'<div class="cacu">' +
			'<div class="origin">' +
			'<span>oringin</span>' +
			'<span class="rewrod">' + reword + '</span>' +
			'</div>' +
			'<div class="now">' +
			'<span>real</span>' +
			'<span class="rel"></span>' +
			'</div>' +
			'</div>';
		options.buttons[0].click = function() {
			if (parseInt(money) < parseInt($('.rel').text())) {
				mui.toast('余额不足')
				openWindow('../wallet/my-recharge.html')
			} else {
				plus.nativeUI.showWaiting("议价中...", {
					background: "#ddd"
				});
				myAjax({
					url: "deliver/bargain",
					data: {
						orderId: order.orderid,
						money: $('#mar-i').val()
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
						openWindow('../applyfor/applyPerson.html')
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
		}

		var pop = new Popup(options)
		pop.show();

	}, false)

	// 实时显示当前已经结果显示
	$('body').on('keyup', "#mar-i", function() {
		var v = parseInt($(this).val()) || 0
		var or = parseInt($('.rewrod').text());
		var str = v + or;
		$('.rel').text(str);
	})

	function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
	mui('#picwrap').on('tap', 'img', function() {
		var index = this.getAttribute('data-index');
		$('.presee').removeClass('mui-hidden');
		$('.mui-slider-item', '#slider').filter(function(index) {
			return $('.mui-slider-item', '#slider').eq(index).find('img').attr('src') == '';
		}).remove();
		toverticalcenter()
		var gallery = mui('#slider');

		gallery.slider({
			interval: 0
		}).gotoItem(index);

	})
	$('.presee').on('tap', function() {
			$(this).addClass('mui-hidden')
		})
		// collect 按钮抢单
	var cpage = plus.webview.currentWebview();
	var open = plus.webview.getWebviewById("getorder/get-order");
	var opener = plus.webview.getWebviewById("order-content");
	document.getElementById("collect").addEventListener("tap", function() {
		options.height = 160;
		options.title.content = "抢单提示";
		options.main.content = "请问你是否抢单？"
		options.buttons[0].click = function() {
			if (parseInt(money) < parseInt(value)) {
				mui.toast('余额不足')
			} else {
				plus.nativeUI.showWaiting("接单中", {
					background: "#d1d1d1"
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
						mui.toast("此单已不存在");
					} else if (data.ret == 3) {
						mui.toast("其他人已接单");
					} else if (data.ret == 4) {
						mui.toast("需要递送人身份");
						openWindow("../applyfor/apply_info.html")
						setTimeout(function() {
							if (open) {
								plus.webview.close(open, "none", 0)
							}
							if (opener) {
								plus.webview.close(opener, "none", 0)
							}
						}, 300)
					} else if (data.ret == 5) {
						mui.toast("不能接自己的单");
					} else if (data.ret == 6) {
						mui.toast("当前禁止接单");
					} else if (data.ret == 7) {
						mui.toast("押金不足");
					}
				}, function(err) {
					plus.nativeUI.closeWaiting();
					console.log(err.status);
				})
			}
		}
		var pop = new Popup(options);
		pop.show();

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
	window.addEventListener("refresh:data", function() {
		refreshdata();
	})

	// 页面加载时，获取数据
	refreshdata();

	function refreshdata() {
		myAjax({
			url: "order/goodShow",
			data: {
				orderId: order.orderid,
				type: "comm"
			}
		}, function(data) {
			alert(data.ret)
			if (data.ret == 1) {
				$(".goods-name").html(data.res.gName); // 货物名称
				$("#goods-value").html(data.res.money); // 价值
				$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
				$("#get-time").html(data.res.getTime); // 获取时间
				$("#deadline").html(data.res.finTime); // 期望时间
				$("#sendaddr").html(data.res.sendAddr.name); // 发送地
				$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
				$("#gvalue").html(data.res.gValue); // value
				value = data.res.gValue;
				$("#info").html(data.res.info); // 信息描述
				var pic = data.res.pics;
				reword = data.res.money;
				$('.rel').text(data.res.money)
				var n = BASEURL.indexOf('/api/');
				var per = BASEURL.substring(0, n);
				var len = pic.length;
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						var url = per + pic[i].minPath;
						var minurl = per + pic[i].path;
						$('<img class="picture" src="' + url + '" data-index = "' + i + '">').appendTo('#picwrap');
						$('.preimg', '#slider').eq(i).attr('src', minurl)
					}
				}
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
			} else if (data.ret == 2) {
				mui.toast('该单以被接');
				var list = plus.webview.getWebviewById('getorder/get-order');
				mui.fire(list,'fresh');
				mui.back();
			}

			// 300毫秒之后清除等待框

		}, function(xhr, type) {
			console.log("错误代码：" + xhr.status + "    错误类型：" + type);
		})
	}
})