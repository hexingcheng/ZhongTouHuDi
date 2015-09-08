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
		if(plus.webview.getWebviewById('mygetorder/mygetorderdtl')){
			plus.webview.getWebviewById('mygetorder/mygetorderdtl').close();
			openWindow("../mygetorder/mygetorderdtl.html",param)
		}else{
			openWindow("../mygetorder/mygetorderdtl.html",param)
		}
		getAllwebview();
		setTimeout(function() {
			closeweb();
			plus.webview.currentWebview().close();
		}, 1000)
	}, false)
	$('.left_button').on('tap',function(){
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