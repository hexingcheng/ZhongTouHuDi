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
		openWindow('./page/logupin/login.html');
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
		openWindow('./page/logupin/login.html')
	}
}
//  ajax通用函数参数说明 options:基本配置参数，url、type（默认 post 可不填）、data 必填,successcb成功回调  必填 参数为请求返回data对象，
//errorcb：必填 失败回调 参数 xhr,type,nonetworkcb 无网络回调 选填
//eg:
//myAjax({url:"auth/regDynCode",data:{phone:11010101011}},function(data){
//	console.log(data.code);
//},function(xhr, type){
//	console.log(xhr.status);
//},function(){
//	alert('没网呀')
//})



function myAjax(options, successcb, errorcb,nonetworkcb) {
	var net = plus.networkinfo.getCurrentType();
	if (net != 0 && net != 1) {
		innerAjax(options, successcb, errorcb)
	} else {
		if(nonetworkcb){
			nonetworkcb()
		} else {
			mui.toast('未连接网络,请链接网络');
		}
	}
}

function innerAjax(options,successcb,errorcb) {
	var op = {
		type:'post',
		url:'',
		data:{}
	};
	copyobj(options,op);
	plus.nativeUI.showWaiting('请求中',{background:"#d1d1d1"})
	mui.ajax(BASEURL + op.url, {
		type: op.type,
		data: op.data,
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if (data.ret == 1) {
				successcb(data);
			} else if (data.ret == -101) {
				if(getstorage('token')){
					var token = getstorage('token');
					mui.ajax(BASEURL+'auth/activate',{
						type:'post',
						data:{
							token:token
						},
						success:function(data){
							if(data.ret==1){
								innerAjax(options,successcb,errorcb);
							}else if(data.ret==-1){
								mui.toast('身份校验异常,请重新登录');
								mui.ajax(BASEURL+'auth/out',{
									type:'get',
									success:function(){
										openWindow('./page/logupin/login.html')
									}
								})
							}
						}
					})
				} else {
					openWindow('./page/logupin/login.html');
				}
			} else{
				plus.nativeUI.closeWaiting()
				mui.toast('网络服务出错了')
			}
		},
		error: function(xhr,type){
			plus.nativeUI.closeWaiting();
			errorcb(xhr,type)
		}
	})
}
function copyobj(from,to){
	for(var i in from){
		if(typeof from[i]=='object'){
			copyobj(from[i],to[i])
		}else{
			to[i]=from[i];
		}
	}
}
function openWindow(url, param, ani, time) {
		var snum, id;
		var animationType = ani || 'slide-in-right';
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

function openNewWindow(url, param, ani, time) {
	var snum, id;
	var animationType = ani || 'slide-in-right';
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
			createNew: true,
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



function setsysstorage(val) {
	var ago = getstorage('systemmsg') || "";
	val = ago + val;
	setstorage('systemmsg', val)
}

function getAllwebview() {
	var a = plus.webview.all();
	for (var i in a) {
		console.log(a[i].getURL() + ':' + a[i].id)
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

function showobj(obj) {
	for (var i in obj) {
		console.log(i + ":" + obj[i]);
	}
}

function successcb() {
	plus.webview.getLaunchWebview().show()
}

//表单前端验证

function formRegTest() {

}