import{S as t,i as e,s as r,D as $,E as a,F as s,m as c,t as n,G as o,H as l,I as f,h as m,d,e as i,w as p,c as g,b as u,x as h,f as x,j as w,y as T,r as v,u as C,v as I,J as y,z as b}from"./client.673fe78e.js";import{B as j,a as E}from"./BreadcrumbItem.f1b08efb.js";import{C as D,a as V}from"./CardBody.12f8ef52.js";import{C as F}from"./CardHeader.20f0c5d0.js";import{C as B}from"./CardText.0acb5aa3.js";import{R as A}from"./Row.c8150494.js";import{C as H}from"./CardFooter.590d4d6f.js";import{T as z}from"./Table.0d125f81.js";import"./Image.b82d678a.js";import{A as R}from"./AreaChart.629b1668.js";import{B as k}from"./BarChart.e80a0f09.js";function q(t){let e;return{c(){e=p(t[0])},l(r){e=h(r,t[0])},m(t,r){m(t,e,r)},p(t,r){1&r&&T(e,t[0])},d(t){t&&d(e)}}}function G(t){let e;const r=new B({props:{$$slots:{default:[q]},$$scope:{ctx:t}}});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},p(t,e){const $={};9&e&&($.$$scope={dirty:e,ctx:t}),r.$set($)},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function J(t){let e,r,$,a,s;return{c(){e=i("a"),r=p(t[2]),$=l(),a=i("div"),s=i("i"),this.h()},l(c){e=g(c,"A",{class:!0,href:!0});var n=u(e);r=h(n,t[2]),n.forEach(d),$=f(c),a=g(c,"DIV",{class:!0});var o=u(a);s=g(o,"I",{class:!0}),u(s).forEach(d),o.forEach(d),this.h()},h(){x(e,"class","small text-white stretched-link"),x(e,"href","charts"),x(s,"class","fas fa-angle-right"),x(a,"class","small text-white")},m(t,c){m(t,e,c),w(e,r),m(t,$,c),m(t,a,c),w(a,s)},p(t,e){4&e&&T(r,t[2])},d(t){t&&d(e),t&&d($),t&&d(a)}}}function S(t){let e,r;const i=new V({props:{$$slots:{default:[G]},$$scope:{ctx:t}}}),p=new H({props:{class:"d-flex align-items-center justify-content-between",$$slots:{default:[J]},$$scope:{ctx:t}}});return{c(){$(i.$$.fragment),e=l(),$(p.$$.fragment)},l(t){a(i.$$.fragment,t),e=f(t),a(p.$$.fragment,t)},m(t,$){s(i,t,$),m(t,e,$),s(p,t,$),r=!0},p(t,e){const r={};9&e&&(r.$$scope={dirty:e,ctx:t}),i.$set(r);const $={};12&e&&($.$$scope={dirty:e,ctx:t}),p.$set($)},i(t){r||(c(i.$$.fragment,t),c(p.$$.fragment,t),r=!0)},o(t){n(i.$$.fragment,t),n(p.$$.fragment,t),r=!1},d(t){o(i,t),t&&d(e),o(p,t)}}}function K(t){let e;const r=new D({props:{inverse:!0,color:t[1],class:"mb-4",$$slots:{default:[S]},$$scope:{ctx:t}}});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},p(t,[e]){const $={};2&e&&($.color=t[1]),13&e&&($.$$scope={dirty:e,ctx:t}),r.$set($)},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function L(t,e,r){let{cardTitle:$=""}=e,{cardColor:a}=e,{cardFooterText:s="Детали"}=e;return t.$set=(t=>{"cardTitle"in t&&r(0,$=t.cardTitle),"cardColor"in t&&r(1,a=t.cardColor),"cardFooterText"in t&&r(2,s=t.cardFooterText)}),[$,a,s]}class M extends t{constructor(t){super(),e(this,t,L,K,r,{cardTitle:0,cardColor:1,cardFooterText:2})}}const N=t=>({}),O=t=>({});function P(t){let e,r,$;return{c(){e=i("i"),r=l(),$=p(t[0]),this.h()},l(a){e=g(a,"I",{class:!0}),u(e).forEach(d),r=f(a),$=h(a,t[0]),this.h()},h(){x(e,"class",t[1])},m(t,a){m(t,e,a),m(t,r,a),m(t,$,a)},p(t,r){2&r&&x(e,"class",t[1]),1&r&&T($,t[0])},d(t){t&&d(e),t&&d(r),t&&d($)}}}function Q(t){let e,r;const $=t[2].default,a=v($,t,t[3],null),s=t[2].chartCaption,o=v(s,t,t[3],O);return{c(){a&&a.c(),e=l(),o&&o.c()},l(t){a&&a.l(t),e=f(t),o&&o.l(t)},m(t,$){a&&a.m(t,$),m(t,e,$),o&&o.m(t,$),r=!0},p(t,e){a&&a.p&&8&e&&a.p(C($,t,t[3],null),I($,t[3],e,null)),o&&o.p&&8&e&&o.p(C(s,t,t[3],O),I(s,t[3],e,N))},i(t){r||(c(a,t),c(o,t),r=!0)},o(t){n(a,t),n(o,t),r=!1},d(t){a&&a.d(t),t&&d(e),o&&o.d(t)}}}function U(t){let e,r;const i=new F({props:{$$slots:{default:[P]},$$scope:{ctx:t}}}),p=new V({props:{$$slots:{default:[Q]},$$scope:{ctx:t}}});return{c(){$(i.$$.fragment),e=l(),$(p.$$.fragment)},l(t){a(i.$$.fragment,t),e=f(t),a(p.$$.fragment,t)},m(t,$){s(i,t,$),m(t,e,$),s(p,t,$),r=!0},p(t,e){const r={};11&e&&(r.$$scope={dirty:e,ctx:t}),i.$set(r);const $={};8&e&&($.$$scope={dirty:e,ctx:t}),p.$set($)},i(t){r||(c(i.$$.fragment,t),c(p.$$.fragment,t),r=!0)},o(t){n(i.$$.fragment,t),n(p.$$.fragment,t),r=!1},d(t){o(i,t),t&&d(e),o(p,t)}}}function W(t){let e;const r=new D({props:{class:"mb-4",$$slots:{default:[U]},$$scope:{ctx:t}}});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},p(t,[e]){const $={};11&e&&($.$$scope={dirty:e,ctx:t}),r.$set($)},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function X(t,e,r){let{cardTitle:$=""}=e,{cardIcon:a=""}=e,{$$slots:s={},$$scope:c}=e;return t.$set=(t=>{"cardTitle"in t&&r(0,$=t.cardTitle),"cardIcon"in t&&r(1,a=t.cardIcon),"$$scope"in t&&r(3,c=t.$$scope)}),[$,a,s,c]}class Y extends t{constructor(t){super(),e(this,t,X,W,r,{cardTitle:0,cardIcon:1})}}function Z(t){let e;return{c(){e=p("Панель")},l(t){e=h(t,"Панель")},m(t,r){m(t,e,r)},d(t){t&&d(e)}}}function _(t){let e;const r=new E({props:{active:!0,$$slots:{default:[Z]},$$scope:{ctx:t}}});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},p(t,e){const $={};1&e&&($.$$scope={dirty:e,ctx:t}),r.$set($)},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function tt(t){let e,r,p,h,w,T,v,C;const I=new M({props:{cardTitle:"Синяя плашка",cardColor:"primary"}}),y=new M({props:{cardTitle:"Оранжевая плашка",cardColor:"warning"}}),j=new M({props:{cardTitle:"Зеленая плашка",cardColor:"success"}}),E=new M({props:{cardTitle:"Опасная плашка",cardColor:"danger"}});return{c(){e=i("div"),$(I.$$.fragment),r=l(),p=i("div"),$(y.$$.fragment),h=l(),w=i("div"),$(j.$$.fragment),T=l(),v=i("div"),$(E.$$.fragment),this.h()},l(t){e=g(t,"DIV",{class:!0});var $=u(e);a(I.$$.fragment,$),$.forEach(d),r=f(t),p=g(t,"DIV",{class:!0});var s=u(p);a(y.$$.fragment,s),s.forEach(d),h=f(t),w=g(t,"DIV",{class:!0});var c=u(w);a(j.$$.fragment,c),c.forEach(d),T=f(t),v=g(t,"DIV",{class:!0});var n=u(v);a(E.$$.fragment,n),n.forEach(d),this.h()},h(){x(e,"class","col-xl-3 col-md-6"),x(p,"class","col-xl-3 col-md-6"),x(w,"class","col-xl-3 col-md-6"),x(v,"class","col-xl-3 col-md-6")},m(t,$){m(t,e,$),s(I,e,null),m(t,r,$),m(t,p,$),s(y,p,null),m(t,h,$),m(t,w,$),s(j,w,null),m(t,T,$),m(t,v,$),s(E,v,null),C=!0},p:b,i(t){C||(c(I.$$.fragment,t),c(y.$$.fragment,t),c(j.$$.fragment,t),c(E.$$.fragment,t),C=!0)},o(t){n(I.$$.fragment,t),n(y.$$.fragment,t),n(j.$$.fragment,t),n(E.$$.fragment,t),C=!1},d(t){t&&d(e),o(I),t&&d(r),t&&d(p),o(y),t&&d(h),t&&d(w),o(j),t&&d(T),t&&d(v),o(E)}}}function et(t){let e;const r=new R({});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function rt(t){let e;const r=new k({});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function $t(t){let e,r,p,h;const w=new Y({props:{cardTitle:"Пример диаграммы",cardIcon:"fas fa-chart-area",$$slots:{default:[et]},$$scope:{ctx:t}}}),T=new Y({props:{cardTitle:"Пример гистограммы",cardIcon:"fas fa-chart-bar",$$slots:{default:[rt]},$$scope:{ctx:t}}});return{c(){e=i("div"),$(w.$$.fragment),r=l(),p=i("div"),$(T.$$.fragment),this.h()},l(t){e=g(t,"DIV",{class:!0});var $=u(e);a(w.$$.fragment,$),$.forEach(d),r=f(t),p=g(t,"DIV",{class:!0});var s=u(p);a(T.$$.fragment,s),s.forEach(d),this.h()},h(){x(e,"class","col-xl-6"),x(p,"class","col-xl-6")},m(t,$){m(t,e,$),s(w,e,null),m(t,r,$),m(t,p,$),s(T,p,null),h=!0},p(t,e){const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),w.$set(r);const $={};1&e&&($.$$scope={dirty:e,ctx:t}),T.$set($)},i(t){h||(c(w.$$.fragment,t),c(T.$$.fragment,t),h=!0)},o(t){n(w.$$.fragment,t),n(T.$$.fragment,t),h=!1},d(t){t&&d(e),o(w),t&&d(r),t&&d(p),o(T)}}}function at(t){let e;const r=new z({});return{c(){$(r.$$.fragment)},l(t){a(r.$$.fragment,t)},m(t,$){s(r,t,$),e=!0},i(t){e||(c(r.$$.fragment,t),e=!0)},o(t){n(r.$$.fragment,t),e=!1},d(t){o(r,t)}}}function st(t){let e,r,T,v,C,I,b,E,D;document.title=e=ct;const V=new j({props:{class:"mb-4",$$slots:{default:[_]},$$scope:{ctx:t}}}),F=new A({props:{$$slots:{default:[tt]},$$scope:{ctx:t}}}),B=new A({props:{$$slots:{default:[$t]},$$scope:{ctx:t}}}),H=new Y({props:{cardTitle:"Пример DataTable",cardIcon:"fas fa-table",$$slots:{default:[at]},$$scope:{ctx:t}}});return{c(){r=l(),T=i("h1"),v=p("Панель"),C=l(),$(V.$$.fragment),I=l(),$(F.$$.fragment),b=l(),$(B.$$.fragment),E=l(),$(H.$$.fragment),this.h()},l(t){y('[data-svelte="svelte-qazgrf"]',document.head).forEach(d),r=f(t),T=g(t,"H1",{class:!0});var e=u(T);v=h(e,"Панель"),e.forEach(d),C=f(t),a(V.$$.fragment,t),I=f(t),a(F.$$.fragment,t),b=f(t),a(B.$$.fragment,t),E=f(t),a(H.$$.fragment,t),this.h()},h(){x(T,"class","mt-4")},m(t,e){m(t,r,e),m(t,T,e),w(T,v),m(t,C,e),s(V,t,e),m(t,I,e),s(F,t,e),m(t,b,e),s(B,t,e),m(t,E,e),s(H,t,e),D=!0},p(t,[r]){(!D||0&r)&&e!==(e=ct)&&(document.title=e);const $={};1&r&&($.$$scope={dirty:r,ctx:t}),V.$set($);const a={};1&r&&(a.$$scope={dirty:r,ctx:t}),F.$set(a);const s={};1&r&&(s.$$scope={dirty:r,ctx:t}),B.$set(s);const c={};1&r&&(c.$$scope={dirty:r,ctx:t}),H.$set(c)},i(t){D||(c(V.$$.fragment,t),c(F.$$.fragment,t),c(B.$$.fragment,t),c(H.$$.fragment,t),D=!0)},o(t){n(V.$$.fragment,t),n(F.$$.fragment,t),n(B.$$.fragment,t),n(H.$$.fragment,t),D=!1},d(t){t&&d(r),t&&d(T),t&&d(C),o(V,t),t&&d(I),o(F,t),t&&d(b),o(B,t),t&&d(E),o(H,t)}}}let ct="λproton";export default class extends t{constructor(t){super(),e(this,t,null,st,r,{})}}