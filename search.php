<?php
    session_start();
    include 'class/search.class.php';
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        $search = new search();
        echo $search->searchSQL($_GET["key"],$_GET["order"],$_GET["page"]) ."&" . unserialize(stripslashes($_SESSION["rowCount"]));
    }else{
        exit("<strong>非法访问</strong>");
    }
?>

