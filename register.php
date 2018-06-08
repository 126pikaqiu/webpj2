
<?php
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        echo validate_form();
    }else if($_SERVER["REQUEST_METHOD"] === 'POST'){
        saveInfor();
    }

    //验证注册信息
    function validate_form(){

        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=users','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }

        if(isset($_GET['regName'])){
            $userName = $_GET['regName'];
            $p = $db->query("SELECT name FROM users");
            while($row = $p->fetch()){
                if($row["name"] === $userName){
                    return "false?用户已经存在";
                }
            }
            return "true?null";
        }
    }

    //存入数据库
    function saveInfor(){

        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=users','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
        //防止sql注入攻击，预处理
        $stmt = $db->prepare("INSERT INTO `users` ( `name`, `email`, `password`, `tel`, `address`, `balance`) VALUES(?,?,?,?,?,?)");
        $stmt->execute(array($_POST["regName"],$_POST["email"],$_POST["pwd"],$_POST["tel"],$_POST["address"],0));
    }
?>


