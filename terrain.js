import * as THREE from 'three';

const square_float_count = 18;

function create_vertices(resolution, map, map_scale, scale_xz, scale_y, offset_x, offset_y) {
    var vertices = new Float32Array(resolution*resolution*square_float_count);
    var width = scale_xz/(resolution+1);
    var map_size = (resolution+1) * (1/map_scale);
    var relative_x_offset = Math.floor(0.01*offset_x*(1-map_scale)*map_size);
    var relative_y_offset = Math.floor(0.01*offset_y*(1-map_scale)*map_size);
    var index;
    for(var row=0;row<resolution; row++) {
        for(var column=0;column<resolution;column++) {
            //First Triangle
            index = (row*resolution*square_float_count)+(column*square_float_count);
            vertices[index]=width*column;
            vertices[index+1]=scale_y*map[[relative_x_offset+column, relative_y_offset+row]];
            vertices[index+2]=width*row;
    
            vertices[index+3]=width*column;
            vertices[index+4]=scale_y*map[[relative_x_offset+column, relative_y_offset+row+1]];
            vertices[index+5]=width*row+width;
    
            vertices[index+6]=width*column+width;
            vertices[index+7]=scale_y*map[[relative_x_offset+column+1, relative_y_offset+row]];
            vertices[index+8]=width*row;
            
            //Second Triangle
            vertices[index+9]=width*column+width;
            vertices[index+10]=scale_y*map[[relative_x_offset+column+1, relative_y_offset+row]];
            vertices[index+11]=width*row;
    
            vertices[index+12]=width*column;
            vertices[index+13]=scale_y*map[[relative_x_offset+column, relative_y_offset+row+1]];
            vertices[index+14]=width*row+width;
    
            vertices[index+15]=width*column+width;
            vertices[index+16]=scale_y*map[[relative_x_offset+column+1, relative_y_offset+row+1]];
            vertices[index+17]=width*row+width;
        }
    }
    return vertices;
}

export function regenerate_mesh(mesh, resolution, map, map_scale, scale_xz, scale_y, offset_x, offset_y) {
    var vertices = create_vertices(resolution, map, map_scale, scale_xz, scale_y, offset_x, offset_y);
    var geometry = mesh.geometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    //mesh.geometry.getAttribute('position').needsUpdate=true; //documentation says to do this but is it actually
}

export function create_mesh(resolution, map, map_scale, scale_xz, scale_y, offset_x, offset_y) {
    var geometry = new THREE.BufferGeometry();
    var vertices = create_vertices(resolution, map, map_scale, scale_xz, scale_y, offset_x, offset_y);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    var material = new THREE.MeshPhongMaterial({color:0x01796F});
    material.wireframe=false;
    return new THREE.Mesh(geometry, material);
}