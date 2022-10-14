import moment from "moment"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { TbMapSearch } from "react-icons/tb"
import { IoArrowBack } from "react-icons/io5"
import Link from "next/link"
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
import WarningDialog from "../../components/WarningDialog"

// General Numbers
const PrintNumbers = ({
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
function handleApiClientCountries(
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
function handleURLParamsValidate(
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
function handleApiClientByCountryAllStatus(
  slug: string, from: string, to: string,
  setByCountryAllStatus: Function,
  setErrorCountryStatus: Function,
  setErrorInconsistentData: Function
): void {
  apiServiceGetByCountryAllStatus(slug, from, to)
  .then(res => {
    try {
      if(res.length > 0) {
        setErrorInconsistentData(null)
        setByCountryAllStatus([...res])
      } else {
        throw new Error("There are no records for this search");
      }
    } catch (error) {
      if(error instanceof Error) setErrorInconsistentData(error)
    }
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
    handleApiClientCountries(ctxCountryList, setCtxCountryList, setErrorCountryList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxCountryList])

  // By Country All Status
  const [errorCountryStatus, setErrorCountryStatus] = useState<Error | null>(null)
  const [errorInconsistentData, setErrorInconsistentData] = useState<Error | null>(null)
  useEffect(() => {
    if(ctxCountryList && router.query.index) {
      URLParams = handleURLParamsValidate(router.query.index, ctxCountryList, chartDescList)
      if(URLParams) {
        setCtxURLParamSlug(URLParams[0])
        setCtxURLParamFrom(URLParams[1])
        setCtxURLParamTo(URLParams[2])
        setCtxURLParamChartDesc(URLParams[3])
        if(ctxByCountryAllStatus === null) {
          handleApiClientByCountryAllStatus(
            URLParams[0], URLParams[1], URLParams[2],
            setCtxByCountryAllStatus, setErrorCountryStatus, setErrorInconsistentData
          )
        }
        if(URLParams[0] !== ctxURLParamSlug || URLParams[1] !== ctxURLParamFrom || URLParams[2] !== ctxURLParamTo) {
          setCtxByCountryAllStatus(null)
          handleApiClientByCountryAllStatus(
            URLParams[0], URLParams[1], URLParams[2],
            setCtxByCountryAllStatus, setErrorCountryStatus, setErrorInconsistentData
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
  const [formSearchClose, setFormSearchClose] = useState(true)
  const [printDeaths, setPrintDeaths] = useState<number>(0)
  const [printConfirmed, setPrintConfirmed] = useState<number>(0)
  const [printRecovered, setPrintRecovered] = useState<number>(0)

  if(errorCountryList || errorCountryStatus) {
    render = <ErrorDialog>
      <h4>Erro!</h4>
      <p>Erro durante a conexão</p>
    </ErrorDialog>
  }

  if(errorInconsistentData) {
    render = <WarningDialog>
      <h4>Aviso!</h4>
      <p>Não há registros para esta busca.</p>
      <Link href={`/country/${PUB_SLUG}/${PUB_FROM}/${PUB_TO}/${PUB_CHART_DESC}`}>
        <a>Clique para voltar!</a>
      </Link>
    </WarningDialog>
  }

  if(!errorCountryList && !errorCountryStatus && ctxCountryList && ctxByCountryAllStatus) {
    render = <section className={ styles['section'] }>
      <h1>Resumo {ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Country}</h1>
      <div className={styles['panel'] }>
        <div className={ formSearchClose ? styles['form-search-show'] : styles['form-search-hide'] }>
          <Card classAdd="shadow" cornerRad>
            <div onClick={ () => setFormSearchClose(false) } className={ `${styles['form-search-btn']}` }>
              <input type="text" readOnly placeholder="Pesquise por país..."/>
              <span>
                <TbMapSearch />
              </span>
            </div>
            <div className={ styles['form-search-dialog'] }>
              <span onClick={ () => setFormSearchClose(true) } >
                <IoArrowBack />
              </span>
              <h4>Escolha um país e um intervalo de datas</h4>
              <SearchPart setFormSearchClose={ setFormSearchClose } />
            </div>
          </Card>
        </div>
        <div className={styles['chart-data'] }>
          <Card classAdd="shadow" cornerRad>
            <h3>Números Totais</h3>
            <h5>Conforme { moment(ctxByCountryAllStatus[ctxByCountryAllStatus.length - 1].Date).locale('pt-br').calendar().toLocaleLowerCase() }</h5>
            <PrintNumbers
              deaths={printDeaths}
              confirmed={printConfirmed}
              recovered={printRecovered}
              labels={['Mortos', 'Confirmados', 'Recuperados']}
            />
          </Card>
          <Card classAdd="shadow overflow-x" cornerRad>
            <h3>Curva diária da COVID-19</h3>
            <CountryChartLinePart
              chartDescList={ chartDescList }
              setPrintDeaths={ setPrintDeaths }
              setPrintConfirmed={ setPrintConfirmed }
              setPrintRecovered={ setPrintRecovered }
            />
          </Card>
        </div>
      </div>
    </section>
  }

  return <>{ render }</>
}
