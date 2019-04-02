# Sign In/Up
One of the main aspects of any WebApp that allows users to sign up is the ability to *store* said users, we could have a local database of user information and encrypt that information ourselves, but that seems like a major security hazard and a legal liability if anything goes south. Fortunately, AWS provides a unique service that handles both of these concerns for us: [Cognito](https://aws.amazon.com/cognito/ "Cognito"). Additionaly, this allows us to implement authorization tokens so that only registered users can make us of our site functionality (lambda functions) which we'll discuss later on. One of our main insperations for setting up such system was Amazons' own [Serverless WebApp Workshop](https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/ "AWS' workshop") wich provided us with the tools to implement it in our code. 

## User Stories 
### Login into my account  
**As** a user **I want to** provide my e-mail and password **so that** I can identify myself.
### Creating a new account
**As** an unregistered user **I want to** create an account **so that** my data is stored.
### Register account 
**As** an unregistered user **I want to** provide and email and password **so that** my account is secure.
## Important Files 
* [resend.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/resend.js "resend.js")
* [sign-up.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/sign-up.js "sign-up.js")
* [verify.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/verify.js "verify.js")
* [login.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/login.js "login.js")
* [config.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/config.js "config.js")

Most of this are pretty self-explanatory, the first 4 containing essential functions that serve to communicate AWS' services with our API. Config.js handles credentials and tells AWS which user pool to use, on which servers are te files located, and which API to communicate with. 
## Flow
* First, we enter the BYBY WebApp by default there's no registered user so it redirects the user to the login page. 
  ![login.js](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/img/signin.png "login.js")
* 