mui.init();
mui.plusReady(function() {
	var status;
	mui("#scroll-wrapper").scroll();

	var orderid = plus.storage.getItem("my-send-order");
	// 显示数据
	sendmsg(orderid);

	// 议价中添加选取递送人
	$("#msg-warn").on("tap", ".link-btn", function() {
		openWindow($(this).attr("data-href"));
	})
	
	// 取消订单
	$("#cancel-order").on("tap", function() {
		plus.nativeUI.confirm("您确认要取消此条订单消息吗？", function(eve){
			if(eve.index == 1){
				openWindow("./cancel-reason.html", {
					orderId: orderid,
					status:status
				})
				plus.storage.removeItem("my-send-order")
			}
		}, "取消提示", ["cancel", "ok"])
	})
	
	// 返回首页
	var cpage = plus.webview.currentWebview();
	var index = plus.webview.getLaunchWebview();
	if(cpage.type = "createorder"){
		mui.back = function(){
			plus.webview.show(index, "slide-in-left", 200)
			setTimeout(function(){
				plus.webview.close(cpage, "none", 0)
			}, 2000)
		}
	}
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
//		console.log(JSON.stringify(data))
		$(".goods-name").html(data.res.gName); // 货物名称
		$("#goods-value").html(data.res.money); // 价值
		$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
		$("#get-time").html(data.res.getTime); // 获取时间
		$("#deadline").html(data.res.finTime); // 期望时间
		$("#sendaddr").html(data.res.sendAddr.name); // 发送地
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