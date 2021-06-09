class Appointments{
    constructor(parentEl, srno, name, cost, duration ){
        this.parentEl = parentEl;
        this.srno = srno;
        this.name = name;
        this.cost = cost;
        this.duration = duration;
        this.createRow();
    }
    createRow(){
        
        var row =  document.createElement("div");
	    row.className = "row";
        this.parentEl.appendChild(row);


        var item =  document.createElement("div");
	    item.className = "item";
        row.appendChild(item);

        var srno =  document.createElement("div");
	    srno.className = "srno";
        item.appendChild(srno);
        srno.innerText = this.srno;
        
        var name =  document.createElement("div");
	    name.className = "name";
        item.appendChild(name);
        name.innerText = this.name;

        var duration =  document.createElement("div");
	    duration.className = "duration";
        item.appendChild(duration);
        duration.innerText = this.duration;

        var cost =  document.createElement("div");
	    cost.className = "cost";
        item.appendChild(cost);
        cost.innerText = "₹ " + this.cost;

        var remBtn =  document.createElement("div");
	    remBtn.className = "rem-btn";
        remBtn.innerText = "X";
        row.appendChild(remBtn);
        remBtn.addEventListener("click", ()=>{
            row.style.transform = "scaleY(0)";
            row.style.margin = "-31px 0";
        });
    }
}
var appCntr = document.querySelector(".appoint-cntr");
for(var i = 0; i<7; i++){
    new Appointments(appCntr, i+1, `Hello ${(i+1)*2}`, (i+12)*3, `${(i+5)*2} min`);
}