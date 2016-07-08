precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;

};
uniform DirectionalLight sun;

uniform vec3 sundirection;
uniform vec3 suncolor;
uniform vec3 ambientLightIntensity;

varying vec3 fragNormal;

void main(void) {
	
	vec3 color = vec3(0.,1.,0.);
	vec3 surfaceNormale = normalize(fragNormal);
	vec3 normSun = normalize(sun.direction);
	vec3 lightIntensity = ambientLightIntensity + sun.color * max(dot(surfaceNormale,normSun),0.0);
	gl_FragColor = vec4(surfaceNormale,0) + 0.1*vec4(color*lightIntensity, 1.);
}