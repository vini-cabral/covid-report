import Link from "next/link"
// My Project
import styles from "./FooterPart.module.sass"

export default function FooterPart() {
  return <footer className={ styles['footer'] }>
    <p>
      Este {" "}
      <Link href="https://github.com/vini-cabral/covid-report">
        <a>Projeto</a>
      </Link> foi desenvolvido por{" "}
      <Link href="https://github.com/vini-cabral">
        <a><cite>Vinícius Cabral</cite></a>
      </Link>.
    </p>
    <p>
      Base de dados{": "}
      <Link href="https://documenter.getpostman.com/view/10808728/SzS8rjbc">
        <a><cite>Coronavirus COVID19 API</cite></a>
      </Link>.
    </p>
  </footer>
}