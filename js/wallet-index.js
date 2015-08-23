mui.init({
	swipeBack　: true
});
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll(); 
	var money = document.getElementById("current-money");
	var point = document.getElementById("gold-point");
	var coupon = document.getElementById("coupon");
	var showlist = document.getElementById("show-recodes");
	// 	发送给ajax获取余额信息显示
	myAjax({
		url : "wallet/info",
		data : {}
	}, function(data) {
//		console.log(JSON.stringify(data))
		money.innerHTML = data.res.money;
		point.innerHTML = data.res.point;
		coupon.innerHTML = data.res.coupon;
		var obj = {
			list: data.res.logList
		}
		var html = template("recode", obj);
		showlist.innerHTML = html;
	},  function(xhr, type) {
		console.log("错误代号："+ xhr.status + "    错误类型："+type)
	})
	
	
	// 点击链接请求
	mui("#show-info").on("tap", "a", function(eve) {
		eve.preventDefault();
		var href = this.getAttribute("data-src");
		openWindow(href)
	})

})