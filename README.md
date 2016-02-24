# TLE Bridge
This is repository for TLE Bridge, cron based program to populate TLE database from TLX database.

## About TLE
TLE is a statistic aggregator for TLX, inspired by uHunt (http://uhunt.felix-halim.net/).

## Setup
* Create database and import file db.sql
* Copy dbConfig.json.default to dbConfig.json and configure it with database information.
* db is the database you created (from db.sql) and the other is TLX database credential

## Concept
TLE use aggregated data heavily and will make TLX database load became very high. This program is basiccally denormalize TLX database and lazy load statistic data from TLX database.

For question and contribution, please contact vincent.s.the@gmail.com
