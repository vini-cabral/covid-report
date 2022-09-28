import moment from "moment"
import { NextRouter, useRouter } from "next/router"
import { useEffect, useState } from "react"
// My Project
import { apiClientCountries, apiClientByCountryAllStatus } from "../../client/apiServiceClient"
import ICountry from "../../interface/countries"
import { ICountry as ICountryStatus } from "../../interface/byCountryAllStatus"
import Link from "next/link"

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
      if(handleURLParamsValidate(countryList, router)) {
        handleApiClientByCountryAllStatus(
          router.query.index[0],
          router.query.index[1],
          router.query.index[2],
          +process.env.NEXT_PUBLIC_CACHE_MINUTES! || 5,
          setByCountryAllStatus,
          setErrorCountry
        )
      } else {
        handleApiClientByCountryAllStatus(
          process.env.NEXT_PUBLIC_SLUG || 'brazil',
          moment().add(-1*(+process.env.NEXT_PUBLIC_DAYS_AGO! || 2), 'days').format().substring(0, 10),
          moment().format().substring(0, 10),
          +process.env.NEXT_PUBLIC_CACHE_MINUTES! || 5,
          setByCountryAllStatus,
          setErrorCountry
        )
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

  if(errorCountry) {
    console.log(errorCountry.message)
  }

  if(byCountryAllStatus && !errorCountry) {
    console.log(byCountryAllStatus)
  }

  const [inputSlug, setInputSlug] = useState('')
  const [inputFrom, setInputFrom] = useState('')
  const [inputTo, setInputTo] = useState('')

  if(inputSlug && inputFrom && inputTo) {
    console.log(inputSlug, inputFrom, inputTo)
  }

  return <div>
    <label>País
      <select value={ inputSlug } onChange={ evt => setInputSlug(evt.currentTarget.value) }>
        { countryList?.map(el => <option key={ el.Slug } value={ el.Slug }>{ el.Country }</option>) }
      </select>
    </label>
    <label>Data início
      <input type="date" value={ inputFrom } onChange={ evt => setInputFrom(evt.currentTarget.value) }/>
    </label>
    <label>Data fim
      <input type="date" value={ inputTo } onChange={ evt => setInputTo(evt.currentTarget.value) }/>
    </label>
    <Link href={`/country/${inputSlug}/${inputFrom}/${inputTo}`}>
      <a>Buscar</a>
    </Link>
  </div>
}
