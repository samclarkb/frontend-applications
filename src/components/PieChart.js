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

			// hiermee sorg ik ervoor dat de pie chart wordt verwijderd wanneer deze wordt geupdatet
			svg.select('g').remove()

			const g = svg
				.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

			// const color = d3.scaleOrdinal([
			// 	//  kleuren van de piechart
			// 	'#6B8E6E',
			// 	'#759D78',
			// 	'#82AC85',
			// 	'#A9C7AC',
			// 	'#BFD8C4',
			// 	'#D1ACA5',
			// 	'#D6B6AF',
			// 	'#DBBFB9',
			// 	'#E0C8C3',
			// 	'#E5D1CD',
			// ])
			console.log(data)

			const pie = d3.pie()
			const arc = d3.arc().innerRadius(125).outerRadius(200).padAngle(0.02)
			const arcs = g.selectAll('.arc')

			// stopt de data in de pie chart
			arcs.data(pie.value(d => d[selectedChart])(data))
				.enter()
				.append('path')
				.attr('class', 'arc')
				.attr('fill', function (d) {
					console.log(d.data[selectedChart])
					return d.data.color
				})
				.attr('d', arc)

			// text aan de pie chart toevoegen
			arcs.data(pie.value(d => d[selectedChart])(data))
				.enter()
				.append('text')
				.text(function (d) {
					const scores = data.map(d => parseInt(d[selectedChart])) // parseInt zorgt ervoor dat ik van een sring een number maakt
					const totalScores = scores.reduce(
						(previousScore, currentScore) => previousScore + currentScore, // berekent het totaal, zodat ik het percentage kan uitrekenen
						0
					)
					return Math.round((d.data[selectedChart] / totalScores) * 100) + '%' // berekent het percentage
				})
				.attr('transform', function (d) {
					return 'translate(' + arc.centroid(d) + ')'
				})
				.attr('fill', 'white')
				.attr('text-anchor', 'middle') // positionering van de tekst
				.style('font-size', 13)

			const onMouseMove = (d, data) => {
				// d.clientX en d.clientY zijn properties in het onMouseOver object die de coördinaten van de muis opspoort
				const xPosition = d.clientX
				const yPosition = d.clientY

				d3.select(d.target).attr('class', 'highlight') // highlight refereert naar een class in de CSS die de opacity op 0,7 zet
				d3.select('#tooltip2').classed('hidden2', false) // ik zet de CSS class hidden op false, zodat de pop te voorschijn komt
				d3.select('#tooltip2') // hier geef ik aan dat de pop up op de coördinaten van de muis moet worden weergegeven
					.style('left', xPosition - 105 + 'px')
					.style('top', yPosition + 'px')
				d3.select('#name2').text(`${data.data.name}`)
			}

			// Deze functie zorgt ervoor dat de pop up wordt verwijderd wanneer de mui zich niet meer op de rectangle bevindt
			const onMouseOut = d => {
				d3.select(d.target).attr('class', 'bar')
				d3.select('#tooltip2').classed('hidden2', true) // Hidden refereert naar een CSS class die de pop up op display none zet
			}

			// arcs.data(pie(data)).transition().duration(2000).attr('d', arc)

			g.selectAll('.arc')
				.on('mousemove', onMouseMove) // Mousemove returnt constant de coördinaten van de muis
				.on('mouseout', onMouseOut)
		},
		[data, selectedChart]
	)

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
