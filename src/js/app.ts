const circle1 = document.getElementById('c1');
const circle2 = document.getElementById('c2');
const circle3 = document.getElementById('c3');
const img: HTMLElement = document.querySelector('.img');
const imgClientRect = img.getBoundingClientRect();

let circlePlaceholders = [];
let nearPositions = [];
const line: HTMLElement = document.querySelector('.line');

img.addEventListener('mousemove', (e: MouseEvent) => {
    console.log(checkPosition(e)) //false|true|position
});

img.addEventListener('click', (e: MouseEvent) => {
    console.log(checkPosition(e)) //false|true|position
});

const checkPosition = (e: MouseEvent) => {
    let [offsetX, offsetY] = getOffsetByImage(e);
    let canAdd = true;

    if (circlePlaceholders.length > 0) {
        circlePlaceholders.forEach(circle => circle.remove());
        circlePlaceholders = [];
    }
    nearPositions = [];

    const eventData = {
        centerX: offsetX,
        centerY: offsetY,
        rad: 50
    };

    getAllCircles().forEach((circle) => {
        circle.el.classList.remove('red');

        const distance = getDistance(circle, eventData);

        if (distance < 0) {
            const angle = getAngle(circle, eventData);
            circlePlaceholders.push(createCircle(getShiftCoords([offsetX, offsetY], angle, Math.abs(distance))));
            nearPositions.push(getShiftCoords([offsetX, offsetY], angle, Math.abs(distance)));
            getShiftCoords([offsetX, offsetY], angle, Math.abs(distance));
            circle.el.classList.add('red');
            line.style.transform = `rotate(${angle}deg)`;
            line.style.width = `${Math.abs(distance)}px`;
            canAdd = false;
        }
    });

    if (!canAdd) {
        return getAvailablePosition();
    }
    return true;
}

interface circle {
    left: number,
    right: number,
    top: number,
    bottom: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    rad: number
}

const getCircle = (id: string) => {
    const el = document.getElementById(id);
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
    const {
        centerX: x1,
        centerY: y1,
        rad,
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
        rad,
    } = circle1;

    const {
        centerX: x2,
        centerY: y2,
    } = circle2;

    return radiansToDegrees(Math.atan2(y2 - y1, x2 - x1));
}

const getAngleCss = (circle1, circle2) => {
    return getAngle(circle1, circle2) - 180;
}

const getAllCircles = () => {
    return ['c1', 'c2', 'c3'].map((id) => getCircle(id));
}

const createCircle = ([offsetX, offsetY]):HTMLElement => {
    const el = document.createElement('div');
    el.classList.add('circle');
    el.style.left = `${offsetX}px`;
    el.style.top = `${offsetY}px`;
    img.appendChild(el);
    return el;
}

const getOffsetByImage = (e: MouseEvent) => {
    return [e.clientX - imgClientRect.left, e.clientY - imgClientRect.top];
}

const radiansToDegrees = (radians) => {
    return radians * (180/Math.PI);
}

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

const getShiftCoords = ([x, y], angle, distance) => {
    return [x + distance * Math.cos(degreesToRadians(angle)), y + distance * Math.sin(degreesToRadians(angle))];
}

const getAvailablePosition = () => {
    if (nearPositions.length === 0) {
        return true;
    }

    return nearPositions.filter(([centerX, centerY]) => {
        const hasIntersections = [];

        getAllCircles().forEach((circle) => {
            const distance = getDistance(circle, {centerX, centerY, rad: 50});
            console.log(distance);
            
            if (distance < 0) {
                hasIntersections.push(true);
            }
        });

        console.log(hasIntersections);

        return hasIntersections.length === 0;
    });
}