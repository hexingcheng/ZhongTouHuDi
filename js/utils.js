var BASEURL = "http://202.202.43.107:8080/api/"
//	var BASEURL = "http://172.31.56.19:8080/api/"

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
		openWindow('./page/login-up.html')
	}
}

function ifloginCommon(cb) {
	if (getstorage('token')) {
		cb();
	} else {
		var i = plus.webview.getLaunchWebview();
		i.setStyle({
			left: '0',
			mask: 'none'
		})
		openWindow('./page/login-up.html')
	}
}

function openWindow(url, param, ani, time) {
		var snum, id;
		var animationType =  ani || 'slide-in-right';
		var animationTime = time || 150;
		param = param || {};
		var pnum = url.indexOf('.html');
		if (url.indexOf('page') != -1) {
			snum = url.indexOf('e/') + 1;
		} else {
			snum = url.indexOf('/');
		}
		id = url.substring(snum + 1, pnum)
		if (window.plus) {
			mui.openWindow({
				id: id,
				url: url,
				extras: param,
				show: {
					aniShow: animationType,
					duration: animationTime
				},
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
		console.log(a[i].getURL()+':'+a[i].id)
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
function showobj(obj){
	for(var i in obj){
		console.log(i+":"+obj[i]);
	}
}
function successcb() {
	plus.webview.getLaunchWebview().show()
}