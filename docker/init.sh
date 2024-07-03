#!/bin/sh
 
if [ ! -f /var/lib/zerotier-one/authtoken.secret ]; then
  echo "The file /var/lib/zerotier-one/authtoken.secret not found."
  exit 1
fi

token=$(cat /var/lib/zerotier-one/authtoken.secret)

if [ -z "$ZU_CONTROLLER_ENDPOINT" ]; then
  echo "ZU_CONTROLLER_ENDPOINT not set."
  exit 1
fi

if [ -z "$ZU_USERNAME" ]; then
  echo "ZU_USERNAME not set."
  exit 1
fi

if [ -z "$ZU_PASSWORD" ]; then
  echo "ZU_PASSWORD not set."
  exit 1
fi

HASHED_PASSWORD=$(caddy hash-password --plaintext $ZU_PASSWORD)

cat <<EOL > /etc/caddy/caddyfile
:5000 {
    basicauth {
        $ZU_USERNAME $HASHED_PASSWORD
    }
    
    handle_path /api* {
        reverse_proxy $ZU_CONTROLLER_ENDPOINT {
            header_up X-ZT1-Auth "$token" 
        }
    } 

    handle {
        encode gzip zstd
        root * /app
        file_server
        try_files {path} /index.html
    }
}
EOL

cat /etc/caddy/caddyfile

caddy run --config /etc/caddy/caddyfile --adapter caddyfile
