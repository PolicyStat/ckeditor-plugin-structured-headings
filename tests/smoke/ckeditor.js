/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings */

// Clean up all instances been created on the page.
(function () {
  var removeAllInstances = () => {
    var allInstances = CKEDITOR.instances;
    for (var i in allInstances) {
      CKEDITOR.remove(allInstances[i]);
    }
  };

  bender.test({
    setUp: () => {
      removeAllInstances();
    },

    "CKEditor Loads": () => {
      CKEDITOR.replace("editor1");
      assert.isObject(CKEDITOR.instances.editor1, "editor instance not found");
    },
    
    "Structured Headings Plugin Available": () => {
    	assert.isObject(CKEDITOR.plugins.get('structuredheadings'), "plugin not available");
    }
    
  });
})();
