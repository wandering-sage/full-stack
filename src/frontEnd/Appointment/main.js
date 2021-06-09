class Appointments{
    constructor(parentEl, srno, id, name, duration, cost ){
        this.parentEl = parentEl;
        this.srno = srno;
        this.id = id;
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
        srno.innerText = this.srno + 1;
        
        var name =  document.createElement("div");
	    name.className = "ap-name";
        item.appendChild(name);
        name.innerText = this.name;

        var duration =  document.createElement("div");
	    duration.className = "duration";
        item.appendChild(duration);
        var mins = this.duration%60;
        var hrs = Math.floor(this.duration/60);
        duration.innerText = `${hrs==0 ? "" : `${hrs} hr${hrs==1?"":"s"} `}${mins} min`;


        var cost =  document.createElement("div");
	    cost.className = "cost";
        item.appendChild(cost);
        cost.innerText = "₹ " + this.cost;

        var remBtn =  document.createElement("div");
	    remBtn.className = "rem-btn";
        remBtn.innerText = "❌";
        row.appendChild(remBtn);
        remBtn.addEventListener("click", ()=>{
            row.style.transform = "scaleY(0)";
            row.style.margin = "-31px 0";
            setTimeout(()=>{
                appCntr.innerHTML = "";
                var idx = Appointments.selected.indexOf(this.id);
                Appointments.selected.splice(idx,1);
                sessionStorage.setItem("selected", Appointments.selected.join(","));
                Appointments.selected.forEach(getServiceAndShow);
            },200)
        });
    }
}

// ---------------------------------navBar-------------------------------------------------

let mainNav=document.getElementById('main-nav');
let burger=document.querySelector('.navbar-toggle');



burger.addEventListener('click',function(){

    if(this.classList.contains('active')){
        mainNav.style.display="none";
        this.classList.remove('active');
    }
    else{
        mainNav.style.display="flex";
        this.classList.add('active');
    }
});


// ---------------------------------------Appointment----------------------------------------------

Appointments.selected = sessionStorage.getItem("selected").split(",");
var appCntr = document.querySelector(".appoint-cntr");

appCntr.innerHTML = "";
Appointments.selected.forEach(getServiceAndShow);

async function getServiceAndShow(id, i){
    var response = await fetch(`/api/service/${id}`);
    if(response.status == 200){
        var {data} = await response.json();
        new Appointments(appCntr, i, id, data.name, data.duration, data.cost)
    }
    else{
        console.error(response);
        return;
    }
}