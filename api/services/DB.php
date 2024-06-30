<?php
    namespace services;

    class DB{
        public $db_host='localhost';
        public $db_user='root';
        public $db_password='';
        public $db_database='blogApplication';
        // making connection
        public function database(){
             $conn=new \mysqli($this->db_host,$this->db_user,$this->db_password,$this->db_database);

             //checkimnh connection

             if($conn->connect_error){
                die("connectiopn failed".$conn->connect_error);
             }
             return $conn;
        }
    }
?>