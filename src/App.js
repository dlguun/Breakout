import { useEffect, useRef, useState } from "react";

const Breakout = () => {
    const [ score, setScore ] = useState(0);
    const [ isOver, setIsOver ] = useState(false);
    const [ ball, setBall ] = useState({ top: 546, left: 290 });
    const ballRef = useRef(null);
    const [ board, setBoard ] = useState(230);
    const [ anger, setAnger ] = useState(90);
    const [ direction, setDirection ] = useState('up');
    const [ cursor, setCursor ] = useState(null);
    const [ lifes, setLifes ] = useState(Array(0).fill(1));
    const [ bricks, setBricks ] = useState(Array(40).fill(3));
    const [ count, setCount ] = useState(0);
    
    const logic = () => {
        if(!count){
            setCount(1);
            console.log(ballRef);
            console.log('BRICKS');
            console.log(ballRef.current.previousSibling.childNodes);
        };
        const tempBall = {
            left: ballRef.current.offsetLeft,
            top: ballRef.current.offsetTop,
            width: ballRef.current.offsetWidth,
            height: ballRef.current.offsetHeight,
        };
        const tempBoard = {
            left: ballRef.current.nextSibling.offsetLeft,
            top: ballRef.current.nextSibling.offsetTop,
            width: ballRef.current.nextSibling.offsetWidth,
            height: ballRef.current.nextSibling.offsetHeight,
        };
        const tempParent = {
            width: ballRef.current.offsetParent.offsetWidth,
            height: ballRef.current.offsetParent.offsetHeight,
        };
        const tempBricks = Array.from(ballRef.current.previousSibling.childNodes).map((item, index) => {
            return {
                level: item.dataset.level,
                width: item.offsetWidth,
                height: item.offsetHeight,
                top: item.offsetTop,
                left: item.offsetLeft,
            };
        }).filter(item => item.level);
        // if(!count) console.log(tempBricks);
        
        
        // Taaz
        if(tempBall.top <= 0){
            return setDirection('down');
        };
        
        // Brick's bottom
        const tempBrick1 = tempBricks.findIndex(item => {
            return ( tempBall.top <= item.top + item.height
                && (tempBall.left >= item.left || tempBall.left + tempBall.width / 2 >= item.left) 
                && (tempBall.left + tempBall.width <= item.left + item.width || tempBall.left + tempBall.width * 1.5 <= item.left + item.width)
            ); 
        });
        if(tempBrick1 !== -1){
            console.log('Brick door buuw');
            console.log(tempBrick1);
            console.log(direction);
            setBricks(old => {
                const update = old.slice();
                update[tempBrick1] --;
                return update;
            });
            setScore(old => old + 1);
            return setDirection('down');
        };
        // Brick's top
        const tempBrick2 = tempBricks.findIndex(item => {
            return ( item.level && tempBall.top + tempBall.height <= item.top
                && (tempBall.left >= item.left || tempBall.left + tempBall.width / 2 >= item.left) 
                && (tempBall.left + tempBall.width <= item.left + item.width || tempBall.left + tempBall.width * 1.5 <= item.left + item.width) 
            );
        });
        if(tempBrick2 !== -1){
            console.log('Brick deer buuw');
            console.log(tempBrick2);
            console.log(direction);
            setBricks(old => {
                const update = old.slice();
                update[tempBrick2] --;
                return update;
            });
            setScore(old => old + 1);
            return setDirection('up');
        };
        // Brick's left
        const tempBrick3 = tempBricks.findIndex(item => {
            return ( item.level && tempBall.left <= item.left + item.width
                && (tempBall.top <= item.top && tempBall.top + tempBall.height <= item.top + item.height)
            );
        });
        if(tempBrick3 !== -1){
            console.log('Brick zuun tald buuw');
            console.log(tempBrick3);
            console.log(direction);
            setBricks(old => {
                const update = old.slice();
                update[tempBrick3] --;
                return update;
            });
            setScore(old => old + 1);
            return setAnger(old => 180 - old);
        };
        // Brick's right
        const tempBrick4 = tempBricks.findIndex(item => {
            return ( item.level && tempBall.left + tempBall.width <= item.left
                && (tempBall.top <= item.top && tempBall.top + tempBall.height <= item.top + item.height)
            );
        });
        if(tempBrick4 !== -1){
            console.log('Brick zuun tald buuw');
            console.log(tempBrick4);
            console.log(direction);
            setBricks(old => {
                const update = old.slice();
                update[tempBrick4] --;
                return update;
            });
            setScore(old => old + 1);
            return setAnger(old => 180 - old);
        };

        
        // Hawtangiin hajuud
        if((tempBall.top > tempParent.height - tempBall.height - tempBoard.height - 4)
            && (tempBall.left + tempBall.width === tempBoard.left || tempBall.left === tempBoard.left + tempBoard.width)
        ){
            // console.log('HAWTANgiin hajuud buuw');
            return setAnger(old => 180 - old);
        };
        // Hawtan deer
        if((tempBall.top + tempBall.height >= tempBoard.top)
            && (tempBall.left > tempBoard.left || tempBall.left + tempBall.width > tempBoard.left)
            && (tempBall.left < tempBoard.left + tempBoard.width)
        ){
            const temp = Math.abs(tempBall.left - tempBoard.left);
            // console.log('HAWTAN dr buuw');
            // console.log(temp);
            // console.log(tempBoard.width / 2);
            if(temp < tempBoard.width / 2){
                setAnger(old => {
                    let update = old;
                    let temp2 = (tempBoard.width / 2 - temp) * 90 / (tempBoard.width / 2);
                    if(old <= 90){
                        update -= temp2;
                    } else {
                        update += temp2;
                    };
                    return update;
                });
            } else if(temp > tempBoard.width / 2){
                setAnger(old => {
                    let update = old;
                    let temp2 = (tempBoard.width - temp) * 90 / tempBoard.width;
                    if(old <= 90){
                        update += temp2;
                    } else {
                        update -= temp2;
                    };
                    return update;
                });
            };
            return setDirection('up');
        };
        // Uheh
        if(tempBall.top + 3 > tempParent.height - tempBall.height / 2 - tempBoard.height){
            if(!lifes.length) return setIsOver(true);
            return setLifes(old => {
                const update = old.slice();
                update.pop();
                return update;
            });
        };
        // Hana
        if(tempBall.left <= 0 || tempBall.left >= tempParent.width - tempBall.width){
            return setAnger(old => 180 - old);
        };
    };

    const moveBall = () => {
        if(direction === 'up'){
            if(anger < 90) {
                setBall(old => {
                    const update = {...old};
                    update.top --;
                    update.left -= (90 - anger) / 90;
                    return update;
                });
            } else if(anger === 90) {
                setBall(old => {
                    const update = {...old};
                    update.top --;
                    return update;
                });
            } else {
                setBall(old => {
                    const update = {...old};
                    update.top --;
                    update.left += (anger - 90) / 90;
                    return update;
                });
            };
        } else {
            if(anger < 90) {
                setBall(old => {
                    const update = {...old};
                    update.top ++;
                    update.left -= (90 - anger) / 90;
                    return update;
                });
            } else if(anger === 90) {
                setBall(old => {
                    const update = {...old};
                    update.top ++;
                    return update;
                });
            } else {
                setBall(old => {
                    const update = {...old};
                    update.top ++;
                    update.left += (anger - 90) / 90;
                    return update;
                });
            };
        };
        logic();
    };

    const tryAgain = () => {
        setBall({ top: 96.5, left: 54 });
        setBoard(230);
        setAnger(90);
        setDirection('up');
    };

    const restart = () => {
        setScore(0);
        setIsOver(false);
        setLifes(Array(4).fill(1));
        setBricks(Array(40).fill(3));
    };

    useEffect(() => {
        tryAgain();
    }, [lifes]);

    useEffect(() => {
        const moveBoard = (e) => {
            setCursor(e.screenX);
            if(cursor) {
                const temp = e.screenX - cursor;
                if(board + temp < 0 || board + temp > 447) return;
                setBoard(board + temp);
            };
        };  
        if(!isOver){
            document.addEventListener('mousemove', moveBoard );

            return () => {
                document.removeEventListener('mousemove', moveBoard );
            };
        };
    }, [isOver, board, cursor]);

    useEffect(() => {  
        if(!isOver){
            const interval = setInterval(moveBall, 10);
            // const timeout = setTimeout(moveBall, 10);
            return () => {
                clearInterval(interval);
                // clearTimeout(timeout);
            };
        };
    });

    return (
        <div className='w-screen h-screen flex items-center text-white' style={{ backgroundColor: '#263445', cursor: `${ !isOver ? 'none' : 'default' }` }}>
            <div className='relative mx-auto my-auto flex flex-col border-2 border-white' style={{ minWidth: '600px', minHeight: '600px'}}>
                <header className='px-2 py-4 w-full flex'>
                    <span className='flex-1'>Score: { score }</span>
                    <div className='flex gap-2'>{ lifes.map((item, index) => <div key={ index } className='w-6 h-3 bg-red-500 rounded-sm'></div>) }</div>
                </header>
                <div className='absolute top-40 left-0 w-full grid grid-cols-8 grid-rows-5'>
                    { bricks.map((item, index) => {
                        if(item === 3) return <div key={ index } data-level={ item } className='w-1/8 h-6 border border-white' style={{ backgroundColor: '#48ac8b' }}></div>
                        if(item === 2) return <div key={ index } data-level={ item } className='w-1/8 h-6 border border-white' style={{ backgroundColor: '#276f6a' }}></div>
                        if(item === 1) return <div key={ index } data-level={ item } className='w-1/8 h-6 border border-white' style={{ backgroundColor: '#275b5f' }}></div>
                        return <div key={ index } data-level={ item } className='w-1/8 h-6 border border-transparent'></div>
                    }) }
                </div>
                <div ref={ ballRef } className='absolute rounded-full bg-red-500' style={{ width: '5%', height: '5%', top: `calc(${ ball.top }% - 5%)`, left: `calc(${ ball.left }% - 5%)` }}></div>
                <div className='absolute bottom-0 w-1/4 h-5' style={{ backgroundColor: '#2c8bd5', left: `${ board }px` }}></div>
                { isOver && <button onClick={ restart } className='absolute top-2 left-60 z-2 px-4 py-2 border-2 border-white focus:outline-none' style={{ backgroundColor: '#263445' }}>Game Over!</button> }
            </div>
        </div>
    );
};

export default Breakout;