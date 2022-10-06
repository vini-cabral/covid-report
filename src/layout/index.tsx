import NavbarPart from "../partials/NavbarPart"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function Layout({ children }: Props) {
  return <>
    <NavbarPart />
    <main>{ children }</main>
    <footer>
      <h3>Footer</h3>
    </footer>
  </>
}
