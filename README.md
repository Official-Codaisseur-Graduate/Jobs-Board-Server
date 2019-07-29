# Preface
- This repository is a continuation by members of Codaisseur class #27 of the "Jobs Board" real world project that was started by members of Codaisseur class #26. The original repo can be found here https://github.com/hastinc/Jobs-Board-Server.

# Table of contents
- [Jobs Board Server](#Jobs-Board-Server)
- [Technologies used](#Technologies-used)
- [Setup](#Setup)
- [API](#API)
- [De-duplication Algorithm](#De-duplication-Algorithm)

## Jobs Board Server
This is a node.js server for the Jobs Board real world project - which was 
created and worked on during weeks 9-10 of the Codaisseur Academy.
The contributors are:
Class #26 members:
#[Tiago Barros](https://github.com/limadebarros),
#[Cathal Hastings](https://github.com/hastinc),
#[Hager Hussein](https://github.com/hagerhussein), 
#[Dave Mollen](https://github.com/davemollen)

#Class #27 members:
#[Jetske van der Wouden](https://github.com/JetskevdWouden),
#[Tatiany Costa](https://github.com/TatyCris),
#[Alina Beglarian](https://github.com/alinabeglarian),
#[Marlon Palpa](https://github.com/malanchito)

The Front-end for the following repo may be found [here](https://github.com/Official-Codaisseur-Graduate/Jobs-Board-Client)

The Backend is deployed to heroku [here](
https://sleepy-tor-95168.herokuapp.com)

## Technologies used
- PostgreSQL
- Express
- Sequelize

## Setup
Please note in order to run the server locally you must also start a Postgres container
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

Connect to your database with:
- Mac: Postico
- Linux: DBeaver

If everything went well, you are now able to see a populated companies and duplicates table in your database.

## API
\<base url\> is either http://localhost:4000 for local development or https://glacial-thicket-13029.herokuapp.com for the deployed backend.

- POST \<base url\>/copy-companies 

  Fetches all the companies from the Huntr API and stores them in the database.
- GET \<base url\>/companies

  Fetches 12 companies from the database. Query parameters are page, sortBy and search.
- GET \<base url\>/companies/:id

  Fetches a company with a specified id from the database.
- GET \<base url\>/companies/indeed/:name

  Tries to find a company in the database with a similar name to the one given.
- GET \<base url\>/jobs

  Fetches jobs with the Indeed scraper. Query parameters are query (i.e. description) and city.


## [De-duplication algorithm](./Huntr/companies/removeDuplicates.js)
This module de-duplicates the companies you get by calling the Huntr API at the /employers endpoint. 
- The de-duplication algorithm first takes out the companies where no-one from Codaisseur applied. 
- Then we iterate over the list of companies and compare it to all the companies in the list for each iteration to find duplicates. 
- Before we actually compare the names we use regular expressions to transform the company names to lowercase and filter out all characters following “-“ or “|”. It also ensures we only leave characters matching letters from the Latin alphabet or numbers. 
- Then we use the node package string-similarity to give us a matching score. 
- If it’s bigger than a set threshold we add the contents of the duplicate company to the company we’re comparing with. Then we remove the duplicate company. 
- Once we’re done iterating over the whole list of companies we add them to our database table called “companies’. 
- We’re also keeping track of the thrown away duplicates and store which company in the “companies” table they’re related to. This might be nice if you want to use other endpoints of the Huntr API and need the information of the thrown away duplicates. 

Suggestions:
- Algorithm needs more thorough testing
- You could expand upon the regular expressions to filter out more exceptions. 
- The regular expressions get rid of any Cyrillic or Arabic characters, which might be a problem. 
- You might want to write some exception handling explicitly for the cases where the algorithm fails
- When the algorithm finds a match and removes it from the list, it isn’t up for comparison anymore in the next iteration. However, it is possible to include the duplicates for comparison. The removed company names are accessible in the duplicates property of each company. So it might give you better results to include these names for the comparison too. Not sure if it will improve significantly though…. 
