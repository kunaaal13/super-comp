import { AnimationSequence, stagger, useAnimate } from 'framer-motion'

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min + 1) + min
}

function SparkleButton() {
  const [scope, animate] = useAnimate()

  function handleClick() {
    const sparkles = Array.from({
      length: 20,
    })

    const sparklesAnimation: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        x: getRandomNumber(-100, 100),
        y: getRandomNumber(-100, 100),
        scale: [1.5, 2.5],
        opacity: 1,
      },
      {
        duration: 0.4,
        at: '<',
      },
    ])

    const sparklesFadeOut: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        opacity: 0,
        scale: 0,
      },
      {
        duration: 0.3,
        at: '<',
      },
    ])

    const sparklesReset: AnimationSequence = sparkles.map((_, index) => [
      `.sparkle-${index}`,
      {
        x: 0,
        y: 0,
      },
      {
        duration: 0.000001,
      },
    ])

    animate([
      ...sparklesReset,
      ['.letter', { y: -32 }, { duration: 0.2, delay: stagger(0.05) }],
      ['button', { scale: 0.8 }, { duration: 0.1, at: '<' }],
      ['button', { scale: 1 }, { duration: 0.1 }],
      ...sparklesAnimation,
      ['.letter', { y: 0 }, { duration: 0.000001 }],
      ...sparklesFadeOut,
    ])
  }

  const WORD = 'Spring'

  return (
    <div ref={scope}>
      <button
        onClick={handleClick}
        className='rounded-full border-2 border-blue-600 px-6 py-2 text-blue-600 transition-colors hover:bg-blue-100 text-2xl relative'
      >
        <span className='sr-only'>Sparkle</span>

        <span aria-hidden className='block h-8 overflow-hidden'>
          {WORD.split('').map((letter, index) => (
            <span
              data-letter={letter}
              key={`${letter}-${index}`}
              className='letter relative inline-block after:absolute after:left-0 after:top-full after:h-8 after:content-[attr(data-letter)] leading-8'
            >
              {letter}
            </span>
          ))}
        </span>

        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 -z-10 block'
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <svg
              className={`absolute left-1/2 top-1/2 opacity-0 sparkle-${index}`}
              key={index}
              viewBox='0 0 122 117'
              width='10'
              height='10'
            >
              <path
                className='fill-blue-600'
                d='M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z'
              />
            </svg>
          ))}
        </span>
      </button>
    </div>
  )
}

export default SparkleButton
