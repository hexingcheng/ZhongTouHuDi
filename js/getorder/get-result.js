mui.init();
mui.plusReady(function() {
<<<<<<< HEAD
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
=======
	var c = plus.webview.currentWebview();
	var id = c.orderId;
	// 返回get-order接单首页界面
	document.getElementById("view-order").addEventListener("tap", function() {
		setstorage('getordertodtl','on');
		plus.storage.removeItem("order"); // 删除本地存储
		var param = {};
		param.orderId = id;
		param.type = 'rece';
		openWindow("../mygetorder/mygetorderdtl.html",param)
		setTimeout(function() {
			closeweb();
		}, 1000)
	}, false)
	$('.button-first').on('tap',function(){
		plus.webview.getLaunchWebview().show('slide-in-left',200,function(){
			setTimeout(function(){
				closeweb();
			},1000)
		})
	})
	function closeweb(){
		var pages = ["get-filter", "get-detail","getorder/get-order"];
		for(var i = 0;i<pages.length;i++){
			if(plus.webview.getWebviewById(pages[i])){
				plus.webview.getWebviewById(pages[i]).close();
			}
		}
	}
>>>>>>> 0694bcd3d905405a976feb0e1758d94229ec5190
})