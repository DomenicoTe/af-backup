# Usa un'immagine base di Ubuntu
FROM ubuntu:22.04
# Installa i pacchetti necessari
RUN apt-get update && \
    apt-get install -y curl bzip2 wget tar \
    && wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian10-x86_64-100.9.4.tgz \
    && tar -xvzf mongodb-database-tools-debian10-x86_64-100.9.4.tgz \
    && mv mongodb-database-tools-debian10-x86_64-100.9.4 /mongodb-tools \
    && cp /mongodb-tools/bin/* /usr/local/bin/ \
    && rm -rf mongodb-database-tools-debian10-x86_64-100.9.4.tgz /mongodb-tools \
    && apt-get clean 
# Imposta la directory di lavoro
WORKDIR /usr/src/app
COPY ./dist /usr/src/app/dist

# Assicurati che il file sia eseguibile
RUN chmod +x /usr/src/app/dist/af-backup
RUN chmod +x /usr/src/app/dist/af-restore
RUN chmod +x /usr/src/app/dist/restore.sh
RUN mv /usr/src/app/dist/restore.sh /agile


# Comando da lanciare
CMD ["/usr/src/app/dist/af-backup"]
