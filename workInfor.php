<?php
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        echo showInfor();
    }else{
        exit("<strong>非法访问</strong>");
    }

    //查询用户信息
    function showInfor(){

        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=artworks','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
        if(!isset($_GET['key'])){
            exit("<strong>非法访问</strong>");
        }
        $key = $_GET['key'];

        $p = $db->query("SELECT  `artworkID`, `artist`, `imageFileName`, `title`, `description`,
 `yearOfWork`, `genre`, `width`, `height`, `price`, `view` FROM artworks ");

        //获得索引和id的对应表
        if($key === "id"){
            $row = $p->fetchAll();
            $id = "";
            foreach($row as $v){
                $id .= $v["artworkID"] . " ";
            }
            return $id;
        }else{
            $value = $_GET["value"];
            if($key === "index"){
                $row = $p->fetchAll()[$value];
                return json_encode($row);
            }
            $p = $db->query("SELECT  `artworkID`, `artist`, `imageFileName`, `title`, `description`,
 `yearOfWork`, `genre`, `width`, `height`, `price`, `view` FROM artworks WHERE " .$key . " = " ." $value" );
            if($row = $p->fetch()){
                return json_encode($row);
            }
            return "false|";
        }

    }
?>