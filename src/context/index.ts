import React from "react"
// My Project
import { ICountry as ITop10Countries, IGlobal } from "../interface/summary"
import { ICountry as ICountryList } from "../interface/countries"
import { ICountry as ICountryStatus } from "../interface/byCountryAllStatus"

export interface IDataContext {
  global: IGlobal | null
  setGlobal: Function
  top10Countries: ITop10Countries[] | null
  setTop10Countries: Function
  countryList: ICountryList[] | null
  setCountryList: Function
  byCountryAllStatus: ICountryStatus[] | null
  setByCountryAllStatus: Function
  URLParamSlug: string
  setURLParamSlug: Function
  URLParamFrom: string
  setURLParamFrom: Function
  URLParamTo: string
  setURLParamTo: Function
  URLParamChartDesc: string
  setURLParamChartDesc: Function
}

const dataContext = React.createContext<IDataContext>({
  global: null,
  setGlobal: () => {},
  top10Countries: null,
  setTop10Countries: () => {},
  countryList: null,
  setCountryList: () => {},
  byCountryAllStatus: null,
  setByCountryAllStatus: () => {},
  URLParamSlug: '',
  setURLParamSlug: () => {},
  URLParamFrom: '',
  setURLParamFrom: () => {},
  URLParamTo: '',
  setURLParamTo: () => {},
  URLParamChartDesc: '',
  setURLParamChartDesc: () => {},
})

export default dataContext
