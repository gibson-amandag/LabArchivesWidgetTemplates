my_widget_script = {
    showWithCheck: function ($chbx, $toToggle) {
        if($chbx.is(":checked")){
            $toToggle.show();
        } else {
            $toToggle.hide();
        }
        my_widget_script.resize();
    },
    
    hideWithCheck: function ($chbx, $toToggle) {
        if($chbx.is(":checked")){
            $toToggle.hide();
        } else {
            $toToggle.show();
        }
        my_widget_script.resize();
    }
}