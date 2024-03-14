import { options } from "./options.js";

export function create_grid() {
    var grid = [[,]];
    for(var i=0;i<options.grid_size.current+1;i++) {
        for(var j=0;j<options.grid_size.current+1;j++) {
            grid[[i, j]] = random_vector();
        }
    }
    return grid;
}

function random_vector() {
    var theta = Math.random() * 2 * Math.PI;
    return {x:Math.cos(theta), y:Math.sin(theta)};
}

function interpolate(a, b, x) {
    return (b-a)*smoother_step(x) + a;
}

function smoother_step(x) {
    return 6*x**5 - 15*x**4 + 10*x**3;
}

function get_perlin(grid, x, y) {
    var x0 = Math.floor(x);
    var x1 = x0+1;
    var y0 = Math.floor(y);
    var y1 = y0+1;

    var top_left = dot_product_grid(grid, x, y, x0, y0);
    var top_right = dot_product_grid(grid, x, y, x1, y0);
    var bottom_left = dot_product_grid(grid, x, y, x0, y1);
    var bottom_right = dot_product_grid(grid, x, y, x1, y1);

    var interpolate_top = interpolate(top_left, top_right, x-x0);
    var interpolate_bottom = interpolate(bottom_left, bottom_right, x-x0);
    var value = interpolate(interpolate_top, interpolate_bottom, y-y0);
    return value;
}

function dot_product_grid(grid, x, y, ix, iy) {
    var dx = x-ix;
    var dy = y-iy;
    return (dx*grid[[ix,iy]].x+dy*grid[[ix,iy]].y);
}
export function create_map(grid) {
    if(options.map_scale.current == 0) return; 
    var map = [[,]];
    var sample_size = options.grid_size.current/(options.resolution.current+1)*options.map_scale.current;
    for(var row=0;row<(resolution+1)*(1/options.map_scale.current); row++) {
        for(var column=0;column<(options.resolution.current+1)*(1/options.map_scale.current);column++) {
            map[[column, row]] = get_perlin(grid, sample_size*column, sample_size*row);
        }
    }
    return map;
}

export function create_layered_map(grid) {
    if(options.map_scale.current == 0) return; 
    var map = [[,]];
    var sample_size = options.grid_size.current/(options.resolution.current+1)*options.map_scale.current;
    var lacunarity_scale_factor = Math.pow(options.lacunarity.current, options.octaves.current-1);
    for(var row=0;row<(options.resolution.current+1)*(1/options.map_scale.current); row++) {
        for(var column=0;column<(options.resolution.current+1)*(1/options.map_scale.current);column++) {
            var value = 0;
            var frequency = 1;
            var amplitude = 1;
            for(var i=0; i<options.octaves.current; i++) {
                value += get_perlin(grid, sample_size*column*frequency/lacunarity_scale_factor, 
                    sample_size*row*frequency/lacunarity_scale_factor) * amplitude;
                amplitude*=options.persistance.current;
                frequency*=options.lacunarity.current;
            }
            map[[column, row]] = value;
        }
    }
    return map;
}