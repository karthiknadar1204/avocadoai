'use client'

import { CircleUser, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SideNav = () => {
    const MenuOptions = [
        {
            id: 1,
            name: "Dashboard",
            path: "/dashboard",
            icon: PanelsTopLeft
        },
        {
            id: 2,
            name: "Create New",
            path: "/dashboard/create-new",
            icon: PanelsTopLeft
        },
        {
            id: 3,
            name: "Upgrade",
            path: "/upgrade",
            icon: ShieldPlus
        },
        {
            id: 4,
            name: "Account",
            path: "/account",
            icon: CircleUser
        },
    ]

    const path = usePathname()

    console.log('path', path)
        
    return (
        <div className='w-64 h-screen shadow-md p-5'>
            <div className='grid gap-3' >
                {MenuOptions.map((item,index) => (
                    <Link href={item.path} key={index}>
                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 text-gray-700 hover:text-black
                             rounded-md cursor-pointer transition-colors duration-200 ${path === item.path ? 'bg-gray-100' : ''}`}>
                            <item.icon className='w-5 h-5' />
                            <h2>{item.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav