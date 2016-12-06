(function () {
  CKEDITOR.plugins.add("structuredheadings", {
    icons: "structuredheadings",
    init: function (editor) {
      // list of elements allowed to be numbered
      var allowedElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

      editor.addContentsCss(this.path + "styles/numbering.css");

      // Helper function to set button state
      var setCommandState = function (state) {
        switch (state) {
        case "on":
          editor.getCommand("autoNumberHeading").setState(CKEDITOR.TRISTATE_ON);
          break;
        case "off":
          editor.getCommand("autoNumberHeading").setState(CKEDITOR.TRISTATE_OFF);
          break;
        case "disabled":
          editor.getCommand("autoNumberHeading").setState(CKEDITOR.TRISTATE_DISABLED);
          break;
        }

      };

      // The command to add an autonumbering class to selection
      editor.addCommand("autoNumberHeading", {
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",
        requiredContent: allowedElements.join(";"),
        startDisabled: true,
        exec: function () {
          var element = editor.getSelection().getStartElement();

          if (!element.hasClass("autonumber")) {
            element.addClass("autonumber");
            setCommandState("on");
          } else {
            element.removeClass("autonumber");
            setCommandState("off");
          }
        }
      });

      // Add the button to the toolbar only if toolbar plugin or button plugin is loaded
      if (!!CKEDITOR.plugins.get("toolbar") || !!CKEDITOR.plugins.get("button")) {
        editor.ui.addButton("structuredheadings", {
          label: "Autonumber Heading",
          command: "autoNumberHeading",
          toolbar: "styles,0"
        });
      }

      // Set button state on selection change.
      // On/off for element style, disabled for invalid element
      editor.on("selectionChange", function (e) {
        var element = e.data.selection.getStartElement();
        if (allowedElements.indexOf(element.$.localName.toString()) >= 0) {
          if (element.hasClass("autonumber")) {
              setCommandState("on");
          } else {
              setCommandState("off");
          }
        } else {
            setCommandState("disabled");
        }

      });

      return editor; // actually, no return is required, but this shuts eslint up
    }
  });
})();
