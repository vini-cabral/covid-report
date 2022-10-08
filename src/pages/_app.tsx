import type { AppProps } from 'next/app'
import { useState } from 'react'
// My Proect
import '../styles/globals.sass'
import Layout from '../layout'
import dataContext from '../context'
import { ICountry as ICountries, IGlobal } from '../interface/summary'
import { ICountry as ICountryList } from "../interface/countries"
import { ICountry as ICountryStatus } from "../interface/byCountryAllStatus"
import { PUB_CHART_DESC, PUB_FROM, PUB_SLUG, PUB_TO } from '../client/env'

function MyApp({ Component, pageProps }: AppProps) {
  const [global, setGlobal] = useState<IGlobal | null>(null)
  const [countries, setCountries] = useState<ICountries[] | null>(null)
  const [top10Countries, setTop10Countries] = useState<ICountries[] | null>(null)
  const [countryList, setCountryList] = useState<ICountryList[] | null>(null)
  const [byCountryAllStatus, setByCountryAllStatus] = useState<ICountryStatus[] | null>(null)
  const [URLParamSlug, setURLParamSlug] = useState(PUB_SLUG)
  const [URLParamFrom, setURLParamFrom] = useState(PUB_FROM)
  const [URLParamTo, setURLParamTo] = useState(PUB_TO)
  const [URLParamChartDesc, setURLParamChartDesc] = useState(PUB_CHART_DESC)

  return <Layout>
    <dataContext.Provider value={{
      global, setGlobal,
      countries, setCountries,
      top10Countries, setTop10Countries,
      countryList, setCountryList,
      byCountryAllStatus, setByCountryAllStatus,
      URLParamSlug, setURLParamSlug,
      URLParamFrom, setURLParamFrom,
      URLParamTo, setURLParamTo,
      URLParamChartDesc, setURLParamChartDesc,
    }}>
      <Component {...pageProps} />
    </dataContext.Provider>
  </Layout>
}

export default MyApp
