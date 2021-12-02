import './App.css'
import { useEffect, useState } from 'react'
import dataOphalen from './components/fetch.js'
import BarChart from './components/BarChart.js'
import PieChart from './components/PieChart.js'
const COLORS = [
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
]

function App() {
	const [json, setJson] = useState(null)
	const [selectedChart, setselectedChart] = useState('playcount')
	const onRadioButtonChange = e => {
		setselectedChart(e.currentTarget.value)
	}
	useEffect(() => {
		dataOphalen().then(data =>
			setJson(
				data
					.sort((a, b) => b.playcount - a.playcount)
					.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))
			)
		)
	}, [])

	return (
		<div className="App">
			<div className="filterEnTitel">
				<h1>Artiesten Statistieken</h1>
				<div className="hidden" id="tooltip">
					<p id="name"></p>
					<p id="value"></p>
				</div>
				<div className="radio">
					<label>
						{' '}
						<input
							type="radio"
							name="chart"
							value="playcount"
							id="filter"
							checked={selectedChart == 'playcount'}
							onChange={onRadioButtonChange}
						/>
						Totaal Aantal Streams
					</label>
					<label>
						<input
							type="radio"
							name="chart"
							value="listeners"
							id="filter"
							checked={selectedChart == 'listeners'}
							onChange={onRadioButtonChange}
						/>
						Totaal Aantal Luisteraars
					</label>
					<label>
						<input
							type="radio"
							name="chart"
							value="average"
							id="filter"
							checked={selectedChart == 'average'}
							onChange={onRadioButtonChange}
						/>
						Gemiddeld Aantal Streams Per Luisteraar
					</label>
				</div>
			</div>

			<div className="stijl">
				<div className="barchart">
					{json ? <BarChart selectedChart={selectedChart} data={json} /> : undefined}
				</div>
				<div className="hidden2" id="tooltip2">
					<p id="name2"></p>
					<p id="value2"></p>
				</div>
				{json ? <PieChart selectedChart={selectedChart} data={json} /> : undefined}
			</div>
		</div>
	)
}

export default App
