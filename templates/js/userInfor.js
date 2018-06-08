
setInterval(function(){
  if(getCookie("login") === 'false'){
      window.location.href = "index.html";
      $("#account").html("");
  }
  if(!$("#account").html() || getCookie("changeMyInfor")){
      $("#account").html(getCookie("username"));
      let infor = localStorage.getItem("userInfor").split("|");
      $("#phone").html(infor[1]);
      $("#email").html(infor[2]);
      $("#address").html(infor[3]);
      $("#money").html(infor[4]);
      setCookie("changeMyInfor",false);
      console.log(getCookie("changeMyInfor"));
  }
},100);
$("#recharge").click(function(){
  $("#dialog1").dialog({
    height: 300,
    width: 300,
  })
});
$("#dialog1 button").click(function(){
  $("#dialog2 h2").html("充值失败");
  if(parseInt($("#dialog1 input").val())){
    $("#dialog2 h2").html("充值成功");
    localStorage.money = parseInt(localStorage.money) + parseInt($("#dialog1 input").val());
  }
  $("#dialog1").dialog("close");
  $("#dialog2").dialog({
    height:300,
    width:300,
    show: {
    effect: "blind",
    duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 1000
    }
  });
});
$("#dialog2 button").click(function(){
  $("#dialog2").dialog("close");
});
