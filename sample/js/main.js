CKEDITOR.config.extraPlugins = 'structuredheadings';
CKEDITOR.config.contentsCss = './css/numbering.css';
CKEDITOR.config.allowedContent = true;

var initSample = ( function() {

	var isStructuredHeadingsAvailable = () => {
		return !!CKEDITOR.plugins.get('structuredheadings');
	};

	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );
		CKEDITOR.replace( 'editor');
	};

})();

