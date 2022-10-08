import Card from "./Card"
import styles from "./WarningDialog.module.sass"

export default function WarningDialog({
  children
} : {
  children?: JSX.Element | JSX.Element[]
}) {
  return <Card classAdd={ `${styles['warning-dialog']} shadow` } cornerRad>{
    children
  }</Card>
}
