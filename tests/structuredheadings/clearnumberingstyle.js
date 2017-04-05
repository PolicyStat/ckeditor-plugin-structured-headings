/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */

// Clean up all instances been created on the page.
(function () {

  var comboName = "NumStyles";
  var itemName = "clear";

  bender.editor = {
    allowedForTests: "h1; h2; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },
    "clear numbering style to a single autonumbered heading": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick(itemName);
        assert.areSame(
            "<h1>^foo</h1>",
            bot.htmlWithSelection(),
            "cleared styling from h1"
        );

        bot.execCommand("undo");

        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undo the dropdown"
        );
      });
    },
    "clear numbering style to multiple autonumbered h1": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "[<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
        "<p>bar</p>" +
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">baz</h1>]";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick(itemName);
        assert.areSame(
            "<h1>foo</h1><p>bar</p><h1>baz</h1>",
            bot.getData(),
            "cleared styling from headings"
        );

        bot.execCommand("undo");
        // this is weird, but the selection API returns the extra (internal) paragraphs
        // that are created to normalize the selection here
        assert.areSame(
          initialHtmlWithSelection.substring(1, initialHtmlWithSelection.length - 1),
          bot.getData(),
          "undo the dropdown"
        );
      });
    },
    "clear numbering style no-op on plain heading": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection(
        "<h1>^foo</h1>"
      );

      bot.combo(comboName, function (combo) {
        combo.onClick(itemName);
        assert.areSame(
            "<h1>^foo</h1>",
            bot.htmlWithSelection(),
            "didn't do anything"
        );
      });
    }
  });
})();
