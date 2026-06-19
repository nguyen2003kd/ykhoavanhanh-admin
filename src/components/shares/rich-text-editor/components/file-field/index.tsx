'use client'

import { cn } from '@lib/utils'
import { File, FileUp, XCircleIcon } from 'lucide-react'
import Dropzone from 'react-dropzone'

interface FileFieldProps {
  value: File | null
  onValueChange: (value: File | null) => void
  disabled?: boolean
  className?: string
}

export default function FileField({ value, onValueChange, disabled, className }: FileFieldProps) {
  return (
    <div className={className}>
      <div className='grid grid-cols-3 items-center gap-4'>
        <Dropzone
          onDrop={(acceptedFiles) => {
            const file = acceptedFiles[0] as File
            if (file) {
              onValueChange(file)
            }
          }}
          accept={{
            document: ['.doc', '.docx', '.pdf', '.xls', '.xlsx']
          }}
          maxFiles={1}
          maxSize={24 * 1024 * 1024} //24MB
          disabled={disabled}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
            <div
              {...getRootProps()}
              className={cn(
                'focus:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-500 py-4 text-center focus:outline-hidden',
                {
                  'border-primary bg-secondary': isDragActive && isDragAccept,
                  'border-destructive bg-destructive/20': isDragActive && isDragReject
                }
              )}
            >
              <input {...getInputProps()} id='profile' />
              <FileUp size={48} strokeWidth={1.25} />
              <span className='mt-1 text-xs text-gray-500'>Kéo thả file hoặc click để chọn file</span>
            </div>
          )}
        </Dropzone>
        <div className={cn('relative col-span-2', disabled ? 'pointer-events-none' : '')}>
          {value && (
            <div className='rounded-md border border-gray-300 p-2'>
              <button
                type='button'
                className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
                onClick={() => onValueChange(null)}
              >
                <XCircleIcon className='h-5 w-5 bg-white' />
              </button>
              <div className='flex items-center gap-2'>
                <File />
                <p className='line-clamp-1'>{value?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
