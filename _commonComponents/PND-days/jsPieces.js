my_widget_script =
{
    initDynamicContent: function (parsedJson) {
        // for (var i = 0; i < parsedJson.addedRows; i++) {
        // };
    },

    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $(".disableOnView").prop("disabled", true);
        }
    },

    setUpInitialState: function () {
        $("#DOB").on("change", function () {
            my_widget_script.printPND_days();
            my_widget_script.getPND_today();
        });

        my_widget_script.printPND_days();
        my_widget_script.getPND_today();
        my_widget_script.resize();
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

    getPND_today: function () {
        // var offset = new Date().getTimezoneOffset();
        var $DOBVal = $("#DOB").val();

        if($DOBVal){
            var offset = new Date().getTimezoneOffset(); //get the offset of local time from GTC
            // this is necessary because making a Date object from the input date string creates a date with time of midnight GTC
            // for locales with different time zones, this means that the Date displayed could be the previous day
    
            var currentYear = new Date().getFullYear();
            var currentMonth = new Date().getMonth();
            var currentDay = new Date().getDate();
            
            var DOB_asDate = new Date($DOBVal);
    
            //Adjust for offset
            var DOB_asDate_adj = new Date(DOB_asDate.getTime() + offset * 60 * 1000);
            var today_asDate = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    
            var dateDiff_ms = today_asDate.getTime() - DOB_asDate_adj.getTime();
    
            var dateDiff_days = dateDiff_ms / (24 * 60 * 60 * 1000);
    
            var pndTodayString = ".pnd.pnd" + dateDiff_days;
            var pndNotTodayString = ".pnd:not(.pnd" + dateDiff_days + ")";
    
            $(pndTodayString).css("color", "red");
            $(pndNotTodayString).css("color", "black");
            
            // Print PND # for any element with class .pndToday
            $(".pndToday").text(dateDiff_days);

            // This prints at what needs to be done today and cycling dates - adjust these functions to needs
            my_widget_script.updateToDoStatus(dateDiff_days);
            my_widget_script.updateCycleStatus(dateDiff_days);
    
            return(dateDiff_days);
    
            // console.log(
            //     "Current Year: " + currentYear +"\n" +
            //     "Current Month: " + currentMonth + "\n" +
            //     "Current Day: " + currentDay + "\n" +
            //     "DOB String: " + $DOBVal + "\n" +
            //     "DOB Date Obj: " + DOB_asDate + "\n" +
            //     "DOB Adjusted Date Obj: " + DOB_asDate_adj + "\n" + 
            //     "Today Date Obj: " + today_asDate + "\n" +
            //     "Diff in ms: " + dateDiff_ms + "\n" +
            //     "Diff in days: " + dateDiff_days
            // )
        } else {
            my_widget_script.switchMassTable($("#massSelect").val());
        }
    },

    // Get the postnatal day for a given date input
    // dateInputVal needs to be in "yyyy-mm-dd" format, such as what comes out of date input
    getPND: function (dateInputVal) {
        //https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
        var DOBisDay = 0; //Change depending on whether you want DOB to be PND 0 or PND 1
        var compDate_as_ms = new Date(dateInputVal).getTime();
        var textOutput;
        if($("#DOB").val()){
            if(dateInputVal){
                var DOB_as_ms = new Date($("#DOB").val()).getTime();
                var pnd = (compDate_as_ms - DOB_as_ms) / (1000 * 3600 * 24) + DOBisDay;
                textOutput = pnd;
            } else {
                textOutput = "[Enter Date]";
            }
        } else {
            textOutput = "[Enter DOB]";
        }
        
        return textOutput;
    },

    updateToDoStatus: function (PND_today) {
        // TO DO - Change these to match your tasks and output divs
        var $toDoStatus = $(".toDo_status");
        if ($.inArray(PND_today, [28, 35, 42, 49, 56, 63]) !== -1)  { //if PND_today is one of these values
            $toDoStatus.html("<span style='color:blue'>Take mass today</span>");
            // Set massSelect to today's date
            $("#massSelect").val("pnd"+PND_today);
            my_widget_script.switchMassTable("pnd"+PND_today);
        } else if ($.inArray(PND_today, [22, 23, 24, 70, 71, 72]) !== -1) {
            $toDoStatus.html("<span style='color:blue'>Take mass and AGD today</span>");
            // Set massSelect to today's date
            $("#massSelect").val("pnd"+PND_today);
            my_widget_script.switchMassTable("pnd"+PND_today);
        } else if (PND_today === 21) {
            $toDoStatus.html("<span style='color:blue'>Wean and take mass today - enter in litter widget</span>");
            $("#massSelect").val("");
            my_widget_script.switchMassTable("");
        } else {
            $toDoStatus.html("<em>No mass or AGD today</em>");
            $("#massSelect").val("");
            my_widget_script.switchMassTable($("#massSelect").val());
        }
    },

    updateCycleStatus: function (PND_today){
        var $cycling_status = $(".cycling_status");
        if(PND_today >= 70 && PND_today <= 91){ // TO DO - change this for the PNDs that you want to cycle between
            $cycling_status.css("background-color", "yellow");
        } else {
            $cycling_status.css("background-color", "none");
        }
    },

    // Add a certain number of days to a starting date and print the result as a string in all elements of $newDateClass
    addDays: function ($startDateVal, $newDateClass, numDays) {
        var dateString = $startDateVal; //get the date string from the input

        var startDate = new Date(dateString);

        var offset = new Date().getTimezoneOffset(); //get the offset of local time from GTC
        // this is necessary because making a Date object from the input date string creates a date with time of midnight GTC
        // for locales with different time zones, this means that the Date displayed could be the previous day

        //Add the number of days (in ms) and offset (in ms) to the start Date (in ms) and make it a new date object
        var newDate = new Date(startDate.getTime() + numDays * 24 * 60 * 60 * 1000 + offset * 60 * 1000);

        $newDateClass.text(newDate.toDateString());
    },

    printPND_days: function () {
        // If there's a DOB
        if($("#DOB").val()){
            // TO DO - change this to include all PNDs that you need to print
            var pndDays = [21, 22, 23, 24, 28, 35, 42, 49, 56, 63, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91]
            
            for(i = 0; i < pndDays.length; i ++ ) { 
                //For each PND
                var pnd = pndDays[i];
                // Run the addDays function and update elements that have the .pnd class and the .pnd# corresponding to the pnd with the date string
                my_widget_script.addDays($("#DOB").val(), $(".pnd"+pnd), pnd);
            }
        }

        my_widget_script.resize();
    },
};