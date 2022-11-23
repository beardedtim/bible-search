# Deploy the Database

You will need to do the following steps to deploy the Database to K8s/Minikube:

- Run `./scripts/deploy-database`
- Once up, SSH into the box using K9s and enter PSQL
```sh
psql -U postgres
< enter password given in output of deploy-database script >
```
- Once in PSQL, create a user for `bible_search` and a database for it
```psql
CREATE USER bible_search WITH SUPERUSER PASSWORD '<some secret password>';
CREATE DATABASE bible_search;
```
- Update `helm/api/values.yaml` to have the `DB_PASSWORD` set to whatever you entered above

# Deploy API

You will need to have the Database deployed and reachable

- Run Helm to Deploy
```sh
./scripts/build-and-deploy api
```

# Creating Schemas

For each `domain` you can create a `schemas.json` file. That will autogenerate Typescript files along
with Joi validators based upon the files defined as top-level keys of that object. You can also attach
a `$defs` key to have in-line definitions. 

Look at `source/domains/users/schemas.json` for more information