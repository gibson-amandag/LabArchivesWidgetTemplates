my_widget_script =
{   
    to_json: function () {
        //Acquire input data from the form using the parent_class.to_json() function
        var widgetJsonString = this.parent_class.to_json();

        //Get information about any dynamic content that may have been created
        var dynamicContent = this.getDynamicContent();

        // Add widgetData and any additional dynamic content to an output object
        // Will be accessed within the init and from_json methods
        var output = { 
            widgetData: JSON.parse(widgetJsonString), 
            addedRows: dynamicContent.addedRows 
        };

        //uncomment to check stringified output
        //console.log("to JSON", JSON.stringify(output));

        // return stringified output
        return JSON.stringify(output);
    },

    test_data: function () {
        //store the outcome of the the test data within the testData variable
        var testData = JSON.parse(this.parent_class.test_data());

        //Add additional content to match the objects in to_json
        var output = { widgetData: testData, addedRows: 2 }; //When in development, initialize with 2 addedRows

        //return the stringified output for use by the init function
        return JSON.stringify(output);
    },

    initDynamicContent: function (parsedJson) {
        for (var i = 0; i < parsedJson.addedRows; i++) {
            var $table = $("#exampleTable");
            my_widget_script.createRow($table);
        }
    },

    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $(".disableOnView").prop("disabled", true);
        }
    },
    
    addEventListeners: function () {
        $("#addRow").on("click", function () {
            var $table //TO DO add table
            my_widget_script.createRow($table);
        });

        $("#removeRow").on("click", function () {
            var $table //TO DO add table
            my_widget_script.deleteRow($table);
        });
    },

    setUpInitialState: function () {
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
    },
    
    resize: function () {
        //resize the container
        my_widget_script.parent_class.resize_container();
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        var addedRows = $("#exampleTable").find("tbody tr").length;
        var dynamicContent = {addedRows: addedRows};
        return dynamicContent;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

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
   createRow: function ($table) {
        var rowCount = $table.find("tbody tr").length + 1;
        var rowID = "Row_" + rowCount;

        var col1ID = "col1_" + rowCount;
        var col2ID = "col2_" + rowCount;
        var col3ID = "col3_" + rowCount;
        var col4ID = "col4_" + rowCount;
        var col5ID = "col5_" + rowCount;
        var col6ID = "col6_" + rowCount;

        $table.find("tbody").append(
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
    deleteRow: function ($table) {
        var proceed = confirm("Are you sure you want to remove the row?");
        if(proceed){
            var lastRow = $(tableName).find("tbody tr").last();
            $(lastRow).remove();
    
            //resize the container
            my_widget_script.resize();
        }
    }
};