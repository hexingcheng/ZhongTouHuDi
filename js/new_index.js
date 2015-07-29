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
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
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
	offCanvasWrapper.offCanvas('close');
});
window.addEventListener("swiperight", function() {
	offCanvasWrapper.offCanvas('show');
});
//处理返回键


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
	if($('#offCanvasContentScroll').offset().left > 0){
		offCanvasWrapper.offCanvas('close');
	}else{
		offCanvasWrapper.offCanvas('show');
	}
}

//处理主页tap事件
document.getElementById('chat-info').addEventListener('tap',function(){
	openWindow('./page/msgcontent.html');
})
document.getElementById('hlep-son').addEventListener('tap',function(){
	iflogin(function(){
		openWindow('./page/i-will.html')
	})
})
