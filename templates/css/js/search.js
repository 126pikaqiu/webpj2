// setInterval(function(){
//   if(localStorage.surfKey)
//     $(".surf-header input").attr("placeholder",localStorage.surfKey);
// },100);
//当前页面

let surfKey = '';
//获得索引与id的对应表
function getIndexToID(){
    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"workInfor.php",
        data:{"key":"id"},//携带的参数
        type: "GET",
        success(msg){
            defer.resolve(msg.split(" "));
        },
    });
    return defer.promise();
}

let pageNum = 1;
$(".paN").click(function(){
  changeStyle(this);
  changePageTo(this.innerHTML);
  pageNum = parseInt(this.innerHTML);
});
let indexToID = [];
document.ready = function(){
      if(!localStorage.getItem("indexTOID")){
          $.when(getIndexToID()).done(function (data) {
              indexToID = data;
              localStorage.setItem('indexTOID',JSON.stringify(data))
          });
      }else{
          indexToID = JSON.parse(localStorage.getItem("indexTOID"));
      }
      if($($(".lay-main")[0]).html()){
          localStorage.setItem("mode","normal");
          loadingHtml();
          changePage(0);
      }
      if($("#key").val()){
          $("#search").click();
      }

    //所有查看按钮的点击
    $(".lay-item .lay-bt").click(function(){
        window.open($($(".lay-item a")[$(".lay-item .lay-bt").index($(this))]).attr("href"));
    });
};

function changePage(page){
    for(let i = page; i < 12 + page;i++){
        let key = "";
        let value = '';
        if(localStorage.getItem("mode") === "normal"){
            if(indexToID[i]){
                key = "artworkID";
                value = indexToID[i];
            }else{
                key = "index";
                value = i + "";
            }
        }else{
            key = "search";
            value = surfKey;
        }
        $.when(getInfoByKey(key, value, i)).done(function(msg){
            $($(".lay-item a")[i - page]).attr("href","store.html?id=" + msg["artworkID"]);
            $($(".lay-item img")[i - page]).attr("src","templates/img/art_img/" + msg["imageFileName"]);
            $($(".lay-title")[i  - page]).html(msg["title"]);
            $($(".author")[i  - page]).html(msg["author"]);
            $($(".hot")[i  - page]).html(msg["view"]);
            $($(".lay-des")[i  - page]).html(msg["description"].substr(0,90) + "...");
        });
    }
}

function loadingHtml(){
    $($(".lay-main")[0]).html("");
    for(let i = 0; i < 12;i++){
    let item =  '<div class="lay-item">\
              <div class="lay-img">\
              <a href="item.html?' + '"><img alt=""></a>\
              </div>\
              <span class="lay-title">' +  '</span><p class="author">' +  '</p>\
              <p class="lay-des">' +  '</p>\
          <div>\
          <button class="lay-bt">查看</button>\
              <button class="lay-bt">热度<span  class="hot">' + '</span></button>\
          </div>\
          </div>';
    $($(".lay-main")[0]).html($($(".lay-main")[0]).html() + item);
    }
}

$("#key").keydown(function (e) {
    if (e.keyCode === 13) {
        if(!$(this).val())
            $("#search").click();
    }
});

$(".hava-bor").click(function(){
  if($(this).is(".pn-prev")){
    let page = "";
    if(pageNum===1) return;
    if(pageNum % 12 === 1)
      page = $(".paN")[11];
    else if(pageNum % 12){
      page = $(".paN")[pageNum % 12 - 2];
    }else {
      page = $(".paN")[10];
    }
    pageNum--;
    changeStyle(page);
    if(!(pageNum % 12)){
      $(".paN").html(function(n){
        return n + 1 +((parseInt(pageNum / 12) - 1) * 12);
      });
    }
    changePageTo(pageNum);
  }else {
    if(pageNum===100) return;
    let page = $(".paN")[(pageNum % 12)];
    changeStyle(page);
    pageNum++;
    changePageTo(pageNum);
    if(!(pageNum % 12 - 1))
      $(".paN").html(function(n){
        return n + 1 +((parseInt(pageNum / 12)) * 12);
      });
  }
});
$(".p-skip a").click(function(){
  let input = $(".input-txt");
  if(isNaN(input.val()) || input.val() < 0 || input.val() > 100) return;
  else{
    changePageTo(input.val());
    changeStyle($(".paN")[parseInt(input.val()) % 12 - 1]);
    pageNum = parseInt(input.val());
    $(".paN").html(function(n){
      return n + 1 +((parseInt(pageNum / 12)) * 12);
    });
  }
});
$("#search").click(function(){
    if(!$("#key").val()){
        return;
    }
    loadingHtml();
    localStorage.setItem("mode","search");
    surfKey = $("#key").val();
    changePageTo(0);
});
$(".keywords").mouseover(function(i,li){
  li = this;
  $(".lay-img img").attr("src", function(){
    let temp1 = this.src.split("images")[0];
    let temp2 = this.src.split("square-medium")[1];
    return temp1 + "images/" + $(li).attr("name") + "/square-medium" + temp2;
  });
  changePageTo(1);
  changeStyle($(".paN")[0]);
});
function changePageTo(n){
  pageNum = n;
  changePage(n * 12);
}
function changeStyle(page){
  let lastPage = $(".curr");
  lastPage.removeClass("curr");
  lastPage.css({
    color:"#333",
    border:"1px solid #ddd",
    backgroundColor:"#f7f7f7",
    padding:"8px 15px",
  });
  page = $(page);
  page.addClass("curr");
  page.css({
    color:"#e4393c",
    border:"none",
    backgroundColor:"transparent",
    padding:"1px 15px",
  });

}
