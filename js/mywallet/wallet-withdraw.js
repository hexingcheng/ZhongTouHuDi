mui.init();
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	// 获取当前现金
	var cash = document.getElementById("available-cash");
	var current = null;
	var flag = false; // 判断当前是否选择paypal取现

	// 解析当前用户信息
	var info = JSON.parse(plus.storage.getItem("personinfo"));
	if (info) {
		document.getElementById("account-num").innerHTML = info.phone;
	} else {
		mui.toast("当前未登陆");
	}

	// ajax获取现金
	myAjax({
		url: "wallet/money",
		data: {},
		wait: false
	}, function(data) {
		cash.innerHTML = current = data.res.money;
	}, function(xhr, type) {
		console.log("错误代号：" + xhr.status + "    错误类型:" + type);
	})

	// 选择提现方式
	document.getElementById("ch-wi-way").addEventListener("tap", function() {
		openWindow("./my-withdraw-next.html");
	})

	// 添加自定义函数 ---  触发自定义函数 发送ajax到后台获取绑定取现的形式
	window.addEventListener("paypal:list", function() {
		document.getElementById("amount").value = ""
		withdrawWay();
	})

	// ajax获取支付渠道
	withdrawWay();

	function withdrawWay() {
		myAjax({
			url: "wallet/moneyChannelList",
			data: {},
			wait: false
		}, function(data) {
			//	      			console.log(JSON.stringify(data));
			var obj = {
				"list": data.res.channelList
			}
			var html = template("template", obj);
			//	      			console.log(html)
			document.getElementById("type-container").innerHTML = html;

			setTimeout(function() {
				closeMask();
			}, 50)

		}, function(xhr, type) {
			console.log("错误代号：" + xhr.status + "    错误类型:" + type);
		})
	}


	// 选择paypal取现方式
	var mcid;
	mui("#type-container").on("tap", ".paypal", function() {
		var all = document.getElementById("type-container").querySelectorAll(".shouyin");
		for (var i = 0; i < all.length; i++) { // 清理所有样式
			var ccla = all[i].classList;
			if (ccla.contains("right-logo-tab")) {
				ccla.remove("right-logo-tab");
				ccla.add("right-logo")
			}
		}
		var shouyin = this.querySelector(".shouyin");
		var cls = shouyin.classList;
		cls.toggle("right-logo");
		cls.toggle("right-logo-tab");
		if (cls.contains("right-logo-tab")) {
			mcid = this.getAttribute("data-mcid");
			flag = true;
		} else {
			flag = false;
		}
	})

	// 删除当前账户
	mui("#type-container").on("tap", ".edit-account", function() {
		var mcid = this.getAttribute("data-mcid");
		console.log("删除" + mcid + "账户")
		var item = this.parentNode.parentNode;
		item.parentNode.removeChild(item);
		
		//删除提现账户接口
	})

	// 弹出框属性
	var options = {
		height: 175,
		title: {
			height: 40,
			content: ""
		},
		main: {
			content: ""
		},
		buttons: []
	}

	// 取现跳转到下一步
	var pop; // 弹出框对象
	document.getElementById("next-step").addEventListener("tap", function() {
		if (flag && mcid) {
			var val = document.getElementById("amount").value.trim();
			if (val) {
				var divide = parseFloat(val);
				if (current >= divide) {
					var datas = {
							money: divide,
							mcId: mcid
						}
						// 弹出框样式
					options.title.content = "输入密码";
					options.main.content = "<div class='popup-input-wrap'>" +
						"<input type='password' maxlength='20' placeholder='please enter your password' class='input-withdraw' id = 'input-withdraw'/>" +
						"</div>" +
						"<div class='input-extras'>Forget Your Password?</div>";

					options.buttons[0] = {
						name: "OK",
						click: function() {
							// 支付密码验证接口
							var pwd = document.getElementById('input-withdraw').value;
							myAjax({url:'account/checkPayPwd',data:{payPwd:pwd}},function(data){
								if(data.ret == 1){
									mui.toast('密码验证成功');
									myAjax({url:'wallet/withdraw',data:datas},function(data){
										if(data.ret==1){
											mui.toast('请求成功')
										}else if(data.ret==2){
											mui.toast('渠道暂停提现')
										}else if(data.ret==3){
											mui.toast('你存在提现在审核，暂时不能再申请提现')
										}
									},function(xhr,type){
										
									})
								}else if (data.ret==2){
									mui.toast('验证失败');
									return true;
								}
							},function(xhr,type){
								
							})
						}
					}
					options.buttons[1] = {
						name: "cancel",
						click: function() {
							return true;
						}
					}
					pop = new Popup(options)
					pop.show();
				} else {
					mui.toast("余额不足")
				}
			} else {
				mui.toast("请输入需要取现金额")
			}
		} else {
			mui.toast("请选择取现方式");
		}
	}, false);

	// 忘记密码
	mui("body").on("tap", ".input-extras", function() {
		this.style.color = "red";
		pop.hide(document.getElementById("lee-mask"), document.getElementById("lee-content-wrap"));

		setTimeout(function() {

			options.title.content = "please input your password";
			options.main.content = "<div class='popup-input-wrap'>" +
				"<input type='password' maxlength='20' placeholder='please enter your password' class='input-withdraw'/>" +
				"</div>";
			options.buttons[0]["name"] = "Ok";
			options.buttons[0].click = function() {
				//  忘记密码接口




			}
			if (options.buttons.length == 2) {
				options.buttons.splice(1, 1);
			}
			pop = new Popup(options)
			pop.show();
		}, 400)
	})


})