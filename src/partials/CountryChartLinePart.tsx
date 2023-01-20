import { useContext, useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import moment from "moment"
import { useRouter } from "next/router"
// My Project
import dataContext from "../context"
import groupByObjArray from "../utils/groupByObjArray"
import Loading from "../components/Loading"
import ErrorDialog from "../components/ErrorDialog"
import styles from "./CountryChartLinePart.module.sass"

type TResultAllStatus = {
  Country: string
  Date: string
  Deaths: number
  Confirmed: number
  Recovered: number
}
type TInfoChartDescList = {
  deaths: string
  confirmed: string
  recovered: string
}
const infoChartDescList: TInfoChartDescList = {
  deaths: "Mortos",
  confirmed: "Confirmados",
  recovered: "Recuperados",
}
let auxObj: any = []
let auxResultAllStatus: TResultAllStatus[] = []
let auxArrayKeys: string[] = []
let auxDateList: string[] = []
let auxChartDataDeaths: number[] = []
let auxChartDataConfirmed: number[] = []
let auxChartDataRecovered: number[] = []
let auxChartDataPrint: number[] = []
let auxChartDataPrintAvg: number[] = []

let auxRender: JSX.Element | JSX.Element[] = <Loading />

export default function CountryChartPart({
  chartDescList,
  setPrintDeaths,
  setPrintConfirmed,
  setPrintRecovered,
}: {
  chartDescList: string[]
  setPrintDeaths: Function
  setPrintConfirmed: Function
  setPrintRecovered: Function
}) {
  const { ctxByCountryAllStatus,ctxURLParamChartDesc,ctxURLParamSlug,ctxURLParamFrom,ctxURLParamTo } = useContext(dataContext)
  const [ dataChart, setDataChart ] = useState<(string | number)[][]>()
  const [ inputChartDesc, setInputChartDesc ] = useState(ctxURLParamChartDesc)
  const router = useRouter()

  useEffect(() => {
    auxResultAllStatus = []
    auxObj = groupByObjArray(ctxByCountryAllStatus, "Date")
    auxArrayKeys = Object.keys(auxObj)
    for(let key of auxArrayKeys) {
      auxResultAllStatus.push({
        Country: auxObj[key][0].Country,
        Date: auxObj[key][0].Date,
        Deaths: auxObj[key].reduce((a:number, b:any) => a + b.Deaths, 0),
        Confirmed: auxObj[key].reduce((a:number, b:any) => a + b.Confirmed, 0),
        Recovered: auxObj[key].reduce((a:number, b:any) => a + b.Recovered, 0),
      })
    }
    auxDateList = auxResultAllStatus.map(el => moment(el.Date).format("DD/MM/YYYY"))
    auxChartDataDeaths =  auxResultAllStatus.map(el => el.Deaths)
    auxChartDataConfirmed =  auxResultAllStatus.map(el => el.Confirmed)
    auxChartDataRecovered =  auxResultAllStatus.map(el => el.Recovered)
    setPrintDeaths(auxChartDataDeaths[auxChartDataDeaths.length - 1])
    setPrintConfirmed(auxChartDataConfirmed[auxChartDataConfirmed.length - 1])
    setPrintRecovered(auxChartDataRecovered[auxChartDataRecovered.length - 1])

    auxChartDataPrint = auxResultAllStatus.map(el => +el[
      ctxURLParamChartDesc[0].toUpperCase()+ctxURLParamChartDesc.substring(1) as keyof TResultAllStatus
    ])
    auxChartDataPrintAvg = [...auxChartDataPrint]
    auxChartDataPrintAvg.fill(auxChartDataPrint.reduce((a:number, b:number) => a + b, 0) / auxChartDataPrint.length)
    setDataChart([
      ['Data', infoChartDescList[ctxURLParamChartDesc as keyof TInfoChartDescList], 'Média'],
      ...auxDateList.map((el, i) => [el, auxChartDataPrint[i], auxChartDataPrintAvg[i]])
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxURLParamChartDesc])

  if(ctxByCountryAllStatus && ctxURLParamChartDesc && dataChart) {
    if(dataChart) {
      auxRender = <div className={ styles['box-chart'] }>
        <div>
          {chartDescList.map(el => <label key={ el }>
              <input
                type="radio"
                name="chart"
                checked={el === inputChartDesc ? true : false}
                value={el}
                onChange={(evt) => {
                  setInputChartDesc(evt.currentTarget.value)
                  router.push(`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/${evt.currentTarget.value}`)
                }}
              />
              { infoChartDescList[el as keyof TInfoChartDescList] }
            </label>
          )}
        </div>
        <div>
          <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            data={dataChart}
            options={{
              colors: ["#592068", "#A788AF"],
              curveType: "function"
            }}
            loader={<Loading />}
          />
        </div>
      </div>
    } else {
      auxRender = <ErrorDialog>
        <h4>Erro!</h4>
        <p>Dados inconsistentes.</p>
      </ErrorDialog>
    }
  }

  return <>
    { auxRender }
  </>
}
