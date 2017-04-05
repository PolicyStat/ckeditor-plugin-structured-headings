(function () {
/*
 * Helper Functions
 */

  var elementStyles = {
      //eslint-disable-next-line new-cap
    div: new CKEDITOR.style({ element: "div" }),
      //eslint-disable-next-line new-cap
    p: new CKEDITOR.style({ element: "p" }),
      //eslint-disable-next-line new-cap
    pre: new CKEDITOR.style({ element: "pre" })
  };

  var setupElements = function (editor) {
    // list of elements allowed to be numbered
    editor.config.numberedElements =
    editor.config.numberedElements || [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6"
    ];
    for (var e in editor.config.numberedElements) {
      elementStyles[editor.config.numberedElements[e]] =
        //eslint-disable-next-line new-cap
        new CKEDITOR.style({ element: editor.config.numberedElements[e] });
    }
  };

  var isNumbered = function (editor, element) {
    if (element.hasClass(editor.config.autonumberBaseClass)) {
      return true;
    } else {
      return false;
    }
  };

  var clearNumbering = function (editor, element) {
    if (element.hasClass(editor.config.autonumberBaseClass)) {
      element.removeClass(editor.config.autonumberBaseClass);
    }
  };

  var setNumbering = function (editor, element) {
    if (!element.hasClass(editor.config.autonumberBaseClass)) {
      element.addClass(editor.config.autonumberBaseClass);
    }
  };

  var clearLevel = function (editor, element) {
    for (var key in editor.config.autonumberLevelClasses) {
      element.removeClass(editor.config.autonumberLevelClasses[key]);
    }
  };

  var setLevel = function (editor, element) {
    var index = editor.config.numberedElements.indexOf(element.getName());
    clearLevel(editor, element);
    element.addClass(editor.config.autonumberLevelClasses[index]);
  };

  var clearStyles = function (editor, element) {
    for (var styleName in editor.config.autonumberStyles) {
      var style = editor.config.autonumberStyles[styleName];
      if (typeof style === "object") {
        for (var className in style) {
          element.removeClass(style[className]);
        }
      } else {
        element.removeClass(style);
      }
    }
  };

  var setStyle = function (editor, element, style) {
    var index = editor.config.numberedElements.indexOf(element.getName());
    if (element.type === CKEDITOR.NODE_ELEMENT) {
      clearStyles(editor, element);
      if (editor.config.autonumberStyles[style] &&
          typeof editor.config.autonumberStyles[style] === "object") {
        element.addClass(editor.config.autonumberStyles[style][index]);
      }
    }
  };

  var setCurrentStyle = function (editor, element, style) {
    editor.config.autonumberCurrentStyle = style;
  };

  var getPreviousHeading = function (editor, element) {
    return element.getPrevious(function (node) {
      if (node.type === CKEDITOR.NODE_ELEMENT &&
        editor.config.numberedElements.indexOf(node.getName()) >= 0
    ) {
        return true;
      } else {
        return false;
      }
    });
  };

  var setupCommands = function (editor) {
    editor.addCommand("matchHeading",
        CKEDITOR.plugins.structuredheadings.commands.matchHeading);
    editor.addCommand("increaseHeadingLevel",
            CKEDITOR.plugins.structuredheadings.commands.increaseHeadingLevel);
    editor.addCommand("decreaseHeadingLevel",
            CKEDITOR.plugins.structuredheadings.commands.decreaseHeadingLevel);
    editor.addCommand("restartNumbering",
        CKEDITOR.plugins.structuredheadings.commands.restartNumbering);
    editor.addCommand("reapplyStyle",
        CKEDITOR.plugins.structuredheadings.commands.reapplyStyle);
  };

  /*
   * Style Config
   */
  var setupStyles = function (editor) {

    editor.config.autonumberBaseClass =
    editor.config.autonumberBaseClass || "autonumber";

    editor.config.autonumberRestartClass =
    editor.config.autonumberRestartClass || "autonumber-restart";

    editor.config.autonumberLevelClasses =
    editor.config.autonumberLevelClasses || [
      "autonumber-0",
      "autonumber-1",
      "autonumber-2",
      "autonumber-3",
      "autonumber-4",
      "autonumber-5"
    ];

    editor.config.autonumberStyles =
    editor.config.autonumberStyles || {
      "1.1.1.1.1.": null,
      "1. a. i. a. i.": [
        "autonumber-N",
        "autonumber-a",
        "autonumber-r",
        "autonumber-a",
        "autonumber-r",
        "autonumber-a"
      ],
      "A. a. i. a. i. a.": [
        "autonumber-A",
        "autonumber-a",
        "autonumber-r",
        "autonumber-a",
        "autonumber-r",
        "autonumber-a"
      ],
      "I. A. 1. a. 1.": [
        "autonumber-R",
        "autonumber-A",
        "autonumber-N",
        "autonumber-a",
        "autonumber-N",
        "autonumber-a"
      ]
    };

    editor.config.autonumberCurrentStyle =
    editor.config.autonumberCurrentStyle || "1.1.1.1.1.";
  };

/*
 * Structured Headings Plugin Setup
 */

  CKEDITOR.plugins.add("structuredheadings", {
    init: function (editor) {

      var TAB_KEY_CODE = 9;

      editor.config.autonumberStyleImgPath = this.path + "dialogs/img";
      editor.addContentsCss(this.path + "styles/numbering.css");

      setupElements(editor);
      setupCommands(editor);
      setupStyles(editor);

      //Format Dropdown
      editor.ui.addRichCombo("NumFormats", {
        label: "Formats",
        title: "Numbering Formats",
        toolbar: "styles,7",
        allowedContent: editor.config.numberedElements.concat(["pre", "p", "div"]),

        panel: {
          css: [ CKEDITOR.skin.getPath("editor") ].concat(editor.config.contentsCss),
          multiSelect: false,
          attributes: { "aria-label": "Numbering Formats" }
        },

        init: function () {

          this.startGroup("Formats");

          this.add("p", elementStyles.p.buildPreview("Normal Text"), "Normal Text");

          for (var key in editor.config.numberedElements) {
            this.add(editor.config.numberedElements[key],
              elementStyles[ editor.config.numberedElements[key] ].buildPreview(
                "Heading " + editor.config.numberedElements[key].slice(1)
              ),
              "Heading " + editor.config.numberedElements[key].slice(1));
          }

          this.add("pre", elementStyles.pre.buildPreview("Formatted Text"), "Preformatted Text");
        },

        onClick: function (value) {
          editor.fire("saveSnapshot");
          editor.applyStyle(elementStyles[ value ]);
          var block = editor.elementPath().block;
          var previousHeading = getPreviousHeading(editor, block);
          if (value === "p") {
            CKEDITOR.plugins.structuredheadings.clearAll(editor, block);
            this.setValue(value, "Normal Text");
          } else if (value === "pre") {
            CKEDITOR.plugins.structuredheadings.clearAll(editor, block);
            this.setValue(value, "Formatted Text");
          } else {
            if (!previousHeading || isNumbered(editor, previousHeading)) {
              setNumbering(editor, block);
              setLevel(editor, block);
              editor.execCommand("reapplyStyle");
            }
            this.setValue(
                value,
                "Heading " + editor.config.numberedElements[
                    editor.config.numberedElements.indexOf(value)
                ].slice(1));
          }

          editor.fire("saveSnapshot");
        },

        onRender: function () {
          editor.on("selectionChange", function (ev) {
            var currentTag = this.getValue();
            var elementPath = ev.data.path;
            var elementList = editor.config.numberedElements.concat(["pre", "p", "div"]);
            for (var tag in elementList) {
              if (elementStyles[elementList[tag]].checkActive(elementPath, editor)) {
                if (elementList[tag] !== currentTag) {
                  if (elementList[tag] === "p") {
                    this.setValue(elementList[tag], "Normal Text");
                  } else if (elementList[tag] === "pre") {
                    this.setValue(elementList[tag], "Formatted Text");
                  } else {
                    this.setValue(
                        elementList[tag],
                        "Heading " + editor.config.numberedElements[tag].slice(1)
                    );
                  }
                }
                return;
              }
            }

            this.setValue("");
          }, this);
        }

      });

      //Style Dropdown
      editor.ui.addRichCombo("NumStyles", {
        label: "Numbering",
        title: "Numbering Styles",
        toolbar: "styles,8",
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",

        panel: {
          css: [ CKEDITOR.skin.getPath("editor") ].concat(editor.config.contentsCss),
          multiSelect: false,
          attributes: { "aria-label": "Numbering Styles" }
        },

        init: function () {
          this.startGroup("Global Styles");

          for (var style in editor.config.autonumberStyles) {
            this.add(style, style, style);
          }

          this.startGroup("Heading-Specific Styles");
          this.add("clear", "Clear Styling", "Clear Styling");
          this.add("restart", "Restart Styling", "Restart Styling");
        },

        clearAutonumberClassesForHeading: function (heading) {
          clearStyles(editor, heading);
          clearLevel(editor, heading);
          clearNumbering(editor, heading);
        },

        setAutonumberClassesForHeading: function (value, heading) {
          setNumbering(editor, heading);
          setLevel(editor, heading);
          setCurrentStyle(editor, heading, value);
        },
        onClick: function (value) {
          editor.fire("saveSnapshot");
          if (value === "restart") {
            editor.execCommand("restartNumbering");
            editor.fire("saveSnapshot");
            return;
          }
          var selection = editor.getSelection();
          var headings = CKEDITOR.plugins.structuredheadings.getHeadingsInSelection(
                editor,
                selection
              );
          var func;

          if (value === "clear") {
            func = this.clearAutonumberClassesForHeading;
          } else {
            func = this.setAutonumberClassesForHeading.bind(this, value);
          }

          if (headings.length > 0) {
            for (var i = 0; i < headings.length; i++) {
              func(headings[i]);
            }
          }

          // apply the correct bulletstyle for all numbered headings
          editor.fire("lockSnapshot");
          editor.execCommand("reapplyStyle", value);
          // set the combo box value
          this.setValue(value, value);
          editor.fire("unlockSnapshot");
        },

        onRender: function () {
          editor.on("selectionChange", function (ev) {
            var elementPath = ev.data.path;

            if (isNumbered(editor, elementPath.block)) {
              this.setValue(editor.config.autonumberCurrentStyle,
                        editor.config.autonumberCurrentStyle);
            } else {
              this.setValue("");
            }


          }, this);
        },

        onOpen: function () {
          this.showAll();
        },

        refresh: function () {
          var path = editor.elementPath();

          if (!path) {return;}

          if (path.block && editor.config.numberedElements.indexOf(path.block.getName()) >= 0) {
            this.setState(CKEDITOR.TRISTATE_OFF);
            return;
          }

          this.setState(CKEDITOR.TRISTATE_DISABLED);
        }
      });

      // Indent and outdent with TAB/SHIFT+TAB key
      editor.on("key", function (evt) {
        if (editor.mode !== "wysiwyg") {
          return;
        }
        var block = CKEDITOR.plugins.structuredheadings.getCurrentBlockFromPath(editor);

        // if the current block is not configured as a structured-heading-able block

        if (block && editor.config.numberedElements.indexOf(block.getName()) === -1) {
          return;
        }

        if (evt.data.keyCode === TAB_KEY_CODE) {
          editor.execCommand("increaseHeadingLevel");
          evt.cancel();
        } else if (evt.data.keyCode === CKEDITOR.SHIFT + TAB_KEY_CODE) {
          editor.execCommand("decreaseHeadingLevel");
          evt.cancel();
        }

      }, this, null, 1);

    }
  });

/*
 * Structured Headings Plugin Commands
 */

  CKEDITOR.plugins.structuredheadings = {
    getHeadingsInSelection: function (editor, selection) {
      // forget Firefox multirange for now
      var range = selection.getRanges()[0];
      if (range.collapsed) {
        var block = CKEDITOR.plugins.structuredheadings.getCurrentBlockFromPath(editor);
        if (editor.config.numberedElements.indexOf(block.getName()) !== -1) {
          return [block];
        }
        return [];
      }

      var walker = new CKEDITOR.dom.walker(range); // eslint-disable-line new-cap
      walker.evaluator = function (node) {
        if (node.type !== CKEDITOR.NODE_ELEMENT) {
          return false;
        }

        if (editor.config.numberedElements.indexOf(node.getName()) !== -1) {
          return true;
        }
        return false;
      };

      var headings = [];
      var current = walker.next();

      while (current) {
        headings.push(current);
        current = walker.next();
      }

      return headings;
    },
    clearAll: function (editor, element) {
      clearLevel(editor, element);
      clearNumbering(editor, element);
      clearStyles(editor, element);
    },
    getCurrentBlockFromPath: function (editor) {
      return editor.elementPath().block;
    },
    commands: {
    /*
     * matchHeading
     */
      matchHeading: {
        exec: function (editor) {
          var previousHeading = getPreviousHeading(editor, editor.elementPath().block);

        // if already in heading, set back to default based on enter mode
          if (editor.config.numberedElements.indexOf(editor.elementPath().block.getName()) >= 0) {
            if (editor.config.enterMode === CKEDITOR.ENTER_DIV) {
              editor.applyStyle(elementStyles.div);
            } else {
              editor.applyStyle(elementStyles.p);
            }
            clearNumbering(editor, editor.elementPath().block);
            clearStyles(editor, editor.elementPath().block);

        // else get previous element style (type) and apply to selection
          } else if (previousHeading) {
            editor.applyStyle(elementStyles[previousHeading.getName()]);
          // if previous was numbered, set the new  one to numbered also
            if (isNumbered(editor, previousHeading)) {
              setNumbering(editor, editor.elementPath().block);
              setLevel(editor, editor.elementPath().block);
              setStyle(editor, editor.elementPath().block);
            }

        // else set it as new first element
          } else {
            editor.applyStyle(elementStyles[editor.config.numberedElements[0]]);
          }
        }
      },

      /*
       * increaseHeadingLevel
       */
      increaseHeadingLevel: {
        exec: function (editor) {
          var element = editor.elementPath().block;
          var nextElement = editor.config.numberedElements[editor.config.numberedElements.indexOf(
              element.getName()) + 1];

          if (nextElement) {
            editor.applyStyle(elementStyles[nextElement]);
          }
          if (isNumbered(editor, element)) {
            setLevel(editor, editor.elementPath().block);
            setStyle(editor, editor.elementPath().block, editor.config.autonumberCurrentStyle);
          }
        }
      },

      /*
       * decreaseHeadingLevel
       */
      decreaseHeadingLevel: {
        exec: function (editor) {
          var element = editor.elementPath().block;
          var prevElement = editor.config.numberedElements[editor.config.numberedElements.indexOf(
              element.getName()) - 1];

          if (prevElement) {
            editor.applyStyle(elementStyles[prevElement]);
          }
          if (isNumbered(editor, element)) {
            setLevel(editor, editor.elementPath().block);
            setStyle(editor, editor.elementPath().block, editor.config.autonumberCurrentStyle);
          }
        }
      },

    /*
     * restartNumbering
     */
      restartNumbering: {
        contextSensitive: 1,
        exec: function (editor) {
          var element = editor.elementPath().block;

          if (!element.hasClass(editor.config.autonumberRestartClass)) {
            setNumbering(editor, element);
            setLevel(editor, element);
            element.addClass(editor.config.autonumberRestartClass);
            setStyle(editor, element);
          } else {
            element.removeClass(editor.config.autonumberRestartClass);
          }
        }
      },

      /*
       * reapplyStyle
       * Finds all autonumbered headings,
       * and applies the selected numbering style.
       */
      reapplyStyle: {
        exec: function (editor, style) {
          var nodeList = editor.document.find("." + editor.config.autonumberBaseClass);

          for (var i = 0; i < nodeList.count(); i++) {
            var node = nodeList.getItem(i);
            setStyle(editor, node, style);
          }
        }
      }
    }
  };
})();
