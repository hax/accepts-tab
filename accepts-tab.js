void function (d) {

	function isEditable(e) {
		return e.isContentEditable
			|| e.matches('textarea')
			|| e.matches('input') && e.type === 'text'
	}

	function acceptsTab(e) {
		return e.matches('.accepts-tab, .accepts-tab *')
	}

	function notShortcut(e) {
		return !e.altKey && !e.ctrlKey && !e.metaKey

			// modifiers below are rarely supported or have been deprecated,
			// listed here just for clarity

			// && !e.getModifierState('Fn') && !e.getModifierState('FnLock')
			// && !e.getModifierState('Hyper') && !e.getModifierState('Super')
			// && !e.getModifierState('OS') && !e.getModifierState('Win')
			// && !e.getModifierState("Accel")

			// allowlist: Shift, CapsLock, NumLock, ScrollLock, AltGraph, Symbol, SymbolLock
	}

	window.addEventListener('keydown', e => {
		const c = e.target

		if (acceptsTab(c) && isEditable(c)
			&& e.key === 'Tab' && !e.isComposing && notShortcut(e)
		) {
			e.preventDefault()
			e.stopImmediatePropagation()

			if (!e.shiftKey) {
				// prefer execCommand which support undo and sending input events
				// see https://github.com/w3c/editing/issues/160
				// and https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
				if (document.queryCommandEnabled('insertText')) {
					d('execCommand insertText')
					document.execCommand('insertText', false, '\t')
				} else if (e.target.setRangeText) {
					// only FF will go to this branch
					// undo is broken, no workaround
					d('setRangeText')
					const c = e.target
					c.setRangeText('\t', c.selectionStart, c.selectionEnd, 'end')
					// trigger input event manually, though not very useful
					// not trigger beforeinput event because Chrome execCommand also
					// only trigger input event, not sure it's a bug or feature
					c.dispatchEvent(
						new InputEvent('input', {inputType: 'insertText', data: '\t'}))
				} else {
					d('can not insert tab for non-editable element', e.target)
				}
			}
		}
	}, {capture: true})

}(console.log)
