import ISummary from "../../interface/summary"
import { ICountry as ICountryList } from "../../interface/countries"
import { ICountry as ICountryAllStatus } from "../../interface/byCountryAllStatus"
import { PUB_BASE_URL } from "../env"

function handlerResponseParse(res: Response) {
  if(res.ok) {
    return res.json()
  } else {
    throw new Error(res.statusText)
  }
}

async function apiServiceGetSummary(): Promise<ISummary> {
  const res = await fetch(`${PUB_BASE_URL}/summary`)
  return handlerResponseParse(res)
}

async function apiServiceGetCountries(): Promise<ICountryList[]> {
  const res = await fetch(`${PUB_BASE_URL}/countries`)
  return handlerResponseParse(res)
}

async function apiServiceGetByCountryAllStatus(slug:string, from:string, to:string,): Promise<ICountryAllStatus[]> {
  const url = `${PUB_BASE_URL}/country/${slug}?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
  const res = await fetch(url)
  return handlerResponseParse(res)
}

export { apiServiceGetSummary, apiServiceGetCountries, apiServiceGetByCountryAllStatus }
