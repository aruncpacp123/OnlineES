My Project is an online examination system Build using M(MySql)ERN Stack. The project is developed to conduct exams in an institution efficiently. There are basically three roles Institution Admin, Teacher and Student and there will be System Admin role for managing entire project  and that role is currently under development(Not developed yet due to time restrictions ) .This is done as part of my academics(Individual Project). An institution can register in it and create an admin. Institution's admin can add departments, courses, subjects, manage students and teachers and able to see the exams. Teacher register on site under their institution and can create exams both subjective type and objective(Quiz) type Questions. Quiz is auto correct and  subjective type questions is manually corrected by teacher after student attempts the exam. Teacher can view all students details and marks.
Student can register on an institution and able to view and attempt the exams assigned to them. Quiz Result will be available immediately after exam but subjective type questions result will be available after teacher verification.
In future it is decided to add a professional dashboard all users for result analysis and to show their respective feature analysis.

So here there need a secure login system and only authenticated user can access the system and only the right user can access particular links or users can access the sections they are allowed to access that is Role Based Access System.
OAuth is not used in this system as it is not a finished project but will be use in future .At first there is an google authentication system "GoogleAuthProvider" because I first used firebase as database but later realized it is not suitable for this project and removed it so I also removed that feature by removing firebase .But we can implement it using clerk or any other services 
For login security I used password hashing for security . I used bcrypt for hashing .
Here only Authorized users will get access to system and users access the resources they are intent to use. It is implemented by using private routing in React JS and also by conditional rendering. If users is not authenticated or no access to that resources they will be redirected to login page.

If project doesn't run and to validate code :

The password hashing is in server/server.js file's 49th line onwards

RBAC is in App.jsx and PrivateRoute.js in client/src folder

Each user is navigated to their respective home page after successful login .It is in client/src/login/pages/SignIn.jsx file

For running this project

prerequisite:
node
mysql

 create create a vite react project using the command
npm create vite@latest 

then follow the instructions shown on command
clone the repository to the created project 
create a mysql database by importing sql file in the location client>src>config
to run project
create two terminal one for server and one for client
in one terminal 
cd client
npm run dev

in second terminal
cd server
npm run dev
