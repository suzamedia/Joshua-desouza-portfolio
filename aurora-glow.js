export function startAurora(cv, opts) {
  opts = Object.assign({ colorStops: ["#7cff67", "#B497CF", "#5227FF"], amplitude: 1.0, blend: 0.5, speed: 0.5, opacity: 1 }, opts || {});
  if (!cv || !cv.getContext) return () => {};
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = cv.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return () => {};
  const VERT = "#version 300 es\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}";
  const FRAG = `#version 300 es
precision highp float;
uniform float uTime; uniform float uAmplitude; uniform vec3 uColorStops[3]; uniform vec2 uResolution; uniform float uBlend;
out vec4 fragColor;
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  vec3 rampColor = uv.x < 0.5 ? mix(uColorStops[0], uColorStops[1], uv.x/0.5) : mix(uColorStops[1], uColorStops[2], (uv.x-0.5)/0.5);
  float height=snoise(vec2(uv.x*2.0+uTime*0.1,uTime*0.25))*0.5*uAmplitude;
  height=exp(height); height=(uv.y*2.0-height+0.2);
  float intensity=0.6*height;
  float midPoint=0.20;
  float auroraAlpha=smoothstep(midPoint-uBlend*0.5,midPoint+uBlend*0.5,intensity);
  vec3 auroraColor=intensity*rampColor;
  fragColor=vec4(auroraColor*auroraAlpha,auroraAlpha);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return () => {};
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); return () => {}; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "position"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uTime = U("uTime"), uRes = U("uResolution");
  const hex = (x) => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255);
  gl.uniform3fv(U("uColorStops"), new Float32Array([].concat(hex(opts.colorStops[0]), hex(opts.colorStops[1]), hex(opts.colorStops[2]))));
  gl.uniform1f(U("uAmplitude"), opts.amplitude);
  gl.uniform1f(U("uBlend"), opts.blend);
  gl.clearColor(0, 0, 0, 0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  cv.style.opacity = String(opts.opacity);
  let W = 0, H = 0, raf = 0;
  const resize = () => { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); gl.uniform2f(uRes, W, H); };
  resize();
  window.addEventListener("resize", resize);
  const render = (t) => { gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uTime, t * 0.001 * opts.speed); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  if (reduce) render(4000);
  else {
    const loop = (now) => {
      const r = cv.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        if (Math.abs(cv.offsetWidth - W) > 1 || Math.abs(cv.offsetHeight - H) > 1) resize();
        render(now);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    const ext = gl.getExtension("WEBGL_lose_context"); if (ext) ext.loseContext();
  };
}
