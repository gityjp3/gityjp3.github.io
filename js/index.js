(function($) {
	$(function() {

		var
			oFiveRot1 = $('.five-rotate');

		var mySwiper = new Swiper('.swiper-container', {
			direction: 'vertical',
			loop: true,
			pagination: '.swiper-pagination',
			paginationType: 'fraction',
			onInit: function(swiper) { //Swiper2.x的初始化是onFirstInit
				swiperAnimateCache(swiper); //隐藏动画元素
				swiperAnimate(swiper); //初始化完成开始动画

			},
			onSlideChangeEnd: function(swiper) {
				swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画

			}
		})

		var
			oBtnMusic = $(".music-btn"),
			oMusicMove = $(".music-move"),
			oMusicSound = $("#music-audio")[0];
		flag = true;
		oMusicMove.on("click", function() {
			oBtnMusic.css({
				"animation": "none"
			});
			oMusicMove.css({
				"background": "none"
			});
			oMusicSound.pause();
			flag = !flag;
			if(flag) {
				oBtnMusic.css({
					"animation": "rotate 1.5s linear infinite"
				});
				oMusicMove.css({
					"background": "url(img/move.gif)"
				});
				oMusicSound.play();
			}

		});

	});
})(jQuery);