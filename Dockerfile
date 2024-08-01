FROM alpine:3.7
WORKDIR /app

# fai l'eco della variabile d'ambiente MINIO_PASS
# CMD /app/af-backup
CMD echo $MINIO_PASS