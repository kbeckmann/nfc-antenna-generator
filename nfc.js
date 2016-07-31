// Units in mm
function nfc(c, margin, scale, turns, ant_length, ant_width, cond_width, cond_spacing) {
    c.height = scale * ant_length + 2 * margin;
    c.width = scale * ant_width + 2 * margin;
    c.style.width="100%";
    var ctx = c.getContext("2d");
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

        //console.log(segment, segment%4, x0, y0, x1, y1);
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

var canvas = document.getElementById('canvas');
canvas.style.border = "1px solid";


document.getElementById("downloadLnk").addEventListener("click", function(){
    var dt = canvas.toDataURL('image/png');
    this.href = dt;
});

canvas.addEventListener("click", function(){
    var dt = canvas.toDataURL('image/png');
    document.location = dt;
});

function inductance(ant_width, ant_height, cond_thickness, cond_width, cond_spacing, turns)
{
    const PI = 3.14159;
    const U0 = 1.25663e-6;
    const UR = 1;

    var a0 = ant_width / 1000;
    var b0 = ant_height / 1000;
    var t = cond_thickness / 1000;
    var w = cond_width / 1000;
    var g = cond_spacing / 1000;
    var n = turns;

    var d = 2 * (t + w) / PI;
    var aAvg = a0 - n * (g + w);
    var bAvg = b0 - n * (g + w);
    var x1 = aAvg * Math.log((2 * aAvg * bAvg) / (d * (aAvg + Math.sqrt(Math.pow(aAvg, 2) + Math.pow(bAvg, 2)))));
    var x2 = bAvg * Math.log((2 * aAvg * bAvg) / (d * (bAvg + Math.sqrt(Math.pow(aAvg, 2) + Math.pow(bAvg, 2)))));
    var x3 = 2 * (aAvg + bAvg - Math.sqrt(Math.pow(aAvg, 2) + Math.pow(bAvg, 2)));
    var x4 = (aAvg + bAvg) / 4;
    var l = ((U0 * UR) / PI) * (x1 + x2 - x3 + x4) * Math.pow(n, 1.8);
    var l_uH = l * 1000000;
    var l_uH_round = Math.round(l_uH * 1000) / 1000;
    return l_uH_round;
}

function generate() {
    function value(id, def) {
        var val = document.getElementById(id).value;
        return val.length > 0 ? parseFloat(val) : def;
    }

    function set_value(id, val) {
        document.getElementById(id).value = val;
    }

    var margin = value("margin", 20);
    var dpi = value("dpi", 2400)/25.4;
    var turns = value("turns", 3);
    var ant_height = value("ant_height", 10) * value("ant_height_unit", 1);
    var ant_width = value("ant_width", 20) * value("ant_width_unit", 1);
    var cond_width = value("cond_width", 0.6) * value("cond_width_unit", 1);
    var cond_thickness = value("cond_thickness", 0.03556) * value("cond_thickness_unit", 1);
    var cond_spacing = value("cond_spacing", 0.6) * value("cond_spacing_unit", 1);

    nfc(canvas,
        margin,
        dpi,
        turns,
        ant_height,
        ant_width,
        cond_width,
        cond_spacing);

    var ant_inductance = inductance(ant_width, ant_height, cond_thickness, cond_width, cond_spacing, turns);
    document.getElementById("ant_inductance").innerHTML = ant_inductance;
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


