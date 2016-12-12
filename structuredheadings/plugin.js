(function () {
  CKEDITOR.plugins.add("structuredheadings", {
    icons: "autonumberheading, matchheading",
    init: function (editor) {
      // list of elements allowed to be numbered
      var allowedElements = {
        h1: 1,
        h2: 1,
        h3: 1,
        h4: 1,
        h5: 1,
        h6: 1
      };

      editor.addContentsCss(this.path + "styles/numbering.css");

      // Helper function to set button state
      var setCommandState = function (command, state) {
        switch (state) {
        case "on":
          editor.getCommand(command).setState(CKEDITOR.TRISTATE_ON);
          break;
        case "off":
          editor.getCommand(command).setState(CKEDITOR.TRISTATE_OFF);
          break;
        case "disabled":
          editor.getCommand(command).setState(CKEDITOR.TRISTATE_DISABLED);
          break;
        }

      };

      var isNumbered = function (element) {
        if (element.hasClass("autonumber")) {
          return true;
        } else {
          return false;
        }
      };

      var getCurrentBlock = function (element) {
        return element.getAscendant({
          div: 1,
          p: 1,
          pre: 1,
          address: 1,
          h1: 1,
          h2: 1,
          h3: 1,
          h4: 1,
          h5: 1,
          h6: 1
        }, true);
      };

      var getPreviousHeader = function (element) {
        return element.getPrevious(function (node) {
          if (node.type === CKEDITOR.NODE_ELEMENT &&
              node.is(allowedElements)
          ) {
            return true;
          } else {
            return false;
          }
        });
      };

      // The command to add an autonumbering class to selection
      editor.addCommand("autoNumberHeading", {
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",
        startDisabled: true,
        exec: function () {
          var element = getCurrentBlock(editor.getSelection().getStartElement());

          if (!isNumbered(element)) {
            element.addClass("autonumber");
            setCommandState("autoNumberHeading", "on");
          } else {
            element.removeClass("autonumber");
            setCommandState("autoNumberHeading", "off");
          }
        }
      });

      editor.addCommand("matchHeading", {
        startDisabled: true,
        exec: function () {
          var element = getCurrentBlock(editor.getSelection().getStartElement());
          var style;
          //find previous element that matches allowedElements
          var previousHeader = getPreviousHeader(element);

          // if already in header, set back to default
          if (element.is(allowedElements)) {
            switch (editor.config.enterMode) {
            case CKEDITOR.ENTER_DIV:
                  //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: "div" });
              break;
            default:
                  //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: "p" });
              element.removeClass("autonumber");
              break;
            }
            editor.applyStyle(style);

          // else get previous element style (type) and apply to selection
          } else if (previousHeader) {
            //eslint-disable-next-line new-cap
            style = new CKEDITOR.style({ element: previousHeader.getName()});
            // if previous was numbered, set the new  one to numbered also
            if (isNumbered(previousHeader)) {
              //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: previousHeader.getName(),
                attributes: {"class": "autonumber"}});
            }
            editor.applyStyle(style);

          // else set it as new H1 and autonumber
          } else {
            //eslint-disable-next-line new-cap
            style = new CKEDITOR.style({ element: "h1",
              attributes: {"class": "autonumber"}});
            editor.applyStyle(style);
          }

        }

      });

      // Add the button to the toolbar only if toolbar plugin or button plugin is loaded
      if (!!CKEDITOR.plugins.get("toolbar") || !!CKEDITOR.plugins.get("button")) {
        editor.ui.addButton("autonumberheading", {
          label: "Autonumber Heading",
          command: "autoNumberHeading",
          toolbar: "styles,0"
        });
        editor.ui.addButton("matchheading", {
          label: "Match Heading",
          command: "matchHeading",
          toolbar: "styles,1"
        });
      }

      /* Set button state on selection change.
      * On/off for element style, disabled for invalid element
      */
      editor.on("selectionChange", function (e) {
        var element = getCurrentBlock(e.data.selection.getStartElement());

        if (element && element.is(allowedElements)) {
          //if is autonumbered, update state appropriately
          if (isNumbered(element)) {
            setCommandState("autoNumberHeading", "on");
          } else {
            setCommandState("autoNumberHeading", "off");
          }

          // if it's any header, turn set toggle heading on
          setCommandState("matchHeading", "on");

        /* special case for p tags, for toggleHeading command, could be handled better
        * this is to allow toggleHeading active on p tags without including it in
        * our allowedElements for autonumbering
        */
        } else if (element && element.is("p")) {
          setCommandState("matchHeading", "off");
          setCommandState("autoNumberHeading", "disabled");
        //disable otherwise
        } else {
          setCommandState("autoNumberHeading", "disabled");
          setCommandState("matchHeading", "disabled");
        }

      });
    }
  });
})();
