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
        // Autoadjust the size of textareas based on content in them
        // remove the .autoAdjust if you want this to apply to all textareas
        $('textarea.autoAdjust').each((i,e)=> { // i is the index for each match, textArea is the object
            e.setAttribute('style', 'height:' + (e.scrollHeight) + 'px;overflow-y:hidden;');
            var height = e.scrollHeight;
            // This can help with sizing for textareas that are hidden when the page is initialized
            // Need a hidden "forTextBox" div with an id = "forSizing" textarea on your HTML page
            if(height == 0){
                text = $(e).val();
                $(".forTextBox").show();
                $("#forSizing").val(text);
                var forSizing = document.getElementById("forSizing");
                height = forSizing.scrollHeight;
                $(".forTextBox").hide();
            }
        }).on('input', (e)=> {
            e.target.style.height = 'auto';
            e.target.style.height = (e.target.scrollHeight) + 'px';
            this.resize();
        });

        // Add this class to any element that you want to cause to recheck for textarea when it changes
        // This is especially important if you are showing something that contains a textarea that would have been hidden initially
        $(".checkText").on("change", ()=> {
            this.updateTextarea();
        });

        this.updateTextarea();
        this.resize();
    },
    
    resize: function () {
        //resize the container
        this.parent_class.resize_container();
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        var dynamicContent = {};
        return dynamicContent;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

    updateTextarea: function () {
        $('textarea.autoAdjust').each((i,e)=> {
            if(! $(e).is(":hidden")) {
                e.setAttribute('style', 'height:' + (e.scrollHeight) + 'px;overflow-y:hidden;');
            } 
        });
        this.resize();
    },
};