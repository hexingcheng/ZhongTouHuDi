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
var whichstatus;
var whichpage  = {
	"1":1,
	"2":1,
	"3":1
};
function pulldownRefresh(){
	plus.nativeUI.showWaiting('刷新中',{background:'#d1d1d1'});
	getlist(whichstatus,false)
	function getlist(status,wait) {
		wait = wait||false;
		var status = status || 1
		var getorderdata = {
			"page": 1,
			"pageSize": 10,
			"type": "rece",
			"status": status
		};
		myAjax({
			url: 'order/myGoodList',
			data: getorderdata,
			wait: wait
		}, function(data) {
			var orderdata = {
				"list": data.res
			}
			plus.nativeUI.closeWaiting();
			var html = template("template", orderdata);
			if (!html) {
				mui.toast('没有新数据')
			}
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			$('#pullrefreshs').html(html);
		}, function(xhr, type, errorThrown) {
			console.log(type);
		})
	}
}
function pullupRefresh(){
	var p = ++whichpage[whichstatus]
	getlist(whichstatus,false,p)
	var old = $('#pullrefreshs').html()
	function getlist(status,wait,whichpage) {
		wait = wait||false;
		var status = status || 1
		var getorderdata = {
			"page": whichpage,
			"pageSize": 10,
			"type": "rece",
			"status": status
		};
		myAjax({
			url: 'order/myGoodList',
			data: getorderdata,
			wait: wait
		}, function(data) {
			var orderdata = {
				"list": data.res
			}
			var html = template("template", orderdata);
			if (!html) {
				mui.toast('没有更多数据')
			}
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			var str = html+old;
			$('#pullrefreshs').html(str);
		}, function(xhr, type, errorThrown) {
			console.log(type);
		})
	}
}
mui.plusReady(function() {
	window.addEventListener('renderdata',function(eve){
		whichstatus = eve.detail.status
		getlist(eve.detail.status,true);
	})
	mui(".mui-scroll-wrapper").scroll();
	function closewebs() {
			if (plus.webview.getWebviewById('mygetorderdtl')) {
				plus.webview.getWebviewById('mygetorderdtl').close();
			}
			if (plus.webview.getWebviewById('cancel-reason')) {
				plus.webview.getWebviewById('cancel-reason')
			}
		}
		// ajax 获取模板数据
	getlist(1);
	function getlist(status,wait) {
		wait = wait||false;
		var status = status || 1
		var getorderdata = {
			"page": 1,
			"pageSize": 10,
			"type": "rece",
			"status": status
		};
		myAjax({
			url: 'order/myGoodList',
			data: getorderdata,
			wait: false
		}, function(data) {
			var orderdata = {
				"list": data.res
			}
			var html = template("template", orderdata);
			if (!html) {
				html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
			}
			$('#pullrefreshs').html(html);
		}, function(xhr, type, errorThrown) {
			console.log(type);
		})
	}
	window.addEventListener('fresh', function() {
		getlist();
	})
	mui('#link-detail').on('tap', '.mui-table-view', function() {
		var orderid = this.getAttribute('data-id');
		var datas = {
			orderId: orderid,
			type: 'rece'
		};

		openWindow('./mygetorderdtl.html', datas)
	})
	
	// 点击页面切换的时候，进行切换页面等待窗口
	window.addEventListener("waiting", function(){
		var waithtml = '<div class="data-wait">数据加载中...</div>';
		$('#pullrefreshs').html(waithtml);
	})
})