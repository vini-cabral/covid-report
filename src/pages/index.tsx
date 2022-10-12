import { useContext, useEffect, useState } from "react"
import moment from "moment"
import "moment/locale/pt-br"
// My Project
import { apiServiceGetSummary } from "../client/service/apiService"
import { ICountry as ICountries } from "../interface/summary"
import dataContext from "../context"
import Card from "../components/Card"
import Loading from "../components/Loading"
import styles from "../styles/HomePage.module.sass"
import ErrorDialog from "../components/ErrorDialog"
import Top10BarChartPart from "../partials/Top10BarChartPart"
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
    return <div className={ styles['print-label'] }>
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
  const {ctxGlobal, setCtxGlobal, ctxTop10Countries, setCtxTop10Countries} = useContext(dataContext)
  const [errorDataFetching, setErrorDataFetching] = useState<Error | null>(null)
  const [errorInconsistentData, setErrorInconsistentData] = useState<Error | null>(null)
  const [countries, setCountries] = useState<ICountries[] | null>(null)

  useEffect(() => {
    if(ctxGlobal === null && countries === null) {
      apiServiceGetSummary()
      .then(res => {
        try {
          if(res.Message === '') {
            setCtxGlobal({...res.Global})
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
    if(countries) {
      setCtxTop10Countries([
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

  if(!errorDataFetching && !errorInconsistentData && ctxGlobal && ctxTop10Countries) {
    render = <section className={ styles['section'] }>
      <h1>Resumo Global</h1>
      <h5 className="sub-title-h5">Atualizado { moment(ctxGlobal.Date).locale('pt-br').calendar() }</h5>
      <div className={ styles['panel'] }>
        <Card classAdd={`shadow ${styles['item-01']}`} cornerRad>
          <h3>Números Totais</h3>
          <PrintNumbers
            deaths={ ctxGlobal.TotalDeaths }
            confirmed={ ctxGlobal.TotalConfirmed }
            recovered={ ctxGlobal.TotalRecovered }
            labels={['Mortos', 'Confirmados', 'Recuperados']}
          />
        </Card>
        <Card classAdd={`shadow ${styles['item-02']}`} cornerRad>
          <h3>Números Parciais</h3>
          <PrintNumbers
            deaths={ ctxGlobal.NewDeaths }
            confirmed={ ctxGlobal.NewConfirmed }
            recovered={ ctxGlobal.NewRecovered }
            labels={['Mortos', 'Confirmados', 'Recuperados']}
          />
        </Card>
        <Card classAdd={`shadow overflow-x ${styles['item-03']}`} cornerRad>
          <h3>Top 10 Mortos</h3>
          <Top10BarChartPart top10Countries={ ctxTop10Countries } />
        </Card>
      </div>
    </section>
  }

  return render
}
