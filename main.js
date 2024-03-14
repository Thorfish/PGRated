//Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as terrain from "./terrain.js";
import * as perlin from "./perlin.js";
import { GUI } from 'dat.gui';
import { options } from './options.js';

// #region Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

function window_resize() {
    camera.aspect=window.innerWidth/window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', window_resize);
// #endregion
// #region Lighting
const light_sky = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6 );
light_sky.color.setHSL(0.6, 0.75, 0.6);
light_sky.groundColor.setHSL(0.1, 0.5, 0.5);
light_sky.position.set(0, 500, 0);
const light_dir = new THREE.DirectionalLight(0xffffff, 1);
light_dir.position.set(-50, 40, 50);
light_dir.castShadow=true;
// #endregion
// #region Build
var grid = perlin.create_grid();
var map = perlin.create_layered_map(grid);
var mesh = terrain.create_mesh(map);
var remake_map = false;
var regenerate_grid = { regen_grid:function(){
    options.grid_size.current = options.grid_size.new;
    grid = perlin.create_grid();
    regenerate_map.regen_map();
    terrain.regenerate_mesh(mesh, map);
}};
var regenerate_map = { regen_map:function(){
    remake_map = false;
    options.resolution.current = options.resolution.new;
    options.map_scale.current = options.map_scale.new;
    options.octaves.current = options.octaves.new;
    options.persistance.current = options.persistance.new;
    options.lacunarity.current = options.lacunarity.new;
    map = perlin.create_layered_map(grid);
    terrain.regenerate_mesh(mesh, map);
}};
var update_mesh = { up_mesh:function(){
    if(options.grid_size.current != options.grid_size.new) {
        options.grid_size.current = options.grid_size.new;
        grid = perlin.create_grid();

        //Make sure the map also gets remade
        remake_map = true;
    }   
    if(remake_map || (options.resolution.current != options.resolution.new) || (options.map_scale.current != options.map_scale.new)
    || (options.octaves.current != options.octaves.new) || (options.persistance.current != options.persistance.new)|| (options.lacunarity.current != options.lacunarity.new)) {
        remake_map = false;
        options.resolution.current = options.resolution.new;
        options.map_scale.current = options.map_scale.new;
        options.octaves.current = options.octaves.new;
        options.persistance.current = options.persistance.new;
        options.lacunarity.current = options.lacunarity.new;
        map = perlin.create_layered_map(grid);
    }
    terrain.regenerate_mesh(mesh, map);}
};
// #endregion
// #region GUI
const gui = new GUI();
var terrain_folder = gui.addFolder('Terrain Options');
terrain_folder.add(options.scale, 'xz', options.scale.min, options.scale.max, options.scale.step).name('XZ Scale');
terrain_folder.add(options.scale, 'y', options.scale.min, options.scale.max, options.scale.step).name('Y Scale');
terrain_folder.add(options.resolution, 'new', options.resolution.min, options.resolution.max, options.resolution.step).name('Resolution');
terrain_folder.open();
var grid_folder = gui.addFolder('Perlin Grid');
grid_folder.add(options.grid_size, 'new', options.grid_size.min, options.grid_size.max, options.grid_size.step).name('Size');
grid_folder.add(regenerate_grid, 'regen_grid').name('Regenerate Grid');
grid_folder.open();
var map_folder = gui.addFolder('Perlin Map');
map_folder.add(options.map_scale, 'new', options.map_scale.min, options.map_scale.max, options.map_scale.step).name('Scale');
map_folder.add(options.offset, 'x', options.offset.min, options.offset.max, options.offset.step).name('X Offset');
map_folder.add(options.offset, 'xscroll').name('X Scroll');
map_folder.add(options.offset, 'y', options.offset.min, options.offset.max, options.offset.step).name('Y Offset');
map_folder.add(options.offset, 'yscroll').name('Y Scroll');
map_folder.add(options.octaves, 'new', options.octaves.min, options.octaves.max, options.octaves.step).name('Octaves');
map_folder.add(options.persistance, 'new', options.persistance.min, options.persistance.max, options.persistance.step).name('Persistance');
map_folder.add(options.lacunarity, 'new', options.lacunarity.min, options.lacunarity.max, options.lacunarity.step).name('Lacunarity');
map_folder.add(regenerate_map, 'regen_map').name('Regenerate Map');
map_folder.open();
gui.add(options, 'always_update').name('Always Update');
gui.add(update_mesh, 'up_mesh').name('Update Mesh');
// #endregion
// #region Add to Scene
scene.add(mesh);
scene.add(camera);
//scene.add(light_sky);
scene.add(light_dir);
// #endregion
// #region Animate
function animate() {
    requestAnimationFrame(animate);
    if(options.offset.xscroll) {
        options.offset.x += options.offset.step;
        if(options.offset.x > options.offset.max) {
            options.offset.x=options.offset.min;
        }
    }
    if(options.offset.yscroll) {
        options.offset.y += options.offset.step;
        if(options.offset.y > options.offset.max) {
            options.offset.y=options.offset.min;
        }
    }
    if(options.always_update) {
        update_mesh.up_mesh();
    }
    renderer.render(scene, camera);
}

animate();
// #endregion