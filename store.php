<?php
    session_start();
    include 'global.php';
    include_once 'form.php';
    ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <title>艺家 商品详情</title>
    <link rel="icon" href="templates/img/web_img/favicon.ico"/>
    <link rel="stylesheet" href="templates/css/main.css">
    <link rel="stylesheet" href="templates/css/store.css">
    <script src="templates/js/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
</head>
<body>
<div id="dialog" title="登录提示">
    <h2></h2>
    <button type="button" name="button">确认</button>
</div>
<div id="dialog-modal" title="注册">
    <div id="dialog-register" title="注册">
        <div class="form">
            <?php getRegisterForm()?>
            <footer>
                <a href="register.html" class="hv-under" style="color:#333">网页版注册</a>&nbsp;&nbsp;&nbsp;
                <div class="have-account">已有账号？ <a href="javascript:;" class="hv-under re-signin" title="登录" style="color:#333">请登录</a></div>
            </footer>
        </div>
    </div>
    <div id="dialog-signin" title="登录">
        <div class="form">
            <div class="form-header">密码登录</div>
            <div class="form-con">
                <?php getSignForm();?>
                <a href="login.php" class="hv-under" style="color:#333">网页版登录</a>
            </div>
        </div>
    </div>
</div>
<nav id="head-nav">
    <div class="w">
        <ul class="fr">
            <li class="dt">
                <a href="javascript:;" class="sign dt-link hv-red">您好，请登录</a>&nbsp;&nbsp;
                <a href="javascript:;" class="register style-red">免费注册</a>
            </li>
            <li class="dt signin">
                <a class="link-login dt-link">Hi <a href="javascript:;" title="点击查看各人信息"><span class="account hv-red"></span></a></a>&nbsp;&nbsp;
                <a class="signout hv-red" href="javascript:;">退出登录</a>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link hv-red"><a class="hv-red" href="index.php">首页</a></div>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link"><img src="templates/img/web_img/cart.png" alt="cart"><a class="hv-red cart" href="javascript:;">购物车<strong id="gooNumber">0</strong>件</a>
                    <i class=""></i></div>
            </li>
            <li class="spacer"></li>
            <li class="dt">
                <div class="dt-link hv-red"><a class="hv-red" href="item.html">商品详情</a></div>
                <div class=""></div>
            </li>
        </ul>
    </div>
</nav>
<div class="main">
    <div class="txt-head">
        <div class="logo-con">
            <img src="templates/img/web_img/logo.jpg" height="80" width="80" alt="艺术品之家logo" title="艺术品之家">
            <span class="title-uk">Art Store</span>
            <span class="log-tit">艺家</span>
        </div>
        <div class="surf-header">
            <input type="text" name="" value="">
            <label><a href="search.html">搜 索</a></label>
        </div>
    </div>
    <div id="crumbs">
        <strong>您的位置</strong>
        <ol class="crumbs">
            <li><a href="">首页</a></li>>
            <li class="current">我的购物车</li>
        </ol>
    </div>
    <aside class="aside-left">
        <h1 id="title">The Falling Fireworks</h1>
        <p><a href="search.html" id="artist">By Whistler</a></p>
        <div>
            <div class="img">
                <div id="normal">
                    <img id="captionImg" src="templates/img/art_img/6.jpg" alt="">
                    <div id="show"></div>
                </div>
                <div id="big"><img src="templates/img/art_img/6.jpg" /></div>
            </div>
            <section id="secOne">
                <p class="description" id="description">坠落的烟火是惠斯勒比较得意的艺术作品,含有大量的亚洲元素,图中出现了日本和服以及中国瓷器</p>
                <p><strong>price: <span class="money" id="price">$12,000</span></strong></p>
                <button class="hv-red">★加入到收藏夹</button> <button id="addToCart" class="hv-red"><img src="templates/img/web_img/shopCart.png" alt="">添加到购物车</button><br>
                <table>
                    <thead>
                    <th colspan="2">商品详情</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td>日期</td>
                        <td id="yearOfWork">1922</td>
                    </tr>
                    <tr>
                        <td>流派</td>
                        <td id="genre">油画</td>
                    </tr>
                    <tr>
                        <td>尺寸（高 ✖ 宽）</td>
                        <td><span id="height">100</span>cm ✖ <span id="width">83</span>cm</td>
                    </tr>
                    <!--<tr>-->
                    <!--<td>画面内容</td>-->
                    <!--<td id="content">家庭生活</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                    <!--<td>藏馆</td>-->
                    <!--<td id="address">大英博物馆</td>-->
                    <!--</tr>-->
                    <tr>
                        <td>数量</td>
                        <td id="number">13</td>
                    </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </aside>
    <aside class="aside-right">
        <table>
            <thead>
            <th>流行艺术家</th>
            </thead>
            <tbody>
            <tr><td><a href="javascript:;" class="hv-red">梵高</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">惠斯勒</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">毕加索</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">达芬奇</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">米开朗基罗</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">伦勃朗</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">塞尚</a></td></tr>
            </tbody>
        </table>
        <table>
            <thead>
            <th>流行流派</th>
            </thead>
            <tbody>
            <tr><td><a href="javascript:;" class="hv-red">立体主义(Cubism)</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">野兽主义(Fauvism)</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">表现主义(Expressionism)</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">未来主义(Futurism)</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">机械主义(Mechanism)</a></td></tr>
            <tr><td><a href="javascript:;" class="hv-red">超现实主义(Surrealism)</a></td></tr>
            </tbody>
        </table>

    </aside>
</div>
<div class="footer">
    <div class="footer-main">
        <footer>
            <div class="foo-links">
                <a rel="nofollow" target="_blank" href="artStore.html#aboutUs">
                    关于我们
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.html#contactUs">
                    联系我们
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.html#recruit">
                    人才招聘
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.html#business">
                    商家入驻
                </a> |
                <a rel="nofollow" target="_blank" href="artStore.html#advertisement">
                    广告服务
                </a> |
                <a target="_blank" target="_blank" href="artStore.html#links">
                    友情链接
                </a> |
                <a target="_blank" target="_blank" href="artStore.html#union">
                    销售联盟
                </a>
            </div>
            <div class="copyright">
                Copyright&nbsp;&copy;&nbsp;2018-2030&nbsp;&nbsp;艺术品之家Art Store.com&nbsp;版权所有
            </div>
        </footer>
    </div>
</div>
<!--<div class="smc">-->
<!--<div>-->
<!--<div class="noEmpty">-->
<!--<header>最新加入的商品</header>-->
<!--<ul class="mcart-sigle">-->
<!--<li>-->
<!--<div class="img"><img src="templates/img/art_img/images/works/square-medium/019130.jpg" alt=""></div>-->
<!--<div class="infor">-->
<!--<h5 class="name">Irises</h5>-->
<!--<h5 class="author">By 梵高</h5>-->
<!--<h6 class="money">$21,000</h6>-->
<!--</div>-->
<!--</li>-->
<!--<li>-->
<!--<div class="img"><img src="templates/img/art_img/images/works/square-medium/50.jpg" alt=""></div>-->
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
<script src="templates/js/main.js"></script>
<script src="templates/js/store.js"></script>
</body>
</html>
