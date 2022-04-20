window.g = (() => {
    const circle1 = document.getElementById('c1');
    const circle2 = document.getElementById('c2');
    const circle3 = document.getElementById('c3');
    const img: HTMLElement = document.querySelector('.img');
    const imgClientRect = img.getBoundingClientRect();
    const rad = 51;
    
    let circlePlaceholders = [];
    let nearPositions = [];
    const line: HTMLElement = document.querySelector('.line');
    
    img.addEventListener('mousemove', (e: MouseEvent) => {
        const availablePosition = checkPosition(e)
        if (!availablePosition) {
            document.body.classList.add('can-not-add');
        } else {
            document.body.classList.remove('can-not-add');
        }
    });
    
    img.addEventListener('click', (e: MouseEvent) => {
        console.log('click')
        const availablePosition = checkPosition(e)
        console.log(availablePosition);
        
        if (!availablePosition) {
            return false;
        }

        console.log(availablePosition);

        createCircle(availablePosition[0]);
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
            rad,
        };
    
        getAllCircles().forEach((circle) => {
            circle.el.classList.remove('red');
    
            const distance = getDistance(circle, eventData);
    
            if (distance < 0) {
                const angle = getAngle(circle, eventData);
                circlePlaceholders.push(createCircle(getShiftCoords([offsetX, offsetY], angle, Math.abs(distance)), true));
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

        return [[offsetX, offsetY]];
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
        return [...document.querySelectorAll('.js-circle')].map(el => getCircle(el));
    }
    
    const createCircle = ([offsetX, offsetY], placeholder = false):HTMLElement => {
        console.log('createCircle');
        const el = document.createElement('div');
        el.classList.add('circle');
        if (!placeholder) {
            el.classList.add('js-circle');
        }
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
    
    const getShiftCoords = ([x, y], angle, distance):[number, number] => {
        const additionalOffset = 1;
        return [x + (distance + additionalOffset) * Math.cos(degreesToRadians(angle)), y + (distance + additionalOffset) * Math.sin(degreesToRadians(angle))];
    }
    
    const getAvailablePosition = () => {
        // console.clear();
        // console.log('++++++++++++++++');
        // console.group('getAvailablePosition');
        if (nearPositions.length === 0) {
            return true;
        }
    
        const result = nearPositions.filter(([centerX, centerY]) => {
            // console.log('-----------------');
            // console.log(`check positions ${centerX} ${centerY}`);
            const hasIntersections = [];
    
            getAllCircles().forEach((circle) => {
                // console.log('=================');
                // console.log({circle});

                const distance = getDistance(circle, {centerX, centerY, rad});
                // console.log(`distance: ${distance}`);
                // console.log(distance);
                
                if (distance < 0) {
                    // console.log(`distance incorrect`);
                    // console.log(`intersections push true`);
                    hasIntersections.push(true);
                }
                // console.log('=================');
            });
    
            // console.log(`hasIntersections: ${hasIntersections}`);
            // console.log(`return ${hasIntersections.length === 0}`)
            // console.log('-----------------');
            return hasIntersections.length === 0;
        });

        if (result.length === 0) {
            return console.log('empty result !!!!');
        }
        return result;
    }

    setRandomCircle = () => {
        createCircle([Math.random() * 500, Math.random() * 500]);
    }

    return {
        getDistance,
        getCircle,
        setRandomCircle,
    }
})();