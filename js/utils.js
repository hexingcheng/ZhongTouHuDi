var BASEURL = "http://202.202.43.107:8080/api/";
var BASEIMGURL = "http://202.202.43.107:8080";
//		var BASEURL = "http://192.168.0.100:8080/api/"

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
		data:{},
		wait:false
	};
	copyobj(options,op);
	if(op.wait){
		plus.nativeUI.showWaiting('请求中',{background:"#d1d1d1"})
	}
	openwindowloading(function(){
		mui.ajax(BASEURL + op.url, {
			type: op.type,
			data: op.data,
			success: function(data) {
				if(op.wait){
					plus.nativeUI.closeWaiting();
				}
				if (data.ret == 1) {
					successcb(data);
					removeloading()
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
											removeloading()
										}
									})
								}
							}
						})
					} else {
						openWindow('./page/logupin/login.html');
						removeloading()
					}
				} else{
					if(op.wait){
						plus.nativeUI.closeWaiting()
					}
					successcb(data);
					removeloading()
				}
			},
			error: function(xhr,type){
				if(op.wait){
					plus.nativeUI.closeWaiting();
				}
				errorcb(xhr,type)
				removeloading()
			}
		})
		
	});
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
//		openwindowloading(function(){
			var snum, id;
			var animationType = ani || 'slide-in-right';
			var animationTime = time || 300;
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
						autoShow: true,
						aniShow: animationType,
						duration: animationTime
					},
					waiting: {
						autoShow: false,
						title: '正在加载...',
						options: {
							background: '#d1d1d1'
						}
					}
				})
			} else {
				alert('system is not ready')
			}
//			removeloading()
//		})
	}
	// for test
function openwindowloading(callback){
	var otherload = document.getElementById("loading-mask");
	var preload = document.getElementById("openwindowloading");
	var show = otherload ? getComputedStyle(otherload, 0)["display"] : "none";
	
	var fixedtop = 52;
	
	if(window.plus){
		var curl = plus.webview.currentWebview().getURL();
		if(curl.match("my-send-order-content.html") || curl.match("my-get-order-content.html") || curl.match("order-content.html")){
			fixedtop = 0;
		}
	}
	console.log(show)
	
	if(show == "block"){
		callback();
		return;
	}
	
	if(!preload && show == "none"){
		var div = document.createElement('div');
		div.id = 'openwindowloading'
		var loading = document.createElement('div');
		var img = document.createElement('img');
		img.style.width = '80px';
		img.style.height = '80px';
		loading.style.position = 'absolute';
		loading.style.top = "50%"
		loading.style.left = '50%'
		loading.style.width = '80px'
		loading.style.height = '80px'
		loading.style.marginLeft = '-40px'
		loading.style.marginTop = '-40px'
		img.style.border = '0px'
		div.appendChild(loading);
		loading.appendChild(img);
		img.src = './loading2.gif'
		div.style.backgroundColor = "rgba(255,255,255,1)";
		div.style.position = 'fixed';
		div.style.top = fixedtop + 'px';
		div.style.left = '0px';
		div.style.right = '0px';
		div.style.bottom = '0px';
		div.style.zIndex = 1000;
		img.onload = function(){
			document.getElementsByTagName('body')[0].appendChild(div);
			callback();
		}
	}
}
function removeloading(){
	var loading = document.getElementById('openwindowloading');
	if(loading){
		setTimeout(function(){
			document.getElementsByTagName('body')[0].removeChild(loading)
		},500)
	}
}
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
				autoShow: false,
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


function closeMask(){
	// 300毫秒之后清除等待框
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
}
function getcurrenttime(){
	var d = new Date();
	var m = d.getMonth()-0+1;
	var nm = m<10?('0'+m):m;
	var da = d.getDate();
	var nd = da<10?('0'+d):da;
	var h = d.getHours();
	var nh = h<10?('0'+h):h;
	var mi = d.getMinutes();
	var nmi = mi<10?('0'+mi):mi;
	var s = d.getSeconds();
	var ns = s<10?('0'+s):s;
	return d.getFullYear()+"-"+nm+"-"+nd+" "+nh+":"+mi+":"+ns;
}

// 解决部分手机number类型的时候不出现placeholder属性值
function fixedNum(selector){
	$(selector).on("focus", function(){
		$(this).attr("type", "number");
	})
	$(selector).on("blur", function(){
		$(this).attr("type", "text");
	})
}
function getlatlng(success){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(pos){
			//存储经纬度信息
			var lat = pos.coords.latitude+"";
			var lng = pos.coords.longitude+"";
			plus.storage.setItem('latitude',lat)
			plus.storage.setItem('longitude',lng)
			console.log('获取当前位置成功lat:'+plus.storage.getItem('latitude')+',lng:'+plus.storage.getItem('longitude'));
			success&&success(pos);
		},function(e){
			mui.toast('获取当前位置信息失败')
		},{ 
			enableHighAcuracy: true
		})
	}else{
		mui.toast('您的手机不支持定位功能')
	}
}
function closeweb(webarr){
	var len = webarr.length;
	for(var i = 0, web = plus.webview.getWebviewById(webarr[i]);i<len;i++){
		if(web){
			web.close()
		}
	}
}
//function getmsgs() {
//	myAjax({
//		url: 'message/getMsg'
//	}, function(data) {
//		if (data.ret == 1) {
//			alert(data.res.msgList.length)
//			if(data.res.msgList.length){
//				alert('news')
//				$('#msgtips').attr('src','./img/tips.png')
//			}
//		}
//	}, function(xhr, type) {
//		mui.toast(xhr.status + ":" + type)
//	})
//}
