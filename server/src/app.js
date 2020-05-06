import express from "express";
import subdomain from 'express-subdomain'
import fileUpload from "express-fileupload"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";


import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { missionRouter } from "./routes/mission";
import { rallyRouter, updateRallyQueue } from "./routes/rally";
import { itemRouter } from "./routes/item";
import { productRouter } from "./routes/product";
import { partyRouter } from "./routes/party";
import { barmanRouter } from "./routes/barman";



//mongoDB

mongoose.Promise = global.Promise;

let options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

options = process.env.REPLICA === "true" ? {...options, replicaSet: process.env.REPLICA_NAME} : options

mongoose.connect(process.env.MONGODB_URL, options);

//express setup

export const app = express();


app.use(
  fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true,
    useTempFiles: false,
    abortOnLimit: true,
    //6 mb file upload limit
    limits: {fileSize: 6 * 1024 * 1024}
  })
);

if(process.env.NODE_ENV === 'dev'){
  app.use(cors());
}else{
  var whitelist = ['http://goblin.hhgstudio.com', 'http://goblinbarman.hhgstudio.com', 'http://goblinadmin.hhgstudio.com']
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  //app.use(cors(corsOptions));
  app.use(cors())
}

app.use(express.static(path.join(__dirname, "../../static")));
app.use(subdomain('goblinbarman', express.static(path.join(__dirname, "../../barman/build"))));
app.use(subdomain('goblinadmin', express.static(path.join(__dirname, "../../admin/build"))));
app.use(express.static(path.join(__dirname, "../../client/build")));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/mission", missionRouter);
app.use("/rally", rallyRouter);
app.use("/item", itemRouter);
app.use("/product", productRouter);
app.use("/party", partyRouter);
app.use("/barman", barmanRouter)


app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

if(process.env.NODE_ENV === 'dev'){
  //console.log(process.env.NODE_ENV)
  app.set('subdomain offset', 1);
}

app.get('*', (req, res) => {
  
  if(req.subdomains[0]==='goblinadmin'){
    res.sendFile(path.join(__dirname, '../../admin/build/index.html'));
  }else if(req.subdomains[0]==='goblinbarman'){
    res.sendFile(path.join(__dirname, '../../barman/build/index.html'));
  }else{
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  }
})