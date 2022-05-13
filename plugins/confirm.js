//26.10 лайфсайкл хуки onClose()
$.confirm = function(options) {
	return new Promise((resolve, reject) => {
		const modal	= $.modal({
			title: options.title,
			width: '550px',
			closable: false,
			onClose() {
				modal.destroy()
			},
			content: options.content,
			footerButtons: [
				{
					text: 'Cancel', 
					type: 'seondary',
					handler() { 
						modal.close()
						reject()
					}
				},
				{
					text: 'Yes', 
					type: 'danger',
					handler() { 
						modal.close()
						resolve()
					}
				}
			]
		})
		setTimeout(() => modal.open(), 100)
	})
}