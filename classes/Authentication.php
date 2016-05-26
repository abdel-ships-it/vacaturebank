 <?php
class Authentication extends Database {

  protected $salt = "zgMRgzoPXXsbs7emf7RRFR2rxwzwIG";


  public function login($post){

    $this->log(__METHOD__ . json_encode($post), "debugging");   
    if(isset($post['email']) && isset($post['password'])){
      try {
        $saltedPassword = hash('sha256', $post['password'] . $this->salt);
        
        if($post['userType'] === 'Admin'){
          $query = "SELECT * from users where users.email = :1 AND users.password = :2";
          $stmt = $this->db->prepare($query);
          $stmt->execute(array(":1"=> $post['email'], ":2"=> $saltedPassword));
          $result = $stmt->fetch(PDO::FETCH_ASSOC);
        }else{
          $tableName = $post['userType'];
          $query = "SELECT * From users JOIN $tableName ON $tableName.`userID` = users.userID WHERE users.email = :1 AND users.password = :2";
          $stmt = $this->db->prepare($query);
          $stmt->execute(array(":1"=> $post['email'],":2"=>$saltedPassword));
          $result = $stmt->fetch(PDO::FETCH_ASSOC);
        }
   
        if($result){
          $_SESSION = $result;
          echo json_encode($_SESSION);
          $this->log(__METHOD__ . json_encode($_SESSION), "debugging");   
        } else {
          session_destroy();
          echo json_encode(false);
          /*header('HTTP/1.0 403 Forbidden');*/
          }  
        }catch (PDOException $e) {
            $this->log(__METHOD__ . " " ."Logging in went wrong\n" . $e->getMessage(), "errors");   
          }
     }
  }

  public function logout(){
    session_destroy(); 
    echo "Uitgelogd";
  }

  /*Insert post data in the database*/
  public function register($userData){
      if($this->validateData($userData, __METHOD__) === true){
        /*Inserting into users table*/
        $query = 'INSERT INTO `users`(`email`, `password`, `userType`, `date`, `profielFoto`) VALUES (:1,:2,:3,:4,:5)';
        $stmt = $this->db->prepare($query);
        try{
          $stmt->execute(array(":1"=>$userData['email'], ":2"=> hash('sha256', $userData['password'] . $this->salt), ":3"=> $userData['userType'], ":4"=> time(), ":5"=> $userData['profielFoto']));
          $userID = $this->db->lastInsertId();
          $this->log($userID, "debugging");
          $this->log("User created " , "debugging");
        }catch(PDOException $e){
          $this->log(__METHOD__ . " " . " | Inserting user data error\n" . $e->getMessage(), "errors");
          echo json_encode(false);
          /*Ask meneer sanchez*/
          return false;
        }
        
        if($userData['userType'] == "sollicitant"){
            $query = 'INSERT INTO `sollicitant`(`userID`, `Voornaam`, `achternaam`, `adres`, `postcode`, `plaats`, `telefoon`, `geslacht`, `beschrijving`) VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9)';
            $stmt = $this->db->prepare($query);
            try{
              $stmt->execute(array(":1"=> $userID, ":2"=> $userData['voornaam'], ":3"=>$userData['achternaam'], ":4"=>$userData['adres'], 
                ":5"=>$userData['postcode'], ":6"=>$userData['plaats'], ":7"=>$userData['telefoon'],":8"=>$userData['geslacht'],
                ":9"=>$userData['beschrijving']));
              echo json_encode(true);
              $this->log("associated data inserted into tables" . __LINE__, "debugging");
            }catch(PDOException $e){
              $this->log(__METHOD__ . " " . " | Inserting company data error\n" . $e->getMessage(), "errors");
              echo json_encode(false);
              return false;
            }
        }
        if($userData['userType'] == "bedrijf"){
            $query = 'INSERT INTO `bedrijf`(`userID`, `bedrijfNaam`, `postcode`, `plaats`, `telefoon`, `adres`) VALUES (:1,:2,:3,:4,:5,:6)';
            $stmt = $this->db->prepare($query);
            try{
              $stmt->execute(array(":1"=>$userID, ":2"=> $userData['bedrijfNaam'], ":3"=> $userData['postcode'], ":4"=> $userData['plaats'], 
                ":5"=>$userData['telefoon'], ":6"=>$userData['adres']));
               echo json_encode(true);
               $this->log("associated data inserted into tables" . __LINE__, "debugging");
            }catch(PDOException $e){
              $this->log(__METHOD__ . " " . " | Inserting sollicitant data error\n" . $e->getMessage(), "errors");
              echo json_encode(false);
              return false;
            }
        } 

      $this->log(json_encode($userData), "debugging");
    }
  }

  public function changeInfo($post){

      if($this->validateData($post, __METHOD__)){

          if($_SESSION['userType'] === "sollicitant"){
            $query = "UPDATE `sollicitant` SET `voornaam`=:1, `achternaam` =:2, `adres` = :3, `postcode` = :4, `plaats` = :5, `telefoon` = :6 WHERE `userID` = :7";
            $stmt = $this->db->prepare($query);
            try{
              $stmt->execute(array(":1"=> $post['voornaam'], ":2"=> $post['achternaam'], ":3"=> $post['adres'],":4"=> $post['postcode'], 
                ":5"=>$post['plaats'], ":6"=> $post['telefoon'], ":7"=> $_SESSION['userID']));
              $this->log("changed information of user #" . $_SESSION['userID'] , "debugging");
            }catch(PDOException $e){
              $this->log(__METHOD__ . " " . " | Changing applicant information went wrong\n" . $e->getMessage(), "errors");
              echo json_encode(false);
            }
          }
          if($_SESSION['userType'] === "bedrijf"){
            $query = "UPDATE `bedrijf` SET `bedrijfNaam`= :1,`adres`=:2, `postcode`=:3,`plaats`=:4,`telefoon`=:5 WHERE `userID` = :6";
            $stmt = $this->db->prepare($query);
            try{
              $stmt->execute(array(":1"=> $post["bedrijfNaam"],":2"=> $post['adres'],":3"=> $post['postcode'], 
                ":4"=>$post['plaats'], ":5"=> $post['telefoon'], ":6"=>$_SESSION['userID']));
              $this->log("changed information of user #" . $_SESSION['userID'] , "debugging");
            }catch(PDOException $e){
              $this->log(__METHOD__ . " " . " | Changing company information went wrong\n" . $e->getMessage(), "errors");
              echo json_encode(false);
            }
          }
          
      }
      else{
        echo json_encode(false);
        $this->log(__METHOD__ . " " . " | FrontEnd sent incomplete data\n" . $e->getMessage(), "errors");
      }
      /*Make sure both name and email are given to avoid empty entries*/

        
      
      
  }

  public function verifyPassword($password){
    $password = hash('sha256', $password . $this->salt);

    $query = "SELECT * FROM users WHERE userID = ? AND password = ?";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array($_SESSION['userID'], $password));
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      
      if($result){
        echo json_encode(true);
        return true;
      }else{
        echo json_encode(false);
        return false;
      }
       $this->log("Recieved " . $password, "debugging");
    }catch(PDOException $e){
          $this->log(__METHOD__ . " " .  "Verifying paassword error\n" . $e->getMessage(), "errors"); 
          echo json_encode(false);
      }
  }


  public function changePassword($currentPass, $password){
      /*Check again if current password is right, only then change to new password*/
      $this->log("Password change attempt", "debugging");
      if($this->verifyPassword($currentPass)){
          $query = "UPDATE `users` SET `password`=? WHERE `userID` = ?";
          $stmt = $this->db->prepare($query);
          try{
              $saltedPassword = hash('sha256', $password . $this->salt);
              $stmt->execute(array($saltedPassword, $_SESSION['userID']));
              $this->log($_SESSION["userID"]. " Changed his password through the panel", "events");
          }catch(PDOException $e){
              $this->log(__METHOD__ . " " . $_SESSION["userID"] . " Unsuccessfully tried to change their password\n" . $e->getMessage(), "errors");
              echo json_encode(false);
          }

      }else{
        $this->log($_SESSION['userID'] . " Tried to change his password with the wrong current password (FrontEnd bug)", "errors");
      }
  }

  public function session(){
    if(isset($_SESSION['userID'])){
     echo json_encode($_SESSION);
    }
    else{
      echo json_encode(false);
    }
  }

   public function mail($html, $title, $email){    
    $output = shell_exec('classes/mail.sh ' . escapeshellarg($html) . ' ' . escapeshellarg($title) . ' ' . $email);
    $this->log($output,"debugging");
  }


  // Checks if users exists or not, useful for the password check to make sure a user exists before sending them an email
  public function checkUser($email){
    
    $query = "SELECT * FROM users where `email` = ?";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array($email));
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if($result){
        return true;
      }else{
        echo $this->log($email . " does not exist, but requested a new password", "events");
        return false;
      }  
    }catch(PDOException $e){
      $this->log("Checking user went wrong \n" . $e->getMessage(), "errors");
    }
    
  }


  public function forgotPassword($email){    
    if($this->checkUser($email)){
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); 
        $alphaLength = strlen($alphabet) - 1;
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        $password = implode($pass);
        $this->log($password, "debugging");
        $saltedPassword = hash('sha256', $password . $this->salt);
        $title = "SoftJobs wachtwoord";

        $htmlTemplate = '<p style="font-size:22px;">Reset password</p> 
        <p>Hey! </p> <p>Hier is je tijdlijke wachtwoord <b>%s</b></p>';

        $html = sprintf($htmlTemplate, $password);

        $query = 'UPDATE `users` SET `password` = ? where `email` = ?';
        $stmt = $this->db->prepare($query);

        try{
          $stmt->execute(array($saltedPassword, $email));
          $this->log($email . "Reset his password through the email", "events");
          $this->mail($html, $title, $email);
          echo json_encode(true);
        }
        catch(PDOException $e){
            $this->log(__METHOD__ . " " . __LINE__ . " Changing password failed" . $e->getMessage(), "errors");
            echo json_encode(false);
        }
      }
      else{
        echo "DoesntExist";
      }
  }

  public function registerAdmin($post){
    if(!$this->checkUser($post['email'])){
      $query = 'INSERT INTO `users`(`email`, `password`, `userType`, `date`) VALUES (:1,:2,:3,:4)';
      $stmt = $this->db->prepare($query);
      try{
        $stmt->execute(array(":1"=>$post['email'], ":2"=> hash('sha256', $post['password'] . $this->salt), ":3"=> "admin", ":4"=> time()));
        echo json_encode(true);
      }catch(PDOException $e){
        $this->log(__METHOD__ . " " . " | Registering admin error\n" . $e->getMessage(), "errors");
        echo json_encode(false);
        /*Ask meneer sanchez*/
        return false;
      }
    }else{
      echo "duplicate";
      $this->log("duplicate", "registerAdmin");      
    }

    $this->log(json_encode($post), "registerAdmin");
  }
   
}