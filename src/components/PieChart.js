import useD3 from '../hooks/useD3'
import * as d3 from 'd3'

const PieChart = ({ data, geselecteerdeWaarde }) => {
	const afmetingen = {
		width: 600,
		height: 600,
	}

	const ref = useD3(
		svg => {
			const width = afmetingen.width,
				height = afmetingen.height,
				radius = Math.min(width, height) / 3

			// hiermee zorg ik ervoor dat de pie chart wordt verwijderd wanneer deze wordt geupdatet
			svg.select('g').remove()

			const g = svg
				.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

			const pie = d3.pie()
			const arc = d3.arc().innerRadius(125).outerRadius(200).padAngle(0.02)
			const arcs = g.selectAll('.arc')

			// stopt de data in de pie chart
			arcs.data(pie.value(d => d[geselecteerdeWaarde])(data))
				.enter()
				.append('path')
				.attr('class', 'arc')
				.attr('fill', function (d) {
					console.log(d.data[geselecteerdeWaarde])
					return d.data.kleur
				})
				.attr('d', arc)

			// text aan de pie chart toevoegen
			arcs.data(pie.value(d => d[geselecteerdeWaarde])(data))
				.enter()
				.append('text')
				.text(function (d) {
					const scores = data.map(d => parseInt(d[geselecteerdeWaarde])) // parseInt zorgt ervoor dat ik van een sring een number maakt
					const totaleScore = scores.reduce(
						(vorigeScore, huidigeScore) => vorigeScore + huidigeScore, // berekent het totaal, zodat ik het percentage kan uitrekenen
						0
					)
					return Math.round((d.data[geselecteerdeWaarde] / totaleScore) * 100) + '%' // berekent het percentage
				})
				.attr('transform', function (d) {
					return 'translate(' + arc.centroid(d) + ')'
				})
				.attr('fill', 'white')
				.attr('text-anchor', 'middle') // positionering van de tekst
				.style('font-size', 13)

			const muisBeweeg = (d, data) => {
				// d.clientX en d.clientY zijn properties in het onMouseOver object die de coördinaten van de muis opspoort
				const xPositie = d.clientX
				const yPositie = d.clientY

				d3.select(d.target).attr('class', 'highlight') // highlight refereert naar een class in de CSS die de opacity op 0,7 zet
				d3.select('#tooltip2').classed('hidden2', false) // ik zet de CSS class hidden op false, zodat de pop te voorschijn komt
				d3.select('#tooltip2') // hier geef ik aan dat de pop up op de coördinaten van de muis moet worden weergegeven
					.style('left', xPositie - 105 + 'px')
					.style('top', yPositie + 'px')
				d3.select('#naam2').text(`${data.data.name} `)
			}

			// Deze functie zorgt ervoor dat de pop up wordt verwijderd wanneer de mui zich niet meer op de rectangle bevindt
			const muisUit = d => {
				d3.select(d.target).attr('class', 'bar')
				d3.select('#tooltip2').classed('hidden2', true) // Hidden refereert naar een CSS class die de pop up op display none zet
			}

			g.selectAll('.arc')
				.on('mousemove', muisBeweeg) // Mousemove returnt constant de coördinaten van de muis
				.on('mouseout', muisUit)
		},
		[data, geselecteerdeWaarde]
	)

	return (
		<svg
			ref={ref}
			style={{
				height: afmetingen.height,
				width: afmetingen.width,
			}}
		></svg>
	)
}

export default PieChart
