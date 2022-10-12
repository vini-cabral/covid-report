import { Chart } from "react-google-charts"
// My project
import styles from "./Top10BarChartPart.module.sass"
import { ICountry as ITop10Countries } from "../interface/summary"
import ErrorDialog from '../components/ErrorDialog'
import Loading from '../components/Loading'

export let data:(string | number)[][] = [[]]

export const options = {
  chartArea: { width: "50%" },
  hAxis: {
    title: "Número de Mortos",
    minValue: 0,
  },
  vAxis: {
    title: "Países",
  },
  colors: ['#592068']
};

let render: JSX.Element | JSX.Element[] = <Loading />
let chartLabels: string[] = ['']
let chartData: number[] = [0]

export default function Top10ChartBarsPart({ top10Countries }:{ top10Countries:ITop10Countries[] } ) {
  data = [["Países", "Top 10 mortos"]]
  chartLabels = ['']
  chartData = [0]
  if(top10Countries) {
    chartLabels = [...top10Countries.map(el => el.Country)]
    chartData = [...top10Countries.map(el => el.TotalDeaths)]
    if(chartLabels && chartData) {
      chartLabels.forEach((el, i) => data.push([el, chartData[i]]))
      render = <Chart
        chartType="BarChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
        loader={<Loading />}
      />
    } else {
      render = <ErrorDialog>
        <h4>Erro!</h4>
        <p>Dados inconsistentes.</p>
      </ErrorDialog>
    }
  }
  return <div className={ styles['box-chart'] }>
    { render }
  </div>
}
