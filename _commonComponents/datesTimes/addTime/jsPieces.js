my_widget_script =
{
    setUpInitialState: function () {
        $(".watchTime").each((i, e)=> {
            var $elToWatch = $(e);
            var $elToFill = $(e).parent().next().find($(".fillTime"));
            // console.log($elToFill);
    
            this.watchTime($elToWatch, $elToFill);
        }).on("input", (e)=> {
            var $elToWatch = $(e.currentTarget);
            var $elToFill = $(e.currentTarget).parent().next().find($(".fillTime"));
            // console.log($elToFill);
    
            this.watchTime($elToWatch, $elToFill);
        });

        this.resize();
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
        var addTime = $elToFill.data("time"); // add a data-time property to the $elToFill; this should be in the form hh:mm
        
        var startTime = $elToWatch.val();
        if(startTime){
            var time = new Date();
            startTimeSplit = this.getHoursMin(startTime);
            addTimeSplit = this.getHoursMin(addTime);
            // set start time
            time.setHours(startTimeSplit.hours, startTimeSplit.mins, 00, 000);
            time.setHours(time.getHours() + addTimeSplit.hours);
            time.setMinutes(time.getMinutes() + addTimeSplit.mins);
            // console.log(time);
            $elToFill.text(time.toLocaleTimeString());
        } else{
            $elToFill.text("{Enter Start Time}")
        }
        
        this.resize();
    }
};