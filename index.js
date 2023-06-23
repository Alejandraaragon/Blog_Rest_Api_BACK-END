const express = require('express');
const { connection } = require('./database/db.js')
const cors = require('cors')
const routes_article = require('./routes/article.js')

connection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));//recibimos datos que llegan por form url encoded


//rutas prueba
app.get('/probando', (req, res) => {
    console.log('estoy probando')
    return res.send('estoy probando')
})

//rutas

app.use('/api', routes_article)

app.listen(3001)
console.log('Server on port', 3001)



