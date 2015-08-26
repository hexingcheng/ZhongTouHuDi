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
var whichitem = "time";
var whichval = "asc";
var allpage = {
	"time":1,
	"dist":1,
	"price":1,
	"weight":1
}
function pulldownRefresh() {
	plus.nativeUI.showWaiting('刷新中', {
		background: '#d1d1d1'
	})
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": "重庆",
		"curJd": "",
		"curWd": "",
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc"
	};
	getorderdata.sortType = whichitem;
	getorderdata.sortVal = whichval;
	if (navigator.geolocation) {
		$('.ordercontents').html("")
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lot = pos.coords.longitude;
			var lat = pos.coords.latitude;
			getorderdata.curJd = lot;
			getorderdata.curWd = lat;
			myAjax({
				url: 'deliver/goodList',
				data: getorderdata,
				wait:false
			}, function(data) {
				plus.nativeUI.closeWaiting();
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				var orderdata = {
						"list": data.res
					}
					// 模板渲染
				var html = template("template", orderdata);
				if (!html) {
					html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
				}
				$('.ordercontents').html(html)
			}, function(xhr, type, errorThrown) {
				console.log(type)
			})
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			enableHighAcuracy: true
		})
	} else {
		mui.toast('获取位置信息失败');
	}
}

function pullupRefresh() {
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": "重庆",
		"curJd": "",
		"curWd": "",
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc"
	};
	getorderdata.sortType = whichitem;
	getorderdata.sortVal = whichval;
	getorderdata.page = ++allpage[whichitem];
	if (navigator.geolocation) {
		var old = $('.ordercontents').html();
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lot = pos.coords.longitude;
			var lat = pos.coords.latitude;
			getorderdata.curJd = lot;
			getorderdata.curWd = lat;
			myAjax({
				url: 'deliver/goodList',
				data: getorderdata,
				wait:false
			}, function(data) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh()
				var orderdata = {
						"list": data.res
					}
					// 模板渲染
				var html = template("template", orderdata);
				if (!html) {
					mui.toast('没有更多数据')
				}else{
					var h = old+html
					$('.ordercontents').html(h)
				}
				
			}, function(xhr, type, errorThrown) {
				console.log(type)
			})
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			enableHighAcuracy: true
		})
	} else {
		mui.toast('获取位置信息失败');
	}
}
mui.plusReady(function() {
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": "重庆",
		"curJd": "",
		"curWd": "",
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc"
	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lot = pos.coords.longitude;
			var lat = pos.coords.latitude;
			getorderdata.curJd = lot;
			getorderdata.curWd = lat;
			myAjax({
				url: 'deliver/goodList',
				data: getorderdata
			}, function(data) {
				var orderdata = {
						"list": data.res
					}
					// 模板渲染
				var html = template("template", orderdata);
				if (!html) {
					html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
				}
				$('.ordercontents').html(html)
			}, function(xhr, type, errorThrown) {
				console.log(type)
			})
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			enableHighAcuracy: true
		})
	} else {
		mui.toast('获取位置信息失败')
	}

	if (mui.os.plus) {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			}, 1000);
	} else {
			mui('#pullrefresh').pullRefresh().pullupLoading();
	}
	var deceleration = mui.os.ios ? 0.003 : 0.0009;

	window.addEventListener('renderdata', function(eve) {
			getorderdata.sortVal = eve.detail.sortVal;
			whichitem = eve.detail.sortType;
			getorderdata.sortType = eve.detail.sortType;
			whichval = eve.detail.sortType;
			if(eve.detail.sendAddr){
				getorderdata.sendAddr = eve.detail.sendAddr;
			}
			if(eve.detail.receiveAddr){
				getorderdata.receiveAddr = eve.detail.receiveAddr;
			}
			if(eve.detail.prices){
				getorderdata.prices = eve.detail.prices;
			}
			if(eve.detail.weights){
				getorderdata.weights = eve.detail.weights;
			}
			if(eve.detail.finTime){
				getorderdata.finTime = eve.detail.finTime;
			}
			getorderdatas();
			function getorderdatas() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(pos) {
						var lot = pos.coords.longitude;
						var lat = pos.coords.latitude;
						getorderdata.curJd = lot;
						getorderdata.curWd = lat;
						showobj(getorderdata)
						myAjax({
							url: 'deliver/goodList',
							data: getorderdata,
							wait:true
						}, function(data) {
							var orderdata = {
									"list": data.res
								}
								// 模板渲染
							var html = template("template", orderdata);
							if (!html) {
								html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
							}
							$('.ordercontents').html(html)
						}, function(xhr, type, errorThrown) {
							console.log(type)
						})
					}, function(e) {
						mui.toast('获取位置信息失败')
					}, {
						enableHighAcuracy: true
					})
				} else {
					mui.toast('获取位置信息失败')
				}
			}
		})
		// 请求排序数据
	// 详情页面跳转
	mui('.ordercontents').on('tap', '.abandonded', function(eve) {
			eve.preventDefault();
			var order = {
					orderid: this.getAttribute("data-orderid"), // 获取编号
					status: this.getAttribute("data-status") // 运送状态
				}
				// 数据储存在本地storage中
			plus.storage.setItem("order", JSON.stringify(order));
			var href = this.getAttribute('data-href')
			openWindow(href); // 打开详情页面信息显示
		})
})