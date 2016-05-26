<?php
class VacatureBank extends Database {
  
  private $commisie = 50;

  /*Vacature = post variable with titel, beschrijving, eisen, functie, salaris*/
  public function vacatureMaken($vacature){
    /*DEBUG THE NEW CODE*/
    /*$_POST['titel'], $_POST['beschrijving'], $_POST['eisen'], $_POST['functie'], $_POST['salaris'];*/
      $query = "INSERT INTO `vacatures`(`bedrijfID`, `functieID`, `beschrijving`, `titel`, `eisen`, `commisie`, `salaris`) VALUES (:1, :2, :3, :4, :5, :6, :7)";
      $stmt = $this->db->prepare($query);
      try{
        $stmt->execute(array(":1"=> $_SESSION['bedrijfID'] , ":2"=> $vacature['functie'], ":3"=> $vacature['beschrijving'], ":4"=>$vacature['titel'], ":5"=> $vacature['eisen'], ":6"=> $this->commisie, ":7"=> $vacature['salaris']));
        $this->log(__METHOD__ . " " . __LINE__ . " " . "Vacature toegevoegd ", "debugging");
        echo json_encode(true);
      }catch(PDOException $e){
          $this->log(__METHOD__ . " " . __LINE__ . " " . "writing post error" . $e->getMessage(), "errors"); 
          echo json_encode(false);
      }
  }


  public function priveVacaturesLezen(){
    $query = "SELECT * FROM vacatures INNER JOIN functies ON vacatures.functieID = functies.functieID where bedrijfID = ?";
    $stmt = $this->db->prepare($query);

    try{
      $stmt->execute(array($_SESSION['bedrijfID']));
      $vacatures = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($vacatures);
      $this->log("Prive vacatures geladen voor bedrijf " . $_SESSION['bedrijfID'], "debugging");
      $this->log(json_encode($vacatures), "debugging");
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . " " . "Vacatures lezen error" . $e->getMessage(), "errors"); 
      echo json_encode(false);
    }
  }

  public function vacaturesLezen(){
    $query = "SELECT * FROM vacatures INNER JOIN functies ON vacatures.functieID = functies.functieID";

    $stmt = $this->db->prepare($query); 
    try{
      $stmt->execute(array());
      $vacatures = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($vacatures);
    }catch(PDOException $e){
          $this->log(__METHOD__ . " " . __LINE__ . " " . "Vacatures lezen error" . $e->getMessage(), "errors"); 
          echo json_encode(false);
      }
  }

  public function verifyVacancyOwnerShip($vacatureID){
      if($_SESSION['userType'] === 'admin'){ return true; }
      $query = "SELECT * FROM `vacatures` WHERE `vacatureID` = ? and `bedrijfID` = ? ";
      $stmt = $this->db->prepare($query);

      try{
        $stmt->execute(array($vacatureID, $_SESSION['bedrijfID']));
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!empty($result)){
          $this->log("User does not have write permission", "errors");
          return true;
        }
        else{
          $this->log("User does not have write permission", "errors");
          return false;
        }
      }catch (PDOException $e){
         $this->log(__METHOD__ . " " . __LINE__ . " " . "Verfying vacancy ownership failed \n" . $e->getMessage(), "errors");
      }
  } 

  public function vacaturesEditen($post){
    if($this->validateData($post)  && $this->verifyVacancyOwnerShip($post['vacatureID'])){

      $this->log(json_encode($post), "debugging");

      $query = "UPDATE `vacatures` SET `titel`= :1 ,`beschrijving`= :2, `eisen` = :3, `salaris`= :4 WHERE `vacatureID` = :5";
      $stmt = $this->db->prepare($query);
      try{
        $stmt->execute(array(":1" => $post['titel'], ":2" => $post['beschrijving'], ":3"=> $post['eisen'], 
          ":4"=>$post['salaris'], ":5"=> $post['vacatureID']));     
        $this->log($post['vacatureID'] . "Vacature edited", "debugging");
        echo json_encode(true); 
      }catch(PDOException $e){
            $this->log(__METHOD__ . " " . __LINE__ . " " . "Editing post error \n" . $e->getMessage(), "errors"); 
            echo json_encode(false);
        }
    }
  }

  public function vacatureVerwijderen($post){

    if($this->verifyVacancyOwnerShip($post['vacatureID'])){

        $query = "DELETE FROM `vacatures` WHERE `vacatureID` = ?";
        $stmt = $this->db->prepare($query);
        try{
          $stmt->execute(array($post['vacatureID']));
          echo json_encode(true);
          $this->log(sprintf("Vacancy #%s deleted", $post['vacatureID']), "errors");
        }catch(PDOException $e){
            $this->log(__METHOD__ . " " . __LINE__ . " " . "Removing vacancy error" . $e->getMessage(), "errors"); 
            echo json_encode(false);
        }
    }
  }

   public function laadFuncties(){
    $stmt = $this->db->prepare("SELECT * FROM `functies`");
    try{
      $stmt->execute(array());
      $functies = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($functies);
    }
    catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ ." Can't fetch job functions " . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function apply($post){
    if($this->applicationUniqueCheck($post['vacatureID'])){
      $query = 'INSERT INTO `sollicitatie`(`sollicitantID`, `vacatureID`, `datum`, `status`) VALUES (:1, :2,:3,:4)';
      $stmt = $this->db->prepare($query);
      try{ 
        $stmt->execute(array(":1"=> $_SESSION['sollicitantID'],":2"=> $post['vacatureID'], ":3"=> time(),":4"=> "pending"));
        $this->log("Nieuwe solliciatie \n" . json_encode($post), "debugging");
      }catch(PDOException $e){
        $this->log(__METHOD__ . " " . __LINE__ . "\n solliciatie mislukt" . $e->getMessage(), "errors");
        echo json_encode(false);
      }
    }else{
      echo "duplicate";           
    }

  }

  public function applicationUniqueCheck($vacatureID){
    $query = 'SELECT * FROM sollicitatie where sollicitantID = ? and vacatureID = ?';
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array($_SESSION['sollicitantID'], $vacatureID));
      $this->log($_SESSION['sollicitantID'] . " | " . $vacatureID, "debugging");
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

      if($result){
        $this->log("result is " . json_encode($result), "debugging");
        return false;
      }
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "\n Checking if application is unique failed" . $e->getMessage(), "errors");
    }
    return true;
  }
  

  public function fetchAllReplies(){
    $query = 'SELECT sollicitant.sollicitantID, sollicitant.userID, sollicitant.Voornaam, sollicitant.achternaam, sollicitant.beschrijving, sollicitatie.sollicitatieID, vacatures.vacatureID, sollicitatie.status,vacatures.titel from sollicitant
    join sollicitatie on sollicitatie.sollicitantID = sollicitant.sollicitantID 
    join vacatures on vacatures.vacatureID = sollicitatie.vacatureID 
    join functies on functies.functieID = vacatures.functieID
    join bedrijf on `bedrijf`.`bedrijfID`= vacatures.bedrijfID
    where bedrijf.bedrijfID = ?';
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array($_SESSION['bedrijfID']));
      $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($replies);
      $this->log(json_encode($replies), "users");
    }catch(PDOException $e){
       $this->log(__METHOD__ . " " . __LINE__ . " Fetching all replies failed" . $e->getMessage(), "errors");
       echo json_encode(false);
    }
  }


  public function fetchVacancyPerApplicant(){
    $query = 'SELECT sollicitant.sollicitantID, sollicitant.userID, sollicitant.Voornaam, 
    sollicitant.achternaam,  
    vacatures.vacatureID,vacatures.titel from sollicitant
    join sollicitatie on sollicitatie.sollicitantID = sollicitant.sollicitantID 
    join vacatures on vacatures.vacatureID = sollicitatie.vacatureID 
    join functies on vacatures.functieID = functies.functieID
    join bedrijf on bedrijf.bedrijfID = vacatures.bedrijfID';
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute();
      $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($replies);
      $this->log(json_encode($replies), "debugging");
    }catch(PDOException $e){
       $this->log(__METHOD__ . " " . __LINE__ . " Fetching all replies failed" . $e->getMessage(), "errors");
       echo json_encode(false);
    }
  }

  public function persoonlijkeSollicitaties(){
    $stmt = $this->db->prepare('SELECT * FROM `sollicitatie` join vacatures on sollicitatie.vacatureID = vacatures.vacatureID WHERE `sollicitantID` = ?');
    try{
      $stmt->execute(array($_SESSION['sollicitantID']));
      $persoonlijkeSollicitaties = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($persoonlijkeSollicitaties);
      $this->log(sprintf("Persoonlijke sollicitaties van %s fetched", $_SESSION['sollicitantID']), "debugging");
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . " Fetching van persoonlijke sollicitaties mislukt" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function checkAcceptance(){
    $stmt = $this->db->prepare('SELECT * FROM `sollicitatie` join vacatures on sollicitatie.vacatureID = vacatures.vacatureID WHERE `sollicitantID` = ? and `status` = "accepted"');
    try{
      $stmt->execute(array($_SESSION['sollicitantID']));
      $acceptedApplications = $stmt->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($acceptedApplications);
      $this->log(sprintf("Geaccepteerde sollicitaties van  sollicitant# %s fetched", $_SESSION['sollicitantID']), "debugging");
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . " Fetching van Geaccepteerde persoonlijke sollicitaties mislukt" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }



  public function fetchUser($post){
    $query = "SELECT users.userID, users.profielFoto, sollicitant.Voornaam, sollicitant.achternaam, sollicitant.adres, sollicitant.postcode, sollicitant.plaats, sollicitant.telefoon, sollicitant.geslacht, sollicitant.achternaam, sollicitant.beschrijving from users join sollicitant on users.userID = sollicitant.userID  where users.userID = ?";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array($post['userID']));
      $userData = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $this->log(sprintf("Fetched user #%d for company#%d", $post['userID'], $_SESSION['bedrijfID']), "debugging");
      $this->log(json_encode($userData), "debugging");
      echo json_encode($userData);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Fetching user data for company failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
    
  }

  public function fetchAllUsers(){
    $query = "SELECT users.userID, users.profielFoto, sollicitant.Voornaam, sollicitant.achternaam, sollicitant.adres, sollicitant.postcode, sollicitant.plaats, sollicitant.telefoon, sollicitant.geslacht, sollicitant.achternaam, sollicitant.beschrijving from users join sollicitant on users.userID = sollicitant.userID";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array());
      $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $this->log(sprintf("Fetched all users for user# %d", $_SESSION['userID']), "debugging");
      $this->log(json_encode($users), "users");
      echo json_encode($users);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Fetching user data for company failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function fetchAllCompanies(){
    $query = "SELECT * from bedrijf";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array());
      $bedrijven = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $this->log(sprintf("Fetched all companies for admin #%d", $_SESSION['userID']), "debugging");
      $this->log(json_encode($bedrijven), "debugging");
      echo json_encode($bedrijven);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Fetching all companies for admin failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function acceptApplication($post){
    $query = "UPDATE `sollicitatie` set `status` = ? WHERE sollicitatieID = ?";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array("accepted", $post['applicationID']));
      $this->log("Application #" . $post['applicationID'] . " Has been by accepted" . $_POST['bedrijfID'], "debugging");
      echo json_encode(true);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Accepting application failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function denyApplication($post){
    $query = "UPDATE `sollicitatie` set `status` = ? WHERE sollicitatieID = ?";
    $stmt = $this->db->prepare($query);
    try{
      $stmt->execute(array("denied", $post['applicationID']));
      $this->log("Application #" . $post['applicationID'] . " Has been by denied" . $_POST['bedrijfID'], "debugging");
      echo json_encode(true);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Accepting application failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function deleteCompany($post){
    $query = "DELETE from `bedrijf` where bedrijfID = ?";
    $stmt = $this->db->prepare($query);

    try{
      $stmt->execute(array($post['bedrijfID']));
      $this->log("Deleting company Successfull", "debugging");
      echo json_encode(true);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Deleting company failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function deleteUser($post){
    $query = "DELETE from `users` where userID = ?";
    $stmt = $this->db->prepare($query);

    try{
      $stmt->execute(array($post['userID']));
      $this->log("Deleting vacancy Successfull", "debugging");
      echo json_encode(true);
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Deleting user failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }

  public function deleteVacancy($post){
    $query = "DELETE from `vacatures` where vacatureID =  ?";
    $stmt = $this->db->prepare($query);

    try{
      $stmt->execute(array($post['vacatureID']));
      $this->log("Deleting vacancy Successfull", "debugging");
    }catch(PDOException $e){
      $this->log(__METHOD__ . " " . __LINE__ . "Deleting vacancy failed" . $e->getMessage(), "errors");
      echo json_encode(false);
    }
  }
}