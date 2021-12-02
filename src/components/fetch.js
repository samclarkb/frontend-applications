function dataOphalen() {
	return new Promise(resolve => {
		fetch(
			'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=10&api_key=05064fdc55f8c3320ca9ed2c12ae1fa4&artist?&format=json'
		) // Dit is de link van de externe API
			.then(response => response.json())
			.then(data => {
				const artists = data.artists.artist.map(data => {
					// 		// Ik maak hier een nieuwe property genaamd average aan
					// 		// Ik deel hier het totale aantal streams door het totaal aantal verschillende listeners, zodat ik het gemiddelde aantal nummers per luisteraar krijg
					data.average = data.playcount / data.listeners
					// 		// Hier rond ik het gemiddelde af naar een rond getal
					data.average = Math.round(data.average)
					return data
				})
				resolve(artists)
			})
			.catch(err => {
				console.error(err) // Als er iets mis gaat geeft deze catch een error weer in de console
			})
	})
}

export default dataOphalen
