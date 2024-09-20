console.log("main js!");

let t = THREE;
let w = window.innerWidth;
let h = window.innerHeight;
let camera, scene, renderer, world;
let pixR =  window.devicePixelRatio ? window.devicePixelRatio : 1;


(function init ()
{
	console.log("init");
	setupScene();
	render();

	window.addEventListener("resize", resize);
})();


function setupScene ()
{
	//PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
	camera = new t.PerspectiveCamera(50, w/h, 0.00001, 2000);
	camera.position.z = 500;
	
	scene = new t.Scene();
	scene.background = new t.Color(0);
	scene.add( camera );

	renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true, alpha: true});
	renderer.setPixelRatio(pixR);
	renderer.setSize( w, h );
    
  	world = new t.Object3D();
  	scene.add(world);

  	let c = new t.Mesh(new t.BoxGeometry(100, 100, 100), new t.MeshBasicMaterial({color: 0x00FF00, wireframe: true}));
  	world.add(c);

  	renderer.domElement.setAttribute("id", "scene");
	document.body.appendChild( renderer.domElement );
}

function render ()
{
	renderer.render(scene, camera);
	world.rotation.y += .001;
	requestAnimationFrame(render);
}

function resize ()
{
	let w = window.innerWidth;
	let h = window.innerHeight;

	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize( w, h, true);
	
}