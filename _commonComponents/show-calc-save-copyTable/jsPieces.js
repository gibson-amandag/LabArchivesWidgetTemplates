my_widget_script =
{    
    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $(".disableOnView").prop("disabled", true);
        }
    },

    addEventListeners: function () {
        //Show/hide the table
        $("#toggleTable").on("click", function () { //when the showTable button is clicked. Run this function
            var $table //TO DO add table
            my_widget_script.toggleTableFuncs($table);
        });

        //when the calculate button is clicked, run the calcValues function
        $('#calculate').on("click", function () {
            my_widget_script.calcTableFuncs();
        });

        //when the toCSV button is clicked, run the exportTableToCSV function if data is valid
        $('#toCSV').on("click", function () {
            var fileName //TO DO add fileName
            var tableID //TO DO add tableID
            var $errorMsg //TO DO add error message as jQuery
            
            my_widget_script.toCSVFuncs(fileName, tableID, $errorMsg);
        });

        //When the copy button is clicked, run the copyTable function
        $("#copyDataButton").on("click", function () {
            var $copyHead //TO DO add table
            var $tableToCopy //TO DO add table
            var $tableDiv //TO DO add tableDiv
            var $errorMsg //TO DO add error message
            var $divForCopy //TO DO add div where the table copies to
            var $transpose //TO DO add transpose checkbox
            
            my_widget_script.copyDataFuncs($copyHead, $tableToCopy, $tableDiv, $errorMsg, $divForCopy, $transpose)
        });
    },

    setUpInitialState: function () {
        //Run the calculate values method to fill with the loaded data
        this.calcValues();

        this.watchValue($elToWatch, $eltoUpdate);
    },
    
    resize: function () {
        //resize the container
        my_widget_script.parent_class.resize_container();
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        var dynamicContent = {};
        return dynamicContent;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

    /**
     * This takes the value of the input for the $elToWatch and then updates the text of 
     * $elToUpdate to match whenever watchValue is called
     * @param {*} $elToWatch - jQuery object with the input element whose value will be used to update
     * @param {*} $elToUpdate - jQuery object of the element whose text will be updated based on the element to watch
     */
    watchValue: function ($elToWatch, $elToUpdate) {
        var value = $elToWatch.val();
        $elToUpdate.text(value);
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
        //TO DO add calc functions

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
     * This function takes a csv element and filename that are passed from the
     * exportTableToCSV function.
     * 
     * This creates a csvFile and builds a download link that references this file.
     * The download link is "clicked" by the function to prompt the browser to 
     * download this file
     * 
     * source: https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/
     * 
     * @param {*} csv - This is the csv passed from the exportToCSV function
     * @param {*} filename - This is the name of the file passed from exportToCSV function
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
     * @param {string} filename the name of the CSV file that will be downloaded
     * @param {string} table the id of the table that will be exported
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
     * @param {*} $table - jQuery object for the table that will be copied
     * @param {*} copyHead - true/false for whether or not the table head should be copied
     * @param {*} $divForCopy - where the temp textarea should be added
     * @param {*} transpose - true if table should be transposed
     */
     copyTable: function ($table, copyHead, $divForCopy, transpose) {
        var $temp = $("<text" + "area style='opacity:0;'></text" + "area>");
        var rows = [];
        var rowNum = 0;
        if (copyHead) {
            $table.find("thead").children("tr").each(function () {
                if(transpose){rowNum = 0;}
                $(this).find("td, th").each(function () {
                    if(rows[rowNum]===undefined){rows[rowNum] = []}
                    rows[rowNum].push($(this).text());
                    if(transpose){rowNum++;}
                });
                if(!transpose){rowNum++;}
            });
        }

        $table.find("tbody").children("tr").each(function () {
            if(transpose){rowNum = 0;} else {}
            $(this).find("td, th").each(function () {
                if(rows[rowNum]===undefined){rows[rowNum] = []}
                rows[rowNum].push($(this).text());
                if(transpose){rowNum++;}
            });
            if(!transpose){rowNum++;}
        });

        for(var i = 0; i < rows.length; i++){
            rows[i] = rows[i].join("\t");
        }

        $temp.append(rows.join("\n"));
        $temp.appendTo($divForCopy).select(); //add temp to tableDiv and select
        document.execCommand("copy"); //copy the "selected" text
        $temp.remove(); //remove temp
    },

    /**
     * Set of functions when toggleTableButton clicked
     * resize, run data_valid_form, run calcValues, 
     * toggle the table (show/hide), resize the container
     * 
     * @param {*} $table - jQuery object that is the table that will be shown/hidden
     */
    toggleTableFuncs: function ($table) {
        my_widget_script.resize();
        my_widget_script.data_valid_form(); //run to give error, but allow to calc regardless
        my_widget_script.calcValues();
        $table.toggle();
        my_widget_script.parent_class.resize_container();
    },

    /**
     * Set of functions when calcValuesButton clicked
     * Run data_valid_form
     * Calculate values
     */
    calcTableFuncs: function() {
        my_widget_script.data_valid_form(); //run to give error, but allow to calc regardless
        my_widget_script.calcValues();
    },

    /**
     * Set of functions when toCSVButton clicked
     * 
     * Checked if data is valid, then re-calculates values, exports the table to a CSV
     * Updates the error message accordingly
     * 
     * @param {string} fileName - fileName for the CSV that will be produced
     * @param {string} tableID - tableID as a string for the table that will be copied
     * @param $errorMsg - error message div as jQuery object
     */
    toCSVFuncs: function (fileName, tableID, $errorMsg) {
        var data_valid = my_widget_script.data_valid_form();

        if (data_valid) {
            my_widget_script.calcValues();
            my_widget_script.exportTableToCSV(fileName, tableID);
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Saved successfully</span>");
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Did not export</span>");
        }
    },

    /**
     * The steps that should be taken when the copy data button is pressed
     * Checks if the $copyHead is checked, runs the calcValues function and then
     * checks if the data is valid. If it is, it shows the table, resizes, and then
     * copies the table (via a temporary textarea that is then removed). 
     * 
     * @param $copyHead - checkbox for whether or not to copy the table head as jQuery object
     * @param $tableToCopy - table to copy as jQuery object
     * @param $tableDiv - div containing table to copy
     * @param $errorMsg - error message div as jQuery object
     * @param $divForCopy - div where the output should copy to
     * @param $copyHead - checkbox for whether or not to transpose the table head as jQuery object
     */
     copyDataFuncs: function ($copyHead, $tableToCopy, $tableDiv, $errorMsg, $divForCopy, $transpose){
        var data_valid = my_widget_script.data_valid_form();
        var copyHead, transpose;

        //only copy the heading when the input box is checked
        if ($copyHead.is(":checked")) {
            copyHead = true;
        } else {
            copyHead = false;
        }

        if ($transpose.is(":checked")) {
            transpose = true;
        } else {
            transpose = false;
        }

        if (data_valid) { //if data is valid
            $tableDiv.show(); //show the table
            my_widget_script.resize(); //resize
            my_widget_script.copyTable($tableToCopy, copyHead, $divForCopy, transpose); //copy table
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Copied successfully</span>") //update error message
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Nothing was copied</span>"); //add to error message
        }
    },
};

