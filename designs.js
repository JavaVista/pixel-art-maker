let isDown = false; // Track mouse button
let pixelData = [];

// Generate table and add rows-arrays to pixelData
function makeGrid(rows, cols) {
    $('#pixel_canvas').empty();
    for (let row = 0; row < rows; row++) {
        let addTr = '<tr>';
        for (let col = 0; col < cols; col++) {
            addTr += '<td data-x="' + row + '" data-y="' + col + '"></td>';
        }
        addTr += '</tr>';
        $('#pixel_canvas').append(addTr);
    }
    for (let i = 0; i < rows; i++) {
        pixelData[i] = [];
    }
    resetGrid();
}

function resetGrid() {
    $('#show-grid').prop('checked', true); // Fix gridlines toggle-label incosistency
    $('#gridlines').removeClass('hidden');
    $('#download').removeClass('hidden');
}

// Paint table and add hex value to pixelData
function paint(td, color) {
    $(td).css('background-color', color.val());
    let canvasX = parseInt($(td).data('x'));
    let canvasY = parseInt($(td).data('y'));
    pixelData[canvasX][canvasY] = color.val();
}

function hextoRGBA(hex) {
    if (hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", 1)";
    } else {
        return "rgba(255, 255, 255, 1)";
    }
}

$(function () { // Document is ready

    const color1 = $('#colorPicker1');
    const color2 = $('#colorPicker2');
    const height = $('#input_height');
    const width = $('#input_width');

    // When size is submitted, call makeGrid()
    $('#sizePicker').submit(function (event) {
        event.preventDefault();
        makeGrid(height.val(), width.val());
    });

    // On table cell click or click && drag, call paint()
    $('#pixel_canvas')
        .mousedown('td', function (event) {
            event.preventDefault();
            isDown = true; // Mouse down
            let cell = event.target.closest('td');
            let color = event.which === 1 ? color1 : color2;
            paint(cell, color);
        })
        .mouseover('td', function (event) {
            let cell = event.target.closest('td');
            let color = event.which === 1 ? color1 : color2;
            if (isDown) {
                paint(cell, color);
            }
        })
        .on("mouseup mouseleave", function () {
            isDown = false; // Mouse up or outside canvas
        })
        .contextmenu(function () {
            return false; // Disabled inside canvas
        });

    // Toggle gridlines
    $('#show-grid').change(function () {
        $('#pixel_canvas tr, #pixel_canvas td').toggleClass('no-border');
    });

    const setCanvas = function (w, h) {
        $('#canvas').attr("width", w);
        $('#canvas').attr("height", h)
    };

    const dataToCanvas = function (w, h) {
        let canvas = document.getElementById('canvas');
        $ctx = canvas.getContext('2d');
        $ctx.clearRect(0, 0, w, h);
        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                let hex = pixelData[x][y];
                $ctx.fillStyle = hextoRGBA(hex);
                $ctx.fillRect(y, x, 1, 1);
            }
        }
    };

    $('#export').click(function (event) {
        let cwidth = parseInt(width.val(), 10);
        let cheight = parseInt(height.val(), 10);
        setCanvas(cwidth, cheight);
        dataToCanvas(cwidth, cheight);
        const link = document.getElementById('download');
        link.href = canvas.toDataURL(); // Set data-uri as href, default PNG
        link.download = 'myPixelArt.png'; // Set filename
    });

});