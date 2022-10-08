import React from "react"
// My Project
import { ICountry as ICountries, IGlobal } from "../interface/summary"
import { ICountry as ICountryList } from "../interface/countries"
import { ICountry as ICountryStatus } from "../interface/byCountryAllStatus"

export interface IDataContext {
  // Summary
  global: IGlobal | null
  setGlobal: Function
  countries: ICountries[] | null
  setCountries: Function
  top10Countries: ICountries[] | null
  setTop10Countries: Function
  // Countries
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
  countries: null,
  setCountries: () => {},
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
