$(document).ready(function(){

    localStorage.removeItem("mycart");
    localStorage.removeItem("addworkID");
    localStorage.removeItem("goodsNumber");//程序测试，清空购物车所有信息
    // if(!localStorage.getItem("mycart"))
    //     localStorage.setItem("mycart","");
    // if(!localStorage.getItem("addworkID"))
    //     localStorage.setItem("addworkID","");
    // if(!localStorage.getItem("goodsNumber"))
    //     localStorage.setItem("goodsNumber","");

    //获得索引和id的对应表
    let indexToID = JSON.parse(localStorage.getItem("indexTOID"));

    //幻灯片效果的制作
     let slideBox = $(".slideBox");
     let ul = slideBox.find("ul");
     let oneWidth = slideBox.find("ul li").eq(0).width();
     let number = slideBox.find(".spanBox span");            //注意分号 和逗号的用法
     let timer = null;
     let sw = 0;
     //每个span绑定click事件，完成切换颜色和动画，以及读取参数值
     number.on("click",function (){
       $(this).addClass("active").siblings("span").removeClass("active");
       sw = $(this).index();
       ul.animate({
              "right": oneWidth * sw,    //ul标签的动画为向左移动；
        });
        if(sw === number.length - 1)
          $($(".spanBox span")[0]).addClass("active").siblings("span").removeClass("active");
     });

     //左右按钮的控制效果
     $(".prev").stop(true,true).click(function (){
         sw++;
         if(sw === number.length){
           sw = 1;
           ul.css("right","0");
         }
         number.eq(sw).trigger("click");
         });
    $(".next").stop(true,true).click(function (){
        sw--;
        if(sw === -1){
          sw = 5;
          ul.css("right","7200px");
        }
        number.eq(sw).trigger("click");
        });

    //定时器的使用，自动开始
    timer = setInterval(function (){
        sw++;
        if(sw === number.length){
          sw = 0;
          ul.css("right","0");
        }
        number.eq(sw).trigger("click");
        },2000);

    //hover事件完成悬停和左右图标的动画效果
    slideBox.hover(function(){
        $(".next,.prev").animate({
            "opacity":1,
            },200);
        clearInterval(timer);
        },function(){
            $(".next,.prev").animate({
                "opacity":0.5,
            },500);
            timer = setInterval(function (){
              sw++;
            if(sw === number.length){
              sw = 0;
              ul.css("right","0");
            }
            number.eq(sw).trigger("click");
            },2000);
        });

    //生成html框架，12为随取的索引初值
    for(let i = 12; i < 21;i++){
        let item =  '<div class="art_por arp' +  i % 3 + '">\
                <div class="art-img"><a><img class="art_img"></a></div><div> <div>\
                <div class="por-head">\
            </div>\
            <div class="por-body">\
                <p></p>\
            </div>\
            </div>\
            <div>\
            <input type="button" class="hv-red" name="" value="learn more"></div></div></div>';
        $($(".por-art")[i % 3]).html($($(".por-art")[i % 3]).html() + item);
    }

    //加载内容
    for(let i = 12; i < 21;i++){

        //判断是直接用索引还是使用id来查询
        let key = "";
        let value = '';
        if( indexToID && indexToID[i]){
            key = "artworkID";
            value = indexToID[i];
        }else{
            key = "index";
            value = i + "";
        }

        //查询艺术品信息
        $.when(getInfoByKey(key, value)).done(function(msg){
            $($(".art-img a")[i - 12]).attr("href","store.html?id=" +  msg["artworkID"]);
            $($(".art_img")[i - 12]).attr("src","templates/img/art_img/" + msg["imageFileName"]);
            $($(".por-head")[i - 12]).html(msg["title"]);
            $($(".por-body")[i - 12]).html(msg["description"].substr(0,90) + "." + "...");

            //注册图片放大的事件
            $(".art_img").mouseover(function(){
                $(this).css({
                    width:150,
                    height:150
                })
            });
            $(".art_img").mouseleave(function(){
                $(this).css({
                    width:120,
                    height:120
                })
            });

        });
    }

    //所有查看按钮的点击
    $("input:button").click(function(){
        window.location.href =  $($(".art-img a")[$("input:button").index($(this))]).attr("href");
    });
});
