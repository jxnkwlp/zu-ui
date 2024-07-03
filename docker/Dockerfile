FROM caddy:latest

COPY init.sh /start_caddy.sh
RUN chmod +x /start_caddy.sh

COPY app /app

ENTRYPOINT [ "/start_caddy.sh" ]
