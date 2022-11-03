# NMSW UI
National Maritime Single Window - NMSW

This is the front end, and will connect to the data-api when available

## Requirements

* node v18

## Index
* [Getting started](#getting-started)
* [Run locally](#run-locally)
* [Run with Docker and NGINX](#run-with-docker-and-nginx)
* [Run Cypress tests](#run-cypress-tests)

## Form Creator
<a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator.md">hHow to create a new form component and a form</a>

----

### Getting started

**1. Clone this repo**

----

### Run locally
**2. Install package dependencies**
```sh
npm install
```
**3. Build development bundle** *(optional)*
```sh
npm run build:dev
```
**4. Start the application** *(optional)*
```sh
npm start
```
----

### Run with Docker and NGINX
**2. Build the application Docker container**
```sh
docker build -t nmsw-ui .
```
**3. Run the resulting Docker container**
```sh
docker run -d --name nmswui -p 8080:8080 nmsw-ui .
```

----

### Run Cypress tests
```sh
npx cypress open
```
