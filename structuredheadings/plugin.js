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

  var listNodeNames = ["ol", "ul"];

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

  var isInList = function (editor, path) {
    var list = path.contains(listNodeNames, 1);
    var limit = path.blockLimit || path.root;

    return list && limit.contains(list);
  };

  var cssUtils = {
    clearNumbering: function (editor, element) {
      if (element.hasClass(editor.config.autonumberBaseClass)) {
        element.removeClass(editor.config.autonumberBaseClass);
      }
    },
    setNumbering: function (editor, element) {
      if (!element.hasClass(editor.config.autonumberBaseClass)) {
        element.addClass(editor.config.autonumberBaseClass);
      }
    },
    clearLevel: function (editor, element) {
      for (var key in editor.config.autonumberLevelClasses) {
        element.removeClass(editor.config.autonumberLevelClasses[key]);
      }
    },
    setLevel: function (editor, element) {
      var index = editor.config.numberedElements.indexOf(element.getName());
      cssUtils.clearLevel(editor, element);
      element.addClass(editor.config.autonumberLevelClasses[index]);
    }
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
    editor.addCommand("applyPresetToList",
      CKEDITOR.plugins.structuredheadings.commands.applyPresetToList);
    editor.addCommand("applyHeadingPreset",
      CKEDITOR.plugins.structuredheadings.commands.applyHeadingPreset);
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

    editor.config.autonumberStylesWithClasses = Object.keys(
      editor.config.autonumberStyles
    ).filter(function (styleName) {
      return editor.config.autonumberStyles[styleName] !== null;
    });

    // maps each potential part of a heading preset to
    // the PolicyStat CSS class for lists

    editor.config.listClassMappings = editor.config.listClassMappings || {
      //eslint-disable-next-line new-cap
      "A": new CKEDITOR.style({
        name: "List: A. B. C.",
        element: "ol",
        attributes: {"class": "list-upper-alpha"}
      }),
      //eslint-disable-next-line new-cap
      "a": new CKEDITOR.style({
        name: "List: a. b. c.",
        element: "ol",
        attributes: {"class": "list-lower-alpha"}
      }),
      //eslint-disable-next-line new-cap
      "1": new CKEDITOR.style({
        name: "List: 1. 2. 3.",
        element: "ol",
        attributes: {"class": "list-decimal"}
      }),
      //eslint-disable-next-line new-cap
      "I": new CKEDITOR.style({
        name: "List: I. II. III.",
        element: "ol",
        attributes: {"class": "list-upper-roman"}
      }),
      //eslint-disable-next-line new-cap
      "i": new CKEDITOR.style({
        name: "List: i. ii. iii.",
        element: "ol",
        attributes: {"class": "list-lower-roman"}
      }),
      //eslint-disable-next-line new-cap
      "clear": new CKEDITOR.style({
        element: "ol",
        attributes: {"class": ""}
      })
    };
  };

/*
 * Structured Headings Plugin Setup
 */

  CKEDITOR.plugins.add("structuredheadings", {
    currentScheme: "1.1.1.1.1.",
    getNonMatchingSchemes: function (sampleHeading, candidateSchemes, level) {
      // giving a heading, possible numbering schemes, and the level index
      // (which can technically be recalculated based on configs, but oh well)
      // return the schemes that do not match the heading and its css classes
      var editor = this.editor;
      var disqualifiedSchemes = [];
      for (var j = 0; j < candidateSchemes.length; j++) {
        var candidateSchemeName = candidateSchemes[j];
        var classForPresetAtLevel = editor.config.autonumberStyles[candidateSchemeName][level];

        if (!sampleHeading.hasClass(classForPresetAtLevel)) {
          disqualifiedSchemes.push(candidateSchemeName);
        }
      }

      return disqualifiedSchemes;
    },
    getCurrentScheme: function () {
      // check the document's headings,
      // eliminating numbering schemes that do not match,
      // until we are left with a matching scheme, or just keep the current one
      // (inconsistencies will be fixed when the numbering scheme is next applied)
      var editor = this.editor;
      var candidateSchemes = editor.config.autonumberStylesWithClasses;
      var headingLevels = editor.config.numberedElements;
      var disqualifiedSchemes = [];

      for (var i = 0; i < headingLevels.length; i++) {
        var autonumberedHeadingSelector = headingLevels[i] +
          "." +
          editor.config.autonumberBaseClass;

        // it shouldn't matter which one we pick
        // so long as its autonumbered
        var sampleHeading = editor.document.findOne(autonumberedHeadingSelector);

        // no headings at current level are autonumbered
        if (!sampleHeading) {
          continue;
        }

        disqualifiedSchemes = disqualifiedSchemes.concat(
          this.getNonMatchingSchemes(sampleHeading, candidateSchemes, i)
        );
      }

      // remove all presets that did not match, from the total set of numbering schemes
      candidateSchemes = candidateSchemes.filter(function (presetName) {
        return disqualifiedSchemes.indexOf(presetName) === -1;
      });

      // return one of whatever returns, this should never happen with the default
      if (candidateSchemes.length > 0) {
        // just return the first, if there is more than 1, it means
        // the headings are configured in a way that the scheme was left ambiguous
        return candidateSchemes[0];
      } else {
        // return whatever was already set, for consistency
        // this also handles the 'null' css scheme case since it's the default
        return this.currentScheme;
      }

    },
    init: function (editor) {
      var self = this;
      this.editor = editor;
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

          this.add("p", elementStyles.p.buildPreview("Paragraph"), "Paragraph");

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
            CKEDITOR.plugins.structuredheadings.clearAllInSelection(editor);
            this.setValue(value, "Paragraph");
          } else if (value === "pre") {
            CKEDITOR.plugins.structuredheadings.clearAllInSelection(editor);
            this.setValue(value, "Formatted Text");
          } else {
            if (!previousHeading || isNumbered(editor, previousHeading)) {
              cssUtils.setNumbering(editor, block);
              cssUtils.setLevel(editor, block);
              editor.execCommand("reapplyStyle", self.currentScheme);
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
                    this.setValue(elementList[tag], "Paragraph");
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
        label: "Styling",
        title: "Styling",
        toolbar: "styles,8",
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",

        panel: {
          css: [ CKEDITOR.skin.getPath("editor") ].concat(editor.config.contentsCss),
          multiSelect: false,
          attributes: { "aria-label": "Styling" }
        },

        init: function () {
          for (var style in editor.config.autonumberStyles) {
            this.add(style, style, style);
          }

          this.startGroup("Only for Headings");
          this.add("clear", "Clear Styling", "Clear Styling");
          this.add("restart", "Restart Styling", "Restart Styling");
        },

        onClick: function (value) {
          editor.fire("saveSnapshot");

          if (isInList(editor, editor.elementPath())) {
            editor.execCommand("applyPresetToList", value);
          } else if (value === "restart") {
            editor.execCommand("restartNumbering");
          } else {
            editor.execCommand("applyHeadingPreset", value);
            self.currentScheme = value;
          }

          if (value !== "restart" && value !== "clear") {
            this.setValue(value);
          }
        },

        onRender: function () {
          editor.on("selectionChange", function (ev) {
            var elementPath = ev.data.path;
            var block = elementPath.block;

            if (block && isNumbered(editor, block)) {
              this.setValue(
                self.currentScheme,
                self.currentScheme
              );
            } else {
              this.setValue("");
            }


          }, this);
        },

        onOpen: function () {
          this.showAll();
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
        // we were in a collapsed selection, but it isn't a heading

        return null;
      }

      var walker = new CKEDITOR.dom.walker(range); // eslint-disable-line new-cap
      walker.evaluator = function isHeading(node) {
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
    clearAllInSelection: function (editor) {
      var selection = editor.getSelection();
      if (selection) {
        var range = selection.getRanges()[0];
        if (range.collapsed) {
          this.clearAllFromElement(
            editor,
            CKEDITOR.plugins.structuredheadings.getCurrentBlockFromPath(editor)
          );
        } else {
          this.clearAllFromRange(editor, range);
        }

      }
    },
    clearAllFromRange: function (editor, range) {
      var walker = new CKEDITOR.dom.walker(range); // eslint-disable-line new-cap
      walker.evaluator = function isParaPreOrHeading(node) {
        if (node.type !== CKEDITOR.NODE_ELEMENT) {
          return false;
        }
        var nodeName = node.getName();

        return (
          editor.config.numberedElements.indexOf(nodeName) !== -1 ||
          nodeName === "p" ||
          nodeName === "pre"
        );
      };

      var current = walker.next();

      while (current) {
        this.clearAllFromElement(editor, current);
        current = walker.next();
      }
    },
    clearAllFromElement: function (editor, element) {
      cssUtils.clearLevel(editor, element);
      cssUtils.clearNumbering(editor, element);
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
            cssUtils.clearNumbering(editor, editor.elementPath().block);
            clearStyles(editor, editor.elementPath().block);

        // else get previous element style (type) and apply to selection
          } else if (previousHeading) {
            editor.applyStyle(elementStyles[previousHeading.getName()]);
          // if previous was numbered, set the new  one to numbered also
            if (isNumbered(editor, previousHeading)) {
              cssUtils.setNumbering(editor, editor.elementPath().block);
              cssUtils.setLevel(editor, editor.elementPath().block);
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
            cssUtils.setLevel(editor, editor.elementPath().block);
            setStyle(editor, editor.elementPath().block, self.currentScheme);
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
            cssUtils.setLevel(editor, editor.elementPath().block);
            setStyle(editor, editor.elementPath().block, self.currentScheme);
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
            cssUtils.setNumbering(editor, element);
            cssUtils.setLevel(editor, element);
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
      },
      applyHeadingPreset: {
        clearAutonumberClassesForHeading: function (editor, heading) {
          clearStyles(editor, heading);
          cssUtils.clearLevel(editor, heading);
          cssUtils.clearNumbering(editor, heading);
        },

        setAutonumberClassesForHeading: function (editor, value, heading) {
          cssUtils.setNumbering(editor, heading);
          cssUtils.setLevel(editor, heading);
          self.currentScheme = value;
        },

        handleCollapsedSelection: function (editor) {
          // avoid an extra snapshot created by the matchHeading command
          editor.fire("lockSnapshot", { dontUpdate: true });
          editor.execCommand("matchHeading");
          editor.fire("unlockSnapshot");

          // return the one matched current heading

          return [CKEDITOR.plugins.structuredheadings.getCurrentBlockFromPath(editor)];
        },

        exec: function (editor, value) {
          var selection = editor.getSelection();
          var headings = CKEDITOR.plugins.structuredheadings.getHeadingsInSelection(
                editor,
                selection
              );
          var func;

          if (value === "clear") {
            func = this.clearAutonumberClassesForHeading.bind(this, editor);
          } else {
            func = this.setAutonumberClassesForHeading.bind(this, editor, value);

             // prep the html for the collapsed, not in a heading case
            if (headings === null) {
              // put the new heading into the headings array
              headings = this.handleCollapsedSelection(editor);
            }
          }

          if (headings) {
            for (var i = 0; i < headings.length; i++) {
              func(headings[i]);
            }
          }

          editor.fire("lockSnapshot");
          // the snapshot needs to be locked here, because
          // execCommand will also create a snapshot, leading to
          // an intermediate snapshot with some of the styles applied, but not all

          // apply the correct bulletstyle for all numbered headings
          editor.execCommand("reapplyStyle", value);
          editor.fire("unlockSnapshot");
        }
      },
      applyPresetToList: {
        getPresetStyleArray: function (editor, presetName) {
          if (presetName === "clear") {
            return [editor.config.listClassMappings.clear];
          }

          var styleArray = presetName.split(".").map(function (str) {
            var key = str.trim()[0];
            return editor.config.listClassMappings[key];
          }).filter(function (str) {
            if (str) {
              // also purge empty strings, undef, etc. because I am lazy
              return true;
            } else {
              return false;
            }
          });

          return styleArray;
        },
        numListsInPath: function (elementPath) {
          var elements = elementPath.elements;
          var ols = elements.filter(function isOl(el) {
            return el.getName() === "ol";
          });
          // root would have been included, ignore it
          return ols.length - 1;
        },
        exec: function (editor, presetName) {
          var styleArray = this.getPresetStyleArray(editor, presetName);
          // get the root ordered list
          var path = editor.elementPath();
          // we need to start fromTop or else this returns the leaf rather than root
          var rootList = path.contains("ol", false, true);

          styleArray[0].applyToObject(rootList, editor);

          var childrenLists = rootList.find("ol");

          for (var i = 0; i < childrenLists.count(); i++) {
            var childList = childrenLists.getItem(i);
            // eslint-disable-next-line new-cap
            var elementPath = new CKEDITOR.dom.elementPath(childList, rootList);
            var numLists = this.numListsInPath(elementPath);
            var styleIndex = numLists % styleArray.length;
            styleArray[styleIndex].applyToObject(childList, editor);
          }
        }
      }
    }
  };
})();
