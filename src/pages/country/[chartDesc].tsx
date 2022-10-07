import moment from "moment"
import { NextRouter, useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
// My Project
import { apiServiceGetCountries, apiServiceGetByCountryAllStatus } from "../../client/service/apiService"
import { ICountry as ICountryList } from "../../interface/countries"
import dataContext from "../../context"
import { PUB_CHART_DESC, PUB_DATE_MIN, PUB_FROM, PUB_SLUG, PUB_TO } from "../../client/env"
import SearchPart from "../../partials/SearchPart"
import CountryChartPart from "../../partials/CountryChartPart"

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
// Handler - URL Chart Desc Validate
function handlerURLchartDescValidate(
  chartDescList:string[],
  URLchartDesc:string | string[] | undefined
): null | string {
  if(!URLchartDesc) {
    return null
  }
  URLchartDesc = typeof URLchartDesc === 'string' ? URLchartDesc : URLchartDesc[0]
  if(URLchartDesc && chartDescList.find(el => el === URLchartDesc)) {
    return URLchartDesc
  }
  return null
}
// Handler - URL Parameters Validate
function handlerURLParamsValidate(countryList:ICountryList[], router:NextRouter): null | string[] {
  let { slug, from, to } = router.query

  if(typeof slug === 'string' && typeof from === 'string' && typeof to === 'string') {
    // Check Date
    from = from.substring(0, 10)
    to = to.substring(0, 10)
    if(
      !moment(from, 'YYYY-MM-DD', false).isValid() ||
      !moment(to, 'YYYY-MM-DD', false).isValid() ||
      (from < PUB_DATE_MIN) ||
      (to > PUB_TO) ||
      (to && from >= to)
    ) {
      return null
    }
    // Check Country
    if(!countryList.find(el => el.Slug === slug)) {
      return null
    }
    // Successful!!!
    return [slug, from, to]
  }
  // Fail
  return null
}

let render: JSX.Element | JSX.Element[]
const chartDescList = [ 'deaths', 'confirmed', 'recovered' ]
let URLchartDesc: string | null = null
let URLParams: null | string[] = null
let URLParamsTotal: number = 0
export default function Country() {
  const router = useRouter()
  const {
    countryList, setCountryList, byCountryAllStatus, setByCountryAllStatus, URLParamSlug, setURLParamSlug, URLParamFrom,
    setURLParamFrom, URLParamTo, setURLParamTo, URLParamChartDesc, setURLParamChartDesc
  } = useContext(dataContext)

  // Handler - Country List
  const [errorCountryList, setErrorCountryList] = useState<Error | null>(null)
  useEffect(() => {
    handlerApiClientCountries(countryList, setCountryList, setErrorCountryList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryList])

  // Handler - By Country All Status
  const [errorCountryStatus, setErrorCountryStatus] = useState<Error | null>(null)
  useEffect(() => {
    if(countryList && router) {
      URLchartDesc = handlerURLchartDescValidate(chartDescList, router.query.chartDesc)
      URLParams = handlerURLParamsValidate(countryList, router)
      URLParamsTotal = Object.keys(router.query).length

      if(URLParamsTotal === 1) {
        if(URLchartDesc) {
          setURLParamChartDesc(URLchartDesc)
          if(byCountryAllStatus === null) {
            handlerApiClientByCountryAllStatus(URLParamSlug, URLParamFrom, URLParamTo, setByCountryAllStatus, setErrorCountryStatus)
          }
        } else {
          setURLParamChartDesc(PUB_CHART_DESC)
          setURLParamSlug(PUB_SLUG)
          setURLParamFrom(PUB_FROM)
          setURLParamTo(PUB_TO)
          router.push(`/country/${PUB_CHART_DESC}`)
        }
      }

      if(URLParamsTotal > 1) {
        if(URLchartDesc && URLParams) {
          if(URLParamChartDesc !== URLchartDesc) {
            setURLParamChartDesc(URLchartDesc)
          }
          if(
            URLParamSlug !== URLParams[0] ||
            URLParamFrom !== URLParams[1] ||
            URLParamTo !== URLParams[2]
          ) {
            setByCountryAllStatus(null)
            setURLParamSlug(URLParams[0])
            setURLParamFrom(URLParams[1])
            setURLParamTo(URLParams[2])
            handlerApiClientByCountryAllStatus(
              URLParams[0], URLParams[1], URLParams[2], setByCountryAllStatus, setErrorCountryStatus
            )
          }
        } else {
          setURLParamChartDesc(PUB_CHART_DESC)
          setURLParamSlug(PUB_SLUG)
          setURLParamFrom(PUB_FROM)
          setURLParamTo(PUB_TO)
          router.push(`/country/${PUB_CHART_DESC}`)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryList, router])

  render = <h3>Carregando...</h3>
  
  if(!errorCountryList && !errorCountryStatus && byCountryAllStatus && countryList) {
    render = <>
      <SearchPart />
      <CountryChartPart />
    </>
  }

  return <>{ render }</>
}
