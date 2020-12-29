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

        //uncomment to inspect and view code while developing
        //debugger;

        $('#jQueryScript')
            .prop("src", "https://code.jquery.com/jquery-3.5.1.min.js")
            .prop("integrity", "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=");

        $('#bootstrapJS')
            .prop("src", "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js")
            .prop("integrity", "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl");

        //Get the parsed JSON data
        var parsedJson = this.parseInitJson(json_data);

        //Uncomment to print parsedJson to consol
        //console.log("init", parsedJson);

        //check parsedJson for info not contained in form inputs and reinitialize
        this.initDynamicContent(parsedJson);

        //adjust form design and buttons based on mode
        this.adjustForMode(mode);

        //resize the content box when the window size changes
        window.onresize = this.resize;

        //Define behavior when buttons are clicked or checkboxes/selctions change
        this.addEventListeners(parsedJson);

        // Initialize the form with the stored widgetData using the parent_class.init() function
        this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

        // Add * and # to mark required field indicators
        this.addRequiredFieldIndicators();

        // Set up the form based on previously entered form input
        this.setUpInitialState();
    },

    to_json: function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry

        //Acquire input data from the form using the parent_class.to_json() function
        var widgetJsonString = this.parent_class.to_json();

        //Get information about any dynamic content that may have been created
        var addedRows = this.getDynamicContent();

        // Add widgetData and any additional dynamic content to an output object
        // Will be accessed within the init and from_json methods
        var output = { widgetData: JSON.parse(widgetJsonString), addedRows: addedRows };

        //uncomment to check stringified output
        //console.log("to JSON", JSON.stringify(output));

        // return stringified output
        return JSON.stringify(output);
    },

    from_json: function (json_data) {
        //populates the form with json_data

        // all data in string format within json_data is parsed into an object parsedJson
        var parsedJson = JSON.parse(json_data);

        //use parsedJson to get widgetData and turn into a string
        //parent class uses the widget data to fill in inputs
        this.parent_class.from_json(JSON.stringify(parsedJson.widgetData));
    },

    /**
    * In preview, the form is populated with test data when the
    * parent_class.test_data() function is called. This randomly selects options for 
    * dropdown select menus, radio buttons, and checkboxes.
    */
    test_data: function () {
        //during development this method is called to populate your form while in preview mode

        // ORIGINAL LABARCHIVES RETURN FOR TEST DATA
        //return this.parent_class.test_data();

        // CUSTOM TEST DATA

        //store the outcome of the the test data within the testData variable
        var testData = JSON.parse(this.parent_class.test_data());

        //If no additional dynamic content 
        //var output = { widgetData: testData };

        //Add additional content to match the objects in to_json
        var output = { widgetData: testData, addedRows: 2 }; //When in development, initialize with 2 addedRows

        //return the stringified output for use by the init function
        return JSON.stringify(output);
    },

    /**
    * This function determines whether or not the user is allowed to save the widget to the page
    * 
    * The original LabArchives function checks for fields that have _mandatory appended to the name attribute
    * 
    * The custom function checks for fields with the required attribute. If any of these fields are blank, 
    * an alert is returns that provides a fail log with the ids of the elements that are missing. If there are
    * no blank required fields, an empty array is returned.
    * 
    * source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    */
    is_valid: function (b_suppress_message) {
        //called when the user hits the save button, to allow for form validation.
        //returns an array of dom elements that are not valid - default is those elements marked as mandatory
        // that have no data in them.
        //You can modify this method, to highlight bad form elements etc...
        //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
        //Returning an empty array [] or NULL equals no error
        //TO DO write code specific to your form

        //ORIGINAL LABARCHIVES IS_VALID FUNCTION
        //return this.parent_class.is_valid(b_suppress_message);

        //CUSTOM FUNCTION TO CHECK REQUIRED ITEMS
        var fail = false; //begin with a fail variable that is false
        var fail_log = ''; //begin with an empty fail log
        var name; //create a name variable

        //search the_form for all elements that are of type select, textarea, or input
        $('#the_form').find('select, textarea, input').each(function () {
            if (!$(this).prop('required')) { //if this element does not have a required attribute
                //don't change anything (fail remains false)
            } else { //if there is a required attribute
                if (!$(this).val()) { //if there is not a value for this input
                    fail = true; //change fail to true
                    name = $(this).attr('id'); //replace the name variable with the name attribute of this element
                    fail_log += name + " is required \n"; //add to the fail log that this name is required
                }

            }
        });

        if (fail) { //if fail is true (meaning a required element didn't have a value)
            return alert(fail_log); //return the fail log as an alert
        } else {
            var noErrors = [];
            return noErrors;
        } //otherwise, return empty array
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

    // ********************** CUSTOM METHODS USED BY INIT METHOD **********************
    parseInitJson: function (json_data) {
        var jsonString;
        //check if string or function because preview test is function and page is string
        if (typeof json_data === "string") {
            jsonString = json_data;
        } else {
            jsonString = json_data();
        }
        //Take input string into js object to be able to use elsewhere
        var parsedJson = JSON.parse(jsonString);
        return (parsedJson);
    },

    /**
    * TO DO: edit this function to reinitialize any dynamic content that is not explicity
    * defined within the HTML code. 
    * 
    * This function requires the parsedJson object.
    * 
    * Here, we are getting the number of addedRows (defined in to_json) from the parsedJson 
    * object and then using the createRow function to remake those rows
    */
    initDynamicContent: function (parsedJson) {
        for (var i = 0; i < parsedJson.addedRows; i++) {
            var tableName = $("#exampleTable");
            my_widget_script.createRow(tableName);
        };
    },

    /**
    * TO DO: edit this function to define how the HTML elements should be adjusted
    * based on the current mode.
    * 
    * Here, a subset of buttons are disabled when the widget is not being edited.
    * There may be other elements that should be shown/hidden based on the mode
    */
    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $("#myButton").prop('disabled', true);
            $("#calculate").prop('disabled', true);
            $("#addRow").prop('disabled', true);
            $("#removeRow").prop('disabled', true);
        }
    },

    /**
    * TO DO: edit this function to define behavior when the user interacts with the form.
    * This could include when buttons are clicked or when inputs change.
    */
    addEventListeners: function () {
        //Run my button function when clicked
        $('#myButton').on("click", function () {
            my_widget_script.myButtonFunc();
        });

        //Show/hide the table
        $("#toggleTable").on("click", function () { //when the showTable button is clicked. Run this function
            //alert("button pressed");
            my_widget_script.resize();
            my_widget_script.data_valid_form(); //run to give error, but allow to calc regardless
            my_widget_script.calcValues();
            $("#tableDiv").toggle();
            my_widget_script.parent_class.resize_container();
        });

        //when the calculate button is clicked, run the calcValues function
        $('#calculate').on("click", function () {
            my_widget_script.data_valid_form(); //run to give error, but allow to calc regardless
            my_widget_script.calcValues();

        });

        //when the toCSV button is clicked, run the exportTableToCSV function
        $('#toCSV').on("click", function () {
            var data_valid = my_widget_script.data_valid_form();
            //alert(data_valid);
            if (data_valid) {
                my_widget_script.calcValues();
                my_widget_script.exportTableToCSV('templateData', 'outTable');
            }
        });

        //When the copy button is clicked, run the copyTableRow function
        $("#copyDataButton").on("click", function () {
            var data_valid = my_widget_script.data_valid_form();
            //alert(data_valid);
            if (data_valid) {
                //alert("I'm clicked");
                my_widget_script.resize();
                my_widget_script.calcValues();
                $("#tableDiv").show();
                my_widget_script.copyTableRow();
            } else {
                alert("Nothing was copied");
            }
        });

        //When the "addDivCheck" checkbox is changed, run this function
        $('#showCheck').on("change", function () { //change rather than click so that it runs only when editable
            //alert("You clicked me!");
            if ($(this).is(":checked")) {
                //alert("I'm checked");
                $("#myContentID").show();
            } else {
                //alert("I'm not checked")
                $("#myContentID").hide();
            }
        });

        $("#addRow").on("click", function () {
            var tableName = $("#exampleTable");

            my_widget_script.createRow(tableName);
        });

        $("#removeRow").on("click", function () {
            var tableName = ("#exampleTable");

            my_widget_script.deleteRow(tableName);
        });

        $("#numDays").on("input", function () {
            if ($("#startDate").val()) {
                my_widget_script.addDays($("#numDays").val());
            } else {
                $("#newDate").text("Enter start date")
            }
        });

        $("#startDate").on("input", function () {
            if ($("#numDays").val()) {
                my_widget_script.addDays($("#numDays").val());
            } else {
                $("#newDate").text("Enter number of days")
            }
        });
    },

    /**
    * TO DO: edit this function to define the symbols that should be added to the HTML
    * page based on whether or not a field is required to save the widget to the page
    * 
    * Here, the function adds a blue # after fields of the class "needForForm" and a 
    * red * after fields with the "required" property
    */
    addRequiredFieldIndicators: function () {
        $('.needForTable').each(function () { //find element with class "needForForm"
            //alert($(this).val());
            $(this).after("<span style='color:blue'>#</span>"); //add # after
        });

        //source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
        $('#the_form').find('select, textarea, input').each(function () { //find each select field, textarea, and input
            if ($(this).prop('required')) { //if has the attribute "required"
                $(this).after("<span style='color:red'>*</span>"); //add asterisk after
            }
        });
    },

    /**
    * TO DO: edit this function to define how the form should be initilized based 
    * on the existing form values. This is particularly important for when the 
    * widget already has data entered, such as when saved to a page.
    */
    setUpInitialState: function () {
        //Run the calculate values method to fill with the loaded data
        this.calcValues();

        //Check initial state of checkbox
        if ($('#showCheck').is(":checked")) {
            //alert("I'm checked");
            $("#myContentID").show();
        } else {
            //alert("I'm not checked")
            $("#myContentID").hide();
        };

        //row background based on check
        $('.rowCheck').each(function () {
            if ($(this).is(':checked')) {
                $(this).closest("tr").css("background-color", "lightgrey");
            } else {
                $(this).closest("tr").css("background-color", "");
            }
        });

        //row select background based on selectio
        $('.rowSelect').each(function () {
            switch ($(this).val()) {
                case '':
                    $(this).css("background-color", "");
                    break;
                case "1":
                    $(this).css("background-color", "lightgreen");
                    break;
                case "2":
                    $(this).css("background-color", "skyblue");
                    break;
                case "3":
                    $(this).css("background-color", "lightpink");
                    break;
            }
        });

        //Print new date
        if ($("#numDays").val() && $("#startDate").val()) {
            my_widget_script.addDays();
        } else if (!$("#numDays")) {
            $("#newDate").text("Enter number of days");
        } else {
            $("#newDate").text("Enter start date")
        };

        //Add classes to add bootstrap styles for left column in form
        $('.myLeftCol').addClass("col-6 col-md-4 col-lg-3 col-xl-2 text-right");

    },

    /**
    * TO DO: edit this function to define which <div>s or other elements
    * should be adjusted based on the current width of the window
    */
    resize: function () {
        //gets the inner width of the window.
        var width = window.innerWidth;

        //make width of table div 95% of current width
        $(".tableDiv").width(width * .95);

        //resize the container
        my_widget_script.parent_class.resize_container();
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        // These should be simple variables, such as true/false, a number, or a state
        // This cannot be something complex like a full <div>

        var addedRows = $("#exampleTable").find("tbody tr").length;
        return addedRows;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

    /** -----------------------------------------------------------------------------
    * VALIDATE FORM ENTRY BEFORE COPYING OR SAVING TABLE TO CSV
    *
    * This function will check that elements with a class "needForTable"
    * are not blank. If there are blank elements, it will return false
    * and will post an error message "Please fill out all elements marked by a blue #"
    *
    * source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    * -----------------------------------------------------------------------------
    */
    data_valid_form: function () {
        var valid = true; //begin with a valid value of true
        //var fail_log = ''; //begin with an empty fail log
        //var name; //create a name variable

        //search the_form for all elements that are of class "needForForm"
        $('.needForTable').each(function () {
            if (!$(this).val()) { //if there is not a value for this input
                valid = false; //change valid to false
                //name = $(this).attr('id'); //replace the name variable with the id attribute of this element
                //fail_log += name + " is required \n"; //add to the fail log that this name is required
            }
        });

        if (!valid) {
            $("#errorMsg").html("<span style='color:red; font-size:36px;'>Please fill out all elements marked by a</span><span style='color:blue; font-size:36px;'> blue #</span>");
        } else {
            $("#errorMsg").html("");
        }

        return valid;
    },

    myButtonFunc: function () {
        alert("I've been clicked!");
    },

    /**
    * This function takes form input and adds them to the corresponding
    * divs within the output table.
    * 
    * For elements that are blank or NaN, the function provides an output of NA
    * 
    * Calls the resize function at the end
    */
    calcValues: function () {
        //Column A
        var ColumnA = $("#ColumnA").val();
        $("#ColumnA_calc").text(ColumnA);

        //ColumnB
        var ColumnB = $("#ColumnB").val();
        $("#ColumnB_calc").text(ColumnB);

        $("#outTable tr").each(function () { //for each row
            $("td", this).each(function () { //for each cell
                var value = $(this).text(); //get the value of the text
                if (value === "" || value === "NaN") { //if blank or NaN
                    $(this).text("NA"); //make NA
                }
            })
        });

        //resize the tableDiv
        my_widget_script.resize();

    },

    /**
    * 
    * This function takes a csv element and filename that are passed from the
    * exportTableToCSV function.
    * 
    * This creates a csvFile and builds a download link that references this file.
    * The download link is "clicked" by the function to prompt the browser to 
    * download this file
    * 
    * source: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
    */
    downloadCSV: function (csv, filename) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], { type: "text/csv" });

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    },

    /**
    * This function takes a filename and table name (both strings) as input
    * It then creates a csv element from the table
    * This csv element is passed to the downloadCSV function along with the filename
    * 
    * source: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
    */
    exportTableToCSV: function (filename, table) {
        var csv = [];
        var datatable = document.getElementById(table);
        var rows = datatable.querySelectorAll("tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) {
                var cellText = '"' + cols[j].innerText + '"'; //add to protect from commas within cell
                row.push(cellText);
            };

            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    },

    /** 
    * This function creates a temporary textarea and then appends the contents of the
    * specified table body to this textarea, separating each cell with a tab (\t).
    * Because the script editor in LA is within a <textarea> the script cannot contain
    * the verbatim string "textarea" so this must be separated as "text" + "area"
    * to avoid errors.
    * 
    * If copying a table that has form inputs, then need to refer to the children of 
    * <td> tags, and get the values by using .val() instead of .text()
    * 
    * If copying a table that could have multiple table rows (<tr>), the use the 
    * \n new line separator
    * 
    * The temporary <textarea> is appended to the HTML form, focused on, and selected.
    * Note that this moves the literal page focus, so having this append near the 
    * button that calls this function is best. After the <textarea> is copied, it is
    * then removed from the page.
    */
    copyTableRow: function () {
        //create a temporary text area
        var $temp = $("<text" + "area style='opacity:0;'></text" + "area>");

        $("#outTable tbody").children("tr").each(function () { //add each child of the row
            var addTab = "";
            $(this).find("td").each(function () {
                //alert($(this).text());
                if ($(this).text()) {
                    var addText = $(this).text();
                } else {
                    var addText = "NA"
                }
                $temp.text($temp.text() + addTab + addText);
                addTab = "\t";
                //alert($temp.text());
            });
        });

        $temp.appendTo($('#tableDiv')).focus().select(); //add temp to tableDiv and select
        document.execCommand("copy"); //copy the "selected" text
        $temp.remove(); //remove temp
    },

    /* -----------------------------------------------------------------------------
    ** This function creates a new row at the end of the specified table.
    ** 
    ** This template contains examples for date, number, text, checkbox, select, 
    ** and textarea inputs. It also demonstrates how to add event listeners for 
    ** this new dynamic content, which cannot just be defined within the init function
    ** as these elements do not exist when the page is first initialized.
    **
    ** Because the script editor in LA is within a <textarea> the script cannot contain
    ** the verbatim string "textarea" so this must be separated as "text" + "area"
    ** to avoid errors. 
    ** -----------------------------------------------------------------------------
    */
    createRow: function (tableName) {
        var rowCount = $(tableName).find("tbody tr").length + 1;
        var rowID = "Row_" + rowCount;

        var col1ID = "col1_" + rowCount;
        var col2ID = "col2_" + rowCount;
        var col3ID = "col3_" + rowCount;
        var col4ID = "col4_" + rowCount;
        var col5ID = "col5_" + rowCount;
        var col6ID = "col6_" + rowCount;

        $(tableName).find("tbody").append(
            $('<tr></tr>', { //add a new row
                id: rowID //give this row the rowID
            }).append(
                $('<td></td>').append( //append a new td to the row
                    $('<input/>', { //append a new input to the td
                        id: col1ID,
                        name: col1ID,
                        type: "date" //make it type "date"
                    })
                )
            ).append(
                $('<td></td>').append(
                    $('<input/>', {
                        id: col2ID,
                        name: col2ID,
                        type: "number"
                    })
                )
            ).append(
                $('<td></td>').append(
                    $('<input/>', {
                        id: col3ID,
                        name: col3ID
                    })
                )
            ).append(
                $('<td></td>').append(
                    $('<input/>', {
                        id: col4ID,
                        name: col4ID,
                        type: "checkbox",
                        "class": "rowCheck"
                    }).on("change", function () { //make the background color of the row grey when checked
                        if ($(this).is(":checked")) {
                            $(this).closest("tr").css("background-color", "lightgrey");
                        } else {
                            $(this).closest("tr").css("background-color", "");
                        }
                    })
                )
            ).append(
                $('<td></td>').append( //append a new td to the row
                    $('<select></select>', { //append a new select to the td
                        id: col5ID,
                        name: col5ID,
                        "class": "rowSelect"
                    }).append( //append options to the select tag
                        "<option value=''>[Select]</option>",
                        "<option value='1'>Green</option>",
                        "<option value='2'>Blue</option>",
                        "<option value='3'>Red</option>"
                    ).on("change", function () { //change the background color
                        switch ($(this).val()) {
                            case '':
                                $(this).css("background-color", "");
                                break;
                            case "1":
                                $(this).css("background-color", "lightgreen");
                                break;
                            case "2":
                                $(this).css("background-color", "skyblue");
                                break;
                            case "3":
                                $(this).css("background-color", "lightpink");
                                break;
                        }
                    })
                )
            ).append(
                $('<td></td>').append( //append a new td to the row
                    //append a new text area to the script. this string has to be split to make LA happy
                    //the widget script entry is within a text area, and if it finds another here, it 
                    //thinks that it has reached the end of the script
                    $('<text' + 'area></text' + 'area>', {
                        id: col6ID,
                        name: col6ID
                    })
                )
            )
        );

        //resize the container
        my_widget_script.resize();
    },

    /* -----------------------------------------------------------------------------
    ** This function deletes the last row of the table body for the given table
    ** and then resizes the container and tableDiv.
    ** -----------------------------------------------------------------------------
    */
    deleteRow: function (tableName) {
        var lastRow = $(tableName).find("tbody tr").last();
        $(lastRow).remove();

        //resize the container
        my_widget_script.resize();
    },

    addDays: function (numDays) {
        //debugger;
        var dateString = $("#startDate").val(); //get the date string from the input

        var startDate = new Date(dateString);

        var offset = new Date().getTimezoneOffset(); //get the offset of local time from GTC
        // this is necessary because making a Date object from the input date string creates a date with time of midnight GTC
        // for locales with different time zones, this means that the Date displayed could be the previous day

        //Add the number of days (in ms) and offset (in ms) to the start Date (in ms) and make it a new date object
        var newDate = new Date(startDate.getTime() + numDays * 24 * 60 * 60 * 1000 + offset * 60 * 1000);

        $("#newDate").text(newDate.toDateString());
    }

    /* -----------------------------------------------------------------------------
    ** DEFINE ADDITIONAL METHODS HERE
    **
    ** Be sure that there is a comma after previous method
    **
    ** my_widget_script.parent_class.resize_container(); should be called each time
    ** content is created, modified, or deleted within a function.
    ** -----------------------------------------------------------------------------
    */

};