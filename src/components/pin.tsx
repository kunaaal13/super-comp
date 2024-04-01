import React, { useRef, useState } from 'react'
import { cn } from '../lib/utils'

interface PinInputProps {
  length: number
  value: string[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
}

function PinInput({ length, value, setValue }: PinInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(0)

  function updateValueAtIndex(index: number, value: string) {
    setValue((prev) => {
      const newValue = [...prev]
      newValue[index] = value
      return newValue
    })
  }

  function handleFocus(index: number) {
    // if index is not the last input or the first input
    if (index !== length && index >= 0) {
      inputRefs.current[index]?.focus()
    }
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    // if backspace key is pressed
    if (event.key === 'Backspace') {
      event.preventDefault()
      // if value at index is empty and index is not the first input go to the previous input else stay at the current input and update the value to empty
      updateValueAtIndex(index, '')
      handleFocus(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      // if arrow right key is pressed go to the next input
      handleFocus(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      // if arrow left key is pressed go to the previous input
      handleFocus(index - 1)
    } else if (event.key === 'Delete') {
      event.preventDefault()
      // if delete key is pressed update the value to empty
      updateValueAtIndex(index, '')
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    event.preventDefault()

    const pastedData = event.clipboardData
      .getData('text/plain')
      .slice(0, length - focusedIndex)
      .split('')

    // Paste the data to the inputs
    pastedData.forEach((data, index) => {
      updateValueAtIndex(focusedIndex + index, data)
    })

    // focus the input after the last pasted data
    handleFocus(focusedIndex + pastedData.length)
  }

  return (
    <div
      onPaste={handlePaste}
      className={cn('w-full flex items-center space-x-5 font-mono')}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => (inputRefs.current[index] = element)}
          className='w-14 h-14 border-2 border-gray-700 p-5 font-medium rounded-2xl text-center focus:scale-[1.1] transition-all duration-150 ease-in-out caret-transparent focus:border-green-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none'
          placeholder={(index + 1).toString()}
          onChange={(event) => {
            if (event.target.value) {
              updateValueAtIndex(index, event.target.value)
              handleFocus(index + 1)
            }
          }}
          value={value[index]}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onFocus={() => setFocusedIndex(index)}
          maxLength={1}
          minLength={1}
          autoComplete='one-time-code'
        />
      ))}
    </div>
  )
}

export default PinInput
