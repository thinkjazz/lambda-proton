import{S as t,i as s,s as a,H as e,e as n,w as o,J as i,d as r,I as l,c,b as u,x as h,f,h as p,j as d,y as m,z as v}from"./client.9b7f6366.js";function x(t){let s,a,x,g,j,y,H=t[0].title+"",b=t[0].html+"";return document.title=s=t[0].title,{c(){a=e(),x=n("h1"),g=o(H),j=e(),y=n("div"),this.h()},l(t){i('[data-svelte="svelte-1uty71u"]',document.head).forEach(r),a=l(t),x=c(t,"H1",{});var s=u(x);g=h(s,H),s.forEach(r),j=l(t),y=c(t,"DIV",{class:!0}),u(y).forEach(r),this.h()},h(){f(y,"class","content svelte-gnxal1")},m(t,s){p(t,a,s),p(t,x,s),d(x,g),p(t,j,s),p(t,y,s),y.innerHTML=b},p(t,[a]){1&a&&s!==(s=t[0].title)&&(document.title=s),1&a&&H!==(H=t[0].title+"")&&m(g,H),1&a&&b!==(b=t[0].html+"")&&(y.innerHTML=b)},i:v,o:v,d(t){t&&r(a),t&&r(x),t&&r(j),t&&r(y)}}}async function g({params:t,query:s}){const a=await this.fetch(`blog/${t.slug}.json`),e=await a.json();if(200===a.status)return{post:e};this.error(a.status,e.message)}function j(t,s,a){let{post:e}=s;return t.$set=(t=>{"post"in t&&a(0,e=t.post)}),[e]}export default class extends t{constructor(t){super(),s(this,t,j,x,a,{post:0})}}export{g as preload};