import express from 'express'
import jwt from 'jsonwebtoken'
import amqp from 'amqplib'
import bcrypt from 'bcrypt'
import EtudiantModel from '../models/Etudiant.js'

const routes = express.Router()

const JWT_SECRET = process.env.secret
const url_rabbit = process.env.url_rabbit
let channel, connection;
const queueName = "delete-note-queue";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, userData) => {
        if (err)
            return res.sendStatus(403);
        else {
            req.user = userData;
            next();
        }
    })
}

// Connect to RabbitMQ
async function connectToRabbitMQ() {
    connection = await amqp.connect(url_rabbit);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName);
}

connectToRabbitMQ();

routes.get('/all', authenticateToken, (req, res) => {
    EtudiantModel.find().then((etuds) => {
        res.json(etuds)
    })
})

routes.post('/add', authenticateToken, (req, res) => {
    const etudiant = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(etudiant.password, salt, (err, hash) => {
            etudiant.password = hash;
            if (!err) {
                EtudiantModel.create(etudiant).then((e) => {
                    return res.json(e)
                })
            }
        })
    })

})

routes.delete('/delete/:cef', authenticateToken, (req, res) => {
    const cef = req.params.cef;

    EtudiantModel.findOneAndDelete({cef}).then((e) =>{
        if(!e)
            res.sendStatus(404)
        else {
            channel.sendToQueue(queueName, Buffer.from(cef))
            return res.sendStatus(201);
        } 
    })

})


export default routes;