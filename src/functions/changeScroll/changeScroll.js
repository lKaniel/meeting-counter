let scrollable = true;
let scrollWidth = 0;
let prevString = "";
const changeScrolling = (string) => {
    if (string === prevString) return;
    prevString = string;
    if (scrollable) {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";

        let div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        document.body.append(div);
        scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        document.getElementsByClassName("layout")[0].style.paddingRight = `${scrollWidth}px`;
        document.getElementById("search").style.marginRight = `${scrollWidth}px`;
        scrollable = false;
    } else {
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        document.getElementsByClassName("layout")[0].style.paddingRight = `0px`;
        document.getElementById("search").style.marginRight = "0px";
        scrollable = true;
    }
}

const getScrollWidth = ()=>{
    return scrollWidth;
}

export default changeScrolling;
export {getScrollWidth};