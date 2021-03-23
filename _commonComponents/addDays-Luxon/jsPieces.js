my_widget_script =
{
    addEventListeners: function () {
        $("#numDays").on("input", function () {
            if ($("#startDate").val()) {
                var startDateVal = $("#startDate").val();
                var $newDate = $("#newDate");
                var numDays = $("#numDays").val();
                my_widget_script.addDays(startDateVal, $newDate, numDays);
            } else {
                $("#newDate").text("Enter start date");
            }
        });

        $("#startDate").on("input", function () {
            if ($("#numDays").val()) {
                var startDateVal = $("#startDate").val();
                var $newDate = $("#newDate");
                var numDays = $("#numDays").val();
                my_widget_script.addDays(startDateVal, $newDate, numDays);
            } else {
                $("#newDate").text("Enter number of days");
            }
        });
    },

    setUpInitialState: function () {
        //Print new date
        if ($("#numDays").val() && $("#startDate").val()) {
            var startDateVal = $("#startDate").val();
            var $newDate = $("#newDate");
            var numDays = $("#numDays").val();
            my_widget_script.addDays(startDateVal, $newDate, numDays);
        } else if (!$("#numDays")) {
            $("#newDate").text("Enter number of days");
        } else {
            $("#newDate").text("Enter start date")
        };
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
     * This function takes a startDateVal from a date input and adds a certain 
     * numDays (number of days), and replaces the text in the $newDate element 
     * which can be either an id or a class with date string of that addition
     * 
     * @param {*} $startDateVal - the value from the data input
     * @param {*} $newDateClass - the element where the text with the date string will be printed. jQuery obj
     * @param {*} numDays - number of days to add 
     */
    addDays: function ($startDateVal, $newDateClass, numDays) {
        var newDate = luxon.DateTime.fromISO($startDateVal).plus({days: numDays}).toISODate();
        $newDateClass.text(newDate);
    }
};