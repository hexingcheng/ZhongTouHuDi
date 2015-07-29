//处理主页侧换菜单部分

//全局变量

mui.init({
	swipeBack: false,
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	}
})

var isInTransition = false;
var showMenu = false;
var menu, main, will;
var mask = mui.createMask(closeMenu);
//打開側滑菜單

function openMenu() {
	var mz = plus.webview.getWebviewById('index-menu').getStyle().zindex+1;
	plus.webview.getLaunchWebview().setStyle({
		zindex:mz
	})
	if (isInTransition) {
		return;
	}
	if (!showMenu) {
		mask.show();
		isInTransition = true;
		menu.show('none', 0);
		main.setStyle({
			left: '70%',
			transition: {
				duration: 250
			}
		});
		isInTransition = false;
		showMenu = true;
	}
}

//关闭侧滑菜单
//重写memu方法
mui.menu = function() {
	if (showMenu) {
		_closeMenu();
	} else {
		openMenu();
	}
}

function closeMenu() {
		if (isInTransition) {
			return;
		}
		if (showMenu) {
			//关闭遮罩；
			isInTransition = true;
			menu.setStyle({
				left: '0',
				transition: {
					duration: 300
				}
			})
			main.setStyle({
				left: '0',
				transition: {
					duration: 250
				}
			});

			//等窗体动画结束后，隐藏菜单webview，节省资源；
			setTimeout(function() {
				menu.hide();
				mask.close();
			}, 250);
			showMenu = false;
			isInTransition = false;
		}
	} 
	//plusReady事件完成后执行操作
mui.plusReady(function() {
	var gallery = mui('.mui-slider');
	gallery.slider({
		interval: 1500
	});
	console.log(plus.webview.getWebviewById(plus.runtime.appid).getURL());
	main = plus.webview.currentWebview();
	plus.screen.lockOrientation("portrait-primary");

	//	预加载侧滑菜单

	setTimeout(function() {
		menu = mui.preload({
			id: 'index-menu',
			url: './page/index-menu.html',
			styles: {
				left: '0',
				width: '70%',
				zindex:-1
			}
		});
		will = mui.preload({
			id: 'i-will',
			url: './page/deliver-goods.html'
		});
	}, 300)
	var c = plus.webview.getLaunchWebview()
	c.setStyle({
		'scrollIndicator': 'none'
	})
	$('#hlep-son').on('tap', function(e) {
		iflogin(function() {
			will.show('slide-in-right', 150);
		})
		e.preventDefault()
	})

})



//tap操作入口



$('#per-info').on('tap', function(e) {
	if (showMenu) {
		closeMenu();
	} else {
		openMenu();
	}
});
$('#chat-info').on('tap', function() {
	openWindow('./page/msgcontent.html');
})


//处理手势事件

window.addEventListener('dragright', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener('dragleft', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener("swipeleft", closeMenu);
window.addEventListener("swiperight", openMenu);
window.addEventListener("menu:swipeleft", closeMenu);
var first = null;
//返回键处理

mui.back = function() {
	if (showMenu) {
		closeMenu();
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
//菜单，返回按钮重写