/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },
    "apply numbering style to a non-autonumbered heading": function () {
      var bot = this.editorBot;
      var ed = this.editor;
      bot.setHtmlWithSelection("<h1>^foo</h1>");
      var name = "NumStyles";
      var styleCombo = ed.ui.get(name);
      assert.areSame(CKEDITOR.TRISTATE_OFF, styleCombo._.state, "check state OFF");

      bot.combo(name, function (combo) {
        assert.areSame(CKEDITOR.TRISTATE_ON, combo._.state, "check state ON when opened");
        combo.onClick("1. a. i. a. i.");
        assert.areSame(
            "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>",
            bot.htmlWithSelection(),
            "applied 1aiai to h1"
        );
      });
    }
  });
})();
