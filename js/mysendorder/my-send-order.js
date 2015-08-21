mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	// 默认发送第一次
	sendmsg({
		"page": 1,
		"pageSize": 10,
		"type": "send",
		"status": 1
	})

	// 委托显示详情界面
	mui("#segmentedControl").on("tap", "a", function() {
		var datas = {
			"page": 1,
			"pageSize": 10,
			"type": "send",
			"status": this.getAttribute("data-status")
		};
		//					console.log(JSON.stringify(datas));
		sendmsg(datas); // 调用函数进行数据渲染
	})

	// 详情页面显示跳转代理事件
	mui("#link-detail").on("tap", "#go-detail", function() {
		var status = this.getAttribute("data-status");
		var statusDetail = this.getAttribute("data-detail");
		// 储存订单号
		plus.storage.setItem("my-send-order", this.getAttribute("data-orderid"));
		if (statusDetail == "11" || statusDetail == "13") {
			openWindow("./mysendorder-detail-inform.html");
		} else if (status === "2" || statusDetail == "12") {
			openWindow("./mysendorder-detail-transporting.html");
		} else if (status === "3") {
			openWindow("./mysendorder-detail-finish.html");
		} else if (status === "4") {
			openWindow("./mysendorder-detail-cancel.html");
		}
	})

	// 返回首页
	mui.back = function() {
		var index = plus.webview.getLaunchWebview();
		var cpage = plus.webview.currentWebview();
		index.show("slide-in-left", 300, function() {
			cpage.close("none", 0)
		})
	}

	/*	// 实现上拉刷新与下拉刷新功能
		mui.each(document.querySelectorAll("#link-detail .mui-control-content"), function(index, element){
			mui(element).pullToRefresh({
				// 上拉的时候
				down : {
					callback : function(){
						
					}
				},
				// 上拉的时候
				up : {
					callback : function(){
						
					}
				}
			})
		})
		*/
})

// 发送数据状态显示详情界面信息
function sendmsg(datas) {
	myAjax({
		url: 'order/myGoodList',
		data: datas
	}, function(data) {
		var orderdata = {
				"list": data.res
			}
		// 模板渲染
		var html = template("template", orderdata);
		if (!html) {
			html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
		}
		document.getElementById('item' + datas.status).innerHTML = html;
	}, function(xhr, type, error) {
		console.log(type)
	})
}