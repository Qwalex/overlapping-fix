const img: HTMLElement = document.querySelector('.img');
const imgClientRect = img.getBoundingClientRect();
const rad = 50;
let nearPositions = [];

img.addEventListener('mousemove', (e: MouseEvent) => {
    const availablePosition = checkPositionForComment(e)
    console.log(availablePosition);
    if (!availablePosition) {
        document.body.classList.add('can-not-add');
    } else {
        document.body.classList.remove('can-not-add');
    }
});

img.addEventListener('click', (e: MouseEvent) => {
    const availablePosition = checkPositionForComment(e)
    
    if (!availablePosition) {
        return false;
    }

    createCircle(availablePosition[0]);
});

const checkPositionForComment = (e) => {
    let [offsetX, offsetY] = getOffsetByImage(e);
    let canAdd = true;

    nearPositions = [];

    const eventData = {
        centerX: offsetX,
        centerY: offsetY,
        rad,
    };

    getAllCircles().forEach((circle) => {
        const distance = getDistance(circle, eventData);
        console.log(distance)

        if (distance < 0) {
            const angle = getAngle(circle, eventData);
            nearPositions.push(getShiftCoords([offsetX, offsetY], angle, Math.abs(distance)));
            canAdd = false;
        }
    });

    if (!canAdd) {
        const availablePosition = getAvailablePosition();
        return availablePosition.length > 0 ? availablePosition : false;
    }

    return [[offsetX, offsetY]];
}

const getCircle = (el) => {
    const {
        left,
        right,
        top,
        bottom,
        width,
        height,
    } = el.getBoundingClientRect();
    const rad = width / 2;

    return {
        el,
        top: top - imgClientRect.top - 1,
        right,
        bottom,
        left: left - imgClientRect.left - 1,
        width,
        height,
        rad,
        centerX: (left - imgClientRect.left - 1) + rad,
        centerY: (top - imgClientRect.top - 1) + rad
    };
}

const getDistance = (circle1, circle2) => {
    if (circle1.el === circle2.el) {
        return 0;
    }

    const {
        centerX: x1,
        centerY: y1,
    } = circle1;

    const {
        centerX: x2,
        centerY: y2,
    } = circle2;

    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) - (rad * 2)
}

const getAngle = (circle1, circle2) => {
    const {
        centerX: x1,
        centerY: y1,
    } = circle1;

    const {
        centerX: x2,
        centerY: y2,
    } = circle2;

    return radiansToDegrees(Math.atan2(y2 - y1, x2 - x1));
}

const getAllCircles = () => {
    return [...document.querySelectorAll('.js-circle')].map(el => getCircle(el));
}

const createCircle = ([offsetX, offsetY]):HTMLElement => {
    const el = document.createElement('div');
    el.classList.add('circle', 'js-circle');
    el.style.left = `${offsetX}px`;
    el.style.top = `${offsetY}px`;
    img.appendChild(el);
    return el;
}

const getOffsetByImage = (e) => {
    return [e.clientX - imgClientRect.left, e.clientY - imgClientRect.top];
}

const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI);
}

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

const getShiftCoords = ([x, y], angle, distance) => {
    const additionalOffset = 1;
    return [x + (distance + additionalOffset) * Math.cos(degreesToRadians(angle)), y + (distance + additionalOffset) * Math.sin(degreesToRadians(angle))];
}

const shiftItem = (el) => {
    const shiftCircle = getCircle(el);
    let allCircles = getAllCircles().map((circle) => ({
        ...circle, 
        distance: getDistance(circle, shiftCircle)
    }))
    .filter((circle) => circle.distance < 0)
    .sort((a, b) => a.distance - b.distance);

    allCircles.forEach((circle) => {
        if (circle.el === shiftCircle.el) {
            return;
        }

        const distance = getDistance(circle, shiftCircle);

        if (distance < 0) {
            const angle = getAngle(circle, shiftCircle);
            const [x, y] = getShiftCoords([shiftCircle.centerX, shiftCircle.centerY], angle, Math.abs(distance));
            shiftCircle.el.style.left = `${x}px`
            shiftCircle.el.style.top = `${y}px`
        }
    });
}

const getAvailablePosition = () => {
    return nearPositions.filter(([centerX, centerY]) => {
        const hasIntersections = [];

        getAllCircles().forEach((circle) => {
            const distance = getDistance(circle, {centerX, centerY, rad});
            
            if (distance < 0) {
                hasIntersections.push(true);
            }
        });

        return hasIntersections.length === 0;
    });
}

// window.setRandomCircle = () => {
//     createCircle([Math.random() * 500, Math.random() * 500]);
// }

// for (let i = 0; i < 50; i ++) {
//     setRandomCircle();
// }