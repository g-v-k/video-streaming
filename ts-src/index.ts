import express from 'express';
import * as fs from 'fs';
import path from 'path';
 
const app = express();

app.get('/',function(req,res,next){
    res.sendFile(path.join(__dirname,'..','index.html'));
})

app.get('/video',function(req, res,next){
    const range = req.headers.range;
    if(!range) return res.status(400).send("Range header requires");
    const filePath = path.join("Your video file path");
    const fileSize = fs.statSync(filePath).size;
    
    const chunkSize = (10**6)*10; //size of the chuncks of the video that we will send eveytime a request comes
    const start = Number(range?.replace(/\D+/g,''));
    const end = Math.min(start+chunkSize,fileSize-1);
    const contentLength = end-start+1;
    const headers={
        "Content-Range":`bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4"
    };
    res.writeHead(206,headers);
    const readStream = fs.createReadStream(filePath,{start,end});

    readStream.pipe(res);



});


app.listen(3000);
