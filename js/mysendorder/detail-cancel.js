mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	var cpage = plus.webview.currentWebview();

	var orderid = plus.storage.getItem("my-send-order") || cpage.orderId;
	
	sendmsg(orderid);
	
		// 重新发布
	var sendorder = plus.webview.getWebviewById("mysendorder/my-send-order") || 
					plus.webview.getWebviewById("my-send-order") || 
					plus.webview.currentWebview().opener();
	
	// 对不同情况下进行不同的回退功能
	if(cpage.orderId){
		mui.back = function(){
			mui.fire(sendorder, "refresh:data")
			plus.webview.show(sendorder, "slide-in-left", 300,function(){
				setTimeout(function(){
					plus.webview.close(cpage, "none", 0);
				}, 300)
			})
		}
	}

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

	// 重新编辑
	document.getElementById("edit-btn").addEventListener("tap", function() {
		options.title.content = "订单修改提示";
		options.main.content = "您确定要重新修改订单吗？",
		options.buttons[0] = {
			name : "OK",
			click : function(){
				myAjax({
					url : "order/goodShow",
					data : {
						"orderId": orderid,
						"type": "send"
					},
					wait : false
				}, function(data){
					plus.storage.setItem("draft-datas", JSON.stringify(data))
					openWindow("../sendorder/createorder.html", {
						type : "cancel"
					})
					setTimeout(function() {
						plus.webview.getWebviewById("mysendorder/my-send-order").close("none", 0);
						plus.webview.getWebviewById("mysendorder-detail-cancel").close("none", 0);
						plus.webview.close(cpage, "none", 0)
					}, 1000)
					plus.storage.removeItem("my-send-order")
				})
			}
		}
		options.buttons[1].name = "cancel";
		var pop = new Popup(options)
		pop.show();
	})
	
	// 图片预览
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
	
	// 重新发布
	document.getElementById("resend-btn").addEventListener("tap", function() {
		options.title.content = "订单修改提示";
		options.main.content = "您确定要重新发布订单吗？",
		options.buttons[0] = {
			name : "OK",
			click : function(){
				myAjax({
					url: "order/release",
					data: {
						orderId: orderid
					}
				}, function(data) {
					if (data.ret == 1) {
						mui.toast("发布成功")
					} else if(data.ret == 2){
						mui.toast("发布失败，检查订单信息")
					}
					mui.fire(sendorder, "refresh:alldata")
					plus.webview.show(sendorder, "slide-in-left", 300,function(){
						setTimeout(function(){
							plus.webview.close(cpage, "none", 0);
						}, 300)
					})
				}, function(xhr, type) {
					console.log(xhr.status);
				})
			}
		}
		options.buttons[1].name = "cancel";
		var pop = new Popup(options)
		pop.show();
	}, false)
})
function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
// 发送消息显示页面信息
function sendmsg(orderid) {
	// 页面加载时，获取数据
	myAjax({
		url: "order/goodShow",
		data: {
			orderId: orderid,
			type: "send"
		},
		wait : false
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

		// 判断是否在议价,显示议价消息链接框
		if (data.res.bargain == 1) {
			$("#msg-warn").css("display", "block")
		} else {
			$("#msg-warn").css("display", "none")
		}

		// 300毫秒之后清除等待框
		setTimeout(function() {
			closeMask();
		}, 300)
	}, function(xhr, type) {
		console.log(type);
	})
}