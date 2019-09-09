# Preface
- This repository is a continuation by members of Codaisseur classes #28 and #27 of the "Jobs Board" real world project that was started by members of Codaisseur class #26. The original repo can be found here https://github.com/hastinc/Jobs-Board-Server.

# Table of contents
- [Jobs Board Server](#Jobs-Board-Server)
- [Technologies used](#Technologies-used)
- [Access](#Access)
- [Setup](#Setup)
- [API](#API)
- [Huntr](#Huntr)
- [De-duplication Algorithm](#De-duplication-Algorithm)

## Jobs Board Server
This is a node.js server for the Jobs Board real world project - which was 
created and worked on during weeks 9-10 of the Codaisseur Academy.
The contributors are:

Class #26 members:
- [Tiago Barros](https://github.com/limadebarros),
- [Cathal Hastings](https://github.com/hastinc),
- [Hager Hussein](https://github.com/hagerhussein), 
- [Dave Mollen](https://github.com/davemollen)

Class #27 members:
- [Jetske van der Wouden](https://github.com/JetskevdWouden),
- [Tatiany Costa](https://github.com/TatyCris),
- [Alina Beglarian](https://github.com/alinabeglarian),
- [Marlon Palpa](https://github.com/malanchito)

Class #28 members:
- [Meenakshi Venkat](https://github.com/meena333),
- [Julia Jankowska](https://github.com/julenia),
- [Suhas K N](https://github.com/suhaskn),
- [Gergő Kovács](https://github.com/gergokutu)

The Front-end for the following repo may be found [here](https://github.com/Official-Codaisseur-Graduate/Jobs-Board-Client)

The Backend is deployed to heroku [here](
https://sleepy-tor-95168.herokuapp.com)

## Technologies used
- PostgreSQL
- Express
- Sequelize

## Setup
Please note that in order to run the server locally you must also start a Postgres container
using the following commands
```bash
$ docker run -p 5432:5432 --name job_board  -e POSTGRES_PASSWORD=secret -d postgres
```
- git clone
- npm install
- npm run dev

Make sure you have HTTPie installed by checking 'http --version' in the terminal, if not install it.
- Mac: brew install httpie
- Linux: sudo apt-get install httpie

To get all the data or update the data from the Huntr API into the database, run this HTTP request in the terminal (use the order of commands displayed below):
```bash
http POST :4000/copy-companies
```
```bash
http POST :4000/copy-members
```
```bash
http POST :4000/copy-jobs
```
Note: for the last copy-jobs endpoint you might have to increase the timeout. In case you run into this problem, use (you can modify the amount of seconds for which you want to increase it, but 300s should be a safe solution):
```bash
http POST :4000/copy-jobs --timeout=300
```

Note: The copy-jobs/:id endpoint can be used when you have to create a new database remotely (for e.g. in Heroku). This basically copies all the jobs from the Huntr API into the database in chunks of 1000 records or less instead of copying all at once (which is what the /copy-jobs endpoint above does). This was a way to deal with Heroku's timeout issues. The usage for this would be to use with id = 1,2,3 ..until the response is 'No more jobs data available'.
```bash
http POST :4000/copy-jobs/1
http POST :4000/copy-jobs/2
http POST :4000/copy-jobs/3
http POST :4000/copy-jobs/4
```

Connect to your database with:
- Mac: Postico
- Linux: DBeaver

Connect to API database:
- Go to the Official Codaisseur Graduate Github --> Projects --> Jobs Board --> Credentials. Here you will find the credentials needed to access the API database.

If everything went well, you are now able to see a populated companies, jobs, members, events and duplicates table in your database.

## Access
Go to the Official Codaisseur Graduate Github --> Projects --> Jobs Board --> Credentials. Here you will find the most recent token. If this token is not valid anymore, ask your product owner for admin access to the  Codaisseur’s Huntr account and then create a new token.
If you have no admin access to the Codaisseur Huntr ask your product owner for a valid token.

To implement the token:
- install module "dotenv"
- create a .env file in the root directory (/Jobs-Board-Server)
- the .env file should copy the .env.default values with the valid token
- insert the token manually into the .env file

Your files should look like this:

./.env
```bash
API_TOKEN=<token>
```

./.env.default
```bash
API_TOKEN=
```

## API

MODELS:

- Companies -> employers inputted in Huntr by Codaisseur Graduates
- Jobs -> jobs inputted in Huntr by Codaisseur Graduates (not open vacancies, each graduate creates a job when he or she applies for a position => 1 real vacancy can have multiple jobs (couple of Codaisseur Graduates applied to the same position))
- Members -> Codaisseur Graduates
- Events -> Actions performed by Codaisseur Graduates
- Entries -> (not implemented in routes yet) timeline of Jobs in relation to Members

ENDPOINTS:

\<base url\> is either http://localhost:4000 for local development or https://frozen-meadow-51398.herokuapp.com for the deployed backend.
</br>

Fetches all the companies/jobs/members/events from the Huntr API and stores them in the database:
- POST \<base url\>/copy-companies 
- POST \<base url\>/copy-members
- POST \<base url\>/copy-jobs

Fetches jobs in batches of 1000 from the Huntr API and stores them in the database (used for pushing data to heroku database, to avoid the timeout). Usage: id=1 => jobs 0-999 , id=2 => jobs 1000-1999 etc:
-POST \<base url\>/copy-jobs/:id

*WARNING ONLY POST COPY-EVENTS WHEN RUNNING YOUR LOCAL DATABASE so http :4000/ NOT the heroku deployment*
- POST \<base url\>/copy-events

Fetches 12 companies from the database. Query parameters are page, sortBy and search:
- GET \<base url\>/companies

Fetches a company with a specified id from the database:
- GET \<base url\>/companies/:id

Fetches all companies from the Huntr API without pagination:
- GET \<base url>/allcompanies

Fetches jobs with the Indeed scraper. Query parameters are query (i.e. description) and city:
- GET \<base url\>/jobs

Webhook endpoint. Receives post requests from the Huntr API every time a new “event” has occurred. See [Huntr](#Huntr) for        more information:
- POST \<base url>/events

Fetches all events from the Huntr API:
- GET \<base url>/events

Fetches all active members from the Huntr API:
- GET \<base url>/members/active


## Huntr
- Token:

To create a valid token (if you have admin access to Huntr):

Admin —> developers —> Access Tokens —> Add Token

- Webhook:

Current endpoint: https://frozen-meadow-51398.herokuapp.com/events

Please note that if you wish to add a new endpoint or edit the name of the URL of the deployed API, it might take some time (ie. 24 hours) before Huntr will recognise it as a valid endpoint.

To create a new webhook endpoint:
Admin —> developers —> Webhooks —> Add Endpoint

Also note that a webhook is always a POST endpoint and always send back a HTTP status code of 200 as a response.

- Events:

The Huntr API sends 2 types of events through to the webhook endpoint. These are identified by the “eventType” field:
“JOB_ADDED” or “JOB_MOVED”.
There are more event types however through testing we have noticed that Huntr only sends the 2 above mentioned even types.

- Testing:

How to test incoming events:

Admin —> Boards —> Create Boards

Invite yourself or your colleague to the board and set the “advisor” to yourself.
Test by inputting: “adding jobs”, “moving jobs” and setting dates. 
Expected result: Event entities created in the API database matching your input.

- Notes:

The values of the different fields to do with “date” are not accurate coming from Huntr. 

Please see the Huntr API documentation [here](https://docs.huntr.co/#webhooks) for more information.


## De-duplication algorithm
[Companies](./Huntr/companies/removeDuplicates.js)
This module de-duplicates the companies you get by calling the Huntr API at the /employers endpoint. 
- The de-duplication algorithm first takes out the companies where no-one from Codaisseur applied. 
- Then we iterate over the list of companies and compare it to all the companies in the list for each iteration to find duplicates. 
- Before we actually compare the names we use regular expressions to transform the company names to lowercase and filter out all characters following “-“ or “|”. It also ensures we only leave characters matching letters from the Latin alphabet or numbers. 
- Then we use the node package string-similarity to give us a matching score. 
- If it’s bigger than a set threshold we add the contents of the duplicate company to the company we’re comparing with. Then we remove the duplicate company. 
- Once we’re done iterating over the whole list of companies we add them to our database table called “companies’. 
- We’re also keeping track of the thrown away duplicates and store which company in the “companies” table they’re related to. This might be nice if you want to use other endpoints of the Huntr API and need the information of the thrown away duplicates.

[Jobs](./Huntr/jobs/removeDuplicate.js)
This module de-duplicates the jobs you get by calling the Huntr API at the /jobs endpoint. 
- The de-duplication algorithm first takes out the jobs where no-one from Codaisseur applied. 
- Then we iterate over the list of jobs and compare it to all the jobs in the list for each iteration to find duplicates. 
- It will remove all duplicated jobs id's and return only the no duplicated ones.



