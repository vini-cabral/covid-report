import moment from "moment"
import Link from "next/link"
import { useContext, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { v4 as uuidv4 } from "uuid"
// My Project
import { PUB_DATE_MIN, PUB_TO } from "../client/env"
import dataContext from "../context"
import styles from "./SearchPart.module.sass"

let render: JSX.Element | JSX.Element[]
export default function SearchPart() {
  const { ctxCountryList, ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo, ctxURLParamChartDesc } = useContext(dataContext)
  const [inputSlug, setInputSlug] = useState(ctxURLParamSlug)
  const [inputFrom, setInputFrom] = useState(ctxURLParamFrom)
  const [inputTo, setInputTo] = useState(ctxURLParamTo)

  render = <h3>Carregando...</h3>

  if(ctxCountryList) {
    render = <form className={ styles['form'] }>
      <label className={ styles['field'] }>País:
        <select value={inputSlug} onChange={evt => setInputSlug(evt.currentTarget.value)}>
          {ctxCountryList.map(el => <option key={uuidv4()} value={el.Slug}>{el.Country}</option>)}
        </select>
      </label>
      <label className={ styles['field'] }>Início
        <input
          type="date"
          value={inputFrom}
          onChange={evt => setInputFrom(evt.currentTarget.value)}
          min={PUB_DATE_MIN}
          max={moment(inputTo).add(-1, 'days').format().substring(0, 10)}
        />
      </label>
      <label className={ styles['field'] }>Fim
        <input
          type="date"
          value={inputTo}
          onChange={evt => setInputTo(evt.currentTarget.value)}
          min={moment(inputFrom).add(1, 'days').format().substring(0, 10)}
          max={PUB_TO}
        />
      </label>
      <Link href={`/country/${inputSlug}/${inputFrom}/${inputTo}/${ctxURLParamChartDesc}`}>
          <a className={ styles['btn-search'] }>
            <FaSearch /><span>BUSCAR</span>
          </a>
      </Link>
    </form>
  }

  return <>
    { render }
  </>
}
