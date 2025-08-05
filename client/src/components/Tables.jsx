import { useState, useEffect } from 'react'
import './Tables.css'
import Order from './Order'
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Tables = () => {
    const [orders, setOrders] = useState([])
    const [groupedOrders, setGroupedOrders] = useState([])

    useEffect(() => {
           const sendOrder = async() => {
             try {
    const response = await fetch('http://localhost:3000/api/order');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    setOrders(result)
  } catch (error) {
    console.error('Error posting order:', error);
  }
    }

    sendOrder()

    socket.on("waiterCalled", (table) => {
      document.getElementById(`table${table}`).style.borderColor = 'red'
    });

    socket.on("Orders", (data) => {
      sendOrder()
    });

    return () => {
      socket.off("waiterCalled")
      socket.off("Orders")
    };
    }, [])

    useEffect(() => {
      orders.map(order => {
        if(order.status !== 'Paid'){
          const tableCont = document.getElementById(`table${order.table}`)
          tableCont.style.borderColor = 'yellow'
      }
      })
    }, [orders])

    const tableOrders = (table) => {
      document.getElementById(`table${table}`).style.borderColor = '#b6b6b6'
      const grOrder = orders.filter(order =>
         parseInt(order.table) === parseInt(table)
        )
      setGroupedOrders(grOrder)
    }

    return(
        <>
          {groupedOrders.length === 0 ? 
                  <div className="orders-container">
      {Array.from({ length: 10 }, (_, i) => (
      <div 
      key={i+1} 
      className="table-orders" 
      id={`table${i+1}`}
      onClick={() => tableOrders(i+1)}
      >
          <h2>Table {i+1}</h2>
        </div>
      ))}
    </div>
    : <div className='ordersCont'>
      <Order data={groupedOrders}/>
    </div>}
     
        </>
    )
}

export default Tables