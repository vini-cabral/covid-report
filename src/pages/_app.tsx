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
  // Summary
  const [ctxGlobal, setCtxGlobal] = useState<IGlobal | null>(null)
  const [ctxTop10Countries, setCtxTop10Countries] = useState<ICountries[] | null>(null)
  // Countries
  const [ctxCountryList, setCtxCountryList] = useState<ICountryList[] | null>(null)
  const [ctxByCountryAllStatus, setCtxByCountryAllStatus] = useState<ICountryStatus[] | null>(null)
  const [ctxURLParamSlug, setCtxURLParamSlug] = useState(PUB_SLUG)
  const [ctxURLParamFrom, setCtxURLParamFrom] = useState(PUB_FROM)
  const [ctxURLParamTo, setCtxURLParamTo] = useState(PUB_TO)
  const [ctxURLParamChartDesc, setCtxURLParamChartDesc] = useState(PUB_CHART_DESC)

  return <>
    <dataContext.Provider value={{
      // Summary
      ctxGlobal, setCtxGlobal,
      ctxTop10Countries, setCtxTop10Countries,
      // Countries
      ctxCountryList, setCtxCountryList,
      ctxByCountryAllStatus, setCtxByCountryAllStatus,
      ctxURLParamSlug, setCtxURLParamSlug,
      ctxURLParamFrom, setCtxURLParamFrom,
      ctxURLParamTo, setCtxURLParamTo,
      ctxURLParamChartDesc, setCtxURLParamChartDesc
    }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </dataContext.Provider>
  </>
}

export default MyApp
