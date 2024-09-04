#!/bin/bash
# Estrai i file .bz2 nella directory corrente
FILE=$(find . -maxdepth 1 -name "*.tar.bz2" -print -quit)
echo "Estrazione dei file .bz2..."
tar -xjf $FILE
echo "Rinomina la cartella estratta in 'dump'..."
# Supponendo che il file .bz2 contenga una singola cartella, trova il nome della cartella
BASENAME=$(basename "$FILE" .tar.bz2)
mv ./$BASENAME dump

# Rimuove i file .bz2
echo "Rimozione dei file .bz2..."
rm -f *.bz2

# Esegue il backup di MongoDB
echo "Esecuzione del backup di MongoDB..."
# mongodump --host localhost --port 27017 --archive=dump/mongo.gz --gzip --db agile-factory
mongorestore --archive=dump/mongo.gz --gzip --nsFrom='agile-factory.*' --nsTo='agile-factory.*' --host localhost --port 27017


echo "Operazioni completate."

# rm -rf dump