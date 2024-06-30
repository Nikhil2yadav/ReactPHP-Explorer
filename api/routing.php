<?php
    // error_reporting(E_ALL);
    // ini_set('display_errors','1'); 
// exit;
    require "services/DB.php";
    use services\DB;
    use Api\Api;
    use Api\Controllers\PostsController;


    require('controllers/PostsController.php');
    require ('Api.php');


    //Getting current URL

    $current_link=$_SERVER['REQUEST_URI'];


    // Handling query string strpos
    if(strpos($current_link,'?')!== false){
        $current_link=explode('?',$current_link)[0];
    }




    // var_dump($current_link[0]);
    // exit;

    //Routes
    $urls=[
        '/reactwithphp/api/posts'=>['PostsController@getPostsFromDatabase'],
        '/reactwithphp/api/searchResult'=>['PostsController@getSearchResults'],
        '/reactwithphp/api/getCurrentTopic'=>['PostsController@getCurrentTopic'],
    ];


    //check if route is avavilable
    $availableRoutes=array_keys($urls);
    if(!in_array($current_link, $availableRoutes))
    {
        header("HTTP/1.0 404 Not found");
        exit;
    }
    $response=Api::routing($current_link,$urls);
    echo $response;
