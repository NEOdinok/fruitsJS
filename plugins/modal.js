Element.prototype.appendAfter = function(element) {
	element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
	if (buttons.length === 0) {
		return document.createElement('div')
	}
	const wrap = document.createElement('div') 
	wrap.classList.add('modal-footer')

	buttons.forEach(btn => {
		const $btn = document.createElement('button')
		$btn.textContent = btn.text
		$btn.classList.add(`btn-${btn.type || 'secondary'}`)
		$btn.onclick = btn.handler || noop

		wrap.appendChild($btn)
	})

	return wrap
}

//это не внутри нашей функции, а доступно глобальному объекту window
//_ в названии значит она приватная и не должна быть вызвана отдельно
function _createModal(options) {
	const DEFAULT_WIDTH = '600px'
	const modal = document.createElement('div')
	modal.classList.add('gmodal')
	//создаем хтмб, но пока не помещаем его никуда у дом-дерево
	modal.insertAdjacentHTML('afterbegin', `
		<div class="modal-overlay" data-close="true">
			<div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
				<div class="modal-header">
					<span class="modal-title">${options.title || 'Default title'}</span>
					    ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
				</div>
				<div class="modal-body" data-content>
					${options.content || ''}
				</div>
			</div>
		</div>
	`)
	const footer = _createModalFooter(options.footerButtons)
	footer.appendAfter(modal.querySelector('[data-content]'))
	//вставляем modal в дом-дерево
	document.body.appendChild(modal)
	//возвращаем инстанс

	return modal
}


//тут имеем доступ до $ благодаря base.js
//поитогу хотим подключить инстанс данного окна, с которым можно делать хуйню
$.modal = function(options) {
	const ANIMATION_SPEED = 200
	const $modal = _createModal(options)
	let closing = false 
	let destroyed = false


	//вместо того чтобы возвращять все эти методы в return мы просто делам
	//возвращаем мы его плюс другие методы
	const modal = {
		open() {
			if (destroyed) {
				return console.log('gmodal is destroyed')
			} else {
				//если closing = false то есть не закрываем то выполняем что справа
				!closing && $modal.classList.add('open')
				//обращаемся к инстансу $modal тк это элемент с классом vmodal
			}
		},
		close() {
			closing = true
			$modal.classList.remove('open')
			$modal.classList.add('hide')
			setTimeout(() => {
				$modal.classList.remove('hide')
				closing = false
				if (typeof (options.onClose) === 'function') {
					options.onClose()
				}
			}, ANIMATION_SPEED)
		}
	}

	const listener = event => {
		if (event.target.dataset.close) {
			modal.close()
		}
	}
	$modal.addEventListener('click', listener)

	//возвращаем объект, в котором все методы modal и еще те, что мы добавляем тут
	return Object.assign(modal, {
		destroy() {
			//удаляем ноду из дом-дерева
			$modal.parentNode.removeChild($modal)
			$modal.removeEventListener('click', listener)
			destroyed = true
		},
		setContent(html) {
			$modal.querySelector('[data-content]').innerHTML = html
		}
	})
}

/* DZ
1. Динамически на основе массива данных выводить карточки +
2. модалка с ценой +
3. модалка при нажатии на удаление товара (да / отмена)

*4. удалять карточку по кнопке "да"
на основее $.modal сделать планин $.confirm
--------------------------------
1. +
2. чтобы вызвать модалку с ценой нужно передавать функции _createModal массив
с фруктами ?

*/
