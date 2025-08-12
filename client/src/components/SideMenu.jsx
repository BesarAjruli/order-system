import { mdiClose, mdiFacebook, mdiMapMarker, mdiPhone } from '@mdi/js'
import Icon from '@mdi/react'
import './SideMenu.css'
import { Link } from 'react-router-dom'

const SideMenu = ({ onClose }) => {
    return(
        <>
            <div className="sideMenu">
                <div>
                    <div className="more close" onClick={onClose}>
                        <Icon path={mdiClose} size={0.8}></Icon>
                        <span>CLOSE</span>
                    </div>

                      <img
                src="https://firebasestorage.googleapis.com/v0/b/aquila-web-hosting.appspot.com/o/Logos%20Others%2FBlack%20and%20White%20Modern%20Restaurant%20Logo.png?alt=media&token=b726afed-b1d7-470e-97f7-b125185f9817" 
                alt="logo"
                className="logoSideMenu"
                 />
                </div>

                <div className='navigations'>
                    <Link to='/'>Home</Link>
                    <Link to='/menu'>Menu</Link>
                    <Link to=''>Gallery</Link>
                    <Link to=''>About Us</Link>
                </div>

                <div className='contactCont'>
                <span>CONTACT US</span>
                <div id="socialCont">
                    <div><Icon path={mdiFacebook} size={1.3}></Icon></div>
                    <div><Icon path={mdiMapMarker} size={1.3}></Icon></div>
                    <div><Icon path={mdiPhone} size={1.3}></Icon></div>
                </div>
            </div>
            </div>
        </>
    )
}

export default SideMenu
