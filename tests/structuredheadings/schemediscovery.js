/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; h3; h4; h5; p"
  };

  function getDetectedScheme(editor) {
    return editor.plugins.structuredheadings.getCurrentScheme();
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    tearDown: function () {
      // reset the plugin between tests
      var editor = this.editorBot.editor;
      editor.plugins.structuredheadings.currentScheme = "1.1.1.1.1.";
    },

    "default is numbered": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0\">^foo</h1>" +
        "<h2 class=\"autonumber autonumber-1\">bar</h2>"
      );

      assert.areEqual(
        "1.1.1.1.1.",
        getDetectedScheme(editor)
      );
    },

    "invalid combos return numbered": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-a\">^foo</h1>" +
        "<h2 class=\"autonumber autonumber-1 autonumber-N\">bar</h2>"
      );

      assert.areEqual(
        "1.1.1.1.1.",
        getDetectedScheme(editor)
      );
    },

    "can detect based off of one level": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>"
      );

      assert.areEqual(
        "1. a. i. a. i.",
        getDetectedScheme(editor)
      );
    }


  });
})();
