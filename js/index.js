var menu = null,
	main = null,
	will = null,
	get = null;
var showMenu = false;
//主页面初始化
mui.init({
	swipeBack: false,
	gestureConfig: {
		doubletap: true
	}
});

function _closeMenu() {
	if (isInTransition) {
		return;
	}
	if (showMenu) {
		//关闭遮罩；
		isInTransition = true;
		main.setStyle({
			mask: 'none',
			left: '0',
			transition: {
				duration: 200
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 200);
		showMenu = false;
		mui.later(function() {
			isInTransition = false;
			menu.hide();
		}, 300);
	}

}

//主要处理预加载
mui.plusReady(function() {
	//仅支持竖屏显示
	plus.screen.lockOrientation("portrait-primary");
	main = plus.webview.currentWebview();
	main.addEventListener('maskClick', _closeMenu);
	//处理侧滑导航，为了避免和子页面初始化等竞争资源，延迟加载侧滑页面；
	setTimeout(function() {
			menu = mui.preload({
				id: 'index-menu.html',
				url: './page/index-menu.html',
				styles: {
					left: '0',
					width: '70%'
				}
			});
		msg = mui.preload({
			id: 'msgcontent.html',
			url: './page/msgcontent.html'
		}); 
		will = mui.preload({
			id: 'i-will',
			url: './page/i-will.html'
		});
		 get = mui.preload({
			id: 'get',
			url: './page/send-the-trip.html'
		});
	}, 300);
});
//显示侧滑菜单

var isInTransition = false;

function openMenu() {
	if (isInTransition) {
		return;
	}
	if (!showMenu) {
		isInTransition = true;
		menu.show('none', 0, function() {
			main.setStyle({
				mask: 'rgba(0,0,0,0.4)',
				left: '70%',
				transition: {
					duration: 150
				}
			});
			mui.later(function() {
				isInTransition = false;
				//移除menu的mask
			}, 160);
		});
		showMenu = true;
	}
};

$(function() {
	$('#per-info').on('tap', function(e) {
		if (showMenu) {
			_closeMenu();
		} else {
			openMenu();
		}
	});
})
document.querySelector('header').addEventListener('doubletap', function() {
	main.children()[0].evalJS('mui.scrollTo(0, 100)');
});
//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
mui.menu = function() {
		if (showMenu) {
			_closeMenu();
		} else {
			openMenu();
		}
	}
	//处理右上角关于图标的点击事件；
$('#chat-info').on('tap', function() {
	msg.show('slide-in-right', 100)
})
$('.help-me').on('tap', function() {
		will.show('slide-in-bottom', 200)
	})
	//	首页返回键处理
	//	处理逻辑：1秒内，连续两次按返回键，则退出应用；
var first = null;
mui.back = function() {
	if (showMenu) {
		_closeMenu();
		return;
	} else {
		//首次按键，提示‘再按一次退出应用’
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



