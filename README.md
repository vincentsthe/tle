# TLE
TLE is a statistic aggregator for TLX, inspired by uHunt (http://uhunt.felix-halim.net/).

## Requirement
* nodeJS
* npm
* MySQL
* Redis (tested on version 3.0.6, but any version should do)

## Setup
* Run `npm install` on project directory
* Create database and import file `db.sql`
* Copy `config.json.default` to `dbConfig.json` and configure it with database and redis connection information.
* In database config, db is the database you created (from db.sql) and the other is TLX database credential

## Launching TLE
* Run `node init.js`, this script used to populate redis cache
* After init.js finish executing, run `node server.js` and `node cron.js`
* TODO: create script to manage launch script

## Concept
TLE use aggregated data heavily and will make TLX database load became very high.
Cron is running to denormalize TLX database and lazy load statistic data from TLX database.
TLE use redis heavily to cache request and store user and problem rank.

For question and contribution, please contact vincent.s.the@gmail.com
