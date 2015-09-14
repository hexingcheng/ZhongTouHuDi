mui.init();
mui.plusReady(function() {
	mui(".mui-scroll-wrapper").scroll();
	// 获取当前现金
	var cash = document.getElementById("available-cash");
	var current = null;
	var flag = false; // 判断当前是否选择paypal取现

	// 解析当前用户信息
	var info = JSON.parse(plus.storage.getItem("personinfo"));
	if(info){
		document.getElementById("account-num").innerHTML = info.phone;
	} else {
		mui.toast("当前未登陆");
	}

	// ajax获取现金
	myAjax({
		url: "wallet/money",
		data: {},
		wait : false
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
			wait : false
		}, function(data) {
			//	      			console.log(JSON.stringify(data));
			var obj = {
				"list": data.res.channelList
			}
			var html = template("template", obj);
			//	      			console.log(html)
			document.getElementById("type-container").innerHTML = html;
			
			setTimeout(function(){
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

	// 编辑当前账户
	mui("#type-container").on("tap", ".edit-account", function() {
		var data = {
			mcid: this.getAttribute("data-mcid")
		}
		openWindow("./my-withdraw-next.html", data);
	})

	// 弹出框属性
	var options = {
		height : 175,
		title : {
			height : 40,
			content : ""
		},
		main : {
			content : ""
		},
		buttons : [{
			name : "OK",
			click : function(){ return true }
		},{
			name : "cancel",
			click : function(){ return true; }
		}]
	}

	// 取现跳转到下一步
	var pop;		// 弹出框对象
	document.getElementById("next-step").addEventListener("tap", function() {
		if (flag && mcid) {
			var val = document.getElementById("amount").value.trim();
//			var reg = /^([0-9]*.?[0-9]*)$/.exec(val)
			if (val) {
				var divide = parseFloat(val);
				if (current >= divide) {
					var datas = {
						money: divide,
						mcId: mcid
					}
					// 弹出框样式
					options.title.content = "输入密码";
					options.main.content = "<div class='popup-input-wrap'>"+
												"<input type='password' maxlength='20' placeholder='please enter your password' class='input-withdraw'/>"+
											"</div>"+
											"<div class='input-extras'>Forget Your Password?</div>";
					
					options.buttons[0]["click"] = function(){
						// 支付密码验证接口
						
						
						/*myAjax({ // 返回 -102 错误提醒
							url: "wallet/withdraw",
							data: datas
						}, function(data) {
							if (data.ret == 1) {
								mui.toast("提现成功");
							} else if (data.ret == 2) {
								mui.toast("渠道暂停提现");
							} else {
								mui.alert("你存在提现在审核，暂时不能再申请提现", "提示")
							}
						})*/
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
	var opt = {
		height : 170,
		title : {
			height : 40,
			content : "please input your password",
			background : "#fff"
		},
		main : {
			content : "<div class='popup-input-wrap'>"+
							"<input type='password' maxlength='20' placeholder='please enter your password' class='input-withdraw'/>"+
						"</div>"
		},
		buttons : [{
			name : "确定",
			click : function(){
				alert("nihao");
			}
		}]
	}
	
	var popup;
	mui("body").on("tap", ".input-extras", function(){
		this.style.color = "red";
		pop.hide(document.getElementById("lee-mask"), document.getElementById("lee-content-wrap"));
//		var ch1 = document.getElementById("lee-mask");
//		var ch2 = document.getElementById("lee-content-wrap");
//		ch1.parentNode.removeChild(ch1);
//		ch2.parentNode.removeChild(ch2);
		
		popup = new Popup(opt)
		popup.show();
	})


})