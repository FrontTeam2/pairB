import { useEffect, useState } from 'react'

function useDebouncing(searchInput, { setSearchList }) {
	const [isDebounce, setIsDebounce] = useState()

	useEffect(() => {
		const handler = setTimeout(() => {
			if (searchInput === '') {
				setSearchList([])
				return
			}
			setIsDebounce(searchInput)
		}, 500)

		return () => {
			clearTimeout(handler)
		}
	}, [searchInput])

	return isDebounce
}

export default useDebouncing
