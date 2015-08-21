mui.init();
mui.plusReady(function() {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	var c = plus.webview.currentWebview().setStyle({
		scrollIndicator: "none"
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
	mui(".mui-scroll-wrapper").scroll({
		bounce: false,
		indicators: true,
		deceleration: deceleration
	});


	/*	//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('#link-detail .mui-control-content'), function(index, pullRefreshEl) {
			var sort = $(this).attr('data-sort');
			var item = $(this).attr('data-item')
			getorderdata.sortType = sort;
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var _this = this;
						myAjax({
							url : 'deliver/goodList',
							data : getorderdata
						}, function(data) {
							_this.endPullDownToRefresh();
							var orderdata = {
								"list": data.res
							}
							var $wrap = $('<div class="wrap"></div>')
							var html = template("template", orderdata);
							$wrap.html(html);
							$('.mui-scroll', item).append($wrap)
						}, function(xhr, type, errorThrown) {
							console.log(type)
						})
					}
				},
				up: {
					callback: function() {
						var _this = this;
						plus.nativeUI.showWaiting('加载中', {
							background: '#d1d1d1'
						})
						getorderdata.page++;
						myAjax({
							url : 'deliver/goodList',
							data: getorderdata
						}, function(data) {
							_this.endPullUpToRefresh();
							plus.nativeUI.closeWaiting()
							if (data.res.length!=0) {
								var orderdata = {
									"list": data.res
								}
								var $wrap = $('<div class="wrap"></div>')
								var html = template("template", orderdata);
								$wrap.html(html);
								$('.mui-scroll', item).append($wrap)
							} else {
								mui.toast('没有数据了')
							}
						}, function(xhr, type, errorThrown) {
							console.log(type);
						})
					}
				}
			});
		});
		*/

	// ajax 获取模板数据
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
				document.getElementById('item' + 1).innerHTML = html;
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

	// 请求排序数据
	var status = "1",  // 默认当前状态
		count = 1;	// 默认点击当前状态下的次数
	mui('#segmentedControl').on('tap', '.mui-control-item', function() {
		var type = this.getAttribute('data-sort');
		var sta = this.getAttribute("data-status");
		var cls = this.classList;			// 得到当前点击对象的classlist
		if(sta == status){
			count++;
			if(sta != "2"){
				cls.toggle("icon-up")
				cls.toggle("icon-down")
			} else {
				cls.toggle("icon-up-2")
				cls.toggle("icon-down-2")
			}
			if(count % 2 == 0){
				getorderdata.sortVal = "desc"; 
			} else {
				getorderdata.sortVal = "asc";
			}
		} else {
			status = sta;
			$(".mui-control-item").removeClass("icon-up");			// 清空所有样式
			$(".mui-control-item").removeClass("icon-up-2");
			$(".mui-control-item").removeClass("icon-down");
			$(".mui-control-item").removeClass("icon-down-2");
			if(sta != "2"){
				cls.add("icon-up")
			} else {
				cls.add("icon-up-2");
			}
		}
		getorderdata.sortType = type;
		
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
			document.getElementById('item' + status).innerHTML = html;
		}, function(xhr, type, errorThrown) {
			console.log(type)
		})
	})


	// 详情页面跳转
	mui('#link-detail').on('tap', '.detail-message', function(eve) {
			eve.preventDefault();
			var order = {
					orderid: this.getAttribute("data-orderid"), // 获取编号
					status: this.getAttribute("data-status") // 运送状态
				}
				// 数据储存在本地storage中
			plus.storage.setItem("order", JSON.stringify(order));
			var href = this.href;
			openWindow(href); // 打开详情页面信息显示
		})
		// 返回函数
	mui.back = function() {
			var index = plus.webview.getLaunchWebview();
			index.show("slide-in-left", 300)
			setTimeout(function() {
				plus.webview.currentWebview().close("none", 0);
			}, 300)
		}
		// 筛选查找
	document.getElementById("filter-page").addEventListener("tap", function() {
		openWindow("./get-filter.html")
	}, false)
	window.addEventListener('getfilter', function(eve) {
		$('a', '#segmentedControl').removeClass('mui-active').eq(0).addClass('mui-active')
		plus.nativeUI.showWaiting("搜索中...", {
			background: "#d1d1d1"
		})
		var filter = eve.detail
		getorderdata.sendAddr = filter.sendAddr;
		getorderdata.receiveAddr = filter.receiveAddr;
		getorderdata.prices = filter.prices;
		getorderdata.weights = filter.weights;
		getorderdata.finTime = filter.finTime;
		myAjax({
			url: 'deliver/goodList',
			data: getorderdata
		}, function(data) {
			plus.nativeUI.closeWaiting();
			var orderdata = {
				"list": data.res
			}
			var html = template("template", orderdata);
			document.getElementById("item1").innerHTML = html;
		}, function(xhr, type, errorThrown) {
			console.log(type)
		})
	})
})