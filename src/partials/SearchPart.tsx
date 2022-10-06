import moment from "moment"
import Link from "next/link"
import { useContext, useState } from "react"
// My Project
import { PUB_DATE_MIN, PUB_FROM, PUB_TO } from "../client/env"
import dataContext from "../context"

let render: JSX.Element | JSX.Element[]
export default function SearchPart() {
  const { countryList, URLParamSlug, URLParamFrom, URLParamTo, URLParamChartDesc } = useContext(dataContext)
  const [inputSlug, setInputSlug] = useState(URLParamSlug)
  const [inputFrom, setInputFrom] = useState(URLParamFrom)
  const [inputTo, setInputTo] = useState(URLParamTo)

  render = <h3>Carregando...</h3>

  if(countryList) {
    render = <form>
      <label>País:
        <select value={inputSlug} onChange={evt => setInputSlug(evt.currentTarget.value)}>
          {countryList.map(el => <option key={el.Slug} value={el.Slug}>{el.Country}</option>)}
        </select>
      </label>
      <label>Início
        <input
          type="date"
          value={inputFrom}
          onChange={evt => setInputFrom(evt.currentTarget.value)}
          min={PUB_DATE_MIN}
          max={moment(PUB_TO).add(-1, 'days').format().substring(0, 10)}
        />
      </label>
      <label>Fim
        <input
          type="date"
          value={inputTo}
          onChange={evt => setInputTo(evt.currentTarget.value)}
          min={moment(PUB_FROM).add(1, 'days').format().substring(0, 10)}
          max={PUB_TO}
        />
      </label>
      <Link href={`/country/${URLParamChartDesc}?slug=${inputSlug}&from=${inputFrom}&to=${inputTo}`}>
          <a>Buscar</a>
      </Link>
    </form>
  }

  return <>
    { render }
  </>
}
