mui.init();
mui.plusReady(function() {
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
})