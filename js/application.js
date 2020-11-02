$('document').ready(function () {
    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=1',
        dataType: 'json',
        success: function (response, textStatus) {
            console.log(response.tasks);
            response.tasks.forEach(function (task) {
                passTask = '';
                var taskText = '';
                var taskNumber = $('.listRow').length + 1;
                var checkVal = 0;

                console.log(taskNumber);
                for (var key in task) {
                    console.log(task[key]);
                    if (key == "content") {
                        var taskText = task[key];
                        console.log(taskText);
                    }                    
                    if (key == "completed") {
                        console.log(task[key]);
                        if (task[key] == true) {
                            checkVal = "checked";
                        } 
                    }
                };

                $('tbody').append(
                    "<tr class='listRow'><th class='itemNumber align-middle'>" + taskNumber + "</th>" + 
                        "<td class='bg-transparent task align-middle'>" + taskText + "</td>" + 
                        "<td class='status pt-3'>" + 
                            "<div class='form-check'>" + 
                                "<input class='form-check-input completeChk' type='checkbox' value='' />" + 
                            "</div>" +
                        "</td>" +
                        "<td><button class='btn removeItem'><i class='far fa-trash-alt'></i></button></td>" + 
                    "</tr>"
                )

            });
            console.log(response);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

    $('body').on('click', 'input[type=checkbox]', function () {
        if ($(this).is(':checked')) {
          taskComplete($(this).closest('tr'));
        } else if ($(this).is(':not(:checked)')) {
          taskActive($(this).closest('tr')); 
          }
      })
    
    $('body').on('click', '.removeItem', function () {
        $(this).closest('tr').fadeToggle();
        $(this).closest('tr').hide(800, function () {
            $(this).closest('tr').remove();
            itemNumberUpdate();
        });      
    })

    $('#addItem').on('click', function () {
        var taskInput = $('#inputTask').val();
        console.log(taskInput);
        if (taskInput != false) {
            newTask(taskInput);
        } else {
            $('#inputTask').attr("placeholder", "Please enter a Task before trying to add item.");
        }
        
    })

});


var itemNumberUpdate = function () {
    var numberUpdate = 1;
    
    $('.itemNumber').each(function (i, ele) {
        $(ele).html(numberUpdate);
        numberUpdate++;        
    })
};

var taskComplete = function (task) {
    $(task).addClass('taskCompleted');
    // Push status update //
    console.log(task);
};

var taskActive = function (task) {
    $(task).removeClass('taskCompleted');
    // Push status update //
};

var newTask = function (task) {
    var taskText = task;
    var taskNumber = $('.itemNumber').length + 1
    console.log(taskNumber);
    
    $('tbody').append(
        "<tr class='listRow'><th class='itemNumber align-middle'>" + taskNumber + "</th>" + 
            "<td class='bg-transparent task align-middle'>" + taskText + "</td>" + 
            "<td class='status pt-3'>" + 
                "<div class='form-check'>" + 
                    "<input class='form-check-input completeChk' type='checkbox' value='' />" + 
                "</div>" +
            "</td>" +
            "<td><button class='btn removeItem'><i class='far fa-trash-alt'></i></button></td>" + 
        "</tr>"
    )
};