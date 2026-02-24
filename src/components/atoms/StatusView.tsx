type Props = {
  status: 'loading' | 'ready' | 'empty' | 'error'
  errorMsg: string
}

export function StatusView({ status, errorMsg}: Props) {
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'empty') return <div>曲が見つかりません</div>
  if (status === 'error') return <div>エラーが発生しました：{errorMsg}</div>
  return null
}