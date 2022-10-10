import Link from "next/link"
import { useContext, useState } from "react"
// My Project
import dataContext from "../context"

let render: JSX.Element | JSX.Element[]
export default function SearchPart() {
  const { ctxCountryList, ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo, ctxURLParamChartDesc } = useContext(dataContext)
  const [inputSlug, setInputSlug] = useState(ctxURLParamSlug)
  const [inputFrom, setInputFrom] = useState(ctxURLParamFrom)
  const [inputTo, setInputTo] = useState(ctxURLParamTo)

  render = <h3>Carregando...</h3>

  if(ctxCountryList) {
    render = <form>
      <label>País:
        <select value={inputSlug} onChange={evt => setInputSlug(evt.currentTarget.value)}>
          {ctxCountryList.map(el => <option key={el.Slug} value={el.Slug}>{el.Country}</option>)}
        </select>
      </label>
      <label>Início
        <input
          type="date"
          value={inputFrom}
          onChange={evt => setInputFrom(evt.currentTarget.value)}
        />
      </label>
      <label>Fim
        <input
          type="date"
          value={inputTo}
          onChange={evt => setInputTo(evt.currentTarget.value)}
        />
      </label>
      <Link href={`/country/${inputSlug}/${inputFrom}/${inputTo}/${ctxURLParamChartDesc}`}>
          <a>Buscar</a>
      </Link>
    </form>
  }

  return <>
    { render }
  </>
}
