import { useState, useEffect } from 'react'
import './Tables.css'

const Tables = () => {
    const [orders, setOrders] = useState([])


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
    }, [])

    const groupedByTable = orders.reduce((acc, order) => {
    if (!acc[order.table]) acc[order.table] = []
    acc[order.table].push(order)
    return acc
  }, {})


    return(
        <>
             <div className="orders-container">
      {Object.entries(groupedByTable).map(([table, tableOrders]) => (
        <div key={table} className="table-orders">
          <h2>Table {table}</h2>
        </div>
      ))}
    </div>
        </>
    )
}

export default Tables