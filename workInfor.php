<?php
    session_start();
    include "global.php";
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        if(isset($_GET["order"]) && $_GET['order'] === "checkWork"){
            try{
                $p = $db->query("SELECT * FROM orders WHERE artworkID=" . $_GET["artworkID"]);
                $row = $p->fetchAll();
                if(count($row) > 0){
                    echo "0";
                }else{
                    echo "1";
                }
                exit();
            }catch (PDOException $e){
                print "Couldn't connect to the database;" . $e->getMessage();
                exit();
            }
        }
        else if(isset($_GET["order"])){
            showUploadWorks($db);
            exit();
        }else if(isset($_GET["key"]) && ($_GET["key"]==="getHotWorks" || $_GET["key"]==="getNewWorks" )){
            showWorks($db);
            exit();
        }
        echo showInfor($db);
    }else if($_SERVER["REQUEST_METHOD"] === 'POST'){
        if(isset($_POST["order"]) && isset($_POST["artworkID"])){
            handleOrder($db);//处理订单
        }else{
            updateView($db);//更新热度
        }
    }else{
        exit("<strong>非法访问</strong>");
    }

    //查询作品信息，主要是通过artworkID
    function showInfor($db){
        if(!isset($_GET['key'])){
            exit("<strong>非法访问</strong>");
        }
        $key = $_GET['key'];
        $value = $_GET["value"];
        $p = $db->query("SELECT  `artworkID`, `artist`, `imageFileName`, `title`, `description`,
`yearOfWork`, `genre`, `width`, `height`, `price`, `view`, `timeReleased` FROM artworks WHERE " .$key . " = " ." $value" );
        if($row = $p->fetch()){
            return json_encode($row);
        }
        return "false|";

    }

    //我上传的艺术品信息
    function showUploadWorks($db){
        if(isset($_SESSION["myID"])){
            $p = $db->query("SELECT  `artworkID`, `title`, `timeReleased` FROM artworks WHERE ownerID=" . $_SESSION["myID"]);
            $works=[];
            $i = 0;
            while($i < 5 && $row = $p->fetch()){
               $works[] = $row;
               $i++;
            }
            echo json_encode($works);
        }
    }

    //热门艺术品信息
    function showWorks($db){
        if($_GET["key"] === "getNewWorks"){
            $p = $db->query("SELECT * FROM artworks where (select count(*)
 from orders where artworks.artworkID = orders.artworkID) = 0 Order By `timeReleased` desc limit 6");
            $works = $p->fetchAll();
            echo json_encode($works);
        }else if($_GET["key"] === "getHotWorks"){
            $p = $db->query("SELECT * FROM artworks Order By `view` desc limit 6");
            $works = $p->fetchAll();
            echo json_encode(utf8ize($works));
        }
    }

    //删除艺术品
    function handleOrder($db){
        $p = $db->exec("DELETE FROM artworks WHERE artworkID=" . $_POST["artworkID"]);
        if($p){
            echo "1";
        }else{
            echo "0";
        }
    }

    //更新view
    function updateView($db){
        $stmt = $db->exec('UPDATE `artworks` SET `view`=`view` + 1 WHERE artworkID='. $_POST["artworkID"]);
        echo $stmt;
    }
?>