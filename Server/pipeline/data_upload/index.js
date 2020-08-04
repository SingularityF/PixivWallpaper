const fs = require("fs");
const d3 = require("d3");
const yaml = require("js-yaml");
const { MongoClient } = require("mongodb");

let configFile = fs.readFileSync('config.yaml', 'utf8');
let configs = yaml.safeLoad(configFile);

const mongodbConnection = configs['db']['uri']
const client = new MongoClient(mongodbConnection);
let csvFilePath = "";
let queueCounter = 0;

function counterCheck(){
  if (queueCounter==0){
    client.close();
    console.log("Client closed");
  }
}

async function dbInsert(collectionName, data) {
    const database = client.db("AppData");
    const collection = database.collection(collectionName);
    queueCounter ++;
    const result = await collection.insertOne(data);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`
    );
    queueCounter --;
    counterCheck();
}

saveRanking = (data) => {
  [month, day, year] = data["Timestamp"].split("-");
  data = {
    Rank: parseInt(data["Rank"]),
    IllustID: parseInt(data["IllustID"]),
    Downloaded: Boolean(parseInt(data["Downloaded"])),
    DateString: data["Timestamp"],
    Created: new Date(Date.now()),
    Updated: new Date(Date.now()),
  };
  dbInsert("Ranking", data).catch(console.dir);
};

saveLocation = (data) => {
  if (data["Downloaded"] < 0.5) {
    return;
  }
  data = {
    IllustID: parseInt(data["IllustID"]),
    Thumbnail: data["Thumbnail"],
    Original: data["Original"],
    Compressed: data["Compressed"],
    Created: new Date(Date.now()),
    Updated: new Date(Date.now()),
  };
  dbInsert("ImageLocation", data).catch(console.dir);
};

client.connect(err=>{

csvFilePath = fs.readFileSync("csv_path", "utf8").trim();

fs.readFile(csvFilePath, "utf8", (err, csvData) => {
  let scraperData = d3.csvParse(csvData);
  for (let idx in scraperData) {
    if (idx == "columns") continue;
    row = scraperData[idx];
    saveRanking(row);
    saveLocation(row);
  }
  counterCheck();
});

});
