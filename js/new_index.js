mui.init();
//处理菜单与侧滑部分、
$('#offCanvasSide').css('width', '83%');
$('.width400').height($('.width400').width())
$('#srcoll').height($(window).height() - 52);
document.getElementById("go-help").addEventListener("tap", function() {
	openWindow("./page/help/help-index.html");
}, false)
document.getElementById("trip-plan").addEventListener("tap", function() {
	openWindow("./page/tripplan/send-trip.html");
})
mui.plusReady(function() {
		//		plus.storage.removeItem('systemmes14714714774')
		//		plus.storage.removeItem('systemmes25825825885')
		setstorage('getsystemmsgtime', (new Date()).getTime());
		plus.navigator.closeSplashscreen();
		var net = plus.networkinfo.getCurrentType();
		if (net != 0 && net != 1) {
			if (getstorage('personinfo')) {
				plus.storage.removeItem('personinfo')
			}
			if (getstorage('token')) {
				mui.ajax(BASEURL + 'account/info', {
					type: 'post',
					timeout: 10000,
					success: function(data) {
						if (data.ret == 1) {
							if (data.res.deliver == 1) {
								$('#applydeliver').addClass('mui-hidden');
							}
							setstorage('personinfo', JSON.stringify(data.res));
							getsystemmsg();
							mui.toast('get personal infomation success')
							if (data.res.ptitle) {
								$('.admira').text(data.res.ptitle);
							} else {
								if ($('#applydeliver').hasClass('mui-hidden')) {
									$('#applydeliver').removeClass('mui-hidden')
								}
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
														if (data.res.deliver == 1) {
															$('#applydeliver').addClass('mui-hidden');
														} else {
															if ($('#applydeliver').hasClass('mui-hidden')) {
																$('#applydeliver').removeClass('mui-hidden')
															}
														}
														setstorage('personinfo', JSON.stringify(data.res));
														getsystemmsg();
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
											openWindow('./page/logupin/login.html')
											plus.storage.removeItem('token')
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
						if (type == 'timeout') {
							mui.toast('超时')
						}
						if (type == 'abort') {
							mui.toast('访问被禁止')
						}
					}
				})
			} else {
				mui.toast('无登录信息，请先登录')
			}
		} else {
			mui.toast('未连接网络,请链接网络');
		}

		plus.screen.lockOrientation('portrait-primary')
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		})
		mui('#offCanvasSideScroll').scroll({
			bounce: true,
			indicators: false
		});
		//处理点击事件，跳转页面
		mui('.menulist').on('touchstart', '.list', function() {
			$(this).css('background-color', '#063d4b');
		})
		mui('.menulist').on('touchend', '.list', function() {
			$(this).css('background-color', '#03242c');
		})
		mui('.menulist').on('tap', '.list', function() {
			var url = this.getAttribute('data-src');
			iflogin(function() {
				openWindow(url);
			})
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
		if (getstorage('token')) {
			setInterval(function() {
				getsystemmsg();
			}, 6000)
		}

	})
	//处理返回键

function getsystemmsg() {
	myAjax({
		url: 'message/getMsg',
		wait: false
	}, function(data) {
		if (data.ret == 1) {
			if (data.res.msgList.length) {
				$('#msgtips').attr('src', './img/tips.png');
			}
			var personinfo = JSON.parse(getstorage('personinfo')).phone;
			var whichperson = 'systemmes' + personinfo;
			if (!getstorage(whichperson)) {
				setstorage(whichperson, JSON.stringify(data.res));
			} else {
				handlemsg(data);
			}
		} else {
			return;
		}
	}, function(xhr, type) {
		mui.toast(xhr.status + ":" + type)
	})
}

function handlemsg(data) {
	var personinfo = JSON.parse(getstorage('personinfo')).phone;
	var whichperson = 'systemmes' + personinfo
	var old = JSON.parse(getstorage(whichperson));
	var listArr = old.msgList;
	var newmsg = data.res.msgList;
	showobj(data.res.msgList[0])
	var temp = [];
	for (var j = 0; j < newmsg.length; j++) {
		if (newmsg[j].type == 1) {
			var on = true;
			for (var i = 0; i < listArr.length; i++) {
				if (listArr[i].type == 1) {
					if (newmsg[j].params.id == listArr[i].params.id) {
						listArr[i] = newmsg[j];
						listArr[i].ifnew = 1;
						on = false;
					}
				}
			}
			if (on) {
				listArr.unshift(newmsg[j]);
			}
		} else {
			temp.push(newmsg[j]);
		}
	}
	var now = temp.concat(listArr);
	var obj = {
		'msgList': now
	}
	setstorage(whichperson, JSON.stringify(obj));
}
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
$('.infowrap').on('tap', function() {
	iflogin(function() {
		openWindow('./page/person/new_me_center.html');
	})
})
window.addEventListener('removehref', function() {
	$('.pho').attr('src', 'img/defualt.png')
	$('.myname').text("");
	$('.admira').text("头衔")
})
window.addEventListener('closeMenu', function() {
	offCanvasWrapper.offCanvas('close');
})
window.addEventListener('setaccount', function(eve) {
	if (eve.detail.deliver == 1) {
		$('#applydeliver').addClass('mui-hidden');
	} else {
		if ($('#applydeliver').hasClass('mui-hidden')) {
			$('#applydeliver').removeClass('mui-hidden')
		}
	}
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
window.addEventListener('msgtips', function(eve) {
	$('#msgtips').attr('src', './img/tips.png')
})

var first = null;
mui.back = function() {
	if ($('#offCanvasSide').offset().left == 0) {
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
		if ($('#offCanvasContentScroll').offset().left == 0) {
			offCanvasWrapper.offCanvas('close');
		} else {
			offCanvasWrapper.offCanvas('show');
		}
	}
	//处理主页tap事件
document.getElementById('chat-info').addEventListener('tap', function() {
	iflogin(function() {
		$('#msgtips').attr('src', './img/message.png');
		openWindow('./page/message/message.html');
	})
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