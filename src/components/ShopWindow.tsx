import { useCallback, useEffect, useRef, useState } from "react";
import '../styles/ShopWindow.scss'
import Close from '@mui/icons-material/Close'
import { act } from "react-dom/test-utils";

type Props = {
  title: string;
  description?: string;
  items: Array<Item>
  onClose: () => void
}

type Item = {
  name?: string;
  link: string;
}

const imgHost = "https://images.plurk.com/"
const imgHostsm = "https://images.plurk.com/mx_"

const Item = (props: { urlpre: string, link: string, altText: string, pre: string, onClick?: () => void }) => {
  return <div className={`${props.pre}__item-container`} onClick={props.onClick}>
    <img src={`${props.urlpre}${props.link}`} alt={props.altText} />
  </div>
}

const ShopWindowDisplay = ({ prefix, items, activeItem, onItemClick }: { prefix: string, items: Array<Item>, activeItem: number, onItemClick: (idx: number) => void }) => {
  const organizeShelves = ({ pre }: { pre: string }) => {
    return items.map((item, idx) => {
      const altText = `item-${idx}-${item.name}`
      return (<div key={altText}>
        <Item urlpre={imgHostsm} link={item.link} altText={altText} pre={pre} onClick={() => onItemClick(idx)} />
      </div>)
    })
  }
  return <>
    <div className={prefix}>
      <Item urlpre={imgHost} link={items[activeItem].link} altText="Current item displayed" pre={prefix} />
    </div>
    <div className={`${prefix}__shelf`}>
      {items.length > 0 && organizeShelves({ pre: `${prefix}__shelf` })}
    </div>
  </>
}

const ShopWindow = ({ items, description, title, onClose }: Props) => {
  const prefix = 'shop-window'
  const activeIdx = useRef(0)
  const [activeItem, setActiveItem] = useState<number>(0)

  const nextItem = () => {
    const curr = activeIdx.current
    const next = curr + 1 >= items.length ? 0 : curr + 1
    activeIdx.current = next;
    setActiveItem(next)
  }

  const prevItem = () => {
    const curr = activeIdx.current
    const next = curr - 1 < 0 ? items.length - 1 : curr - 1
    activeIdx.current = next;
    setActiveItem(next)
  }

  const onPress = (evt: KeyboardEvent) => {
    evt.preventDefault()
    switch (evt.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowUp':
        prevItem()
        break;
      case 'Tab':
      case 'ArrowDown':
        nextItem();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    addEventListener('keydown', onPress)
    return () => {
      removeEventListener('keydown', onPress)
    }
  }, [])

  return <div className={prefix}>
    <div className={`${prefix}__container`}>
      <div className={`${prefix}__close`} onClick={onClose}>
        <Close />
      </div>
      <ShopWindowDisplay items={items} prefix={`${prefix}__display`} activeItem={activeItem} onItemClick={(idx) => setActiveItem(idx)} />
    </div>
  </div>
}

export default ShopWindow