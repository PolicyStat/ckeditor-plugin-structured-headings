CKEDITOR.dialog.add("selectStyle", function (editor) {

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

  //build out HTML
  (function () {
    var i = 0;

    for (var style in editor.config.autonumberStyles) {

          //If we're at column limit, start new row
      if (i % columns === 0) {
        htmlContent += "<tr>";
      }

      //Setup for each style item
      var styleOption = [];
      styleOption += "<input type=\"radio\" name=\"styleChooser\" style=\"text-align: center;\"" +
      "id=\" style_label_" + i + "_" + CKEDITOR.tools.getNextNumber() + "\"" +
      "value=\"" + style + "\">" + style +
      "</input>";

      htmlContent += "<td class=\"cke_dark_background cke_centered\"" +
      "style=\"vertical-align: middle;\">" +
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

  })();

  return {
    title: "Style Selection",
    minWidth: 400,
    minHeight: 200,
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
      var style = this.getElement().getDocument().findOne("input:checked").getValue();
      if (editor.execCommand("setCurrentStyle", style)) {
        editor.execCommand("reapplyStyle");
      }
    },
    onShow: function () {
      var document = this.getElement().getDocument();

      //Set current style input as active
      var elementList = document.find("input[value='" +
              editor.config.autonumberCurrentStyle + "']");
      if (elementList.count() > 0) {
        var element = elementList.getItem(0);
        element.$.checked = true;
        element.focus();
      } else {
        document.find("input").getItem(0).$.checked = true;
      }
    }
  };
});
