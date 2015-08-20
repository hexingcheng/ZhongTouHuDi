mui.init({
	swipeBack　: true
});
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll(); 
	var money = document.getElementById("current-money");
	var point = document.getElementById("gold-point");
	var coupon = document.getElementById("coupon");
	var showlist = document.getElementById("show-recodes");
	var url = BASEURL + "wallet/info";
	var listobj = null;
	// 发送给ajax获取余额信息显示
//	console.log("nihao")
	mui.ajax(url, {
		type: "post",
		success: function(data) {
			if (data.ret == 0) {
				money.innerHTML = data.res.money;
				point.innerHTML = data.res.point;
				coupon.innerHTML = data.res.coupon;
				var obj = {
					list: data.res.logList
				}
				var html = template("recode", obj);
				showlist.innerHTML = html;
				// 获取当前数据储存在storage中，避免再次进行ajax请求发送
				listobj = JSON.stringify(data.res.logList);
			}
		},
		error: function(xhr, type) {
			console.log(type)
		}
	})

	// 点击链接请求
	mui("#show-info").on("tap", "a", function(eve) {
		eve.preventDefault();
		var href = this.getAttribute("data-src");
		var obj = {
			money: money.innerHTML,
			point: point.innerHTML,
			coupon: coupon.innerHTML,
			list: listobj
		}
		plus.storage.setItem("recode", JSON.stringify(obj));
		openWindow(href)
	})

})