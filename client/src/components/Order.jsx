import { useState, useEffect, useRef } from "react";
import "./Order.css";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL

const socket = io(backendUrl ? backendUrl : 'http://localhost:3000');

const Order = ({ data }) => {
  const [orders, setOrders] = useState([]);
  const [searchedOrders, setSearchedOrders] = useState([]);
  const passDialogRef = useRef();
  const password = import.meta.env.VITE_PASSWORD;


  useEffect(() => {
    const sendOrder = async () => {
      try {
        const response = await fetch( (backendUrl ? backendUrl : "http://localhost:3000") + '/api/order');

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

    if (
      localStorage.getItem("logged") &&
      localStorage.getItem("logged") === 'true'
    ) {
      passDialogRef.current.close();
    } else {
      passDialogRef.current.showModal();
    }

    socket.on("Orders", (data) => {
      sendOrder();
    });

    return () => socket.off("Orders");
  }, []);

  const orderServed = async (id, status) => {
    try {
      const request = await fetch(
        (backendUrl ? backendUrl : "http://localhost:3000") + `/api/${
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
        (backendUrl ? backendUrl : "http://localhost:3000") + `api/deleteOrder/${id}`,
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
      const request = await fetch( (backendUrl ? backendUrl : "http://localhost:3000") + `/api/orderPaid/${id}`, {
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

  
  const submitPassword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    for (const [key, value] of formData) {
      if(value === password){
        localStorage.setItem('logged', true)
        passDialogRef.current.style.border = '0'
        passDialogRef.current.close()
      } else{
        passDialogRef.current.style.border = '1px solid red'
      }
    }
  };

  const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    e.stopPropagation();
    e.preventDefault(); 
  }
};


  return (
    <>
      <dialog ref={passDialogRef} className="passwordDialog" onKeyDown={handleKeyDown}>
        <form className="passDialog" onSubmit={(e) => submitPassword(e)}>
          <h2>Enter password to access orders!</h2>
          <div className="group">
            <svg
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
            >
              <path
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            <input
              className="inputPass"
              type="password"
              placeholder="password"
              name="password"
            />
          </div>
          <button className="submiPass" type="submit">
            <span className="circle1"></span>
            <span className="circle2"></span>
            <span className="circle3"></span>
            <span className="circle4"></span>
            <span className="circle5"></span>
            <span className="text">Submit</span>
          </button>
        </form>
      </dialog>
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
