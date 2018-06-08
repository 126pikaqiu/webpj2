

//查询商品详情信息
document.ready = function() {
    $("#captionImg").css({
        height:100,
        width:100,
        margin: "45% 40% 40% 40%"
    });
    let id = '';
    $("#captionImg").show();
    if(!getUrlParam("id")){
        id = "6";
    }else {
        id = getUrlParam("id");
    }
    $.when(getInfoByKey("artworkID",id)).done(function(msg){
        $('#captionImg').hide();
        // console.log(msg);
        $("#title").html(msg["title"]);
        $("#artist").html("By  " + msg["artist"]);
        $("#description").html(msg["description"].substr(0,500) + ".");
        $("#height").html(msg["height"]);
        $("#width").html(msg["width"]);
        $("#price").html("$" + msg["price"]);
        $("#genre").html(msg["genre"]);
        $("#yearOfWork").html(msg["yearOfWork"]);
        $("#captionImg").attr("src", "templates/img/art_img/" + msg["imageFileName"]);
        $("#big img").attr("src", "templates/img/art_img/" + msg["imageFileName"]);
        $("#captionImg").css({
            width:"100%",
            height:"100%",
            margin: 0
        });
        $("#captionImg").show();
    });
};



$("aside td a").click(function(){
  window.location.href = "search.html?" + encodeURI("artist=" + this.innerHTML);
});

$("#addToCart").click(function(){
  if(getCookie("login") !== "false"){
    $("#dialog h2").html("添加成功");
    if(!localStorage.getItem("addworkID")){
        localStorage.setItem("addworkID","");
    }
    localStorage.setItem("addworkID", localStorage.getItem("addworkID") + getUrlParam("id") + "&");
    if(!localStorage.getItem("goodsNumber")){
        localStorage.setItem("goodsNumber","0")
    }
    localStorage.setItem("goodsNumber",parseInt(localStorage.getItem("goodsNumber")) + 1);
    let mycart = {};
    if(localStorage.getItem("mycart"))
        mycart = JSON.parse(localStorage.getItem("mycart"));
    if(mycart[getUrlParam("id")]){
        mycart[getUrlParam("id")] = 1 + parseInt(mycart[getUrlParam("id")]);
    }else{
        mycart[getUrlParam("id")] = 1;
    }
    localStorage.setItem("mycart",JSON.stringify(mycart));
  }else{
       remind("请先登录");
  }
});

$('#normal').mouseover(function(){
        var th = this;
        //鼠标移入"显示"方块
        $('#show').show();
        $(this).mousemove(function(ev){

            // 鼠标移动方块随着移动
            $('#show').css({

                'top':ev.pageY - $('#show').height()/2,
                'left':ev.pageX - $('#show').width()/2,

            });

            //防止方块移出图片内容
            if($('#show').offset().top <= $(th).offset().top){

                $('#show').css('top',$(th).offset().top);

            }
            if($('#show').offset().left <= $(th).offset().left){

                $('#show').css('left',$(th).offset().left);

            }
            if($('#show').offset().top >= $(th).offset().top + $(th).height() - $("#show").height()){

                $('#show').css('top' ,$(th).offset().top + $(th).height() - $("#show").height());

            }
            if($('#show').offset().left >= $(th).offset().left + $(th).width() - $("#show").width()){

                $('#show').css('left', $(th).offset().left + $(th).width() - $("#show").width());

            }

            $('#big').show();

            //在大容器显示放大图片
            $('#big img').css({

                'left':-2*($('#show').offset().left - $(th).offset().left),
                'top':-2*($('#show').offset().top - $(th).offset().top)

            });

        });


    });

//鼠标移出图片让方块"消失"
$('#normal').mouseout(function(){

    $('#show').hide();
    $("#big").hide();

});
