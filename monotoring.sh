currentDate=`date` +"%Y%m%d%H%M"
dirName="monotoring_$currentDate"
rm /home/lucas/backup/backup.log
filePath=/home/lucas/backup/$dirName
mkdir $filePath
mongodump --db fanelli_prod  --out $filePath
