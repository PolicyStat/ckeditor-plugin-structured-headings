/* eslint-disable */
/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles,dialog,richcombo,indentlist,list,undo */
/* eslint-enable */

// Clean up all instances been created on the page.
(function () {

  var tabKey = 9;

  bender.editor = {
    allowedForTests: "h1; h2; h3"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "H2 to H3 from Tab": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h2>^Heading</h2>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);
      this.editor.editable().fire(
        "keydown",
        new CKEDITOR.dom.event({ keyCode: tabKey }) // eslint-disable-line new-cap
      );
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
        "<h3>^Heading</h3>", updatedContent,
        "Header increased from TAB"
      );

      bot.execCommand("undo");

      assert.areSame(
        initialHtmlWithSelection,
        bender.tools.getHtmlWithSelection(this.editorBot.editor),
        "tab is undoable"
      );
    },

    "H2 to H1 from Shift-Tab": function () {
      var bot = this.editorBot;
      var initialHtmlWithSelection = "<h2>^Heading</h2>";
      bot.setHtmlWithSelection(initialHtmlWithSelection);
      this.editor.editable().fire(
        "keydown",
        new CKEDITOR.dom.event({ keyCode: tabKey, shiftKey: true }) // eslint-disable-line new-cap
      );
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<h1>^Heading</h1>", updatedContent,
          "Header decreased from Shift-TAB"
      );

      bot.execCommand("undo");

      assert.areSame(
        initialHtmlWithSelection,
        bender.tools.getHtmlWithSelection(this.editorBot.editor),
        "tab is undoable"
      );
    },

    "list tab still works": function () {
      this.editorBot.setHtmlWithSelection("<ul><li>foo</li><li>^bar</li></ul>");
      this.editor.editable().fire(
        "keydown",
        new CKEDITOR.dom.event({ keyCode: tabKey })  // eslint-disable-line new-cap
      );
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<ul><li>foo<ul><li>^bar</li></ul></li></ul>", updatedContent,
          "indented list"
        );
    },

    "list shift tab still works": function () {
      this.editorBot.setHtmlWithSelection("<ul><li>foo<ul><li>^bar</li></ul></li></ul>");
      this.editor.editable().fire(
        "keydown",
        new CKEDITOR.dom.event({ keyCode: tabKey, shiftKey: true }) // eslint-disable-line new-cap
      );
      var updatedContent = bender.tools.getHtmlWithSelection(this.editorBot.editor);

      assert.areSame(
          "<ul><li>foo</li><li>^bar</li></ul>", updatedContent,
          "de-indented list"
        );
    }

  });
})();
