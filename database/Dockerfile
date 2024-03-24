FROM postgres:16-alpine

RUN mkdir /var/log/postgresql && chown postgres:postgres /var/log/postgresql

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_statement=all", "-c", "log_directory=/var/log/postgresql"]
