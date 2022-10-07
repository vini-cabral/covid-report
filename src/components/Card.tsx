import styles from "./Card.module.sass"

let descStyle = ''
export default function Card({
  children,
  classAdd,
  cornerRad
}:{
  children?: JSX.Element | JSX.Element[]
  classAdd?: string,
  cornerRad?: boolean
}) {
  descStyle = cornerRad ? styles['card-cr'] : styles['card']
  if(classAdd) { 
    descStyle += ` ${classAdd}`
  }
  return <div className={ descStyle }>{ children }</div>
}
