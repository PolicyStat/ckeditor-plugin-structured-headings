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
          "<h2 class=\"autonumber autonumber-1\">Header</h2>" +
          "<p>^Paragraph</p>"
        );
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h2 class=\"autonumber autonumber-1\">Header</h2>" +
          "<h2 class=\"autonumber autonumber-1\">^Paragraph</h2>", updatedContent,
          "P changed to previous H2 autonumber"
        );

    },

    "MatchHeading Does Not Match Previous if Different Parent": function () {
      this.editorBot.setHtmlWithSelection(
          "<h4>Header</h4>" +
          "<div><h2>SubHeader</h2><p>^Paragraph</p></div>"
        );
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h4>Header</h4>" +
          "<div><h2>SubHeader</h2><h2>^Paragraph</h2></div>", updatedContent,
          "P Only Matches Siblings"
        );

    },

    "MatchHeading Updates Header Tag back to P": function () {
      this.editorBot.setHtmlWithSelection("<h6>^Header</h6>");
      this.editorBot.execCommand("matchHeading");
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<p>^Header</p>", updatedContent,
          "H6 changed back to P"
        );

    }

  });
})();
