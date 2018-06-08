<?php
session_start();
include_once "class/upload.class.php";
if($_SERVER["REQUEST_METHOD"] == 'GET'){
    if(isset($_GET["id"])){
        $message = getInformation($_GET["id"]);//安全性不够
    }
    else{
        header("Location:index.html");
        exit();
    }
}else if($_SERVER["REQUEST_METHOD"] == 'POST'){
    $upload = new upLoad();
    $upfile = $upload->uploadFile('upfile','1');
    if($upfile["filestat"] == "false"){
        header("Location:revise.php?status=error");
    }else{
//                updateDB($upfile['filename']);//功能没问题，避免污染数据库
        header("Location:revise.php?status=success");
    }
}

//更新数据库信息
function updateDB($imageFileName){
    //连接到数据库
    try{
        $db = new PDO('mysql:host=localhost;dbname=artworks','root',"");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $db->prepare('UPDATE `artworks` SET `artist`=?, `imageFileName`=?, `title`=?,`description`=?, `yearOfWork`=?, `genre`=?, `width`=?,`height`=?,`price`=? WHERE artworkID='. $_POST["id"]);
        $stmt->execute(array($_POST["artist"],$imageFileName,$_POST["title"],$_POST["description"],$_POST["yearOfWork"],$_POST["genre"],$_POST["width"],$_POST["height"],$_POST["price"]));
    }catch (PDOException $e){
        print "Couldn't connect to the database;" . $e->getMessage();
        exit();
    }

}
//更新数据库信息
function getInformation($id){
    //连接到数据库
    try{
        $db = new PDO('mysql:host=localhost;dbname=artworks','root',"");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $p = $db->query('SELECT `artist`, `imageFileName`, `title`, `description`, `yearOfWork`, `genre`, `width`, 
`height`, `price`  FROM `artworks` WHERE artworkID='.$id);
        return $p->fetchAll()[0];
    }catch (PDOException $e){
        print "Couldn't connect to the database;" . $e->getMessage();
        exit();
    }

}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <title>艺家 修改艺术品信息</title>
    <link rel="icon" href="templates/img/web_img/favicon.ico"/>
    <link rel="stylesheet" href="templates/css/main.css">
    <link rel="stylesheet" href="templates/css/upload.css">
    <script src="templates/js/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <script src="https://cdn.bootcss.com/holder/2.9.4/holder.min.js"></script>
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
</head>
<body>
<!--<div class="smc">-->
<!--<div>-->
<!--<div class="noEmpty">-->
<!--<header>最新加入的商品</header>-->
<!--<ul class="mcart-sigle">-->
<!--<li>-->
<!--<div class="img"><img src="templates/img/art_img/6.jpg" alt=""></div>-->
<!--<div class="infor">-->
<!--<h5 class="name">Irises</h5>-->
<!--<h5 class="author">By 梵高</h5>-->
<!--<h6 class="money">$21,000</h6>-->
<!--</div>-->
<!--</li>-->
<!--<li>-->
<!--<div class="img"><img src="templates/img/art_img/7.jpg" alt=""></div>-->
<!--<div class="infor">-->
<!--<h5 class="name">The Falling Fireworks</h5>-->
<!--<h5 class="author">By 惠斯勒</h5>-->
<!--<h6 class="money">$12,000</h6>-->
<!--</div>-->
<!--</li>-->
<!--</ul>-->
<!--</div>-->
<!--<div class="empty">-->
<!--<div><img src="templates/img/web_img/rcart.png" alt="cart"></div>-->
<!--<br>-->
<!--<div><h5>购物车空空如也</h5></div>-->
<!--</div>-->
<!--</div>-->
<!--</div>-->
<div id="dialog" title="提示">
    <h2></h2>
    <button type="button" name="button">确认</button>
</div>
<nav id="head-nav">
    <div class="w">
        <ul class="fr">
            <li class="dt"><a href="index.html">艺家高兴为您服务</a></li>
            <li class="dt signin">
                <a class="link-login dt-link">Hi <a href="userInfor.html" target="_blank" title="点击查看各人信息"><span class="account hv-red"></span><img src="templates/img/web_img/account.png" class="account-img"></a></a>&nbsp;&nbsp;
                <a class="signout hv-red" href="javascript:;">退出登录</a>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link hv-red"><a class="hv-red" href="index.php">首页</a></div>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link"><img src="templates/img/web_img/cart.png" alt="cart"><a class="hv-red  cart" href="javascript:;">购物车<strong id="gooNumber">0</strong>件</a>
                    <i class=""></i></div>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link hv-red"><a class="hv-red" href="store.php">商品详情</a></i></div>
                <div class=""></div>
            </li>
        </ul>
    </div>
</nav>
<div class="main">
    <div class="txt-head">
        <div class="logo-con">
            <img src="templates/img/web_img/logo.jpg" class="log-img" alt="艺术品之家logo" title="艺术品之家">
            <span class="title-uk">Art Store</span>
            <span class="log-tit">艺家</span>
        </div>
        <div class="surf-header">
            <input type="text" name="" value="" id="searchTrigger">
            <label><a href="javascript:;" class="searchTrigger">搜 索</a></label>
        </div>
    </div>
    <!--<section id="secOne">-->
    <!--<div id="crumbs">-->
    <!--<strong>您的位置</strong>-->
    <!--<ol class="crumbs">-->
    <!--<li><a href="">首页</a></li>>-->
    <!--<li class="current">上传艺术品</li>-->
    <!--</ol>-->
    <!--</div>-->
    <!--</section>-->
    <div class="artupload-img" >
        <img src="templates/img/art_img/<?= $message["imageFileName"]?>" alt="" id="cropedBigImg" title="支持jpg,jpeg,png格式"><br>
        <div class="btn-area">
            <button id="addImage">添加图片</button>
        </div>
    </div>
    <p></p>
    <div  id="header"><label>修改我的艺术品信息</label><br></div>
    <form action="<?=$_SERVER['PHP_SELF']?>" method="post" enctype="multipart/form-data">
        <input type="file" name="upfile" id="chooseImage" value="<?php
        if(isset($_GET["id"])){
            echo 'templates/img/art_images/' . $message["imageFileName"];
        }else{
            echo '';
        }
        ?>">
        <input type="text" id="type" value="<?php
        if(isset($_FILES['upfile'])){
            echo 'none';
        }else if(isset($_GET["id"])){
            echo 'change';
        }else{
            echo 'upload';
        }
        ?>">
        <div class="item"><label>名称</label><input type="text" name="title" id="title" value="<?= $message["title"]?>"></div>
        <p></p>
        <div class="item"><label>作者</label><input type="text" name="artist" id="author" value="<?= $message["artist"]?>"></div>
        <p></p>
        <div class="item"><label>年份</label><input type="number" name="yearOfWork" id="yearOfWork" value="<?= $message["yearOfWork"]?>"></div>
        <p></p>
        <div class="item"><label>流派</label><input type="text" name="genre" id="genre" value="<?= $message["genre"]?>"></div>
        <p></p>
        <div class="item"><label>尺寸</label><input type="number" name="height" id="height" placeholder="高" value="<?= $message["height"]?>"> ✖ <input type="number" name="width" id="width" placeholder="宽"></div>
        <p></p>
        <div class="item"><label>价格</label><input type="number" name="price" id="price" placeholder="$" value="<?= $message["price"]?>"></div>
        <p></p>
        <textarea name="description" placeholder="简介" id="description"><?= $message["description"]?></textarea><br>
        <p></p>
        <button id="cancel">取消</button><button id="submit">提交</button>
    </form>
</div>
<div class="footer">
    <div class="footer-main">
        <footer>
            <div class="foo-links">
                <a rel="nofollow" target="_blank" href="artStore.php#aboutUs">
                    关于我们
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.php#contactUs">
                    联系我们
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.php#recruit">
                    人才招聘
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.php#business">
                    商家入驻
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.php#advertisement">
                    广告服务
                </a> |
                <a target="_blank" target="_blank" href="artStore.php#links">
                    友情链接
                </a> |
                <a target="_blank" target="_blank" href="artStore.php#union">
                    销售联盟
                </a>
            </div>
            <div class="copyright">
                Copyright&nbsp;&copy;&nbsp;2018-2030&nbsp;&nbsp;艺术品之家Art Store.com&nbsp;版权所有
            </div>
        </footer>
    </div>
</div>
<script src="templates/js/global.js"></script>
<script src="templates/js/upload.js"></script>
<script src="templates/js/main.js"></script>
</body>
</html>