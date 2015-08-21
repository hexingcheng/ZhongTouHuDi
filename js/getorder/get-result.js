mui.init();
mui.plusReady(function() {
	// 返回get-order接单首页界面
	document.getElementById("view-order").addEventListener("tap", function() {
		plus.storage.removeItem("order"); // 删除本地存储
		//    			var getorder = plus.webview.getWebviewById("getorder/get-order");
		mui.openWindow({
			url: "./get-order.html",
			id: "get-order",
			createNew: true,
			show: {
				autoShow: true,
				aniShow: "slide-in-left",
				duration: 300
			},
			waiting: {
				title: "正在加载中...",
				options: {
					background: "#ddd"
				}
			}
		})
		var pages = ["get-filter", "get-detail"];
		setTimeout(function() {
			for (var i = 0; i < pages.length; i++) {
				var page = plus.getWebviewById(pages[i]);
				if (page) {
					plus.webview.close(page, "fade-out", 200);
				}
			}
		}, 300)
		var cupage = plus.webview.currentWebview();
		getorder.show("slide-in-left", 300, function() {
			cupage.close("fade-out", 200)
		})
	}, false)
})