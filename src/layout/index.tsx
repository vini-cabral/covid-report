import Link from "next/link"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

export default function Layout({ children }: Props) {
  return <>
    <nav>
      <h1>Navbar</h1>
      <Link href="/">
        <a>Home</a>
      </Link>{" | "}
      <Link href="/country">
        <a>Country</a>
      </Link>
    </nav>
    <main>{ children }</main>
    <footer>
      <h3>Footer</h3>
    </footer>
  </>
}
