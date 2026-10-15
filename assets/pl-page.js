
(function(){
var IMG=window.SF_IMG||"img/";   /* nel tema Shopify le immagini stanno negli asset */
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var eur=function(v){return v.toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})};
/* comparsa al passaggio */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
$$(".rv").forEach(function(el){io.observe(el)});
/* scontrino: le righe compaiono una per una, poi il timbro */
var righe=$$("#rcpt .row");righe.forEach(function(r,i){setTimeout(function(){r.classList.add("in")},700+i*260)});
setTimeout(function(){$("#stamp").classList.add("in")},700+righe.length*260+500);

/* calcolatore: 140 € e 32 kg circa a persona l'anno (Waste Watcher 2025) */
var sel={P:4,F:1,S:1};
function calc(){var p=sel.P,e=Math.round(140*p*sel.F*sel.S/10)*10,k=Math.round(32.1*p*sel.F);
  $("#cE").textContent=e.toLocaleString("it-IT");$("#cK").textContent=k;
  $("#cM").textContent=Math.round(e/90);$("#cP").textContent=Math.round(e/8);
  var m=Math.round(e/12);$("#cB").textContent=m;$("#cB").nextElementSibling.textContent="euro buttati ogni mese";
  var gg=Math.max(1,Math.ceil(29.99/(e/365)));$("#cR").textContent=gg<=14?"ti ripaghi in meno di 2 settimane":gg<=21?"ti ripaghi in meno di 3 settimane":gg<=31?"ti ripaghi in meno di un mese":"ti ripaghi in "+Math.ceil(gg/30)+" mesi"}
[["qP","P"],["qF","F"],["qS","S"]].forEach(function(q){$$("#"+q[0]+" button").forEach(function(b){b.addEventListener("click",function(){$$("#"+q[0]+" button").forEach(function(x){x.classList.remove("on")});b.classList.add("on");sel[q[1]]=+b.dataset.v;calc()})})});
calc();

/* app */
var CAP={frigo:["Ogni prodotto salvato sono soldi in tasca","Tocca la spunta verde: vedi quanti euro hai salvato e quanto risparmi in un anno. Prova anche \"Scansiona scontrino\"."],
 ricette:["Cosa cucino stasera?","Le ricette partono da quello che sta per scadere. Tocca una ricetta: ingredienti, procedimento e quanto risparmi cucinandola."],
 risparmio:["I soldi che non butti","Il grafico mese per mese: in rosso quanto buttavi prima, in verde quanto butti adesso."],
 spesa:["Spesa senza doppioni","Se qualcosa ce l'hai già in frigo, l'app te lo dice prima del carrello. Premi \"Toglila\" e il doppione evitato finisce nel contatore."]};
CAP.ricetta=["Ricetta completa, con quello che hai","Ingredienti divisi tra in scadenza, già in casa e da comprare. Premi \"L'ho cucinata\": i prodotti escono dal frigo e i soldi salvati entrano nel contatore."];
function go(v){$$(".vw").forEach(function(x){x.classList.toggle("on",x.dataset.v===v)});var tab=v==="ricetta"?"ricette":v;
  $$("#tabs button,#feat .ft").forEach(function(b){b.classList.toggle("on",b.dataset.go===tab)});
  $("#scanBtn").style.display=v==="frigo"?"":"none";
  $("#capT").textContent=CAP[v][0];$("#capP").textContent=CAP[v][1];
  if(v==="risparmio")$$("#bars i").forEach(function(i,k){i.style.height="0";setTimeout(function(){i.style.height=i.dataset.h+"%"},60+k*120)})}
$$("#tabs button,#feat .ft").forEach(function(b){b.addEventListener("click",function(){go(b.dataset.go)})});
var salvati=38.40,chili=7.9,obiettivo=46,scr=$("#ph .scr");
function contatore(da,a){var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/700),v=da+(a-da)*(1-Math.pow(1-k,3));$("#sv").textContent="€ "+eur(v);if(k<1)requestAnimationFrame(f)})(t0)}
function aggiorna(prima){contatore(prima,salvati);$("#kg").textContent=chili.toLocaleString("it-IT",{maximumFractionDigits:1})+" kg";
  $("#svBar").style.width=Math.min(100,salvati/obiettivo*100)+"%";$("#svY").textContent="≈ "+Math.round(salvati*12/10)*10+" € in un anno"}
function diario(t,e){var d=document.createElement("div");d.className="lg2 nuovo";d.innerHTML="<span>"+t+"</span><b>+ "+eur(e)+" €</b>";$("#log").prepend(d)}
function vola(src,e,k){var prima=salvati;salvati+=e;chili+=k;
  var r=src.getBoundingClientRect(),s0=scr.getBoundingClientRect(),c=$(".saved").getBoundingClientRect(),pl=document.createElement("span");
  pl.className="plus";pl.textContent="+ "+eur(e)+" €";scr.appendChild(pl);
  var x0=r.left-s0.left+r.width/2-pl.offsetWidth/2,y0=r.top-s0.top+r.height/2-pl.offsetHeight/2,x1=c.left-s0.left+20,y1=c.top-s0.top+22;
  pl.style.left=x0+"px";pl.style.top=y0+"px";
  pl.animate([{transform:"translate(0,0) scale(.5)",opacity:0},{transform:"translate(0,-22px) scale(1.15)",opacity:1,offset:.22},{transform:"translate(0,-22px) scale(1)",opacity:1,offset:.5},{transform:"translate("+(x1-x0)+"px,"+(y1-y0)+"px) scale(.7)",opacity:.2}],{duration:1300,easing:"ease-in-out",fill:"forwards"});
  setTimeout(function(){aggiorna(prima);$(".saved").animate([{transform:"scale(1)"},{transform:"scale(1.05)"},{transform:"scale(1)"}],{duration:420})},1150);
  setTimeout(function(){pl.remove()},1350)}
function controllaAvviso(){var restano=$$('.vw[data-v=frigo] .it.r').filter(function(x){return !x.dataset.preso}).length;
  if(restano){$(".alrt span").innerHTML=(restano===1?"1 prodotto scade":restano+" prodotti scadono")+" entro domani<b>Salvalo con una ricetta →</b>".replace("Salvalo",restano===1?"Salvalo":"Salvali");return}
  $(".alrt").innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg><span>Niente in scadenza oggi<b>Brava! Frigo sotto controllo</b></span>';$(".alrt").style.background="var(--mint)";$(".alrt").style.color="var(--green)"}
function usa(it,come){if(it.dataset.preso)return;it.dataset.preso=1;it.querySelector("button").classList.add("si");
  vola(it,+it.dataset.e,+it.dataset.k);diario(it.querySelector("b").textContent+" · "+(come||"usato"),+it.dataset.e);
  setTimeout(function(){it.classList.add("done")},450);controllaAvviso()}
$$(".vw[data-v=frigo] .it button").forEach(function(b){b.addEventListener("click",function(){usa(b.closest(".it"))})});
$(".alrt").addEventListener("click",function(){go("ricette")});
var RIC={
 frittata:{img:"rc-frittata-zucchine",t:"Frittata di zucchine e menta",m:"15 min · per 2 · facile",usa:["zucchine"],extra:0,
  ing:[["Zucchine (2)","r","scadono domani"],["Uova (4)","g","ce l'hai"],["Parmigiano (30 g)","g","ce l'hai"],["Menta fresca","n","facoltativa"],["Olio, sale, pepe","g","ce l'hai"]],
  pr:["Taglia le zucchine a rondelle sottili e falle rosolare 5 minuti in padella con un filo d'olio.","Sbatti le uova con il parmigiano, un pizzico di sale, pepe e qualche foglia di menta.","Versa le uova sulle zucchine, copri e cuoci a fuoco basso per 6-7 minuti.","Gira la frittata aiutandoti con un piatto e lasciala dorare altri 2 minuti."]},
 polpette:{img:"rc-polpette",t:"Polpette di pane raffermo",m:"20 min · per 4 · facile",usa:[],extra:1.20,extraT:"Pane raffermo · polpette",
  ing:[["Pane raffermo (200 g)","r","avanzato ieri"],["Uova (2)","g","ce l'hai"],["Parmigiano (40 g)","g","ce l'hai"],["Latte (1 bicchiere)","g","ce l'hai"],["Passata di pomodoro (400 g)","g","ce l'hai"],["Basilico","n","facoltativo"]],
  pr:["Spezzetta il pane e lascialo in ammollo nel latte per 10 minuti, poi strizzalo bene.","Impasta il pane con uova, parmigiano e un pizzico di sale fino a ottenere un composto morbido.","Forma delle polpette grandi come una noce.","Cuocile 15 minuti nella passata calda con un filo d'olio e qualche foglia di basilico."]},
 panzanella:{img:"rc-panzanella",t:"Panzanella toscana",m:"10 min · per 2 · senza cottura",usa:["pomodori"],extra:1.20,extraT:"Pane raffermo · panzanella",
  ing:[["Pomodori (3)","g","in frigo"],["Pane raffermo (150 g)","r","avanzato ieri"],["Cipolla rossa (1/2)","g","ce l'hai"],["Cetriolo (1)","n","da comprare"],["Basilico, olio, aceto","g","ce l'hai"]],
  pr:["Bagna il pane in acqua fresca con un goccio d'aceto, poi strizzalo e sbriciolalo in una ciotola.","Aggiungi pomodori a pezzi, cipolla a fettine sottili e cetriolo a cubetti.","Condisci con olio, sale e basilico e lascia riposare 10 minuti prima di servire."]}};
function apriRicetta(k){var r=RIC[k],tot=r.usa.reduce(function(a,id){var it=$('.it[data-id="'+id+'"]');return a+(it?+it.dataset.e:0)},0)+r.extra,el=$("#rcD");
  el.innerHTML='<div class="rd"><button class="rd-back" id="rdBack">‹ Ricette</button><div class="rd-ph" style="background-image:url('+IMG+r.img+'.jpg)"><i>salvi '+eur(tot)+' €</i></div>'+
   '<h3>'+r.t+'</h3><div class="meta">'+r.m+'</div><div class="lbl">Ingredienti</div><ul class="ing">'+r.ing.map(function(x){return '<li><span>'+x[0]+'</span><em class="'+x[1]+'">'+x[2]+'</em></li>'}).join("")+'</ul>'+
   '<div class="lbl">Procedimento</div><ol class="pr2">'+r.pr.map(function(x){return '<li><span>'+x+'</span></li>'}).join("")+'</ol>'+
   '<button class="cook" id="cook">L\'ho cucinata · salvi '+eur(tot)+' €</button><div style="height:20px"></div></div>';
  go("ricetta");el.scrollTop=0;
  $("#rdBack").addEventListener("click",function(){go("ricette")});
  $("#cook").addEventListener("click",function(){var b=this;if(b.classList.contains("ok"))return;b.classList.add("ok");b.textContent="Fatta! Torno al frigo…";
    setTimeout(function(){go("frigo");$(".vw[data-v=frigo]").scrollTop=0;
      setTimeout(function(){var tot=r.extra,kg=r.extra?.3:0;
        r.usa.forEach(function(id){var it=$('.it[data-id="'+id+'"]');if(!it||it.dataset.preso)return;it.dataset.preso=1;it.querySelector("button").classList.add("si");
          tot+=+it.dataset.e;kg+=+it.dataset.k;diario(it.querySelector("b").textContent+" · "+r.t.toLowerCase(),+it.dataset.e);setTimeout(function(){it.classList.add("done")},500)});
        if(r.extra)diario(r.extraT,r.extra);
        if(tot)vola($(".alrt"),tot,kg);controllaAvviso()},350)},700)})}
$$(".rc").forEach(function(c){c.addEventListener("click",function(){apriRicetta(c.dataset.r)})});
/* spesa: doppione evitato */
$("#togli").addEventListener("click",function(){var w=$("#warn"),prima=salvati;salvati+=2.05;chili+=.25;aggiorna(prima);diario("Doppione evitato · mozzarella",2.05);
  $("#spMozz").classList.add("via");w.classList.add("ok");w.innerHTML='<span><b>Doppione evitato:</b> + 2,05 € che restano nel portafoglio. Li trovi nel contatore dei risparmi.</span>'});
$("#ftScan").addEventListener("click",function(){setTimeout(function(){if(!$("#scanBtn").classList.contains("via"))$("#scanBtn").click()},150)});
/* scansione scontrino: 3 prodotti entrano da soli nel frigo */
$("#scanBtn").addEventListener("click",function(){var ov=$("#scanOv"),rr=$$("#scanOv .fr div");ov.classList.add("on");$("#scanBtn").classList.add("via");
  rr.forEach(function(r,k){setTimeout(function(){if(k!==2)r.classList.add("ok")},500+k*450)});
  setTimeout(function(){$("#scanTx").innerHTML="<b>3 prodotti aggiunti</b> con la scadenza già impostata. Il detersivo l'ho saltato: non va in frigo.";},2400);
  setTimeout(function(){ov.classList.remove("on");var lbl=$("#okLbl"),ICK=$(".vw[data-v=frigo] .it button").innerHTML;
    [["pr-spinaci","Spinaci freschi","300 g · 1,79 €","4 giorni","y","1.79",".3"],["pr-uova","Uova","6 pezzi · 2,39 €","20 giorni","g","2.39",".4"],["pr-latte","Latte","1 litro · 1,49 €","7 giorni","g","1.49","1"]].forEach(function(x,k){
      var d=document.createElement("div");d.className="it "+x[4]+" nuovo";d.dataset.e=x[5];d.dataset.k=x[6];
      d.innerHTML='<img src="'+IMG+x[0]+'.jpg" alt=""><div class="x"><b>'+x[1]+'</b><span>'+x[2]+'</span></div><em class="cd">'+x[3]+'</em><button aria-label="Segna come usato">'+ICK+'</button>';
      d.querySelector("button").addEventListener("click",function(){usa(d)});lbl.after(d)});
    var vf=$(".vw[data-v=frigo]");vf.scrollTo({top:lbl.offsetTop-90,behavior:"smooth"})},4600)});
$$(".sp").forEach(function(s){s.addEventListener("click",function(){s.classList.toggle("ck")})});
/* notifica: arriva quando l'app è visibile, poi se ne va */
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();var t=$("#toast");setTimeout(function(){t.classList.add("in")},700);setTimeout(function(){t.classList.remove("in")},5200)}},{threshold:.5}).observe($("#ph"));

/* faq */
$$(".fq button").forEach(function(b){b.addEventListener("click",function(){var f=b.parentNode,o=f.classList.contains("on");$$(".fq").forEach(function(x){x.classList.remove("on")});if(!o)f.classList.add("on")})});
/* barra fissa in basso */
/* barra fissa in basso: sparisce sull'offerta e mentre usi l'app (coprirebbe i tasti del telefono) */
var stk=$("#stk"),off=$("#offerta"),ph=$("#ph");
function vede(el){var r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}
addEventListener("scroll",function(){stk.classList.toggle("on",scrollY>650&&!vede(off)&&!vede(ph))},{passive:true});
/* acquisto: in locale scorre all'offerta, nel tema Shopify invia il prodotto al checkout */
$$(".buy").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();var f=document.getElementById("pl-atc");if(f&&f.getAttribute("action"))f.submit();else off.scrollIntoView({behavior:"smooth"})})});
})();
