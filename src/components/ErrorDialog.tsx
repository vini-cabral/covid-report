import Card from "./Card"
import styles from "./ErrorDialog.module.sass"

export default function ErrorDialog({
  children
} : {
  children?: JSX.Element | JSX.Element[]
}) {
  return <Card classAdd={ `${styles['error-dialog']} shadow` } cornerRad>{
    children
  }</Card>
}
