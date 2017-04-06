/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  var comboName = "NumStyles";

  bender.editor = {
    allowedForTests: "h1; h2; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },
    "apply numbering style to a non-autonumbered heading": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<h1>^foo</h1>");

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>",
            bot.htmlWithSelection(),
            "applied 1aiai to h1"
        );
      });
    },
    "apply numbering style to multiple non-autonumbered h1": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("[<h1>foo</h1><h1>bar</h1>]");

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>",
            bot.getData(),
            "applied 1aiai to both h1"
        );
      });
    },
    "apply numbering style to multiple non-autonumbered h1 using a partial selection": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("[<h1>foo</h1><h1>b]ar</h1>");

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>",
            bot.getData(),
            "applied 1aiai to both h1"
        );
      });
    },
    "attempt to apply numbering style to a range containing non-headings": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("[<h1>foo</h1><p>bar</p><h1>baz]</h1>");

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
            "<p>bar</p>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">baz</h1>",
            bot.getData(),
            "applied 1aiai to both h1 and p is intact"
        );
      });
    },
    "preserves existing autonumbered headings in a mix": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection(
        "[<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1><h1>bar]</h1>"
      );

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>",
            bot.getData(),
            "applied 1aiai to second h1 and first h1 is intact"
        );
      });
    },
    "don't blow up on null selection": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<h1>foo</h1>");
      bot.editor.getSelection().removeAllRanges();

      bot.combo(comboName, function () {
        // we don't need to do something here
        // this is sufficient to crash it
        assert.isTrue(true);
      });
    },
    "undo applying numbering style to a non-autonumbered heading": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h1>^foo</h1>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>",
            bot.htmlWithSelection(),
            "applied 1aiai to h1"
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
