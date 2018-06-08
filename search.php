<?php
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        session_start();
        include 'class/search.class.php';
        include_once "global.php";
        $search = new search();
        if($_GET["key"]){
//            if($_GET["key"] !== restore("lastkey"))
                $search->searchSQL($_GET["key"]);
            echo json_encode(restore("searchResult")[$_GET["index"]]);
        }
    }else{
        exit("<strong>非法访问</strong>");
    }
?>

