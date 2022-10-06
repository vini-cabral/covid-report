import Link from "next/link"
import { useContext } from "react"
// My Project
import dataContext from "../context"
import groupByObjArray from "../utils/groupByObjArray"

let objAux: any = []
let printAllStatus: {
  Country: string
  Date: string
  Deaths: number
  Confirmed: number
  Recovered: number
}[] = []
let arrayKeys: string[] = []

export default function CountryChartPart() {
  const { byCountryAllStatus, URLParamChartDesc, URLParamSlug, URLParamFrom, URLParamTo } = useContext(dataContext)

  if(byCountryAllStatus) {
    printAllStatus = []
    objAux = groupByObjArray(byCountryAllStatus, "Date")
    arrayKeys = Object.keys(objAux)

    for(let key of arrayKeys) {
      printAllStatus.push({
        Country: objAux[key][0].Country,
        Date: objAux[key][0].Date,
        Deaths: objAux[key].reduce((a:number, b:any) => a + b.Deaths, 0),
        Confirmed: objAux[key].reduce((a:number, b:any) => a + b.Confirmed, 0),
        Recovered: objAux[key].reduce((a:number, b:any) => a + b.Recovered, 0),
      })
    }
    console.log(printAllStatus)
  }

  if(byCountryAllStatus) {

  }

  return <div>
    <Link href={`/country/recovered?slug=${URLParamSlug}&from=${URLParamFrom}&to=${URLParamTo}`}>
      <a>teste</a>
    </Link>
    <h3>Country Chart</h3>
  </div>
}
