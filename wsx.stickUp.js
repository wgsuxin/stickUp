jQuery(
function($) {
	
	$(document).ready(function(){
		var contentButton = [];
		var contentTop = [];
		var content = [];
		var lastScrollTop = 0;
		var scrollDir = '';
		var itemClass = '';
		var itemHover = '';
		var menuSize = null;
		var stickyHeight = 0;
		var stickyMarginB = 0;
		var currentMarginT = 0;
		var topMargin = 0;
    var vartop = 0, varscroll = 0, originalPos; //原代码没有此行变量的定义
		$(window).scroll(function(event){
   			var st = $(this).scrollTop();
   			if (st > lastScrollTop){
       			scrollDir = 'down';
   			} else {
      			scrollDir = 'up';
   			}
  			lastScrollTop = st;
		});
		$.fn.stickUp = function( options ) {
      //wsx 2015-01-06 增加原始position样式变量，固顶结束后改为原始状态而不是像原来每次都设为relative
      originalPos = $(this).css('position') || 'relative'; //原代码没有此变量的定义
      startInitStickUp(); //进行scroll事件绑定
			// adding a class to users div
			$(this).addClass('stuckMenu');
        	//getting options
        	var objn = 0;
        	if(options != null) {
	        	for(var o in options.parts) {
	        		if (options.parts.hasOwnProperty(o)){
	        			content[objn] = options.parts[objn];
	        			objn++;
	        		}
	        	}
	  			if(objn == 0) {
	  				console.log('error:needs arguments');
	  			}

	  			itemClass = options.itemClass;
	  			itemHover = options.itemHover;
	  			if(options.topMargin != null) {
	  				if(options.topMargin == 'auto') {
	  					topMargin = parseInt($('.stuckMenu').css('margin-top'));
	  				} else {
	  					if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){
	  						topMargin = parseInt(options.topMargin.replace("px",""));
	  					} else if(!isNaN(parseInt(options.topMargin))) {
	  						topMargin = parseInt(options.topMargin);
	  					} else {
	  						console.log("incorrect argument, ignored.");
	  						topMargin = 0;
	  					}	
	  				}
	  			} else {
	  				topMargin = 0;
	  			}
	  			menuSize = $('.'+itemClass).size();
  			}			
			stickyHeight = parseInt($(this).height());
			stickyMarginB = parseInt($(this).css('margin-bottom'));
			currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
			vartop = parseInt($(this).offset().top);
			//$(this).find('*').removeClass(itemHover);
		}
    //原代码没有此函数 为加载此文件时直接进行scroll事件绑定
    //wsx 2014-12-19 改为用此函数包裹 在页面中启用stickUp时才进行事件绑定
    var startInitStickUp = function()
    {
      $(document).on('scroll', function() {
        varscroll = parseInt($(document).scrollTop());
        if(menuSize != null){
          for(var i=0;i < menuSize;i++)
          {
            contentTop[i] = $('#'+content[i]+'').offset().top;
            function bottomView(i) {
              contentView = $('#'+content[i]+'').height()*.4;
              testView = contentTop[i] - contentView;
              //console.log(varscroll);
              if(varscroll > testView){
                $('.'+itemClass).removeClass(itemHover);
                $('.'+itemClass+':eq('+i+')').addClass(itemHover);
              } else if(varscroll < 50){
                $('.'+itemClass).removeClass(itemHover);
                $('.'+itemClass+':eq(0)').addClass(itemHover);
              }
            }
            if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {
              $('.'+itemClass).removeClass(itemHover);
              $('.'+itemClass+':eq('+i+')').addClass(itemHover);
            }
            if(scrollDir == 'up') {
              bottomView(i);
            }
          }
        }

        //wsx 2015-01-07 修正位置调整错误 避免跳动现象
        //查找固顶元素之后的第一个可见元素 并对其进行位置调整
        //源码中为 $('.stuckMenu').next() 
        //没有考虑后面的元素可能设置 display:none 的情况
        //如果只是调整了不可见元素的位置 则在固定元素时会出现跳动现象
        var _next = $('.stuckMenu').nextUntil(':visible').last().next();

        if(vartop < varscroll + topMargin){
          $('.stuckMenu').addClass('isStuck');
          _next.closest('div').css({
            'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
          }, 10);
          $('.stuckMenu').css("position","fixed");
          $('.isStuck').css({
            top: '0px'
          }, 10, function(){

          });
        };

        if(varscroll + topMargin < vartop){
          $('.stuckMenu').removeClass('isStuck');
          _next.closest('div').css({
            'margin-top': currentMarginT + 'px'
          }, 10);
          $('.stuckMenu').css("position",originalPos);
        };

      });
    };
	});

});
