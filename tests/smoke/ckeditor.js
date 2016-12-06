/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "CKEditor Loads": function () {
      CKEDITOR.replace("editor1");
      assert.isObject(CKEDITOR.instances.editor1, "editor instance not found");
    },

    "Structured Headings Plugin Available": function () {
      assert.isObject(CKEDITOR.plugins.get("structuredheadings"), "plugin not available");
    },

    "Command Active but Off Inside Header Tag": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
        CKEDITOR.TRISTATE_OFF, testCommand.state,
        "autoNumberHeading OFF in H1"
      );

    },

    "Command Active and On Inside AutoNumbered Header": function () {
      this.editorBot.setHtmlWithSelection("<h1 class='autonumber'>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
        CKEDITOR.TRISTATE_ON, testCommand.state,
        "autoNumberHeading ON in H1"
      );

    },

    "Command Disabled Outside Header": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
        CKEDITOR.TRISTATE_DISABLED, testCommand.state,
        "autoNumberHeading DISABLEd in P"
      );

    },

    "Command Adds Class, Sets State On": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");
      this.editorBot.execCommand("autoNumberHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
	"<h1 class=\"autonumber\">^Heading</h1>", updatedContent,
	"CSS class applied"
      );
      assert.areSame(
	CKEDITOR.TRISTATE_ON, testCommand.state,
	"autoNumberHeading ON"
      );
    },

    "Command Removes Class, Sets State Off": function () {
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
