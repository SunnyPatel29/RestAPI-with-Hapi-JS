import Hapi from 'hapi';
import routes from './routes';

const server = new Hapi.Server();

server.connection({
    port: 8082
});

// .register(...) registers a module within the instance of the API. The callback is then used to tell that the loaded module will be used as an authentication strategy. 
server.register( require( 'hapi-auth-jwt' ), ( err ) => {
    server.auth.strategy( 'token', 'jwt', {
        key: 'topsecretvalue',
        verifyOptions: {
            algorithms: [ 'HS256' ],
        }
    } );
    routes.forEach( ( route ) => {
                console.log( `attaching ${ route.path }` );
                server.route( route );
            } );
} );

server.start(err =>{
    if(err){
        console.error('Error was handled!');
        console.error( err.message );
    }
    console.log(`Server started at ${server.info.uri}`);
});


