import{S as s,i as l,s as a,r as t,a as e,e as c,c as i,b as n,d as o,g as u,h as p,u as h,v as r,n as $,m as d,t as f,o as m,W as x,X as g,p as j}from"./client.d2072051.js";function v(s){let l,a;const m=s[7].default,x=t(m,s,s[6],null);let g=[s[1],{id:s[0]},{class:s[2].join(" ")}],j={};for(let s=0;s<g.length;s+=1)j=e(j,g[s]);return{c(){l=c("div"),x&&x.c(),this.h()},l(s){l=i(s,"DIV",{id:!0,class:!0});var a=n(l);x&&x.l(a),a.forEach(o),this.h()},h(){u(l,j)},m(s,t){p(s,l,t),x&&x.m(l,null),a=!0},p(s,[a]){x&&x.p&&64&a&&x.p(h(m,s,s[6],null),r(m,s[6],a,null)),u(l,$(g,[2&a&&s[1],1&a&&{id:s[0]},4&a&&{class:s[2].join(" ")}]))},i(s){a||(d(x,s),a=!0)},o(s){f(x,s),a=!1},d(s){s&&o(l),x&&x.d(s)}}}function z(s,l,a){let{class:t=""}=l,{id:c=""}=l;const i=m(l),n=[],o=["xs","sm","md","lg","xl"];o.forEach(s=>{const a=l[s];if(!a&&""!==a)return;const t="xs"===s;if(x(a)){const l=t?"-":`-${s}-`,e=g(t,s,a.size);(a.size||""===a.size)&&n.push(e),a.push&&n.push(`push${l}${a.push}`),a.pull&&n.push(`pull${l}${a.pull}`),a.offset&&n.push(`offset${l}${a.offset}`)}else n.push(g(t,s,a))}),n.length||n.push("col"),t&&n.push(t);let{$$slots:u={},$$scope:p}=l;return s.$set=(s=>{a(5,l=e(e({},l),j(s))),"class"in s&&a(3,t=s.class),"id"in s&&a(0,c=s.id),"$$scope"in s&&a(6,p=s.$$scope)}),l=j(l),[c,i,n,t,o,l,p,u]}class E extends s{constructor(s){super(),l(this,s,z,v,a,{class:3,id:0})}}export{E as C};