// Units in mm
function nfc(c, margin, scale, turns, ant_length, ant_width, cond_width, cond_spacing) {
    c.height = scale * ant_length + 2 * margin;
    c.width = scale * ant_width + 2 * margin;
    var ctx = c.getContext("2d");
    //ctx.fillStyle = "#FFFF00";
    //ctx.fillStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,scale * ant_width + 2 * margin, scale * ant_length + 2 * margin);
    ctx.translate(margin, margin);

    var segments = turns * 4;

    ctx.fillStyle = "#000000";
    for (segment = 0; segment < segments; segment++) {
        var x0=0, y0=0, x1=0, y1=0;
        switch (segment % 4) {
            case 0:
            //ctx.fillStyle = "#FF0000";
            x0 = (segment / 4) * (cond_width + cond_spacing) - cond_spacing * (segment != 0);
            y0 = (segment / 4) * (cond_width + cond_spacing);
            x1 = ant_width - (segment / 4) * (cond_width + cond_spacing);
            y1 = y0 + cond_width;
            break;
            case 1:
            //ctx.fillStyle = "#00FF00";
            x0 = ant_width - ((segment-1) / 4) * (cond_width + cond_spacing) - cond_width;
            y0 = Math.floor(segment / 4) * (cond_width + cond_spacing);
            x1 = x0 + cond_width + 1/scale;
            y1 = ant_length - Math.floor(segment / 4) * (cond_width + cond_spacing);
            break;
            case 2:
            //ctx.fillStyle = "#0000FF7f";
            x0 = Math.floor(segment / 4) * (cond_width + cond_spacing);
            y0 = ant_length - Math.floor(segment / 4) * (cond_width + cond_spacing) - cond_width;
            x1 = ant_width - Math.floor(segment / 4) * (cond_width + cond_spacing);
            y1 = y0 + cond_width + 1/scale;
            break;
            case 3:
            //ctx.fillStyle = "#FF00FF7F";
            x0 = Math.floor((segment-3) / 4) * (cond_width + cond_spacing);
            y0 = Math.floor(segment / 4) * (cond_width + cond_spacing) + cond_width + cond_spacing;
            x1 = x0 + cond_width + 1/scale;
            y1 = ant_length - Math.floor(segment / 4) * (cond_width + cond_spacing);
            break;
        }

        console.log(segment, segment%4, x0, y0, x1, y1);
        ctx.fillRect(
            Math.floor(scale*x0),
            Math.floor(scale*y0),
            Math.floor(scale*(x1-x0)),
            Math.floor(scale*(y1-y0))
        );
    }

    var show_grid = false;
    if (show_grid) {
        ctx.fillStyle = "#FF0000";
        var w = 3;
        for (y = 0; y < ant_length; y++)
        for (x = 0; x < ant_width; x++) {
            x0 = x;
            x1 = x + 1/scale;
            y0 = y;
            y1 = y + 1/scale;
            console.log(x0, y0, x1, y1);
            ctx.fillRect(scale*x0, scale*y0, w, w);
        }
    }
}

var canvas = document.createElement('canvas');
canvas.style.border = "1px solid";
document.body.appendChild(canvas);


document.getElementById("downloadLnk").addEventListener("click", function(){
    var dt = canvas.toDataURL('image/png');
    this.href = dt;
});

canvas.addEventListener("click", function(){
    var dt = canvas.toDataURL('image/png');
    document.location = dt;
});

function generate() {
    function value(id, def) {
        return parseFloat(document.getElementById(id).value) || def;
    }
    nfc(canvas,
        value("margin", 20),
        value("dpi", 600)/25.4,
        value("turns", 3),
        value("ant_length", 10),
        value("ant_width", 20),
        value("cond_width", 0.6),
        value("cond_spacing", 0.6));
}
document.getElementById("generate").addEventListener("click", generate);


generate();

// for testing stupid rounding errors
if (0) {
    var dpi = 207;
    setInterval(function(){
        dpi += 1;
        nfc(canvas,0, dpi / 25.4, 3, 20, 30, 1, 2)
    }, 50);
}


