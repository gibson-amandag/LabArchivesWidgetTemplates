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
        // use parsedJsons.[objectName]

        //EXAMPLE:
        //if myContent exists, run the function to create it
      	/*Note that for this situation where a checkbox defines whether or not the content exists, 
		this is not actually the simplest way to do this. The init function can just check whether or not 
		the box is checked and then run the appropriate functions. However, for content that may have been 
		made by a button that could have been clicked an unknown number of times, for example, then additional 
		information needs to be passed into to_json and used to recreate content as demonstrated here*/
        if(parsedJson.existsMyContent){
            //if it exists, run the function
            this.createMyContent();
          };

        //TO DO Disable buttons that you do not want to be available when not editing
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $("#myButton").prop('disabled', true);
        };

        //when the size of the window changes, run the resize function
        window.onresize = my_widget_script.resize;

        //TO DO define what happens on click for buttons/check boxes
        //EXAMPLE:
        $('#myButton').click(my_widget_script.myButtonFunc);

        //Show/hide the table
        $("#toggleTable").click(function () { //when the showTable button is clicked. Run this function
            //alert("button pressed");
            //Get width
            var width = window.innerWidth;
            $(".tableDiv").width(width * .95); //make width 95% of current width
            $("#tableDiv").toggle();
            my_widget_script.parent_class.resize_container();
        });

        //when the calculate button is clicked, run the calcValues function
        $('#calculate').click(my_widget_script.calcValues);

        //when the toCSV button is clicked, run the exportTableToCSV function
        $('#toCSV').click(function () {
            my_widget_script.exportTableToCSV('templateData', 'outTable');
        });

        //When the "addDivCheck" checkbox is clicked, run this function
        $('#addDivCheck').click(function(){
          	//alert("You clicked me!");
            if( $(this).is(":checked") ){
              	//alert("I'm checked");
                my_widget_script.createMyContent();
            } else {
              	//alert("I'm not checked")
                my_widget_script.removeMyContent();
            }
        });

        //use the expected LabArchives data (just the stringified widgetData)
        this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

        //find required fields and add a red asterisk after them
        //source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
        $('#the_form').find('select, textarea, input').each(function () { //find each select field, textarea, and input
            if ($(this).prop('required')) { //if has the attribute "required"
                $(this).after("<span style='color:red'>*</span>"); //add asterisk after
            }
        });

        //TO DO - write script to base initialized HTML on widgetData
        //For example, ensure that show/hide elements are properly displayed based on the contents of the form

        //Run the calculate values function to fill with the loaded data
        this.calcValues();
      
      	/*For this example, this would be the simpler way to recreate the dynamic content without having
		to rely on adding additional values within to_json, since the value of the checkbox is stored
      	//Check if the addDivChecked checkbox is checked
      	if( $('#addDivCheck').is(":checked") ){
        	//alert("I'm checked");
        	my_widget_script.createMyContent();
      	} else {
        	//alert("I'm not checked")
        	my_widget_script.removeMyContent();
      	};
		*/
    },

    to_json: function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry

        //looks at HTML and gets input data. Gives a string
        var widgetJsonString = this.parent_class.to_json();

        //TO DO - create any additional variables to monitor dynamic content
        //These should ultimately be very simple. Something like true/false or a number

        //EXAMPLE:
        var myContent = $("#myContentID");
        var existsMyContent = (myContent !== null && myContent !== undefined) //if my content is not null and is not undefined, make existsMyContent true

        //TO DO - add additional information to this output variable
        //access within init function
        //var output = { widgetData: JSON.parse(widgetJsonString) };

        //EXAMPLE:
        var output = { widgetData: JSON.parse(widgetJsonString), existsMyContent: existsMyContent };

        //uncomment to check stringified output - note that complicated objects like divs cannot be passed this way
        //var stringedOutput = JSON.stringify(output);
        //console.log("to JSON", stringedOutput);

        // return stringified output
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

        //original LabArchives return
        //Note that this will randomly select options for dropdown menus, radio buttons, and checkboxes
        //return this.parent_class.test_data();

        //store the outcome of the the test data within the testData variable
        var testData = JSON.parse(this.parent_class.test_data());
      	
      	//find out what the random check was
      	var addDivCheckVal = testData[1].value; //the second value in the array is the addDivCheck info
      	var isCheckedAddDiv = false; //start with this isChecked variable as false
      	if( addDivCheckVal !== "") { //if addDivCheckVal is not empty ("")
        	isCheckedAddDiv = true; //change isCheckedAddDiv to true
      	}

        //TO DO - add any additional test data information based on dynamic content.
        //var output = { widgetData: testData };

        //EXAMPLE: The additional content should match the objects in to_json
        var output = { widgetData: testData, existsMyContent: isCheckedAddDiv};

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
                    name = $(this).attr('name'); //replace the name variable with the name attribute of this element
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

    resize: function () {
        //adding this here ensures that even if a table or other large content is showing, that it doesn't try to resize with that out of view
        //gets the inner width of the window.
        var width = window.innerWidth;

        //TO DO resize any specific divs (such as those with a large table) based on the innerWidth
        $(".tableDiv").width(width * .95); //make width of table div 95% of current width

        //resize the container
        my_widget_script.parent_class.resize_container();
    },

    myButtonFunc: function () {
        alert("I've been clicked!");
    },

    //calculate values for table
    calcValues: function () {
        //Add check for validity

        //Column A
        var ColumnA = $("#ColumnA").val();
        $("#ColumnA_calc").text(ColumnA);

        //ColumnB
        var ColumnB = $("#ColumnB").val();
        $("#ColumnB_calc").text(ColumnB);

        $("#outTable tr").each(function () { //for each row
            $("td", this).each(function () { //for each cell
                var value = $(this).text(); //get the value of the text
                if ( value === "" || value === "NaN" ) { //if blank or NaN
                    $( this ).text("NA"); //make NA
                }
            })
        });

        //resize the container
        my_widget_script.parent_class.resize_container();

    },

    downloadCSV: function (csv, filename) {
        // source: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
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

    exportTableToCSV: function (filename, table) {
        // source: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
        var csv = [];
        var datatable = document.getElementById(table);
        var rows = datatable.querySelectorAll("tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    },

    //EXAMPLE: 
    createMyContent: function () {
        var myContent = "<div id='myContentID'>You just made me</div>";

        $("#dynamicDiv").append(myContent);

        //resize the container after creating or deleting or modifying content
        my_widget_script.parent_class.resize_container();
    },

    removeMyContent: function () {
        $("#myContentID").remove();

        //resize the container after creating or deleting or modifying content
        my_widget_script.parent_class.resize_container();
    }

    //TO DO create your own functions. Add a comma after previous function closing }
    

}
