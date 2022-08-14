(()=>{

    let yOffset = 0; // window.pageYOffset
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scrollScene)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
            values: {
                videoImagesCount: 300,
                imageSequence: [0, 299],
                messageA_opacity_in: [0, 1, {start:0.1, end: 0.2}],
                messageA_tranlateY_in: [20, 0, {start:0.1, end: 0.2}],
                messageA_tranlateY_out: [0, -20, {start:0.25, end: 0.3}],
                messageA_opacity_out: [1, 0, {start:0.25, end: 0.3}],

                messageB_opacity_in: [0, 1, {start:0.3, end: 0.4}],
                messageB_tranlateY_in: [20, 0, {start:0.3, end: 0.4}],
                messageB_tranlateY_out: [0, -20, {start:0.45, end: 0.5}],
                messageB_opacity_out: [1, 0, {start:0.45, end: 0.5}],

                messageC_opacity_in: [0, 1, {start:0.5, end: 0.6}],
                messageC_tranlateY_in: [20, 0, {start:0.5, end: 0.6}],
                messageC_tranlateY_out: [0, -20, {start:0.65, end: 0.7}],
                messageC_opacity_out: [1, 0, {start:0.65, end: 0.7}],

                messageD_opacity_in: [0, 1, {start:0.7, end: 0.8}],
                messageD_tranlateY_in: [20, 0, {start:0.7, end: 0.8}],
                messageD_tranlateY_out: [0, -20, {start:0.85, end: 0.9}],
                messageD_opacity_out: [1, 0, {start:0.85, end: 0.9}],
            }
        },
        {
            // 1
            type: 'normal',
            // heightNum: 5, // normaltype에서는 필요 x
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            }
        },
        {
            // 2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
			},
			values: {
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
				messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
				messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
				pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
			},
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
				container: document.querySelector('#scroll-section-3'),
            }
        },
    ];

    function setCanasImages() {
        let imgElem;
        for (let i =0; i < sceneInfo[0].values.videoImagesCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem)
        }
        console.log(sceneInfo[0].objs.videoImages);
    }
    setCanasImages()

    function calcValues(values, currentYOffset) {
        let rv;
        //현재 인덱스의 씬의 스크롤높이 나누기 현재 스크롤된 만큼을 나누어 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        //(values[1] - values[0]) = 총 범위를 구하고 + values[0] 초기값을 더해주어 scrollRatio(0-1까지의 씬에서의 비율)을 곱하여 전체에서의 현재 퍼센트를 도출
        
        if( values.length === 3 ){
            //start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd-partScrollStart;
            if( partScrollStart <= currentYOffset && currentYOffset <= partScrollEnd ){
                rv = ( currentYOffset - partScrollStart ) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if( currentYOffset < partScrollStart ) {
                rv= values[0];
            } else if( currentYOffset > partScrollEnd ) {
                rv= values[1];
            }
        } else{
            rv = scrollRatio * ( values[1] - values[0] ) + values[0]
        }
        
        return rv;
    }

    function playAnimaction() {
        const objs = sceneInfo[currentScene].objs
        const values = sceneInfo[currentScene].values;
        // currentYOffset = 현재씬에서의 내가 보고있는 곳의 높이
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        // scrollRatio = 현재씬에서의 내가 보고있는 곳의 높이의 비율
        const scrollRatio = currentYOffset / scrollHeight

        switch (currentScene){
            case 0:
                // console.log('0 play')

                if( scrollRatio <= 0.22 ){
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_tranlateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_tranlateY_out, currentYOffset)}%)`;
                }
                if( scrollRatio <= 0.42 ){
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translateY(${calcValues(values.messageB_tranlateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translateY(${calcValues(values.messageB_tranlateY_out, currentYOffset)}%)`;
                }
                if( scrollRatio <= 0.62 ){
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_tranlateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translateY(${calcValues(values.messageC_tranlateY_out, currentYOffset)}%)`;
                }
                if( scrollRatio <= 0.82 ){
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageA_tranlateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translateY(${calcValues(values.messageD_tranlateY_out, currentYOffset)}%)`;
                }

                break;

            case 2:
                // console.log('2 play')

				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}

                break;
                
            case 3:
                // console.log('3 play')
                break;
                
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for ( let i = 0 ; i < sceneInfo.length ; i++ ){
            if( sceneInfo[i].type === 'sticky' ){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            }else if( sceneInfo[i].type === 'normal' ){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        
        //새로고침시 currentscene할당 및 body 태그 할당
        yOffset = window.pageYOffset
        let totalScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length ;i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`)
    };

    function scrollLoop(){
        enterNewScene = false
        prevScrollHeight = 0
        for(let i = 0; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene ++;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }
        if(yOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return;
            // 혹시 인덱스0보다 더 스크롤이 올라가서 생기는 오류를 방지
            currentScene --;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }
        if(enterNewScene) return;
        //씬이 바뀌는 순간에는 종료하여 playAnimaction()를 막아 순간적으로 -값이 되는 messageA_opacity_in 값 방지
        playAnimaction()
    }

    window.addEventListener('scroll', ()=>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    
    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);
        // 이미지 로드하기전에 실행하고 싶으면 load > DOMContentLoaded는 html객체의 dom만 로드되면 실행
})();
// (()=>{})() 즉시호출 함수 : 전역변수사용을 하지 않기위해사용(지역변수로 사용)