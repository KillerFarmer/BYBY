# View Batches and Recipes
This information is displayed in the home view which by default will initially be blank, and will only be filled after the user has made one of the following:
* [A batch](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/batch.md "Make a batch")
* [A recipe](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/recipe.md "Register a recipe")

![home](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/homeblank.png "home")

Once the user has created either a recipe or a batch, the home page will show them in a list style.

![home](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/home.png "Home done")
## User Stories 
### See my recipes
**As a** user **I want to** click a recipe **so that** I can its ingredients and description.
### Menu
**As a** user **I want a** menu **so that** I know what I can do with BYBY.
### Batch list
**As a** user **I want to** see the list of batches in the homepage **so that** I know which has been created.
### View state of a batch
**As a** user **I want to** check on the state of a brewing batch **so that** I can know when to pick up a batch.
## Important Files 
* [home.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/home.js "home.js")

Home includes the use of a custom service in order to pass the batch information to the monitoring view, it also includes showing alerts dynamically depending on recipe selected, and organizing the batches by either name or date, as was the case in the make a batch view.
## Flow
The flow now includes two branches on how to proceed, one could either select a recipe to view their information or a batch in order to monitor its progress after it has been started. Note that you can't monitor a batch if it hasn't started. 
### Recipe
![recipe](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/homerec.png "Recipe")

Viewing the recipe information is pretty straight forward, it's only a matter of clicking a recipe from the list and a pop up will appear showing such data. 

![recipe1](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/homerec1.png "Recipe 1")
![recipe2](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/homerec2.png "Recipe 2")

As you can see all the recipe information is displayed including the date it was created, an ingredient list and its restrictions. Afterwards, we can just click "OK" to close the pop up.
### Batch
![batch](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/homebatch.png "Batch")

Batches are displayed on the left side of the view, displaying their information without needing the user to click on them unlike the recipe. As we can see it shows its name, on which facility it's stored and finally its state. Now we can just [start a batch](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/biocomms.md#start-a-batch "start a batch") in order to [monitor](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/monitor.md "home") its progress by clicking on the batch. 