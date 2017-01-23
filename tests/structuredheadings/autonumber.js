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

    "AutoNumber Active but Off Inside Header Tag": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
          CKEDITOR.TRISTATE_OFF, testCommand.state,
          "autoNumberHeading OFF in H1"
        );

    },

    "AutoNumber Inactive in excluded Header Tag": function () {
      var testCommand = this.editor.getCommand("autoNumberHeading");
      var previousElements = this.editor.config.numberedElements;
      this.editor.config.numberedElements = ["h2", "h3"];
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");

      assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "autoNumberHeading DISABLED in excluded H1"
          );
      this.editor.config.numberedElements = previousElements;

    },

    "AutoNumber Active and On Inside AutoNumbered Header": function () {
      this.editorBot.setHtmlWithSelection("<h1 class='autonumber'>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
          CKEDITOR.TRISTATE_ON, testCommand.state,
          "autoNumberHeading ON in H1"
        );

    },

    "AutoNumber Disabled Outside Header": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
          CKEDITOR.TRISTATE_DISABLED, testCommand.state,
          "autoNumberHeading DISABLEd in P"
        );

    },

    "AutoNumber Adds Class, Sets State On": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");
      this.editorBot.execCommand("autoNumberHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
      "<h1 class=\"autonumber autonumber-0\">^Heading</h1>", updatedContent,
      "CSS class applied"
        );
      assert.areSame(
      CKEDITOR.TRISTATE_ON, testCommand.state,
      "autoNumberHeading ON"
        );
    },

    "AutoNumber Removes Class, Sets State Off": function () {
      this.editorBot.setHtmlWithSelection("<h1 class='autonumber'>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");
      this.editorBot.execCommand("autoNumberHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
            "<h1>^Heading</h1>", updatedContent,
            "CSS class removed"
          );
      assert.areSame(
            CKEDITOR.TRISTATE_OFF, testCommand.state,
            "autoNumberHeading OFF"
          );
    }

  });
})();
