#!/bin/bash
## Insert users
docker exec lovely-node npm run test -- --user tiago-h-simoes
docker exec lovely-node npm run test -- --user afilipa
docker exec lovely-node npm run test -- --user andreluisce
docker exec lovely-node npm run test -- --user dmsapereira
docker exec lovely-node npm run test -- --user gui1976
docker exec lovely-node npm run test -- --user igor-pavlichenko
docker exec lovely-node npm run test -- --user jouderianjr
docker exec lovely-node npm run test -- --user krcorreia
docker exec lovely-node npm run test -- --user Mozcatel
docker exec lovely-node npm run test -- --user nersoh
docker exec lovely-node npm run test -- --user ramonabejan
## List users in Lisbon
docker exec lovely-node npm run test -- --list Lisbon 'Braga - Portugal'
## Display statistics
docker exec lovely-node npm run test -- --stats
## Truncate table
docker exec lovely-node npm run test -- --trunc