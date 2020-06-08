/// <reference path="babylon.js" />
/// <reference path="babylon.inspector.bundle.js" />
/// <reference path="babylonjs.loaders.min.js" />
/// <reference path="cannon.js" />
/// <reference path="Oimo.js" />
/// <reference path="ammo.js" />


// import babylon = require("./babylon");
// import babylonInspectorBundle = require("./babylon.inspector.bundle");
// import babylonjsLoadersMin = require("./babylonjs.loaders.min");
// import cannon = require("./cannon");
// //import Oimo = require("./Oimo");
// import ammo = require("./ammo");


//NOTA IMPORTANTE
// Lamentablemente al importar los modelos de Blender3D con Físicas
// no funcionan las colisiones o no se puede acceder al physics impostor
// osea habra que hacer hacer los modelos en blender3D y crear las físicas
// en babylon.js por codigo realmente parece un bug del motor


var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

class Playground {
    static CreateScene(engine, canvas) {

        var scene:BABYLON.Scene = new BABYLON.Scene(engine);//crea la escena
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
        //muestro el editor
        //BABYLON.Inspector.Show(scene);
        scene.debugLayer.show()

        var camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(10, 0, 5), scene);
        camera.target = new BABYLON.Vector3(30, 10, 0)
        camera.beta = 1.5;
        camera.alpha = 0;
        camera.radius = 0.700;

        camera.attachControl(canvas, true);

        var light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2: BABYLON.PointLight = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);


        var cubo:BABYLON.AbstractMesh;
        var suelo:BABYLON.AbstractMesh;


        BABYLON.SceneLoader.ImportMesh("", "./babylonBlenderFIle/", "Escenario.babylon", scene,
            //BABYLON.SceneLoader.ImportMesh("","/./","Gltf/Escenario.glb",scene,
            function (newMeshes : BABYLON.AbstractMesh[]) {
                var cubo: BABYLON.AbstractMesh = scene.getNodeByName("cubo") as BABYLON.AbstractMesh;
                //Try this but it doesn't work
                var soil: BABYLON.PhysicsImpostor = <unknown>scene.getNodeByName("suelo") as BABYLON.PhysicsImpostor; //NO WORK
                ///////////////////////////////
                console.log(BABYLON.Tags.GetTags(cubo));
                console.log(BABYLON.Tags.GetTags(soil));

                //var sueloFisico: BABYLON.PhysicsImpostor = new BABYLON.PhysicsImpostor(suelo,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,friction:0,damping:0},scene);
                //BABYLON.Tags.AddTagsTo(sueloFisico,"suelo");
                var showCollision: BABYLON.Debug.PhysicsViewer = new BABYLON.Debug.PhysicsViewer(scene);

 
                if (soil)//If the soil exists//
                {
                    console.log(soil.mass);//NO WORK
                    showCollision.showImpostor(soil);//NO WORK
                    soil.onCollideEvent = (collider, collidedWith) => { //NO WORK
                        console.log("algo colisiono con el suelo")//NO WORK
                        if (BABYLON.Tags.GetTags(collidedWith) === "cuboTags")//NO WORK
                        {
                            console.log("el cubo colisiono");//NO WORK
                        }
                    };
                }

            }
        );
        return scene;
    }
}
        


var createScene = function () { return Playground.CreateScene(engine, engine.getRenderingCanvas()); }
var engine;
try {
    engine = createDefaultEngine();
} catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}

if (!engine) throw 'engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});





        // // This creates a basic Babylon Scene object (non-mesh)
        // var scene = new BABYLON.Scene(engine);

        // // This creates and positions a free camera (non-mesh)
        // var camera:BABYLON.FreeCamera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        // // This targets the camera to scene origin
        // camera.setTarget(BABYLON.Vector3.Zero());

        // // This attaches the camera to the canvas
        // camera.attachControl(canvas, true);
        // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        // var light:BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // // Default intensity is 1. Let's dim the light a small amount
        // light.intensity = 0.7;
        // // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // var sphere:BABYLON.Mesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        // // Move the sphere upward 1/2 its height
        // sphere.position.y = 1;
        // // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        // return scene;