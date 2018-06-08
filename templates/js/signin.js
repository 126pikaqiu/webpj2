let code;//定义验证码
let account;
let pwd;

//随机生成验证码
function getcode(n){
  let all = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  code="";
  for(let i = 0; i < n; i++){
    code+=all.charAt(Math.floor(Math.random() * 52));
  }
  return code;
}

//更换验证码
function changecode(){
  document.getElementById("scode").innerHTML = getcode(4);
}

window.onload = changecode;//刷新页面时获得验证码


//注册表单提交函数
$(".btn-signin").click(function(){
      $(".sform .tip").html("");//清除提示信息
      let tips = $(".sform .tip");
      //验证用户名
      account = $(".sform-account")[0];
      if(!account.value){
        tips[0].innerHTML = "用户名不能为空";
        account.focus();
        return false;//不提交表单
      }

      //验证密码
      pwd = $(".sform-pwd")[0];
      if(!pwd.value){
        tips[1].innerHTML = "密码不能为空";
        pwd.focus();
        return false;//不提交表单
      }

      //验证验证码
      let form_code = $(".sform-code")[0];
      if(!form_code.value || form_code.value !== code){
        tips[2].innerHTML = "验证码为空或错误";
        form_code.focus();
        return false;//不提交表单
      }
      $.ajax({
          url:"login.php",//后台查询验证的方法
          data:{"regName": account.value, "pwd": pwd.value},//携带的参数
          type: "post",
          success: function(msg){
              //根据后台返回前台的msg给提示信息加HTML
              let results = msg.split("?");
              if(results[0] === "true"){
                remind("登录成功");
                  setCookie("username",account.value);
                  setCookie("login", "true");
                  console.log(getCookie("login") + getCookie("username"));
              }else{
                  tips[0].innerHTML = results[1];
                  tips[1].innerHTML = results[2];
              }
          }
      });
      return false;
});

$(".dialog button").click(function(){
    $('form.sform').reset();
  $(".dialog").dialog("close");
  window.location.href = "index.html";
});

function signTip(e){
  e.placeholder = "";
  $(".sform .i-status").html("");//清除提示信息
  tip = e.getAttribute("default");
  switch (e.name) {
    case "regName":
        status[0].innerHTML = tip;break;
    case "pwd":
        status[1].innerHTML = tip;break;
    case "pwdRepeat":
        status[2].innerHTML = tip;break;
    case "mobileCode":
        status[3].innerHTML = tip;
  }
}
