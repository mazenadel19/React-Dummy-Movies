import React, { useState } from 'react'

import MoviesList from './components/MoviesList'
import './App.css'

function App() {
	const [movies, setMovies] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	async function fetchMoviesHandler() {
		setError(null)
		setIsLoading(true)
		try {
			const response = await fetch('https://swapi.dev/api/films/')

			if (!response.ok) {
				throw new Error('something went wrong')
			}

			const data = await response.json()
			const transformedMovies = data.results.map(movieData => {
				return {
					id: movieData.episode_id,
					title: movieData.title,
					openingText: movieData.opening_crawl,
					releaseDate: movieData.release_date,
				}
			})

			setMovies(transformedMovies)
		} catch (error) {
			setError(error.message)
		}
		setIsLoading(false)
	}

	let content = <p>N0 M0V!3S F3TCHED Y3T</p>
	if (isLoading) content = <p>L0AD!NG</p>
	if (error) content = <p>{error}</p>
	if (movies.length > 0) content = <MoviesList movies={movies} />

	return (
		<React.Fragment>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>

			<section>{content}</section>
		</React.Fragment>
	)
}

export default App
