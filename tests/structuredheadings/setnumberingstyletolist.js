/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo,list,indentlist */
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
    assertComboBeforeAfter: function (opts) {
      var bot = this.editorBot;
      // i wish we had ES6

      var initialHtmlWithSelection = opts.beforeHtml || "";
      var comboItem = opts.comboItem || "1. a. i. a. i.";
      var htmlGetter;
      var skipUndo = opts.skipUndo || false;

      if (opts.ignoreSelection) {
        htmlGetter = bot.getData.bind(bot);
      } else {
        htmlGetter = bot.htmlWithSelection.bind(bot);
      }

      bot.setHtmlWithSelection(initialHtmlWithSelection);

      bot.combo(comboName, function (combo) {
        combo.onClick(comboItem);

        assert.areSame(
          opts.afterHtml,
          htmlGetter(),
          "applied " + comboItem + " to html"
        );

        if (!skipUndo) {
          bot.execCommand("undo");
        }

        assert.areSame(
            initialHtmlWithSelection,
            htmlGetter(),
            "undid " + comboItem
        );
      });
    },
    "applying the complex styles does a no-op": function() {
      // this item would normally be hidden, but let's just make sure that it doesn't do anything
      var comboItem = "1. a. i. a. i.";
      var beforeHtmlWithSelection = "<ol><li>^foo</li></ol>";
      var afterHtmlWithSelection = beforeHtmlWithSelection;
      // wtb destructuring
      var opts = {
        comboItem: comboItem,
        beforeHtml: beforeHtmlWithSelection,
        afterHtml: afterHtmlWithSelection,
        skipUndo: true // because this is a no-op, undoing it actually undoes the adding of HTML
      };
      this.assertComboBeforeAfter(opts);
    },
    "applying a simple style": function() {
      var comboItem = "List: A. B. C.";
      var beforeHtmlWithSelection = "<ol><li>^foo</li></ol>";
      var afterHtmlWithSelection = "<ol class=\"list-upper-alpha\"><li>^foo</li></ol>";
      var opts = {
        comboItem: comboItem,
        beforeHtml: beforeHtmlWithSelection,
        afterHtml: afterHtmlWithSelection
      };
      this.assertComboBeforeAfter(opts);
    },
    "unapplying a simple style": function() {
      var comboItem = "List: A. B. C.";
      var beforeHtmlWithSelection = "<ol class=\"list-upper-alpha\"><li>^foo</li></ol>";
      var afterHtmlWithSelection = "<ol><li>^foo</li></ol>";

      var opts = {
        comboItem: comboItem,
        beforeHtml: beforeHtmlWithSelection,
        afterHtml: afterHtmlWithSelection
      };
      this.assertComboBeforeAfter(opts);
    },
    "applying a simple style one layer deep": function() {
      var comboItem = "List: A. B. C.";
      var beforeHtmlWithSelection = "<ol class=\"list-decimal\"><li>foo<ol><li>^bar</li></ol></li></ol>";
      var afterHtmlWithSelection = "<ol class=\"list-decimal\"><li>foo<ol class=\"list-upper-alpha\"><li>^bar</li></ol></li></ol>";
      var opts = {
        comboItem: comboItem,
        beforeHtml: beforeHtmlWithSelection,
        afterHtml: afterHtmlWithSelection
      };
      this.assertComboBeforeAfter(opts);
    },
  });
})();
