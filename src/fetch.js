function dataOphalen() {
	return new Promise(resolve => {
		fetch(
			'http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=10&api_key=05064fdc55f8c3320ca9ed2c12ae1fa4&artist?&format=json'
		) // Dit is de link van de externe API
			.then(response => response.json())
			.then(data => {
				// Hier roep ik al mijn functions aan
				// gemiddeldeBerekenen(data)
				// sorterenVanHoogNaarLaag(data)
				// dataPrintenNaarDeConsole(data)

				const artists = data.artists.artist
					.map(data => {
						// 		// Ik maak hier een nieuwe property genaamd average aan
						// 		// Ik deel hier het totale aantal streams door het totaal aantal verschillende listeners, zodat ik het gemiddelde aantal nummers per luisteraar krijg
						data.average = data.playcount / data.listeners
						// 		// Hier rond ik het gemiddelde af naar een rond getal
						data.average = Math.round(data.average)
						return data
					})
					.sort((a, b) => b.average - a.average)
					.map(data => {
						// De backticks maken het mogelijk om extra tekst aan de string toe te voegen
						return `De gemiddelde ${data.name} luisteraar heeft naar ${data.average} nummers geluisterd van ${data.name}`
					})
				resolve(artists)
			})
			.catch(err => {
				console.error(err) // Als er iets mis gaat geeft deze catch een error weer in de console
			})

		// const gemiddeldeBerekenen = data => {
		// const artists = data.artists.artist
		// 	.map(data => {
		// 		// 		// Ik maak hier een nieuwe property genaamd average aan
		// 		// 		// Ik deel hier het totale aantal streams door het totaal aantal verschillende listeners, zodat ik het gemiddelde aantal nummers per luisteraar krijg
		// 		data.average = data.playcount / data.listeners
		// 		// 		// Hier rond ik het gemiddelde af naar een rond getal
		// 		data.average = Math.round(data.average)
		// 		return data
		// 	})
		// 	.sort((a, b) => b.average - a.average)
		// 	.map(data => {
		// 		// De backticks maken het mogelijk om extra tekst aan de string toe te voegen
		// 		return `De gemiddelde ${data.name} luisteraar heeft naar ${data.average} nummers geluisterd van ${data.name}`
		// 	})
		// 	})
		// }

		// const sorterenVanHoogNaarLaag = data => {
		// 	// Dit is een functie om de gemiddeldes op chronologische volgorde te zetten.
		// data.artists.artist.sort((a, b) => b.average - a.average) // ik zet b voor a, omdat ik het hoogste cijfer bovenaan de lijst wil hebben.
		// }

		// const dataPrintenNaarDeConsole = data => {
		// 	const artists = data.artists.artist.map(data => {
		// 		// De backticks maken het mogelijk om extra tekst aan de string toe te voegen
		// 		return `De gemiddelde ${data.name} luisteraar heeft naar ${data.average} nummers geluisterd van ${data.name}`
		// 	})
		// resolve(artists)
		// }
	})
}

export default dataOphalen
