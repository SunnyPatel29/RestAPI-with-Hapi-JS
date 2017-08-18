# RestAPI-with-Hapi-JS
Restful API using Hapi JS, ES6, JWT, Knex and Node-UUID

Here by I have created Restful API for a blog posts concept.
- All users can see every public posts in the database.
- One can register into the blog.
- All users can login/out.
- Registered users can create posts.
- Registered users can edit posts provided they are the author of that post that bird.
- Registered users can delete the posts.

Knex.js
-------------------------
Knex is a very simple to use, yet incredibly powerful query builder for MySQL. I have use this to directly communicate with our Authentication and Data servers running MySQL.

Hapi.js
-------------------------
Hapi (pronounced "happy") is a web framework for building web applications, APIs and services.

JSON web tokens(JWT)
-------------------------
I'll be using the super-simple and secure JSON Web Token strategy for authentication and authorization. 

Node-UUID
-------------------------
I have install a package to generate GUID's called node-uuid with " npm i --save node-uuid " and then import it into our routes file as "  import GUID from 'node-uuid';  ".
