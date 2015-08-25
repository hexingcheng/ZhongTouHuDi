mui.init();
mui(".mui-scroll-wrapper").scroll();
jQuery(function() {
	var time = "";
	var reword = "";
	var weight = "";
	$('.range-reward').jRange({
		from: 0,
		to: 50,
		step: 1,
		scale: ["$0", "$10", "$20", "$30", "$40", "$50"],
		format: '%s',
		width: $(".rang-slider-bar").width(),
		showLabels: true,
		isRange: true,
		onstatechange: function() {
			reword = $('#reword').val();
		}
	});
	$('.range-weight').jRange({
		from: 0,
		to: 100,
		step: 1,
		scale: ["0kg", "20kg", "40kg", "60kg", "80kg", "100kg"],
		format: '%s',
		width: $(".rang-slider-bar").width(),
		showLabels: true,
		isRange: true,
		onstatechange: function() {
			weight = $('#weight').val();
		}
	});
	$(".mui-button-row").on("tap", "button", function() {
		time = $(this).attr('data-time')
		$(".mui-button-row").find("button").removeClass("active-color");
		$(this).addClass("active-color");
	})

	// 取消按钮
	document.getElementById("cancel").addEventListener("tap", function() {
		//				mui.back();
	}, false)

	// ok 按钮
	document.getElementById("ok-btn").addEventListener("tap", function() {
		var filterdata = {};
		filterdata.sendAddr = $('#departure').val();
		filterdata.receiveAddr = $('#destination').val();
		filterdata.finTime = time;
		filterdata.prices = reword;
		filterdata.weights = weight;
		var order = plus.webview.getWebviewById('getorder/get-order');
		order.show('slide-in-left', 200);
		mui.fire(order, 'getfilter', filterdata)
		plus.webview.currentWebview().close();
	}, false)
})