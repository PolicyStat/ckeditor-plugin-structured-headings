/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "Restart OFF for H1": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("restartNumbering");

      assert.areSame(
            CKEDITOR.TRISTATE_OFF, testCommand.state,
            "Restart OFF for H1"
          );
    },

    "Restart DISABLED for H2": function () {
      this.editorBot.setHtmlWithSelection("<h2>^Heading</h2>");
      var testCommand = this.editor.getCommand("restartNumbering");

      assert.areSame(
          CKEDITOR.TRISTATE_DISABLED, testCommand.state,
          "Restart DISABLED for H2"
        );
    },

    "Restart ON for H1 with Restart Class": function () {
      this.editorBot.setHtmlWithSelection("<h1 class=\"autonumber-restart\">^Heading</h1>");
      var testCommand = this.editor.getCommand("restartNumbering");

      assert.areSame(
        CKEDITOR.TRISTATE_ON, testCommand.state,
        "Restart ON for H1 with Restart Class"
      );
    },

    "Add autonumber and restart class": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      this.editorBot.execCommand("restartNumbering");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h1 class=\"autonumber autonumber-restart\">^Heading</h1>", updatedContent,
        "Header Increased"
          );
    },

    "Remove only restart class": function () {
      this.editorBot.setHtmlWithSelection(
              "<h1 class=\"autonumber autonumber-restart\">^Heading</h1>");
      this.editorBot.execCommand("restartNumbering");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h1 class=\"autonumber\">^Heading</h1>", updatedContent,
          "Header Decreased"
            );
    }


  });
})();
