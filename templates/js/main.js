
let footArry = {"首页":"index.html","我的购物车":"cart.html","搜索":"search.html",
    "商品详情":"store.html","个人信息":"userInfor.html","关于艺家":"artStore.html"};
document.ready = function(){
    if(!localStorage.getItem("goodsNumber")){
        localStorage.setItem("goodsNumber","0");
    }
};
//改变导航栏的项目
setInterval(function(){
    if(getCookie("login") === "true"){
      $(".signin").css({
        display:"inline"
      });
      if(!$(".account")[0].innerHTML || getCookie("changeMyInfor")){
          $(".account")[0].innerHTML = getCookie("username");
          setCookie("changeMyInfor",false);
      }
      $($(".dt")[0]).css({
        display:"none"
      });

      if(!localStorage.getItem("goodsNumber")){
          $("#gooNumber").html("0");
      }else{
          $("#gooNumber").html(localStorage.getItem("goodsNumber"));
      }

    }else {
      $(".signin").css({
        display:"none"
      });
      $(".account")[0].innerHTML = "";
      $($(".dt")[0]).css({
        display:"inline"
      });
      $("#gooNumber").html("0");
    }

    if(parseInt($("#gooNumber").html()) === 0){
      $(".noEmpty").css("display","none");
      $(".empty").css("display","block");
    }else{
      $(".empty").css("display","none");
      $(".noEmpty").css("display","block");
    }
},100);

//注册登出事件
$(".signout").click(function(){
  setCookie("login","false");
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  if(path === "store.html" || path === "userInfor.html")
    window.location.href = "index.html";
});

//购物车点击事件
$("a.cart").click(function(){
  if(getCookie("login") === "true"){
      window.open("cart.html");
  }
  else{
    remind("请先登录");
  }
});

//关闭对话框
$("#dialog button").click(function(){
  $("#dialog").dialog("close");
  let url = window.location.href.split('/');
  if($("#type").val() === "page"){
      window.location.href = "index.html";
  }else if($("#type").val() === "upload"){
      window.location.href = "userInfor.html";
  }
});


//弹窗登录
$(".sign").click(function(){
  $("#dialog-register").css("display","none");
  $("#dialog-signin").css("display","block");
  modal_dialog("登录")
});
//弹窗登录
$(".re-signin").click(function(){
  $("#dialog-register").css("display","none");
  $("#dialog-signin").css("display","block");
  modal_dialog("登录")
});

//弹窗注册
$(".register").click(function(){
  $("#dialog-signin").css("display","none");
  $("#dialog-register").css("display","block");
  modal_dialog("注册");
});

$("#searchTrigger").keydown(function (e) {
    if (e.keyCode === 13) {
        window.location.href = "search.html?searchkey=" + encodeURI($(this).val());
    }
});
$(".searchTrigger").click(function () {
    window.location.href = "search.html?searchkey=" + encodeURI($("#searchTrigger").val());
});
