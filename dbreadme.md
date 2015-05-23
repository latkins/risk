Install postgres. On osx you can do this via homebrew, just follow the instructions.

Create your user / database on postgres:

createdb risk
creatuser risk

You can now log into the postgres command line with psql -U risk risk

Create the tables from the sql script: psql -U risk -d risk -a -f mkTables.sql

To make the script generic, we don't hardcode the user/db/whatever, and instead access them from environment variables.

As a result, you need to set these environment variables (assuming you created the user / db as risk / risk)

PGSERVER = localhost
PGPORT = 5432
DBRISKUSER = risk
DBRISKPASS = ""
DBRISKNAME = risk

It is a bit annoying to do this at first, but it means we can easily change if we have to e.g. put the db in a docker container, move it to a different server etc. I'll have set this up on the server.

You can now generate a connection with the getDbConn() function. Everything else should work as it previously did.
