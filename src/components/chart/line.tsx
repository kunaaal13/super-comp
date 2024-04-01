import * as d3 from 'd3'

interface LineChartProps {}

function LineChart({}: LineChartProps) {
  const height = 100
  const width = 100

  let x = d3.scaleLinear()
  let line = d3.line().y((d) => height - d[1])
  let result = line([
    [0, 10],
    [5, 50],
    [15, 75],
    [55, 100],
    [75, 10],
    [100, 20],
  ])

  console.log(result)

  return (
    <div className='h-1/2 w-1/2'>
      <svg className='bg-gray-100' viewBox={`0 0 ${width} ${height}`}>
        <path d={result || ''} fill='none' stroke='black' />
      </svg>
    </div>
  )
}

export default LineChart
