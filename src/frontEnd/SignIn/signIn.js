var signInForm = document.querySelector("form.signIn");
var signUpForm = document.querySelector("form.signUp");
var inputs = document.querySelectorAll("input");
var errorText = document.querySelector(".error-text");
var flipCardBtn = document.querySelectorAll(".flip-card-btn");

signInForm.addEventListener("submit", signIn);
signUpForm.addEventListener("submit", signUp);

flipCardBtn.forEach((fcb) => {
	fcb.addEventListener("click", () => {
		document.querySelector(".card").classList.toggle("flipped");
	});
});

inputs.forEach((inp) => {
	inp.addEventListener("keydown", hideErrors);
});

async function signUp(e){
	e.preventDefault();
	var name = inputs[2].value;
	var email = inputs[3].value;
	var password = inputs[4].value;
	var bodyData = { name, email, password };
	await sendReq(bodyData, "/api/signup", inputs[3]);
}

async function signIn(e) {
	e.preventDefault();
	var email = inputs[0].value;
	var password = inputs[1].value;
	var bodyData = { email, password };
	await sendReq(bodyData, "/api/signin", inputs[0]);
}

async function sendReq(bodyData, url, em){

	if (!isEmail(bodyData.email)) {
		em.nextElementSibling.classList.add("display");
		return;
	}
	
	var opts = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyData),
	};
	var respose = await fetch(url, opts);

	if (respose.status == 201) {
		var { token } = await respose.json();
		localStorage.setItem("token", token);
		console.log("navigating...")
		window.location.href = '/home';
	} else {
		var error = await respose.json();
		console.log(error);
		// errorText.classList.remove("hide");
		// errorText.innerHTML = error;
	}
}


function hideErrors(e) {
	e.target.nextElementSibling.classList.remove("display");
	if (!errorText.classList.contains("hide")) {
		errorText.classList.add("hide");
	}
}

function isEmail(email) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}
