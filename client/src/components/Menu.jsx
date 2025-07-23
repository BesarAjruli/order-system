import { useState, useEffect } from "react";
import Icon from "@mdi/react"
import {categories} from './data/menuData'
import './Menu.css'
import { mdiDotsHorizontalCircleOutline } from '@mdi/js';

const Menu = () => {
    const [selected, setSelected] = useState('Salad') 
    
    const selectItem = (e) => {
        e.preventDefault()
        setSelected(e.currentTarget.id)
    }
    
    useEffect(() => {
        document.querySelector('.selectedCat').classList.remove('selectedCat')
        document.getElementById(selected).classList.add('selectedCat')
    },[selected])

    return(
        <>
            <div className="container">
                <div className="categories">
                    <div className="more">
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
                    .map(([itemName, itemData]) => (
                        <div key={itemName} className="item">
                            <img src={itemData.image} alt={itemName}/>
                            <p>{itemName}</p>
                            <span>{parseFloat(itemData.price).toFixed(2)} €</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Menu