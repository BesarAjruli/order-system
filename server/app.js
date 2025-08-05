import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { EventEmitter } from "events";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});



app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.set("trust proxy", true);

app.get("/api/order", async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await prisma.order.findMany({
    where: {
      status: { not: "Paid" },
     createdAt: {
      gte: startOfDay,
      lte: endOfDay, 
    },
    },
    include: {
      items: true,
    },
  });

  const priority = { Ordered: 1, Served: 2 };
  const sortedOrders = orders.sort(
    (a, b) => priority[a.status] - priority[b.status]
  );

  res.json(sortedOrders);
});

const newOrders = new EventEmitter()

newOrders.on('ordered', (data) => {
  io.emit('Orders', data)
})

app.post("/api/order", async (req, res) => {
  try {
    const { table, items, totalPrice } = req.body;
    if (!table || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const totalPriceNr = parseFloat(parseFloat(totalPrice).toFixed(2));

    const newOrder = await prisma.order.create({
      data: {
        table,
        totalPrice: totalPriceNr,
        status: "Ordered",
        items: {
          create: items.map((item) => ({
            itemName: item.itemName,
            price: parseFloat(parseFloat(item.price).toFixed(2)),
            count: parseInt(item.count),
            category: item.category,
          })),
        },
      },
      include: { items: true },
    });

    newOrders.emit('ordered', newOrder)
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put("/api/updateServed/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "Served" },
    include: { items: true },
  });

  res.json(updatedOrder);
});

app.put("/api/updateOrder/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "Ordered" },
    include: { items: true },
  });

  res.json(updatedOrder);
});

app.delete("/api/deleteOrder/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.orderItems.deleteMany({
    where: { orderId: id },
  });

  const updatedOrder = await prisma.order.delete({
    where: { id },
  });

  res.json(updatedOrder);
});

app.put("/api/orderPaid/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: "Paid" },
    include: { items: true },
  });

  res.json(updatedOrder);
});

const waiterCalled = new EventEmitter();

waiterCalled.on('called', (table) => {
  io.emit('waiterCalled', table)
})

app.post('/api/callWaiter', (req, res) => {
  const table = req.body.table
  waiterCalled.emit('called', table)
  res.json({success: true})
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
