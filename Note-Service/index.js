import express from 'express'
import mongoose from 'mongoose'
import NoteModel from './models/Note.js'

const app=express()

const port = process.env.port;
const url_mongoose = process.env.url_mongoose;
let channel, connection;
const queueName = "delete-note-queue";

mongoose.connect(url_mongoose).then(() => {
    console.log('Connected to mongo')
}).catch((err) => {
    console.log('Mot connected :' + err)
})

// Connect to RabbitMQ
async function connectToRabbitMQ() {
    connection = await amqp.connect(url_rabbit);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName);
}

connectToRabbitMQ().then(() => {
    channel.consume(queueName, (data) => {
        const cef = data.content.toString();

        NoteModel.deleteMany({cef}).then(() => {
            console.log('Note supprimé')
        })
    })
})


app.listen(port, (err) => {
    if(!err)
        console.log(`Server started at ${port}`)
    else
        console.log('error start server')

})