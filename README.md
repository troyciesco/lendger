This project currently uses React, GraphQL (with graphene), and Django.

## Setting up the Back End
Make sure you have pipenv installed. https://docs.pipenv.org/en/latest/

in the root directory:
### pipenv shell

then:

### pipenv install

### cd app

### python manage.py migrate

You're probably going to want to create a superuser at this point.

### python manage.py createsuperuser

Put in whatever information you'd like.

### python manage.py runserver 8080
NOTE: The Apollo client on the front end is hardcoded to use port 8080 at the moment. If you want to change it, you can do so in /client/index.js in the "client" variable.

In addition, the back end is set up to allow CORS from port 3000. To change it, go to /app/app/settings.py and change the information under CORS_ORIGIN_WHITELIST.

You can now go to http://localhost:8080/admin or http://localhost:8080/graphql.

## Setting up the Front End

Open a new terminal.

### cd client

### npm install

### npm run start

The site will open for you on http://localhost:3000 and can communicate with the backend.

### sensitive information is kept locally using python decouple

