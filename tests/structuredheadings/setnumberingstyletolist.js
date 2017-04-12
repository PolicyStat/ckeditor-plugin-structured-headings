/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  var comboName = "NumStyles";

  bender.editor = {
    allowedForTests: "h1; h2; p; ol; li; ul;"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },
    "apply 1aiai style to a ordered list tag": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<ol><li>^foo</li></ol>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");

        assert.areSame(
            "<ol class=\"list-decimal\"><li>^foo</li></ol>",
            bot.htmlWithSelection(),
            "applied 1aiai to ordered list, and first level got the decimal class"
        );

        bot.execCommand("undo");

        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undid the numbering style"
        );
      });
    }
  });
})();
