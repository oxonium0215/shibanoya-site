interface IconProps {
  size?: number
  className?: string
}

/** 柴犬（ブランドマーク） */
export function ShibaIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 14 L7 5 L17 5 L19 14" />
      <path d="M7.5 10 L10 6 L14 6 L16.5 10" />
      <circle cx="9" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <path d="M10.5 17 Q12 18.5 13.5 17" />
      <circle cx="12" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** コーヒーカップ（純喫茶） */
export function CoffeeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 9 h13 v6 a4 4 0 0 1 -4 4 h-5 a4 4 0 0 1 -4 -4 z" />
      <path d="M17 10 h1.5 a2.5 2.5 0 0 1 0 5 h-1.5" />
      <path d="M8 3 v2 M11 3 v2 M14 3 v2" />
    </svg>
  )
}

/** 役場（庁舎） */
export function TownHallIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10 L12 4 L20 10" />
      <path d="M6 10 v10 M18 10 v10 M6 20 h12" />
      <path d="M9 14 h6 M9 17 h6" />
    </svg>
  )
}

/** 駅 */
export function StationIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="4" width="14" height="5" rx="1" />
      <path d="M7 9 v6 M17 9 v6" />
      <rect x="7" y="15" width="10" height="4" rx="1" />
      <path d="M9 5 h2 M13 5 h2" />
    </svg>
  )
}

/** 公園（木） */
export function ParkIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 C8 7 8 10 12 13 C16 10 16 7 12 3 z" />
      <path d="M9 13 C6 16 6 18 9 20 h6 C18 18 18 16 15 13" />
      <path d="M12 13 v7" />
    </svg>
  )
}

/** 神社（鳥居） */
export function ShrineIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 9 L12 4 L20 9" />
      <path d="M5 9 h14 M6.5 9 v4 M17.5 9 v4" />
      <path d="M8 13 v7 h8 v-7" />
    </svg>
  )
}

/** 花火 */
export function FireworksIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 2.5 v2 M8 11.5 v2 M2.5 8 h2 M11.5 8 h2 M4.1 4.1 l1.4 1.4 M10.5 10.5 l1.4 1.4 M10.5 4.1 l-1.4 1.4 M4.1 10.5 l1.4 -1.4" />
      <path d="M14 14 l2.5 -1 M16 17 l3 0.5 M15 20 l2.5 1.5" />
      <circle cx="18" cy="12" r="1.2" />
      <path d="M18 8.5 v1.5 M18 14 v1.5 M15.5 12 h1.5 M19 12 h1.5" />
    </svg>
  )
}

/** 川沿い（波） */
export function RiverIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9 Q6 6 9 9 T15 9 T21 9" />
      <path d="M3 14 Q6 11 9 14 T15 14 T21 14" />
      <path d="M6 19 Q9 16 12 19 T18 19" />
    </svg>
  )
}

/** 森（木々） */
export function ForestIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 12 L9 6 L12 12" />
      <path d="M12 12 L15 5 L18 12" />
      <path d="M4 12 h16 M5.5 12 v8 M12 12 v8 M18.5 12 v8" />
    </svg>
  )
}

/** 商店街（軒並み） */
export function ShoppingStreetIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10 L12 5 L20 10" />
      <path d="M4 10 v9 M20 10 v9 M6.5 10 v9 M17.5 10 v9" />
      <path d="M9 13 h2.5 M12.5 13 h2.5" />
    </svg>
  )
}

/** 蛍（光） */
export function FireflyIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.6 5.6 L7.4 7.4 M16.6 16.6 L18.4 18.4 M18.4 5.6 L16.6 7.4 M7.4 16.6 L5.6 18.4" />
    </svg>
  )
}

/** 橋と川 */
export function BridgeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6 v9 M21 6 v9" />
      <path d="M3 8 h18 M3 11 h18" />
      <path d="M3 15 q4.5 3 9 0 t9 0" />
    </svg>
  )
}

/** 抹茶ラテ（茶碗） */
export function MatchaIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 8 h10 a5 5 0 0 1 -5 5 h0 a5 5 0 0 1 -5 -5 z" />
      <path d="M7 8 v-1 a2 2 0 0 1 2 -2 h2 a2 2 0 0 1 2 2 v1" />
      <path d="M15 9 h2 a2 2 0 0 1 0 4 h-2" />
    </svg>
  )
}

/** クッキー（柴犬の顔） */
export function CookieIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 13 L7 7 L17 7 L19 13" />
      <path d="M7.5 10 L9.5 7.5 L14.5 7.5 L16.5 10" />
      <circle cx="9.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M10.5 16 Q12 17 13.5 16" />
    </svg>
  )
}

/** かき氷 */
export function ShavedIceIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 9 h8 a4 4 0 0 1 0 8 h-8 a4 4 0 0 1 0 -8 z" />
      <path d="M12 6 v-2 M12 3.5 h-1 M12 3.5 h1" />
      <path d="M10 12 h4 M10 14.5 h4" />
    </svg>
  )
}

/** 焙煎（豆） */
export function RoastIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="12" rx="4.5" ry="6" transform="rotate(-30 12 12)" />
      <path d="M9 10 q2 -1.5 4 0" />
      <path d="M4 5 h2 M3 8 h2" />
    </svg>
  )
}

/** 灯籠 */
export function LanternIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 4 h6 M10 4 v2 M14 4 v2" />
      <path d="M7 6 h10 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -3 3 h-10 a3 3 0 0 1 -3 -3 v-6 a3 3 0 0 1 3 -3 z" />
      <path d="M12 6 v12" />
    </svg>
  )
}

/** ピン（地図マーカー） */
export function PinIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21 C 12 21 5 14.5 5 10 a 7 7 0 0 1 14 0 C 19 14.5 12 21 12 21 z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

/** カウンター（店内） */
export function CounterIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10 h16 M4 14 h16" />
      <path d="M6 10 v-2 a2 2 0 0 1 2 -2 h8 a2 2 0 0 1 2 2 v2" />
      <path d="M8 14 v4 M16 14 v4 M8 18 h8" />
    </svg>
  )
}

/** 矢印（右） */
export function ArrowRightIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12 h16 M13 5 l7 7 -7 7" />
    </svg>
  )
}
