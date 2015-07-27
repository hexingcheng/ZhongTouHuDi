var BASEURL = "http://172.31.56.19:8080/api/"
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
	setstorage('token','string')
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

function openWindow(url,param) {
		var snum, id;
		param = param||{};
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
				extras:param,
				waiting: {
					autoShow: true,
					title: '正在加载...', 
					options: {
						background:'#d1d1d1'
					}
				}
			})
		}else{
			alert(0)
		}
	}
	// for test
function setsysstorage(val){
	var ago = getstorage('systemmsg')||"";
	val = ago+val;
	setstorage('systemmsg',val)
}
function getAllwebview() {
	var a = plus.webview.all();
	for (var i in a) {
		console.log(a[i].getURL())
	}
}
function handleData(data,cb){
	console.log(data.ret);
}