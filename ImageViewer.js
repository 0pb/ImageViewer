/*
*   ImageViewer.js  - Allow the user to read picture in nearby folder, in pure html/javascript (no server needed)
*   Author   - 0pb
*   Link     - https://github.com/0pb/ImageViewer
*   LICENSE GNU V3
*/



function print_picture(dict_file, top_directory) 
/*
*   Print the picture one next under another.
*   Sort the name of the file (there is no need to sort file before printing them), 
*       files are sorted trought alphabetical sort.
*   Use a condition to check if it's a "single folder" or "multiples folder" :
*
*   single folder = 
    top_folder/
        ├── 1.jpg
        ├── 2.jpg
        └── 3.jpg

    multiple folder = 
    top_folder/
        ├── gallery_1/
                ├── 1.jpg
                └── 2.jpg
        ├── gallery_2/
                └── 1.jpg
        └── gallery_3/
                ├── 1.jpg
                ├── 2.jpg
                └── 3.jpg
*/
{
    console.group("Priting");
    console.log("Top directory : " + top_directory);

    console.log("Clean the page");
    $("#imagine").empty();

    console.log("Print the page");
    for (var key in dict_file) 
    {  
        // sort in 1 2 3 order
        for (var i in dict_file[key].sort(function(a,b) { 
                            a = a.split('.')[0]; b = b.split('.')[0]; return a - b; })) 
        {
            if (top_directory === key)
            {
                $("#imagine").append('<img src="' 
                                    + key + '/' 
                                    + dict_file[key][i] + '" alt="' 
                                    + i + '">');
            }
            else
            {
                $("#imagine").append('<img src="' 
                                    + top_directory + '/' 
                                    + key + '/' 
                                    + dict_file[key][i] + '" alt="' 
                                    + i + '">');
            }
        }
    }
    console.groupEnd();
};



function add_option_in_menu(dict_file) 
/*
*   Add every option in the dictionnary to the menu
*   It doesn't clean the menu in case of a single folder (bug)
*/
{
    console.group("Select menu change");

    console.log("Clean the menu");
    $("#menu").empty();

    console.log("Add all the menu options");
    for (var image_group_name in dict_file) 
    { 
        $("#menu").append('<option>' + image_group_name + '</option>');
        // <option selected> this </option>
    }
    console.groupEnd();
}



function get_select_option() 
/*
*   Self-explanatory : Get the selected option in the select menu
*/
{
    selected_option = document.getElementById("menu").options[document.getElementById('menu').selectedIndex].text
    console.info("Option selected : " + selected_option)
    return selected_option;
}



function true_if_simple_folder(files)  
/*
*   Check in naive way if there is only one folder
*   Get the first element found in the dict, then check if the first "thing" inside the 
*       first element is a jpg or png
*   return false if the "thing" is not a jpg or png (because it assume it is a folder)
*   return true otherwise
*/
{
    path = files[0]["webkitRelativePath"];
    file_name = path.split("/");
    console.log(path, file_name)
    try
    {
        if (file_name[2].endsWith(".jpg") || file_name[2].endsWith(".png"))
        {
            //do nothing
        }
        return false;
    } catch (TypeError) {
        // The typeError come from file_name not being an array in case of a simple folder
        // in this case we return true
        return true;
    }
}



function file_picker()
/*
*   Use the filesystem API given by the browser : 
*   Get the path and sub-path of every file/folder of the repertory that the user selected

    folder_selected_by_user/
        ├── gallery_1/
                ├── 1.jpg
                └── 2.jpg
        └── gallery_2/
                └── 1.jpg

*   Doesn't check if the file/folder is valid
*   The folder_selected_by_user is saved in a variable, so it can be used later for the path
*       due to how the API works, the folder_selected_by_user need to be either one level 
*       below where the Image Reader files are placed, or directly next to it.
*
    Valid : 
    repository/
        ├── folder_selected_by_user/
        ├── index.html
            ..
        └── code.js

    Valid : 
    repository/
        ├── folder/
                └──folder_selected_by_user/
        ├── index.html
            ..
        └── code.js
    
    NOT valid : 
    repository/
        ├── folder_selected_by_user/
        └── folder/
                ├── index.html
                    ..
                └── code.js

    NOT valid : 
    repository/
        ├── folder/
                └──folder_selected_by_user/
        └── folder/
                ├── index.html
                    ..
                └── code.js

*/
{   
    dict = {};
    top_directory = "";
    // Get the file and folder
    document.getElementById("filepicker").addEventListener("change", function(event) 
    {
        console.group("Get files and folders");
        let files = event.target.files;

        console.log(files)
        top_directory = files[0]["webkitRelativePath"].split("/");
        top_directory = top_directory[0]

        var test = true_if_simple_folder(files);
        console.log("true_if_simple_folder : " + test)

        console.log("Create folder name dictionnary")
        if (test)
        {
            dict[top_directory] = [] ;
            // take every folder name and put it into a list
            for (let i=0; i<files.length; i++) 
            {
                let path = files[i]["webkitRelativePath"];
                let file_name = path.split("/");
                dict[top_directory].push(file_name[1]);
            }
            add_option_in_menu(dict)
            load_and_print_pictures(dict, top_directory);
        }
        else 
        {
            // take every folder name and put it into a list
            for (let i=0; i<files.length; i++) 
            {
                let path = files[i]["webkitRelativePath"];
                let file_name = path.split("/");

                dict[file_name[1]] = [] ;
            }

            // recover the file name and them into the corresponding key (folder name) in the dict
            console.time("Get every file into list")
            for (let i=0; i<files.length; i++) 
            {
                try 
                {
                    let path = files[i]["webkitRelativePath"];
                    let file_name = path.split("/");
                    if (file_name[2].endsWith(".jpg") || file_name[2].endsWith(".png"))
                    {
                        dict[file_name[1]].push(file_name[2]);
                    }
                } catch (TypeError) 
                {
                    // try/catch required as some folder may not contain picture
                    console.warn("Some folder were empty or didn't contain pictures");
                }
            }
            console.timeEnd("Get every file into list")

            console.log("Change the menu with the new folder name")
            add_option_in_menu(dict)
            load_and_print_pictures(dict, top_directory);
        }
        console.groupEnd();
    }, false);

    return { dict, top_directory }
}



function load_and_print_pictures(dict, top_directory)  
/*
*   Get the selected option, then find a path with a similar name.
*   Due to html, any doublespace are removed when put inside the selected option menu
*   A check is done against a var containing every option without doublespace
*   If the check is true, it mean that we reach the path with the same name as in the
*       selected
*/
{
    console.group("Load and print the picture");

    var selected_option = get_select_option();

    console.time("Load every path and file name");
    for (var key in dict) 
    { 
        selected_option_without_doublespace = key.replace(/ +(?= )/g,'');
        var dict_copy = {}
        if (selected_option === selected_option_without_doublespace)
        {   
            dict_copy[key] = dict[key]
            print_picture(dict_copy, top_directory);
            $("#top_title").empty().append(key);
        }
    }
    console.timeEnd("Load every path and file name")
    console.log("Printing and loading done")
    console.groupEnd();
}



function arrow_key()  
/*
*   Check for right or left arrow keydown, then focus the menu and change the 
*       selected option one next step (right arrow) or previous step (left arrow)
*   Doesn't always work in the middle of a page (only focus the menu without changing
*       the current selected option)
*/
{
    document.onkeydown = function(event) 
    {   
        switch (event.keyCode) 
        {   
            case 37:
                document.getElementById("menu").focus();
                var select = document.getElementById('menu');
                select = select.selectedIndex - 1;
                break;
            case 39:    
                document.getElementById("menu").focus();      
                var select = document.getElementById('menu');
                select = select.selectedIndex + 1;
                break;
        }
    };
}



function Change_theme() 
/*
*   Self-explanatory
*/
{
    var true_if_light_theme = true;
    button_theme.onclick = function(event) 
    {   
        if (true_if_light_theme)
            Dark_theme();
        else
            Light_theme();
        true_if_light_theme = !true_if_light_theme;
    }

    function Dark_theme() 
    {
       document.body.style.background = "#525252";
       document.body.style.color = "#ca3e47";
       document.getElementById("menu").style.background = "#ca3e47";
       document.getElementById("menu").style.color = "#414141";

       document.getElementById("button_theme").className = "btn btn-light";
       document.getElementById("button_theme").innerHTML = "Light theme";
    }

    function Light_theme() 
    {
       document.body.style.background = "#FFFFFF";
       document.body.style.color = "#808080";
       document.getElementById("menu").style.background = "#c0392b";
       document.getElementById("menu").style.color = "white";

       document.getElementById("button_theme").className = "btn btn-dark";
       document.getElementById("button_theme").innerHTML = "Dark theme";
    }
}



$(document).ready( 
    function() 
    /*
    *   Self-explanatory
    */
    {
        // allow the filepicker to be clicked on
        value = file_picker();

        dict = value.dict;
        top_directory = value.top_directory;

        // Change the picture each time a new title in the menu list is selected
        menu.onchange = function() 
        {
            load_and_print_pictures(dict, top_directory);
        };

        // allow navigation with left and right arrow
        arrow_key();

        // allow the theme change
        Change_theme();
    }
);
