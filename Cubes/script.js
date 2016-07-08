var getXHR = function(url){
  return new Promise(function(resolve,reject){
    loadTextResource(url, function (err, data) {
      if (err) {
        reject(err);
      }else{
        resolve(data);
      }
    })
})}

var main=function(shaders) {

  canvas=document.getElementById("canvas_webgl");
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  stats = new Stats();
  container.appendChild( stats.dom );
  

  try {
    GL = canvas.getContext("webgl", {antialias: true,alpha:false});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  GL.getExtension("OES_element_index_uint");
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearDepth(1.0);
  GL.clearColor(1., 1., 1., 1.0);
  //Couleur de Fond

  GL.enable(GL.CULL_FACE);
  GL.cullFace(GL.BACK);
  GL.frontFace(GL.CW);



  var cubes = new Cubes(GL, shaders.cubes.VS, shaders.cubes.FS, NUMBER,SIZE_SQUARES,SIZE_CONTAINER);

  var light = {
    sun:{
      direction:new Float32Array([0.,-4.,-3.]),
      color:new Float32Array([1.0,1.0,1.0]),
    },
    ambientLightIntensity:new Float32Array([0.4,0.4,0.4]),
  }

  var pmatrix= new Float32Array(16);
  var vmatrix= new Float32Array(16);
  var mmatrix= new Float32Array(16);
  mat4.identity(mmatrix);

  //CONFIG N1
  
  // translation = vec3.fromValues(0,0.,-1);
  // mat4.fromTranslation(vmatrix, translation);
   /*
   mat4.ortho(pmatrix,-0.2,0.2,-0.2,0.2, 0, 2);
  */

  //CONFIG N2
  /*
  translation = vec3.fromValues(0,0,-1);
  var rotquat = quat.create()
  quat.rotateZ(rotquat,rotquat,glMatrix.toRadian(30));
  quat.rotateX(rotquat,rotquat,glMatrix.toRadian(30));
   quat.rotateY(rotquat,rotquat,glMatrix.toRadian(30));
  mat4.fromRotationTranslation(vmatrix, rotquat, translation);
  mat4.ortho(pmatrix,-0.3,0.3,-0.3,0.3,0,5);
  */

  //CONFIG N3

 
  mat4.lookAt(vmatrix,[POSITION_CAMERA.x,POSITION_CAMERA.y,POSITION_CAMERA.z], [POINT_TO_LOOK_AT.x,POINT_TO_LOOK_AT.y,POINT_TO_LOOK_AT.z],[0,1,0]);
  mat4.perspective(pmatrix,glMatrix.toRadian(60),window.innerWidth/window.innerHeight,0.1,50);
  
  //var fov = {upDegrees:30,downDegrees:30,leftDegrees:30,rightDegrees:30};
  //mat4.perspectiveFromFieldOfView(pmatrix, fov, 0.1,50);


  //eye =vec3.create();
  //vec3.subtract(eye,[0.5,0.2,-1],light.sun.direction) 

  //========================= DRAWING ========================= 

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    cubes.render(pmatrix,vmatrix,mmatrix,light);
  }
  
  function onResize () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener("resize", onResize, false);
  onResize();
  

  var ref = 0;

  var animate=function(time) {
    mat4.rotateX(mmatrix,mmatrix, VITESSE_ROTATION.x);
    mat4.rotateY(mmatrix,mmatrix, VITESSE_ROTATION.y);
    mat4.rotateZ(mmatrix,mmatrix, VITESSE_ROTATION.z);


    var dt = time -ref;
    ref=time;
    GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
    
    drawing();
    GL.flush();
    requestAnimationFrame(animate);
    stats.update();
  };
  animate(0);
}

var promise_cubes_shader_vertex_source = getXHR('./cubes/shader_vertex_source.glsl')
var promise_cubes_shader_fragment_source = getXHR('./cubes/shader_fragment_source.glsl')

var array_promise = [promise_cubes_shader_vertex_source, promise_cubes_shader_fragment_source];

Promise.all(array_promise).then(function(values){
    main({cubes:{VS:values[0],FS:values[1]}});
});
