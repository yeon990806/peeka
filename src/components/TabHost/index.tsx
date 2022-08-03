import style from "./style.module.scss"

interface TabHostProps {
  tabArray: TabItemType[];
  isDesktop?: boolean;
}

export interface TabItemType {
  tabName: string;
  onClick?: () => void;
  isSelected: boolean;
}

const TabHost = (props: TabHostProps) => {
  return (
    <div className={ style.TabHost }>
      { props.tabArray.map((v, i) => (
        <button key={i} onClick={ () => v.onClick }>
          <div className={ v.isSelected ? style.Selected : "" }>
            { v.tabName }
          </div>
        </button>
      )) }
    </div>
  )
}

export default TabHost