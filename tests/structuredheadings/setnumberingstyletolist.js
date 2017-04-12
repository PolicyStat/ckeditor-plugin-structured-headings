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
    assertComboBeforeAfter: function (comboItem, beforeHtml, afterHtml, ignoreSelection) {
      var bot = this.editorBot;
      var initialHtmlWithSelection = beforeHtml;
      var htmlGetter;

      if (ignoreSelection) {
        htmlGetter = bot.getData;
      } else {
        htmlGetter = bot.htmlWithSelection();
      }

      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick(comboItem);

        assert.areSame(
          afterHtml,
          htmlGetter(),
          "applied " + comboItem + " to html"
        );

        bot.execCommand("undo");

        assert.areSame(
            initialHtmlWithSelection,
            htmlGetter(),
            "undid " + comboItem
        );
      });
    },
    "apply 1aiai style to a ordered list tag": function () {
      var comboItem = "1. a. i. a. i.";
      var beforeHtmlWithSelection = "<ol><li>^foo</li></ol>";
      var afterHtmlWithSelection = "<ol class=\"list-decimal\"><li>^foo</li></ol>";
      this.assertComboBeforeAfter(comboItem, beforeHtmlWithSelection, afterHtmlWithSelection);
    },
    "apply 1aiai style to a nested list tag": function () {
      var comboItem = "1. a. i. a. i.";
      var beforeHtmlWithSelection = "<ol><li>foo></li><li><ol><li>^bar</li></ol></li></ol>";
      var afterHtmlWithSelection = "<ol class=\"list-decimal\">" +
        "<li>foo</li>" +
        "<li><ol class=\"list-lower-alpha\"><li>^bar</li></ol>" +
        "</li></ol>";

      this.assertComboBeforeAfter(comboItem, beforeHtmlWithSelection, afterHtmlWithSelection);
    }
  });
})();
