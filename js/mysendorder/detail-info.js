mui.init();
mui.plusReady(function() {
	var status;
	mui("#scroll-wrapper").scroll();

	var orderid = plus.storage.getItem("my-send-order");
	// 显示数据
	sendmsg(orderid);

	// 取消订单弹出框
	var options = {
		height : 150,
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
	// 取消订单
	$("#cancel-order").on("tap", function() {
		// 在共有属性中添加需要的设置
		options.title.content = "取消提示";
		options.main.content = "您确认要取消此条订单消息吗？",
		options.buttons[0] = {
			name : "OK",
			click : function(){
				openWindow("./cancel-reason.html", {
					orderId: orderid,
					status:status
				})
				plus.storage.removeItem("my-send-order")
			}
		}
		options.buttons[1].name = "cancel";
		var pop = new Popup(options)
		pop.show();
	})
	
	// 议价中添加选取递送人
	$("#msg-warn").on("tap", function() {
		myAjax({
			url : "order/bargainList",
			data : {
				page : 1,
				pageSize : 3,
				orderId : orderid
			},
			wait : false
		}, function(data){
//			console.log(JSON.stringify(data))
			if(data.ret == 1){
				openWindow("./list-of-participants.html");
			} else if(data.ret == 2){
				mui.toast("非发单人没有权限查看")
			} else if(data.ret == 3){
				// 当前有人抢单后，需要进行发单人提醒该单已经抢单。是否需要支付
				options.title.content = "支付提示";
				options.main.content = "当前订单已经被他人抢单，是否进行支付？",
				options.buttons[0] = {
					name : "是",
					click : function(){
						openNewWindow("./mysendorder-detail-inform.html", {
							orderId : orderid,
							status : status
						})
						setTimeout(function(){
							plus.webview.currentWebview().close();
							plus.storage.removeItem("my-send-order")
						}, 300)
					}
				}
				options.buttons[1].name = "否";
				var pop = new Popup(options)
				pop.show();
			}
		})
	})
	
	
	// 返回首页
	var cpage = plus.webview.currentWebview();
	var index = plus.webview.getLaunchWebview();
	if(cpage.type){
		mui.back = function(){
			plus.webview.show(index, "slide-in-left", 200)
			setTimeout(function(){
				plus.webview.close(cpage, "none", 0)
			}, 2000)
		}
	}
})
function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
	mui('#porel').on('tap', 'img', function() {
		
		$('.presee').removeClass('mui-hidden')
		$('.mui-slider-item', '#slider').filter(function(index) {
			return $('.mui-slider-item', '#slider').eq(index).find('img').attr('src') == '';
		}).remove();
		var index = this.index;
		toverticalcenter()
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
		wait : false
	}, function(data) {
		$(".goods-name").html(data.res.gName); // 货物名称
		$("#goods-value").html(data.res.money); // 价值
		$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
		$("#get-time").html(data.res.getTime); // 获取时间
		$("#deadline").html(data.res.finTime); // 期望时间
		$("#sendaddr").text(data.res.sendAddr.name); // 发送地 
		$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
		$("#gvalue").html(data.res.gValue); // value
		$("#info").html(data.res.info); // 信息描述
		status = data.res.status;
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