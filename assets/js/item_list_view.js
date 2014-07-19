
$(function() {

    $('#itemsPanel').puipanel({
        toggleable: true
    });

    applyItemsTableUI();
    applyItemButtonUI();
    disableItemButtons();
});

function applyItemButtonUI()
{
    $('#itemAdd').puibutton({
        icon: 'ui-icon-circle-plus',
        click: function(event) {
            window.location.href = "../../item/new/" + selectedItem;
        }
    });

    $('#itemEdit').puibutton({
        icon: 'ui-icon-pencil',
        click: function(event) {
            window.location.href = "../../item/view/" + currentItem;
        }
    });

    $('#itemPublish').puibutton({
        icon: 'ui-icon-document',
        click: function(event) {
            publishItem(true);
        }
    });

    $('#itemUnpublish').puibutton({
        icon: 'ui-icon-document',
        click: function(event) {
             publishItem(false);
        }
    });

    $('#itemActivate').puibutton({
        icon: 'ui-icon-lightbulb',
        click: function(event) {
            activateItem(true);
        }
    });


    $('#itemDeactivate').puibutton({
        icon: 'ui-icon-lightbulb',
        click: function(event) {
            activateItem(false);
        }
    });

    $('#itemDelete').puibutton({
        icon: 'ui-icon-circle-close',
        click: function(event) {
            window.location.href = "../../item/delete/" + currentItem;
        }
    });


}

function disableItemButtons()
{
    $('#itemEdit').puibutton('disable');
    $('#itemDelete').puibutton('disable');
    $('#itemPublish').hide();
    $('#itemActivate').hide();
    $('#itemUnpublish').hide();
    $('#itemDeactivate').hide();
}

function enableItemButtons(published, active)
{
    $('#itemEdit').puibutton('enable');
    $('#itemDelete').puibutton('enable');

    if (published)
    {
        $('#itemUnpublish').show()
    }
    else
    {
        $('#itemPublish').show();
    }

    if (active)
    {
        $('#itemDeactivate').show()
    }
    else
    {
        $('#itemActivate').show();
    }


}
function applyItemsTableUI()
{
    $('#itemsDataTable').puidatatable({
        caption: "Equipment Items",
        paginator: {
            rows: 20
        },
        columns: [
            {field: 'name', headerText: 'Name', sortable: true},
            {field: 'category', headerText: 'Category', sortable: true},
            {field: 'status', headerText: 'Status', sortable: true},
            {field: 'published', headerText: 'Is Published?', sortable: true},
            {field: 'active', headerText: 'Is Active?', sortable: true}
        ],
        datasource: function(callback) {
            $.ajax({
                type: "GET",
                url: '../getItemsJson/' + selectedItem,
                dataType: "json",
                context: this,
                success: function(response) {
                    callback.call(this, response);
                }
            });
        },
        selectionMode: 'single',
        rowSelect: function(event, data) {
            currentItem = data.id;
            enableItemButtons(data.published === 'Yes', data.active === 'Yes');
        },
        rowUnselect: function(event, data) {
            selectedItem = 0;
            disableItemButtons();
        }
    });
}

function activateItem(activate)
{
    $('input[name="item_id"]').val(currentItem.toString());
    $('input[name="item_activate"]').val(activate?'1':'0');
    $.post('../../item/activate', $('#activateForm').serialize())
            .done(function()
            {
                $('#itemsDataTable').puidatatable('unselectAllRows');
                location.reload();
            })
            .error(function()
            {
                $('#messages').puigrowl('show',
                        [{severity: 'error', summary: 'Error', detail: 'Failed to update item!'}]);
            });
}

function publishItem(publish)
{
    $('input[name="item_id"]').val(currentItem.toString());
    $('input[name="item_publish"]').val(publish?'1':'0');
    $.post('../../item/publish', $('#publishForm').serialize())
            .done(function()
            {
                $('#itemsDataTable').puidatatable('unselectAllRows');
                location.reload();
            })
            .error(function()
            {
                $('#messages').puigrowl('show',
                        [{severity: 'error', summary: 'Error', detail: 'Failed to update item!'}]);
            });
}





