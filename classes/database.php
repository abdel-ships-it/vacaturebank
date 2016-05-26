 <?php 
class Database{
	private $username = "root";
	private $password = "root";
	private $hostName = "localhost";
	protected $databaseName = "vacaturebank";
  protected $db;

  /*Construction */
  public function __construct(){
    try {
      $this->db = new PDO(
        'mysql:host='.$this->hostName.';dbname='.$this->databaseName.';', $this->username,$this->password);
       $this->db ->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
      $this->log(__METHOD__ . "Database connection failed" . $e->getMessage(), "debugging");
    }
  }

  public function log($input, $fileName){
    $pathTemplate = "logs/%s.log";
    $file = sprintf($pathTemplate, $fileName); 
    $message = "[" . date("d-M-Y") . " " . date('H:i:s', time()) . "] " . $input;
    if(file_exists($file)){
       $current = file_get_contents($file); 
       $current .= "\n" . $message;
     }else{
      $current = $message;
     }
    file_put_contents($file, $current);
  }
  /*Returns false on fail*/
  public function validateData($data, $method){
    /*This for each will only check if the sent data is filled in, but does not check if theres a missing field
    Add a future fix here*/
    $this->log(json_encode(sizeof($data)), "debugging");
    foreach($data as $key => $dataEntry){
      if(empty($dataEntry)){
        /*If one input is empty, everything just stops*/
        $this->log($method . "\n" . "key " . $key . " Is empty, fatal error\n" . json_encode($data) , "errors");
        return false;
      }
    }
    return true;
  }

}