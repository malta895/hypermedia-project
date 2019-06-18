# Documentation of the Backend part
> Deliverable D1
## General group information

| Member n. | Role          | First Name | Last Name   | Matricola | Email address                     |
| --------- | ----          | ---------- | ---------   | --------- | -------------                     |
|         1 | administrator | Luca       | Maltagliati |    919858 | luca.maltagliati@mail.polimi.it   |
|         2 | member        | Alessandro | Carughi     |    915625 | alessandro.carughi@mail.polimi.it |
|         3 | member        | Marco      | Turetta     |    921188 | marco3.turetta@mail.polimi.it     |


## Links to other deliverables
- Deliverable D0: the web application is accessible at
[this address](https://bookhub-ctm.herokuapp.com/).
- Deliverable D2: the YAML or JSON file containing the specification of the app
API can be found at [this address](https://bookhub-ctm.herokuapp.com/backend/spec.yaml).
- Deliverable D3: the SwaggerUI page of the same API is available at
[this address](https://bookhub-ctm.herokuapp.com/swaggerui).
- Deliverable D4: the source code of D0 is available as a zip file at
[this address](https://bookhub-ctm.herokuapp.com/backend/app.zip).
- Deliverable D5: the address of the online source control repository is
available [this address](https://github.com/malta895/hypermedia-project). We hereby declare that this
is a private repository and, upon request, we will give access to the
instructors.
## Specification
### Web Architecture
Describe here, with a diagram, the components of your web application and how
3
they interact. Highlight which parts belong to the application layer, data layer
or presentation layer. How did you ensure that HTML is not rendered server side?
### API
#### REST compliance
Describe here to what extent did you follow REST principles and what are the
reasons for which you might have decided to diverge. Note, you must not describe
the whole API here, just the design decisions.
#### OpenAPI Resource models
Describe here synthetically, which models you have introduced for resources.
### Data model
Describe with an ER diagram the model used in the data layer of your web
application. How these map to the OpenAPI data model?
## Implementation
### Tools used
For the backend part we used the following tools:
- NodeJS, with the following NPM packages:
     - ServeStatic
     - pg 
 - SwaggerUI, for generating the skeleton of the web server
 - PostgreSQL, as relational database
### Discussion
Describe here
- How did you make sure your web application adheres to the provided OpenAPI
specification?
To ease this important task we made use of the suggested middleware *SwaggerUI*. We generated an API by writing the YAML specification, and then we added the logic to the generated NodeJS server skeleton.
- Why do you think your web application adheres to common practices to partition
the web application (static assets vs. application data)
- Describe synthetically why and how did you manage session state, what are the
state change triggering actions (e.g., POST to login etc..).
- Which technology did you use (relational or a no-SQL database) for managing
the data model?
We used the RDBMS PostgreSQL; to ease persistence tasks on the server we made use of the library *Knex.js*
## Other information
### Task assignment
Describe here how development tasks have been subdivided among members of the
group, e.g.:
- Foo worked on front end (80%) and OpenAPI Spec (20% of the time)
- Bar worked on ....
### Analysis of existing API
4
Describe here if you have found relevant APIs that have inspired the OpenAPI
specification and why (at least two).
### Learning outcome
What was the most important thing all the members have learned while developing
this part of the project, what questions remained unanswered, how you will use
what you've learned in your everyday life?
Examples:
- Foo learned to write SQL queries and Javascript but wanted to know more about
caching, he's probably going to create his own startup with what she has
learned
- Bar learned how to deploy on a cloud platform, he would have liked to know
more about promises for asynchronous code..
