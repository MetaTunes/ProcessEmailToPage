$(document).ready(function() {
	// Add an "Add category" button to the Email Categories container
	$('#EmailCategories').after('<p><br /><button class="ui-button ui-state-default" id="addCategory" style="display: block; clear: left;">Add another category</button><br /></p>');

	$('#EmailCategories .InputfieldWrapper').each(function() {
        $(this).prepend('<label style="cursor:move;" class="etp-header InputfieldHeader" for="">&nbsp;<span class="ui-icon ui-icon-trash InputfieldRepeaterTrash deleterow" style="display: block;float:right;cursor:pointer;">Delete</span><span class="ui-icon ui-icon-arrowthick-2-n-s InputfieldRepeaterDrag"></span></label>');
		$(this).css("margin-top", "20px");
	});

	// Handle what happens on click of our new button
	var addCategory = function(e) {
		e.preventDefault();
		$(this).toggleClass('ui-state-active');
		var options = { sortable: false };
		var newCategory = $('<li class="Inputfield InputfieldWrapper InputfieldColumnWidthFirst" style="margin-top:20px;">').load('?addCategory=' + ($('#EmailCategories ul.Inputfields ul.Inputfields').length), function() {
			$(newCategory).prepend('<label style="cursor:move;" class="etp-header InputfieldHeader" for="">&nbsp;<span class="ui-icon ui-icon-trash InputfieldRepeaterTrash deleterow" style="display: block;float:right;cursor:pointer;">Delete</span><span class="ui-icon ui-icon-arrowthick-2-n-s InputfieldRepeaterDrag"></span></label>');
 			$(newCategory).find(".InputfieldAsmSelect select[multiple=multiple]").asmSelect(options);
			$(".InputfieldPageListSelectData").each(function() {
				InputfieldPageListSelect.init($(this));
			});
		});
		$('.Inputfields').not('.ui-helper-clearfix').append(newCategory);

	};

    if ($.isFunction($(document).on)) {
		$(document).on('click', '#addCategory', addCategory);
    }
    else {
		$('#addCategory').live('click', addCategory);
    }

	// Handle click of the delete button
	var deleteRow = function(e){
		e.preventDefault();
		$(this).toggleClass('ui-state-active');
		$(this).parent().parent().remove();
	}

    if ($.isFunction($(document).on)) {
	    $(document).on('click', '.deleterow', deleteRow);
    } else {
		$('.deleterow').live('click', deleterow);
	}


	// Adds the number to each row of category fields
	$('#EmailCategories ul.Inputfields ul.Inputfields').each(function(i) {
		$(this).find('li label').each(function() {
			$(this).html($(this).html() + ' #' + (i+1));
		});
	});

	// Hide the module hash and append it to the URL in the description
	$('#Inputfield_moduleHash').prop('type', 'hidden');
	$('#wrap_Inputfield_moduleHash p.description').append($('#Inputfield_moduleHash').val());

	// Takes over from normal submit to store our categories in an array and then submit as normal
	$('#Inputfield_submit_save_module, #Inputfield_submit').click(function(e) {
		if ($('#EmailCategories').length) {
			// A variable to store the CSV data in
			var data = new Array();
			// Iterate through the rows of email categories
			$('#EmailCategories ul.Inputfields ul.Inputfields').each(function(i) {
				// If our check of the row's values shows they aren't empty, add them to our data variable
				if ($(this).find('input[name=emailAddress]').val().length > 0 && $(this).find('input[name=emailCategory]').val() > 0 && $(this).find('select[name=emailTemplate]').val() > 0) {
					data[i] = {};
					data[i]['emailAddress'] = $(this).find('input[name=emailAddress]').val();
					data[i]['notifyUsersCategory'] = $(this).find('select[id=Inputfield_notifyUsersCategory]').val();
					// MDE added ***
					data[i]['notifyFromEmailCategory'] = $(this).find('input[name=notifyFromEmailCategory]').val();
					data[i]['notifySubjectCategory'] = $(this).find('input[name=notifySubjectCategory]').val();
					data[i]['notifyBodyCategory'] = $(this).find('textarea[id=Inputfield_notifyBodyCategory]').val();
					// MDE end of added ***
					data[i]['emailCategory'] = $(this).find('input[name=emailCategory]').val();
					data[i]['emailTemplate'] = $(this).find('select[name=emailTemplate]').val();
					data[i]['bodyField'] = $(this).find('select[name=bodyField]').val();
					data[i]['nameField'] = $(this).find('select[name=nameField]').val();
					data[i]['emailField'] = $(this).find('select[name=emailField]').val();
					data[i]['userField'] = $(this).find('select[name=userField]').val();
					data[i]['dateField'] = $(this).find('select[name=dateField]').val();
					data[i]['imagesField'] = $(this).find('select[name=imagesField]').val();
					data[i]['embedImages'] = $(this).find('select[name=embedImages]').val();
					data[i]['filesField'] = $(this).find('select[name=filesField]').val();
				}
			});
			if (getObjectSize(data) > 0) {
				$('#Inputfield_categoryData').val(JSON.stringify(data));
			} else {
				$('#Inputfield_categoryData').val('');
			}
			// debugger;  // MDE to enable debugger in Chrome
			// Abandoned as if I preventDefault and submit via ajax then no other values get saved :( Left for future perusal
			/*$.ajax({
				url:'?saveCategories=' + stringJSON,
				success:function(result)
				{
					 $('#ModuleEditForm').submit();
				}
			});*/
		}
	});

	// Ensure the delimiter preview holds any currently saved fields
	updateDelimiterPreview();

	// Updates the delimiter preview box when the select is updated
	$('#Inputfield_delimiterField').change(function(e) {
		updateDelimiterPreview();
    });
});

// Gets the number of elements in an object (easier for arrays of course, but we're dealing with an object)
var getObjectSize = function(obj) {
    var len = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) len++;
    }
    return len;
};

// Updates the delimiter preview to show the site administrator the correct format of delimiters
var updateDelimiterPreview = function() {
	$('#Inputfield_delimiterPreview').val('');
        $('#Inputfield_delimiterField option:selected').each(function() {
		$('#Inputfield_delimiterPreview').val($('#Inputfield_delimiterPreview').val() + "==" + $(this).html() + "==\n");
	});
}
