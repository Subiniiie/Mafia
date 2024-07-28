import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import styles from './GLFooter.module.css';

const quotes = [
    { text: "우리는 결코 일본에 종속되지 않을 것이다.", author: "김구" },
    { text: "대한독립의 소리가 천국에 들려오면 나는 마땅히 춤추며 만세를 부를 것이다.", author: "안중근" },
    { text: "독립은 우리의 목표이자 의무다.", author: "안중근" },
    { text: "대한독립 만세!", author: "유관순" },
    { text: "독립은 인류의 공통된 권리이다.", author: "김좌진" },
    { text: "자유를 위해 싸우는 것이 우리의 사명이다.", author: "윤봉길" },
    { text: "자유와 독립은 피와 땀으로 쟁취해야 한다.", author: "안창호" },
    { text: "우리의 후손들에게 독립된 조국을 물려주자.", author: "여운형" },
    { text: "독립을 위한 희생은 결코 헛되지 않을 것이다.", author: "이봉창" },
    { text: "독립은 우리 민족의 자존심이다.", author: "신채호" },
    { text: "대한민국의 독립을 위하여!", author: "조소앙" },
    { text: "자유는 결코 공짜로 주어지지 않는다.", author: "이상재" },
    { text: "독립은 우리의 존재 이유다.", author: "김규식" },
    { text: "독립을 향한 우리의 의지는 굳건하다.", author: "박은식" },
    { text: "조국의 독립을 위해 모든 것을 바치자.", author: "김원봉" },
    { text: "독립 없는 번영은 없다.", author: "김성수" },
    { text: "독립은 우리의 권리이자 의무이다.", author: "조만식" },
    { text: "독립을 위해 목숨을 바치는 것이 진정한 애국이다.", author: "장준하" },
    { text: "독립된 조국에서의 삶을 꿈꾸며.", author: "김마리아" },
    { text: "독립은 모든 국민의 의지에서 시작된다.", author: "송진우" }
];

const GLFooter = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const textRef = useRef(null);
    const authorRef = useRef(null);

    useEffect(() => {
        const currentQuote = quotes[currentQuoteIndex];
        const textElement = textRef.current;
        const authorElement = authorRef.current;

        const quoteText = currentQuote.text;
        const authorText = `- ${currentQuote.author}`;

        // 초기화
        textElement.innerHTML = '';
        authorElement.innerHTML = '';

        // 텍스트 애니메이션
        anime({
            targets: textElement,
            opacity: [0, 1],
            duration: 2000,
            easing: 'linear',


            update: function (anim) {
                const progress = Math.round(anim.progress / 100 * quoteText.length);
                textElement.innerHTML = quoteText.substring(0, progress);
            },
            complete: function () {
                // 저자 애니메이션
                anime({
                    targets: authorElement,
                    opacity: [0, 1],
                    duration: 2000,
                    easing: 'linear',

                    update: function (anim) {
                        const progress = Math.round(anim.progress / 100 * authorText.length);
                        authorElement.innerHTML = authorText.substring(0, progress);
                    }
                });
            }
        });

    }, [currentQuoteIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 7000); // 7초 후에 다음 명언으로 넘어감
        return () => clearTimeout(timer);
    }, [currentQuoteIndex]);

    return (
        <footer className={styles.footer}>
            <p className={styles.quote} ref={textRef}></p>
            <p className={styles.author} ref={authorRef}></p>
        </footer>
    );
};

export default GLFooter;
