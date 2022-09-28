import { useEffect, useState } from "react"
import moment from 'moment';
// My Project
import { apiClientSummary } from "../client/apiServiceClient"
import { ICountry, IGlobal } from "../interface/summary"
import { ICountry as ITop10Countries } from "../interface/summary"

// Handling - Summary
function handleApiClientSummary(setGlobal: Function, setTop10Countries: Function, setError: Function): void {
  apiClientSummary()
  .then(res => {
    const top10: ITop10Countries[] = res.Countries
    .sort((a: ITop10Countries, b: ITop10Countries) => b.TotalDeaths - a.TotalDeaths)
    .slice(0, 10)
    // States
    setGlobal(res.Global)
    setTop10Countries([...top10])
    // Cache
    localStorage.setItem("summary", JSON.stringify({
      CacheExpiration: moment().add((+process.env.NEXT_PUBLIC_CACHE_MINUTES! || 5), 'm').format(),
      Top10Countries: top10,
      Date: res.Date,
      Global: res.Global,
      ID: res.ID,
      Message: res.Message
    }))
  })
  .catch(e => setError(e))
}

export default function GlobalSummary() {
  const [global, setGlobal] = useState<IGlobal>()
  const [top10Countries, setTop10Countries] = useState<ICountry[]>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    // API
    if(
      !localStorage.getItem("summary") ||
      (localStorage.getItem("summary") && JSON.parse(localStorage.getItem("summary")!).CacheExpiration < moment().format())
    ) {
      handleApiClientSummary(setGlobal, setTop10Countries, setError)
    }
    // Cache
    if(localStorage.getItem("summary") && JSON.parse(localStorage.getItem("summary")!).CacheExpiration > moment().format()) {
      setGlobal(JSON.parse(localStorage.getItem("summary")!).Global)
      setTop10Countries([...JSON.parse(localStorage.getItem("summary")!).Top10Countries])
    }
  }, [])

  if(global && top10Countries && !error) {
    console.log(global)
    console.log(top10Countries)
  }

  if(error) {
    console.log(error.message)
  }

  return <h4>Summary</h4>
}
