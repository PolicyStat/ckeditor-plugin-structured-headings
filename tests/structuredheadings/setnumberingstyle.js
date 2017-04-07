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
      var initialHtmlWithSelection = "[<h1>foo</h1><h1>b]ar</h1>";
      var initialHtmlWithoutSelection = "<h1>foo</h1><h1>bar</h1>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>",
            bot.getData(),
            "applied 1aiai to both h1"
        );

        bot.execCommand("undo");

        // weird phantom p bug
        assert.areSame(
          initialHtmlWithoutSelection,
          bot.getData(),
          "undid the numbering style"
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
    },
    "apply numbering style to a paragraph, so it becomes a heading": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<p>^foo</p>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>",
            bot.htmlWithSelection(),
            "applied 1aiai to p, and it became an h1"
        );

        bot.execCommand("undo");

        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undid the numbering style"
        );
      });
    },
    "match the heading level when going paragraph -> numbered": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h2>foo</h2><p>bar</p><p>^baz</p>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");
        // this is an interesting case.  should the prior unnumbered heading be numbered?
        assert.areSame(
            "<h2>foo</h2>" +
            "<p>bar</p>" +
            "<h2 class=\"autonumber autonumber-1 autonumber-a\">^baz</h2>",
            bot.htmlWithSelection(),
            "applied 1aiai to p, and it became an h2 at the right level"
        );

        bot.execCommand("undo");

        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undid the numbering style"
        );
      });
    },
    "apply numbering style to a strong tag, so it becomes a heading": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<p><strong>^foo</strong></p>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick("1. a. i. a. i.");

        // yes, the strong tag doesn't get cleared even in the original behaviour
        // the heading style trumps it though
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\"><strong>^foo</strong></h1>",
            bot.htmlWithSelection(),
            "applied 1aiai to p, and it became an h1"
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
