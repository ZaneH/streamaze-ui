import { useMantineTheme } from '@mantine/core'
import { PollContext } from 'components/Providers/PollProvider'
import ReactECharts from 'echarts-for-react'
import { useContext } from 'react'

const dataToFrequency = (data = []) => {
  // Convert { userId: 'user1', content: '1' } to { choice: '1', frequency: 1 }
  const frequency = {}
  data.forEach((d) => {
    const choice = d.content
    if (frequency[choice]) {
      frequency[choice] += 1
    } else {
      frequency[choice] = 1
    }
  })

  return Object.keys(frequency).map((choice) => {
    return {
      choice,
      frequency: frequency[choice],
      percent: frequency[choice] / data.length,
    }
  })
}

const PollBarGraph = () => {
  const { colors } = useMantineTheme()
  const { pollResponses } = useContext(PollContext)
  const frequencyData = dataToFrequency(pollResponses)
  const xValues = frequencyData.map((d) => d.choice)
  const yValues = frequencyData.map((d) => d.frequency)

  return (
    <ReactECharts
      option={{
        xAxis: {
          type: 'category',
          data: xValues,
          name: 'Choice',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 16,
            padding: 20,
          },
        },
        yAxis: {
          type: 'value',
          name: 'Votes',
          minInterval: 1,
          min: 0,
          splitLine: { show: false },
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 16,
            padding: 20,
          },
        },
        series: [
          {
            data: yValues,
            type: 'bar',
            itemStyle: {
              color: colors.blue[5],
              borderRadius: [6, 6, 0, 0],
            },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
                const { frequency, percent } =
                  frequencyData[params.dataIndex] || {}
                return `${frequency} (${(percent * 100).toFixed(0)}%)`
              },
              color: '#fff',
              fontSize: 16,
              fontWeight: 'lighter',
            },
          },
        ],
      }}
    />
  )
}

export default PollBarGraph
