my_widget_script = {
    getLocalDateString: function () {
        var dateToday = new Date();
        var dateTodayYear = dateToday.getFullYear();
        var dateTodayMonth = dateToday.getMonth() + 1;
        var dateTodayDay = dateToday.getDate();
        var dateTodayString = dateTodayYear + "-" + dateTodayMonth.toString().padStart(2, 0) + "-" + dateTodayDay.toString().padStart(2, 0);
        return(dateTodayString);
    }
}