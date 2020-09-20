let canOpen = true;
let openedId = -1;

let setOpen = (isOpen)=>{
    canOpen = isOpen
}

let isOpen = ()=>{
    return canOpen
}

let setOpenedId = (id)=>{
    openedId = id
}

let getOpenedId = ()=>{
    return openedId;
}

export {setOpen, isOpen, setOpenedId, getOpenedId};