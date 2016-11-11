(function($) {
	$(function() {
		//主页轮播
		var mySwiper1 = new Swiper('.myswiper-banner', {
			loop: true,
			autoplay: 2000,
			pagination: '.myfen1',
			autoplayDisableOnInteraction: false,
		})

		//跨域拿数据  当点击输入框的时候   输入内容   拿数据   然后写到ul中
		var
			oSearch = $(".search-input"),
			oSearchUl = $(".search-ul");
		oSearch.bind('input properchange', function() {
			$.ajax({
				type: "POST",
				url: "https://suggest.taobao.com/sug?q="+ oSearch.val() +"&code=utf-8&area=c2c&nick=&sid=null&",
				dataType: "jsonp",
				success: function(data) {
					console.log(data)
					var sHtml = "";
					$.each(data.result,function(v, k) {
						console.log(k)
						sHtml += "<li><a href='javascript:;'><i>" + k[0]+ "</i><em><span>库存:</span>" + k[1] + "</em></a></li>";
					});
					oSearchUl.html(sHtml);
				}
			})
		});
		oSearch.blur(function() {
			oSearchUl.css({
				display: 'none'
			});
		});

		//调用拍照功能和二维码功能
		var oCarmerBtn = $(".camera-a");
		document.addEventListener('plusready', function() {
			oCarmerBtn.click(function() {
				var myCam = plus.camera.getCamera();
				console.log(myCam);
				var myFormat = myCam.supportedImageFormats;
				$("#showDiv").append(myCam.supportedImageResolutions);
				myCam.captureImage(function(capturedFile) {
					console.log(capturedFile);
					// 					$("#showImg").attr("src",capturedFile);
					plus.io.resolveLocalFileSystemURL(capturedFile, function(entry) {
						$("#showImg").attr("src", entry.fullPath);

					}, function(error) {

					});

				}, function(error) {
					var code = error.code; // 错误编码
					var message = error.message; // 错误描述信息

				}, {
					format: myFormat,
					index: "2",
				});
			})

		});

		//二维码功能
		/* var oCodeBtn    =$(".er-Code");
           oCodeBtn.click(function (){
           	  location.href('barcode_scan.html');
           });*/

		var img = null;
		var blist = [];

		function scaned(t, r, f) {
			var d = new Date();
			var h = d.getHours(),
				m = d.getMinutes(),
				s = d.getSeconds(),
				ms = d.getMilliseconds();
			if(h < 10) {
				h = '0' + h;
			}
			if(m < 10) {
				m = '0' + m;
			}
			if(s < 10) {
				s = '0' + s;
			}
			if(ms < 10) {
				ms = '00' + ms;
			} else if(ms < 100) {
				ms = '0' + ms;
			}
			var ts = '[' + h + ':' + m + ':' + s + '.' + ms + ']';
			var li = null,
				hl = document.getElementById("history");
			if(blist.length > 0) {
				li = document.createElement("li");
				li.className = "ditem";
				hl.insertBefore(li, hl.childNodes[0]);
			} else {
				li = document.getElementById("nohistory");
			}
			li.id = blist.length;
			var html = '[' + h + ':' + m + ':' + s + '.' + ms + ']' + '　　' + t + '码<div class="hdata">';
			html += r;
			html += '</div>';
			li.innerHTML = html;
			li.setAttribute("onclick", "selected(id);");
			blist[blist.length] = {
				type: t,
				result: r,
				file: f
			};
			update(t, r, f);
		}

		function selected(id) {
			var h = blist[id];
			update(h.type, h.result, h.file);
			if(h.result.indexOf("http://") == 0 || h.result.indexOf("https://") == 0) {
				plus.nativeUI.confirm(h.result, function(i) {
					if(i.index == 0) {
						plus.runtime.openURL(h.result);
					}
				}, "", ["打开", "取消"]);
			} else {
				plus.nativeUI.alert(h.result);
			}
		}

		function update(t, r, f) {
			outSet("扫描成功：");
			outLine(t);
			outLine(r);
			outLine("\n图片地址：" + f);
			if(!f || f == "null") {
				img.src = "../img/barcode.png";
			} else {
				plus.io.resolveLocalFileSystemURL(f, function(entry) {
					img.src = entry.toLocalURL();
				});
				//img.src = "http://localhost:13131/"+f;
			}
		}

		function onempty() {
			if(window.plus) {
				plus.nativeUI.alert('无扫描记录');
			} else {
				alert('无扫描记录');
			}
		}

		function cleanHistroy() {
			if(blist.length > 0) {
				var hl = document.getElementById("history");
				hl.innerHTML = '<li id="nohistory" class="ditem" onclick="onempty();">无历史记录	</li>';
			}
			plus.io.resolveLocalFileSystemURL("_doc/barcode/", function(entry) {
				entry.removeRecursively(function() {
					// Success
				}, function(e) {
					//alert( "failed"+e.message );
				});
			});
		}

		//上拉刷新，下拉加载
		//http://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&ratio=3%3A4&_version=1&_=1478529161258&callback=jsonp1
		var
			oScrollCon = $('#scroll-content'),
			oScroll = null,
			oNum = 0,
			oPullDown = $('#pull-down'),
			oPullUp = $('#pull-up'),
			oGoodsBox = $('.goods-list');
		oScroll = new iScroll('scroll-content', {
			hScrollbar: false,
			vScrollbar: false,
			topOffset: oPullDown.height(),
			onScrollMove: function() {
				if(this.y > 8 && !oPullDown.hasClass('s-active')) {
					oPullDown.addClass('s-active').html('释放加载……');
					this.minScrollY = 0;
				}else if(this.y < 8 && oPullDown.hasClass('s-active')){
					oPullDown.removeClass('s-active').html("下拉刷新");
					this.minScrollY =-oPullDown.height();
				}else if(this.y<this.maxScrollY && !oPullDown.hasClass('s-active')){
             	oPullUp.addClass('s-active').html('释放加载……');
                }else if(this.y>=this.maxScrollY && oPullDown.hasClass('s-active')){
             	oPullUp.removeClass('s-active').html('上拉加载');
             }
			},
			onScrollEnd: function() {
				if(oPullDown.hasClass('s-active')) {
					oPullDown.html('Loadding……');
					oPullDawnData();
				}else if(oPullUp.hasClass('s-active')){
					oPullUp.html('Loadding……');
					oPullUpData();
				}
			},
			onRefresh: function() {
				if(oPullDown.hasClass('s-active')) {
					oPullDown.removeClass('s-active').html('下拉刷新');
				}else if(oPullUp.hasClass('s-active')){
					oPullUp.removeClass('s-active').html('下拉刷新');
				}

			},

		});

		function oPullDawnData() {
			oNum++;
			$.ajax({
				type: "get",
				url: "http://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=" + oNum + "&ratio=3%3A4&_version=1",
				dataType: "jsonp",
				success: function(data) {
					var sHtml = '';
					$.each(data.result.wall.docs, function(k, v) {
						console.log(v);
						sHtml += "<a href='javascript:;' class='goods-items fl'><div class='goods-img'>" +
							"<img src='" + v.img + "' alt=''/></div><div class='goods-info'>" +
							"<div class='name-box'><p class='goods-name'>" + v.title +
							"</p></div><div class='icon-tag'></div><div class='info-box'><p class='p-price fl'>￥<em>" + v.price + "</em></p>" +
							"<p class='p-count fr'>" + v.cfav + "</p></div></div></a>";
					});
					oGoodsBox.prepend(sHtml);
					oScroll.refresh();
				}
			});
		}
		
		
		function oPullUpData() {
			oNum++;
			$.ajax({
				type: "get",
				url: "http://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=" + oNum + "&ratio=3%3A4&_version=1",
				dataType: "jsonp",
				success: function(data) {
					var sHtml = '';
					$.each(data.result.wall.docs, function(k, v) {
						console.log(v);
						sHtml += "<a href='javascript:;' class='goods-items fl'><div class='goods-img'>" +
							"<img src='" + v.img + "' alt=''/></div><div class='goods-info'>" +
							"<div class='name-box'><p class='goods-name'>" + v.title +
							"</p></div><div class='icon-tag'></div><div class='info-box'><p class='p-price fl'>￥<em>" + v.price + "</em></p>" +
							"<p class='p-count fr'>" + v.cfav + "</p></div></div></a>";
					});
					oGoodsBox.append(sHtml);
					oScroll.refresh();
				}
			});
		}
		
		
		setTimeout(function (){
            oScrollCon.css({left: 0});
        },300);
		

	});
})(jQuery);