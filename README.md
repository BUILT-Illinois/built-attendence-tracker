# B[U]ILT Membership and Point System

This project is a membership and attendance tracking system for B[U]ILT. It allows members to log in using their @illinois.edu email, check into events using QR codes, and automatically receive points for participation. Admins can create events and monitor member engagement without manually awarding points.

## Features

- Google OAuth login restricted to @illinois.edu
- Admin dashboard for event creation
- Member check-in via QR code
- Automated point tracking and attendance logging
- Member and admin dashboards

## Tech Stack

- Frontend: React.js (hosted on AWS)
- Auth: Google OAuth via Firebase
- Backend: AWS Lambda (Node.js) + API Gateway
- Database: MongoDB Atlas

## Getting Started

This repository will include the backend API logic, helper utilities, and the website itself.

```
cd built_attendance
npm install
npm start
```

## Best Practices

 To ensure our repository has less conflicts and to ensure everyone can develop fluidly we will implement best practices on branching, code reviews, descriptive naming/messages, modular reusable code, and commits.

 Please read up on these best practices as well, [What are Git version control best practices?](https://about.gitlab.com/topics/version-control/version-control-best-practices/)

### Branching

 Feature branching is a great way for teams to split up work and ensure there are reduced merge conflicts. This also ensures that the scope of pull requests are focused and specific. 

 A branch should be named with a proper name as well to signal to others what the purpose of the banch is, who is working on the branch, and where a feature will be located. 

 For example a branch for a rotating photo carousel feature on an about page by Steven can take on the form:  ***stevenuru/about/rotating-carousel***

### Commits

 Commits to a branch should be done granularly with frequency. Commiting large changes to a codebase can make it difficult for reviewers to gather a sense of what's going on and can make it more difficult to spot errors in one's code merge.

 Branch merges to main should also be reviewed by another committee member to reduce the risk of errors and to maintain a clean codebase.

### Writing Code

 #### Modularity
 
 Code should be written with reusability and modularity in mind. Functions should be used when possible to decrease repetititve code and makes it easier for reviewers to read when done right. Files should also be split up based on the functionality/purpose of the file. 

 #### Comments

 Comments should be used when the code itself cannot communicate to others what is happening. We should strive to use descriptive (although short) comments when defining new functions. This helps ramp up learning whenever someone new is introduced to the codebase
