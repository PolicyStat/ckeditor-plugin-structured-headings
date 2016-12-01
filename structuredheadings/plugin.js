(function () {
  CKEDITOR.plugins.add("structuredheadings", {
    init: function (editor) {
      // actually, no return is required, but this shuts eslint up
      return editor;
    }
  });
})();
