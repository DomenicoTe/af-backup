# ---- Fase di build ----
FROM node:18 as builder

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file necessari per installare le dipendenze
COPY package.json yarn.lock ./

# Installa le dipendenze e compila
RUN yarn install --production
# Copia il codice sorgente
COPY . .
# Compila il codice
RUN yarn build

# ---- Fase finale (solo i file necessari) ----
FROM ubuntu:22.04

# Installa i pacchetti necessari
RUN apt-get update && \
    apt-get install -y curl bzip2 wget tar && \
    wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian10-x86_64-100.9.4.tgz && \
    tar -xvzf mongodb-database-tools-debian10-x86_64-100.9.4.tgz && \
    mv mongodb-database-tools-debian10-x86_64-100.9.4 /mongodb-tools && \
    cp /mongodb-tools/bin/* /usr/local/bin/ && \
    rm -rf mongodb-database-tools-debian10-x86_64-100.9.4.tgz /mongodb-tools && \
    apt-get clean 

# Imposta la directory di lavoro
WORKDIR /usr/src/app
RUN mkdir -p /agile
# Copia solo la cartella dist dalla fase di build
COPY --from=builder /usr/src/app/dist /usr/src/app/dist

# Assicurati che i file siano eseguibili
RUN chmod +x /usr/src/app/dist/af-backup \
    && chmod +x /usr/src/app/dist/af-restore 

# Comando da eseguire all'avvio
CMD ["sh", "-c", "cp /usr/src/app/dist/af-restore /agile/af-restore && /usr/src/app/dist/af-backup"]
