import React from "react"
// My Project
import { ICountry as ICountries, IGlobal } from "../interface/summary"
import { ICountry as ICountryList } from "../interface/countries"
import { ICountry as ICountryStatus } from "../interface/byCountryAllStatus"

export interface IDataContext {
  // Summary
  ctxGlobal: IGlobal | null
  setCtxGlobal: Function
  ctxTop10Countries: ICountries[] | null
  setCtxTop10Countries: Function
  // Countries
  ctxCountryList: ICountryList[] | null
  setCtxCountryList: Function
  ctxByCountryAllStatus: ICountryStatus[] | null
  setCtxByCountryAllStatus: Function
  ctxURLParamSlug: string
  setCtxURLParamSlug: Function
  ctxURLParamFrom: string
  setCtxURLParamFrom: Function
  ctxURLParamTo: string
  setCtxURLParamTo: Function
  ctxURLParamChartDesc: string
  setCtxURLParamChartDesc: Function
}

const dataContext = React.createContext<IDataContext>({
  // Summary
  ctxGlobal: null,
  setCtxGlobal: () => {},
  ctxTop10Countries: null,
  setCtxTop10Countries: () => {},
  // Countries
  ctxCountryList: null,
  setCtxCountryList: () => {},
  ctxByCountryAllStatus: null,
  setCtxByCountryAllStatus: () => {},
  ctxURLParamSlug: '',
  setCtxURLParamSlug: () => {},
  ctxURLParamFrom: '',
  setCtxURLParamFrom: () => {},
  ctxURLParamTo: '',
  setCtxURLParamTo: () => {},
  ctxURLParamChartDesc: '',
  setCtxURLParamChartDesc: () => {},
})

export default dataContext
