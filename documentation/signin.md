# Sign In/Up
One of the main aspects of any WebApp that allows users to sign up is the ability to *store* said users, we could have a local database of user information and encrypt that information ourselves, but that seems like a major security hazard and a legal liability if anything goes south. Fortunately, AWS provides a unique service that handles both of these concerns for us: [Cognito](https://aws.amazon.com/cognito/ "Cognito"). Additionaly, this allows us to implement authorization tokens so that only registered users can make us of our site functionality (lambda functions) which we'll discuss later on. One of our main insperations for setting up such system was Amazons' own [Serverless WebApp Workshop](https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/ "AWS' workshop") wich provided us with the tools to implement it in our code. 

## User Stories 

### Login into my account
#### Story 
As a user I want to provide my e-mail and password so that I can identify myself.
#### BDD
**Given** that I am on the login page and I am registered

**When** I enter "example@examplemail.com" and "aAbc1235;" as e-mail and password, respectively and click the Login Button

**Then** I am sent to the homepage.

### Creating a new account
#### Story
As an unregistered user I want to create an account so that my data is stored.

#### BDD
**Given** that I am on the login page

**When** I click the register account button

**Then** I am redirected to the register account page.

### Register account
#### Story
As an unregistered user I want to provide and email and password so that my account is secure.

#### BDD
**Given** that I am on the register account page

**When** I enter "example@examplemail.com" and "aAbc1235;" as e-mail and password, respectively and click the Register Button

**Then** a pop-up appears telling me that a confirmation e-mail has been sent and I am redirected to the verify e-mail page.

## Important Files 

## Flow