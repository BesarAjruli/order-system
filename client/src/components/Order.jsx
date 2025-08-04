import { useState, useEffect } from "react";
import "./Order.css";

const Order = ({data}) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const sendOrder = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/order");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setOrders(result);
      } catch (error) {
        console.error("Error posting order:", error);
      }
    };

    sendOrder();
  }, []);

  const orderServed = async (id, status) => {
    try {
      const request = await fetch(
        `http://localhost:3000/api/${ status !== 'Served' ? 'updateServed' : 'updateOrder' }/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }        
      );

       if (!request.ok) {
      throw new Error('Network response was not ok');
    }

        const updatedOrder = await request.json();
    console.log("Order updated:", updatedOrder);

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const request = await fetch(
        `http://localhost:3000/api/deleteOrder/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }        
      );

       if (!request.ok) {
      throw new Error('Network response was not ok');
    }

        const deletedOrder = await request.json();
    console.log("Order deleted:", deletedOrder);

      setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== id)
    );
    } catch (err) {
      console.error(err);
    }
  }

  const orderPaid = async (id, status) => {
    try {
      const request = await fetch(
        `http://localhost:3000/api/orderPaid/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }        
      );

       if (!request.ok) {
      throw new Error('Network response was not ok');
    }

        const updatedOrder = await request.json();
    console.log("Order updated:", updatedOrder);

    setOrders((prevOrders) =>
      prevOrders.filter((order) =>
        order.id !== id
      )
    );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {(data ? data : orders).map((order) => (
        <div
          key={order.id}
          className="order-card"
          style={
            order.status === "Served"
              ? { background: "rgba(52, 152, 219, 0.2)" }
              : { background: "rgb(236, 236, 236)" }
          }
        >
          <p>Order #{order.id}</p>
          <div>
            <p>Table: {order.table}</p>
            <p>Price: {order.totalPrice}€</p>
          </div>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.itemName} x {item.count} – ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="actionButtonCont">
            <button
              className={`actionButtons ${order.status !== 'Served' ? 'served' : 'ordered'}`}
              onClick={() => orderServed(order.id, order.status)}
            >
              {order.status === 'Served' ? 'Ordered' : 'Served'}
            </button>
            <button 
            className="actionButtons"
            onClick={() => orderPaid(order.id)}>Paid</button>
            <button 
            className="actionButtons remove"
            onClick={() => deleteOrder(order.id)}>Remove</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Order;
