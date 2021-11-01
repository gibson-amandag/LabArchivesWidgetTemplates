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
        // remove the .autoAdjust if you want this to apply to all textareas
        $('textarea.autoAdjust').each(function () {
            var height = this.scrollHeight;
            if(height == 0){ // when hidden to begin with, the height is 0; this won't make everything visible, though if more than two lines at start
                // height = 48;
                text = $(this).val();
                $(".forTextBox").show();
                $("#forSizing").val(text);
                var forSizing = document.getElementById("forSizing");
                height = forSizing.scrollHeight;
                $(".forTextBox").hide();
            }
            // console.log(height);
            this.setAttribute('style', 'height:' + height + 'px;overflow-y:hidden;');
        }).on('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            my_widget_script.resize();
        });

        // Add this class to any element that you want to cause to recheck for textarea when it changes
        // This is especially important if you are showing something that contains a textarea that would have been hidden initially
        $(".checkText").on("change", function () {
            my_widget_script.updateTextarea();
        });

        my_widget_script.updateTextarea();
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

    updateTextarea: function () {
        $('textarea .autoAdjust').each(function () {
            if(! $(this).is(":hidden")) {
                this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
            } 
        });
        my_widget_script.resize();
    },
};