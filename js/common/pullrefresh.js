
/**
 * *
 *	此插件是建立在MUI已有的插件（mui.pullToRefresh.js,mui.pullToRefresh.masterial.js）
 * 	的基础上进行进一步改造之后得到的
 * *
 */

(function($, window) {
	$.plusReady(function() {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.002;
		mui(".mui-scroll-wrapper").scroll({
			bounce: true,
			deceleration: deceleration
		});
	})
	$.ready(function() {
		// 因为固有的MUI插件需要建立在该html的固定结构上
		var prehtml = '<div class="mui-slider mui-fullscreen">' +
			'<div style="display: none;" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">' +
			'<div class="mui-scroll"></div>' +
			'</div>' +
			'<div class="mui-slider-group">' +
			'<div class="mui-slider-item mui-control-content mui-active">';
		var subhtml = '</div></div></div>';
		// 默认属性
		var defaults = {
			scrollable: '.mui-scroll',
			down: {
				height: 75, // 可下拉的高度
				callback: false // 下拉后回调函数函数
			},
			up: {
				auto: false, // 第一次执行的时候是否进行自动上拉一次
				offset: 100, //距离底部高度(到达该高度即触发)
				show: true,
				contentdown: '上拉加载',		// 可以嵌入html
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了',
				callback: false
			}
		}

		function SimplyPullRefresh(options) {
			this.init(options);
		}
		SimplyPullRefresh.prototype = {
			// 初始化函数
			init: function(options) {
				this.options = $.extend(true, defaults, options);
				this.reconstructNode();
				this.execPull();
			},
			// 重组DOM节点
			reconstructNode: function() {
				var scrollnode = document.querySelector(this.options.scrollable);
				var parent = scrollnode.parentNode.parentNode;
				var reconstructHtml = prehtml + parent.innerHTML + subhtml;
				parent.innerHTML = reconstructHtml;
			},
			// 
			execPull: function() {
				var _this = this;
				var opt = {
					down: _this.options.down,
					up: _this.options.up
				}
				$(_this.options.scrollable).pullToRefresh(opt);
			}
		}
		$.SimplyPullRefresh = SimplyPullRefresh;
	})
})(mui, window)