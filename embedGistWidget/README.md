# Embed Gist Widget

## Purpose
The purpose of this widget is to display embedded gists within LabArchives. It is necessary to do this within a widget because gists require JavaScript to be displayed. Furthermore, the gist must be displayed within an iFrame so that it is able to be appropriately updated when the link is added or changed.

## Use
- Follow the instructions in the repository [README](README.md) to add this widget to your LabArchives notebook
- Copy the "share" link for the gist that you would like to display. 
- Paste this link into the indicated field when editing the widget in an entry in LabArchives. 
  * If you would like to display only a specific file from this gist, enter the file name (including the file type) in the second field
- Enter the desired height for the iFrame in which the gist will be added
- Press "Make Gist Frame" to display the gist, or update it with a new link, filename, or height
- When the entry is saved to the page, only the link to the gist and the gist itself will be displayed.
  * The entry fields and "Make Gist Frame" buttons are within a `<div>` tag that only displays when editing
- Note that the links at the bottom of the gist will not work if you click as is. Right-click to open in a new tab or window, or click on the created link at the top of the entry to navigate to the gist directly.
