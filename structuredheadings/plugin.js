(function () {
	CKEDITOR.plugins.add('structuredheadings', {
		icons: 'structuredheadings',
		init: (editor) => {
			// The command to add an autonumbering class
			editor.addCommand('autoNumberHeading', {
				exec: (editor) => {
					/* Get all header elements and assign classes
					 * only if needed
					 */
					assignClassToList(editor.document.find('h1'));
					assignClassToList(editor.document.find('h2'));
					assignClassToList(editor.document.find('h3'));
				}
			});
			
			// Adding the button to the toolbar
			editor.ui.addButton( 'structuredheadings', {
				label: 'Autonumber Heading',
				command: 'autoNumberHeading',
				toolbar: 'styles,0'
			})
			return editor; // actually, no return is required, but this shuts eslint up
		}
	});
	
	function assignClassToList(list) {
		// Iterate over the list of nodes
		for (var i = 0; i < list.count(); i++) {
			var h = list.getItem(i);
			// Add the class if it doesn't have it
			if(!h.hasClass('autonumber')) {
				h.addClass('autonumber');
			}
		};
	}
})();
