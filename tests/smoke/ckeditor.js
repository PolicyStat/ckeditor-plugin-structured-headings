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

    "AutoNumber Active but Off Inside Header Tag": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("autoNumberHeading");

      assert.areSame(
        CKEDITOR.TRISTATE_OFF, testCommand.state,
        "autoNumberHeading OFF in H1"
      );

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
	"<h1 class=\"autonumber\">^Heading</h1>", updatedContent,
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
    },

    "MatchHeading Active and On Inside Header Tag": function () {
      this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
      var testCommand = this.editor.getCommand("matchHeading");

      assert.areSame(
        CKEDITOR.TRISTATE_ON, testCommand.state,
        "MatchHeading ON in H1"
      );

    },

    "MatchHeading Active and Off Inside P Tag": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      var testCommand = this.editor.getCommand("matchHeading");

      assert.areSame(
       CKEDITOR.TRISTATE_OFF, testCommand.state,
       "MatchHeading OFF in P"
      );

    },

    "MatchHeading Disabled Inside Span Tag": function () {
      this.editorBot.setHtmlWithSelection("<span>^Span</span>");
      var testCommand = this.editor.getCommand("matchHeading");

      assert.areSame(
       CKEDITOR.TRISTATE_DISABLED, testCommand.state,
       "MatchHeading DISABLED in SPAN"
      );

    },

    "MatchHeading Updates P Tag to H1 if No Previous": function () {
      this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h1>^Paragraph</h1>", updatedContent,
        "P changed to H1"
      );

    },

    "MatchHeading Updates P Tag to H3 if Previous": function () {
      this.editorBot.setHtmlWithSelection("<h3>Header</h3><p>^Paragraph</p>");
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h3>Header</h3><h3>^Paragraph</h3>", updatedContent,
        "P changed to previous H3"
      );

    },

    "MatchHeading Updates P Tag to H2 and Autonumbered if Previous": function () {
      this.editorBot.setHtmlWithSelection(
        "<h2 class=\"autonumber\">Header</h2>" +
        "<p>^Paragraph</p>"
      );
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h2 class=\"autonumber\">Header</h2>" +
        "<h2 class=\"autonumber\">^Paragraph</h2>", updatedContent,
        "P changed to previous H2 autonumber"
      );

    },

    "MatchHeading Does Not Match Previous if Different Parent": function () {
      this.editorBot.setHtmlWithSelection(
        "<h4>Header</h4>" +
        "<div><p>^Paragraph</p></div>"
      );
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h4>Header</h4>" +
        "<div><h1>^Paragraph</h1></div>", updatedContent,
        "P Only Matches Siblings"
      );

    }

  });
})();
