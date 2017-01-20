/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; h3; h4; h5; h6; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "selectStyle button enabled": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      var testCommand = this.editor.getCommand("selectStyle");

      assert.areSame(
            CKEDITOR.TRISTATE_OFF, testCommand.state,
            "selectStyle OFF"
          );

    },

    "Style applied": function () {
      this.editorBot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0\">^Heading</h1>");
      this.editorBot.execCommand("setCurrentStyle", "Letter Lowercase Roman");
      this.editorBot.execCommand("reapplyStyle");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h1 class=\"autonumber autonumber-0 autonumber-A\">^Heading</h1>", updatedContent,
        "Header Style Applied"
          );
    },

    "Style removed": function () {
      this.editorBot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-A\">^Heading</h1>");
      this.editorBot.execCommand("setCurrentStyle", null);
      this.editorBot.execCommand("reapplyStyle");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h1 class=\"autonumber\">^Heading</h1>", updatedContent,
          "Header Style Removed"
            );
    }

  });
})();
