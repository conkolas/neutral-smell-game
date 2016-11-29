<?php

    date_default_timezone_set("Europe/Vilnius");
    class Database
    {
        protected $hostname = 'localhost';
        protected $username = 'root';
        protected $password = '';
        protected $database = 'neutral_game';

        private $table      = 'odor_game_registration';
        private $db_obj;
        
        public function start()
        {
            if (!$this->db_obj)
            {
                $db = new mysqli($this->hostname, $this->username, $this->password, $this->database);
                if($db->connect_errno > 0)
                {
                    die('Unable to connect to database [' . $db->connect_error . ']');
                }
                $db->set_charset("utf8");
                $this->db_obj = $db;
            }
        }

        public function end()
        {
            if ($this->db_obj)
            {
                $this->db_obj->close();
            }
        }
        

        public function register($data) {
            if ($this->db_obj) {
                $date = date('Y-m-d H:i:s');
                $query = "INSERT INTO $this->table (name, email, send_time)
                VALUES ('$data[name]', '$data[email]', '$date')";

                if ($this->db_obj->query($query)) {
                    return true;
                } else { return false;}

            }
        }
        

    }
?>