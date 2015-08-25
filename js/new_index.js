mui.init();
//处理菜单与侧滑部分、
mui.plusReady(function() {
		plus.navigator.closeSplashscreen();
		mui.toast(getstorage('personinfo'))
		if (getstorage('personinfo')) {
			plus.storage.removeItem('personinfo')
		}
		mui.toast(getstorage('token'))
		if (getstorage('token')) {
			mui.ajax(BASEURL + 'account/info', {
				type: 'post',
				success: function(data) {
					showobj(data.res)
					if (data.ret == 1) {
						setstorage('personinfo', JSON.stringify(data.res));
						mui.toast('get personal infomation success')
						if (data.res.ptitle) {
							$('.admira').text(data.res.ptitle);
						}
						if (data.res.headPic) {
							var n = BASEURL.indexOf('/a');
							var u = BASEURL.substring(0, n);
							var picurl = u + data.res.headPic;
							$('.pho').attr('src', picurl)
						}
						if (data.res.firstName && data.res.familyName) {
							var name = data.res.familyName + " " + data.res.firstName
							$('.myname').text(name);
						}
					}
					if (data.ret == -101) {
						if (getstorage('token')) {
							mui.ajax(BASEURL + 'auth/activate', {
								type: 'post',
								data: {
									token: getstorage('token')
								},
								success: function(data) {
									if (data.ret == 1) {
										mui.toast('active success');
										mui.ajax(BASEURL + 'account/info', {
											type: 'post',
											success: function(data) {
												if (data.ret == 1) {
													setstorage('personinfo', JSON.stringify(data.res));
													if (data.res.ptitle) {
														$('.admira').text(data.res.ptitle);
													}
													if (data.res.headPic) {
														var n = BASEURL.indexOf('/a');
														var u = BASEURL.substring(0, n);
														var picurl = u + data.res.headPic;
														$('.pho').attr('src', picurl)
													}
													if (data.res.firstName && data.res.familyName) {
														var name = data.res.familyName + " " + data.res.firstName
														$('.myname').text(name);
													}
												}
											}
										})
									} else {
										mui.toast('faild' + data.ret)
									}
								},
								error: function(xhr, type) {
									mui.toast(xhr.status + ":" + type)
								}
							})
						}
					}
				},
				error: function(xhr, type) {
					mui.toast(xhr.status + ":" + type);
				}
			})
		} else {
			mui.toast('无登录信息，请先登录')
		}
		plus.screen.lockOrientation('portrait-primary')
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		})
		mui('#offCanvasSideScroll').scroll({
			bounce: true,
			indicators: false
		});
		//		mui('#offCanvasContentScroll').scroll();
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

var offCanvasWrapper = mui('#offCanvasWrapper');
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
var offCanvasSide = document.getElementById("offCanvasSide");
var classList = offCanvasWrapper[0].classList;
classList.add('mui-slide-in');
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
$('.infowrap').on('tap', function() {
	openWindow('./page/person/me_center.html')
})
window.addEventListener('removehref', function() {
	$('.pho').attr('src', 'img/defualt.png')
	$('.myname').text("");
	$('.admira').text("头衔")
})
window.addEventListener("swiperight", function() {
	if ($('#offCanvasContentScroll').offset().left < 200) {
		offCanvasWrapper.offCanvas('show');
	} else {
		return;
	}
});
window.addEventListener('closeMenu', function() {
	offCanvasWrapper.offCanvas('close');
	//	$('#offCanvasSide').hide()
})
window.addEventListener('setaccount', function(eve) {
	if (eve.detail.ptitle) {
		$('.admira').text(eve.detail.ptitle);
	}
	if (eve.detail.headPic) {
		var n = BASEURL.indexOf('/a');
		var u = BASEURL.substring(0, n);
		var picurl = u + eve.detail.headPic;
		$('.pho').attr('src', picurl)
	}
	if (eve.detail.firstName && eve.detail.familyName) {
		var name = eve.detail.familyName + " " + eve.detail.firstName
		$('.myname').text(name);
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