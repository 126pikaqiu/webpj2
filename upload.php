<?php
    session_start();
    include_once "class/upload.class.php";
    include_once "global.php";
    if($_SERVER["REQUEST_METHOD"] == 'POST'){
        if(isset($_FILES['upfile'])){
            $upload = new upLoad();
            $upfile = $upload->uploadFile('upfile');
            if($upfile["filestat"] == "false"){
                header("Location:upload.php?status=error");
            }else{
                updateDB($upfile['filename'],$db);//功能没问题，避免污染数据库
                header("Location:upload.php?status=success&id=" .$upfile['filename']);
            }
            exit();
        }
    }

    //更新数据库信息
    function updateDB($imageFileName,$db){
        //连接到数据库
        try{
            $stmt = $db->prepare('INSERT INTO `artworks` (`artworkID`,`artist`, `imageFileName`, `title`, `description`, `yearOfWork`, `genre`, `width`, `height`, `price`,`ownerID`) VALUES
                            (?,?,?,?,?,?,?,?,?,?,?)');
            $stmt->execute(array(explode(".",$imageFileName)[0],$_POST["artist"],$imageFileName,$_POST["title"],$_POST["description"],$_POST["yearOfWork"],$_POST["genre"],$_POST["width"],$_POST["height"],$_POST["price"],$_SESSION["myID"]));
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
    <title>艺家 上传我的艺术品</title>
    <link rel="icon" href="templates/img/web_img/favicon.ico"/>
    <link rel="stylesheet" href="templates/css/upload.css">
    <script src="templates/js/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0-beta/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
</head>
<body>
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
            <a href="javascript:;" class="searchTrigger">搜 索</a>
        </div>
    </div>
    <section id="secOne">
    <div id="crumbs">
    <strong>您的位置</strong>
    <ol class="crumbs">
    </ol>
    </div>
    </section>
<section class="container set2">
    <form class="row" action="<?=$_SERVER['PHP_SELF']?>" method="post" enctype="multipart/form-data">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="w-100">
                                <h2>发布艺术品</h2>
                                <br>
                                <div class="form-group row">
                                    <div class="col-md-6">
                                        <h5>名称</h5>
                                        <input class="w-100 form-control" type="text" name="title" id="title"><br>
                                        <h5>作者</h5>
                                        <input class="w-100 form-control" type="text" name="artist" id="author" value=""><br>
                                        <h5>年份</h5>
                                        <input class="w-100 form-control" type="text" name="yearOfWork" id="yearOfWork" value=""><br>
                                        <h5>流派</h5>
                                        <input class="w-100 form-control" type="text" name="genre" id="genre" value="">
                                    </div>
                                    <div class="col-md-6">
                                        <div class="artupload-img" >
                                            <img src="templates/img/web_img/holder.png" alt=""  class="img-responsive w-100" id="cropedBigImg" title="支持jpg,jpeg,png格式"><br>
                                            <div class="btn-area">
                                                <button id="addImage" class="btn btn-success rounded-0">添加图片</button>
                                                <input type="file" name="upfile" id="chooseImage">
                                                <input type="text" id="type" value="<?php
                                                if(isset($_FILES['upfile'])){
                                                    echo 'none';
                                                }else{
                                                    echo 'upload';
                                                }
                                                ?>" hidden>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <h5>简介</h5>
                                    <textarea class="w-100 form-control " name="description" id="description"
                                              placeholder="给你的作品加一些吸引人的描述吧"></textarea>
                                </div>
                                <div class="form-group">
                                    <h5>Copyright?</h5>
                                    <div class="checkbox">
                                        <input type="radio" name="Copyright" value="" id="copyes"><label for="copyes">All rights reserved</label><br>
                                        <input type="radio" name="Copyright" value="" id="copno"><label for="copno">Creative Commons</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <h5>Creative Commons Types</h5>
                                    <div class="form-check-inline">
                                        <input type="checkbox" id="Attribution"><label for="Attribution">Attribution</label>
                                    </div>
                                    <div class="form-check-inline">
                                        <input type="checkbox" name="Noncommercial" id="Noncommercial"><label for="Noncommercial">Noncommercial</label>
                                    </div>
                                    <div class="form-check-inline">
                                        <input type="checkbox" name="Noncommercial"><label for="Noncommercial">Noncommercial</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <input type="checkbox" name="accept" value="" id="accept"><label for="accept">I accept the software license </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <h5>尺寸</h5>
                                <div class="row">
                                    <div class="col-md-5">
                                        <input class="w-100" type="number" name="height" id="height" placeholder="高" value="">
                                    </div>
                                    <div class="col-md-1 text-center">
                                        ✖
                                    </div>
                                    <div class="col-md-5">
                                        <input class="w-100" type="number" name="width" id="width" placeholder="宽" value="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6"></div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <h5>价格</h5>
                                <input class="w-75" type="number" name="price" value="" id="price" placeholder="$">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="row">
                                <p id="error"></p>
                            </div>
                            <div class="form-group row">
                                <div class="col-md-3">
                                    <input type="submit" class="btn btn-dark rounded-0" id="submit" value="Submit">
                                </div>
                                <div class="col-md-3"></div>
                                <div class="col-md-3">
                                    <input type="reset" class="btn btn-dark rounded-0" id="cancel" value="Cancel">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</section>
<section class="container set2">
    <div class="row">
        <hr class="w-100">
    </div>
    <footer class="row">
        <div class="col-md-1"></div>
        <div class="col-md-5 row">
            <div class="col-md-3 text-center"> <a rel="nofollow" target="_blank" href="artStore.html#aboutUs">
                    关于我们
                </a> </div>
            <div class="col-md-1 text-center">|</div>
            <div class="col-md-3 text-center"><a rel="nofollow" target="_blank" href="artStore.html#contactUs">
                    联系我们
                </a> </div>
            <div class="col-md-1 text-center">|</div>
            <div class="col-md-3 text-center">
                <a rel="nofollow" target="_blank" href="artStore.html#recruit">
                    人才招聘
                </a> </div>
            <div class="col-md-1 text-center">|</div>
        </div>
        <div class="col-md-5 row">
            <div class="col-md-3 text-center"> <a rel="nofollow" target="_blank" href="artStore.html#business">
                    商家入驻
                </a> </div>
            <div class="col-md-1 text-center">|</div>
            <div class="col-md-3 text-center">        <a rel="nofollow" target="_blank" href="artStore.html#advertisement">
                    广告服务
                </a> </div>
            <div class="col-md-1 text-center">|</div>
            <div class="col-md-3 text-center">        <a target="_blank" target="_blank" href="artStore.html#links">
                    友情链接
                </a> </div>
            <div class="col-md-1 text-center"></div>
        </div>
        <div class="col-md-1"></div>
    </footer>
    <div class="row text-center">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            Copyright&nbsp;&copy;&nbsp;2018-2030&nbsp;&nbsp;艺术品之家Art Store.com&nbsp;版权所有
        </div>
        <div class="col-md-3"></div>
    </div>
</section>
</body>
<script src="templates/js/main.js"></script>
<script src="templates/js/global.js"></script>
<script src="templates/js/upload.js"></script>
</html>
