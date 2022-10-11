import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
// My Project
import dataContext from "../context"
import groupByObjArray from "../utils/groupByObjArray"
import Loading from "../components/Loading"
import ErrorDialog from "../components/ErrorDialog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}

const labels = [''];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: [0],
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: [0],
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// }

type TResultAllStatus = {
  Country: string
  Date: string
  Deaths: number
  Confirmed: number
  Recovered: number
}

let objAux: any = []
let resultAllStatus: TResultAllStatus[] = []
let arrayKeys: string[] = []
let render: JSX.Element | JSX.Element[] = <Loading />

export default function CountryChartPart() {
  const { ctxByCountryAllStatus,ctxURLParamChartDesc,ctxURLParamSlug,ctxURLParamFrom,ctxURLParamTo } = useContext(dataContext)
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [0],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  })
  const [element, setElement] = useState<JSX.Element | null>(null)

  useEffect(() => {
    if(ctxByCountryAllStatus && ctxURLParamChartDesc) {
      resultAllStatus = []
      objAux = groupByObjArray(ctxByCountryAllStatus, "Date")
      arrayKeys = Object.keys(objAux)

      for(let key of arrayKeys) {
        resultAllStatus.push({
          Country: objAux[key][0].Country,
          Date: objAux[key][0].Date,
          Deaths: objAux[key].reduce((a:number, b:any) => a + b.Deaths, 0),
          Confirmed: objAux[key].reduce((a:number, b:any) => a + b.Confirmed, 0),
          Recovered: objAux[key].reduce((a:number, b:any) => a + b.Recovered, 0),
        })
      }
      const obj = data
      let test = resultAllStatus.map((el: any) => el[ctxURLParamChartDesc[0].toUpperCase()+ctxURLParamChartDesc.substring(1)])
      obj.labels = resultAllStatus.map(el => el.Date)
      obj.datasets[0].data = [...test]
      obj.datasets[1].data = [...test.fill(test.reduce((a, b) => a + b, 0) / test.length)]
      setData({...obj})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxURLParamChartDesc])

  if(ctxByCountryAllStatus && ctxURLParamChartDesc) {
    if(data) {
      render = <div>
        <Link href={`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/deaths`}>
          <a>Mortos</a>
        </Link>
        <Link href={`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/confirmed`}>
          <a>Confirmados</a>
        </Link>
        <Link href={`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/recovered`}>
          <a>Recuperados</a>
        </Link>
        <Link href={`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/errr`}>
          <a>Error</a>
        </Link>
        <Line options={options} data={data} />
      </div>
    } else {
      render = <ErrorDialog>
        <h4>Erro!</h4>
        <p>Dados inconsistentes.</p>
      </ErrorDialog>
    }
  }

  return render
}
