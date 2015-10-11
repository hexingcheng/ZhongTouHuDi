mui.init();
var ifset;
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	// 当前余额
	var cash = document.getElementById("remain-cash");
	myAjax({
		url: "wallet/money",
		data: {}
	}, function(data) {
		cash.innerHTML = data.res.money;
		closeMask();
	})

	// 解析当前用户信息
	var info = JSON.parse(plus.storage.getItem("personinfo"));
	console.log(plus.storage.getItem("personinfo"))
	if (info) {
		document.getElementById("account-num").innerHTML = info.phone;
		ifset = info.setpay;
	} else {
		mui.toast("当前未登陆");
	}

	// 充值
	mui('.mui-table-view-cell').on('tap', '.right-logo', function() {
		var count = this.getAttribute('data-count') - 0;
		if (count % 2 == 0) {
			this.src = '../../img/shouyin.png'
		} else {
			this.src = '../../img/shouyin2.png'
		}
		this.setAttribute('data-count', ++count);
	})
	document.getElementById("recharge").addEventListener("tap", function() {
		var val = document.getElementById("amount").value.trim();
		var reg = /^([0-9]*.?[0-9]*)$/.exec(val)
		if (reg[0]) {
			var amout = parseFloat(reg[0]);
			if (amout > 0) {
				//				var s = $('right-logo').attr('data-count')-0;
				var s = document.getElementById('rigtlog').getAttribute('data-count') - 0
				if (s % 2 == 0) {
					var options = {
						height: 170,
						title: {
							height: 40,
							content: "密码输入"
						},
						main: {
							content: "<div>请输入支付密码</div><p><input type='password' id='paypwd'></p>"
						},
						buttons: [{
							name: "确定",
							click: function() {

								var value = document.getElementById('paypwd').value;
								myAjax({
									url: 'account/checkPayPwd',
									data: {
										payPwd: value
									}
								}, function(data) {
									if (data.ret == 1) {
										mui.toast('验证成功')
										myAjax({
												url: "wallet/recharge",
												data: {
													money: amout,
													pcId: "paypal"
												}
											}, function(data) {
												console.log(JSON.stringify(data))
												mui.toast('验证成功，跳转中');
												var rid = data.res.rechargeId;
												openWindow('./rechargedetail.html', {
													orderid: rid
												})
											}, function(xhr, type) {
												console.log(xhr.status + ':' + type)
											})
									} else if (data.ret == 2) {
										mui.toast('验证失败')
									}
								}, function(xhr, type) {
									mui.toast(xhr.status + "验证失败")
								})
							}
						}, {
							name: "取消",
							click: function() {
								return true;
							}
						}]
					}
					var pop = new Popup(options)
					pop.show();
				} else {
					mui.toast('请先选择提现方式')
				}
			} else {
				mui.toast("请正确输入充值金额")
			}
		} else {
			mui.toast("请输入需要充值金额")
		}
	}, false);
})