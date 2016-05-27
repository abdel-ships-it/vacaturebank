var app = angular.module('dashboard', ['ngAnimate', 'ui.router']);
app
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            
            $rootScope.$on('$stateChangeStart', function() {
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "session"
                    },
                    success: function(data) {
                        var data = data.trim();
                        console.log(data);
                        if (data === "false") {
                            if($state.current.name !== "Register"){
                                console.log("Not allowed to view this page")
                                $state.transitionTo('Login');    
                            }
                        }
                    }
                });
                $('#fab').addClass('leave');
                fabInterval = setTimeout(function() {
                    $('#fab').removeClass('leave');
                }, 400);

                //Fetching user Data
                if (!$rootScope.userData) {
                   $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "session"
                        },
                        success: function(data) {
                            var data = data.trim();
                            if (data !== "false") {
                                console.info('User data fetched');
                                console.log(JSON.parse(data));
                                $rootScope.$apply(function() {
                                    $rootScope.userData = JSON.parse(data);
                                });
                            }
                        }
                    });
                };

            });
        }
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        //Nested default state
        $urlRouterProvider.when("/dashboard", "/dashboard/");


        $stateProvider
            .state('Login', {
                url: '/',
                templateUrl: 'pages/login.html',
                data: {
                    pageTitle: 'Login'
                },
                onEnter: function() {
                    componentHandler.upgradeAllRegistered();
                }
            })
            .state('Register',{
                url : '/register',
                templateUrl: 'pages/register.html'
            })
            .state('Dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard.html',
                data: {
                    pageTitle: 'Dashboard'
                },
                onEnter: function() {
                }
            })
            .state('Dashboard.home', {
                url: '/',
                templateUrl: 'pages/welcome.html',
                data: {
                    childTitle: 'Home'
                }
            })
            .state('Dashboard.schrijven', {
                url: '/vacature',
                templateUrl: 'pages/vacature.html',
                data: {
                    childTitle: 'Vacature maken'
                }
            }).state('Dashboard.vacatures', {
                url: '/vacatures',
                templateUrl: 'pages/vacatures.html',
                data: {
                    childTitle: 'Vacatures'
                }
            })
            .state('Dashboard.admins', {
                url: '/admins',
                templateUrl: 'pages/admins.html',
                data: {
                    childTitle: 'Beheerders'
                }
            }).state('Dashboard.mijnGegevens', {
                url: '/Mijn gegevens',
                templateUrl: 'pages/security.html',
                data: {
                    childTitle: 'Mijn gegevens'
                }
            }).state('Dashboard.reacties',{
                url: '/reacties',
                templateUrl: 'pages/reacties.html',
                data:{
                    childTitle: 'Reacties'
                }
            }).state('Dashboard.sollicitanten',{
                url: '/users',
                templateUrl: 'pages/sollicitanten.html',
                data:{
                    childTitle: 'Sollicitanten'
                }
            }).state('Dashboard.management',{
                url: '/management',
                templateUrl: 'pages/management.html',
                data:{
                    childTitle: 'Management'
                }
            });
    })
    .controller('mainCtrl', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {
            $scope.state = $state;
            $scope.updatingVacancy = false;
            $scope.selectedJobFunction = {};
            $scope.userSearchFilter = "";
            //{{state.current.data.pageTitle}}
            // Last repeat is done
            $scope.finished = function() {
                componentHandler.upgradeAllRegistered();
                console.log('finished');
            }


            $scope.loaded = function(){
                setTimeout(function(){ 
                    componentHandler.upgradeAllRegistered();
                });
                 console.log('MDL elements upgraded');
            }

            function toast(text) {
                if (text === true) {
                    text = "Not logged in"
                };
                $("#toast").toggleClass("animate").children("#toastText").text(text);
                setTimeout(
                    function() {
                        $("#toast").toggleClass("animate");
                    }, 3000);
            }

            function fab(action) {
                setTimeout(function() {
                    $('#fab').children().eq(0).html(action)
                }, 200);
            }

                
            //Ajax global error handling
            $(document).ajaxError(function(event,request,settings) {
                toast('Server error');
            });



            $scope.$on('$viewContentLoaded', function(event) {
                componentHandler.upgradeAllRegistered();

                // Listening for input changes
                document.addEventListener("focus", function(e) {
                    checkTextfieldInput(e.target);
                }, true);
                document.addEventListener("change", function(e) {
                    checkTextfieldInput(e.target);
                }, true);
                document.addEventListener("input", function(e) {
                    checkTextfieldInput(e.target);
                }, true);
                document.addEventListener("blur", function(e) {
                    checkTextfieldInput(e.target);
                }, true);

                // Initializing inputs
                var inputs = document.getElementsByClassName("mdl-textfield__input");
                for (var i = 0; i < inputs.length; i++) {
                    checkTextfieldInput(inputs[i]);
                }

                function checkTextfieldInput(input) {
                    // Getiing the input and the textfield
                    if (input instanceof Element && input.matches(".mdl-textfield__input") === true) {
                        var field = input.closest(".mdl-textfield"),
                            hasValue = input.value.toString().length !== 0;
                        // If textfield found
                        if (field !== null) {
                            // Modifying icons
                            var icons = field.getElementsByClassName("mdl-textfield__icon");
                            for (var i = 0; i < icons.length; i++) {
                                // If no value
                                if (hasValue === false && input.isActive() !== true) {
                                    icons[i].classList.remove("mdl-color-text--primary");
                                }
                                // Else if focus or value
                                else {
                                    icons[i].classList.add("mdl-color-text--primary");
                                    console.log(hasValue, input.isActive())
                                }
                            }
                        }
                    }
                }

                // Closest
                Element.prototype.closest = function(selector) {
                    // If is what we're looking for
                    if (this.matches(selector) === true) {
                        // Return element
                        return this;
                    }
                    // Else
                    else {
                        // If parent is a valid element
                        var parent = this.parentNode;
                        if (parent instanceof Element) {
                            // Checking parent node
                            return parent.closest(selector);
                        }
                        // Else
                        else {
                            // Nothing matches
                            parent = null;
                        }
                        return parent;
                    }
                };

                // Is active
                Element.prototype.isActive = function() {
                    return this === document.activeElement;
                };
            });

            $scope.login = function() {
                $("#progress").show()
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: 'login',
                        email: $('#email').val(),
                        password: $('#password').val(),
                        userType:  $("input[name='userType']:checked").val()
                    },
                    success: function(data) {
                        var data = data.trim();
                        console.log(data);
                        if (data !== 'false') {
                            $scope.userData = {};
                            $('#loginError').removeClass('show');
                            $("#progress").hide();
                            $scope.$apply(function(){
                                $scope.userData = JSON.parse(data);
                            });
                            $state.transitionTo('Dashboard');
                            toast('U bent ingelogd as ' + $scope.userData.userType);
                        } else {
                            $("#progress").hide();
                            $('#loginError').addClass('show');
                        }
                    }
                });
            }

            $scope.logout = function() {
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: 'logout',
                    },
                    success: function(data) {
                        var data = data.trim();
                        if (data === "Uitgelogd") {
                            toast(data);
                            delete $scope.userData;
                            $state.transitionTo('Login');
                        }
                    }
                });
            }

            $scope.contactMe = function() {
                document.location.href = "mailto:abdallaroc@gmail.com?subject=Countdown app dashboard";
            }


            $scope.session = function() {
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "session"
                    },
                    success: function(data) {
                        console.log(data);
                    }
                });
            };

            //Fab action
            $scope.mainAction = function() {
                switch ($state.current.name) {
                    case "Dashboard.home":
                        $state.transitionTo('Dashboard.schrijven');
                        break;
                    case "Dashboard.schrijven":
                        $scope.vacatureMaken();
                        break;
                }
            }

            //Writing posts
            $scope.vacatureMaken = function(){
                if(!$("#postTitle").val()){
                    $('.blogInputs').eq(0).toggleClass('is-invalid');
                }
                if(!$("#vacatureBeschrijving").val()){
                    $('.blogInputs').eq(1).toggleClass('is-invalid');
                }
                if(!$("#vacatureEisen").val()){
                    $('.blogInputs').eq(2).toggleClass('is-invalid');
                }
                if(!$("#salaris").val()){
                    $(".salarisField").toggleClass('is-invalid');
                }
                if($("#postTitle").val() && $("#vacatureBeschrijving").val() && $("#vacatureEisen").val() && $("#salaris").val()){
                    //$titel, $beschrijving, $eisen, $functie, $salaris
                    if (!$scope.updatingVacancy) {
                        $.ajax({
                            type: "POST",
                            url: './index.php',
                            data: {
                                action: "vacatureMaken",//$titel, $beschrijving, $eisen, $functie, $salaris
                                titel: $("#postTitle").val(),
                                beschrijving: $("#vacatureBeschrijving").val(),
                                eisen: $("#vacatureEisen").val(),
                                functie: $("#functieDropdown").find('option:selected').attr("name"),
                                salaris: $("#salaris").val()
                            },
                            success: function(data) {
                                var data = data.trim();
                                if (data !== "false") {
                                    toast('Vacature toegevoed');
                                }else{
                                    toast('Vacature niet toegevoegd');
                                }
                            }
                        });
                    } //Updating posts
                    else {
                        $.ajax({
                            type: "POST",
                            url: './index.php',
                            data: {
                                admin: true,
                                action: "vacaturesEditen",
                                titel: $("#postTitle").val(),
                                beschrijving: $("#vacatureBeschrijving").val(),
                                eisen: $("#vacatureEisen").val(),
                                functie: $("#functieDropdown").val(),
                                salaris: $("#salaris").val(),
                                vacatureID: $scope.vacatures[$scope.vacancyIndex].vacatureID
                            },
                            success: function(data) {
                                var data = data.trim();
                                if (data) {
                                    toast('Vacature gewijzigd');
                                    $scope.$apply(function() {
                                        $scope.updatingVacancy = false;
                                        $scope.state.current.data.childTitle = "Blog schrijven";
                                    });
                                }
                            }
                        });
                    }           
                }
            }

            $scope.register = function() {
                var valid = 0;
                $(".formInput").each(function() {
                    if ($(this).val()) {
                        valid++
                    } else {
                        $(this).parent().toggleClass("is-invalid is-dirty");
                    }
                });
                if (valid == 4) {
                    if ($("#password").val() !== $("#passwordRepeat").val()) {
                        $(".passwordContainer").addClass("is-invalid");
                    } else {
                        $(".passwordContainer").removeClass("is-invalid");
                        $.ajax({
                            type: "POST",
                            url: './index.php',
                            data: {
                                action: "addAdmin",
                                admin: true,
                                name: $("#name").val(),
                                email: $('#email').val(),
                                password: $('#password').val()
                            },
                            success: function(data) {
                                var data = data.trim();
                                if (data) {
                                    toast('Admin toegevoegd');
                                    // listAdmins();
                                    console.log(data)
                                }
                            }
                        });
                    }
                }
            };  

            $scope.editVacancy = function(vacancyID) {
                $scope.updatingVacancy = true;
                $scope.vacancyIndex = vacancyID;

                $state.transitionTo('Dashboard.schrijven');
            };

            $scope.fillEditorData = function(vacancyID){

                $(".blogInputs").addClass('is-dirty is-upgraded');
                $("#postTitle").val($scope.vacatures[vacancyID].titel).focus();
                $("#salaris").val($scope.vacatures[vacancyID].salaris);
                setTimeout(function(){$("#functieDropdown").val($scope.vacatures[vacancyID].functienaam);});
                $("#vacatureBeschrijving").val($scope.vacatures[vacancyID].beschrijving);
                $("#vacatureEisen").val($scope.vacatures[vacancyID].eisen);
            }


            $scope.cancelEditPost = function() {
                $scope.updatingVacancy = false;
                $scope.state.current.data.childTitle = "Blog schrijven";
                $(".blogInputFields").val("");
                $(".blogInputs").removeClass('is-dirty is-upgraded');
            };

            $scope.deleteVacancy = function(vacancyID, index) {
                console.log(index);

                var decision = confirm("Weet u zeker dat u deze vacature wilt verwijderen?");
                if (decision == true) {
                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "vacatureVerwijderen",
                            bedrijf: true,
                            vacatureID: vacancyID
                        },
                        success: function(data) {
                            var data = data.trim();
                            console.log(data);
                            if (data === "true") {
                                $scope.$apply(function() {
                                    $scope.vacatures.splice(index, 1);
                                });
                                toast('Post verwijderd');
                            }else if(data === "false"){
                                toast('Post niet verwijderd');
                            }
                        }
                    })
                }
            };
            
            $scope.$on('$stateChangeStart', function(){
                if($state.current.name === "Dashboard.schrijven"){
                    $scope.cancelEditPost();
                }
                if($state.current.name === "Register"){
                    // alert("nah mate");
                }
                if($state.current.name === "Dashboard.sollicitanten"){
                    console.log("leaving");
                    $scope.requestedUserID = 0;
                }

            });

            // Changing states related functions
            $scope.$on('$stateChangeSuccess', function() {
                //Listing admins
                if ($state.current.name == "Dashboard.admins") {
                    listAdmins();
                }
                //Displaying vacanies
                if ($state.current.name == "Dashboard.vacatures") {
                    $('#fab').addClass('leave');
                    //Vacatures laden hier
                    if($scope.userData.userType === "bedrijf"){
                        $scope.fetchPrivateVacanies();
                        $scope.state.current.data.childTitle = "Mijn vacatures";
                    }else{
                        $scope.fetchAllVacancies();
                    }
                }
                if($state.current.name == "Dashboard.sollicitanten"){
                    if($scope.userData.userType === "sollicitant"){
                        toast('Insufficient permission')
                        $state.transitionTo('Dashboard.home');
                        $.ajax({
                            type: "POST",
                            url: "./index.php",
                            data:{
                                action: "log",
                                fileName: 'violation',
                                message: "application" + $scope.userData.userID + " tried to view a company only page"
                            }
                        })
                    }else{
                        $scope.fetchAllUsers();
                    }
                }
                if($state.current.name === "Dashboard.reacties"){
                    if($scope.userData.userType == "bedrijf"){
                        $scope.fetchAllReplies();
                    }
                    if($scope.userData.userType == "admin"){
                        $scope.fetchVacancyPerApplicant();
                    }
                }
                if($state.current.name === 'Dashboard.schrijven'){
                     if($scope.userData.userType === "sollicitant"){
                        toast('Insufficient permission')
                        $state.transitionTo('Dashboard.home');
                        $.ajax({
                            type: "POST",
                            url: "./index.php",
                            data:{
                                action: "log",
                                fileName: 'violation',
                                message: "An applicant tried to view a company only page"
                            }
                        })
                    }
                }
                if($state.current.name === 'Dashboard.management'){
                    if($scope.userData.userType === "sollicitant" || $scope.userData.userType === "bedrijf"){
                        toast('Insufficient permission')
                        $state.transitionTo('Dashboard.home');
                        $.ajax({
                            type: "POST",
                            url: "./index.php",
                            data:{
                                action: "log",
                                fileName: 'violation',
                                message: "An applicant or company tried to view an admin only page"
                            }
                        })
                    }else if($scope.userData.userType === "admin"){
                        $scope.fetchAllUsers();
                        $scope.fetchAllVacancies();
                        $scope.fetchAllCompanies();
                        console.log('fetching company data');
                    }   
                }

            });

            //Listing admins, reading admins, admins data, future release
            var listAdmins = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "listAdmins",
                        admin: true
                    },
                    success: function(data) {
                        $scope.$apply(function() {
                            //$scope.users = JSON.parse(data);
                        });
                    }
                });
            }



            //The document ready of UI router, any state related actions that will be dependent of the dom need to be here
            $scope.$on('$viewContentLoaded', function(event) {
                console.log($state.current.name);
                switch ($state.current.name) {
                    case "Login":
                        $.ajax({
                             type: "POST",
                             url: './index.php',
                             data: {
                                 action: "session"
                             },
                             success: function(data) {
                                 var data = data.trim();
                                 if (data !== "false") {
                                     console.info('User was still logged in');
                                     console.log(JSON.parse(data));
                                     $scope.$apply(function() {
                                         $scope.userData = JSON.parse(data);
                                         $state.transitionTo('Dashboard');   
                                     });
                                     toast('Welkom terug');
                                 }
                             }
                         });
                    break;
                    case "Dashboard.home":
                        fab('create');
                        break;
                    case "Dashboard.schrijven":
                        fab('publish');
                        $scope.loadFunctions();
                        if ($scope.updatingVacancy) {
                            console.log('schrijven');
                            $scope.state.current.data.childTitle = "Vacature wijzigen";
                            $scope.fillEditorData($scope.vacancyIndex);
                        }
                        break;
                    case "Dashboard.vacatures":
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                        break;
                    case "Dashboard.admins":
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                        break;
                    case "Dashboard.mijnGegevens":
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                        if($scope.userData.userType === "sollicitant"){
                             $("#sollicitant").fadeIn();  
                        }else if($scope.userData.userType === "bedrijf"){
                            $("#bedrijf").fadeIn();
                        }
                        $(".verplichtVeld").addClass("is-dirty is-upgraded");
                        $("#beschrijving").addClass("is-dirty is-upgraded");
                        $scope.icon = "vpn_key";
                        $scope.wrongPass = undefined;
                        break;
                    case 'Dashboard.reacties':
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                        break;
                    case 'Dashboard.sollicitanten':
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                        break;
                    case 'Dashboard.applicant':
                        clearInterval(fabInterval);
                        $('#fab').addClass('leave');
                    break;
                };

            });



            $scope.checkPassword = function() {
                $("#spinner").show();
                $scope.icon = "";

                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "verifyPassword",
                        admin: true,
                        password: $('#currentPassword').val()
                    },
                    success: function(data) {
                        var data = data.trim();
                        console.log(data);
                        $("#spinner").hide();
                        if (data === "true") {
                            $scope.icon = "done";
                            $scope.wrongPass = false;
                        } else if (data === "false") {
                            $scope.wrongPass = true;
                            $scope.icon = "warning";
                        }
                        $scope.$apply();
                    }
                });
            };

            $scope.changePassword = function() {
                //Making sure the current password is correct
                if (!$scope.wrongPass) {
                    console.log($("#password").val(), $("#currentPassword").val());
                    if ($("#passwordRepeat").val() === $("#password").val()) {
                        $.ajax({
                            type: "POST",
                            url: './index.php',
                            data: {
                                action: "changePassword",
                                current: $('#currentPassword').val(),
                                password: $('#password').val()
                            },
                            success: function(data) {
                                var data = data.trim();
                                if (data === "true") {
                                    toast('Wachtwoord veranderd');
                                } else {
                                    toast('Wachtwoord niet veranderd');
                                }
                            }
                        });
                    } else {
                        $(".passwordContainer").toggleClass("is-invalid");
                    }
                }
            };
            

            $scope.loadFunctions = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data:{
                        action: "laadFuncties"
                    },
                    success: function(data){
                        var data = data.trim();
                        if(data !== "false"){
                            $scope.$apply(function(){
                                $scope.functions = JSON.parse(data);
                            });
                        }
                        else{
                            toast('Functies niet geladen');
                        }
                    }
                })
            };

            $scope.log = function(){
                console.log($scope.selectedJobFunction);
            }   

            //Registeration

            $scope.choose = function(choice){
                $scope.chosen = true;
                if(choice === true){
                    $scope.sollicitant = true;
                    $scope.imageUrl = "images/defaultpf.png";
                }else{
                    $scope.sollicitant = false;
                    $scope.imageUrl = "images/company.png";
                }
            }
            
                

          
            $scope.imageUrl = "images/defaultpf.png";
            $scope.registerUser = function(){
                var valid = 0;
                var checkInputs = function(elem){
                    for (var i = 0; i < $(elem).length; i++) {
                        $(elem + " input").eq(i).val() === "" ?  $(elem).eq(i).toggleClass("is-invalid") : valid++;
                    }
                }
                var userType = $("input[name='userType']:checked").val();
                
                checkInputs("#commonFields .verplichtVeld");
                if ($("#password").val() !== $("#passwordRepeat").val()) {
                    $(".passwordContainer").toggleClass("is-invalid");
                } else{

                    if(userType == "sollicitant"){
                        checkInputs("#sollicitant .verplichtVeld");
                        if(valid == 9){
                            $.ajax({
                                type: "POST",
                                url: './index.php',
                                data: {
                                    action: "register",
                                    email : $("#email").val(),
                                    password: $('#password').val(),
                                    adres: $("#Adres").val(),
                                    postcode: $("#postcode").val(),
                                    plaats: $("#plaats").val(),
                                    telefoon: $("#phoneNumber").val(),
                                    voornaam: $("#voornaam").val(),
                                    achternaam: $("#achternaam").val(),
                                    geslacht: $("input[name='gender']:checked").val(),
                                    beschrijving: $("#beschrijving").val(),
                                    userType: userType,
                                    profielFoto:  $("#imageUrlInputs").val()
                                },
                                success: function(data) {
                                    var data = data.trim();
                                    console.log(data);
                                    if (data === "true") {
                                        toast('Geregistreerd');
                                    } 
                                    if(data === "duplicate"){
                                        toast('Email al in gebruik');
                                    }
                                    if(data === "false"){
                                        toast('Server fout melding');
                                    }
                                }})
                        }else{
                            toast('Incompleet gegevens');
                        }
                    }

                    if(userType == "bedrijf"){
                        checkInputs("#bedrijf .verplichtVeld");
                        if(valid == 8){
                            $.ajax({
                                type: "POST",
                                url: './index.php',
                                data:{
                                    action: "register",
                                    email : $("#email").val(),
                                    password: $('#password').val(),
                                    bedrijfNaam: $("#bedrijfNaam").val(),
                                    adres: $("#Adres").val(),
                                    postcode: $("#postcode").val(),
                                    plaats: $("#plaats").val(),
                                    telefoon: $("#phoneNumber").val(),
                                    userType: userType,
                                    profielFoto: $("#imageUrlInputs").val()                        
                                   },
                                   success: function(data){
                                    var data = data.trim();
                                        console.log(data);
                                        if (data === "true") {
                                           toast('Bedrijf geregistreerd');
                                        } else {
                                            toast('Server fout melding');
                                        }
                                   }
                            })
                        }else{  
                            toast('Incompleet gegevens');
                        }
                    }
                }
            }


            $scope.modifyPersonalInformation = function(){
                var valid = 0;
                var checkInputs = function(elem){
                    for (var i = 0; i < $(elem).length; i++) {
                        $(elem + " input").eq(i).val() === "" ?  $(elem).eq(i).toggleClass("is-invalid") : valid++;
                    }
                }
                 checkInputs("#commonFields .verplichtVeld");


                if($scope.userData.userType == "sollicitant"){
                    checkInputs("#sollicitant .verplichtVeld");
                    if(valid == 6){
                        $.ajax({
                           type: "POST",
                           url: './index.php',
                           data:{
                                action: 'changeInfo',
                                adres: $("#Adres").val(),
                                postcode: $("#postcode").val(),
                                plaats: $("#plaats").val(),
                                telefoon: $("#phoneNumber").val(),
                                voornaam: $("#voornaam").val(),
                                achternaam: $("#achternaam").val(),
                           },success: function(data){
                              var data = data.trim();
                              console.log(data)
                             if(data !== "false"){
                                toast('Gegevens gewijzigd');
                             }else{
                                toast('Server error');
                             }
                           }
                        })
                    }
                 }

                 if($scope.userData.userType == "bedrijf"){
                    checkInputs("#bedrijf .verplichtVeld");
                    if(valid == 5){
                        $.ajax({
                           type: "POST",
                           url: './index.php',
                           data:{
                                action: 'changeInfo',
                                bedrijfNaam: $("#bedrijfNaam").val(),
                                adres: $("#Adres").val(),
                                postcode: $("#postcode").val(),
                                plaats: $("#plaats").val(),
                                telefoon: $("#phoneNumber").val(),
                           },success: function(data){
                              var data = data.trim();
                              console.log(data)
                             if(data !== "false"){
                                toast('Gegevens gewijzigd');
                             }else{
                                toast('Server error');
                             }
                           }
                        })
                    }
                 }

            }
            // Continue
            //epoch to current time
            //var date = new Date(0)
            //date.setUTCSeconds(1461173885);

            $scope.fetchAllVacancies = function(){
                $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "vacaturesLezen"
                        },
                        success: function(data) {
                            var data = data.trim();
                            console.log(data)
                            if(data !== "false"){
                                $scope.$apply(function(){
                                    $scope.vacatures = JSON.parse(data);
                                });   
                            }
                        }
                    });
            };

            $scope.fetchPrivateVacanies = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "priveVacaturesLezen"
                    },
                    success: function(data) {
                        var data = data.trim();
                        if(data !== "false"){
                            console.log(JSON.parse(data));
                            $scope.$apply(function(){
                                $scope.vacatures = JSON.parse(data);
                            });   
                        }
                    }
                });
            }

            $scope.solliciteer = function(vacatureID){
                console.log("vacature ID" , vacatureID);
                $.ajax({
                    type: "POST",
                    url: "./index.php",
                    data:{
                        action: "apply",
                        vacatureID: vacatureID
                    },
                    success: function(data){
                        var data = data.trim();
                        console.log(data);
                        if(data !== "false" && data !== "duplicate"){
                            toast('Gesolliciteerd');
                        }else if(data === "duplicate"){
                            toast('Al Gesolliciteerd');
                        }else{
                            toast('Sollicitatie mislukt');
                        }

                    }
                })
            }

            $scope.mijnSollicitaties = function(){

            }

            $scope.fetchUserData = function(userID){
                   $.ajax({
                   type: "POST",
                   url: './index.php',
                   data: {
                       action: "fetchUser",
                       userID: userID
                   },
                   success: function(data) {
                      var data = data.trim();
                      console.log(data);
                      if(data !== "false"){
                        $scope.$apply(function(){
                            $scope.requestedUser = JSON.parse(data);
                        })
                      }
                   }
               }); 
            }   

            $scope.forgotPassword = function(){
                if($("#email").val() !== ""){
                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "forgotPassword",
                            email: $("#email").val()
                        },
                        success: function(data){
                            var data = data.trim();
                            if(data === "true"){
                                toast('Wachtwoord reset link verstuurd');
                            }
                            if(data === "false"){
                                toast('Server error')
                                $scope.triggerForgot();
                            }
                            if(data === "DoesntExist"){
                                toast('Uw e-mail is niet bekend bij ons');
                                $scope.triggerForgot();
                            }
                        }
                    })
                 }
                 else{
                    $('.emailWrapper').eq(0).toggleClass('is-invalid');
                 }
            }

            $scope.triggerForgot = function(){
                $scope.forgetPassword = true;
                $("#aanvragen").show();
            }

             $scope.adminLogin = function(){
                $scope.adminSelected = true;
                $scope.forgetPassword = false;
                $("input[name='userType']:checked").val("Admin");
                $("#aanvragen").hide();
             }
             $scope.normalLogin = function(){
                $scope.adminSelected = false;
                $scope.forgetPassword = false;
                $("input[name='userType']:checked").val("Bedrijf");
                $("#aanvragen").hide();
             }

            $scope.fetchAllUsers = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "fetchAllUsers"
                    },
                    success: function(data){
                        // Modify this for whenever the list is empty
                        var data = data.trim();
                        if(data !== "false"){
                            $scope.$apply(function(){
                                $scope.users = JSON.parse(data);
                            })
                        }else{
                            toast('Server error');
                        }
                    }
                });
            }
            
            $(document).on("click", ".phone", function() {
                var phoneNumber = $(this).attr("data-clipboard-text");
                var clipboard = new Clipboard('.phone', {
                    text: function(trigger) {
                        return phoneNumber;
                    }
                });
                toast('Telefoon nummer gekopieerd');
                console.log('click');
            });
            
            
            var tempData = [];

            $scope.replyToVacancy = function(applicationID, status){
                // Storing choices for reference, can be deleted later


                for(var i = 0; i < tempData.length; i++){
                    if(applicationID == tempData[i].applicationID){
                        console.log(tempData);
                        status = tempData[i].status;
                        console.log('match @ ' , i);
                        console.log(status);
                    }
                }

                var data = {action: "", applicationID: applicationID};
                status === "pending" || status === "denied" ? data.action = "acceptApplication" : data.action = "denyApplication";
                console.log(applicationID, status);
                console.log(data);
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: data,
                    success: function(data){
                        // Modify this for whenever the list is empty
                        var data = data.trim();
                        if(data !== "false" && data === "true"){
                            if(status === "pending" || status === "denied"){
                              toast('Geaccepteerd');
                              status="accepted";
                            }else{  
                                toast('Geweigered');
                                status="denied";
                            }   
                            tempData.push({"applicationID":applicationID, "status" : status});
                        }else{
                            toast('Server error');
                            tempData = [];
                        }
                    }
                })
            }

            $scope.formatArray = function(arr,tracker){
                var obj = {};
                // Puts duplicate keys under one object as an array
                for(elem in arr){
                 console.log(arr[elem][tracker]);
                    // If key does not exist, create the array
                     if(!(arr[elem][tracker] in obj)){
                        console.log('new time')
                          obj[arr[elem][tracker]] = [];
                         obj[arr[elem][tracker]].push(arr[elem]);
                      }else{
                        // If key exists, push into the array
                        console.log('not new item')
                        obj[arr[elem][tracker]].push(arr[elem]);
                      }
                }
                console.info(Object.keys(obj).length);
                return obj;
             }


            $scope.fetchAllReplies = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "fetchAllReplies"
                    }
                }).then(function(data){
                    var data = data.trim();
                    console.log(data);
                    if(data !== "false"){
                       toast('Reacties geladen');
                       $scope.replies = $scope.formatArray(JSON.parse(data), "titel");
                    }else{
                        toast('Server error');
                    }

                });
            }

            $scope.fetchVacancyPerApplicant = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data: {
                        action: "fetchVacancyPerApplicant",
                        admin: true
                    }
                }).then(function(data){
                    var data = data.trim();
                    console.log(data);
                    if(data !== "false"){
                       toast('Sollicitaties geladen');
                       $scope.vacancies = $scope.formatArray(JSON.parse(data), "Voornaam");
                    }else{
                        toast('Server error');
                    }
                })
            }

             $scope.goToUser = function(userID){
                $scope.requestedUserID = userID;
                $state.transitionTo('Dashboard.sollicitanten');
             }

             /*  $scope.keyUpsHandler = function(keycode){
                
                switch(keycode){
                    case 27:
                        $(".choiceCard").fadeToggle()
                        $("input[name='userType']:checked").val("Admin");
                        $(".hide").fadeToggle();
                    break;
                }
             }*/

             $scope.fetchAllCompanies = function(){
                $.ajax({
                     type: "POST",
                     url: './index.php',
                     data: {
                         admin: true,
                         action: "fetchAllCompanies"
                     },
                     success: function(data) {
                        console.log(data);
                         var data = data.trim();
                         if (data !== "false") {
                             $scope.$apply(function(){
                                $scope.companies = JSON.parse(data);
                                console.log($scope.companies);
                             })
                         }else{
                            toast('Server error');
                         }
                     }
                 });
             }
             

             $scope.deleteCompany = function(bedrijfID, index){
                var confirmation = confirm('Wilt u dit bedrijf zeker verwijderen?');
                if(confirmation){
                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "deleteCompany",
                            admin: true,
                            bedrijfID: bedrijfID
                        }
                    }).then(function(data){
                        var data = data.trim();
                        console.log(data);
                        if(data !== "false"){
                           toast('Bedrijf verwijdered');
                           $scope.$apply(function(){
                            $scope.companies.splice(index, 1);
                           });
                        }else{
                            toast('Server error');
                        }

                    });
                }
             }  

             $scope.deleteUser = function(userID, index){
                var confirmation = confirm('Wilt u deze gebruiker zeker verwijderen?');
                if(confirmation){
                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "deleteUser",
                            admin: true,
                            userID: userID
                        }
                    }).then(function(data){
                        var data = data.trim();
                        console.log(data);
                        if(data !== "false"){
                           toast('User verwijdered');
                           $scope.$apply(function(){
                            $scope.users.splice(index, 1);
                           });
                        }else{
                            toast('Server error');
                        }

                    });
                }
             }

             $scope.deleteVacancy = function(vacatureID, index){
                $("#vacatureProgress").show();
                var confirmation = confirm('Wilt u deze vacature zeker verwijderen?');
                if(confirmation){
                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data: {
                            action: "deleteVacancy",
                            admin: true,
                            vacatureID: vacatureID
                        }
                    }).then(function(data){
                        var data = data.trim();
                        console.log(data);
                        if(data !== "false"){
                           toast('Vacature verwijdered');
                           $scope.$apply(function(){
                            $scope.vacatures.splice(index, 1);
                            $("#vacatureProgress").hide();
                           });
                            
                        }else{
                            toast('Server error');
                        }

                    });
                }
             }

             $scope.resetFilter = function(){
                $scope.userSearchFilter = "";
                $scope.requestedUserID = "";
             }


             $scope.registerAdmin = function(){
                console.log($("#email").val());
                
                if ($("#password").val() !== $("#passwordRepeat").val()) {
                    $(".passwordContainer").addClass("is-invalid");
                } else if($("#email").val() && $("#password").val()){
                    $(".passwordContainer").removeClass("is-invalid");
                    $(".emailContainer").removeClass("is-invalid");

                    $.ajax({
                        type: "POST",
                        url: './index.php',
                        data:{
                            action: "registerAdmin",
                            admin: true,
                            email: $("#email").val(),
                            password: $("#password").val(),
                            profielFoto: ""
                        }
                    }).then(function(data){
                        var data = data.trim();
                        console.log(data);
                        if(data === "true"){
                            toast('Admin Toegevoegd');
                        }
                        if(data === "false"){
                            toast('Server Error');
                        }
                        if(data === "duplicate"){
                            toast('Admin bestaat al');
                        }
                    });
                }else if(!$("#email").val()){
                    $(".emailContainer").addClass("is-invalid");
                }else if(!$("#password").val()){
                    toast('Wachtwoord is verplicht');
                }
             }

             $scope.voegFunctieToe = function(){
                $.ajax({
                    type: "POST",
                    url: './index.php',
                    data:{
                        action: "voegFunctieToe",
                        admin: true,
                        functie: $("#functieNaam").val()
                    }
                }).then(function(data){
                    var data = data.trim();
                    console.log(data);
                    if(data === "true"){
                        toast('Functie toegevoegd');
                    }
                    if(data === "false"){
                        toast('Functie niet toegevoegd')
                    }
                    if(data === "duplicate"){
                        toast('Functie bestaat al');
                    }

                })
             }
    }]);