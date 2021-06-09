class ServiceCard{
    constructor(parentEl, id, name, cost, duration, imgUrl, color ){
        this.parentEl = parentEl;
        this.imgUrl = imgUrl;
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.duration = duration;
        this.color = color;
        this.createCard();
    }
    createCard(){
        var card = document.createElement("div");
	    card.className = "service-card";
        this.parentEl.appendChild(card);
        card.addEventListener("click", selectService);

        card.setAttribute("data-id", this.id);
        card.setAttribute("data-cost", this.cost);
        card.setAttribute("data-name", this.name);
        card.setAttribute("data-duration", this.duration);

        var tick = document.createElement("div");
	    tick.className = "tick";
        addTickSvg();
        card.appendChild(tick);

        if(this.imgUrl){
            var img = document.createElement("img");
            img.src = this.imgUrl;
            card.appendChild(img);
        }

        var name = document.createElement("div");
        name.className = "name";
        card.appendChild(name);
        name.innerText = this.name;

        name.style.backgroundColor = this.color;
        name.style.borderColor = `transparent transparent transparent ${this.color}`;
        
        var price = document.createElement("div");
        price.className = "price";
        card.appendChild(price);
        price.innerText = "₹" + this.cost;

        price.style.backgroundColor = this.color;
        price.style.borderColor = `transparent ${this.color} transparent`;

        getPreviouslySelected(this);

        function addTickSvg(){
            var xmlns = "http://www.w3.org/2000/svg";
            var boxWidth = 600;
            var boxHeight = 600;
        
            var svgElem = document.createElementNS(xmlns, "svg");
            svgElem.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
            svgElem.setAttributeNS(null, "width", 60);
            svgElem.setAttributeNS(null, "height", 60);
            svgElem.innerHTML = `<path d="m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z"/>`;
            tick.appendChild(svgElem);
        }

        function selectService(e){
            card.classList.toggle("selected");
            var cost = Number(card.getAttribute("data-cost"));
            if(card.classList.contains("selected")){
                ServiceCard.selected.push(card);
                proceed.classList.remove("hide");
                total.innerText = Number(total.innerText)+cost;
            }
            else{
                var idx = ServiceCard.selected.indexOf(card);
                ServiceCard.selected.splice(idx,1);
                if(ServiceCard.selected.length < 1){
                    proceed.classList.add("hide");
                }
                total.innerText = Number(total.innerText)-cost;
            }
            if(e){
                var selected = ServiceCard.selected.map((c)=>c.getAttribute("data-id")).join(",");
                sessionStorage.setItem("selected", selected);
            }

            appCntr.innerHTML = "";
            ServiceCard.selected.forEach((s, i)=>{
                // var id = s.getAttribute("data-id");
                var name = s.getAttribute("data-name");
                var duration = s.getAttribute("data-duration");
                var cost = s.getAttribute("data-cost");

                new Appointments(appCntr, i, name, duration, cost);
            });
        }
        function getPreviouslySelected(t){
            var s = sessionStorage.getItem("selected"); 
            if(s && s.includes(t.id)){
                selectService();
            }
        }
    }
}

class Appointments{
    constructor(parentEl, srno, name, duration, cost ){
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
                var card = ServiceCard.selected[this.srno];
                card.click();
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

// ----------------------------------------Service-Cards-----------------------------------------

var grid = document.querySelector(".grid"); 
ServiceCard.selected = [];

showServices();

var proceed = document.querySelector(".proceed");
proceed.addEventListener("click", scrollToBottom);
window.addEventListener("scroll", isBottom);

async function showServices(){
    var response = await fetch("/api/service");
    if(response.status == 200){
        var {data} = await response.json();
        
        data.forEach((s)=>{
            new ServiceCard(grid, s._id, s.name, s.cost, s.duration, s.image, s.category.color);
        });
    }
    else{
        console.error(response);
        return;
    }
}

function scrollToBottom(){
    var startPosition = window.pageYOffset;
    var startTime = null;
    duration = 800;
    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, document.body.offsetHeight-startPosition, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(scrollAnimation);
    }
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    requestAnimationFrame(scrollAnimation);
}

function isBottom(e){
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-10) {
        proceed.classList.add("atBottom");
    }
    else{
    proceed.classList.remove("atBottom");
    }
}

// ---------------------------------------Appointment----------------------------------------------

var appCntr = document.querySelector(".appoint-cntr");
var total = document.querySelector(".appointment .total");
var bookBtn = document.querySelector(".book-appointment");

bookBtn.addEventListener("click", sendToAppointment);

function sendToAppointment(){
    if(sessionStorage.getItem("selected").replace(/\s/g, "")==""){
        var appnt = document.querySelector(".appointment");
        appnt.classList.add("show");
        setTimeout(()=>{
            appnt.classList.remove("show");
        }, 1500);
        return;
    }
    window.location.href = '/appointment';
}

