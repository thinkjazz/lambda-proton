import{S as t,i as e,s as n,H as s,e as l,w as c,D as a,J as o,d as r,I as i,c as $,b as f,x as d,E as m,f as h,h as g,j as u,F as p,m as v,t as x,G as I,a9 as E,al as w,am as C,k as D,l as F,K as y,z as b}from"./client.9b7f6366.js";import{B,a as A}from"./BreadcrumbItem.28a97428.js";import{R as H}from"./Row.6fcf030b.js";import{C as T,a as _,b as j,c as S,d as V}from"./CarouselCaption.3d9d3c23.js";function k(t,e,n){const s=t.slice();return s[19]=e[n],s[21]=n,s}function G(t,e,n){const s=t.slice();return s[19]=e[n],s[21]=n,s}function R(t,e,n){const s=t.slice();return s[19]=e[n],s[21]=n,s}function z(t,e,n){const s=t.slice();return s[19]=e[n],s[21]=n,s}function M(t){let e;return{c(){e=c("Карусель и Слайдер")},l(t){e=d(t,"Карусель и Слайдер")},m(t,n){g(t,e,n)},d(t){t&&r(e)}}}function U(t){let e;const n=new A({props:{active:!0,$$slots:{default:[M]},$$scope:{ctx:t}}});return{c(){a(n.$$.fragment)},l(t){m(n.$$.fragment,t)},m(t,s){p(n,t,s),e=!0},p(t,e){const s={};33554432&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(v(n.$$.fragment,t),e=!0)},o(t){x(n.$$.fragment,t),e=!1},d(t){I(n,t)}}}function J(t){let e,n,c,a;return{c(){e=l("img"),a=s(),this.h()},l(t){e=$(t,"IMG",{src:!0,class:!0,alt:!0}),a=i(t),this.h()},h(){e.src!==(n=t[19])&&h(e,"src",n),h(e,"class","d-block w-100"),h(e,"alt",c=`${t[19]} ${t[21]+1}`)},m(t,n){g(t,e,n),g(t,a,n)},p:b,d(t){t&&r(e),t&&r(a)}}}function K(t){let e,n;function s(e){t[3].call(null,e)}let l={itemIndex:t[21],$$slots:{default:[J]},$$scope:{ctx:t}};void 0!==t[0]&&(l.activeIndex=t[0]);const c=new S({props:l});return E.push(()=>w(c,"activeIndex",s)),{c(){a(c.$$.fragment)},l(t){m(c.$$.fragment,t)},m(t,e){p(c,t,e),n=!0},p(t,n){const s={};33554432&n&&(s.$$scope={dirty:n,ctx:t}),!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),c.$set(s)},i(t){n||(v(c.$$.fragment,t),n=!0)},o(t){x(c.$$.fragment,t),n=!1},d(t){I(c,t)}}}function q(t){let e,n,s=t[1],c=[];for(let e=0;e<s.length;e+=1)c[e]=K(z(t,s,e));const a=t=>x(c[t],1,1,()=>{c[t]=null});return{c(){e=l("div");for(let t=0;t<c.length;t+=1)c[t].c();this.h()},l(t){e=$(t,"DIV",{class:!0});var n=f(e);for(let t=0;t<c.length;t+=1)c[t].l(n);n.forEach(r),this.h()},h(){h(e,"class","carousel-inner")},m(t,s){g(t,e,s);for(let t=0;t<c.length;t+=1)c[t].m(e,null);n=!0},p(t,n){if(3&n){let l;for(s=t[1],l=0;l<s.length;l+=1){const a=z(t,s,l);c[l]?(c[l].p(a,n),v(c[l],1)):(c[l]=K(a),c[l].c(),v(c[l],1),c[l].m(e,null))}for(D(),l=s.length;l<c.length;l+=1)a(l);F()}},i(t){if(!n){for(let t=0;t<s.length;t+=1)v(c[t]);n=!0}},o(t){c=c.filter(Boolean);for(let t=0;t<c.length;t+=1)x(c[t]);n=!1},d(t){t&&r(e),y(c,t)}}}function L(t){let e,n,o,D,F,y;function b(e){t[4].call(null,e)}let B={items:t[1],$$slots:{default:[q]},$$scope:{ctx:t}};void 0!==t[0]&&(B.activeIndex=t[0]);const A=new T({props:B});return E.push(()=>w(A,"activeIndex",b)),{c(){e=l("div"),n=l("h1"),o=c("Пример слайдов"),D=s(),a(A.$$.fragment),this.h()},l(t){e=$(t,"DIV",{class:!0});var s=f(e);n=$(s,"H1",{class:!0});var l=f(n);o=d(l,"Пример слайдов"),l.forEach(r),D=i(s),m(A.$$.fragment,s),s.forEach(r),this.h()},h(){h(n,"class","mt-4"),h(e,"class","col-xl-8")},m(t,s){g(t,e,s),u(e,n),u(n,o),u(e,D),p(A,e,null),y=!0},p(t,e){const n={};33554433&e&&(n.$$scope={dirty:e,ctx:t}),!F&&1&e&&(F=!0,n.activeIndex=t[0],C(()=>F=!1)),A.$set(n)},i(t){y||(v(A.$$.fragment,t),y=!0)},o(t){x(A.$$.fragment,t),y=!1},d(t){t&&r(e),I(A)}}}function N(t){let e,n,c,a;return{c(){e=l("img"),a=s(),this.h()},l(t){e=$(t,"IMG",{src:!0,class:!0,alt:!0}),a=i(t),this.h()},h(){e.src!==(n=t[19])&&h(e,"src",n),h(e,"class","d-block w-100"),h(e,"alt",c=`${t[19]} ${t[21]+1}`)},m(t,n){g(t,e,n),g(t,a,n)},p:b,d(t){t&&r(e),t&&r(a)}}}function O(t){let e,n;function s(e){t[5].call(null,e)}let l={itemIndex:t[21],$$slots:{default:[N]},$$scope:{ctx:t}};void 0!==t[0]&&(l.activeIndex=t[0]);const c=new S({props:l});return E.push(()=>w(c,"activeIndex",s)),{c(){a(c.$$.fragment)},l(t){m(c.$$.fragment,t)},m(t,e){p(c,t,e),n=!0},p(t,n){const s={};33554432&n&&(s.$$scope={dirty:n,ctx:t}),!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),c.$set(s)},i(t){n||(v(c.$$.fragment,t),n=!0)},o(t){x(c.$$.fragment,t),n=!1},d(t){I(c,t)}}}function P(t){let e,n,c,o,d,u,b=t[1],B=[];for(let e=0;e<b.length;e+=1)B[e]=O(R(t,b,e));const A=t=>x(B[t],1,1,()=>{B[t]=null});function H(e){t[6].call(null,e)}let T={direction:"prev",items:t[1]};void 0!==t[0]&&(T.activeIndex=t[0]);const j=new _({props:T});function S(e){t[7].call(null,e)}E.push(()=>w(j,"activeIndex",H));let V={direction:"next",items:t[1]};void 0!==t[0]&&(V.activeIndex=t[0]);const k=new _({props:V});return E.push(()=>w(k,"activeIndex",S)),{c(){e=l("div");for(let t=0;t<B.length;t+=1)B[t].c();n=s(),a(j.$$.fragment),o=s(),a(k.$$.fragment),this.h()},l(t){e=$(t,"DIV",{class:!0});var s=f(e);for(let t=0;t<B.length;t+=1)B[t].l(s);s.forEach(r),n=i(t),m(j.$$.fragment,t),o=i(t),m(k.$$.fragment,t),this.h()},h(){h(e,"class","carousel-inner")},m(t,s){g(t,e,s);for(let t=0;t<B.length;t+=1)B[t].m(e,null);g(t,n,s),p(j,t,s),g(t,o,s),p(k,t,s),u=!0},p(t,n){if(3&n){let s;for(b=t[1],s=0;s<b.length;s+=1){const l=R(t,b,s);B[s]?(B[s].p(l,n),v(B[s],1)):(B[s]=O(l),B[s].c(),v(B[s],1),B[s].m(e,null))}for(D(),s=b.length;s<B.length;s+=1)A(s);F()}const s={};!c&&1&n&&(c=!0,s.activeIndex=t[0],C(()=>c=!1)),j.$set(s);const l={};!d&&1&n&&(d=!0,l.activeIndex=t[0],C(()=>d=!1)),k.$set(l)},i(t){if(!u){for(let t=0;t<b.length;t+=1)v(B[t]);v(j.$$.fragment,t),v(k.$$.fragment,t),u=!0}},o(t){B=B.filter(Boolean);for(let t=0;t<B.length;t+=1)x(B[t]);x(j.$$.fragment,t),x(k.$$.fragment,t),u=!1},d(t){t&&r(e),y(B,t),t&&r(n),I(j,t),t&&r(o),I(k,t)}}}function Q(t){let e,n,o,D,F,y,b,B,A;function H(e){t[8].call(null,e)}let _={items:t[1],$$slots:{default:[P]},$$scope:{ctx:t}};void 0!==t[0]&&(_.activeIndex=t[0]);const j=new T({props:_});return E.push(()=>w(j,"activeIndex",H)),{c(){e=l("div"),n=l("h1"),o=c("Пример слайдов с управлением"),D=s(),F=l("h2"),y=c("Пример слайдов"),b=s(),a(j.$$.fragment),this.h()},l(t){e=$(t,"DIV",{class:!0});var s=f(e);n=$(s,"H1",{class:!0});var l=f(n);o=d(l,"Пример слайдов с управлением"),l.forEach(r),D=i(s),F=$(s,"H2",{class:!0});var c=f(F);y=d(c,"Пример слайдов"),c.forEach(r),b=i(s),m(j.$$.fragment,s),s.forEach(r),this.h()},h(){h(n,"class","mt-4"),h(F,"class","mt-4"),h(e,"class","col-xl-8")},m(t,s){g(t,e,s),u(e,n),u(n,o),u(e,D),u(e,F),u(F,y),u(e,b),p(j,e,null),A=!0},p(t,e){const n={};33554433&e&&(n.$$scope={dirty:e,ctx:t}),!B&&1&e&&(B=!0,n.activeIndex=t[0],C(()=>B=!1)),j.$set(n)},i(t){A||(v(j.$$.fragment,t),A=!0)},o(t){x(j.$$.fragment,t),A=!1},d(t){t&&r(e),I(j)}}}function W(t){let e,n,c,a;return{c(){e=l("img"),a=s(),this.h()},l(t){e=$(t,"IMG",{src:!0,class:!0,alt:!0}),a=i(t),this.h()},h(){e.src!==(n=t[19])&&h(e,"src",n),h(e,"class","d-block w-100"),h(e,"alt",c=`${t[19]} ${t[21]+1}`)},m(t,n){g(t,e,n),g(t,a,n)},p:b,d(t){t&&r(e),t&&r(a)}}}function X(t){let e,n;function s(e){t[10].call(null,e)}let l={itemIndex:t[21],$$slots:{default:[W]},$$scope:{ctx:t}};void 0!==t[0]&&(l.activeIndex=t[0]);const c=new S({props:l});return E.push(()=>w(c,"activeIndex",s)),{c(){a(c.$$.fragment)},l(t){m(c.$$.fragment,t)},m(t,e){p(c,t,e),n=!0},p(t,n){const s={};33554432&n&&(s.$$scope={dirty:n,ctx:t}),!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),c.$set(s)},i(t){n||(v(c.$$.fragment,t),n=!0)},o(t){x(c.$$.fragment,t),n=!1},d(t){I(c,t)}}}function Y(t){let e,n,c,o,d,u,b,B;function A(e){t[9].call(null,e)}let H={items:t[1]};void 0!==t[0]&&(H.activeIndex=t[0]);const T=new j({props:H});E.push(()=>w(T,"activeIndex",A));let S=t[1],V=[];for(let e=0;e<S.length;e+=1)V[e]=X(G(t,S,e));const k=t=>x(V[t],1,1,()=>{V[t]=null});function R(e){t[11].call(null,e)}let z={direction:"prev",items:t[1]};void 0!==t[0]&&(z.activeIndex=t[0]);const M=new _({props:z});function U(e){t[12].call(null,e)}E.push(()=>w(M,"activeIndex",R));let J={direction:"next",items:t[1]};void 0!==t[0]&&(J.activeIndex=t[0]);const K=new _({props:J});return E.push(()=>w(K,"activeIndex",U)),{c(){a(T.$$.fragment),n=s(),c=l("div");for(let t=0;t<V.length;t+=1)V[t].c();o=s(),a(M.$$.fragment),u=s(),a(K.$$.fragment),this.h()},l(t){m(T.$$.fragment,t),n=i(t),c=$(t,"DIV",{class:!0});var e=f(c);for(let t=0;t<V.length;t+=1)V[t].l(e);e.forEach(r),o=i(t),m(M.$$.fragment,t),u=i(t),m(K.$$.fragment,t),this.h()},h(){h(c,"class","carousel-inner")},m(t,e){p(T,t,e),g(t,n,e),g(t,c,e);for(let t=0;t<V.length;t+=1)V[t].m(c,null);g(t,o,e),p(M,t,e),g(t,u,e),p(K,t,e),B=!0},p(t,n){const s={};if(!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),T.$set(s),3&n){let e;for(S=t[1],e=0;e<S.length;e+=1){const s=G(t,S,e);V[e]?(V[e].p(s,n),v(V[e],1)):(V[e]=X(s),V[e].c(),v(V[e],1),V[e].m(c,null))}for(D(),e=S.length;e<V.length;e+=1)k(e);F()}const l={};!d&&1&n&&(d=!0,l.activeIndex=t[0],C(()=>d=!1)),M.$set(l);const a={};!b&&1&n&&(b=!0,a.activeIndex=t[0],C(()=>b=!1)),K.$set(a)},i(t){if(!B){v(T.$$.fragment,t);for(let t=0;t<S.length;t+=1)v(V[t]);v(M.$$.fragment,t),v(K.$$.fragment,t),B=!0}},o(t){x(T.$$.fragment,t),V=V.filter(Boolean);for(let t=0;t<V.length;t+=1)x(V[t]);x(M.$$.fragment,t),x(K.$$.fragment,t),B=!1},d(t){I(T,t),t&&r(n),t&&r(c),y(V,t),t&&r(o),I(M,t),t&&r(u),I(K,t)}}}function Z(t){let e,n,o,D,F,y,b,B,A;function H(e){t[13].call(null,e)}let _={items:t[1],$$slots:{default:[Y]},$$scope:{ctx:t}};void 0!==t[0]&&(_.activeIndex=t[0]);const j=new T({props:_});return E.push(()=>w(j,"activeIndex",H)),{c(){e=l("div"),n=l("h1"),o=c("Пример слайдов с индикаторами"),D=s(),F=l("h2"),y=c("Пример слайдов"),b=s(),a(j.$$.fragment),this.h()},l(t){e=$(t,"DIV",{class:!0});var s=f(e);n=$(s,"H1",{class:!0});var l=f(n);o=d(l,"Пример слайдов с индикаторами"),l.forEach(r),D=i(s),F=$(s,"H2",{class:!0});var c=f(F);y=d(c,"Пример слайдов"),c.forEach(r),b=i(s),m(j.$$.fragment,s),s.forEach(r),this.h()},h(){h(n,"class","mt-4"),h(F,"class","mt-4"),h(e,"class","col-xl-8")},m(t,s){g(t,e,s),u(e,n),u(n,o),u(e,D),u(e,F),u(F,y),u(e,b),p(j,e,null),A=!0},p(t,e){const n={};33554433&e&&(n.$$scope={dirty:e,ctx:t}),!B&&1&e&&(B=!0,n.activeIndex=t[0],C(()=>B=!1)),j.$set(n)},i(t){A||(v(j.$$.fragment,t),A=!0)},o(t){x(j.$$.fragment,t),A=!1},d(t){t&&r(e),I(j)}}}function tt(t){let e,n,c,o,f,d;const u=new V({props:{captionHeader:t[19].title,captionText:t[19].subTitle}});return{c(){e=l("img"),o=s(),a(u.$$.fragment),f=s(),this.h()},l(t){e=$(t,"IMG",{src:!0,class:!0,alt:!0}),o=i(t),m(u.$$.fragment,t),f=i(t),this.h()},h(){e.src!==(n=t[19].url)&&h(e,"src",n),h(e,"class","d-block w-100"),h(e,"alt",c=t[19].title)},m(t,n){g(t,e,n),g(t,o,n),p(u,t,n),g(t,f,n),d=!0},p:b,i(t){d||(v(u.$$.fragment,t),d=!0)},o(t){x(u.$$.fragment,t),d=!1},d(t){t&&r(e),t&&r(o),I(u,t),t&&r(f)}}}function et(t){let e,n;function s(e){t[15].call(null,e)}let l={itemIndex:t[21],$$slots:{default:[tt]},$$scope:{ctx:t}};void 0!==t[0]&&(l.activeIndex=t[0]);const c=new S({props:l});return E.push(()=>w(c,"activeIndex",s)),{c(){a(c.$$.fragment)},l(t){m(c.$$.fragment,t)},m(t,e){p(c,t,e),n=!0},p(t,n){const s={};33554432&n&&(s.$$scope={dirty:n,ctx:t}),!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),c.$set(s)},i(t){n||(v(c.$$.fragment,t),n=!0)},o(t){x(c.$$.fragment,t),n=!1},d(t){I(c,t)}}}function nt(t){let e,n,c,o,d,u,b,B;function A(e){t[14].call(null,e)}let H={items2:t[2]};void 0!==t[0]&&(H.activeIndex=t[0]);const T=new j({props:H});E.push(()=>w(T,"activeIndex",A));let S=t[2],V=[];for(let e=0;e<S.length;e+=1)V[e]=et(k(t,S,e));const G=t=>x(V[t],1,1,()=>{V[t]=null});function R(e){t[16].call(null,e)}let z={direction:"prev",items:t[1]};void 0!==t[0]&&(z.activeIndex=t[0]);const M=new _({props:z});function U(e){t[17].call(null,e)}E.push(()=>w(M,"activeIndex",R));let J={direction:"next",items:t[1]};void 0!==t[0]&&(J.activeIndex=t[0]);const K=new _({props:J});return E.push(()=>w(K,"activeIndex",U)),{c(){a(T.$$.fragment),n=s(),c=l("div");for(let t=0;t<V.length;t+=1)V[t].c();o=s(),a(M.$$.fragment),u=s(),a(K.$$.fragment),this.h()},l(t){m(T.$$.fragment,t),n=i(t),c=$(t,"DIV",{class:!0});var e=f(c);for(let t=0;t<V.length;t+=1)V[t].l(e);e.forEach(r),o=i(t),m(M.$$.fragment,t),u=i(t),m(K.$$.fragment,t),this.h()},h(){h(c,"class","carousel-inner")},m(t,e){p(T,t,e),g(t,n,e),g(t,c,e);for(let t=0;t<V.length;t+=1)V[t].m(c,null);g(t,o,e),p(M,t,e),g(t,u,e),p(K,t,e),B=!0},p(t,n){const s={};if(!e&&1&n&&(e=!0,s.activeIndex=t[0],C(()=>e=!1)),T.$set(s),5&n){let e;for(S=t[2],e=0;e<S.length;e+=1){const s=k(t,S,e);V[e]?(V[e].p(s,n),v(V[e],1)):(V[e]=et(s),V[e].c(),v(V[e],1),V[e].m(c,null))}for(D(),e=S.length;e<V.length;e+=1)G(e);F()}const l={};!d&&1&n&&(d=!0,l.activeIndex=t[0],C(()=>d=!1)),M.$set(l);const a={};!b&&1&n&&(b=!0,a.activeIndex=t[0],C(()=>b=!1)),K.$set(a)},i(t){if(!B){v(T.$$.fragment,t);for(let t=0;t<S.length;t+=1)v(V[t]);v(M.$$.fragment,t),v(K.$$.fragment,t),B=!0}},o(t){x(T.$$.fragment,t),V=V.filter(Boolean);for(let t=0;t<V.length;t+=1)x(V[t]);x(M.$$.fragment,t),x(K.$$.fragment,t),B=!1},d(t){I(T,t),t&&r(n),t&&r(c),y(V,t),t&&r(o),I(M,t),t&&r(u),I(K,t)}}}function st(t){let e,n,o,D,F,y,b,B,A;function H(e){t[18].call(null,e)}let _={items2:t[2],ride:!0,interval:2e3,$$slots:{default:[nt]},$$scope:{ctx:t}};void 0!==t[0]&&(_.activeIndex=t[0]);const j=new T({props:_});return E.push(()=>w(j,"activeIndex",H)),{c(){e=l("div"),n=l("h1"),o=c("Пример слайдов с заголовками"),D=s(),F=l("h2"),y=c("Пример слайдов"),b=s(),a(j.$$.fragment),this.h()},l(t){e=$(t,"DIV",{class:!0});var s=f(e);n=$(s,"H1",{class:!0});var l=f(n);o=d(l,"Пример слайдов с заголовками"),l.forEach(r),D=i(s),F=$(s,"H2",{class:!0});var c=f(F);y=d(c,"Пример слайдов"),c.forEach(r),b=i(s),m(j.$$.fragment,s),s.forEach(r),this.h()},h(){h(n,"class","mt-4"),h(F,"class","mt-4"),h(e,"class","col-xl-8")},m(t,s){g(t,e,s),u(e,n),u(n,o),u(e,D),u(e,F),u(F,y),u(e,b),p(j,e,null),A=!0},p(t,e){const n={};33554433&e&&(n.$$scope={dirty:e,ctx:t}),!B&&1&e&&(B=!0,n.activeIndex=t[0],C(()=>B=!1)),j.$set(n)},i(t){A||(v(j.$$.fragment,t),A=!0)},o(t){x(j.$$.fragment,t),A=!1},d(t){t&&r(e),I(j)}}}function lt(t){let e,n,E,w,C,D,F,y,b,A;document.title=e=ct;const T=new B({props:{class:"mb-4",$$slots:{default:[U]},$$scope:{ctx:t}}}),_=new H({props:{$$slots:{default:[L]},$$scope:{ctx:t}}}),j=new H({props:{$$slots:{default:[Q]},$$scope:{ctx:t}}}),S=new H({props:{$$slots:{default:[Z]},$$scope:{ctx:t}}}),V=new H({props:{$$slots:{default:[st]},$$scope:{ctx:t}}});return{c(){n=s(),E=l("h1"),w=c("Карусель и Слайдер"),C=s(),a(T.$$.fragment),D=s(),a(_.$$.fragment),F=s(),a(j.$$.fragment),y=s(),a(S.$$.fragment),b=s(),a(V.$$.fragment),this.h()},l(t){o('[data-svelte="svelte-46oba3"]',document.head).forEach(r),n=i(t),E=$(t,"H1",{class:!0});var e=f(E);w=d(e,"Карусель и Слайдер"),e.forEach(r),C=i(t),m(T.$$.fragment,t),D=i(t),m(_.$$.fragment,t),F=i(t),m(j.$$.fragment,t),y=i(t),m(S.$$.fragment,t),b=i(t),m(V.$$.fragment,t),this.h()},h(){h(E,"class","mt-4")},m(t,e){g(t,n,e),g(t,E,e),u(E,w),g(t,C,e),p(T,t,e),g(t,D,e),p(_,t,e),g(t,F,e),p(j,t,e),g(t,y,e),p(S,t,e),g(t,b,e),p(V,t,e),A=!0},p(t,[n]){(!A||0&n)&&e!==(e=ct)&&(document.title=e);const s={};33554432&n&&(s.$$scope={dirty:n,ctx:t}),T.$set(s);const l={};33554433&n&&(l.$$scope={dirty:n,ctx:t}),_.$set(l);const c={};33554433&n&&(c.$$scope={dirty:n,ctx:t}),j.$set(c);const a={};33554433&n&&(a.$$scope={dirty:n,ctx:t}),S.$set(a);const o={};33554433&n&&(o.$$scope={dirty:n,ctx:t}),V.$set(o)},i(t){A||(v(T.$$.fragment,t),v(_.$$.fragment,t),v(j.$$.fragment,t),v(S.$$.fragment,t),v(V.$$.fragment,t),A=!0)},o(t){x(T.$$.fragment,t),x(_.$$.fragment,t),x(j.$$.fragment,t),x(S.$$.fragment,t),x(V.$$.fragment,t),A=!1},d(t){t&&r(n),t&&r(E),t&&r(C),I(T,t),t&&r(D),I(_,t),t&&r(F),I(j,t),t&&r(y),I(S,t),t&&r(b),I(V,t)}}}let ct="Карусель и Слайдер | UI | Пользовательский Интерфейс";function at(t,e,n){let s=0;return[s,["data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E","data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E","data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"],[{url:"https://cs8.pikabu.ru/post_img/2018/02/18/5/1518939142130163736.jpg",title:"Slide 1",subTitle:"Slide 1"},{url:"https://i.pinimg.com/originals/a8/a5/e4/a8a5e476b954ea8a3a5555abad0d726e.jpg",title:"Slide 2",subTitle:"Slide 2"},{url:"https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2013/12/blog_bloomua_155528621.jpg",title:"Slide 3",subTitle:"Slide 3"}],function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)},function(t){n(0,s=t)}]}export default class extends t{constructor(t){super(),e(this,t,at,lt,n,{})}}
