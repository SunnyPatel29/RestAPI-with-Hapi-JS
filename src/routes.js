import Knex from './knex';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';

const routes=[
        {  
        path: '/posts',
        method: 'GET',
        handler: ( request, reply ) => {
                // In general, the Knex operation is like Knex('TABLE_NAME').where(...).chainable(...).then(...)
                const getOperation = Knex( 'posts' ).where( {
                    isPublic: true
                } ).select( 'name', 'description', 'picture_url' ).then( ( results ) => {
                    if( !results || results.length === 0 ) {
                        reply( {
                            error: true,
                            errMessage: 'no public posts found',
                        } );
                    }
                    reply( {
                        dataCount: results.length,
                        data: results,
                    } );
                } ).catch( ( err ) => {
                    reply( 'server-side error' );
                } );
            }
        },

        {
            path: '/author',
            method: 'POST',
            handler: ( request, reply ) => {
                // This is a ES6 standard
                const { username, password } = request.payload;
                const getOperation = Knex( 'users' ).where( {
                    username,
                } ).select( 'guid', 'password' ).then( ( [ user ] ) => {
    
                    if( !user ) {
                                reply( {
                                    error: true,
                                    errMessage: 'the specified user was not found',
                                } )
                        // Force of habit. But most importantly, we don't want to wrap everything else in an `else` block; better is, just return the control.
                        return; }

                    // Honestly, this is VERY insecure. Use some salted-hashing algorithm and then compare it.
                    if( user.password === password ) {
                            const token = jwt.sign( {
                                // You can have anything you want here. ANYTHING. As we'll see in a bit, this decoded token is passed onto a request handler.
                                username,
                                scope: user.guid,
                            }, 'topsecretvalue', {
                                algorithm: 'HS256',
                                expiresIn: '1h',
                            } );
                            reply( {
                                token,
                                scope: user.guid,
                            } );
                        } else {
                            reply( 'incorrect password' );
                        }            
                    } ).catch( ( err ) => {
                        reply( 'server-side error' );
                    } );
                }
            },

            {
                path: '/auth_add',
                method: 'POST',
                handler: (request, reply) => {
                    const {name, username, email, password} = request.payload;
                    const guid = GUID.v4();
                    const insertOperation = Knex( 'users' ).insert({
                        name: name,
                        username: username,
                        email: email,
                        password: password,
                        guid,
                    }).then((res) => {
                        reply( {
                            data: name,
                            message: `User ${ name } Succesfully added`
                        });
                    }).catch( ( err ) => {
                        console.log(err);
                        reply( 'server-side error' );
                    } );
                }
            },

            {
                path: '/posts',
                method: 'POST',
                config: {
                        auth: {
                            strategy: 'token',
                        }
                    },
                handler: ( request, reply ) => {
                    const { auth, name, description, picture_url } = request.payload;
                    const guid = GUID.v4();
                    const insertOperation = Knex( 'posts' ).insert( {
                        author: request.auth.credentials.scope,
                        name: name,
                        description: description,
                        picture_url: picture_url,
                        guid,
                    } ).then( ( res ) => {
                        reply( {
                            data: guid,
                            message: 'successfully created post'
                        } );
                    } ).catch( ( err ) => {
                        console.log(err);
                        reply( 'server-side error' );
                    } );
                }
            },      

            {
                path: '/posts/{postsGuid}',
                method: 'PUT',
                config: {
                        auth: {
                            strategy: 'token',
                        },
                        pre: [
                            {
                                method: ( request, reply ) => {
                                const { postsGuid } = request.params, { scope } = request.auth.credentials;
                                const getOperation = Knex( 'posts' ).where( { 
                                    guid: postsGuid,
                                 } ).select( 'author' ).then( ( [ result ] ) => {
                            console.log(result);
                                    if( !result ) {
                                        reply( {
                                            error: true,
                                            errMessage: `the post with id ${ postsGuid } was not found`
                                        } ).takeover();
                                    }
                                    if( result.author !== scope ) {
                                        reply( {
                                            error: true,
                                            errMessage: `the post with id ${ postsGuid } is not in the current scope`
                                        } ).takeover();
                                    }
                                    return reply.continue();
                                    } );
                                }
                            }
                        ]
                    },
                handler: ( request, reply ) => {
                    const { postsGuid } = request.params,
                     { name, description, picture_url, isPublic } = request.payload;
                    const insertOperation = Knex( 'posts' ).where( {
                                guid: postsGuid,
                            } ).update( {
                        name: name,
                        description: description,
                        picture_url: picture_url,
                        isPublic: isPublic,
                    } ).then( ( res ) => {
                        reply( {
                            data: postsGuid,
                            message: 'successfully updated post'
                        } );
                    } ).catch( ( err ) => {
                        console.log(err);
                        reply( 'server-side error' );
                    } );
                }
            }
        ];

        export default routes;