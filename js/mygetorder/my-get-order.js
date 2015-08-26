mui.init({
	beforeback: function(){
		plus.webview.getLaunchWebview().show('slide-in-left',200)
		return false;
	}
});
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	function closewebs(){
		if(plus.webview.getWebviewById('mygetorderdtl')){
			plus.webview.getWebviewById('mygetorderdtl').close();
		}
		if(plus.webview.getWebviewById('cancel-reason')){
			plus.webview.getWebviewById('cancel-reason')
		}
	}
	// ajax 获取模板数据
	getlist(1);
	mui('.mui-segmented-control').on('tap', '.mui-control-item', function() {
		var sta = this.getAttribute('data-sta');
		getlist(sta)
	})
	function getlist(status) {
		var status = status||1
		var getorderdata = {
			"page": 1,
			"pageSize": 10,
			"type": "rece",
			"status": status
		};
		myAjax({
			url : 'order/myGoodList',
			data: getorderdata
		}, function(data) {
			var orderdata = {
				"list": data.res
			}
			var html = template("template", orderdata);
			if (!html) {
				html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
			}
			document.getElementById('item' + status).innerHTML = html;
		}, function(xhr, type, errorThrown) {
			console.log(type);
		})
	}

	window.addEventListener('fresh',function(){
		getlist();
	})
	mui('#link-detail').on('tap', '.mui-table-view', function() {
		var orderid = this.getAttribute('data-id');
		var datas = {
			orderId: orderid,
			type: 'rece'
		};
		
		openWindow('./mygetorderdtl.html',datas)
	})
})