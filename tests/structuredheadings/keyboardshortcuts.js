/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; h3"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "H2 to H3 from Tab": function () {
      this.editorBot.setHtmlWithSelection("<h2>^Heading</h2>");
      this.editor.fire('key', { keyCode: 9 });
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);
      
      assert.areSame(
        "<h3>^Heading</h3>", updatedContent,
        "Header increased from TAB"
      );
    },
    
    "H2 to H1 from Shift-Tab": function () {
        this.editorBot.setHtmlWithSelection("<h2>^Heading</h2>");
        this.editor.fire('key', { keyCode: CKEDITOR.SHIFT + 9 });
        var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);
        
        assert.areSame(
          "<h1>^Heading</h1>", updatedContent,
          "Header increased from Shift-TAB"
        );
      }
    
  });
})();
