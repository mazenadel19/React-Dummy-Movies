import React, { useCallback, useEffect, useState } from 'react'

import MoviesList from './components/MoviesList'
import './App.css'
import AddMovie from './components/AddMovie'

function App() {
	const [movies, setMovies] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	//used useCallback becase function are objects (non premitave type)
	// using them as dependancy for useEffect without  useCallback will cause an infinte loop
	const fetchMoviesHandler = useCallback(async () => {
		setError(null)
		setIsLoading(true)
		try {
			const response = await fetch(
				'https://react-dummy-movies-bf735-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
			)

			if (!response.ok) {
				throw new Error('something went wrong')
			}

			const data = await response.json()
			console.log(data)

			const loadedMovies = []

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate,
				})
			}
			setMovies(loadedMovies)
		} catch (error) {
			setError(error.message)
		}
		setIsLoading(false)
	}, [])

	// listed fetchMoviesHandler as a depndancy cuz (usually, but not in this case) we will be using some external state inside fetchMoviesHandler and we'd want to rerender this component if the state changes

	useEffect(() => {
		fetchMoviesHandler()
	}, [fetchMoviesHandler])

	async function addMovieHandler(movie) {
		console.log(movie)
		const response = await fetch(
			'https://react-dummy-movies-bf735-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
			{
				method: 'POST',
				body: JSON.stringify(movie), //convert javscript to json
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
		console.log(response)
		const data = await response.json()
		console.log(data)
	}

	let content = <p>N0 M0V!3S F3TCHED Y3T</p>
	if (isLoading) content = <p>L0AD!NG</p>
	if (error) content = <p>{error}</p>
	if (movies.length > 0) content = <MoviesList movies={movies} />

	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>

			<section>{content}</section>
		</React.Fragment>
	)
}

export default App
