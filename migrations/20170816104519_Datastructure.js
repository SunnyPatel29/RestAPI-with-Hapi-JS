
exports.up = function(knex, Promise) {
  
    return knex
    .schema
    .createTable( 'users', function( usersTable ) {

        // Primary Key
        usersTable.increments();

        // Data
        usersTable.string( 'name', 50 ).notNullable();
        usersTable.string( 'username', 50 ).notNullable().unique();
        usersTable.string( 'email', 250 ).notNullable().unique();
        usersTable.string( 'password', 128 ).notNullable();
        usersTable.string( 'guid', 50 ).notNullable().unique();
        usersTable.timestamp( 'created_at' ).notNullable();
    } )

    .createTable( 'posts', function( postsTable ) {
        
        // Primary Key
        postsTable.increments();
        postsTable.string( 'author', 36 ).references( 'guid' ).inTable( 'users' );
        
        // Data
        // Each chainable method creates a column of the given type with the chained constraints. For example, in the line below, we create a column named `name` which has a maximum length of 250 characters, is of type string (VARCHAR) and is not nullable. 
        postsTable.string( 'name', 250 ).notNullable();
        postsTable.string( 'description', 1000 ).notNullable();
        postsTable.string( 'picture_url', 250 ).notNullable();
        postsTable.string( 'guid', 36 ).notNullable().unique();
        postsTable.boolean( 'isPublic' ).notNullable().defaultTo( true );
        postsTable.timestamp( 'created_at' ).notNullable();
        
        } );
};

exports.down = function(knex, Promise) {
        // We use `...ifExists` because we're not sure if the table's there. Honestly, this is just a safety measure. 
        return knex
        .schema
            .dropTableIfExists( 'posts' )
            .dropTableIfExists( 'users' );
};
