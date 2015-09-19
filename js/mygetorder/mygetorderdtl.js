mui.init();
mui.plusReady(function() {
	var status;
	mui("#scroll-wrapper").scroll();
	var c = plus.webview.currentWebview();
	var datas = {};
	datas.orderId = c.orderId;
	datas.type = c.type;
	
	var pop;	// 弹出框对象
	var wirtepopup;		// 写入code的弹出框
	var checkpopup;		// 重发送验证码弹出框对象
	var popshowed = false;		// 弹出框是否显示
	
	var back = mui.back;
	mui.back = function() {
		if(popshowed){
			if(pop){
				pop.hide(document.getElementById("lee-mask"), document.getElementById("lee-content-wrap"))
				popshowed = false;
			}
			if(wirtepopup){
				wirtepopup.hide(document.getElementById("lee-mask"), document.getElementById("lee-content-wrap"))
				popshowed = false;
			}
			if(checkpopup){
				checkpopup.hide(document.getElementById("lee-mask"), document.getElementById("lee-content-wrap"))
				popshowed = false;
			}
			return;
		}
		if (getstorage('getordertodtl') == 'on') {
			setstorage('getordertodtl', 'off');
			openWindow('../../page/getorder/get-order.html');
		} else {
			var getorder = plus.webview.getWebviewById('mygetorder/my-get-order')
			if (getorder) {
				back();
			} else {
				openWindow('./my-get-order.html')
			}
		}
	}
	// 弹出框的属性
	var options = {
		height : 170,
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
	
	myAjax({
		url: 'order/goodShow',
		data: datas,
		wait: false
	}, function(data) {
		status = data.res.status;
		renderdata(data);
		mui.toast('当前订单状态：' + data.res.status)
		$('#loading-mask').addClass('mui-hidden')
		$('#loading-box').addClass('mui-hidden')
		if (data.res.status == 1 && data.res.bargain == 1) {		// cancel bargin  取消议价
			$('.cancel').removeClass('mui-hidden')
			options.title.content = "取消提示";
			options.main.content = "您确定要取消改单的议价？"
			options.buttons[0].click = function(){
				myAjax({
					url: 'order/bargainCancel',
					data: {
						orderId: c.orderId
					}
				}, function(data) {
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
			}
			$('.marktips').removeClass('mui-hidden');
			$('.addmoney').text(data.res.bargainMoney + ".0");
		}
		if (data.res.status == 2) {				// 待付款
			$('.cancel').text('cancel');
			$('.cancel').removeClass('mui-hidden');
			$('.check').addClass('mui-hidden');
			$('.write').addClass('mui-hidden');
			options.title.content = "取消提示";
			options.main.content = "您确定要取消此条订单消息吗？取消订单将要扣除积分"
			options.buttons[0].click = function(){
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
		}
		if (data.res.status == 3) {			// 未取货
			$('.cancel').removeClass('mui-hidden');
			$('.check').addClass('mui-hidden');
			$('.write').addClass('mui-hidden');
			$('.cancel').text('order done');
			options.title.content = "确定取货提示";
			options.main.content = "您确定已经取货了吗？"
			options.buttons[0].click = function(){
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
			}
		}
		if (data.res.status == 4) {			// 已取货
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

	// 点击按钮第一个按钮的时候弹出弹出框
	$('.cancel').on('tap', function() {
		pop = new Popup(options);
		popshowed = true;
		pop.show();
	})

	// 验证码输入弹出框
	$('.write').on('tap', function() {
		options.height = 200;
		options.title.content = "please input pick up code";
		options.main.content = '<p>input your code from receiver</p><div><input type="text" id="vacode" style="margin: 12px 10%;width: 80%; display: inline-block;" /></div>';
		options.buttons[0].click = function(){
			console.log($('#vacode').val())
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
		}
		wirtepopup = new Popup(options);
		popshowed = true;
		wirtepopup.show();
	})
	
	// 图片预览
	mui('#porel').on('tap', 'img', function() {
		$('.presee').removeClass('mui-hidden')
		$('.mui-slider-item', '#slider').filter(function(index) {
			return $('.mui-slider-item', '#slider').eq(index).find('img').attr('src') == '';
		}).remove();
		var index = this.index;
		var gallery = mui('#slider');
		toverticalcenter()
		gallery.slider({
			interval: 0
		}).gotoItem(index);
	})
	$('.presee').on('tap', function() {
		$(this).addClass('mui-hidden')
	})
	
	// 发送验证码
	$('.check').on('tap', function() {
		options.height = 160;
		options.title.content = "提示";
		options.main.content = "需要重新发送一次验证码吗？"
		options.buttons[0].click = function(){
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
		}
		checkpopup = new Popup(options);
		popshowed = true;
		checkpopup.show();
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

	function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
	function renderdata(data) {
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
		} else {
			document.getElementById('porel').innerHTML = 'there are no picture in this order~';
		}
	}
})