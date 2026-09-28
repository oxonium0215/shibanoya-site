// @tabler/icons-react はバレル import だと tree-shake が効かず全アイコンが
// バンドルされるため、個別ファイル（dist/esm/icons/*.mjs）を直接読み込みます。
// 個別ファイルには型定義が無いので、ここで宣言します。
declare module '@tabler/icons-react/dist/esm/icons/*.mjs' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react'
  import type { IconProps } from '@tabler/icons-react'
  const Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  export default Icon
}
