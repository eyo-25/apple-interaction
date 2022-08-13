(()=>{

    let yOffset = 0; // window.pageYOffset
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scrollScene)

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
            },
            values: {
                messageA_opacity: [0, 1],

            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5,
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
            }
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

    function calcValues(values, currentYOffset) {
        let rv;
        //현재 씬에서 스크롤된 만큼을 비율로 구하기
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
        //(values[1] - values[0]) = 총 범위 에초기값을 더해주어 scrollRatio(0-1까지의 씬에서의 비율)을 곱한다.
        rv = scrollRatio * (values[1] - values[0]) + values[0]
        
        return rv;
    }

    function playAnimaction() {
        const objs = sceneInfo[currentScene].objs
        const values = sceneInfo[currentScene].values
        const currentYOffset = yOffset - prevScrollHeight
        switch (currentScene){
            case 0:
                // console.log('0 play')
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                break;

            case 1:
                // console.log('1 play')
                break;

            case 2:
                // console.log('2 play')
                break;
                
            case 3:
                // console.log('3 play')
                break;
                
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for ( let i = 0 ; i < sceneInfo.length ; i++ ){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
        prevScrollHeight = 0
        for(let i = 0; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene ++;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }
        if(yOffset < prevScrollHeight) {
            if(currentScene === 0) return;
            currentScene --;
            document.body.setAttribute('id', `show-scene-${currentScene}`)
        }

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