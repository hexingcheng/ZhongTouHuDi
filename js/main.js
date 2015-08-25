//standard
$(function(){
    $('#order_send_test').on('click',function(){
		mui('.mui-popover').popover('toggle');
		$('#popover').css('display','block');
	})
	$('#_cancle').on('click',function(){
		$('#popover').css('display','none');
		mui('.mui-popover').popover('toggle');
	})
	$('.ok').on('click',function(){
		$('#popover').css('display','none');
		mui('.mui-popover').popover('toggle');
	});


//抢单

		$('.jie_pop_s').hover(function(){
			$(this).css("backgroud-color","gray");
		},function(){
			$(this).css("backgroud-color","white");
		});
		$('#con_person').on("tap",function(){
			$('#popover_3').css('display','block');
		});
		$('#my_cancle').on('click',function(){
			$('#popover_3').css('display','none')
		});

//meto_2

		$('.qi').hover(function(){
			$(this).css("background-color",'silver');
		},function(){
			$(this).css("background-color",'rgb(239, 239, 244)');
		}); 
		
		$('.add_').on('click',function(){
			$('.tan_').css({
				"display":"block",
			})
		});
		
		$('#_cancle').on('click',function(){
			$('.tan_').css("display","none");
			$('#input').val('');
		});
		

	//orderdetails
		$('#orders_').on('click',function(){
			$('#reset_cancle').css('display','block');
			$('#varification').css('display','none');
			$('#order_sure').css('display','none');
		});
		
		$('#order_send_').on('click',function(){
			$('#orders').css('display','block');
		});
		$('#order_cancle').on('click',function(){
			$('#orders').css('display','none');
		})

	//varification--
	
		$('#varifi_faile').on('click',function(){
		$('#varification').css('display','block');
	});
	$('#varifi_sure').on('click',function(){
		$('#varification').css('display','none');
	});
	//orderdtails_2
	$("#cancle_").on('click',function(){
		$('#varification').css('display','block');
		
	});
	$('#order_send_').on('click',function(){
		$('#reset_cancle').css('display','block');
		$('#order_sure').css('display','none');	
		$('#varification').css('display','none');
	});

	//orders

		$('.orders').on('click',function(){
			$('#'+this.id).css('background-color','orange').siblings("div").css('background-color','#efeff4');
			console.log(this.id);
			$('.'+this.id).css('display','block').siblings('.tab').css('display','none');
		})
	});
	
	
	
