const express = require('express')
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
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

app.get('/api/order', async (req, res) => {
    const orders = await prisma.order.findMany({
        include: {
            items: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    res.json(orders)
})

app.post('/api/order', async (req, res) => {
    try {
    const { table, items, totalPrice } = req.body
     if (!table || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' })
    }

    const totalPriceNr = parseFloat(parseFloat(totalPrice).toFixed(2))

    const newOrder = await prisma.order.create({
        data: {
            table,
            totalPrice: totalPriceNr,
            items: {
                create: items.map(item => ({
                    itemName: item.itemName,
                    price: parseFloat(parseFloat(item.price).toFixed(2)),
                    count: parseInt(item.count),
                    category: item.category
                }))
            }
        },
        include: {items: true}
    })

    res.json({ success: true, order: newOrder })
    } catch(err){
        console.error(err)
        res.status(500).json({ error: 'Failed to create order' })
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});