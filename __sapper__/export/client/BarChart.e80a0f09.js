import{S as a,i as s,s as t,e as r,c as e,b as o,d as n,f as c,h as i,z as h,L as l}from"./client.673fe78e.js";import{C as u}from"./AreaChart.629b1668.js";function b(a){let s;return{c(){s=r("canvas"),this.h()},l(a){s=e(a,"CANVAS",{id:!0}),o(s).forEach(n),this.h()},h(){c(s,"id","barChart")},m(a,t){i(a,s,t)},p:h,i:h,o:h,d(a){a&&n(s)}}}function d(a){const s={labels:["January","February","March","April","May","June"],datasets:[{label:"# of Votes",data:[4,6,10,12,15,19],backgroundColor:"rgba(3,117,220)"}]},t={scales:{yAxes:[{ticks:{beginAtZero:!0}}]}};return l(function(){var a=document.getElementById("barChart");new u(a,{type:"bar",data:s,options:t})}),[]}class f extends a{constructor(a){super(),s(this,a,d,b,t,{})}}export{f as B};
