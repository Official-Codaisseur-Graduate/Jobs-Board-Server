# Preface
- This repository is a continuation by members of Codaisseur class #27 of the "Jobs Board" real world project that was started by members of Codaisseur class #26. The original repo can be found here https://github.com/hastinc/Jobs-Board-Server.

# Table of contents
- [Jobs Board Server](#Jobs-Board-Server)
- [Technologies used](#Technologies-used)
- [Access](#Access)
- [Setup](#Setup)
- [API](#API)
- [Huntr](#Huntr)
- [De-duplication Algorithm](#De-duplication-Algorithm)
- [Suggestions](#Suggestions)

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

The Front-end for the following repo may be found [here](https://github.com/Official-Codaisseur-Graduate/Jobs-Board-Client)

The Backend is deployed to heroku [here](
https://sleepy-tor-95168.herokuapp.com)

## Technologies used
- PostgreSQL
- Express
- Sequelize

## Access
Please ask your product owner for admin access to the  Codaisseur’s Huntr account or for a valid token.
Create a new token if you now have admin access.
Save the token as an “env” variable in your terminal:
```bash
export token=<token>
```
```bash
echo $token
```

## Setup
Please note that in order to run the server locally you must also start a Postgres container
using the following commands
```bash
$ docker run \
  --rm \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres
```
- git clone
- npm install
- npm run start

Make sure you have HTTPie installed by checking 'http --version' in the terminal, if not install it.
- Mac: brew install httpie
- Linux: sudo apt-get install httpie

To get all the data or update the data from the Huntr API into the database, run this HTTP request in the terminal:
```bash
http POST :4000/copy-companies
```
```bash
http POST :4000/copy-jobs
```
```bash
http POST :4000/copy-members
```
Please note that running locally will not provide you with the most recent and accurate data regarding “events”. For this please connect to the API database. See [Connect to API database].
```bash
http POST :4000/copy-events
```

Connect to your database with:
- Mac: Postico
- Linux: DBeaver

Connect to API database:
- Please ask your product owner for the database credentials in order to access the API database. 

If everything went well, you are now able to see a populated companies, jobs, members, events and duplicates table in your database.

## API

MODELS:
- Companies -> employers inputted by Codaisseur Graduates in Huntr
- Jobs -> jobs with inputted by Codiasseur Graduates in Huntr
- Members -> Codaisseur Graduates
- Events -> Actions done by Codaisseur Graduates
- Entries -> (not implemented in routes yet) timeline of Jobs in relation to Members

ENDPOINTS:
\<base url\> is either http://localhost:4000 for local development or https://sleepy-tor-95168.herokuapp.com for the deployed backend.
</br>
Fetches all the companies/jobs/members/events from the Huntr API and stores them in the database:
- POST \<base url\>/copy-companies 
- POST \<base url\>/copy-jobs
- POST \<base url\>/copy-members
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

To create a valid token :
Admin —> developers —> Access Tokens —> Add Token

- Webhook:

Current endpoint: https://sleepy-tor-95168.herokuapp.com/events
Please note that if you wish to add a new endpoint or edit the name of the URL of the deployed API, it might take some time (ie. 24 hours) before Huntr will recognise it as a valid endpoint.
To create a new webhook endpoint:
Admin —> developers —> Webhooks —> Add Endpoint
Also note that a webhook is always a POST endpoint and always response with a HTTP status code of 200.

- Events:

The Huntr API sends 2 types of events through to the webhook endpoint. These are identified by the “eventType” field: “JOB_ADDED” or “JOB_MOVED”.
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


## [De-duplication algorithm](./Huntr/companies/removeDuplicates.js)
This module de-duplicates the companies you get by calling the Huntr API at the /employers endpoint. 
- The de-duplication algorithm first takes out the companies where no-one from Codaisseur applied. 
- Then we iterate over the list of companies and compare it to all the companies in the list for each iteration to find duplicates. 
- Before we actually compare the names we use regular expressions to transform the company names to lowercase and filter out all characters following “-“ or “|”. It also ensures we only leave characters matching letters from the Latin alphabet or numbers. 
- Then we use the node package string-similarity to give us a matching score. 
- If it’s bigger than a set threshold we add the contents of the duplicate company to the company we’re comparing with. Then we remove the duplicate company. 
- Once we’re done iterating over the whole list of companies we add them to our database table called “companies’. 
- We’re also keeping track of the thrown away duplicates and store which company in the “companies” table they’re related to. This might be nice if you want to use other endpoints of the Huntr API and need the information of the thrown away duplicates. 



