import{S as r,i as e,s as t,C as n,h as s,t as m,l as o,m as a,d as c,k as $,D as f,E as i,F as l,G as g}from"./client.9a4ccecc.js";import"./Image.66c08c71.js";import u from"./error_401.c21b5dc5.js";import d from"./error_404.c54023ee.js";import p from"./error_500.370c947d.js";function _(r){let e;const t=new p({});return{c(){f(t.$$.fragment)},l(r){i(t.$$.fragment,r)},m(r,n){l(t,r,n),e=!0},i(r){e||(a(t.$$.fragment,r),e=!0)},o(r){m(t.$$.fragment,r),e=!1},d(r){g(t,r)}}}function j(r){let e;const t=new d({});return{c(){f(t.$$.fragment)},l(r){i(t.$$.fragment,r)},m(r,n){l(t,r,n),e=!0},i(r){e||(a(t.$$.fragment,r),e=!0)},o(r){m(t.$$.fragment,r),e=!1},d(r){g(t,r)}}}function w(r){let e;const t=new u({});return{c(){f(t.$$.fragment)},l(r){i(t.$$.fragment,r)},m(r,n){l(t,r,n),e=!0},i(r){e||(a(t.$$.fragment,r),e=!0)},o(r){m(t.$$.fragment,r),e=!1},d(r){g(t,r)}}}function h(r){let e,t,f,i;const l=[w,j,_],g=[];function u(r,e){return"error_401"===r[0]?0:"error_404"===r[0]?1:"error_500"===r[0]?2:-1}return~(e=u(r))&&(t=g[e]=l[e](r)),{c(){t&&t.c(),f=n()},l(r){t&&t.l(r),f=n()},m(r,t){~e&&g[e].m(r,t),s(r,f,t),i=!0},p(r,[n]){let s=e;(e=u(r))!==s&&(t&&($(),m(g[s],1,1,()=>{g[s]=null}),o()),~e?((t=g[e])||(t=g[e]=l[e](r)).c(),a(t,1),t.m(f.parentNode,f)):t=null)},i(r){i||(a(t),i=!0)},o(r){m(t),i=!1},d(r){~e&&g[e].d(r),r&&c(f)}}}function x(r,e,t){let{segment:n}=e;return r.$set=(r=>{"segment"in r&&t(0,n=r.segment)}),[n]}export default class extends r{constructor(r){super(),e(this,r,x,h,t,{segment:0})}}
