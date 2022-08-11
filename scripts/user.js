if (localStorage.getItem('password')==null || localStorage.getItem('users')==null){ //initialize local storage
    localStorage.setItem('password','');
    localStorage.setItem('users','');
}
function login() {
    let user = localStorage.getItem('users').split(',').indexOf(document.getElementById("username").value);//index of user in list
    if (user>0) {//if user exists
        if (localStorage.getItem('password').split(',')[user]==document.getElementById("pass").value) {//verify input password
            console.log("User VERIFIED");
            localStorage.setItem('user',user);
            window.open("/user.html","_self");
        }else{ //if password is wrong
            console.log("Wrong Password "+ document.getElementById("pass").value);
        }
    }else{ //if user doesn't exist
        console.log('NO such user '+document.getElementById("username").value);
    }
    localStorage.setItem('loginFlag','1');
}
function signUp() {
    localStorage.setItem('users', localStorage.getItem('users')+','+document.getElementById("userName").value);
    localStorage.setItem('password', localStorage.getItem('password')+','+document.getElementById("password").value);
}