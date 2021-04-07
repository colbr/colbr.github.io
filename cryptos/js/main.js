/*
 * @author Brett Collins
 * Gets values of cryptos from coingecko
 */

const [ portfolio, currency ] = dataFromUrl(window.location)
const coinsInPortfolio = portfolio?.map(c => c.name)

if(coinsInPortfolio && coinsInPortfolio.length) {
	var i = 0
	fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinsInPortfolio.join(',')}`)
	.then(response => response.json())
	.then(coins => {
		coins.forEach(coin => {
			coin.amount = portfolio.filter(p => p.name === coin.id)[0].amount
			if(++i === coinsInPortfolio.length) addToUI(coins)
		})
	})
}

function addToUI(coins) {
	// If this method is called, we have all the coin data and just need to render it
	const el = document.getElementById('coins')
	const p = document.createElement('p')
	coins.forEach(coin => {
		const c = document.createElement('div')

		const h = document.createElement('h1')
		h.appendChild(document.createTextNode(coin.symbol.toUpperCase()))
		c.append(h)

		const p = document.createElement('p')
		p.appendChild(document.createTextNode(`${coin.amount} ${coin.symbol.toUpperCase()} = ${coin.amount * coin.current_price} ${currency.toUpperCase()} [${coin.price_change_percentage_24h}%]`))
		c.append(p)

		el.append(c)
	})
	el.className = el.className.replace(/\bhidden\b/g, '')
	el.appendChild(p)
}

/*
 * Gets query parameters from URL
 * Returns object array of portfolio values, and string of currency ie usd (default), nzd
 */
function dataFromUrl(url) {
	var portfolio = [], currency = 'usd' // Default usd
	const stub = document.createElement('a')
	stub.href = url
	const strings = stub.search.substring(1).split('&')
	if(strings.length == 1 && !strings[0].length) return [ undefined, undefined ]
	strings.forEach(q => q.split('=')[0] === 'currency' ? currency = q.split('=')[1] : portfolio.push({ name: q.split('=')[0], amount: parseFloat(q.split('=')[1]) }))
	return [ portfolio, currency ]
}