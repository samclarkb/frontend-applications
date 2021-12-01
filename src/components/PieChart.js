// import React, { useEffect } from 'react'
import useD3 from '../hooks/useD3'
import * as d3 from 'd3'

const PieChart = ({ data, selectedChart }) => {
	const dimensions = {
		width: 600,
		height: 600,
	}

	const ref = useD3(
		svg => {
			const width = dimensions.width,
				height = dimensions.height,
				radius = Math.min(width, height) / 3

			svg.select('g').remove()

			const g = svg
				.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

			const color = d3.scaleOrdinal([
				'#6B8E6E',
				'#759D78',
				'#82AC85',
				'#A9C7AC',
				'#BFD8C4',
				'#D1ACA5',
				'#D6B6AF',
				'#DBBFB9',
				'#E0C8C3',
				'#E5D1CD',
			])

			const pie = d3.pie()
			const arc = d3.arc().innerRadius(125).outerRadius(200).padAngle(0.02)

			const arcs = g.selectAll('.arc')

			// pie.transition().duration(1000)

			if (selectedChart === 'playcount') {
				arcs.data(pie.value(d => d.playcount)(data))
					// .data(pie(data.map(d => d.name)))
					.enter()
					.append('path')
					.attr('class', 'arc')
					.attr('fill', function (d, i) {
						return color(i)
					})
					.attr('d', arc)
			} else if (selectedChart === 'listeners') {
				arcs.data(pie.value(d => d.listeners)(data))
					// .data(pie(data.map(d => d.name)))
					.enter()
					.append('path')
					.attr('class', 'arc')
					.attr('fill', function (d, i) {
						return color(i)
					})
					.attr('d', arc)
			} else if (selectedChart === 'average') {
				arcs.data(pie.value(d => d.average)(data))
					// .data(pie(data.map(d => d.name)))
					.enter()
					.append('path')
					.attr('class', 'arc')
					.attr('fill', function (d, i) {
						return color(i)
					})
					.attr('d', arc)
			} else {
				arcs.data(pie.value(d => d.playcount)(data))
					.enter()
					.append('path')
					.attr('class', 'arc')
					.attr('fill', function (i) {
						return color(i)
					})
					.attr('d', arc)
			}

			// sheidslijn
			const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius)

			arcs.data(data)
				.enter()
				.append('text')
				.text(function (d) {
					return d.name
				})
				.attr('transform', function (d) {
					return 'translate(' + arcGenerator.centroid(d) + ')'
				})
				.attr('fill', 'white')
				.attr('text-anchor', 'middle')
				.style('font-size', 12)
				.style('stroke-width', '2px')

			// if (selectedChart === 'playcount') {
			// 	g.selectAll('.arc')
			// 		.enter()
			// 		.append('text')
			// 		.attr('transform', function (d) {
			// 			return 'translate(' + g.centroid(d) + ')'
			// 		})
			// 		.attr('text-anchor', 'middle')
			// 		.attr('fill', 'white')
			// 		.text(function (d) {
			// 			return data.name + '%'
			// 		})
			// } else if (selectedChart === 'listeners') {
			// 	g.selectAll('.arc')
			// 		.enter()
			// 		.append('text')
			// 		.attr('transform', function (d) {
			// 			return 'translate(' + arc.centroid(d) + ')'
			// 		})
			// 		.attr('text-anchor', 'middle')
			// 		.attr('fill', 'white')
			// 		.text(function (d) {
			// 			return data.name
			// 		})
			// } else if (selectedChart === 'average') {
			// 	g.selectAll('.arc')
			// 		.enter()
			// 		.append('text')
			// 		.attr('transform', function (d) {
			// 			return 'translate(' + arc.centroid(d) + ')'
			// 		})
			// 		.attr('text-anchor', 'middle')
			// 		.attr('fill', 'white')
			// 		.text(function (d) {
			// 			return data.name
			// 		})
			// } else {
			// 	g.selectAll('.arc')
			// 		.enter()
			// 		.append('text')
			// 		.attr('transform', function (d) {
			// 			return 'translate(' + arc.centroid(d) + ')'
			// 		})
			// 		.attr('text-anchor', 'middle')
			// 		.attr('fill', 'white')
			// 		.text(function (d) {
			// 			return data.name
			// 		})
			// }

			// arcs.append('text')
			// 	.attr('transform', function (d) {
			// 		return 'translate(' + arc.centroid(d) + ')'
			// 	})

			// 	.attr('text-anchor', 'end')
			// 	.text(function (d) {
			// 		return d.name
			// 	})

			// arcs.append('text')
			// 	.attr('text-anchor', 'middle')
			// 	.text(d => d.name)

			// var total = d3.sum(
			//     dataset.map(function (d) {
			//         // NEW
			//         return d.count // NEW
			//     })
			// ) // NEW
			// var percent = Math.round((1000 * d.data.count) / total) / 10

			// svg.selectAll('arc')
			// 	.data(data.map(d => d.name))
			// 	.join('text')
			// 	.text(function (d) {
			// 		return +d.name
			// 	})
			// 	.attr('transform', function (d) {
			// 		return `translate(${arc .centroid(d.name)})`
			// 	})
			// 	.style('text-anchor', 'middle')
			// 	.style('font-size', 17)

			const onMouseMove = (d, data) => {
				// d.clientX en d.clientY zijn properties in het onMouseOver object die de coördinaten van de muis opspoort
				const xPosition = d.clientX
				const yPosition = d.clientY
				let toolTipValue

				toolTipValue = data.data[selectedChart]

				d3.select(d.target).attr('class', 'highlight') // highlight refereert naar een class in de CSS die de opacity op 0,7 zet
				d3.select('#tooltip').classed('hidden', false) // ik zet de CSS class hidden op false, zodat de pop te voorschijn komt
				d3.select('#tooltip') // hier geef ik aan dat de pop up op de coördinaten van de muis moet worden weergegeven
					.style('left', xPosition + 'px')
					.style('top', yPosition + 'px')
				d3.select('#name').text(`${data.data.name} heeft `)

				// Ik gebruik hier een if else statement, omdat ik voor iedere filter een andere text wil laten zien
				if (selectedChart === 'playcount') {
					d3.select('#value').text(`${toolTipValue} totaal aantal streams `)
				}
				if (selectedChart === 'listeners') {
					d3.select('#value').text(`${toolTipValue} aantal verschillende luisteraars `)
				}
				if (selectedChart === 'average') {
					d3.select('#value').text(
						`${Math.round(toolTipValue)} streams gemiddeld per luisteraar`
					) // Ik gebruik hier Math.round omdat ik het getal van deze uitkomst wil afronden
				}
			}

			// Deze functie zorgt ervoor dat de pop up wordt verwijderd wanneer de mui zich niet meer op de rectangle bevindt
			const onMouseOut = d => {
				d3.select(d.target).attr('class', 'bar')
				d3.select('#tooltip').classed('hidden', true) // Hidden refereert naar een CSS class die de pop up op display none zet
			}

			// arcs.data(pie(data)).transition().duration(2000).attr('d', arc)

			g.selectAll('.arc')
				.on('mousemove', onMouseMove) // Mousemove returnt constant de coördinaten van de muis
				.on('mouseout', onMouseOut)
		},
		[data.length, selectedChart]
	)

	return (
		<svg
			ref={ref}
			style={{
				height: dimensions.height,
				width: dimensions.width,
			}}
			// dangerouslySetInnerHTML={{ __html: '' }} // alles binnen de svg wordt genegeerd door React
		></svg>
	)
}

export default PieChart
