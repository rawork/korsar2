const animateScroll = (element, duration) => {
    const start = element.scrollTop;
    const end = element.scrollHeight;
    const change = end - start;
    const increment = 20;

    function easeInOut(currentTime, start, change, duration) {
        // by Robert Penner
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    function animate(elapsedTime) {
        elapsedTime += increment;
        let position = easeInOut(elapsedTime, start, change, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
            setTimeout(function() {
                animate(elapsedTime);
            }, increment)
        }
    }

    animate(0);
};

// Here's our main callback function we passed to the observer
const scrollToBottom = (element, duration = 300) => animateScroll(element, duration);


export default scrollToBottom;