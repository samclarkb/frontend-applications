import React, { useEffect } from 'react'
import useD3 from '../hooks/useD3'
import * as d3 from 'd3'

const PieChart = () => {
	const data = [2, 4, 6, 10, 12]
	const dimensions = {
		width: 500,
		height: 500,
	}

	const ref = useD3(svg => {
		const width = dimensions.width,
			height = dimensions.height,
			radius = Math.min(width, height) / 3

		const g = svg
			.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

		const color = d3.scaleOrdinal(['white', 'black', 'blue', 'red', 'green'])

		const pie = d3.pie()
		const arc = d3.arc().innerRadius(0).outerRadius(radius)
		const arcs = g.selectAll('arc').data(pie(data)).enter().append('g')
		console.log('ARCS', arcs)
		arcs.append('path')
			.attr('fill', function (d, i) {
				return color(i)
			})
			.attr('d', arc)
	}, [])

	return (
		<svg
			ref={ref}
			style={{
				height: dimensions.height,
				width: dimensions.width,
			}}
		></svg>
	)
}

export default PieChart
