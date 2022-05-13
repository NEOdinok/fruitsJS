let fruits = [
	{id: 1, title: 'Dragon fruit', price: 5, imgLink: 'https://produits.bienmanger.com/38126-0w470h470_Red_Dragon_Fruit.jpg'},
	{id: 2, title: 'Passion fruit', price: 4, imgLink: 'https://leprimeurduchef.com/260-large_default/fruit-of-passion.jpg'},
	{id: 3, title: 'Lychee', price: 3.5, imgLink: 'https://cdn.britannica.com/18/176518-050-5AB1E61D/lychee-fruits-Southeast-Asia.jpg'}
]

const toHtml = fruit => `
	<div class="col">
		<div class="card" style="width: 18rem;">
			<img class="card-img-top" style="height: 300px" src="${fruit.imgLink}" alt="${fruit.title}">
			<div class="card-body">
				<h5 class="card-title">${fruit.title}</h5>
				<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
				<a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Show price</a> 
				<a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">delete</a>
			</div>
		</div>
	</div>
`

function render() {
	const html = fruits.map(toHtml).join('') // fruit => toHtml(fruit) == toHtml
	document.querySelector('[data-fruits]').innerHTML = html
}
render()

//тут используем modal() благодаря modal.js
//тут мы просто после загрузки файла вызываем эту функцию чтоб был объект modal 
const priceModal = $.modal({
	title: 'Price of the fruit',
	closable: true,
	width: '550px',
	footerButtons: [
		{
			text: 'close', 
			type: 'primary',
			handler() { 
				priceModal.close()
			}
		}
	]
})

/* удаляем вот это и делаем новый плагин для confirm
const confirmModal = $.modal({
	title: 'Are you sure?',
	closable: true,
	width: '550px',
	footerButtons: [
		{
			text: 'Cancel', 
			type: 'primary',
			handler() { 
				confirmModal.close()
			}
		},
		{
			text: 'Yes', 
			type: 'secondary',
			handler() { 
				confirmModal.close()
			}
		}
	]
})
*/

document.addEventListener('click',	event => {
	event.preventDefault()// убирает дефолтное поведение в виде хэша в адресной строке
	const btnType = event.target.dataset.btn
	const id = +event.target.dataset.id// плюсик преобразует строку к числу
	const fruit = fruits.find(f => f.id === id)

	if (btnType === 'price') {
		priceModal.setContent(`
			<p>Price on ${fruit.title}: <strong>${fruit.price}$</strong></p>
		`)
		priceModal.open()
	} else if (btnType === 'remove') {
		$.confirm({
			title: 'Are you sure ?',
			content: `<p>Yo, you really want to delete <strong>${fruit.title}</strong> ?</p>`
		}).then(() => {
			console.log('yeah, delete it')
			fruits = fruits.filter(f => f.id !== id)
			render()
		}).catch(() => {
			console.log('cancel')
		})
	}
})