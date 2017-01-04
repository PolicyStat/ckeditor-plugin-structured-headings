(function () {
  var selectedStyle;

  var columns = 4;
  var htmlContent = "";
  htmlContent += "<div>";
  htmlContent += "<table role=\"listbox\"";
  htmlContent += "style=\"width:100%;height:100%;border-collapse:separate;\"";
  htmlContent += "cellspacing=\"2\" cellpadding=\"2\"";
  if (CKEDITOR.env.ie && CKEDITOR.env.quirks) {
    htmlContent += "style=\"position:absolute;\"";
  }
  htmlContent += "><tbody>";

  var markActive = function (element) {
    element.setStyles({
      borderColor: "#000"
    });
  };

  var clearSelection = function (document) {
    var elementList = document.find("*[id*=\"style_\"]");
    for (var i = 0; i < elementList.count(); i++) {
      var element = elementList.getItem(i);
      element.setStyles({
        borderColor: "#eee"
      });
    }
  };

  var onSelect = CKEDITOR.tools.addFunction(function (ev, element) {
    //eslint-disable-next-line new-cap
    ev = new CKEDITOR.dom.event(ev);
    //eslint-disable-next-line new-cap
    element = new CKEDITOR.dom.element(element);
    selectedStyle = element.getAttribute("name");
    clearSelection(element.getDocument());
    markActive(element);
  });

  var buildStyleOption = function (editor, style) {

    var insertion;

    var hasImage = editor.config.autonumberStyleImages[style];

    if (hasImage) {
      var styleImg = CKEDITOR.tools.htmlEncode(editor.config.autonumberStyleImgPath +
              "/" + hasImage);

      insertion = "<div><img style=\"width:100%;height:100%;\"" +
      "alt=\"" + style + "\" src=\"" + styleImg + "\" /> " +
          "<div style=\"margin:0.5em;text-align:center;white-space:normal;\">" + style + "</div></div>";
    } else {
      insertion = "<div style=\"display:table;width:100%;height:100%;text-align:center;\"" +
      "><span style=\"vertical-align:middle;text-align:center;white-space:normal;display:table-cell;\">" + style + "</span></div>";
    }


    //Setup for each style item
    return "<div name=\"" + style + "\"" +
    "style=\"margin:0em 0em 5em;cursor:pointer;display:inline-block;vertical-align:top;text-align:center;border:1px solid;" +
        "height:72px;width:72px;\"" +
    "id=\" style_label_" + CKEDITOR.tools.getNextNumber() + "\"" +
    "onClick=\"CKEDITOR.tools.callFunction(" + onSelect + ", event, this );\"" +
    "value=\"" + style + "\">" + insertion +
    "</div>";
  };

  CKEDITOR.dialog.add("selectStyle", function (editor) {
    var i = 0;

    for (var style in editor.config.autonumberStyles) {

          //If we're at column limit, start new row
      if (i % columns === 0) {
        htmlContent += "<tr>";
      }

      var styleOption = buildStyleOption(editor, style);

      htmlContent += "<td class=\"cke_dark_background cke_centered\"" +
      "style=\"vertical-align: middle;text-align:center;\">" +
      styleOption +
      "</td>";

      //end the new row
      if (i % columns === columns - 1) {
        htmlContent += "</tr>";
      }


      //increment counter
      i++;
    }

    //padding for if last row is short
    if (i < columns - 1) {
      for (; i < columns - 1; i++) {
        htmlContent += "<td></td>";
      }
      htmlContent += "</tr>";
    }

    htmlContent += "</tbody></table></div>";

    return {
      title: "Style Selection",
      minWidth: 400,
      minHeight: 100,
      contents: [
        {
          id: "tab-style",
          label: "test",
          title: "test tab",
          elements: [
            {
              type: "html",
              html: htmlContent
            }
          ],
          style: "width: 100%; border-collapse: separate;"
        }

      ],
      onOk: function () {
        if (editor.execCommand("setCurrentStyle", selectedStyle)) {
          editor.execCommand("reapplyStyle");
        }
      },
      onShow: function () {
        var document = this.getElement().getDocument();

        clearSelection(document);

      //Set current style as active
        var element = document.findOne("*[name='" +
          editor.config.autonumberCurrentStyle + "']");

        if (element) {
          markActive(element);
        }
      }
    };
  });
})();
