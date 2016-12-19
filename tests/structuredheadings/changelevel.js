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

    "Increase and Decrease Level Disabled on P": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      var testCommand = this.editor.getCommand("increaseHeadingLevel");

      assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "increaseHeaderLevel DISABLED in P"
          );

      testCommand = this.editor.getCommand("decreaseHeadingLevel");

      assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "decreaseHeaderLevel DISABLED in P"
          );

    },

    "Increase Level Disabled on H6": function () {
      this.editorBot.setHtmlWithSelection("<h6>^Heading</h6>");
      var testCommand = this.editor.getCommand("increaseHeadingLevel");

      assert.areSame(
          CKEDITOR.TRISTATE_DISABLED, testCommand.state,
          "increaseHeaderLevel DISABLED in H6"
        );

    },

    "Decrease Level Disabled on H1": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("decreaseHeadingLevel");

      assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "decreaseHeaderLevel DISABLED in H1"
          );

    },

    "Increase and Decrease Level Enabled on H3": function () {
      this.editorBot.setHtmlWithSelection("<h3>^Heading</h3>");
      var testCommand = this.editor.getCommand("decreaseHeadingLevel");

      assert.areSame(
              CKEDITOR.TRISTATE_OFF, testCommand.state,
              "decreaseHeaderLevel OFF in H3"
            );

      testCommand = this.editor.getCommand("increaseHeadingLevel");

      assert.areSame(
              CKEDITOR.TRISTATE_OFF, testCommand.state,
              "increaseHeaderLevel OFF in H3"
            );

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
      this.editorBot.setHtmlWithSelection("<h2 class=\"autonumber\">^Heading</h2>");
      this.editorBot.execCommand("increaseHeadingLevel");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h3 class=\"autonumber\">^Heading</h3>", updatedContent,
        "Header Increased with Numbering Intact"
          );
    },

    "Increase disabled if already at Previous + 1": function () {
      this.editorBot.setHtmlWithSelection("<h1>Previous</h1><h2>^Heading</h2>");
      var testCommand = this.editor.getCommand("increaseHeadingLevel");

      assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "increaseHeaderLevel DISABLED in previous +1"
          );
    }

  });
})();
