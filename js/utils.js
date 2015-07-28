var BASEURL = "http://202.202.43.107:8080/api/"
	//var BASEURL = "http://172.31.56.19:8080/api/"

function getcamera(successcb, errorcb, option) {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(successcb, errorcb)
}

function setstorage(keys, value) {
	plus.storage.setItem(keys, value);
}

function getstorage(key) {
	return plus.storage.getItem(key)
}

function iflogin(cb) {
	if (getstorage('token')) {
		cb();
	} else {
		mui.confirm("你还没登陆", "登陆提示", ["登陆", "注册"], function(eve) {
			if (eve.index == 0) {
				mui.openWindow({
					url: './page/login-up.html'
				})
			} else if (eve.index == 1) {
				mui.openWindow({
					url: './page/login-up.html'
				})
			} else {
				return;
			}
		})

	}
}

function ifloginCommon(cb) {
	if (getstorage('token')) {
		cb();
	} else {
		mui.confirm("你还没登陆", "登陆提示", ["登陆", "注册"], function(eve) {
			if (eve.index == 0) {
				var i = plus.webview.getLaunchWebview();
				var m = plus.webview.getWebviewById('index-menu');				
				i.setStyle({
					left: '0',
					mask: 'none'
				})
				m.setStyle({
					left:'0'
				})
				mui.openWindow({
					url: './login-up.html'
				})
			} else if (eve.index == 1) {
				var i = plus.webview.getLaunchWebview();
				var m = plus.webview.getWebviewById('index-menu');				
				i.setStyle({
					left: '0',
					mask: 'none'
				})
				m.setStyle({
					left:'0'
				})
				mui.openWindow({
					url: './login-up.html'
				})
			} else {
				return;
			}
		})

	}
}

function openWindow(url, param) {
		var snum, id;
		param = param || {};
		var pnum = url.indexOf('.html');
		if (url.indexOf('page') != -1) {
			snum = url.indexOf('e/') + 1;
		} else {
			snum = url.indexOf('/');
		}
		id = url.substring(snum + 1, pnum);
		if (window.plus) {
			mui.openWindow({
				id: id,
				url: url,
				extras: param,
				waiting: {
					autoShow: true,
					title: '正在加载...',
					options: {
						background: '#d1d1d1'
					}
				}
			})
		} else {
			alert(0)
		}
	}
	// for test

function setsysstorage(val) {
	var ago = getstorage('systemmsg') || "";
	val = ago + val;
	setstorage('systemmsg', val)
}

function getAllwebview() {
	var a = plus.webview.all();
	for (var i in a) {
		console.log(a[i].getURL())
	}
}

function handleData(data, cb) {
	console.log(data.ret);
}

function errorhandle(type) {
	if (type == 'timeout') {
		mui.toast("请求超时，请检查您的网络！");
	} else if (type == 'error') {
		mui.toast('发生错误！')
	} else if (type = 'abort') {
		mui.toast('网络禁止访问！')
	}
	return;
}

function getuserbasicinfo() {
	var obj = {};
	mui.plusReady(function() {
		plus.geolocation.getCurrentPosition(function(pos) {
			obj.lot = pos.coords.longitude;
			obj.let = pos.coords.latitude;
		}, function(e) {
			mui.toast('获取位置信息失败')
		}, {
			provider: 'baidu'
		});
		obj.uuid = plus.device.uuid;
		obj.imsi = plus.device.imsi;
		obj.systemName = plus.device.vendor;
		obj.systemVersion = plus.device.model;
	})
	return obj;
}

function successcb() {
	plus.webview.getLaunchWebview().show()
}