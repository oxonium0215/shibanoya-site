// ============================================================================
// 土地登記簿データ
//
// 第1期で完売した区画について、登記簿（表題部＋権利部）を自動生成します。
// 区画・住人データを変えれば、ここを触らずに登記簿も連動して更新されます。
// ============================================================================

import type { RegistryEntry } from './types'
import { lots } from './lots'
import { residentById } from './residents'

/** 区画から登記簿の1件分を組み立てる */
function buildEntry(lot: (typeof lots)[number]): RegistryEntry | null {
  if (lot.status !== 'sold' || !lot.ownerId) return null
  const owner = residentById[lot.ownerId]
  if (!owner) return null

  return {
    lotId: lot.id,
    lotNumber: lot.number,
    lotName: `第${lot.number}区画`,
    registrationNo: `柴ノ町 第${String(lot.number).padStart(4, '0')}号`,
    landType: '宅地',
    area: lot.area,
    address: `柴ノ県柴ノ町 別荘地 ${lot.id.toUpperCase()}`,
    ownerName: owner.name,
    ownerHandle: owner.handle,
    ownerAddress: `柴ノ県柴ノ町 別荘地 ${lot.number}番`,
    reason: '贈与（常連様1,000名突破記念 別荘地プレゼント企画）',
    registeredDate: lot.acquiredDate ?? '令和6年7月28日',
    certificateNo: owner.certificateNo,
  }
}

/** 登記済みの全件 */
export const registryEntries: RegistryEntry[] = lots
  .map(buildEntry)
  .filter((e): e is RegistryEntry => e !== null)

/** id から登記簿を引くためのマップ */
export const registryByLotId: Record<string, RegistryEntry> = Object.fromEntries(
  registryEntries.map((e) => [e.lotId, e]),
)

/** 検索関数：区画番号・所有者名・ハンドル名で絞り込む（大文字小文字は無視） */
export function searchRegistry(query: string): RegistryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return registryEntries
  return registryEntries.filter((e) =>
    [e.lotName, String(e.lotNumber), e.ownerName, e.ownerHandle, e.registrationNo]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}