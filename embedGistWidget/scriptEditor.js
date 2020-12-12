my_widget_script =
{
    init: function (mode, json_data) {
        //this method is called when the form is being constructed
        // parameters
        // mode = if it equals 'view' than it should not be editable
        //        if it equals 'edit' then it will be used for entry
        //        if it equals 'view_dev' same as view,  does some additional checks that may slow things down in production
        //        if it equals 'edit_dev' same as edit,   does some additional checks that may slow things down in production

        // json_data will contain the data to populate the form with, it will be in the form of the data
        // returned from a call to to_json or empty if this is a new form.
        //By default it calls the parent_class's init.

        //Uncomment debugger to be able to inspect and view code
        //debugger;

        var jsonString;
        //check if string or function because preview test is function and page is string
        if (typeof json_data === "string") {
            jsonString = json_data;
        } else {
            jsonString = json_data();
        };
        //Take input string into js object to be able to use elsewhere
        var parsedJson = JSON.parse(jsonString);

        //Uncomment to print parsedJson to consol
        //console.log("init", parsedJson);

        //TO DO check non-widgetData json objects and re-initialize appropriate page contents
        // use parsedJson.[objectName]

        if (mode !== "edit" && mode !== "edit_dev") {
            $("#entryDiv").hide()
        };

        //Run the "updateGistFrame" function when clicked
        $("#gistFrameButton").click(my_widget_script.updateGistFrame);

        //when the size of the window changes, run the resize function
        window.onresize = my_widget_script.resize;

        //use the expected LabArchives data (just the stringified widgetData)
        this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

        var srcCode = $("#srcCode").val(); //Get the src from the entry box

        if (srcCode) { //if there's a value to srcCode
            my_widget_script.updateGistFrame();
        }

        $('#the_form').find('select, textarea, input').each(function () { //find each select field, textarea, and input
            if ($(this).prop('required')) { //if has the attribute "required"
                $(this).after("<span style='color:red'>*</span>"); //add asterisk after
            }
        });

    },

    to_json: function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry

        //looks at HTML and gets input data. Gives a string
        var widgetJsonString = this.parent_class.to_json();

        //TO DO - create any additional variables to monitor dynamic content
        //These should ultimately be very simple. Something like true/false or a number

        //TO DO - add additional information to this output variable
        //access within init function
        var output = { widgetData: JSON.parse(widgetJsonString) };

        //EXAMPLE:
        //var output = { widgetData: JSON.parse(widgetJsonString), newSrc: newSrc };

        //uncomment to check stringified output - note that complicated objects like divs cannot be passed this way
        //var stringedOutput = JSON.stringify(output);
        //console.log("to JSON", stringedOutput);

        // return stringified output
        return JSON.stringify(output);
    },

    from_json: function (json_data) {
        //populates the form with json_data
        //TO DO write code specific to your form
        this.parent_class.from_json(json_data);
    },

    test_data: function () {
        //during development this method is called to populate your form while in preview mode
        //TO DO write code specific to your form
        return this.parent_class.test_data();
    },

    is_valid: function (b_suppress_message) {
        //called when the user hits the save button, to allow for form validation.
        //returns an array of dom elements that are not valid - default is those elements marked as mandatory
        // that have no data in them.
        //You can modify this method, to highlight bad form elements etc...
        //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
        //Returning an empty array [] or NULL equals no error
        //TO DO write code specific to your form
        //validate fields
        // source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
        var fail = false; //begin with a fail variable that is false
        var fail_log = ''; //begin with an empty fail log
        var name; //create a name variable

        $('#the_form').find('select, textarea, input').each(function () { //search the_form for all elements that are of type
            //select, textarea, or input
            if (!$(this).prop('required')) { //if this element does not have a required attribute
                //don't change anything (fail remains false)
            } else { //if there is a required attribute
                if (!$(this).val()) { //if there is not a value for this input
                    fail = true; //change fail to true
                    name = $(this).attr('id'); //replace the name variable with the id attribute of this element
                    fail_log += name + " is required \n"; //add to the fail log that this name is required
                }

            }
        });

        if (fail) { //if fail is true (meaning a required element didn't have a value)
            return alert(fail_log); //return the fail log as an alert
        } else {
            var noErrors = [];
            return noErrors;
        }; //otherwise, return empty array

        //this is the LabArchives default is_valid function
        //return this.parent_class.is_valid(b_suppress_message);
    },

    is_edited: function () {
        //should return true if the form has been edited since it was loaded or since reset_edited was called
        return this.parent_class.is_edited();
    },

    reset_edited: function () {
        //typically called have a save
        //TO DO write code specific to your form
        return this.parent_class.reset_edited();
    },

    updateGistFrame: function () {
        //alert("pressed");
        // source: https://gist.github.com/jeremiahlee/1748966
        // This gist was vital to creating this widget that dynamically updates the embedded gist

        // Create an iframe, append it to this document where specified

        var srcCode = $("#srcCode").val(); //Get the src from the entry box

        if (srcCode) { //if there is a srcCode entered 

            var linkToGist = "<a href=\"" + srcCode + "\" target=\"_blank\" >Click here for Gist</a>";

            $("#showSource").html(linkToGist);

            var fileName = $("#fileName").val();

            var appendFileName = "";

            if (fileName) {
                appendFileName = "?file=" + fileName;
            }
            //alert(appendFileName);

            var iFrameHeight = $("#iFrameHeight").val(); //Get the height

            var gistFrame = document.createElement("iframe");
            gistFrame.setAttribute("width", "100%");
            gistFrame.id = "gistFrame";

            var zone = document.getElementById("gistZone");
            zone.innerHTML = "";
            zone.appendChild(gistFrame);

            // Create the iframe's document
            var gistFrameHTML = '<html><body><scr' + 'ipt type="text/javascript" src="' + srcCode + '.js' + appendFileName + '"></sc' + 'ript></body></html>';

            // Set iframe's document with a trigger for this document to adjust the height
            var gistFrameDoc = gistFrame.document;

            if (gistFrame.contentDocument) {
                gistFrameDoc = gistFrame.contentDocument;
            } else if (gistFrame.contentWindow) {
                gistFrameDoc = gistFrame.contentWindow.document;
            }

            gistFrameDoc.open();
            gistFrameDoc.writeln(gistFrameHTML);
            gistFrameDoc.close();

            //console.log("iframe added");

            my_widget_script.adjustIframeSize(iFrameHeight);
            my_widget_script.resize();
        } else { alert("Please enter a Gist Link"); }

    },

    adjustIframeSize: function (newHeight) {
        //alert("adjustIframeSize was called");
        var i = document.getElementById("gistFrame");
        i.style.height = parseInt(newHeight) + "px";
        //console.log("size adjusted", newHeight);
        //resize the container after creating or deleting or modifying content
        my_widget_script.parent_class.resize_container();
    },

    resize: function () {
        var width = window.innerWidth;
        $("#gistZone").width(width * .95); //make width 95% of current width
        //resize the container after creating or deleting or modifying content
        my_widget_script.parent_class.resize_container();
    }
}
