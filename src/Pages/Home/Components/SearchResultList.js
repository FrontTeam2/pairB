import styled from 'styled-components'

function SearchResultList({ searchResultList }) {
	if (searchResultList == '검색 결과가 없습니다.' || !searchResultList.length) {
		return
	}

	return (
		<ResultList>
			{searchResultList.length ? (
				<>
					<h4>검색해서 나온 리스트</h4>
					{searchResultList.map((result, index) => (
						<p key={index}>{result}</p>
					))}
				</>
			) : (
				<></>
			)}
		</ResultList>
	)
}
export default SearchResultList

const ResultList = styled.div`
	background-color: var(--color--white);
	border-top: 0.2rem solid gray;

	padding: 2rem;

	& > h4 {
		margin-bottom: 1rem;
	}

	& > p {
		font-size: ${({ theme }) => theme.FONT_SIZE.small};
	}
`
