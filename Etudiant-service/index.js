import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routesEtudiant from './routes/etudiant.js'

const app=express()

const port = process.env.port;
const url_mongoose = process.env.url_mongoose;

mongoose.connect(url_mongoose).then(() => {
    console.log('Connected to mongo')
}).catch((err) => {
    console.log('Mot connected :' + err)
})

app.use(express.json())
app.use(cors())
app.use('/etudiant', routesEtudiant)

app.listen(port, (err) => {
    if(!err)
        console.log(`Server started at ${port}`)
    else
        console.log('error start server')

})