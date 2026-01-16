javascript:(()=>{

function simulateInput(input,value){
    if(!input)return;
    input.focus();
    input.value="";
    for(const char of value){
        const keyCode=char.charCodeAt(0);
        input.dispatchEvent(new KeyboardEvent("keydown",{key:char,keyCode,which:keyCode,bubbles:true}));
        input.value+=char;
        input.dispatchEvent(new KeyboardEvent("keyup",{key:char,keyCode,which:keyCode,bubbles:true}));
        input.dispatchEvent(new Event("input",{bubbles:true}));
    }
    input.dispatchEvent(new Event("change",{bubbles:true}));
}

function autoSearch(duration=30){

    let temp=prompt("Enter Start Hour (0-23):","0");
    const hours=Number(temp);

    temp=prompt("Enter Start Minute (0-59):","0");
    const minutes=Number(temp);

    const now=new Date();
    const year=now.getFullYear();

    const dtStartTime=new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
    );

    const dtEndTime=new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes+duration,
        0
    );

    const searchBar=document.querySelector(".scc-searchBar");
    if(!searchBar){
        alert("Search bar not found");
        return;
    }

    const listSearch=searchBar.querySelectorAll(":scope > div");
    const searchDate=listSearch[0].querySelectorAll(":scope > div.scc-searchBar");

    const searchStartDate=searchDate[0]
        .querySelector(":scope > div > div > div > div > div > div > div > div")
        .textContent.replace(year,"").trim();

    const searchEndDate=searchDate[2]
        .querySelector(":scope > div > div > div > div > div > div > div > div")
        .textContent.replace(year,"").trim();

    const searchStartTimeInput=searchDate[0]
        .querySelector(":scope > div:nth-child(2) > div > div > div > input");

    const searchEndTimeInput=searchDate[2]
        .querySelector(":scope > div:nth-child(2) > div > div > div > input");

    simulateInput(
        searchStartTimeInput,
        dtStartTime.toLocaleString("en-GB",{hour:"2-digit",minute:"2-digit"})
    );

    simulateInput(
        searchEndTimeInput,
        dtEndTime.toLocaleString("en-GB",{hour:"2-digit",minute:"2-digit"})
    );

    const searchType=listSearch[1]
        .querySelectorAll(":scope > div")[2]
        .querySelector(":scope > div > div > div > div > div:nth-child(2) > div > span > div > div > div")
        .textContent.trim();

    const searchNameInput=listSearch[1]
        .querySelectorAll(":scope > div")[3]
        .querySelector(":scope > div > div > div > div > input");

    let titleSearchName=`${searchStartDate} - ${searchEndDate} ${searchType}`;
    titleSearchName+=` ${String(dtStartTime.getHours()).padStart(2,"0")}${String(dtStartTime.getMinutes()).padStart(2,"0")}`;
    titleSearchName+=`-${String(dtEndTime.getHours()).padStart(2,"0")}${String(dtEndTime.getMinutes()).padStart(2,"0")}`;

    simulateInput(searchNameInput,titleSearchName);
}

autoSearch();

})();
