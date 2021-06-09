var categoriesUrl = "/api/category";
// ------------------------------------------Drag File------------------------------------------------
const dropArea = document.querySelector(".drag-area"),
	dragText = dropArea.querySelector("h2"),
	button = dropArea.querySelector("button"),
	input = dropArea.querySelector("input"),
	closeBtn = dropArea.querySelector(".close-btn");
var imgfile = null;
var form = document.querySelector("form.addService");
var submitForm = form.querySelector(".add-service-btn");
var inps = form.querySelectorAll("input, select");

submitForm.addEventListener("click", addService)

button.onclick = () => {
	input.click();
};

input.addEventListener("change", function () {
	imgfile = this.files[0];
	dropArea.classList.add("active");
	showFile();
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
	event.preventDefault();
	dropArea.classList.add("active");
	dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
	dropArea.classList.remove("active");
	dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
	event.preventDefault();
	imgfile = event.dataTransfer.files[0];
	showFile();
});

closeBtn.addEventListener("click",()=>{
	var img = dropArea.querySelector("img");
	img.remove();
	dropArea.classList.remove("active");
	closeBtn.classList.toggle("hide");
	imgfile = null;
})

function showFile() {
	let fileType = imgfile.type;
	let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
	if (validExtensions.includes(fileType)) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			let fileURL = fileReader.result;
			let imgTag = document.createElement("img");
			imgTag.src = fileURL;
			dropArea.appendChild(imgTag);
			closeBtn.classList.toggle("hide");
		};
		fileReader.readAsDataURL(imgfile);
	} else {
		alert("This is not an Image File!");
		dropArea.classList.remove("active");
		dragText.textContent = "Drag & Drop to Upload File";
	}
}

// ------------------------------------------Form Inc Dec Buttons---------------------------------------------

document.querySelectorAll(".increase").forEach(b=>{
    b.addEventListener("click", increase);
})
document.querySelectorAll(".decrease").forEach(b=>{
    b.addEventListener("click", decrease);
})


function increase(e) {
    var inp = e.target.parentElement.querySelector("input")
    inp.value = Number(inp.value)+ Number(inp.step);
}
function decrease(e) {
    var inp = e.target.parentElement.querySelector("input")
    inp.value -= inp.step;
}

// ------------------------------------------Form Fetch Categories---------------------------------------------
var categoryDropDown = form.querySelector(".category-dropdown");
addCategroies();

async function addCategroies(){
	var response = await fetch(categoriesUrl);
	if (response.status == 200) {
		var { data } = await response.json();
		data.forEach((c)=>{
			var option = document.createElement("OPTION");
			option.innerHTML = c.name;
			option.value = c._id;
			categoryDropDown.appendChild(option);
		})
	} else {
		var error = await response.json();
		console.error(error);
	}
}

// ------------------------------------------Submiting Response---------------------------------------------

async function addService(e){
	e.preventDefault();
	if (imgfile == null) {
		// FIXME:show err
		console.error("Add Image man");
		return;
	}
	var image = dropArea.querySelector("img").src;
	var name = inps[0].value;
	var category = inps[1].value;
	var duration = inps[2].value;
	var cost = inps[3].value;
	var bodyData = { name, category, duration, cost, image };
	await sendReq(bodyData, "/api/service");
}


async function sendReq(bodyData, url){	
	var opts = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyData),
	};
	var respose = await fetch(url, opts);

	if (respose.status == 201) {
		var data = await respose.json();
		console.log(data)
	} else {
		var error = await respose.json();
		console.log(error);
		// errorText.classList.remove("hide");
		// errorText.innerHTML = error;
	}
}
