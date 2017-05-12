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

    "Add autonumber and restart class": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      this.editorBot.execCommand("restartNumbering");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h1 class=\"autonumber autonumber-0 autonumber-restart\">^Heading</h1>", updatedContent,
        "Header Numbered and Restarted"
          );
    },

    "Remove only restart class": function () {
      this.editorBot.setHtmlWithSelection(
              "<h1 class=\"autonumber autonumber-0 autonumber-restart\">^Heading</h1>");
      this.editorBot.execCommand("restartNumbering");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h1 class=\"autonumber autonumber-0\">^Heading</h1>", updatedContent,
          "Header Decreased"
            );
    },

    "do not accidentally blow up existing numbering style": function () {
      this.editorBot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0 autonumber-N\">^Heading</h1>");
      this.editorBot.execCommand("restartNumbering");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h1 class=\"autonumber autonumber-0 autonumber-N autonumber-restart\">^Heading</h1>",
        updatedContent,
        "Header Numbered and Restarted"
      );
    }

  });
})();
