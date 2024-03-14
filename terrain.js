import * as THREE from 'three';
import {options} from './options.js';

const square_float_count = 18;

function create_vertices(map) {
    var vertices = new Float32Array(options.resolution.current*options.resolution.current*square_float_count);
    var width = options.scale.xz/(options.resolution.current+1);
    var map_size = (options.resolution.current+1) * (1/options.map_scale.current);
    var relative_x_offset = Math.floor(0.01*options.offset.x*(1-options.map_scale.current)*map_size);
    var relative_y_offset = Math.floor(0.01*options.offset.y*(1-options.map_scale.current)*map_size);
    var index;
    for(var row=0;row<options.resolution.current; row++) {
        for(var column=0;column<options.resolution.current;column++) {
            //First Triangle
            index = (row*options.resolution.current*square_float_count)+(column*square_float_count);
            vertices[index]=width*column;
            vertices[index+1]=options.scale.y*map[[relative_x_offset+column, relative_y_offset+row]];
            vertices[index+2]=width*row;
    
            vertices[index+3]=width*column;
            vertices[index+4]=options.scale.y*map[[relative_x_offset+column, relative_y_offset+row+1]];
            vertices[index+5]=width*row+width;
    
            vertices[index+6]=width*column+width;
            vertices[index+7]=options.scale.y*map[[relative_x_offset+column+1, relative_y_offset+row]];
            vertices[index+8]=width*row;
            
            //Second Triangle
            vertices[index+9]=width*column+width;
            vertices[index+10]=options.scale.y*map[[relative_x_offset+column+1, relative_y_offset+row]];
            vertices[index+11]=width*row;
    
            vertices[index+12]=width*column;
            vertices[index+13]=options.scale.y*map[[relative_x_offset+column, relative_y_offset+row+1]];
            vertices[index+14]=width*row+width;
    
            vertices[index+15]=width*column+width;
            vertices[index+16]=options.scale.y*map[[relative_x_offset+column+1, relative_y_offset+row+1]];
            vertices[index+17]=width*row+width;
        }
    }
    return vertices;
}

export function regenerate_mesh(mesh, map) {
    var vertices = create_vertices(map);
    var geometry = mesh.geometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    //mesh.geometry.getAttribute('position').needsUpdate=true; //documentation says to do this but is it actually
}

export function create_mesh(map) {
    var geometry = new THREE.BufferGeometry();
    var vertices = create_vertices(map);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    var material = new THREE.MeshPhongMaterial({color:0x01796F});
    material.wireframe=false;
    return new THREE.Mesh(geometry, material);
}