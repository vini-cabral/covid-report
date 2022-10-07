import { useContext, useEffect, useState } from "react"
// My Project
import { apiServiceGetSummary } from "../client/service/apiService"
import { ICountry as ICountries } from "../interface/summary"
import dataContext from "../context"
import Card from "../components/Card"
import Loading from "../components/Loading"
import styles from "../styles/HomePage.module.sass"
import ErrorDialog from "../components/ErrorDialog"
import Top10ChartBarsPart from "../partials/Top10ChartBarsPart"
import moment from "moment"
import "moment/locale/pt-br"
import WarningDialog from "../components/WarningDialog"

// General Numbers
const PrintNumbers = ({
  deaths,
  confirmed,
  recovered,
  labels
}:{
  deaths: number
  confirmed: number
  recovered: number
  labels: string[]
}) => {
  if(typeof deaths === 'number' && typeof confirmed === 'number' && typeof recovered === 'number') {
    return <div>
      <h4 >{ labels[0] }: <strong>{ deaths.toLocaleString() }</strong></h4>
      <h4 >{ labels[1] }: <strong>{ confirmed.toLocaleString() }</strong></h4>
      <h4 >{ labels[2] }: <strong>{ recovered.toLocaleString() }</strong></h4>
    </div>
  } else {
    return <ErrorDialog>
      <h4>Erro!</h4>
      <p>Dados inconsistentes.</p>
    </ErrorDialog>
  }
}

// Main
let render: JSX.Element | JSX.Element[] = <Loading />
export default function GlobalSummary() {
  const {global, setGlobal, top10Countries, setTop10Countries} = useContext(dataContext)
  const [countries, setCountries] = useState<ICountries[] | null>(null)
  const [errorDataFetching, setErrorDataFetching] = useState<Error | null>(null)
  const [errorInconsistentData, setErrorInconsistentData] = useState<Error | null>(null)

  useEffect(() => {
    if(global === null && top10Countries === null) {
      apiServiceGetSummary()
      .then(res => {
        try {
          if(res.Message === '') {
            setGlobal({...res.Global})
            setCountries([...res.Countries])
          } else {
            throw new Error(res.Message)
          }
        } catch (error) {
          if(error instanceof Error) setErrorInconsistentData(error)
        }
      })
      .catch(e => setErrorDataFetching(e))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(countries && top10Countries === null) {
      setTop10Countries([
        ...countries
        .sort((a: ICountries, b: ICountries) => b.TotalDeaths - a.TotalDeaths)
        .slice(0, 10)
      ])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries])

  if(errorDataFetching) {
    render = <ErrorDialog>
      <h4>Erro!</h4>
      <p>Não foi possível conectar-se à base de dados, tente mais tarde.</p>
    </ErrorDialog>
  }

  if(errorInconsistentData) {
    render = <WarningDialog>
      <h4>Aviso!</h4>
      <p>Aguarde alguns instantes e em seguida atualize a página.</p>
    </WarningDialog>
  }

  if(!errorDataFetching && !errorInconsistentData && global && top10Countries) {
    render = <section className={ styles['section'] }>
      <h1>Resumo Global</h1>
      <h5>Atualizado { moment(global.Date).locale('pt-br').calendar() }</h5>
      <Card classAdd="shadow" cornerRad>
        <h3>Números Totais</h3>
        <PrintNumbers
          deaths={ global.TotalDeaths }
          confirmed={ global.TotalConfirmed }
          recovered={ global.TotalRecovered }
          labels={['Mortos', 'Confirmados', 'Recuperados']}
        />
      </Card>
      <Card classAdd="shadow" cornerRad>
        <h3>Números Parciais</h3>
        <PrintNumbers
          deaths={ global.NewDeaths }
          confirmed={ global.NewConfirmed }
          recovered={ global.NewRecovered }
          labels={['Mortos', 'Confirmados', 'Recuperados']}
        />
      </Card>
      <Card classAdd="shadow overflow-x" cornerRad>
        <h3>Top 10 Mortos</h3>
        <Top10ChartBarsPart top10Countries={ top10Countries } />
      </Card>
    </section>
  }

  return render
}
