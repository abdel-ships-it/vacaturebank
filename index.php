<?php session_start();
	
	spl_autoload_register(function($class) {
	 require_once "classes/{$class}.php";
	});

	$Authentication = new Authentication();
	$vacatureBank = new VacatureBank();

	/*Guest actions*/
	if(isset($_POST['action'])) {
	    switch($_POST['action']) {
	        case 'login': $Authentication->login($_POST);break;
	    	case 'session': $Authentication->session();break;
	    	case 'register': $Authentication->register($_POST);break;
	    	case 'vacaturesLezen': $vacatureBank->vacaturesLezen();break;
			case 'laadFuncties' : $vacatureBank->laadFuncties();break;
			case 'log' : $Authentication->log($_POST['message'], $_POST['fileName']);break;
			case 'forgotPassword' : $Authentication->forgotPassword($_POST['email']);break;
	    }

	    if(isset($_SESSION['userType'])){

		   /* Logged in users actions*/
		    if(isset($_SESSION['userType'])){
		    	switch($_POST['action']){
		    		case 'verifyPassword' : $Authentication->verifyPassword($_POST['password']);break;
		    		case 'changePassword' : $Authentication->changePassword($_POST['current'], $_POST['password']);break;
			    	case 'logout' : $Authentication->logout();break;
		    	}
		    }
		    /*Sollicitant actions*/
		    if($_SESSION['userType'] === "sollicitant"){
		    	switch($_POST['action']){
		    		case 'apply' : $vacatureBank->apply($_POST); break;
		    		case 'persoonlijkeSollicitaties' : $vacatureBank->persoonlijkeSollicitaties(); break;
		    		case 'changeInfo': $Authentication->changeInfo($_POST);break;
		    		case 'checkAcceptance': $vacatureBank->checkAcceptance();break;
		    	}
		    }

		    if($_SESSION["userType"] === "bedrijf" || $_SESSION["userType"] === "admin"){
			    switch($_POST['action']) {
			    	case 'vacatureMaken' : $vacatureBank->vacatureMaken($_POST);break;
			    	case 'priveVacaturesLezen': $vacatureBank->priveVacaturesLezen();break;
			    	case 'vacaturesEditen' : $vacatureBank->vacaturesEditen($_POST);break;
			    	case 'vacatureVerwijderen' : $vacatureBank->vacatureVerwijderen($_POST);break;
			    	case 'fetchUser' : $vacatureBank->fetchUser($_POST);break;
			    	case 'changeInfo': $Authentication->changeInfo($_POST);break;
			    	case 'fetchAllUsers': $vacatureBank->fetchAllUsers();break;
			    	case 'fetchAllReplies' : $vacatureBank->fetchAllReplies();break;
			    	case 'acceptApplication' : $vacatureBank->acceptApplication($_POST);break;
			    	case 'denyApplication' : $vacatureBank->denyApplication($_POST);break;
		    	}
		    }
		    else{
		    	/*echo json_encode(false);*/
		    }
		    /*Admin actions*/
		    if(isset($_POST['admin'])){
		    	switch($_POST['action']){
		    		case 'deleteCompany' : $vacatureBank->deleteCompany($_POST);break;
			    	case 'deleteUser': $vacatureBank->deleteUser($_POST);break;
			    	case 'deleteVacancy' : $vacatureBank->deleteVacancy($_POST);break;
			    	case 'fetchAllCompanies' : $vacatureBank->fetchAllCompanies();break;
			    	case 'fetchVacancyPerApplicant' : $vacatureBank->fetchVacancyPerApplicant();break;
			    	case 'registerAdmin' : $Authentication->registerAdmin($_POST);break;
			    	case 'voegFunctieToe' : $vacatureBank->voegFunctieToe($_POST);break;
		    	}
		    }

	    }
    }