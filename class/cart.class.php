<?php
//创建购物车类
class cart{
    //向数组中添加各记录产品信息的数据
    function addItem($id , $title, $number, $price){
        $temp = (array)$this->restore();//读取session的值
        if(array_key_exists($id, $temp)){
            $temp[$id]["number"] = $temp[$id]["number"] + $number;//当产品已经存在后，只修改数量
        }else{
            //当产品不存在时，新建一条记录
            $temp[$id]["id"] = $id;
            $temp[$id]['title'] = $title;
            $temp[$id]["number"] = $number;
            $temp[$id]['price'] = $price;
        }

        //将数据保存在session中
        $this->store($temp);
    }

    //根据ID，从数组中删除一条记录
    function removeItem($id){
        $temp = $this->restore();//读取产品记录
        if(is_array($temp[$id])){
            unset($temp[$id]);//删除制定的数组内容
        }
        $this->store($temp);
    }

    //统计总的价格
    function _total(){
        $total = "";
        $temp = $this->restore();//读取购物车记录
        if(is_array($temp) and count($temp) > 0){
            foreach ($temp as $v){
                $total += $v["number"] * $v["price"];//获得总价
            }
        }
        return $total;
    }

    //以数组形式返回购物车的内容
    function listArray(){
        $temp = $this->restore();
        return $temp;
    }

    //恢复数据
    function restore(){
        //从session中读取购物车数据
        $cart_items = $_SESSION["cart_items"];//获取购物车记录
        $items = unserialize(stripslashes($cart_items));//将数据反序列化
        return $items;
    }

    //保存数据
    function store($items){
        $items = serialize($items);//将数据序列化
        $_SESSION["cart_items"] = $items;
    }

    //清空数据
    function clear(){
        unset($_SESSION["cart_items"]);
    }
}
?>