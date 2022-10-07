import styles from "./styles.module.sass"
import NavbarPart from "../partials/NavbarPart"
import FooterPart from "../partials/FooterPart"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function Layout({ children }: Props) {
  return <>
    <NavbarPart classAdd="shadow"/>
    <main className={ styles['main'] }>{ children }</main>
    <FooterPart />
  </>
}
