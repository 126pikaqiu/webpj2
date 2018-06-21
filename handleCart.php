<?php
    session_start();
    include_once "class/cart.class.php";
    $mycart = new cart();
    if($_SERVER["REQUEST_METHOD"] == 'GET'){
        checkCart($mycart);
    }else if($_SERVER["REQUEST_METHOD"] == 'POST'){
        updateCart($mycart);
    }else{
        exit("<strong>非法访问</strong>");
    }

    //检查购物车
    function checkCart($mycart){
        if(json_encode($mycart->listArray()))
            echo json_encode($mycart->listArray());
        else
            exit("<strong>非法访问</strong>");
    }

    //更新购物车
    function updateCart($mycart){
        if(isset($_POST["value"]))
            $mycart->store(json_decode($_POST["value"]));
        else{
            exit("<strong>非法访问</strong>");
        }
    }

?>