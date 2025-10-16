import { IncomingMessage, ServerResponse } from "http";
import { getSongs, getSongById, addSong } from "../controllers/songs";
import { error } from "console";

export const songsRoute = async (req: IncomingMessage, res: ServerResponse)=>{
    if(req.url?.startsWith("/songs")){
       


        const parts = req.url.split("/")
        
        const id = parts[2] ? parseInt(parts[2]) : undefined

        if(req.method === 'GET' && !id)
        {
            res.writeHead(200, {'content-type': 'application/json'})
            res.end(JSON.stringify(getSongs()));
            return
        }

        if (req.method === 'GET' && id){
            
            
            if(isNaN(id)){
                res.writeHead(400, {"content-type": "application/json"});
                res.end(JSON.stringify({error: "Invalid song Id"}));
                return
            }

            const song =getSongById(id);
            if(!song){
                res.writeHead(400, {"content-type": "application/json"});
                res.end(JSON.stringify({error: "Song not found"}));
                return
            }

            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(song));
            return

        }

        if(req.method= 'POST'){
            let body = ""
            req.on('data', (chunk)=> {
                console.log(chunk, "chunk");
                body+= chunk.toString();
               
            });

            req.on('end', ()=>{
                
                
                try {
                    const {title, artist, duration} = JSON.parse(body)
                    if(!title || typeof title !== "string"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "song title is required"}))
                    }

                     if(!artist || typeof artist !== "string"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "artist of the song  is required"}))
                    }

                     if(!duration || typeof duration !== "number"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "song title is required"}))
                    }
                    const newSong = addSong(title,artist, duration)
                res.writeHead(201, {"content-type": "application/json"});
                res.end(JSON.stringify(newSong));
                } catch (error) {
                    res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "Invalid JSON payload"}))
                }
            });
            return
        }

        res.writeHead(405, {"content-type":"application/json"});
        res.end(JSON.stringify({error: "method not allowed on /songs"}))
    }
};
