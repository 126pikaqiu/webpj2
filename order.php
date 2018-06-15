<?php
    session_start();
    include_once "global.php";
    if($_SERVER["REQUEST_METHOD"] == 'POST'){
        postOrder($db);
    }else if($_SERVER["REQUEST_METHOD"] == 'GET'){
        showOrders($db);
    } else {
        header("Location:index.html");
    }

    //提交订单
    function postOrder($db){

        if(isset($_POST["artworkID"])){

            //查询拥有者ID
            if(is_array($_POST["artworkID"])){//提交多个订单
                foreach($_POST["artworkID"] as $id){
                    $id1 = makeID();
                    $p1 = $db->query("SELECT  `ownerID` FROM artworks WHERE artworkID=". $id);
                    $ownerID = $p1->fetch()["ownerID"];
                    $p = $db->exec('INSERT INTO orders (`userID`,`orderID`, `ownerID`, `artworkID`)
                                      VALUES('.$_SESSION["myID"].','.(integer)$id1.','.$ownerID.','.$id.")");
                }
                echo $p;
            }else{
                echo 'ARRAY ERROR';
            }

        }else{
            echo 'error';
        }
    }

    //返回订单数据
    function showOrders($db){
        if(isset($_GET["orderID"])){
            $row = $db->query("SELECT * FROM orders WHERE orderID=" . $_GET["orderID"]);
            echo json_encode($row->fetch());
        }else if(isset($_GET["artworkID"])){
            if(!is_array($_GET["artworkID"])){
                $row = $db->query("SELECT userID FROM orders WHERE artworkID=" . $_GET["artworkID"]);
                $p = $row->fetchAll();
                if(count($p) === 0){
                    echo  "1";
                }else{
                    echo "0";
                }
            }else{
                $getIDs = $_GET["artworkID"];
                //判断多个订单
                $ids = [];
                foreach($getIDs as $id){
                    $row = $db->query("SELECT  `userID` FROM orders WHERE artworkID=". $id);
                    $row1 = $db->query("SELECT `artworkID` FROM artworks WHERE artworkID=" . $_GET["artworkID"]);
                    $p1 = $row1->fetchAll();
                    $p = $row->fetchAll();
                    if(count($p)>0 || !count($p1)){
                        $ids[] = $id;
                    }
                }
                echo json_encode($ids);
            }
        }
        else if(isset($_SESSION["myID"])){
            //两类不同的订单
            if(isset($_GET["type"]) && (int)$_GET["type"] === 1){
                $row = $db->query("SELECT * FROM orders WHERE userID=" . $_SESSION["myID"]);
                $orders = $row->fetchAll();
            }else if(isset($_GET["type"]) && (int)$_GET["type"] === 0){
                $row = $db->query("SELECT * FROM orders WHERE ownerID=" . $_SESSION["myID"]);
                $orders = $row->fetchAll();
            }else{
                return;
            }
            echo json_encode($orders);
        }
    }
?>