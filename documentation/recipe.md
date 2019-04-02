# Register a Recipe
## User Stories 
### Validating and storing new recipe values
**As a** user **I want** the app to verify the values I provide **so that** I am not allowed to enter wrong data.

### Capture ingredients
**As a** user **I want to** add multiple ingredients **so that** my beer is tasty.

### Capturing a beer recipe
**As a** user **I want to** record my beer recipes **so that** I can retrieve them when I’m ready to brew a new batch.

### Specifying sensor ranges
**As a** user **I want to** specify a range for the readings of a sensor **so that** my beer is not ruined.

## Important Files 
* [register-recipe.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/register-recipe.js "register-recipe.js")

All of the functions are stored here, Regular Expresions are used to validate user input.
## Flow
| Material     | Quantity   |
|--------------|------------|
| Water        | 4 L        |

### Hops   

| Material     | Quantity   |
|--------------|------------|     
| Hops 1       | 200 gr     |
| Cafe Hop     | 300 gr     |

### Yeast 

| Material     | Quantity   |
|--------------|------------|  
| Yeast 2      | 400        |

### Syrup

| Material     | Quantity   |
|--------------|------------|  
| Azucar glass | 100        |

### Restrictions

| Sensor       | Min        | Max    |
|--------------|------------|--------|  
| Temperature  | 10°C       | 25°C   |
| PH           | 5          | 9      |
| Pressure     | 534hPa     | 856hPa |

![Recipe1](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/recipe1.png "Recipe")
![Recipe2](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/recipe2.png "Recipe")
![Recipe3](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/recipe3.png "Recipe")
![Success](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/recipesuccess.png "Success")