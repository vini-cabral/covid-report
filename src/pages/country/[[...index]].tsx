import moment from "moment"
import { NextRouter, useRouter } from "next/router"
import { useEffect, useState } from "react"
// My Project
import { apiClientCountries, apiClientByCountryAllStatus } from "../../client/apiServiceClient"
import ICountry from "../../interface/countries"
import { ICountry as ICountryStatus } from "../../interface/byCountryAllStatus"
import SearchPart from "../../partials/SearchPart"

// Standard values
export const allStatusURLParamsStdSlug = process.env.NEXT_PUBLIC_SLUG || 'brazil'
export const allStatusURLParamsStdFrom = moment().add(-1*(+process.env.NEXT_PUBLIC_DAYS_AGO! || 2), 'days').format().substring(0, 10)
export const allStatusURLParamsStdTo = moment().format().substring(0, 10)
// Handling - URL Parameters Validate
function handleURLParamsValidate(countryList?:ICountry[],router?:NextRouter): boolean {
  const totalParams = 3
  let slug: string
  let from: string
  let to: string
  if(
    countryList && router &&
    router.query.index &&
    router.query.index.length === totalParams &&
    process.env.NEXT_PUBLIC_DATE_MIN
  ){
    slug = router.query.index[0]
    from = router.query.index[1].substring(0, 10)
    to = router.query.index[2].substring(0, 10)

    if(
      !moment(from, 'YYYY-MM-DD', false).isValid() ||
      !moment(to, 'YYYY-MM-DD', false).isValid() ||
      !countryList.find(el => slug === el.Slug)
    ) {
      return false
    }

    if(!(from >= process.env.NEXT_PUBLIC_DATE_MIN && from < moment().format().substring(0, 10))) {
      return false
    }

    if(!(from < to && to <= moment().format().substring(0, 10))) {
      return false
    }

    return true
  }
  return false
}
// Handling - Country List
function handleApiClientCountries(setCountryList: Function, setErrorCountryList: Function): void {
  apiClientCountries()
  .then(res => {
    const list: ICountry[] = res.sort((a:ICountry, b:ICountry) => (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0))
    // States
    setCountryList(list)
    // Cache
    localStorage.setItem("countryList", JSON.stringify(list))
  })
  .catch(e => setErrorCountryList(e))
}
// Handling - By Country All Status
function handleApiClientByCountryAllStatus(
  slug: string, from: string, to: string, minutes: number,
  setByCountryAllStatus: Function,
  setErrorCountry: Function
): void {
  apiClientByCountryAllStatus(slug, from, to)
  .then(res => {
    setByCountryAllStatus([...res])
    localStorage.setItem("byCountryAllStatus", JSON.stringify(
      {
        CacheExpiration: moment().add(minutes, 'm').format(),
        ParamSlug: slug,
        ParamFrom: from,
        ParamTo: to,
        AllStatus: [...res]
      }
    ))
  })
  .catch(e => setErrorCountry(e))
}
// Handling - By Country All Status URL Parmas Cache
function handleAllStatusURLParamsSetCache(slug:string, from:string, to:string):void {
  localStorage.setItem("allStatusURLParamsSlug", slug)
  localStorage.setItem("allStatusURLParamsFrom", from)
  localStorage.setItem("allStatusURLParamsTo", to)
}

let render: JSX.Element | JSX.Element[]
export default function Country() {
  // Country List
  const [countryList, setCountryList] = useState<ICountry[]>()
  const [errorCountryList, setErrorCountryList] = useState<Error>()
  useEffect(() => {
    if(localStorage.getItem("countryList")) {
      setCountryList(JSON.parse(localStorage.getItem("countryList")!))
    } else {
      handleApiClientCountries(setCountryList, setErrorCountryList)
    }
  },[])

  // By Country All Status
  const router = useRouter()
  const [byCountryAllStatus, setByCountryAllStatus] = useState<ICountryStatus[]>()
  const [errorCountry, setErrorCountry] = useState<Error>()
  useEffect(() => {
    // URL Params
    if(countryList && router.query.index) {
      setByCountryAllStatus(undefined)
      localStorage.removeItem("byCountryAllStatus")
      if(handleURLParamsValidate(countryList, router)) {
        handleAllStatusURLParamsSetCache(router.query.index[0], router.query.index[1], router.query.index[2])
        handleApiClientByCountryAllStatus(
          router.query.index[0],
          router.query.index[1],
          router.query.index[2],
          +process.env.NEXT_PUBLIC_CACHE_MINUTES! || 5,
          setByCountryAllStatus,
          setErrorCountry
        )
      } else {
        handleAllStatusURLParamsSetCache(allStatusURLParamsStdSlug, allStatusURLParamsStdFrom, allStatusURLParamsStdTo)
        router.push('/country')
      }
    }
    // No URL Params
    if(countryList && !router.query.index) {
      // API
      if(
        !localStorage.getItem("byCountryAllStatus") ||
        (localStorage.getItem("byCountryAllStatus") && JSON.parse(localStorage.getItem("byCountryAllStatus")!).CacheExpiration < moment().format())
      ) {
        handleApiClientByCountryAllStatus(
          process.env.NEXT_PUBLIC_SLUG || 'brazil',
          moment().add(-1*(+process.env.NEXT_PUBLIC_DAYS_AGO! || 2), 'days').format().substring(0, 10),
          moment().format().substring(0, 10),
          +process.env.NEXT_PUBLIC_CACHE_MINUTES! || 5,
          setByCountryAllStatus,
          setErrorCountry
        )
      }
      // Cache
      if(localStorage.getItem("byCountryAllStatus") && JSON.parse(localStorage.getItem("byCountryAllStatus")!).CacheExpiration > moment().format()) {
        setByCountryAllStatus([...JSON.parse(localStorage.getItem("byCountryAllStatus")!).AllStatus])
      }
    }
  }, [countryList, router, router.query.index])

  // Handling Renderings
  render = <h3>Carregando...</h3>

  if(errorCountryList || errorCountry) {
    handleAllStatusURLParamsSetCache(allStatusURLParamsStdSlug, allStatusURLParamsStdFrom, allStatusURLParamsStdTo)
    render = <h3>Não foi possível carregar os dados</h3>
  }

  if(countryList && byCountryAllStatus && !errorCountryList && !errorCountry) {
    render = <SearchPart countries={ countryList } />
    console.log(byCountryAllStatus)
  }

  return <>{ render }</>
}
