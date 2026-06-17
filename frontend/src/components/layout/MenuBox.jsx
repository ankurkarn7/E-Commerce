import React from 'react'
import { Menu } from '@headlessui/react'
import { Link } from 'react-router-dom'

const MenuBox = () => {
  return (
    <div className="relative">
        <Menu>
            <Menu.Button className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm font-semibold hover:bg-indigo-700 active:scale-95 transition flex items-center gap-2">
                Orders
                <span className="text-xs">▼</span>
            </Menu.Button>
            <Menu.Items className="mt-2 bg-white shadow-xl rounded-xl w-44 absolute right-0 z-20 overflow-hidden border border-slate-100 py-1">
                {[
                  {to : '/orders', label : 'All Orders'},
                  {to : '/pendingOrders', label : 'Pending Orders'},
                  {to : '/acceptedOrders', label : 'Accepted Orders'},
                  {to : '/cancelledOrders', label : 'Cancelled Orders'},
                ].map(link => (
                  <Menu.Item key={link.to}>
                    {({ active }) => (
                        <Link
                            to={link.to}
                            className={`${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'} block px-4 py-2 text-sm font-medium transition-colors`}>
                            {link.label}
                        </Link>
                    )}
                  </Menu.Item>
                ))}
            </Menu.Items>
        </Menu>
    </div>
  )
}

export default MenuBox
