import{S as t,i as e,s as $,H as s,e as n,w as r,D as c,J as l,d as o,I as a,c as f,b as m,x as g,E as i,f as p,h as u,j as d,F as h,m as x,t as v,G as E,k as w,l as y,K as I,R as b,z as B}from"./client.d2072051.js";import{B as D,a as H}from"./BreadcrumbItem.483dfd4c.js";import{R as V}from"./Row.862badb3.js";import{B as j}from"./ButtonGroup.a9e67851.js";import{B as R}from"./ButtonToolbar.9916531b.js";function k(t,e,$){const s=t.slice();return s[1]=e[$],s}function z(t,e,$){const s=t.slice();return s[1]=e[$],s}function P(t,e,$){const s=t.slice();return s[1]=e[$],s}function G(t){let e;return{c(){e=r("Кнопки")},l(t){e=g(t,"Кнопки")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function F(t){let e;const $=new H({props:{active:!0,$$slots:{default:[G]},$$scope:{ctx:t}}});return{c(){c($.$$.fragment)},l(t){i($.$$.fragment,t)},m(t,s){h($,t,s),e=!0},p(t,e){const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),$.$set(s)},i(t){e||(x($.$$.fragment,t),e=!0)},o(t){v($.$$.fragment,t),e=!1},d(t){E($,t)}}}function J(t){let e,$=t[1]+"";return{c(){e=r($)},l(t){e=g(t,$)},m(t,$){u(t,e,$)},p:B,d(t){t&&o(e)}}}function K(t){let e,$,r,l,g;const p=new b({props:{color:t[1],$$slots:{default:[J]},$$scope:{ctx:t}}});return{c(){e=n("div"),$=n("p"),r=s(),c(p.$$.fragment),l=s()},l(t){e=f(t,"DIV",{});var s=m(e);$=f(s,"P",{}),m($).forEach(o),r=a(s),i(p.$$.fragment,s),l=a(s),s.forEach(o)},m(t,s){u(t,e,s),d(e,$),d(e,r),h(p,e,null),d(e,l),g=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),p.$set($)},i(t){g||(x(p.$$.fragment,t),g=!0)},o(t){v(p.$$.fragment,t),g=!1},d(t){t&&o(e),E(p)}}}function S(t){let e,$=t[1]+"";return{c(){e=r($)},l(t){e=g(t,$)},m(t,$){u(t,e,$)},p:B,d(t){t&&o(e)}}}function T(t){let e,$,r,l,g;const p=new b({props:{outline:!0,color:t[1],$$slots:{default:[S]},$$scope:{ctx:t}}});return{c(){e=n("div"),$=n("p"),r=s(),c(p.$$.fragment),l=s()},l(t){e=f(t,"DIV",{});var s=m(e);$=f(s,"P",{}),m($).forEach(o),r=a(s),i(p.$$.fragment,s),l=a(s),s.forEach(o)},m(t,s){u(t,e,s),d(e,$),d(e,r),h(p,e,null),d(e,l),g=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),p.$set($)},i(t){g||(x(p.$$.fragment,t),g=!0)},o(t){v(p.$$.fragment,t),g=!1},d(t){t&&o(e),E(p)}}}function U(t){let e,$,c,l,i,h,E,b,B,D,H,V,j,R,k,G,F=t[0],J=[];for(let e=0;e<F.length;e+=1)J[e]=K(P(t,F,e));const S=t=>v(J[t],1,1,()=>{J[t]=null});let U=t[0],q=[];for(let e=0;e<U.length;e+=1)q[e]=T(z(t,U,e));const A=t=>v(q[t],1,1,()=>{q[t]=null});return{c(){e=n("div"),$=n("h2"),c=r("Цветные"),l=s(),i=n("h4"),h=r("Пример"),E=s();for(let t=0;t<J.length;t+=1)J[t].c();b=s(),B=n("div"),D=n("h2"),H=r("Контурные"),V=s(),j=n("h4"),R=r("Пример"),k=s();for(let t=0;t<q.length;t+=1)q[t].c();this.h()},l(t){e=f(t,"DIV",{class:!0});var s=m(e);$=f(s,"H2",{class:!0});var n=m($);c=g(n,"Цветные"),n.forEach(o),l=a(s),i=f(s,"H4",{class:!0});var r=m(i);h=g(r,"Пример"),r.forEach(o),E=a(s);for(let t=0;t<J.length;t+=1)J[t].l(s);s.forEach(o),b=a(t),B=f(t,"DIV",{class:!0});var p=m(B);D=f(p,"H2",{class:!0});var u=m(D);H=g(u,"Контурные"),u.forEach(o),V=a(p),j=f(p,"H4",{class:!0});var d=m(j);R=g(d,"Пример"),d.forEach(o),k=a(p);for(let t=0;t<q.length;t+=1)q[t].l(p);p.forEach(o),this.h()},h(){p($,"class","mt-4"),p(i,"class","mt-4"),p(e,"class","col-xl-6"),p(D,"class","mt-4"),p(j,"class","mt-4"),p(B,"class","col-xl-6")},m(t,s){u(t,e,s),d(e,$),d($,c),d(e,l),d(e,i),d(i,h),d(e,E);for(let t=0;t<J.length;t+=1)J[t].m(e,null);u(t,b,s),u(t,B,s),d(B,D),d(D,H),d(B,V),d(B,j),d(j,R),d(B,k);for(let t=0;t<q.length;t+=1)q[t].m(B,null);G=!0},p(t,$){if(1&$){let s;for(F=t[0],s=0;s<F.length;s+=1){const n=P(t,F,s);J[s]?(J[s].p(n,$),x(J[s],1)):(J[s]=K(n),J[s].c(),x(J[s],1),J[s].m(e,null))}for(w(),s=F.length;s<J.length;s+=1)S(s);y()}if(1&$){let e;for(U=t[0],e=0;e<U.length;e+=1){const s=z(t,U,e);q[e]?(q[e].p(s,$),x(q[e],1)):(q[e]=T(s),q[e].c(),x(q[e],1),q[e].m(B,null))}for(w(),e=U.length;e<q.length;e+=1)A(e);y()}},i(t){if(!G){for(let t=0;t<F.length;t+=1)x(J[t]);for(let t=0;t<U.length;t+=1)x(q[t]);G=!0}},o(t){J=J.filter(Boolean);for(let t=0;t<J.length;t+=1)v(J[t]);q=q.filter(Boolean);for(let t=0;t<q.length;t+=1)v(q[t]);G=!1},d(t){t&&o(e),I(J,t),t&&o(b),t&&o(B),I(q,t)}}}function q(t){let e,$=t[1]+"";return{c(){e=r($)},l(t){e=g(t,$)},m(t,$){u(t,e,$)},p:B,d(t){t&&o(e)}}}function A(t){let e,$,r,l,g;const p=new b({props:{disabled:!0,color:t[1],$$slots:{default:[q]},$$scope:{ctx:t}}});return{c(){e=n("div"),$=n("p"),r=s(),c(p.$$.fragment),l=s()},l(t){e=f(t,"DIV",{});var s=m(e);$=f(s,"P",{}),m($).forEach(o),r=a(s),i(p.$$.fragment,s),l=a(s),s.forEach(o)},m(t,s){u(t,e,s),d(e,$),d(e,r),h(p,e,null),d(e,l),g=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),p.$set($)},i(t){g||(x(p.$$.fragment,t),g=!0)},o(t){v(p.$$.fragment,t),g=!1},d(t){t&&o(e),E(p)}}}function C(t){let e;return{c(){e=r("Большие")},l(t){e=g(t,"Большие")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function L(t){let e;return{c(){e=r("Маленькие")},l(t){e=g(t,"Маленькие")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function M(t){let e;return{c(){e=r("Блок")},l(t){e=g(t,"Блок")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function N(t){let e,$,l,B,D,H,V,j,R,z,P,G,F,J,K,S=t[0],T=[];for(let e=0;e<S.length;e+=1)T[e]=A(k(t,S,e));const U=t=>v(T[t],1,1,()=>{T[t]=null}),q=new b({props:{size:"lg",$$slots:{default:[C]},$$scope:{ctx:t}}}),N=new b({props:{size:"sm",$$slots:{default:[L]},$$scope:{ctx:t}}}),O=new b({props:{block:!0,$$slots:{default:[M]},$$scope:{ctx:t}}});return{c(){e=n("div"),$=n("h2"),l=r("Неактивные"),B=s(),D=n("h4"),H=r("Пример"),V=s();for(let t=0;t<T.length;t+=1)T[t].c();j=s(),R=n("div"),z=n("h2"),P=r("Размеры"),G=s(),c(q.$$.fragment),F=s(),c(N.$$.fragment),J=s(),c(O.$$.fragment),this.h()},l(t){e=f(t,"DIV",{class:!0});var s=m(e);$=f(s,"H2",{class:!0});var n=m($);l=g(n,"Неактивные"),n.forEach(o),B=a(s),D=f(s,"H4",{class:!0});var r=m(D);H=g(r,"Пример"),r.forEach(o),V=a(s);for(let t=0;t<T.length;t+=1)T[t].l(s);s.forEach(o),j=a(t),R=f(t,"DIV",{class:!0});var c=m(R);z=f(c,"H2",{class:!0});var p=m(z);P=g(p,"Размеры"),p.forEach(o),G=a(c),i(q.$$.fragment,c),F=a(c),i(N.$$.fragment,c),J=a(c),i(O.$$.fragment,c),c.forEach(o),this.h()},h(){p($,"class","mt-4"),p(D,"class","mt-4"),p(e,"class","col-xl-6"),p(z,"class","mt-4"),p(R,"class","col-xl-6")},m(t,s){u(t,e,s),d(e,$),d($,l),d(e,B),d(e,D),d(D,H),d(e,V);for(let t=0;t<T.length;t+=1)T[t].m(e,null);u(t,j,s),u(t,R,s),d(R,z),d(z,P),d(R,G),h(q,R,null),d(R,F),h(N,R,null),d(R,J),h(O,R,null),K=!0},p(t,$){if(1&$){let s;for(S=t[0],s=0;s<S.length;s+=1){const n=k(t,S,s);T[s]?(T[s].p(n,$),x(T[s],1)):(T[s]=A(n),T[s].c(),x(T[s],1),T[s].m(e,null))}for(w(),s=S.length;s<T.length;s+=1)U(s);y()}const s={};256&$&&(s.$$scope={dirty:$,ctx:t}),q.$set(s);const n={};256&$&&(n.$$scope={dirty:$,ctx:t}),N.$set(n);const r={};256&$&&(r.$$scope={dirty:$,ctx:t}),O.$set(r)},i(t){if(!K){for(let t=0;t<S.length;t+=1)x(T[t]);x(q.$$.fragment,t),x(N.$$.fragment,t),x(O.$$.fragment,t),K=!0}},o(t){T=T.filter(Boolean);for(let t=0;t<T.length;t+=1)v(T[t]);v(q.$$.fragment,t),v(N.$$.fragment,t),v(O.$$.fragment,t),K=!1},d(t){t&&o(e),I(T,t),t&&o(j),t&&o(R),E(q),E(N),E(O)}}}function O(t){let e;return{c(){e=r("Альфа")},l(t){e=g(t,"Альфа")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function Q(t){let e;return{c(){e=r("Браво")},l(t){e=g(t,"Браво")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function W(t){let e;return{c(){e=r("Чарли")},l(t){e=g(t,"Чарли")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function X(t){let e,$,n;const r=new b({props:{active:!0,$$slots:{default:[O]},$$scope:{ctx:t}}}),l=new b({props:{$$slots:{default:[Q]},$$scope:{ctx:t}}}),f=new b({props:{$$slots:{default:[W]},$$scope:{ctx:t}}});return{c(){c(r.$$.fragment),e=s(),c(l.$$.fragment),$=s(),c(f.$$.fragment)},l(t){i(r.$$.fragment,t),e=a(t),i(l.$$.fragment,t),$=a(t),i(f.$$.fragment,t)},m(t,s){h(r,t,s),u(t,e,s),h(l,t,s),u(t,$,s),h(f,t,s),n=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),r.$set($);const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),l.$set(s);const n={};256&e&&(n.$$scope={dirty:e,ctx:t}),f.$set(n)},i(t){n||(x(r.$$.fragment,t),x(l.$$.fragment,t),x(f.$$.fragment,t),n=!0)},o(t){v(r.$$.fragment,t),v(l.$$.fragment,t),v(f.$$.fragment,t),n=!1},d(t){E(r,t),t&&o(e),E(l,t),t&&o($),E(f,t)}}}function Y(t){let e;return{c(){e=r("Альфа")},l(t){e=g(t,"Альфа")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function Z(t){let e;return{c(){e=r("Браво")},l(t){e=g(t,"Браво")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function _(t){let e;return{c(){e=r("Чарли")},l(t){e=g(t,"Чарли")},m(t,$){u(t,e,$)},d(t){t&&o(e)}}}function tt(t){let e,$,n;const r=new b({props:{$$slots:{default:[Y]},$$scope:{ctx:t}}}),l=new b({props:{$$slots:{default:[Z]},$$scope:{ctx:t}}}),f=new b({props:{$$slots:{default:[_]},$$scope:{ctx:t}}});return{c(){c(r.$$.fragment),e=s(),c(l.$$.fragment),$=s(),c(f.$$.fragment)},l(t){i(r.$$.fragment,t),e=a(t),i(l.$$.fragment,t),$=a(t),i(f.$$.fragment,t)},m(t,s){h(r,t,s),u(t,e,s),h(l,t,s),u(t,$,s),h(f,t,s),n=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),r.$set($);const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),l.$set(s);const n={};256&e&&(n.$$scope={dirty:e,ctx:t}),f.$set(n)},i(t){n||(x(r.$$.fragment,t),x(l.$$.fragment,t),x(f.$$.fragment,t),n=!0)},o(t){v(r.$$.fragment,t),v(l.$$.fragment,t),v(f.$$.fragment,t),n=!1},d(t){E(r,t),t&&o(e),E(l,t),t&&o($),E(f,t)}}}function et(t){let e,$,l,w,y,I,b,B,D,H;const V=new j({props:{$$slots:{default:[X]},$$scope:{ctx:t}}}),k=new R({props:{$$slots:{default:[tt]},$$scope:{ctx:t}}});return{c(){e=n("div"),$=n("h2"),l=r("Группы кнопок"),w=s(),c(V.$$.fragment),y=s(),I=n("div"),b=n("h2"),B=r("Тулбары с кнопками"),D=s(),c(k.$$.fragment),this.h()},l(t){e=f(t,"DIV",{class:!0});var s=m(e);$=f(s,"H2",{class:!0});var n=m($);l=g(n,"Группы кнопок"),n.forEach(o),w=a(s),i(V.$$.fragment,s),s.forEach(o),y=a(t),I=f(t,"DIV",{class:!0});var r=m(I);b=f(r,"H2",{class:!0});var c=m(b);B=g(c,"Тулбары с кнопками"),c.forEach(o),D=a(r),i(k.$$.fragment,r),r.forEach(o),this.h()},h(){p($,"class","mt-4"),p(e,"class","col-xl-6"),p(b,"class","mt-4"),p(I,"class","col-xl-6")},m(t,s){u(t,e,s),d(e,$),d($,l),d(e,w),h(V,e,null),u(t,y,s),u(t,I,s),d(I,b),d(b,B),d(I,D),h(k,I,null),H=!0},p(t,e){const $={};256&e&&($.$$scope={dirty:e,ctx:t}),V.$set($);const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),k.$set(s)},i(t){H||(x(V.$$.fragment,t),x(k.$$.fragment,t),H=!0)},o(t){v(V.$$.fragment,t),v(k.$$.fragment,t),H=!1},d(t){t&&o(e),E(V),t&&o(y),t&&o(I),E(k)}}}function $t(t){let e,$,r,c;return{c(){e=n("div"),$=n("br"),r=s(),c=n("br"),this.h()},l(t){e=f(t,"DIV",{class:!0});var s=m(e);$=f(s,"BR",{}),r=a(s),c=f(s,"BR",{}),s.forEach(o),this.h()},h(){p(e,"class","col-xl-12")},m(t,s){u(t,e,s),d(e,$),d(e,r),d(e,c)},d(t){t&&o(e)}}}function st(t){let e,$,w,y,I,b,B,H,j,R;document.title=e=nt;const k=new D({props:{class:"mb-4",$$slots:{default:[F]},$$scope:{ctx:t}}}),z=new V({props:{$$slots:{default:[U]},$$scope:{ctx:t}}}),P=new V({props:{$$slots:{default:[N]},$$scope:{ctx:t}}}),G=new V({props:{$$slots:{default:[et]},$$scope:{ctx:t}}}),J=new V({props:{$$slots:{default:[$t]},$$scope:{ctx:t}}});return{c(){$=s(),w=n("h1"),y=r("Кнопки"),I=s(),c(k.$$.fragment),b=s(),c(z.$$.fragment),B=s(),c(P.$$.fragment),H=s(),c(G.$$.fragment),j=s(),c(J.$$.fragment),this.h()},l(t){l('[data-svelte="svelte-1uo06u1"]',document.head).forEach(o),$=a(t),w=f(t,"H1",{class:!0});var e=m(w);y=g(e,"Кнопки"),e.forEach(o),I=a(t),i(k.$$.fragment,t),b=a(t),i(z.$$.fragment,t),B=a(t),i(P.$$.fragment,t),H=a(t),i(G.$$.fragment,t),j=a(t),i(J.$$.fragment,t),this.h()},h(){p(w,"class","mt-4")},m(t,e){u(t,$,e),u(t,w,e),d(w,y),u(t,I,e),h(k,t,e),u(t,b,e),h(z,t,e),u(t,B,e),h(P,t,e),u(t,H,e),h(G,t,e),u(t,j,e),h(J,t,e),R=!0},p(t,[$]){(!R||0&$)&&e!==(e=nt)&&(document.title=e);const s={};256&$&&(s.$$scope={dirty:$,ctx:t}),k.$set(s);const n={};256&$&&(n.$$scope={dirty:$,ctx:t}),z.$set(n);const r={};256&$&&(r.$$scope={dirty:$,ctx:t}),P.$set(r);const c={};256&$&&(c.$$scope={dirty:$,ctx:t}),G.$set(c);const l={};256&$&&(l.$$scope={dirty:$,ctx:t}),J.$set(l)},i(t){R||(x(k.$$.fragment,t),x(z.$$.fragment,t),x(P.$$.fragment,t),x(G.$$.fragment,t),x(J.$$.fragment,t),R=!0)},o(t){v(k.$$.fragment,t),v(z.$$.fragment,t),v(P.$$.fragment,t),v(G.$$.fragment,t),v(J.$$.fragment,t),R=!1},d(t){t&&o($),t&&o(w),t&&o(I),E(k,t),t&&o(b),E(z,t),t&&o(B),E(P,t),t&&o(H),E(G,t),t&&o(j),E(J,t)}}}let nt="Кнопки | UI | Пользовательский интерфейс";function rt(t){return[["primary","secondary","success","danger","warning","info","light","dark"]]}export default class extends t{constructor(t){super(),e(this,t,rt,st,$,{})}}