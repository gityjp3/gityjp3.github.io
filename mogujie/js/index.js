(function ($){
	$(function (){
		//主页轮播
		  var mySwiper1 = new Swiper ('.myswiper-banner', {
			    loop: true,
			    autoplay : 2000,
			    pagination: '.myfen1',
			    autoplayDisableOnInteraction : false,
			  })
		  
		  //跨域拿数据  当点击输入框的时候   输入内容   拿数据   然后写到ul中
		  var
		  	   oSearch     = $(".search-input"),
		  	   oSearchUl   =$(".search-ul");
		  	   oSearch.bind('input properchange',function (){

		  	   	   $.ajax({
		  	   	   	type:"POST",
		  	   	   	url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		  	   	   	dataType: "jsonp",
		  	   	   	success: function (data){
		  	   	   		var sHtml = "";
		  	   	   		data.forEach(function (v,k){
		  	   	   			sHtml += "<li><a href='javascript:;'>"+ v.goodsName+ "</a><em><span>￥</span>"+ v.price+"</em></li>";
		  	   	   		});
		  	   	   		oSearchUl.html(sHtml);
		  	   	   	}
		  	   	   })
		  	   });
		  	   oSearch.blur(function (){
		  	   	oSearchUl.css({display: 'none'});
		  	   });


		  	  //上拉加载新的数据
		  	  //http://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&ratio=3%3A4&_version=1&_=1478529161258&callback=jsonp1
		  	  $.ajax({
		  	  	type: "get",
		  	  	url: "http://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&ratio=3%3A4&_version=1",
		  	    dataType: "jsonp",
		  	    success: function (data){
                    console.log(data);
                    $.each(data.result.wall.docs,function (k,v){
                          console.log(v);
                    });
		  	    }
		  	  });

		  	  //调用拍照功能和二维码功能
       var oCarmerBtn    =$(".camera-a");
   		document.addEventListener('plusready', function(){
   			oCarmerBtn.click(function(){
   				var myCam = plus.camera.getCamera();
   				console.log(myCam);
   				var myFormat = myCam.supportedImageFormats;
   				$("#showDiv").append(myCam.supportedImageResolutions);
   				myCam.captureImage(function(capturedFile){
   					console.log(capturedFile);
// 					$("#showImg").attr("src",capturedFile);
					plus.io.resolveLocalFileSystemURL(capturedFile,function(entry){
						$("#showImg").attr("src",entry.fullPath);
						
					},function(error){
						
					});

   				}, function(error){
   					var code = error.code; // 错误编码
					var message = error.message; // 错误描述信息
					
   				}, {
   					format:myFormat,
   					index:"2",
   				});
   			})
   		
   		});




		  
	});
})(jQuery);
