mui.init();
//处理菜单与侧滑部分、
var offCanvasWrapper = mui('#offCanvasWrapper');
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
var offCanvasSide = document.getElementById("offCanvasSide");
var classList = offCanvasWrapper[0].classList;
classList.remove('mui-slide-in');
offCanvasWrapper.offCanvas().refresh();
offCanvasSide.classList.remove('mui-transitioning');
offCanvasSide.setAttribute('style', '');
if (mui.os.plus && mui.os.ios) {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
	});
}
window.addEventListener('dragright', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener('dragleft', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener("swipeleft", function() {
	if ($('#offCanvasContentScroll').offset().left > 0) {
		offCanvasWrapper.offCanvas('close');
	} else {
		return;
	}
});
window.addEventListener("swiperight", function() {
	if ($('#offCanvasContentScroll').offset().left < 200) {
		offCanvasWrapper.offCanvas('show');
	} else {
		return;
	}
});

mui.plusReady(function() {
		mui('#offCanvasSideScroll').scroll();
		mui('#offCanvasContentScroll').scroll();
		plus.webview.getLaunchWebview().setStyle({
			scrollIndicator:'none'
		})
		var gallery = mui('.mui-slider');
		gallery.slider({
			interval: 1500
		});
		//处理点击事件，跳转页面
		mui('.mui-table-view-cell').on('tap', 'a', function() {
			var url = this.getAttribute('data-src');
			openWindow(url);
		})
//		document.getElementById('menu').addEventListener('tap', function() {
//			if (getstorage('token')) {
//				this.href = "#offCanvasSide"
//			} else {
//				console.log(1)
//				mui.openWindow({
//					url:'./page/login-up.html',
//					id:'login-up'
//				})
//			}
//			return false;
//		})
	})
	//处理返回键

window.addEventListener('closeMenu', function() {
	if ($('#offCanvasContentScroll').offset().left > 0) {
		offCanvasWrapper.offCanvas('close');
	}
//	$('#offCanvasSide').hide()
})
var first = null;
mui.back = function() {
	if ($('#offCanvasContentScroll').offset().left > 0) {
		offCanvasWrapper.offCanvas('close');
	} else {
		if (!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if (new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	}

};

//处理菜单键
mui.menu = function() {
		if ($('#offCanvasContentScroll').offset().left > 0) {
			offCanvasWrapper.offCanvas('close');
		} else {
			offCanvasWrapper.offCanvas('show');
		}
	}
	//处理主页tap事件
document.getElementById('chat-info').addEventListener('tap', function() {
	openWindow('./page/msgcontent.html');
})
document.getElementById('hlep-son').addEventListener('tap', function() {
	iflogin(function() {
		openWindow('./page/sendorder/createorder.html');
	})
})
document.getElementById('i-will').addEventListener('tap', function() {
	iflogin(function() {
		openWindow('./page/meto_2.html');
	})
})
document.getElementById('help').addEventListener('tap', function() {
	iflogin(function() {
		mui.openWindow({
			url: './page/sendorder/createorder.html',
			id: 'createorder',
			show: {
				autoShow: true,
				aniShow: 'slide-in-bottom',
				duration: 200
			},
			waiting: {
				autoShow: true,
				title: '正在加载...',
				options: {
					background: '#d1d1d1'
				}
			}
		})
	})
	
})
document.getElementById('add-menu').addEventListener('tap', function() {
	alert('add')
})