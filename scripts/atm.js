if(localStorage.getItem('user')==null){
    window.open("/","_self"); //take to home page
}

let transactions = [];
let userID = parseInt(localStorage.getItem('user'));
let username = localStorage.getItem('users').split(',')[userID];
document.getElementById('username').innerText = 'Username: '+username;
let userAccount = {};
console.log('Username: '+username+'\nID: '+userID);

if(localStorage.getItem('user').length==0){ //no one is logged in
    window.open("/","_self");
}

function deposit(){
    const value = Math.abs(parseFloat(document.getElementById('deposit').value));
    userAccount.balance+=value;
    userAccount.transactions+=',+'+value.toString();
    userAccount.timestamps+=','+timestamp();
    commit();
}
function withdraw(){
    const value = Math.abs(parseFloat(document.getElementById('withdraw').value));
    if(userAccount.balance<value){
        console.log('Not enough funds');
        return;
    }
    userAccount.balance-=value;
    userAccount.transactions+=',-'+value.toString();
    userAccount.timestamps+=','+timestamp();
    commit();
}

function commit(){ //save state changes to local DB
    document.getElementById('balance').innerText = 'Balance: '+userAccount.balance;
    transactions[userID] = userAccount;
    localStorage.setItem('transactions',JSON.stringify(transactions));
    updateTables();
    console.log(userAccount);
}

function timestamp(){
    let time = new Date();
    return time.getDate()+'/'+time.getMonth()+'/'+time.getFullYear()+'-'+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
}

function logout(){
    userAccount.logouts = userAccount.logouts+','+timestamp();
    commit();
    window.open("/","_self");
    localStorage.setItem('user','')
    localStorage.setItem('loginFlag','1');
}

function logsTable(){//maps timestamps to html row elements
    let logins = userAccount.logins.split(',');
    let logouts = userAccount.logouts.split(',');
    logins.shift();logouts.push(logouts.shift());
    let html = "";
    for (let i = 0; i < logins.length; i++) {
        html+='<tr><td>'+logins[i]+'</td>'+'<td>'+logouts[i]+'</td></tr>';
    }
    document.getElementById('loginTable').innerHTML=html;
}
function transactionsTable(){
    let transactions = userAccount.transactions.split(',');
    let timestamps = userAccount.timestamps.split(',');
    transactions.shift();timestamps.shift();
    let html = "";
    let left,right;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].indexOf('+')>=0) {//check if deposit
            left=transactions[i].slice(1);
            right=''
        }else{
            right=transactions[i].slice(1);
            left='';
        }
        html+='<tr><td>'+left+'</td>'+'<td>'+right+'</td>'+'<td>'+timestamps[i]+'</td></tr>';
    }
    document.getElementById('transactionTable').innerHTML=html;
}
function updateTables(){
    logsTable();
    transactionsTable();
}
if (localStorage.getItem("transactions")==null){ //initialize transactions if empty
    transactions.push(
        {
            username: "jane Doe",

            balance:"890",
            logins:timestamp(),
            logouts:"",
            transactions:"+1000,-30,-180,+20",
            timestamps:""
        }
    );
    localStorage.setItem('transactions',JSON.stringify(transactions));
}
transactions = JSON.parse(localStorage.getItem("transactions"));
if(transactions.length-1 < userID){ //if user doesn't exist add user object
    console.log("Initializing new user...");
    transactions.push(
        {
            username: username,
            balance:0,
            logins:'',
            logouts:"",
            transactions:"",
            timestamps:""
        }
    );
}
userAccount = transactions[userID];
//update login timestamps
if(parseInt(localStorage.getItem('loginFlag'))){
    userAccount.logins = userAccount.logins+','+timestamp();
    localStorage.setItem('loginFlag','0');
}
commit();