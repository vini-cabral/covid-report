import Link from "next/link"
import { useContext } from "react"
// My Project
import dataContext from "../context"
import groupByObjArray from "../utils/groupByObjArray"

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
let dataChart: number[] = []
let avgChart: number[] = []

export default function CountryChartPart() {
  const { ctxByCountryAllStatus, ctxURLParamChartDesc, ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo } = useContext(dataContext)

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
    dataChart = resultAllStatus.map((el: any) => el[ctxURLParamChartDesc[0].toUpperCase() + ctxURLParamChartDesc.substring(1)])
    avgChart = [...dataChart]
    avgChart.fill(dataChart.reduce((a, b) => a + b, 0) / dataChart.length)
  }

  return <div>
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
    <h3>Country Chart</h3>
  </div>
}
