mui.init();
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	// 当前余额
	var cash = document.getElementById("remain-cash");
	myAjax({
		url: "wallet/money",
		data: {}
	}, function(data) {
		cash.innerHTML = data.res.money;
	})

	// 解析当前用户信息
	var info = JSON.parse(plus.storage.getItem("personinfo"));
	if(info){
		document.getElementById("account-num").innerHTML = info.phone;
	} else {
		mui.toast("当前未登陆");
	}

	// 充值
	document.getElementById("recharge").addEventListener("tap", function() {
		var val = document.getElementById("amount").value.trim();
		var reg = /^([0-9]*.?[0-9]*)$/.exec(val)
		if (reg[0]) {
			var amout = parseFloat(reg[0]);
			if (amout > 0) {
				myAjax({
					url: "wallet/recharge",
					data: {
						money: amout,
						pcId: "paypal"
					}
				}, function(data) {
					console.log(JSON.stringify(data))
				})
			} else {
				mui.toast("请正确输入充值金额")
			}
		} else {
			mui.toast("请输入需要充值金额")
		}
	}, false);
})