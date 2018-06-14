<?php
    session_start();
    include_once "global.php";
    if($_SERVER["REQUEST_METHOD"] == 'GET'){
        echo showInfor($db);
    }else if($_SERVER["REQUEST_METHOD"] == 'POST'){
        updateMyInfor($db);
    }else{
        exit("<strong>非法访问</strong>");
    }

    //查询用户信息
    function showInfor($db){

        if(isset($_GET["type"]) && isset($_GET["userID"])){
            $p = $db->query("SELECT name, tel, email, address FROM users WHERE userID=". $_GET["userID"]);
            return json_encode($p->fetch());
        }   else  if(!isset($_GET['regName'])){
            print "<h1>非法访问</h1>";
            exit();
        }
            $userName = $_GET['regName'];
        $p = $db->query("SELECT name, tel, email, address, balance FROM users");
    
        while($row = $p->fetch()){
            if($row["name"] === $userName){
                return "true|".$row["tel"]."|".$row["email"]."|".$row["address"]."|".$row["balance"];
            }
    
        }
        return "false?用户不存在?";
    }

    //修改信息
    function updateMyInfor($db){
        if(isset($_SESSION["myID"])){
            if(isset($_POST["balance"])){
                $balance = ", balance=".$_POST["balance"];
            }else{
                $balance = '';
            }
            if(isset($_POST["address"])){
                $address = ", address=".'?';
            }else{
                $address = '';
            }
            if(isset($_POST["email"])){
                $email = ", email="."?";
            }else{
                $email = '';
            }
            if(isset($_POST["tel"])){
                $tel = ", tel=".$_POST["tel"];
            }else{
                $tel = '';
            }
            if(isset($_POST["regName"])){
                $name = ", name="."?";
            }else{
                $name = '';
            }
            $id = $_SESSION["myID"];
            $myid = "userID=" . $id;
            try{
                $sql = "UPDATE users SET userID=".$id .$name. $address . $balance. $email. $tel.
                    ' WHERE '.$myid;
                $result = $db->prepare($sql);
                if($name && $address & $email){
                    $aArray = array($_POST["regName"],$_POST["address"],$_POST["email"]);
                }else if($name && $address){
                    $aArray = array($_POST["regName"],$_POST["address"]);
                }else if($name){
                    $aArray = array($_POST["regName"]);
                }else{
                    $aArray = [];
                }
                $result = $result->execute($aArray);
            }catch (PDOException $e){
                print $e->getMessage();
                exit();
            }
            echo "1";
        }else{
            echo "no found id";
        }
    }
?>

