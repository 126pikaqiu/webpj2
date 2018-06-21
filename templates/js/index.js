$(document).ready(function(){
    let foot = {0:"首页"};
    setCookie("foot",JSON.stringify(foot));

    //获得索引和id的对应表
    let indexToID = JSON.parse(localStorage.getItem("indexTOID"));

    //生成html框架
    for(let i = 0; i < 6;i++){
        let item =  '<div class="art_por arp' +  i % 2 + '">\
                <div class="art-img"><a><img class="art_img"></a></div><div> <div>\
                <div class="por-head">\
            </div>\
            <div class="por-body">\
                <p></p>\
            </div>\
            </div>\
            <div>\
            <input type="button" class="hv-yel des-lea" name="" value="learn more"></div></div></div>';
        $($(".por-art")[i % 2]).html($($(".por-art")[i % 2]).html() + item);
    }
    createSlideBox();
    createItems();

    //所有查看按钮的点击
    $("input:button").click(function(){
        window.location.href =  $($(".art-img a")[$("input:button").index($(this))]).attr("href");
    });
});


//获得最热的几件商品
function getHotWorks() {
    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"workInfor.php",
        data:{"key":"getHotWorks"},//携带的参数
        type: "GET",
        success(msg){
            defer.resolve(JSON.parse(msg));
            localStorage.setItem("hotWorks",msg);
            saveMsg();
        }
    });
    return defer.promise();
}

//本地储存
function saveMsg() {
    let msg = JSON.parse(localStorage.getItem("hotWorks"));
    for (let key in msg){
        localStorage.setItem("work" + msg[key]["artworkID"],JSON.stringify(msg[key]));
    }
}

//创建轮播
function createSlideBox() {
    $.when(getHotWorks()).done(function (msg) {
        for(let index = 0; index <= 6; index++){
            $($(".slideBox li img")[index]).attr("src",
                "templates/img/art_img/" + msg[index%6]["imageFileName"]);
            $($(".slideBox li a")[index]).attr("href","store.html?id=" + msg[index%6]["artworkID"]);
            $($(".slideBox li h2")[index]).html(msg[index%6]["title"]);
            $($(".slideBox li p")[index]).html(msg[index%6]["description"].split(".",300)[0] + '.');
        }

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
    });
}

//获得最新上传的6件商品
function getNewWorks() {
    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"workInfor.php",
        data:{"key":"getNewWorks"},//携带的参数
        type: "GET",
        success(msg){
            defer.resolve(JSON.parse(msg));
            localStorage.setItem("newWorks",msg);
            saveMsgA();
        }
    });
    return defer.promise();
}
function saveMsgA() {
    let msg = JSON.parse(localStorage.getItem("newWorks"));
    for (let key in msg){
        localStorage.setItem("work" + msg[key]["artworkID"],JSON.stringify(msg[key]));
    }
}

function createItems(){
        //查询艺术品信息
        $.when(getNewWorks()).done(function(msg){
            //加载内容
            for(let i = 0; i < 6;i++){
            $($(".art-img a")[i]).attr("href","store.html?id=" +  msg[i]["artworkID"]);
            $($(".art_img")[i]).attr("src","templates/img/art_img/" + msg[i]["imageFileName"]);
            $($(".por-head")[i]).html(msg[i]["title"]);
            $($(".por-body")[i]).html(msg[i]["description"].substr(0,90) + "." + "...");
            }
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
