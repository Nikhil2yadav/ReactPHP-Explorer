<?php
namespace Api;

class Api{
    public static function routing ($current_link,$urls){
        try {
            //code...
            foreach($urls as $index=>$url){
                if($index !=$current_link){
                    continue;
                }
                //Getting controller and method out

                $routeElement = explode('@',$url[0]);
                $className=$routeElement[0];
                $function=$routeElement[1];

                //Check if comntroller prenst

                if(!file_exists("controllers/". $className . ".php")){
                    return "controller not found";
                }
                $class="api\controllers\\$className";

                $object=new $class();
                // var_dump($class,$object);exit;
                $object->$function();
            }
        } catch (\Exception $e) {
            //throw $th;
            var_dump($e->getMessage());
        }
    }
}