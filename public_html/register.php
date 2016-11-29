<?php
    include("database.php");
    $db = new Database();
    $db->start();

    $name = false;
    $email = false;
    $isError = false;

    if( isset( $_POST['name'] ) ) $name = stripslashes( strip_tags( $_POST['name'] ) );
    if( isset( $_POST['email'] ) ) $email = stripslashes( strip_tags( $_POST['email'] ) );

    $result = array();

    $result['success'] = 0;
    if (!$name) {
        $result['error']['name'] = true;
        $isError = true;
    } else {
        $isError = false;
    }
    if (!$email) {
        $result['error']['email'] = true;
        $isError = true;
    } else {
        $isError = false;
    }

    if (!$isError) {   
        if ($db->register($_POST)) {
            $result['success'] = 1;
        } else {
            $result['isError'] = true;
            $result['error']['db'] = true;
        }
    } else {
        $result['isError'] = true;
    }

    echo json_encode($result);