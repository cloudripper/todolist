$('document').ready(function () {
    startGetTasks();

    $('body').on('click', '.statusBtn', function () {
        var targetRow = $(this).closest('tr');
        var statusChk = $(this).text();
        console.log(statusChk);

        if (statusChk == "Active") {
          taskComplete(targetRow);
        } else if (statusChk == "Complete") {
          taskActive(targetRow); 
          }
      })
    
    $('body').on('click', '.removeItem', function () {
        var target = $(this).closest('tr');
        target.fadeToggle();
        target.hide(800, function () {
            remTasks(target);
            itemNumberUpdate();
        });      
    })

    $('body').keydown('#inputTask', function(e) {
        if (e.keyCode == 13) {
            var taskInput = $('#inputTask').val();
        
            if (taskInput != false) {
                newTask(taskInput);
                $('#inputTask').val('');
            } else {
                $('#inputTask').attr("placeholder", "Please enter a Task before trying to add item.");
            }
        }
    })

    $('#addItem').on('click', function () {
        var taskInput = $('#inputTask').val();
        
        if (taskInput != false) {
            newTask(taskInput);
            $('#inputTask').val('');
        } else {
            $('#inputTask').attr("placeholder", "Please enter a Task before trying to add item.");
        }
    })

});

var remTasks = function (tr) {
    var taskID = $(tr).children('td.idContainer').text();
    var delURL = 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '?api_key=213'

    $.ajax({
        type: 'DELETE',
        url: delURL,
        success: function (response, textStatus) {
            console.log(response);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
};

var getTask = function (getID) {
    var getURL = 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + getID + '?api_key=213'

    $.ajax({
        type: 'GET',
        url: getURL,
        dataType: 'json',
        success: function (response, textStatus) {
            console.log(response.task['completed']);
        
            var taskNumber = $('.listRow').length + 1;
            var compOrActive = '';    
            var buttonText = 'Active'
            var buttonClass = 'btn-light';

            if (response.task['completed'] == true) {
                compOrActive = 'taskCompleted';
                buttonText = 'Complete'
                buttonClass = 'btn-dark';
            } 

            $('tbody').append(
                "<tr class='listRow " + compOrActive + "'><th class='itemNumber align-middle'>" + taskNumber + "</th>" + 
                    "<td class='d-none idContainer'>" + response.task['id'] + "</td>" + 
                    "<td class='bg-transparent task align-middle'>" + response.task['content'] + "</td>" + 
                    "<td class='status pt-3'>" + 
                        "<button class='btn btn-sm " + buttonClass + " statusBtn'>" + buttonText + "</button>" + 
                    "</td>" +
                    "<td><button class='btn removeItem'><i class='far fa-trash-alt'></i></button></td>" + 
                "</tr>"
            )
            itemNumberUpdate();
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
    
};


var startGetTasks = function () {
    $('tbody').children().remove();
    console.log('remove DOM content');

    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
        dataType: 'json',
        success: function (response, textStatus) {
            console.log(response.tasks);

            response.tasks.forEach(function (task) {
                var taskText = '';
                var taskNumber = $('.listRow').length + 1;
                var idVal = 0;
                var compOrActive = '';
                var buttonText = 'Active';
                var buttonClass = 'btn-light';

                for (var key in task) {
                    if (key == "content") {
                        var taskText = task[key];
                    }                    
                    if (key == "completed") {
                        if (task[key] == true) {
                            compOrActive = 'taskCompleted';
                            buttonClass = 'btn-dark';
                            buttonText = 'Complete';
                        } 
                    }
                    if (key == "id") {
                        var idVal = task[key];
                    }
                };

                $('tbody').append(
                    "<tr class='listRow " + compOrActive + "'><th class='itemNumber align-middle'>" + taskNumber + "</th>" + 
                        "<td class='d-none idContainer'>" + idVal + "</td>" + 
                        "<td class='bg-transparent task align-middle'>" + taskText + "</td>" + 
                        "<td class='status pt-3'>" + 
                            "<button class='btn btn-sm " + buttonClass + " statusBtn'>" + buttonText + "</button>" + 
                        "</td>" +
                        "<td><button class='btn removeItem'><i class='far fa-trash-alt'></i></button></td>" + 
                    "</tr>"
                )

            });
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
};

var itemNumberUpdate = function () {
    var numberUpdate = 1;
    
    $('.itemNumber').each(function (i, ele) {
        $(ele).html(numberUpdate);
        numberUpdate++;        
    })
};

var taskComplete = function (taskRow) {
    var taskID = $(taskRow).children('td.idContainer').text();
    var addURL = 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '/mark_complete?api_key=213'
    
    $.ajax({
        type: 'PUT',
        url: addURL,
        contentType: 'application/JSON',
        dataType: 'json',
        success: function (response, textStatus) {
            console.log(response + " response");
            $(taskRow).remove();
            getTask(taskID);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

};

var taskActive = function (task) {
    var taskID = $(task).children('td.idContainer').text();
    console.log(taskID);
    var remURL = 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskID + '/mark_active?api_key=213'
    console.log(remURL);

    $.ajax({
        type: 'PUT',
        url: remURL,
        contentType: 'application/JSON',
        dataType: 'json',
        success: function (response, textStatus) {
            console.log(response);
            $(task).remove();
            getTask(taskID);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

};

var newTask = function (task) {
    var taskText = task;

    $.ajax({
        type: 'POST',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
        contentType: 'application/JSON',
        dataType: 'json',
        data: JSON.stringify({
            task: {
                content: taskText,
                completed: false,
            }
        }),
        success: function (response, textStatus) {
            console.log(response.task['id']);
            getTask(response.task['id']);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });
    
};