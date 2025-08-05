import { useState, useEffect } from "react";
import "./Order.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Order = ({ data }) => {
  const [orders, setOrders] = useState([]);
  const [searchedOrders, setSearchedOrders] = useState([]);

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

    socket.on("Orders", (data) => {
      sendOrder();
    });

    return () => socket.off("Orders");
  }, []);

  const orderServed = async (id, status) => {
    try {
      const request = await fetch(
        `http://localhost:3000/api/${
          status !== "Served" ? "updateServed" : "updateOrder"
        }/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!request.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedOrder = await request.json();

      if (searchedOrders.length > 0) {
        setSearchedOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      }
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
        throw new Error("Network response was not ok");
      }

      const deletedOrder = await request.json();
      console.log("Order deleted:", deletedOrder);

      if (searchedOrders.length > 0) {
        setSearchedOrders((prev) => prev.filter((order) => order.id !== id));
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } else {
        setOrders((prev) => prev.filter((order) => order.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const orderPaid = async (id, status) => {
    try {
      const request = await fetch(`http://localhost:3000/api/orderPaid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!request.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedOrder = await request.json();
      console.log("Order updated:", updatedOrder);

      if (searchedOrders.length > 0) {
        setSearchedOrders((prev) => prev.filter((order) => order.id !== id));
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } else {
        setOrders((prev) => prev.filter((order) => order.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const searchOrder = (e) => {
    const query = e.target.value.toLowerCase();
    console.log(query.split("#")[1]);

    const searchedOrders = orders.filter(
      (order) =>
        order.table.toLowerCase().includes(query) ||
        order.id.toString().includes(query.split("#")[1])
    );

    setSearchedOrders(searchedOrders);
  };

  return (
    <>
      <form className="form">
        <button>
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <input
          className="input"
          placeholder="Search order"
          type="text"
          onChange={(e) => searchOrder(e)}
        />
        <button className="reset" type="reset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </form>
      {(data
        ? data
        : searchedOrders.length === 0
        ? orders
        : searchedOrders
      ).map((order) => (
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
              className={`actionButtons ${
                order.status !== "Served" ? "served" : "ordered"
              }`}
              onClick={() => orderServed(order.id, order.status)}
            >
              {order.status === "Served" ? "Ordered" : "Served"}
            </button>
            <button
              className="actionButtons"
              onClick={() => orderPaid(order.id)}
            >
              Paid
            </button>
            <button
              className="actionButtons remove"
              onClick={() => deleteOrder(order.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Order;
