(function () {
  CKEDITOR.plugins.add("structuredheadings", {
    icons: "autonumberheading, toggleheading",
    init: function (editor) {
      // list of elements allowed to be numbered
      var allowedElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

      editor.addContentsCss(this.path + "styles/numbering.css");

      // Helper function to set button state
      var setCommandState = function (command,state) {
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

      // The command to add an autonumbering class to selection
      editor.addCommand("autoNumberHeading", {
        allowedContent: "h1(*); h2(*); h3(*); h4(*); h5(*); h6(*)",
        startDisabled: true,
        exec: function () {
          var element = editor.getSelection().getStartElement();

          if (!isNumbered(element)) {
            element.addClass("autonumber");
            setCommandState("autoNumberHeading","on");
          } else {
            element.removeClass("autonumber");
            setCommandState("autoNumberHeading","off");
          }
        }
      });
      
      editor.addCommand("toggleHeading", {
	  startDisabled: true,
	  exec: function () {
	    var element = editor.getSelection().getStartElement();
	    //find previous element that matches allowedElements
	    var previousHeader = element.getPrevious( function (node) {
		if(allowedElements.indexOf(node.getName()) >= 0) {
		    return true;
		}
	    });
	    
	    //Get previous element style (type) and apply to current selection, otherwise new H1
	    if(previousHeader) {
              var style = new CKEDITOR.style( { element: previousHeader.getName()});
	      // if previous was numbered, set the new  one to numbered also
	      if(isNumbered(previousHeader)) {
		  style = new CKEDITOR.style( { element: previousHeader.getName(),
		      				attributes: {'class': 'autonumber'}});
	      }
	      editor.applyStyle( style );
	    } else {
	      var style = new CKEDITOR.style( { element: "h1" } );
	      editor.applyStyle( style );
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
        editor.ui.addButton("toggleheading", {
            label: "Toggle Heading",
            command: "toggleHeading",
            toolbar: "styles,1"
          });
      }

      /* Set button state on selection change.
      * On/off for element style, disabled for invalid element
      */
      editor.on("selectionChange", function (e) {
        var element = e.data.selection.getStartElement();
        
        if (allowedElements.indexOf(element.getName()) >= 0) {
          //if is autonumbered, update state appropriately
          if (isNumbered(element)) {
            setCommandState("autoNumberHeading","on");
          } else {
            setCommandState("autoNumberHeading","off");
          }
          
          // if it's any header, turn set toggle heading on
          setCommandState("toggleHeading","on");
        
        /* special case for p tags, for toggleHeading command, could be handled better
        * this is to allow toggleHeading active on p tags without including it in
        * our allowedElements for autonumbering
        */
        } else if (element.getName() === "p") {
            setCommandState("toggleHeading", "off");
            setCommandState("autoNumberHeading","disabled");
        //disable otherwise
        } else {
          setCommandState("autoNumberHeading","disabled");
          setCommandState("toggleHeading","disabled");
        }

      });
    }
  });
})();
