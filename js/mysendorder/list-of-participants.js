mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();

	var orderid = plus.storage.getItem("my-send-order");
	//    		console.log(orderid);
	sendmsg({
		page: 1,
		pageSize: 10,
		orderId: orderid
	})
	plus.nativeUI.closeWaiting();

	// 添加选择该递送人
	var cpage = plus.webview.currentWebview();
	mui("#choose-sender").on("tap", ".choose-item", function() {
		var datas = {
			uid: this.getAttribute("data-uid"),
			orderId: orderid
		}
		myAjax({
			url: "order/bargainConfirm",
			data: datas
		}, function(data) {
			if (data.ret == 1) {
				mui.toast("选择递送人成功");
				openWindow("./mysendorder-detail-transporting.html", {
					orderId : orderid
				})
				setTimeout(function() {
					plus.webview.close(cpage, "none", 0);
				}, 2000)
			} else if (data.ret == 2) {
				mui.toast("非法操作");
			} else if (data.ret == 3) {
				mui.toast("订单已接单");
			}
		}, function(xhr, type) {
			console.log(type)
		})
	})

	// 查看用户信息
	mui("#choose-sender").on("tap", ".headimg-box", function() {
		var ud = this.getAttribute("data-uid");
		console.log(ud);
		openWindow("../person/myinfo.html", {
			uid: ud
		})
	})


})

function sendmsg(datas) {
	myAjax({
		url: "order/bargainList",
		data: datas
	}, function(data) {
		var obj = {
			list: data.res
		}
		var html = template("template", obj);
		document.getElementById("choose-sender").innerHTML = html;
	}, function(xhr, type) {
		console.log(type);
	})
}