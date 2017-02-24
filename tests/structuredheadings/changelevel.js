/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "Increase H1 to H2": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      this.editorBot.execCommand("increaseHeadingLevel");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h2>^Heading</h2>", updatedContent,
        "Header Increased"
          );
    },

    "Decrease H2 to H1": function () {
      this.editorBot.setHtmlWithSelection("<h2>^Heading</h2>");
      this.editorBot.execCommand("decreaseHeadingLevel");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h1>^Heading</h1>", updatedContent,
          "Header Decreased"
            );
    },

    "Increase doesn't affect numbering": function () {
      this.editorBot.setHtmlWithSelection("<h2 class=\"autonumber autonumber-2\">^Heading</h2>");
      this.editorBot.execCommand("increaseHeadingLevel");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h3 class=\"autonumber autonumber-2\">^Heading</h3>", updatedContent,
        "Header Increased with Numbering Intact"
          );
    }

  });
})();
