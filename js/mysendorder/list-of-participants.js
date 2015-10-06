mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	var cpage = plus.webview.currentWebview();
	var orderid = cpage.orderid;
	var orderdetail = plus.webview.getWebviewById("order-detail");
//	var orderid = plus.storage.getItem("my-send-order");
	sendmsg({
		page: 1,
		pageSize: 10,
		orderId: orderid
	})
	plus.nativeUI.closeWaiting();

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
	

	// 添加选择该递送人
	var send = plus.webview.getWebviewById("mysendorder/my-send-order")
	var cpage = plus.webview.currentWebview();
	var $this;
	$("#choose-sender").on("tap", ".choose-item", function() {
		$this = $(this);
		$this.attr("disabled", true);
		var uid = this.getAttribute("data-uid");
		isreceived(function(data){
			if(data == 1){
				options.height = 160;
				options.title.content = "选择递送人";
				options.main.content = "once you choose a guy to send, it can't be undone",
				options.buttons[0] = {
					name : "ok",
					click : function(){
						choosedeliver(uid, orderid);
					}
				}
				options.buttons[1].name = "cancel";
				options.buttons[1].click = function(){
					_this.removeAttribute("disabled");
					_this.setAttribute("disabled", false);
				}
				var pop = new Popup(options)
				pop.show();
				
			} else if(data == 2){
				mui.toast("非发单人,没有权限查看");
				mui.fire(send, "refresh:alldata");
				plus.webview.show(send, "slide-in-left", 200);
				setTimeout(function(){
					plus.webview.currentWebview().close();
					plus.storage.removeItem("my-send-order")
				}, 300)
			} else if(data == 3){
				options.height = 150;
				options.title.content = "支付提示";
				options.main.content = "当前订单已经被他人抢单，是否进行支付？",
				options.buttons[0] = {
					name : "是",
					click : function(){
						/*openNewWindow("./mysendorder-detail-inform.html", {
							orderId : orderid,
							status : status
						})
						setTimeout(function(){
							plus.webview.currentWebview().close();
						}, 300)*/
						mui.fire(orderdetail, "refresh:page", {
							orderid :  orderid
						})
						orderdetail.show("slide-in-left", 300, function(){
							plus.webview.close(cpage, "none", 0);
						})
					}
				}
				options.buttons[1].name = "否";
				var pop = new Popup(options)
				pop.show();
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
				mui.fire(orderdetail, "refresh:page", {
					orderid :  orderid
				})
				orderdetail.show("slide-in-left", 350, function(){
					plus.webview.close(cpage, "none", 0);
				})
			} else if (data.ret == 2) {
				mui.toast("非法操作");
			} else if (data.ret == 3) {
				mui.toast("订单已接单");
			}
		}, function(xhr, type) {
			$this.attr("disabled", false);
			console.log(xhr.status + "  "+type)
		})
	}

	// 发送ajax获取显示数据
	function sendmsg(datas) {
		myAjax({
			url: "order/bargainList",
			data: datas
		}, function(data) {
//			console.log(JSON.stringify(data))
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
