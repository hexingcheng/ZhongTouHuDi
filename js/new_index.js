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
window.addEventListener('removehref', function() {
	$('.pho').attr('src', 'img/defualt.png')
	$('.myname').text("");
	$('.mytittle').text("")
})
window.addEventListener("swiperight", function() {
	if ($('#offCanvasContentScroll').offset().left < 200) {
		offCanvasWrapper.offCanvas('show');
	} else {
		return;
	}
});

mui.plusReady(function() {
		plus.screen.lockOrientation('portrait-primary')
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		})
		mui('#offCanvasSideScroll').scroll({
			bounce: true,
			indicators: false
		});
		//		mui('#offCanvasContentScroll').scroll();
		plus.webview.getLaunchWebview().setStyle({
				scrollIndicator: 'none'
			})
			//处理点击事件，跳转页面
			mui('.menulist').on('touchstart', '.list', function() {
				$(this).css('background-color', '#063d4b');
			})
			mui('.menulist').on('touchend', '.list', function() {
				$(this).css('background-color', '#03242c');
			})
		mui('.menulist').on('tap', '.list', function() {
//			$('.list').css('background-color', '#03242c');
//			$(this).css('background-color', '#063d4b')
			var url = this.getAttribute('data-src');
			openWindow(url);
		})
		document.getElementById('mysned').addEventListener('tap', function() {
			iflogin(function() {
				openWindow('./page/mysendorder/my-send-order.html')
			})
		})
		document.getElementById('mywallet').addEventListener('tap', function() {
			iflogin(function() {
				openWindow('./page/wallet/my-wallet.html')
			})
		})
	})
	//处理返回键
window.addEventListener('closeMenu', function() {
	if ($('#offCanvasContentScroll').offset().left > 0) {
		offCanvasWrapper.offCanvas('close');
	}
	//	$('#offCanvasSide').hide()
})
window.addEventListener('setaccount', function(eve) {
	$('.myname').text(eve.detail.firstName + " " + eve.detail.familyName);
	$('.mytitle').text(eve.detail.nation);
	var n = BASEURL.indexOf('/a');
	var pic = BASEURL.substring(0, n);
	if (eve.detail.headPic) {
		$('.pho').attr('src', pic + eve.detail.headPic)
	}
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
			openWindow('./page/getorder/get-order.html');
		})
	})
	//document.getElementById('help').addEventListener('tap', function() {
	//	iflogin(function() {
	//		mui.openWindow({
	//			url: './page/sendorder/createorder.html',
	//			id: 'createorder',
	//			show: {
	//				autoShow: true,
	//				aniShow: 'slide-in-bottom',
	//				duration: 200
	//			},
	//			waiting: {
	//				autoShow: true,
	//				title: '正在加载...',
	//				options: {
	//					background: '#d1d1d1'
	//				}
	//			}
	//		})
	//	})
	//})
