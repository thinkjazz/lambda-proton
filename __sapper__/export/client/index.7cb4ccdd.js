import{S as t,i as s,s as e,e as l,w as r,c as o,b as n,x as a,d as h,f as c,h as f,j as i,y as u,H as p,J as g,I as d,z as m,K as v}from"./client.9b7f6366.js";function b(t,s,e){const l=t.slice();return l[1]=s[e],l}function E(t){let s,e,p,g,d=t[1].title+"";return{c(){s=l("li"),e=l("a"),p=r(d),this.h()},l(t){s=o(t,"LI",{});var l=n(s);e=o(l,"A",{rel:!0,href:!0});var r=n(e);p=a(r,d),r.forEach(h),l.forEach(h),this.h()},h(){c(e,"rel","prefetch"),c(e,"href",g="blog/"+t[1].slug)},m(t,l){f(t,s,l),i(s,e),i(e,p)},p(t,s){1&s&&d!==(d=t[1].title+"")&&u(p,d),1&s&&g!==(g="blog/"+t[1].slug)&&c(e,"href",g)},d(t){t&&h(s)}}}function j(t){let s,e,u,j,x,y=t[0],H=[];for(let s=0;s<y.length;s+=1)H[s]=E(b(t,y,s));return{c(){s=p(),e=l("h1"),u=r("Recent posts"),j=p(),x=l("ul");for(let t=0;t<H.length;t+=1)H[t].c();this.h()},l(t){g('[data-svelte="svelte-hfp9t8"]',document.head).forEach(h),s=d(t),e=o(t,"H1",{});var l=n(e);u=a(l,"Recent posts"),l.forEach(h),j=d(t),x=o(t,"UL",{class:!0});var r=n(x);for(let t=0;t<H.length;t+=1)H[t].l(r);r.forEach(h),this.h()},h(){document.title="Blog",c(x,"class","svelte-1frg2tf")},m(t,l){f(t,s,l),f(t,e,l),i(e,u),f(t,j,l),f(t,x,l);for(let t=0;t<H.length;t+=1)H[t].m(x,null)},p(t,[s]){if(1&s){let e;for(y=t[0],e=0;e<y.length;e+=1){const l=b(t,y,e);H[e]?H[e].p(l,s):(H[e]=E(l),H[e].c(),H[e].m(x,null))}for(;e<H.length;e+=1)H[e].d(1);H.length=y.length}},i:m,o:m,d(t){t&&h(s),t&&h(e),t&&h(j),t&&h(x),v(H,t)}}}function x({params:t,query:s}){return this.fetch("blog.json").then(t=>t.json()).then(t=>({posts:t}))}function y(t,s,e){let{posts:l}=s;return t.$set=(t=>{"posts"in t&&e(0,l=t.posts)}),[l]}export default class extends t{constructor(t){super(),s(this,t,y,j,e,{posts:0})}}export{x as preload};
