

//查询商品详情信息
document.ready = function() {
    //设置足迹
    let foot = JSON.parse(getCookie("foot"));
    let temp = {};
    for(let i in foot){
        if(foot[i] === "商品详情"){
            break;
        }
        temp[i] = foot[i];
        let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
        $("ol.crumbs").html($("ol.crumbs").html() + html)
    }
    let html = "<li>商品详情</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    temp[Object.getOwnPropertyNames(temp).length] = "商品详情";
    footArry["商品详情"] = window.location.search;
    setCookie("foot",JSON.stringify(temp));

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
        $("#title").html(msg["title"]);
        $("#artist").html("By  " + msg["artist"]).attr('href',"search.html?artist=" + msg["artist"]);
        $("#description").html(msg["description"] + ".");
        $("#height").html(msg["height"]);
        $("#width").html(msg["width"]);
        $("#price").html("$" + msg["price"]);
        $("#genre").html(msg["genre"]);
        $("#view").html(parseInt(msg["view"]) + 1);
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
    updateView();
    setStatus();
};



$("#tb-artist td a").click(function(){
  window.location.href = "search.html?" + encodeURI("artist=" + this.innerHTML);
});

$("#tb-genre td a").click(function(){
    window.location.href = "search.html?" + encodeURI("genre=" + this.innerHTML);
});
$("#addToCart").click(function(){
    if($(".loading1").css("display") === "inline"){
        $(".loading1").css("display","none");
        $("#cartPng").css("display","inline");
        $("#addToCart span").html("添加到购车");
        return;
    }
  if(getCookie("login") && getCookie("login") !== "false"){
      $("#addToCart span").html("");
      $(".loading1").css("display","inline");
      $("#cartPng").css("display","none");
      if(JSON.parse(localStorage.getItem("mycart"))[getUrlParam("id")]){
          remind("商品已经在购物车中，不能重复添加！");
          $("#addToCart span").html("添加到购车");
          $(".loading1").css("display","none");
          $("#cartPng").css("display","inline");
          return;
      }
      $.when(getRoot(getUrlParam("id") || 6)).done(function (msg) {
          if(parseInt(msg) === 0){
              remind("不好意思，别人先了一<br>步，已经没货了,呜呜呜");
              $("#status").html("已售出");
              $("#addToCart span").html("添加到购车");
              $(".loading1").css("display","none");
              $("#cartPng").css("display","inline");
              return;
          }else if(parseInt(msg) === 1){
              if(!localStorage.getItem("addworkID")){
                  localStorage.setItem("addworkID","");
              }
              localStorage.setItem("addworkID", localStorage.getItem("addworkID") + getUrlParam("id") + "&");
              if(!localStorage.getItem("goodsNumber")){
                  localStorage.setItem("goodsNumber",0)
              }
              localStorage.setItem("goodsNumber",parseInt(localStorage.getItem("goodsNumber")) + 1);
              let mycart = JSON.parse(localStorage.getItem("mycart"));
              mycart[getUrlParam("id")] = 1;
              localStorage.setItem("mycart",JSON.stringify(mycart));
              remind("添加成功");
              updateMyDB();
              $("#addToCart span").html("添加到购车");
              $(".loading1").css("display","none");
              $("#cartPng").css("display","inline");
          }
      });
  }else{
       remind("请先登录");
  }
});

//购物车添加权限判断
function getRoot(artworkID){
    let defer = $.Deferred();
    $.ajax({
        url:"order.php",
        data:{"artworkID":artworkID},//携带的参数
        type: "GET",
        success(msg){
            defer.resolve(msg);
        },
    });
    return defer.promise();
}

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

function setStatus() {
    $.when(getRoot(getUrlParam("id") || "6")).done(function (msg) {
        if(msg && parseInt(msg) === 1){
            $("#status").html("有货");
        }else if(parseInt(msg) === 0){
            $("#status").html("已售出");
        }else {
            console.log(msg);
            $("#status").html("查询出错");
        }
    });
}

setInterval(function () {
    if(getCookie("check") === true){
        setCookie("check",false);
        setStatus();
    }
},1000);

function updateView() {
    $.ajax({
        url:"workInfor.php",
        type: "POST",
        data:{"artworkID":getUrlParam("id") || "6"}
    });
}
