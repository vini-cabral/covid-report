import ISummary from "../interface/summary"
import ICountry from "../interface/countries"
import {ICountry as ICountryAllStatus} from "../interface/byCountryAllStatus"

function handleResponseParse(res: Response) {
  if(res.ok) {
    return res.json()
  } else {
    throw new Error(res.statusText)
  }
}

async function apiClientSummary(): Promise<ISummary> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/summary`)
  return handleResponseParse(res)
}

async function apiClientCountries(): Promise<ICountry[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/countries`)
  return handleResponseParse(res)
}

async function apiClientByCountryAllStatus(slug:string, from:string, to:string,): Promise<ICountryAllStatus[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/country/${slug}?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
  const res = await fetch(url)
  return handleResponseParse(res)
}

export { apiClientSummary, apiClientCountries, apiClientByCountryAllStatus }
