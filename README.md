# vacaturebank

##Note

While this project is a part of portfolio, I wouldn't recommend using any of the AJAX patterns in vacaturebank/scripts/dashboard.js as they are pretty much anti pattern. If you're working on an angular 1.x project and you're looking to communicate with a backend. Make sure you use the [http](https://docs.angularjs.org/api/ng/service/$http) service and try to stay away from jQuery as it goes against the angular mindset.


##Setup
---
Import vacaturebank.sql
Change database credentials under classes/database.php

#####Test accounts

| User type        | Email       | password | 
| ------------- |:-------------:| :-------------: |
| Admin    | admin@gmail.com | test |
| Applicant | Applicant@gmail.com  | test  |      
| Company |   Company@gmail.com     | test |

####Notes
---
- Forgetting password script won't work on a non linux machine, line 245 @ classes/Authentication.php needs to be modified with the server supported mail command.
- If you need gulp or livereload, you can install all the development dependencies using the npm install command & then run gulp
- Looking back at this application, its certainly one of the biggest one I have created. But I see a lot of potential bugs in my code and I am not doing everything in the best possible way which (I am talking about my JS code)

####Description
---
This is a school assigment where I had to create a web application where companies would post vacancies that applicants would then apply on. 

The application has the following functionality

- Registeration for both companies and applicants
- Companies can CRUD vacancies
- Applicants can apply on any vacancy
- Companies and applicants can change their own info
- Companies can view all applicants
- Companies can see who applied on their vacancies
- Admins can CRUD vacancies, applicants and users
- People can request to change their password 

In this application I got into object oriented programming with PHP, and used AJAX in combination with that for this webapp.

Main reason I used AJAX is because ui-router turned this project into a single page application which I wouldn't have been able to do with PHP.

