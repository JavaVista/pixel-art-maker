let isDown = false; // Tracks mouse button

function makeGrid(cols, rows) {
    let addTr = '<tr></tr>'.repeat(cols);
    let addTd = '<td></td>'.repeat(rows);
    $('#pixel_canvas')
        .empty()
        .append(addTr);
    $('#pixel_canvas tr').append(addTd);
    $('#show-grid').prop('checked', true); // Fixes gridlines toggle-label incosistency
    $('#gridlines').removeClass('hidden');
    isDown = false; // Mouse up
}

function paint(td, color) {
    $(td).css('background-color', color.val());
}

$(function () { //document is ready
    const color = $('#colorPicker');
    const height = $('#input_height');
    const width = $('#input_width');

    // When size is submitted, call makeGrid()
    $('#sizePicker').submit(function (event) {
        event.preventDefault();
        makeGrid(height.val(), width.val());
    });

    // On table cell click or click and drag, call paint()
    $('#pixel_canvas').mousedown('td', function (event) {
            event.preventDefault();
            isDown = true; // Mouse down
            let td = event.target.closest('td');
            paint(td, color);
        })
        .mouseup(function () {
            isDown = false; // Mouse up
        })
        .mouseover('td', function (event) {
            let td = event.target.closest('td');
            if (isDown) {
                paint(td, color);
            }
        })
        .mouseleave(function () {
            isDown = false; // Mouse up outside canvas
        });

    // Toggle gridlines
    $('#show-grid').change(function () {
        $('#pixel_canvas tr, #pixel_canvas td').toggleClass('no-border');
    });
});