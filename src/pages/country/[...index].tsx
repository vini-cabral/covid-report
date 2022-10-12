import moment from "moment"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
// My Project
import { apiServiceGetCountries, apiServiceGetByCountryAllStatus } from "../../client/service/apiService"
import { ICountry as ICountryList } from "../../interface/countries"
import dataContext from "../../context"
import { PUB_CHART_DESC, PUB_DATE_MIN, PUB_FROM, PUB_SLUG, PUB_TO } from "../../client/env"
import SearchPart from "../../partials/SearchPart"
import CountryChartLinePart from "../../partials/CountryChartLinePart"
import Loading from "../../components/Loading"
import ErrorDialog from "../../components/ErrorDialog"
import Card from "../../components/Card"
import styles from "../../styles/CountryPage.module.sass"

// General Numbers
export const PrintNumbers = ({
  deaths,
  confirmed,
  recovered,
  labels
}:{
  deaths: number
  confirmed: number
  recovered: number
  labels: string[]
}) => {
  if(typeof deaths === 'number' && typeof confirmed === 'number' && typeof recovered === 'number') {
    return <div className={ styles['print-label'] }>
      <h4 >{ labels[0] }: <strong>{ deaths.toLocaleString() }</strong></h4>
      <h4 >{ labels[1] }: <strong>{ confirmed.toLocaleString() }</strong></h4>
      <h4 >{ labels[2] }: <strong>{ recovered.toLocaleString() }</strong></h4>
    </div>
  } else {
    return <ErrorDialog>
      <h4>Erro!</h4>
      <p>Dados inconsistentes.</p>
    </ErrorDialog>
  }
}

// Handler - Country List
function handlerApiClientCountries(
  countryList: ICountryList[] | null,
  setCountryList: Function,
  setErrorCountryList: Function
): void {
  if(countryList === null) {
    apiServiceGetCountries()
    .then(res => {
      setCountryList(
        [ ...res.sort((a:ICountryList, b:ICountryList) => (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0)) ]
      )
    })
    .catch(e => setErrorCountryList(e))
  }
}

// Handler - URL Parameters Validate
function handlerURLParamsValidate(
  params: string | string[], countryList:ICountryList[], chartDescList: string[]
): null | string[] {
  params =  typeof params === 'string' ? [params] : params
  if(params.length !== 4) {
    return null
  }
  // Check Date
  const from = params[1].substring(0, 10)
  const to = params[2].substring(0, 10)
  if(
    !moment(from, 'YYYY-MM-DD', false).isValid() ||
    !moment(to, 'YYYY-MM-DD', false).isValid() ||
    (from < PUB_DATE_MIN) ||
    (to > PUB_TO) ||
    (to && from >= to)
  ) {
    return null
  }
  // Check Chart Desc List
  if(!chartDescList.find(el => el === params[3])) {
    return null
  }
  // Check Country
  if(!countryList.find(el => el.Slug === params[0])) {
    return null
  }
  // Successful!!!
  return params
}

// Handler - By Country All Status
function handlerApiClientByCountryAllStatus(
  slug: string, from: string, to: string,
  setByCountryAllStatus: Function,
  setErrorCountryStatus: Function
): void {
  apiServiceGetByCountryAllStatus(slug, from, to)
  .then(res => {
    setByCountryAllStatus([...res])
  })
  .catch(e => setErrorCountryStatus(e))
}

// Main
let render: JSX.Element | JSX.Element[]
const chartDescList = [ 'deaths', 'confirmed', 'recovered' ]
let URLParams: null | string[] = null
export default function Country() {
  const router = useRouter()
  const {
    ctxCountryList, setCtxCountryList, ctxByCountryAllStatus, setCtxByCountryAllStatus,
    ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo,
    setCtxURLParamSlug, setCtxURLParamFrom, setCtxURLParamTo, setCtxURLParamChartDesc
  } = useContext(dataContext)

  // Country List
  const [errorCountryList, setErrorCountryList] = useState<Error | null>(null)
  useEffect(() => {
    handlerApiClientCountries(ctxCountryList, setCtxCountryList, setErrorCountryList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxCountryList])

  // By Country All Status
  const [errorCountryStatus, setErrorCountryStatus] = useState<Error | null>(null)
  useEffect(() => {
    if(ctxCountryList && router.query.index) {
      URLParams = handlerURLParamsValidate(router.query.index, ctxCountryList, chartDescList)
      if(URLParams) {
        setCtxURLParamSlug(URLParams[0])
        setCtxURLParamFrom(URLParams[1])
        setCtxURLParamTo(URLParams[2])
        setCtxURLParamChartDesc(URLParams[3])
        if(ctxByCountryAllStatus === null) {
          handlerApiClientByCountryAllStatus(
            URLParams[0], URLParams[1], URLParams[2],
            setCtxByCountryAllStatus, setErrorCountryStatus
          )
        }
        if(URLParams[0] !== ctxURLParamSlug || URLParams[1] !== ctxURLParamFrom || URLParams[2] !== ctxURLParamTo) {
          setCtxByCountryAllStatus(null)
          handlerApiClientByCountryAllStatus(
            URLParams[0], URLParams[1], URLParams[2],
            setCtxByCountryAllStatus, setErrorCountryStatus
          )
        }
      } else {
        setCtxByCountryAllStatus(null)
        setCtxURLParamSlug(PUB_SLUG)
        setCtxURLParamFrom(PUB_FROM)
        setCtxURLParamTo(PUB_TO)
        setCtxURLParamChartDesc(PUB_CHART_DESC)
        router.push(`/country/${PUB_SLUG}/${PUB_FROM}/${PUB_TO}/${PUB_CHART_DESC}`)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxCountryList, router])
  useEffect(() => {
    setCtxURLParamSlug(PUB_SLUG)
    setCtxURLParamFrom(PUB_FROM)
    setCtxURLParamTo(PUB_TO)
    setCtxURLParamChartDesc(PUB_CHART_DESC)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCountryStatus])

  // Render
  render = <Loading />

  if(errorCountryList || errorCountryStatus) {
    render = <ErrorDialog>
      <h4>Erro!</h4>
      <p>Não foi possível conectar-se à base de dados, tente mais tarde.</p>
    </ErrorDialog>
  }

  if(!errorCountryList && !errorCountryStatus && ctxCountryList && ctxByCountryAllStatus) {
    render = <section className={ styles['section'] }>
      <h1>Resumo {ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Country}</h1>
      <Card classAdd="shadow" cornerRad>
        <h4>Escolha um país e um intervalo de datas</h4>
        <SearchPart />
      </Card>
      <Card classAdd="shadow" cornerRad>
        <h3>Números Totais</h3>
        <h5>Dados de acordo com { moment(ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Date).locale('pt-br').calendar().toLocaleLowerCase() }</h5>
        <PrintNumbers
          deaths={ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Deaths}
          confirmed={ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Confirmed}
          recovered={ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Recovered}
          labels={['Mortos', 'Confirmados', 'Recuperados']}
        />
      </Card>
      <CountryChartLinePart chartDescList={ chartDescList } />
    </section>
  }

  return <>{ render }</>
}
