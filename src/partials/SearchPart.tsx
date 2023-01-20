import moment from "moment"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { FaSearch } from "react-icons/fa"
// My Project
import { PUB_DATE_MIN, PUB_TO } from "../client/env"
import Loading from "../components/Loading"
import dataContext from "../context"
import styles from "./SearchPart.module.sass"

let render: JSX.Element | JSX.Element[] = <Loading />
export default function SearchPart({setFormSearchClose}:{setFormSearchClose:Function}) {
  const { ctxCountryList, ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo, ctxURLParamChartDesc } = useContext(dataContext)
  const [inputSlug, setInputSlug] = useState(ctxURLParamSlug)
  const [inputFrom, setInputFrom] = useState(ctxURLParamFrom)
  const [inputTo, setInputTo] = useState(ctxURLParamTo)
  const router = useRouter()

  if(ctxCountryList) {
    render = <>
      <form className={ styles['form'] } onSubmit={ evt=>{
        evt.preventDefault()
        setFormSearchClose(true)
        router.push(`/country/${inputSlug}/${inputFrom}/${inputTo}/${ctxURLParamChartDesc}`)
      } }>
        <label className={ styles['field'] }>País:
          <select value={inputSlug} onChange={evt => setInputSlug(evt.currentTarget.value)}>
            {ctxCountryList.map(el => <option key={el.Slug} value={el.Slug}>{el.Country}</option>)}
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
        <button type="submit" className={ styles['button'] }>
          <FaSearch /><span>BUSCAR</span>
        </button>
      </form>
    </>
  }

  return <>
    { render }
  </>
}
