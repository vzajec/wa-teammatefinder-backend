import express from 'express';
import connect from './db.js'
import cors from "cors"

const app = express()  // instanciranje aplikacije
const port = 3000  // port na kojem će web server slušati
app.use(cors())


app.get('/igraci', async (req, res) => {
    let db = await connect() // pristup db objektu
    let query = req.query;
    
let selekcija = {}
if (query.game) {
       selekcija.game = new RegExp(query.game)
   }

if (query.dotarank) {
    selekcija.dotarank = new RegExp(query.dotarank)
}

if (query.dotapos) {
    selekcija.dotapos = new RegExp(query.dotapos)
}


if (query.dotaregija) {
    selekcija.dotaregija= new RegExp(query.dotaregija)
}


if (query.csgorank) {
    selekcija.csgorank = new RegExp(query.csgorank)
}

if (query.csgopos) {
    selekcija.csgopos = new RegExp(query.csgopos)
}


if (query.csgoregija) {
    selekcija.csgoregija= new RegExp(query.csgoregija)
}


if (query.lolrank) {
    selekcija.lolrank = new RegExp(query.lolrank)
}

if (query.lolpos) {
    selekcija.lolpos = new RegExp(query.lolpos)
}


if (query.lolregija) {
    selekcija.lolregija= new RegExp(query.lolregija)
}
    let cursor = await db.collection("igraci").find(selekcija)
    let results = await cursor.toArray()
    res.json(results)
   })







app.get('/chat', async (req, res) => {
    let db = await connect() // pristup db objektu
    let query = req.query;
    let selekcija = {}
   
    

if (query.game) {
    if (query.game) {
    selekcija.game = new RegExp(query.game)
    }
   }

    




let cursor = await db.collection("chat").find(selekcija).sort( { createdAt: 1 })
let results = await cursor.toArray()
res.json(results)

})


app.listen(port, () => console.log(`Slušam na portu ${port}!`))