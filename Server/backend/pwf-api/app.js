const express = require("express");
const yaml = require("js-yaml");
var cors = require("cors");
const { MongoClient } = require("mongodb");

//let configFile = fs.readFileSync('config.yaml', 'utf8');
//let configs = yaml.safeLoad(configFile);

//const mongodbConnection = configs['db']['uri']
const mongodbConnection = process.env.MONGO_URI;
const client = new MongoClient(mongodbConnection, { useUnifiedTopology: true });
const app = express();
const dbName = "PWFData";

app.use(cors());

process.on("uncaughtException", (error) => {
  console.log(error);
});

app.get("/pipeline/date/latest", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  client
    .db(dbName)
    .collection("PipelineStatus")
    .find({ Status: "Complete" })
    .sort({ Created: -1 })
    .limit(1)
    .toArray((err, data) => {
      if (data === null) {
        res.send("No record found.");
      } else {
        date = data[0]["DateString"];
        res.send({ latest: date });
      }
    });
});

app.get("/image/thumbnail/:id", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  id = req.params["id"];
  client
    .db(dbName)
    .collection("ImageLocation")
    .find({ IllustID: parseInt(id) })
    .sort({ Created: 1 })
    .limit(1)
    .toArray((err, data) => {
      if (data === null) {
        res.send("Image not found");
      } else {
        url = data[0]["Thumbnail"];
        res.send({ url: url });
      }
    });
});

app.get("/image/compressed/:id", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  id = req.params["id"];
  client
    .db(dbName)
    .collection("ImageLocation")
    .find({ IllustID: parseInt(id) })
    .sort({ Created: 1 })
    .limit(1)
    .toArray((err, data) => {
      if (data === null) {
        res.send("Image not found");
      } else {
        url = data[0]["Compressed"];
        res.send({ url: url });
      }
    });
});

app.get("/image/original/:id", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  id = req.params["id"];
  client
    .db(dbName)
    .collection("ImageLocation")
    .find({ IllustID: parseInt(id) })
    .sort({ Created: 1 })
    .limit(1)
    .toArray((err, data) => {
      if (data === null) {
        res.send("Image not found");
      } else {
        url = data[0]["Original"];
        res.send({ url: url });
      }
    });
});

// app.get("/", (req, res) => {
//   client
//     .db("AppData")
//     .collection("Ranking")
//     .findOne({ Rank: 1 })
//     .then((data) => {
//       return data["IllustID"];
//     })
//     .then((id) => {
//       client
//         .db("AppData")
//         .collection("ImageLocation")
//         .findOne({ IllustID: id })
//         .then((data) => {
//           url = data["Compressed"];
//           res.send(`<img src='${url}' />`);
//         });
//     });
// });

app.get("/ranking/unique/:date", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  client
    .db(dbName)
    .collection("Ranking")
    .find({ DateString: req.params["date"], Downloaded: true, IsNew: true })
    .project({ Rank: 1, IllustID: 1, Adult: 1, _id: 0 })
    .sort({ Rank: 1 })
    .toArray((err, data) => {
      if (data.length > 0) {
        //idArray = data.map((row) => row["IllustID"]);
        res.send({ illustData: data });
      } else {
        res.send("nothing found");
      }
    });
});

app.get("/ranking/raw/:date", async (req, res) => {
  connected = await (client.isConnected() ? null : client.connect());
  client
    .db(dbName)
    .collection("Ranking")
    .find({ DateString: req.params["date"], Downloaded: true })
    .project({ Rank: 1, IllustID: 1, Adult: 1, _id: 0 })
    .sort({ Rank: 1 })
    .toArray((err, data) => {
      if (data.length > 0) {
        //idArray = data.map((row) => row["IllustID"]);
        res.send({ illustData: data });
      } else {
        res.send("nothing found");
      }
    });
});

exports.cloudFunction = app;
