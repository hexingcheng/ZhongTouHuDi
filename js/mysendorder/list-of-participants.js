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

	// 添加选择该递送人\
	var send = plus.webview.getWebviewById("mysendorder/my-send-order")/* || 
				plus.webview.getWebviewById("my-send-order)*/
	var cpage = plus.webview.currentWebview();
	mui("#choose-sender").on("tap", ".choose-item", function() {
		var uid = this.getAttribute("data-uid");
		isreceived(function(data){
			if(data == 1){
				choosedeliver(uid, orderid);
			} else if(data == 2){
				mui.toast("非发单人,没有权限查看");
				mui.fire(send, "refresh:alldata");
				plus.webview.show(send, "slide-in-left", 200);
				setTimeout(function(){
					plus.webview.currentWebview().close();
					plus.storage.removeItem("my-send-order")
				}, 300)
			} else if(data == 3){
				// 当前有人抢单后，需要进行发单人提醒该单已经抢单。是否需要支付
				plus.nativeUI.confirm("当前订单已经被他人抢单，是否进行支付？", function(eve){
					if(eve.index == 1){
						openNewWindow("./mysendorder-detail-inform.html", {
							orderId : orderid,
							status : status
						})
						setTimeout(function(){
							plus.webview.currentWebview().close();
							plus.storage.removeItem("my-send-order")
						}, 300)
					}
				}, "支付提示", ["否", "是"])
			}
		})
	})

	// 查看用户信息
	mui("#choose-sender").on("tap", ".headimg-box", function() {
		var ud = this.getAttribute("data-uid");
		console.log(ud);
		openWindow("../person/new_personal_info.html", {
			uid: ud
		})
	})
	
	// 判断订单是否被抢单
	function isreceived(callback){
		myAjax({
			url : "order/bargainList",
			data : {
				page : 1,
				pageSize : 1,
				orderId : orderid
			},
			wait : false
		}, function(data){
//			console.log(JSON.stringify(data))
			callback(data.ret);
		}, function(xhr, type){
			console.log("错误代号："+xhr.status + "    错误类型："+type);
		})
	}
	
	// 选择订单人
	function choosedeliver(id, order){
		var datas = {
			uid: id,
			orderId : order
		}
		console.log(JSON.stringify(datas))
		myAjax({
			url: "order/bargainConfirm",
			data: datas,
			wait : false
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
	}

	// 发送ajax获取显示数据
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
})
