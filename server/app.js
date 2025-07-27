const express = require('express')
const cors = require('cors');
const path = require('path');

const app = express()

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.set('trust proxy', true)

app.get('/api/order', (req, res) => {
    console.log(req.body)
})
app.post('/api/order', (req, res) => {
    console.log(req.body)
    res.json({success: true})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});