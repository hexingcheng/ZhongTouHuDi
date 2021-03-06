mui.init();
mui.plusReady(function() {
	mui("#scroll-wrapper").scroll();
	var orderid = plus.storage.getItem("my-send-order");

	// 显示详情页面信息
	sendmsg(orderid);

	// 订单评价
	document.getElementById("comment-order").addEventListener("tap", function() {
		openWindow("./order-comment.html");
	}, false);

	// 发信息
	document.getElementById("sendmsg").addEventListener("tap", function(){
		var phonenum = this.getAttribute("data-phone");
		var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		msg.to = [phonenum];
		msg.body = '';
		plus.messaging.sendMessage( msg );
	})
	
	// 打电话
	document.getElementById("phone").addEventListener("tap", function(){
		var phonenum = this.getAttribute("data-phone");
		plus.device.dial( phonenum , false );
	})
	
	// 添加点击样式与过渡效果
	window.addEventListener("touchstart", function(){
		var target = window.event.target;
		var cls = target.classList;
		if(cls.contains("mui-icon-phone-filled") || cls.contains("mui-icon-chatbubble-filled")){
			target.style.webkitTransition = "all 100ms ease-in-out";
			cls.add("tap-active");
		}
	})
	// 清除添加样式与过渡效果
	window.addEventListener("touchend", function(){
		var target = window.event.target;
		var cls = target.classList;
		if(cls.contains("mui-icon-phone-filled") || cls.contains("mui-icon-chatbubble-filled")){
			target.style.webkitTransition = "all 100ms ease-in-out";
			cls.remove("tap-active");
		}
	})
	
function toverticalcenter() {
		var item = $('.preimg')
		var len = item.length;
		for (var i = 0; i < len; i++) {
			var t = ($(window).height() - item.eq(i).height()) / 2
			item.eq(i).css('top', t)
		}
	}
	mui('#porel').on('tap', 'img', function() {
		
		$('.presee').removeClass('mui-hidden')
		$('.mui-slider-item', '#slider').filter(function(index) {
			return $('.mui-slider-item', '#slider').eq(index).find('img').attr('src') == '';
		}).remove();
		var index = this.index;
		toverticalcenter()
		var gallery = mui('#slider');
		gallery.slider({
			interval: 0
		}).gotoItem(index);
	})
		$('.presee').on('tap', function() {
		$(this).addClass('mui-hidden')
	})
// 通过订单号获取数据
function sendmsg(orderid) {
	// 页面加载时，获取数据
	myAjax({
		url: "order/goodShow",
		data: {
			orderId: orderid,
			type: "send"
		},
		wait : false
	}, function(data) {
//		console.log(JSON.stringify(data))
		$(".goods-name").html(data.res.gName); // 货物名称
		$("#goods-value").html(data.res.money); // 价值
		$("#goods-weight").html(data.res.gWeight + "kg"); // 重量
		$("#get-time").html(data.res.getTime); // 获取时间
		$("#deadline").html(data.res.finTime); // 期望时间
		$("#host").html(data.res.sender); // 发送者
		$("#sendaddr").html(data.res.sendAddr.name); // 发送地
		$("#receiveaddr").html(data.res.receiveAddr.name) // 接收地
		$("#gvalue").html(data.res.gValue); // value
		$("#info").html(data.res.info); // 信息描述
		var pic = data.res.pics;

		// sender 递送人信息显示
		if (data.res.deliver.headPic) { // 头像显示
			$("#head-img").attr("src", data.res.deliver.headPic);
		}
		if (data.res.deliver.nickName) { // 昵称
			$("#nickName").html(data.res.deliver.nickName);
		}
		if (data.res.deliver.ptitle) { // 等级
			$("#ptitle").html(data.res.deliver.ptitle);
		}
		if (data.res.deliver.orderCount) { // 接单数量
			$("#orderCount").html(data.res.deliver.orderCount);
		}
		if (data.res.deliver.phone) { // 电话号码
			$("#phone").attr("data-phone", data.res.deliver.phone);
			$("#sendmsg").attr("data-phone", data.res.deliver.phone);
		}


		var pic = data.res.pics;
		var n = BASEURL.indexOf('/api/');
		var per = BASEURL.substring(0, n);
		var len = pic.length;
		var box = document.querySelectorAll(".img-box");
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				var picurl = pic[i].path;
				var minurl = pic[i].minPath;
				var n = BASEURL.indexOf('/a');
				var perurls = BASEURL.substring(0, n);
				var imgurl = perurls + picurl;
				var img = document.createElement('img');
				img.className = 'picture'
				img.src = imgurl;
				img.index = i;
				document.getElementById('porel').appendChild(img);
				$('.mui-slider-item', '.mui-slider-group').eq(i).find('img').attr('src', perurls + minurl);
			}
		}

		// 验证是否需要取消按钮
		if (data.res.status == 6) {
			$("#footer-cancel").css("display", "none")
			$(".mui-scroll-wrapper").css("bottom", 0)
		}


		// 300毫秒之后清除等待框
		setTimeout(function() {
			var lmask = document.getElementById("loading-mask");
			var lbox = document.getElementById("loading-box");
			var mcl = lmask.classList;
			var bcl = lbox.classList;
			mcl.add("fade-out");
			bcl.add("fade-out");
			// 过渡动画结束的时候执行该事件
			lmask.addEventListener("webkitTransitionEnd", function() {
				document.getElementById("loading-mask").style.display = "none";
				document.getElementById("loading-box").style.display = "none";
				mcl.remove("fade-out");
				bcl.remove("fade-out");
			}, false)
		}, 300)
	}, function(xhr, type) {
		console.log("错误代号："+xhr.status + "   错误类型："+type);
	})
}

})