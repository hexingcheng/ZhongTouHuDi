mui.init();
mui.plusReady(function() {
	var status;
	mui("#scroll-wrapper").scroll();
	var c = plus.webview.currentWebview();
	var datas = {};
	datas.orderId = c.orderId;
	datas.type = c.type;

	var back = mui.back;
	mui.back = function(){
		if (getstorage('getordertodtl') == 'on') {
		setstorage('getordertodtl', 'off');
		openWindow('../../page/getorder/get-order.html');
	} else {
		var getorder = plus.webview.getWebviewById('mygetorder/my-get-order')
		if(getorder){
			back();
			}else{
				openWindow('./my-get-order.html')
			}
		}
	}
//	
//	setTimeout(function(){
//		plus.webview.close(c, "none", 0)
//	}, 300)
	
	
	
//	showobj(datas)
	myAjax({
		url: 'order/goodShow',
		data: datas
	}, function(data) {
		status = data.res.status;
		renderdata(data);
		mui.toast('当前订单状态：' + data.res.status)
		$('#loading-mask').addClass('mui-hidden')
		$('#loading-box').addClass('mui-hidden')
		if (data.res.status == 1 && data.res.bargain == 1) {
			$('.cancel').removeClass('mui-hidden')
			$('.marktips').removeClass('mui-hidden');
			$('.addmoney').text(data.res.bargainMoney + ".0");
		}
		if (data.res.status == 2) {
			$('.cancel').text('cancel');
			$('.cancel').removeClass('mui-hidden');
			$('.check').addClass('mui-hidden');
			$('.write').addClass('mui-hidden');
		}
		if (data.res.status == 3) {
			$('.cancel').removeClass('mui-hidden');
			$('.check').addClass('mui-hidden');
			$('.write').addClass('mui-hidden');
			$('.cancel').text('order done');
		}
		if (data.res.status == 4) {
			$('.cancel').addClass('mui-hidden');
			$('.check').removeClass('mui-hidden');
			$('.write').removeClass('mui-hidden');
		}
		if (data.res.status == 5) {
			$('#foot').html('暂时没有评论')
		}
		if (data.res.status == 6) {
			$('#foot').html('该订单已完成')
		}
	}, function(xhr, type) {
		console.log(type)
	})

	$('.cancelinput').on('tap', function() {
		$('.mask').addClass('mui-hidden');
		$('.inputcode').addClass('mui-hidden');
	})
	$('.write').on('tap', function() {
		$('.mask').removeClass('mui-hidden');
		$('.inputcode').removeClass('mui-hidden');
	})
	$('.checkr').on('tap', function() {
		var code = parseInt($('#vacode').val());
		myAjax({
			url: 'order/confirmCode',
			data: {
				orderId: c.orderId,
				signCode: code
			}
		}, function(data) {
			if (data.ret == 1) {
				mui.toast('验证成功');
				$('.mask').addClass('mui-hidden');
				$('.inputcode').addClass('mui-hidden');
				$('#foot').html('暂时没有评论')
			}
			if (data.ret == 2) {
				$('.mask').addClass('mui-hidden');
				$('.inputcode').addClass('mui-hidden');
			}
		}, function(xhr, type) {
			console.log(type)
		})
	})
	$('.cancels').on('tap', function() {
		$('.mask').addClass('mui-hidden')
		$('.dialog').addClass('mui-hidden')
	})
	$('.cancel').on('tap', function() {
		if ($(this).text() == 'cancel bargin') {
			myAjax({
				url: 'order/bargainCancel',
				data: {
					orderId: c.orderId
				}
			}, function(data) {
				alert(data.ret)
				if (data.ret == 1) {
					openWindow('./my-get-order.html');
					var getorder = plus.webview.getWebviewById('mygetorder/my-get-order');
					getorder.show('slide-in-left', 200, function() {
						mui.fire(getorder, 'fresh')
					})
					mui.toast('取消议价成功');
					c.close();
				} else if (data.ret == 2) {
					mui.toast('非法操作')
				}
			}, function(xhr, type) {
				console.log(type)
			})
		} else if ($(this).text() == 'order done') {
			$('.mask').removeClass('mui-hidden');
			$('.dialog').removeClass('mui-hidden')
			$('.ok').on('tap', function() {
				$('.mask').addClass('mui-hidden');
				$('.dialog').addClass('mui-hidden');
				plus.nativeUI.showWaiting("确认中", {
					background: '#d1d1d1'
				})
				myAjax({
					url: 'order/pickUp',
					data: {
						orderId: c.orderId
					}
				}, function(data) {
					plus.nativeUI.closeWaiting();
					$('.cancel').addClass('mui-hidden');
					$('.check').removeClass('mui-hidden');
					$('.write').removeClass('mui-hidden');
				}, function(xhr, type) {
					console.log(type)
				})
			})
		} else if ($(this).text() == 'cancel') {
			var param = {};
			param.orderId = c.orderId;
			param.status = status;
			if (plus.webview.getWebviewById('cancel-reason')) {
				plus.webview.getWebviewById('cancel-reason').close();
				openWindow('./cancel-reason.html', param);
			} else {
				openWindow('./cancel-reason.html', param);
			}
		}
	})


	$('.check').on('tap', function() {
		plus.nativeUI.showWaiting('发送中', {
			background: '#d1d1d1'
		});
		myAjax({
			url: 'order/sendCode',
			data: {
				orderId: c.orderId
			}
		}, function(data) {
			if (data.ret == 1) {
				plus.nativeUI.closeWaiting();
				$('.mask').removeClass('mui-hidden');
				$('.confirm').removeClass('mui-hidden')
			}
		}, function(xhr, type) {
			console.log(type)
		})
	})

	$('.back').on('tap', function() {
		$('.check').text('resend check code');
		$('.mask').addClass('mui-hidden');
		$('.confirm').addClass('mui-hidden');
	})

	$('.checks').on('tap', function() {
		$('.confirm').addClass('mui-hidden');
		$('.inputcode').removeClass('mui-hidden');
	})
	$('#msg').on('tap', function() {
		var p = $('#msg').attr('data-p')
		sms(p)
	})
	$('#tel').on('tap', function() {
		var t = $(this).attr('data-p');
		dial(t)
	})

	function sms(tel) {
		var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		msg.to = [tel];
		msg.body = '';
		plus.messaging.sendMessage(msg);
	}

	function dial(t) {
		plus.device.dial(t, true);
	}

	function renderdata(data) {
		showobj(data.res)
		$(".goods-name").html(data.res.gName); // 货物名称
		$("#goods-value").html(data.res.money); // 价值
		$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
		$("#get-time").html(data.res.getTime); // 获取时间
		$("#deadline").html(data.res.finTime); // 期望时间
		$("#sendaddr").html(data.res.sendAddr.name); // 发送地
		$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
		$("#gvalue").html(data.res.gValue); // value
		$("#info").html(data.res.info); // 信息描述
		$('#sender').text(data.res.sender);
		$('#receiver').text(data.res.receiver)
		$('#msg').attr('data-p', data.res.senderPhone);
		$("#tel").attr('data-p', data.res.senderPhone)
		if (data.res.pics.length) {
			var pic = data.res.pics;
			var len = pic.length;
			for (var i = 0; i < len; i++) {
				var picurl = pic[i].path;
				var n = BASEURL.indexOf('/a');
				var perurls = BASEURL.substring(0, n);
				var imgurl = perurls + picurl;
				var img = document.createElement('img');
				img.className = 'picture'
				img.src = imgurl;
				document.getElementById('porel').appendChild(img);
			}
		} else {
			document.getElementById('porel').innerHTML = 'there are no picture in this order~';
		}
	}
})