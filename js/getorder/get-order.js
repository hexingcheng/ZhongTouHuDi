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
var geocoder = new google.maps.Geocoder();
var whichitem = "time"; 
var whichval = "asc";
var allpage = {
	"time": 1,
	"dist": 1,
	"price": 1,
	"weight": 1
}
var currentaddr = ''
var currentjd = '';
var currentwd = '';
var opener;
var dom = document.querySelector(".load-data");

function pulldownRefresh() {
	dom.style.display = "block";
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": currentaddr,
		"curJd": currentjd,
		"curWd": currentwd,
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc",
		"reqTime": getcurrenttime()
	};

	getorderdata.sortType = whichitem;
	getorderdata.sortVal = whichval;
	myAjax({
		url: 'deliver/goodList',
		data: getorderdata,
		wait: false
	}, function(data) {
		dom.style.display = "none";
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		var orderdata = {
				"list": data.res
			}
			// 模板渲染
		var html = template("template", orderdata);
		if (!html) {
			html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
		}
		$('#ordercontent').html(html)
	}, function(xhr, type, errorThrown) {
		console.log(type)
	})
}

function pullupRefresh() {
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": currentaddr,
		"curJd": currentjd,
		"curWd": currentwd,
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc",
		"reqTime": getcurrenttime()
	};
	getorderdata.sortType = whichitem;
	getorderdata.sortVal = whichval;
	getorderdata.page = ++allpage[whichitem];
	var old = $('#ordercontent').html();
	myAjax({
		url: 'deliver/goodList',
		data: getorderdata,
		wait: false
	}, function(data) {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh()
		var orderdata = {
				"list": data.res
			}
			// 模板渲染
		var html = template("template", orderdata);
		if (!html) {
			mui.toast('没有更多数据')
		} else {
			var h = old + html
			$('#ordercontent').html(h)
		}

	}, function(xhr, type, errorThrown) {
		console.log(type)
	})
}

mui.plusReady(function() {
	var getorderdata = {
		"page": 1,
		"pageSize": 10,
		"curAddr": "",
		"curJd": "",
		"curWd": "",
		"sendAddr": "",
		"receiveAddr": "",
		"finTime": "",
		"prices": ",",
		"weights": ",",
		"sortType": "time",
		"sortVal": "asc",
		"reqTime": getcurrenttime()
	};
	mui('.mui-scroll-wrapper').scroll();
	opener = plus.webview.getWebviewById("getorder/get-order");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lot = pos.coords.longitude;
			var lat = pos.coords.latitude;
			getorderdata.curJd = lot;
			getorderdata.curWd = lat;
			var center = {
				lat: lat,
				lng: lot
			}
			geocoder.geocode({
				'location': center
			}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						currentaddr = getorderdata.curAddr = results[1].formatted_address;
						currentjd = getorderdata.curJd = results[1].geometry.location.L
						currentwd = getorderdata.curWd = results[1].geometry.location.H;
						myAjax({
							url: 'deliver/goodList',
							data: getorderdata,
							wait: false
						}, function(data) {
							var orderdata = {
									"list": data.res
								}
								// 模板渲染
							var html = template("template", orderdata);
							if (!html) {
								html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
							}
							$('#ordercontent').html(html);
							$('.masks').addClass('mui-hidden')
						}, function(xhr, type, errorThrown) {
							console.log(type)
						})
					} else {
						alert('No results found');
					}
				} else {
					window.alert('Geocoder failed due to: ' + status);
				}
			});
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			enableHighAcuracy: true
		})
	} else {
		mui.toast('获取位置信息失败')
	}


	window.addEventListener('renderdata', function(eve) {
			var getorderdata = {
				"page": 1,
				"pageSize": 10,
				"curAddr": currentaddr,
				"curJd": currentjd,
				"curWd": currentwd,
				"sendAddr": "",
				"receiveAddr": "",
				"finTime": "",
				"prices": ",",
				"weights": ",",
				"sortType": "",
				"sortVal": "",
				"reqTime": getcurrenttime()
			};
			getorderdata.sortVal = eve.detail.sortVal;
			whichitem = eve.detail.sortType;
			getorderdata.sortType = eve.detail.sortType;
			whichval = eve.detail.sortType;
			if (eve.detail.sendAddr) {
				getorderdata.sendAddr = eve.detail.sendAddr;
			}
			if (eve.detail.receiveAddr) {
				getorderdata.receiveAddr = eve.detail.receiveAddr;
			}
			if (eve.detail.prices) {
				getorderdata.prices = eve.detail.prices;
			}
			if (eve.detail.weights) {
				getorderdata.weights = eve.detail.weights;
			}
			if (eve.detail.finTime) {
				getorderdata.finTime = eve.detail.finTime;
			}
			getorderdatas();

			function getorderdatas() {
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
					$('#ordercontent').html(html)
				}, function(xhr, type, errorThrown) {
					console.log(type)
				})
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
	window.addEventListener('fresh', function() {
		pulldownRefresh();
	})
})