mui.init();
mui.plusReady(function() {
	var thispage = plus.webview.currentWebview();
	var opener = plus.webview.currentWebview().opener();

	var names = document.getElementById("name");
	var account = document.getElementById("to-acount");

	if (thispage.mcid) {
		myAjax({
			url: "wallet/ moneyChannelDetail",
			data: {
				mcId: thispage.mcid
			}
		}, function(data) {
			//	      			console.log(JSON.stringify(data));
			if (data.ret == 1) {
				names.value = data.res.detail.userName;
				account.value = data.res.detail.cardNum;
			} else if (data.ret == 2) {
				mui.toast("渠道数据不存在");
			}
		})
	}



	// last step 事件的添加
	document.getElementById("ok-btn").addEventListener("tap", function() {
		var name = names.value.trim();
		var count = account.value.trim();
		if (name && count) {

			//	      			 新增提现渠道接口
			myAjax({
				url: "wallet/addMoneyChannel",
				data: {
					channel: "paypal", // 渠道名称（当前默认为paypal）
					userName: name,
					cardNum: count
				}
			}, function(data) {
				//	      				console.log(JSON.stringify(data));
				if (data.ret == 1) {
					mui.fire(opener, "paypal:list") // 触发取现更新渠道
					plus.webview.show(opener, "slide-in-left", 200);
					plus.webview.close(thispage, "slide-out-right", 200);
				} else if (data.ret == 2) {
					mui.toast("已经存在该账户");
				}
			}, function(xhr, type) {
				console.log("错误代号：" + xhr.status + "   错误类型：" + type);
			})
		} else {
			mui.toast("请完善资料填写");
		}
	}, false);
})