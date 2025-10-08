export function backtotop() {
  window.scroll(0, 0);
}

export function submitsignup() {
  var username = document.querySelector("#s-username").value;
  var password = document.querySelector("#s-password").value;
  var email = document.querySelector("#s-email").value;
  var phone = document.querySelector("#s-phone").value;
  var usererror = document.querySelector(".s-user-error");
  var passerror = document.querySelector(".s-pass-error");
  var emailerror = document.querySelector(".s-email-error");
  var phoneerror = document.querySelector(".s-phone-error");
  // var signupfrm = document.querySelector("#signupfrm");
  var isok = true;

  if (username == "") {
    usererror.innerHTML = "نام کاربری اجباریست";
    isok = false;
  } else {
    usererror.innerHTML = "";
    isok = true;
  }
  if (password == "") {
    passerror.innerHTML = "گذرواژه اجباریست";
    isok = false;
  } else {
    passerror.innerHTML = "";
    isok = true;
    if (password.length < 4) {
      passerror.innerHTML = "گذرواژه باید بیشتر از 4 کاراکتر باشد";
      isok = false;
    } else {
      passerror.innerHTML = "";
      isok = true;
    }
  }
  if (email == "") {
    emailerror.innerHTML = "ایمیل اجباریست";
    isok = false;
  } else {
    emailerror.innerHTML = "";
    isok = true;
    var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (reg.test(email) == false) {
      emailerror.innerHTML = "ایمیل معتبر نیست";
      isok = false;
    } else {
      emailerror.innerHTML = "";
      isok = true;
    }
  }
  if (phone == "") {
    phoneerror.innerHTML = "تلفن اجباریست";
    isok = false;
  } else {
    phoneerror.innerHTML = "";
    isok = true;
    if (isNaN(phone)) {
      phoneerror.innerHTML = "تلفن باید عدد باشد";
      isok = false;
    } else {
      phoneerror.innerHTML = "";
      isok = true;
    }
    if (phone.length > 11 || phone.length < 11) {
      phoneerror.innerHTML = "تلفن باید 11 کاراکتر باشد";
      isok = false;
    } else {
      phoneerror.innerHTML = "";
      isok = true;
    }
  }
  if (isok) {
    return true;
  }
}
export function submitlogin() {
  var username = document.querySelector("#username").value;
  var password = document.querySelector("#password").value;
  var usererror = document.querySelector(".user-error");
  var passerror = document.querySelector(".pass-error");
  // var loginfrm = document.querySelector("#loginfrm");
  var isok = true;
  if (username == "") {
    usererror.innerHTML = "نام کاربری اجباریست";
    isok = false;
  } else {
    usererror.innerHTML = "";
    isok = true;
  }
  if (password == "") {
    passerror.innerHTML = "گذرواژه اجباریست";
    isok = false;
  } else {
    passerror.innerHTML = "";
    isok = true;
    if (password.length < 4) {
      passerror.innerHTML = "گذرواژه باید بیشتر از 4 کاراکتر باشد";
      isok = false;
    } else {
      passerror.innerHTML = "";
      isok = true;
    }
  }
  if (isok == true) {
    return isok;
  }
}

export function gotosignup() {
  var signupfrm = document.querySelector("#signupfrm");
  var loginfrm = document.querySelector("#loginfrm");
  var loginimg = document.querySelector(".login-img img");
  signupfrm.style.display = "flex";
  loginfrm.style.display = "none";
  loginimg.setAttribute("src", "./images/signup.jpg");
}

export function gotologin() {
  var signupfrm = document.querySelector("#signupfrm");
  var loginfrm = document.querySelector("#loginfrm");
  var loginimg = document.querySelector(".login-img img");
  signupfrm.style.display = "none";
  loginfrm.style.display = "flex";
  loginimg.setAttribute("src", "./images/login-illustration.jpg");
}

export function seprate(number) {
  return Intl.NumberFormat().format(number);
}

export function uniqid() {
  const timestamp = Date.now().toString();
  const shortTime = timestamp.slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return Number(shortTime + random);
}
