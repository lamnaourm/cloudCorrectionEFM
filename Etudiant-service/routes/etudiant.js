import express from 'express'
import jwt from 'jsonwebtoken'
import amqp from 'amqplib'

const routes = express.Router()

const JWT_SECRET = process.env.secret
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
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName);
 }


routes.get('/all', authenticateToken, (req, res) => {

})

routes.post('/add', authenticateToken, (req, res) => {
    
})

routes.delete('/delete/:cef', authenticateToken, (req, res) => {
    
})


export default routes;