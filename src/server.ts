import http, {IncomingMessage, ServerResponse} from 'http'
import { server } from 'typescript';
import { songsRoute } from './routes/songs';
import { error } from 'console';

const PORT = 3000;

const requestListerner = (req: IncomingMessage, res:ServerResponse) =>{
    if(req.url?.startsWith("/songs")){
        songsRoute(req, res)
    }
    else{

        res.writeHead(200,{"content-type": "application/json"});
        res.end(JSON.stringify({error:"song not found"}));
    }
}

const Server = http.createServer(requestListerner)

Server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

