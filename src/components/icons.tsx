// ============================================================================
// アイコンは @tabler/icons-react を使用します（自作 SVG の直書きは禁止）。
// バレル import は tree-shake が効かず全アイコンを巻き込むため、
// 必要なアイコンだけを個別ファイルから読み込みます。
// 各アイコンは従来と同じ名前で公開し、線幅 1.8 に統一します。
// ============================================================================

import type { ComponentType } from 'react'
import type { IconProps as TablerIconProps } from '@tabler/icons-react'

import IconDog from '@tabler/icons-react/dist/esm/icons/IconDog.mjs'
import IconCoffee from '@tabler/icons-react/dist/esm/icons/IconCoffee.mjs'
import IconBuildingBank from '@tabler/icons-react/dist/esm/icons/IconBuildingBank.mjs'
import IconTrain from '@tabler/icons-react/dist/esm/icons/IconTrain.mjs'
import IconTrees from '@tabler/icons-react/dist/esm/icons/IconTrees.mjs'
import IconTorii from '@tabler/icons-react/dist/esm/icons/IconTorii.mjs'
import IconConfetti from '@tabler/icons-react/dist/esm/icons/IconConfetti.mjs'
import IconRipple from '@tabler/icons-react/dist/esm/icons/IconRipple.mjs'
import IconTree from '@tabler/icons-react/dist/esm/icons/IconTree.mjs'
import IconBuildingStore from '@tabler/icons-react/dist/esm/icons/IconBuildingStore.mjs'
import IconSparkle from '@tabler/icons-react/dist/esm/icons/IconSparkle.mjs'
import IconBuildingBridge from '@tabler/icons-react/dist/esm/icons/IconBuildingBridge.mjs'
import IconTeapot from '@tabler/icons-react/dist/esm/icons/IconTeapot.mjs'
import IconCookie from '@tabler/icons-react/dist/esm/icons/IconCookie.mjs'
import IconIceCream from '@tabler/icons-react/dist/esm/icons/IconIceCream.mjs'
import IconFlame from '@tabler/icons-react/dist/esm/icons/IconFlame.mjs'
import IconLamp from '@tabler/icons-react/dist/esm/icons/IconLamp.mjs'
import IconMapPin from '@tabler/icons-react/dist/esm/icons/IconMapPin.mjs'
import IconArmchair from '@tabler/icons-react/dist/esm/icons/IconArmchair.mjs'
import IconArrowRight from '@tabler/icons-react/dist/esm/icons/IconArrowRight.mjs'
import IconCheck from '@tabler/icons-react/dist/esm/icons/IconCheck.mjs'
import IconX from '@tabler/icons-react/dist/esm/icons/IconX.mjs'

export interface IconProps {
  size?: number
  className?: string
  /** 線幅（既定 1.8） */
  stroke?: number
  color?: string
}

/** Tabler のアイコンを、サイト共通の既定値（線幅 1.8）で包む */
function createIcon(Base: ComponentType<TablerIconProps>) {
  return function Icon({ size = 24, className, stroke = 1.8, color }: IconProps) {
    return <Base size={size} stroke={stroke} className={className} color={color} />
  }
}

/** 柴犬（ブランドマーク） */
export const ShibaIcon = createIcon(IconDog)
/** コーヒーカップ（純喫茶） */
export const CoffeeIcon = createIcon(IconCoffee)
/** 役場（庁舎） */
export const TownHallIcon = createIcon(IconBuildingBank)
/** 駅 */
export const StationIcon = createIcon(IconTrain)
/** 公園（並木） */
export const ParkIcon = createIcon(IconTrees)
/** 神社（鳥居） */
export const ShrineIcon = createIcon(IconTorii)
/** 花火 */
export const FireworksIcon = createIcon(IconConfetti)
/** 川沿い（波紋） */
export const RiverIcon = createIcon(IconRipple)
/** 森 */
export const ForestIcon = createIcon(IconTree)
/** 商店街 */
export const ShoppingStreetIcon = createIcon(IconBuildingStore)
/** 蛍（光） */
export const FireflyIcon = createIcon(IconSparkle)
/** 橋と川 */
export const BridgeIcon = createIcon(IconBuildingBridge)
/** 抹茶ラテ（茶） */
export const MatchaIcon = createIcon(IconTeapot)
/** クッキー */
export const CookieIcon = createIcon(IconCookie)
/** かき氷 */
export const ShavedIceIcon = createIcon(IconIceCream)
/** 焙煎 */
export const RoastIcon = createIcon(IconFlame)
/** 灯籠 */
export const LanternIcon = createIcon(IconLamp)
/** ピン（地図マーカー） */
export const PinIcon = createIcon(IconMapPin)
/** カウンター（店内） */
export const CounterIcon = createIcon(IconArmchair)
/** 矢印（右） */
export const ArrowRightIcon = createIcon(IconArrowRight)
/** チェック */
export const CheckIcon = createIcon(IconCheck)
/** 閉じる（×） */
export const CloseIcon = createIcon(IconX)
