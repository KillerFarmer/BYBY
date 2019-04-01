# BYBY
This proyect was a collaboration between CETYS University and ThermoFisher Scientific as a part of the "Train the Trainees" program. 
Team Members (In alfabetical order):
* Adrian Chouza (Internal Product Owner)
* Alejandro Gastelum
* Alejandro Andrade (SCRUM master)
* Edgar Alcantara
* Francisco Chavez
* Jose Luis Jimenez
* Juan Carlos Martinez
* Miguel Medrano
* Raul Hernandez
* Ricardo Ricartti
* Sandra Nogales
* Sarahy Rivera
  
Additionaly, the following profesors and ThermoFisher Scientific representatives assisted in the development of the proyect (In alfabetical order):
* Adan Hirales
* Alejandra
* Luz Lozano
* Nataly 
  
The team was tasked to develop a solution for the following user story: 
> Luz wishes to brew a batch of her own ***duff*** recipe.
>
> She uses Alejandra's Brew Your Batch Yourself Inc. (**BYBY**) service to produce her batch. From her home, Luz connects to the **BYBY** page and captures her recipe. On capture, the recipe properties, restrictions and procedures are stored. 
>
> Next day, Luz gathers her ingredients and opens the **BYBY** app. Shes selects her recipe, sees a list of **BYBY** facility locations that comply wit the recipe restrictions and heads to the nearest one. On arrival, she queries her stored recipes and selects one for brewing. On confirmation, a bioreactor is assigned to her and a list of available sensors are displayed. Finally, she selects the ones that she wants to monitor and confirms. 
>
> On the bioreactor location, she places the recipe items in labeled bins and presses the start button. On start, the system initiates the diagnosis phase. On diagnosis, the machine evaluates sensors, actuators, and communications subsystems are correct. During diagnosis, communicates this process to the user, by emitting a chirping sound and displaying a light (yellow). On successful diagnosis, the machine retrieves assigned recipe and initiates the brewing process. During the brewing process, the machine displays a light indicating it is busy (green). Luz heads back to her duties and leaves the facility.
> 
> During the brewing process, the bioreactor output sensors are read, at independent frequencies. Data are labeled with the recipe id and timestamp. Gathered data is pushed to the **BYBY** cloud and stored in the users repository. Sometimes, things go wrong during brewing. On an alert, an email is sent to the user describing the batch state.
> 
> Sporadically, Luz checks a batch. To do so, she connects to **BYBY** and request to see her list of batches. The list is displaytted in chronological order, but she can view the list in lexicographical order of the batch name or its state. On a selection of a batch, a view showing the chronological state of sensors is displayted an the overall state of the brewing proces is illustrated.

The team decided to use Amazon Web Services (AWS) for the development of the proyect, a Raspberry Pi to simulate the bioreactor, and settled on a WebApp format (using Angular, Java Script, HTML and materialize). In order to have a clearer picture of what was going to be developed the following arquitecture was proposed. 

![alt text](https://github.com/KillerFarmer/BYBY/tree/documentation/documentation/img/arquitecture.png "Arquitecture")

Index: