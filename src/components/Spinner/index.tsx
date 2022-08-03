import style from './style.module.scss'

const Spinner = () => {
  return (
    <div className={ style.Spinner }>
      <div className={ style.LoadingSpinner }></div>
    </div>
  )
}

export default Spinner