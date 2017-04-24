/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; h3; h4; h5; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    tearDown: function () {
      // reset the plugin between tests
      var editor = this.editorBot.editor;
      editor.plugins.structuredheadings.currentPreset = null;
    }

  });
})();
