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
      editor.plugins.structuredheadings.currentScheme = "1.1.1.1.1.";
    },

    "two paragraphs, one triple clicked and made a heading": function () {
      var bot = this.editorBot;
      bot.editor.plugins.structuredheadings.currentScheme = "1. a. i. a. i.";
      // this is the odd selection that occurs if you
      // triple click "foo"
      bot.setHtmlWithSelection("[<p>foo</p><p>bar</p>]");


      bot.combo(comboName, function (combo) {
        // click h2
        combo.onClick("h2");
        // the new h2 has autonumbering set, since no prior heading exists
        // the double heading thing is a CKEditor feature/bug when
        // you select a P with triple click
        assert.areSame(
          "<h2 class=\"autonumber autonumber-1 autonumber-a\">foo</h2>" +
          "<h2 class=\"autonumber autonumber-1 autonumber-a\">bar</h2>",
          bot.getData(),
          "applied h2 and remains autonumbered"
        );
      });
    }
  });
})();
