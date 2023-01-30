#/bin/sh

psql -U $POSTGRES_USER -c "CREATE DATABASE app"
psql -U $POSTGRES_USER -c "CREATE DATABASE testing"
psql -U $POSTGRES_USER -d app -f /opt/schema.sql