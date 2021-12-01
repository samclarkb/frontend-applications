import useD3 from '../hooks/useD3'
import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'

function BarChart({ data, selectedChart }) {
	const [initialised, setInitialised] = useState(false)
	// De afmetingen van de gehele svg
	const margin = { top: 40, bottom: 10, left: 120, right: 0 }
	const width = 900 - margin.left - margin.right
	const height = 500 - margin.top - margin.bottom
	const ref = useD3(
		svg => {
			const xscale = d3.scaleLinear().range([0, width]) // scaleLinear om de gaten tussen de data even groot te houden
			const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.15) // padding tussen de rectangles

			const xaxis = d3.axisTop().scale(xscale) // X as zet ik hier aan de bovenkant van de grafiek
			const yaxis = d3.axisLeft().scale(yscale) // data van de Y as zet ik hier aan de linkerkant van de grafiek

			// Zet SVg op de juiste plek
			if (!initialised) {
				const g = svg
					.select('g')
					.attr('transform', `translate(${margin.left},${margin.top})`)
					.attr('class', 'chart')

				// Y en X as

				const g_xaxis = g.append('g').attr('class', 'x axis')
				const g_yaxis = g.append('g').attr('class', 'y axis')
			}

			// Deze functie zorgt ervoor dat er een pop up verschijnt wanneer je over een rectangle heen hovert
			const onMouseMove = (d, data) => {
				// d.clientX en d.clientY zijn properties in het onMouseOver object die de coördinaten van de muis opspoort
				const xPosition = d.clientX
				const yPosition = d.clientY
				let toolTipValue

				toolTipValue = data[selectedChart]

				d3.select(d.target).attr('class', 'highlight') // highlight refereert naar een class in de CSS die de opacity op 0,7 zet
				d3.select('#tooltip').classed('hidden', false) // ik zet de CSS class hidden op false, zodat de pop te voorschijn komt
				d3.select('#tooltip') // hier geef ik aan dat de pop up op de coördinaten van de muis moet worden weergegeven
					.style('left', xPosition + 'px')
					.style('top', yPosition + 'px')
				d3.select('#name').text(`${data.name} heeft `)

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

			const vierkant = () => {
				const color = d3.scaleOrdinal([
					// kleuren van de virkanten
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

				const rect = svg
					.select('.chart')
					.selectAll('rect')
					.data(data, d => d.name)
					.join(enter => {
						const rect_enter = enter
							.append('rect')
							.attr('x', 0)
							.attr('fill', d => {
								return color(d)
							}) // fill the rect
						rect_enter.append('title')
						return rect_enter
					})

					// aanroepen van de mouse events
					.on('mousemove', onMouseMove) // Mousemove returnt constant de coördinaten van de muis
					.on('mouseout', onMouseOut)

				rect.attr('height', yscale.bandwidth())

				// hier stop ik de data in de rectangles. Ik geef hier ook de transities op mijn rectangles mee
				rect.transition()
					.duration(1000)
					.attr('width', d => xscale(d[selectedChart]))
					.attr('y', d => yscale(d.name))
			}

			// Dit is de functie die ervoor zorgt dat de artiest met de hoogste waarde bovenaan de grafiek staat
			const sorteren = data => {
				data.sort((a, b) => {
					return b[selectedChart] - a[selectedChart] // b - a omdat ik hoogste waarde bovenaan wil zetten. Als ik de laagste waarde bovenaan wil zetten wordt het a - b
				})
			}

			// Hier geef ik data mee aan de X en de Y as
			const assenUpdate = data => {
				xscale.domain([0, d3.max(data, d => +d[selectedChart])])
				yscale.domain(data.map(d => d.name))
			}

			const update = (data, type) => {
				sorteren(data, type) // Hier roep ik de sorteren functie aan
				assenUpdate(data, type) // Hier roep ik de functie aan die ervoor zorgt dat X en de Y as worden geupdatet
				vierkant(type) // Deze functie zorgt ervoor dat de data wordt vertuurd naar de rectangle

				// Het renderen van de X en Y as. Ook geef ik hier een transitie van één seconde mee
				svg.select('g.x').transition().duration(1000).ease(d3.easePoly).call(xaxis)
				svg.select('g.y').transition().duration(1000).ease(d3.easePoly).call(yaxis)
			}

			update(data, selectedChart)
		},
		[data.length, selectedChart]
	)
	useEffect(() => {
		setInitialised(true)
	}, [])

	return (
		<svg
			ref={ref}
			style={{
				height: 500,
				width: 900,
				marginRight: '0px',
				marginLeft: '0px',
			}}
		>
			<g className="plot-area" />
			<g className="x-axis" />
			<g className="y-axis" />
		</svg>
	)
}

export default BarChart
