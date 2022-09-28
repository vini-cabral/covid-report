import moment from "moment"
import Link from "next/link"
import { useEffect, useState } from "react"
// My Project
import ICountry from "../interface/countries"
import { allStatusURLParamsStdFrom, allStatusURLParamsStdSlug, allStatusURLParamsStdTo } from "../pages/country/[[...index]]"

type Props = {
  countries: ICountry[]
}

let render: JSX.Element | JSX.Element[]
export default function SearchPart({ countries }:Props) {
  const [slug, setSlug] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  useEffect(() => {
    setSlug(localStorage.getItem("allStatusURLParamsSlug")! || allStatusURLParamsStdSlug)
    setFrom(localStorage.getItem("allStatusURLParamsFrom")! || allStatusURLParamsStdFrom)
    setTo(localStorage.getItem("allStatusURLParamsTo")! || allStatusURLParamsStdTo)
  }, [])

  render = <h3>Carregando...</h3>

  if(slug && from && to) {
    render = <form>
      <label>País:
        <select value={slug} onChange={evt => setSlug(evt.currentTarget.value)}>
          {countries.map(el => <option key={el.Slug} value={el.Slug}>{el.Country}</option>)}
        </select>
      </label>
      <label>Início
        <input
          type="date"
          value={from}
          onChange={evt => setFrom(evt.currentTarget.value)}
          min={process.env.NEXT_PUBLIC_DATE_MIN}
          max={moment(to).add(-1, 'days').format().substring(0, 10)}
        />
      </label>
      <label>Fim
        <input
          type="date"
          value={to}
          onChange={evt => setTo(evt.currentTarget.value)}
          min={moment(from).add(1, 'days').format().substring(0, 10)}
          max={allStatusURLParamsStdTo}
        />
      </label>
      <Link href={`/country/${slug}/${from}/${to}`}>
          <a>Buscar</a>
      </Link>
    </form>
  }

  return <>
    { render }
  </>
}
