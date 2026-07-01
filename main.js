 
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 1000;
    canvas.height = 500;

    let stripeRunData, stripeJumpData, stripeGrassData, numberStripeData, menuStripeData
    let score = 0
    let frameDelay = 80; 
    let posX = 0
    let lastFrameTime = 0;
    let indexRun = 0
    let indexJump = 0 
    let grassSpeed = 7
    let grassX = 0 
    let obstacle = []
    let obstacleTimer = 0
    let obstacleInterval = 1500
    let state = "run"
    let posY = canvas.height 
    let velocityY = 0
    let gravity = 1
    let isJumping = false
    let buttonMenu = []
    let horseStripeImg  = new Image()
    let horseJumpStripeImg = new Image()
    let grassStripeImg = new Image()
    let numberStripeImg = new Image()
    let menuImg = new Image 
    horseStripeImg.crossOrigin = "anonymous"

    let runAudio = new Audio("./sound/grass.mp3")

    // Load Stripe Data 

    const loadSpriteSheetData = () => {
            // Load Run Stripe Data
            fetch("./asset/horse_Run.json")
                .then(res=>res.json())
                .then(res=>{
                    stripeRunData = res.frames 
                    console.log("Run Data :",stripeRunData)
                    loadRun() 
                })
                .catch(err=>{
                    console.log(err)
                })

            // Load Jump Stripe Data   
            fetch("./asset/horse_Jump.json")
                .then(res=>res.json())
                .then(res=>{
                    stripeJumpData = res.frames
                    console.log("Jump Data :", stripeJumpData)
                    document.addEventListener("keypress", (e)=>{
                        if(e.code === "Space" && !isJumping){
                            state = "jump"
                            isJumping = true
                            velocityY = -25
                            indexJump = 0

                        }
                    })
                    
                }).catch(err=>{
                    console.log(err)
                })

            // Load Grass Stripe Data
            fetch("./asset/grass_tile_data.json")
                .then(res=>res.json()) 
                .then(res=>{
                    stripeGrassData = res.frames
                    console.log("Grass Data :",stripeGrassData)
                })
            fetch("./asset/number.json")
            .then(res=>res.json())
            .then(res=>{
                numberStripeData = res.frames
            })   
            fetch("./asset/game_menu.json")
            .then(res=>res.json())
            .then(res=>{
                menuStripeData = res.frames
            })
                            
    }
    function gamMenu(){
        
        let startY =canvas.height/2 - 80;
        let gap = 10
        
        menuImg.src = "./asset/game_menu.png"
        menuImg.onload = ()=>{
            for(let i=0; i<menuStripeData.length; i++){
                const Menuframe = menuStripeData[i].frame 
                let x = canvas.width/2 - Menuframe.w/2
                let y = startY + i * (Menuframe.h + gap)
                ctx.drawImage(menuImg, Menuframe.x, Menuframe.y, Menuframe.w, Menuframe.h, x, y, Menuframe.w, Menuframe.h)
                buttonMenu.push({
                    x,
                    y,
                    width : Menuframe.w,
                    height : Menuframe.h,
                    index : i,
                })
            }
           
        }
        
    }
    function handleButton(index){
        if(index === 0){
            console.log("conti")
        }if(index === 1){
            console.log("quite")
        }if(index === 2){
            console.log("start")
            requestAnimationFrame(animation)
        }
    }
    canvas.addEventListener("click", (e)=>{
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.x
        const mouseY = e.clientY - rect.y
        buttonMenu.forEach(button=>{
            if(
                mouseX >= button.x &&
                mouseX <= button.x + button.width &&
                mouseY >= button.y &&
                mouseY <= button.y + button.height
            ){
                handleButton(button.index)
            }
        })
    })
    // Load Motion /
    function loadRun(){
        horseStripeImg.src = "./asset/horse_Run.png"
        horseJumpStripeImg.src = "./asset/horse_Jump.png"
        grassStripeImg.src = "./asset/grass_tile.png"
        numberStripeImg.src = "./asset/number.png"
        console.log(horseStripeImg)
        console.log(horseJumpStripeImg)
        horseStripeImg.onload = ()=>{
            horseJumpStripeImg.onload = gamMenu

        }
          
    }
   
    // Draw Motion 
    // function drawHorse(){
    //    
    //     setInterval(()=>{   
    //         ctx.clearRect(0, 0, canvas.width, canvas.height) 
    //         const frame = stripeRunData[indexRun+1].frame
    //         // console.log(frame) 
    //         // console.log(i)
    //         ctx.drawImage(horseStripeImg, frame.x, frame.y, frame.w, frame.h, posX, canvas.height/2 - frame.h/2, frame.w, frame.h)
    //         posX+=10
    //         if(posX>canvas.width){
    //             posX = -frame.w
    //         }
    //         indexRun++
    //         if(indexRun === stripeRunData.length-1){
    //             indexRun = 0
    //         }
            
    //     }, 70)
        
    // }
    // function horseJump (){
    //     if(!stripeJumpData) return
    //     setInterval(()=>{   
    //         
    //         // console.log(frame) 
    //         // console.log(i)
    //         ctx.drawImage(horseJumpStripeImg, frame.x, frame.y, frame.w, frame.h, posX, canvas.height/2 - frame.h/2, frame.w, frame.h)
    //         indexJump++
    //         if(indexJump === stripeJumpData.length-1){
    //             indexJump = 0
    //         }
            
    //     }, 70)
    // }
    function selectSpawnTime(){
        // const time = [2000, 5000, 500, 7000, 9000]
        // const randomNum = Math.floor(Math.random()*time.length)

        obstacleInterval = Math.random() * 2000 + 900
        
    }
    function spawnObstacle(){
        const frame = stripeGrassData[1].frame;
        obstacle.push({
            x: canvas.width,
            y: canvas.height-frame.h,
            w: frame.w,
            h: frame.h
        }
        )
    }
    function drawScore(){
        if(!numberStripeData) return
        let strScore = score.toString()
        let scoreX = 800
        let scorey = 50
        for(let i=0; i<strScore.length; i++){
            let digit = parseInt(strScore[i])
            let frame = numberStripeData[digit].frame
            ctx.drawImage(numberStripeImg, frame.x, frame.y, frame.w, frame.h, scoreX, scorey, frame.w, frame.h)
            scoreX += frame.w+2
        } 
        
    }
    setInterval(()=>{
         score += 1
    }, 1000)
    function animation(currentTime){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
       
        velocityY += gravity
        posY += velocityY
        let ground = canvas.height - stripeGrassData[0].frame.h

        obstacleTimer += 15

        if (obstacleTimer > obstacleInterval) {
            spawnObstacle()
            obstacleTimer = 0
            selectSpawnTime()
        }
        
        let horseFrame
        if(state==="run" && stripeGrassData){
            horseFrame = stripeRunData[indexRun].frame
           
        }
        if(state === "jump" && stripeJumpData){
             horseFrame = stripeJumpData[indexJump].frame
           
        }
        let horseRect={
            x:posX+15,
            y:posY-horseFrame.h+45,
            w:horseFrame.w - 30,
            h:horseFrame.h - 10

        }
        if(posY>=ground){
            posY = ground
            velocityY = 0
            isJumping = false
            state = "run"
        }
        if(currentTime - lastFrameTime > frameDelay){
             if(state === "run" && stripeRunData){
                indexRun++
                if(indexRun >= stripeRunData.length){
                    indexRun = 1
                }
            }

            if(state === "jump" && stripeJumpData){
                indexJump++
                if(indexJump >= stripeJumpData.length){
                    indexJump = stripeJumpData.length - 1
                }
            }
            
            lastFrameTime = currentTime
           
        }
        if(state==="run"){
            runAudio.play()
        }else{
            runAudio.pause()
        }
        
        if(state === "run" && stripeRunData){
                const frame = stripeRunData[indexRun].frame
                // ctx.strokeStyle = "red"
                // ctx.strokeRect(horseRect.x, horseRect.y, horseRect.w, horseRect.h)
                ctx.drawImage(horseStripeImg, frame.x, frame.y, frame.w, frame.h, posX, posY - frame.h+29, frame.w, frame.h)
               
                // posX+=4
                // if(posX>canvas.width){
                //     posX = -frame.w
                // }
        }
        if(state==="jump" && stripeJumpData){
                const frame = stripeJumpData[indexJump].frame
                ctx.drawImage(
                    horseJumpStripeImg,
                    frame.x, frame.y, frame.w, frame.h,
                    posX,
                    posY - frame.h+29,
                    frame.w, frame.h
                )

        }
        

        
        if(stripeGrassData){
            let randomNum = Math.random()
            const frame = stripeGrassData[0].frame
            grassX -= grassSpeed
            if(grassX <= -frame.w){
                grassX = 0
            }
            for(let i = 0; i<=canvas.width/frame.w+1; i++){
                ctx.drawImage(
                    grassStripeImg,
                    frame.x, 
                    frame.y,
                    frame.w,
                    frame.h,
                    grassX + i * frame.w,
                    canvas.height - frame.h,
                    frame.w,
                    frame.h
                )
            }          
            
        }
        if (stripeGrassData) {
            const obstacleFrame = stripeGrassData[1].frame

            for (let i = 0; i < obstacle.length; i++) {

                obstacle[i].x -= grassSpeed
                let obstacleRect = {
                    x:obstacle[i].x + 10,
                    y:obstacle[i].y + 10,
                    w:obstacle[i].w - 100,
                    h:obstacle[i].h - 30
                }
                // ctx.strokeStyle = "blue"
                // ctx.strokeRect(obstacleRect.x, obstacleRect.y, obstacleRect.w, obstacleRect.h)
                
                ctx.drawImage(
                    grassStripeImg,
                    obstacleFrame.x,
                    obstacleFrame.y,
                    obstacleFrame.w,
                    obstacleFrame.h,
                    obstacle[i].x,
                    obstacle[i].y,
                    obstacle[i].w,
                    obstacle[i].h
                )
                if(
                    horseRect.x < obstacleRect.x + obstacleRect.w&&
                    horseRect.x + horseRect.w > obstacleRect.x&&
                    horseRect.y < obstacleRect.y + obstacleRect.h&&
                    horseRect.y + horseRect.h > obstacleRect.y
                    
                ){
                    alert(`Game Over \n Your Score: ${score}`  )
                    cancelAnimationFrame(animation)
                    return 
                }
                 if (obstacle[i].x + obstacle[i].width < 0) {
                        obstacle.splice(i, 1)
                        i--
                     }
        }    
       
    }
    drawScore()
    requestAnimationFrame(animation)
}
    loadSpriteSheetData(gamMenu)
