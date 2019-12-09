#!/usr/bin/env bash

npm install
#mocha --timeout 0 --exit
node ./node_modules/db-migrate/bin/db-migrate up --force-exit
pm2 list
pm2 delete fanelli-prod || true
pm2 start index.js --name fanelli-prod

cd front
npm install
npm run build
#npm run unit
