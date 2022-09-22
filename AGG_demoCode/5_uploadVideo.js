my_widget_script = {
    uploadVideoFile: function(){
        // Get selected file
        var file = document.getElementById('myfile').files[0];
        //console.log(file);

        var proceed = false;
        if( ! my_widget_script._fileName ){ // if no current file name
            proceed = true;
        } else if( file.name == my_widget_script._fileName) { // if matches current file name
            proceed = true;
        } else { // confirm if doesn't match
            proceed = confirm("This is a different file than was previously analyzed in this widget. Do you want to proceed?");
        }

        if( proceed ){
            $(".filePath").text(file.name);
            my_widget_script._fileName = file.name;
            
            var fileURL = URL.createObjectURL(file);
            // Add file URL to source for video player
            my_widget_script._vid.src = fileURL;

            // var vid = document.getElementById("videoPlayer");
            my_widget_script._vid.playbackRate = $("#changeSpeed").val();

            $("#addStampButton").removeAttr("disabled");
            $("#removeStampButton").removeAttr("disabled");
        }

        my_widget_script.resize();
    },

    addEventListeners: function () {
        $("#myfile").on("input", function () {
            this.uploadVideoFile();
        });
    }
}