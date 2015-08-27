mui.init()
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	// 获取当前金额
	var money = document.getElementById("current-money");
	myAjax({
		url: "wallet/money",
		data: {},
		wait : false
	}, function(data) {
		money.innerHTML = data.res.money;
	}, function(xhr, type) {
		console.log(type);
	})

	// 获取收入支出情况
	myAjax({
		url: "wallet/moneyLog",
		data: {
			page: 1,
			pageSize: 10
		},
		wait : false
	}, function(data) {
//		console.log(JSON.stringify(data))
		var obj = {
			"list": data.res.moneyLog
		}
		var html = template("recodes", obj);
		document.getElementById("recode").innerHTML = html;
		// 关闭遮罩层
		setTimeout(function(){
			closeMask();
		}, 50)
	}, function(xhr, type) {
		console.log(type);
	})


	// 添加取现与充值的功能模块
	mui("#show-info").on("tap", "a", function(eve) {
		eve.preventDefault()
		var href = this.href;
		openWindow(href);
	})
})