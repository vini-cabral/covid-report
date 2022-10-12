import { useContext, useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { NextRouter, useRouter } from "next/router"
// My Project
import dataContext from "../context"
import groupByObjArray from "../utils/groupByObjArray"
import Loading from "../components/Loading"
import ErrorDialog from "../components/ErrorDialog"

function handleFilter(
  router: NextRouter,
  ctxURLParamSlug: string,
  ctxURLParamFrom: string,
  ctxURLParamTo: string,
  inputChartDesc: string
) {
  router.push(`/country/${ctxURLParamSlug}/${ctxURLParamFrom}/${ctxURLParamTo}/${inputChartDesc}`)
}

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
let auxChartData: number[] = []
let auxChartAvg: number[] = []

let auxRender: JSX.Element | JSX.Element[] = <Loading />

export default function CountryChartPart({chartDescList}: {chartDescList: string[]}) {
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
    auxChartData = auxResultAllStatus.map(el => +el[
      ctxURLParamChartDesc[0].toUpperCase()+ctxURLParamChartDesc.substring(1) as keyof TResultAllStatus
    ])
    auxChartAvg = [...auxChartData]
    auxChartAvg.fill(auxChartData.reduce((a:number, b:number) => a + b, 0) / auxChartData.length)
    setDataChart([
      ['Data', infoChartDescList[ctxURLParamChartDesc as keyof TInfoChartDescList], 'Média'],
      ...auxDateList.map((el, i) => [el, auxChartData[i], auxChartAvg[i]])
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxURLParamChartDesc])

  if(ctxByCountryAllStatus && ctxURLParamChartDesc && dataChart) {
    if(dataChart) {
      auxRender = <div onClick={() => handleFilter(router, ctxURLParamSlug, ctxURLParamFrom, ctxURLParamTo, inputChartDesc)}>
        {chartDescList.map((el, i) => <label key={uuidv4()}>
            <input
              type="radio"
              name="chart"
              checked={el === inputChartDesc ? true : false}
              onChange={() => {
                setInputChartDesc(chartDescList[i])
              }}
            />
            { infoChartDescList[el as keyof TInfoChartDescList] }
          </label>
        )}
        <Chart
          chartType="Line"
          width="100%"
          height="200px"
          data={dataChart}
        />
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
