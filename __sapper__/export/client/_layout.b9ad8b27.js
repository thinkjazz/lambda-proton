import{S as t,i as r,s as e,C as n,h as s,t as o,l as m,m as a,d as f,k as i,D as $,E as c,F as g,G as l}from"./client.9b7f6366.js";import"./CardBody.6bb32e87.js";import"./CardHeader.9d3891e5.js";import"./Row.6fcf030b.js";import"./CardFooter.e030734d.js";import"./FormGroup.28bf111a.js";import d from"./login.313f6453.js";import"./Col.2b579b82.js";import u from"./register.c726c2d9.js";import p from"./forget_password.a2f08197.js";function j(t){let r;const e=new p({});return{c(){$(e.$$.fragment)},l(t){c(e.$$.fragment,t)},m(t,n){g(e,t,n),r=!0},i(t){r||(a(e.$$.fragment,t),r=!0)},o(t){o(e.$$.fragment,t),r=!1},d(t){l(e,t)}}}function b(t){let r;const e=new u({});return{c(){$(e.$$.fragment)},l(t){c(e.$$.fragment,t)},m(t,n){g(e,t,n),r=!0},i(t){r||(a(e.$$.fragment,t),r=!0)},o(t){o(e.$$.fragment,t),r=!1},d(t){l(e,t)}}}function w(t){let r;const e=new d({});return{c(){$(e.$$.fragment)},l(t){c(e.$$.fragment,t)},m(t,n){g(e,t,n),r=!0},i(t){r||(a(e.$$.fragment,t),r=!0)},o(t){o(e.$$.fragment,t),r=!1},d(t){l(e,t)}}}function C(t){let r,e,$,c;const g=[w,b,j],l=[];function d(t,r){return"login"===t[0]?0:"register"===t[0]?1:"forget_password"===t[0]?2:-1}return~(r=d(t))&&(e=l[r]=g[r](t)),{c(){e&&e.c(),$=n()},l(t){e&&e.l(t),$=n()},m(t,e){~r&&l[r].m(t,e),s(t,$,e),c=!0},p(t,[n]){let s=r;(r=d(t))!==s&&(e&&(i(),o(l[s],1,1,()=>{l[s]=null}),m()),~r?((e=l[r])||(e=l[r]=g[r](t)).c(),a(e,1),e.m($.parentNode,$)):e=null)},i(t){c||(a(e),c=!0)},o(t){o(e),c=!1},d(t){~r&&l[r].d(t),t&&f($)}}}function F(t,r,e){let{segment:n}=r;return t.$set=(t=>{"segment"in t&&e(0,n=t.segment)}),[n]}export default class extends t{constructor(t){super(),r(this,t,F,C,e,{segment:0})}}
