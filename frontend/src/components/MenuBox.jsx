import React from 'react'
import { Menu } from '@headlessui/react'
import { Link } from 'react-router-dom'

const MenuBox = () => {
  return (
    <div>
        <Menu>
            <Menu.Button className="bg-white px-3 py-1 rounded shadow hover:bg-gray-100 flex items-center gap-2">
                Orders
                <span>▲▼</span>   {/* small arrow */}
            </Menu.Button>
            <Menu.Items className="mt-2 bg-white shadow rounded w-40 absolute">
                <Menu.Item>
                    {({ active }) => (
                        <Link 
                            to="/orders" 
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2`}>
                            All Orders
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link 
                            to="/pendingOrders" 
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2`}>
                            Pending Orders
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link 
                            to="/acceptedOrders" 
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2`}>
                            Accepted Orders
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link 
                            to="/cancelledOrders" 
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2`}>
                            Cancelled Orders
                        </Link>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Menu>
    </div>
  )
}

export default MenuBox
