// import React, { useEffect } from 'react'
import useD3 from '../hooks/useD3'
import * as d3 from 'd3'
import { selectAll } from 'd3'

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

			arcs.data(pie.value(d => d[selectedChart])(data))
				// .data(pie(data.map(d => d.name)))
				.enter()
				.append('path')
				.attr('class', 'arc')
				.attr('fill', function (d) {
					return color(d)
				})
				.attr('d', arc)

			// console.log(data)

			// const scores = data.map(d => parseInt(d.playcount))
			// const totalScores = scores.reduce(
			// 	(previousScore, currentScore, index) => previousScore + currentScore,
			// 	0
			// )
			// console.log(totalScores) //returns 403

			arcs.data(pie.value(d => d[selectedChart])(data))
				// .data(pie(data.map(d => d.name)))
				.enter()
				.append('text')
				.text(function (d) {
					const scores = data.map(d => parseInt(d[selectedChart]))
					const totalScores = scores.reduce(
						(previousScore, currentScore, index) => previousScore + currentScore,
						0
					)

					return Math.round((d.data[selectedChart] / totalScores) * 100) + '%'
				})
				.attr('transform', function (d) {
					return 'translate(' + arc.centroid(d) + ')'
				})
				.attr('fill', 'white')
				.attr('text-anchor', 'middle')
				.style('font-size', 13)
				.style('stroke-width', '2px')

			// var percent = Math.round((1000 * d.data.count) / total) / 10

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
