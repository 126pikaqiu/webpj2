let ordArtworkIDs = [];
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

    //设置足迹
    let foot = JSON.parse(getCookie("foot"));
    let temp = {};
    for(let i in foot){
        if(foot[i] === "我的购物车"){
            break;
        }
        temp[i] = foot[i];
        let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
        $("ol.crumbs").html($("ol.crumbs").html() + html)
    }
    let html = "<li>我的购物车</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    temp[Object.getOwnPropertyNames(temp).length] = "我的购物车";
    footArry["我的购物车"] = window.location.search;
    setCookie("foot",JSON.stringify(temp));

    //设置配送地址
    if(localStorage.getItem("userInfor")){
        let infor = localStorage.getItem("userInfor").split("|");
        $(".cart-store a").html(infor[3])
    }

    loadingHtml();
    updateMyCartFromDB();
    setEvent();
    setSumMoney();
});

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
function setSumMoney(type = 1){
    if(type === 1)
        ordArtworkIDs = [];
    let allMoney = 0;//金币总量
    //计算和设置总金额
    let items = $(".cart-item-list");
    let inputs = $("div.p-checkbox .jdcheckbox");
    let number = 0;
    let numberSeleted = 0;
    for(let i = 0; i < items.length; i++){
        if($(inputs[i]).is(":checked")){
            if(type === 1)
                ordArtworkIDs[ordArtworkIDs.length] = $($(".p-name>a")[i]).attr("href").split("id=")[1];
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
        updateMyDB();
    });

    $(".p-checkbox input").change(function(){
        if($(this).is(":checked")){
            $($(".item-list")[$(".p-checkbox input").index(this)]).css("backgroundColor","#fff4e8");
        }else{
            $($(".item-list")[$(".p-checkbox input").index(this)]).css("backgroundColor","#fff");
            $(".allchecked").attr("checked",false);
        }
        setSumMoney();
    });

}
function updateMyCartFromDB(){
    let mycart = JSON.parse(localStorage.getItem("mycart"));
    if(!mycart){
        return;
    }
    let index = 0;
    for(let id in mycart){
        $.when(getInfoByKey("artworkID", id)).done(function(msg){
            $($(".cart-item-list")[index]).attr("id", "work" + id);
            $($(".p-goods img")[index]).attr("src", "templates/img/art_img/" + msg["imageFileName"]);
            $($(".p-name>a")[index]).attr("href","store.html?id=" +  msg["artworkID"]).html(msg["title"]);
            $($(".p-price strong")[index++]).html("$" + msg["price"]);
        });
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
    }
    let infor = localStorage.getItem("userInfor").split("|");
    if(!parseInt($("span.sumPrice").html().replace("$","")) || !parseInt(infor[4])){
        remind("下单失败");
        return;
    }
    let money = parseInt(infor[4]);
    if(money > parseInt($("span.sumPrice").html().replace("$",""))){
        remind("下单成功。余额剩余" + (money - parseInt($(".sumPrice").html().replace("$",""))));
        let userInfor = "true|" + infor[1] + "|" +  infor[2] + "|"  + infor[3] + "|"  + (money - parseInt($(".sumPrice").html().replace("$","")));
        localStorage.setItem("userInfor",userInfor);
        setCookie("changeMyInfor",true);
        //更新账户信息
        $.ajax({
            url:"userInfor.php",
            data:{"regName": getCookie("username"),"balance":money - parseInt($(".sumPrice").html().replace("$",""))},//携带的参数
            type: "POST"
        });
        emptyMyCart();//清空选中项
        //更新订单数据库
        $.ajax({
            url:"order.php",
            data:{"artworkID": ordArtworkIDs},//携带的参数
            type: "POST",
            success(msg){
                console.log(msg);
            }
        });
        setCookie("getOrders",true);
    }else{
        remind("余额不足，请先充值。余额为" + money)
    }
});

//清空选中项
function emptyMyCart() {
    let items = $(".cart-item-list");
    let mycart = JSON.parse(localStorage.getItem("mycart"));
    let addworkID = localStorage.getItem("addworkID");
    for(let index = items.length - 1; index >= 0; index--){
        if($(".p-checkbox input")[index].checked){
            let id = $($(".p-name>a")[index]).attr("href").split("id=")[1];
            localStorage.setItem("addworkID",addworkID.replace(id + "&",""));
            delete mycart[id];
            $($(".cart-item-list")[index]).remove();
            localStorage.setItem("goodsNumber",parseInt(localStorage.getItem("goodsNumber")) - 1);
        }
    }
    setSumMoney(2);
    localStorage.setItem("mycart",JSON.stringify(mycart));
    updateMyDB();
}

//全部删除
$(".remove-batch").click(function () {
    emptyMyCart();
});


