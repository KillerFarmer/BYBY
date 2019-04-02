# Sign In/Up
One of the main aspects of any WebApp that allows users to sign up is the ability to *store* said users, we could have a local database of user information and encrypt that information ourselves, but that seems like a major security hazard and a legal liability if anything goes south. Fortunately, AWS provides a unique service that handles both of these concerns for us: [Cognito](https://aws.amazon.com/cognito/ "Cognito"). Additionally, this allows us to implement authorization tokens so that only registered users can make us of our site functionality (lambda functions) which we'll discuss later on. One of our main inspirations for setting up such system was Amazons' own [Serverless WebApp Workshop](https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/ "AWS' workshop") which provided us with the tools to implement it in our code. 

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

Most of this are pretty self-explanatory, the first 4 containing essential functions that serve to communicate AWS' services with our API. Config.js handles credentials and tells AWS which user pool to use, on which servers are the files located, and which API to communicate with. 
## Flow
* First, we enter the BYBY WebApp by default there's no registered user, so it redirects the user to the login page. Since we intended to create a user, we click the Sign Up link. 
![login.js](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/signin.png "login.js")
* After we are redirected to the Sign Up view, it's only a matter of filling the information and clicking the Sign Up button.
![sign-up.js](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/signup.png "sign-up.js")
* Subsequently, we are redirected to the verify view which asks us for our email in order to send a verification code, after the email is confirmed the WebApp redirects us to the login page where we can now login without problems. Alternatively, if one does not recieve a code there's a link that can be clicked in order to redirect to the resend view. 
![verify.js](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/verify.png "verify.js")
* In this view we only need to provide the email so that another confirmation message can be sent, and to finally redirect us to the verify view so we can resume the sign up process.
![resend.js](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/resend.png "resend.js")