import React from 'react'
import { ShoppingBag } from 'lucide-react'
const Navbar = () => {
    return (
        <div className='body-font'>
            <nav className='bg-mauve-400'>
                <ul className='flex items-center justify-between px-10 py-4 '>
                    <li>Arabico</li>
                    <li className='flex items-center gap-8 justify-around font-(--heading-font) text-lg '>
                        <a href="/">Home</a>
                        <a href="/menu">Menu</a>
                        <a href="/gallery">Gallery</a>
                        <a href="/contact">Contact</a>
                    </li>
                    <li>
                        <ShoppingBag />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
