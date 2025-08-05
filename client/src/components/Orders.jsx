import { useState, useEffect } from 'react'
import './Orders.css'
import Tables from './Tables'
import Order from './Order'

const Orders = () => {
    const [selectedNav, setSelectedNav] = useState('orders')

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