import './App.css'
import { useEffect, useState } from 'react'
import dataOphalen from './components/fetch.js'
import BarChart from './components/BarChart.js'
import PieChart from './components/PieChart.js'

function App() {
	const [json, setJson] = useState(null)
	const [selectedChart, setselectedChart] = useState('playcount')
	const onRadioButtonChange = e => {
		setselectedChart(e.currentTarget.value)
	}
	useEffect(() => {
		dataOphalen().then(data => setJson(data))
	})

	return (
		<div className="App">
			<div className="filterEnTitel">
				<h1>Artiesten Bar chart</h1>
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

			{/* <pre>{JSON.stringify(json, null, 3)}</pre> */}
			<div className="barchart">
				{json ? <BarChart selectedChart={selectedChart} data={json} /> : undefined}
			</div>

			{json ? <PieChart data={json} /> : undefined}
		</div>
	)
}

export default App
