import ClipLoader from "react-spinners/ClipLoader"
// My Project
import styles from "./Loading.module.sass"

export default function Loading() {
  return <div className={ styles['loading'] }>
    <ClipLoader />
  </div>
}
