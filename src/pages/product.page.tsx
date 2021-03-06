import React from 'react'
import { match } from 'react-router'
import styled, { css } from 'styled-components'
import { getProductById } from '../api/api'
import { useCart } from '../cart/cart.context'
import { OptionsSelector } from '../components/options-selector'
import { useFetch } from '../fetch.hook'

type Props = {
	match: match<{ id: string }>
}

export default function ProductPage({ match }: Props) {
	const productId = match.params.id
	const fetchFn = React.useCallback(() => getProductById(Number(productId)), [
		productId,
	])
	const { data: product, error } = useFetch(undefined, fetchFn)
	const [adding, setAdding] = React.useState(false)
	const { addToCart } = useCart()
	const [selectedOptions, setSelectedOptions] = React.useState({
		color: 0,
		subOption: 0,
	})

	React.useEffect(() => {
		const timer = setTimeout(() => setAdding(false), Math.random() * 800 + 700)
		return () => clearTimeout(timer)
	}, [adding])

	if (error) return <div>Could not find product with id "{productId}".</div>
	if (!product) return <div>Loading item...</div>

	return (
		<Wrapper>
			<h2>{product.name}</h2>
			<h3>{product.price} kr</h3>
			Manufacturer: {product.brand}
			<br />
			Weight: {product.weight} kg
			<OptionsSelector
				options={product.options}
				selected={selectedOptions}
				onChange={options =>
					setSelectedOptions(previousOptions => ({
						...previousOptions,
						...options,
					}))
				}
			/>
			<AddToCart
				onClick={() => {
					setAdding(true)
					addToCart({ product, ...selectedOptions })
				}}
				disabled={!product.available || adding}
			>
				{adding && 'Adding to cart...'}
				{!adding &&
					(product.available ? 'In stock, buy now! 👍' : 'No stock left 👎')}
			</AddToCart>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 500px;
	margin: 0 auto;
	padding: 16px;
	box-shadow: 1px 1px 3px #ddd;
`

const disabledStyle = css`
	background-color: #eee;
	color: #666;
`

const enabledStyle = css`
	background-color: green;
	color: white;
	cursor: pointer;
`

const AddToCart = styled.button`
	height: 50px;
	width: 150px;
	align-self: flex-end;

	font-weight: bold;
	border: none;

	${props => (props.disabled ? disabledStyle : enabledStyle)};
`
