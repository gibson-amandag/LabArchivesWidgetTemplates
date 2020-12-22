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


    /* -----------------------------------------------------------------------------
    ** USE DEBUGGER TO INSPECT AND VIEW CODE
    ** -----------------------------------------------------------------------------
    */

    //debugger;

    /* -----------------------------------------------------------------------------
    ** CREATE jsonString AND parsedJSON VARIABLEs FROM json_data
    ** -----------------------------------------------------------------------------
    */
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

    /* -----------------------------------------------------------------------------
    ** CHECK parsedJson FOR INFORMATION NOT CONTAINED IN FORM INPUTS
    **
    ** Content that is created dynamically and therefore not contained wtihin the 
    ** HTML script cannot be passed by the default json_data behavior of LA widgets.
    ** This additional information has to be passed within to_json
        ** This could include something such as row number or the existance of a div
    ** That information that then has to be used here to re-initialize the
    ** appropriate page contents. Use parsedJson.[objectName] to get this data
    ** -----------------------------------------------------------------------------
    */

    ///adds rows back to exampleTable when initializing
    for (var i = 0; i < parsedJson.addedRows; i++) {
        var tableName = $("#discussionTable");
        my_widget_script.createRow(tableName);
    }

    /* -----------------------------------------------------------------------------
    ** ADJUST FORM DESIGN AND BUTTONS BASED ON MODE
    
    ** If you do not want a button to be available when not editing disable it here
    ** If you do not want certain elements to be available when not editing,
    ** hide them here
    ** -----------------------------------------------------------------------------
    */

    if (mode !== "edit" && mode !== "edit_dev") {
        //disable when not editing
        $("#addRow").prop('disabled', true);
        $("#removeRow").prop('disabled', true);
    };

    /* -----------------------------------------------------------------------------
    ** RESIZE THE CONTENT BOX WHEN THE WINDOW SIZE CHANGES
    ** -----------------------------------------------------------------------------
    */

    window.onresize = my_widget_script.resize;

    /* -----------------------------------------------------------------------------
    ** DEFINE BEHAVIOR WHEN BUTTONS ARE CLICKED OR CHECKBOXES/SELECTIONS CHANGE
    ** -----------------------------------------------------------------------------
    */

    $("#addRow").click(function () {
        var tableName = $("#discussionTable");
        my_widget_script.createRow(tableName);
    });

    $("#removeRow").click(function () {
        var tableName = ("#discussionTable");
        my_widget_script.deleteRow(tableName);
    });

    /* -----------------------------------------------------------------------------
    ** INITIALIZE THE FORM WITH THE STORED WIDGET DATA
    ** -----------------------------------------------------------------------------
    */

    //use the expected LabArchives data (just the stringified widgetData)
    this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

    /* -----------------------------------------------------------------------------
    ** ADD RED ASTERISKS AFTER REQUIRED FIELDS
    ** -----------------------------------------------------------------------------
    */

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

    /* -----------------------------------------------------------------------------
    ** ADD ADDITIONAL FUNCTIONS AND STEPS THAT SHOULD BE TAKEN TO INITIALIZE HTML

    ** For example, ensure that shown/hiden elements are properly displayed
    ** based on the contents of the form
    ** -----------------------------------------------------------------------------
    */

    $(".ckbx").each(function () {
        if($(this).is(":checked")){
            $(this).closest("tr").css("background-color", "lightpink");
        } else {
            $(this).closest("tr").css("background-color", "");
        };
    })
    
},

to_json: function () {
    //should return a json string containing the data entered into the form by the user
    //whatever is return from the method is persisted in LabArchives.  must not be binary data.
    //called when the user hits the save button, when adding or editing an entry

    /* -----------------------------------------------------------------------------
    ** ACQUIRE INPUT DATA FROM THE FORM
    **
    ** This uses LabArchives's to_json() function to get the form data as a string
    ** -----------------------------------------------------------------------------
    */
    
    var widgetJsonString = this.parent_class.to_json();

    /* -----------------------------------------------------------------------------
    ** DEFINE ADDITIONAL VARIABLES OR PARAMETERS TO MONITOR DYNAMIC CONTENT
    **
    ** These should be simple variables, such as true/false, a number, or a state
    ** This cannot be something complex like a full <div>
    ** -----------------------------------------------------------------------------
    */

   var addedRows = $("#discussionTable").find("tbody tr").length;

    /* -----------------------------------------------------------------------------
    ** ADD widgetJsonString AND ADDITIONAL VARIABLES TO OUTPUT
    **
    ** This information will be accessed within the init function
    ** -----------------------------------------------------------------------------
    */

    //If you do not need to add additional dynamic content, use this line
    //var output = { widgetData: JSON.parse(widgetJsonString) };

    // Define additional output components
    var output = { widgetData: JSON.parse(widgetJsonString), addedRows: addedRows };

    //uncomment to check stringified output - note that complicated objects like divs cannot be passed this way
    //console.log("to JSON", JSON.stringify(output));

    /* -----------------------------------------------------------------------------
    ** RETURN STRINGIFIED OUTPUT
    ** -----------------------------------------------------------------------------
    */
    
    return JSON.stringify(output);
},

from_json: function (json_data) {
    //populates the form with json_data

    // all data into string format within json_data is parsed into an object parsedJson
    var parsedJson = JSON.parse(json_data);

    //use parsedJson to get widgetData and turn into a string
    //parent class uses the widget data to fill in inputs
    this.parent_class.from_json(JSON.stringify(parsedJson.widgetData));
},

test_data: function () {
    //during development this method is called to populate your form while in preview mode

    /* -----------------------------------------------------------------------------
    ** ORIGINAL LABARCHIVES RETURN FOR TEST DATA
    **
    ** note that this will randomly select options for dropdown menus, 
    ** radio buttons, and checkboxes
    ** -----------------------------------------------------------------------------
    */
    
    //return this.parent_class.test_data();

    /* -----------------------------------------------------------------------------
    ** DEFINE YOUR OWN TEST DATA
    **
    ** note that this will randomly select options for dropdown menus, 
    ** radio buttons, and checkboxes if you still use parent_class.test_data()
    **
    ** Add additional test data infromation based on dynamic content
    ** -----------------------------------------------------------------------------
    */

    //store the outcome of the the test data within the testData variable
    var testData = JSON.parse(this.parent_class.test_data());
    
    //If no additional dynamic content 
    var output = { widgetData: testData };

    //The additional content should match the objects in to_json
    //var output = { widgetData: testData, existsMyContent: isCheckedAddDiv};

    //return the stringified output for use by the init function
    return JSON.stringify(output);
},

is_valid: function (b_suppress_message) {
    //called when the user hits the save button, to allow for form validation.
    //returns an array of dom elements that are not valid - default is those elements marked as mandatory
    // that have no data in them.
    //You can modify this method, to highlight bad form elements etc...
    //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
    //Returning an empty array [] or NULL equals no error
    //TO DO write code specific to your form

    /* -----------------------------------------------------------------------------
    ** VALIDATE FORM ENTRY BEFORE SAVING
    **
    ** This function will now check that all fields with the required attribute
    ** are not blank. If there are blank elements, it will return an alert that
    ** provides a fail log with the ids of the elements that are missing
    **
    ** source: source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    ** -----------------------------------------------------------------------------
    */

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
    }; //otherwise, return empty array

    /* -----------------------------------------------------------------------------
    ** ORIGINAL LABARCHIVES is_valid FUNCTION
    **
    ** This checks for fields that have _mandatory appended to the name attribute
    ** -----------------------------------------------------------------------------
    */
    
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

data_valid_form: function () {
    /* -----------------------------------------------------------------------------
    ** VALIDATE FORM ENTRY BEFORE SAVING OR COPYING TABLE
    **
    ** This function will check that elements with a class "needForTable"
    ** are not blank. If there are blank elements, it will return false
    ** and will post an error message "Please fill out all elements marked by a blue #"
    **
    ** source: source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    ** -----------------------------------------------------------------------------
    */

    var valid = true; //begin with a valid value of true
    //var fail_log = ''; //begin with an empty fail log
    //var name; //create a name variable

    //search the_form for all elements that are of class "needForForm"
    $('.needForTable').each(function () {
        if (!$(this).val()) { //if there is not a value for this input
            valid = false; //change valid to false
            //name = $(this).attr('id'); //replace the name variable with the name attribute of this element
            //fail_log += name + " is required \n"; //add to the fail log that this name is required
        }
    });

    if (!valid) {
        $("#errorMsg").html("<span style='color:red; font-size:36px;'>Please fill out all elements marked by a</span><span style='color:blue; font-size:36px;'> blue #</span>");
    } else {
        $("#errorMsg").html("");
    };

    return valid;
},

resize: function () {
    /* -----------------------------------------------------------------------------
    ** resize function
    **
    ** This function can be used to ensure that if a table or other large content
    ** exists on the page or gets created, that it doesn't try to resize the 
    ** entry and push it off of the viewable page within the notebook.
    ** 
    ** This function also resizes the container using the LA parent_class script.
    ** my_widget_script.parent_class.resize_container(); should be called each time
    ** content is created, modified, or deleted within a function.
    ** -----------------------------------------------------------------------------
    */
    
    //gets the inner width of the window.
    var width = window.innerWidth;

    //TO DO resize any specific divs (such as those with a large table) based on the innerWidth
    $(".tableDiv").width(width * .95); //make width of table div 95% of current width

    //resize the container
    my_widget_script.parent_class.resize_container();
},

//Use these to create template row addition examples
createRow: function (tableName) {
    var rowCount = $(tableName).find("tbody tr").length + 1;
    var rowID = "Row_" + rowCount;

    var col1ID = "discussed_" + rowCount;
    var col2ID = "topic_" + rowCount;
    var col3ID = "info_" + rowCount;
    var col4ID = "followUp_" + rowCount;

    $(tableName).find("tbody").append(
        $('<tr/>', { //add a new row
            id: rowID //give this row the rowID
        }).append(
            $('<td/>').append( //append a new td to the row
                $('<input/>', { //append a new input to the td
                    id: col1ID,
                    name: col1ID,
                    "class": "ckbx",
                    type: "checkbox" //make it type "date"
                }).change(function () {
                    if($(this).is(":checked")){
                        $(this).closest("tr").css("background-color", "lightpink");
                    } else {
                        $(this).closest("tr").css("background-color", "");
                    };
                })
            )
        ).append(
            $('<td/>').append(
                $('<input/>', {
                    id: col2ID,
                    name: col2ID
                }).css("width", "25em")
            )
        ).append(
            $('<td/>').append( //append a new td to the row
                //append a new text area to the script. this string has to be split to make LA happy
                //the widget script entry is within a text area, and if it finds another here, it 
                //thinks that it has reached the end of the script
                $('<text' + 'area></text' + 'area>', {
                    id: col3ID,
                    name: col3ID,
                    cols: "25",
                    rows: "3"
                }).css("margin", "5px")
            )
        ).append(
            $('<td/>').append( //append a new td to the row
                //append a new text area to the script. this string has to be split to make LA happy
                //the widget script entry is within a text area, and if it finds another here, it 
                //thinks that it has reached the end of the script
                $('<text' + 'area></text' + 'area>', {
                    id: col4ID,
                    name: col4ID,
                    cols: "25",
                    rows: "3"
                }).css("margin", "5px")
            )
        )
    );

    //resize the container
    my_widget_script.resize();
},

deleteRow: function (tableName) {
    var lastRow = $(tableName).find("tbody tr").last();
    $(lastRow).remove();

    //resize the container
    my_widget_script.resize();
}

/* -----------------------------------------------------------------------------
** DEFINE ADDITIONAL FUNCTIONS HERE
**
** Be sure that there is a comma after previous function
**
** my_widget_script.parent_class.resize_container(); should be called each time
** content is created, modified, or deleted within a function.
** -----------------------------------------------------------------------------
*/


}
;