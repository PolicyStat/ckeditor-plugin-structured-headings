/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,structuredheadings,toolbar,basicstyles */

// Clean up all instances been created on the page.
(function () {

  bender.editor = {
    allowedForTests: "h1; p"
  };

  bender.test({
    setUp: function () {
      //Anything to be run before each test if needed
    },

    "Increase and Decrease Level Disabled on P": function () {
        this.editorBot.setHtmlWithSelection("<p>^Paragraph</p>");
        var testCommand = this.editor.getCommand("increaseHeaderLevel");

        assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "increaseHeaderLevel DISABLED in P"
          );
        
        testCommand = this.editor.getCommand("decreaseHeaderLevel");

        assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "decreaseHeaderLevel DISABLED in P"
          );

      },
    
    "Increase Level Disabled on H6": function () {
      this.editorBot.setHtmlWithSelection("<h6>^Heading</h6>");
      var testCommand = this.editor.getCommand("increaseHeaderLevel");

      assert.areSame(
          CKEDITOR.TRISTATE_DISABLED, testCommand.state,
          "increaseHeaderLevel DISABLED in H6"
        );

    },
    
    "Decrease Level Disabled on H1": function () {
        this.editorBot.setHtmlWithSelection("<h1>^Heading</h1>");
        var testCommand = this.editor.getCommand("decreaseHeaderLevel");

        assert.areSame(
            CKEDITOR.TRISTATE_DISABLED, testCommand.state,
            "decreaseHeaderLevel DISABLED in H1"
          );

      },
      
      "Increase and Decrease Level Enabled on H3": function () {
          this.editorBot.setHtmlWithSelection("<h3>^Heading</h3>");
          var testCommand = this.editor.getCommand("decreaseHeaderLevel");
    
          assert.areSame(
              CKEDITOR.TRISTATE_OFF, testCommand.state,
              "decreaseHeaderLevel OFF in H3"
            );
          
          testCommand = this.editor.getCommand("increaseHeaderLevel");
          
          assert.areSame(
              CKEDITOR.TRISTATE_OFF, testCommand.state,
              "increaseHeaderLevel OFF in H3"
            );
    
        }
    
  });
})();
