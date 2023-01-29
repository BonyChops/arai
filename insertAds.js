require("dotenv").config();
const { parse } = require("node-html-parser");
const fs = require("fs");

if(!process.env.ADS_SCRIPT){
    process.exit(0);
}

const body = parse(fs.readFileSync("./build/index.html").toString());
const ads = parse(process.env.ADS_SCRIPT);
body.childNodes.find(v => v.rawTagName === "html").childNodes.find(v => v.rawTagName === "head").appendChild(ads);
fs.writeFileSync("./build/index.html", body.toString());