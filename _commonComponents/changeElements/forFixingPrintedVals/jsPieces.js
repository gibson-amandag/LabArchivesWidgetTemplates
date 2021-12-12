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
    
    addEventListeners: function () {
        
    },

    setUpInitialState: function () {
        // If this is dynamically created, add this when appending
        $(".toFix").on("dblclick", (e)=> {
            // Allows for correcting value if double-clicked
            var text = $(e.currentTarget).text();
            $(e.currentTarget).addClass("fixing").addClass("filled");
            $(".forFixing").show();
            $("#fixVal").val(text).select();
            my_widget_script.resize();
        })

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

};