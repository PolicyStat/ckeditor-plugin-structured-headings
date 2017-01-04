(function () {
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


  var clearStyles = function (editor, element) {
    for (var styleName in editor.config.autonumberStyles) {
      var style = editor.config.autonumberStyles[styleName];
      for (var className in style) {
        element.removeClass(style[className]);
      }
    }
  };

  var setStyle = function (editor, element, styleName) {
    var style = editor.config.autonumberStyles[styleName];
    if (element.type === CKEDITOR.NODE_ELEMENT) {
      clearStyles(editor, element);
      if (style && style[element.getName()]) {
        element.addClass(style[element.getName()]);
      }
    }

  };

  var isNumbered = function (editor, element) {
    if (element.hasClass(editor.config.autonumberBaseClass)) {
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

  var isEmpty = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  var setupCommands = function (editor) {
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
  };

  var addButtons = function (editor) {
     // Add the button to the toolbar only if toolbar plugin or button plugin is loaded
    if (CKEDITOR.plugins.get("toolbar")) {
      editor.ui.addButton("autoNumberHeading", {
        label: "Autonumber Heading",
        command: "autoNumberHeading",
        toolbar: "styles,4"
      });
      editor.ui.addButton("restartNumbering", {
        label: "Restart Numbering",
        command: "restartNumbering",
        toolbar: "styles,6"
      });
      editor.ui.addButton("matchHeading", {
        label: "Match Heading",
        command: "matchHeading",
        toolbar: "styles,1"
      });
      editor.ui.addButton("selectStyle", {
        label: "Select Style",
        command: "selectStyle",
        toolbar: "styles,5"
      });
      editor.ui.addButton("increaseHeadingLevel", {
        label: "Increase Heading",
        command: "decreaseHeadingLevel",
        toolbar: "styles,2"
      });
      editor.ui.addButton("decreaseHeadingLevel", {
        label: "Decrease Heading",
        command: "increaseHeadingLevel",
        toolbar: "styles,3"
      });
    }
  };

  /*
   * Style Config
   */
  var setupStyles = function (editor) {

    editor.config.autonumberBaseClass =
    editor.config.autonumberBaseClass || "autonumber";

    editor.config.autonumberRestartClass =
    editor.config.autonumberRestartClass || "autonumber-restart";

    editor.config.autonumberStyles =
    editor.config.autonumberStyles || {
      "Numeric": null,
      "Number Lowercase Roman": {
        h1: "autonumber-N",
        h2: "autonumber-a",
        h3: "autonumber-r",
        h4: "autonumber-a",
        h5: "autonumber-r",
        h6: "autonumber-a"
      },
      "Letter Lowercase Roman": {
        h1: "autonumber-A",
        h2: "autonumber-a",
        h3: "autonumber-r",
        h4: "autonumber-a",
        h5: "autonumber-r",
        h6: "autonumber-a"
      },
      "Roman Uppercase Number": {
        h1: "autonumber-R",
        h2: "autonumber-A",
        h3: "autonumber-N",
        h4: "autonumber-a",
        h5: "autonumber-N",
        h6: "autonumber-a"
      }
    };

    editor.config.autonumberStyleImages =
      editor.config.autonumberStyleImages || {
        "Numeric": "Default.png",
        "Number Lowercase Roman": "Narara.png",
        "Letter Lowercase Roman": "Aarara.png",
        "Roman Uppercase Number": "RANaNa.png"
      };

    editor.config.autonumberCurrentStyle = "Numeric"; //hold current style or null if default
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
      editor.config.autonumberStyleImgPath = this.path + "dialogs/img";
      editor.addContentsCss(this.path + "styles/numbering.css");

      setupCommands(editor);
      addButtons(editor);
      setupStyles(editor);

      //Dialogs
      //eslint-disable-next-line new-cap
      editor.addCommand("selectStyle", new CKEDITOR.dialogCommand("selectStyle", {
        startDisabled: true,
        contextSensitive: true,
        refresh: function () {
          if (isEmpty(editor.config.autonumberStyles)) {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          } else {
            this.setState(CKEDITOR.TRISTATE_OFF);
          }
        }
      }));

      CKEDITOR.dialog.add("selectStyle", this.path + "dialogs/selectstyle.js");

    }
  });

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

          if (!isNumbered(editor, element)) {
            element.addClass(editor.config.autonumberBaseClass);
            setStyle(editor, element, editor.config.autonumberCurrentStyle);
            this.setState(CKEDITOR.TRISTATE_ON);
          } else {
            element.removeClass(editor.config.autonumberBaseClass);
            clearStyles(editor, element);
            this.setState(CKEDITOR.TRISTATE_OFF);
          }

        },
        refresh: function (editor, path) {
          if (path.block && path.block.is(allowedElements)) {
            if (isNumbered(editor, path.block)) {
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
          var elementStyles = {
            //eslint-disable-next-line new-cap
            div: new CKEDITOR.style({ element: "div" }),
            //eslint-disable-next-line new-cap
            p: new CKEDITOR.style({ element: "p" }),
            //eslint-disable-next-line new-cap
            h1: new CKEDITOR.style({ element: "h1" }),
            //eslint-disable-next-line new-cap
            h2: new CKEDITOR.style({ element: "h2" }),
            //eslint-disable-next-line new-cap
            h3: new CKEDITOR.style({ element: "h3" }),
            //eslint-disable-next-line new-cap
            h4: new CKEDITOR.style({ element: "h4" }),
            //eslint-disable-next-line new-cap
            h5: new CKEDITOR.style({ element: "h5" }),
            //eslint-disable-next-line new-cap
            h6: new CKEDITOR.style({ element: "h6" })
          };
          var previousHeader = getPreviousHeader(editor.elementPath().block);

        // if already in header, set back to default based on enter mode
          if (editor.elementPath().block.is(allowedElements)) {
            if (editor.config.enterMode === CKEDITOR.ENTER_DIV) {
              editor.applyStyle(elementStyles.div);
            } else {
              editor.applyStyle(elementStyles.p);
            }
            editor.elementPath().block.removeClass(editor.config.autonumberBaseClass);
            clearStyles(editor, editor.elementPath().block);

        // else get previous element style (type) and apply to selection
          } else if (previousHeader) {
            editor.applyStyle(elementStyles[previousHeader.getName()]);
          // if previous was numbered, set the new  one to numbered also
            if (isNumbered(editor, previousHeader)) {
              editor.elementPath().block.addClass(editor.config.autonumberBaseClass);
              setStyle(editor, editor.elementPath().block, editor.config.autonumberCurrentStyle);
            }

        // else set it as new H1
          } else {
            editor.applyStyle(elementStyles.h1);
            //editor.elementPath().block.addClass(editor.config.autonumberBaseClass);
            //setStyle(editor, editor.elementPath().block, editor.config.autonumberCurrentStyle);
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
          setStyle(editor, element, editor.config.autonumberCurrentStyle);
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
          var prevElement = headerList[headerList.indexOf(element.getName()) - 1];
        //eslint-disable-next-line new-cap
          var style = new CKEDITOR.style({ element: prevElement});
          editor.applyStyle(style);
          setStyle(editor, element, editor.config.autonumberCurrentStyle);
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

          if (!element.hasClass(editor.config.autonumberRestartClass)) {
            element.addClass(editor.config.autonumberBaseClass);
            element.addClass(editor.config.autonumberRestartClass);
            setStyle(editor, element, editor.config.autonumberCurrentStyle);
            this.setState(CKEDITOR.TRISTATE_ON);
          } else {
            element.removeClass(editor.config.autonumberRestartClass);
            this.setState(CKEDITOR.TRISTATE_OFF);
          }
        },
        refresh: function (editor, path) {
          if (path.block && path.block.is({h1: 1})) {
            if (path.block.hasClass(editor.config.autonumberRestartClass)) {
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
          editor.config.autonumberCurrentStyle = style;
        }
      },

      /*
       * reapplyStyle
       */
      reapplyStyle: {
        exec: function (editor) {
          var nodeList = editor.document.find("." + editor.config.autonumberBaseClass);

          for (var i = 0; i < nodeList.count(); i++) {
            var node = nodeList.getItem(i);
            setStyle(editor, node, editor.config.autonumberCurrentStyle);
          }
        }
      }
    }
  };
})();
