/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  var comboName = "NumFormats";

  bender.editor = {
    allowedForTests: "h1; h2; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    tearDown: function () {
      var editor = this.editorBot.editor;
      editor.plugins.structuredheadings.currentScheme = null;
    },

    "if no headings in document, the new heading is autonumbered": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<p>^foo</p>");

      bot.combo(comboName, function (combo) {
        // click h2
        combo.onClick("h2");
        // the new h2 has autonumbering set, since no prior heading exists
        assert.areSame(
            "<h2 class=\"autonumber autonumber-1\">^foo</h2>",
            bot.htmlWithSelection(),
            "applied h2 block autonumberstyle"
        );
      });
    },
    // eslint-disable-next-line max-len
    "when creating next level heading, the autonumbering and numbering scheme css of the next level is used": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      editor.plugins.structuredheadings.currentScheme = "1. a. i. a. i.";

      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1><p>^foo</p>"
      );

      bot.combo(comboName, function (combo) {
        // click h2
        combo.onClick("h2");
        // the new h2 has autonumbering set, at the next level from h1
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>" +
            "<h2 class=\"autonumber autonumber-1 autonumber-a\">^foo</h2>",
            bot.htmlWithSelection(),
            "applied h2 block autonumber style"
        );
      });
    },
    // eslint-disable-next-line max-len
    "when creating same level heading, the autonumbering and numbering scheme css of the current level is used": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      editor.plugins.structuredheadings.currentScheme = "1. a. i. a. i.";

      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1><p>baz</p><p>^foo</p>"
      );

      bot.combo(comboName, function (combo) {
        // click h1
        combo.onClick("h1");
        // the new h2 has autonumbering set, at the next level from h1
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">bar</h1>" +
            "<p>baz</p>" +
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>",
            bot.htmlWithSelection(),
            "applied h1 block autonumber style"
        );
      });
    },

    "if previous heading is not autonumber, the new heading is not autonumbered": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<h2>bar</h2><p>^foo</p>");

      bot.combo(comboName, function (combo) {
        // click h2
        combo.onClick("h2");
        // the new heading doesn't have autonumbering, since the prior heading did not
        assert.areSame(
            "<h2>bar</h2><h2>^foo</h2>",
            bot.htmlWithSelection(),
            "applied h2 block non-autonumbered style"
        );
      });
    },

    "p option no-ops": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<p>^foo</p>");

      bot.combo(comboName, function (combo) {
        // click p
        combo.onClick("p");
        assert.areSame(
            "<p>^foo</p>",
            bot.htmlWithSelection(),
            "applied p to p"
        );
      });
    },

    "p on autonumbered heading removes classes": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0\">^foo</h1>");

      bot.combo(comboName, function (combo) {
        // click p
        combo.onClick("p");
        assert.areSame(
            "<p>^foo</p>",
            bot.htmlWithSelection(),
            "applied p to h1"
        );
      });
    },

    "p on autonumbered heading in range removes classes": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection(
        "[<p>foo</p>" +
        "<h1 class=\"autonumber autonumber-0\">bar</h1>" +
        "<p>baz</p>]"
        );

      bot.combo(comboName, function (combo) {
        // click p
        combo.onClick("p");
        assert.areSame(
            "<p>foo</p><p>bar</p><p>baz</p>",
            bot.getData(),
            "applied p to h1 and it is classless"
        );
      });
    },

    "pre option on a p": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<p>^foo</p>");

      bot.combo(comboName, function (combo) {
        // click pre
        combo.onClick("pre");
        assert.areSame(
            "<pre>^foo</pre>",
            bot.htmlWithSelection(),
            "applied pre to p"
        );
      });
    },

    "pre on autonumbered heading removes autonumbering classes": function () {
      var bot = this.editorBot;
      bot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0\">^foo</h1>");

      bot.combo(comboName, function (combo) {
        // click pre
        combo.onClick("pre");
        assert.areSame(
            "<pre>^foo</pre>",
            bot.htmlWithSelection(),
            "applied pre to h1"
        );
      });
    },

    "autonumbered heading is undoable": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<p>^foo</p>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        // click h2
        combo.onClick("h2");
        // the new h2 has autonumbering set, since no prior heading exists
        assert.areSame(
            "<h2 class=\"autonumber autonumber-1\">^foo</h2>",
            bot.htmlWithSelection(),
            "applied h2 block autonumberstyle"
        );

        bot.execCommand("undo");
        assert.areSame(
            initialHtmlWithSelection,
            bot.htmlWithSelection(),
            "undid the heading"
        );
      });
    },

    "pre is undoable": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h1 class=\"autonumber autonumber-0\">^foo</h1>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        // click pre
        combo.onClick("pre");
        assert.areSame(
            "<pre>^foo</pre>",
            bot.htmlWithSelection(),
            "applied pre to h1"
        );

        bot.execCommand("undo");
        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undid the pre"
        );
      });
    },

    "p on autonumbered heading is undoable": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h1 class=\"autonumber autonumber-0\">^foo</h1>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        // click p
        combo.onClick("p");
        assert.areSame(
            "<p>^foo</p>",
            bot.htmlWithSelection(),
            "applied p to h1"
        );

        bot.execCommand("undo");

        assert.areSame(
          initialHtmlWithSelection,
          bot.htmlWithSelection(),
          "undid the p"
        );
      });
    }

  });
})();
