let p1={}, com={}, counter=0;
//JSON
//JavaScripObjectNotation
const arrMonster = [
  {
    type: 'plant',
    name: 'Driger',
    src: 'profefts/planta.png',
    alt: 'Criptido de planta',
    calculate: {
      'plant': 1,
      'fire': 2,
      'water': .5,
    },
    hp: 20,
    damage: 10
  },
  {
    type: 'fire',
    name: 'Dranzer',
    src: 'profefts/fuego.png',
    alt: 'Criptido de fuego',
    calculate: {
      'plant': .5,
      'fire': 1,
      'water': 2,
    },
    hp: 20,
    damage: 10
  },
  {
    type: 'water',
    name: 'Dragoon',
    src: 'profefts/agua.png',
    alt: 'Criptido de agua',
    calculate: {
      'plant': 2,
      'fire': .5,
      'water': 1,
    },
    hp: 20,
    damage: 10
  }
]
 
function drawCharacter(ref,type='you'){
 
  const combatPanel = document.querySelector('#Combat')
 
  combatPanel.querySelector(`figure.${type} > img`).src = ref.src
  combatPanel.querySelector(`progress.${type}`).value = ref.hp
  combatPanel.querySelector(`span.${type}`).textContent= ref.name
 
  document.getElementById('counter').textContent = counter
}
 
function randCalc(max,min=0){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function randomCom(){
  const randIndex = randCalc(arrMonster.length-1)
  com = JSON.parse(JSON.stringify(arrMonster[randIndex]))
  drawCharacter(com,'computer')
}
 
function playCombat(){
  drawCharacter(p1, 'you')
  randomCom()
}
 
function loadCards(){
 
 
  const chosePanel = document.querySelector('section#choseUrCharacter')
  
  arrMonster.forEach(function (itm){
    const card = document.createElement('article')
    card.classList.add('Selection__Characters')
    card.classList.add(`Selection__Characters--${itm.type[0].toUpperCase()}${itm.type.slice(1)}`)
    card.append(document.createElement('img'))
    card.querySelector('img').src = itm.src
    card.querySelector('img').alt = itm.alt
    const strong = document.createElement('strong')
    strong.textContent = itm.name
    card.append(strong)
    card.addEventListener('click',()=>{
      p1 = JSON.parse(JSON.stringify(itm))
      chosePanel.style.display='none'
      document.querySelector('#Combat').style.display = 'grid'
      playCombat()
    })
    chosePanel.append(card)
  })
}
 
function replay(bash){
  // document.querySelector('#Combat').style.display='none'
  const li = document.createElement('li')
  li.append(document.createElement('button'))
  li.querySelector('button').textContent = 'Reiniciar'
  li.style.display = 'flex'
  li.style.justifyContent = 'flex-end'
  li.querySelector('button').addEventListener('click',()=>{
    debugger
    
    document.querySelector('section#Combat').style.removeProperty('display')
    document.querySelector('section#choseUrCharacter').style.removeProperty('display')
    p1=com={}
    counter = 0;
  });
  bash.append(li)
}
 
function win(bash){
  const li = document.createElement('li')
  li.textContent = `Victoria a ${p1.name} y a ti`
  bash.append(li)
  replay(bash)
}
function empat(bash){
  const li = document.createElement('li')
  li.textContent = `Empate`
  bash.append(li)
  replay(bash)
}
function lost(bash){
  const li = document.createElement('li')
  li.textContent = `Derrota a manos de ${com.name}`
  bash.append(li)
  replay(bash)
}
 
function combat(event){
  
  const keypad = document.querySelector('#Combat #keypad')
  keypad.style.display = 'none'
  const bash = document.querySelector('#Combat #bash_list')
  bash.style.display = 'block'
  const urAtk = event.target.value
  const cmAtk = arrMonster?.[randCalc(arrMonster.length-1,-1)]?.type??'cure'
  const urDmg = -1*(p1.calculate?.[cmAtk]??0)*10
  const urCure = (cmAtk==='cure'?10:0)*(cmAtk===p1.type?2:1)
  
  let li = document.createElement('li')
  li.style.setProperty('--user', `'its@${p1.name}:~$ '`)
  if(urCure){
    li.textContent = `Se curo ${urCure}hp`
  } else {
    li.textContent = `Ataco con ${urAtk} haciendo ${-1*urDmg}hp`
  }
  bash.append(li)
 
  const cmDmg = -1*(com.calculate?.[urAtk]??0)*10
  const cmCure = (urAtk==='cure'?10:0)*(urAtk===com.type?2:1)
 
  li = document.createElement('li')
  li.style.setProperty('--user', `'your@${p1.name}:~$ '`)
  if(cmCure){
    li.textContent = `Se curo ${cmCure}hp`
  } else {
    li.textContent = `Ataco con ${cmAtk} haciendo ${-1*cmDmg}hp`
  }
  bash.append(li)
  com.hp = Math.min(20,Math.max(com.hp+cmDmg+cmCure,0))
  p1.hp = Math.min(20,Math.max(p1.hp+urDmg+urCure,0))
  
  drawCharacter(com,'computer')
  drawCharacter(p1, 'you')
  
  const timerReplay = (cb)=>{
    setTimeout(()=>{
      keypad.style.removeProperty('display')
      bash.style.removeProperty('display')
      // bash.innerHTML = ''
      if(cb){
        const li = document.createElement('li')
        li.textContent = `Derrotaste a ${com.name}`
        bash.append(li)
        cb(bash)
      }
    },5000)
  }
  if(p1.hp>com.hp && com.hp===0){
    (++counter==100)?win(bash):timerReplay(playCombat)
  } else if(p1.hp===0){
    if(p1.hp===com.hp){
      debugger
      empat(bash)
    } else {
      debugger
      lost(bash)
    }
  } else{
    debugger
    timerReplay(null)
  }
 
}
 
 
 
window.addEventListener('load',loadCards)