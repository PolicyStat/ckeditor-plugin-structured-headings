/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo */

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

    "if no headings in document, the new heading is autonumbered": function () {
      var bot = this.editorBot;
      var ed = this.editor;
      bot.setHtmlWithSelection("<p>^foo</p>");
      var formatCombo = ed.ui.get(comboName);
      assert.areSame(CKEDITOR.TRISTATE_OFF, formatCombo._.state, "check state OFF");

      bot.combo(comboName, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
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

    "if previous heading is autonumber, the new heading is autonumbered": function () {
      var bot = this.editorBot;
      var ed = this.editor;
      bot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0\">bar</h1><p>^foo</p>");
      var formatCombo = ed.ui.get(comboName);
      assert.areSame(CKEDITOR.TRISTATE_OFF, formatCombo._.state, "check state OFF");

      bot.combo(comboName, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
        // click h2
        combo.onClick("h2");
        // the new h2 has autonumbering set, at the next level from h1
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0\">bar</h1>" +
            "<h2 class=\"autonumber autonumber-1\">^foo</h2>",
            bot.htmlWithSelection(),
            "applied h2 block autonumber style"
        );
      });
    },


    "if previous heading is not autonumber, the new heading is not autonumbered": function () {
      var bot = this.editorBot;
      var ed = this.editor;
      bot.setHtmlWithSelection("<h2>bar</h2><p>^foo</p>");
      var formatCombo = ed.ui.get(comboName);

      assert.areSame(CKEDITOR.TRISTATE_OFF, formatCombo._.state, "check state OFF");

      bot.combo(comboName, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
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
      var ed = this.editor;
      bot.setHtmlWithSelection("<p>^foo</p>");
      var formatCombo = ed.ui.get(comboName);
      assert.areSame(CKEDITOR.TRISTATE_OFF, formatCombo._.state, "check state OFF");

      bot.combo(comboName, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
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
      var ed = this.editor;
      bot.setHtmlWithSelection("<h1 class=\"autonumber autonumber-0\">^foo</h1>");
      var formatCombo = ed.ui.get(comboName);
      assert.areSame(CKEDITOR.TRISTATE_OFF, formatCombo._.state, "check state OFF");

      bot.combo(comboName, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
        // click p
        combo.onClick("p");
        assert.areSame(
            "<p>^foo</p>",
            bot.htmlWithSelection(),
            "applied p to h1"
        );
      });
    }

  });
})();
