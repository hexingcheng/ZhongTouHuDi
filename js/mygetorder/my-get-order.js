mui.init({
	beforeback: function() {
		plus.webview.getLaunchWebview().show('slide-in-left', 200)
		return false;
	}
});
mui.plusReady(function() {
	var ites = {
		'1':1,
		'2':1,
		'3':1
	}
	pullfresh();
	mui("#scroll-wrapper").scroll();
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
	mui('.mui-segmented-control').on('tap', '.mui-control-item', function() {
		var sta = this.getAttribute('data-sta');
		getlist(sta)
	})

	function pullfresh() {
		var funcArr = [down,up];
//		var callbacks = $.Callbacks('once');
//		callbacks.add(function() {
//			$('.pullfresh').removeClass('mui-hidden');
//			
//				$('.pullfresh').addClass('mui-hidden');
//				var status = $('.mui-control-item').filter('.mui-active').attr('data-sta');
//				getlist(status,true);
//		});
//		var cb = $.Callbacks('once')
//		cb.add(function() {
//			$('.pullupfresh').removeClass('mui-hidden')
//			
//				$('.pullfresh').addClass('mui-hidden');
//				var status = $('.mui-control-item').filter('.mui-active').attr('data-sta');
//				var oldhtml = $('#item'+status).html();
//				getnextlist(2,status,true)
//		})
		$('.mui-scroll').on('dragend', function(e) {
			if($('.mui-scroll').position().top==0){
				funcArr[0] = down;
			}
		})
		$('.mui-scroll').on('drag', function(e) {
			var top = $(this).position().top;
			var pullfoot = $(this).height() - $(this).parent().height() + 40;
			if (e.originalEvent.detail.direction == 'down' && top > 40) {
				if(funcArr[0]){
					funcArr[0]();
				}
				funcArr[0] = '';
			}
			if (e.originalEvent.detail.direction == 'up' && -top > pullfoot) {
				if(funcArr[1]){
					funcArr[0]()
				}
				funcArr[1] = '';
			}

		})
	}
	function down(){
		$('.pullfresh').removeClass('mui-hidden');
		$('.pullfresh').addClass('mui-hidden');
		var status = $('.mui-control-item').filter('.mui-active').attr('data-sta');
		getlist(status,true);
	}
	function up(){
		$('.pullupfresh').removeClass('mui-hidden');
		$('.pullfresh').addClass('mui-hidden');
		var status = $('.mui-control-item').filter('.mui-active').attr('data-sta');
		var oldhtml = $('#item'+status).html();
		getnextlist(2,status,true)
	}
	function getlist(status,wait) {
		console.log(1)
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
			var html = template("template", orderdata);
			if (!html) {
				html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
			}
			document.getElementById('item' + status).innerHTML = html;
		}, function(xhr, type, errorThrown) {
			console.log(type);
		})
	}
	function getnextlist(page,status,wait,oldhtml) {
		wait = wait||false;
		var status = status || 1
		var getorderdata = {
			"page": page,
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
				html = '<div class="mui-text-center data-null"><img src="../../img/none.png" width="25%" height="26%"/><div class="mui-h4">not more things</div></div>'
			}
			document.getElementById('item' + status).innerHTML = html;
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
})