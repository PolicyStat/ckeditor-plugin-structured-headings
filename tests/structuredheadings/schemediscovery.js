/* global wait, resume */
/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; h2; h3; h4; h5; p; ol; li;"
  };

  var VERY_LAST_PRIORITY = 9999;

  var detectScheme = function (editor) {
    return editor.plugins.structuredheadings.detectScheme();
  };

  var getCurrentScheme = function (editor) {
    return editor.plugins.structuredheadings.currentScheme;
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    tearDown: function () {
      // reset the plugin between tests
      var editor = this.editorBot.editor;
      editor.plugins.structuredheadings.currentScheme = "1.1.1.1.1.";
    },

    "default is numbered": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0\">^foo</h1>" +
        "<h2 class=\"autonumber autonumber-1\">bar</h2>"
      );

      assert.areEqual(
        "1.1.1.1.1.",
        detectScheme(editor)
      );
    },

    "invalid combos return numbered": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-a\">^foo</h1>" +
        "<h2 class=\"autonumber autonumber-1 autonumber-N\">bar</h2>"
      );

      assert.areEqual(
        "1.1.1.1.1.",
        detectScheme(editor)
      );
    },

    "can detect based off of one level": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      bot.setHtmlWithSelection(
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">^foo</h1>"
      );

      assert.areEqual(
        "1. a. i. a. i.",
        detectScheme(editor)
      );
    },

    "autodetect will detect a default scheme document": function () {
      var bot = this.editorBot;
      var editor = bot.editor;

      var listener = editor.on(
        "dataReady",
        function () {
          listener.removeListener();
          resume(function () {
            assert.areEqual(
              "1.1.1.1.1.",
              getCurrentScheme(editor)
            );
          });
        },
        null,
        null,
        VERY_LAST_PRIORITY
      );

      // cannot use bot.setHtmlWithSelection, it does not fire dataReady events
      editor.setData(
        "<h1 class=\"autonumber autonumber-0\">foo</h1>" +
        "<h2 class=\"autonumber autonumber-1\">foo</h2>"
      );

      wait();
    },

    "autodetect falls to default if nothing matches": function () {
      var bot = this.editorBot;
      var editor = bot.editor;
      var listener = editor.on(
        "dataReady",
        function () {
          listener.removeListener();
          resume(function () {
            assert.areEqual(
              "1.1.1.1.1.",
              getCurrentScheme(editor)
            );
          });
        },
        null,
        null,
        VERY_LAST_PRIORITY
      );

      // A.A. is not a valid default
      // cannot use bot.setHtmlWithSelection, it does not fire dataReady events
      editor.setData(
        "<h1 class=\"autonumber autonumber-0 autonumber-A\">foo</h1>" +
        "<h2 class=\"autonumber autonumber-1 autonumber-A\">foo</h2>"
      );

      wait();
    },

    "autodetect will detect a schemed document": function () {
      var bot = this.editorBot;
      var editor = bot.editor;

      var listener = editor.on(
        "dataReady",
        function () {
          listener.removeListener();
          resume(function () {
            assert.areEqual(
              "1. a. i. a. i.",
              getCurrentScheme(editor)
            );
          });
        },
        null,
        null,
        VERY_LAST_PRIORITY
      );

      // cannot use bot.setHtmlWithSelection, it does not fire dataReady events
      editor.setData(
        "<h1 class=\"autonumber autonumber-0 autonumber-N\">foo</h1>" +
        "<h2 class=\"autonumber autonumber-1 autonumber-a\">foo</h2>"
      );
      wait();

    },

    "autodetect will not destroy existing list customizations in non-autonumber doc": function() {
      var bot = this.editorBot;
      var editor = bot.editor;
      var startingHtml = "<h1>foo</h1>" +
        "<h2>foo</h2>" +
        "<ol class=\"list-decimal\">" +
        "<li>baz</li>" +
        "</ol>";

      var listener = editor.on(
        "dataReady",
        function () {
          listener.removeListener();
          resume(function () {
            assert.areEqual(
              "1.1.1.1.1.",
              getCurrentScheme(editor)
            );

            assert.areEqual(startingHtml, bot.getData());
          });
        },
        null,
        null,
        VERY_LAST_PRIORITY
      );

      // cannot use bot.setHtmlWithSelection, it does not fire dataReady events
      editor.setData(startingHtml);
      wait();
    }
  });
})();
