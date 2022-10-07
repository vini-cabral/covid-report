import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
// My project
import styles from "./Top10ChartBarsPart.module.sass"
import { ICountry as ITop10Countries } from "../interface/summary"
import ErrorDialog from '../components/ErrorDialog'
import Loading from '../components/Loading'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
}

export const data = {
  labels: [''],
  datasets: [
    {
      label: 'Top 10 Mortos',
      data: [0],
      backgroundColor: '#592068',
    }
  ],
}

let render: JSX.Element | JSX.Element[] = <Loading />
let chartLabels: string[] = ['']
let chartData: number[] = [0]

export default function Top10ChartBarsPart({ top10Countries }:{ top10Countries:ITop10Countries[] } ) {
  chartLabels = ['']
  chartData = [0]
  if(top10Countries) {
    chartLabels = [...top10Countries.map(el => el.Country)]
    chartData = [...top10Countries.map(el => el.TotalDeaths)]
    if(chartLabels && chartData) {
      data.labels = chartLabels
      data.datasets[0].data = chartData
      render = <Bar options={options} data={data}/>
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
