import dotenv from 'dotenv';
require("dotenv").config();
import express from 'express';
import connect from './db.js'
import cors from "cors"
import mongo from 'mongodb';
import auth from './auth';

const app = express()  // instanciranje aplikacije
const port = 3000  // port na kojem će web server slušati
app.use(cors())
app.use(express.json());

app.get('/tajna', [auth.verify], async (req, res) => {
    res.status(200).send('tajna korisnika ' + req.jwt.username);
});

app.patch('/user', [auth.verify], async (req, res) => {
    let changes = req.body;
    if (changes.new_password && changes.old_password) {
        let result = await auth.changeUserPassword(req.jwt.username, changes.old_password, changes.new_password);
        if (result) {
            res.status(201).send();
        } else {
            res.status(500).json({ error: 'cannot change password' });
        }
    } else {
        res.status(400).json({ error: 'unrecognized request' });
    }
});

app.post('/auth', async (req, res) => {
    let user = req.body;
    let username = user.username;
    let password = user.password;

    try {
        let result = await auth.authenticateUser(username, password);
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }
});

app.post('/user', async (req, res) => {
    let user = req.body;

    try {
        let result = await auth.registerUser(user);
        res.status(201).send();
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }
    
});




app.post('/profilp', async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let data = {

    }


    let result = await db.collection('profil').insert(data);

    res.json(doc);
});


app.post('/chat', async (req, res) => {
    let db = await connect();
    let doc = req.body;



    let result = await db.collection('chat').insertOne(doc);

    res.json(doc);
});

app.get('/igraci',[auth.verify], async (req, res) => {
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




app.get('/chat', [auth.verify], async (req, res) => {
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


app.get('/pozivi', [auth.verify],async (req, res) => {
    let db = await connect() // pristup db objektu
    let query= req.query
    let selekcija = {}
    selekcija.to = new RegExp(query.to)



let cursor = await db.collection("pozivi").find(selekcija).sort( { createdAt: 1 })
let results = await cursor.toArray()
res.json(results)

})


app.get('/profil/:id', [auth.verify], async (req, res) => {
    let id = req.params.id;
    let db = await connect();
    let document = await db.collection('profil').findOne({ email: id });

    res.json(document);
});



app.listen(port, () => console.log(`Slušam na portu ${port}!`))