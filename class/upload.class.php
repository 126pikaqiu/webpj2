<?php
//定义文件上传类
class upLoad{

    //文件上传方法
    function uploadFile($fileField,$artworkID = 0){
        $upfile = "";
        $files = $_FILES[$fileField];
        $fileName = $files['name'];
        $fileType = $files["type"];

        //获取临时文件的文件名
        $fileTemp = $files['tmp_name'];
        if($fileName != "" and $fileTemp != "" and $fileType != ""){
            if($this->allowType($fileType)){
                //获取文件大小
                $upfile["filesize"] = filesize($fileTemp);
                //创建文件夹，将上传的文件保存到新创建的文件夹中
                $filePath = "./templates/img/art_img/"; //设置文件路径
                //获取文件扩展名
                $fileExtendedName = $this->getExtendedName($fileName);

                //生成图片的名字
                //连接到数据库
                try{
                    $db = new PDO('mysql:host=localhost;dbname=myproject','root',"");
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                }catch (PDOException $e){
                    print "Couldn't connect to the database;" . $e->getMessage();
                    exit();
                }

                $p = $db->query("SELECT  `artworkID` FROM artworks WHERE `artworkID` > 452");
                if($artworkID){
                    $name = $artworkID;
                }else{
                    $name = count($p->fetchAll()) + 453;
                }
                //设置新的文件名称，以保证上传的文件不重名
                $newFileName = $name . "." . $fileExtendedName;
                //使用move_uploaded_file()函数，将上传的临时文件保存到服务器指定的路径返回状态
                $upfile["filename"] = $newFileName;
                $upfile["filetype"] = $fileType;
                if(file_exists($filePath . $newFileName)){
                    unlink($filePath . $newFileName);
                }
                $upfile["filestat"] = @move_uploaded_file($fileTemp, $filePath . $newFileName) ? "true" : "false";
            }else{
                $upfile["filename"] = "非法的文件类型。";
                $upfile["filestat"] = "false";
            }
        }else{
            $upfile["filename"] = "无效的文件数据。";
            $upfile["filestat"] = "false";
        }
        return $upfile;
    }

    //获取文件后缀名
    function getExtendedName($fileName){
        return end(explode(".",$fileName));
    }

    //文件类型验证
    function allowType($type){
        //设置不允许上传的文件类型数组
        $types = array('application/x-js','application/octet-stream','application/x-php','text/html');
        if(in_array($type,$types)){
            return false;
        }else{
            return true;
        }
    }

    //创建文件夹方法
    function createDir($userid){
        $root = 'folder';//定义文件上传的根目录
        $pathSign = DIRECTORY_SEPARATOR;
        $u = $userid .$pathSign;
        $y = date("Y") .$pathSign;//获得日期
        $m = date("m") .$pathSign;
        $d = date('d');
        $realPath = $root . $pathSign .$u .$y .$m . $d;
        $path = $root . $pathSign .$u .$y .$m . $d . $pathSign ."thumbnail";
        $dirArray = explode($pathSign, $path);
        $tempDir = '';
        foreach ($dirArray as $dir){
            $tempDir .= $dir . $pathSign;
            $isFile = file_exists($tempDir);
            clearstatcache();
            if(! $isFile && ! is_dir($tempDir)){
                @mkdir($tempDir, 0777);//设置当前目录权限
            }
        }
        return $realPath . $pathSign;
    }
}
?>