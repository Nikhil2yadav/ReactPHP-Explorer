<?php
namespace Api\Controllers;
use Services\DB;
class PostsController
{
    public $conn = null;

    public function __construct(){
        // Create connection
        $this->conn = (new DB())->database();
    }

    
    /*
    Getting posts from third party api.
    */
    public function getPosts()
    {
        try {
            // Getting posts data
            $postsUrl = "https://jsonplaceholder.typicode.com/posts";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_URL, $postsUrl);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

            $responsePosts = curl_exec($ch);
            if (curl_errno($ch)) {
                throw new \Exception(curl_error($ch));
            }
            curl_close($ch);

            // Getting images data
            $imagesUrl = "https://jsonplaceholder.typicode.com/photos";
            $chImg = curl_init();
            curl_setopt($chImg, CURLOPT_AUTOREFERER, TRUE);
            curl_setopt($chImg, CURLOPT_HEADER, 0);
            curl_setopt($chImg, CURLOPT_ENCODING, "");
            curl_setopt($chImg, CURLOPT_MAXREDIRS, 10);
            curl_setopt($chImg, CURLOPT_TIMEOUT, 30);
            curl_setopt($chImg, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($chImg, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($chImg, CURLOPT_URL, $imagesUrl);
            curl_setopt($chImg, CURLOPT_FOLLOWLOCATION, TRUE);
            curl_setopt($chImg, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
            curl_setopt($chImg, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($chImg, CURLOPT_SSL_VERIFYHOST, false);

            $responseImages = curl_exec($chImg);
            if (curl_errno($chImg)) {
                throw new \Exception(curl_error($chImg));
            }
            curl_close($chImg);

            $postsData = json_decode($responsePosts, true);
            $imagesData = json_decode($responseImages, true);
            $newArray = [];

            // Combining Data
            $imagesMap = [];
            foreach ($imagesData as $image) {
                $imagesMap[$image['id']] = $image['url'];
            }

            foreach ($postsData as $post) {
                if (isset($imagesMap[$post['id']])) {
                    $post['image'] = $imagesMap[$post['id']];
                } else {
                    $post['image'] = null;  // or some default image URL
                }
                $newArray[] = $post;
            }

            $this->savePostsToDatabase($newArray);

        } catch (\Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }

    //save post in data base from api
    public function savePostsToDatabase($posts=null){
        //insert data in database

        foreach($posts as $post){
            $userId = mysqli_real_escape_string($this->conn, $post['userId']);
            $title = mysqli_real_escape_string($this->conn, $post['title']);
            $body = mysqli_real_escape_string($this->conn, $post['body']);
            $image = mysqli_real_escape_string($this->conn, $post['image']);
            $sql = "INSERT INTO posts (user_id, title, content, image) 
                    VALUES ('$userId', '$title', '$body', '$image')";
             
            if(mysqli_query($this->conn,$sql)){
                echo "New records created successfully";
            } else{
                echo "error".$sql."<br>".mysqli_error($this->conn);
            }       
        }

        mysqli_close($this->conn);
    }

    /**
     * Getting paginated posts from database.
     */
    public function getPostsFromDatabase(){
        try {

            header("Access-Control-Allow-Origin:*");
            header("Access-Control-Allow-Headers: *");

            // echo "<pre>";
            $perPage =$_GET['limit'] ?? 5;
            $pageNumber=$_GET['offset'] ?? 0;
            $postsArray=[];

            $sql="select * from posts";
            $totalPosts=mysqli_num_rows(mysqli_query($this->conn,$sql)); 
            $sql ="SELECT * FROM posts ORDER BY id LIMIT $perPage OFFSET $pageNumber";
            $response=mysqli_query($this->conn,$sql);

            if($response){
                while ($row=mysqli_fetch_assoc($response)){
                    $postsArray['posts'][]=$row;
                }
                
            }else{
               echo "Error ".$sql ."<br>" . mysqli_error($this->conn);

            }
            $postsArray['count']=$totalPosts;
            mysqli_close($this->conn);
            echo json_encode($postsArray,JSON_PRETTY_PRINT);
            //return json_encode($postsArray,JSON_PRETTY_PRINT);
            // var_dump($_GET);
            // exit;

        }
        catch(\Exception $e){
            var_dump($e->getMessage());
        }
    }


    /**
     * Getting search result from database.
     */

    
    public function getSearchResults(){
        
        try
        {
            $this->getheaders();


            $postArray=[];
            $keyword=$_GET['keyword'] ?? null;

            if($keyword){
                $sql="SELECT id,title FROM posts WHERE title LIKE '%$keyword%' LIMIT 5";
                $response=mysqli_query($this->conn,$sql);

                if($response){
                    while($row=mysqli_fetch_assoc($response)){
                        $postArray['posts'][]=$row;                    
                    }
                }
            }
            echo json_encode($postArray,JSON_PRETTY_PRINT);
        }

        catch(\Exception $e)
        {
            var_dump($e->getMessage());
            exit;
        }
    }


    /**
     * Required headers.
     */

     public function getheaders(){
        // Allow from any origin

        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        header("Access-Control-Allow-Methods: GET,POST,PUT,OPTIONS");

        // Access-Control header are received during OPTIONS request

        if($_SERVER['REQUEST_METHOD']== "OPTIONS"){
            if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
                /// may also be using PUT ,PATCH ,HEAD etc
                header("Access-Control-Allow-Methods:GET,POST,OPTIONS");
            }
            

            if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
                header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            }
            exit(0);

        }
     }



     /**
      * Getting single Post
      */

     public function getCurrentTopic(){
        try {
            //code...
            $this->getheaders();
            $currentTopic=null;
            $id=$_GET['id'] ?? null;
            if($id){
                $sql="SELECT * FROM posts WHERE id='".$id."'";
                $response =mysqli_query($this->conn,$sql);

                if($response){
                    while ($row=mysqli_fetch_assoc($response)){
                        $currentTopic=$row;
                    }
                }
            }
                echo json_encode($currentTopic,JSON_PRETTY_PRINT);
        }
         catch (\Exception $e) {
            //throw $th;
            var_dump($e->getMessage());
            exit;
        }
     }
}
?>
