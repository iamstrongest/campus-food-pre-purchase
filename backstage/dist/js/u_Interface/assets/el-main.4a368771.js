import{_ as l,u as c,w as y,a as d}from"./base.c10643b5.js";import{d as i,Z as S,c as f,o as u,a as p,g as _,h as m,u as s,n as h}from"./index.6a0ffa21.js";const b={name:"ElContainer"},C=i({...b,props:{direction:{type:String}},setup(o){const t=o,e=S(),n=c("container"),r=f(()=>t.direction==="vertical"?!0:t.direction==="horizontal"?!1:e&&e.default?e.default().some(g=>{const k=g.type.name;return k==="ElHeader"||k==="ElFooter"}):!1);return(a,g)=>(u(),p("section",{class:m([s(n).b(),s(n).is("vertical",s(r))])},[_(a.$slots,"default")],2))}});var B=l(C,[["__file","/home/runner/work/element-plus/element-plus/packages/components/container/src/container.vue"]]);const F={name:"ElAside"},H=i({...F,props:{width:{type:String,default:null}},setup(o){const t=o,e=c("aside"),n=f(()=>t.width?e.cssVarBlock({width:t.width}):{});return(r,a)=>(u(),p("aside",{class:m(s(e).b()),style:h(s(n))},[_(r.$slots,"default")],6))}});var v=l(H,[["__file","/home/runner/work/element-plus/element-plus/packages/components/container/src/aside.vue"]]);const A={name:"ElFooter"},M=i({...A,props:{height:{type:String,default:null}},setup(o){const t=o,e=c("footer"),n=f(()=>t.height?e.cssVarBlock({height:t.height}):{});return(r,a)=>(u(),p("footer",{class:m(s(e).b()),style:h(s(n))},[_(r.$slots,"default")],6))}});var E=l(M,[["__file","/home/runner/work/element-plus/element-plus/packages/components/container/src/footer.vue"]]);const N={name:"ElHeader"},V=i({...N,props:{height:{type:String,default:null}},setup(o){const t=o,e=c("header"),n=f(()=>t.height?e.cssVarBlock({height:t.height}):{});return(r,a)=>(u(),p("header",{class:m(s(e).b()),style:h(s(n))},[_(r.$slots,"default")],6))}});var $=l(V,[["__file","/home/runner/work/element-plus/element-plus/packages/components/container/src/header.vue"]]);const z={name:"ElMain"},x=i({...z,setup(o){const t=c("main");return(e,n)=>(u(),p("main",{class:m(s(t).b())},[_(e.$slots,"default")],2))}});var w=l(x,[["__file","/home/runner/work/element-plus/element-plus/packages/components/container/src/main.vue"]]);const j=y(B,{Aside:v,Footer:E,Header:$,Main:w}),q=d(v),D=d(E),G=d($),J=d(w);export{G as E,q as a,J as b,D as c,j as d};
