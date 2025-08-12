import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Menu from './components/Menu.jsx'
import Orders from './components/Orders.jsx'
import Gallery from './components/Gallery.jsx'
import './App.css'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/:table",
    element: <App />,
  },
  {
    path: "/menu/:table",
    element: <Menu />,
  },
  {
    path: '/orders',
    element: <Orders />
  },
  {
    path: '/gallery',
    element: <Gallery/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
