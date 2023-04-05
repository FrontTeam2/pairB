import getData from 'Apis/searchApi'
import { useAuth } from 'Contexts/auth'
import useDebouncing from 'Hooks/useDebouncing'
import { useEffect } from 'react'
import styled from 'styled-components'

const maxSearchList = 5

function SearchList({
	searchInput,
	setSearchInput,
	searchList,
	setSearchList,
	chooseInput,
	recentSearchArray,
	showSearchList,
	setSearchResultList,
	setShowSearchList,
}) {
	const auth = useAuth()
	const debounce = useDebouncing(searchInput, { setSearchList })

	// 디바운스 적용
	// searchInput값이 바뀔 때마다 안에 정의 실행
	useEffect(() => {
		getData(`${debounce}`)
			.then(data => {
				if (typeof data !== 'string') {
					return setSearchList(data.slice(0, maxSearchList))
				}
				setSearchList(data)
			})
			.catch(error => {
				console.log(error)
			})
	}, [debounce])

	// 클릭으로 데이터 가져오기
	function onClickSearch(value) {
		console.log('클릭됨!')
		getData(value)
			.then(data => {
				setSearchResultList(data)
				setSearchList([])
			})
			.catch(error => {
				console.log(error)
			})
		auth.search(value)
		setSearchInput(value)
		setShowSearchList(false)
	}

	if (searchList == '검색 결과가 없습니다.') {
		return (
			<>
				<p>{searchList}</p>
			</>
		)
	}

	return (
		<ResultWrapper>
			{searchInput == '' ? (
				<>
					<h4>최근 검색어</h4>

					{recentSearchArray ? (
						<>
							{recentSearchArray.map((item, index) => (
								<ResultBox key={item} onClick={() => onClickSearch(item)}>
									{index === chooseInput ? (
										<h3 style={{ backgroundColor: 'pink' }}>{item}</h3>
									) : (
										<p>{item}</p>
									)}
								</ResultBox>
							))}
						</>
					) : (
						<>
							<p>최근 검색어가 없습니다.</p>
						</>
					)}
				</>
			) : (
				<>
					{showSearchList && (
						<>
							{searchList.map((item, index) => (
								<ResultBox key={index} onClick={() => onClickSearch(item)}>
									{index === chooseInput ? (
										<h4 style={{ backgroundColor: '#f7f7f7' }}>
											{item.includes(searchInput) ? (
												<>
													{item.split(searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{searchInput}
													</span>
													{item.split(searchInput)[1]}
												</>
											) : (
												item
											)}
										</h4>
									) : (
										<p>
											{item.includes(searchInput) ? (
												<>
													{item.split(searchInput)[0]}
													<span style={{ color: '#ff0000' }}>
														{searchInput}
													</span>
													{item.split(searchInput)[1]}
												</>
											) : (
												item
											)}
										</p>
									)}
								</ResultBox>
							))}
						</>
					)}
				</>
			)}
		</ResultWrapper>
	)
}
export default SearchList

const ResultWrapper = styled.div`
	padding: 2rem;

	& > h4 {
		margin-bottom: 1rem;
	}
`

const ResultBox = styled.div`
	:hover {
		cursor: pointer;
		background-color: #f7f7f7;
		/* font-size: large; */
	}

	& p {
		font-size: ${({ theme }) => theme.FONT_SIZE.small};
	}
`
