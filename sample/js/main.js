CKEDITOR.config.extraPlugins = 'structuredheadings';

var initSample = ( function() {

	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );
		CKEDITOR.replace( 'editor');
	};

})();

