// VRCards object: to create the cards

window.Cubes = (function(){

  var Cube = function (GL, cubesVS, cubesFS, number,size_squares,size_container) {
    this.GL = GL;
    this.program = new WGLUProgram(GL);
    this.program.attachShaderSource(cubesVS, GL.VERTEX_SHADER);
    this.program.attachShaderSource(cubesFS, GL.FRAGMENT_SHADER);
    this.program.bindAttribLocation({
      position: 0,
      normal:1
    });
    this.program.link();

    cubesIndices = [];
    cubesVerts = [];
    cubesNormals=[];

    function appendCube (x, y, z,size) {

        var size = size;
        // Bottom
        var idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 2, idx + 1);
        cubesIndices.push(idx, idx + 3, idx + 2);

        cubesNormals.push(0.,0.5,0.5);
        cubesNormals.push(0.,0.5,0.5);
        cubesNormals.push(0.,0.5,0.5);
        cubesNormals.push(0.,0.5,0.5);

        cubesVerts.push(x - size, y - size, z - size);
        cubesVerts.push(x + size, y - size, z - size);
        cubesVerts.push(x + size, y - size, z + size);
        cubesVerts.push(x - size, y - size, z + size);

        // Top
        idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 1, idx + 2);
        cubesIndices.push(idx, idx + 2, idx + 3);

        cubesNormals.push(0.,1.,0.);
        cubesNormals.push(0.,1.,0.);
        cubesNormals.push(0.,1.,0.);
        cubesNormals.push(0.,1.,0.);

        cubesVerts.push(x - size, y + size, z - size);
        cubesVerts.push(x + size, y + size, z - size);
        cubesVerts.push(x + size, y + size, z + size);
        cubesVerts.push(x - size, y + size, z + size);

        // Left
        idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 1, idx + 2);
        cubesIndices.push(idx, idx + 2, idx + 3);

        cubesNormals.push(0.5,0.5,0.);
        cubesNormals.push(0.5,0.5,0.);
        cubesNormals.push(0.5,0.5,0.);
        cubesNormals.push(0.5,0.5,0.);

        cubesVerts.push(x - size, y - size, z - size);
        cubesVerts.push(x - size, y + size, z - size);
        cubesVerts.push(x - size, y + size, z + size);
        cubesVerts.push(x - size, y - size, z + size);

        // Right
        idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 2, idx + 1);
        cubesIndices.push(idx, idx + 3, idx + 2);

        cubesNormals.push(1.,0.,0.);
        cubesNormals.push(1.,0.,0.);
        cubesNormals.push(1.,0.,0.);
        cubesNormals.push(1.,0.,0.);

        cubesVerts.push(x + size, y - size, z - size);
        cubesVerts.push(x + size, y + size, z - size);
        cubesVerts.push(x + size, y + size, z + size);
        cubesVerts.push(x + size, y - size, z + size);

        // Back
        idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 1, idx + 2);
        cubesIndices.push(idx, idx + 2, idx + 3);

        cubesNormals.push(0.5,0.,0.5);
        cubesNormals.push(0.5,0.,0.5);
        cubesNormals.push(0.5,0.,0.5);
        cubesNormals.push(0.5,0.,0.5);

        cubesVerts.push(x - size, y - size, z - size);
        cubesVerts.push(x + size, y - size, z - size);
        cubesVerts.push(x + size, y + size, z - size);
        cubesVerts.push(x - size, y + size, z - size);

        // Front
        idx = cubesVerts.length / 3.0;
        cubesIndices.push(idx, idx + 2, idx + 1);
        cubesIndices.push(idx, idx + 3, idx + 2);
        
        cubesNormals.push(0.,0.,1.);
        cubesNormals.push(0.,0.,1.);
        cubesNormals.push(0.,0.,1.);
        cubesNormals.push(0.,0.,1.);

        cubesVerts.push(x - size, y - size, z + size);
        cubesVerts.push(x + size, y - size, z + size);
        cubesVerts.push(x + size, y + size, z + size);
        cubesVerts.push(x - size, y + size, z + size);
    }

    for ( var i = 0; i < number; i ++ ) {
        if(DEBUG){
            abscisse = {x:(i/number),y:(i/number),z:(i/number)};
        }else{
            abscisse = {x:Math.random(),y:Math.random(),z:Math.random()};
        }
        appendCube(size_container*(2*abscisse.x-1),size_container*(2*abscisse.y-1),size_container*(2*abscisse.z-1), size_squares/2);
    }
    console.log(cubesIndices.length);
    

  	
  	//WILL NEED TO BE ENABLED
	this.vertBuffer= GL.createBuffer ();
	GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBuffer);
	GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(cubesVerts),GL.STATIC_DRAW);  

    this.normalBuffer= GL.createBuffer ();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.normalBuffer);
    GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(cubesNormals),GL.STATIC_DRAW);  

	//WILL NOT NEED TO BE ENABLED
	this.indexBuffer= GL.createBuffer();
	GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(cubesIndices), GL.STATIC_DRAW);

    this.indexCount = cubesIndices.length;
  };

  Cube.prototype.render = function (pmatrix, vmatrix, mmatrix, light){
    var GL = this.GL;
    var program = this.program;
    program.use();

    GL.uniformMatrix4fv(program.uniform.Pmatrix, false, pmatrix);
    GL.uniformMatrix4fv(program.uniform.Vmatrix, false, vmatrix);
    GL.uniformMatrix4fv(program.uniform.Mmatrix, false, mmatrix);

    GL.uniform3fv(program.uniform.sun.direction, light.sun.direction);
    GL.uniform3fv(program.uniform.sun.color, light.sun.color);
    GL.uniform3fv(program.uniform.ambientLightIntensity, light.ambientLightIntensity);

	GL.bindBuffer(GL.ARRAY_BUFFER, this.vertBuffer);
	GL.vertexAttribPointer(program.attrib.position, 
		3,
		GL.FLOAT, 
		false,
		Float32Array.BYTES_PER_ELEMENT*(3),
		0) ;
    GL.bindBuffer(GL.ARRAY_BUFFER, this.normalBuffer);
    GL.vertexAttribPointer(program.attrib.normal, 
        3,
        GL.FLOAT, 
        false,
        Float32Array.BYTES_PER_ELEMENT*(3),
        0) ;

	GL.enableVertexAttribArray(program.attrib.position);
    GL.enableVertexAttribArray(program.attrib.normal);

	GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    GL.drawElements(GL.TRIANGLES, this.indexCount, GL.UNSIGNED_INT, 0);
  };

  return Cube;
})();
 
