(function () {
/*
 * Style Config
 */

  CKEDITOR.config.autonumberBaseClass = "autonumber";
  CKEDITOR.config.autonumberRestartClass = "autonumber-restart";
  CKEDITOR.config.autonumberStyles = {
    Narara: {
      h1: "autonumber-N",
      h2: "autonumber-a",
      h3: "autonumber-r",
      h4: "autonumber-a",
      h5: "autonumber-r",
      h6: "autonumber-a"
    },
    Aarara: {
      h1: "autonumber-A",
      h2: "autonumber-a",
      h3: "autonumber-r",
      h4: "autonumber-a",
      h5: "autonumber-r",
      h6: "autonumber-a"
    },
    RANaNa: {
      h1: "autonumber-R",
      h2: "autonumber-A",
      h3: "autonumber-N",
      h4: "autonumber-a",
      h5: "autonumber-N",
      h6: "autonumber-a"
    }
  };
  
  var autonumberCurrentStyle = null; //hold current style or null if default

  var config = CKEDITOR.config;

/*
 * Helper Functions
 */

// list of elements allowed to be numbered
  var allowedElements = {
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1
  };

//some friendly setup for level changes
  var headerList = ["h1", "h2", "h3", "h4", "h5", "h6"];
  var firstHeaderKey = 0;
  var lastHeaderKey = headerList.length - 1;

//style helpers


  var clearStyles = function (element) {
    for (var styleName in config.autonumberStyles) {
      var style = config.autonumberStyles[styleName];
      for (var className in style) {
        element.removeClass(style[className]);
      }
    }
  };

  var setStyle = function (element, styleName) {
    var elementType = element.getName();
    var style = config.autonumberStyles[styleName];
    if (elementType) {
      clearStyles(element);
    }
    if (style) {
      element.addClass(style[elementType]);
    }
  };

  var isNumbered = function (element) {
    if (element.hasClass(config.autonumberBaseClass)) {
      return true;
    } else {
      return false;
    }
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

/*
 * Structured Headings Plugin Setup
 */

  CKEDITOR.plugins.add("structuredheadings", {
    icons: "autonumberheading," +
         "matchheading," +
         "increaseheadinglevel," +
         "decreaseheadinglevel," +
         "restartNumbering," +
         "selectStyle",
    hidpi: true,
    init: function (editor) {
      editor.addContentsCss(this.path + "styles/numbering.css");

      //Wrap addCommands in an iffy to get around lint max-statements in init
      (function () {
        editor.addCommand("autoNumberHeading",
          CKEDITOR.plugins.structuredheadings.commands.autoNumberHeading);
        editor.addCommand("matchHeading",
          CKEDITOR.plugins.structuredheadings.commands.matchHeading);
        editor.addCommand("increaseHeadingLevel",
          CKEDITOR.plugins.structuredheadings.commands.increaseHeadingLevel);
        editor.addCommand("decreaseHeadingLevel",
          CKEDITOR.plugins.structuredheadings.commands.decreaseHeadingLevel);
        editor.addCommand("restartNumbering",
          CKEDITOR.plugins.structuredheadings.commands.restartNumbering);
        editor.addCommand("setCurrentStyle",
                CKEDITOR.plugins.structuredheadings.commands.setCurrentStyle);
        editor.addCommand("reapplyStyle",
          CKEDITOR.plugins.structuredheadings.commands.reapplyStyle);
      })();

      //Dialogs
      //eslint-disable-next-line new-cap
      editor.addCommand("selectStyle", new CKEDITOR.dialogCommand("selectStyle"));
      CKEDITOR.dialog.add("selectStyle", this.path + "dialogs/selectstyle.js");

    // Add the button to the toolbar only if toolbar plugin or button plugin is loaded
      if (CKEDITOR.plugins.get("toolbar")) {
        editor.ui.addButton("autoNumberHeading", {
          label: "Autonumber Heading",
          command: "autoNumberHeading",
          toolbar: "styles,0"
        });
        editor.ui.addButton("restartNumbering", {
          label: "Restart Numbering",
          command: "restartNumbering",
          toolbar: "styles,1"
        });
        editor.ui.addButton("matchHeading", {
          label: "Match Heading",
          command: "matchHeading",
          toolbar: "styles,2"
        });
        editor.ui.addButton("selectStyle", {
          label: "Select Style",
          command: "selectStyle",
          toolbar: "styles,3"
        });
        editor.ui.addButton("increaseHeadingLevel", {
          label: "Increase Heading Level",
          command: "increaseHeadingLevel",
          toolbar: "styles,4"
        });
        editor.ui.addButton("decreaseHeadingLevel", {
          label: "Decrease Heading Level",
          command: "decreaseHeadingLevel",
          toolbar: "styles,5"
        });
      }
    }
  });

/*
 * Structured Headings Dialogs
 */

/*
 * Structured Headings Plugin Commands
 */

  CKEDITOR.plugins.structuredheadings = {
    commands: {
    /*
     * autoNumberHeading
     */
      autoNumberHeading: {
        contextSensitive: 1,
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",
        startDisabled: true,
        exec: function (editor) {
          var element = editor.elementPath().block;

          if (!isNumbered(element)) {
            element.addClass(config.autonumberBaseClass);
            setStyle(element, autonumberCurrentStyle);
            this.setState(CKEDITOR.TRISTATE_ON);
          } else {
            element.removeClass(config.autonumberBaseClass);
            clearStyles(element);
            this.setState(CKEDITOR.TRISTATE_OFF);
          }

        },
        refresh: function (editor, path) {
          if (path.block && path.block.is(allowedElements)) {
            if (isNumbered(path.block)) {
              this.setState(CKEDITOR.TRISTATE_ON);
            } else {
              this.setState(CKEDITOR.TRISTATE_OFF);
            }
          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }
        }
      },

    /*
     * matchHeading
     */
      matchHeading: {
        contextSensitive: 1,
        startDisabled: true,
        exec: function (editor) {
          var element = editor.elementPath().block;
          var style;
        //find previous element that matches allowedElements
          var previousHeader = getPreviousHeader(element);

        // if already in header, set back to default based on enter mode
          if (element.is(allowedElements)) {
            switch (editor.config.enterMode) {
            case CKEDITOR.ENTER_DIV:
            //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: "div" });
              element.removeClass(config.autonumberBaseClass);
              break;
            default:
            //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: "p" });
              element.removeClass(config.autonumberBaseClass);
              break;
            }
            editor.applyStyle(style);

        // else get previous element style (type) and apply to selection
          } else if (previousHeader) {
          // if previous was numbered, set the new  one to numbered also
            if (isNumbered(previousHeader)) {
            //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: previousHeader.getName(),
                attributes: {"class": config.autonumberBaseClass}});
            } else {
            //eslint-disable-next-line new-cap
              style = new CKEDITOR.style({ element: previousHeader.getName()});
            }
            editor.applyStyle(style);
            setStyle(element, autonumberCurrentStyle);

        // else set it as new H1 and autonumber
          } else {
          //eslint-disable-next-line new-cap
            style = new CKEDITOR.style({ element: "h1",
              attributes: {"class": config.autonumberBaseClass}});
            editor.applyStyle(style);
            setStyle(element, autonumberCurrentStyle);
          }
        },
        refresh: function (editor, path) {
          if (path.block && path.block.is(allowedElements)) {
            this.setState(CKEDITOR.TRISTATE_ON);
          } else if (path.block && path.block.is({p: 1})) {
            this.setState(CKEDITOR.TRISTATE_OFF);
          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }
        }
      },

    /*
     * increaseHeadingLevel
     */
      increaseHeadingLevel: {
        contextSensitive: 1,
        startDisabled: true,
        exec: function (editor) {
          var element = editor.elementPath().block;
          var nextElement = headerList[headerList.indexOf(element.getName()) + 1];

        //set a maximum level of the previous level + 1
          var previousHeader = getPreviousHeader(element);
          if (previousHeader) {
            var maxElement = headerList[headerList.indexOf(previousHeader.getName()) + 1];
            if (headerList.indexOf(nextElement) > headerList.indexOf(maxElement)) {
              nextElement = maxElement;
            }
          }

        //eslint-disable-next-line new-cap
          var style = new CKEDITOR.style({ element: nextElement});
          editor.applyStyle(style);
          setStyle(element, autonumberCurrentStyle);
        },
        refresh: function (editor, path) {
          if (path.block && path.block.is(allowedElements)) {
            var previousHeader = getPreviousHeader(path.block);

            if (lastHeaderKey === headerList.indexOf(path.block.getName())) {
              this.setState(CKEDITOR.TRISTATE_DISABLED);
            } else if (
            previousHeader && path.block.getName() ===
            headerList[headerList.indexOf(previousHeader.getName()) + 1]
          ) {
              this.setState(CKEDITOR.TRISTATE_DISABLED);
            } else {
              this.setState(CKEDITOR.TRISTATE_OFF);
            }

          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }

        }
      },

    /*
     * decreaseHeadingLevel
     */
      decreaseHeadingLevel: {
        contextSensitive: 1,
        startDisabled: true,
        exec: function (editor) {
          var element = editor.elementPath().block;
          var prevElement = hereapplyStyleaderList[headerList.indexOf(element.getName()) - 1];
        //eslint-disable-next-line new-cap
          var style = new CKEDITOR.style({ element: prevElement});
          editor.applyStyle(style);
          setStyle(element, autonumberCurrentStyle);
        },
        refresh: function (editor, path) {
          if (path.block && path.block.is(allowedElements)) {
            if (firstHeaderKey === headerList.indexOf(path.block.getName())) {
              this.setState(CKEDITOR.TRISTATE_DISABLED);
            } else {
              this.setState(CKEDITOR.TRISTATE_OFF);
            }
          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }
        }
      },

    /*
     * restartNumbering
     */
      restartNumbering: {
        contextSensitive: 1,
        startDisabled: true,
        exec: function (editor) {
          var element = editor.elementPath().block;

          if (!element.hasClass(config.autonumberRestartClass)) {
            element.addClass(config.autonumberBaseClass);
            element.addClass(config.autonumberRestartClass);
            setStyle(element, autonumberCurrentStyle);
            this.setState(CKEDITOR.TRISTATE_ON);
          } else {
            element.removeClass(config.autonumberRestartClass);
            this.setState(CKEDITOR.TRISTATE_OFF);
          }
        },
        refresh: function (editor, path) {
          if (path.block && path.block.is({h1: 1})) {
            if (path.block.hasClass(config.autonumberRestartClass)) {
              this.setState(CKEDITOR.TRISTATE_ON);
            } else {
              this.setState(CKEDITOR.TRISTATE_OFF);
            }
          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }
        }
      },
      
      /*
       * setCurrentStyle
       */
      setCurrentStyle: {
        exec: function (editor, style) {
            autonumberCurrentStyle = style;
        }
      },

      /*
       * reapplyStyle
       */
      reapplyStyle: {
        exec: function (editor) {
          var nodeList = editor.document.find("." + config.autonumberBaseClass);

          for (var i = 0; i < nodeList.count(); i++) {
            var node = nodeList.getItem(i);
            setStyle(node, autonumberCurrentStyle);
          }
        }
      }
    }
  };
})();
