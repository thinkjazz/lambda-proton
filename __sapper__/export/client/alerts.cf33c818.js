import{S as t,i as s,s as e,H as a,e as n,w as r,D as o,J as c,d as l,I as $,c as i,b as f,x as m,E as h,f as d,h as u,j as p,F as g,m as x,t as v,G as w,k as E,l as y,K as b,z as j}from"./client.d2072051.js";import{B as H,a as I}from"./BreadcrumbItem.483dfd4c.js";import{R as k}from"./Row.862badb3.js";import{A}from"./Alert.84834c29.js";function B(t,s,e){const a=t.slice();return a[1]=s[e],a}function z(t){let s;return{c(){s=r("Оповещения")},l(t){s=m(t,"Оповещения")},m(t,e){u(t,s,e)},d(t){t&&l(s)}}}function D(t){let s;const e=new I({props:{active:!0,$$slots:{default:[z]},$$scope:{ctx:t}}});return{c(){o(e.$$.fragment)},l(t){h(e.$$.fragment,t)},m(t,a){g(e,t,a),s=!0},p(t,s){const a={};16&s&&(a.$$scope={dirty:s,ctx:t}),e.$set(a)},i(t){s||(x(e.$$.fragment,t),s=!0)},o(t){v(e.$$.fragment,t),s=!1},d(t){w(e,t)}}}function L(t){let s,e,a,o,c,$,h=t[1]+"";return{c(){s=n("h4"),e=r(h),a=r("\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                "),o=n("a"),c=r("Кроме того, ссылки на оповещения цветные, чтобы соответствовать оповещению\n                "),$=r(".\n            "),this.h()},l(t){s=i(t,"H4",{class:!0});var n=f(s);e=m(n,h),n.forEach(l),a=m(t,"\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                "),o=i(t,"A",{href:!0,class:!0});var r=f(o);c=m(r,"Кроме того, ссылки на оповещения цветные, чтобы соответствовать оповещению\n                "),r.forEach(l),$=m(t,".\n            "),this.h()},h(){d(s,"class","alert-heading text-capitalize"),d(o,"href","#todo"),d(o,"class","alert-link")},m(t,n){u(t,s,n),p(s,e),u(t,a,n),u(t,o,n),p(o,c),u(t,$,n)},p:j,d(t){t&&l(s),t&&l(a),t&&l(o),t&&l($)}}}function R(t){let s;const e=new A({props:{color:t[1],$$slots:{default:[L]},$$scope:{ctx:t}}});return{c(){o(e.$$.fragment)},l(t){h(e.$$.fragment,t)},m(t,a){g(e,t,a),s=!0},p(t,s){const a={};16&s&&(a.$$scope={dirty:s,ctx:t}),e.$set(a)},i(t){s||(x(e.$$.fragment,t),s=!0)},o(t){v(e.$$.fragment,t),s=!1},d(t){w(e,t)}}}function F(t){let s,e,o,c,h,g=t[0],w=[];for(let s=0;s<g.length;s+=1)w[s]=R(B(t,g,s));const j=t=>v(w[t],1,1,()=>{w[t]=null});return{c(){s=n("div"),e=n("h2"),o=r("Оповещения"),c=a();for(let t=0;t<w.length;t+=1)w[t].c();this.h()},l(t){s=i(t,"DIV",{class:!0});var a=f(s);e=i(a,"H2",{class:!0});var n=f(e);o=m(n,"Оповещения"),n.forEach(l),c=$(a);for(let t=0;t<w.length;t+=1)w[t].l(a);a.forEach(l),this.h()},h(){d(e,"class","mt-4"),d(s,"class","col-xl-6")},m(t,a){u(t,s,a),p(s,e),p(e,o),p(s,c);for(let t=0;t<w.length;t+=1)w[t].m(s,null);h=!0},p(t,e){if(1&e){let a;for(g=t[0],a=0;a<g.length;a+=1){const n=B(t,g,a);w[a]?(w[a].p(n,e),x(w[a],1)):(w[a]=R(n),w[a].c(),x(w[a],1),w[a].m(s,null))}for(E(),a=g.length;a<w.length;a+=1)j(a);y()}},i(t){if(!h){for(let t=0;t<g.length;t+=1)x(w[t]);h=!0}},o(t){w=w.filter(Boolean);for(let t=0;t<w.length;t+=1)v(w[t]);h=!1},d(t){t&&l(s),b(w,t)}}}function G(t){let s,e,E,y,b,j,I;document.title=s=J;const A=new H({props:{class:"mb-4",$$slots:{default:[D]},$$scope:{ctx:t}}}),B=new k({props:{$$slots:{default:[F]},$$scope:{ctx:t}}});return{c(){e=a(),E=n("h1"),y=r("Оповещения"),b=a(),o(A.$$.fragment),j=a(),o(B.$$.fragment),this.h()},l(t){c('[data-svelte="svelte-1uo06u1"]',document.head).forEach(l),e=$(t),E=i(t,"H1",{class:!0});var s=f(E);y=m(s,"Оповещения"),s.forEach(l),b=$(t),h(A.$$.fragment,t),j=$(t),h(B.$$.fragment,t),this.h()},h(){d(E,"class","mt-4")},m(t,s){u(t,e,s),u(t,E,s),p(E,y),u(t,b,s),g(A,t,s),u(t,j,s),g(B,t,s),I=!0},p(t,[e]){(!I||0&e)&&s!==(s=J)&&(document.title=s);const a={};16&e&&(a.$$scope={dirty:e,ctx:t}),A.$set(a);const n={};16&e&&(n.$$scope={dirty:e,ctx:t}),B.$set(n)},i(t){I||(x(A.$$.fragment,t),x(B.$$.fragment,t),I=!0)},o(t){v(A.$$.fragment,t),v(B.$$.fragment,t),I=!1},d(t){t&&l(e),t&&l(E),t&&l(b),w(A,t),t&&l(j),w(B,t)}}}let J="Оповещения | UI | Пользовательский интерфейс";function K(t){return[["primary","secondary","success","danger","warning","info","light","dark"]]}export default class extends t{constructor(t){super(),s(this,t,K,G,e,{})}}