import { useState, useEffect, useRef } from "react";
import Icon from "@mdi/react"
import {categories} from './data/menuData'
import './Menu.css'
import { mdiDotsHorizontalCircleOutline, mdiCart } from '@mdi/js';
import SideMenu from "./SideMenu";

const Menu = () => {
    const [selected, setSelected] = useState('Salad') 
    const [selectedItems, setSelectedItems] = useState([])
    const cartRef = useRef()
    const [totalPrice, setTotalPrice] = useState()
    const [allItems, setAllItems] = useState()
    const [showSideMenu, setShowSideMenu] = useState(false);

    
    const selectItem = (e) => {
        e.preventDefault()
        setSelected(e.currentTarget.id)
    }
    
    useEffect(() => {
        document.querySelector('.selectedCat').classList.remove('selectedCat')
        document.getElementById(selected).classList.add('selectedCat')
    },[selected])

    useEffect(() => {
        if(selectedItems.length > 0) cartRef.current.show();
        else cartRef.current.close()
    

    const total = selectedItems.reduce((acc, el) => acc + (parseFloat(el.price) * parseInt(el.count)), 0);
    const all = selectedItems.reduce((acc, el) => acc + parseInt(el.count), 0)
    setTotalPrice(total.toFixed(2));
    setAllItems(all)
}, [selectedItems]);

    const sendOrder = () => {
        console.log(selectedItems)
    }

    return(
        <>
              {showSideMenu ? (
            <SideMenu onClose={() => setShowSideMenu(false)} />
        ) : (
        <>
            <div className="container">
                <div className="categories">
                    <div className="more" onClick={() => setShowSideMenu(true)}>
                        <Icon path={mdiDotsHorizontalCircleOutline} size={0.8}></Icon>
                        <span>MORE</span>
                    </div>
                    {Object.entries(categories).map(([categoryName, categoryData]) => {
                        return(
                        <div key={categoryName} id={categoryName} className={`catCont ${selected === categoryName ? 'selectedCat' : ''}`} onClick={(e) => selectItem(e)}    >
                            <div>
                                <img 
                                loading="lazy" 
                                src={selected === categoryName ? categoryData.icon.replace('FFFFFF', 'D4AF37') : categoryData.icon} 
                                alt={categoryName} />
                            </div>
                            <span className="catName">{categoryName}</span>
                        </div>)
                    })}
                </div>
               <div className="items">
                <img
                src="https://firebasestorage.googleapis.com/v0/b/aquila-web-hosting.appspot.com/o/Logos%20Others%2FBlack%20and%20White%20Modern%20Restaurant%20Logo.png?alt=media&token=b726afed-b1d7-470e-97f7-b125185f9817" 
                alt="logo"
                className="logo"
                 />
                    {Object.entries(categories[selected]) 
                    .filter(([key]) => key !== 'icon') 
                    .map(([itemName, itemData]) => {
                        const existingItem = selectedItems.find(item => item.itemName === itemName);
                        const count = existingItem ? existingItem.count : 0;

                    return(
                        <div 
                        key={itemName} 
                        className="item" 
                        onClick={() => {
                           setSelectedItems(prevItems => {
                            if (count === 0 ) {
                                return [...prevItems, { itemName, price: itemData.price, count: 1, category: selected }];
                            }

                            return prevItems
                        });
                        }}>
                            <img src={itemData.image} alt={itemName}/>
                            <p>{itemName}</p>
                            <span>{parseFloat(itemData.price).toFixed(2)} €</span>

                            <div className="counter-container" style={count === 0 ? {display: 'none'} : {display: "flex"}} onClick={(e) => e.stopPropagation()}>
                            
                                <button
                                className="btn reduce"
                                onClick={() =>
                                    setSelectedItems(prevItems => {
                                    const updated = prevItems.map(item => {
                                    if (item.itemName === itemName) {
                                        const newCount = Math.max(item.count - 1, 0);
                                        return newCount === 0 ? null : { ...item, count: newCount };
                                    }
                                return item;
                                }).filter(Boolean);
                                return updated;
                                })
                                }
                                >-</button>

          <div className="count-display">{count}</div>

          <button
            className="btn add"
            onClick={e =>  {
                e.preventDefault()
                e.stopPropagation();
              setSelectedItems(prevItems => {
                const existingIndex = prevItems.findIndex(item => item.itemName === itemName);
                  const updatedItems = [...prevItems];
                  updatedItems[existingIndex].count++;
                  return updatedItems;
              });
            }}
          >+</button>
          </div>
                        </div>)
                        })}
                </div>
            </div>
            <dialog ref={cartRef}>
                    <div>
                        <span className="itemsCart"><b>{allItems}</b> items in cart</span>
                        <span className="priceCart">Price: <span>{totalPrice} €</span></span>
                        <div className="cartIcon">
                            <Icon 
                            path={mdiCart} 
                            size={1.2}
                            onClick={sendOrder}
                            ></Icon>
                        </div>
                    </div>
            </dialog> 
            </>
        )}
        </>
    )
}

export default Menu