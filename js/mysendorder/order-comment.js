mui.init();
mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
			scrollIndicator: "none"
		})
		// 默认为两星
	var delivery = 1;

	// 星星评价
	var pin = document.getElementById("delive-speed");
	mui("#delivery").on("tap", ".iconfont", function() {
		var index = this.getAttribute("data-index"); // 当前点击的index值
		var type = this.getAttribute("data-type"); // 获取当前点击类型
		var child = this.parentNode.children; // 获取当前节点下所有节点包括自己
		// 清理当前点击的样式呈现
		for (var i = 0; i < index; i++) {
			var cls = child[i].classList;
			if (cls.contains("not-active")) {
				cls.remove("not-active");
			}
		}
		// 添加店家后面样式的清空
		for (var j = index; j < 5; j++) {
			var cls = child[j].classList;
			if (!cls.contains("not-active")) {
				cls.add("not-active");
			}
		}
		// 分数评价
		delivery = index;
		pin.innerHTML = index == 1 ? "bad" : index == 2 ? "slow" : index == 3 ? "genral" : index == 4 ? "well" : "very";
	})
	// 对评价按钮的添加事件		bad slow genral well very well
	var send = plus.webview.getWebviewById("mysendorder/my-send-order") || plus.webview.getWebviewById("my-send-order");
	var cpage = plus.webview.currentWebview();
	var finish = plus.webview.currentWebview().opener();
	console.log(cpage.orderid)
	document.getElementById("comment-order").addEventListener("tap", function() {
		var inf = document.getElementById("info").value.trim();
		if (inf) {
			var datas = {
				orderId: cpage.orderid,
				info: inf,
				score: delivery
			}
			// ajax发送数据
			myAjax({
				url: "order/evaluate",
				data: datas
			}, function(data) {
				if (data.ret == 1) {
					mui.toast("评价成功");
					mui.fire(send, "refresh:comment")
					setTimeout(function() {
						plus.webview.show(send, "slide-in-left", 300)
						setTimeout(function(){
							plus.webview.close(finish, "none", 0)
							plus.webview.close(cpage, "none", 0)
						}, 300)
					}, 100)
				} else {
					mui.toast("不能重复评论");
				}
			}, function(xhr, type) {
				console.log(type)
			})
		} else {
			mui.toast("未填写评价信息")
		}
	})
	
	// 描述信息提示剩余可输入字符
	var timer;
	var last = 0;
	var remain = document.getElementById("words");
	var all = parseInt(remain.innerHTML);
	document.getElementById("info").addEventListener("focus", function(){
		var that = this;
		timer = setInterval(function(){
			if(last != that.value.length){
				remain.innerHTML = all - that.value.length;
			}
			last = that.value.length;
		}, 300)
	})
	document.getElementById("info").addEventListener("blur", function(){
		clearInterval(timer);
	})

})