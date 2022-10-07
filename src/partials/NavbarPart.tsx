import Link from "next/link"
import { useState } from "react"
import { FaVirus } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { CgCloseO } from "react-icons/cg"
// My Project
import { PUB_CHART_DESC } from "../client/env"
import styles from './NavbarPart.module.sass'

let descStyle = ''
export default function NavbarPart({ classAdd }:{ classAdd?: string }) {
  descStyle = styles['navbar']
  if(classAdd) { 
    descStyle += ` ${classAdd}`
  }
  const [open, setOpen] = useState(false)
  return <nav className={ descStyle }>
    <Link href="/">
      <h1 className={ styles['logo'] } onClick={ ()=>setOpen(false) }>
        C<span className={ styles['char-hide'] }>O</span>
        <span className={ styles['icon'] }>
          <FaVirus />
        </span>
        VID REPORT
      </h1>
    </Link>
    <span className={ styles['btn-menu'] } onClick={ ()=>setOpen(!open) }>
      { open ? <CgCloseO /> : <GiHamburgerMenu /> }
    </span>
    <div className={ open ? styles['menu-mobile--open'] : styles['menu-mobile--close'] }>
      <Link href="/">
        <a onClick={ ()=>setOpen(false) }>RESUMO GLOBAL</a>
      </Link>
      <Link href={`/country/${PUB_CHART_DESC}`}>
        <a onClick={ ()=>setOpen(false) }>RESUMO PAÍS</a>
      </Link>
    </div>
  </nav>
}
