mui.plusReady(function() {
	mui('body').on('tap','#backtolist', function() {
		var msorder = plus.webview.getWebviewById('mysendorder/my-send-order');
		if(msorder){
			msorder.show('slide-in-left',300);
		}else{
//			plus.webview.getLaunchWebview().show('slide-in-left',300)
			var wallet = plus.webview.getWebviewById('wallet/my-wallet');
			wallet.show('slide-in-left',300);
		}
		setTimeout(function(){
			var arrs = ['order-detail','pay/pay','paypal']
			closeweb(arrs);
		},1000)
	})
})
function closeweb(arr){
	var len = arr.length;
	for(var i = 0;i<len;i++){
		var web = plus.webview.getWebviewById(arr[i]);
		if(web){
			web.close()
		}
	}
}
