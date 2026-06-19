// App
export type ApiFile = {
  _id: string
  path: string
  original: string
  mime: string
  compress_info: Record<
    string,
    {
      ext: string
      size: number
    }
  >
}

// Types
export interface Props {
  files: ApiFile[]
}
