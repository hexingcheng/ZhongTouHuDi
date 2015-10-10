mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
var whichstatus = 1;
var whichpage = {
	'1': 1,
	'2': 1,
	'3': 1
}

function pulldownRefresh() {
	var old = document.getElementById('pullrefreshs').innerHTML;
//	plus.nativeUI.showWaiting('刷新中', {
//		background: '#d1d1d1'
//	})
	var data = {
		"page": 1,
		"pageSize": 10,
		"type": "send",
		"status": whichstatus
	}
	sendmsg(data)

	function sendmsg(data) {
		document.getElementById('pullrefreshs').innerHTML = "";
		myAjax({
			url: 'order/myGoodList',
			data: data,
			wait: false
		}, function(data) {
//			plus.nativeUI.closeWaiting();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			var orderdata = {
				"list": data.res.orderList
			}
				// 模板渲染
			var html = template("template", orderdata);
			if (html == old) {
				mui.toast('没有最新数据')
			}
			if (old.indexOf('none.png') != -1 && !html) {
				html = old;
				mui.toast('没有新数据')
			}
			document.getElementById('pullrefreshs').innerHTML = html;
		}, function(xhr, type, error) {
			console.log(type)
		})
	}
}

function pullupRefresh() {
	var old = document.getElementById('pullrefreshs').innerHTML
	var data = {
		"page": 1,
		"pageSize": 10,
		"type": "send",
		"status": status
	}
	data.page = ++whichpage[whichstatus]
	sendmsg(data)

	function sendmsg(datas) {
		myAjax({
			url: 'order/myGoodList',
			data: datas,
			wait: false
		}, function(data) {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh()
			var orderdata = {
					"list": data.res.orderList
				}
				// 模板渲染
			plus.nativeUI.closeWaiting();
			var html = template("template", orderdata);
			if (!html) {
				mui.toast('no more')
			}
			var str = old + html;
			document.getElementById('pullrefreshs').innerHTML = str;
		}, function(xhr, type, error) {
			console.log(type)
		})
	}
}
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	// 默认发送第一次

	sendmsg({
		"page": 1,
		"pageSize": 10,
		"type": "send",
		"status": 1
	})
	window.addEventListener('renderdata', function(eve) {
			whichstatus = eve.detail.status
			var data = {
				"page": 1,
				"pageSize": 10,
				"type": "send",
				"status": whichstatus
			}
			sendmsg(data);


		})
		// 委托显示详情界面

	function sendmsg(datas) {
			myAjax({
				url: 'order/myGoodList',
				data: datas,
				wait: false
			}, function(data) {
				var orderdata = {
						"list": data.res.orderList
					}
					// 模板渲染
				var html = template("template", orderdata);
				if (!html) {
					html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
				}
				document.getElementById('pullrefreshs').innerHTML = html;
			}, function(xhr, type, error) {
				console.log(type)
			})
		}
		// 详情页面显示跳转代理事件
	mui("#link-detail").on("tap", ".detail-page", function() {
		/*var status = this.getAttribute("data-status");
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
		}*/
		openWindow("./order-detail.html", {
			orderId : this.getAttribute("data-orderid")
		});	
	})

	// 返回首页
	mui.back = function() {
		var index = plus.webview.getLaunchWebview();
		var cpage = plus.webview.currentWebview();
		index.show("slide-in-left", 300, function() {
			cpage.close("none", 0)
		})
	}

	// 发送数据状态显示详情界面信息
	function sendmsg(datas) {
		myAjax({
			url: 'order/myGoodList',
			data: datas,
			wait: false
		}, function(data) {
			var orderdata = {
					"list": data.res.orderList
				}
				// 模板渲染
			var html = template("template", orderdata);
			if (!html) {
				html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
			}
			document.getElementById('pullrefreshs').innerHTML = html;
		}, function(xhr, type, error) {
			console.log(type)
		})
	}
	
	// 点击页面切换的时候，进行切换页面等待窗口
	window.addEventListener("waiting", function(){
		var waithtml = '<div class="data-wait">数据加载中...</div>';
		$('#pullrefreshs').html(waithtml);
	})

})