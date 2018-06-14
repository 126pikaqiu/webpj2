
let pageNum = 1;

//换页的效果
$(".paN").click(function(){
  changeStyle(this);
  changePageTo(this.innerHTML);
  pageNum = parseInt(this.innerHTML);
});

document.ready = function () {
    console.log(getCookie("foot"));
    let temp = {};
    if(getCookie("foot")){
        //设置足迹
        let foot = JSON.parse(getCookie("foot"));
        for(let i in foot){
            if(foot[i] === "搜索"){
                break;
            }
            temp[i] = foot[i];
            let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
            $("ol.crumbs").html($("ol.crumbs").html() + html)
        }
        temp[Object.getOwnPropertyNames(temp).length] = "搜索";
    }else {
        temp["1"] = "搜索";
    }

    let html = "<li>搜索</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    setCookie("foot",JSON.stringify(temp));

    loadingHtml();
    changePageTo(1);
};


//所有查看按钮的点击
$(".lay-item .lay-bt").click(function(){
    window.open($($(".lay-item a")[$(".lay-item .lay-bt").index($(this))]).attr("href"));
});

function changePageTo(page){
    search(page);
}

//加载
function loadingHtml(){
    $($(".lay-main")[0]).html("");
    for(let i = 0; i < 9;i++){
    let item =  '<div class="lay-item">\
              <div class="lay-img">\
              <a ><img alt=""></a>\
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

//enter检测
$("#key").keydown(function (e) {
    if (e.keyCode === 13) {
        $("#search").click();
    }
});

//上下页
$(".hava-bor").click(function(){
    //上一页
  if($(this).is(".pn-prev")){
    let page = "";
    if(pageNum === 1) return;//第一页的话无效

    if(pageNum % 12 === 1)
      page = $(".paN")[11];
    else if(pageNum % 12){
      page = $(".paN")[pageNum % 12 - 2];
    }else {
      page = $(".paN")[10];
    }//确定哪页需要改变样式

    pageNum--;//页数减一
    changeStyle(page);//改变样式

      //给页脚赋新的值
    if(!(pageNum % 12)){
      $(".paN").html(function(n){
        return n + 1 +((parseInt(pageNum / 12) - 1) * 12);
      });
      $(".paN").removeClass("dis-none");
    }

    //换页
    changePageTo(pageNum);

  }else {//下一页
      let itemsNumber = parseInt(localStorage.getItem("itemsNumber"));
      let allPageNumber = itemsNumber % 9 === 0 ? itemsNumber/9 : parseInt(itemsNumber/9) + 1;
      if(pageNum===allPageNumber) //最后一页便没有了下一页
          return;

      let page = $(".paN")[(pageNum % 12)];
      changeStyle(page);

      pageNum++;
      $(".paN").removeClass("dis-none");
      changePageTo(pageNum);

      //给页脚赋新的值
      $(".paN").html(function(n){
          return n + 1 +((parseInt(pageNum / 12)) * 12);
      });


          //减少部分页脚数
      if(!(pageNum - 1) % 12 && allPageNumber - pageNum < 11){

          for(let i = allPageNumber - pageNum + 1; i < 12; i++){
              $($(".paN")[i]).addClass("dis-none");
          }
      }
  }
});


//直接跳转
$(".p-skip a").click(function(){
    let itemsNumber = parseInt(localStorage.getItem("itemsNumber"));
    let allPageNumber = itemsNumber % 9 === 0 ? itemsNumber/9 : parseInt(itemsNumber/9) + 1;
    let input = $(".input-txt");
    if(isNaN(input.val()) || input.val() < 0 || input.val() > allPageNumber)
        return;
    else{
        $(".paN").removeClass("dis-none");
        changePageTo(input.val());
        if(parseInt(input.val()) % 12)
            changeStyle($(".paN")[parseInt(input.val()) % 12 - 1]);
        else{
            changeStyle($(".paN")[11]);
        }
        pageNum = parseInt(input.val());
        $(".paN").html(function(n){
          return n + 1 +((parseInt(pageNum / 12)) * 12);
    });
    if(allPageNumber - pageNum < 11){
        for(let i = allPageNumber % 12; i < 12; i++){
            $($(".paN")[i]).addClass("dis-none");
        }
    }
  }
});

$("#search").click(function(){
    search(1);
});

//改变页数的css
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

//搜索并返回数据
function search(page){
    pageNum = parseInt(page);
    let key = $("#key").val();
    let order = $("#hot").is(":checked")?"view":"price";
    $.ajax({
        url:"search.php",
        data:{"key":checkKey(key), "order":order,"page":page},//携带的参数
        type: "GET",
    }).done(function (msg) {
        localStorage.setItem("itemsNumber",parseInt(msg.split("&")[1]));
        msg = JSON.parse(msg.split("&")[0]);
        for(let i in msg){
            localStorage.setItem("work"+msg[i]["artworkID"],JSON.stringify(msg[i]));
            $($(".lay-item")[i]).attr("class","lay-item");
            $($(".lay-item a")[i]).attr("href","store.html?id=" + msg[i]["artworkID"]);
            $($(".lay-item img")[i]).attr("src","templates/img/art_img/" + msg[i]["imageFileName"]);
            $($(".lay-title")[i]).html(msg[i]["title"]);
            $($(".author")[i]).html(msg[i]["author"]);
            $($(".hot")[i]).html(msg[i]["view"]);
            $($(".lay-des")[i]).html(msg[i]["description"].substr(0,90) + "...");
        }
        let itemsNumber = parseInt(localStorage.getItem("itemsNumber"));
        let allPageNumber = itemsNumber % 9 === 0 ? itemsNumber/9 : parseInt(itemsNumber/9) + 1;
        $(".lay-footer .p-skip em b").html(allPageNumber);
        if(allPageNumber< 12){
            for(let i = allPageNumber; i < 12; i++){
                $($(".paN")[i]).addClass("dis-none");
            }
        }
        if(key){
            $(".search-result").html("共搜索到" + localStorage.getItem("itemsNumber") + "个结果");
        }
        if(!itemsNumber){
            $(".lay-item").addClass("dis-none")
        }
        if(page * 9 - itemsNumber > 0 && page * 9 - itemsNumber<= 9){
            for(let index = itemsNumber % 9; index<9;index++){
                $($(".lay-item")[index]).addClass("dis-none");
            }
        }

    })
}

//分词生成sql语句
function checkKey(key) {
    if(!key){
        return '';
    }
    let result = {};
    result["unsure"] = '';
    key = key.toLowerCase();
    key = key.replace("少于","<").replace("为","").replace("是","").replace("=","").replace("artisit","&artisit=").replace("title","&title=").
    replace("description","&description=").replace("view","&view=").replace("price","&price=").replace("year","&year=").
    replace("价格","&price=").replace("年份","&year=").replace("多于",">").
    replace("小于","<").replace("大于",">").replace("作者",'&artisit=').replace("作品名","title=").
    replace("描述",'&description=').replace("热度",'&view=');
    let keys = key.split("&");
    for(let i in keys){
        if(keys[i].indexOf("=") === -1){
            if(/[0-9]/.test(keys[i])){
                result['price'] = keys[i].match(/\d{1,}/);//当作价格
            }
            result["unsure"] += keys[i].replace(/\d/,"");
        }else{
            let kes = keys[i].split("=");
            result[kes[0] + ""] = kes[1];
        }
    }
    let index = 0;
    let sql = "";
    for(let i in result){
        if(i === "unsure"){
            if(result[i])
                sql += " AND (artist LIKE '%" + result[i] + "%' or title LIKE '%"+ result[i] + "%' or description LIKE '%" + result[i] + "%')";
        }else if(i === "price" || i === "view" || i === "year"){
            let number = result[i].replace(/[^0-9]/ig, "");
            if((index = result[i].indexOf(">")) !== -1|| (index = result[i].indexOf("<")) !== -1){
                sql += " AND " + i + result[i].substr(index,index + 1) + number;
            }else{
                sql += " AND " + i + '=' + number;
            }
        }else{
            sql += ' OR ' + i + " LIKE '%" + result[i] + "%' ";
        }
    }
    return sql;
}