export interface ICountry {
  Country: string
  CountryCode: string
  Date: string
  ID: string
  NewConfirmed: number
  NewDeaths: number
  NewRecovered: number
  Slug: string
  TotalConfirmed: number
  TotalDeaths: number
  TotalRecovered: number
}

export interface IGlobal {
  Date: string
  NewConfirmed: number
  NewDeaths: number
  NewRecovered: number
  TotalConfirmed: number
  TotalDeaths: number
  TotalRecovered: number
}

export default interface ISummary {
  Countries: ICountry[]
  Date: string
  Global: IGlobal
  ID: string
  Message: string
}
