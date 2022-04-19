const circle1 = document.getElementById('c1');
// const circle2 = document.getElementById('c2');
const img: HTMLElement = document.querySelector('.img');
const imgClientRect = img.getBoundingClientRect();

let lastCorrectPosition = [];
let circlePlaceholders = [];
const line: HTMLElement = document.querySelector('.line');

img.addEventListener('mousemove', (e: MouseEvent) => {
    let [offsetX, offsetY] = getOffsetByImage(e);

    if (circlePlaceholders.length > 0) {
        circlePlaceholders.forEach(circle => circle.remove());
        circlePlaceholders = [];
    }

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
            circle.el.classList.add('red');
            line.style.transform = `rotate(${angle}deg)`;
            line.style.width = `${Math.abs(distance)}px`;
        }
    });
});

img.addEventListener('click', (e: MouseEvent) => {
    const [offsetX, offsetY] = getOffsetByImage(e);
    const circle = createCircle([offsetX, offsetY]);
});

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
    return ['c1'].map((id) => getCircle(id));
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
    const newX = x * Math.cos(90 - angle) - y * Math.sin(90 - angle);
    const newY = x + Math.sin(90 - angle) + y * Math.cos(90 - angle);
    return [newX, newY];
}

console.group('distance');
//console.log(getDistance(getCircle('c1'), getCircle('c2')));
//console.log(getAngle(getCircle('c1'), getCircle('c2')))
console.groupEnd();

//console.log(getCircle('c1'));