void function () {

	const eventTypes = [
		'keydown', 'keyup', 'keypress',
		'input', 'beforeinput',
		'compositionstart', 'compositionend',
		'textupdate', 'textformatupdate',
	]
	const opt = {capture: true, passive: true}

	for (const type of eventTypes) {
		window.addEventListener(type, log, opt)
	}

	function log(e) {
		const a = []
		a.push(e.type + (e.isTrusted ? '' : '!'))
		if (e.isComposing) a.push('composing')
		if ('key' in e) { // KeyboardEvent
			a.push(e.key + loc(e.location))
			a.push(e.code)
		} else if ('inputType' in e) { // InputEvent
			a.push(e.inputType, e.data)
		} else if ('data' in e) { // CompositionEvent
			a.push(e.data, e.locale)
		} else {
			a.push(e)
		}
		if (e.getModifierState) {
			for (const k of modifierKeys) {
				if (e.getModifierState(k)) a.push(k)
			}
		}
		console.log(...a)
	}

	const modifierKeys = [
		'Alt', 'AltGraph',
		'Shift', 'CapsLock',
		'Control',
		'Meta',
		'Fn', 'FnLock',
		'Hyper', 'Super',
		'NumLock', 'ScrollLock',
		'Symbol', 'SymbolLock',
		'OS', 'Win',
		'Accel',
	]

	function loc(v) {
		switch (v) {
			case 0: return ''
			case 1: return '@Left'
			case 2: return '@Right'
			case 3: return '@Numpad'
			default: throw new TypeError()
		}
	}

}()
