# Insight Prototype

The following is boilerplate code for a simple web application that would allow the user to send 2-way SMS messages or emails to recipients. This is ideal in settings where a clinician would like to contact patients regarding upcoming appointments or surveys. Here are some of the technologies used:

- Frontend: [React](https://reactjs.org/), [MaterialUI](https://material-ui.com/), React Router, Webpack
- Backend: [FeathersJS](https://feathersjs.com/), [Docker](https://www.docker.com/), Sequelize
- AWS: [Pinpoint](https://aws.amazon.com/pinpoint/), [SNS](https://aws.amazon.com/sns/), [SES](https://aws.amazon.com/ses/), [EC2](https://aws.amazon.com/ec2/)

## Requirements

Download and install Docker Community Edition. 

In order to use the following boilerplate code, you have to create an AWS account and properly configure certain services.

![alt text](https://i.stack.imgur.com/3mmXe.png "AWS Pinpoint Architecture")


#### AWS - SNS

In 2-way SMS, when your user responds to your SMS, the response is forwarded to Amazon Pinpoint, which can then redirect the message to an Amazon SNS topic. This topic can then send the message to your subscriptions, which include but are not limited to, an HTTP/HTTPS endpoint, AWS Lambda, email, etc. Begin by creating a SNS Topic. Under that topic, add a subscription to the endpoint of your application that will be responsible for receiving and posting responses from your user. SNS will initially send a payload to this endpoint containing a subscription URL, which will be responsible for verifying and activating the endpoint. More information can be found [here](https://docs.aws.amazon.com/sns/latest/dg/sns-http-https-endpoint-as-subscriber.html#SendMessageToHttp.subscribe).

#### AWS - Pinpoint

Create an AWS Pinpoint project, and configure it to have SMS and Voice capabilities. Enable the SMS channel for this project, and add an account spending limit. Go into the SMS and Voice settings, and request a long code. A long code is essentially a phone number that will act as the application's SMS origination number. Additionally, set up 2-way SMS for this long code in its settings, and when prompted about selecting an AWS SNS topic, select the topic you previously created.

#### AWS - IAM Users

To use the services you have just created, the application will need a user, with predefined permissions, to use the services. In your security credential settings, create a user with the following permissions: 
- AmazonSESFullAccess
- AmazonSNSRole
- AmazonSNSFullAccess
- AWSIoTDeviceDefenderPublishFindingsToSNSMitigationAction

You will also need to create a custom policy that allows the user to have full permissions over AWS Pinpoint. 

Upon creation of the user, you will be provided with an access key and a secret key. Store these keys in a safe location.

#### AWS - Code Setup

In the `api/secrets/` folder, add your access key and secret key in their designated locations. In the  `api/src/services/notifications/sns_publishsms.js` file, insert your Pinpoint application ID and your origination number (long code) into their designated variables. 


## Getting started

Bring up the database first:
```
docker-compose -f docker-compose.yml up -d --build postgres
```

Bring up the backend (API) and front-end (APP):
```
docker-compose -f docker-compose.yml up -d --build api app
```

Open up the browser to [localhost:4002](http://localhost:4002/)

View logs:
```
docker-compose -f docker-compose.yml logs --follow api app postgres
```

Open postgres database:
```
docker-compose -f docker-compose.yml exec postgres psql -U project-name project-name
```

## Customization and Production deployment
Update `project-name` in the package.json and docker-compose yml files to desired project name.

For production deployment, assuming you have an SSL certificate and want to serve via HTTPS, update the `.env` to point the `API_BASE_URL` to your domain name and set the `API_PORT` to another port like `4003` so that we can have the server listen on `4001` instead.
```
#######################
# DOCKER CONFIGURATION #
########################

API_PORT=4003
APP_PORT=4002

```
Then update the `docker-compose.yml` to specify where the APP will look for the API. This will remain on the same initial port of `4001` where the server is listening.
```
app:
    build: ./app

    ...

    environment:
      - SPA_BASE_URL=<your-domain-name>:$APP_PORT
      - API_BASE_URL=<your-domain-name>:4001
      - INTERNAL_API_BASE_URL=http://api:8000
    ports:
      - "$APP_PORT:8000"
    entrypoint: node start.js

    ...

```


Then setup the nginx config (`/etc/nginx/sites-available/default`) to point incoming server requests to the backend and front-end respectively, example below:
```
server {
        listen 80;
        server_name <your-domain-name>;
        location / {
          return 301 https://$server_name$request_uri/;
        }
}

server {
        listen 443 ssl;
        server_name <your-domain-name>;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'ECDH !aNULL !eNULL !SSLv2 !SSLv3';
        ssl_certificate /etc/nginx/certs/certificate.crt;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        location / {
          proxy_pass http://localhost:4002;
        }
}

server {
        listen 4001 ssl;
        server_name <your-domain-name>;
        ssl_ciphers 'ECDH !aNULL !eNULL !SSLv2 !SSLv3';
        ssl_certificate /etc/nginx/certs/certificate.crt;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        location / {
          proxy_pass http://localhost:4003;
        }
}
```

## Code Splitting
Code splitting involves breaking down the bundle file into smaller-sized chunks. This can be advantageous in times when certain packages are updated/added, as the client only needs to redownload a certain chunk in their cache, rather than the entire bundle. 

Prior to Webpack v4, this was accomplished with the `CommonsChunkPlugin`, which has since been deprecated and replaced with the `SplitChunksPlugin`. Documentation on code splitting can be found [here](https://webpack.js.org/plugins/split-chunks-plugin/).
