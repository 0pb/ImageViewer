/*
*   ImageViewer.js  - Allow the user to read picture in nearby folder, in pure html/javascript (no server needed)
*   @Author         - 0pb
*   Link            - https://github.com/0pb/ImageViewer
*   LICENSE GNU V3
*/


function Change_theme()
{
    /*
    * Change the theme depending on the current theme
    */ 
    var true_if_light_theme = true;
    button_theme.onclick = function(event) 
    {   
        if (true_if_light_theme)
            {Dark_theme();}
        else
            {Light_theme();}
        true_if_light_theme = !true_if_light_theme;
    };

    docbody = document.body.style;
    docmenu = document.getElementById("menu").style;
    docbutton = document.getElementById("button_theme");
    function Dark_theme() 
    {
       docbody.background = "#525252";
       docbody.color = "#ca3e47";
       docmenu.background = "#ca3e47";
       docmenu.color = "#414141";

       docbutton.className = "btn btn-light";
       docbutton.innerHTML = "Light theme";
    };

    function Light_theme() 
    {
       docbody.background = "#FFFFFF";
       docbody.color = "#808080";
       docmenu.background = "#c0392b";
       docmenu.color = "white";

       docbutton.className = "btn btn-dark";
       docbutton.innerHTML = "Dark theme";
    };
};



function true_if_unique_folder(
    /* list[dictionnary] */ files)
{
    /*
    * @param (list) files {name, lastModified, webkitRelativePath}
    * @return (bool) True if the folder is a unique folder

        unique folder = 
        top_folder/
            ├── 1.jpg
            ├── 2.jpg
            └── 3.jpg

        multiple folder = 
        top_folder/
            ├── gallery_1/
            │       ├── 1.jpg
            │       └── 2.jpg
            ├── gallery_2/
            │       └── 1.jpg
            └── gallery_3/
                    ├── 1.jpg
                    ├── 2.jpg
                    └── 3.jpg

    */
    for (let i=0; i<files.length; i++) 
    {   
        path = (files[i].webkitRelativePath).split("/");
        if (path.length>2)
        {
            return false;
        }
    }
    return true;
};



function print_picture(
    /* list[string] */ array_of_file) 
{
    /*
    * @param (list) array_of_file contain every path within a folder.
    */
    function modify_html(
        /* list[string] */ sorted_array_of_file)
    {
        /*
        * Clean the imagine div (which may already contain picture), then append an 
        * image with every path in the list.
        * It then change the title to the folder name.
        * Example of path : "Artist (example)/1234-1.jpg"
        *                   "Artist (example)/second_folder/8132-3.jpg"
        *
        * @param (list) sorted_array_of_file contain every path but sorted by filename.
        */
        $("#imagine").empty();
        for (let i=0; i<value.length; i++) 
        {
            $("#imagine").append('<div id="img'
                                + i + '"  class="wrapper_image" tabindex="0"><img src="'
                                + value[i] + '" alt="' 
                                + i + '"></div>'); 
        }
        let folder_name = sorted_array_of_file[0].split("/");
        folder_name = folder_name[folder_name.length - 2];
        $("#top_title").empty().append(folder_name);        
    };

    console.group("Priting");
    var value = array_of_file.sort(
        function(a,b){  a = a.split('.')[0]; 
                        b = b.split('.')[0]; 
                        return a - b;});
    modify_html(value);
    console.groupEnd();
};



function load_and_print_pictures(
    /* dict[key][list[str]] */ dict)
{
    /*
    * Example : {"Artist (example)" : ["Artist (example)/1234-1.jpg"
    *                                , "Artist (example)/1234-2.jpg"
    *                                , "Artist (example)/1234-3.jpg"]}
    *
    * @param (dict) dict contain every folder, then a list of file within that folder.
    */
    console.group("Loading the folder");

    function trim_double_space(string)
    {
        /*
        * When value are put in the html, every double space (or more) are automatically
        * removed. However this is not the case in the dictionnary, that's why this function
        * is used to compare the html string of the selected option with the value inside
        * the dictionnary.
        *
        * @param (string) string contain the original folder name
        * @return (string) string that contain the folder name trimmed
        */
        return string.split(/\s+/).join(' ');
    }

    function get_select_option() 
    {
        /*
        * @return (string) string that contain the selected option (by the user) in the menu.
        */
        selected_option = document.getElementById("menu")
                .options[document.getElementById('menu').selectedIndex]
                .text;
        return selected_option;
    };

    console.time("Load every path and file name");
    for (var key in dict) 
    { 
        if (get_select_option() === trim_double_space(key))
        {   
            print_picture(dict[key]);
        }
    }
    console.timeEnd("Load every path and file name");
    console.groupEnd();
};



function dict_unique(
    /* list[dictionnary] */ files)
{
    /*
    * Used in case of a unique folder selected by the user. The script cannot react the same way
    * to multiples folders and unique folder.
    *
    * @param (list) files {name, lastModified, webkitRelativePath}
    * @return (dict) dictionnary that contain every folder, then a list of file within that folder.
    */
    top_directory = files[0].webkitRelativePath.split("/")[0];
    dict = {};
    dict[top_directory] = [] ;
    for (let i=0; i<files.length; i++) 
    {  
        let path = files[i].webkitRelativePath;
        if (    path.endsWith(".jpg") 
             || path.endsWith(".jpeg") 
             || path.endsWith(".png"))
        {
            dict[top_directory].push(path);
        }
    }
    return dict;
};



function dict_multiples(
    /* list[dictionnary] */ files)
{
    /*
    * Used in case of multiple folders selected by the user. The script cannot react the same way
    * to multiples folders and unique folder.
    *
    * @param (list) files {name, lastModified, webkitRelativePath}
    * @return (dict) dictionnary that contain every folder, then a list of file within that folder.
    */
    dict = {};
    for (let i=0; i<files.length; i++) 
    {
        let folder_name = files[i].webkitRelativePath.split("/");
        folder_name = folder_name[folder_name.length - 2];
        dict[folder_name] = [];
    }

    for (let i=0; i<files.length; i++) 
    {
        let path = files[i].webkitRelativePath;
        let folder_name = files[i].webkitRelativePath.split("/");
        folder_name = folder_name[folder_name.length - 2];     
        if (    path.endsWith(".jpg") 
             || path.endsWith(".jpeg") 
             || path.endsWith(".png"))
        {
            dict[folder_name].push(path);
        }
    }
    return dict;
};


function add_option_in_menu(
    /* dict[key][list[str]] */ dict) 
{
    /*
    * Add every option to the select menu.
    *
    * @param (dict) dict contain every folder, then a list of file within that folder.
    */
    $("#menu").empty();
    for (var folder_name in dict) 
    { 
        $("#menu").append('<option>' + folder_name + '</option>');
    }
};



function execute_main(event)
{
    /*
    * Use the filesystem API given by the browser : 
    * Get the path and sub-path of every file/folder of the repertory that the user selected
    * It then print every picture to the screen.

        folder_selected_by_user/
            ├── gallery_1/
            │       ├── 1.jpg
            │       └── 2.jpg
            └── gallery_2/
                    └── 1.jpg

    * Due to how the API works, the folder_selected_by_user need to be either one level 
    * below where the Image Reader files are placed, or directly next to it.

        Valid : 
        repository/
            ├── folder_selected_by_user/
            ├── index.html
            │   ..
            └── code.js

        NOT valid : 
        repository/
            ├── folder/
            │       └──folder_selected_by_user/
            ├── index.html
            │   ..
            └── code.js
        
        NOT valid : 
        repository/
            ├── folder_selected_by_user/
            └── folder/
                    ├── index.html
                    │   ..
                    └── code.js

        NOT valid : 
        repository/
            ├── folder/
            │       └──folder_selected_by_user/
            └── folder/
                    ├── index.html
                    │   ..
                    └── code.js
    */
    console.group("Get files and folders");
    let files = event.target.files;

    if (true_if_unique_folder(files))
    {
        dict = dict_unique(files);
    }
    else
    {
        dict = dict_multiples(files); 
    }
    add_option_in_menu(dict);
    load_and_print_pictures(dict);

    console.groupEnd();
    return dict;
};



function event_manager()
{   
    /*
    * Manage the event :
    * When the filepicker is changed, it execute the function that load and display all the picture
    * after loading them in a dictionnary.
    *
    * When the select menu is changed, it execute the function that load and display all the picture
    * by using the dictionnary already loaded by the filepicker.
    *
    * When the left arrow or right arrow are pressed, the next picture is focused.
    * TODO : On reaching last picture, the right arrow would load the next folder in the dictionnary
    *        Same for reaching first picture and previous folder.
    */
    var dict;
    var i = 0;
    var list_node;
    filepicker.onchange = function()
    {   
        dict = execute_main(event);
        current_i = i;
        list_node = document.getElementsByClassName("wrapper_image");
    };

    menu.onchange = function() 
    {   
        load_and_print_pictures(dict);
        current_i = i;
        list_node = document.getElementsByClassName("wrapper_image");
    };

    document.onkeydown = function()
    {
        current_i = function_arrow(event, list_node, current_i);
        console.error(current_i);
    }
};



function function_arrow(event, list_node, value)  
{
    /*
    * Change the focus depending on the left and right arrow input.
    * TODO : get the current picture printed on screen instead of the last user input.
    *        Current behavior : if the user use the arrow then the mousewheel, then re-use the arrow, 
    *        it will go back to where the focus was last. Can be annoying when using the left arrow for
    *        the first time in the folder.
    *
    * @param (list) list_node contain every <img> tag that are currently printed.
    * @param (number) value contain the index of the picture last on focus.
    */
    var i = value;
    var increment = 1;

    switch (event.keyCode) 
    {   
        case 37:
            if (i-increment < 0) 
            {
                i = 0;
            }
            else
            {
                i = i - increment;
            }
            break;
        case 39: 
            if (i + increment >= list_node.length-1) 
            {
                i = list_node.length - increment;
            }
            else
            {
                i = i + increment; 
            }
            break;
    }
    list_node[i].focus();
    list_node[i].blur();
    console.log(list_node[i]);
    return i;
};



$(document).ready(function() 
    {
        /* root of the script
        var scripts = document.getElementsByTagName("script");
        src = scripts[0].src;
        console.log(src);
        */

        // allow the filepicker to be clicked on
        event_manager();

        // allow the theme change
        Change_theme();
    }
);
