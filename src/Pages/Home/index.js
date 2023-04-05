import { useAuth } from 'Contexts/auth'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import SearchList from './Components/SearchList'
import SearchResultList from './Components/SearchResultList'
import getData from 'Apis/searchApi'
import { MarginAuto } from 'Styles/common'

function HomePage() {
	const auth = useAuth()

	const recentSearchArray = auth.get() // 토큰을 이용한 최근검색어 관리

	const [searchInput, setSearchInput] = useState('') // 검색창에 있는 value 관리
	const [searchList, setSearchList] = useState([]) // 검색해서 나온 list관리

	const [searchResultList, setSearchResultList] = useState([]) // 검색해서 나온 list관리

	const [chooseInput, setChooseInput] = useState(-1) // 검색창에서 하이라이트의 대상이 될 인덱스번호를 기억할 state
	const [focusText, setFocusText] = useState('') // Focus된 텍스트

	const [showSearchList, setShowSearchList] = useState(true) // 검색창 활성화 관리

	// 키 입력
	const handleKeyPress = e => {
		// Enter 키 입력
		if (e.key === 'Enter') {
			// 검색중인 경우
			chooseInput >= 0 &&
				searchList.length &&
				setSearchInput(searchList[chooseInput])

			// 검색창이 빈 경우
			chooseInput >= 0 &&
				!searchList.length &&
				setSearchInput(recentSearchArray[chooseInput])

			onSubmitSearch()
			setChooseInput(-1)
			setShowSearchList(false)
			return
		}

		// Backspace 키 입력
		if (e.key === 'Backspace') {
			setChooseInput(-1)
		}

		// ⬆️키 입력
		if (e.key === 'ArrowUp') {
			console.log('키보드 ⬆️ 입력됨!')

			if (chooseInput < 0) {
				return
			}
			setChooseInput(prev => prev - 1)
		}

		// ⬇️키 입력
		if (e.key === 'ArrowDown') {
			console.log('키보드 ⬇️ 입력됨!')

			// 검색중인 경우
			if (searchList.length) {
				if (chooseInput > searchList.length - 2) {
					setChooseInput(0)
				} else {
					setChooseInput(prev => prev + 1)
				}
			} else if (recentSearchArray !== null && recentSearchArray.length) {
				// 검색창이 빈 경우
				if (chooseInput > recentSearchArray.length - 2) {
					setChooseInput(0)
				} else {
					setChooseInput(prev => prev + 1)
				}
			}
		}

		// 다른 (한글 혹은 영어)키 입력
		if (e.key === 'Process') {
			setChooseInput(-1)
		}

		setShowSearchList(true)
	}

	// 검색어 변경 핸들러
	const handleSearchTermChange = e => {
		const key = e.target.value
		setSearchInput(key)
	}

	// 검색어로 데이터 가져오기
	const onSubmitSearch = () => {
		if (focusText == '' && searchInput == '') {
			alert('검색어를 입력해주세요')
			return
		}

		getData(`${focusText || searchInput}`)
			.then(data => {
				setSearchResultList(data)
				setSearchList(data)
			})
			.catch(error => {
				console.log(error)
			})
		auth.search(`${focusText || searchInput}`)
	}

	// 검색어 부분 하이라이트 텍스트로 변경
	useEffect(() => {
		if (searchInput == '') {
			setFocusText(chooseInput >= 0 && recentSearchArray[chooseInput])
			return
		}
		if (searchList !== '검색 결과가 없습니다.') {
			setFocusText(chooseInput >= 0 && searchList[chooseInput])
		}
	}, [chooseInput])

	// console.log('searchInput : ' + searchInput)
	// console.log('focusText : ' + focusText)

	return (
		<div className="App">
			<Wrapper>
				<InputArea
					type="text"
					placeholder="검색어를 입력하세요"
					name="searchInput"
					value={focusText || searchInput}
					onChange={handleSearchTermChange}
					onKeyDown={handleKeyPress}
					autoComplete="off"
				/>
				<SearchList
					searchInput={searchInput}
					setSearchInput={setSearchInput}
					searchList={searchList}
					setSearchList={setSearchList}
					chooseInput={chooseInput}
					recentSearchArray={recentSearchArray}
					showSearchList={showSearchList}
					setSearchResultList={setSearchResultList}
					setShowSearchList={setShowSearchList}
				/>
				{searchResultList && (
					<SearchResultList
						searchResultList={searchResultList}
						chooseInput={chooseInput}
					/>
				)}
			</Wrapper>
		</div>
	)
}

export default HomePage

const Wrapper = styled.div`
	${MarginAuto}
`

const InputArea = styled.input`
	width: 100%;
	border: 0.1rem solid gray;
	border-radius: 1rem;
	height: 4rem;
	padding: 1rem;
	margin-bottom: 1rem;

	& + p {
		font-size: ${({ theme }) => theme.FONT_SIZE.small};
	}
`
