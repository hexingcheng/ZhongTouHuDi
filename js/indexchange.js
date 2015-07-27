//处理主页侧换菜单部分

//全局变量


var isInTransition = false;
var showMenu = false;
var menu, main;

//打開側滑菜單

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
}

//关闭侧滑菜单


function closeMenu() {
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
			isInTransition = false;
		}
	}
	//plusReady事件完成后执行操作
mui.plusReady(function() {
	main = plus.webview.currentWebview();
	plus.screen.lockOrientation("portrait-primary");
	main.addEventListener('maskClick', closeMenu);

	//	预加载侧滑菜单

	setTimeout(function() {
		menu = mui.preload({
			id: 'index-menu.html',
			url: './page/index-menu.html',
			styles: {
				left: '0',
				width: '70%'
			}
		});
	}, 300)
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