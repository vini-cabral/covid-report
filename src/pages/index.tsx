import { useContext, useEffect, useState } from "react"
// My Project
import { apiServiceGetSummary } from "../client/service/apiService"
import { ICountry as ITop10Countries } from "../interface/summary"
import dataContext from "../context";

export default function GlobalSummary() {
  const {global, setGlobal, top10Countries, setTop10Countries} = useContext(dataContext)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if(global === null && top10Countries === null) {
      apiServiceGetSummary()
      .then(res => {
        setGlobal({
          ...res.Global
        })
        setTop10Countries([
          ...res.Countries = res.Countries
          .sort((a: ITop10Countries, b: ITop10Countries) => b.TotalDeaths - a.TotalDeaths)
          .slice(0, 10)
        ])
      })
      .catch(e => setError(e))
    }
  }, [global, setGlobal, setTop10Countries, top10Countries])

  if(!error && global && top10Countries) {
    console.log(global, top10Countries)
  }

  return <h4>Summary</h4>
}
