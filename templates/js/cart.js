
setInterval(function(){
  if(getCookie("login") !== "true")
    window.location.href = "index.html";

  //计算和设置总金额
  let items = $(".cart-item-list");
  let number = 0;

  for(let i = 0; i < items.length; i++){
    number++;
  }

  if(parseInt(localStorage.getItem("goodsNumber")) !== 0 && localStorage.getItem("addworkID") && number !== localStorage.getItem("addworkID").split("&").length - 1){
      let itemIDs = localStorage.getItem("addworkID").split("&");
      for(let i = number; i < itemIDs.length - 1; i++){
          addItem(itemIDs[i]);
          i++;
      }
  }

  $(".cart-filter-bar .number").html(localStorage.getItem("goodsNumber"));//设置总的商品数量

  //界面切换
  if(parseInt(localStorage.getItem("goodsNumber")) === 0){
      $("div.mycart").css("display", "none");
      $("div.lay-footer").css("display", "none");
      $("#empty").css("display", "block");
  }else{
      $("div.mycart").css("display", "block");
      $("div.lay-footer").css("display", "none");
      $("#empty").css("display", "none");
  }

},100);

$(document).ready(function () {
    console.log(localStorage.getItem("userInfor"));
    //设置配送地址
    if(localStorage.getItem("userInfor")){
        let infor = localStorage.getItem("userInfor").split("|");
        $(".cart-store a").html(infor[3])
    }

    loadingHtml();
    let date = new Date();
    if(date.getDay() === 0){ //每周末更新本地购物车记录
        $.when(getMyCartInfo()).done(function(){
            updateMyCartFromDB();
        });
    }else if(date.getDay() === 4){
        // updateMyDB()
    }
    updateMyCartFromDB();
    setEvent();
    setSumMoney();
});
// function updateMyDB(){
//     if(!localStorage.getItem("mycart")){
//         return;
//     }
//     $.ajax({
//         url:"handleCart.php",
//         data:{"value":localStorage.getItem("mycart")},//携带的参数
//         type: "POST",
//         success(msg){
//             console.log("update my DB successfully");
//         }
//     });
// }

function loadingHtml(){
    //重新加载购物车页面，内容清空
    $("#cart-list").html("");

    //如果购物车内没有内容，返回
    if(!localStorage.getItem("mycart")){
        return;
    }
    let mycart;
    //购物车对象中储存了商品ID
    try{
        mycart = JSON.parse(localStorage.getItem("mycart"));
    }catch (e) {
       return false;
    }

    for(let i in mycart){
        let html = ' <div class="cart-item-list">\
            <div class="cart-tbody">\
            <div class="shop"></div>\
            <div class="item-list" style="z-index: auto;">\
            <div class="item-form">\
            <div class="cell p-checkbox">\
            <input type="checkbox" name="checkItem" checked="checked" class="jdcheckbox">\
            </div>\
            <div class="cell p-goods">\
            <img alt="">\
            <div class="p-name">\
            <a target="_blank">\
        </a>\
        <p><a class="ftx-08">支持7天无理由退货</a></p>\
        </div>\
        </div>\
        <div class="cell p-price">\
            <strong></strong>\
        </div>\
        <div class="cell p-quantity">\
        </div>\
        <div class="cell p-ops">\
            <a class="cart-remove" href="javascript:;">删除</a><br>\
            <a href="javascript:void(0);" class="add-follow">加到我的关注</a>\
            </div></div></div></div></div>';
        $("#cart-list").html($("#cart-list").html() + html);
    }
}

//添加商品
function addItem(id){
    //购物车对象
    let mycart = JSON.parse(localStorage.getItem("mycart"));
    let html = ' <div class="cart-item-list">\
        <div class="cart-tbody">\
        <div class="shop"></div>\
        <div class="item-list" style="z-index: auto;">\
        <div class="item-form">\
        <div class="cell p-checkbox">\
        <input type="checkbox" checked="checked" class="jdcheckbox">\
        </div>\
        <div class="cell p-goods">\
        <img alt="">\
        <div class="p-name">\
        <a target="_blank">\
    </a>\
    <p><a class="ftx-08">支持7天无理由退货</a></p>\
    </div>\
    </div>\
    <div class="cell p-price">\
        <strong></strong>\
    </div>\
    <div class="cell p-quantity">\
    </div>\
    <div class="cell p-ops">\
        <a class="cart-remove" href="javascript:;">删除</a><br>\
        <a href="javascript:;" class="add-follow">加到我的关注</a>\
        </div></div></div></div></div>';
    $("#cart-list").html($("#cart-list").html() + html);
    let index = Object.getOwnPropertyNames(mycart).length;
    $.when(getInfoByKey("artworkID", id)).done(function(msg) {
        $($(".cart-item-list")[index - 1]).attr("id", "work" + msg["id"]);
        $($(".p-goods img")[index - 1]).attr("src", "templates/img/art_img/" + msg["imageFileName"]);
        $($(".p-name>a")[index - 1]).attr("href", "store.html?id=" + msg["artworkID"]).html(msg["title"]);
        $($(".p-price strong")[index - 1]).html("$" + msg["price"]);
        setSumMoney();
        setEvent();
    });
}
function setSumMoney(){

    let allMoney = 0;//金币总量
    //计算和设置总金额
    let items = $(".cart-item-list");
    let inputs = $("div.p-checkbox .jdcheckbox");
    let number = 0;
    let numberSeleted = 0;
    for(let i = 0; i < items.length; i++){
        if($(inputs[i]).is(":checked")){
            allMoney += parseInt($(".p-price strong")[i].innerHTML.replace("$", ""));
            numberSeleted ++;
        }
        number ++;
    }
    localStorage.setItem("goodsNumber",number);
    $('.amount-sum span').html(numberSeleted);
    $(".sumPrice").html("$" + allMoney);
}
function setEvent() {
    $(".p-ops .cart-remove").click(function(){
        let index = $(".p-ops .cart-remove").index($(this));
        let mycart = JSON.parse(localStorage.getItem("mycart"));
        let id = $($(".p-name>a")[index]).attr("href").split("id=")[1];
        let addworkID = localStorage.getItem("addworkID");
        localStorage.setItem("addworkID",addworkID.replace(id + "&",""));
        delete mycart[id];
        localStorage.setItem("mycart",JSON.stringify(mycart));
        $($(".cart-item-list")[index]).remove();
        localStorage.setItem("goodsNumber",parseInt(localStorage.getItem("goodsNumber")) - 1);
        setSumMoney();
    });

    $(".p-checkbox input").change(function(){
        if($(this).is(":checked")){
            $($(".item-list")[$(".p-checkbox input").index(this)]).css("backgroundColor","#fff4e8");
        }else{
            $($(".item-list")[$(".p-checkbox input").index(this)]).css("backgroundColor","#fff");
        }
        setSumMoney();
    });

}
function updateMyCartFromDB(){
    let mycart = JSON.parse(localStorage.getItem("mycart"));
    if(!mycart){
        return;
    }
    console.log("update");
    let index = 0;
    for(let id in mycart){
        $.when(getInfoByKey("artworkID", id)).done(function(msg){
            $($(".cart-item-list")[index]).attr("id", "work" + id);
            $($(".p-goods img")[index]).attr("src", "templates/img/art_img/" + msg["imageFileName"]);
            $($(".p-name>a")[index]).attr("href","store.html?id=" +  msg["artworkID"]).html(msg["title"]);
            $($(".p-price strong")[index++]).html("$" + msg["price"]);
        });
}
function getMyCartInfo(){
    let defer = $.Deferred();
    $.ajax({
        url:"handleCart.php",
        type: "GET",
        success(msg){
            msg = JSON.parse(msg);
            localStorage.setItem("mycart", JSON.stringify(msg));
            defer.resolve(msg);
        },
    });
    return defer.promise();
}
}
$(".allchecked").change(function(){
    if(this.checked){
        let checkboxes = document.getElementsByClassName("jdcheckbox");
        for(let i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = true;
        }
        $(".item-list").css("backgroundColor","#fff4e8");
    }else{
        let checkboxes = document.getElementsByClassName("jdcheckbox");
        for(let i = 0; i < checkboxes.length; i++){
            checkboxes[i].checked = false;
        }
        $(".item-list").css("backgroundColor","#fff");
    }
    setSumMoney();
});
$(".btn-area a").click(function(){
    if(parseInt($("span.sumPrice").html().replace("$","")) === 0){
        remind("亲，您还没选中商品!");
        return;
    };
    let infor = localStorage.getItem("userInfor").split("|");
    if(!parseInt($("span.sumPrice").html().replace("$","")) || !parseInt(infor[4])){
        remind("下单失败");
        return;
    }
    let money = parseInt(infor[4]);
    console.log($("span.sumPrice").html());
    if(money > parseInt($("span.sumPrice").html().replace("$",""))){
        remind("下单成功。余额剩余" + money);
        setCookie("changeMyInfor",true);
        let userInfor = "true|" + infor[1] + "|" +  infor[2] + "|"  + infor[3] + "|"  + (money - parseInt($(".sumPrice").html().replace("$","")));
        localStorage.setItem("userInfor",userInfor);

        //更新账户信息
        $.ajax({
            url:"userInfor.php",
            data:{"regName": getCookie("username"),"balance":money - parseInt($(".sumPrice").html().replace("$",""))},//携带的参数
            type: "POST",
            success(msg){
                console.log(msg);
                let infor = msg.split("|");
                console.log(infor[0]);
                if(infor[0] === "true"){
                    localStorage.setItem("userInfor",msg);
                    console.log(1);
                }else{
                    localStorage.setItem("userInfor","");
                }
            }
        });
    }else{
        remind("余额不足，请先充值。余额为" + money)
    }
});
// $(".buy-bt button").click(function(){
//   $("#dialog h2").html("支付成功");
//   $("#dialog").dialog({
//     height: 300,
//     width: 300,
//     show: {
//     effect: "blind",
//     duration: 1000
//   },
//   hide:{
//     effect: "explode",
//     duration: 1000
//   }
//   });
// });
//
// $("#dialog button").click(function(){
//   $("#dialog").dialog("close");
// });
