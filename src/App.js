import logo from './logo.svg'
import './App.css'
import { useEffect, useState } from 'react'

import dataOphalen from './fetch.js'

function App() {
	const [json, setJson] = useState(null)
	useEffect(() => {
		dataOphalen().then(data => setJson)
	})

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<pre>{JSON.stringify(json, null, 3)}</pre>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
