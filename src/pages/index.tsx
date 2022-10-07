import { useContext, useEffect, useState } from "react"
// My Project
import { apiServiceGetSummary } from "../client/service/apiService"
import { ICountry as ICountries } from "../interface/summary"
import dataContext from "../context"
import Card from "../components/Card"
import Loading from "../components/Loading"
import styles from "../styles/HomePage.module.sass"
import ErrorDialog from "../components/ErrorDialog"

let render: JSX.Element | JSX.Element[] = <Loading />
export default function GlobalSummary() {
  const {global, setGlobal, top10Countries, setTop10Countries} = useContext(dataContext)
  const [countries, setCountries] = useState<ICountries[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if(global === null && top10Countries === null) {
      apiServiceGetSummary()
      .then(res => {
        setGlobal({...res.Global})
        setCountries([...res.Countries])
      })
      .catch(e => setError(e))
    }
  }, [global, setGlobal, top10Countries])

  useEffect(() => {
    if(countries && top10Countries === null) {
      setTop10Countries([
        ...countries
        .sort((a: ICountries, b: ICountries) => b.TotalDeaths - a.TotalDeaths)
        .slice(0, 10)
      ])
    }
  }, [countries, setTop10Countries, top10Countries])

  if(error) {
    render = <ErrorDialog>
      <h4>{ error.name }</h4>
      <p>{ error.message }</p>
    </ErrorDialog>
  }

  if(!error && global && top10Countries) {
    console.log(global, top10Countries)
    render = <section className={ styles['section'] }>
      <h1>Resumo Global</h1>
      <Card classAdd="shadow" cornerRad>
        <h3>Números Totais</h3>
      </Card>
      <Card classAdd="shadow" cornerRad>
        <h3>Números Parciais</h3>
      </Card>
      <Card classAdd="shadow" cornerRad>
        <h3>Top 10 Mortos</h3>
      </Card>
    </section>
  }

  return render
}
