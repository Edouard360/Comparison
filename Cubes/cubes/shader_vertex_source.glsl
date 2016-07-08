attribute vec3 position; //the position of the point\n\
attribute vec3 normal;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;

varying vec3 fragNormal;

void main(void) { //pre-built function\n\
	gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.); //0. is the z, and 1 is w\n\
	fragNormal= ( vec4(normal, 0.0)).xyz;
}