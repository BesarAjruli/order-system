import { useState, useEffect } from 'react'
import './Orders.css'
import Tables from './Tables'
import Order from './Order'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [selectedNav, setSelectedNav] = useState('orders')

   

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

    const onBell = (event) => {
      const { message, table } = event.detail;
      console.log("Bell clicked with data:", message, table);
      triggerFunction(message, table);

      window.addEventListener("bell-signal", onBell);
    return () => window.removeEventListener("bell-signal", onBell);
    };

    

     const triggerFunction = (msg, table) => {
    alert(`Triggered with: ${msg} (Table: ${table})`);
  };


    return(
        <>
            <div className='order-nav'>
                <div 
                className={selectedNav === 'orders' ? 'selectedOrderNav' : ''}
                onClick={() => setSelectedNav('orders')}
                >
                    <h2>Orders</h2>
                </div>
                <div 
                className={selectedNav !== 'orders' ? 'selectedOrderNav' : ''}
                onClick={() => setSelectedNav('tables')}
                >
                    <h2 >Tabels</h2>
                </div>
            </div>

            <div
            className={selectedNav === 'orders' ? 'ordersCont' : 'tablesCont'}>
              {selectedNav === 'orders' ? <Order/> : <Tables/>}
            </div>
        </>
    )
}

export default Orders