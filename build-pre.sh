#!/usr/bin/env bash

npm install

#Run tests & generate coverage
#./node_modules/.bin/nyc --reporter=lcov npm test

#Run migrations
node ./node_modules/db-migrate/bin/db-migrate up --force-exit

#Restart server if OK
pm2 delete fanelli-pre || true
pm2 start index.js --name fanelli-pre

#Fix coverage absolute path & upload to sonarqube
sed -i "s|SF:$PWD/|SF:|g" "coverage/lcov.info"


#Build frontend
cd front
npm install
npm run build
#npm run unit

#sed -i "s|SF:$PWD/|SF:|g" "test/unit/coverage/lcov.info"


#/opt/sonar-scanner/bin/sonar-scanner -Dsonar.login="$SONAR_LOGIN" -Dsonar.password="$SONAR_PASSWORD"
#cd ..
#/opt/sonar-scanner/bin/sonar-scanner -Dsonar.login="$SONAR_LOGIN" -Dsonar.password="$SONAR_PASSWORD"


