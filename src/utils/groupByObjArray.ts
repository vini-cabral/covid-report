// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#agrupando_objetos_por_uma_propriedade

export default function groupByObjArray(objArray:any, prop:any) {
  return objArray.reduce(function (acc: { [x: string]: any[] }, obj: { [x: string]: any }) {
    let key = obj[prop]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
