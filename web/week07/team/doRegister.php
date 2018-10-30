<?php
    /**
     * ATTEMPT REGISTER
     * This is where the DB query code will go for signing up
     * as a new user.
     */

    require("redirects.php");
    // forceSSL();

    function isPopulated($val) {
        return isset($val) && !empty($val) && !empty(trim($val));
    }
    
    // get details
    $username = $_POST["username"];
    $password = $_POST["password"];
    $confirm = $_POST["confirm"];
    $fullname = $_POST["fullname"];

    // check if valid
    $PASSWORD_MIN_LENGTH = 8;
    $PASSWORD_MAX_LENGTH = 64;
    $validUsername = isPopulated($username);
    $validPassowrd = (
        isPopulated($password) &&
        count($password) >= PASSWORD_MIN_LENGTH &&
        count($password) <= PASSWORD_MAX_LENGTH &&
        $password == $confirm
    );
    $validFullname = isPopulated($fullname);
    if (!$validUsername || !$validPassword || !$validFullName) {
        registerFail();
    }

    // sanitize input
    $username = htmlspecialchars($username);
    $password = htmlspecialchars($password);
    $fullname = htmlspecialchars($fullname);

    // query the database
    $success = (function() {
        // add the db->query code here
        // return true or false depending on success
    })();

    if ($success) {
        login();
    } else {
        registerFail();
    }
?>