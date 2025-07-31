import { useState, useEffect } from 'react'
import './Orders.css'
import Tables from './Tables'

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

            {selectedNav === 'orders' ? 'No orders yet': <Tables/>}
        </>
    )
}

export default Orders