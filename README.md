# vacaturebank

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

####Description
---
School assignment where people can apply for jobs that are created by companies.

This readme will be worked on.
