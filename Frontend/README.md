                                 PROJECT DEPLOYMENT STEPS

Project Summary:
This project aims to implement CRUD (Create, Read, Update, Delete) operations for managing domains, subdomains, and documents stored in Elasticsearch, with a primary focus on providing a seamless and efficient data search experience.
Tools and dependencies:
1.	Elastic search 8.8.2 
2.	Kibana  8.8.2
3.	Vs code  editor 
4.	Node js  18.16.1
5.	PostMan 
Procedure to run project:
STEP 1:    Install the  “ELASTIC SEARCH”   
STEP 2:   Go to “TERMINAL”  change directory into  elastic search bin
STEP 3:   Run the command “ELASTICSEARCH”
3.1   SERVER STARTED PIC
 
STEP 4: Wait until “SHARDS STARTED” this indicates the elastic search server is started
If you are installing elasticsearch first note down the “TOKEN ID” and “PASSWORD”  
	
STEP 5:   Install the “KIBANA “

STEP 6:   Go to “TERMINAL” change directory into kibana bin 

STEP 7:   Run the command “kibana”
 7.1  KIBANA STARTED PIC     

STEP 8:   Wait until this command appear if it is done go to the browser search 
http://localhost/5601

STEP 9:    Open the project folder in vs code editor

STEP 10:    Open terminal run “npm start” 
 

STEP 11:  Open another terminal change the directory to “backend” 

STEP 12:  Run the command “npm run server”
 
 STEP 13:  Now Open postman  run the API
For create:  http://localhost:8000/domain/subdomain/create
For search: http://localhost:8000/domain/subdomain/search 
For delete:  http://localhost:8000/domain/subdomain/delete
For update: http://localhost:8000/domain/subdomain/update


 
 


