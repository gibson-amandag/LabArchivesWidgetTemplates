my_widget_script =
{
    setUpInitialState: function () {
        $(".watchTime").each(function () {
            var $elToWatch = $(this);
            var $elToFill = $(this).parent().next().find($(".fillTime"));
            console.log($elToFill);
    
            my_widget_script.watchTime($elToWatch, $elToFill);
        }).on("input", function () {
            var $elToWatch = $(this);
            var $elToFill = $(this).parent().next().find($(".fillTime"));
            console.log($elToFill);
    
            my_widget_script.watchTime($elToWatch, $elToFill);
        });

        my_widget_script.resize();
    },

    getHoursMin: function (timeString) {
        timeString = timeString.split(":");
        var hours = parseInt(timeString[0], 10), mins = parseInt(timeString[1], 10);
        return( 
            split = {
                hours: hours,
                mins: mins
            }
        )
    },
    
    watchTime: function ($elToWatch, $elToFill) {
        var addTime = $elToFill.data("time"); // add a date-time property to the $elToFill; this should be in the form hh:mm
        // console.log(length);
    
        var startTime = $elToWatch.val();
        if(startTime){
            var time = new Date();
            startTimeSplit = my_widget_script.getHoursMin(startTime);
            addTimeSplit = my_widget_script.getHoursMin(addTime);
            // set start time
            time.setHours(startTimeSplit.hours, startTimeSplit.mins, 00, 000);
            time.setHours(time.getHours() + addTimeSplit.hours);
            time.setMinutes(time.getMinutes() + addTimeSplit.mins);
            console.log(time);
            $elToFill.text(time.toLocaleTimeString());
        } else{
            $elToFill.text("{Enter Start Time}")
        }
        
        my_widget_script.resize();
    }
};